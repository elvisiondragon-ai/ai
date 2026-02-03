import React, { useEffect } from 'react';
import { Star, Check, Shield, PlayCircle, MessageCircle, ArrowRight, Instagram, Globe, HeartHandshake, ShieldCheck } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { 
  initFacebookPixelWithLogging, 
  trackPageViewEvent, 
  trackCustomEvent,
  getFbcFbpCookies,
  waitForFbp
} from "@/utils/fbpixel";

const EbookHealthLP = () => {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [paymentData, setPaymentData] = React.useState<any>(null);
  const purchaseFiredRef = React.useRef(false);

  // CAPI Configuration
  const PIXEL_ID = '1393383179182528';

  // Helper to send CAPI events
  const sendCAPIEvent = async (eventName: string, userData: any = {}, customData: any = {}, eventId?: string) => {
    try {
      // ⏳ Wait for FBP
      await waitForFbp();

      const { fbc, fbp } = getFbcFbpCookies();

      // 🧠 NAME SPLITTING LOGIC (For Surname/LN support)
      let fn = userData.fn;
      let ln = userData.ln;
      
      // Try to get name from userData, or state, or session
      let rawName = userData.fn || (email ? email.split('@')[0] : undefined);
      
      // If we have a full name in rawName but no last name, split it
      if (rawName && !ln && rawName.includes(' ')) {
        const parts = rawName.trim().split(/\s+/);
        fn = parts[0];
        ln = parts.slice(1).join(' ');
      } else if (!fn && rawName) {
        fn = rawName;
      }

      // 🎯 FACEBOOK LOGIN ID EXTRACTION
      const { data: { session } } = await supabase.auth.getSession();
      let db_id = userData.db_id;
      
      const fbIdentity = session?.user?.identities?.find(id => id.provider === 'facebook');
      if (fbIdentity) {
        db_id = fbIdentity.id;
      }

      const body: any = {
        pixelId: PIXEL_ID,
        eventName,
        userData: {
          ...userData,
          fn,
          ln,
          db_id, // Map to facebook_login_id
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

  // Facebook Pixel
  useEffect(() => {
    initFacebookPixelWithLogging(PIXEL_ID);
    
    const eventId = `pageview-${Date.now()}`;
    trackPageViewEvent({}, eventId, PIXEL_ID);
  }, []);

  const scrollToPurchase = () => {
    const element = document.getElementById('email-input');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.focus();
    }
  };

  const handlePurchase = async () => {
    if (!email || !email.includes('@')) {
      alert("Please enter a valid email address first to proceed.");
      const emailInput = document.getElementById('email-input');
      if (emailInput) emailInput.focus();
      return;
    }

    try {
      setLoading(true);
      const btn = document.getElementById('buy-btn');
      if(btn) btn.innerText = "Processing...";

      const eventId = `checkout-${Date.now()}`;
      const eventData = {
        content_name: 'Ebook Health Recovery Protocol',
        value: 20.00,
        currency: 'USD'
      };

      trackCustomEvent('InitiateCheckout', eventData, eventId, PIXEL_ID, { em: email });

      const { fbc, fbp } = getFbcFbpCookies();

      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: "ebookhealthlp",
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
      const btn = document.getElementById('buy-btn');
      if(btn) btn.innerText = "Download The Cure Now - $20";
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

          const eventId = payload.new.tripay_reference || paymentData.merchantRef;
          const eventData = {
            content_name: 'Ebook Health Recovery Protocol',
            value: 20.00,
            currency: 'USD'
          };

          // Use Purchase tracker from utility
          trackCustomEvent('Purchase', eventData, eventId, PIXEL_ID, { em: email });

          // FIRST-WIN DEDUPLICATION CHECK
          const isBackendCapiSent = payload.new?.capi_purchase_sent === true;

          if (isBackendCapiSent) {
             console.log(`⏭️ CAPI Purchase Skipped (Backend already sent)`);
          } else {
             sendCAPIEvent('Purchase', { email }, eventData, eventId);
          }
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [paymentData, email]);

  const handleWhatsapp = () => {
    window.location.href = "https://wa.me/62895325633487?text=hi%20i%20have%20paid%20the%20ebook%20for%20recovery%20audio";
  };

  const handleAskQuestion = () => {
    window.location.href = "https://wa.me/62895325633487?text=Hello%2C%20I%20have%20a%20question%20about%20the%20Ebook%20Health%20protocol";
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Floating WhatsApp Button */}
      <button 
        onClick={handleAskQuestion}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center gap-2 group"
      >
        <MessageCircle size={32} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">Ask a Question</span>
      </button>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-bold mb-6 animate-pulse">
            ⚠️ 60% OFF - ENDS THIS SUNDAY
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            "How I Cured My Stage 4 Brain Cancer Without Chemotherapy"
          </h1>
          <div className="bg-blue-600 text-white py-3 px-6 rounded-2xl mb-8 inline-block shadow-lg border-2 border-white transform -rotate-1">
            <p className="text-lg md:text-xl font-bold italic">
              "This method works for ANY disease—especially conditions lighter than mine."
            </p>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto">
            If it can reverse Stage 4 Cancer, it can easily handle:
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm font-bold text-blue-700 uppercase tracking-wide">
            <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Autoimmune</span>
            <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Diabetes</span>
            <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Hypertension</span>
            <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Chronic Pain</span>
            <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Anxiety & Depression</span>
            <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Inflammation</span>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the Plug-and-Play Audio Therapy that reprograms your subconscious to heal any disease—even when doctors say there's no hope.
          </p>
          <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto mb-4">
            <input
              id="email-input"
              type="email"
              placeholder="Enter your email address to receive files..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-lg text-center transition-all shadow-sm"
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <button 
                id="buy-btn"
                onClick={handlePurchase}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-10 rounded-full shadow-xl transition-all hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download The Cure Now - $20
              </button>
              <p className="text-sm text-gray-500 line-through decoration-red-500 decoration-2 text-lg">$50.00</p>
            </div>
            
            <button 
              onClick={handleWhatsapp}
              className="text-green-600 hover:text-green-700 text-sm font-semibold underline flex items-center gap-1 mt-2"
            >
              <MessageCircle size={16} /> Already paid? Click here to confirm via WhatsApp
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="flex text-yellow-400"><Star fill="currentColor" size={16} /> <Star fill="currentColor" size={16} /> <Star fill="currentColor" size={16} /> <Star fill="currentColor" size={16} /> <Star fill="currentColor" size={16} /></span>
            <span>4.9/5 from 1,200+ Survivors</span>
          </div>
        </div>
      </section>

      {/* Arif's Story Section */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">The Diagnosis That Changed Everything</h2>
        <div className="prose lg:prose-xl mx-auto text-gray-700 space-y-6">
          <p>
            My name is Arif. Two years ago, I sat in a cold doctor's office and heard the words that shattered my world: <strong>"Stage 4 Glioblastoma. Inoperable. You have 3 months to live."</strong>
          </p>
          <p>
            I was devastated. I had a family, dreams, a life I wasn't ready to leave. The doctors gave me painkillers and told me to say my goodbyes. The chemotherapy was destroying my body faster than the cancer.
          </p>
          <p>
            I was a walking skeleton, waiting for the end. But deep down, a voice screamed: <em>"There must be another way."</em>
          </p>
          <p>
            That's when I discovered the connection between the <strong>Subconscious Mind and Cellular Regeneration</strong>. I realized that my body wasn't just sick; it was following a "program" of sickness.
          </p>
        </div>
      </section>

      {/* Trust & Real Account Section */}
      <section className="py-8 px-4 bg-white border-y border-gray-100">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-1 rounded-full mb-4">
            <div className="bg-white p-1 rounded-full">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-2xl overflow-hidden">
                <img src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif2.jpg" alt="Arif" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            Connect with me on Instagram
            <Check className="text-blue-500 bg-white rounded-full p-0.5 border border-blue-500" size={16} />
          </h3>
          <a 
            href="https://www.instagram.com/syarifudin_arif25" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-80 transition-opacity mb-2"
          >
            @syarifudin_arif25
          </a>
          <p className="text-gray-600 italic">
            "I am a real account, not fake. You can ask me personally here to verify my journey. I am here to help you recover just as I did."
          </p>
          <div className="flex items-center gap-2 mt-4 text-pink-600 font-semibold uppercase text-xs tracking-widest">
            <Instagram size={16} /> Verified Story
          </div>
        </div>
      </section>

      {/* The Solution / Deep Dive */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-blue-900">How Manifestation Actually Heals The Body (The Science)</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                The Biology of Belief (Epigenetics)
              </h3>
              <p className="text-gray-600">
                Science (Epigenetics) proves that genes are not your destiny. They are blueprints controlled by your environment—and your <strong>internal environment is your thoughts</strong>. 
              </p>
              <p className="text-gray-600">
                Your subconscious mind controls 95% of your bodily functions—heartbeat, digestion, and <strong>immune response</strong>. When you are stressed or fearful (like after a diagnosis), your body releases cortisol, which shuts down your immune system.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <img src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800" alt="Brain synapses" className="rounded-lg mb-4" />
              <p className="text-sm text-gray-500 italic">Your cells listen to your thoughts.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
             <div className="bg-white p-4 rounded-xl shadow-md order-2 md:order-1">
              <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden border border-gray-200 relative shadow-inner mx-auto max-w-[300px]">
                <video 
                  controls 
                  preload="metadata"
                  className="w-full h-full object-cover"
                  poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif2.jpg"
                >
                  <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">Watch Arif's Real Testimony</p>
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                The "Plug & Play" Reprogramming (Theta Waves)
              </h3>
              <p className="text-gray-600">
                You cannot just "think positive" to cure cancer. You need to access the <strong>Theta Brainwave State (4-8Hz)</strong>. This is the hypnagogic state where the conscious filter is asleep, but the subconscious door is wide open.
              </p>
              <p className="text-gray-600">
                My audio therapy uses specific binaural beats and guided regeneration scripts to <strong>force</strong> your brain into this healing state. You just listen, and your body obeys the new command: "Heal."
              </p>
            </div>
          </div>
          
           <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
            <h3 className="text-2xl font-bold mb-4">Step-by-Step Manifestation Process:</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <Check className="text-green-500 flex-shrink-0" />
                <span className="text-gray-700"><strong>Step 1: The Pattern Interrupt.</strong> The audio frequencies disrupt the chronic stress loops (Beta waves) that keep your body in "fight or flight" mode, allowing your immune system to reboot.</span>
              </li>
              <li className="flex gap-4">
                <Check className="text-green-500 flex-shrink-0" />
                <span className="text-gray-700"><strong>Step 2: Cellular Command (Visualization).</strong> We direct specific high-vibration energy to the affected area. The subconscious cannot tell the difference between a real event and a vividly imagined one. We "trick" the body into believing it is already healed.</span>
              </li>
              <li className="flex gap-4">
                <Check className="text-green-500 flex-shrink-0" />
                <span className="text-gray-700"><strong>Step 3: Chemical Cascade (Manifestation).</strong> Once the belief is planted, the brain releases dopamine, oxytocin, and growth hormones. These are the physical building blocks of recovery. This is how the tumor shrinks—not by magic, but by chemistry triggered by the mind.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Value Stack & Offer */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto border-4 border-blue-600 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-600 text-white px-8 py-2 font-bold transform rotate-45 translate-x-12 translate-y-6 shadow-md">
            SAVE $30
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-8">Get The Complete Healing Protocol</h2>
          
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="bg-blue-100 p-3 rounded-lg"><Shield className="text-blue-600" /></div>
              <div>
                <h3 className="font-bold text-lg">The "Miracle Recovery" Ebook</h3>
                <p className="text-gray-500 text-sm">Step-by-step guide to the exact diet and mental routine Arif used.</p>
              </div>
              <div className="ml-auto font-bold text-gray-400 line-through">$25.00</div>
            </div>
            
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="bg-blue-100 p-3 rounded-lg"><PlayCircle className="text-blue-600" /></div>
              <div>
                <h3 className="font-bold text-lg">Deep Healing Audio Therapy (MP3)</h3>
                <p className="text-gray-500 text-sm">Plug & play subconscious reprogramming for any disease.</p>
              </div>
              <div className="ml-auto font-bold text-gray-400 line-through">$20.00</div>
            </div>
            
             <div className="flex items-center gap-4 pb-4">
              <div className="bg-blue-100 p-3 rounded-lg"><MessageCircle className="text-blue-600" /></div>
              <div>
                <h3 className="font-bold text-lg">Priority WhatsApp Support</h3>
                <p className="text-gray-500 text-sm">Direct access to ask questions about your healing journey.</p>
              </div>
              <div className="ml-auto font-bold text-gray-400 line-through">$5.00</div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl text-center mb-8">
            <p className="text-gray-600 mb-2">Total Value: <span className="line-through">$50.00</span></p>
            <div className="text-5xl font-extrabold text-blue-600 mb-2">$20.00</div>
            <p className="text-red-500 font-bold uppercase text-sm animate-pulse">Offer Expires This Week!</p>
          </div>

          <button 
            id="buy-btn-2"
            onClick={scrollToPurchase}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            Yes, I Want To Heal Now <ArrowRight />
          </button>
          
          <p className="text-center text-gray-400 text-xs mt-4 flex items-center justify-center gap-2">
            <Shield size={12} /> Secure Payment via PayPal
          </p>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Stories From The Other Side</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Review 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex text-yellow-400 mb-4"><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /></div>
              <p className="text-gray-700 italic mb-4">"I had chronic autoimmune issues for 10 years. Doctors said I'd be on pills forever. After 3 weeks of listening to this audio, my inflammation markers dropped to zero. My doctor is baffled."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">SJ</div>
                <div>
                  <div className="font-bold">Sarah Jenkins</div>
                  <div className="text-xs text-green-600">Verified Purchase</div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex text-yellow-400 mb-4"><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /></div>
              <p className="text-gray-700 italic mb-4">"This isn't just a book, it's a lifeline. The audio therapy put me in a state of deep peace I haven't felt since I was a child. My tumor has shrunk by 40% in two months."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">MK</div>
                <div>
                  <div className="font-bold">Michael K.</div>
                  <div className="text-xs text-green-600">Verified Purchase</div>
                </div>
              </div>
            </div>
            
             {/* Review 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex text-yellow-400 mb-4"><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /></div>
              <p className="text-gray-700 italic mb-4">"I was skeptical about 'manifestation' but desperate. The science explained here makes sense. It's biological, not magic. And it works. Thank you Arif."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">DL</div>
                <div>
                  <div className="font-bold">David L.</div>
                  <div className="text-xs text-green-600">Verified Purchase</div>
                </div>
              </div>
            </div>

             {/* Review 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex text-yellow-400 mb-4"><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /><Star fill="currentColor" size={20} /></div>
              <p className="text-gray-700 italic mb-4">"Plug and play is right. I just put on my headphones before sleep. Woke up feeling energized for the first time in years."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">EM</div>
                <div>
                  <div className="font-bold">Elena M.</div>
                  <div className="text-xs text-green-600">Verified Purchase</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Money Back Guarantee - Fantastic Card */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-yellow-400 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 opacity-10 rounded-bl-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 opacity-10 rounded-tr-full pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-shrink-0 relative">
                <div className="w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                  <ShieldCheck size={80} className="text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <Check size={24} strokeWidth={3} />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">
                  100% Risk-Free Guarantee
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
                  "If this is BS or a SCAM, I want you to take your money back."
                </p>
                <div className="space-y-4 text-gray-600">
                  <p>
                    We are a <strong>worldwide community</strong> dedicated to guiding people through their darkest health challenges. We are not just a website; we are real people with real results.
                  </p>
                  <p className="font-semibold text-gray-800">
                    If you don't feel the shift in your energy within 30 days, we will refund 100% of your payment—no questions asked.
                  </p>
                </div>
                
                <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <Globe size={20} /> Worldwide Community
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <HeartHandshake size={20} /> You Are In Safe Hands
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-2">Will this work for my specific condition?</h3>
            <p className="text-gray-600">Yes. The mechanism of healing (Cellular Regeneration via Subconscious Reprogramming) is universal. Whether it's autoimmune, cancer, chronic pain, or mental health, the body knows how to heal itself once the mental block is removed.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-2">How do I access the audio?</h3>
            <p className="text-gray-600">Immediately after payment, you will be redirected to our WhatsApp support where we will send you the direct download links for the Ebook and Audio files.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-2">Is it safe?</h3>
            <p className="text-gray-600">100% safe. There are no side effects. It is a natural therapy using sound waves and guided cognition.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-900 text-white py-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Life is Worth More Than $20</h2>
        <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">Don't let another day go by living in fear. Take control of your biology today.</p>
        <button 
          id="buy-btn-3"
          onClick={scrollToPurchase}
          className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          Get Immediate Access
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>&copy; 2026 Elvision Health. All rights reserved.</p>
        <p className="mt-2 text-xs max-w-xl mx-auto">Disclaimer: This product is for educational and spiritual purposes. It is not a substitute for professional medical advice. Always consult with your physician.</p>
      </footer>
    </div>
  );
};

export default EbookHealthLP;