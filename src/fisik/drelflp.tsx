import { useEffect, useState } from "react";
import { ChevronRight, Shield, Globe } from "lucide-react";
import { 
  initFacebookPixelWithLogging, 
  trackPageViewEvent, 
  trackViewContentEvent 
} from '@/utils/fbpixel';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function DrelfLanding() {
  const PIXEL_ID = '1749197952320359';
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');

  const content = {
    EN: {
      trust: ["Fast Delivery from Indonesia", "Money Back Guarantee", "24/7 Support"],
      hero: {
        badge: "✨ World's First",
        title: "The World's First",
        subtitle: "Bio-Acoustic Beauty Ritual",
        desc1: "Stop wasting money on surface-level fixes.",
        desc2: "Heal from the subconscious to the cellular. 70% of true beauty comes from the peace of mind they never told you about.",
        cta: "Get Started Now",
        stats: ["Women Transformed", "Customer Rating", "Reorder Rate"]
      },
      pain: {
        title: "The Invisible Loss",
        subtitle: 'Did you know that "Stress-Induced Oxidation" can age your skin by 5 years in just 30 days?',
        items: [
          { title: "Wasting Thousands", desc: "Expensive serums, but skin still looks dull. Why?" },
          { title: "Dark Circles", desc: "Wake up looking tired. Every selfie needs editing." },
          { title: "Stress Kills Beauty", desc: "Cortisol rises, collagen drops 40%. Skin becomes the victim." },
          { title: "Declining Confidence", desc: "Looking in the mirror feels insecure. Why are you different?" }
        ],
        thinkTitle: "Think About This:",
        thinkDesc: "Laser treatments and fillers can exceed $3,000 a month. You are losing your skin's future equity.",
      },
      why: {
        title: "Why It's Different",
        subtitle: "The Science Behind The Ritual",
        items: [
          { title: "5000mg Marine Collagen", desc: "Precise clinical dose for maximum absorption and skin elasticity." },
          { title: "Premium Bird's Nest", desc: "Deep cellular hydration and repair at the cellular level." },
          { title: "The Frequency", desc: "Proprietary audio that prepares your nervous system for nutrient uptake." }
        ],
        scienceTitle: "The Science You Need to Know",
        scienceDesc: "Audio signals your system to RELAX, opening 'cellular gates' for better nutrient absorption."
      },
      gain: {
        title: "The Result",
        subtitle: "What You Can Expect",
        items: [
          { icon: "✨", title: "Glowing Skin", desc: "Deep, lit-from-within radiance that people will notice." },
          { icon: "😌", title: "Total Relaxation", desc: "Look rested even after long days and short nights." },
          { icon: "💰", title: "Massive Savings", desc: "Protect your month for just $60 instead of thousands in damage." }
        ],
        realTitle: "Real Results from Real Women",
        realDesc: "Join over 1,000 women who have transformed their skin and confidence."
      },
      checkout: {
        title: "Exclusive Launch Offer",
        subtitle: "Secure your ritual today.",
        starter: "1 Box (The Starter)",
        starterDesc: "Experience the difference",
        starterPrice: "$60",
        bundle: "3 Boxes (Transformation)",
        bundleDesc: "Complete transformation package",
        bundlePrice: "$100",
        save: "SAVE $80",
        bonuses: "Exclusive Bundle Bonuses:",
        bonusList: ["FREE Bio-Acoustic Audio Library", "FREE Express Shipping", "Priority Consultation", "VIP Beauty Guide"],
        ctaBundle: "Get Bundle & Save $80"
      },
      final: {
        title: "Beauty is a Choice.",
        subtitle: "Which One Will You Make?",
        without: "Without DRELF",
        with: "With DRELF",
        withoutList: ["Spend thousands, get minimal results", "Constant stress, dull skin", "Insecure every day", "Look older than your age"],
        withList: ["Natural glow from within", "Calm, happy, confident", "Compliments keep coming", "Holistic anti-aging"],
        invest: "The best investment is in yourself.",
        start: "Start today, see results in 2-4 weeks.",
        cta: "Yes, I Want Holistic Beauty Now!"
      },
      footer: {
        desc: "The world's first holistic beauty revolution. Mind, Body, Skin.",
        guarantee: "Our Guarantee"
      }
    },
    ID: {
      trust: ["Pengiriman Cepat dari Indonesia", "Garansi Uang Kembali", "Dukungan 24/7"],
      hero: {
        badge: "✨ Pertama di Dunia",
        title: "Pertama di Dunia",
        subtitle: "Ritual Kecantikan Bio-Acoustic",
        desc1: "Berhenti membuang uang untuk perbaikan luar saja.",
        desc2: "Sembuhkan dari alam bawah sadar hingga seluler. 70% kecantikan sejati berasal dari ketenangan pikiran.",
        cta: "Mulai Sekarang",
        stats: ["Wanita Bertransformasi", "Rating Pelanggan", "Tingkat Repeat Order"]
      },
      pain: {
        title: "Kerugian Tak Terlihat",
        subtitle: 'Tahukah Anda bahwa "Oksidasi Akibat Stres" dapat menua kan kulit 5 tahun hanya dalam 30 hari?',
        items: [
          { title: "Buang-buang Uang", desc: "Serum mahal, tapi kulit tetap kusam. Mengapa?" },
          { title: "Mata Panda", desc: "Bangun tidur terlihat lelah. Setiap selfie butuh edit." },
          { title: "Stres Membunuh Kecantikan", desc: "Kortisol naik, kolagen turun 40%. Kulit jadi korban." },
          { title: "Percaya Diri Menurun", desc: "Melihat cermin merasa tidak aman. Mengapa Anda berbeda?" }
        ],
        thinkTitle: "Pikirkan Ini:",
        thinkDesc: "Biaya laser dan filler bisa melebihi Rp 30 juta sebulan. Anda kehilangan masa depan kulit Anda.",
      },
      why: {
        title: "Mengapa Berbeda",
        subtitle: "Sains di Balik Ritual Kami",
        items: [
          { title: "5000mg Marine Collagen", desc: "Dosis klinis tepat untuk penyerapan maksimal dan elastisitas kulit." },
          { title: "Sarang Burung Walet", desc: "Hidrasi seluler dalam dan perbaikan pada tingkat sel." },
          { title: "Frekuensi Suara", desc: "Audio eksklusif yang menyiapkan sistem saraf untuk penyerapan nutrisi." }
        ],
        scienceTitle: "Sains Yang Perlu Anda Tahu",
        scienceDesc: "Sinyal audio merelaksasi sistem Anda, membuka 'gerbang seluler' untuk penyerapan nutrisi lebih baik."
      },
      gain: {
        title: "Hasil Nyata",
        subtitle: "Apa Yang Bisa Anda Harapkan",
        items: [
          { icon: "✨", title: "Kulit Glowing", desc: "Radiansi mendalam yang akan disadari orang sekitar." },
          { icon: "😌", title: "Relaksasi Total", desc: "Terlihat segar meski setelah hari yang panjang dan kurang tidur." },
          { icon: "💰", title: "Hemat Besar", desc: "Lindungi kulit Anda sebulan hanya dengan Rp 600rb." }
        ],
        realTitle: "Hasil Nyata dari Wanita Nyata",
        realDesc: "Bergabunglah dengan 1.000+ wanita yang telah bertransformasi."
      },
      checkout: {
        title: "Penawaran Peluncuran Eksklusif",
        subtitle: "Amankan ritual Anda hari ini.",
        starter: "1 Box (Pemula)",
        starterDesc: "Rasakan perbedaannya",
        starterPrice: "Rp 600rb",
        bundle: "3 Box (Transformasi)",
        bundleDesc: "Paket transformasi lengkap",
        bundlePrice: "Rp 1jt",
        save: "HEMAT Rp 800rb",
        bonuses: "Bonus Bundel Eksklusif:",
        bonusList: ["GRATIS Library Audio Bio-Acoustic", "GRATIS Pengiriman Ekspres", "Konsultasi Prioritas", "Panduan Kecantikan VIP"],
        ctaBundle: "Ambil Bundel & Hemat Rp 800rb"
      },
      final: {
        title: "Kecantikan adalah Pilihan.",
        subtitle: "Mana Yang Akan Anda Pilih?",
        without: "Tanpa DRELF",
        with: "Dengan DRELF",
        withoutList: ["Habis jutaan, hasil minimal", "Stres terus, kulit kusam", "Insecure setiap hari", "Terlihat lebih tua dari usia"],
        withList: ["Glow alami dari dalam", "Tenang, bahagia, percaya diri", "Pujian terus berdatangan", "Anti-aging holistik"],
        invest: "Investasi terbaik adalah diri sendiri.",
        start: "Mulai hari ini, lihat hasil dalam 2-4 minggu.",
        cta: "Ya, Saya Ingin Kecantikan Holistik!"
      },
      footer: {
        desc: "Revolusi kecantikan holistik pertama di dunia. Pikiran, Tubuh, Kulit.",
        guarantee: "Garansi Kami"
      }
    }
  };

  const t = content[lang];

  useEffect(() => {
    initFacebookPixelWithLogging(PIXEL_ID);
    trackPageViewEvent({}, `pageview-${Date.now()}`, PIXEL_ID);
    trackViewContentEvent({
      content_name: 'Drelf Collagen Ritual',
      value: lang === 'EN' ? 60.00 : 600000,
      currency: lang === 'EN' ? 'SGD' : 'IDR'
    }, `viewcontent-${Date.now()}`, PIXEL_ID);
  }, [lang]);

  const scrollToCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-[50] flex gap-2">
        <button 
          onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')}
          className="bg-white/80 backdrop-blur-md border border-amber-200 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-xs text-amber-900 hover:bg-amber-50 transition-all active:scale-95"
        >
          <Globe size={14} />
          {lang === 'EN' ? 'INDONESIA' : 'ENGLISH'}
        </button>
      </div>

      {/* Trust Banner */}
      <div className="bg-amber-900 text-amber-50 py-2 px-4 overflow-hidden">
        <div className="container mx-auto flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] md:text-xs font-bold uppercase tracking-widest animate-pulse">
          {t.trust.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-champagne to-rose-100 pt-12 pb-20">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full text-sm font-semibold text-amber-900 shadow-lg">
              {t.hero.badge}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t.hero.title}
              <span className="block bg-gradient-to-r from-amber-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                {t.hero.subtitle}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">{t.hero.desc1}</p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{t.hero.desc2}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={scrollToCheckout}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t.hero.cta} <ChevronRight size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {t.hero.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{i === 0 ? '1000+' : i === 1 ? '4.9/5' : '98%'}</div>
                  <div className="text-[10px] md:text-sm text-gray-600 uppercase font-bold">{stat}</div>
                </div>
              ))}
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
              loop playsInline controls className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Pain Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.pain.title.split(' ')[0]} <span className="text-rose-500">{t.pain.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-gray-600 mb-16 text-lg">{t.pain.subtitle}</p>
            <div className="grid md:grid-cols-2 gap-8 mb-16 text-left">
              {t.pain.items.map((pain, i) => (
                <div key={i} className="bg-gradient-to-br from-rose-50 to-amber-50 p-8 rounded-2xl border-2 border-rose-100">
                  <div className="text-4xl mb-4">{["💸", "😫", "😰", "😔"][i]}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{pain.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{pain.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-1 rounded-3xl">
              <div className="bg-white p-10 rounded-3xl">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">{t.pain.thinkTitle}</h3>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">{t.pain.thinkDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">
              {t.why.title.split(' ')[0]} <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">{t.why.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-xl text-center text-gray-600 mb-16">{t.why.subtitle}</p>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {t.why.items.map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-xl border-2 border-amber-100">
                  <img src={[
                    "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/why1.png",
                    "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/why2.png",
                    "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/drelf/why3.png"
                  ][i]} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-6"/>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-1 rounded-3xl text-center">
              <div className="bg-white p-12 rounded-3xl">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">{t.why.scienceTitle}</h3>
                <p className="text-lg text-gray-700 leading-relaxed">{t.why.scienceDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Result Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t.gain.title}</h2>
            <p className="text-xl text-gray-600 mb-16">{t.gain.subtitle}</p>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {t.gain.items.map((item, i) => (
                <div key={i} className="text-center p-8 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-100 shadow-lg">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-1 rounded-3xl">
              <div className="bg-white p-10 rounded-3xl">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.gain.realTitle}</h3>
                <p className="text-lg text-gray-700 mb-8">{t.gain.realDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section id="checkout" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
              {t.checkout.title.split(' ').slice(0,-1).join(' ')} <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">{t.checkout.title.split(' ').slice(-1)}</span>
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">{t.checkout.subtitle}</p>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white to-amber-50 p-8 rounded-2xl border-2 border-amber-200 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div><h3 className="text-2xl font-bold text-gray-900 mb-2">{t.checkout.starter}</h3><p className="text-gray-600">{t.checkout.starterDesc}</p></div>
                  <div className="text-right"><div className="text-3xl font-bold text-amber-600">{t.checkout.starterPrice}</div></div>
                </div>
                <button onClick={() => window.location.href = `/drelf?lang=${lang}`} className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-bold text-lg">{lang === 'EN' ? 'Get The Starter' : 'Ambil Paket Pemula'}</button>
              </div>
              <div className="relative bg-gradient-to-br from-amber-100 to-rose-100 p-1 rounded-2xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">🔥 {t.checkout.save}</div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-start mb-6 mt-2">
                    <div><h3 className="text-2xl font-bold text-gray-900 mb-2">{t.checkout.bundle}</h3><p className="text-gray-600 mb-4">{t.checkout.bundleDesc}</p></div>
                    <div className="text-right"><div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">{t.checkout.bundlePrice}</div></div>
                  </div>
                  <button onClick={() => window.location.href = `/drelf?lang=${lang}`} className="w-full py-5 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 text-white rounded-full font-bold text-xl">{t.checkout.ctaBundle}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="py-16 bg-gradient-to-br from-amber-100 via-rose-100 to-amber-100 text-center">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t.final.title}<span className="block text-amber-600">{t.final.subtitle}</span></h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200">
                <div className="text-4xl mb-4">😔</div><h3 className="font-bold text-gray-900 mb-3">{t.final.without}</h3>
                <ul className="space-y-2 text-left text-gray-600 text-sm">{t.final.withoutList.map((item, i) => <li key={i}>❌ {item}</li>)}</ul>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-6 rounded-2xl shadow-xl border-2 border-amber-300">
                <div className="text-4xl mb-4">✨</div><h3 className="font-bold text-gray-900 mb-3">{t.final.with}</h3>
                <ul className="space-y-2 text-left text-gray-700 text-sm">{t.final.withList.map((item, i) => <li key={i}>✓ {item}</li>)}</ul>
              </div>
            </div>
            <p className="text-xl text-gray-700 mb-8">{t.final.invest}<span className="block font-bold text-amber-600 mt-2">{t.final.start}</span></p>
            <button onClick={() => window.location.href = `/drelf?lang=${lang}`} className="px-12 py-5 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 text-white rounded-full font-bold text-xl shadow-xl">{t.final.cta}</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div><h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">DRELF.ID</h3><p className="text-gray-400 text-sm">{t.footer.desc}</p></div>
              <div><h4 className="font-semibold mb-4">{lang === 'EN' ? 'Contact' : 'Kontak'}</h4><div className="space-y-2 text-sm text-gray-400"><p>WhatsApp: +62 895-3256-33487</p><p>Email: support@drelf.id</p></div></div>
              <div><h4 className="font-semibold mb-4">{t.footer.guarantee}</h4><div className="space-y-2 text-sm text-gray-400">{t.checkout.bonusList.map((item, i) => <p key={i}>✓ {item}</p>)}</div></div>
            </div>
          </div>
        </div>
      </footer>
      <WhatsAppButton message="Hi Renata, I have a question about Drelf Collagen Ritual..." />
    </div>
  );
}
