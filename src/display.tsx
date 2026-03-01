import { useState, useEffect, useRef } from "react";
import { initFacebookPixelWithLogging, trackPageViewEvent, trackViewContentEvent, trackCapiOnlyEvent } from "./utils/fbpixel";
import demoProduct from "./assets/display/nano_banana_demo_1_product.png";
import demoAutoReply from "./assets/display/nano_banana_demo_2_autoreply.png";
import demoAutoDM from "./assets/display/nano_banana_demo_3_autodm.png";
import demoAnalysis from "./assets/display/demo_ai_analysis.png";
import demoVoice from "./assets/display/voice.mp3";
import demoVideo from "./assets/darkfem_id/video3.mp4";
import umkmVideo from "./assets/UMKM_V1.mp4";
import umkmThumb from "./assets/UMKM_V1.jpeg";

const PIXEL_ID = "2158382114674235";
const TEST_CODE = "TEST39702";
const CAPI_SECRET = "CAPI_UMKM";

type Language = "id" | "en";

const translations = {
    id: {
        navPrice: "Lihat Harga",
        heroBadge: "🚀 Untuk UMKM Indonesia",
        heroTitle: "Ubah Komentar Menjadi ",
        heroTitleAccent: "Uang Secara Otomatis!",
        heroSub: "Pernah lihat postingan viral yang minta orang ketik \"MAU\"? Itu bukan sihir — itu sistem kami. Dan sekarang, Anda bisa punya sistem yang sama.",
        ctaPesan: "Pesan Sekarang →",
        ctaDemo: "Lihat Demo",
        heroFoot: "Setup < 1 Jam · Tanpa Ribet · Hasil Instan",
        flowTitle: "Begini cara kerjanya",
        flowSteps: [
            { icon: "💬", title: "Calon pembeli ketik \"MAU\" di komentar", sub: "Algoritma Instagram pun ikut naik karena banyak interaksi" },
            { icon: "⚡", title: "Sistem kami membalas komentar secara otomatis", sub: "Real-time, tanpa Anda harus pegang HP" },
            { icon: "📦", title: "DM berisi link katalog/pesanan dikirim otomatis", sub: "Calon pembeli langsung bisa order. Anda bisa tidur nyenyak." },
        ],
        orderBadge: "✅ Sangat Mudah",
        orderTitle: "4 Langkah Mulai Autopilot",
        orderSteps: [
            { icon: "🎯", title: "Pilih Paket", desc: "Tentukan paket yang sesuai dengan kebutuhan skala usaha Anda." },
            { icon: "📱", title: "Hubungi CS", desc: "Klik tombol pesan untuk terhubung langsung dengan tim setup kami via WhatsApp." },
            { icon: "💸", title: "Transfer", desc: "Lakukan pembayaran sesuai paket yang dipilih untuk aktivasi sistem." },
            { icon: "🚀", title: "Mulai & Data", desc: "Berikan data chat/format yang diinginkan. Dalam 1 jam, sistem Anda siap jualan!" },
        ],
        socialProof: "Sudah dipercaya 2.400+ UMKM Indonesia · Rating ⭐ 4.9/5",
        creativeBadge: "✨ Layanan Kreatif",
        creativeTitle: "Konten Mewah Tanpa Perlu Sewa Studio Mahal",
        creativeSub: "Kami menyediakan agen AI khusus yang bekerja seperti tim kreatif profesional — hanya untuk usaha Anda.",
        features: [
            { icon: "🖼️", title: "Image Generator", desc: "Foto produk Anda tampil sekelas iklan majalah. Upload foto biasa, AI kami poles jadi visual yang bikin orang berhenti scroll." },
            { icon: "🎬", title: "Video Generator", desc: "Video promosi estetik yang menghidupkan brand Anda. Dapatkan Reels & TikTok viral setiap minggu tanpa harus pusing editing atau rekam ulang." },
            { icon: "🎙️", title: "Voice Cloning AI", desc: "Kami klon suara Anda. Kirim teks, dan \"AI Anda\" yang bicara di video iklan dengan suara Anda yang asli!" },
            { icon: "🤖", title: "Chatbot WhatsApp", desc: "WhatsApp Anda membalas pesan calon pembeli 24 jam, persis seperti yang Anda mau. Tidak ada lagi pesan yang terlewat." },
            { icon: "📲", title: "Auto Trigger Pesanan", desc: "Ada pesanan masuk? Bot Anda otomatis kirim notifikasi ke pembeli DAN Anda. Semua terorganisir rapi." },
            { icon: "📊", title: "Laporan & Analisa AI", desc: "Ribuan baris datasheet pusing dibaca? Kami scrape dan jelaskan dalam bahasa manusia yang mudah dimengerti." },
        ],
        testimonialsBadge: "💬 Kata Mereka",
        testimonialsTitle: "UMKM Nyata, Hasil Nyata",
        testimonials: [
            { name: "Sari W.", biz: "Hijab Online · Bandung", text: "Awalnya saya takut ribet. Ternyata tim AutoSell setup cuma 45 menit! Sekarang tiap pagi DM sudah antri dari calon pembeli yang ketik MAU semalam." },
            { name: "Budi H.", biz: "Kuliner Frozen · Surabaya", text: "Omzet naik 3x dalam 2 bulan. Yang paling keren adalah foto produk saya sekarang kelihatan profesional banget. Pelanggan sering nanya pakai fotografer mana." },
            { name: "Dewi K.", biz: "Skincare UMKM · Jakarta", text: "Fitur Voice Cloning ini gila sih. Saya rekam suara sekali, sekarang tiap video iklan pakai suara saya sendiri tanpa harus rekaman lagi." },
        ],
        pricingBadge: "💰 Harga Transparan",
        pricingTitle: "Pilih Paket Yang Sesuai",
        promoTitle: "🎁 GRATIS WEBSITE UMKM SETIAP PEMBELIAN",
        promoSub: "👆 Tonton Demo: Bagaimana AI menghandle ratusan pembeli secara otomatis.",
        pricingSub: "Hemat hingga 30% dengan paket tahunan",
        billingMonthly: "Bulanan",
        billingYearly: "Tahunan 🎉",
        pricingFoot: "💡 Setup selesai dalam waktu kurang dari 1 jam · Hasil langsung terasa",
        faqBadge: "❓ Pertanyaan Umum",
        faqTitle: "Kami Jawab Kekhawatiran Anda",
        faqs: [
            { q: "Apakah saya perlu keahlian teknis?", a: "Sama sekali tidak. Anda cukup beri kami akses akun, dan tim kami yang setup semuanya dalam waktu kurang dari 1 jam. Anda hanya perlu duduk dan lihat hasilnya." },
            { q: "Apakah akun Instagram/WhatsApp saya aman?", a: "Keamanan akun Anda adalah prioritas kami. Kami menggunakan koneksi resmi via API Meta yang sudah tersertifikasi, bukan metode pihak ketiga yang berisiko." },
            { q: "Bagaimana cara kerja Voice Cloning?", a: "Anda kirim rekaman suara Anda (minimal 2 menit), AI kami mempelajarinya, lalu setiap teks yang Anda kirim bisa diubah menjadi suara Anda yang asli untuk video iklan." },
            { q: "Bisakah saya ganti paket kapan saja?", a: "Tentu bisa! Anda bisa upgrade atau downgrade paket kapan saja. Perubahan berlaku di siklus tagihan berikutnya." },
        ],
        ctaBottomTitle: "Siap Biarkan Sistem yang Jualan untuk Anda?",
        ctaBottomSub: "Bergabung dengan 2.400+ UMKM yang sudah autopilot. Setup selesai dalam 1 jam, hasil langsung terasa.",
        ctaBottomFoot: "Aktivasi cepat · CS Standby · Hasil Instan",
        footerText: "© 2025 Auto Sell with AI · Dibuat dengan ❤️ untuk UMKM Indonesia",
        assetLabels: {
            reply: "Auto Reply",
            dm: "Direct Message",
            product: "AI Product",
            analysis: "AI Analysis"
        },
        supportBox: {
            title: "AI eL Vision adalah Support no 1 Business UMKM yang gaptek menggunakan AI",
            desc: "Kamu cukup minta dan System kami yang akan otomatiskan semua. Dengan bahasa yang mudah dimengerti."
        },
        planFeatures: {
            starter: ["Auto Reply Komentar Instagram", "Auto DM ke Calon Pembeli", "Setup dalam 1 Jam", "Support via WhatsApp", "Laporan Mingguan Basic"],
            growth: ["Semua fitur Starter", "AI Chatbot WhatsApp", "Auto Trigger Pesanan", "Image Generator Produk (10/bln)", "Video Reels/TikTok (10/bln)", "Laporan AI Mingguan"],
            pro: ["Semua fitur Growth", "Voice Cloning AI", "Image Generator Tak Terbatas", "Video Promosi (12/bln)", "Analisa Datasheet Otomatis", "Manajer Akun Pribadi", "Priority Support 24/7"]
        }
    },
    en: {
        navPrice: "See Pricing",
        heroBadge: "🚀 For Global Businesses",
        heroTitle: "Turn Comments Into ",
        heroTitleAccent: "Money Automatically!",
        heroSub: "Ever seen a viral post asking people to type \"YES\"? That's not magic — it's our system. And now, you can have the same system for your brand.",
        ctaPesan: "Order Now →",
        ctaDemo: "Watch Demo",
        heroFoot: "Setup < 1 Hour · No Hassle · Instant Results",
        flowTitle: "How it works",
        flowSteps: [
            { icon: "💬", title: "Customer types \"YES\" in comments", sub: "Your engagement skyrockets as the algorithm loves the interaction" },
            { icon: "⚡", title: "Our system replies automatically", sub: "Real-time response, without you touching your phone" },
            { icon: "📦", title: "DM with catalog/order link is sent", sub: "Customer orders instantly. You sleep soundly." },
        ],
        orderBadge: "✅ Simple Process",
        orderTitle: "4 Steps to Autopilot",
        orderSteps: [
            { icon: "🎯", title: "Pick a Plan", desc: "Choose the plan that fits your business scale." },
            { icon: "📱", title: "Contact CS", desc: "Click the order button to connect with our setup team via WhatsApp." },
            { icon: "💸", title: "Transfer", desc: "Make the payment for the selected plan to activate the system." },
            { icon: "🚀", title: "Start & Data", desc: "Provide chat data/formats. Your system will be ready in 1 hour!" },
        ],
        socialProof: "Trusted by 2,400+ Businesses · Rating ⭐ 4.9/5",
        creativeBadge: "✨ Creative Services",
        creativeTitle: "Luxury Content Without the Expensive Studio",
        creativeSub: "We provide specialized AI agents that work like a professional creative team — exclusively for your business.",
        features: [
            { icon: "🖼️", title: "Image Generator", desc: "Make your product photos look like magazine ads. Upload a normal photo, our AI makes it scroll-stopping." },
            { icon: "🎬", title: "Video Generator", desc: "Aesthetic promotional videos for Reels & TikTok every week. Consistent without daily re-filming." },
            { icon: "🎙️", title: "Voice Cloning AI", desc: "We clone your voice. Send text, and \"Your AI\" speaks in ad videos with your real voice!" },
            { icon: "🤖", title: "WhatsApp Chatbot", desc: "Your WhatsApp replies to leads 24/7, exactly how you want. No more missed messages." },
            { icon: "📲", title: "Auto Order Trigger", desc: "Order incoming? Your bot automatically notifies you and the customer. Stay organized." },
            { icon: "📊", title: "AI Reports & Analysis", desc: "Confused by thousands of datasheet rows? We scrape and explain it in plain human language." },
        ],
        testimonialsBadge: "💬 Testimonials",
        testimonialsTitle: "Real Businesses, Real Results",
        testimonials: [
            { name: "Sarah W.", biz: "Fashion Retail · Bandung", text: "I was afraid it would be complicated. Turns out the team set it up in 45 mins! Now every morning my DM is full of leads." },
            { name: "Ben H.", biz: "Food & Beverage · Surabaya", text: "Revenue tripled in 2 months. The coolest part is my product photos now look incredibly professional." },
            { name: "Diana K.", biz: "Skincare Brand · Jakarta", text: "This Voice Cloning feature is insane. I recorded my voice once, now every ad uses my real voice effortlessly." },
        ],
        pricingBadge: "💰 Transparent Pricing",
        pricingTitle: "Choose the Right Plan",
        promoTitle: "🎁 FREE WEBSITE WITH EVERY PURCHASE",
        promoSub: "👆 Watch Demo: See how AI handles hundreds of customers automatically.",
        pricingSub: "Save up to 30% with annual plans",
        billingMonthly: "Monthly",
        billingYearly: "Yearly 🎉",
        pricingFoot: "💡 Setup completed in less than 1 hour · Instant results",
        faqBadge: "❓ FAQ",
        faqTitle: "We Answer Your Concerns",
        faqs: [
            { q: "Do I need technical skills?", a: "Not at all. Just give us access, and our team sets everything up in under 1 hour. You just sit back and see the results." },
            { q: "Is my IG/WA account safe?", a: "Your security is our priority. We use official Meta API connections, not risky third-party methods." },
            { q: "How does Voice Cloning work?", a: "Send a recording of your voice (min. 2 mins), our AI learns it, then any text can be converted to your real voice." },
            { q: "Can I change plans anytime?", a: "Yes! You can upgrade or downgrade anytime. Changes apply to the next billing cycle." },
        ],
        ctaBottomTitle: "Ready to Let the System Sell for You?",
        ctaBottomSub: "Join 2,400+ businesses already on autopilot. Setup in 1 hour, results felt instantly.",
        ctaBottomFoot: "Fast activation · CS Standby · Instant Results",
        footerText: "© 2025 Auto Sell with AI · Built with ❤️ for Global Businesses",
        assetLabels: {
            reply: "Auto Reply",
            dm: "Direct Message",
            product: "AI Product",
            analysis: "AI Analysis"
        },
        supportBox: {
            title: "AI eL Vision adalah Support no 1 Business UMKM yang gaptek menggunakan AI",
            desc: "Kamu cukup minta dan System kami yang akan otomatiskan semua. Dengan bahasa yang mudah dimengerti."
        },
        planFeatures: {
            starter: ["Instagram Comment Auto-Reply", "Auto DM to Leads", "Setup in 1 Hour", "Support via WhatsApp", "Basic Weekly Report"],
            growth: ["All Starter Features", "WhatsApp AI Chatbot", "Auto Order Trigger", "AI Product Image (10/mo)", "Reels/TikTok Videos (10/mo)", "Weekly AI Report"],
            pro: ["All Growth Features", "Voice Cloning AI", "Unlimited AI Images", "Promo Videos (12/mo)", "Auto Datasheet Analysis", "Personal Account Manager", "24/7 Priority Support"]
        }
    }
};

const getPlans = (lang: Language) => {
    const f = translations[lang].planFeatures;
    return {
        monthly: [
            { name: "Starter", price: 299000, color: "#0EA5E9", features: f.starter, cta: lang === "id" ? "Pilih Paket" : "Pick Plan", highlight: false },
            { name: "Growth", price: 599000, color: "#10B981", features: f.growth, cta: lang === "id" ? "Pilih Paket" : "Pick Plan", highlight: true },
            { name: "Pro", price: 999000, color: "#8B5CF6", features: f.pro, cta: lang === "id" ? "Pilih Paket" : "Pick Plan", highlight: false },
        ],
        yearly: [
            { name: "Starter", price: 2490000, color: "#0EA5E9", features: f.starter, cta: lang === "id" ? "Pilih Paket" : "Pick Plan", highlight: false },
            { name: "Growth", price: 4990000, color: "#10B981", features: f.growth, cta: lang === "id" ? "Pilih Paket" : "Pick Plan", highlight: true },
            { name: "Pro", price: 8490000, color: "#8B5CF6", features: f.pro, cta: lang === "id" ? "Pilih Paket" : "Pick Plan", highlight: false },
        ],
    };
};

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return { ref, inView };
}

function AnimSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const { ref, inView } = useInView();
    return (
        <div
            ref={ref}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}

export default function LandingPage() {
    const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [lang, setLang] = useState<Language>("id");

    const t = translations[lang];
    const plans = getPlans(lang);

    useEffect(() => {
        initFacebookPixelWithLogging(PIXEL_ID);
        trackPageViewEvent({}, undefined, PIXEL_ID, undefined, TEST_CODE);
        trackViewContentEvent({
            content_name: 'Landing Page Auto Sell with AI',
            content_category: 'Service',
            content_ids: ['autosell_ai_lp'],
            content_type: 'product'
        }, undefined, PIXEL_ID, undefined, TEST_CODE);
    }, []);

    const formatCurrency = (n: number) =>
        lang === "id" ? "Rp " + n.toLocaleString("id-ID") : "$" + (n / 15000).toFixed(0);

    const whatsappLink = `https://wa.me/62895325633487?text=${encodeURIComponent(lang === "id" ? "Hai kak saya mau pesan Autosell bulanan" : "Hi, I would like to order the Autosell plan")}`;

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif", background: "#F8FAFC", color: "#0F172A", overflowX: "hidden" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; position: relative; width: 100%; touch-action: pan-y; }
        html { scroll-behavior: smooth; }
        .btn-primary {
          background: linear-gradient(135deg, #0EA5E9, #10B981);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(14,165,233,0.35); }
        .card { background: white; border-radius: 20px; box-shadow: 0 2px 20px rgba(0,0,0,0.06); }
        .badge { display: inline-block; background: #EFF6FF; color: #0EA5E9; border: 1px solid #BAE6FD; padding: 6px 16px; border-radius: 50px; font-size: 14px; font-weight: 600; }
        .step-num { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; flex-shrink: 0; }
        a { text-decoration: none; color: inherit; }
        .lang-btn { background: none; border: 1px solid #E2E8F0; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; color: #64748B; transition: all 0.2s; }
        .lang-btn.active { background: #0EA5E9; color: white; border-color: #0EA5E9; }
      `}</style>

            {/* NAV */}
            <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(248,250,252,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E2E8F0", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 20, background: "linear-gradient(135deg,#0EA5E9,#10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Auto Sell with AI
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button 
                        onClick={() => setLang(lang === "id" ? "en" : "id")} 
                        className="card"
                        style={{ 
                            padding: "8px 16px", 
                            fontSize: "14px", 
                            fontWeight: "700", 
                            cursor: "pointer", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px", 
                            border: "1px solid #E2E8F0",
                            background: "white",
                            color: "#475569"
                        }}
                    >
                        {lang === "id" ? "🇬🇧 EN" : "🇮🇩 ID"}
                    </button>
                </div>
            </nav>

            {/* SUPPORT BOX TOP */}
            <section style={{ padding: "40px 24px 0", maxWidth: 800, margin: "0 auto" }}>
                <AnimSection>
                    <div style={{ background: "linear-gradient(135deg, #0F172A, #1E293B)", borderRadius: 24, padding: "32px", textAlign: "center", color: "white", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <div style={{ display: "inline-block", background: "rgba(14,165,233,0.2)", color: "#38BDF8", padding: "6px 16px", borderRadius: 50, fontSize: "12px", fontWeight: "800", marginBottom: "16px", letterSpacing: "1px", textTransform: "uppercase" }}>
                            #1 AI Support UMKM
                        </div>
                        <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "800", lineHeight: "1.3", marginBottom: "12px" }}>
                            {t.supportBox.title}
                        </h2>
                        <p style={{ color: "#94A3B8", fontSize: "16px", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto" }}>
                            {t.supportBox.desc}
                        </p>
                    </div>
                </AnimSection>
            </section>

            {/* HERO */}
            <section style={{ padding: "80px 24px 60px", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
                <AnimSection>
                    <span className="badge">{t.heroBadge}</span>
                    <h1 style={{ fontSize: "clamp(32px,6vw,52px)", fontWeight: 800, lineHeight: 1.2, marginTop: 20, marginBottom: 20 }}>
                        {t.heroTitle}
                        <span style={{ background: "linear-gradient(135deg,#0EA5E9,#10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {t.heroTitleAccent}
                        </span>
                    </h1>
                    <p style={{ fontSize: 18, lineHeight: 1.7, color: "#475569", marginBottom: 32 }}>
                        {t.heroSub}
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href={whatsappLink} target="_blank" onClick={() => trackCapiOnlyEvent('InitiateCheckout', {}, PIXEL_ID, CAPI_SECRET, TEST_CODE)}>
                            <button className="btn-primary" style={{ fontSize: 18 }}>{t.ctaPesan}</button>
                        </a>
                        <button style={{ padding: "16px 28px", borderRadius: 50, border: "2px solid #CBD5E1", background: "transparent", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#334155" }}>
                            {t.ctaDemo}
                        </button>
                    </div>
                    <p style={{ marginTop: 16, fontSize: 14, color: "#94A3B8" }}>{t.heroFoot}</p>
                </AnimSection>

                {/* FLOW VISUAL */}
                <AnimSection delay={0.15}>
                    <div style={{ marginTop: 60, background: "white", borderRadius: 24, padding: "32px 28px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)", textAlign: "left" }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, marginBottom: 24, textTransform: "uppercase" }}>{t.flowTitle}</p>
                        {t.flowSteps.map((s, i) => (
                            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: i < 2 ? 24 : 0, paddingBottom: i < 2 ? 24 : 0, borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
                                <div className="step-num" style={{ background: "#F1F5F9", color: "#0F172A" }}>{s.icon}</div>
                                <div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: 1 }}>{lang === "id" ? "LANGKAH" : "STEP"} 0{i+1}</div>
                                    <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>{s.title}</div>
                                    <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>{s.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimSection>
            </section>

            {/* HOW TO ORDER SECTION */}
            <section style={{ background: "#F1F5F9", padding: "80px 24px" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <AnimSection>
                        <div style={{ textAlign: "center", marginBottom: 48 }}>
                            <span className="badge">{t.orderBadge}</span>
                            <h2 style={{ fontSize: "clamp(26px,4vw,36px)", fontWeight: 800, marginTop: 16 }}>{t.orderTitle}</h2>
                        </div>
                    </AnimSection>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
                        {t.orderSteps.map((step, i) => (
                            <AnimSection key={i} delay={i * 0.1}>
                                <div className="card" style={{ padding: 24, textAlign: "center", height: "100%" }}>
                                    <div style={{ fontSize: 32, marginBottom: 12 }}>{step.icon}</div>
                                    <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{step.title}</h3>
                                    <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.5 }}>{step.desc}</p>
                                </div>
                            </AnimSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* SOCIAL PROOF STRIP */}
            <div style={{ background: "linear-gradient(135deg,#0EA5E9,#10B981)", padding: "20px 24px", textAlign: "center" }}>
                <p style={{ color: "white", fontWeight: 600, fontSize: 16 }}>
                    🎉 {t.socialProof}
                </p>
            </div>

            {/* AI TWIN SECTION */}
            <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
                <AnimSection>
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <span className="badge">{t.creativeBadge}</span>
                        <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, marginTop: 16, lineHeight: 1.2 }}>
                            {t.creativeTitle}
                        </h2>
                        <p style={{ color: "#475569", fontSize: 17, marginTop: 12, maxWidth: 520, margin: "12px auto 0" }}>
                            {t.creativeSub}
                        </p>
                    </div>
                </AnimSection>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
                    {t.features.map((item, i) => (
                        <AnimSection key={i} delay={i * 0.07}>
                            <div className="card" style={{ padding: 28, height: "100%", transition: "transform 0.2s, box-shadow 0.2s" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
                            >
                                <div style={{ width: 52, height: 52, borderRadius: 16, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 16 }}>{item.icon}</div>
                                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{item.title}</h3>
                                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.6, marginBottom: (item.title.includes("Video") || item.title.includes("Image") || item.title.includes("Chatbot") || item.title.includes("Trigger") || item.title.includes("Laporan") || item.title.includes("Analisa") || item.title.includes("Voice")) ? 16 : 0 }}>{item.desc}</p>
                                {item.title.includes("Video") && (
                                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", marginTop: 12 }}>
                                        <video src={demoVideo} controls loop playsInline style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover", display: "block" }} />
                                    </div>
                                )}
                                {item.title.includes("Image") && (
                                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", marginTop: 12 }}>
                                        <img src={demoProduct} alt="AI Product" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                                    </div>
                                )}
                                {item.title.includes("Voice") && (
                                    <div style={{ marginTop: 12 }}>
                                        <audio src={demoVoice} controls style={{ width: "100%" }} />
                                    </div>
                                )}
                                {item.title.includes("Chatbot") && (
                                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", marginTop: 12 }}>
                                        <img src={demoAutoDM} alt="Chatbot DM" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                                    </div>
                                )}
                                {item.title.includes("Trigger") && (
                                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", marginTop: 12 }}>
                                        <img src={demoAutoReply} alt="Auto Trigger Reply" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                                    </div>
                                )}
                                {(item.title.includes("Laporan") || item.title.includes("Analisa")) && (
                                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", marginTop: 12 }}>
                                        <img src={demoAnalysis} alt="AI Analysis" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                                    </div>
                                )}
                            </div>
                        </AnimSection>
                    ))}
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section style={{ background: "#F1F5F9", padding: "72px 24px" }}>
                <AnimSection>
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <span className="badge">{t.testimonialsBadge}</span>
                        <h2 style={{ fontSize: "clamp(26px,4vw,36px)", fontWeight: 800, marginTop: 16 }}>{t.testimonialsTitle}</h2>
                    </div>
                </AnimSection>
                <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
                    {t.testimonials.map((t_item, i) => (
                        <AnimSection key={i} delay={i * 0.1}>
                            <div className="card" style={{ padding: 28 }}>
                                <div style={{ color: "#F59E0B", fontSize: 18, marginBottom: 12 }}>{"★".repeat(5)}</div>
                                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155", marginBottom: 20 }}>"{t_item.text}"</p>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#0EA5E9,#10B981)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18 }}>{t_item.name[0]}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15 }}>{t_item.name}</div>
                                        <div style={{ fontSize: 13, color: "#94A3B8" }}>{t_item.biz}</div>
                                    </div>
                                </div>
                            </div>
                        </AnimSection>
                    ))}
                </div>
            </section>

            {/* PRICING */}
            <section id="harga" style={{ maxWidth: 980, margin: "0 auto", padding: "80px 24px" }}>
                <AnimSection>
                    <div style={{ textAlign: "center", marginBottom: 40 }}>
                        <span className="badge">{t.pricingBadge}</span>
                        <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, marginTop: 16 }}>{t.pricingTitle}</h2>
                        
                        {/* PROMO BOX WITH VIDEO */}
                        <div style={{ maxWidth: 700, margin: "32px auto 0", background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", border: "2px dashed #F59E0B", borderRadius: 24, overflow: "hidden", boxShadow: "0 10px 30px rgba(245,158,11,0.15)" }}>
                            <div style={{ padding: "16px 24px", background: "rgba(245,158,11,0.1)", borderBottom: "1px dashed #F59E0B" }}>
                                <p style={{ color: "#92400E", fontWeight: 800, fontSize: 18 }}>
                                    {t.promoTitle}
                                </p>
                            </div>
                            <div style={{ padding: "20px" }}>
                                <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", background: "black" }}>
                                    <video 
                                        src={umkmVideo} 
                                        poster={umkmThumb}
                                        controls 
                                        playsInline 
                                        style={{ width: "100%", display: "block" }} 
                                    />
                                </div>
                                <p style={{ color: "#B45309", fontSize: 14, marginTop: 16, fontWeight: 700 }}>
                                    {t.promoSub}
                                </p>
                            </div>
                        </div>

                        <p style={{ color: "#475569", fontSize: 16, marginTop: 32 }}>{t.pricingSub}</p>

                        <div style={{ display: "inline-flex", background: "#F1F5F9", borderRadius: 50, padding: 4, marginTop: 24, gap: 4 }}>
                            {(["monthly", "yearly"] as const).map(b => (
                                <button key={b} onClick={() => setBilling(b)} style={{ padding: "10px 24px", borderRadius: 50, border: "none", background: billing === b ? "white" : "transparent", boxShadow: billing === b ? "0 2px 8px rgba(0,0,0,0.08)" : "none", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", color: billing === b ? "#0F172A" : "#64748B", transition: "all 0.2s" }}>
                                    {b === "monthly" ? t.billingMonthly : t.billingYearly}
                                </button>
                            ))}
                        </div>
                    </div>
                </AnimSection>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "center" }}>
                    {plans[billing].map((plan, i) => (
                        <AnimSection key={plan.name} delay={i * 0.1}>
                            <div
                                className="card"
                                style={{
                                    padding: 32,
                                    border: plan.highlight ? `2px solid ${plan.color}` : "2px solid transparent",
                                    transform: plan.highlight ? "scale(1.03)" : "scale(1)",
                                    position: "relative",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                }}
                            >
                                {plan.highlight && (
                                    <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: plan.color, color: "white", padding: "4px 16px", borderRadius: 50, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>
                                        ⭐ {lang === "id" ? "Paling Populer" : "Most Popular"}
                                    </div>
                                )}
                                <div style={{ fontWeight: 800, fontSize: 20, color: plan.color, marginBottom: 8 }}>{plan.name}</div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                                    <span style={{ fontSize: 36, fontWeight: 800 }}>{formatCurrency(plan.price)}</span>
                                </div>
                                <div style={{ fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>/{billing === "monthly" ? (lang === "id" ? "bulan" : "month") : (lang === "id" ? "tahun" : "year")}</div>
                                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 20, marginBottom: 24 }}>
                                    {plan.features.map((f, j) => (
                                        <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                                            <span style={{ color: plan.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                                            <span style={{ fontSize: 15, color: "#334155" }}>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <a 
                                    href={whatsappLink} 
                                    target="_blank" 
                                    style={{ width: "100%" }}
                                    onClick={() => trackCapiOnlyEvent('InitiateCheckout', { value: plan.price, currency: 'IDR' }, PIXEL_ID, CAPI_SECRET, TEST_CODE)}
                                >
                                    <button
                                        className="btn-primary"
                                        style={{ width: "100%", background: plan.highlight ? `linear-gradient(135deg, ${plan.color}, #0EA5E9)` : "white", color: plan.highlight ? "white" : plan.color, border: `2px solid ${plan.color}`, textAlign: "center" as const }}
                                    >
                                        {plan.cta}
                                    </button>
                                </a>
                            </div>
                        </AnimSection>
                    ))}
                </div>
                <AnimSection delay={0.3}>
                    <p style={{ textAlign: "center", marginTop: 28, fontSize: 14, color: "#94A3B8" }}>
                        {t.pricingFoot}
                    </p>
                </AnimSection>
            </section>

            {/* FAQ */}
            <section style={{ background: "#F8FAFC", padding: "72px 24px" }}>
                <div style={{ maxWidth: 680, margin: "0 auto" }}>
                    <AnimSection>
                        <div style={{ textAlign: "center", marginBottom: 48 }}>
                            <span className="badge">{t.faqBadge}</span>
                            <h2 style={{ fontSize: "clamp(26px,4vw,36px)", fontWeight: 800, marginTop: 16 }}>{t.faqTitle}</h2>
                        </div>
                    </AnimSection>
                    {t.faqs.map((faq, i) => (
                        <AnimSection key={i} delay={i * 0.07}>
                            <div className="card" style={{ marginBottom: 12, overflow: "hidden" }}>
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    style={{ width: "100%", padding: "22px 24px", background: "none", border: "none", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "inherit" }}
                                >
                                    <span style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", paddingRight: 16 }}>{faq.q}</span>
                                    <span style={{ fontSize: 22, color: "#0EA5E9", flexShrink: 0, transform: activeFaq === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.3s" }}>+</span>
                                </button>
                                {activeFaq === i && (
                                    <div style={{ padding: "0 24px 22px", fontSize: 15, color: "#475569", lineHeight: 1.7 }}>{faq.a}</div>
                                )}
                            </div>
                        </AnimSection>
                    ))}
                </div>
            </section>

            {/* CTA BOTTOM */}
            <section style={{ padding: "80px 24px", textAlign: "center" }}>
                <AnimSection>
                    <div style={{ maxWidth: 620, margin: "0 auto", background: "linear-gradient(135deg,#0EA5E9,#10B981)", borderRadius: 28, padding: "56px 40px" }}>
                        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 16 }}>
                            {t.ctaBottomTitle}
                        </h2>
                        <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 17, marginBottom: 32, lineHeight: 1.6 }}>
                            {t.ctaBottomSub}
                        </p>
                        <a href={whatsappLink} target="_blank" onClick={() => trackCapiOnlyEvent('InitiateCheckout', {}, PIXEL_ID, CAPI_SECRET, TEST_CODE)}>
                            <button style={{ background: "white", color: "#0EA5E9", border: "none", padding: "18px 40px", borderRadius: 50, fontWeight: 800, fontSize: 18, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", transition: "transform 0.2s" }}
                                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                                onMouseLeave={e => (e.currentTarget.style.transform = "")}
                            >
                                {t.ctaPesan}
                            </button>
                        </a>
                        <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 16, fontSize: 14 }}>{t.ctaBottomFoot}</p>
                    </div>
                </AnimSection>
            </section>

            {/* FOOTER */}
            <footer style={{ borderTop: "1px solid #E2E8F0", padding: "28px 24px", textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 18, background: "linear-gradient(135deg,#0EA5E9,#10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>Auto Sell with AI</div>
                <p style={{ fontSize: 14, color: "#94A3B8" }}>{t.footerText}</p>
            </footer>
        </div>
    );
}
