import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, User, CheckCircle, Star, ShieldCheck, PlayCircle, BookOpen, Headphones, Heart, Sparkles, Award, TrendingUp, Clock, Brain, Zap, Lock, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from '@/components/ui/toaster';
import { 
  initFacebookPixelWithLogging, 
  trackPageViewEvent, 
  trackViewContentEvent, 
  trackAddPaymentInfoEvent, 
  trackCustomEvent,
  AdvancedMatchingData,
  getFbcFbpCookies,
  waitForFbp
} from '@/utils/fbpixel';

// Countdown Timer Component
const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 15, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 0, minutes: 15, seconds: 0 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-3 text-center font-bold text-sm md:text-base animate-pulse">
            ✨ Special Offer Ends In: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </div>
    );
};

export default function USAEbookFeminineLanding() {
  const { toast } = useToast();
  const productNameBackend = 'usa_ebookfeminine'; // Assuming backend product name
  const displayProductName = 'Feminine Magnetism: Audio Hypnotherapy + Ebook';
  const originalPrice = 197;
  const productPrice = 20;
  const totalQuantity = 1;
  const totalAmount = productPrice;

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('PAYPAL');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const purchaseFiredRef = useRef(false);

  // Helper to send CAPI events
  const sendCapiEvent = async (eventName: string, eventData: any, eventId?: string) => {
    try {
      await waitForFbp();

      await supabase.auth.getSession();
      const body: any = {
        pixelId: '1393383179182528', // USA KAYA PIXEL
        eventName,
        customData: eventData,
        eventId: eventId,
        eventSourceUrl: window.location.href,
        testCode: 'testcode_usa' // UPDATED FOR USA TESTING
      };

      // Get FBC and FBP from cookies using the utility function
      const { fbc, fbp } = getFbcFbpCookies();

      const userData: any = {
        client_user_agent: navigator.userAgent,
      };

      // Prioritize form input email/phone/name
      let rawName = userName;
      if (userEmail) {
        userData.email = userEmail;
      }
      
      if (phoneNumber) {
        userData.phone = phoneNumber;
      }
      
      if (rawName) {
        const nameParts = rawName.trim().split(/\s+/);
        userData.fn = nameParts[0];
        if (nameParts.length > 1) {
          userData.ln = nameParts.slice(1).join(' ');
        }
      }

      if (fbc) userData.fbc = fbc;
      if (fbp) userData.fbp = fbp;
      
      body.userData = userData;

      console.log(`🚀 Sending CAPI Event: ${eventName}`, body);

      await supabase.functions.invoke('capi-universal', { body });
    } catch (err) {
      console.error('CAPI Error:', err);
    }
  };

  // Pixel Tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pixelId = '1393383179182528'; // USA KAYA PIXEL
      
      initFacebookPixelWithLogging(pixelId);
      
      const pageEventId = `pageview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      trackPageViewEvent({}, pageEventId, pixelId);

      const viewContentEventId = `viewcontent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      trackViewContentEvent({
        content_name: displayProductName,
        content_ids: [productNameBackend],
        content_type: 'product',
        value: productPrice,
        currency: 'USD'
      }, viewContentEventId, pixelId);
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const scrollToCheckout = () => {
    const checkoutSection = document.getElementById('checkout-section');
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCreatePayment = async () => {
    if (!userName || !userEmail) {
      toast({
        title: "Incomplete Data",
        description: "Please enter your name and email address.",
        variant: "destructive",
      });
      return;
    }

    if (!userEmail.includes('@')) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
    }

    setLoading(true);
    try {
      const addPaymentInfoEventId = `addpaymentinfo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const pixelId = '1393383179182528'; // USA KAYA PIXEL
      const userData: AdvancedMatchingData = {
        em: userEmail,
        fn: userName
      };

      // Track AddPaymentInfo
      trackAddPaymentInfoEvent({
        content_ids: [productNameBackend],
        content_type: 'product',
        value: totalAmount,
        currency: 'USD'
      }, addPaymentInfoEventId, pixelId, userData, 'testcode_usa');
      
      sendCapiEvent('AddPaymentInfo', {
        content_ids: [productNameBackend],
        content_type: 'product',
        value: totalAmount,
        currency: 'USD'
      }, addPaymentInfoEventId);

      const { fbc, fbp } = getFbcFbpCookies();

      const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
        body: {
          subscriptionType: productNameBackend,
          paymentMethod: 'PAYPAL', // Hardcoded to PAYPAL API trigger
          userName: userName,
          userEmail: userEmail,
          phoneNumber: phoneNumber || '0000000000', // Optional for PayPal usually, providing placeholder
          quantity: totalQuantity,
          productName: displayProductName,
          fbc,
          fbp
        }
      });

      if (error || !data?.success) {
        toast({
          title: "Payment Initialization Failed",
          description: data?.error || error?.message || "Could not connect to payment gateway.",
          variant: "destructive",
        });
        return;
      }

      if (data?.success && data?.checkoutUrl) {
        setPaymentData(data);
        // Redirect to PayPal via the URL returned by the backend API
        window.location.href = data.checkoutUrl;
      } else {
         toast({
          title: "Error",
          description: "No checkout URL received.",
          variant: "destructive",
        });
      }

    } catch (error: any) {
      console.error('Payment Error:', error);
      toast({
        title: "System Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Realtime Payment Listener
  useEffect(() => {
    if (!paymentData?.merchantRef) return;
    
    const channel = supabase
      .channel(`payment-${paymentData.merchantRef}`)
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
              title: "SUCCESS! Access Sent.",
              description: "Payment successful. Check your email for access to Audio & Ebook.",
              duration: 5000, 
              variant: "default"
          });
          
          // Use PayPal Order ID or Merchant Ref for deduplication
          const eventId = payload.new.tripay_reference || paymentData.merchantRef;
          
          // Using trackCustomEvent since trackPurchaseEvent is browser-only and we handle it via CAPI
          trackCustomEvent('Purchase', {
            content_name: displayProductName,
            content_ids: [productNameBackend],
            content_type: 'product',
            value: totalAmount,
            currency: 'USD'
          }, eventId, '1393383179182528');
          
          // FIRST-WIN DEDUPLICATION CHECK
          const isBackendCapiSent = payload.new?.capi_purchase_sent === true;
          
          if (isBackendCapiSent) {
             console.log(`⏭️ CAPI Purchase Skipped (Backend already sent)`);
          } else {
             // Send CAPI (Frontend wins)
             sendCapiEvent('Purchase', {
               content_ids: [productNameBackend],
               content_type: 'product',
               value: totalAmount,
               currency: 'USD'
             }, eventId);
          }
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [paymentData, userEmail]);

  return (
    <div className="min-h-screen bg-rose-50/30 font-sans text-slate-800">
      <Toaster />
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2c1a32] to-[#4a2c40] text-white pt-20 pb-28 px-4 text-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <svg width="100%" height="100%">
                <pattern id="sparkles" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#sparkles)" />
            </svg>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block px-4 py-1 bg-pink-500/20 border border-pink-400 text-pink-300 rounded-full text-sm font-bold tracking-wider mb-6 backdrop-blur-sm">
            FOR WOMEN WHO ARE TIRED OF CHASING
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 font-serif">
            Activate <span className="text-pink-400">Feminine Magnetism</span> & Make Him Obsessed Without Trying
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
            Stop being the "pursuer." Start being the "prize." The male psychology secret & feminine energy activation that makes you chased, cherished, and committed to—<span className="text-pink-300 font-semibold">by reprogramming your subconscious mind.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-pink-500/30 transition-all transform hover:-translate-y-1" onClick={scrollToCheckout}>
              YES, I'M READY TO BE A MAGNET
            </Button>
            <div className="flex flex-col items-center sm:items-start">
              <p className="text-sm text-gray-400">100% Money-Back Guarantee</p>
              <div className="flex text-pink-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN AGITATION SECTION - ENHANCED */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <Card className="border-4 border-rose-50 bg-white mb-16 shadow-none overflow-hidden rounded-[2rem]">
          <CardContent className="p-10 md:p-16 text-center">
            <div className="inline-block p-3 bg-rose-100 rounded-2xl mb-4">
              <AlertCircle className="w-10 h-10 text-rose-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1a32] font-serif mb-6 leading-tight">
              Does This Sound Like You?
            </h2>
            <p className="text-xl text-rose-600 font-medium max-w-3xl mx-auto leading-relaxed">
              You keep attracting the wrong men, repeating the same painful patterns—<span className="text-slate-900">because your conscious effort can't override your subconscious programming.</span>
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
                { 
                  title: "You're Always the 'Giver'", 
                  desc: "You text first, plan dates, make sacrifices—yet he pulls away. You're stuck in masculine energy (leading, controlling), which repels masculine men.",
                  pain: "The more you try, the less he tries. You feel invisible, taken for granted, like you're never enough."
                },
                { 
                  title: "You Attract Emotionally Unavailable Men", 
                  desc: "He's hot and cold. He breadcrumbs you. You're the 'placeholder' until someone 'better' comes along.",
                  pain: "Deep down, your subconscious believes 'I'm not worthy of real love'—so you settle for crumbs and call it connection."
                },
                { 
                  title: "You're Exhausted from Being 'Strong'", 
                  desc: "You're the boss at work, the problem-solver at home. You're so used to leading that you've lost your softness—the very quality that makes men want to protect and cherish you.",
                  pain: "You crave to be held, to surrender, to be the woman—but you don't know how to turn it off."
                },
                { 
                  title: "You've Tried Everything—Nothing Sticks", 
                  desc: "Therapy, dating coaches, self-help books. You understand it logically, but nothing changes. The same patterns repeat.",
                  pain: "Because your conscious understanding can't override subconscious beliefs formed in childhood. That's where the real block lives."
                }
            ].map((item, i) => (
                <Card key={i} className="border-2 border-rose-50 bg-white hover:border-rose-200 transition-all shadow-none">
                    <CardHeader className="pb-2">
                        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                            <Heart className="w-6 h-6 fill-current" />
                        </div>
                        <CardTitle className="text-2xl text-slate-900 font-serif font-bold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-slate-600 text-lg leading-relaxed font-light">{item.desc}</p>
                        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                          <p className="text-sm text-rose-900 font-semibold italic leading-relaxed">"{item.pain}"</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="bg-white rounded-[2rem] text-center border-4 border-rose-100 p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-rose-500"></div>
            <Brain className="w-16 h-16 mx-auto mb-6 text-rose-500" />
            <h3 className="text-3xl md:text-4xl font-bold mb-6 font-serif text-[#2c1a32]">Here's the Truth Most People Won't Tell You:</h3>
            <p className="text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto font-light text-slate-600">
              Your problem isn't that you're "not good enough." It's not even your behavior. <span className="text-rose-600 font-bold">It's your subconscious programming.</span> You can read 1,000 books, attend every workshop—but if your subconscious still believes "I'm unlovable," <span className="text-rose-500 font-bold underline decoration-2 underline-offset-4">your behavior will sabotage you every single time.</span>
            </p>
            <div className="mt-10 flex items-center justify-center gap-3 text-rose-600 bg-rose-50 py-4 px-8 rounded-full inline-flex mx-auto border border-rose-100">
              <Lock className="w-5 h-5" />
              <span className="font-bold tracking-wide uppercase text-xs md:text-sm">Your subconscious runs 95% of your life. Willpower is only 5%.</span>
            </div>
        </div>
      </section>

      {/* THE SOLUTION - SUBCONSCIOUS REPROGRAMMING */}
      <section className="bg-white py-20 px-6 border-y border-rose-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Zap className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c1a32] font-serif mb-4">
              The Only Solution: Rewire Your Subconscious
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <strong>Feminine Magnetism</strong> uses clinically-proven hypnotherapy to bypass your conscious resistance and install <em>new beliefs</em> directly into your subconscious—while you sleep.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-pink-900 mb-4 flex items-center gap-2">
                  <Brain className="w-7 h-7" /> 16 Years of Research, 7 Years of Success Stories
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We have developed this method for <strong>16 Years</strong> and it has been a proven success for the <strong>last 7 years</strong>. Our technology is designed to <strong>BYPASS your subconscious</strong>. Even if you try 1,000 times to convince your conscious mind, it does not work—the subconscious works in a completely different way.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-700 font-semibold">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>PLUG AND PLAY our technology to bypass your subconscious.</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700 font-semibold">
                    <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Money Back Guarantee - Zero risk to try.</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <PlayCircle className="w-6 h-6" /> Plug & Play Technology
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  No complicated rituals. No years of therapy. Just press play before bed. Your subconscious does the rest. Wake up different.
                </p>
              </div>
            </div>

            <div>
              <ul className="space-y-5">
                {[
                  { 
                    icon: Heart, 
                    title: "Erase 'I'm Not Worthy' Trauma", 
                    desc: "Delete childhood wounds that make you chase validation. Install deep self-love." 
                  },
                  { 
                    icon: Sparkles, 
                    title: "Activate 'The Prize' Energy", 
                    desc: "Shift from 'chaser' to 'chosen.' Men will sense you're different—and pursue you." 
                  },
                  { 
                    icon: TrendingUp, 
                    title: "Become Irresistibly Feminine", 
                    desc: "Trigger his hero instinct. Make him feel masculine, needed, and protective around you." 
                  },
                  { 
                    icon: Lock, 
                    title: "Attract Commitment Naturally", 
                    desc: "Stop begging for love. Your new frequency attracts men who are ready to commit." 
                  }
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="bg-pink-100 p-2 rounded-lg text-pink-600 flex-shrink-0">
                      <feat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 mb-1">{feat.title}</h5>
                      <p className="text-sm text-gray-600">{feat.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-24 px-6 max-w-5xl mx-auto bg-white rounded-3xl my-12 border border-rose-100">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2c1a32] font-serif">What's Inside Your Transformation Package</h2>
        <p className="text-center text-pink-600 font-medium mb-16 max-w-2xl mx-auto">Everything you need to reprogram your subconscious and become a magnet for high-quality men</p>
        
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start p-8 bg-white rounded-2xl border border-purple-100 hover:border-purple-300 transition-all">
                <div className="bg-purple-600 p-5 rounded-2xl text-white flex-shrink-0 shadow-lg shadow-purple-200">
                    <Headphones className="w-10 h-10" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-2xl font-bold text-slate-900">Audio #1: "Goddess Awakening" Sleep Hypnosis</h3>
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold tracking-widest uppercase">The Core</span>
                    </div>
                    <p className="text-slate-700 mb-4 text-lg leading-relaxed font-light"><strong>20-minute theta wave audio</strong> to listen before sleep. Dissolves limiting beliefs like "I'm not enough," "Men always leave," and "Love is hard." Installs new programming: "I am the prize," "I attract devotion effortlessly," "I am safe being soft and feminine."</p>
                    <div className="bg-purple-50/50 p-4 rounded-xl text-sm text-purple-900 border border-purple-100">
                      <strong>Why it works:</strong> Your subconscious is most receptive during sleep. This audio bypasses your critical mind and rewrites your relationship blueprint.
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start p-8 bg-white rounded-2xl border border-rose-100 hover:border-rose-300 transition-all">
                <div className="bg-rose-500 p-5 rounded-2xl text-white flex-shrink-0 shadow-lg shadow-rose-200">
                    <Sparkles className="w-10 h-10" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-2xl font-bold text-slate-900">Audio #2: "Morning Radiance" Activator</h3>
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-bold tracking-widest uppercase">The Boost</span>
                    </div>
                    <p className="text-slate-700 mb-4 text-lg leading-relaxed font-light"><strong>5-minute morning boost.</strong> Activates joy, playfulness, and magnetic energy. Men are biologically wired to pursue women who radiate happiness and ease—not stress and anxiety.</p>
                    <div className="bg-rose-50/50 p-4 rounded-xl text-sm text-rose-900 border border-rose-100">
                      <strong>The secret:</strong> When you're happy with yourself, you stop chasing. And that's when he starts chasing you.
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start p-8 bg-white rounded-2xl border border-blue-100 hover:border-blue-300 transition-all">
                <div className="bg-blue-500 p-5 rounded-2xl text-white flex-shrink-0 shadow-lg shadow-blue-200">
                    <BookOpen className="w-10 h-10" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-2xl font-bold text-slate-900">Ebook: "The Siren's Secret" (78 Pages)</h3>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold tracking-widest uppercase">The Guide</span>
                    </div>
                    <p className="text-slate-700 mb-4 text-lg leading-relaxed font-light">The psychology manual he'll never tell you. Learn how men think, why they pull away, and how to set boundaries that make him respect (and want) you more.</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <li className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>3 communication mistakes</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>The woman he fears losing</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>The art of receiving</span>
                      </li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-2xl shadow-xl text-center">
          <Award className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">BONUS: Lifetime Access + Free Updates</h3>
          <p className="text-green-100">Download once, keep forever. Plus get all future versions and upgrades at no extra cost.</p>
        </div>
      </section>

      {/* AFTER PURCHASE STEPS */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <Card className="border-4 border-rose-50 bg-white mb-16 shadow-none overflow-hidden rounded-[2rem]">
          <CardContent className="p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-[#2c1a32] font-serif mb-6 leading-tight">Your 6-Step Transformation Path</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">Here is exactly what happens from the moment you get access:</p>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Read the Siren's Secret",
              desc: "You'll finally understand why you've been attracting the wrong men. You'll learn the 'Frequency of Rejection' and how to turn it off instantly."
            },
            {
              step: "02",
              title: "Define Your Daily Practice",
              desc: "Follow the simple roadmap. You'll know exactly what small actions to take daily to stay in your feminine power without effort."
            },
            {
              step: "03",
              title: "The 15-Minute Protocol",
              desc: "Listen to the Morning and Night audios (15 mins each). This is the 'Heavy Lifting'—your subconscious does the work while you relax."
            },
            {
              step: "04",
              title: "The 7-Day Shift",
              desc: "After just one week of consistency, your subconscious begins to accept your new reality. You'll wake up feeling 'great' for no logical reason."
            },
            {
              step: "05",
              title: "Emotional Detox",
              desc: "The old negative 'pull' is gone. Anxiety, overthinking, and the need to chase simply disappear. You feel calm, centered, and worthy."
            },
            {
              step: "06",
              title: "Magnetic Manifestation",
              desc: "Suddenly, 'the one' appears. Whether it's a new high-quality man or a total shift in your current partner—the closer your frequency, the faster they arrive."
            }
          ].map((item, i) => (
            <Card key={i} className="border-2 border-rose-50 bg-white hover:border-rose-200 transition-all shadow-none relative pt-8">
              <div className="absolute -top-4 left-8 bg-rose-500 text-white font-black px-4 py-1 rounded-full text-sm">
                STEP {item.step}
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 font-serif font-bold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed font-light">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS - DETAILED */}
      <section className="bg-gradient-to-b from-white to-pink-50 py-20 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2c1a32] font-serif">Real Women, Real Transformations</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Over 12,000+ women have reprogrammed their subconscious and attracted the love they deserve</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    {
                        name: "Sarah M., 28", 
                        role: "Marketing Manager, NYC",
                        text: "I used to be the 'cool girl' who never asked for what I wanted. I was terrified of seeming needy. After 2 weeks of the sleep audio, something shifted. I stopped texting my ex first. I stopped apologizing for having standards. And guess what? He came back begging. But by then, I had already attracted someone who treats me like a queen. This program saved me YEARS of heartbreak.",
                        avatar: "S",
                        result: "Manifested committed relationship in 6 weeks",
                        stars: 5
                    },
                    {
                        name: "Dinda K., 31", 
                        role: "Entrepreneur, LA",
                        text: "I'm a CEO. I'm used to being in control. But in my love life, that energy was repelling men. They'd say I was 'intimidating' or 'too independent.' The audio helped me tap into my feminine side without losing my power. Now my boyfriend tells me he feels like a man around me—he opens doors, plans dates, and just proposed last month. I didn't have to change who I am. I just had to change my ENERGY.",
                        avatar: "D",
                        result: "Engaged after 8 months",
                        stars: 5
                    },
                    {
                        name: "Bella R., 25", 
                        role: "Content Creator, Miami",
                        text: "I kept attracting narcissists and fuckboys. I thought I was cursed. Turns out, my subconscious believed 'love = drama.' The ebook explained WHY I was attracting these men (daddy issues lol). And the hypnosis literally deleted that pattern. I can't even explain it—I just stopped being attracted to toxic guys. Now I'm dating a man who's stable, kind, and obsessed with me. It's like I unlocked a cheat code.",
                        avatar: "B",
                        result: "Broke toxic cycle, found healthy love",
                        stars: 5
                    },
                    {
                        name: "Jennifer L., 34",
                        role: "Nurse, Chicago",
                        text: "After my divorce, I was so closed off. I told myself I didn't need anyone. But deep down, I was terrified of being hurt again. This program taught me that being vulnerable isn't weakness—it's magnetic. The morning audio gave me the courage to go on dates again. I met my current partner 3 months later. He says my energy is 'addictive.' I finally feel seen and safe.",
                        avatar: "J",
                        result: "Healed from divorce, remarried",
                        stars: 5
                    },
                    {
                        name: "Amanda T., 29",
                        role: "Teacher, Boston",
                        text: "I was the girl who always got ghosted. I'd overanalyze every text, every look. The anxiety was eating me alive. The sleep hypnosis was like therapy on steroids. It addressed the ROOT—my fear of abandonment from childhood. After 3 weeks, I stopped being desperate for validation. I became the prize. And suddenly, men were chasing ME. It's wild how fast it works when you go straight to the subconscious.",
                        avatar: "A",
                        result: "No longer anxiously attached",
                        stars: 5
                    },
                    {
                        name: "Emily S., 32",
                        role: "Designer, Austin",
                        text: "I've spent thousands on therapy and dating coaches. They helped, but this $20 program did more in 30 days than 2 years of talk therapy. Why? Because it doesn't just tell you what's wrong—it FIXES it while you sleep. I wake up feeling different. Men treat me different. I even got a raise at work because my boss said I seem 'more confident.' If you're skeptical, just try it. You have nothing to lose except your limiting beliefs.",
                        avatar: "E",
                        result: "More confidence in all areas of life",
                        stars: 5
                    }
                ].map((testi, i) => (
                    <Card key={i} className="bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-md">
                                {testi.avatar}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{testi.name}</h4>
                                <p className="text-xs text-slate-500">{testi.role}</p>
                            </div>
                        </div>
                        <div className="flex text-yellow-400 mb-3">
                          {[...Array(testi.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-slate-700 italic mb-4 leading-relaxed">"{testi.text}"</p>
                        <div className="bg-green-50 p-3 rounded-lg border-l-2 border-green-400">
                          <p className="text-xs font-semibold text-green-800 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> {testi.result}
                          </p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* WHY BUY NOW - URGENCY & SCARCITY */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-serif">Why You Need to Act NOW</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Every day you wait is another day stuck in the same painful pattern</p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-red-500">
              <Clock className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-red-400">Stop Wasting YEARS</h3>
              <p className="text-gray-300 leading-relaxed">
                The average woman spends <strong>3-7 years</strong> trying to "figure out" why relationships don't work. Therapy, books, workshops—you're searching for the root cause. 
                <span className="block mt-3 text-white font-semibold">We already found it for you: your subconscious. This program gives you the shortcut.</span>
              </p>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-orange-500">
              <Heart className="w-12 h-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-orange-400">Protect Your Mental Health</h3>
              <p className="text-gray-300 leading-relaxed">
                How many more times will you attract the <strong>same type of wrong man?</strong> Narcissists, emotionally unavailable, commitment-phobes. 
                <span className="block mt-3 text-white font-semibold">Each toxic relationship chips away at your self-worth. Break the cycle NOW before more damage is done.</span>
              </p>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-green-500">
              <Award className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-green-400">16 Years Research + 7 Years Proven</h3>
              <p className="text-gray-300 leading-relaxed">
                This isn't some trendy TikTok advice. This is <strong>science-backed subconscious reprogramming</strong> perfected over 16 years by eL Vision Group.
                <span className="block mt-3 text-white font-semibold">12,000+ success stories. You just need to plug & play.</span>
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-10 rounded-2xl text-center shadow-2xl">
            <h3 className="text-3xl font-bold mb-6">A Simple Question For You:</h3>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-10">
               <div className="w-full max-w-[300px] aspect-square rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-black">
                  <video 
                    src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/ugc1.mp4" 
                    poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/ugc1.jpg" 
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
               </div>
               <div className="w-full max-w-[300px] aspect-square rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-black">
                  <video 
                    src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/ugc2.mp4" 
                    poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/ugc2.jpg" 
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
               </div>
            </div>

            <p className="text-2xl mb-8 leading-relaxed">
              Is your heart, your future of love, your peace of mind worth <strong className="underline decoration-4">less than a lunch?</strong>
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl max-w-2xl mx-auto">
              <p className="text-xl mb-4">You'll spend $20 on:</p>
              <div className="grid grid-cols-2 gap-4 text-left text-lg">
                <div>✓ A restaurant meal (gone in 1 hour)</div>
                <div>✓ Movie tickets (2 hours of entertainment)</div>
                <div>✓ Coffee for a week</div>
                <div>✓ One cocktail at a bar</div>
              </div>
              <p className="text-2xl font-bold mt-6 text-yellow-300">But you won't invest $20 in LIFELONG love & happiness?</p>
            </div>
            <Button size="lg" className="mt-8 bg-white text-pink-600 hover:bg-gray-100 font-bold text-xl px-10 py-7 rounded-full shadow-xl transform hover:scale-105 transition-all" onClick={scrollToCheckout}>
              YES, I VALUE MY FUTURE - GET ACCESS NOW
            </Button>
          </div>
        </div>
      </section>

      {/* GUARANTEE SECTION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <ShieldCheck className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#2c1a32] font-serif">
            100% Money-Back Guarantee
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
            Listen to the audios for 30 days. Read the ebook. Apply the principles. If you don't feel a shift in your energy, your confidence, or the quality of men you attract—<strong>we'll refund every penny. No questions asked.</strong>
          </p>
          <div className="bg-green-50 border-2 border-green-300 p-6 rounded-xl inline-block">
            <p className="text-green-900 font-bold text-lg">
              You literally have ZERO risk. The only risk is staying stuck in your current pattern.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-[#2c1a32] font-serif">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">How long until I see results?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Most women report a noticeable mental shift (more calm, confident, at peace) within 5-10 days. Changes in relationship dynamics typically appear after 21 days of consistent listening. Remember: you're rewiring decades of subconscious programming. Give it time—but it works MUCH faster than years of therapy.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">Is hypnotherapy safe? Will I lose control?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Absolutely safe. Hypnotherapy is a clinically-proven relaxation technique used by therapists worldwide. You remain fully aware and in control—you're simply in a deeply relaxed state where your subconscious is more receptive to positive suggestions. No mysticism, just neuroscience.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">Will this make me manipulative or "playing games"?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        NO. Being "High Value" doesn't mean playing games or being fake. It means genuinely valuing yourself so highly that you don't settle, chase, or beg for love. When you radiate self-worth, healthy men are naturally attracted. Toxic men self-select OUT. You're not manipulating anyone—you're becoming authentic.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">What if I'm not in a relationship right now?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Even better! This program is PERFECT for single women. You'll reprogram your subconscious BEFORE attracting your next partner—meaning you'll attract a high-quality man from day one instead of repeating old patterns. Prevention is better than cure.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">How is this different from other programs?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        Most programs target your conscious mind (advice, strategies, tips). But your conscious mind only controls 5% of your behavior. This program goes straight to your SUBCONSCIOUS (95% of behavior) using theta-wave hypnotherapy. That's why it works when everything else fails.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6" className="bg-white px-4 rounded-lg border border-gray-200">
                    <AccordionTrigger className="text-slate-900 font-semibold">Can I listen during the day or only at night?</AccordionTrigger>
                    <AccordionContent className="text-slate-700">
                        The "Goddess Awakening" audio is designed for nighttime (before sleep) when your brain naturally enters theta state. The "Morning Radiance" booster is for daytime. For best results, use both daily. Consistency = transformation.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </section>

      {/* CHECKOUT FORM SECTION */}
      <section id="checkout-section" className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-pink-200 shadow-2xl overflow-hidden rounded-2xl bg-white text-slate-900">
                <CountdownTimer />
                <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-8 text-center">
                    <h2 className="text-3xl font-bold mb-2 font-serif">SECURE YOUR TRANSFORMATION</h2>
                    <p className="opacity-90 text-lg">Your future self will thank you</p>
                </div>
                
                <CardContent className="p-6 md:p-10 space-y-10 bg-white">
                    {/* PRICING BOX */}
                    <div className="bg-pink-50 border-2 border-pink-100 rounded-xl p-6 text-center shadow-sm">
                        <p className="text-slate-500 text-sm mb-1">Regular Price</p>
                        <p className="text-xl text-slate-400 line-through decoration-rose-500 decoration-2 mb-2">{formatCurrency(originalPrice)}</p>
                        <p className="text-pink-900 font-bold mb-1">Limited-Time Special:</p>
                        <p className="text-4xl font-extrabold text-pink-600">{formatCurrency(productPrice)}</p>
                        <div className="mt-4 flex flex-col items-center gap-2 text-sm text-green-700 font-medium">
                            <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Save 90% • Lifetime Access
                            </div>
                            <div className="flex items-center gap-1 text-blue-700">
                                <ShieldCheck className="w-4 h-4" /> 30-Day Money-Back Guarantee
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-200" />

                    {/* FORM INPUTS */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                            <User className="w-5 h-5 text-pink-600" /> Your Information
                        </h3>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="name" className="text-slate-700 font-semibold mb-1 block">Full Name *</Label>
                                <Input 
                                    id="name" 
                                    autoComplete="name"
                                    placeholder="e.g., Sarah Johnson" 
                                    value={userName} 
                                    onChange={(e) => setUserName(e.target.value)} 
                                    className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-pink-500 h-12"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email" className="text-slate-700 font-semibold mb-1 block">Email Address * <span className="text-xs text-gray-500">(Access sent here)</span></Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        autoComplete="email"
                                        placeholder="your@email.com" 
                                        value={userEmail} 
                                        onChange={(e) => setUserEmail(e.target.value)} 
                                        className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-pink-500 h-12"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="text-slate-700 font-semibold mb-1 block">Phone Number (Optional)</Label>
                                    <Input 
                                        id="phone" 
                                        type="tel" 
                                        autoComplete="tel"
                                        placeholder="(555) 123-4567" 
                                        value={phoneNumber} 
                                        onChange={(e) => setPhoneNumber(e.target.value)} 
                                        className="bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-pink-500 h-12"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-200" />

                    {/* PAYMENT METHOD */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                            <CreditCard className="w-5 h-5 text-pink-600" /> Payment Method
                        </h3>
                        <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="grid grid-cols-1 gap-4">
                            <Label className={`flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === 'PAYPAL' ? 'border-pink-600 bg-pink-50 shadow-md ring-1 ring-pink-600' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}>
                                <RadioGroupItem value="PAYPAL" id="PAYPAL" className="mt-1 mr-4 border-slate-400 text-pink-600" />
                                <div className="flex-1">
                                    <div className="font-bold text-slate-900 text-lg">PayPal</div>
                                    <div className="text-sm text-slate-600">Fast & secure checkout with PayPal balance or cards</div>
                                </div>
                            </Label>
                        </RadioGroup>
                    </div>

                </CardContent>

                <CardFooter className="p-8 bg-slate-50 flex flex-col gap-4 border-t border-slate-200">
                    <Button 
                        size="lg" 
                        className="w-full text-xl py-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-white"
                        onClick={handleCreatePayment}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : `PAY WITH PAYPAL - ${formatCurrency(productPrice)}`}
                    </Button>
                    <div className="flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-green-600" /> SSL Encrypted
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-blue-600" /> Instant Digital Delivery
                        </div>
                        <div className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-purple-600" /> 100% Secure
                        </div>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-2">
                      By purchasing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </CardFooter>
            </Card>

            {/* TRUST BADGES */}
            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div>
                <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">Secure Payment</p>
              </div>
              <div>
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">12,000+ Happy Clients</p>
              </div>
              <div>
                <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">Lifetime Access</p>
              </div>
            </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-[#2c1a32] to-[#4a2c40] text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">Your Next Chapter Starts Today</h2>
          <p className="text-xl mb-8 text-gray-300 leading-relaxed">
            You're one decision away from a completely different love life. No more chasing. No more heartbreak. No more settling.
          </p>
          <p className="text-2xl font-bold text-pink-300 mb-8">
            Just magnetic, effortless, soul-deep love.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xl px-10 py-7 rounded-full shadow-xl transform hover:scale-105 transition-all" onClick={scrollToCheckout}>
            CLAIM YOUR POWER NOW
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1a1a1a] text-white py-12 text-center text-sm">
        <p className="mb-4">© 2026 eL Vision Group. All Rights Reserved.</p>
        <p className="text-gray-500 max-w-2xl mx-auto">
            Disclaimer: This program is a psychological self-development tool. Results may vary by individual. 
            This is not a substitute for professional therapy or medical advice. 16 years of research, 7 years of proven client transformations.
        </p>
        <div className="mt-6 flex justify-center gap-6 text-gray-400 text-xs">
          <a href="#" className="hover:text-pink-400">Terms of Service</a>
          <a href="#" className="hover:text-pink-400">Privacy Policy</a>
          <a href="#" className="hover:text-pink-400">Refund Policy</a>
          <a href="#" className="hover:text-pink-400">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}
