import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, Heart, Crown, Sparkles, ArrowRight, MessageCircle, Instagram } from "lucide-react";

const DisplayPage = () => {
  const navigate = useNavigate();
  const links = [
    {
      title: "Uang Panas System",
      url: "/ebook_uangpanas",
      icon: TrendingUp,
      description: "Generate income with our proven system",
      color: "from-red-500 to-orange-600",
      isBeautiful: true,
    },
    {
      title: "Feminine Magnetism",
      url: "/ebook_feminine",
      icon: Heart,
      description: "Activate your feminine energy",
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "ADHD Executive Functioning Skill Pack",
      url: "/ebook_adhd",
      icon: Sparkles,
      description: "Focus & Organization Skills",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Rahasia Kesembuhan Natural",
      url: "/ebook_arif",
      icon: Heart,
      description: "Natural Healing Secrets",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Ebook eL Vision",
      url: "/ebook_elvision",
      icon: Crown,
      description: "Master Your Vision",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Grief Therapy Indonesia",
      url: "/ebook_grief",
      icon: Heart,
      description: "Healing from Loss",
      color: "from-teal-500 to-cyan-600",
    },
    {
      title: "Program Diet",
      url: "/ebook_langsing",
      icon: TrendingUp,
      description: "Achieve Your Ideal Weight",
      color: "from-lime-500 to-green-600",
    },
    {
      title: "Pria Alpha System",
      url: "/ebook_percayadiri",
      icon: Crown,
      description: "Build Unshakeable Confidence",
      color: "from-red-500 to-orange-600",
    },
    {
      title: "Invest Tracker Omnitracker",
      url: "/ebook_tracker",
      icon: TrendingUp,
      description: "Track All Your Investments",
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "VIP 1:1 Coaching",
      url: "/vip_15jt",
      icon: Crown,
      description: "Exclusive Personal Coaching",
      color: "from-amber-500 to-yellow-600",
      isBeautiful: true,
    },
    {
      title: "VIP ACCESS",
      url: "https://wa.me/62895325633487",
      icon: Crown,
      description: "Exclusive Access to Elite Content",
      color: "from-amber-400 via-yellow-500 to-orange-500",
    },
    {
      title: "Ecosystem eL Vision",
      url: "https://wa.me/62895325633487",
      icon: Sparkles,
      description: "Explore our full ecosystem",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Direct Support",
      url: "https://wa.me/62895325633487",
      icon: MessageCircle,
      description: "Contact us via WhatsApp",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Founder Instagram",
      url: "https://www.instagram.com/elreyzandra",
      icon: Instagram,
      description: "Follow our founder's journey",
      color: "from-pink-500 via-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <img 
            src="/logo.jpeg" 
            alt="Logo" 
            width="96" 
            height="96"
            fetchPriority="high"
            className="w-24 h-24 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(var(--primary),0.3)] rounded-full" 
          />
        </motion.div>
        <h1 className="text-4xl font-bold font-exo bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent mb-2 tracking-tight">
          eL Vision Group
        </h1>
        <p className="text-muted-foreground font-medium">Welcome to the future of Effortless Wealthy Life</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
        {links.map((link, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Card className={`overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 group relative ${link.isBeautiful ? 'shadow-lg shadow-amber-500/20 ring-1 ring-amber-500/30' : ''}`}>
              <Button
                variant="ghost"
                className="w-full h-auto p-0 rounded-none overflow-hidden"
                onClick={() => {
                  if (link.url.startsWith('/')) {
                    navigate(link.url);
                  } else {
                    window.open(link.url, "_blank");
                  }
                }}
              >
                <div className="w-full flex items-center p-5 gap-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${link.color} shadow-lg shadow-black/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <link.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`font-bold text-lg transition-colors duration-300 ${link.isBeautiful ? 'bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent' : 'text-foreground group-hover:text-primary'}`}>
                      {link.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium line-clamp-1">
                      {link.description}
                    </p>
                  </div>
                  <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {link.isBeautiful && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    <div className="absolute top-2 right-2">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    </div>
                  </>
                )}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-center"
      >
        <p className="text-muted-foreground text-sm font-medium">
          © 2026 eL Vision Group. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="link" size="sm" className="text-xs text-muted-foreground" onClick={() => window.open('https://app.elvisiongroup.com/terms', '_blank')}>Terms</Button>
          <Button variant="link" size="sm" className="text-xs text-muted-foreground" onClick={() => window.open('https://app.elvisiongroup.com/privacy-policy', '_blank')}>Privacy</Button>
        </div>
      </motion.footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </div>
  );
};

export default DisplayPage;
