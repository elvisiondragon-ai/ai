import { useNavigate } from "react-router-dom";

const DisplayPage = () => {
  const navigate = useNavigate();
  
  const links = [
    { title: "Uang Panas System", url: "/ebook_uangpanas", desc: "Generate Income", gradient: "from-red-600 to-orange-600" },
    { title: "Feminine Magnetism", url: "/ebook_feminine", desc: "Activate Energy", gradient: "from-pink-600 to-rose-600" },
    { title: "ADHD Kids Skill Pack", url: "/ebook_adhd", desc: "Focus Skills", gradient: "from-blue-600 to-indigo-600" },
    { title: "Rahasia Kesembuhan", url: "/ebook_arif", desc: "Natural Healing", gradient: "from-green-600 to-emerald-600" },
    { title: "Ebook eL Vision", url: "/ebook_elvision", desc: "Master Vision", gradient: "from-purple-600 to-pink-600" },
    { title: "Grief Therapy Indonesia", url: "/ebook_grief", desc: "Healing Loss", gradient: "from-teal-600 to-cyan-600" },
    { title: "Program Diet", url: "/ebook_langsing", desc: "Ideal Weight", gradient: "from-lime-600 to-green-600" },
    { title: "Pria Alpha System", url: "/ebook_percayadiri", desc: "Build Confidence", gradient: "from-red-600 to-orange-600" },
    { title: "Invest Tracker", url: "/ebook_tracker", desc: "Track Wealth", gradient: "from-blue-600 to-cyan-600" },
    { title: "VIP 1:1 Coaching", url: "/vip_15jt", desc: "Exclusive Coaching", gradient: "from-amber-600 to-yellow-600" },
    { title: "VIP ACCESS", url: "https://wa.me/62895325633487", desc: "Elite Content", gradient: "from-amber-500 to-orange-600" },
    { title: "Ecosystem eL Vision", url: "https://wa.me/62895325633487", desc: "Full Ecosystem", gradient: "from-purple-600 to-indigo-600" },
    { title: "Direct Support", url: "https://wa.me/62895325633487", desc: "WhatsApp Us", gradient: "from-green-600 to-teal-600" },
    { title: "Founder Instagram", url: "https://www.instagram.com/elreyzandra", desc: "Follow Journey", gradient: "from-pink-600 to-purple-600" },
  ];

  const handleNavigation = (url: string) => {
    if (url.startsWith('/')) {
      navigate(url);
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-100 rounded-full blur-[100px] opacity-50" />
      </div>

      <main className="w-full max-w-md mt-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">eL Vision Group</h1>
          <p className="text-slate-700 text-sm font-semibold">Effortless Wealthy Life</p>
        </div>

        <div className="space-y-3">
          {links.map((link, index) => (
            <div 
              key={index}
              onClick={() => handleNavigation(link.url)}
              className="group cursor-pointer border border-slate-200 bg-white hover:border-slate-400 hover:shadow-md transition-all duration-200 rounded-xl p-4 flex justify-between items-center shadow-sm"
            >
              <div>
                <h2 className={`font-bold text-lg bg-gradient-to-r ${link.gradient} bg-clip-text text-transparent`}>
                  {link.title}
                </h2>
                <p className="text-xs text-slate-900 font-bold uppercase tracking-tight">{link.desc}</p>
              </div>
              <span className="text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all">→</span>
            </div>
          ))}
        </div>

        <footer className="mt-16 text-center text-slate-600 text-xs font-medium">
          <p>© 2026 eL Vision Group</p>
        </footer>
      </main>
    </div>
  );
};

export default DisplayPage;
