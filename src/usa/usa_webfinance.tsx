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

  // CAPI Configuration (IDENTICAL)
  const PIXEL_ID = '1393383179182528';

  // Helper to send CAPI events
  const sendCAPIEvent = async (eventName: string, userData: any = {}, customData: any = {}, eventId?: string) => {
    try {
      await waitForFbp();
      const { fbc, fbp } = getFbcFbpCookies();
      
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
    
    // 🎯 PIXEL RULE: ViewContent + PageView
    trackPageViewEvent({}, eventId, PIXEL_ID);
    trackCustomEvent('ViewContent', {
      content_name: 'usa_webinar20',
      content_category: 'Finance Webinar',
      value: 20.00,
      currency: 'USD'
    }, eventId, PIXEL_ID);
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
        content_name: 'usa_webinar20',
        value: 20.00,
        currency: 'USD'
      };

      trackCustomEvent('InitiateCheckout', eventData, eventId, PIXEL_ID, { em: email });
      
      // 🎯 PIXEL RULE: AddPaymentInfo CAPI
      sendCAPIEvent('AddPaymentInfo', { email }, eventData, eventId);

      const { fbc, fbp } = getFbcFbpCookies();

      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: "usa_webinar20",
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

        .usa-webfinance-page .hero .subheading {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 25px;
        }

        .usa-webfinance-page .highlight {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
        }

        /* Video Testimonial Section */
        .usa-webfinance-page .video-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webfinance-page .video-section h2 {
            font-size: 1.8rem;
            color: #1e3c72;
            margin-bottom: 10px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webfinance-page .video-section .subtitle {
            text-align: center;
            color: #e74c3c;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 25px;
        }

        .usa-webfinance-page .video-container {
            position: relative;
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .usa-webfinance-page .video-container video {
            width: 100%;
            display: block;
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
            font-size: 1.8rem;
            color: #1e3c72;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .usa-webfinance-page .story-section p {
            font-size: 1.05rem;
            margin-bottom: 15px;
            color: #333;
            line-height: 1.8;
        }

        .usa-webfinance-page .story-highlight {
            background: #f0f4ff;
            padding: 20px;
            border-left: 4px solid #1e3c72;
            margin: 20px 0;
            border-radius: 8px;
        }

        /* Offer Section */
        .usa-webfinance-page .offer-section {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            color: white;
            text-align: center;
        }

        .usa-webfinance-page .offer-section h2 {
            font-size: 2rem;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .usa-webfinance-page .price-container {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            margin: 25px 0;
        }

        .usa-webfinance-page .original-price {
            font-size: 1.5rem;
            text-decoration: line-through;
            opacity: 0.7;
            margin-bottom: 10px;
        }

        .usa-webfinance-page .current-price {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .usa-webfinance-page .price-detail {
            font-size: 1.2rem;
            margin-bottom: 5px;
        }

        .usa-webfinance-page .countdown {
            background: #ffd700;
            color: #1a1a1a;
            padding: 15px;
            border-radius: 10px;
            font-size: 1.3rem;
            font-weight: 700;
            margin: 20px 0;
        }

        /* CTA Button */
        .usa-webfinance-page .cta-button {
            display: inline-block;
            background: white;
            color: #1e3c72;
            padding: 18px 50px;
            font-size: 1.3rem;
            font-weight: 700;
            border-radius: 50px;
            text-decoration: none;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            margin-top: 20px;
        }

        .usa-webfinance-page .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
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
            font-size: 1.8rem;
            color: #1e3c72;
            margin-bottom: 25px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webfinance-page .benefit-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9ff;
            border-radius: 10px;
        }

        .usa-webfinance-page .benefit-icon {
            font-size: 2rem;
            margin-right: 15px;
            flex-shrink: 0;
        }

        .usa-webfinance-page .benefit-text h3 {
            color: #1e3c72;
            margin-bottom: 5px;
            font-size: 1.2rem;
            font-weight: bold;
        }

        .usa-webfinance-page .benefit-text p {
            color: #666;
            font-size: 1rem;
        }

        /* Testimonials Grid */
        .usa-webfinance-page .testimonials-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webfinance-page .testimonials-section h2 {
            font-size: 1.8rem;
            color: #1e3c72;
            margin-bottom: 25px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webfinance-page .testimonial-card {
            background: #f8f9ff;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 20px;
            border-left: 4px solid #1e3c72;
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
            color: #1e3c72;
            margin-bottom: 3px;
            font-size: 1.1rem;
            font-weight: bold;
        }

        .usa-webfinance-page .testimonial-info p {
            color: #666;
            font-size: 0.9rem;
        }

        .usa-webfinance-page .testimonial-text {
            color: #333;
            font-size: 1rem;
            line-height: 1.6;
            font-style: italic;
        }

        .usa-webfinance-page .stars {
            color: #f39c12;
            margin-bottom: 10px;
        }

        /* Guarantee Section */
        .usa-webfinance-page .guarantee-section {
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            color: white;
            text-align: center;
        }

        .usa-webfinance-page .guarantee-section h3 {
            font-size: 1.8rem;
            margin-bottom: 15px;
            font-weight: bold;
        }

        /* Footer */
        .usa-webfinance-page .footer {
            text-align: center;
            color: white;
            padding: 30px;
        }

        .usa-webfinance-page .footer p {
            margin-bottom: 10px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .usa-webfinance-page .hero h1 {
                font-size: 1.6rem;
            }

            .usa-webfinance-page .hero .subheading {
                font-size: 1rem;
            }

            .usa-webfinance-page .video-section h2,
            .usa-webfinance-page .story-section h2,
            .usa-webfinance-page .benefits-section h2,
            .usa-webfinance-page .testimonials-section h2 {
                font-size: 1.5rem;
            }

            .usa-webfinance-page .current-price {
                font-size: 2.2rem;
            }

            .usa-webfinance-page .cta-button {
                padding: 15px 35px;
                font-size: 1.1rem;
            }

            .usa-webfinance-page .container {
                padding: 15px;
            }

            .usa-webfinance-page .hero,
            .usa-webfinance-page .video-section,
            .usa-webfinance-page .story-section,
            .usa-webfinance-page .offer-section,
            .usa-webfinance-page .benefits-section,
            .usa-webfinance-page .testimonials-section,
            .usa-webfinance-page .guarantee-section {
                padding: 25px 20px;
                margin-bottom: 20px;
            }
        }

        @media (max-width: 480px) {
            .usa-webfinance-page .hero h1 {
                font-size: 1.4rem;
            }

            .usa-webfinance-page .current-price {
                font-size: 2rem;
            }

            .usa-webfinance-page .benefit-item {
                flex-direction: column;
            }

            .usa-webfinance-page .benefit-icon {
                margin-bottom: 10px;
            }
        }
      ` }} />
      <div className="container">
        {/* Hero Section */}
        <div className="hero">
            <h1>From Financial Stagnation to <span className="highlight">Unstoppable Wealth</span></h1>
            <p className="subheading">Discover why "working harder" is keeping you poor, and how to align your subconscious for effortless abundance.</p>
        </div>

        {/* Story Section */}
        <div className="story-section">
            <h2>Hi, I'm eL Reyzandra</h2>
            <p>I've been <strong>obsessed with mind power</strong> for 16 years. Why? Because I used to be broke, desperate, and stuck.</p>
            
            <p>When I first tried "The Secret" and the Law of Attraction to get rich, it didn't just fail—<strong>it backfired spectacularly</strong>. I lost money, got into debt, and felt like a failure.</p>

            <div className="story-highlight">
                <p><strong>Affirmations don't pay the bills.</strong></p>
                <p>You can chant "I am rich" all day, but if your subconscious is screaming "I am afraid of poverty," you will only attract more lack. The real secret? <strong>Perfect Reality alignment</strong>—resetting your internal financial thermostat.</p>
            </div>

            <p>My specialty is creating what I call <span className="highlight"><strong>Perfect Reality</strong></span>—a state so deeply aligned that opportunities chase YOU. My clients include:</p>
            <ul style={{ marginLeft: '25px', marginTop: '15px', marginBottom: '15px', listStyleType: 'disc' }}>
                <li>National Intelligence Officers</li>
                <li>Foundation Leaders Managing Millions in Funds</li>
                <li>Doctors & Entrepreneurs</li>
                <li>CEOs of Major Corporations</li>
            </ul>

            <p>And now, I want to help you break through the invisible glass ceiling that is holding your income down.</p>
        </div>

        {/* Pain & Agitate & Solution Section (FINANCE FOCUSED) */}
        <div className="story-section" style={{ background: '#fff5f5', borderLeft: '6px solid #e74c3c' }}>
            <h2 style={{ color: '#c53030' }}>Why You Are Stuck Financially</h2>
            <p>Does this sound familiar? You work harder than everyone else. You take the courses. You try the side hustles. But at the end of the month, <strong>the money is gone</strong>.</p>
            
            <p>It’s agonizing to watch less talented, less hardworking people fly past you in their careers while you stay stuck in the same place, year after year.</p>

            <p>The truth is, your financial reality is not defined by the economy. It is defined by your <strong>Internal Wealth Frequency</strong>. If you carry a subconscious "Poverty Vow" or deep-seated guilt about money, you will subconsciously <strong>sabotage every opportunity</strong> that comes your way.</p>

            <div className="story-highlight" style={{ background: 'white', borderLeft: '4px solid #c53030' }}>
                <p><strong>The Proven Wealth Solution:</strong></p>
                <p>For the last 7 years, I have helped people delete these "poverty programs" from their mind. We don't teach you 'how to invest'—we teach you how to become the person who <strong>naturally attracts wealth</strong>. When you fix the frequency, the money follows.</p>
            </div>

            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', marginTop: '20px', color: '#c53030' }}>
                Join this transformation now before the global launch promo ends.
            </p>
        </div>

        {/* Who Is This For Section (FINANCE FOCUSED) */}
        <div className="story-section" style={{ background: '#f8fafc', borderLeft: '6px solid #1e3c72' }}>
            <h2 style={{ color: '#1e3c72' }}>Who Is This For?</h2>
            <p>Our program is designed for those who are tired of financial struggle and are ready to address the <strong>energetic and mental roots</strong> of their wealth blockage.</p>
            
            <p className="mb-4"><strong>Check which category you currently fall into:</strong></p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#1e3c72', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>📉 The Stagnant</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>You've been at the same income level for 5 years. No matter what you do, you can't break through the glass ceiling.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#1e3c72', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>💸 The Leaker</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>You make good money, but it disappears instantly on "emergencies" and unexpected bills. You can't keep what you earn.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#1e3c72', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>😰 The Anxious</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Checking your bank account gives you a panic attack. You live in constant fear of "running out."</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#1e3c72', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>📉 The Debtor</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>You are stuck in a cycle of borrowing to pay off other debts. You feel like you are drowning in obligation.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#1e3c72', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>🌫️ The Foggy</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>You have no idea what your purpose is. You jump from business idea to business idea, never finishing anything.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#1e3c72', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>🌪️ The Burnout</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>You believe you have to suffer to succeed. You are exhausted, overworked, and underpaid.</p>
                </div>
            </div>

            <p style={{ marginTop: '25px', fontStyle: 'italic', color: '#4a5568', textAlign: 'center' }}>
                "We don't just fix the bank balance; we fix the person managing it. When you become abundant inside, the reality reflects it."
            </p>
        </div>

        {/* FAQ Section */}
        <div className="story-section" style={{ background: '#f8fafc', borderTop: '4px solid #1e3c72' }}>
            <h2 style={{ color: '#1e3c72', textAlign: 'center', marginBottom: '30px' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#1e3c72', marginBottom: '10px' }}>Q: Is this a "get rich quick" scheme or financial advice?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#4a5568' }}><strong>A:</strong> Absolutely not. We don't tell you what stocks to buy. We fix the <em>source</em> of your financial patterns. If you have a subconscious "lack" mindset, no amount of money will stay with you. We help you become the version of yourself that naturally attracts and manages wealth.</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#1e3c72', marginBottom: '10px' }}>Q: I've tried manifestion before and it didn't work. Why is this different?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#4a5568' }}><strong>A:</strong> Manifestation fails when there is a "frequency gap." You want millions, but your subconscious is afraid of the responsibility or feels guilty about money. We use eL's unique "Perfect Reality" alignment to delete those hidden blocks in the Theta state so your desire and your subconscious are finally on the same page.</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#1e3c72', marginBottom: '10px' }}>Q: I'm deep in debt right now. Can I really afford this?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#4a5568' }}><strong>A:</strong> At $20, this is less than the cost of a single meal. The real question is: Can you afford to stay in the same financial loop for another year? This program is designed specifically to help you break the energetic cycle of debt and stagnation so you can start seeing a real ROI in your life.</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#1e3c72', marginBottom: '10px' }}>Q: Do I need to be a business owner for this to work?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#4a5568' }}><strong>A:</strong> No. Whether you are an employee looking for a promotion, a freelancer wanting higher-paying clients, or an entrepreneur scaling a company—the principles of wealth frequency are universal. When you change, your external reality (and your bank account) must adjust to match.</p>
                </div>
            </div>
        </div>

        {/* Limited Time Offer */}
        <div className="offer-section">
            <h2>🌟 Limited Time Global Launch Offer 🌟</h2>
            
            <div className="price-container">
                <div className="original-price">Regular: $400 (4 sessions × $100)</div>
                <div className="current-price">$20</div>
                <div className="price-detail">4 Weekly Sessions (30-45 minutes each)</div>
                <div className="price-detail">Just $5 per wealth-aligning session</div>
            </div>

            <div className="countdown">
                ⏰ THIS PRICE ENDS IN 24 HOURS ⏰
            </div>

            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Invest in your mindset for less than the cost of a pizza. This is the best ROI you will find this year.</p>
            
            <div id="register" style={{ maxWidth: '400px', margin: '0 auto 20px auto' }}>
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
                    {loading ? 'PROCESSING...' : 'SECURE MY SPOT NOW'}
                </button>
            </div>
            
            <p style={{ marginTop: '20px', fontSize: '0.95rem' }}>✅ 100% Money-Back Guarantee</p>
        </div>

        {/* Video Testimonials Section - IDENTICAL FILES AS REQUESTED */}
        <div className="video-section">
            <h2>Genuine Success Stories</h2>
            <p className="subtitle">Real people, real results (Original Language)</p>
            <div className="video-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px',
                marginTop: '30px'
            }}>
                {/* Arif - Miraculous Proof */}
                <div className="video-card">
                    <div className="video-container" style={{ aspectRatio: '9/16' }}>
                        <video controls poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/usa_arif1.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' }}>
                            <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/usa_arif1.mp4" type="video/mp4" />
                        </video>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>Arif - Stage 4 Recovery</p>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', padding: '0 10px' }}>Proof: If alignment can heal brain cancer, it can easily fix your financial frequency.</p>
                </div>

                {/* English Interview - Science */}
                <div className="video-card">
                    <div className="video-container" style={{ aspectRatio: '9/16' }}>
                        <video controls poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/arif_interview_en.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' }}>
                            <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/arif_interview_en.mp4" type="video/mp4" />
                        </video>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>The Science of Alignment</p>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', padding: '0 10px' }}>Full Interview (English): Deep dive into the "Perfect Reality" method.</p>
                </div>

                {/* Felicia */}
                <div className="video-card">
                    <div className="video-container" style={{ aspectRatio: '9/16' }}>
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
                    <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>Felicia - Influencer</p>
                </div>

                {/* Habib Umar */}
                <div className="video-card">
                    <div className="video-container" style={{ aspectRatio: '9/16' }}>
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
                    <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>Habib Umar - Head of Pesantren</p>
                </div>

                {/* Agus Mulyadi */}
                <div className="video-card">
                    <div className="video-container" style={{ aspectRatio: '9/16' }}>
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
                    <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>Agus Mulyadi - Intelengence</p>
                </div>

                {/* Dr. Gumilar */}
                <div className="video-card">
                    <div className="video-container" style={{ aspectRatio: '9/16' }}>
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
                    <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>Dr. Gumilar - Hypnotherapist</p>
                </div>
            </div>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
            <h2>What You'll Experience in 4 Weeks</h2>
            
            <div className="benefit-item">
                <div className="benefit-icon">🧠</div>
                <div className="benefit-text">
                    <h3>Deep Subconscious Reset</h3>
                    <p>Delete the "poverty programs" that your parents unknowingly passed down to you.</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">💰</div>
                <div className="benefit-text">
                    <h3>Financial Breakthrough</h3>
                    <p>Align your energy with abundance and watch opportunities flow naturally without the struggle.</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">🛡️</div>
                <div className="benefit-text">
                    <h3>The Shield of Confidence</h3>
                    <p>Walk into business meetings or negotiations with an aura that commands respect and high value.</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">🚀</div>
                <div className="benefit-text">
                    <h3>Intuitive Action</h3>
                    <p>Stop overthinking and start doing. Know exactly which step to take next to grow your wealth.</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">😌</div>
                <div className="benefit-text">
                    <h3>Peace of Mind</h3>
                    <p>Replace the anxiety of "not enough" with the calm certainty of "always provided for."</p>
                </div>
            </div>
        </div>

        {/* Testimonials - Adapted to Finance */}
        <div className="testimonials-section">
            <h2>Real Results from Real People</h2>

            {/* Western Finance Testimonials */}
            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">👨‍💻</div>
                    <div className="testimonial-info">
                        <h4>James Carter</h4>
                        <p>New York, USA • Entrepreneur</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "I was stuck at $5k/month for three years. I tried every marketing strategy out there. After 3 sessions of eL Vision, I realized I had a deep fear of success. Once we cleared that, I hit $15k the very next month with zero extra ad spend."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">👩‍💼</div>
                    <div className="testimonial-info">
                        <h4>Sarah Peterson</h4>
                        <p>London, UK • Corporate Executive</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "I was passed over for promotion twice. I felt invisible. The eL Vision protocol helped me change my internal posture. Two weeks later, my boss approached ME for a Director role. The return on investment here is infinite."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">🏘️</div>
                    <div className="testimonial-info">
                        <h4>Robert D.</h4>
                        <p>Sydney, Australia • Real Estate</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "Real estate is stressful. I was burning out. This program didn't just help me relax; it sharpened my intuition. I sensed a bad deal that would have cost me $50k, and found a hidden gem that made me $20k instantly. Pure mind power."
                </div>
            </div>

            {/* Original High-Profile Testimonials (Kept as they are broad/powerful) */}
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
                    <div className="testimonial-info">👩‍💼</div>
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
            <p>I'm so confident in this program that if you don't feel a shift in your mindset regarding money and success, you get your full $20 back—no questions asked.</p>
        </div>

        {/* Emotional Trigger */}
        <div style={{ textAlign: 'center', marginBottom: '40px', padding: '0 20px', color: 'white' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>You have two options now:</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto 30px auto' }}>
                <div style={{ background: '#1a1a1a', border: '2px solid rgba(231, 76, 60, 0.5)', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <h3 style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '10px' }}>1. Continue the Struggle</h3>
                    <p style={{ color: '#D1D5DB', fontSize: '0.95rem' }}>Stay in the same financial loop. Work harder for the same results. Let another year pass while you wonder why wealth is reserved for everyone else but you.</p>
                </div>
                <div style={{ background: '#1a1a1a', border: '2px solid rgba(46, 204, 113, 0.5)', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <h3 style={{ color: '#51cf66', fontWeight: 'bold', marginBottom: '10px' }}>2. Invest a "Coffee Budget"</h3>
                    <p style={{ color: '#D1D5DB', fontSize: '0.95rem' }}>Commit just $20—the cost of a few coffees—for a massive 4-week transformation. Realign your frequency and become a magnet for abundance.</p>
                </div>
            </div>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '10px' }}>"The choice is yours. I wish you all the best. Your reality follows your mind. Let me show you how to lead it."</p>
            <p style={{ fontWeight: 'bold', color: '#ffd700' }}>Click the button below. Secure your spot before the price goes back to $400.</p>
            <p style={{ marginTop: '5px' }}>I’ll see you on the inside.</p>
        </div>

        {/* Final CTA */}
        <div className="offer-section">
            <h2>Ready to Rewrite Your Financial Destiny?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Join me for 4 weeks and experience the alignment that opens the floodgates of abundance.</p>
            
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
                    {loading ? 'PROCESSING...' : 'YES, I\'M READY TO TRANSFORM'}
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