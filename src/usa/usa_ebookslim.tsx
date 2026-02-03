import { useState, useEffect, useRef } from 'react';
import { 
  TrendingDown, Frown, RotateCcw, Brain, Lightbulb, Heart, 
  Sparkles, Target, Dumbbell, Award, AlertCircle, 
  BookOpen, Star, Quote, Zap, Clock, Shield, Check, HelpCircle, 
  Mail
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _fbq: Array<any>;
  }
}

// Moved from inside component to top level for stability
const PIXEL_ID = '1393383179182528'; 

import {
  initFacebookPixelWithLogging,
  trackPageViewEvent,
  trackViewContentEvent,
  trackAddPaymentInfoEvent,
  trackPurchaseEvent,
  AdvancedMatchingData,
  getFbcFbpCookies,
  waitForFbp
} from '@/utils/fbpixel';


export default function SlimPage() {
  const { toast } = useToast();
  
  // Payment State
  const productNameBackend = 'usa_ebookslim';
  const displayProductName = 'Slim Without Suffering: Ebook Program';
  const productPrice = 20; // Assuming USD
  const totalQuantity = 1;
  const totalAmount = productPrice;

  const [userEmail, setUserEmail] = useState('');
  
  const [paymentData, setPaymentData] = useState<any>(null);
  const purchaseFiredRef = useRef(false);

  // Helper to send CAPI events
  const sendCapiEvent = async (eventName: string, eventData: any, eventId?: string) => {
    try {
      // ⏳ Wait for FBP
      await waitForFbp();

      const body: any = {
        pixelId: PIXEL_ID,
        eventName,
        customData: eventData,
        eventId: eventId,
        eventSourceUrl: window.location.href,
        testCode: 'testcode_usa'
      };

      // 🧠 NAME SPLITTING LOGIC
      let fn = undefined;
      let ln = undefined;
      let rawName = undefined;

      if (userEmail) {
        rawName = userEmail.split('@')[0];
      }

      if (rawName) {
        const parts = rawName.trim().split(/\s+/);
        fn = parts[0];
        if (parts.length > 1) ln = parts.slice(1).join(' ');
      }

      const { fbc, fbp } = getFbcFbpCookies();
      const userData: any = { 
        client_user_agent: navigator.userAgent,
        fn,
        ln,
        fbc,
        fbp
      };

      if (userEmail) userData.email = userEmail;

      body.userData = userData;
      await supabase.functions.invoke('capi-universal', { body });
    } catch (err) {
      console.error('Failed to send CAPI event:', err);
    }
  };

  // Pixel Tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initFacebookPixelWithLogging(PIXEL_ID);
      
      const pageEventId = `pageview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      trackPageViewEvent({}, pageEventId, PIXEL_ID);

      const viewContentEventId = `viewcontent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      trackViewContentEvent({
        content_name: displayProductName,
        content_ids: [productNameBackend],
        content_type: 'product',
        value: productPrice,
        currency: 'USD'
      }, viewContentEventId, PIXEL_ID);
    }
  }, []);

  const scrollToCheckout = () => {
    const checkoutSection = document.getElementById('checkout-section');
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCreatePayment = async () => {
    if (!userEmail || !userEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address to receive your files.",
        variant: "destructive",
      });
      return;
    }

    const derivedUserName = userEmail.split('@')[0];

        try {
          const addPaymentInfoEventId = `addpaymentinfo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          const userData = { em: userEmail };
    
          const eventData = {
            content_ids: [productNameBackend],
            content_type: 'product',
            value: totalAmount,
            currency: 'USD'
          };
    
          // Track AddPaymentInfo
          trackAddPaymentInfoEvent(eventData, addPaymentInfoEventId, PIXEL_ID, userData, 'testcode_usa');
          sendCapiEvent('AddPaymentInfo', eventData, addPaymentInfoEventId);
    
          const { fbc, fbp } = getFbcFbpCookies();
    
          // Create Payment via Supabase function
          const { data, error } = await supabase.functions.invoke('tripay-create-payment', {
            body: {
              subscriptionType: productNameBackend,
              paymentMethod: 'PAYPAL', 
              userName: derivedUserName,
              userEmail: userEmail,
              phoneNumber: '0000000000', // Placeholder
              quantity: totalQuantity,
              productName: displayProductName,
              fbc,
              fbp
            }
          });
    
          if (error || !data?.success) {
            toast({
              title: "Failed to Process",
              description: data?.error || error?.message || "System error occurred.",
              variant: "destructive",
            });
            return;
          }
    
          if (data?.success && data?.checkoutUrl) {
            setPaymentData(data);
            // For PayPal, we expect a redirect URL
            window.location.href = data.checkoutUrl;
          } else {
            toast({
              title: "Payment Initialization Failed",
              description: "Could not get checkout URL from payment gateway.",
              variant: "destructive",
            });
          }
        } catch (error: any) {
          console.error('Payment Error:', error);
          toast({
            title: "Error",
            description: "Failed to contact payment server.",
            variant: "destructive",
          });
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
              description: "Payment successful. Check your email for access to your Ebook.",
              duration: 5000, 
              variant: "default"
          });
          
          const eventId = payload.new.tripay_reference || paymentData.merchantRef;
          const userData: AdvancedMatchingData = { em: userEmail };
          
          trackPurchaseEvent({
            content_ids: [productNameBackend],
            content_type: 'product',
            value: totalAmount,
            currency: 'USD'
          }, eventId, PIXEL_ID, userData, 'testcode_usa');
          
          // FIRST-WIN DEDUPLICATION CHECK
          const isBackendCapiSent = payload.new?.capi_purchase_sent === true;
          
          if (isBackendCapiSent) {
             console.log(`⏭️ CAPI Purchase Skipped (Backend already sent)`);
          } else {
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

  // Hero component logic
  // const scrollToPricing = () => {
  //   document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  // };

  // Problem component logic
  const problems = [
    {
      icon: TrendingDown,
      title: "Conventional Diets Trigger Hunger Hormones",
      description: "Restricting food increases Ghrelin and Cortisol, causing the body to store fat as a survival response."
    },
    {
      icon: Frown,
      title: "The Cursed Pressure",
      description: "Resisting cravings creates psychological pressure that makes you want to eat more. It's not about willpower, but a flawed system."
    },
    {
      icon: RotateCcw,
      title: "The Discouraging Yo-Yo Effect",
      description: "Lose 5 kg, gain 7 kg. This cycle damages your metabolism and self-confidence."
    }
  ];

  // Solution component logic
  const principles = [
    {
      icon: Brain,
      title: "Body Weight = Mental Identity",
      description: "Your body is just a reflection of your subconscious identity. Change the 'mental blueprint', and the body will follow automatically."
    },
    {
      icon: Lightbulb,
      title: "Alpha/Theta Brainwaves",
      description: "Use neuroscience to plant positive suggestions when the brain is most receptive (meditation & sleep)."
    },
    {
      icon: Heart,
      title: "Joyful Movement, Not Torture",
      description: "Enjoyable movement activates dopamine (the happy hormone), not cortisol (the stress hormone)."
    }
  ];

  // Contents component logic
  const chapters = [
    {
      icon: Sparkles,
      number: "CHAPTER 1",
      title: "Cheat Codes & Suggestion Shortcuts",
      description: "The secrets of mind programmers to cut years of process into weeks. Suggestion techniques used by Olympic athletes.",
      highlights: ["Quick auto-suggestion techniques", "Ready-to-use affirmation scripts", "Optimal timing for reprogramming"]
    },
    {
      icon: Brain,
      number: "CHAPTER 2",
      title: "The Mental Mirror - Changing Identity",
      description: "Learn how subconscious identity works and how your body is a direct reflection of your internal self-image.",
      highlights: ["The 'Set Point' weight concept", "How to change the mental blueprint", "Identity shift visualization exercises"]
    },
    {
      icon: Target,
      number: "CHAPTER 3",
      title: "The Abundance Release Method™",
      description: "A revolutionary 3-step technique: Imagine → Release → Feel. This method combines neuroscience with modern manifestation principles.",
      highlights: ["Daily step-by-step guide", "Best practice times (Alpha/Theta state)", "Common mistakes & how to avoid them"]
    },
    {
      icon: Dumbbell,
      number: "CHAPTER 4",
      title: "Joyful Movement - Movement Without Force",
      description: "Forget torturous gym sessions. Find movements you enjoy and activate the 'Abundance Loop' - the more you enjoy, the more consistent, the slimmer you get.",
      highlights: []
    },
    {
      icon: Award,
      number: "CHAPTER 5",
      title: "Permanent Consistency & Anna's Success Story",
      description: "A real case study: How Anna (35, mother of 2) lost 18 kg without a strict diet and even got a promotion thanks to her new confidence.",
      highlights: []
    }
  ];

  // Pricing component logic - this will be replaced with the checkout form
  const features = [
    "5 Comprehensive Chapters (120+ pages)",
    "Case Study (Complete Timeline)",
    "Lifetime Access",
    "30-Day Money-Back Guarantee"
  ];
  // const handleCTA = () => {
  //   window.location.href = '/slim/co'; // This will be removed
  // };

  // useEffect(() => {
  //   initAndTrackPixel(); // This will be replaced by the more detailed pixel tracking
  // }, []);

  // FAQ component logic
  const faqs = [
    {
      question: "Is this method suitable for me if I've failed at many diets?",
      answer: "This method is designed for you! If conventional diets failed, it's not because you're weak, but because the method works against the brain. The Mental Abundance Method focuses on mental reprogramming, not 'starving yourself' - so no more yo-yo effect."
    },
    {
      question: "How long until I see results?",
      answer: "Everyone is different, but most users report a mindset change in the first 2-3 weeks (calmer, no food cravings), and visible weight loss in the 2nd month. Anna in the case study lost 18 kg in 8 months consistently without a yo-yo effect."
    },
    {
      question: "Does this include a diet plan or meal menu?",
      answer: "No. This is a mental reprogramming method. We don't provide a diet menu because our philosophy is 'Intuitive Eating' - eat what your body asks for, but from a changed mental identity. You will naturally choose healthier foods."
    },
    {
      question: "How do I access the e-book after purchase?",
      answer: "After successful payment, you will immediately receive an email with a download link for the e-book (PDF). Lifetime access, downloadable to any device."
    },
    {
      question: "Are there any special requirements? Age? Health conditions?",
      answer: "This method is safe for all ages (18+). However, if you have special medical conditions (diabetes, eating disorders, etc.), please consult your doctor before starting any weight loss program."
    },
    {
      question: "What if I'm not satisfied?",
      answer: "We offer a 30-day money-back guarantee, no questions asked. If you feel this method isn't for you, just send an email and we'll process a 100% refund."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10" />
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full border border-accent/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Revolutionary Neuroscience-Based Method</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-foreground">Slim Without</span>
              <br />
              <span className="text-white">
                Suffering
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Change Your Mind, Change Your Body with the <span className="font-semibold text-primary">Mental Abundance Method</span>
            </p>

            {/* Pain Point */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)] max-w-2xl mx-auto">
              <p className="text-lg text-foreground leading-relaxed">
                Tired of yo-yo dieting? Fed up with enduring hunger and grueling workouts that don't last?
                <span className="font-semibold text-primary"> It's time to change the game.</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Button
                              size="lg"
                              onClick={scrollToCheckout}
                              className="bg-emerald-500 text-white px-8 py-6"
                            >
                              Get It Now
                            </Button>              
            </div>

            {/* Trust Badge */}
            <p className="text-sm text-muted-foreground pt-4">
              🔒 100% Secure • Instant Access • Money-Back Guarantee
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Why Do Diets Always Fail?</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                The Real Problem Isn't in
                <span className="text-primary"> Your Body</span>
              </h2>
              
              <p className="text-xl text-muted-foreground">
                Neuroscience research proves: 95% of conventional diets fail within 2 years. Not because you're weak, but because the methods work against human brain function.
              </p>
            </div>

            {/* Problem Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {problems.map((problem, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <problem.icon className="w-6 h-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{problem.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                </div>
              ))}
            </div>

            {/* Highlight Box */}
            <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6">
              <p className="text-lg text-foreground font-medium">
                The theory of <span className="text-primary font-bold">"Psychological Reactance"</span> explains: 
                The more you force yourself, the greater the internal resistance. 
                This is why strict diets always end in uncontrollable "cheat days."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium text-gold">The Revolutionary Solution</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center">
                 <span className="bg-clip-text text-transparent text-gold">Mental Abundance</span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                It's no longer about restriction. It's about <span className="font-semibold text-primary">reprogramming your identity</span> to become someone who is naturally slim and healthy. The body is a reflection of the mind. Slim people aren't slim because they 'fight hard,' 
                    but because their subconscious identity is <span className="font-semibold text-primary">"I am a healthy and ideal person"</span>. 
                    This ebook teaches you how to change that identity.
              </p>
            </div>

        

            {/* Principles Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {principles.map((principle, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 space-y-4 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <principle.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{principle.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
                </div>
              ))}
            </div>

            {/* Method Highlight */}
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 rounded-2xl p-8 space-y-6">
              <h3 className="text-2xl font-bold text-foreground text-center">
                The Abundance Release Method™
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-accent">
                    1
                  </div>
                  <h4 className="font-semibold text-foreground">Intense Visualization</h4>
                  <p className="text-sm text-muted-foreground">Imagine your ideal self with sensory detail</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary">
                    2
                  </div>
                  <h4 className="font-semibold text-foreground">Letting Go</h4>
                  <p className="text-sm text-muted-foreground">Release the desire to force it (the paradox of manifestation)</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white">
                    3
                  </div>
                  <h4 className="font-semibold text-foreground">Feeling it Real</h4>
                  <p className="text-sm text-muted-foreground">Feel the emotion of already having your ideal body</p>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* Contents Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">Complete E-book Contents</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                What Will You
                <span className="text-primary"> Learn?</span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                5 comprehensive chapters with a total of 120+ practical pages, complete with worksheets.
              </p>
            </div>

            {/* Chapters List */}
            <div className="space-y-6">
              {chapters.map((chapter, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 md:p-8 hover:border-primary/50 hover:shadow-[var(--shadow-card)] transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Icon & Number */}
                    <div className="flex items-start gap-4 md:flex-col md:items-center md:min-w-[100px]">
                      <div className="w-14 h-14 bg-[var(--gradient-hero)] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <chapter.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-primary md:text-center">{chapter.number}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {chapter.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {chapter.description}
                      </p>

                      {/* Highlights */}
                      <ul className="space-y-2 pt-2">
                        {chapter.highlights?.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bonus Section */}
            <div className="bg-gradient-to-br from-accent/10 to-secondary/10 border border-accent/30 rounded-2xl p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Exclusive Bonuses</h3>
              </div>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">+</span>
                  <span><strong>EBOOK</strong> for tracking progress and journaling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">+</span>
                  <span><strong>Quick Reference Guide</strong> - 1-page cheat sheet for quick access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-white px-4 py-2 rounded-full">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Real Success Story</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Anna's <span className="text-white">Transformation</span>
              </h2>
            </div>

            {/* Main Testimonial Card */}
            <div className="bg-card border border-border rounded-2xl shadow-[var(--shadow-card)] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-6 md:p-8 border-b border-border">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 bg-[var(--gradient-hero)] rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                    A
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">Anna Wijaya</h3>
                    <p className="text-muted-foreground">Career Woman, 35, Mother of 2</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-secondary text-white" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Quote */}
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-12 h-12 text-primary/20" />
                  <blockquote className="text-lg text-foreground leading-relaxed pl-8 italic">
                    "I had tried all the diets: Keto, Intermittent Fasting, even Weight Watchers. 
                    I always lost 5-7 kg in 2 months, but gained back 10 kg in 6 months. 
                    This yo-yo cycle made me frustrated and lose confidence at work."
                  </blockquote>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                  <div className="text-center space-y-1">
                    <div className="text-3xl font-bold text-white">-18kg</div>
                    <div className="text-sm text-muted-foreground">Weight Lost</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-3xl font-bold text-primary">8 Months</div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-3xl font-bold text-accent">100%</div>
                    <div className="text-sm text-muted-foreground">Consistent</div>
                  </div>
                </div>

                {/* Story */}
                <div className="space-y-4 text-foreground">
                  <p className="leading-relaxed">
                    <strong className="text-primary">The Turning Point:</strong> After using the Mental Abundance Method, 
                    Anna realized the real problem wasn't the food, but her mental identity which was still 
                    "a woman who has to struggle to be slim."
                  </p>
                  
                  <p className="leading-relaxed">
                    With the Mental Abundance Method, 
                    Anna began to plant new suggestions: <em className="text-primary">"I am a woman who is naturally healthy and ideal."</em>
                  </p>

                  <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4 space-y-2">
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-white" />
                      Unexpected Results
                    </p>
                    <p className="text-sm leading-relaxed">
                      In the first 3 months, Anna lost 8 kg without torturing herself. 
                      What was more surprising: she began to enjoy morning walks (which she used to hate) and 
                      automatically chose healthy foods without "restricting herself."
                    </p>
                  </div>

                  <div className="bg-secondary/5 border-l-4 border-secondary rounded-r-lg p-4 space-y-2">
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <Heart className="w-5 h-5 text-white" />
                      Unexpected Bonus
                    </p>
                    <p className="text-sm leading-relaxed">
                      Anna's new confidence impacted her career: 
                      She got a promotion to Senior Manager because of her different aura. 
                      "When you love your body, other people feel that energy," said Anna.
                    </p>
                  </div>
                </div>

                {/* Final Quote */}
                <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-xl p-6">
                  <p className="text-lg text-foreground italic text-center">
                    "This book didn't just change my weight. It changed my whole life. 
                    Now I know: <span className="font-bold text-primary not-italic">Being slim isn't the goal, but a side effect of the right mindset.</span>"
                  </p>
                  <p className="text-center text-sm text-muted-foreground mt-3">— Anna Wijaya</p>
                </div>

                {/* Video Testimony */}
                <div className="mt-8 text-center">
                  <video 
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" 
                    src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/diet/diet1.mp4" 
                    controls 
                    loop 
                    playsInline
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            {/* Trust Element */}
            <div className="text-center text-sm text-muted-foreground">
              <p>* Individual results may vary. Anna followed the method consistently for 8 months.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-white px-4 py-2 rounded-full border border-secondary/20">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Limited Time Offer</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Invest in Your
                <span className="text-primary"> Ideal Body</span> Forever
              </h2>
            </div>

            {/* Scarcity Alert */}
            <div className="bg-secondary/10 border-2 border-secondary/30 rounded-xl p-4 flex items-center gap-3 max-w-2xl mx-auto">
              <Clock className="w-6 h-6 text-white flex-shrink-0" />
              <p className="text-foreground font-medium">
                <span className="text-white font-bold">TODAY'S DISCOUNT:</span> Special price is only valid until the end of today!
              </p>
            </div>

            {/* Pricing Card */}
            <div className="bg-card border-2 border-primary/30 rounded-2xl shadow-[var(--shadow-card)] overflow-hidden max-w-2xl mx-auto">
              {/* Header */}
              <div className="bg-[var(--gradient-hero)] p-8 text-center text-black space-y-4">
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  <span className="bg-black/10 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">$3000 VIP</span>
                  <span className="bg-black/10 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">$20 EBOOK HEALTH</span>
                </div>
                <h3 className="text-2xl font-bold text-white">usa_ebookslim: Complete Package</h3>
                <div className="space-y-2">
                  <div className="text-white/80 text-lg line-through">$30</div>
                  <div className="text-white md:text-6xl font-bold">$20</div>
                  <div className="text-white/90 text-sm">Save - This Month Only</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Features List */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-lg mb-4">What You Get:</h4>
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="grid md:grid-cols-3 gap-4 py-6 border-t border-border">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Shield className="w-8 h-8 text-primary" />
                    <span className="text-sm text-muted-foreground">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Zap className="w-8 h-8 text-white" />
                    <span className="text-sm text-muted-foreground">Instant Access</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <Check className="w-8 h-8 text-accent" />
                    <span className="text-sm text-muted-foreground">30-Day Guarantee</span>
                  </div>
                </div>



                {/* Guarantee */}
                <div className="bg-muted/50 rounded-xl p-4 text-center space-y-4">
                  <div className="space-y-2 text-left">
                    <label htmlFor="userEmail" className="text-sm font-medium text-foreground ml-1">Email Address</label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="Enter your email to receive files..."
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="bg-background px-6 py-6 rounded-full border-2 border-primary/20 focus:border-primary transition-all text-center"
                    />
                  </div>

                  <p className="text-sm text-foreground pt-2">
                    <strong className="text-primary">💯 100% Risk-Free Guarantee:</strong>
                    {" "}If within 30 days you feel this method is useless after trying it, 
                    we will refund your money without questions.
                  </p>
                  <Button
                    size="lg"
                    onClick={handleCreatePayment}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold py-8 rounded-full shadow-lg transition-all transform hover:scale-[1.02]"
                  >
                    Pay with Paypal now
                  </Button>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center space-y-3">
              <div className="flex justify-center items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold border-2 border-background"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">+237 buyers this month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ⭐️ 4.9/5.0 from 189 reviews
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Frequently Asked Questions</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Still Have <span className="text-primary">Questions?</span>
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Here are answers to frequently asked questions
              </p>
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-primary font-semibold py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Contact Support */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-3">
              <p className="text-foreground font-medium">
                Other questions? Contact us:
              </p>
              <a 
                href="mailto:support@elvisiongroup.com" 
                className="text-primary hover:underline font-semibold"
              >
                support@elvisiongroup.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-foreground text-background">
        {/* Final CTA Section */}
        <div className="border-b border-background/10">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Change Your Life?
              </h2>
              <p className="text-lg text-background/80">
                Join hundreds of people who have found freedom from yo-yo dieting
              </p>
                            <Button
                              size="lg"
                              onClick={scrollToCheckout}
                              className="bg-emerald-500 text-white px-8 py-6"
                            >
                              Start Your Transformation Now
                            </Button>              <p className="text-sm text-background/60 pt-2">
                🔒 Secure payment • Instant access • 30-day guarantee
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Brand */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold">Slim Without Suffering</h3>
              <p className="text-sm text-background/70 leading-relaxed">
                The Mental Abundance Method - Change your identity, change your body. 
                Based on neuroscience and transformational psychology.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-background/90">Information</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <a href="#checkout-section" className="hover:text-background transition-colors">
                    Pricing & Packages
                  </a>
                </li>
                <li>
                  <a href="#solution" className="hover:text-background transition-colors">
                    About the Method
                  </a>
                </li>
                <li>
                  <a href="mailto:support@elvisiongroup.com" className="hover:text-background transition-colors">
                    Contact Support
                  </a>
                </li>
                <li>
                  <button className="hover:text-background transition-colors text-left">
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="font-semibold text-background/90">Contact</h4>
              <div className="space-y-3">
                <a 
                  href="mailto:support@elvisiongroup.com"
                  className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  support@elvisiongroup.com
                </a>
                <div className="flex items-center gap-2 text-sm text-background/70">
                  <Shield className="w-4 h-4" />
                  Secure & Trusted Payment
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-background/10 mt-12 pt-8 text-center">
            <p className="text-sm text-background/60">
              © 2024 Slim Without Suffering. All Rights Reserved.
            </p>
            <p className="text-xs text-background/50 mt-2">
              Individual results may vary. This product is not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

