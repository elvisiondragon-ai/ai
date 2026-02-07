import { useEffect } from "react";
import { ChevronRight, Star, Shield, Heart, MessageCircle } from "lucide-react";
import { 
  initFacebookPixelWithLogging, 
  trackPageViewEvent, 
  trackViewContentEvent 
} from '@/utils/fbpixel';

export default function DrelfLanding() {
  const PIXEL_ID = '1749197952320359';

  useEffect(() => {
    // Init Pixel
    initFacebookPixelWithLogging(PIXEL_ID);

    // Track PageView
    const pageEventId = `pageview-${Date.now()}`;
    trackPageViewEvent({}, pageEventId, PIXEL_ID);

    // Track ViewContent
    const viewContentEventId = `viewcontent-${Date.now()}`;
    trackViewContentEvent({
      content_name: 'Drelf Collagen Ritual',
      content_category: 'Beauty',
      value: 60.00,
      currency: 'SGD'
    }, viewContentEventId, PIXEL_ID);
  }, []);

  const scrollToCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50">
      {/* Trust Banner */}
      <div className="bg-amber-900 text-amber-50 py-2 px-4 overflow-hidden">
        <div className="container mx-auto flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] md:text-xs font-bold uppercase tracking-widest animate-pulse">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            Fast Delivery to Singapore from Indonesia
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            Money Back Guarantee
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            CS Support 24/7
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-champagne to-rose-100 pt-12 pb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full text-sm font-semibold text-amber-900 shadow-lg">
              ✨ World's First in Singapore
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The World's First
              <span className="block bg-gradient-to-r from-amber-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                "Bio-Acoustic" Beauty Ritual
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
              Stop wasting money on surface-level fixes.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Heal from the subconscious to the cellular. 70% of true beauty doesn't come from what you apply on the outside... but from the peace of mind they never told you about.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={scrollToCheckout}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started Now <ChevronRight size={20} />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">1000+</div>
                <div className="text-sm text-gray-600">Women Transformed</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <div className="text-sm text-gray-600">Customer Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">98%</div>
                <div className="text-sm text-gray-600">Reorder Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative w-full overflow-hidden py-8">
        <div className="container mx-auto px-6 max-w-sm">
          <div className="aspect-[9/16] w-full rounded-lg overflow-hidden shadow-xl">
            <video
              src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/drelf_sg.mp4"
              poster="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/drelf_sg.jpg"
              loop
              playsInline
              controls
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Pain Point Section - The Invisible Loss */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
              The Invisible <span className="text-rose-500">Loss</span>
            </h2>
            <p className="text-center text-gray-600 mb-16 text-lg">
              Did you know that "Stress-Induced Oxidation" can age your skin by 5 years in just 30 days?
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {[
                {
                  title: "Wasting Thousands on Skincare",
                  desc: "Expensive serums, imported creams, spa treatments... but your skin still looks dull and tired. Why?",
                  icon: "💸"
                },
                {
                  title: "Dark Circles & Exhausted Face",
                  desc: "You sleep enough, but wake up looking tired. Puffy eyes, dull complexion. Every selfie needs editing first.",
                  icon: "😫"
                },
                {
                  title: "Stress is Killing Your Beauty",
                  desc: "Work pressure, household stress, social media anxiety... cortisol rises, collagen drops 40%. Your skin becomes the victim.",
                  icon: "😰"
                },
                {
                  title: "Declining Confidence",
                  desc: "Looking in the mirror feels insecure. Friends' photos show glowing skin, why are you different? Same age though...",
                  icon: "😔"
                }
              ].map((pain, i) => (
                <div key={i} className="bg-gradient-to-br from-rose-50 to-amber-50 p-8 rounded-2xl border-2 border-rose-100 hover:border-rose-300 transition-all duration-300 hover:shadow-xl">
                  <div className="text-4xl mb-4">{pain.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{pain.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{pain.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-1 rounded-3xl">
              <div className="bg-white p-10 rounded-3xl text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Think About This:
                </h3>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  If you continue to let daily stress and poor nutrition erode your collagen, the "repair cost" for professional laser treatments and fillers can easily exceed <span className="font-bold text-rose-600">$3,000 a month</span> ($100/day in skin damage).
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                  You aren't just losing glow; you are losing your skin's future equity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="py-20 bg-gradient-to-br from-white to-amber-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Breakthrough
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Stop falling for "Marketing Gimmicks." We've combined the most potent ingredients on Earth with breakthrough sound science to create The Ultimate.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-amber-100 p-6">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/produk1.png"} alt="Drelf Product 1" className="w-full h-auto rounded-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">DRELF Collagen Sachet</h3>
                <p className="text-gray-700">Convenient packaging for daily consumption.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-amber-100 p-6">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/produk2.png"} alt="Drelf Product 2" className="w-full h-auto rounded-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">DRELF Collagen Box</h3>
                <p className="text-gray-700">Complete package for 30-day transformation.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-amber-100 p-6">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/produk3.png"} alt="Drelf Product 3" className="w-full h-auto rounded-lg mb-4"/>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Bundle</h3>
                <p className="text-gray-700">Best value for long-term beauty investment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It's Different - The Science */}
      <section className="py-20 bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">
              Why It's <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">Different</span>
            </h2>
            <p className="text-xl text-center text-gray-600 mb-16">
              The Science Behind The Ultimate Bio-Acoustic Beauty Ritual
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-amber-100 hover:border-amber-300 transition-all duration-300">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/why1.png"} alt="5000mg Marine Collagen" className="w-full h-48 object-cover rounded-lg mb-6"/>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">5000mg Marine Collagen</h3>
                <p className="text-gray-700 leading-relaxed">
                  The precise clinical dose to trigger skin elasticity. Not just any collagen—marine-grade peptides with proven bioavailability for maximum absorption.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-amber-100 hover:border-amber-300 transition-all duration-300">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/why2.png"} alt="Premium Bird's Nest" className="w-full h-48 object-cover rounded-lg mb-6"/>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Bird's Nest</h3>
                <p className="text-gray-700 leading-relaxed">
                  The "Caviar of the East" for deep cellular hydration. Rich in epidermal growth factor (EGF) and amino acids that repair skin at the cellular level.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-amber-100 hover:border-amber-300 transition-all duration-300">
                <img src={"https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/why3.png"} alt="The Frequency" className="w-full h-48 object-cover rounded-lg mb-6"/>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Frequency</h3>
                <p className="text-gray-700 leading-relaxed">
                  Every box includes access to our proprietary Skin-Relaxation Audio. Scientifically designed frequencies that prepare your nervous system for optimal nutrient absorption.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-1 rounded-3xl">
              <div className="bg-white p-12 rounded-3xl">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  The Science You Need to Know
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Topical creams can't reach your subconscious. Science proves that when your nervous system is "high-stress," your skin constricts, blocking nutrient absorption.
                </p>
                <p className="text-xl font-bold text-gray-900 mb-6">
                  Our audio signals your nervous system to RELAX, opening the "cellular gates" so the 5000mg of Collagen and Bird's Nest can actually do their job.
                </p>
                <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-6 rounded-2xl border-2 border-amber-200">
                  <p className="text-lg text-gray-800 font-semibold">
                    💡 Test it yourself: Listen for 10 minutes while drinking The Ultimate. Feel your facial muscles drop, your pores breathe, and your skin shift into "Healing Mode."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Result - The Gain */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">
              The <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">Result</span>
            </h2>
            <p className="text-xl text-center text-gray-600 mb-16">
              What You Can Expect When You Commit to The Ultimate Ritual
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-100 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Glowing Skin</h3>
                <p className="text-gray-700 leading-relaxed">
                  Not just shiny, but a deep, lit-from-within radiance. The kind that makes people ask "What's your secret?"
                </p>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-rose-50 to-white rounded-2xl border-2 border-rose-100 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">😌</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Total Relaxation</h3>
                <p className="text-gray-700 leading-relaxed">
                  Skin that looks "rested" even if you only slept 5 hours. Say goodbye to tired, stressed-out complexion.
                </p>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-100 hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Massive Savings</h3>
                <p className="text-gray-700 leading-relaxed">
                  Instead of losing $3,000 in skin value to stress, protect your entire month for just $60.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-1 rounded-3xl">
              <div className="bg-white p-10 rounded-3xl text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Real Results from Real Women
                </h3>
                <p className="text-lg text-gray-700 mb-8">
                  Join over 1,000 women who have transformed their skin and confidence with The Ultimate Bio-Acoustic Beauty Ritual.
                </p>
                <div className="flex justify-center items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 fill-amber-500 text-amber-500" />
                  ))}
                  <span className="text-2xl font-bold text-gray-900 ml-2">4.9/5</span>
                </div>
                <p className="text-gray-600">Based on 1,000+ verified reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
              Real Stories, Real Transformations
            </h2>
            <p className="text-xl text-center text-gray-600 mb-16">
              Hear from women who have experienced The Ultimate difference
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah L.",
                  age: "32",
                  image: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/1.jpeg",
                  text: "After just 2 weeks, my colleagues kept asking if I got a facial. The glow is REAL. The relaxation audio is genius—I actually feel my stress melting away.",
                  rating: 5
                },
                {
                  name: "Michelle T.",
                  age: "28",
                  image: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/2.jpeg",
                  text: "I've spent thousands on treatments. This $60 ritual did more for my skin than $500 facials. The combination of collagen + relaxation is revolutionary.",
                  rating: 5
                },
                {
                  name: "Jessica W.",
                  age: "35",
                  image: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/3.jpeg",
                  text: "Finally, something that addresses the ROOT cause. My skin looks younger, but more importantly, I FEEL more peaceful. That's priceless.",
                  rating: 5
                },
                {
                  name: "Amanda K.",
                  age: "29",
                  image: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/4.jpeg",
                  text: "The science makes so much sense. Why wasn't anyone talking about stress and nutrient absorption before? Game-changer for busy professionals.",
                  rating: 5
                },
                {
                  name: "Rachel M.",
                  age: "31",
                  image: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/5.jpeg",
                  text: "My dark circles are GONE. I look well-rested even on 5 hours of sleep. The bio-acoustic concept is brilliant—this is the future of beauty.",
                  rating: 5
                },
                {
                  name: "Emily C.",
                  age: "27",
                  image: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/1.jpeg",
                  text: "Best investment I've made this year. The bundle saved me money AND transformed my skin. Everyone needs to try this.",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border-2 border-amber-100 hover:border-amber-300 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover border-2 border-amber-300"/>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">Age {testimonial.age}</div>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section id="checkout" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
              Exclusive <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">Launch Offer</span>
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Don't wait until the damage is permanent. Secure your ritual today.
            </p>

            <div className="space-y-6">
              {/* Starter Package */}
              <div className="bg-gradient-to-br from-white to-amber-50 p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 shadow-lg hover:shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">1 Box (The Starter)</h3>
                    <p className="text-gray-600">Try the ritual and experience the difference</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-amber-600">$60</div>
                    <div className="text-sm text-gray-500">30-day supply</div>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = '/drelf'}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Get The Starter
                </button>
              </div>

              {/* Transformation Bundle - FEATURED */}
              <div className="relative bg-gradient-to-br from-amber-100 to-rose-100 p-1 rounded-2xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                    🔥 BEST VALUE - SAVE $80
                  </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-start mb-6 mt-2">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">3 Boxes (The Transformation Bundle)</h3>
                      <p className="text-gray-600 mb-4">Complete transformation package—most popular choice</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-700">
                          <Shield className="w-5 h-5" />
                          <span className="font-semibold">Total $100 + FREE Shipping</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Heart className="w-5 h-5" />
                          <span>90-day transformation journey</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 line-through">$180</div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">$100</div>
                      <div className="text-sm text-gray-600">Best Value Bundle</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-6 rounded-xl mb-6 border-2 border-amber-200">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Exclusive Bundle Bonuses:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <span>FREE Exclusive Bio-Acoustic Relaxation Audio Library ($47 value)</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <span>FREE Express Shipping (Singapore-wide)</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <span>Priority Beauty Consultation via WhatsApp</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <span>VIP Beauty Guide Booklet</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => window.location.href = '/drelf'}
                    className="w-full py-5 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 text-white rounded-full font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mb-4"
                  >
                    Get Bundle & Save $80 <ChevronRight size={24} />
                  </button>

                  <div className="text-center space-y-2 text-sm text-gray-600">
                    <p>✓ Secure & Trusted Payment</p>
                    <p>✓ 30-Day Money-Back Guarantee</p>
                    <p>✓ Fast & Reliable Delivery</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <a 
                  href="https://wa.me/62895325633487?text=Kak%20I%20would%20like%20to%20ask%20Drelf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle size={20} />
                  Any Questions? Chat with our CS
                </a>
              </div>

              <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200 mt-8">
                <p className="text-center text-gray-700 font-semibold mb-2">
                  ⚠️ Limited Stock Available for Singapore Launch Phase
                </p>
                <p className="text-center text-gray-600 text-sm">
                  Due to high demand and limited production capacity, we can only accept a limited number of orders this month. Secure yours now before stock runs out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-amber-100 via-rose-100 to-amber-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Beauty is a Choice.
              <span className="block text-amber-600">Which One Will You Make?</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200">
                <div className="text-4xl mb-4">😔</div>
                <h3 className="font-bold text-gray-900 mb-3">Without DRELF</h3>
                <ul className="space-y-2 text-left text-gray-600 text-sm">
                  <li>❌ Spend thousands, get minimal results</li>
                  <li>❌ Constant stress, dull skin</li>
                  <li>❌ Insecure every day</li>
                  <li>❌ Look older than your age</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-6 rounded-2xl shadow-xl border-2 border-amber-300">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-bold text-gray-900 mb-3">With DRELF</h3>
                <ul className="space-y-2 text-left text-gray-700 text-sm">
                  <li>✓ Natural glow from within</li>
                  <li>✓ Calm, happy, confident</li>
                  <li>✓ Compliments keep coming</li>
                  <li>✓ Holistic anti-aging</li>
                </ul>
              </div>
            </div>

            <p className="text-xl text-gray-700 mb-8">
              The best investment is in yourself. 
              <span className="block font-bold text-amber-600 mt-2">Start today, see results in 2-4 weeks.</span>
            </p>

            <button 
              onClick={() => window.location.href = '/drelf'}
              className="px-12 py-5 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 text-white rounded-full font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Yes, I Want Holistic Beauty Now!
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                  DRELF.ID
                </h3>
                <p className="text-gray-400 text-sm">
                  The world's first holistic beauty revolution. Mind, Body, Skin.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>WhatsApp CS: +62 895-3256-33487</p>
                  <p>Email: support@drelf.id</p>
                  <p>Operating Hours: 09:00-21:00 SGT</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Our Guarantee</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>✓ HSA Certified</p>
                  <p>✓ 30-Day Money-Back Guarantee</p>
                  <p>✓ FREE Shipping Singapore-wide</p>
                  <p>✓ Secure Payment</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-500 text-sm">
                © 2024 DRELF.ID - All Rights Reserved.
              </p>
              <p className="text-gray-600 text-xs mt-2">
                Results may vary depending on individual conditions. Consult a doctor if you have specific medical conditions.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/*
 * Extracted URLs, Links, Images, and Video Paths from src/pages/drelflp.tsx:
 *
 * Image Assets (local paths):
 * - @/assets/checkout1.png
 * - @/assets/home1.png
 * - @/assets/siteicon.png
 * - @/assets/drelf4.png
 * - @/assets/drelf5.png
 * - @/assets/produk1.png
 * - @/assets/produk2.png
 * - @/assets/produk3.png
 * - @/assets/why1.png
 * - @/assets/why2.png
 * - @/assets/why3.png
 * - @/assets/1.jpeg
 * - @/assets/2.jpeg
 * - @/assets/3.jpeg
 * - @/assets/4.jpeg
 * - @/assets/5.jpeg
 *
 * Video Paths:
 * - https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/rus.mp4
 * - /rus.jpg (poster image for video)
 *
 * External Links/URLs:
 * - https://app.elvisiongroup.com/drelf
 * - https://wa.me/628980040002?text=Kak%20mau%20tanya%20Drelf
 */