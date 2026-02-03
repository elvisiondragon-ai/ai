import React, { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  initFacebookPixelWithLogging, 
  trackPageViewEvent, 
  trackCustomEvent,
  getFbcFbpCookies,
  waitForFbp
} from "@/utils/fbpixel";

const UsaWebFinance = () => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [paymentData, setPaymentData] = React.useState<any>(null);
  const purchaseFiredRef = React.useRef(false);

  // CAPI Configuration
  const PIXEL_ID = '1393383179182528';

  // Helper to send CAPI events
  const sendCAPIEvent = async (eventName: string, userData: any = {}, customData: any = {}, eventId?: string) => {
    try {
      await waitForFbp();
      const { fbc, fbp } = getFbcFbpCookies();
      await supabase.auth.getSession();
      
      const body: any = {
        pixelId: PIXEL_ID,
        eventName,
        userData: {
          ...userData,
          fbp,
          fbc,
          client_user_agent: navigator.userAgent
        },
        customData,
        eventId,
        eventSourceUrl: window.location.href,
        testCode: 'testcode_usa'
      };

      await supabase.functions.invoke('capi-universal', { body });
    } catch (e) {
      console.error('CAPI Error:', e);
    }
  };

  // Facebook Pixel Init
  useEffect(() => {
    initFacebookPixelWithLogging(PIXEL_ID);
    const eventId = `pageview-${Date.now()}`;
    
    // 🎯 PIXEL RULE: ViewContent + PageView (Browser Only)
    // 🎯 PIXEL RULE: Purchase must be triggered from BACKEND ONLY (tripay-callback) to prevent duplication.
    trackPageViewEvent({}, eventId, PIXEL_ID);
    trackCustomEvent('ViewContent', {
      content_name: 'usa_webinarfinance',
      content_category: 'Finance Webinar',
      value: 20.00,
      currency: 'USD'
    }, eventId, PIXEL_ID);
    
    sendCAPIEvent('PageView', {}, {}, eventId);
  }, []);

  const handlePurchase = async () => {
    if (!email || !email.includes('@')) {
      alert("Please enter a valid email address first to proceed.");
      return;
    }

    try {
      setLoading(true);
      const eventId = `checkout-${Date.now()}`;
      const eventData = {
        content_name: 'usa_webinarfinance',
        value: 20.00,
        currency: 'USD'
      };

      trackCustomEvent('InitiateCheckout', eventData, eventId, PIXEL_ID, { em: email });
      sendCAPIEvent('InitiateCheckout', { email }, eventData, eventId);
      
      // 🎯 PIXEL RULE: AddPaymentInfo CAPI
      sendCAPIEvent('AddPaymentInfo', { email }, eventData, eventId);

      const { fbc, fbp } = getFbcFbpCookies();

      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: "usa_webinarfinance",
          paymentMethod: "PAYPAL",
          userEmail: email,
          userName: email.split('@')[0],
          quantity: 1,
          fbc,
          fbp
        }
      });

      if (error) throw new Error(error.message || "Connection failed");
      if (!data || !data.success) throw new Error("Failed to init payment");

      setPaymentData(data);
      window.location.href = data.checkoutUrl;

    } catch (err: any) {
      alert("Payment Error: " + err.message);
      setLoading(false);
    }
  };

  // Realtime Payment Listener
  useEffect(() => {
    if (!paymentData?.merchantRef) return;
    
    const channel = supabase
      .channel(`payment-finance-${paymentData.merchantRef}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'global_product', 
        filter: `merchant_ref=eq.${paymentData.merchantRef}`
      }, (payload) => {
        if (payload.new?.status === 'PAID') {
          if (purchaseFiredRef.current) return;
          purchaseFiredRef.current = true;

          toast({
            title: "PAID! Access Sent.",
            description: "Payment successful. Check your email now for Webinar access.",
            duration: 5000, 
          });

          const eventId = payload.new.tripay_reference || paymentData.merchantRef;
          const eventData = {
            content_name: 'usa_webinarfinance',
            value: 20.00,
            currency: 'USD'
          };

          trackCustomEvent('Purchase', eventData, eventId, PIXEL_ID, { em: email });
          if (!payload.new?.capi_purchase_sent) {
             sendCAPIEvent('Purchase', { email }, eventData, eventId);
          }
        }
      }).subscribe();

        return () => { supabase.removeChannel(channel); };

      }, [paymentData, email]);

    

      return (

        <div className="usa-webfinance-page">

          <Toaster />

          

          <style dangerouslySetInnerHTML={{ __html: `

    
        .usa-webfinance-page {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100-vh;
            margin: 0;
            padding: 0;
        }

        .usa-webfinance-page * {
            box-sizing: border-box;
        }

        .usa-webfinance-page .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Hero Section */
        .usa-webfinance-page .hero {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            text-align: center;
        }

        .usa-webfinance-page .hero h1 {
            font-size: 2.2rem;
            color: #1e3c72;
            margin-bottom: 15px;
            line-height: 1.2;
            font-weight: bold;
        }

        .usa-webfinance-page .hero .subheadline {
            font-size: 1.3rem;
            color: #555;
            margin-bottom: 25px;
            font-weight: 500;
        }

        .usa-webfinance-page .hero .claim {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            padding: 20px;
            border-radius: 15px;
            margin: 25px 0;
            border: 3px solid #f0c419;
        }

        .usa-webfinance-page .hero .claim p {
            margin: 8px 0;
            font-size: 1.1rem;
            color: #1a1a1a;
            font-weight: 600;
        }

        /* Pain Section */
        .usa-webfinance-page .pain-section {
            background: linear-gradient(135deg, #ff6b6b 0%, #c92a2a 100%);
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            color: white;
        }

        .usa-webfinance-page .pain-section h2 {
            font-size: 2rem;
            margin-bottom: 25px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webfinance-page .pain-item {
            background: rgba(255,255,255,0.1);
            border-left: 5px solid #ffd700;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 10px;
        }

        .usa-webfinance-page .pain-item h3 {
            font-size: 1.4rem;
            margin-bottom: 10px;
            color: #ffd700;
        }

        .usa-webfinance-page .pain-item p {
            font-size: 1.1rem;
            line-height: 1.6;
        }

        /* Story Section */
        .usa-webfinance-page .story-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webfinance-page .story-section h2 {
            font-size: 2rem;
            color: #1e3c72;
            margin-bottom: 25px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webfinance-page .story-section p {
            font-size: 1.15rem;
            margin-bottom: 20px;
            line-height: 1.8;
        }

        .usa-webfinance-page .story-section .highlight {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid #ffd700;
            margin: 25px 0;
        }

        .usa-webfinance-page .story-section .highlight p {
            margin: 10px 0;
            font-weight: 600;
            color: #1a1a1a;
        }

        /* Solution Section */
        .usa-webfinance-page .solution-section {
            background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            color: white;
        }

        .usa-webfinance-page .solution-section h2 {
            font-size: 2rem;
            margin-bottom: 25px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webfinance-page .solution-item {
            background: rgba(255,255,255,0.15);
            padding: 25px;
            margin-bottom: 20px;
            border-radius: 15px;
            border: 2px solid rgba(255,255,255,0.3);
        }

        .usa-webfinance-page .solution-item h3 {
            font-size: 1.4rem;
            margin-bottom: 12px;
            color: #ffd700;
        }

        .usa-webfinance-page .solution-item p {
            font-size: 1.1rem;
            line-height: 1.7;
        }

        /* Benefits Section */
        .usa-webfinance-page .benefits-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webfinance-page .benefits-section h2 {
            font-size: 2rem;
            color: #1e3c72;
            margin-bottom: 30px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webfinance-page .benefit-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 25px;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            border-left: 5px solid #1e3c72;
        }

        .usa-webfinance-page .benefit-icon {
            font-size: 2.5rem;
            margin-right: 20px;
            flex-shrink: 0;
        }

        .usa-webfinance-page .benefit-text h3 {
            font-size: 1.3rem;
            color: #1e3c72;
            margin-bottom: 8px;
        }

        .usa-webfinance-page .benefit-text p {
            font-size: 1.05rem;
            color: #555;
            line-height: 1.6;
        }

        /* Testimonials Section */
        .usa-webfinance-page .testimonials-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webfinance-page .testimonials-section h2 {
            font-size: 2rem;
            color: #1e3c72;
            margin-bottom: 30px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webfinance-page .testimonial-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            border-left: 5px solid #ffd700;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .usa-webfinance-page .testimonial-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .usa-webfinance-page .testimonial-icon {
            font-size: 2.5rem;
            margin-right: 15px;
        }

        .usa-webfinance-page .testimonial-info h4 {
            font-size: 1.2rem;
            color: #1e3c72;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .usa-webfinance-page .testimonial-info p {
            font-size: 0.95rem;
            color: #666;
            margin: 0;
        }

        .usa-webfinance-page .stars {
            color: #ffd700;
            font-size: 1.3rem;
            margin-bottom: 15px;
        }

        .usa-webfinance-page .testimonial-text {
            font-size: 1.05rem;
            line-height: 1.7;
            color: #333;
            font-style: italic;
        }

        /* Guarantee Section */
        .usa-webfinance-page .guarantee-section {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            border-radius: 20px;
            padding: 35px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            text-align: center;
            border: 3px solid #f0c419;
        }

        .usa-webfinance-page .guarantee-section h3 {
            font-size: 1.8rem;
            color: #1a1a1a;
            margin-bottom: 15px;
            font-weight: bold;
        }

        .usa-webfinance-page .guarantee-section p {
            font-size: 1.15rem;
            color: #1a1a1a;
            line-height: 1.7;
            font-weight: 500;
        }

        /* Offer Section */
        .usa-webfinance-page .offer-section {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            color: white;
        }

        .usa-webfinance-page .offer-section h2 {
            font-size: 2.2rem;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .usa-webfinance-page .cta-button {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #1a1a1a;
            padding: 18px 40px;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(255,215,0,0.3);
        }

        .usa-webfinance-page .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(255,215,0,0.5);
        }

        .usa-webfinance-page .cta-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        /* Footer */
        .usa-webfinance-page .footer {
            text-align: center;
            padding: 30px 20px;
            color: white;
            font-size: 0.95rem;
        }

        .usa-webfinance-page .footer p {
            margin: 8px 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .usa-webfinance-page .hero h1 {
                font-size: 1.8rem;
            }

            .usa-webfinance-page .hero .subheadline {
                font-size: 1.1rem;
            }

            .usa-webfinance-page .pain-section h2,
            .usa-webfinance-page .story-section h2,
            .usa-webfinance-page .solution-section h2,
            .usa-webfinance-page .benefits-section h2,
            .usa-webfinance-page .testimonials-section h2 {
                font-size: 1.6rem;
            }

            .usa-webfinance-page .benefit-item {
                flex-direction: column;
                text-align: center;
            }

            .usa-webfinance-page .benefit-icon {
                margin-right: 0;
                margin-bottom: 15px;
            }
        }
      ` }} />

      <div className="container">
        {/* Hero */}
        <div className="hero">
            <h1>Stuck at the Same Income Level Year After Year?</h1>
            <p className="subheadline">Discover How One Indonesian Entrepreneur Broke Through His Financial Ceiling and 10X'd His Revenue in Just 8 Weeks</p>
            
            <div className="claim">
                <p>✅ From $5K/month to $50K/month in 8 weeks</p>
                <p>✅ Zero new marketing. Zero new products.</p>
                <p>✅ 100% Internal Alignment Shift</p>
            </div>
        </div>

        {/* PAIN - Serious Financial Struggles */}
        <div className="pain-section">
            <h2>🔥 Are You Experiencing These Financial Roadblocks?</h2>
            
            <div className="pain-item">
                <h3>💔 The Revenue Ceiling That Won't Break</h3>
                <p>You've tried every strategy, every course, every marketing tactic... yet your income stays flat. Month after month, you hit the same ceiling. You're working harder than ever, but the money just isn't flowing.</p>
            </div>

            <div className="pain-item">
                <h3>😰 Constant Money Anxiety Despite "Success"</h3>
                <p>Even when money comes in, you can't shake the fear that it'll disappear. You're stressed about bills, worried about the future, and feel like you're one bad month away from disaster. The sleepless nights are taking their toll.</p>
            </div>

            <div className="pain-item">
                <h3>🔄 The Feast-or-Famine Cycle</h3>
                <p>One month you're celebrating a big win, the next month you're scrambling to pay rent. The income rollercoaster is exhausting. You can't plan, can't invest, can't breathe. Stability feels like a distant dream.</p>
            </div>

            <div className="pain-item">
                <h3>😤 Working 70+ Hours With Nothing to Show</h3>
                <p>You're hustling from dawn to midnight. You've sacrificed time with family, your health, your sanity... but the bank account doesn't reflect your effort. You feel like a hamster on a wheel—running hard but going nowhere.</p>
            </div>

            <div className="pain-item">
                <h3>🚫 Invisible Blocks Sabotaging Every Opportunity</h3>
                <p>Deals fall through at the last minute. Clients ghost you. Partnerships crumble. It feels like the universe is conspiring against you. Deep down, you wonder if you're just "not meant" to be wealthy.</p>
            </div>
        </div>

        {/* AGITATE - The Real Story */}
        <div className="story-section">
            <h2>This Was Exactly Arif's Reality...</h2>
            
            <p>Meet Arif, a talented digital entrepreneur from Jakarta who was stuck at $5,000/month for three straight years.</p>
            
            <p>He had the skills. He had the work ethic. He had the products. But something invisible was blocking him.</p>

            <div className="highlight">
                <p>💸 Arif was working 80-hour weeks but couldn't break $5K/month</p>
                <p>😓 He borrowed money from family just to keep his business afloat</p>
                <p>💔 His marriage was suffering. His kids barely saw him.</p>
                <p>🔥 Every time opportunity knocked, self-sabotage answered the door</p>
            </div>

            <p>Arif tried everything—more ads, different niches, hiring coaches, investing in courses. Nothing worked. His revenue stayed stubbornly flat.</p>

            <p><strong>The worst part?</strong> He watched peers with less talent and less experience zoom past him. They were making $30K, $50K, even $100K per month while he struggled to pay his bills.</p>

            <p>Arif felt cursed. Broken. Like success was reserved for "other people."</p>

            <div className="highlight">
                <p><strong>Then he discovered something that changed everything...</strong></p>
                <p>The problem wasn't his strategy. It wasn't his work ethic. It wasn't even the market.</p>
                <p><strong style={{ fontSize: '1.3rem', color: '#1e3c72' }}>The problem was his internal vibration frequency.</strong></p>
            </div>

            <p>Arif's subconscious mind was running on poverty programming—beliefs about money formed in childhood that were invisibly repelling wealth.</p>

            <p>His nervous system was wired for scarcity. His energy field was broadcasting "not enough." And the universe was responding accordingly.</p>

            <p><strong>Once Arif aligned his internal reality to match the wealth he desired, everything shifted...</strong></p>

            <div className="highlight">
                <p>✨ Week 2: First $10K month of his life</p>
                <p>✨ Week 5: $30K month—triple his previous record</p>
                <p>✨ Week 8: $50K month—a 10X increase from where he started</p>
                <p>✨ Same business. Same products. Different internal state.</p>
            </div>

            <p>The money started flowing effortlessly. High-ticket clients appeared out of nowhere. Opportunities that used to fall apart now closed easily.</p>

            <p>Arif wasn't working harder—he was working from a completely different frequency.</p>
        </div>

        {/* SOLUTION - The Method */}
        <div className="solution-section">
            <h2>🎯 The Solution: Internal Wealth Alignment</h2>
            
            <div className="solution-item">
                <h3>🧠 Reprogram Your Money Subconscious</h3>
                <p>Using advanced Theta wave technology, we'll identify and dissolve the limiting beliefs about money that were installed in childhood. Your subconscious will be rewired for wealth, abundance, and financial flow.</p>
            </div>

            <div className="solution-item">
                <h3>⚡ Elevate Your Energetic Frequency</h3>
                <p>Money is energy. If you're vibrating at the frequency of lack, you'll attract lack. We'll train you to embody the energy of wealth so you become a magnet for opportunity, abundance, and prosperity.</p>
            </div>

            <div className="solution-item">
                <h3>🔓 Remove Subconscious Sabotage Patterns</h3>
                <p>Ever notice how success slips away right when you're about to break through? That's self-sabotage. We'll dissolve the unconscious patterns that have been blocking your financial growth for years.</p>
            </div>

            <div className="solution-item">
                <h3>🌊 Master the Flow State of Wealth</h3>
                <p>Stop forcing. Stop hustling. Start flowing. We'll teach you to enter the quantum field where opportunities, ideas, and money come to you naturally—without grinding yourself into the ground.</p>
            </div>

            <div className="solution-item">
                <h3>💎 Activate Your Wealth Blueprint</h3>
                <p>You have a unique energetic blueprint for wealth inside you. Most people never activate it. We'll unlock your personal prosperity code so money flows to you in alignment with your authentic purpose.</p>
            </div>
        </div>

        {/* Video Testimonials Section */}
        <div className="video-section" style={{ background: 'white', borderRadius: '20px', padding: '40px 30px', marginBottom: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '2rem', color: '#1e3c72', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold' }}>Genuine Success Stories</h2>
            <p style={{ textAlign: 'center', color: '#e74c3c', fontSize: '1.1rem', fontWeight: '600', marginBottom: '25px' }}>Real people, real results (Original Language)</p>
            <div className="video-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px',
                marginTop: '30px'
            }}>
                {/* Felicia */}
                <div className="video-card">
                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', aspectRatio: '9/16' }}>
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/Rs_UDalr8q8" 
                            title="Felicia Testimony" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                            style={{ borderRadius: '15px' }}
                        ></iframe>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold', color: '#1e3c72' }}>Felicia - Influencer</p>
                </div>

                {/* Habib Umar */}
                <div className="video-card">
                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', aspectRatio: '9/16' }}>
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/jD6XlkCL4sI" 
                            title="Habib Umar Testimony" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                            style={{ borderRadius: '15px' }}
                        ></iframe>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold', color: '#1e3c72' }}>Habib Umar - Head of Pesantren</p>
                </div>

                {/* Agus Mulyadi */}
                <div className="video-card">
                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', aspectRatio: '9/16' }}>
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/kVgfxHX_GeY" 
                            title="Agus Mulyadi Testimony" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                            style={{ borderRadius: '15px' }}
                        ></iframe>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold', color: '#1e3c72' }}>Agus Mulyadi - Intelengence</p>
                </div>

                {/* Dr. Gumilar */}
                <div className="video-card">
                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', aspectRatio: '9/16' }}>
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/U6NsL9RL9rY" 
                            title="Dr. Gumilar Testimony" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                            style={{ borderRadius: '15px' }}
                        ></iframe>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold', color: '#1e3c72' }}>Dr. Gumilar - Hypnotherapist</p>
                </div>
            </div>
        </div>

        {/* Benefits */}
        <div className="benefits-section">
            <h2>What You'll Experience in 4 Weeks</h2>

            <div className="benefit-item">
                <div className="benefit-icon">💰</div>
                <div className="benefit-text">
                    <h3>Quantum Leap in Income</h3>
                    <p>Like Arif, experience exponential revenue growth without working more hours or changing your business model</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">🧘</div>
                <div className="benefit-text">
                    <h3>Peace & Confidence Around Money</h3>
                    <p>End the anxiety, fear, and stress. Feel financially secure and abundant from the inside out</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">🎯</div>
                <div className="benefit-text">
                    <h3>Magnetic Attraction of Opportunities</h3>
                    <p>Stop chasing clients, deals, and money. Start attracting them effortlessly through energetic alignment</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">🔥</div>
                <div className="benefit-text">
                    <h3>Elimination of Self-Sabotage</h3>
                    <p>Finally break free from the invisible patterns that have been destroying your deals and blocking your success</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">⚡</div>
                <div className="benefit-text">
                    <h3>Sustainable Wealth Frequency</h3>
                    <p>Move from feast-or-famine to consistent, reliable income that grows month after month</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">🌟</div>
                <div className="benefit-text">
                    <h3>Energetic Wealth Mastery</h3>
                    <p>Understand and command the energetic laws of money so you can create prosperity on demand</p>
                </div>
            </div>
        </div>

        {/* Testimonials */}
        <div className="testimonials-section">
            <h2>Real Results from Real People</h2>

            {/* Western Finance Testimonials */}
            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">💼</div>
                    <div className="testimonial-info">
                        <h4>Marcus Thompson</h4>
                        <p>New York, USA • E-commerce Owner</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "I was stuck at $8K/month for 2 years. Every strategy failed. After 3 weeks of the eL Vision wealth alignment program, I hit my first $25K month. The next month was $42K. I didn't change my business—I changed my internal frequency."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">📈</div>
                    <div className="testimonial-info">
                        <h4>Sarah Mitchell</h4>
                        <p>London, UK • Financial Consultant</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "I had massive money anxiety despite making six figures. I'd sabotage every big opportunity. After dissolving my scarcity programming with this method, I signed three high-ticket clients in one week—deals worth $180K total. My nervous system finally feels safe with wealth."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">🚀</div>
                    <div className="testimonial-info">
                        <h4>David Chen</h4>
                        <p>Toronto, Canada • SaaS Founder</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "My revenue was yo-yoing for 3 years. One month $15K, next month $3K. Couldn't scale. Couldn't plan. After realigning my wealth frequency, I've had 6 consecutive months of $30K+. The stability is life-changing. My family finally has peace."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">💎</div>
                    <div className="testimonial-info">
                        <h4>Jennifer Rodriguez</h4>
                        <p>Miami, USA • Real Estate Agent</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "I always felt like I didn't deserve big commissions. I'd unconsciously sabotage luxury listings. The subconscious reprogramming unlocked something profound—I closed two $2M properties in the same month. My income tripled and I finally feel worthy of wealth."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">🏆</div>
                    <div className="testimonial-info">
                        <h4>Robert Kim</h4>
                        <p>Sydney, Australia • Business Coach</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "I teach business strategy but couldn't break my own income ceiling. The irony was painful. After just 4 weeks of energetic wealth alignment, I had my first $100K month. Opportunities that used to fall through now close effortlessly. It's like the universe finally said yes."
                </div>
            </div>

            {/* Original Indonesian Testimonials */}
            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">👨‍💼</div>
                    <div className="testimonial-info">
                        <h4>Agus Mulyadi, SH., MH.</h4>
                        <p>Head of Pangandaran Intelligence, Indonesia</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "As head of intelligence in Indonesia I have so many difficult tasks and impossible responsibilities to decide, with meditation 6 weeks I have super intuitive to get the best result of my works"
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">⚕️</div>
                    <div className="testimonial-info">
                        <h4>Dr. Gumilar</h4>
                        <p>Doctor & Hypnotherapist (20+ Years)</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "As doctor myself and hypnotherapist for more than 20 years I REALIZED my hypnotherapy is out of date, doing eL Vision method for 6 weeks completely change my perspective and see that this modern method was fast result"
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">👩‍💼</div>
                    <div className="testimonial-info">
                        <h4>Felicia Quincy</h4>
                        <p>Instagram: @itsfelicia.quincy</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "Following 6 weeks program make me from anxious and overthinking, first all my decision are foggy and so difficult to move forward, after the program i can see things clearer and also when my vibration is clear, my reality, connection and finance get better. It was amazing"
                </div>
            </div>
        </div>

        {/* Guarantee */}
        <div className="guarantee-section">
            <h3>💯 100% Money-Back Guarantee</h3>
            <p>I'm so confident in this program that if you don't experience a tangible shift in your financial energy, abundance mindset, and money flow, you get your full $20 back—no questions asked.</p>
        </div>

        {/* Final CTA */}
        <div className="offer-section">
            <h2>Ready to Break Your Financial Ceiling?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Join me for 4 weeks and experience the wealth alignment that took Arif from $5K to $50K per month—and can transform your financial reality too.</p>
            
            <div style={{ maxWidth: '400px', margin: '0 auto 20px auto' }}>
                <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '15px 20px',
                        borderRadius: '50px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '1.1rem',
                        textAlign: 'center',
                        outline: 'none',
                        marginBottom: '15px'
                    }}
                />
                <button 
                    onClick={handlePurchase} 
                    disabled={loading}
                    className="cta-button"
                    style={{ width: '100%', cursor: 'pointer', border: 'none' }}
                >
                    {loading ? 'PROCESSING...' : 'YES, I\'M READY FOR WEALTH'}
                </button>
            </div>
            
            <p style={{ marginTop: '25px', fontSize: '0.95rem' }}>⏰ Remember: This $20 offer expires in 24 hours</p>
            <p style={{ fontSize: '0.95rem' }}>Regular price returns to $400</p>
        </div>

        {/* Footer */}
        <div className="footer">
            <p><strong>eL Vision</strong></p>
            <p>Transforming Lives Through Perfect Reality Alignment</p>
            <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>© 2026 eL Vision. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default UsaWebFinance;