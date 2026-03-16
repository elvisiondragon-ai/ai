import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Shield, Sparkles, MessageCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { 
  initFacebookPixelWithLogging, 
  trackCustomEvent, 
  trackAddPaymentInfoEvent,
  trackPageViewEvent,
  AdvancedMatchingData,
  getFbcFbpCookies
} from '@/utils/fbpixel';

export default function Pay3000() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // CAPI Configuration
  const CAPI_EDGE_FUNCTION_URL = 'https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/capi-universal';
  const PIXEL_ID = '1393383179182528';

  // Helper to send CAPI events
  const sendCAPIEvent = async (eventName: string, userData: any = {}, customData: any = {}, eventId?: string) => {
    try {
      const { fbc, fbp } = getFbcFbpCookies();

      // 🧠 NAME SPLITTING LOGIC
      let fn = userData.fn;
      let ln = userData.ln;
      
      // If we don't have explicit fn/ln, try to derive from email or userData
      let rawName = userData.fn || (userData.email ? userData.email.split('@')[0] : undefined);
      
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

      await fetch(CAPI_EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pixelId: PIXEL_ID,
          eventName,
          userData: {
             ...userData,
             fn,
             ln,
             db_id,
             fbp,
             fbc,
             client_user_agent: navigator.userAgent
          },
          customData,
          eventId
        }),
      });
    } catch (e) {
      console.error('CAPI Error:', e);
    }
  };

  useEffect(() => {
    initFacebookPixelWithLogging(PIXEL_ID);
    const eventId = `pageview-${Date.now()}`;
    trackPageViewEvent({}, eventId, PIXEL_ID);
  }, []);

  const handlePurchase = async () => {
    if (!email || !email.includes('@')) {
      alert("Please enter a valid email address first to proceed with payment.");
      const emailInput = document.getElementById('email-input-final');
      if (emailInput) emailInput.focus();
      return;
    }

    try {
      setLoading(true);
      
      const eventId = crypto.randomUUID();
      const userData: AdvancedMatchingData = {
        em: email
      };

      const eventData = {
        content_name: 'EL Vision 3000 Coaching',
        value: 3000.00,
        currency: 'USD'
      };

      // 1. Track AddPaymentInfo (User provided email and intent)
      trackAddPaymentInfoEvent(eventData, eventId, PIXEL_ID, userData, 'testcode_usa');

      // 2. Track InitiateCheckout
      trackCustomEvent('InitiateCheckout', eventData, eventId, PIXEL_ID, userData, 'testcode_usa');

      // 3. Send CAPI (InitiateCheckout)
      sendCAPIEvent('InitiateCheckout', {
        email: email
      }, eventData, eventId);

      const { fbc, fbp } = getFbcFbpCookies();

      // Create Payment
      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: "usa_3000",
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

      // Redirect
      window.location.href = data.checkoutUrl;

    } catch (err) {
      alert("Payment Error: " + (err instanceof Error ? err.message : "Unknown error"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-8" />
            
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Secure Your Spot
              </span>
            </h2>

            <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500/30 rounded-2xl p-8 mb-12 text-left">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">What You Get in 6 Weeks</h3>
                
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-lg font-bold text-yellow-400">Personal Meditation Session</p>
                            <p className="text-gray-300">60 minutes per week for 6 weeks. Direct 1:1 guidance.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-lg font-bold text-yellow-400">Daily Agenda & Recalibration</p>
                            <p className="text-gray-300">Daily tasks to do and write to recalibrate your internal state.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-lg font-bold text-yellow-400">Proven Results</p>
                            <p className="text-gray-300">Normally in 2 weeks most clients feel the big difference.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-10 backdrop-blur-sm mb-12">
              <div className="text-5xl font-bold text-yellow-400 mb-3">$3,000</div>
              <div className="text-sm text-yellow-500 font-bold mb-6 uppercase tracking-wider">Premium 1:1 Coaching Enrollment</div>

              <div className="flex items-center gap-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div className="text-left text-sm text-gray-300">
                  <span className="font-bold text-blue-400 block mb-1 uppercase tracking-wider">Money Back Guarantee</span>
                  Based on internal client feedback, the vast majority experience positive progress early in the process.
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4 mb-8 max-w-md mx-auto">
                <input
                    id="email-input-final"
                    type="email"
                    placeholder="Enter your email to proceed..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-full border border-gray-700 bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none text-lg text-center text-white placeholder-gray-500 transition-all shadow-inner"
                />
                
                <button
                    onClick={handlePurchase}
                    disabled={loading}
                    className="w-full group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold text-xl px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/50 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                    <span className="animate-pulse">Processing...</span>
                    ) : (
                    <>
                        <img src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-color.svg" alt="PayPal" className="w-6 h-6" />
                        PAY COACHING ($3000)
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </>
                    )}
                </button>

                {/* Crypto Payment Options */}
                <div className="w-full mt-6 pt-6 border-t border-gray-800">
                    <h4 className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider text-center">Or Pay via Crypto</h4>
                    
                    <div className="space-y-4">
                        {/* Bitcoin */}
                        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">₿</div>
                                    <span className="font-bold text-white">Bitcoin (BTC)</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText("1HkjTQ1tV619v1b3K9s49T8GNkKxjhoCTb");
                                        alert("Bitcoin Wallet Copied!");
                                    }}
                                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors border border-gray-600"
                                >
                                    Copy Address
                                </button>
                            </div>
                            <code className="block w-full bg-black/50 p-3 rounded text-xs text-gray-400 font-mono break-all border border-gray-800">
                                1HkjTQ1tV619v1b3K9s49T8GNkKxjhoCTb
                            </code>
                        </div>

                        {/* USDT */}
                        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-xs">₮</div>
                                    <span className="font-bold text-white">USDT (BEP20/ERC20)</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText("0x900e0c82489accf05ec95a184169191bb5928df7");
                                        alert("USDT Wallet Copied!");
                                    }}
                                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors border border-gray-600"
                                >
                                    Copy Address
                                </button>
                            </div>
                            <code className="block w-full bg-black/50 p-3 rounded text-xs text-gray-400 font-mono break-all border border-gray-800">
                                0x900e0c82489accf05ec95a184169191bb5928df7
                            </code>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                        After crypto payment, please contact support with transaction hash/screenshot for manual verification.
                    </p>

                    <button
                        onClick={() => {
                            if (!email || !email.includes('@')) {
                                alert("Please enter your email address first so we can identify your payment.");
                                document.getElementById('email-input-final')?.focus();
                                return;
                            }
                            const message = encodeURIComponent(`Hello, I have paid the $1500 VIP 6 Weeks coaching via Crypto.\n\nEmail: ${email}\n\nPlease verify my payment.`);
                            window.open(`https://wa.me/62895325633487?text=${message}`, '_blank');
                        }}
                        className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02]"
                    >
                        <MessageCircle className="w-6 h-6" />
                        I HAVE PAID (CONFIRM VIA WHATSAPP)
                    </button>
                </div>
               </div>
            </div>

             <p className="text-gray-500 text-sm">
              Limited slots. We only work with those serious about deep transformation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
