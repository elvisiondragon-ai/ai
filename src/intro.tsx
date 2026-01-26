import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Heart, TrendingUp, Users, Award, ChevronDown, Zap, Shield, Compass } from 'lucide-react';

export default function IntroLanding() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeProof, setActiveProof] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const proofs = [
    {
      name: "Miyamoto Musashi",
      title: "Legendary Samurai",
      quote: "The mind is the essence of the swordsman. You must learn to perceive that which cannot be seen with the eyes.",
      insight: "Musashi won 60+ duels not through strength, but through MENTAL MASTERY. He trained his mind to SEE opportunity before his opponent moved."
    },
    {
      name: "Napoleon Hill",
      title: "Think and Grow Rich",
      quote: "Whatever the mind can conceive and believe, it can achieve.",
      insight: "After studying 500+ millionaires, Hill discovered: Wealth begins as a FEELING in the nervous system, not a strategy on paper."
    },
    {
      name: "Neville Goddard",
      title: "Mystic & Teacher",
      quote: "Assume the feeling of your wish fulfilled and observe the route that your attention follows.",
      insight: "Goddard proved that FEELING is the secret. When your body FEELS the result as real, reality rearranges to match it."
    },
    {
      name: "Bruce Lee",
      title: "Martial Artist & Philosopher",
      quote: "As you think, so shall you become.",
      insight: "Lee's power came from his ability to enter a state of 'no-mind' - where the nervous system acts without conscious interference."
    }
  ];

  const stats = [
    { number: "14", label: "Years of Mastery", icon: Award },
    { number: "10,000+", label: "Lives Transformed", icon: Users },
    { number: "3", label: "Core Domains", icon: Target },
    { number: "95%", label: "Success Rate", icon: TrendingUp }
  ];

  const methods = [
    {
      icon: Brain,
      title: "Bio-Energetic Calibration",
      description: "We don't motivate you. We recalibrate your subconscious operating system at the neurological level."
    },
    {
      icon: Heart,
      title: "Nervous System Mastery",
      description: "True change happens when your BODY feels the result. We teach your nervous system to resonate with your vision."
    },
    {
      icon: Zap,
      title: "Theta State Access",
      description: "We induce the 4-7Hz brainwave state where the subconscious becomes programmable—where real transformation occurs."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <span className="text-blue-400 text-sm font-semibold">14 YEARS OF PROVEN MASTERY</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Mind + Your Feeling =<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Your Reality
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            The West medicates depression. The East masters the mind.<br />
            <span className="text-blue-400 font-semibold">We teach you to flip the frequency.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-blue-500/50"
            >
              Start Your Transformation
            </button>
            <button 
              onClick={() => document.getElementById('proof-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-lg font-bold text-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Watch Proof →
            </button>
          </div>
          
          <ChevronDown className="mx-auto animate-bounce text-blue-400" size={32} />
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="mx-auto mb-4 text-blue-400" size={40} />
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The Problem Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            The <span className="text-red-400">Western Trap</span>
          </h2>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-red-400">❌ They Tell You:</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <span>"Think positive!" (While your body screams NO)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Take antidepressants (Numb the signal, ignore the problem)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <span>"Just work harder!" (Burnout is a badge of honor)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <span>Affirmations in the mirror (Conscious 5% vs Subconscious 95%)</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-green-400">✓ The Truth:</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Your FEELING creates reality, not your thoughts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Depression is a nervous system stuck in survival mode</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Effort without frequency alignment = exhaustion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <span>You must reprogram the 95% (subconscious)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 text-center">
            <p className="text-xl md:text-2xl font-semibold text-slate-200">
              "Flipping your feeling is NOT like flipping your hand.<br />
              <span className="text-blue-400">It requires precision engineering of the subconscious mind.</span>"
            </p>
          </div>
        </div>
      </div>

      {/* Historical Proof Section */}
      <div id="proof-section" className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Masters</span> Knew This
          </h2>
          <p className="text-xl text-slate-400 text-center mb-12">
            Throughout history, the greatest achievers understood: Mind + Feeling = Reality
          </p>
          
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {proofs.map((proof, i) => (
              <button
                key={i}
                onClick={() => setActiveProof(i)}
                className={`p-4 rounded-xl transition-all ${
                  activeProof === i 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50' 
                    : 'bg-slate-800/50 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-lg">{proof.name}</div>
                <div className="text-sm text-slate-400">{proof.title}</div>
              </button>
            ))}
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-2 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
              <div className="flex-1">
                <p className="text-2xl italic text-slate-200 mb-6">
                  "{proofs[activeProof].quote}"
                </p>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-blue-500/30">
                  <h4 className="text-blue-400 font-bold mb-2">THE INSIGHT:</h4>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {proofs[activeProof].insight}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Lincoln Principle */}
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-2 border-amber-500/50 rounded-2xl p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <Target className="text-amber-400" size={48} />
                <h2 className="text-3xl md:text-4xl font-bold">The Lincoln Principle</h2>
              </div>
              
              <blockquote className="text-2xl md:text-3xl italic text-slate-200 mb-8 pl-6 border-l-4 border-amber-500">
                "Give me 6 hours to chop a tree, I'll spend 4 hours sharpening the axe."
              </blockquote>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-red-400 mb-4">❌ What Others Do:</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li>• Jump straight to strategy (dull axe)</li>
                    <li>• Force action with misaligned mind</li>
                    <li>• Wonder why effort ≠ results</li>
                    <li>• Burnout. Quit. Repeat.</li>
                  </ul>
                </div>
                
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4">✓ What We Do:</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li>• <span className="text-amber-400 font-bold">70% time:</span> Sharpen the mind</li>
                    <li>• Calibrate nervous system to vision</li>
                    <li>• <span className="text-amber-400 font-bold">30% time:</span> Execute strategy</li>
                    <li>• <span className="text-green-400">Precise. Efficient. Fast.</span></li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <p className="text-xl text-center font-semibold">
                  We don't give you a vision until your mind is <span className="text-amber-400">BEYOND SHARP</span>.<br />
                  <span className="text-slate-400">Because a sharp mind cuts through reality like butter.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Profile Section */}
      <div className="py-20 px-6 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet the <span className="text-blue-400">Founder</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8" />
          </div>
          
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-700/50">
            <div className="flex flex-col items-center gap-6">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">El Reyzandra</h3>
                <p className="text-blue-400 font-medium">Indonesian Public Figure & Mind Power Specialist</p>
                <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
                  A visionary specializing in mind power and activation, El Reyzandra has dedicated his life to unlocking human potential. Through his proven methodologies, he has successfully guided and transformed the lives of hundreds of business leaders and entrepreneurs, helping them achieve breakthroughs in wealth, health, and relationships.
                </p>
              </div>
              
              <button 
                onClick={() => window.open('https://cirebon.inews.id/read/204537/ini-sosok-el-reyzandra-mentor-bisnis-yang-sukseskan-ratusan-pengusaha-muda/2', '_blank')}
                className="mt-4 px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-sm font-medium text-slate-300 transition-all hover:text-white hover:border-blue-500/50 flex items-center gap-2 group"
              >
                Read Founder Profile
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Our Method Section */}
      <div className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">eL Vision Method</span>
          </h2>
          <p className="text-xl text-slate-400 text-center mb-16">
            14 years. 10,000+ transformations. Three domains. One system.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {methods.map((method, i) => (
              <div 
                key={i}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <method.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{method.title}</h3>
                <p className="text-slate-400 leading-relaxed">{method.description}</p>
              </div>
            ))}
          </div>

          {/* Three Domains */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-2xl p-6">
              <Heart className="text-red-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-2">RELATIONSHIPS</h3>
              <p className="text-slate-400">From broken-hearted to magnetic. We fix the internal relationship first.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6">
              <Shield className="text-green-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-2">HEALTH</h3>
              <p className="text-slate-400">Terminal to regeneration. We activate your body's natural healing blueprint.</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border border-yellow-500/30 rounded-2xl p-6">
              <TrendingUp className="text-yellow-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-2">WEALTH</h3>
              <p className="text-slate-400">From struggle to ease. We remove the internal friction to abundance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* The Transformation Process */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            How It <span className="text-blue-400">Actually Works</span>
          </h2>
          
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Neutralization",
                description: "We interrupt the Beta Loop—the chronic stress pattern keeping you stuck. Using specific audio frequencies and guided cognition, we force your brain out of survival mode.",
                color: "from-red-500 to-orange-500"
              },
              {
                step: "02",
                title: "Theta State Access",
                description: "We induce the 4-7Hz brainwave state where your subconscious becomes programmable. This is where 95% of your reality is generated.",
                color: "from-blue-500 to-purple-500"
              },
              {
                step: "03",
                title: "Frequency Alignment",
                description: "We align your body's FELT SENSE of reality to your vision. When your nervous system feels 'this is normal,' reality rearranges without friction.",
                color: "from-green-500 to-emerald-500"
              },
              {
                step: "04",
                title: "Strategic Execution",
                description: "NOW we deploy strategy. With a calibrated mind, the same tactics that failed yesterday suddenly work today—because the operator changed.",
                color: "from-yellow-500 to-amber-500"
              }
            ].map((phase, i) => (
              <div 
                key={i}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-start gap-6">
                  <div className={`text-5xl font-bold bg-gradient-to-r ${phase.color} bg-clip-text text-transparent flex-shrink-0`}>
                    {phase.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{phase.title}</h3>
                    <p className="text-slate-400 text-lg leading-relaxed">{phase.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div id="final-cta" className="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <Compass className="mx-auto mb-6 text-blue-400" size={64} />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Sharpen Your Axe?
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            14 years of mastery. 10,000+ transformations. Your mind + feeling = your reality.<br />
            <span className="text-blue-400 font-semibold">Let's recalibrate your operating system.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={() => navigate('/usa_ebookhealth')}
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-xl hover:scale-105 transition-transform shadow-2xl shadow-blue-500/50"
            >
              Begin Your Transformation
            </button>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-sm rounded-xl font-bold text-xl hover:bg-white/20 transition-all border border-white/20">
              Book a Calibration Call
            </button>
          </div>
          
          <p className="text-slate-500 text-sm">
            Limited spots available. High achievers and impossible cases only.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-slate-500">
          <p className="mb-2">eL Vision © 2025 - Bio-Energetic Calibration System</p>
          <p className="text-sm">Founded by eL Reyzandra | 14 Years of Transformational Mastery</p>
        </div>
      </div>
    </div>
  );
}