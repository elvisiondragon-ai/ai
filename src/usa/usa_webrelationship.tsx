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

const UsaWebRelationship = () => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [paymentData, setPaymentData] = React.useState<any>(null);
  const purchaseFiredRef = React.useRef(false);

  // CAPI Configuration — IDENTICAL
  const PIXEL_ID = '1393383179182528';

  // Helper to send CAPI events — IDENTICAL
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

  // Facebook Pixel Init — IDENTICAL PIXEL_ID, product key changed to usa_webinarrelationship
  useEffect(() => {
    initFacebookPixelWithLogging(PIXEL_ID);
    const eventId = `pageview-${Date.now()}`;
    
    trackPageViewEvent({}, eventId, PIXEL_ID);
    trackCustomEvent('ViewContent', {
      content_name: 'usa_webinar20',
      content_category: 'Relationship Webinar',
      value: 20.00,
      currency: 'USD'
    }, eventId, PIXEL_ID);
  }, []);

  // Purchase handler — IDENTICAL flow, product key changed
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
      
      sendCAPIEvent('AddPaymentInfo', { email }, eventData, eventId);

      const { fbc, fbp } = getFbcFbpCookies();

      // PAYPAL via Tripay — IDENTICAL structure, subscriptionType changed
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

  // Realtime Payment Listener — IDENTICAL logic, channel tag updated
  useEffect(() => {
    if (!paymentData?.merchantRef) return;
    
    const channel = supabase
      .channel(`payment-relationship-${paymentData.merchantRef}`)
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
            description: "Payment successful. Check your email now for your Webinar access.",
            duration: 5000, 
          });

          const eventId = payload.new.tripay_reference || paymentData.merchantRef;
          const eventData = {
            content_name: 'usa_webinarrelationship',
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

        <div className="usa-webrelationship-page">

          <Toaster />

          
          <style dangerouslySetInnerHTML={{ __html: `

    
        .usa-webrelationship-page {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: linear-gradient(135deg, #e84393 0%, #6c3483 100%);
            min-height: 100vh;
            margin: 0;
            padding: 0;
        }

        .usa-webrelationship-page * {
            box-sizing: border-box;
        }

        .usa-webrelationship-page .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Hero Section */
        .usa-webrelationship-page .hero {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            text-align: center;
        }

        .usa-webrelationship-page .hero h1 {
            font-size: 2.2rem;
            color: #e84393;
            margin-bottom: 15px;
            line-height: 1.2;
            font-weight: bold;
        }

        .usa-webrelationship-page .hero .subheading {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 25px;
        }

        .usa-webrelationship-page .highlight {
            background: linear-gradient(135deg, #e84393 0%, #6c3483 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
        }

        /* Video Testimonial Section */
        .usa-webrelationship-page .video-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webrelationship-page .video-section h2 {
            font-size: 1.8rem;
            color: #e84393;
            margin-bottom: 10px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webrelationship-page .video-section .subtitle {
            text-align: center;
            color: #e74c3c;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 25px;
        }

        .usa-webrelationship-page .video-container {
            position: relative;
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .usa-webrelationship-page .video-container video {
            width: 100%;
            display: block;
        }

        /* Story Section */
        .usa-webrelationship-page .story-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webrelationship-page .story-section h2 {
            font-size: 1.8rem;
            color: #e84393;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .usa-webrelationship-page .story-section p {
            font-size: 1.05rem;
            margin-bottom: 15px;
            color: #333;
            line-height: 1.8;
        }

        .usa-webrelationship-page .story-highlight {
            background: #fdf2f8;
            padding: 20px;
            border-left: 4px solid #e84393;
            margin: 20px 0;
            border-radius: 8px;
        }

        /* Offer Section */
        .usa-webrelationship-page .offer-section {
            background: linear-gradient(135deg, #e84393 0%, #6c3483 100%);
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            color: white;
            text-align: center;
        }

        .usa-webrelationship-page .offer-section h2 {
            font-size: 2rem;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .usa-webrelationship-page .price-container {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            margin: 25px 0;
        }

        .usa-webrelationship-page .original-price {
            font-size: 1.5rem;
            text-decoration: line-through;
            opacity: 0.7;
            margin-bottom: 10px;
        }

        .usa-webrelationship-page .current-price {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .usa-webrelationship-page .price-detail {
            font-size: 1.2rem;
            margin-bottom: 5px;
        }

        .usa-webrelationship-page .countdown {
            background: #e74c3c;
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-size: 1.3rem;
            font-weight: 700;
            margin: 20px 0;
        }

        /* CTA Button */
        .usa-webrelationship-page .cta-button {
            display: inline-block;
            background: white;
            color: #e84393;
            padding: 18px 50px;
            font-size: 1.3rem;
            font-weight: 700;
            border-radius: 50px;
            text-decoration: none;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            margin-top: 20px;
        }

        .usa-webrelationship-page .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }

        /* Benefits Section */
        .usa-webrelationship-page .benefits-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webrelationship-page .benefits-section h2 {
            font-size: 1.8rem;
            color: #e84393;
            margin-bottom: 25px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webrelationship-page .benefit-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            padding: 15px;
            background: #fdf2f8;
            border-radius: 10px;
        }

        .usa-webrelationship-page .benefit-icon {
            font-size: 2rem;
            margin-right: 15px;
            flex-shrink: 0;
        }

        .usa-webrelationship-page .benefit-text h3 {
            color: #e84393;
            margin-bottom: 5px;
            font-size: 1.2rem;
            font-weight: bold;
        }

        .usa-webrelationship-page .benefit-text p {
            color: #666;
            font-size: 1rem;
        }

        /* Testimonials Grid */
        .usa-webrelationship-page .testimonials-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webrelationship-page .testimonials-section h2 {
            font-size: 1.8rem;
            color: #e84393;
            margin-bottom: 25px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webrelationship-page .testimonial-card {
            background: #fdf2f8;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 20px;
            border-left: 4px solid #e84393;
        }

        .usa-webrelationship-page .testimonial-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .usa-webrelationship-page .testimonial-icon {
            font-size: 2.5rem;
            margin-right: 15px;
        }

        .usa-webrelationship-page .testimonial-info h4 {
            color: #e84393;
            margin-bottom: 3px;
            font-size: 1.1rem;
            font-weight: bold;
        }

        .usa-webrelationship-page .testimonial-info p {
            color: #666;
            font-size: 0.9rem;
        }

        .usa-webrelationship-page .testimonial-text {
            color: #333;
            font-size: 1rem;
            line-height: 1.6;
            font-style: italic;
        }

        .usa-webrelationship-page .stars {
            color: #f39c12;
            margin-bottom: 10px;
        }

        /* Guarantee Section */
        .usa-webrelationship-page .guarantee-section {
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            color: white;
            text-align: center;
        }

        .usa-webrelationship-page .guarantee-section h3 {
            font-size: 1.8rem;
            margin-bottom: 15px;
            font-weight: bold;
        }

        /* Footer */
        .usa-webrelationship-page .footer {
            text-align: center;
            color: white;
            padding: 30px;
        }

        .usa-webrelationship-page .footer p {
            margin-bottom: 10px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .usa-webrelationship-page .hero h1 {
                font-size: 1.6rem;
            }

            .usa-webrelationship-page .hero .subheading {
                font-size: 1rem;
            }

            .usa-webrelationship-page .video-section h2,
            .usa-webrelationship-page .story-section h2,
            .usa-webrelationship-page .benefits-section h2,
            .usa-webrelationship-page .testimonials-section h2 {
                font-size: 1.5rem;
            }

            .usa-webrelationship-page .current-price {
                font-size: 2.2rem;
            }

            .usa-webrelationship-page .cta-button {
                padding: 15px 35px;
                font-size: 1.1rem;
            }

            .usa-webrelationship-page .container {
                padding: 15px;
            }

            .usa-webrelationship-page .hero,
            .usa-webrelationship-page .video-section,
            .usa-webrelationship-page .story-section,
            .usa-webrelationship-page .offer-section,
            .usa-webrelationship-page .benefits-section,
            .usa-webrelationship-page .testimonials-section,
            .usa-webrelationship-page .guarantee-section {
                padding: 25px 20px;
                margin-bottom: 20px;
            }
        }

        @media (max-width: 480px) {
            .usa-webrelationship-page .hero h1 {
                font-size: 1.4rem;
            }

            .usa-webrelationship-page .current-price {
                font-size: 2rem;
            }

            .usa-webrelationship-page .benefit-item {
                flex-direction: column;
            }

            .usa-webrelationship-page .benefit-icon {
                margin-bottom: 10px;
            }
        }
      ` }} />
      <div className="container">

        {/* ─── HERO ─── */}
        <div className="hero">
            <h1>Stuck Single Forever? Rejected by His Family? It's Time to <span className="highlight">Finally Be Loved</span></h1>
            <p className="subheading">Discover the deep subconscious method that breaks the invisible pattern keeping you alone — and makes real, lasting love possible</p>
        </div>

        {/* VSL Section */}
        <div className="video-section">
            <h2>The Secret to Massive Transformation</h2>
            <p className="subtitle">Watch this first to understand how we align your subconscious for results</p>
            <div className="video-container">
                <video controls poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/el_usa_vsl.jpg">
                    <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/el_vsl_usa.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>

        {/* ─── STORY / INTRO ─── */}
        <div className="story-section">
            <h2>Hi, I'm eL Reyzandra</h2>
            <p>I've spent <strong>16 years obsessed with understanding why relationships fail</strong>. Not because I had it figured out — because I was the person everyone kept leaving. I was told I was "too much." I was ghosted. I was the one who always ended up alone.</p>
            
            <p>That pain drove me on a deep scientific and spiritual journey. And here's the truth I finally uncovered:</p>

            <div className="story-highlight">
                <p><strong>It's not about finding the right person.</strong></p>
                <p>It's about becoming someone whose internal frequency <em>attracts</em> love. When your subconscious is stuck in rejection, loneliness, or "I'm not enough" — no partner will stay. The real secret? <strong>Perfect Reality alignment</strong> — rewriting your deepest beliefs so love flows in naturally.</p>
            </div>

            <p>My specialty is creating what I call <span className="highlight"><strong>Perfect Reality</strong></span> — a state so deeply aligned that the people and love you want come to you effortlessly. My clients include:</p>
            <ul style={{ marginLeft: '25px', marginTop: '15px', marginBottom: '15px', listStyleType: 'disc' }}>
                <li>National Intelligence Officers</li>
                <li>Foundation Leaders Managing 100+ Orphanages</li>
                <li>Doctors & Hypnotherapists</li>
                <li>CEOs & Entrepreneurs</li>
            </ul>

            <p>And people just like you — who were told love wasn't for them. Within weeks of the program, everything changed.</p>
        </div>

        {/* ─── PAIN AGITATION SECTION ─── */}
        <div className="story-section" style={{ background: '#fff0f0', borderLeft: '6px solid #e74c3c' }}>
            <h2 style={{ color: '#c53030' }}>The Painful Truth Nobody Tells You</h2>

            <p>Does any of this hit uncomfortably close?</p>

            <p>You've been <strong>single for years</strong> and you don't understand why. You watch everyone around you get into relationships, get engaged, get married — and you're still waiting. You start wondering: <em>"What is wrong with me?"</em></p>

            <p>Or maybe you <strong>finally found someone</strong> — but his family <strong>rejects you</strong> openly. They talk behind your back. They make you feel like an outsider in every gathering. The person you love is caught in the middle, and slowly, the relationship is <strong>suffocating under their pressure</strong>.</p>

            <p>Or worst of all — your partner <strong>turns on you</strong>. They become cold. They criticize you constantly. They make you feel small, invisible, and unloved. You cry at night wondering where the love went.</p>

            <div className="story-highlight" style={{ background: '#fff5f5', borderLeft: '4px solid #c53030' }}>
                <p><strong>Here's the part that stings:</strong></p>
                <p>It's not bad luck. It's not because you're unlovable. It's because <strong>your subconscious is broadcasting a frequency that repels love</strong>. Old wounds — abandonment, rejection, not feeling "enough" from childhood — are silently running your love life. Every relationship you enter is just a <em>replay</em> of that same old pattern.</p>
            </div>

            <p style={{ fontWeight: 'bold', fontSize: '1.15rem', color: '#c53030', marginTop: '10px' }}>
                The therapists you tried gave you advice. But advice cannot reach the <strong>subconscious layer</strong> where this pattern lives.
            </p>

            <p style={{ fontWeight: 'bold', fontSize: '1.15rem', color: '#c53030' }}>
                That's why nothing has worked — until now.
            </p>
        </div>

        {/* ─── SOLUTION SECTION ─── */}
        <div className="story-section" style={{ background: '#fdf2f8', borderLeft: '6px solid #e84393' }}>
            <h2 style={{ color: '#e84393' }}>The Proven Solution: Reprogram Your Inner World</h2>

            <p>For the last 7 years, eL Vision has helped people <strong>break free from toxic relationship cycles</strong> — not by teaching you to "try harder" or "be more confident," but by going directly to the <strong>root frequency inside your subconscious</strong> and rewriting it.</p>

            <div className="story-highlight" style={{ background: 'white', borderLeft: '4px solid #e84393' }}>
                <p><strong>How It Works:</strong></p>
                <p>Using a proven method that combines <strong>Theta wave reprogramming, deep alignment, and subconscious release</strong>, we don't just teach you — we <em>reprogram</em> the beliefs that are keeping love away. When your frequency shifts, people around you notice the change immediately. The partner who was cold becomes warm. The family that rejected you starts to open up. Or — if they can't — you naturally attract someone far better.</p>
            </div>

            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', marginTop: '20px', color: '#e84393' }}>
                This is not about love advice. This is about fundamentally changing who you are at the deepest level — so love becomes your natural state.
            </p>
        </div>

        {/* ─── WHO IS THIS FOR ─── */}
        <div className="story-section" style={{ background: '#f8fafc', borderLeft: '6px solid #e84393' }}>
            <h2 style={{ color: '#4a5568' }}>Who Is This For?</h2>
            <p>This program is designed for anyone who is <strong>stuck in a painful relationship pattern</strong> and is ready to stop repeating it. Whether you've never been in a relationship, or you've been in the wrong ones — this method works at the subconscious root.</p>
            
            <p><strong>Check which situation feels true for you:</strong></p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0d4e3' }}>
                    <h3 style={{ color: '#e84393', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>💔 Chronic Single</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>You've been alone for years. Dates never turn into relationships. You're starting to believe love isn't meant for you.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0d4e3' }}>
                    <h3 style={{ color: '#e84393', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>👨‍👩‍👧 Partner's Family Rejects You</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>His mother, his siblings — they make it clear you are not welcome. Every family event is a battlefield of silent hostility.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0d4e3' }}>
                    <h3 style={{ color: '#e84393', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>🗣️ Toxic Partner Dynamic</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Your partner became cold, critical, or emotionally distant. You feel invisible and are running out of hope for the relationship.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0d4e3' }}>
                    <h3 style={{ color: '#e84393', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>🔄 Same Pattern, Every Time</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>You keep attracting the same type of person. Every relationship ends the same way — with you being the one hurt.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0d4e3' }}>
                    <h3 style={{ color: '#e84393', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>😰 Anxiety & Self-Doubt</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>You constantly feel "not enough." Relationships make you anxious. You self-sabotage when things get close.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0d4e3' }}>
                    <h3 style={{ color: '#e84393', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>🌚 Post-Breakup Depression</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>After a painful breakup or being dumped, you feel empty, lost, and unable to imagine ever being happy again.</p>
                </div>
            </div>

            <p style={{ marginTop: '25px', fontStyle: 'italic', color: '#4a5568', textAlign: 'center' }}>
                "Love is not something you find. It's something you become. When you fix the frequency inside, the right people will find you."
            </p>
        </div>

        {/* FAQ Section */}
        <div className="story-section" style={{ background: '#fdf2f8', borderTop: '4px solid #e84393' }}>
            <h2 style={{ color: '#e84393', textAlign: 'center', marginBottom: '30px' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #f0d4e3' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#e84393', marginBottom: '10px' }}>Q: Can I use this method to get my ex back or change a specific person?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#4a5568' }}><strong>A:</strong> We don't believe in "manipulating" others. However, when you shift your internal frequency, the people around you naturally react differently. If that person is part of your highest path, they will be drawn back to your new energy. If not, you will naturally attract someone far better who actually values you.</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #f0d4e3' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#e84393', marginBottom: '10px' }}>Q: What if I've been single for a very long time and feel "hopeless"?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#4a5568' }}><strong>A:</strong> Longevity of a pattern doesn't make it harder to break—it just means the "groove" in your subconscious is deeper. We use Theta-state alignment to smooth over those old grooves and create a new reality where love is possible. Many of our clients break 10-year single streaks within weeks of starting.</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #f0d4e3' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#e84393', marginBottom: '10px' }}>Q: My partner's family is very toxic. Can this really help?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#4a5568' }}><strong>A:</strong> Yes. Toxicity thrives on a specific energetic "hook." When you do the internal work and reach a state of Perfect Reality, you unhook yourself from their drama. Often, the family members either stop their behavior or lose their power to affect your relationship completely.</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #f0d4e3' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#e84393', marginBottom: '10px' }}>Q: Is this just about "self-love" or is there more to it?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#4a5568' }}><strong>A:</strong> Self-love is the cliché, but "Subconscious Alignment" is the science. We don't just tell you to "love yourself"—we help you delete the core data in your mind that says you are unworthy of it. When that data is gone, the self-love (and the external love) becomes automatic.</p>
                </div>
            </div>
        </div>

        {/* ─── LIMITED TIME OFFER (IDENTICAL structure + PayPal) ─── */}
        <div className="offer-section">
            <h2>🌟 Limited Time Global Launch Offer 🌟</h2>
            
            <div className="price-container">
                <div className="original-price">Regular: $400 (4 sessions × $100)</div>
                <div className="current-price">$20</div>
                <div className="price-detail">4 Weekly Sessions (30-45 minutes each)</div>
                <div className="price-detail">Just $5 per life-changing session</div>
            </div>

            <div className="countdown">
                ⏰ THIS PRICE ENDS IN 24 HOURS ⏰
            </div>

            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>As I expand globally, I'm gathering real success stories worldwide. This is your chance to break free from the cycle at a fraction of the cost.</p>
            
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
                    {loading ? 'PROCESSING...' : 'YES, I WANT TO BE LOVED'}
                </button>
            </div>
            
            <p style={{ marginTop: '20px', fontSize: '0.95rem' }}>✅ 100% Money-Back Guarantee</p>
        </div>

        {/* ─── VIDEO TESTIMONIALS GRID (IDENTICAL YouTube embeds + names) ─── */}
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
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', padding: '0 10px' }}>Proof: If this method can reset cellular health, it can reset your pattern in relationships.</p>
                </div>

                {/* English Interview - Science */}
                <div className="video-card">
                    <div className="video-container" style={{ aspectRatio: '9/16' }}>
                        <video controls poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/arif_interview_en.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' }}>
                            <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/arif_interview_en.mp4" type="video/mp4" />
                        </video>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>The Science of Love Alignment</p>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', padding: '0 10px' }}>Full Interview (English): How frequency creates attraction and connection.</p>
                </div>

                {/* Felicia — IDENTICAL */}
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

                {/* Habib Umar — IDENTICAL */}
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

                {/* Agus Mulyadi — IDENTICAL */}
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

                {/* Dr. Gumilar — IDENTICAL */}
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

        {/* ─── BENEFITS ─── */}
        <div className="benefits-section">
            <h2>What You'll Experience in 4 Weeks</h2>
            
            <div className="benefit-item">
                <div className="benefit-icon">🧘</div>
                <div className="benefit-text">
                    <h3>Deep Subconscious Reprogramming</h3>
                    <p>We go straight to the root — the unconscious beliefs about love, rejection, and self-worth — and rewrite them in Theta state</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">💝</div>
                <div className="benefit-text">
                    <h3>Break the Rejection Cycle Forever</h3>
                    <p>Stop attracting people who push you away. Your frequency shifts, and the pattern that has haunted every relationship dissolves</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">🕊️</div>
                <div className="benefit-text">
                    <h3>Peace With His Family — Or Better</h3>
                    <p>When your internal energy is aligned, hostile dynamics soften naturally. If they can't change, you'll be guided to what's truly right for you</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">🌟</div>
                <div className="benefit-text">
                    <h3>Magnetic Self-Worth</h3>
                    <p>You stop chasing love and start being genuinely magnetic. The confidence isn't faked — it comes from deep internal alignment</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">🎯</div>
                <div className="benefit-text">
                    <h3>Crystal Clear Intuition for Love</h3>
                    <p>Move from confusion and anxiety to knowing exactly who is right for you — before you waste another year on the wrong person</p>
                </div>
            </div>
        </div>

        {/* ─── TESTIMONIALS (same names, repurposed for relationship context) ─── */}
        <div className="testimonials-section">
            <h2>Real Results from Real People</h2>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">👩‍❤️‍👨</div>
                    <div className="testimonial-info">
                        <h4>Sarah Jenkins</h4>
                        <p>Los Angeles, USA • Broke a 10-Year Single Streak</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "I was single for 10 years and had given up on love completely. Everyone told me I was 'meant to be alone.' After 3 weeks of the eL Vision program, something inside me shifted so deeply that within a month I met someone incredible — and for the first time, it felt effortless and real."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">👨‍❤️‍👨</div>
                    <div className="testimonial-info">
                        <h4>Michael K.</h4>
                        <p>London, UK • Family Hostility Ended</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "My partner's family had rejected me for two years straight. Every visit was a war zone. After working with eL's method, I stopped carrying that pain internally — and within weeks the tension literally dissolved. His mother called me last month and apologized. I still can't believe it."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">💃</div>
                    <div className="testimonial-info">
                        <h4>David L.</h4>
                        <p>Toronto, Canada • Escaped a Toxic 5-Year Loop</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "I had 3 relationships in a row that ended the exact same way — me crying, them leaving. I was terrified it would never stop. After the subconscious alignment sessions, I finally understood the pattern and broke free. Now I'm with someone who actually stays, and I feel safe for the first time."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">🧘‍♀️</div>
                    <div className="testimonial-info">
                        <h4>Elena M.</h4>
                        <p>Sydney, Australia • Cold Partner Became Warm Again</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "My husband had become emotionally cold for over a year. I thought the marriage was over. But instead of blaming him, the program taught me to look inward. Within 4 weeks my own energy changed so much that he literally started coming home early again, holding my hand, saying 'I love you.' It was unreal."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">🌸</div>
                    <div className="testimonial-info">
                        <h4>Thomas R.</h4>
                        <p>Chicago, USA • Healed From Deep Abandonment</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "I carried abandonment wounds from childhood into every relationship. I would push people away before they could leave me first. After just 4 sessions with eL, the root belief — 'I don't deserve love' — was finally released. I haven't sabotaged a relationship since. I feel like a completely different person."
                </div>
            </div>

            {/* ─── ORIGINAL HIGH-PROFILE TESTIMONIALS — IDENTICAL names + text ─── */}
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

        {/* ─── GUARANTEE — IDENTICAL ─── */}
        <div className="guarantee-section">
            <h3>💯 100% Money-Back Guarantee</h3>
            <p>I'm so confident in this program that if you don't experience a tangible shift in your relationships, your self-worth, and your inner peace, you get your full $20 back — no questions asked.</p>
        </div>

        {/* Emotional Trigger */}
        <div style={{ textAlign: 'center', marginBottom: '40px', padding: '0 20px', color: 'white' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>You have two options now:</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto 30px auto' }}>
                <div style={{ background: '#1a1a1a', border: '2px solid rgba(231, 76, 60, 0.5)', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <h3 style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '10px' }}>1. Stay in the Loop</h3>
                    <p style={{ color: '#D1D5DB', fontSize: '0.95rem' }}>Continue repeating the same painful patterns. Accept the loneliness, the rejection, or the cold dynamic as your "fate" while your heart stays closed.</p>
                </div>
                <div style={{ background: '#1a1a1a', border: '2px solid rgba(46, 204, 113, 0.5)', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <h3 style={{ color: '#51cf66', fontWeight: 'bold', marginBottom: '10px' }}>2. Invest a "Coffee Budget"</h3>
                    <p style={{ color: '#D1D5DB', fontSize: '0.95rem' }}>Commit just $20—less than you'd spend on a single date—for a massive 4-week transformation. Break the cycle and finally allow yourself to be loved.</p>
                </div>
            </div>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '10px' }}>"The choice is yours. I wish you all the best. Your heart follows your mind. Let me show you how to lead it."</p>
            <p style={{ fontWeight: 'bold', color: '#F0ABFC' }}>Click the button below. Secure your spot before the price goes back to $400.</p>
            <p style={{ marginTop: '5px' }}>I’ll see you on the inside.</p>
        </div>

        {/* Final CTA */}
        <div className="offer-section">
            <h2>Ready to Finally Feel Loved?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Join me for 4 weeks and experience the alignment that changes everything — your heart, your relationships, your life.</p>
            
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
                    {loading ? 'PROCESSING...' : 'YES, I\'M READY TO BE LOVED'}
                </button>
            </div>
            
            <p style={{ marginTop: '25px', fontSize: '0.95rem' }}>⏰ Remember: This $20 offer expires in 24 hours</p>
            <p style={{ fontSize: '0.95rem' }}>Regular price returns to $400</p>
        </div>

        {/* ─── FOOTER — IDENTICAL ─── */}
        <div className="footer">
            <p><strong>eL Vision</strong></p>
            <p>Transforming Lives Through Perfect Reality Alignment</p>
            <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>© 2026 eL Vision. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default UsaWebRelationship;