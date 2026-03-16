import { useState, useEffect, useRef } from "react";
import { supabase } from '@/integrations/supabase/client'; const STOCKS = [
  { id: "BBCA", val: 84, change: +2.1, x: 12, y: 15 },
  { id: "TLKM", val: 62, change: -1.3, x: 28, y: 8 },
  { id: "ASII", val: 71, change: +0.8, x: 45, y: 20 },
  { id: "BMRI", val: 89, change: +3.2, x: 60, y: 10 },
  { id: "BBRI", val: 78, change: +1.5, x: 75, y: 18 },
  { id: "GOTO", val: 34, change: -2.7, x: 18, y: 40 },
  { id: "BYAN", val: 92, change: +4.1, x: 35, y: 48 },
  { id: "UNVR", val: 55, change: -0.5, x: 52, y: 38 },
  { id: "SMGR", val: 67, change: +1.9, x: 68, y: 45 },
  { id: "INDF", val: 73, change: +0.3, x: 82, y: 35 },
  { id: "PGAS", val: 48, change: -1.8, x: 10, y: 65 },
  { id: "KLBF", val: 81, change: +2.6, x: 25, y: 72 },
  { id: "HMSP", val: 59, change: -3.1, x: 42, y: 60 },
  { id: "ICBP", val: 76, change: +1.1, x: 58, y: 68 },
  { id: "EXCL", val: 44, change: -0.9, x: 72, y: 62 },
  { id: "PTBA", val: 85, change: +3.7, x: 88, y: 70 },
  { id: "ADRO", val: 90, change: +2.8, x: 5, y: 82 },
  { id: "ANTM", val: 66, change: +0.7, x: 38, y: 85 },
  { id: "BRPT", val: 53, change: -1.4, x: 62, y: 80 },
  { id: "CPIN", val: 70, change: +1.3, x: 80, y: 88 },
];

function HeatmapCell({ stock, index }: any) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 2000 + index * 300);
    return () => clearInterval(t);
  }, [index]);

  const intensity = stock.val / 100;
  const isUp = stock.change > 0;
  const bg = isUp
    ? `rgba(0, 212, 255, ${0.15 + intensity * 0.35})`
    : `rgba(255, 60, 100, ${0.15 + (1 - intensity) * 0.35})`;
  const border = isUp ? "rgba(0,212,255,0.5)" : "rgba(255,60,100,0.4)";

  return (
    <div
      style={{
        position: "absolute",
        left: `${stock.x}%`,
        top: `${stock.y}%`,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 6,
        padding: "6px 10px",
        fontSize: 13,
        fontFamily: "'Space Mono', monospace",
        color: isUp ? "#0077cc" : "#cc2244",
        backdropFilter: "blur(8px)",
        boxShadow: pulse
          ? `0 0 18px ${isUp ? "#00d4ff" : "#ff3c64"}, 0 0 40px ${isUp ? "rgba(0,212,255,0.3)" : "rgba(255,60,100,0.3)"}`
          : `0 0 6px ${isUp ? "rgba(0,212,255,0.2)" : "rgba(255,60,100,0.1)"}`,
        transition: "box-shadow 0.3s ease",
        cursor: "default",
        zIndex: 2,
        whiteSpace: "nowrap",
        transform: pulse ? "scale(1.07)" : "scale(1)",
        transitionProperty: "box-shadow, transform",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14 }}>{stock.id}</div>
      <div style={{ fontSize: 11, opacity: 0.85 }}>
        {isUp ? "▲" : "▼"} {Math.abs(stock.change)}%
      </div>
    </div>
  );
}

function Heatmap() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 280,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(0,212,255,0.15)",
        background:
          "linear-gradient(135deg, rgba(0,8,30,0.95) 0%, rgba(0,15,50,0.9) 100%)",
        boxShadow: "0 0 60px rgba(0,212,255,0.08)",
      }}
    >
      {/* Grid lines */}
      {[20, 40, 60, 80].map((p) => (
        <div
          key={p}
          style={{
            position: "absolute",
            left: `${p}%`,
            top: 0,
            bottom: 0,
            borderLeft: "1px solid rgba(0,212,255,0.04)",
          }}
        />
      ))}
      {[25, 50, 75].map((p) => (
        <div
          key={p}
          style={{
            position: "absolute",
            top: `${p}%`,
            left: 0,
            right: 0,
            borderTop: "1px solid rgba(0,212,255,0.04)",
          }}
        />
      ))}
      {STOCKS.map((s, i) => (
        <HeatmapCell key={s.id} stock={s} index={i} />
      ))}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 16,
          fontSize: 11,
          color: "rgba(0,100,200,0.3)",
          fontFamily: "'Space Mono', monospace",
        }}
      >
        IDX LIVE FEED
      </div>
    </div>
  );
}

function ConglomerateNode({ x, y, label, size, color, pulse }: any) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={size + 6}
        fill="none"
        stroke={color}
        strokeOpacity={0.15}
      >
        {pulse && (
          <animate
            attributeName="r"
            values={`${size + 6};${size + 14};${size + 6}`}
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle cx={x} cy={y} r={size} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1.5} />
      <text x={x} y={y + 4} textAnchor="middle" fill={color} fontSize={10} fontFamily="'Space Mono', monospace" fontWeight="700">
        {label}
      </text>
    </g>
  );
}

function ConglomerateGraph() {
  const nodes = [
    { x: 250, y: 120, label: "SALIM", size: 38, color: "#00d4ff", pulse: true },
    { x: 130, y: 60, label: "INDF", size: 22, color: "#4de8ff" },
    { x: 100, y: 160, label: "ICBP", size: 20, color: "#4de8ff" },
    { x: 200, y: 200, label: "BRPT", size: 18, color: "#4de8ff" },
    { x: 330, y: 60, label: "BMRI", size: 24, color: "#4de8ff" },
    { x: 370, y: 170, label: "AALI", size: 16, color: "#4de8ff" },
    { x: 520, y: 120, label: "DJARUM", size: 36, color: "#a78bfa", pulse: true },
    { x: 620, y: 60, label: "BBCA", size: 28, color: "#c4b5fd" },
    { x: 640, y: 180, label: "MLBI", size: 18, color: "#c4b5fd" },
    { x: 560, y: 210, label: "HMSP", size: 20, color: "#c4b5fd" },
    { x: 385, y: 120, label: "LIPPO", size: 30, color: "#fb923c", pulse: true },
    { x: 420, y: 220, label: "LPKR", size: 17, color: "#fdba74" },
    { x: 300, y: 240, label: "MPPA", size: 15, color: "#fdba74" },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
    [6, 7], [6, 8], [6, 9],
    [10, 11], [10, 12], [0, 10], [10, 6],
  ];

  return (
    <div style={{ position: "relative", width: "100%", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,212,255,0.12)", background: "rgba(0,8,30,0.95)" }}>
      <svg width="100%" viewBox="0 0 750 280" style={{ display: "block" }}>
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="rgba(0,212,255,0.18)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}
        {nodes.map((n, i) => (
          <ConglomerateNode key={i} {...n} />
        ))}
      </svg>
    </div>
  );
}

const CHAT_REPLIES = {
  "bbca": "📊 Minggu ini, **Djarum Group** (via PT Central Asia Tbk holding) menambah 12,4 juta lembar BBCA. Dana asing Singapura juga mencatatkan net buy Rp 340M. Kepemilikan tersembunyi <5% naik dari 18.2% → 19.7%.",
  "default": "🤖 Menganalisis data KSEI & laporan MSCI... Ditemukan pergerakan signifikan pada saham yang Anda tanyakan. Whale detector menunjukkan akumulasi diam-diam sejak 3 hari lalu.",
};

function AIChatbot() {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "Halo! Saya AI Spotlight. Tanya saja: 'Siapa yang paling banyak borong BBCA minggu ini?' atau saham lainnya." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const lower = q.toLowerCase();
      const reply = lower.includes("bbca") ? CHAT_REPLIES.bbca : CHAT_REPLIES.default;
      setMsgs((m) => [...m, { role: "ai", text: reply }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{ background: "rgba(248,250,255,0.98)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,212,255,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00d4ff", boxShadow: "0 0 8px #00d4ff", animation: "pulse 1.5s infinite" }} />
        <span style={{ color: "#00d4ff", fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700 }}>AI SPOTLIGHT</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(0,212,255,0.4)", fontFamily: "'Space Mono', monospace" }}>LIVE</span>
      </div>
      <div style={{ height: 200, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%",
              padding: "10px 14px",
              borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              background: m.role === "user" ? "rgba(0,100,255,0.08)" : "rgba(0,0,0,0.03)",
              border: m.role === "user" ? "1px solid rgba(0,100,255,0.25)" : "1px solid rgba(0,0,0,0.06)",
              color: m.role === "user" ? "#0055cc" : "rgba(0,0,0,0.75)",
              fontSize: 13,
              lineHeight: 1.6,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 4, padding: "10px 14px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#00d4ff", opacity: 0.6, animation: `bounce 1s ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(0,212,255,0.1)", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Tanya soal saham apapun..."
          style={{
            flex: 1,
            background: "rgba(0,50,150,0.05)",
            border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: 8,
            padding: "8px 12px",
            color: "#0a0a1a",
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
          }}
        />
        <button
          onClick={send}
          style={{
            background: "linear-gradient(135deg, #00d4ff, #0066ff)",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            color: "#0a0a1a",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}

function PainCard({ icon, title, desc, delay }: any) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,60,100,0.06)" : "rgba(0,0,0,0.02)",
        border: `1px solid ${hovered ? "rgba(255,60,100,0.4)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: 16,
        padding: "28px 24px",
        backdropFilter: "blur(16px)",
        transition: "all 0.3s ease",
        boxShadow: hovered ? "0 0 30px rgba(255,60,100,0.1)" : "none",
        cursor: "default",
        animationDelay: `${delay}s`,
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
      <div style={{ color: "#ff3c64", fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
        {title}
      </div>
      <div style={{ color: "rgba(0,0,0,0.55)", fontSize: 15, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
        {desc}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, children }: any) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(0,100,255,0.06)" : "rgba(0,0,0,0.02)",
        border: `1px solid ${hovered ? "rgba(0,100,255,0.3)" : "rgba(0,0,0,0.07)"}`,
        borderRadius: 20,
        padding: "28px 24px",
        backdropFilter: "blur(20px)",
        transition: "all 0.3s ease",
        boxShadow: hovered ? "0 0 40px rgba(0,212,255,0.08)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 26 }}>{icon}</div>
        <div style={{ color: "#00d4ff", fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>
          {title}
        </div>
      </div>
      <div style={{ color: "rgba(0,0,0,0.55)", fontSize: 15, lineHeight: 1.7, marginBottom: children ? 20 : 0, fontFamily: "'DM Sans', sans-serif" }}>
        {desc}
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [count, setCount] = useState(73);
  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => (c > 40 ? c - 1 : c));
    }, 8000);
    return () => clearInterval(t);
  }, []);

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
      background: "#ffffff",
      minHeight: "100vh",
      color: "#0a0a1a",
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #00050f; }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.3); border-radius: 2px; }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.3); } }
        @keyframes bounce { 0%,80%,100% { transform:scale(0); } 40% { transform:scale(1); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow { 0%,100% { box-shadow:0 0 20px rgba(0,212,255,0.3); } 50% { box-shadow:0 0 50px rgba(0,212,255,0.6),0 0 80px rgba(0,212,255,0.2); } }
        @keyframes gridMove { from { transform:translateY(0); } to { transform:translateY(40px); } }
        @keyframes ticker { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        .hero-btn:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 0 60px rgba(0,212,255,0.5)!important; }
        .hero-btn { transition:all 0.25s ease; }
        input::placeholder { color:rgba(0,0,0,0.25); }
      `}</style>

      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,100,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,100,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        animation: "gridMove 8s linear infinite",
      }} />

      {/* Radial glow top */}
      <div style={{
        position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 600, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,100,255,0.12) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,100,255,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #00d4ff, #0066ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: "#0a0a1a",
            boxShadow: "0 0 16px rgba(0,212,255,0.5)",
          }}>V</div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
            <span style={{ color: "#00d4ff" }}>SAHAM</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            background: "transparent", border: "1px solid rgba(0,212,255,0.3)",
            borderRadius: 8, padding: "8px 20px", color: "#00d4ff",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>Masuk</button>
          <button style={{
            background: "linear-gradient(135deg, #00d4ff, #0066ff)",
            border: "none", borderRadius: 8, padding: "8px 20px", color: "#0a0a1a",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 0 20px rgba(0,212,255,0.3)",
          }}>Coba Gratis</button>
        </div>
      </nav>

      {/* TICKER */}
      <div style={{
        position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
        background: "rgba(255,255,255,0.95)", borderBottom: "1px solid rgba(0,100,255,0.08)",
        padding: "6px 0", overflow: "hidden",
      }}>
        <div style={{ display: "flex", animation: "ticker 30s linear infinite", width: "200%" }}>
          {[...STOCKS, ...STOCKS].map((s, i) => (
            <span key={i} style={{
              fontFamily: "'Space Mono', monospace", fontSize: 12, marginRight: 32,
              color: s.change > 0 ? "#00d4ff" : "#ff3c64", whiteSpace: "nowrap",
            }}>
              {s.id} {s.change > 0 ? "▲" : "▼"}{Math.abs(s.change)}%
            </span>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ─── HERO ─── */}
        <section style={{ minHeight: "100vh", paddingTop: 140, paddingBottom: 80, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "140px 24px 80px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)",
            borderRadius: 50, padding: "6px 16px", marginBottom: 32,
            animation: "fadeUp 0.8s ease both",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4ff", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#00d4ff", letterSpacing: 1 }}>
              POWERED BY ELVISION AI LOGIC
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 68px)",
            fontWeight: 800, lineHeight: 1.1, marginBottom: 24,
            fontFamily: "'DM Sans', sans-serif",
            animation: "fadeUp 0.9s 0.1s ease both",
            maxWidth: 800,
          }}>
            Bongkar Rahasia{" "}
            <span style={{
              background: "linear-gradient(135deg, #00d4ff, #0066ff)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Bandar & Konglomerat</span>
            {" "}IDX dalam 1 Klik.
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(0,0,0,0.55)",
            maxWidth: 660, lineHeight: 1.75, marginBottom: 40,
            animation: "fadeUp 1s 0.2s ease both",
          }}>
            Akses data kepemilikan saham KSEI di bawah 5% yang sengaja disembunyikan dari publik. Deteksi pergerakan <span style={{ color: "#0055cc", fontWeight: 600 }}>"Whale"</span> sebelum harga meroket menggunakan AI Intelligence.
          </p>

          <button className="hero-btn" style={{
            background: "linear-gradient(135deg, #00d4ff, #0066ff)",
            border: "none", borderRadius: 12, padding: "18px 40px",
            color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 0 40px rgba(0,212,255,0.35)",
            animation: "fadeUp 1s 0.3s ease both, glow 3s 1s ease infinite",
            marginBottom: 48,
          }}>
            ⚡ Mulai Analisis Sekarang (Gratis)
          </button>

          <div style={{ width: "100%", maxWidth: 820, animation: "fadeUp 1.1s 0.4s ease both" }}>
            <Heatmap />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, padding: "0 12px", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 24, fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#00d4ff" }}>
                <div><strong style={{ fontSize: 18 }}>955</strong> Tickers</div>
                <div><strong style={{ fontSize: 18 }}>5,270</strong> Investors</div>
              </div>
              <div style={{ display: "flex", gap: 16, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00d4ff" }}></div>
                  <strong style={{ color: "#00aaff" }}>57.3%</strong> Local
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff3c64" }}></div>
                  <strong style={{ color: "#cc2244" }}>42.7%</strong> Foreign
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── MARKET OVERVIEW CATEGORIES ─── */}
        <section style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16,
            fontFamily: "'DM Sans', sans-serif"
          }}>
            {[
              { label: "Corporate", id: "CP", count: "2,305", color: "#00d4ff", bg: "rgba(0,212,255,0.08)" },
              { label: "Individual", id: "ID", count: "2,147", color: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
              { label: "Investment Bank", id: "IB", count: "138", color: "#fb923c", bg: "rgba(251,146,60,0.08)" },
              { label: "Mutual Fund", id: "MF", count: "136", color: "#4ade80", bg: "rgba(74,222,128,0.08)" },
            ].map(item => (
              <div key={item.id} style={{
                background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 16, padding: "20px", display: "flex", alignItems: "center", gap: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
              }}>
                <div style={{
                  background: item.bg, color: item.color, width: 44, height: 44,
                  borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 16
                }}>
                  {item.id}
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>{item.count}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── INSTANT SEARCH & LEADERBOARDS ─── */}
        <section style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
          <div style={{
            background: "rgba(0,100,255,0.03)", border: "1px solid rgba(0,100,255,0.15)",
            borderRadius: 20, padding: 32, backdropFilter: "blur(12px)", marginBottom: 40
          }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>🔍</span> Instant Search
            </h3>
            <div style={{
              display: "flex", alignItems: "center", background: "#fff",
              border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: "16px 24px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.05)"
            }}>
              <span style={{ fontSize: 20, color: "rgba(0,0,0,0.3)", marginRight: 16 }}>🔎</span>
              <input
                placeholder="Search ticker or investor name (e.g., Lo Kheng Hong, BBCA)..."
                style={{ flex: 1, border: "none", outline: "none", fontSize: 16, fontFamily: "'DM Sans', sans-serif" }}
              />
              <button style={{
                background: "rgba(0,100,255,0.1)", color: "#0055cc", border: "none",
                padding: "8px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Space Mono', monospace", fontSize: 13
              }}>Enter ↵</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            <div style={{
              background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16,
              padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                🔥 Hot Searches
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: "'Space Mono', monospace", fontSize: 13 }}>
                {[
                  { rank: 1, name: "ANDRY HAKIM", count: "1,308" },
                  { rank: 2, name: "GOVT OF NORWAY", count: "969" },
                  { rank: 3, name: "BBCA", count: "745" },
                  { rank: 4, name: "LO KHENG HONG", count: "632" },
                ].map((item) => (
                  <div key={item.rank} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px dashed rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: "rgba(0,0,0,0.3)", fontWeight: 700 }}>{item.rank}</span>
                      <strong style={{ color: "#0055cc" }}>{item.name}</strong>
                    </div>
                    <span style={{ color: "rgba(0,0,0,0.5)" }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16,
              padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                🌏 Top Foreign Investors
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                {[
                  { name: "UOB KAY HIAN PTE LTD", pos: "65 pos" },
                  { name: "BANK OF SINGAPORE LTD", pos: "37 pos" },
                  { name: "UBS AG SINGAPORE", pos: "27 pos" },
                  { name: "DBS BANK LTD.", pos: "25 pos" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px dashed rgba(0,0,0,0.05)" }}>
                    <strong style={{ color: "#333" }}>{item.name}</strong>
                    <span style={{ color: "#00d4ff", fontWeight: 700, fontFamily: "'Space Mono', monospace", fontSize: 12 }}>{item.pos}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── PAIN ─── */}
        <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", color: "#ff3c64", fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>
              MASALAH YANG ANDA HADAPI
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 800, maxWidth: 600, margin: "0 auto", lineHeight: 1.2 }}>
              Kenapa Anda Selalu{" "}
              <span style={{ color: "#ff3c64" }}>Ketinggalan?</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <PainCard icon="🙈" title="DATA BUTA" delay={0}
              desc="Laporan publik hanya menampilkan kepemilikan >5%. Siapa yang pegang sisanya? Mereka bergerak diam-diam — dan Anda tidak tahu." />
            <PainCard icon="⏳" title="INFORMASI TERLAMBAT" delay={0.1}
              desc="Saat berita muncul di portal, harga sudah terlanjur naik 8-15%. Anda beli di puncak, mereka sudah profit taking." />
            <PainCard icon="🕸️" title="GRUP BISNIS RUMIT" delay={0.2}
              desc="Bingung hubungan antar anak perusahaan konglomerat besar? Satu keputusan di induk bisa mengguncang 12 saham berbeda." />
          </div>
        </section>

        {/* ─── SOLUTION ─── */}
        <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", color: "#00d4ff", fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>
              SOLUSI KAMI
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 800, maxWidth: 700, margin: "0 auto", lineHeight: 1.2 }}>
              Fitur{" "}
              <span style={{ background: "linear-gradient(135deg, #00d4ff, #0066ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Intelligence
              </span>{" "}
              Kelas Institusi
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <FeatureCard icon="🕸️" title="CONGLOMERATE GRAPH"
              desc="Visualisasi jaring laba-laba hubungan Salim, Lippo, hingga Djarum Group. Lihat siapa yang mengendalikan siapa dalam hitungan detik.">
              <ConglomerateGraph />
            </FeatureCard>

            <FeatureCard icon="🤖" title="AI SPOTLIGHT"
              desc="Chatbot AI yang bisa menjawab 'Siapa yang paling banyak borong BBCA minggu ini?' — dengan data KSEI real-time.">
              <AIChatbot />
            </FeatureCard>

            <FeatureCard icon="🔬" title="MSCI FLOAT SCREENER"
              desc="Filter saham yang benar-benar likuid untuk institusi asing. Bukan saham 'gorengan' yang mudah dimanipulasi bandar kecil." />
          </div>

          {/* ─── DATA TABLES MOCKUP ─── */}
          <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 48 }}>

            {/* Mutual Fund Table */}
            <div style={{
              background: "#fff", border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 20, padding: 32, boxShadow: "0 10px 40px rgba(0,0,0,0.04)"
            }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Track Mutual Fund Portfolios</h3>
              <p style={{ color: "rgba(0,0,0,0.5)", marginBottom: 24 }}>See exactly which stocks Indonesia’s top reksa dana are holding — and their biggest bets.</p>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.4)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                      <th style={{ padding: "12px 0", textAlign: "left" }}>INVESTOR</th>
                      <th style={{ padding: "12px 0", textAlign: "center" }}>NAT.</th>
                      <th style={{ padding: "12px 0", textAlign: "center" }}>POS</th>
                      <th style={{ padding: "12px 0", textAlign: "right" }}>TOP HOLDING</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "FIDELITY FUNDS", nat: "F", pos: 18, hold: "DUCK 9.88 %" },
                      { name: "REKSA DANA EMCO MANTAP", nat: "L", pos: 15, hold: "HOME 4.10 %" },
                      { name: "SUCORINVEST EQUITY PRIMA", nat: "L", pos: 14, hold: "CSMI 4.91 %" },
                      { name: "PAN ARCADIA SAHAM BERTUMBUH", nat: "L", pos: 12, hold: "DPUM 4.56 %" }
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                        <td style={{ padding: "16px 0", fontWeight: 700, color: "#111" }}>{row.name}</td>
                        <td style={{ padding: "16px 0", textAlign: "center" }}>
                          <span style={{
                            background: row.nat === "F" ? "rgba(255,60,100,0.1)" : "rgba(0,212,255,0.1)",
                            color: row.nat === "F" ? "#cc2244" : "#0077cc",
                            padding: "4px 8px", borderRadius: 4, fontWeight: 700, fontSize: 12
                          }}>{row.nat}</span>
                        </td>
                        <td style={{ padding: "16px 0", textAlign: "center", fontWeight: 700 }}>{row.pos}</td>
                        <td style={{ padding: "16px 0", textAlign: "right", color: "#0055cc", fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>{row.hold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <a href="#pricing" style={{ color: "#00d4ff", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>+ 132 more funds inside →</a>
              </div>
            </div>

            {/* Float Screener Table */}
            <div style={{
              background: "#fff", border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 20, padding: 32, boxShadow: "0 10px 40px rgba(0,0,0,0.04)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <h3 style={{ fontSize: 22, fontWeight: 800 }}>Screen by Free Float</h3>
                <span style={{ background: "#ff3c64", color: "#fff", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>NEW</span>
              </div>
              <p style={{ color: "rgba(0,0,0,0.5)", marginBottom: 24 }}>Find tightly held stocks, low liquidity plays, and high-float blue chips — all 955 tickers screened.</p>

              <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                {["Low Float (<5%)", "Below 15%", "Mid Float", "High Float", "All 955"].map((tag, i) => (
                  <span key={i} style={{
                    background: i === 0 ? "rgba(0,100,255,0.1)" : "rgba(0,0,0,0.04)",
                    color: i === 0 ? "#0055cc" : "rgba(0,0,0,0.6)",
                    padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    border: i === 0 ? "1px solid rgba(0,100,255,0.2)" : "1px solid transparent"
                  }}>{tag}</span>
                ))}
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.4)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                      <th style={{ padding: "12px 0", textAlign: "left" }}>TICKER</th>
                      <th style={{ padding: "12px 0", textAlign: "left" }}>TOP HOLDER ({'>'}1%)</th>
                      <th style={{ padding: "12px 0", textAlign: "right" }}>TOTAL HELD</th>
                      <th style={{ padding: "12px 0", textAlign: "right" }}>EST. FREE FLOAT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: "DCII", h: "PT DCI INDONESIA", tot: "99.8%", est: "0.20% ⚠️" },
                      { t: "GIAA", h: "PT DANANTARA ASSET", tot: "96.0%", est: "4.02% ⚠️" },
                      { t: "ITMG", h: "BANPU PUBLIC CO LTD", tot: "67.1%", est: "32.9%" },
                      { t: "BBRI", h: "PT DANANTARA ASSET", tot: "58.5%", est: "41.5%" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                        <td style={{ padding: "16px 0", fontWeight: 700, color: "#0055cc", fontFamily: "'Space Mono', monospace" }}>{row.t}</td>
                        <td style={{ padding: "16px 0", color: "#333", fontWeight: 500 }}>{row.h}</td>
                        <td style={{ padding: "16px 0", textAlign: "right", fontWeight: 700, color: "rgba(0,0,0,0.6)" }}>{row.tot}</td>
                        <td style={{ padding: "16px 0", textAlign: "right", color: row.est.includes("⚠️") ? "#ff3c64" : "#111", fontWeight: 800 }}>{row.est}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sample Data Deep Ownership Table */}
            <div style={{
              background: "#fff", border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 20, padding: 32, boxShadow: "0 10px 40px rgba(0,0,0,0.04)"
            }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Sample Data: Hidden Holdings</h3>
              <p style={{ color: "rgba(0,0,0,0.5)", marginBottom: 24 }}>Positions between 1-2% that aren’t in public filings (e.g. Lo Kheng Hong).</p>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.4)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                      <th style={{ padding: "12px 0", textAlign: "left" }}>TICKER</th>
                      <th style={{ padding: "12px 0", textAlign: "left" }}>INVESTOR</th>
                      <th style={{ padding: "12px 0", textAlign: "center" }}>TYPE</th>
                      <th style={{ padding: "12px 0", textAlign: "center" }}>L/F</th>
                      <th style={{ padding: "12px 0", textAlign: "right" }}>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: "CFIN", inv: "LO KHENG HONG", type: "ID", lf: "L", pct: "1.58%" },
                      { t: "ADMG", inv: "LO KHENG HONG", type: "ID", lf: "L", pct: "1.29%" },
                      { t: "MAIN", inv: "LO KHENG HONG", type: "ID", lf: "L", pct: "1.24%" },
                      { t: "MPMX", inv: "GOVT OF NORWAY", type: "CP", lf: "F", pct: "1.03%" },
                      { t: "TINS", inv: "GOVT OF NORWAY", type: "CP", lf: "F", pct: "1.11%" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                        <td style={{ padding: "16px 0", fontWeight: 700, color: "#0055cc", fontFamily: "'Space Mono', monospace" }}>{row.t}</td>
                        <td style={{ padding: "16px 0", color: "#111", fontWeight: 700 }}>{row.inv}</td>
                        <td style={{ padding: "16px 0", textAlign: "center", color: "rgba(0,0,0,0.5)", fontWeight: 700 }}>{row.type}</td>
                        <td style={{ padding: "16px 0", textAlign: "center" }}>
                          <span style={{
                            background: row.lf === "F" ? "rgba(255,60,100,0.1)" : "rgba(0,212,255,0.1)",
                            color: row.lf === "F" ? "#cc2244" : "#0077cc",
                            padding: "4px 8px", borderRadius: 4, fontWeight: 700, fontSize: 12
                          }}>{row.lf}</span>
                        </td>
                        <td style={{ padding: "16px 0", textAlign: "right", color: "#111", fontWeight: 800, fontFamily: "'Space Mono', monospace" }}>{row.pct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <a href="#pricing" style={{
                  display: "inline-block", background: "linear-gradient(135deg, #00d4ff, #0066ff)", color: "#fff",
                  padding: "12px 32px", borderRadius: 30, textDecoration: "none", fontWeight: 700,
                  boxShadow: "0 4px 20px rgba(0,212,255,0.3)"
                }}>Unlock All 955 Tickers →</a>
              </div>
            </div>

          </div>
        </section>

        {/* ─── METHOD ─── */}
        <section style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", color: "#a78bfa", fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>
            BAGAIMANA INI BEKERJA
          </div>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 800, marginBottom: 24, lineHeight: 1.2 }}>
            Powered by{" "}
            <span style={{ background: "linear-gradient(135deg, #a78bfa, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Elvision AI Logic
            </span>
          </h2>
          <p style={{ color: "rgba(0,0,0,0.55)", fontSize: 17, lineHeight: 1.8, marginBottom: 56, maxWidth: 680, margin: "0 auto 56px" }}>
            Sistem kami secara otomatis men-scrape ribuan PDF laporan bulanan dari KSEI, OJK, dan sumber regulasi. AI memproses dan memetakan relasi kepemilikan tersembunyi untuk menyajikan data paling akurat yang tidak tersedia di tempat lain.
          </p>

          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0 }}>
            {[
              { step: "01", title: "Scraping Otomatis", desc: "Ribuan PDF KSEI & OJK diproses setiap hari", icon: "📥" },
              { step: "02", title: "AI Processing", desc: "Elvision AI mengekstrak & memetakan relasi", icon: "🧠" },
              { step: "03", title: "Whale Detection", desc: "Algoritma mendeteksi akumulasi tersembunyi", icon: "🔍" },
              { step: "04", title: "Alert Real-time", desc: "Anda mendapat sinyal sebelum pasar bergerak", icon: "⚡" },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  background: "rgba(0,50,150,0.04)",
                  border: "1px solid rgba(0,212,255,0.15)",
                  borderRadius: 16, padding: "24px 20px", textAlign: "center",
                  width: 160, backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(0,212,255,0.4)", marginBottom: 4 }}>{s.step}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ padding: "0 8px", color: "rgba(0,100,200,0.3)", fontSize: 20 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── FREE EBOOK SECTION ─── */}
        <section style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(0,212,255,0.05), rgba(0,102,255,0.05))",
            border: "1px solid rgba(0,212,255,0.25)",
            borderRadius: 24, padding: "56px 48px", textAlign: "center",
            maxWidth: 600, width: "100%", margin: "0 auto",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 60px rgba(0,212,255,0.08)",
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📖</div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
              Dapatkan <span style={{ color: "#00d4ff" }}>Free Ebook PDF</span>
            </h2>
            <p style={{ color: "rgba(0,0,0,0.6)", fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
              <strong>"The Insider's Blueprint"</strong> - Cara Membaca Jejak Uang Bandar di IHSG dan Berhenti Membeli Saham Pucuk.
            </p>
            <div style={{ padding: "16px", background: "rgba(0,100,255,0.05)", borderRadius: 12, border: "1px solid rgba(0,212,255,0.15)", marginBottom: 32, textAlign: "left" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#00d4ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👨‍💼</div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>👤 Ditulis oleh: El Reyzandra</h4>
                  <p style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", fontFamily: "'Space Mono', monospace" }}>Founder El Vision Group</p>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "rgba(0,0,0,0.7)", lineHeight: 1.6, marginBottom: 12 }}>
                Motivator bisnis & mentor yang telah membantu ratusan pengusaha muda sukses. Metodologi analisis data institusi ini telah diliput luas oleh media nasional.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 12 }}>
                <a href="https://www.liputan6.com/showbiz/read/5134307/selebgram-el-reyzandra-dalami-profesi-motivator-bisnis-bantu-sukseskan-ratusan-pengusaha-pemula" target="_blank" rel="noopener noreferrer" style={{ color: "#0055cc", textDecoration: "none", background: "rgba(0,85,204,0.1)", padding: "4px 8px", borderRadius: 4, fontWeight: 700 }}>Baca di Liputan6 ↗</a>
                <a href="https://cirebon.inews.id/read/204537/ini-sosok-el-reyzandra-mentor-bisnis-yang-sukseskan-ratusan-pengusaha-muda/2" target="_blank" rel="noopener noreferrer" style={{ color: "#0055cc", textDecoration: "none", background: "rgba(0,85,204,0.1)", padding: "4px 8px", borderRadius: 4, fontWeight: 700 }}>Liputan iNews ↗</a>
              </div>
            </div>

            {successFree ? (
              <div style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0,212,255,0.3)', padding: 24, borderRadius: 12 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                <strong style={{ display: 'block', color: '#00d4ff', fontSize: 18, marginBottom: 8 }}>Ebook Sedang Dikirim!</strong>
                <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.7)', lineHeight: 1.5 }}>
                  Silahkan periksa WhatsApp Anda.<br />Ketik <strong>"Ya"</strong> jika Anda ingin menerima PDF ini.
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
                <div>
                  <label style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)', fontWeight: 700, marginBottom: 6, display: 'block' }}>NAMA PANGGILAN</label>
                  <input
                    type="text" placeholder="John"
                    value={nameFree} onChange={(e) => setNameFree(e.target.value)}
                    style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 12, outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)', fontWeight: 700, marginBottom: 6, display: 'block' }}>NO. WHATSAPP (AKTIF)</label>
                  <div style={{ display: 'flex' }}>
                    <div style={{ background: 'rgba(0,212,255,0.1)', padding: '16px', border: '1px solid rgba(0,212,255,0.3)', borderRight: 'none', borderRadius: '12px 0 0 12px', color: '#0077cc', fontWeight: 700, fontSize: 15 }}>+62</div>
                    <input
                      type="tel" placeholder="8123456xxx"
                      value={waFree} onChange={(e) => setWaFree(e.target.value)}
                      style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '0 12px 12px 0', outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)', fontWeight: 700, marginBottom: 6, display: 'block' }}>EMAIL AKTIF</label>
                  <input
                    type="email" placeholder="email@anda.com"
                    value={emailFree} onChange={(e) => setEmailFree(e.target.value)}
                    style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 12, outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}
                  />
                </div>
                <button
                  onClick={submitFreeEbook}
                  disabled={loadingFree}
                  style={{
                    width: '100%', padding: '18px', marginTop: 12,
                    background: "linear-gradient(135deg, #00d4ff, #0066ff)", color: '#fff', fontWeight: 800,
                    border: 'none', borderRadius: 12, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 16,
                    boxShadow: "0 0 30px rgba(0,212,255,0.3)", transition: "transform 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,212,255,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(0,212,255,0.3)"; }}
                >
                  {loadingFree ? 'MEMPROSES...' : 'KIRIM EBOOK GRATIS SEKARANG'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ─── PRICING ─── */}
        <section style={{ padding: "80px 24px 120px", display: "flex", justifyContent: "center" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(0,80,200,0.06), rgba(0,40,120,0.1))",
            border: "1px solid rgba(0,212,255,0.25)",
            borderRadius: 24, padding: "56px 48px", textAlign: "center",
            maxWidth: 520, width: "100%",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 80px rgba(0,212,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}>
            <div style={{
              display: "inline-block",
              background: "rgba(255,180,0,0.1)", border: "1px solid rgba(255,180,0,0.4)",
              borderRadius: 50, padding: "6px 16px", marginBottom: 20,
              fontFamily: "'Space Mono', monospace", fontSize: 12,
              color: "#fbbf24", letterSpacing: 1,
              animation: "pulse 2s infinite",
            }}>
              ⚠️ HANYA {count} SLOT TERSISA
            </div>

            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Lifetime Access</h2>
            <div style={{ color: "rgba(0,0,0,0.38)", fontSize: 16, marginBottom: 24, textDecoration: "line-through" }}>
              Rp 999.000 / tahun
            </div>

            <div style={{
              fontSize: 64, fontWeight: 900, lineHeight: 1,
              background: "linear-gradient(135deg, #00d4ff, #0066ff)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: 8,
            }}>
              Rp199.000
            </div>
            <div style={{ color: "rgba(0,0,0,0.38)", fontSize: 14, marginBottom: 36 }}>
              Bayar sekali, akses selamanya
            </div>

            <div style={{ textAlign: "left", marginBottom: 36, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Conglomerate Graph — semua konglomerat IDX",
                "AI Spotlight Chatbot — tanya apapun soal saham",
                "MSCI Float Screener — filter likuiditas real",
                "KSEI Hidden Ownership — data <5% tersembunyi",
                "Whale Alert — notifikasi akumulasi besar",
                "Update selamanya — tidak ada biaya tambahan",
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "rgba(0,0,0,0.75)" }}>
                  <span style={{ color: "#00d4ff", fontSize: 16 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>

            <button className="hero-btn" style={{
              width: "100%",
              background: "linear-gradient(135deg, #00d4ff, #0066ff)",
              border: "none", borderRadius: 12, padding: "18px",
              color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 0 40px rgba(0,212,255,0.35)",
            }}>
              🔓 Dapatkan Akses Sekarang
            </button>
            <p style={{ marginTop: 14, fontSize: 13, color: "rgba(0,0,0,0.32)" }}>
              Pembayaran aman via Midtrans • Refund 7 hari
            </p>
          </div>
        </section>
      </div >

      {/* FOOTER */}
      < footer style={{
        borderTop: "1px solid rgba(0,212,255,0.08)",
        padding: "32px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
        background: "rgba(248,250,255,0.9)",
      }
      }>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700 }}>
          <span style={{ color: "#00d4ff" }}>SAHAM</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(0,0,0,0.28)" }}>
          © 2025 VersiSaham. Data bersumber dari KSEI & laporan publik IDX.
        </div>
      </footer >
    </div >
  );
}
