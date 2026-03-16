import { useState, useEffect, useRef } from "react";
import { supabase } from '@/integrations/supabase/client'; const NEON = "#00aa55";
const NEON2 = "#00cc77";
const BG = "#ffffff";

const glowStyle = {
  textShadow: `0 0 8px ${NEON}55`,
};
const btnGlow = {
  boxShadow: `0 0 16px ${NEON}44, 0 4px 24px ${NEON}33`,
};

// --- Radar Animation ---
function RadarScan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx: any = canvas.getContext("2d");
    if (!ctx) return;
    let angle = 0;
    const blips = Array.from({ length: 14 }, () => ({
      r: Math.random() * 0.82 + 0.1,
      a: Math.random() * Math.PI * 2,
      size: Math.random() * 3 + 2,
      fade: 0,
    }));
    let animId: any;
    function draw() {
      if (!canvas) return;
      const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 10;
      ctx.clearRect(0, 0, W, H);
      // Grid rings
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (R * i) / 4, 0, Math.PI * 2);
        ctx.strokeStyle = `${NEON}22`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // Cross lines
      ctx.strokeStyle = `${NEON}22`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();

      // Sweep gradient (removed unused gradient code)

      // Fallback sweep arc
      for (let i = 0; i < 60; i++) {
        const a = angle - (i / 60) * (Math.PI / 1.5);
        const alpha = (1 - i / 60) * 0.35;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, a, a + 0.055);
        ctx.closePath();
        ctx.fillStyle = `rgba(0,255,136,${alpha})`;
        ctx.fill();
      }

      // Sweep line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      ctx.strokeStyle = NEON;
      ctx.lineWidth = 2;
      ctx.shadowColor = NEON;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Blips
      blips.forEach((b) => {
        const diff = ((angle - b.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (diff < 0.18) b.fade = 1;
        if (b.fade > 0) {
          const bx = cx + Math.cos(b.a) * b.r * R;
          const by = cy + Math.sin(b.a) * b.r * R;
          ctx.beginPath();
          ctx.arc(bx, by, b.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,255,136,${b.fade})`;
          ctx.shadowColor = NEON;
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
          b.fade = Math.max(0, b.fade - 0.008);
        }
      });

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = NEON;
      ctx.shadowColor = NEON;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;

      angle = (angle + 0.022) % (Math.PI * 2);
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={340}
      style={{ display: "block", margin: "0 auto" }}
    />
  );
}

// --- Countdown Timer ---
function Countdown() {
  const target = useRef(Date.now() + 3 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000 + 33 * 60 * 1000);
  const [time, setTime] = useState({ d: 3, h: 7, m: 33, s: 0 });
  useEffect(() => {
    const iv = setInterval(() => {
      const diff = Math.max(0, target.current - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  const pad = (n: number | string) => String(n).padStart(2, "0");
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", fontFamily: "'Share Tech Mono', monospace" }}>
      {[["HARI", time.d], ["JAM", time.h], ["MENIT", time.m], ["DETIK", time.s]].map(([label, val]) => (
        <div key={label} style={{
          background: "#ffffff",
          border: `1px solid ${NEON}55`,
          borderRadius: 8,
          padding: "12px 18px",
          textAlign: "center",
          minWidth: 68,
          boxShadow: `0 0 12px ${NEON}22`,
        }}>
          <div style={{ fontSize: 32, color: NEON, ...glowStyle, letterSpacing: 2 }}>{pad(val)}</div>
          <div style={{ fontSize: 10, color: "#444444", letterSpacing: 3 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// --- Ticker ---
function Ticker() {
  const items = [
    "🐋 WHALE ALERT: 0x4f2...e3a1 accumulated 2.3M $PEPE",
    "⚡ SMART MONEY: 3 wallets bought $BONK before 80x pump",
    "🔴 RUGPULL DETECTED: $MOON contract has hidden mint function",
    "📈 ACCUMULATION: Top wallet added 500K $WIF in last 2h",
    "🚨 WHALE MOVE: SOL wallet 7kJm...9xP2 entered $POPCAT",
    "✅ AUDIT PASS: $DOGE2 contract verified clean by AI",
  ];
  return (
    <div style={{
      background: "#f5f5f5",
      borderTop: `1px solid ${NEON}44`,
      borderBottom: `1px solid ${NEON}44`,
      overflow: "hidden",
      padding: "10px 0",
      position: "relative",
    }}>
      <div style={{
        display: "flex",
        gap: 80,
        animation: "ticker 30s linear infinite",
        whiteSpace: "nowrap",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 13,
        color: NEON,
      }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ opacity: 0.85 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// --- Wallet Rows ---
function WalletRows() {
  const rows = [
    { addr: "7kJm...9xP2", winrate: "94%", pnl: "+$2.4M", tokens: "$WIF $BONK $PEPE", status: "ACTIVE" },
    { addr: "0x4f2...e3a1", winrate: "91%", pnl: "+$890K", tokens: "$DOGE $SHIB $FLOKI", status: "BUYING" },
    { addr: "Hs9p...3nQ7", winrate: "88%", pnl: "+$1.1M", tokens: "$POPCAT $MYRO", status: "ACTIVE" },
    { addr: "B7rT...6mK1", winrate: "85%", pnl: "+$560K", tokens: "$BOME $SAMO $CATO", status: "WATCHING" },
  ];
  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13 }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 80px 90px 1fr 90px",
        color: "#444444", fontSize: 11, letterSpacing: 2,
        borderBottom: `1px solid ${NEON}22`, paddingBottom: 8, marginBottom: 8,
      }}>
        <span>WALLET</span><span>WIN%</span><span>PNL</span><span>TOKENS</span><span>STATUS</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "1fr 80px 90px 1fr 90px",
          padding: "10px 0", borderBottom: `1px solid #eee`,
          alignItems: "center",
          transition: "background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = `${NEON}08`}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ color: NEON }}>{r.addr}</span>
          <span style={{ color: "#008844" }}>{r.winrate}</span>
          <span style={{ color: "#006633" }}>{r.pnl}</span>
          <span style={{ color: "#444444", fontSize: 11 }}>{r.tokens}</span>
          <span style={{
            color: r.status === "BUYING" ? "#ff4444" : r.status === "ACTIVE" ? NEON : "#ffaa00",
            fontSize: 11,
            padding: "2px 8px",
            border: `1px solid ${r.status === "BUYING" ? "#ff4444" : r.status === "ACTIVE" ? NEON : "#ffaa00"}44`,
            borderRadius: 4,
            display: "inline-block",
          }}>{r.status}</span>
        </div>
      ))}
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [hovered, setHovered] = useState(false);

  // Free Ebook States
  const [nameFree, setNameFree] = useState("");
  const [waFree, setWaFree] = useState("");
  const [emailFree, setEmailFree] = useState("");
  const [loadingFree, setLoadingFree] = useState(false);
  const [successFree, setSuccessFree] = useState(false);

  const submitFreeEbook = async () => {
    if (!nameFree || !waFree || !emailFree) {
      alert('Harap isi Nama, WhatsApp, dan Email.');
      return;
    }

    let formattedWa = waFree.trim().replace(/\D/g, '');
    if (formattedWa.startsWith('0')) {
      formattedWa = '62' + formattedWa.slice(1);
    } else if (!formattedWa.startsWith('62')) {
      formattedWa = '62' + formattedWa;
    }

    setLoadingFree(true);
    try {
      const payload = {
        userEmail: emailFree,
        userName: nameFree,
        phone: formattedWa,
        id: 'id' // Indonesian by default
      };

      const { data, error } = await supabase.functions.invoke('send-ebooks-free', {
        body: payload
      });

      if (error) throw error;

      if (data?.success) {
        setSuccessFree(true);
      } else {
        alert(data?.error || 'Gagal mengirim WhatsApp. Silahkan coba lagi nanti.');
      }
    } catch (error: any) {
      console.error('Free Ebook API Error:', error);
      const errorMsg = error?.message || error?.error?.message || error?.toString() || 'Kesalahan jaringan';
      alert(`Terjadi kesalahan: ${errorMsg}`);
    } finally {
      setLoadingFree(false);
    }
  };

  return (
    <div style={{
      background: BG,
      minHeight: "100vh",
      color: "#ffffff",
      fontFamily: "'Share Tech Mono', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes gridMove { 0% { background-position: 0 0; } 100% { background-position: 40px 40px; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-14px); } }
        @keyframes scanline { 0% { top: -2%; } 100% { top: 102%; } }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; background: #ffffff; }
        ::-webkit-scrollbar-thumb { background: ${NEON}55; border-radius: 3px; }
        body { background: #ffffff; }
      `}</style>

      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(${NEON}18 1px, transparent 1px),
          linear-gradient(90deg, ${NEON}18 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        animation: "gridMove 8s linear infinite",
        pointerEvents: "none",
      }} />

      {/* Scanline */}
      <div style={{
        position: "fixed", left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${NEON}44, transparent)`,
        zIndex: 1, animation: "scanline 6s linear infinite", pointerEvents: "none",
      }} />

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.95)",
        borderBottom: `1px solid ${NEON}44`,
        backdropFilter: "blur(12px)",
        padding: "16px 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            border: `2px solid ${NEON}`,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 12px ${NEON}`,
          }}>
            <span style={{ color: NEON, fontSize: 16 }}>🐋</span>
          </div>
          <span style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 18, fontWeight: 900,
            color: NEON, ...glowStyle, letterSpacing: 2,
          }}>WHALE HUNTER</span>
          <span style={{
            fontSize: 10, color: "#444444", letterSpacing: 3,
            padding: "2px 6px", border: "1px solid #333", borderRadius: 3,
          }}>v2.4.1</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#444444" }}>
          {["FITUR", "HARGA", "DOCS", "LOGIN"].map((t) => (
            <a key={t} href="#" style={{
              color: "#444444", textDecoration: "none", letterSpacing: 2,
              transition: "color 0.2s",
            }}
              onMouseEnter={(e: any) => { e.target.style.color = NEON; }}
              onMouseLeave={(e: any) => { e.target.style.color = "#666"; }}
            >{t}</a>
          ))}
        </div>
      </nav>

      {/* TICKER */}
      <Ticker />

      {/* HERO */}
      <section style={{
        position: "relative", zIndex: 2,
        padding: "90px 5% 70px",
        display: "grid", gridTemplateColumns: "1fr 360px",
        gap: 60, alignItems: "center", maxWidth: 1200, margin: "0 auto",
      }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${NEON}12`, border: `1px solid ${NEON}44`,
            borderRadius: 20, padding: "5px 14px", marginBottom: 28,
            fontSize: 12, color: NEON, letterSpacing: 2,
          }}>
            <span style={{ animation: "pulse 1.4s infinite", display: "inline-block" }}>●</span>
            LIVE — 2,847 WHALE WALLETS TRACKED
          </div>

          <h1 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 900, lineHeight: 1.15,
            color: "#111111", marginBottom: 20,
          }}>
            Berhenti Menjadi{" "}
            <span style={{ color: NEON, ...glowStyle }}>Likuiditas Whale.</span>
            <br />Ikuti Jejak Mereka.
          </h1>

          <p style={{
            fontSize: 17, color: "#333333", lineHeight: 1.75,
            maxWidth: 580, marginBottom: 36,
          }}>
            Deteksi akumulasi dompet <span style={{ color: NEON }}>{'<Insider>'}</span> di Solana secara <strong style={{ color: "#111111" }}>real-time</strong>.
            Dapatkan notifikasi sebelum token di-pump <span style={{ color: NEON, ...glowStyle }}>100x</span> menggunakan{" "}
            <span style={{ color: NEON }}>AI Intent Analysis.</span>
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 44 }}>
            <button
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                background: hovered ? NEON : "transparent",
                color: hovered ? "#000" : NEON,
                border: `2px solid ${NEON}`,
                padding: "16px 36px",
                fontSize: 16, fontWeight: 700,
                fontFamily: "'Orbitron', monospace",
                letterSpacing: 2,
                borderRadius: 6, cursor: "pointer",
                transition: "all 0.2s",
                ...btnGlow,
              }}
            >⚡ AKSES WHALE TRACKER</button>
            <button style={{
              background: "transparent",
              color: "#444444",
              border: "2px solid #333",
              padding: "16px 28px",
              fontSize: 15,
              fontFamily: "'Share Tech Mono', monospace",
              borderRadius: 6, cursor: "pointer",
              letterSpacing: 1,
            }}>▶ LIHAT DEMO</button>
          </div>

          <div style={{ display: "flex", gap: 36 }}>
            {[["2,847+", "Whale Wallets"], ["94%", "Akurasi AI"], ["<0.3s", "Deteksi"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 26, fontWeight: 900, color: NEON, fontFamily: "'Orbitron', monospace", ...glowStyle }}>{n}</div>
                <div style={{ fontSize: 12, color: "#888", letterSpacing: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RADAR */}
        <div style={{
          animation: "float 5s ease-in-out infinite",
          background: "#f8f8f8",
          border: `1px solid ${NEON}44`,
          borderRadius: 16, padding: 20,
          boxShadow: `0 0 40px ${NEON}22, 0 4px 24px rgba(0,0,0,0.08)`,
        }}>
          <div style={{ fontSize: 11, color: "#333333", letterSpacing: 3, textAlign: "center", marginBottom: 10 }}>
            ON-CHAIN SCAN — SOLANA MAINNET
          </div>
          <RadarScan />
          <div style={{
            marginTop: 12, padding: "8px 12px",
            background: "#f0f0f0", borderRadius: 6,
            fontSize: 12, color: NEON, textAlign: "center",
            border: `1px solid ${NEON}33`,
          }}>
            SCANNING MEMPOOL...{" "}
            <span style={{ animation: "blink 1s infinite", display: "inline-block" }}>█</span>
          </div>
        </div>
      </section>

      {/* PAIN SECTION */}
      <section style={{
        position: "relative", zIndex: 2,
        background: "#f7f7f7",
        borderTop: `1px solid #e0e0e0`, borderBottom: `1px solid #e0e0e0`,
        padding: "80px 5%",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, color: "#ff4444", letterSpacing: 4, marginBottom: 12 }}>// MASALAH UTAMA</p>
            <h2 style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(22px, 3vw, 38px)", fontWeight: 900,
              color: "#ffffff",
            }}>Mengapa 90% Trader Kripto <span style={{ color: "#ff4444" }}>Rugi?</span></h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                icon: "💀", title: "Rugpull & Honeypot",
                desc: "Lelah kena tipu project sampah? Smart contract dengan hidden backdoor membuat investasi Anda lenyap dalam hitungan detik. Tidak ada warning, tidak ada refund.",
                color: "#ff4444",
              },
              {
                icon: "🩸", title: "Exit Liquidity",
                desc: "Anda beli saat Whale sudah mulai jualan. Mereka akumulasi di bawah, pump harganya, dan dump ke tangan Anda. Anda adalah 'exit liquidity' mereka.",
                color: "#ff6622",
              },
              {
                icon: "🌊", title: "Noise Berlebihan",
                desc: "Ribuan koin baru lahir setiap hari — mana yang asli emas? Tanpa filter AI, Anda akan tenggelam dalam noise dan melewatkan peluang 100x yang nyata.",
                color: "#ffaa00",
              },
            ].map((item) => (
              <div key={item.title} style={{
                background: "#ffffff",
                border: `1px solid ${item.color}44`,
                borderRadius: 12, padding: 30,
                transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = `${item.color}99`; e.currentTarget.style.boxShadow = `0 8px 32px ${item.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = `${item.color}44`; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 16, fontWeight: 700,
                  color: item.color, marginBottom: 12,
                }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: "#444444", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section style={{ position: "relative", zIndex: 2, padding: "90px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, color: NEON, letterSpacing: 4, marginBottom: 12 }}>// SOLUSI</p>
            <h2 style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(22px, 3vw, 38px)", fontWeight: 900,
              color: "#ffffff",
            }}>Senjata Rahasia <span style={{ color: NEON, ...glowStyle }}>Smart Money</span></h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginBottom: 56 }}>
            {[
              {
                icon: "🛡️", code: "01",
                title: "Smart Contract Auditor AI",
                desc: "Deteksi otomatis celah keamanan dalam 3 detik. Scan honeypot, mint function tersembunyi, rug indicators, dan blacklist wallet sebelum Anda invest.",
                tags: ["HONEYPOT SCAN", "MINT DETECT", "LP LOCK"],
              },
              {
                icon: "📡", code: "02",
                title: "Wallet Copy-Trade Alert",
                desc: "Ikuti dompet trader yang punya win-rate 90% secara otomatis. Real-time notification via Telegram/Discord saat whale masuk posisi baru.",
                tags: ["REAL-TIME", "TELEGRAM", "AUTO-FOLLOW"],
              },
              {
                icon: "🧠", code: "03",
                title: "Social Sentiment Engine",
                desc: "Scan Telegram & X (Twitter) untuk melihat koin mana yang akan viral. AI kami memproses 50K+ pesan per menit untuk deteksi momentum lebih awal.",
                tags: ["TELEGRAM", "TWITTER/X", "50K MSG/MIN"],
              },
            ].map((f) => (
              <div key={f.code} style={{
                background: "#f9f9f9",
                border: `1px solid ${NEON}33`,
                borderRadius: 14, padding: 32,
                position: "relative", overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 0 40px ${NEON}22`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  position: "absolute", top: 16, right: 20,
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 48, color: `${NEON}15`, fontWeight: 900,
                }}>{f.code}</div>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 16, fontWeight: 700, color: NEON,
                  marginBottom: 12, ...glowStyle,
                }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: "#444444", lineHeight: 1.7, marginBottom: 18 }}>{f.desc}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {f.tags.map((t) => (
                    <span key={t} style={{
                      fontSize: 10, color: NEON, letterSpacing: 1.5,
                      padding: "3px 8px",
                      border: `1px solid ${NEON}44`,
                      borderRadius: 3,
                      background: `${NEON}0a`,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Wallet table */}
          <div style={{
            background: "#f9f9f9",
            border: `1px solid ${NEON}44`,
            borderRadius: 14, padding: 32,
            boxShadow: `0 4px 24px ${NEON}11`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: 15, color: NEON }}>
                🐋 TOP WHALE WALLETS — LIVE
              </h3>
              <span style={{ fontSize: 11, color: "#999", letterSpacing: 2, animation: "pulse 2s infinite" }}>● UPDATING</span>
            </div>
            <WalletRows />
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section style={{
        position: "relative", zIndex: 2,
        background: "#f9f9f9",
        borderTop: `1px solid #e0e0e0`, borderBottom: `1px solid #e0e0e0`,
        padding: "80px 5%",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, color: NEON, letterSpacing: 4, marginBottom: 16 }}>// TEKNOLOGI</p>
            <h2 style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(20px, 2.5vw, 32px)", fontWeight: 900,
              color: "#111111", marginBottom: 20, lineHeight: 1.3,
            }}>
              <span style={{ color: NEON, ...glowStyle }}>Elvision</span>{" "}
              Blockchain Indexer
            </h2>
            <p style={{ fontSize: 16, color: "#777", lineHeight: 1.8, marginBottom: 24 }}>
              Mesin kami membaca <strong style={{ color: "#111111" }}>mempool dan transaksi atomik</strong> langsung dari validator
              untuk kecepatan tanpa delay. Bukan scraping — ini koneksi langsung ke jaringan Solana.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                ["⚡", "Sub-300ms latency", "Dari validator langsung ke dashboard Anda"],
                ["🔗", "Full Node Access", "Akses mempool, block data, dan transaksi atomik"],
                ["🤖", "AI Intent Parser", "Model ML kami memprediksi aksi berikutnya dari pola transaksi"],
              ].map(([icon, title, sub]) => (
                <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 22, marginTop: 2 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 15, color: NEON, fontWeight: 700 }}>{title}</div>
                    <div style={{ fontSize: 14, color: "#444444" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13 }}>
            <div style={{
              background: "#ffffff",
              border: `1px solid ${NEON}33`,
              borderRadius: 10, padding: 24,
              boxShadow: `0 0 30px ${NEON}10`,
            }}>
              <div style={{ color: "#777777", fontSize: 11, marginBottom: 16, letterSpacing: 2 }}>
                ELVISION_INDEXER.LOG — LIVE STREAM
              </div>
              {[
                { t: "09:14:33.221", msg: "MEMPOOL: tx_sig=5xKj... detected", c: NEON },
                { t: "09:14:33.224", msg: "PARSE: swap SOL→$POPCAT 45K USD", c: "#00aa00" },
                { t: "09:14:33.228", msg: "MATCH: wallet_cluster=WHALE_A", c: NEON2 },
                { t: "09:14:33.231", msg: "INTENT_SCORE: 0.94 (ACCUMULATION)", c: "#ccaa00" },
                { t: "09:14:33.235", msg: "ALERT: NOTIFY subscribers [847]", c: NEON },
                { t: "09:14:33.240", msg: "BLOCK: #248,901,234 confirmed ✓", c: "#00aa00" },
                { t: "09:14:33.502", msg: "SCAN: next 1200 pending tx...", c: "#888888" },
                { t: "09:14:33.618", msg: "MEMPOOL: tx_sig=9mLp... detected", c: NEON },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: 8, lineHeight: 1.5 }}>
                  <span style={{ color: "#555", minWidth: 110, fontSize: 11 }}>{l.t}</span>
                  <span style={{ color: l.c }}>{l.msg}</span>
                </div>
              ))}
              <div style={{ color: NEON, animation: "blink 1s infinite" }}>█</div>
            </div>
          </div>
        </div>
      </section>

      {/* FREE EBOOK SECTION */}
      <section style={{ position: "relative", zIndex: 2, padding: "60px 5%", background: "#f9f9f9", borderBottom: `1px solid ${NEON}22` }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎁</div>
          <h2 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(20px, 2.5vw, 32px)", fontWeight: 900,
            color: "#111111", marginBottom: 16,
          }}>
            Dapatkan <span style={{ color: NEON, ...glowStyle }}>Free Ebook PDF</span>
          </h2>
          <p style={{ color: "#444444", fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
            <strong>"The On-Chain Edge"</strong> - Panduan Praktis 52 Halaman Mendeteksi Whale Solana agar Anda Berhenti Menjadi Exit Liquidity.
          </p>

          <div style={{
            background: "#ffffff", border: `1px solid ${NEON}44`,
            borderRadius: 16, padding: "32px 24px",
            boxShadow: `0 0 40px ${NEON}15`,
          }}>
            {successFree ? (
              <div style={{ background: 'rgba(0, 170, 85, 0.1)', border: `1px solid ${NEON}44`, padding: 24, borderRadius: 12 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                <strong style={{ display: 'block', color: NEON, fontSize: 18, marginBottom: 8 }}>Berhasil Terkirim!</strong>
                <span style={{ fontSize: 14, color: '#444', lineHeight: 1.5 }}>
                  Silahkan periksa WhatsApp Anda.<br />Ketik <strong>"Ya"</strong> jika Anda ingin menerima Free Ebook PDF ini.
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
                <div>
                  <label style={{ fontSize: 12, color: NEON, letterSpacing: 1, marginBottom: 6, display: 'block' }}>NAMA PANGGILAN</label>
                  <input
                    type="text" placeholder="John"
                    value={nameFree} onChange={(e) => setNameFree(e.target.value)}
                    style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.02)', border: `1px solid ${NEON}44`, borderRadius: 8, color: '#111', outline: 'none', fontFamily: "'Share Tech Mono', monospace", fontSize: 15 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: NEON, letterSpacing: 1, marginBottom: 6, display: 'block' }}>NO. WHATSAPP (AKTIF)</label>
                  <div style={{ display: 'flex' }}>
                    <div style={{ background: 'rgba(0,0,0,0.05)', padding: '14px 16px', border: `1px solid ${NEON}44`, borderRight: 'none', borderRadius: '8px 0 0 8px', color: '#111', fontSize: 15 }}>+62</div>
                    <input
                      type="tel" placeholder="8123456xxx"
                      value={waFree} onChange={(e) => setWaFree(e.target.value)}
                      style={{ flex: 1, padding: '14px 16px', background: 'rgba(0,0,0,0.02)', border: `1px solid ${NEON}44`, borderRadius: '0 8px 8px 0', color: '#111', outline: 'none', fontFamily: "'Share Tech Mono', monospace", fontSize: 15 }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: NEON, letterSpacing: 1, marginBottom: 6, display: 'block' }}>EMAIL (UNTUK PDF)</label>
                  <input
                    type="email" placeholder="email@anda.com"
                    value={emailFree} onChange={(e) => setEmailFree(e.target.value)}
                    style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.02)', border: `1px solid ${NEON}44`, borderRadius: 8, color: '#111', outline: 'none', fontFamily: "'Share Tech Mono', monospace", fontSize: 15 }}
                  />
                </div>
                <button
                  onClick={submitFreeEbook}
                  disabled={loadingFree}
                  style={{
                    width: '100%', padding: '16px', marginTop: 8,
                    background: NEON, color: '#000', fontWeight: 900,
                    border: 'none', borderRadius: 8, cursor: 'pointer',
                    fontFamily: "'Orbitron', monospace", letterSpacing: 1, fontSize: 16,
                    boxShadow: `0 0 20px ${NEON}66`, transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {loadingFree ? 'MEMPROSES...' : 'KIRIM EBOOK GRATIS ⚡'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ position: "relative", zIndex: 2, padding: "90px 5%" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: NEON, letterSpacing: 4, marginBottom: 16 }}>// EARLY ACCESS</p>
          <h2 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(22px, 3vw, 40px)", fontWeight: 900,
            color: "#111111", marginBottom: 12,
          }}>
            Harga <span style={{ color: NEON, ...glowStyle }}>Naik Setelah Countdown</span>
          </h2>
          <p style={{ color: "#444444", fontSize: 15, marginBottom: 36 }}>Harga awal terbatas untuk 200 pengguna pertama saja.</p>

          <Countdown />

          <div style={{
            marginTop: 40,
            background: "linear-gradient(135deg, #f8f8f8, #ffffff)",
            border: `2px solid ${NEON}66`,
            borderRadius: 18, padding: "42px 40px",
            boxShadow: `0 0 60px ${NEON}22, inset 0 0 40px ${NEON}05`,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0,
              background: NEON, color: "#ffffff",
              fontSize: 11, fontWeight: 700,
              padding: "6px 18px", letterSpacing: 2,
              fontFamily: "'Orbitron', monospace",
            }}>BEST VALUE</div>

            <h3 style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 22, color: NEON, marginBottom: 8,
            }}>EARLY ACCESS PASS</h3>
            <div style={{ fontSize: 12, color: "#444444", letterSpacing: 3, marginBottom: 24 }}>LIFETIME — BAYAR SEKALI</div>

            <div style={{ fontSize: 56, fontWeight: 900, color: "#111111", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
              0.5 <span style={{ color: NEON, fontSize: 40 }}>SOL</span>
            </div>
            <div style={{ fontSize: 13, color: "#333333", marginBottom: 32 }}>≈ $75 USD · Harga normal 2 SOL</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32, textAlign: "left" }}>
              {[
                "✅ Whale Wallet Tracker",
                "✅ AI Smart Contract Auditor",
                "✅ Copy-Trade Alert (Telegram)",
                "✅ Social Sentiment Engine",
                "✅ 2,847+ Tracked Wallets",
                "✅ Sub-300ms Real-time Feed",
                "✅ Akses Lifetime",
                "✅ Private Alpha Community",
              ].map((f) => (
                <div key={f} style={{ fontSize: 14, color: "#444444" }}>{f}</div>
              ))}
            </div>

            <button style={{
              width: "100%",
              background: NEON, color: "#ffffff",
              border: "none", padding: "18px",
              fontSize: 18, fontWeight: 900,
              fontFamily: "'Orbitron', monospace",
              letterSpacing: 2, borderRadius: 8, cursor: "pointer",
              boxShadow: `0 0 30px ${NEON}88`,
              transition: "all 0.2s",
            }}
              onMouseEnter={(e: any) => { e.target.style.transform = "scale(1.02)"; e.target.style.boxShadow = `0 0 50px ${NEON}`; }}
              onMouseLeave={(e: any) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = `0 0 30px ${NEON}88`; }}
            >
              ⚡ CLAIM EARLY ACCESS — 0.5 SOL
            </button>
            <p style={{ fontSize: 12, color: "#333", marginTop: 14 }}>
              Pembayaran via Solana · 200 slot tersisa · No recurring fee
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        position: "relative", zIndex: 2,
        background: "#f9f9f9",
        borderTop: `1px solid ${NEON}22`,
        padding: "32px 5%",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ fontFamily: "'Orbitron', monospace", color: NEON, fontSize: 16, ...glowStyle }}>
          🐋 WHALE HUNTER
        </div>
        <div style={{ fontSize: 12, color: "#333", fontFamily: "'Share Tech Mono', monospace" }}>
          © 2025 ELVISION LABS · NOT FINANCIAL ADVICE · DYOR
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["TWITTER/X", "TELEGRAM", "DISCORD"].map((s) => (
            <a key={s} href="#" style={{ fontSize: 12, color: "#333333", textDecoration: "none", letterSpacing: 2 }}
              onMouseEnter={(e: any) => e.target.style.color = NEON}
              onMouseLeave={(e: any) => e.target.style.color = "#444"}
            >{s}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
