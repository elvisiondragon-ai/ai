import { useState, useEffect, useRef } from 'react';
import { Star, CheckCircle, TrendingUp, Heart, Crown, DollarSign, ArrowRight, Sparkles, Shield, Check, Play, Pause, ExternalLink } from 'lucide-react';
import { 
  initFacebookPixelWithLogging, 
  trackPageViewEvent, 
  trackAddToCartEvent, 
  trackCustomEvent,
  getFbcFbpCookies,
  waitForFbp
} from '@/utils/fbpixel';

import { supabase } from '@/integrations/supabase/client';

export default function ELVision3000() {
  // CAPI Configuration
  const PIXEL_ID = '1393383179182528';

  // Helper to send CAPI events
  const sendCAPIEvent = async (eventName: string, userData: any = {}, customData: any = {}, eventId?: string) => {
    try {
      // ⏳ Wait for FBP
      await waitForFbp();

      const { fbc, fbp } = getFbcFbpCookies();

      // 🧠 NAME SPLITTING LOGIC
      let fn = userData.fn;
      let ln = userData.ln;
      
      // Try to get name from state or derived from email
      let rawName = (userData.email ? userData.email.split('@')[0] : undefined);
      
      if (rawName && !ln && rawName.includes(' ')) {
        const parts = rawName.trim().split(/\s+/);
        fn = parts[0];
        ln = parts.slice(1).join(' ');
      } else if (!fn && rawName) {
        fn = rawName;
      }

      await supabase.auth.getSession();
      let db_id = userData.db_id;
      
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

  // Facebook Pixel Code
  useEffect(() => {
    initFacebookPixelWithLogging(PIXEL_ID);
    
    const eventId = crypto.randomUUID();
    trackPageViewEvent({}, eventId, PIXEL_ID);
  }, []);


  const videoTestimonials = [
    {
      name: "Agus Mulyadi, SH., MH.",
      title: "Head of Pangandaran Intelligence",
      type: "image",
      imageUrl: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/agus.jpg",
      thumbnail: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/agus.jpg"
    },
    {
      name: "Dr. Gumilar",
      title: "Hypnotherapist & Foundation Leader",
      type: "image",
      imageUrl: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/dr.jpg",
      thumbnail: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/dr.jpg"
    },
    {
      name: "Habib Umar",
      title: "Leader of Atsaqofah Islamic Boarding School",
      type: "image",
      imageUrl: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/habib.jpg",
      thumbnail: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/habib.jpg"
    },
    {
      name: "Umi Jamilah",
      title: "Foundation Leader",
      type: "image",
      imageUrl: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/umi.jpg",
      thumbnail: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/umi.jpg"
    },
    {
      name: "Felicia",
      title: "Entrepreneur",
      type: "image",
      imageUrl: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/felicia.jpg",
      thumbnail: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/felicia.jpg"
    },
    {
      name: "Lena",
      title: "eL Vision Client",
      type: "image",
      imageUrl: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/lena.jpg",
      thumbnail: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/lena.jpg"
    },
    {
      name: "Vio",
      title: "eL Vision Client",
      type: "image",
      imageUrl: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/vio2.jpg",
      thumbnail: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/vio2.jpg"
    },
    {
      name: "Jacob",
      title: "eL Vision Client",
      type: "image",
      imageUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/jacob.jpg",
      thumbnail: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/jacob.jpg"
    },
    {
      name: "Wiliam",
      title: "eL Vision Client",
      type: "image",
      imageUrl: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/wiliam.jpg",
      thumbnail: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/wiliam.jpg"
    },
    {
      name: "Ana",
      title: "eL Vision Client",
      type: "image",
      imageUrl: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/ana.jpg",
      thumbnail: "https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/ana.jpg"
    }
  ];

  const founderVideoTestimonial = {
      name: "eL Reyzandra (Founder)",
      title: "eL Vision Founder",
      type: "video",
      videoUrl: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/usa_el01.mp4",
      thumbnail: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/usa_el01.jpg"
    };

  const testimonials = [
    {
      name: "Felicia Quincy",
      title: "Instagram: @itsfelicia.quincy",
      verified: true,
      image: "👩‍💼",
      rating: 5,
      text: "Following 6 weeks program make me from anxious and overthinking, first all my decision are foggy and so difficult to move forward, after the program i can see things clearer and also when my vibration is clear, my reality, connection and finance get better. It was amazing"
    },
    {
      name: "Agus Mulyadi, SH., MH.",
      title: "Head of Pangandaran Intelligence, Indonesia",
      verified: true,
      image: "👨‍💼",
      rating: 5,
      text: "As head of intelligence in Indonesia I have so many difficult tasks and impossible responsibilities to decide, with meditation 6 weeks I have super intuitive to get the best result of my works"
    },
    {
      name: "Dr. Gumilar",
      title: "Doctor & Hypnotherapist (20+ Years)",
      verified: true,
      image: "⚕️",
      rating: 5,
      text: "As doctor myself and hypnotherapist for more than 20 years I REALIZED my hypnotherapy is out of date, doing eL Vision method for 6 weeks completely change my perspective and see that this modern method was fast result"
    },
    {
      name: "Suryadi",
      title: "Foundation of Aisyah - Managing 100+ Orphanages",
      verified: true,
      image: "🌟",
      rating: 5,
      text: "We manage over hundreds of orphanage and give them scholarship to best college around the world. The hard part is to get donor that understand the value, with deep meditation with eL, it was amazing and make me easier to meet correct donors"
    },
    {
      name: "Moses Maina",
      title: "Former Luxury Gym Manager, Dubai",
      image: "🏋️",
      rating: 5,
      text: "Losing my job was my lowest point. Just 1 session gave me incredible clarity. Within 2 weeks, I landed a new position 40% better salary. This wasn't luck."
    },
    {
      name: "David Sutanto",
      title: "CEO Tech Startup, $50M Valuation",
      image: "💎",
      rating: 5,
      text: "Money wasn't the problem anymore, but problems kept coming. After 1:1 with eL Vision, I understood: what was missing wasn't strategy, but energy calibration. Now business grows without drama."
    },
    {
      name: "Linda Permata",
      title: "Real Estate Investor & Entrepreneur",
      image: "👩‍💼",
      rating: 5,
      text: "I thought I was 'done' financially. Turns out there's a next level: manifestation without force. $3000 is the best investment compared to $50k seminars that are just theory."
    },
    {
      name: "Stephanie Chen",
      title: "Art Gallery Owner, Singapore",
      image: "🎨",
      rating: 5,
      text: "I immediately knew this was different. Not empty advice, but real results. 3 weeks later, my collection sold for 3x expected price. The energy shift is real."
    },
    {
      name: "Budi Hermawan",
      title: "Manufacturing Group Owner",
      image: "🎯",
      rating: 5,
      text: "6 weeks changed 15 years of mindset. Wealth was there, but peace wasn't. Now I understand: true prosperity starts with 1% of the right focus."
    },
    {
      name: "Lent Laurencia",
      title: "TikTok: @lentlaurensiah",
      verified: true,
      image: "✨",
      rating: 5,
      text: "eL Vision has transformed my life! The clarity and peace I gained are incredible. Highly recommend to anyone seeking true alignment."
    },
    {
      name: "Meylen",
      title: "TikTok: @meylen4_",
      verified: true,
      image: "🌟",
      rating: 5,
      text: "The coaching from eL Vision brought amazing results. I feel more aligned and my goals are manifesting with ease."
    }
  ];

  const weeklyProgram = [
    {
      week: "Week 0",
      title: "Before Program",
      description: "Problem, foggy mind, headache, fear, doubt",
      color: "from-red-900/30 to-gray-900",
      borderColor: "border-red-900/50"
    },
    {
      week: "Week 1",
      title: "Initial Shift",
      description: "Start feel easier to see day by day and joy",
      color: "from-orange-900/30 to-gray-900",
      borderColor: "border-orange-900/50"
    },
    {
      week: "Week 2",
      title: "Deeper Connection",
      description: "Deeper your sense of reality, from visual, listening even kinetic feel, you start connected with reality with joy",
      color: "from-yellow-900/30 to-gray-900",
      borderColor: "border-yellow-900/50"
    },
    {
      week: "Week 3",
      title: "Alignment & Flow",
      description: "Happiness start flow automatic in your presence, as now you Align with your goal, all the possible answer start reveal itself to you",
      color: "from-green-900/30 to-gray-900",
      borderColor: "border-green-900/50"
    },
    {
      week: "Week 4",
      title: "Results Begin",
      description: "Start to collection step by step result",
      color: "from-blue-900/30 to-gray-900",
      borderColor: "border-blue-900/50"
    },
    {
      week: "Week 5",
      title: "Deepening Results",
      description: "Result Closer as your frequency deeper align with your goal",
      color: "from-purple-900/30 to-gray-900",
      borderColor: "border-purple-900/50"
    },
    {
      week: "Week 6",
      title: "Achievement",
      description: "Result achieved",
      color: "from-yellow-500/30 to-amber-500/30",
      borderColor: "border-yellow-500/50"
    }
  ];

  const goals = [
    {
      icon: <DollarSign className="w-12 h-12" />,
      title: "WEALTH",
      description: "Manifest wealth consciousness without anxiety. Money flows naturally."
    },
    {
      icon: <Crown className="w-12 h-12" />,
      title: "POWER",
      description: "Leadership grounded in clarity. Organic and sustainable influence."
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "LOVE",
      description: "Authentic and deep relationships. Natural magnetic presence."
    }
  ];

  // Video Testimonial Component
  const VideoTestimonial = ({ testimonial }: { testimonial: any }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-6 hover:border-yellow-500/50 transition-all">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            {testimonial.thumbnail && (
              <img src={testimonial.thumbnail} alt="Thumbnail" className="w-16 h-16 rounded-full object-cover" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-yellow-400">{testimonial.name}</h3>
            <p className="text-sm text-gray-400">{testimonial.title}</p>
          </div>
        </div>
        
        {testimonial.type === "video" && (
          <video
            ref={videoRef}
            className="w-full max-w-[320px] mx-auto rounded-lg"
            controls
            preload="metadata"
            playsInline
            webkit-playsinline="true"
            poster={testimonial.thumbnail} // Use thumbnail as poster for videos
          >
            <source src={testimonial.videoUrl} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        )}
        {testimonial.type === "image" && (
          <img 
            src={testimonial.imageUrl} 
            alt={`Testimonial from ${testimonial.name}`} 
            className="w-full rounded-lg object-cover"
          />
        )}
      </div>
    );
  };

  // New Audio Player Component
  const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayPause = () => {
      if (!audioRef.current) return;

      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
        // Track custom event for audio playback
        trackCustomEvent('AudioPlayed', {
            audio_src: audioRef.current.src,
        }, undefined, PIXEL_ID);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    // Listen for when audio ends to reset button
    useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
        const handleEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
      }
    }, []);

    return (
      <div className="flex items-center justify-center p-4">
        <button
          onClick={togglePlayPause}
          className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-yellow-500/50"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          {isPlaying ? 'Pause Audio' : 'Play Audio'}
        </button>
        <audio ref={audioRef} src="https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/el3000.mp3" preload="auto" className="hidden" />
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Static Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/10 via-black to-black" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full px-6 py-3 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 font-semibold">EXCLUSIVELY FOR HIGH ACHIEVERS</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              1:1 SYSTEM
            </span>
          </h1>
          
          <p className="text-3xl md:text-4xl text-gray-300 mb-4 font-light">
            eL Vision Premium Coaching
          </p>

          <div className="flex items-center justify-center gap-3 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-yellow-500 text-yellow-500" />
            ))}
          </div>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            For those who already have everything, but still searching for something deeper
          </p>

          <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-sm mb-6">
            <div className="text-5xl font-bold text-yellow-400 mb-2">$3,000</div>
            <div className="text-xl text-gray-300 mb-1">6 Weeks • 6 Private Sessions (60 min/session)</div>
            <div className="text-sm text-gray-400">1 Session per Week</div>
          </div>

          <button 
            className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-2xl px-16 py-6 rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-green-500/30 flex items-center gap-4 mx-auto mb-12"
            onClick={async () => {
              const eventId = crypto.randomUUID();
              
              await trackAddToCartEvent({
                content_name: 'EL Vision 3000 Coaching',
                value: 3000,
                currency: 'USD'
              }, eventId, PIXEL_ID);
              
              await sendCAPIEvent('AddToCart', {}, {
                  content_name: 'EL Vision 3000 Coaching',
                  value: 3000,
                  currency: 'USD'
              }, eventId);

              window.location.href = 'https://app.elvisiongroup.com/usa_pay3000';
            }}
          >
            <Crown className="w-8 h-8" />
            PAY NOW ($3,000)
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </button>

          {/* Money Back Guarantee Box */}
          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-6 max-w-2xl mx-auto backdrop-blur-sm mb-8">
            <div className="flex items-center gap-4">
              <Shield className="w-12 h-12 text-blue-400 flex-shrink-0" />
              <div className="text-left">
                <div className="text-xl font-bold text-blue-400 uppercase tracking-wider">Money Back Guarantee</div>
                <div className="text-gray-300">Based on internal client feedback, the vast majority experience positive progress early in the process.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

          <button 
            className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold text-xl px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl shadow-purple-500/50 flex items-center gap-4 mx-auto mb-4"
            onClick={() => window.open('https://instagram.com/elreyzandra', '_blank')}
          >
            <ArrowRight className="w-6 h-6" />
            FOLLOW OUR FOUNDER AT INSTAGRAM
          </button>

          <button 
            className="group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-black font-bold text-xl px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl shadow-blue-500/50 flex items-center gap-4 mx-auto mb-16"
            onClick={() => window.open('https://cirebon.inews.id/read/204537/ini-sosok-el-reyzandra-mentor-bisnis-yang-sukseskan-ratusan-pengusaha-muda/2', '_blank')}
          >
            <ExternalLink className="w-6 h-6" />
            ABOUT FOUNDER
          </button>
        
        {/* eL Reyzandra's Video Testimonial */}
        <div className="py-10 bg-black">
          <div className="container mx-auto px-6">
            <VideoTestimonial testimonial={founderVideoTestimonial} />
          </div>
        </div>

        {/* Audio Player */}
        <div className="py-10 bg-black">
          <div className="container mx-auto px-6">
            <AudioPlayer />
          </div>
        </div>

        {/* Reyzandra's Message */}
        <div className="py-10 bg-black">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-10 mb-8 text-gray-300 leading-relaxed text-lg">
              <p className="mb-4">My name is eL Reyzandra,</p>
              <p className="mb-4">Founder of eL Vision.</p>
              <p className="mb-4">By 2025, I have spent more than 15 years working in this field.</p>
              <p className="mb-4">My clients are primarily individuals with significant responsibility—heads of intelligence units, founders of social foundations, scholarship institutions, and leaders who operate under constant pressure.</p>
              <p className="mb-4">One category of client that has left a deep impression on me is those who come at the most critical moments of life.</p>
              <p className="mb-4">For example, Mr. Arif, who in May 2025 was medically diagnosed with stage-4 brain cancer and given an estimated three months. As of December 2025, he remains alive, conscious, and functioning.</p>
              <p className="mb-4">This experience reinforced a principle I have held for years:</p>
              <p className="mb-4">science can measure probabilities, but it does not own the authority over life.</p>
              <p className="mb-4">Life moves according to natural laws—and nature, when understood correctly, is far more compassionate than most people realize.</p>
              <p className="mb-4">Many ask why my clients tend to be high-profile individuals.</p>
              <p className="mb-4">The reason is simple:</p>
              <p className="mb-4">the more knowledge and experience a person accumulates, the sooner they realize that there is an invisible limiting factor—a factor that blocks progress regardless of intelligence, strategy, or effort.</p>
              <p className="mb-4">This is not a lack of skill.</p>
              <p className="mb-4">It is a misalignment with natural law.</p>
              <p className="mb-4">My journey began 15 years ago when I personally attempted to apply the Law of Attraction through popular teachings such as The Secret. I failed completely.</p>
              <p className="mb-4">That failure forced me to ask a deeper question:</p>
              <p className="mb-4">What is missing?</p>
              <p className="mb-4">Years of research, personal testing, and sacrifice eventually revealed the gap.</p>
              <p className="mb-4">That gap is what eL Vision now addresses—not as theory, but as a lived system that can be experienced directly.</p>
              <p className="mb-4">I do not sell motivation, belief, or advice.</p>
              <p className="mb-4">I offer a working method.</p>
              <p className="mb-4">One of my earliest international clients in Dubai came to me after losing his job. Weeks later, he secured a better position as a manager at a premium gym after applying our method.</p>
              <p className="mb-4">No promises were made. No persuasion was used.</p>
              <p className="mb-4">Am I extraordinary?</p>
              <p className="mb-4">No.</p>
              <p className="mb-4">What I have learned is this:</p>
              <p className="mb-4">every human being carries an inner strength already granted by nature.</p>
              <p className="mb-4">The difference lies only in knowing how to activate it.</p>
              <p className="mb-4">If you genuinely wish to experience this for yourself, join the six-week program.</p>
              <p className="mb-4">I have no interest in earning money by keeping people dependent or confused.</p>
              <p className="mb-4">This is designed to be one of the most efficient investments you will ever make—</p>
              <p className="mb-4">a small portion of your resources, in exchange for what matters most: clarity, alignment, and inner stability.</p>
              <p className="mb-4">I look forward to meeting you in the class.</p>
              <p className="mt-8 font-bold">— eL Reyzandra</p>
              <p className="font-bold">Founder, eL Vision</p>
            </div>
          </div>
        </div>

      {/* Founder History & Why It Works Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
            <div className="w-full md:w-1/3">
               <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-3xl p-8 text-center backdrop-blur-sm">
                 <div className="text-6xl mb-6">📰</div>
                 <div className="font-bold text-yellow-500 text-sm tracking-wider uppercase mb-2">As Featured In</div>
                 <div className="text-3xl font-bold text-white mb-4">Liputan6</div>
                 <div className="h-px w-16 bg-yellow-500/50 mx-auto mb-4"></div>
                 <p className="text-gray-300 italic">"Helped hundreds of entrepreneurs with 98% success rate"</p>
               </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  From Media-Recognized Motivator to System Architect
                </span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Before eL Vision became an exclusive 1:1 service, <strong className="text-white">eL Reyzandra</strong> was recognized by national media (Liputan6) as a business motivator who successfully guided hundreds of beginner entrepreneurs to profitability.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                But during this journey, he discovered a critical truth: <strong>Motivation is temporary. Systems are permanent.</strong>
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mt-4">
                He realized that the 2% who failed didn't lack effort—they had internal "algorithms" that rejected success. This led to the creation of the eL Vision Method: a protocol not to <em>motivate</em> the mind, but to <strong className="text-yellow-400">reprogram the biological and energetic system</strong> itself.
              </p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Why The System Works Across All Areas</h3>
            <p className="text-xl text-gray-400">We don't solve problems. We fix the machine that perceives them.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Finance */}
            <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-green-500/30 transition-all group">
               <div className="w-14 h-14 bg-green-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <DollarSign className="w-8 h-8 text-green-400" />
               </div>
               <h4 className="text-xl font-bold text-white mb-3">Finance</h4>
               <div className="text-green-500 text-sm font-bold mb-3 uppercase tracking-wider">The "Profit" Algorithm</div>
               <p className="text-gray-400 leading-relaxed">
                 Most financial blocks aren't strategic—they are energetic. We install a "Success Algorithm" that aligns your subconscious focus with market opportunities, making wealth creation feel like a natural reflex rather than a forced effort.
               </p>
            </div>

            {/* Health */}
            <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-red-500/30 transition-all group">
               <div className="w-14 h-14 bg-red-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Heart className="w-8 h-8 text-red-400" />
               </div>
               <h4 className="text-xl font-bold text-white mb-3">Health</h4>
               <div className="text-red-500 text-sm font-bold mb-3 uppercase tracking-wider">The "Repair" Mode</div>
               <p className="text-gray-400 leading-relaxed">
                 High achievers live in chronic sympathetic (fight-or-flight) stress. Our method forces the nervous system into deep parasympathetic dominance—the only state where the body can repair tissues, kill abnormal cells (as seen in our cancer survivor cases), and reverse aging.
               </p>
            </div>

            {/* Relationship */}
            <div className="bg-gradient-to-br from-black to-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-purple-500/30 transition-all group">
               <div className="w-14 h-14 bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Crown className="w-8 h-8 text-purple-400" />
               </div>
               <h4 className="text-xl font-bold text-white mb-3">Relationship</h4>
               <div className="text-purple-500 text-sm font-bold mb-3 uppercase tracking-wider">The "Resonance" Law</div>
               <p className="text-gray-400 leading-relaxed">
                 You don't get what you want; you get who you are. By calibrating your internal emotional baseline, you naturally repel toxic dynamics and magnetically attract partners (or heal existing marriages) who respect and value your presence without you saying a word.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story-Based Case Studies Section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Real Stories, Real Transformation
              </span>
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16">
              Case studies from high-performers who broke through internal ceilings
            </p>

            {/* Health Section - Arif's Story */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-6 py-2 mb-4">
                <span className="text-green-400 font-bold">HEALTH TRANSFORMATION</span>
              </div>
              <h2 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  When Medicine Gives a Verdict, Nature Offers Another Path
                </span>
              </h2>
            </div>

            {/* Arif's Video Testimonial */}
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-500/50 rounded-2xl p-10 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">🏥</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-green-400">Syarifudin Arif</h3>
                  <p className="text-lg text-gray-400">Instagram: @syarifudin_arif25</p>
                  <p className="text-sm text-gray-500 mt-1">Stage 4 Brain Cancer Survivor</p>
                </div>
              </div>
              
              <video 
                className="w-full max-w-[320px] mx-auto rounded-lg mb-6"
                controls
                preload="metadata"
                playsInline
                poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/usa_arif1.jpg"
              >
                <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/usa_arif1.mp4" type="video/mp4" />
                Your browser does not support video playback.
              </video>

              <div className="bg-gradient-to-r from-red-900/30 to-green-900/30 border border-green-500/30 rounded-xl p-6 mb-6 -mx-7">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-red-400 font-bold text-lg mb-2">📋 Medical Verdict - May 2025</div>
                    <p className="text-gray-300">Stage 4 Brain Cancer</p>
                    <p className="text-gray-300">Estimated Time: 3 Months</p>
                  </div>
                  <div>
                    <div className="text-green-400 font-bold text-lg mb-2">✨ Reality - December 2025</div>
                    <p className="text-gray-300">Still Alive & Healthy</p>
                    <p className="text-gray-300">Condition Continuously Improving</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p className="text-xl font-semibold text-white">
                  How Did eL Vision Help Transform Mr. Arif's Health?
                </p>
                
                <p>
                  When Mr. Arif came to us in May 2025, his medical condition had been diagnosed as terminal with an estimated time of 3 months. However, we believe that <span className="text-green-400 font-semibold">the human body has extraordinary natural healing capabilities</span> - which are often blocked by mental and emotional conditions.
                </p>

                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-6 my-4 -mx-7">
                  <h4 className="text-xl font-bold text-green-400 mb-3">🧠 eL Vision Custom Frequency Therapy Method</h4>
                  <p className="mb-3">
                    We work at the <span className="text-green-400 font-semibold">subconscious level to neutralize abnormal cells</span>. Though it may sound impossible to conventional medical approaches, this principle is actually recognized in the field of psychoneuroimmunology - the science that studies the relationship between mind, nervous system, and immune system.
                  </p>
                  
                  <div className="space-y-2 ml-4">
                    <p className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Subconscious Calibration:</strong> We reprogram the body's automatic response to abnormal cells, activating natural healing mechanisms that have been dormant</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Specific Frequency Therapy:</strong> Every cell has a vibrational frequency. We help align the body's frequency to optimal conditions for regeneration</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Water Fasting Protocol:</strong> Combined with water fasting protocol proven to trigger autophagy - the body's natural process of cleansing damaged cells</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong>Stress Neutralization:</strong> Eliminating chronic stress that suppresses the immune system, allowing the body to focus on healing</span>
                    </p>
                  </div>
                </div>

                <p className="text-lg text-yellow-400 font-semibold italic">
                  "Medical science measures probability, but does not have full authority over life. Nature, when understood and aligned correctly, is far more compassionate than imagined."
                </p>

                <p>
                  Mr. Arif's result is not a miracle in the supernatural sense - this is <span className="text-green-400 font-semibold">the result of reactivating the body's natural healing system that has existed since birth</span>, but is often blocked by thought patterns, negative emotions, and prolonged stress.
                </p>

                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mt-4">
                  <p className="text-amber-400 text-sm">
                    <strong>Disclaimer:</strong> The eL Vision method is not a substitute for medical treatment. We work as a complement that optimizes mental-emotional conditions to support the body's natural healing process. Consult with your doctor for medical decisions.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl text-gray-300 italic">
                "Your body is stronger than the diagnosis. You just need to know how to unlock it."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Section */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-6 py-2 mb-4">
                <span className="text-blue-400 font-bold">BUSINESS TRANSFORMATION</span>
              </div>
              <h2 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Business Stuck? The Problem Isn't External
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                When strategy is right, team is strong, but results still plateau - the problem is internal
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/50 rounded-2xl p-10">
              <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
                <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-xl p-6 -mx-7">
                  <h3 className="text-2xl font-bold text-red-400 mb-4">❌ Common Patterns</h3>
                  <div className="space-y-3">
                    <p className="flex items-start gap-3">
                      <span className="text-red-400 text-xl mt-1">•</span>
                      <span>Owner/CEO has perfect strategy, but execution is always delayed or suboptimal</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-red-400 text-xl mt-1">•</span>
                      <span>Competent team, sufficient capital, good systems - but growth stops at the same ceiling</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-red-400 text-xl mt-1">•</span>
                      <span>Every major decision feels heavy, full of doubt, draining mental energy</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-red-400 text-xl mt-1">•</span>
                      <span>Competitors with fewer resources are actually growing faster</span>
                    </p>
                  </div>
                </div>

                <p className="text-2xl font-bold text-white text-center py-4">
                  This Isn't a Strategy Problem. This Is an <span className="text-blue-400">Alignment</span> Problem.
                </p>

                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6 -mx-7">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">✨ The Real Root Cause</h3>
                  <p className="mb-4">
                    Often businesses get stuck <span className="text-blue-400 font-semibold">not because of external factors</span> like market, competitors, or capital - but because of the <span className="text-blue-400 font-semibold">owner/CEO's internal condition</span>.
                  </p>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <h4 className="text-xl font-bold text-purple-400 mb-2">🧠 Misaligned Mental & Thinking</h4>
                      <p>
                        If a leader continues to operate with <span className="text-purple-400 font-semibold">doubt, anxiety, or hidden fears</span> - that energy will seep into every decision, every team interaction, and ultimately into business results.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-purple-400 mb-2">⚡ The Law of Frequency in Business</h4>
                      <p>
                        Business is a manifestation of the <span className="text-purple-400 font-semibold">leader's internal frequency</span>. If internal frequency (beliefs, emotions, energy) is not aligned with vision and goals - there will always be friction, subtle sabotage, and obstacles that appear "external" when they actually originate from within.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-6 -mx-7">
                  <h3 className="text-2xl font-bold text-green-400 mb-4">🎯 eL Vision Solution for Business</h3>
                  <p className="mb-4">
                    We use <span className="text-green-400 font-semibold">frequency alignment techniques</span> that make <span className="text-green-400 font-semibold">your reality stream align with your business goals</span>.
                  </p>

                  <div className="space-y-3 mt-4">
                    <p className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span><strong>Removing Doubt at Subconscious Level:</strong> Doubt that seems "logical" often actually stems from old programs in the subconscious. We clear that.</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span><strong>Decision Calibration:</strong> Making the decision-making process clearer, faster, and without excessive mental burden</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span><strong>Vision-Reality Alignment:</strong> Synchronizing your real-world frequency (mental condition, emotions, energy) with your business vision</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span><strong>Flow State Execution:</strong> Execution becomes natural, without force - like water flowing to its destination</span>
                    </p>
                  </div>
                </div>

                <div className="text-center py-6">
                  <p className="text-2xl text-yellow-400 font-bold italic mb-2">
                    "When the Owner Is Aligned, Business Flows"
                  </p>
                  <p className="text-lg text-gray-400">
                    Not motivation. Not ordinary mindset. This is internal system recalibration that drives everything.
                  </p>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 -mx-8">
                  <h4 className="text-xl font-bold text-blue-400 mb-3">📊 Real Results from Our Business Clients</h4>
                  <div className="space-y-2 text-gray-300">
                    <p>• Tech Startup CEO ($50M Valuation): <em>"Business grows without drama after energy calibration"</em></p>
                    <p>• Business Owner John: <em>"Breakthrough finally happened after internal obstacles were removed"</em></p>
                    <p>• Foundation Leader: <em>"Donations increased from $0 to $6M/year after internal alignment"</em></p>
                  </div>
                </div>

                <p className="text-xl text-center text-white font-semibold pt-4">
                  Ready to align your business with its true potential?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

            {/* John's Story */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-10 mb-8">
              <div className="inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1 mb-4">
                <span className="text-yellow-400 font-semibold text-sm">CASE STUDY: JOHN</span>
              </div>
              <h3 className="text-3xl font-bold text-yellow-400 mb-6">The Business Owner Who Had Everything Right</h3>
              
              <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                <p>
                  John was already doing everything right. He had tested multiple ad strategies, hired strong teams, optimized funnels, and spent serious money on execution. Technically, nothing was wrong.
                </p>
                <p>
                  Yet his business kept stalling at the same ceiling. No matter how hard he pushed externally, the breakthrough wouldn't happen.
                </p>
                <p className="text-yellow-400 font-semibold">
                  When we worked together, it became clear: the obstacle was no longer outside the business. It was internal — subtle mental friction, decision fatigue, and unconscious resistance that even smart people overlook.
                </p>
                <p>
                  After entering a focused 6-week private process, the change wasn't dramatic on the surface. But clarity returned. Execution simplified. And the results he had been chasing finally began to move.
                </p>
              </div>
            </div>

            {/* Noah's Story */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 rounded-2xl p-10">
              <div className="inline-block bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1 mb-4">
                <span className="text-amber-400 font-semibold text-sm">CASE STUDY: NOAH</span>
              </div>
              <h3 className="text-3xl font-bold text-amber-400 mb-6">Wealth Without Peace</h3>
              
              <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                <p>
                  Noah's story looked different. He had wealth, status, and freedom on paper. But his family wasn't happy. His body was breaking down.
                </p>
                <p>
                  Money, instead of being a tool, had become a source of pressure and recurring problems. The issue wasn't lack of success. It was internal misalignment.
                </p>
                <p className="text-amber-400 font-semibold">
                  During the same 6-week private work, we addressed the internal patterns that quietly distorted how money, relationships, and health showed up in his life.
                </p>
                <p>
                  Over time, money returned to its proper role — a tool for life, not a trigger for suffering.
                </p>
              </div>
            </div>

            {/* Pattern Recognition */}
            <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-8">
              <h4 className="text-2xl font-bold text-purple-400 mb-4">The Common Pattern</h4>
              <div className="space-y-3 text-gray-300 leading-relaxed">
                <p>
                  Many people share a similar pattern. They try harder. They fix strategies. They optimize systems. But the solution is not there.
                </p>
                <p className="text-xl font-semibold text-white">
                  In fact, over 90% of our clients are top-tier performers. They already have technical mastery and external competence.
                </p>
                <p>
                  So why do they come to us? Because the smarter you become, the more you realize there is an X factor that techniques cannot fix. And that factor is internal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Program Breakdown */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              6-Week Transformation Journey
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            What happens week by week in your transformation
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            {weeklyProgram.map((week, idx) => (
              <div key={idx} className={`bg-gradient-to-r ${week.color} border ${week.borderColor} rounded-2xl p-8 transition-all hover:scale-105`}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full ${week.week === "Week 6" ? "bg-yellow-500" : "bg-gray-800"} flex items-center justify-center border-2 ${week.week === "Week 6" ? "border-yellow-400" : "border-gray-700"}`}>
                      <span className={`font-bold ${week.week === "Week 6" ? "text-black" : "text-white"}`}>{idx}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-gray-400 uppercase">{week.week}</span>
                      {week.week === "Week 6" && <Check className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{week.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{week.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl px-8 py-6">
              <p className="text-xl text-gray-300">
                <strong className="text-yellow-400">This is not advice. This is not motivation.</strong><br />
                It is precision work on the system that drives everything else.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Not Advice Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl px-8 py-4 mb-8">
              <TrendingUp className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  We Don't Sell Advice
                </span>
              </h2>
              <p className="text-2xl text-gray-300">
                We Sell <span className="text-yellow-400 font-bold">PROVEN RESULTS</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-900/50 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">✗</div>
                <h3 className="text-2xl font-bold text-red-400 mb-4">Not This</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Theoretical advice that sounds good on paper</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Temporary motivation that fades tomorrow</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Abstract spiritual concepts</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="text-red-500 mt-1">×</span>
                    <span>Empty promises without real proof</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-black border-2 border-green-500/50 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">✓</div>
<h3 className="text-2xl font-bold text-green-400 mb-4">What You Get</h3>
<ul className="space-y-4 text-left">
<li className="flex items-start gap-3 text-gray-300">
<span className="text-2xl mt-1 flex-shrink-0">🏥</span>
<span><strong>Health transformations:</strong> We've helped clients defy terminal diagnoses. Mr. Arif was diagnosed with cancer and given 3 months to live in May 2025 - he's alive and thriving today. You can contact him directly to hear his story.</span>
</li>
<li className="flex items-start gap-3 text-gray-300">
<span className="text-2xl mt-1 flex-shrink-0">💰</span>
<span><strong>Financial breakthroughs:</strong> One foundation owner grew their scholarship donations from zero to $6M/year after working with us.</span>
</li>
<li className="flex items-start gap-3 text-gray-300">
<span className="text-2xl mt-1 flex-shrink-0">👨‍👩‍👧‍👦</span>
<span><strong>Family healing:</strong> Successful men often struggle with feeling respected at home. When ego clashes seem unsolvable, we create change within weeks - not years.</span>
</li>
<li className="flex items-start gap-3 text-gray-300">
<span className="text-2xl mt-1 flex-shrink-0">☮️</span>
<span><strong>True peace & happiness:</strong> Money and happiness are different. Money buys hospital visits and stress relief - not joy. Real happiness comes from attitude and giving. In your first session, you'll discover happiness through simple things: your breath, what you see, how you sense the world. Your finances become a bonus to happiness itself.</span>
</li>
<li className="flex items-start gap-3 text-gray-300">
<span className="text-2xl mt-1 flex-shrink-0">❤️</span>
<span><strong>Love & relationships:</strong> Our male clients who want to attract a specific woman have a 95% success rate within 6 weeks. For transparency: women seeking to attract a specific man have a 50% success rate in the same timeframe. However, women working to heal existing marriages also achieve 95% success - which is why we often recommend that path.</span>
</li>
</ul>
</div>
</div>

            <div className="mt-12 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-8">
              <p className="text-2xl text-gray-300 leading-relaxed">
                You don't have to believe our words.<br />
                <span className="text-3xl font-bold text-yellow-400">Experience the proof yourself.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pain Point Section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Is This You?
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-2xl p-8">
                <div className="text-red-400 text-6xl mb-4">💸</div>
                <h3 className="text-2xl font-bold mb-4 text-red-400">Money's There, But...</h3>
                <p className="text-gray-300 leading-relaxed">
                  Problems keep arriving. As if money becomes a magnet for drama, conflict, and anxiety. The more wealth you have, the more complex problems erode your peace.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-900/30 rounded-2xl p-8">
                <div className="text-orange-400 text-6xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold mb-4 text-orange-400">Success Outside, Empty Inside</h3>
                <p className="text-gray-300 leading-relaxed">
                  Achievement after achievement reached. But there's a void that nothing can fill. You know there's more, but don't know how to access it.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-8">
                <div className="text-yellow-400 text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">Energy Drained</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every day feels like a battle. Big decisions drain your energy. You want natural flow, not constant exhausting struggle.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 rounded-2xl p-8">
                <div className="text-amber-400 text-6xl mb-4">🌪️</div>
                <h3 className="text-2xl font-bold mb-4 text-amber-400">Lost Clarity</h3>
                <p className="text-gray-300 leading-relaxed">
                  The vision that was once sharp is now blurred. Too many choices, too many voices. You need clarity to see the next step with certainty.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-2xl text-gray-300 italic">
                "Wrong calibration makes success feel like a burden."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Define Your Specific Goal
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Focus is key. Choose one area for deep transformation in 6 weeks
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {goals.map((goal, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-800 to-black border border-yellow-900/30 rounded-2xl p-8 hover:border-yellow-500/50 transition-all hover:scale-105 cursor-pointer">
                <div className="text-yellow-500 mb-6 flex justify-center">
                  {goal.icon}
                </div>
                <h3 className="text-3xl font-bold text-center mb-4 text-yellow-400">
                  {goal.title}
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  {goal.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-gray-400 mb-8">
              Or a combination of all three? We'll customize to your needs.
            </p>
          </div>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              What You Get
            </span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              "6 Private 1:1 Sessions (60 minutes per session) with exclusive eL Vision method",
              "Vipassana & Calibration specifically tailored to your goal",
              "Direct WhatsApp access for guidance between sessions",
              "Custom manifestation protocol based on your energy signature",
              "Weekly progress tracking to ensure measurable transformation",
              "Lifetime access to exclusive high-tier clients community"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-yellow-900/50 transition-all">
                <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Comparison Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              The Real Math
            </span>
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* The Cost */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 flex flex-col justify-center items-center text-center">
              <div className="text-2xl text-gray-400 mb-2">You Pay</div>
              <div className="text-6xl font-bold text-white mb-4">$3,000</div>
              <div className="text-sm text-gray-500">One-time investment</div>
            </div>

            {/* The Value */}
            <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border border-yellow-500/30 rounded-3xl p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold px-4 py-1 rounded-bl-xl">
                 WHAT YOU SAVE
               </div>
               <div className="space-y-6">
                 <div className="flex items-start gap-4">
                   <div className="bg-yellow-500/20 p-3 rounded-lg">
                     <span className="text-2xl">⏳</span>
                   </div>
                   <div>
                     <h4 className="text-xl font-bold text-yellow-400">Save 3-5 Years</h4>
                     <p className="text-gray-300">Stop wasting years finding clarity. Collapse timelines by accessing the root cause immediately.</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="bg-yellow-500/20 p-3 rounded-lg">
                     <span className="text-2xl">🧠</span>
                   </div>
                   <div>
                     <h4 className="text-xl font-bold text-yellow-400">End Mental Exhaustion</h4>
                     <p className="text-gray-300">No more looping mistakes. The cost of decision fatigue and anxiety is higher than you think.</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="bg-yellow-500/20 p-3 rounded-lg">
                     <span className="text-2xl">💰</span>
                   </div>
                   <div>
                     <h4 className="text-xl font-bold text-yellow-400">Save $100,000+</h4>
                     <p className="text-gray-300">In prevented health costs, bad business decisions, and stress-related losses.</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Testimonials Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Our Client Video Testimonials
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Hear directly from those who have experienced the transformation
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {videoTestimonials.map((testimonial, idx) => (
              <VideoTestimonial key={idx} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              What Our High-Tier Clients Say
            </span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Those who've already "succeeded" but seek the next level
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900 to-black border border-yellow-900/30 rounded-2xl p-8 hover:border-yellow-500/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-yellow-400">{testimonial.name}</h3>
                      {testimonial.verified && (
                        <div className="bg-blue-500 rounded-full p-1" title="Verified">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl px-8 py-6">
              <p className="text-xl text-gray-300 mb-2">
                <strong className="text-purple-400">Results Aren't Coincidence.</strong>
              </p>
              <p className="text-lg text-gray-400">
                Every testimony is proof of precise energy calibration.
              </p>
            </div>
          </div>

          {/* Our Method Section */}
          <div className="mt-20 text-left">
            <h2 className="text-5xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Our Method
              </span>
            </h2>

            {/* Video Container - Dedicated Grid */}
            <div className="w-full grid md:grid-cols-2 gap-12 mb-16 items-start">
              {/* Video 1: Explaining the Method */}
              <div className="flex flex-col items-center">
                <div className="mb-4 text-center">
                  <h3 className="text-2xl font-bold text-yellow-400">The eL Vision Method</h3>
                  <p className="text-gray-400 text-sm">Explaining the System Alignment</p>
                </div>
                <video 
                  className="w-full max-w-[320px] rounded-lg shadow-2xl border border-yellow-500/30"
                  controls
                  preload="metadata"
                  playsInline
                  poster="https://tgojzhjujhjboboqygub.supabase.co/storage/v1/object/public/meta/arif2.jpg"
                >
                  <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/usa_methods.mp4" type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>

              {/* Video 2: Client Interview */}
              <div className="flex flex-col items-center">
                <div className="mb-4 text-center">
                  <h3 className="text-2xl font-bold text-yellow-400">Deep Transformation</h3>
                  <p className="text-gray-400 text-sm">Client Interview & Result Proof</p>
                </div>
                <video 
                  className="w-full max-w-[320px] rounded-lg shadow-2xl border border-yellow-500/30"
                  controls
                  preload="metadata"
                  playsInline
                  poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/arif_interview_en.jpg"
                >
                  <source src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/usa/arif_interview_en.mp4" type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>
                The eL Vision method is <strong className="text-yellow-400">not magic</strong>, not empty suggestion, and not mere <em>positive thinking</em>.
                It is a <strong className="text-yellow-400">calibration of the human internal system</strong>, working across three interconnected layers:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>physiological energy and nervous system regulation,</li>
                <li>subconscious patterning,</li>
                <li>and decision-making mechanisms that consistently shape daily reality.</li>
              </ul>
              <p>
                Modern neuroscience and psychology show that human behavior is <strong className="text-yellow-400">not primarily driven by conscious intention</strong>,
                but by <strong className="text-yellow-400">automatic subconscious processes</strong>.
              </p>
              <p>
                Research indicates that:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>approximately <strong className="text-yellow-400">90–95% of human decisions are non-conscious</strong>,</li>
                <li>while the conscious mind often functions only to
                  <strong className="text-yellow-400">justify decisions already made by the subconscious system</strong>.
                </li>
              </ul>
              <p className="italic text-gray-400">
                (Reference: Daniel Kahneman — <em>Thinking, Fast and Slow</em>)
              </p>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">Where 90% of People Get “Stuck”</h3>
              <p>
                Most people who feel stuck are <strong className="text-yellow-400">not lacking strategy, effort, or intelligence</strong>.
                The issue exists at a deeper level: <strong className="text-yellow-400">internal misalignment</strong>.
              </p>
              <p>
                The pattern is consistent:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>the nervous system remains in a state of <strong className="text-yellow-400">chronic tension</strong>
                  (persistent stress, hyper-vigilance, unprocessed pressure),
                </li>
                <li>bodily energy is <strong className="text-yellow-400">out of sync</strong> with personal goals,</li>
                <li>outdated subconscious beliefs remain active,
                  even when the person <em>logically knows</em> they should change.
                </li>
              </ul>
              <p>
                As a result:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>big visions feel heavy,</li>
                <li>execution becomes inconsistent,</li>
                <li>small decisions are delayed,</li>
                <li>outcomes plateau despite increased effort.</li>
              </ul>
              <p>
                This is <strong className="text-yellow-400">not laziness</strong>.
                It is <strong className="text-yellow-400">systemic internal incoherence</strong>.
              </p>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">What We Actually Do</h3>
              <p>
                In private eL Vision sessions, we <strong className="text-yellow-400">do not work at the level of motivation or advice</strong>.
                We work <strong className="text-yellow-400">directly with the subconscious system</strong>.
              </p>
              <p>
                Our approach is grounded in principles from:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-yellow-400">Neuroscience</strong> (particularly neuroplasticity),</li>
                <li><strong className="text-yellow-400">Somatic psychology</strong> (the body–emotion–mind connection),</li>
                <li><strong className="text-yellow-400">Subconscious patterning</strong> and emotional recalibration.</li>
              </ul>
              <p>
                The founder of eL Vision has <strong className="text-yellow-400">over 15 years of experience</strong> guiding individuals into specific internal states
                where <strong className="text-yellow-400">beliefs, self-identity, and emotional patterns can be gradually restructured</strong>.
              </p>
              <p>
                In psychological literature, this process is often described as:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><em>bypassing conscious resistance</em>, or</li>
                <li><em>direct subconscious access</em>.</li>
              </ul>
              <p>
                Nothing is forced.
                Nothing is fought.
                The system is <strong className="text-yellow-400">reorganized from within</strong>.
              </p>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">Why This Is Not Traditional Law of Attraction</h3>
              <p>
                The eL Vision technique is <strong className="text-yellow-400">not a motivational version of the Law of Attraction</strong>.
                It is a <strong className="text-yellow-400">system upgrade</strong> because it operates on <strong className="text-yellow-400">two simultaneous flows</strong>.
              </p>
              <h4 className="text-2xl font-bold text-amber-400 pt-4 mb-2">1. The Vision Flow <em>(Goals & Intentions)</em></h4>
              <p>
                Conscious goals, future images, and desired outcomes.
              </p>
              <h4 className="text-2xl font-bold text-amber-400 pt-4 mb-2">2. The Reality Flow <em>(Current Internal State)</em></h4>
              <p>
                This includes:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>dominant emotional patterns,</li>
                <li>nervous system tone,</li>
                <li>felt sense of safety and confidence,</li>
                <li>and embodied presence in daily life.</li>
              </ul>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">The Core Problem Most People Face</h3>
              <p>
                For most individuals:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong className="text-yellow-400">the vision flow is strong</strong>,</li>
                <li>but <strong className="text-yellow-400">the reality flow is misaligned with that vision</strong>.</li>
              </ul>
              <p>
                Vision is created by the conscious mind,
                while the reality flow is governed by the <strong className="text-yellow-400">subconscious</strong> —
                and the subconscious <strong className="text-yellow-400">always dominates</strong>.
              </p>
              <p>
                In systems physics and dynamic psychology, one principle applies:
              </p>
              <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-gray-400">
                <p><strong className="text-yellow-400">The more stable and consistent system will always override the weaker one.</strong></p>
              </blockquote>
              <p>
                When the internal reality flow contradicts the vision,
                the result is friction, subtle self-sabotage, and delayed manifestation.
              </p>

              <h3 className="text-3xl font-bold text-yellow-400 pt-8 mb-4">The Core Principle of eL Vision</h3>
              <p>
                In eL Vision:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>we <strong className="text-yellow-400">do not chase vision aggressively</strong>,</li>
                <li>we <strong className="text-yellow-400">first align and strengthen the reality flow</strong>.</li>
              </ul>
              <p>
                When:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>the body becomes calmer,</li>
                <li>emotions become coherent,</li>
                <li>and internal beliefs stabilize,</li>
              </ul>
              <p>
                the reality flow begins to <strong className="text-yellow-400">move in the same direction as the vision</strong>.
              </p>
              <p>
                Once this alignment occurs,
                vision no longer needs to be forced —
                it is <strong className="text-yellow-400">carried into reality naturally</strong>.
              </p>
              <p>
                This is what many people describe as <em>“manifestation.”</em>
              </p>
              <p>
                Not because of wishing.
                But because the <strong className="text-yellow-400">internal system is finally coherent</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-8" />
            
            <h2 className="text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Time To Recalibrate
              </span>
            </h2>

            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              Your money is enough. What you need is clarity, peace, and natural flow in manifesting your next desires.
            </p>

            <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-2xl p-10 backdrop-blur-sm mb-12">
              <div className="text-5xl font-bold text-yellow-400 mb-3">$3,000</div>
              <div className="text-xl text-gray-300 mb-2">6 Weeks Transformation (60 min/session)</div>
              <div className="text-sm text-gray-400 mb-6">1 Session per Week</div>

              <div className="flex items-center gap-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div className="text-left text-sm text-gray-300">
                  <span className="font-bold text-blue-400 block mb-1 uppercase tracking-wider">Money Back Guarantee</span>
                  Based on internal client feedback, the vast majority experience positive progress early in the process.
                </div>
              </div>
              
              <div className="inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-6 py-3">
                <p className="text-yellow-400 font-semibold">⚡ Limited</p>
              </div>
            </div>

            <button 
              className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-2xl px-16 py-8 rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-green-500/30 flex items-center gap-4 mx-auto mb-8"
              onClick={async () => {
                const eventId = crypto.randomUUID();
                
                await trackAddToCartEvent({
                  content_name: 'EL Vision 3000 Coaching',
                  value: 3000,
                  currency: 'USD'
                }, eventId, PIXEL_ID);
                
                // Send Server-Side Event
                await sendCAPIEvent('AddToCart', {}, {
                    content_name: 'EL Vision 3000 Coaching',
                    value: 3000,
                    currency: 'USD'
                }, eventId);
  
                window.location.href = 'https://app.elvisiongroup.com/usa_pay3000';
              }}
            >
              <Crown className="w-8 h-8" />
              PAY NOW ($3,000)
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>

            <p className="text-gray-500 text-sm">
              Limited slots. We only work with those serious about deep transformation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}