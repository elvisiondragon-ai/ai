import { useState, useEffect, useRef } from "react";
import { initFacebookPixelWithLogging, trackPageViewEvent, trackInitiateCheckoutEvent } from "./utils/fbpixel";
import demoProduct from "./assets/display/nano_banana_demo_1_product.png";
import demoAutoReply from "./assets/display/nano_banana_demo_2_autoreply.png";
import demoAutoDM from "./assets/display/nano_banana_demo_3_autodm.png";
import demoAnalysis from "./assets/display/demo_ai_analysis.png";
import demoVoice from "./assets/display/voice.mp3";
import demoVideo from "./assets/darkfem_id/video3.mp4";

const PIXEL_ID = "2158382114674235";

const plans = {
    monthly: [
        {
            name: "Starter",
            price: 299000,
            color: "#0EA5E9",
            features: [
                "Auto Reply Komentar Instagram",
                "Auto DM ke Calon Pembeli",
                "Setup dalam 1 Jam",
                "Support via WhatsApp",
                "Laporan Mingguan Basic",
            ],
            cta: "Pilih Paket",
            highlight: false,
        },
        {
            name: "Growth",
            price: 599000,
            color: "#10B981",
            features: [
                "Semua fitur Starter",
                "AI Chatbot WhatsApp",
                "Auto Trigger Pesanan",
                "Image Generator Produk (10/bln)",
                "Video Reels/TikTok (10/bln)",
                "Laporan AI Mingguan",
            ],
            cta: "Pilih Paket",
            highlight: true,
        },
        {
            name: "Pro",
            price: 999000,
            color: "#8B5CF6",
            features: [
                "Semua fitur Growth",
                "Voice Cloning AI",
                "Image Generator Tak Terbatas",
                "Video Promosi (12/bln)",
                "Analisa Datasheet Otomatis",
                "Manajer Akun Pribadi",
                "Priority Support 24/7",
            ],
            cta: "Pilih Paket",
            highlight: false,
        },
    ],
    yearly: [
        {
            name: "Starter",
            price: 2490000,
            color: "#0EA5E9",
            features: [
                "Auto Reply Komentar Instagram",
                "Auto DM ke Calon Pembeli",
                "Setup dalam 1 Jam",
                "Support via WhatsApp",
                "Laporan Mingguan Basic",
            ],
            cta: "Pilih Paket",
            highlight: false,
        },
        {
            name: "Growth",
            price: 4990000,
            color: "#10B981",
            features: [
                "Semua fitur Starter",
                "AI Chatbot WhatsApp",
                "Auto Trigger Pesanan",
                "Image Generator Produk (10/bln)",
                "Video Reels/TikTok (10/bln)",
                "Laporan AI Mingguan",
            ],
            cta: "Pilih Paket",
            highlight: true,
        },
        {
            name: "Pro",
            price: 8490000,
            color: "#8B5CF6",
            features: [
                "Semua fitur Growth",
                "Voice Cloning AI",
                "Image Generator Tak Terbatas",
                "Video Promosi (12/bln)",
                "Analisa Datasheet Otomatis",
                "Manajer Akun Pribadi",
                "Priority Support 24/7",
            ],
            cta: "Pilih Paket",
            highlight: false,
        },
    ],
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

    useEffect(() => {
        initFacebookPixelWithLogging(PIXEL_ID);
        trackPageViewEvent({}, undefined, PIXEL_ID);
    }, []);

    const formatRupiah = (n: number) =>
        "Rp " + n.toLocaleString("id-ID");

    const faqs = [
        { q: "Apakah saya perlu keahlian teknis?", a: "Sama sekali tidak. Anda cukup beri kami akses akun, dan tim kami yang setup semuanya dalam waktu kurang dari 1 jam. Anda hanya perlu duduk dan lihat hasilnya." },
        { q: "Apakah akun Instagram/WhatsApp saya aman?", a: "Keamanan akun Anda adalah prioritas kami. Kami menggunakan koneksi resmi via API Meta yang sudah tersertifikasi, bukan metode pihak ketiga yang berisiko." },
        { q: "Bagaimana cara kerja Voice Cloning?", a: "Anda kirim rekaman suara Anda (minimal 2 menit), AI kami mempelajarinya, lalu setiap teks yang Anda kirim bisa diubah menjadi suara Anda yang asli untuk video iklan." },
        { q: "Bisakah saya ganti paket kapan saja?", a: "Tentu bisa! Anda bisa upgrade atau downgrade paket kapan saja. Perubahan berlaku di siklus tagihan berikutnya." },
    ];

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif", background: "#F8FAFC", color: "#0F172A", overflowX: "hidden" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
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
      `}</style>

            {/* NAV */}
            <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(248,250,252,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E2E8F0", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 20, background: "linear-gradient(135deg,#0EA5E9,#10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Auto Sell with AI
                </div>
                <a href="#harga">
                    <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>Lihat Harga</button>
                </a>
            </nav>

            {/* HERO */}
            <section style={{ padding: "80px 24px 60px", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
                <AnimSection>
                    <span className="badge">🚀 Untuk UMKM Indonesia</span>
                    <h1 style={{ fontSize: "clamp(32px,6vw,52px)", fontWeight: 800, lineHeight: 1.2, marginTop: 20, marginBottom: 20 }}>
                        Ubah Komentar Menjadi{" "}
                        <span style={{ background: "linear-gradient(135deg,#0EA5E9,#10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Uang Secara Otomatis!
                        </span>
                    </h1>
                    <p style={{ fontSize: 18, lineHeight: 1.7, color: "#475569", marginBottom: 32 }}>
                        Pernah lihat postingan viral yang minta orang ketik <strong>"MAU"</strong>? Itu bukan sihir — itu sistem kami. Dan sekarang, Anda bisa punya sistem yang sama.
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a 
                            href="https://wa.me/62895325633487?text=Hai%20kak%20saya%20mau%20pesan%20Autosell%20bulanan" 
                            target="_blank"
                            onClick={() => trackInitiateCheckoutEvent({}, undefined, PIXEL_ID)}
                        >
                            <button className="btn-primary" style={{ fontSize: 18 }}>Pesan Sekarang →</button>
                        </a>
                        <button style={{ padding: "16px 28px", borderRadius: 50, border: "2px solid #CBD5E1", background: "transparent", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#334155" }}>
                            Lihat Demo
                        </button>
                    </div>
                    <p style={{ marginTop: 16, fontSize: 14, color: "#94A3B8" }}>Setup &lt; 1 Jam · Tanpa Ribet · Hasil Instan</p>
                </AnimSection>

                {/* FLOW VISUAL */}
                <AnimSection delay={0.15}>
                    <div style={{ marginTop: 60, background: "white", borderRadius: 24, padding: "32px 28px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)", textAlign: "left" }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, marginBottom: 24, textTransform: "uppercase" }}>Begini cara kerjanya</p>
                        {[
                            { icon: "💬", color: "#EFF6FF", num: "01", title: "Calon pembeli ketik \"MAU\" di komentar", sub: "Algoritma Instagram pun ikut naik karena banyak interaksi" },
                            { icon: "⚡", color: "#ECFDF5", num: "02", title: "Sistem kami membalas komentar secara otomatis", sub: "Real-time, tanpa Anda harus pegang HP" },
                            { icon: "📦", color: "#FFF7ED", num: "03", title: "DM berisi link katalog/pesanan dikirim otomatis", sub: "Calon pembeli langsung bisa order. Anda bisa tidur nyenyak." },
                        ].map((s, i) => (
                            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: i < 2 ? 24 : 0, paddingBottom: i < 2 ? 24 : 0, borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
                                <div className="step-num" style={{ background: s.color, color: "#0F172A" }}>{s.icon}</div>
                                <div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: 1 }}>LANGKAH {s.num}</div>
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
                            <span className="badge">✅ Sangat Mudah</span>
                            <h2 style={{ fontSize: "clamp(26px,4vw,36px)", fontWeight: 800, marginTop: 16 }}>4 Langkah Mulai Autopilot</h2>
                        </div>
                    </AnimSection>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
                        {[
                            { icon: "🎯", title: "Pilih Paket", desc: "Tentukan paket yang sesuai dengan kebutuhan skala usaha Anda." },
                            { icon: "📱", title: "Hubungi CS", desc: "Klik tombol pesan untuk terhubung langsung dengan tim setup kami via WhatsApp." },
                            { icon: "💸", title: "Transfer", desc: "Lakukan pembayaran sesuai paket yang dipilih untuk aktivasi sistem." },
                            { icon: "🚀", title: "Mulai & Data", desc: "Berikan data chat/format yang diinginkan. Dalam 1 jam, sistem Anda siap jualan!" },
                        ].map((step, i) => (
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
                    🎉 Sudah dipercaya <strong>2.400+</strong> UMKM Indonesia · Rating ⭐ 4.9/5
                </p>
            </div>

            {/* AI TWIN SECTION */}
            <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
                <AnimSection>
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <span className="badge">✨ Layanan Kreatif</span>
                        <h2 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, marginTop: 16, lineHeight: 1.2 }}>
                            Konten Mewah Tanpa Perlu<br />Sewa Studio Mahal
                        </h2>
                        <p style={{ color: "#475569", fontSize: 17, marginTop: 12, maxWidth: 520, margin: "12px auto 0" }}>
                            Kami menyediakan agen AI khusus yang bekerja seperti tim kreatif profesional — hanya untuk usaha Anda.
                        </p>
                    </div>
                </AnimSection>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
                    {[
                        { icon: "🖼️", title: "Image Generator", color: "#EFF6FF", accent: "#0EA5E9", desc: "Foto produk Anda tampil sekelas iklan majalah. Upload foto biasa, AI kami poles jadi visual yang bikin orang berhenti scroll." },
                        { icon: "🎬", title: "Video Generator", color: "#ECFDF5", accent: "#10B981", desc: "Video promosi estetik yang menghidupkan brand Anda. Dapatkan Reels & TikTok viral setiap minggu tanpa harus pusing editing atau rekam ulang." },
                        { icon: "🎙️", title: "Voice Cloning AI", color: "#FFF7ED", accent: "#F97316", desc: "Kami klon suara Anda. Kirim teks, dan \"AI Anda\" yang bicara di video iklan dengan suara Anda yang asli!" },
                        { icon: "🤖", title: "Chatbot WhatsApp", color: "#F5F3FF", accent: "#8B5CF6", desc: "WhatsApp Anda membalas pesan calon pembeli 24 jam, persis seperti yang Anda mau. Tidak ada lagi pesan yang terlewat." },
                        { icon: "📲", title: "Auto Trigger Pesanan", color: "#FFF1F2", accent: "#F43F5E", desc: "Ada pesanan masuk? Bot Anda otomatis kirim notifikasi ke pembeli DAN Anda. Semua terorganisir rapi." },
                        { icon: "📊", title: "Laporan & Analisa AI", color: "#F0FDF4", accent: "#22C55E", desc: "Ribuan baris datasheet pusing dibaca? Kami scrape dan jelaskan dalam bahasa manusia yang mudah dimengerti." },
                    ].map((item, i) => (
                        <AnimSection key={i} delay={i * 0.07}>
                            <div className="card" style={{ padding: 28, height: "100%", transition: "transform 0.2s, box-shadow 0.2s" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
                            >
                                <div style={{ width: 52, height: 52, borderRadius: 16, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 16 }}>{item.icon}</div>
                                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{item.title}</h3>
                                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.6, marginBottom: (item.title === "Video Generator" || item.title === "Image Generator" || item.title === "Chatbot WhatsApp" || item.title === "Auto Trigger Pesanan" || item.title === "Laporan & Analisa AI" || item.title === "Voice Cloning AI") ? 16 : 0 }}>{item.desc}</p>
                                {item.title === "Video Generator" && (
                                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", marginTop: 12 }}>
                                        <video src={demoVideo} controls loop playsInline style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover", display: "block" }} />
                                    </div>
                                )}
                                {item.title === "Image Generator" && (
                                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", marginTop: 12 }}>
                                        <img src={demoProduct} alt="AI Product" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                                    </div>
                                )}
                                {item.title === "Voice Cloning AI" && (
                                    <div style={{ marginTop: 12 }}>
                                        <audio src={demoVoice} controls style={{ width: "100%" }} />
                                    </div>
                                )}
                                {item.title === "Chatbot WhatsApp" && (
                                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", marginTop: 12 }}>
                                        <img src={demoAutoDM} alt="Chatbot DM" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                                    </div>
                                )}
                                {item.title === "Auto Trigger Pesanan" && (
                                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", marginTop: 12 }}>
                                        <img src={demoAutoReply} alt="Auto Trigger Reply" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                                    </div>
                                )}
                                {item.title === "Laporan & Analisa AI" && (
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
                        <span className="badge">💬 Kata Mereka</span>
                        <h2 style={{ fontSize: "clamp(26px,4vw,36px)", fontWeight: 800, marginTop: 16 }}>UMKM Nyata, Hasil Nyata</h2>
                    </div>
                </AnimSection>
                <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
                    {[
                        { name: "Sari W.", biz: "Hijab Online · Bandung", text: "Awalnya saya takut ribet. Ternyata tim AutoSell setup cuma 45 menit! Sekarang tiap pagi DM sudah antri dari calon pembeli yang ketik MAU semalam.", stars: 5 },
                        { name: "Budi H.", biz: "Kuliner Frozen · Surabaya", text: "Omzet naik 3x dalam 2 bulan. Yang paling keren adalah foto produk saya sekarang kelihatan profesional banget. Pelanggan sering nanya pakai fotografer mana.", stars: 5 },
                        { name: "Dewi K.", biz: "Skincare UMKM · Jakarta", text: "Fitur Voice Cloning ini gila sih. Saya rekam suara sekali, sekarang tiap video iklan pakai suara saya sendiri tanpa harus rekaman lagi.", stars: 5 },
                    ].map((t, i) => (
                        <AnimSection key={i} delay={i * 0.1}>
                            <div className="card" style={{ padding: 28 }}>
                                <div style={{ color: "#F59E0B", fontSize: 18, marginBottom: 12 }}>{"★".repeat(t.stars)}</div>
                                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155", marginBottom: 20 }}>"{t.text}"</p>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#0EA5E9,#10B981)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18 }}>{t.name[0]}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                                        <div style={{ fontSize: 13, color: "#94A3B8" }}>{t.biz}</div>
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
                        <span className="badge">💰 Harga Transparan</span>
                        <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, marginTop: 16 }}>Pilih Paket Yang Sesuai</h2>
                        <p style={{ color: "#475569", fontSize: 16, marginTop: 8 }}>Hemat hingga <strong>30%</strong> dengan paket tahunan</p>

                        <div style={{ display: "inline-flex", background: "#F1F5F9", borderRadius: 50, padding: 4, marginTop: 24, gap: 4 }}>
                            {(["monthly", "yearly"] as const).map(b => (
                                <button key={b} onClick={() => setBilling(b)} style={{ padding: "10px 24px", borderRadius: 50, border: "none", background: billing === b ? "white" : "transparent", boxShadow: billing === b ? "0 2px 8px rgba(0,0,0,0.08)" : "none", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", color: billing === b ? "#0F172A" : "#64748B", transition: "all 0.2s" }}>
                                    {b === "monthly" ? "Bulanan" : "Tahunan 🎉"}
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
                                        ⭐ Paling Populer
                                    </div>
                                )}
                                <div style={{ fontWeight: 800, fontSize: 20, color: plan.color, marginBottom: 8 }}>{plan.name}</div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                                    <span style={{ fontSize: 36, fontWeight: 800 }}>{formatRupiah(plan.price)}</span>
                                </div>
                                <div style={{ fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>/{billing === "monthly" ? "bulan" : "tahun"}</div>
                                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 20, marginBottom: 24 }}>
                                    {plan.features.map((f, j) => (
                                        <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                                            <span style={{ color: plan.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                                            <span style={{ fontSize: 15, color: "#334155" }}>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <a 
                                    href="https://wa.me/62895325633487?text=Hai%20kak%20saya%20mau%20pesan%20Autosell%20bulanan" 
                                    target="_blank" 
                                    style={{ width: "100%" }}
                                    onClick={() => trackInitiateCheckoutEvent({ value: plan.price, currency: 'IDR' }, undefined, PIXEL_ID)}
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
                        💡 Setup selesai dalam waktu kurang dari 1 jam · Hasil langsung terasa
                    </p>
                </AnimSection>
            </section>

            {/* FAQ */}
            <section style={{ background: "#F8FAFC", padding: "72px 24px" }}>
                <div style={{ maxWidth: 680, margin: "0 auto" }}>
                    <AnimSection>
                        <div style={{ textAlign: "center", marginBottom: 48 }}>
                            <span className="badge">❓ Pertanyaan Umum</span>
                            <h2 style={{ fontSize: "clamp(26px,4vw,36px)", fontWeight: 800, marginTop: 16 }}>Kami Jawab Kekhawatiran Anda</h2>
                        </div>
                    </AnimSection>
                    {faqs.map((faq, i) => (
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
                            Siap Biarkan Sistem yang Jualan untuk Anda?
                        </h2>
                        <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 17, marginBottom: 32, lineHeight: 1.6 }}>
                            Bergabung dengan 2.400+ UMKM yang sudah autopilot. Setup selesai dalam 1 jam, hasil langsung terasa.
                        </p>
                        <a 
                            href="https://wa.me/62895325633487?text=Hai%20kak%20saya%20mau%20pesan%20Autosell%20bulanan" 
                            target="_blank"
                            onClick={() => trackInitiateCheckoutEvent({}, undefined, PIXEL_ID)}
                        >
                            <button style={{ background: "white", color: "#0EA5E9", border: "none", padding: "18px 40px", borderRadius: 50, fontWeight: 800, fontSize: 18, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", transition: "transform 0.2s" }}
                                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                                onMouseLeave={e => (e.currentTarget.style.transform = "")}
                            >
                                Pesan Sekarang →
                            </button>
                        </a>
                        <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 16, fontSize: 14 }}>Aktivasi cepat · CS Standby · Hasil Instan</p>
                    </div>
                </AnimSection>
            </section>

            {/* FOOTER */}
            <footer style={{ borderTop: "1px solid #E2E8F0", padding: "28px 24px", textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 18, background: "linear-gradient(135deg,#0EA5E9,#10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>Auto Sell with AI</div>
                <p style={{ fontSize: 14, color: "#94A3B8" }}>© 2025 Auto Sell with AI · Dibuat dengan ❤️ untuk UMKM Indonesia</p>
            </footer>
        </div>
    );
}