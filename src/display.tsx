import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Folder, ChevronDown, ChevronRight, BookOpen, Star } from "lucide-react";

const DisplayPage = () => {
  const navigate = useNavigate();
  const [isEbookFolderOpen, setIsEbookFolderOpen] = useState(false);
  
  const ebookLinks = [
    { title: "Uang Panas System", url: "/ebook_uangpanas", desc: "Generate Income", gradient: "from-red-600 to-orange-600" },
    { title: "Feminine Magnetism", url: "/ebook_feminine", desc: "Activate Energy", gradient: "from-pink-600 to-rose-600" },
    { title: "ADHD Kids Skill Pack", url: "/ebook_adhd", desc: "Focus Skills", gradient: "from-blue-600 to-indigo-600" },
    { title: "Rahasia Kesembuhan", url: "/ebook_arif", desc: "Natural Healing", gradient: "from-green-600 to-emerald-600" },
    { title: "Ebook eL Vision", url: "/ebook_elvision", desc: "Master Vision", gradient: "from-purple-600 to-pink-600" },
    { title: "Grief Therapy Indonesia", url: "/ebook_grief", desc: "Healing Loss", gradient: "from-teal-600 to-cyan-600" },
    { title: "Program Diet", url: "/ebook_langsing", desc: "Ideal Weight", gradient: "from-lime-600 to-green-600" },
    { title: "Pria Alpha System", url: "/ebook_percayadiri", desc: "Build Confidence", gradient: "from-red-600 to-orange-600" },
    { title: "Invest Tracker", url: "/ebook_tracker", desc: "Track Wealth", gradient: "from-blue-600 to-cyan-600" },
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
          <p className="text-slate-700 text-sm font-semibold uppercase tracking-widest">Global Hub</p>
        </div>

        <div className="space-y-3">
          {/* Drelf Ritual */}
          <div 
            onClick={() => handleNavigation('/drelflp')}
            className="group cursor-pointer border border-slate-200 bg-white hover:border-slate-400 hover:shadow-md transition-all duration-200 rounded-2xl p-4 flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                <Star className="w-5 h-5 text-[#BF953F]" />
              </div>
              <div>
                <h2 className={`font-bold text-lg bg-gradient-to-r from-[#BF953F] to-[#B38728] bg-clip-text text-transparent`}>
                  Drelf Collagen Ritual
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Bio-Acoustic Beauty</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-all" />
          </div>

          {/* eL Royal Jewelry */}
          <div 
            onClick={() => handleNavigation('/jewelry')}
            className="group cursor-pointer border border-slate-200 bg-white hover:border-slate-400 hover:shadow-md transition-all duration-200 rounded-2xl p-4 flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className={`font-bold text-lg bg-gradient-to-r from-amber-400 to-amber-700 bg-clip-text text-transparent`}>
                  eL Royal Jewelry
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Premium Moissanite Collection</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-all" />
          </div>

          {/* FitFactor Herbal */}
          <div 
            onClick={() => handleNavigation('/fitfactor')}
            className="group cursor-pointer border border-slate-200 bg-white hover:border-slate-400 hover:shadow-md transition-all duration-200 rounded-2xl p-4 flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                <Star className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h2 className={`font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent`}>
                  FitFactor Herbal
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Natural Circulation Support</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-all" />
          </div>

          {/* eL Royale Parfum */}
          <div 
            onClick={() => handleNavigation('/parfum')}
            className="group cursor-pointer border border-slate-200 bg-white hover:border-slate-400 hover:shadow-md transition-all duration-200 rounded-2xl p-4 flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                <Star className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h2 className={`font-bold text-lg bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent`}>
                  eL Royale Parfum
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Signature Scents</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-all" />
          </div>

          {/* HungryLater */}
          <div 
            onClick={() => handleNavigation('/hungrylater')}
            className="group cursor-pointer border border-slate-200 bg-white hover:border-slate-400 hover:shadow-md transition-all duration-200 rounded-2xl p-4 flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                <Star className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className={`font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent`}>
                  HungryLater
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Weight Control System</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-all" />
          </div>

          {/* Ebook Folder */}
          <div className="pt-2">
            <div 
              onClick={() => setIsEbookFolderOpen(!isEbookFolderOpen)}
              className={`cursor-pointer border-2 transition-all duration-300 rounded-2xl p-5 flex justify-between items-center shadow-md ${
                isEbookFolderOpen 
                ? 'border-blue-500 bg-blue-50/50 shadow-blue-100' 
                : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-colors ${isEbookFolderOpen ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
                  <Folder className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-extrabold text-xl text-slate-900">Ebook Collection</h2>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                    {isEbookFolderOpen ? 'Tap to close folder' : `Explore ${ebookLinks.length} digital products`}
                  </p>
                </div>
              </div>
              {isEbookFolderOpen ? <ChevronDown className="w-5 h-5 text-blue-500" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
            </div>

            {/* Folder Contents */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isEbookFolderOpen ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
              <div className="grid grid-cols-1 gap-2 pl-4 border-l-2 border-blue-100 ml-8">
                {ebookLinks.map((link, index) => (
                  <div 
                    key={index}
                    onClick={() => handleNavigation(link.url)}
                    className="group cursor-pointer border border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all duration-200 rounded-xl p-3 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                      <div>
                        <h3 className={`font-bold text-md bg-gradient-to-r ${link.gradient} bg-clip-text text-transparent`}>
                          {link.title}
                        </h3>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{link.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2026 eL Vision Group</p>
        </footer>
      </main>
    </div>
  );
};

export default DisplayPage;
