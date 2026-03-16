"use client";

import { useEffect, useRef, useState } from "react";

const TAGLINES = [
  "Membangun Masa Depan dengan Kecerdasan Buatan",
  "Building Tomorrow Through Artificial Intelligence",
  "Mengintegrasikan AI ke Dalam Setiap Dimensi Bisnis",
  "Where Human Vision Meets Machine Intelligence",
];

export default function AIeLVisionPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const current = TAGLINES[taglineIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && charIndex <= current.length) {
      setDisplayText(current.slice(0, charIndex));
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 45);
    } else if (!isDeleting && charIndex > current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2400);
    } else if (isDeleting && charIndex > 0) {
      setDisplayText(current.slice(0, charIndex));
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 20);
    } else {
      setIsDeleting(false);
      setTaglineIndex((i) => (i + 1) % TAGLINES.length);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, taglineIndex]);

  // Neural network canvas — blue/violet palette
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const NODE_COUNT = 80;
    type Node = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; phase: number; colorShift: number;
    };

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      r: Math.random() * 2 + 0.8,
      phase: Math.random() * Math.PI * 2,
      colorShift: Math.random(),
    }));

    let t = 0;
    const lerp = (a: number, b: number, v: number) => a + (b - a) * v;

    const draw = () => {
      t += 0.007;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.save();
      ctx.strokeStyle = "rgba(80, 140, 255, 0.045)";
      ctx.lineWidth = 0.6;
      const gSize = 90;
      const drift = (t * 14) % gSize;
      for (let x = -gSize; x < canvas.width + gSize; x += gSize) {
        ctx.beginPath(); ctx.moveTo(x + drift * 0.5, 0); ctx.lineTo(x + drift * 0.5, canvas.height); ctx.stroke();
      }
      for (let y = -gSize; y < canvas.height + gSize; y += gSize) {
        ctx.beginPath(); ctx.moveTo(0, y + drift * 0.25); ctx.lineTo(canvas.width, y + drift * 0.25); ctx.stroke();
      }
      ctx.restore();

      // Connections
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.25;
            const pulse = Math.sin(t * 1.6 + nodes[i].phase) * 0.5 + 0.5;
            const cs = (nodes[i].colorShift + nodes[j].colorShift) / 2;
            const r = Math.round(lerp(40, 130, cs));
            const g = Math.round(lerp(120, 60, cs));
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r},${g},255,${alpha * pulse})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        const glow = Math.sin(t * 2.0 + node.phase) * 0.5 + 0.5;
        const cs = node.colorShift;
        const r = Math.round(lerp(30, 160, cs));
        const g = Math.round(lerp(140, 80, cs));

        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 6);
        grad.addColorStop(0, `rgba(${r},${g},255,${0.9 * glow})`);
        grad.addColorStop(1, `rgba(${r},${g},255,0)`);
        ctx.beginPath(); ctx.fillStyle = grad;
        ctx.arc(node.x, node.y, node.r * 6, 0, Math.PI * 2); ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(200,220,255,${0.6 + glow * 0.4})`;
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2); ctx.fill();
      }

      // Scan sweep
      const scanY = ((Math.sin(t * 0.35) + 1) / 2) * canvas.height;
      const sg = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80);
      sg.addColorStop(0, "rgba(80,140,255,0)");
      sg.addColorStop(0.5, "rgba(80,140,255,0.06)");
      sg.addColorStop(1, "rgba(80,140,255,0)");
      ctx.fillStyle = sg; ctx.fillRect(0, scanY - 80, canvas.width, 160);

      // Data streaks
      if (Math.sin(t * 7.3) > 0.97) {
        const sx = Math.random() * canvas.width;
        const streakGrad = ctx.createLinearGradient(sx, 0, sx + 1, canvas.height);
        streakGrad.addColorStop(0, "rgba(100,160,255,0)");
        streakGrad.addColorStop(0.45, "rgba(160,200,255,0.18)");
        streakGrad.addColorStop(1, "rgba(100,160,255,0)");
        ctx.fillStyle = streakGrad;
        ctx.fillRect(sx, 0, 1, canvas.height);
      }

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div style={styles.root}>
      <div style={styles.bgBase} />
      <div style={styles.bgGlowCenter} />
      <div style={styles.bgGlowLeft} />
      <div style={styles.bgGlowRight} />
      <canvas ref={canvasRef} style={styles.canvas} />
      <div style={styles.noise} />
      <div style={styles.vignette} />

      <div style={styles.content}>

        {/* Status badge */}
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          <span style={styles.badgeText}>SYSTEM ONLINE · AI INTEGRATION ACTIVE</span>
          <span style={styles.badgeSep}>|</span>
          <span style={styles.badgeVer}>v4.1.0</span>
        </div>

        {/* Eyebrow */}
        <div style={styles.eyebrow}>◈ &nbsp; ARTIFICIAL INTELLIGENT INTEGRATION DIVISION &nbsp; ◈</div>

        {/* Main title */}
        <div style={styles.titleWrap}>
          <h1 style={styles.mainTitle}>
            <span style={styles.titleAI}>AI</span>
            <span style={styles.titleEL}>&nbsp;eL&nbsp;</span>
            <span style={styles.titleVision}>Vision</span>
          </h1>
          <div style={styles.titleBar}>
            <div style={styles.titleBarShimmer} />
          </div>
        </div>

        {/* Typewriter */}
        <div style={styles.taglineWrap}>
          <span style={styles.tagline}>
            {displayText}
            <span style={styles.cursor}>▋</span>
          </span>
        </div>

        {/* Rule */}
        <div style={styles.rule}>
          <div style={styles.ruleLine} />
          <div style={styles.ruleDiamond} />
          <div style={styles.ruleLine} />
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { val: "99.4%", id: "Akurasi Model", en: "Model Accuracy" },
            { val: "200+", id: "Klien Aktif", en: "Active Clients" },
            { val: "1.2M", id: "Proses / Detik", en: "Processes / Sec" },
            { val: "99.9%", id: "Uptime Sistem", en: "System Uptime" },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statVal}>{s.val}</div>
              <div style={styles.statId}>{s.id}</div>
              <div style={styles.statEn}>{s.en}</div>
            </div>
          ))}
        </div>

        {/* Modules */}
        <div style={styles.modules}>
          {[
            { icon: "◈", name: "Neural Core", desc: "Pemrosesan Data Cerdas" },
            { icon: "⬡", name: "Vision Engine", desc: "Computer Vision & Analysis" },
            { icon: "◎", name: "Language AI", desc: "NLP & Generative Model" },
            { icon: "⬟", name: "Automation", desc: "Otomasi Proses Bisnis" },
            { icon: "◉", name: "Integration", desc: "Koneksi Sistem Enterprise" },
          ].map((m, i) => (
            <div key={i} style={{ ...styles.modCard, animationDelay: `${0.6 + i * 0.1}s` }}>
              <span style={styles.modIcon}>{m.icon}</span>
              <span style={styles.modName}>{m.name}</span>
              <span style={styles.modDesc}>{m.desc}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>
            © {new Date().getFullYear()} AI eL Vision &nbsp;·&nbsp; Artificial Intelligent Integration Division &nbsp;·&nbsp; <em>The Future is Integrated</em>
          </span>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { background-color: #04060f; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.5)} }
        @keyframes ringPulse {
          0%{box-shadow:0 0 0 0 rgba(100,160,255,0.5)}
          70%{box-shadow:0 0 0 9px rgba(100,160,255,0)}
          100%{box-shadow:0 0 0 0 rgba(100,160,255,0)}
        }
        @keyframes barSlide {
          from{transform:scaleX(0);opacity:0}
          to{transform:scaleX(1);opacity:1}
        }
        @keyframes shimmer {
          0%{background-position:200% center}
          100%{background-position:-200% center}
        }
        @keyframes cardIn {
          from{opacity:0;transform:translateY(18px) scale(0.96)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    background: "#04060f",
    overflow: "hidden",
    fontFamily: "'Rajdhani', sans-serif",
    color: "#ffffff",
  },
  bgBase: {
    position: "fixed", inset: 0,
    background: "linear-gradient(160deg, #060a22 0%, #04060f 45%, #08041e 100%)",
    zIndex: 0,
  },
  bgGlowCenter: {
    position: "fixed", left: "50%", top: "38%",
    transform: "translate(-50%,-50%)",
    width: "72vw", height: "72vw", borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(40,80,220,0.18) 0%, transparent 65%)",
    zIndex: 0, pointerEvents: "none",
  },
  bgGlowLeft: {
    position: "fixed", left: "-10%", top: "10%",
    width: "48vw", height: "48vw", borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(100,60,255,0.1) 0%, transparent 70%)",
    zIndex: 0, pointerEvents: "none",
  },
  bgGlowRight: {
    position: "fixed", right: "-12%", bottom: "5%",
    width: "44vw", height: "44vw", borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(30,120,255,0.1) 0%, transparent 70%)",
    zIndex: 0, pointerEvents: "none",
  },
  canvas: {
    position: "fixed", inset: 0, width: "100%", height: "100%",
    zIndex: 1, pointerEvents: "none",
  },
  noise: {
    position: "fixed", inset: 0, zIndex: 2,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat", opacity: 0.45, pointerEvents: "none",
  },
  vignette: {
    position: "fixed", inset: 0, zIndex: 2,
    background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(2,4,15,0.72) 100%)",
    pointerEvents: "none",
  },
  content: {
    position: "relative", zIndex: 3,
    minHeight: "100vh",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "60px 32px", gap: "28px",
  },

  // Badge
  badge: {
    display: "flex", alignItems: "center", gap: "10px",
    border: "1px solid rgba(91,159,255,0.14)",
    borderRadius: "2px", padding: "5px 16px",
    background: "rgba(91,159,255,0.05)",
    backdropFilter: "blur(10px)",
    animation: "fadeUp 0.7s ease both",
  },
  badgeDot: {
    display: "inline-block",
    width: "7px", height: "7px", borderRadius: "50%",
    background: "#5b9fff",
    boxShadow: "0 0 8px #5b9fff",
    animation: "dotPulse 2s ease-in-out infinite, ringPulse 2.2s ease-in-out infinite",
  },
  badgeText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "9.5px", letterSpacing: "0.22em", color: "#5b9fff",
  },
  badgeSep: { color: "#ffffff", fontSize: "11px" },
  badgeVer: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "9px", letterSpacing: "0.15em", color: "#ffffff",
  },

  // Eyebrow
  eyebrow: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "9px", letterSpacing: "0.26em",
    color: "#ffffff",
    textTransform: "uppercase", textAlign: "center",
    animation: "fadeUp 0.7s ease 0.1s both",
  },

  // Title
  titleWrap: {
    textAlign: "center",
    animation: "fadeUp 0.8s ease 0.18s both",
  },
  mainTitle: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "clamp(48px, 9.5vw, 108px)",
    fontWeight: 900, lineHeight: 1,
    letterSpacing: "0.02em", whiteSpace: "nowrap", userSelect: "none",
  },
  titleAI: {
    background: "linear-gradient(135deg, #82c8ff 0%, #4d8fff 45%, #7c5cfc 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    filter: "drop-shadow(0 0 32px rgba(91,159,255,0.6))",
  },
  titleEL: {
    background: "linear-gradient(135deg, #c2deff 0%, #8ab4ff 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    filter: "drop-shadow(0 0 20px rgba(140,180,255,0.35))",
  },
  titleVision: {
    background: "linear-gradient(135deg, #ffffff 0%, #c8d8ff 55%, #9b8fff 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  },
  titleBar: {
    margin: "14px auto 0",
    width: "clamp(200px, 40%, 500px)", height: "2px",
    background: "linear-gradient(90deg, transparent, rgba(91,159,255,0.65), rgba(155,125,255,0.65), transparent)",
    transformOrigin: "center",
    animation: "barSlide 1s ease 0.5s both",
    borderRadius: "1px", overflow: "visible", position: "relative",
  },
  titleBarShimmer: {
    position: "absolute", inset: 0, borderRadius: "1px",
    background: "linear-gradient(90deg, transparent, rgba(200,220,255,0.95), transparent)",
    backgroundSize: "200% auto",
    animation: "shimmer 3s linear infinite",
  },

  // Tagline
  taglineWrap: {
    minHeight: "36px", textAlign: "center",
    animation: "fadeUp 0.8s ease 0.3s both",
    display: "flex", justifyContent: "center",
    whiteSpace: "nowrap",
  },
  tagline: {
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 500, fontSize: "clamp(11px, 2.8vw, 19px)",
    letterSpacing: "0.06em", color: "#ffffff",
    whiteSpace: "nowrap",
  },
  cursor: {
    display: "inline-block", color: "#5b9fff",
    animation: "blink 0.9s step-end infinite",
    marginLeft: "2px", fontSize: "0.9em",
  },

  // Rule
  rule: {
    display: "flex", alignItems: "center", gap: "14px",
    width: "min(560px, 88%)",
    animation: "fadeUp 0.8s ease 0.38s both",
  },
  ruleLine: {
    flex: 1, height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(91,159,255,0.25))",
  },
  ruleDiamond: {
    width: "7px", height: "7px",
    background: "linear-gradient(135deg, #5b9fff, #9b7dff)",
    transform: "rotate(45deg)",
    boxShadow: "0 0 12px rgba(91,159,255,0.7)",
    borderRadius: "1px",
  },

  // Stats
  statsRow: {
    display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center",
    animation: "fadeUp 0.9s ease 0.45s both",
  },
  statCard: {
    textAlign: "center",
    padding: "18px 26px",
    border: "1px solid rgba(91,159,255,0.13)",
    borderRadius: "4px",
    background: "rgba(20,40,100,0.22)",
    backdropFilter: "blur(14px)",
    minWidth: "136px",
    transition: "border-color 0.3s, background 0.3s",
  },
  statVal: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "26px", fontWeight: 700,
    background: "linear-gradient(135deg, #8ac4ff, #6a8eff, #b09fff)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    filter: "drop-shadow(0 0 12px rgba(91,159,255,0.5))",
    lineHeight: 1,
  },
  statId: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "12px", fontWeight: 600, letterSpacing: "0.07em",
    color: "#ffffff", marginTop: "6px",
  },
  statEn: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "8.5px", color: "#ffffff",
    marginTop: "2px", letterSpacing: "0.1em",
  },

  // Modules
  modules: {
    display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center",
    animation: "fadeUp 1s ease 0.55s both",
  },
  modCard: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: "5px",
    padding: "18px 20px",
    border: "1px solid rgba(91,159,255,0.11)",
    borderRadius: "4px",
    background: "rgba(10,20,60,0.45)",
    backdropFilter: "blur(16px)",
    minWidth: "128px",
    animation: "cardIn 0.7s ease both",
    transition: "border-color 0.3s, background 0.3s, transform 0.3s",
  },
  modIcon: {
    fontSize: "20px",
    background: "linear-gradient(135deg, #82b8ff, #9b7dff)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
    filter: "drop-shadow(0 0 8px rgba(91,159,255,0.6))",
    lineHeight: 1,
  },
  modName: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.1em",
    color: "#ffffff", textAlign: "center",
  },
  modDesc: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "10.5px", color: "#ffffff",
    textAlign: "center", letterSpacing: "0.04em",
  },

  // Footer
  footer: { animation: "fadeUp 1s ease 0.75s both" },
  footerText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "8.5px", letterSpacing: "0.16em",
    color: "#ffffff",
  },
};