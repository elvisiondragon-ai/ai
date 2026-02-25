"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── IMAGE IMPORTS ────────────────────────────────────────────────────────────
import imgHero from "../assets/ranjang/ph_01_hero_couple_image.jpg";
import imgTestimonial from "../assets/ranjang/ph_02_testimonial_social_proof.png";
import imgCurriculum from "../assets/ranjang/ph_03_curriculum_infographic.png";
import imgCounter from "../assets/ranjang/ph_16_social_proof_counter.png";
import imgBonus1 from "../assets/ranjang/bonus_1_ebook.png";
import imgBonus2 from "../assets/ranjang/bonus_2_ebook.png";
import imgBonus3 from "../assets/ranjang/bonus_3_ebook_video.png";
import imgBonus4 from "../assets/ranjang/bonus_4_special.png";
import imgBundle from "../assets/ranjang/bundle_hero_shot.jpg";
import imgPain1 from "../assets/ranjang/pain_01_alone_bed.png";
import imgPain2 from "../assets/ranjang/pain_02_mirror.png";
import imgPain3 from "../assets/ranjang/pain_03_phone.png";
import imgPain4 from "../assets/ranjang/pain_04_dinner.png";
import imgPain5 from "../assets/ranjang/pain_05_clock.png";
import imgPain6 from "../assets/ranjang/pain_06_goodbye.png";
import imgPain7 from "../assets/ranjang/pain_07_gossip.png";
import vidSuami1 from "../assets/ranjang/suami1.mp4";
import qrisBcaImage from "../assets/qrisbca.jpeg";

// ─── UTILS & INTEGRATIONS ─────────────────────────────────────────────────────
import { supabase } from "../integrations/supabase/client";
import { ArrowLeft, Copy } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { getFbcFbpCookies, getClientIp } from "../utils/fbpixel";

const BONUS_IMAGES = [imgBonus1, imgBonus2, imgBonus3, imgBonus4];
const PAIN_IMAGES = [imgPain1, imgPain2, imgPain3, imgPain4, imgPain5, imgPain6, imgPain7];

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
    {
        name: "Randy", age: "28 thn", role: "Suami", initial: "R", color: "#A78BFA",
        quote: "Awalnya skeptis, tapi setelah baca dan praktekkan... istri saya bener-bener surprised. Hubungan kami jadi jauh lebih hangat."
    },
    {
        name: "Doni Hermanto", age: "35 thn", role: "Suami", initial: "D", color: "#34D399",
        quote: "Bonus Senam Kegel-nya game changer sih. Dalam 2 minggu udah terasa bedanya. Istri aja nanya 'kamu belajar dari mana?'"
    },
    {
        name: "Arif Mustofa", age: "31 thn", role: "Suami", initial: "A", color: "#60A5FA",
        quote: "Sekarang istri yang minta, bukan saya lagi yang harus 'memohon'. Terima kasih panduannya sangat praktis."
    },
    {
        name: "Anita", age: "42 thn", role: "Istri", initial: "A", color: "#F472B6",
        quote: "Saya sebagai istri bisa bilang: suami saya BERUBAH setelah punya panduan ini. Lebih sabar, lebih perhatian, dan... ya, hasilnya amazing 🥰"
    },
    {
        name: "Bayu", age: "33 thn", role: "Suami", initial: "B", color: "#FB923C",
        quote: "Bonus 365 Variasi Posisi itu gila sih. Satu tahun penuh ga pernah ngulang. Istri bilang 'kamu kreatif banget sekarang'. Worth banget."
    },
];

const FAQS = [
    { q: "Bagaimana cara akses ebooknya?", a: "Setelah pembayaran dikonfirmasi, link download dikirim ke WhatsApp Anda dalam 5–10 menit. Format PDF bisa dibaca di HP, tablet, atau komputer. Semua dikirim secara privat." },
    { q: "Apakah ada bimbingan kalau ada yang tidak paham?", a: "Tentu. Ebook disusun step-by-step dari dasar. Setiap bab menjelaskan dengan bahasa yang mudah dipahami dan langsung bisa dipraktikkan, tanpa perlu pengalaman khusus." },
    { q: "Apakah ini aman dipraktekkan?", a: "100% aman. Semua panduan disusun berdasarkan riset kesehatan reproduksi modern dan psikologi keintiman. Tidak melibatkan obat atau alat apapun." },
    { q: "Apakah ada garansi uang kembali?", a: "Ada garansi 7 hari. Jika Anda tidak puas, kami kembalikan 100% tanpa pertanyaan." },
    { q: "Apakah privasi saya terjaga?", a: "Sepenuhnya. Tidak ada nama produk yang tertera di bukti transfer atau tagihan. Dikirim digital, privat, dan aman 100%." },
];

const BONUSES = [
    {
        num: 1, title: "Panduan Koneksi Emosional", subtitle: "87 halaman — Karena istri butuh HATI, bukan cuma fisik", value: "Rp137.000", color: "#A78BFA", icon: "💜",
        features: ["Rumus membangun ikatan emosional yang mendalam", "Cara memahami keintiman dari sisi psikologi wanita", "Teknik komunikasi yang bikin istri merasa dihargai", "Panduan membangun suasana yang bikin dia nyaman"]
    },
    {
        num: 2, title: "Teknik & Posisi Terbaik", subtitle: "19 halaman — Posisi yang tepat = kepuasan 2x lipat", value: "Rp127.000", color: "#34D399", icon: "💚",
        features: ["Posisi terbaik untuk memaksimalkan G-Spot", "Teknik sudut & ritme yang tepat sasaran", "Panduan untuk pasangan baru maupun lama", "Meningkatkan kepercayaan diri sebagai pria"]
    },
    {
        num: 3, title: "Senam Kegel Mastery", subtitle: "56 halaman — Stamina tanpa obat, terbukti secara medis", value: "Rp127.000", color: "#60A5FA", icon: "💙",
        features: ["Memahami penyebab lemah & ejakulasi dini", "Latihan otot dasar panggul step-by-step", "Hasil terasa dalam 2-3 minggu rutin", "Panduan lengkap tanpa obat & tanpa alat"]
    },
    {
        num: 4, title: "365 Variasi Posisi", subtitle: "367 halaman bergambar — Satu posisi baru SETIAP HARI", value: "Rp179.000", color: "#FBBF24", icon: "⭐",
        features: ["365 posisi berbeda untuk setahun penuh", "Panduan bergambar lengkap & jelas", "Dikategorikan dari pemula sampai mahir", "Dijamin tidak pernah bosan selama setahun"]
    },
];

const VALUE_STACK = [
    ["Ebook Utama: Rahasia Keintiman Sejati (70 hal)", "Rp199.000"],
    ["Bonus 1: Panduan Koneksi Emosional (87 hal)", "Rp137.000"],
    ["Bonus 2: Teknik & Posisi Terbaik (19 hal)", "Rp127.000"],
    ["Bonus 3: Senam Kegel Mastery (56 hal)", "Rp127.000"],
    ["Bonus 4: 365 Variasi Posisi (367 hal)", "Rp179.000"],
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useCountdown(hours = 3) {
    const [time, setTime] = useState(hours * 3600);
    useEffect(() => {
        const t = setInterval(() => setTime(p => p > 0 ? p - 1 : hours * 3600), 1000);
        return () => clearInterval(t);
    }, [hours]);
    return {
        h: String(Math.floor(time / 3600)).padStart(2, "0"),
        m: String(Math.floor((time % 3600) / 60)).padStart(2, "0"),
        s: String(time % 60).padStart(2, "0"),
    };
}

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Anim({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    const { ref, inView } = useInView();
    return (
        <div ref={ref} className={className} style={{
            opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)",
            transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        }}>{children}</div>
    );
}

function Divider() {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #C9991A)" }} />
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C9991A", boxShadow: "0 0 8px #C9991A" }} />
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #C9991A)" }} />
        </div>
    );
}

function FAQ({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ border: `1px solid ${open ? "rgba(201,153,26,0.35)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, marginBottom: 10, background: open ? "rgba(201,153,26,0.05)" : "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
            <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", background: "none", border: "none", cursor: "pointer", color: "#EEE5C8", fontSize: 14, fontWeight: 600, textAlign: "left", gap: 12, fontFamily: "inherit" }}>
                <span>{q}</span>
                <span style={{ fontSize: 20, color: "#C9991A", transform: open ? "rotate(45deg)" : "none", transition: "transform 0.3s", flexShrink: 0 }}>+</span>
            </button>
            <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
                <p style={{ padding: "0 18px 16px", color: "#8B9BB4", fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>{a}</p>
            </div>
        </div>
    );
}

// ─── CSS (from rajaranjang2 visual design) ────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--g:#C9991A;--gl:#F0C84A;--gd:#9A7010;--n0:#060A12;--n1:#0B1221;--n2:#0F1A2E;--n3:#162035;--cream:#EEE5C8;--muted:#5E7491;--fd:'Cormorant Garamond',Georgia,serif;--fb:'DM Sans',system-ui,sans-serif;}
body{background:var(--n0);}
.w{font-family:var(--fb);color:var(--cream);max-width:560px;margin:0 auto;background:var(--n0);min-height:100vh;overflow-x:hidden;position:relative;}
.grain{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.025;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");}
.ubar{background:linear-gradient(90deg,#7F1D1D,#991B1B,#7F1D1D);background-size:200%;animation:ugrad 4s linear infinite;text-align:center;padding:10px 16px;font-size:15px;font-weight:600;letter-spacing:.4px;position:relative;z-index:10;}
@keyframes ugrad{0%{background-position:0%}100%{background-position:200%}}
.ptrack{height:2px;background:rgba(255,255,255,0.04);position:sticky;top:0;z-index:100;}
.pfill{height:100%;background:linear-gradient(90deg,var(--g),var(--gl));transition:width .1s;}
.hero{position:relative;min-height:88vh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 20%,rgba(201,153,26,.1) 0%,transparent 65%),linear-gradient(175deg,var(--n2) 0%,var(--n0) 60%);}
.hero-orb{position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(201,153,26,.07) 0%,transparent 65%);top:-150px;left:50%;transform:translateX(-50%);}
.hero-lines{position:absolute;inset:0;background-image:linear-gradient(rgba(201,153,26,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,153,26,.04) 1px,transparent 1px);background-size:40px 40px;}
.hv{position:relative;height:370px;display:flex;align-items:center;justify-content:center;}
.hp{width:210px;height:290px;border-radius:105px;background:linear-gradient(135deg,rgba(201,153,26,.12),rgba(201,153,26,.03));border:1px solid rgba(201,153,26,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;backdrop-filter:blur(12px);}
.hring{position:absolute;border-radius:50%;border:1px solid rgba(201,153,26,.12);animation:ring-pulse 4s ease-in-out infinite;}
.hring1{width:250px;height:330px;}.hring2{width:295px;height:375px;animation-delay:.8s;}.hring3{width:340px;height:420px;animation-delay:1.6s;}
@keyframes ring-pulse{0%,100%{opacity:.3;transform:scale(1);}50%{opacity:.8;transform:scale(1.015);}}
.hc{padding:0 22px 40px;position:relative;z-index:2;}
.hbadge{display:inline-flex;align-items:center;gap:6px;background:rgba(201,153,26,.1);border:1px solid rgba(201,153,26,.28);border-radius:100px;padding:5px 13px;font-size:14px;font-weight:600;color:var(--g);margin-bottom:15px;letter-spacing:.4px;}
.hbadge-dot{width:6px;height:6px;border-radius:50%;background:var(--g);animation:dot-blink 1.5s infinite;}
@keyframes dot-blink{0%,100%{opacity:1;}50%{opacity:.2;}}
h1.ht{font-family:var(--fd);font-size:46px;font-weight:700;line-height:1.15;margin-bottom:13px;}
h1.ht em{font-style:italic;color:var(--g);}
.hs{font-size:18px;color:#7D94AF;line-height:1.75;margin-bottom:22px;}
.hcta{display:block;width:100%;padding:17px;background:linear-gradient(135deg,var(--g),var(--gd),var(--g));background-size:200%;border:none;border-radius:13px;color:var(--n0);font-size:20px;font-weight:700;cursor:pointer;letter-spacing:.3px;animation:shimmer 3s linear infinite;box-shadow:0 8px 30px rgba(201,153,26,.35),0 2px 8px rgba(0,0,0,.5);transition:transform .2s,box-shadow .2s;font-family:var(--fb);}
.hcta:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(201,153,26,.45);}
@keyframes shimmer{0%{background-position:0% 50%;}100%{background-position:200% 50%;}}
.spbar{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:13px;font-size:15px;color:#5E7491;}
.spbar strong{color:var(--gl);}
.avstack{display:flex;}.av{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid var(--n0);margin-left:-5px;}.av:first-child{margin-left:0;}
.sec{padding:44px 22px;position:relative;z-index:1;}
.slabel{font-size:13px;font-weight:700;letter-spacing:2.5px;color:var(--g);text-transform:uppercase;margin-bottom:9px;}
h2.stitle{font-family:var(--fd);font-size:36px;font-weight:700;line-height:1.25;margin-bottom:14px;}
h2.stitle em{font-style:italic;color:var(--g);}
.sbody{font-size:18px;color:#7D94AF;line-height:1.78;}
.sep{height:1px;background:linear-gradient(90deg,transparent,rgba(201,153,26,.18),transparent);margin:0 22px;}
.ctgrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px;}
.ctitem{background:rgba(201,153,26,.055);border:1px solid rgba(201,153,26,.14);border-radius:14px;padding:15px;text-align:center;}
.ctnum{font-family:var(--fd);font-size:34px;font-weight:700;color:var(--gl);line-height:1;}
.ctlbl{font-size:13px;color:var(--muted);margin-top:4px;}
.painsec{background:linear-gradient(180deg,var(--n0) 0%,var(--n1) 50%,var(--n0) 100%);}
.pcard{background:var(--n2);border:1px solid rgba(239,68,68,.18);border-left:3px solid #EF4444;border-radius:10px;padding:13px 15px;margin-bottom:9px;font-size:17px;color:#B0BFD0;display:flex;gap:10px;align-items:flex-start;line-height:1.6;}
.notfor{background:linear-gradient(135deg,rgba(239,68,68,.06),rgba(239,68,68,.02));border:1px solid rgba(239,68,68,.15);border-radius:14px;padding:22px;}
.nitem{display:flex;gap:10px;padding:7px 0;font-size:17px;color:#B0BFD0;border-bottom:1px solid rgba(255,255,255,.04);}.nitem:last-child{border-bottom:none;}
.chatcard{background:linear-gradient(135deg,rgba(201,153,26,.06),rgba(201,153,26,.02));border:1px solid rgba(201,153,26,.15);border-radius:15px;padding:20px;position:relative;}
.chatbubble{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:14px 14px 14px 4px;padding:14px 16px;font-size:17px;color:#B8CBDE;line-height:1.7;font-style:italic;margin-bottom:10px;}
.lcard{background:linear-gradient(135deg,rgba(201,153,26,.07),rgba(201,153,26,.02));border:1px solid rgba(201,153,26,.18);border-radius:15px;padding:22px;}
.litem{display:flex;gap:12px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.045);align-items:flex-start;}.litem:last-child{border-bottom:none;padding-bottom:0;}
.lcheck{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--g),var(--gd));display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;margin-top:2px;color:var(--n0);font-weight:700;}
.ltext{font-size:17px;color:#B8CBDE;line-height:1.55;}
.vwrap{border-radius:15px;overflow:hidden;border:1px solid rgba(255,255,255,.07);background:var(--n1);}
.vscreen{position:relative;aspect-ratio:16/9;background:linear-gradient(135deg,var(--n3),var(--n1));display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;}
.vplay{width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,var(--g),var(--gd));display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;box-shadow:0 0 30px rgba(201,153,26,.4);animation:play-pulse 2s ease-in-out infinite;}
@keyframes play-pulse{0%,100%{box-shadow:0 0 30px rgba(201,153,26,.4);}50%{box-shadow:0 0 50px rgba(201,153,26,.65);}}
.vchaps{padding:14px 18px;}.vchap{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04);}.vchap:last-child{border-bottom:none;}
.vcnum{width:24px;height:24px;border-radius:50%;background:rgba(201,153,26,.14);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--g);flex-shrink:0;}
.vct{font-size:16px;color:#B8CBDE;}.vcd{font-size:14px;color:var(--muted);margin-left:auto;}
.bsec{background:linear-gradient(180deg,var(--n0) 0%,var(--n1) 30%,var(--n1) 70%,var(--n0) 100%);}
.bcard{border-radius:18px;margin-bottom:18px;overflow:hidden;border:1px solid rgba(255,255,255,.055);}
.bhead{padding:18px 18px 14px;display:flex;align-items:flex-start;gap:13px;}
.bicon{width:50px;height:50px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:23px;flex-shrink:0;}
.btitle{font-family:var(--fd);font-size:24px;font-weight:700;margin-bottom:3px;}
.bsub{font-size:15px;color:#5E7491;}
.bval{font-size:14px;font-weight:700;padding:3px 9px;border-radius:100px;display:inline-flex;margin-top:7px;}
.bfeats{padding:0 18px 18px;display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.bfeat{font-size:15px;color:#7D94AF;display:flex;gap:6px;align-items:flex-start;line-height:1.4;}
.fdot{width:4px;height:4px;border-radius:50%;flex-shrink:0;margin-top:5px;}
.wacard{border-radius:18px;overflow:hidden;background:linear-gradient(135deg,#042F21,#064E3B);border:1px solid rgba(52,211,153,.18);padding:22px;}
.waicon{width:52px;height:52px;border-radius:14px;background:#25D366;display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:14px;}
.waitem{display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid rgba(52,211,153,.1);font-size:17px;color:rgba(209,250,229,.85);}.waitem:last-child{border-bottom:none;}
.ecard{background:linear-gradient(135deg,rgba(96,165,250,.07),rgba(96,165,250,.02));border:1px solid rgba(96,165,250,.18);border-radius:15px;padding:22px;display:flex;gap:15px;align-items:flex-start;}
.eicon{width:52px;height:52px;border-radius:13px;background:rgba(96,165,250,.13);display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;}
.tcard{background:var(--n2);border:1px solid rgba(255,255,255,.055);border-radius:15px;padding:18px;margin-bottom:13px;position:relative;overflow:hidden;}
.tcard::before{content:'"';position:absolute;top:-14px;right:14px;font-size:90px;font-family:var(--fd);opacity:.05;line-height:1;}
.thead{display:flex;align-items:center;gap:11px;margin-bottom:13px;}
.tav{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex-shrink:0;}
.tname{font-size:18px;font-weight:700;}.trole{font-size:14px;color:#5E7491;}.tstars{color:#FBBF24;font-size:15px;margin-top:2px;}
.tquote{font-size:17px;color:#B0BFD0;line-height:1.72;}
.vbadge{display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:600;color:#34D399;margin-top:11px;background:rgba(52,211,153,.1);padding:3px 8px;border-radius:100px;}
.chalcard{background:linear-gradient(135deg,rgba(167,139,250,.07),rgba(139,92,246,.02));border:1px solid rgba(167,139,250,.18);border-radius:15px;padding:18px;}
.calgrid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:12px;}
.calday{aspect-ratio:1;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;}
.calday.done{background:rgba(167,139,250,.28);color:#A78BFA;}.calday.todo{background:rgba(255,255,255,.03);color:#374151;}.calday.today{background:linear-gradient(135deg,#7C3AED,#6D28D9);color:#fff;}
.pricesec{background:linear-gradient(180deg,var(--n1),var(--n0));}
.cdbox{background:linear-gradient(135deg,rgba(239,68,68,.1),rgba(220,38,38,.04));border:1px solid rgba(239,68,68,.28);border-radius:13px;padding:17px;text-align:center;margin-bottom:22px;}
.cdlbl{font-size:14px;color:#FCA5A5;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:11px;}
.cdrow{display:flex;justify-content:center;gap:8px;align-items:center;}
.tblock{background:#152035;border-radius:9px;padding:9px 13px;min-width:50px;text-align:center;border:1px solid rgba(239,68,68,.18);}
.tdig{font-family:var(--fd);font-size:34px;font-weight:700;color:#FCA5A5;line-height:1;}
.tlbl{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:2px;}
.tsep{font-family:var(--fd);font-size:34px;color:rgba(239,68,68,.35);}
.bundle{background:linear-gradient(135deg,rgba(201,153,26,.08),rgba(201,153,26,.02));border:1px solid rgba(201,153,26,.14);border-radius:18px;padding:28px 22px;text-align:center;margin:22px 0;}
.vsitem{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:16px;}
.vsitem:last-child{border-bottom:none;}
.pkgopt{border:2px solid rgba(255,255,255,.07);border-radius:15px;padding:16px;cursor:pointer;transition:all .25s;margin-bottom:11px;position:relative;overflow:hidden;}
.pkgopt.sel{border-color:var(--g);background:rgba(201,153,26,.05);}
.pkgbadge{position:absolute;top:0;right:0;background:linear-gradient(135deg,var(--g),var(--gd));color:var(--n0);font-size:13px;font-weight:700;padding:4px 11px;border-bottom-left-radius:11px;letter-spacing:.4px;}
.pkgname{font-size:15px;font-weight:700;color:var(--gl);margin-bottom:3px;}
.pkgitems{font-size:14px;color:var(--muted);}
.pkgprow{display:flex;align-items:center;gap:8px;margin-top:7px;}
.pkgold{font-size:15px;color:var(--muted);text-decoration:line-through;}
.pkgnew{font-family:var(--fd);font-size:32px;font-weight:700;color:var(--cream);}
.savetag{font-size:13px;font-weight:700;padding:3px 8px;border-radius:100px;background:rgba(52,211,153,.13);color:#34D399;}
.formsec{background:var(--n1);}
.privstrip{display:flex;justify-content:center;gap:14px;margin-bottom:22px;flex-wrap:wrap;}
.privbadge{display:flex;align-items:center;gap:5px;font-size:14px;color:#5E7491;}
.flabel{font-size:15px;font-weight:600;color:#B8CBDE;margin-bottom:5px;display:block;}
.finput{width:100%;padding:13px 15px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:11px;color:var(--cream);font-size:18px;font-family:var(--fb);outline:none;transition:border-color .2s;}
.finput:focus{border-color:var(--g);}.finput::placeholder{color:#374151;}
.pwrap{display:flex;}.ppfx{background:rgba(201,153,26,.1);border:1px solid rgba(255,255,255,.09);border-right:none;border-radius:11px 0 0 11px;padding:13px;font-size:18px;font-weight:600;color:var(--g);white-space:nowrap;}.pwrap .finput{border-radius:0 11px 11px 0;}
.pmgrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.pmopt{border:1px solid rgba(255,255,255,.07);border-radius:11px;padding:11px;cursor:pointer;text-align:center;transition:all .2s;}
.pmopt.sel{border-color:var(--g);background:rgba(201,153,26,.07);}
.pmname{font-size:15px;font-weight:600;}.pmsub{font-size:13px;color:var(--muted);margin-top:2px;}
.sbtn{width:100%;padding:19px;background:linear-gradient(135deg,var(--g),var(--gd),var(--g));background-size:200%;border:none;border-radius:14px;color:var(--n0);font-size:21px;font-weight:700;cursor:pointer;font-family:var(--fb);animation:shimmer 3s linear infinite;box-shadow:0 10px 35px rgba(201,153,26,.4);transition:transform .2s;margin-top:18px;letter-spacing:.3px;}
.sbtn:hover{transform:translateY(-2px);}
.arrb{animation:bncArr 1.5s ease-in-out infinite;display:inline-block;color:var(--g);font-size:22px;}
@keyframes bncArr{0%,100%{transform:translateY(0);}50%{transform:translateY(8px);}}
.sticky{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:560px;padding:11px 18px 18px;background:linear-gradient(to top,var(--n0),rgba(6,10,18,.96));backdrop-filter:blur(16px);z-index:1000;border-top:1px solid rgba(201,153,26,.12);transition:transform .4s cubic-bezier(.4,0,.2,1);}
.sticky.off{transform:translateX(-50%) translateY(100%);}
.stickybtn{display:block;width:100%;padding:15px;background:linear-gradient(135deg,var(--g),var(--gd));border:none;border-radius:13px;color:var(--n0);font-size:19px;font-weight:700;cursor:pointer;font-family:var(--fb);box-shadow:0 4px 20px rgba(201,153,26,.38);}
.stickyp{font-size:14px;text-align:center;color:var(--muted);margin-top:5px;}
.footer{padding:30px 22px;text-align:center;background:#040810;border-top:1px solid rgba(201,153,26,.08);}
`;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function RajaRanjangLP() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [payment, setPayment] = useState("QRIS");
    const [sticky, setSticky] = useState(false);
    const [pct, setPct] = useState(0);
    const { toast } = useToast();
    const { h, m, s } = useCountdown(3);

    // Payment States
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

    const isV2 = new URLSearchParams(window.location.search).has('v2');
    const priceID = isV2 ? 259000 : 149000;
    const displayPrice = isV2 ? 'Rp259.000' : 'Rp149.000';
    const savePct = isV2 ? '66%' : '81%';
    const PIXEL_ID = '934836615539666';

    // WhatsApp Alert Helper
    const sendWAAlert = async (type: 'attempt' | 'success', details: any) => {
        try {
            const productDesc = `Raja Ranjang Package`;
            const msg = type === 'attempt'
                ? `🔔 *Mencoba Checkout*\nProduk: ${productDesc}\nNama: ${details.name}\nWA: ${details.phone}\nMetode: ${details.method}`
                : `✅ *Checkout Sukses*\nRef: ${details.ref}\nProduk: ${productDesc}\nNama: ${details.name}\nWA: ${details.phone}\nTotal: Rp ${details.amount.toLocaleString('id-ID')}`;

            await fetch('https://watzapp.web.id/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': '23b62c4255c43489f55fa84693dc0451d89ea5a5c9ec00021a7b77287cdce0b8'
                },
                body: JSON.stringify({
                    phone: "62895325633487",
                    message: msg,
                    token: "23b62c4255c43489f55fa84693dc0451d89ea5a5c9ec00021a7b77287cdce0b8"
                })
            });
        } catch (e) {
            console.error('WA API Error', e);
        }
    };

    // Submit Order function
    const submitOrder = async () => {
        // Validation
        if (!name || !phone || !email) {
            alert('⚠️ Mohon lengkapi Nama, No. WhatsApp, dan Email Anda!');
            return;
        }
        if (!payment) {
            alert('⚠️ Silahkan pilih metode pembayaran!');
            return;
        }

        setLoading(true);
        sendWAAlert('attempt', { name, phone, method: payment });

        const { fbc, fbp } = getFbcFbpCookies();
        const clientIp = await getClientIp();

        // Pass payment method straight to backend
        const backendPaymentMethod = payment;

        const productDesc = `universal - ${name} raja ranjang`;

        // Track CAPI AddPaymentInfo 
        try {
            await supabase.functions.invoke('capi-universal', {
                body: {
                    pixelId: PIXEL_ID,
                    eventName: 'AddPaymentInfo',
                    eventSourceUrl: window.location.href,
                    customData: {
                        content_name: productDesc,
                        value: priceID,
                        currency: 'IDR'
                    },
                    userData: {
                        fbc,
                        fbp,
                        client_ip_address: clientIp,
                        fn: name,
                        ph: phone,
                        em: email
                    }
                }
            });
        } catch (e) {
            console.error('AddPaymentInfo CAPI error', e);
        }

        const payload = {
            subscriptionType: 'universal', // ⚠️ WAJIB TETAP 'universal'
            paymentMethod: backendPaymentMethod,
            userName: name,
            userEmail: email,
            phoneNumber: phone,
            address: 'Alamat Digital (Ebook)',
            province: 'Digital',
            kota: 'Digital',
            kecamatan: 'Digital',
            kodePos: '00000',
            amount: priceID,
            currency: 'IDR',
            quantity: 1,
            productName: productDesc,
            fbc,
            fbp,
            clientIp
        };

        try {
            const { data, error } = await supabase.functions.invoke('tripay-create-payment', { body: payload });

            if (error) {
                console.error('Tripay Create Payment Error:', error);
                alert('⚠️ Gagal memproses pembayaran. Silahkan coba lagi atau hubungi admin.');
                return;
            }

            if (data?.success) {
                setPaymentData(data);
                setShowPaymentInstructions(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                sendWAAlert('success', { ref: data.tripay_reference, name, phone, amount: priceID });
            } else if (backendPaymentMethod === 'BCA_MANUAL') {
                const ref = `MANUAL-${Date.now()}`;
                setPaymentData({
                    paymentMethod: 'BCA_MANUAL',
                    amount: priceID,
                    status: 'UNPAID',
                    tripay_reference: ref
                });
                setShowPaymentInstructions(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                sendWAAlert('success', { ref, name, phone, amount: priceID });
            } else {
                alert(data?.error || error?.message || "Gagal membuat pembayaran, hubungi admin via WhatsApp.");
            }
        } catch (e) {
            alert('Network Error. Silakan pesan via WhatsApp.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fn = () => {
            setSticky(window.scrollY > 500);
            const el = document.documentElement;
            setPct(Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100));
        };
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    // Facebook Pixel PageView & ViewContent
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).fbq) {
            const fbq = (window as any).fbq;
            fbq('init', PIXEL_ID);
            fbq('track', 'PageView');
            fbq('track', 'ViewContent', {
                content_name: 'universal raja ranjang',
                value: priceID,
                currency: 'IDR'
            });
        }
    }, [PIXEL_ID]);

    const scrollToForm = useCallback(() => {
        document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // ── SUPABASE REALTIME LISTENER FOR AUTO-SUCCESS ──
    const purchaseFiredRef = useRef(false);

    useEffect(() => {
        if (!showPaymentInstructions || !paymentData?.tripay_reference) return;

        const tableName = 'global_product';
        const channelName = `payment-status-rr-${paymentData.tripay_reference}`;

        console.log(`[RajaRanjang] Listening to channel: ${channelName}`);

        const channel = supabase
            .channel(channelName)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: tableName, filter: `tripay_reference=eq.${paymentData.tripay_reference}` },
                (payload) => {
                    console.log('[RajaRanjang] Realtime payload received:', payload);
                    if (payload.new?.status === 'PAID') {
                        if (purchaseFiredRef.current) return;
                        purchaseFiredRef.current = true;

                        toast({
                            title: "🎉 Pembayaran Berhasil!",
                            description: "Terima kasih! Pembayaran Anda telah kami terima. Link akses Ebook Raja Ranjang akan segera dikirimkan ke Email dan WhatsApp Anda.",
                            duration: 0,
                        });

                        // Track Purchase Event
                        if (typeof window !== 'undefined' && (window as any).fbq) {
                            (window as any).fbq('track', 'Purchase', {
                                value: priceID,
                                currency: 'IDR',
                                content_name: 'universal raja ranjang'
                            });
                        }
                    }
                }
            ).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [showPaymentInstructions, paymentData, PIXEL_ID, priceID, toast]);

    // ── RENDER ──
    return (
        <div style={{ position: 'relative' }}>
            <Toaster />
            {showPaymentInstructions && paymentData ? (
                <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: "'DM Sans', sans-serif", color: 'var(--n0)' }}>
                    <style>{`
                      :root { --gold: #C9991A; --cream: #EEE5C8; --deep: #060A12; }
                      .pay-btn-confirm { background: #25D366; color: white; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px; width: 100%; padding: 16px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; text-decoration: none; font-family: 'DM Sans'; margin-top: 15px; }
                    `}</style>
                    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '30px 20px' }}>
                        <button onClick={() => setShowPaymentInstructions(false)} style={{ background: 'none', border: 'none', color: 'var(--deep)', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold', fontFamily: 'DM Sans' }}>
                            <ArrowLeft size={20} /> Kembali
                        </button>

                        <h2 style={{ fontFamily: 'var(--fd)', fontSize: '28px', color: 'var(--deep)', marginBottom: '20px', textAlign: 'center', fontWeight: 700 }}>Instruksi Pembayaran</h2>

                        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid rgba(201,153,26,.3)', marginBottom: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                                <span style={{ color: '#5E7491', fontWeight: 600 }}>NOMOR REFERENSI</span>
                                <span style={{ fontWeight: 700, color: 'var(--deep)' }}>{paymentData.tripay_reference}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14.5px' }}>
                                <span style={{ color: '#5E7491', fontWeight: 600 }}>Total Pembayaran</span>
                                <span style={{ fontWeight: 700, fontSize: '19px', color: 'var(--deep)' }}>Rp {paymentData.amount.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        {paymentData.paymentMethod === 'BCA_MANUAL' && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid rgba(201,153,26,.3)', textAlign: 'center' }}>
                                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '22px', marginBottom: '16px', fontWeight: 700 }}>Transfer Manual BCA</h3>
                                <div style={{ background: 'var(--cream)', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>7751146578</span>
                                    <button onClick={() => { navigator.clipboard.writeText('7751146578'); alert('Tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Copy size={22} color="var(--gold)" /></button>
                                </div>
                                <p style={{ fontWeight: 700, marginBottom: '20px', fontSize: 16 }}>A.n Delia Mutia</p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src={qrisBcaImage} alt="QRIS BCA" style={{ width: '220px', height: '220px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '24px' }} />
                                </div>
                                <a href={`https://wa.me/62895325633487?text=${encodeURIComponent(`Halo kak, saya sudah bayar Ebook Raja Ranjang. Ref: ${paymentData.tripay_reference}`)}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                                    <button className="pay-btn-confirm">
                                        Konfirmasi via WhatsApp
                                    </button>
                                </a>
                            </div>
                        )}

                        {paymentData.payCode && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid rgba(201,153,26,.3)', marginBottom: '16px' }}>
                                <p style={{ fontSize: '13px', color: '#5E7491', fontWeight: 600, marginBottom: '8px' }}>KODE PEMBAYARAN VA</p>
                                <div style={{ background: 'var(--cream)', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--deep)' }}>{paymentData.payCode}</span>
                                    <button onClick={() => { navigator.clipboard.writeText(paymentData.payCode); alert('Tersalin!'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Copy size={22} color="var(--gold)" /></button>
                                </div>
                            </div>
                        )}

                        {paymentData.qrUrl && (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid rgba(201,153,26,.3)', textAlign: 'center' }}>
                                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '22px', marginBottom: '8px', fontWeight: 700 }}>Scan QRIS</h3>
                                <p style={{ fontSize: '14.5px', color: '#5E7491', marginBottom: '20px', lineHeight: 1.6 }}>Buka aplikasi E-Wallet (GoPay/DANA/ShopeePay/OVO) atau Mobile Banking pilihan Anda.</p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src={paymentData.qrUrl} alt="QRIS" style={{ width: '250px', height: '250px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '20px' }} />
                                </div>
                                <div style={{ background: '#e8f5e9', padding: '14px', borderRadius: '10px', color: '#1b5e20', fontSize: '14.5px', fontWeight: 600, lineHeight: 1.5 }}>
                                    ✅ Screenshot / Simpan gambar QRIS ini lalu upload dari galeri pada aplikasi pembayaran Anda.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <style>{CSS}</style>
                    <div className="grain" />
                    <div className="w">

                        {/* Progress */}
                        <div className="ptrack"><div className="pfill" style={{ width: `${pct}%` }} /></div>

                        {/* Urgency bar */}
                        <div className="ubar">🔥 Harga spesial berakhir hari ini — Stok tersisa untuk <strong>47 pembeli</strong></div>

                        {/* ── HERO ── */}
                        <div className="hero">
                            <div className="hero-bg" />
                            <div className="hero-orb" />
                            <div className="hero-lines" />

                            {/* Hero image */}
                            <div className="hv">
                                <div className="hring hring3" />
                                <div className="hring hring2" />
                                <div className="hring hring1" />
                                <div className="hp" style={{ overflow: "hidden", padding: 0 }}>
                                    <img src={imgHero} alt="Raja Ranjang - Panduan Keintiman" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                                </div>
                            </div>

                            <div className="hc">
                                <div className="hbadge"><div className="hbadge-dot" /> Panduan Dewasa Premium</div>
                                <h1 className="ht">Jadilah Pria Yang Membuat Dia <em>Merasa Istimewa</em></h1>
                                <p className="hs">5-10 menit tidak cukup membuat dia puas. Temukan rahasianya di panduan keintiman berbasis riset psikologi modern ini.</p>
                                <button className="hcta" onClick={scrollToForm}>Dapatkan Panduan Lengkapnya →</button>
                                <div className="spbar">
                                    <div className="avstack">
                                        {(["#A78BFA", "#34D399", "#60A5FA", "#F472B6", "#FB923C"] as const).map((c, i) => (
                                            <div key={i} className="av" style={{ background: c, color: "#060A12" }}>{["R", "D", "A", "A", "B"][i]}</div>
                                        ))}
                                    </div>
                                    <span><strong>4.850+</strong> suami sudah membuktikannya</span>
                                </div>
                            </div>
                        </div>

                        {/* ── COUNTERS + SOCIAL PROOF IMAGE ── */}
                        <Anim>
                            <div className="sec">
                                <img src={imgCounter} alt="4.850+ pembeli puas" style={{ width: "100%", borderRadius: 13, marginBottom: 14 }} />
                                <div className="ctgrid">
                                    {[["4.850+", "Pembeli Puas"], ["4.9★", "Rating Rata-rata"], ["5", "Ebook Premium"]].map(([n, l]) => (
                                        <div key={l} className="ctitem"><div className="ctnum">{n}</div><div className="ctlbl">{l}</div></div>
                                    ))}
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── SOCIAL PROOF TESTIMONIAL IMAGE ── */}
                        <Anim>
                            <div className="sec">
                                <img src={imgTestimonial} alt="Testimoni istri" style={{ width: "100%", borderRadius: 13 }} />
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── VIDEO PREVIEW ── */}
                        <Anim>
                            <div className="sec">
                                <div className="slabel">🎬 Preview</div>
                                <h2 className="stitle">Dengarkan <em>Kisah Mereka</em></h2>
                                <div style={{ borderRadius: 15, overflow: "hidden", border: "1px solid rgba(201,153,26,.18)", marginTop: 14 }}>
                                    <video src={vidSuami1} controls playsInline style={{ width: "100%", display: "block" }} poster={imgPain7} />
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── PAIN IMAGES GALLERY ── */}
                        <Anim>
                            <div className="sec">
                                <div className="slabel" style={{ color: "#EF4444" }}>💔 Cerita yang Tidak Pernah Diceritakan</div>
                                <h2 className="stitle">Mereka <em>Diam</em>, Tapi Hati Mereka Bicara</h2>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginTop: 18 }}>
                                    {PAIN_IMAGES.map((img, i) => (
                                        <div key={i} style={{ borderRadius: 13, overflow: "hidden", border: "1px solid rgba(239,68,68,.12)" }}>
                                            <img src={img} alt={`Pain story ${i + 1}`} style={{ width: "100%", height: "auto", display: "block" }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── DEEP PAIN — PSYCHOLOGICAL CONSEQUENCES ── */}
                        <Anim>
                            <div className="sec">
                                <div className="slabel" style={{ color: "#EF4444" }}>⚠️ Kenyataan yang Tidak Ingin Anda Dengar</div>
                                <h2 className="stitle">Ini yang <em>Terjadi</em> Kalau Anda Terus Diam</h2>
                                <p className="sbody" style={{ marginBottom: 18 }}>Bukan bermaksud menakuti. Tapi ini fakta psikologi yang sudah dibuktikan oleh ratusan riset:</p>
                                {[
                                    ["💔", "Istri yang tidak puas akan MENCARI kepuasan di tempat lain", "Selingkuh bukan selalu karena cinta. Seringkali karena kebutuhan fisik yang tidak terpenuhi selama bertahun-tahun. Dan itu terjadi diam-diam."],
                                    ["😶", "Dia BERHENTI berharap pada Anda", "Ketika istri sudah tidak pernah meminta atau menolak halus, itu bukan tanda dia 'sabar'. Itu tanda dia sudah menyerah."],
                                    ["🪞", "Anda kehilangan TARING sebagai pria", "Rasa percaya diri Anda menurun. Di kantor, di rumah, di depan teman — Anda merasa ada yang kurang. Karena memang ADA yang kurang."],
                                    ["👀", "Dia MELIRIK pria lain — dan Anda tahu itu", "Bukan karena dia jahat. Tapi karena secara biologis, wanita tertarik pada pria yang bisa memenuhi kebutuhannya. Apakah Anda pria itu?"],
                                    ["🏚️", "Rumah tangga RETAK bukan karena kesalahan Anda sepenuhnya", "Tapi karena Anda TIDAK TAHU cara memperbaikinya. Bukan soal niat — soal ilmu yang tidak pernah diajarkan siapa pun."],
                                    ["😞", "Anda merasa TIDAK BERHARGA sebagai suami", "Setiap malam yang berakhir canggung, setiap 'sudah cepat aja', setiap kali dia tidur membelakangi Anda — itu semua menggerogoti harga diri Anda."]
                                ].map(([icon, title, desc], i) => (
                                    <div key={i} style={{ background: i % 2 === 0 ? "rgba(239,68,68,.04)" : "rgba(239,68,68,.02)", border: "1px solid rgba(239,68,68,.12)", borderRadius: 13, padding: "16px 18px", marginBottom: 10 }}>
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                                            <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                                            <strong style={{ fontSize: 14.5, color: "#EEE5C8", lineHeight: 1.5 }}>{title}</strong>
                                        </div>
                                        <p style={{ fontSize: 13, color: "#7D94AF", lineHeight: 1.75, margin: 0, paddingLeft: 30 }}>{desc}</p>
                                    </div>
                                ))}
                                <div style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.18)", borderRadius: 11, padding: "13px 15px", marginTop: 15, fontSize: 14.5, color: "#EEE5C8", lineHeight: 1.75, textAlign: "center", fontWeight: 600 }}>
                                    Pertanyaannya bukan <em style={{ color: "#EF4444" }}>"apakah ini akan terjadi"</em> — tapi <em style={{ color: "#EF4444" }}>"sudah seberapa parah"</em>
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── ORIGINAL PAIN POINTS (lighter) ── */}
                        <Anim>
                            <div className="sec">
                                <div className="slabel">Izinkan saya menyelami pikiran Anda...</div>
                                <h2 className="stitle">Apakah Anda pernah merasakan <em>salah satu ini?</em></h2>
                                {["Pengen jadi suami yang bikin dia puas… tapi ga tau caranya", "Sudah coba berbagai posisi — tapi tetap berakhir dalam 5 menit", "Istri bilang 'gapapa' tapi matanya bilang hal lain", "Ingin hubungan lebih intim tapi takut ditolak... lagi", "Pernah googling solusi tapi yang muncul iklan obat kuat yang bikin malu"].map((t, i) => (
                                    <div key={i} className="pcard"><span style={{ color: "#EF4444", flexShrink: 0, fontSize: 15 }}>😔</span>{t}</div>
                                ))}
                                <div style={{ background: "rgba(201,153,26,.06)", border: "1px solid rgba(201,153,26,.18)", borderRadius: 11, padding: "13px 15px", marginTop: 15, fontSize: 14, color: "#B0BFD0", lineHeight: 1.75 }}>
                                    Kalau <strong style={{ color: "#EF4444" }}>3 dari 5</strong> poin di atas menggambarkan Anda — maka halaman ini ditulis <strong style={{ color: "#EEE5C8" }}>khusus untuk Anda.</strong>
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── TRANSITION ── */}
                        <Anim>
                            <div className="sec">
                                <p className="sbody">Kalau <strong style={{ color: "#EF4444" }}>YA</strong>, itu posisi saya dulu — sampai akhirnya saya menemukan panduan ini.</p>
                                <p className="sbody" style={{ marginTop: 12 }}>Suami yang hubungannya hangat bukan karena lebih hebat, melainkan karena <strong style={{ color: "#EEE5C8" }}>berani belajar dan berubah.</strong></p>
                                <p style={{ marginTop: 14, fontSize: 14.5, fontWeight: 700, color: "#EEE5C8", background: "rgba(201,153,26,.07)", border: "1px solid rgba(201,153,26,.15)", borderRadius: 11, padding: "12px 14px", textAlign: "center", lineHeight: 1.6 }}>
                                    Satu langkah kecil hari ini bisa bikin hubungan Anda <em style={{ color: "var(--g)" }}>nikmat dan sama-sama puas.</em>
                                </p>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── NOT FOR YOU ── */}
                        <Anim>
                            <div className="sec painsec">
                                <div className="slabel">⚠️ Perhatian</div>
                                <h2 className="stitle">Halaman ini <em>TIDAK COCOK</em> untuk Anda yang...</h2>
                                <div className="notfor">
                                    {["Tidak mau melihat istri benar-benar terpuaskan", "Nyaman dengan hubungan yang datar dan membosankan", "Tidak tertarik meningkatkan keintiman", "Malas mempelajari hal baru untuk kebaikan keluarga"].map((t, i) => (
                                        <div key={i} className="nitem"><span style={{ color: "#EF4444", flexShrink: 0 }}>✗</span>{t}</div>
                                    ))}
                                </div>
                                <div style={{ background: "rgba(201,153,26,.06)", border: "1px solid rgba(201,153,26,.18)", borderRadius: 11, padding: "13px 15px", marginTop: 15, fontSize: 14, color: "#B0BFD0", lineHeight: 1.75 }}>
                                    💡 <strong style={{ color: "#EEE5C8" }}>Tapi kalau Anda di sini,</strong> artinya Anda peduli. Dan kepedulian itu adalah langkah pertama menuju pernikahan yang lebih baik.
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── WHAT YOU LOSE EVERY NIGHT — URGENCY ── */}
                        <Anim>
                            <div className="sec" style={{ background: "linear-gradient(180deg, rgba(239,68,68,.03) 0%, transparent 100%)" }}>
                                <div className="slabel" style={{ color: "#EF4444" }}>⏰ Setiap Malam yang Berlalu...</div>
                                <h2 className="stitle">Anda <em>Kehilangan</em> Lebih dari Sekadar Waktu</h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
                                    {[
                                        ["🌙", "Malam ini", "Dia tidur membelakangi Anda. Lagi. Dalam diam, dia bertanya-tanya apakah ini akan selamanya seperti ini."],
                                        ["📅", "Minggu depan", "Dia mulai membandingkan. Dengan suami temannya yang 'romantis'. Dengan karakter drama Korea yang 'perhatian'. Dengan siapa pun — selain Anda."],
                                        ["📆", "Bulan depan", "Jarak emosional makin lebar. Percakapan makin pendek. 'Aku capek' jadi jawaban default. Anda tidur di ranjang yang sama tapi merasa sendirian."],
                                        ["🗓️", "6 bulan dari sekarang", "Dia sudah tidak marah lagi. Tidak protes. Tidak menangis. Itu LEBIH BAHAYA — karena artinya dia sudah tidak peduli."],
                                    ].map(([icon, time, desc], i) => (
                                        <div key={i} style={{ background: "rgba(239,68,68,.03)", border: "1px solid rgba(239,68,68,.1)", borderRadius: 13, padding: "16px 18px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                                <span style={{ fontSize: 18 }}>{icon}</span>
                                                <strong style={{ fontSize: 14, color: "#EF4444" }}>{time}</strong>
                                            </div>
                                            <p style={{ fontSize: 13, color: "#7D94AF", lineHeight: 1.75, margin: 0, paddingLeft: 28 }}>{desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: "rgba(201,153,26,.08)", border: "1px solid rgba(201,153,26,.2)", borderRadius: 11, padding: "16px 18px", marginTop: 18, textAlign: "center" }}>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: "#EEE5C8", marginBottom: 6 }}>Tapi ada kabar baiknya...</p>
                                    <p style={{ fontSize: 13.5, color: "#C9991A", lineHeight: 1.75, margin: 0 }}>
                                        Semua ini <strong>BISA DIBALIK</strong>. Bukan dalam setahun. Bukan dalam sebulan. Tapi <strong>mulai MALAM INI</strong> — kalau Anda punya panduan yang tepat.
                                    </p>
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── WHAT YOU'LL LEARN ── */}
                        <Anim>
                            <div className="sec">
                                <img src={imgCurriculum} alt="Kurikulum Raja Ranjang" style={{ width: "100%", borderRadius: 13, marginBottom: 18 }} />
                                <div className="slabel">Kurikulum</div>
                                <h2 className="stitle">Yang Akan Anda <em>Pelajari & Praktikkan</em></h2>
                                <div className="lcard">
                                    {[
                                        ["Membedakan respons ASLI vs PALSU orgasme pasangan", "Bab 2: Jangan sampai istri cuma 'acting' puas"],
                                        ["Membangun BONDING & KONEKSI EMOSIONAL yang dalam", "Bab 3: Rahasia hubungan yang bikin dia nagih"],
                                        ["Teknik FOREPLAY, G-SPOT & CLITORIS yang tepat sasaran", "Bab 5-8: Panduan detail titik kenikmatan wanita"],
                                        ["Membaca BAHASA TUBUH istri tanpa dia harus bilang", "Bab 12: Tahu kapan dia puas dan kapan dia butuh lebih"],
                                        ["SENTUHAN & MENTAL — seni yang membedakan suami biasa vs luar biasa", "Bab 9-10: Bukan teori — langsung praktik malam ini"],
                                    ].map(([t, s], i) => (
                                        <div key={i} className="litem">
                                            <div className="lcheck">✓</div>
                                            <div className="ltext"><strong style={{ color: "#EEE5C8" }}>{t}</strong><br /><span style={{ color: "#4B6077", fontSize: 12 }}>{s}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />



                        {/* ── BONUSES ── */}
                        <Anim>
                            <div className="sec bsec">
                                <div className="slabel">Bonus Eksklusif</div>
                                <h2 className="stitle">4 Bonus Senilai <em>Rp570.000</em> — Gratis!</h2>
                                <Divider />
                                <div style={{ marginTop: 18 }}>
                                    {BONUSES.map((b, i) => (
                                        <Anim key={i} delay={i * 90}>
                                            <div className="bcard" style={{ background: `linear-gradient(135deg,${b.color}0C,transparent)`, borderColor: `${b.color}22` }}>
                                                <img src={BONUS_IMAGES[i]} alt={b.title} style={{ width: "100%", display: "block" }} />
                                                <div className="bhead">
                                                    <div className="bicon" style={{ background: `${b.color}18`, border: `1px solid ${b.color}2A` }}>{b.icon}</div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: 10.5, color: b.color, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 3 }}>BONUS {b.num}</div>
                                                        <div className="btitle" style={{ color: "#EEE5C8" }}>{b.title}</div>
                                                        <div className="bsub">{b.subtitle}</div>
                                                        <div className="bval" style={{ background: `${b.color}18`, color: b.color, border: `1px solid ${b.color}28` }}>
                                                            Senilai <s style={{ opacity: .55, marginLeft: 4 }}>{b.value}</s>&nbsp;— GRATIS
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bfeats">
                                                    {b.features.map((f, j) => (
                                                        <div key={j} className="bfeat"><div className="fdot" style={{ background: b.color }} />{f}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Anim>
                                    ))}
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── EBOOK POWER SPILL — PROVE IT'S REAL ── */}
                        <Anim>
                            <div className="sec" style={{ background: "linear-gradient(180deg,var(--n0) 0%,var(--n1) 50%,var(--n0) 100%)" }}>
                                <div className="slabel">👀 Intip Isinya</div>
                                <h2 className="stitle">Anda Pikir Ini <em>&ldquo;Terlalu Bagus?&rdquo;</em></h2>
                                <p className="sbody" style={{ marginBottom: 8 }}>Wajar skeptis. Karena Anda sudah pernah kecewa dengan janji-janji kosong sebelumnya. Jadi izinkan saya <strong style={{ color: "#EEE5C8" }}>buka sebagian isinya</strong> — supaya Anda bisa menilai sendiri:</p>

                                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
                                    {[
                                        ["📖", "Bab 2 — Orgasme Asli vs Palsu", "Tahukah Anda bahwa 67% wanita pernah BERPURA-PURA orgasme? Di bab ini Anda belajar 7 tanda fisik yang TIDAK BISA dipalsukan. Setelah bab ini, Anda akan tahu persis kapan dia benar-benar puas — dan kapan dia hanya 'menghibur' Anda.", "#C9991A"],
                                        ["🧠", "Bab 3 — Koneksi Emosional: Pintu Gerbang Kepuasan", "Riset Angela Hicks Ph.D menunjukkan: 89% wanita membutuhkan koneksi EMOSIONAL sebelum bisa menikmati hubungan fisik. Bab ini mengajarkan rumus 'H.E.A.T' — cara membangun suasana yang membuat dia INGIN bukan karena kewajiban.", "#A78BFA"],
                                        ["🎯", "Bab 5-8 — Teknik G-Spot, Clitoris & Foreplay", "Bukan teori abstrak. Anda akan dapat PANDUAN VISUAL tentang lokasi tepat, teknik stimulasi, dan ritme yang benar. Termasuk '3 Sentuhan Awal' yang disebut dr. Boyke sebagai pembuka paling efektif.", "#34D399"],
                                        ["⏱️", "Bab 9 — Tahan Lama TANPA Obat", "Teknik 'Start-Stop Modified' dan 'Squeeze Method' yang terbukti secara klinis. Ditambah latihan Kegel khusus pria yang hasilnya terasa dalam 2-3 minggu. Tanpa obat. Tanpa alat. Cuma latihan 10 menit/hari.", "#60A5FA"],
                                        ["💡", "Bab 12 — Membaca Bahasa Tubuh Istri", "Dia tidak akan pernah bilang terus terang. Tapi tubuhnya SELALU jujur. Bab ini mengajarkan 12 sinyal tubuh yang menunjukkan dia siap, dia butuh lebih, atau dia ingin Anda berhenti — tanpa dia harus minta.", "#FBBF24"],
                                    ].map(([icon, title, desc, color], i) => (
                                        <div key={i} style={{ background: `${color}08`, border: `1px solid ${color}18`, borderRadius: 13, padding: "16px 18px" }}>
                                            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                                                <span style={{ fontSize: 20 }}>{icon}</span>
                                                <strong style={{ fontSize: 14.5, color: "#EEE5C8", lineHeight: 1.5 }}>{title}</strong>
                                            </div>
                                            <p style={{ fontSize: 13, color: "#7D94AF", lineHeight: 1.8, margin: 0, paddingLeft: 30 }}>{desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ background: "rgba(201,153,26,.06)", border: "1px solid rgba(201,153,26,.18)", borderRadius: 11, padding: "16px 18px", marginTop: 18, textAlign: "center" }}>
                                    <p style={{ fontSize: 14, color: "#7D94AF", lineHeight: 1.75, margin: 0 }}>
                                        ☝️ Itu baru <strong style={{ color: "#EEE5C8" }}>5 dari 12 bab</strong> ebook utama. Belum termasuk <strong style={{ color: "#C9991A" }}>4 bonus premium</strong> yang nilainya lebih dari harga paket ini.
                                    </p>
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── WHY THIS METHOD WORKS — CREDIBILITY ── */}
                        <Anim>
                            <div className="sec">
                                <div className="slabel">🔬 Kenapa Metode Ini Berbeda</div>
                                <h2 className="stitle">Bukan Obat Kuat. Bukan Ramuan. <em>Ini Ilmu.</em></h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
                                    {[
                                        ["📖", "599 halaman — bukan ebook tipis 10 halaman", "Ini panduan LENGKAP dengan 12 bab ebook utama + 4 bonus premium. Ditulis dengan bahasa Indonesia yang mudah dipahami, langsung to the point."],
                                        ["🧠", "Berbasis riset psikologi & kedokteran", "Setiap teknik disusun dari pendapat ahli: dr. Boyke Dian Nugraha (seksolog Indonesia #1), Angela Hicks Ph.D (psikolog keintiman), dan riset klinis Gheshlaghi."],
                                        ["🎯", "Langsung bisa dipraktikkan MALAM INI", "Bukan teori akademis. Setiap bab memberikan langkah konkret, panduan visual, dan 'quick win' yang bisa Anda coba langsung."],
                                        ["💊", "Tanpa obat, tanpa alat, tanpa efek samping", "Semua metode alami dan aman. Latihan Kegel, teknik pernapasan, dan pendekatan psikologis yang sudah diuji secara klinis."],
                                        ["🤫", "100% privasi terjaga", "Dikirim digital ke WhatsApp Anda. Tidak ada label produk di tagihan. Istri pun tidak harus tahu — sampai dia merasakan perubahannya."],
                                    ].map(([icon, title, desc], i) => (
                                        <div key={i} style={{ background: "rgba(201,153,26,.04)", border: "1px solid rgba(201,153,26,.12)", borderRadius: 13, padding: "16px 18px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                                <span style={{ fontSize: 20 }}>{icon}</span>
                                                <strong style={{ fontSize: 14.5, color: "#EEE5C8" }}>{title}</strong>
                                            </div>
                                            <p style={{ fontSize: 13, color: "#7D94AF", lineHeight: 1.75, margin: 0 }}>{desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── EXPERT — [PLACEHOLDER-NEW-05] ── */}
                        <Anim>
                            <div className="sec">
                                <div className="ecard">
                                    <div className="eicon">🔬</div>
                                    <div>
                                        <h3 style={{ fontFamily: "var(--fd)", fontSize: 19.5, fontWeight: 700, marginBottom: 8 }}>Berbasis Riset Ilmiah</h3>
                                        <p style={{ fontSize: 13.5, color: "#7D94AF", lineHeight: 1.75 }}>Disusun berdasarkan riset kesehatan reproduksi & psikologi keintiman modern. Bukan spekulasi — setiap panduan punya dasar ilmiah yang solid.</p>
                                        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 11 }}>
                                            {["Psikologi Keintiman", "Kesehatan Reproduksi", "Neurosains Cinta"].map((t, i) => (
                                                <span key={i} style={{ fontSize: 11, padding: "3px 9px", background: "rgba(96,165,250,.1)", border: "1px solid rgba(96,165,250,.18)", borderRadius: 100, color: "#60A5FA" }}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── TESTIMONIALS ── */}
                        <Anim>
                            <div className="sec">
                                <div className="slabel">Testimoni Nyata</div>
                                <h2 className="stitle">Apa Kata <em>Mereka</em></h2>
                                <div style={{ marginTop: 18 }}>
                                    {TESTIMONIALS.map((t, i) => (
                                        <Anim key={i} delay={i * 75}>
                                            <div className="tcard" style={{ borderTopColor: t.color, borderTopWidth: 2 }}>
                                                <div className="thead">
                                                    <div className="tav" style={{ background: `${t.color}22`, color: t.color, border: `2px solid ${t.color}45` }}>{t.initial}</div>
                                                    <div>
                                                        <div className="tname">{t.name}</div>
                                                        <div className="trole">{t.role} · {t.age}</div>
                                                        <div className="tstars">★★★★★</div>
                                                    </div>
                                                </div>
                                                <p className="tquote">&ldquo;{t.quote}&rdquo;</p>
                                                <div className="vbadge">✓ Verified Buyer</div>
                                            </div>
                                        </Anim>
                                    ))}
                                </div>

                                {/* Social proof counter */}
                                <div style={{ background: "linear-gradient(135deg,rgba(201,153,26,.08),rgba(201,153,26,.02))", border: "1px solid rgba(201,153,26,.18)", borderRadius: 15, padding: 18, marginTop: 18, textAlign: "center" }}>
                                    <div style={{ fontFamily: "var(--fd)", fontSize: 38, fontWeight: 700, color: "#F0C84A", lineHeight: 1 }}>4.850+</div>
                                    <div style={{ fontSize: 13.5, color: "#7D94AF", marginTop: 5 }}>Suami di Indonesia telah membuktikannya</div>
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />
                        {/* ── RED WARNING BOX ── */}
                        <Anim>
                            <div className="sec" style={{ paddingBottom: 0 }}>
                                <div style={{
                                    background: "linear-gradient(135deg, rgba(220,38,38,.15), rgba(185,28,28,.08))",
                                    border: "2px solid rgba(239,68,68,.45)",
                                    borderRadius: 16,
                                    padding: "24px 20px",
                                    position: "relative",
                                    overflow: "hidden"
                                }}>
                                    {/* Warning icon */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                        <span style={{ fontSize: 28 }}>⚠️</span>
                                        <span style={{ fontFamily: "var(--fd)", fontSize: 22, fontWeight: 700, color: "#FCA5A5", letterSpacing: ".3px" }}>Jika Anda Ingin Berubah...</span>
                                    </div>

                                    <div style={{ fontSize: 17, color: "#E2C8A0", lineHeight: 1.8 }}>
                                        <p style={{ marginBottom: 12 }}>
                                            Dari <strong style={{ color: "#EF4444" }}>lemah</strong> ke <strong style={{ color: "#34D399" }}>kuat</strong>.<br />
                                            Dari <strong style={{ color: "#EF4444" }}>diabaikan istri karena lemah</strong> jadi <strong style={{ color: "#34D399" }}>disayangi kembali</strong>.<br />
                                            Dari <strong style={{ color: "#EF4444" }}>malu di ranjang</strong> jadi <strong style={{ color: "#34D399" }}>percaya diri penuh wibawa</strong>.
                                        </p>
                                        <p style={{ marginBottom: 12 }}>
                                            Maka <strong style={{ color: "#F0C84A" }}>ambil kesempatan ini sebelum harga naik</strong> — dengan bundle bonus yang massive, <strong>sekarang juga</strong>.
                                        </p>
                                        <p style={{ margin: 0, paddingTop: 10, borderTop: "1px solid rgba(239,68,68,.2)" }}>
                                            💰 Harga <strong style={{ color: "#F0C84A", fontSize: 22 }}>{displayPrice}</strong> sangatlah kecil dibanding biaya <em>harga diri</em>, <em>ketenangan</em>, dan <em>wibawa</em> Anda — yang melebihi harga <strong>1x makan di luar</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── PRICING ── */}
                        <Anim>
                            <div className="sec pricesec">
                                <div className="slabel">Penawaran Terbatas</div>
                                <h2 className="stitle">Dapatkan <em>Semua Ini</em> Sekarang</h2>

                                {/* Countdown */}
                                <div className="cdbox">
                                    <div className="cdlbl">⏰ Harga Spesial Berakhir Dalam</div>
                                    <div className="cdrow">
                                        <div className="tblock"><div className="tdig">{h}</div><div className="tlbl">Jam</div></div>
                                        <div className="tsep">:</div>
                                        <div className="tblock"><div className="tdig">{m}</div><div className="tlbl">Menit</div></div>
                                        <div className="tsep">:</div>
                                        <div className="tblock"><div className="tdig">{s}</div><div className="tlbl">Detik</div></div>
                                    </div>
                                </div>

                                {/* Value stack — FULL from rajaranjang.html */}
                                <div className="bundle">
                                    <img src={imgBundle} alt="Bundle Raja Ranjang" style={{ width: "100%", borderRadius: 13, marginBottom: 18 }} />
                                    <div style={{ fontFamily: "var(--fd)", fontSize: 17, fontWeight: 700, color: "#F0C84A", marginBottom: 14 }}>PAKET LENGKAP</div>
                                    {VALUE_STACK.map(([item, price], i) => (
                                        <div key={i} className="vsitem">
                                            <span style={{ color: "#B8CBDE" }}>✅ {item}</span>
                                            <span style={{ color: "#EF4444", textDecoration: "line-through", fontSize: 12 }}>{price}</span>
                                        </div>
                                    ))}
                                    <div style={{ marginTop: 14 }}>
                                        <div style={{ fontFamily: "var(--fd)", fontSize: 18, fontWeight: 700, color: "#EEE5C8" }}>Total Nilai: <span style={{ color: "#EF4444", textDecoration: "line-through" }}>Rp769.000</span></div>
                                    </div>
                                </div>

                                <div style={{ textAlign: "center", marginBottom: 14 }}><span className="arrb">↓</span></div>

                                {/* Package options */}
                                <div className="pkgopt sel">
                                    <div className="pkgbadge">⭐ TERPOPULER</div>
                                    <div className="pkgname">📦 Paket Lengkap Raja Ranjang</div>
                                    <div className="pkgitems">Ebook Utama + 4 Bonus Premium (599 halaman total)</div>
                                    <div className="pkgprow">
                                        <div className="pkgold">Rp769.000</div>
                                        <div className="pkgnew">{displayPrice}</div>
                                        <div className="savetag">Hemat {savePct}</div>
                                    </div>
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── CHECKOUT FORM ── */}
                        <Anim>
                            <div id="checkout" className="sec formsec">
                                <div className="slabel">Langkah Terakhir</div>
                                <h2 className="stitle">Isi Data & <em>Dapatkan Akses</em></h2>

                                {/* Trust badges — 4 items */}
                                <div className="privstrip">
                                    {[["🔒", "100% Privasi"], ["⚡", "Akses Instan"], ["💳", "Bayar Aman"], ["📱", "Seumur Hidup"]].map(([ic, lb]) => (
                                        <div key={lb} className="privbadge"><span>{ic}</span><span>{lb}</span></div>
                                    ))}
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    <div>
                                        <label className="flabel">Nama Lengkap</label>
                                        <input className="finput" placeholder="Contoh: Ahmad Budi" value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="flabel">No. WhatsApp</label>
                                        <div className="pwrap">
                                            <div className="ppfx">🇮🇩 +62</div>
                                            <input className="finput" placeholder="812345678" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flabel">Email (untuk link download)</label>
                                        <input className="finput" type="email" placeholder="contoh@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="flabel">Metode Pembayaran</label>
                                        <div className="pmgrid" style={{ gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                            {[
                                                ["QRIS", "QRIS", "Shopeepay, OVO, GoPay, DANA"],
                                                ["BCAVA", "BCA Virtual Account", "Otomatis via BCA"],
                                                ["BNIVA", "BNI Virtual Account", "Otomatis via BNI"],
                                                ["BRIVA", "BRI Virtual Account", "Otomatis via BRI"],
                                                ["MANDIRIVA", "Mandiri Virtual Account", "Otomatis via Mandiri"],
                                                ["PERMATAVA", "Permata Virtual Account", "Otomatis via Permata"]
                                            ].map(([id, nm, sb]) => (
                                                <div key={id} className={`pmopt ${payment === id ? "sel" : ""}`} onClick={() => setPayment(id)}>
                                                    <div className="pmname">{nm}</div>
                                                    <div className="pmsub" style={{ color: (id === 'QRIS') ? '#F0C84A' : 'var(--muted)', fontSize: '12px' }}>{sb}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order summary */}
                                    <div style={{ background: "rgba(201,153,26,.05)", border: "1px solid rgba(201,153,26,.13)", borderRadius: 11, padding: 14 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontSize: 13.5, color: "#7D94AF" }}>
                                            <span>Paket Lengkap Raja Ranjang</span>
                                            <span style={{ color: "#EEE5C8", fontWeight: 600 }}>{displayPrice}</span>
                                        </div>
                                        <div style={{ height: 1, background: "rgba(201,153,26,.09)", marginBottom: 7 }} />
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, fontWeight: 700 }}>
                                            <span style={{ color: "#EEE5C8" }}>Total</span>
                                            <span style={{ color: "#C9991A", fontFamily: "var(--fd)", fontSize: 21 }}>{displayPrice}</span>
                                        </div>
                                    </div>

                                    <button className="sbtn" onClick={submitOrder} disabled={loading}>
                                        {loading ? "Memproses..." : `🛒 Pesan Sekarang — ${displayPrice}`}
                                    </button>
                                    <p style={{ fontSize: 12, color: "#374151", textAlign: "center", lineHeight: 1.75 }}>🔒 Pembayaran aman & dienkripsi. Produk dikirim digital (Email/WA). Tidak ada penagihan mencurigakan di rekening. Privasi 100% terjaga.</p>
                                </div>
                            </div>
                        </Anim>
                        <div className="sep" />

                        {/* ── FAQ ── */}
                        <Anim>
                            <div className="sec">
                                <div className="slabel">FAQ</div>
                                <h2 className="stitle">Pertanyaan yang <em>Sering Ditanyakan</em></h2>
                                <div style={{ marginTop: 18 }}>
                                    {FAQS.map((f, i) => <FAQ key={i} {...f} />)}
                                </div>
                            </div>
                        </Anim>

                        {/* ── FOOTER ── */}
                        <div className="footer">
                            <Divider />
                            <div style={{ fontFamily: "var(--fd)", fontSize: 21, fontWeight: 700, color: "#C9991A", margin: "14px 0 7px" }}>Raja Ranjang</div>
                            <p style={{ fontSize: 12, color: "#263040", lineHeight: 1.75 }}>
                                © 2026 Raja Ranjang. Semua hak dilindungi.<br />
                                Produk digital edukasi dewasa untuk pasangan menikah. Privasi Anda 100% terjaga.
                            </p>
                        </div>

                        {/* ── STICKY CTA ── */}
                        <div className={`sticky ${sticky ? "" : "off"}`}>
                            <button
                                className="stickybtn"
                                onClick={(name && phone && email && payment) ? submitOrder : scrollToForm}
                                disabled={loading}
                            >
                                {loading ? "Memproses..." : `🛒 Pesan Sekarang — ${displayPrice}`}
                            </button>
                            <div className="stickyp">⚡ Akses instan · 🔒 100% privasi · ✅ Garansi 7 hari</div>
                        </div>

                    </div >
                </>
            )}
        </div>
    );
}

