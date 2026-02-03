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

const UsaWebHealth = () => {
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
      content_name: 'usa_webinar20',
      content_category: 'Health Webinar',
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
      .channel(`payment-health-${paymentData.merchantRef}`)
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
            content_name: 'usa_webinarhealth',
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

        <div className="usa-webhealth-page">

          <Toaster />

          

          <style dangerouslySetInnerHTML={{ __html: `

    
        .usa-webhealth-page {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            margin: 0;
            padding: 0;
        }

        .usa-webhealth-page * {
            box-sizing: border-box;
        }

        .usa-webhealth-page .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Hero Section */
        .usa-webhealth-page .hero {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            text-align: center;
        }

        .usa-webhealth-page .hero h1 {
            font-size: 2.2rem;
            color: #667eea;
            margin-bottom: 15px;
            line-height: 1.2;
            font-weight: bold;
        }

        .usa-webhealth-page .hero .subheading {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 25px;
        }

        .usa-webhealth-page .highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
        }

        /* Video Testimonial Section */
        .usa-webhealth-page .video-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webhealth-page .video-section h2 {
            font-size: 1.8rem;
            color: #667eea;
            margin-bottom: 10px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webhealth-page .video-section .subtitle {
            text-align: center;
            color: #e74c3c;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 25px;
        }

        .usa-webhealth-page .video-container {
            position: relative;
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .usa-webhealth-page .video-container video {
            width: 100%;
            display: block;
        }

        /* Story Section */
        .usa-webhealth-page .story-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webhealth-page .story-section h2 {
            font-size: 1.8rem;
            color: #667eea;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .usa-webhealth-page .story-section p {
            font-size: 1.05rem;
            margin-bottom: 15px;
            color: #333;
            line-height: 1.8;
        }

        .usa-webhealth-page .story-highlight {
            background: #f0f4ff;
            padding: 20px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
            border-radius: 8px;
        }

        /* Offer Section */
        .usa-webhealth-page .offer-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            color: white;
            text-align: center;
        }

        .usa-webhealth-page .offer-section h2 {
            font-size: 2rem;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .usa-webhealth-page .price-container {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            margin: 25px 0;
        }

        .usa-webhealth-page .original-price {
            font-size: 1.5rem;
            text-decoration: line-through;
            opacity: 0.7;
            margin-bottom: 10px;
        }

        .usa-webhealth-page .current-price {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .usa-webhealth-page .price-detail {
            font-size: 1.2rem;
            margin-bottom: 5px;
        }

        .usa-webhealth-page .countdown {
            background: #e74c3c;
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-size: 1.3rem;
            font-weight: 700;
            margin: 20px 0;
        }

        /* CTA Button */
        .usa-webhealth-page .cta-button {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 18px 50px;
            font-size: 1.3rem;
            font-weight: 700;
            border-radius: 50px;
            text-decoration: none;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            margin-top: 20px;
        }

        .usa-webhealth-page .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        }

        /* Benefits Section */
        .usa-webhealth-page .benefits-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webhealth-page .benefits-section h2 {
            font-size: 1.8rem;
            color: #667eea;
            margin-bottom: 25px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webhealth-page .benefit-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9ff;
            border-radius: 10px;
        }

        .usa-webhealth-page .benefit-icon {
            font-size: 2rem;
            margin-right: 15px;
            flex-shrink: 0;
        }

        .usa-webhealth-page .benefit-text h3 {
            color: #667eea;
            margin-bottom: 5px;
            font-size: 1.2rem;
            font-weight: bold;
        }

        .usa-webhealth-page .benefit-text p {
            color: #666;
            font-size: 1rem;
        }

        /* Testimonials Grid */
        .usa-webhealth-page .testimonials-section {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .usa-webhealth-page .testimonials-section h2 {
            font-size: 1.8rem;
            color: #667eea;
            margin-bottom: 25px;
            text-align: center;
            font-weight: bold;
        }

        .usa-webhealth-page .testimonial-card {
            background: #f8f9ff;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 20px;
            border-left: 4px solid #667eea;
        }

        .usa-webhealth-page .testimonial-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .usa-webhealth-page .testimonial-icon {
            font-size: 2.5rem;
            margin-right: 15px;
        }

        .usa-webhealth-page .testimonial-info h4 {
            color: #667eea;
            margin-bottom: 3px;
            font-size: 1.1rem;
            font-weight: bold;
        }

        .usa-webhealth-page .testimonial-info p {
            color: #666;
            font-size: 0.9rem;
        }

        .usa-webhealth-page .testimonial-text {
            color: #333;
            font-size: 1rem;
            line-height: 1.6;
            font-style: italic;
        }

        .usa-webhealth-page .stars {
            color: #f39c12;
            margin-bottom: 10px;
        }

        /* Guarantee Section */
        .usa-webhealth-page .guarantee-section {
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            color: white;
            text-align: center;
        }

        .usa-webhealth-page .guarantee-section h3 {
            font-size: 1.8rem;
            margin-bottom: 15px;
            font-weight: bold;
        }

        /* Footer */
        .usa-webhealth-page .footer {
            text-align: center;
            color: white;
            padding: 30px;
        }

        .usa-webhealth-page .footer p {
            margin-bottom: 10px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .usa-webhealth-page .hero h1 {
                font-size: 1.6rem;
            }

            .usa-webhealth-page .hero .subheading {
                font-size: 1rem;
            }

            .usa-webhealth-page .video-section h2,
            .usa-webhealth-page .story-section h2,
            .usa-webhealth-page .benefits-section h2,
            .usa-webhealth-page .testimonials-section h2 {
                font-size: 1.5rem;
            }

            .usa-webhealth-page .current-price {
                font-size: 2.2rem;
            }

            .usa-webhealth-page .cta-button {
                padding: 15px 35px;
                font-size: 1.1rem;
            }

            .usa-webhealth-page .container {
                padding: 15px;
            }

            .usa-webhealth-page .hero,
            .usa-webhealth-page .video-section,
            .usa-webhealth-page .story-section,
            .usa-webhealth-page .offer-section,
            .usa-webhealth-page .benefits-section,
            .usa-webhealth-page .testimonials-section,
            .usa-webhealth-page .guarantee-section {
                padding: 25px 20px;
                margin-bottom: 20px;
            }
        }

        @media (max-width: 480px) {
            .usa-webhealth-page .hero h1 {
                font-size: 1.4rem;
            }

            .usa-webhealth-page .current-price {
                font-size: 2rem;
            }

            .usa-webhealth-page .benefit-item {
                flex-direction: column;
            }

            .usa-webhealth-page .benefit-icon {
                margin-bottom: 10px;
            }
        }
      ` }} />
      <div className="container">
        {/* Hero Section */}
        <div className="hero">
            <h1>From Stage 4 Brain Cancer to <span className="highlight">Complete Health</span></h1>
            <p className="subheading">Discover the power of aligned subconscious transformation that defied medical predictions</p>
        </div>

        {/* Video Testimonial */}
        <div className="video-section">
            <h2>Arif's Miraculous Recovery</h2>
            <p className="subtitle">Diagnosed Stage 4 Brain Cancer • Given Months to Live • Still Thriving After 2 Years</p>
            <div className="video-container">
                <video controls poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/usa_arif1.jpg">
                    <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/usa_arif1.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>

        {/* Video Interview English */}
        <div className="video-section">
            <h2>Full Interview (English)</h2>
            <p className="subtitle">Detailed breakdown of the recovery process and mental transformation</p>
            <div className="video-container">
                <video controls poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/arif_interview_en.jpg">
                    <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/arif_interview_en.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>

        {/* The LOA Lie VSL Section */}
        <div className="video-section">
            <h2>The "Law of Attraction" Lie</h2>
            <p className="subtitle">Discover why manifestation fails for 99% of people—and the missing piece you need</p>
            <div className="video-container">
                <video controls poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/el_vsl_lie_loa.jpg">
                    <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/el_vsl_lie_loa.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
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

        {/* Story Section */}
        <div className="story-section">
            <h2>Hi, I'm eL Reyzandra</h2>
            <p>I've been <strong>obsessed with mind power</strong> for 16 years. Why? Because when I first tried "The Secret" and the Law of Attraction, it didn't just fail—<strong>it backfired spectacularly</strong>. My life fell apart.</p>
            
            <p>That failure sparked a 16-year journey through science and research to find the answer. Here's what I discovered:</p>

            <div className="story-highlight">
                <p><strong>The Law of Attraction is only 40% of the equation.</strong></p>
                <p>It CANNOT work if you're stressed, emotionally misaligned, or faking your feelings. The real secret? <strong>Perfect Reality alignment</strong>—setting up your internal reality to be deeply happy and free FIRST.</p>
            </div>

            <p>My specialty is creating what I call <span className="highlight"><strong>Perfect Reality</strong></span>—a state so deeply aligned that manifestation becomes effortless. My clients include:</p>
            <ul style={{ marginLeft: '25px', marginTop: '15px', marginBottom: '15px', listStyleType: 'disc' }}>
                <li>National Intelligence Officers</li>
                <li>Foundation Leaders Managing 100+ Orphanages</li>
                <li>Doctors & Hypnotherapists</li>
                <li>CEOs & Entrepreneurs</li>
            </ul>

            <p>And Arif—who was given months to live with Stage 4 brain cancer. Two years later, he's healthy and thriving.</p>
        </div>

        {/* Pain & Solution Section */}
        <div className="story-section" style={{ background: '#fff5f5', borderLeft: '6px solid #e74c3c' }}>
            <h2 style={{ color: '#c53030' }}>The Hidden Root of Chronic Illness</h2>
            <p>Are you struggling with <strong>unexplained health problems</strong> that just won't go away? Have you tried every doctor, every pill, and every specialist only to remain in pain?</p>
            
            <p>The truth that most people miss is that your health is deeply rooted in your <strong>Mind, Faith, and Subconscious Doubt</strong>. When your internal reality is misaligned, your body stays in a state of "biological stress" that prevents healing.</p>

            <div className="story-highlight" style={{ background: 'white', borderLeft: '4px solid #c53030' }}>
                <p><strong>The Proven Holistic Solution:</strong></p>
                <p>For the last 7 years, we have provided a holistic path to recovery that has been proven effective for everyone—from everyday survivors to <strong>National Intelligence Officers</strong> and top-level executives. We don't just treat symptoms; we reprogram the source.</p>
            </div>

            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', marginTop: '20px', color: '#c53030' }}>
                Join this transformation now before the global launch promo ends.
            </p>
        </div>

        {/* Who Is This For Section */}
        <div className="story-section" style={{ background: '#f8fafc', borderLeft: '6px solid #667eea' }}>
            <h2 style={{ color: '#4a5568' }}>Who Is This For?</h2>
            <p>Our program is designed for those who have reached a dead end with traditional medicine and are ready to address the <strong>energetic and mental roots</strong> of their physical suffering. While every human body is unique, the principles of cellular regeneration we teach have shown profound results across a vast spectrum of conditions.</p>
            
            <p className="mb-4"><strong>Check which category you currently fall into:</strong></p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#667eea', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>🛡️ Autoimmune</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Lupus, Rheumatoid Arthritis, Psoriasis, and chronic inflammation where the body "attacks itself" due to deep-seated internal conflict.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#667eea', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>🎗️ Cellular Issues</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Cancer and tumors that arise when the body's natural "blueprint" is disrupted by trauma or chronic stress signals.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#667eea', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>⚡ Chronic Pain</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Back pain, migraines, and fibromyalgia that persist long after the physical injury has supposedly healed.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#667eea', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>🫀 Lifestyle Disease</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Hypertension, Type 2 Diabetes, and heart conditions that are often physical manifestations of "carrying the weight of the world."</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#667eea', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>🧠 Mental Health</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Severe Anxiety, Depression, and ADHD where the brain is stuck in "survival mode" and cannot enter the healing Theta state.</p>
                </div>
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#667eea', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>🌍 Vague Symptoms</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Chronic fatigue, brain fog, and "feeling old" before your time—signs that your vital energy is leaking.</p>
                </div>
            </div>

            <p style={{ marginTop: '25px', fontStyle: 'italic', color: '#4a5568', textAlign: 'center' }}>
                "We don't just treat the disease; we treat the person who has the disease. When you fix the frequency, the body follows."
            </p>
        </div>

        {/* FAQ Section */}
        <div className="story-section" style={{ background: '#f0f4ff', borderTop: '4px solid #667eea' }}>
            <h2 style={{ color: '#1a365d', textAlign: 'center', marginBottom: '30px' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>Q: Is this a replacement for my doctor or medical treatment?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#4a5568' }}><strong>A:</strong> No. Think of this as the "software update" for your healing process. Medicine handles the physical, while eL Vision handles the mental and energetic foundation. When your mind is in a state of "Perfect Reality," your body can finally utilize its own natural regenerative powers effectively.</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>Q: My doctor said my condition is incurable. How can this help?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#4a5568' }}><strong>A:</strong> Doctors speak based on statistics and physical evidence. Arif was also told his Stage 4 brain cancer was a terminal sentence. We focus on the <em>exceptions</em> to those statistics—the people whose subconscious "blueprint" for health was so strong that the body followed suit despite the odds.</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>Q: How is this different from 'The Secret' or regular affirmations?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#4a5568' }}><strong>A:</strong> Affirmations often fail because the surface mind is saying "I am healthy" while the subconscious is screaming "I am sick." We use deep Theta-state alignment to bypass that conflict and reprogram the root frequency directly. No more faking it—your reality actually shifts.</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>Q: Can 4 sessions really change a chronic health issue?</h3>
                    <p style={{ fontSize: '0.95rem', color: '#4a5568' }}><strong>A:</strong> You won't just "learn" about healing; you will <em>experience</em> the shift in these 4 weeks. Most people feel a profound sense of physical and mental peace after the very first session. This momentum is what triggers the body's natural healing response.</p>
                </div>
            </div>
        </div>

        {/* Offer Section */}
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

            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>As I expand globally, I'm gathering satisfied clients worldwide. This is your chance to experience transformation at a fraction of the cost.</p>
            
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

        {/* Video Testimonials Section */}
        <div className="video-section">
            <h2>Genuine Success Stories</h2>
            <p className="subtitle">Real people, real results (Original Language)</p>
            <div className="video-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px',
                marginTop: '30px'
            }}>
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
                <div className="benefit-icon">🧘</div>
                <div className="benefit-text">
                    <h3>Deep Subconscious Alignment</h3>
                    <p>No wasted time—we dive straight into deep relaxation and tap into your subconscious for real transformation</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">💰</div>
                <div className="benefit-text">
                    <h3>Financial Breakthrough</h3>
                    <p>Align your energy with abundance and watch opportunities flow naturally</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">❤️</div>
                <div className="benefit-text">
                    <h3>Relationship Harmony</h3>
                    <p>Transform your connections from the inside out with authentic alignment</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">🌿</div>
                <div className="benefit-text">
                    <h3>Optimal Health & Vitality</h3>
                    <p>Like Arif, experience the profound mind-body connection for healing and wellness</p>
                </div>
            </div>

            <div className="benefit-item">
                <div className="benefit-icon">🎯</div>
                <div className="benefit-text">
                    <h3>Crystal Clear Direction</h3>
                    <p>Move from foggy decisions to confident, intuitive action</p>
                </div>
            </div>
        </div>

        {/* Testimonials */}
        <div className="testimonials-section">
            <h2>Real Results from Real People</h2>

            {/* Western Health Testimonials */}
            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">👩‍⚕️</div>
                    <div className="testimonial-info">
                        <h4>Sarah Jenkins</h4>
                        <p>Los Angeles, USA • Autoimmune Recovery</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "I had chronic autoimmune markers for 10 years that doctors said were permanent. After 3 weeks of the eL Vision protocol, my inflammation levels dropped to zero. My doctor is absolutely baffled by how my cells reset so quickly."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">👨‍🔬</div>
                    <div className="testimonial-info">
                        <h4>Michael K.</h4>
                        <p>London, UK • Tumor Reduction</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "My lung tumor shrunk by 40% in just two months using the Theta wave reprogramming. I combined this mental alignment with my treatment and the results were beyond medical expectations. It's like my body finally remembered how to heal."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">🏃‍♂️</div>
                    <div className="testimonial-info">
                        <h4>David L.</h4>
                        <p>Toronto, Canada • Chronic Pain Management</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "After 15 years of debilitating back pain, I was ready to give up. Aligning my internal reality as eL taught me didn't just mask the pain—it eliminated it. I'm back to running and my energy levels are higher than in my 20s."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">🧘‍♀️</div>
                    <div className="testimonial-info">
                        <h4>Elena M.</h4>
                        <p>Sydney, Australia • Hypertension & Anxiety</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "I used this program for severe anxiety and high blood pressure. Within 4 weeks, I felt a profound peace that stabilized my heart rate. I've been able to significantly reduce my medication with my doctor's approval. Life-changing."
                </div>
            </div>

            <div className="testimonial-card">
                <div className="testimonial-header">
                    <div className="testimonial-icon">💪</div>
                    <div className="testimonial-info">
                        <h4>Thomas R.</h4>
                        <p>Chicago, USA • Chronic Back Pain</p>
                    </div>
                </div>
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">
                    "I lived with chronic back pain for over 8 years. I spent thousands on chiropractors and physical therapists, but the relief was always temporary. After just 4 sessions with eL, the root cause in my subconscious was released and my pain completely vanished. I haven't needed a chiropractor in months."
                </div>
            </div>

            {/* Original High-Profile Testimonials */}
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

        {/* Guarantee */}
        <div className="guarantee-section">
            <h3>💯 100% Money-Back Guarantee</h3>
            <p>I'm so confident in this program that if you don't experience tangible shifts in your clarity, peace, and alignment, you get your full $20 back—no questions asked.</p>
        </div>

        {/* Emotional Trigger */}
        <div style={{ textAlign: 'center', marginBottom: '40px', padding: '0 20px' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '20px' }}>You have two options now:</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto 30px auto' }}>
                <div style={{ background: '#1a1a1a', border: '2px solid rgba(231, 76, 60, 0.5)', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <h3 style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '10px' }}>1. Stay where you are</h3>
                    <p style={{ color: '#D1D5DB', fontSize: '0.95rem' }}>Continue living with the same pain, fatigue, and medical uncertainty. Accept that your body is "failing" you while you wait for a miracle that hasn't come yet.</p>
                </div>
                <div style={{ background: '#1a1a1a', border: '2px solid rgba(46, 204, 113, 0.5)', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <h3 style={{ color: '#51cf66', fontWeight: 'bold', marginBottom: '10px' }}>2. Invest a "Coffee Budget"</h3>
                    <p style={{ color: '#D1D5DB', fontSize: '0.95rem' }}>Commit just $20—less than a week of coffee—for a massive 4-week transformation. Experience the alignment that triggers biological regeneration.</p>
                </div>
            </div>
            <p style={{ fontSize: '1.2rem', color: '#fff', fontStyle: 'italic', marginBottom: '10px' }}>"The choice is yours. I wish you all the best. The body follows the mind. Let me show you how to lead it."</p>
            <p style={{ fontWeight: 'bold', color: '#F0ABFC' }}>Click the button below. Secure your spot before the price goes back to $400.</p>
            <p style={{ color: '#fff', marginTop: '5px' }}>I’ll see you on the inside.</p>
        </div>

        {/* Final CTA */}
        <div className="offer-section">
            <h2>Ready to Transform Your Reality?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Join me for 4 weeks and experience the alignment that changed Arif's life—and can change yours too.</p>
            
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

export default UsaWebHealth;
