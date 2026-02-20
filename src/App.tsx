import { useState, useEffect, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────
interface TerminalLine {
  text: string;
  prompt?: boolean;
  color?: string;
}

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  status: string;
  deploy?: string;
  live_demo?: string;
}

interface TypeWriterProps {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
}

interface GlitchTextProps {
  text: string;
  className?: string;
}

interface TerminalProps {
  lines: TerminalLine[];
  title?: string;
}

interface SkillChipProps {
  name: string;
  delay?: number;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  onViewImages?: (title: string) => void;
  hasImages?: boolean;
}

interface NavLinkProps {
  label: string;
  target: string;
  onClick?: () => void;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  images: string[];
}

// ── Matrix rain canvas ──────────────────────────────────────────
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const fontSize = 13;
    const cols = Math.floor(W / fontSize);
    const drops: number[] = Array(cols).fill(1);
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ</>{}[]()".split("");

    const draw = () => {
      ctx.fillStyle = "rgba(2, 6, 23, 0.05)";
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${fontSize}px 'Courier New', monospace`;
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.95
          ? "#fff"
          : `rgba(0,${Math.floor(Math.random() * 100 + 155)},${Math.floor(Math.random() * 50)},${Math.random() * 0.5 + 0.1})`;
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 33);
    const resize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => { clearInterval(interval); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, opacity: 0.18, pointerEvents: "none" }} />;
}

// ── Typing effect ───────────────────────────────────────────────
function TypeWriter({ text, speed = 60, onDone }: TypeWriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const t = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) { clearInterval(t); setDone(true); onDone?.(); }
    }, speed);
    return () => clearInterval(t);
  }, [text]);
  return (
    <span>
      {displayed}
      {!done && <span style={{ borderRight: "2px solid #00ff88", animation: "blink 1s step-end infinite" }}>&nbsp;</span>}
    </span>
  );
}

// ── Glitch text ─────────────────────────────────────────────────
function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <span className={`glitch ${className}`} data-text={text} style={{ position: "relative" }}>
      {text}
    </span>
  );
}

// ── Terminal window ─────────────────────────────────────────────
function Terminal({ lines, title = "terminal" }: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  useEffect(() => {
    setVisibleLines([]);
    lines.forEach((line, i) => {
      setTimeout(() => setVisibleLines(prev => [...prev, line]), i * 400);
    });
  }, []);
  return (
    <div style={{
      background: "rgba(2,6,23,0.95)", border: "1px solid #00ff8833",
      borderRadius: 8, fontFamily: "'Fira Code', 'Courier New', monospace",
      fontSize: 13, overflow: "hidden", boxShadow: "0 0 30px #00ff8820, inset 0 0 30px rgba(0,0,0,0.5)"
    }}>
      <div style={{ background: "#0f172a", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #00ff8822" }}>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
        <span style={{ color: "#475569", fontSize: 12, marginLeft: 8 }}>{title}</span>
      </div>
      <div style={{ padding: "16px 20px", minHeight: 80 }}>
        {visibleLines.map((line, i) => (
          <div key={i} style={{ marginBottom: 4, lineHeight: 1.6 }}>
            {line.prompt && <span style={{ color: "#00ff88" }}>❯ </span>}
            <span style={{ color: line.color || "#94a3b8" }}>{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Image Modal ─────────────────────────────────────────────────
function ImageModal({ isOpen, onClose, projectTitle, images }: ImageModalProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (isOpen) setCurrent(0);
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") setCurrent(p => (p + 1) % images.length);
      if (e.key === "ArrowLeft") setCurrent(p => (p - 1 + images.length) % images.length);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, images.length]);

  if (!isOpen) return null;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(2,6,23,0.96)", backdropFilter: "blur(12px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 1100, padding: "0 16px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: "#334155" }}>// gallery</span>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, color: "#00ff88", marginTop: 2 }}>
            ./{projectTitle}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "monospace", fontSize: 12, color: "#475569" }}>
            {current + 1} / {images.length}
          </span>
          <button onClick={onClose} style={{
            background: "none", border: "1px solid #1e293b", borderRadius: 4,
            color: "#475569", cursor: "pointer", padding: "6px 12px",
            fontFamily: "monospace", fontSize: 13, transition: "all 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}
          >
            ✕ close
          </button>
        </div>
      </div>

      <div onClick={e => e.stopPropagation()} style={{
        position: "relative", width: "100%", maxWidth: 1100, padding: "0 16px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <button onClick={() => setCurrent(p => (p - 1 + images.length) % images.length)} style={{
          background: "rgba(0,255,136,0.08)", border: "1px solid #00ff8830", borderRadius: 4,
          color: "#00ff88", cursor: "pointer", padding: "10px 12px", fontSize: 20,
          transition: "all 0.2s", flexShrink: 0,
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,136,0.18)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,136,0.08)"; }}
        >‹</button>

        <div style={{
          flex: 1, border: "1px solid #00ff8820", borderRadius: 8, overflow: "hidden",
          boxShadow: "0 0 60px #00ff8815",
          maxHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
          background: "#030912",
        }}>
          <img
            src={images[current]}
            alt={`${projectTitle} screenshot ${current + 1}`}
            style={{ maxWidth: "100%", maxHeight: "60vh", objectFit: "contain", display: "block" }}
          />
        </div>

        <button onClick={() => setCurrent(p => (p + 1) % images.length)} style={{
          background: "rgba(0,255,136,0.08)", border: "1px solid #00ff8830", borderRadius: 4,
          color: "#00ff88", cursor: "pointer", padding: "10px 12px", fontSize: 20,
          transition: "all 0.2s", flexShrink: 0,
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,136,0.18)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,136,0.08)"; }}
        >›</button>
      </div>

      <div onClick={e => e.stopPropagation()} style={{
        display: "flex", gap: 6, marginTop: 12, padding: "0 16px",
        overflowX: "auto", maxWidth: 1100, width: "100%",
        scrollbarWidth: "thin",
      }}>
        {images.map((src, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            flexShrink: 0, width: 60, height: 40, borderRadius: 4, overflow: "hidden", cursor: "pointer",
            border: `2px solid ${i === current ? "#00ff88" : "#1e293b"}`,
            transition: "border-color 0.2s, transform 0.2s",
            transform: i === current ? "scale(1.08)" : "scale(1)",
            opacity: i === current ? 1 : 0.5,
          }}>
            <img src={src} alt={`thumb ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, fontFamily: "monospace", fontSize: 11, color: "#1e293b" }}>
        ← → arrow keys to navigate · ESC to close
      </div>
    </div>
  );
}

// ── Skill chip ──────────────────────────────────────────────────
function SkillChip({ name, delay = 0 }: SkillChipProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px",
      border: "1px solid #00ff8844", borderRadius: 4,
      color: "#00ff88", fontSize: 12, fontFamily: "'Fira Code', monospace",
      background: "rgba(0,255,136,0.04)",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      cursor: "default",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,255,136,0.12)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px #00ff8840"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,255,136,0.04)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      {name}
    </span>
  );
}

// ── Project card ────────────────────────────────────────────────
function ProjectCard({ project, index, onViewImages, hasImages }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const colors = ["#00ff88", "#0ea5e9", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4"];
  const color = colors[index % colors.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(15,23,42,0.95)" : "rgba(2,6,23,0.8)",
        border: `1px solid ${hovered ? color : "#1e293b"}`,
        borderRadius: 8, padding: "24px 20px 20px",
        transition: "all 0.3s ease",
        boxShadow: hovered ? `0 0 40px ${color}20, 0 0 1px ${color}` : "none",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "default", position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: 32, height: 32, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <h3 style={{ fontFamily: "'Fira Code', monospace", fontSize: 16, color, fontWeight: 600, margin: 0, wordBreak: "break-word" }}>
          <span style={{ color: "#475569", fontWeight: 400 }}>./</span>{project.title}
        </h3>
        <span style={{ fontSize: 10, padding: "2px 8px", border: `1px solid #00ff8844`, color: "#00ff88", borderRadius: 2, fontFamily: "monospace", flexShrink: 0 }}>
          {project.status.toUpperCase()}
        </span>
      </div>

      <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, marginBottom: 16, fontFamily: "'Fira Code', monospace" }}>
        <span style={{ color: "#475569" }}>// </span>{project.description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {project.tech.map((t, i) => (
          <span key={i} style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 2,
            background: `${color}10`, color, border: `1px solid ${color}30`,
            fontFamily: "monospace"
          }}>{t}</span>
        ))}
      </div>

      {project.deploy && (
        <div style={{ marginBottom: 14, fontFamily: "monospace", fontSize: 11, color: "#475569" }}>
          <span style={{ color: "#334155" }}>deploy: </span>{project.deploy}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <a href={project.github} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 6, color: "#475569", textDecoration: "none", fontSize: 13, fontFamily: "monospace", transition: "color 0.2s", padding: "6px 12px", border: "1px solid #1e293b", borderRadius: 4 }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = color; (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}40`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#475569"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1e293b"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.73.084-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" /></svg>
          github
        </a>
        {project.live_demo && (
          <a href={project.live_demo} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 6, color: "#475569", textDecoration: "none", fontSize: 13, fontFamily: "monospace", transition: "all 0.2s", padding: "6px 12px", border: "1px solid #1e293b", borderRadius: 4 }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = color; (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}40`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#475569"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1e293b"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            live
          </a>
        )}
        {hasImages && onViewImages && (
          <button onClick={() => onViewImages(project.title)} style={{
            display: "flex", alignItems: "center", gap: 6, color: "#475569",
            fontSize: 13, fontFamily: "monospace", transition: "all 0.2s",
            padding: "6px 12px", border: "1px solid #1e293b", borderRadius: 4,
            background: "none", cursor: "pointer",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = color; (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}40`; (e.currentTarget as HTMLButtonElement).style.background = `${color}08`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#475569"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            gallery
          </button>
        )}
      </div>
    </div>
  );
}

// ── Nav link ────────────────────────────────────────────────────
function NavLink({ label, target, onClick }: NavLinkProps) {
  const scroll = () => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    onClick?.();
  };
  return (
    <button onClick={scroll} style={{
      background: "none", border: "none", color: "#475569", cursor: "pointer",
      fontFamily: "'Fira Code', monospace", fontSize: 13, padding: "8px 12px",
      transition: "color 0.2s", whiteSpace: "nowrap",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#00ff88"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}
    >
      <span style={{ color: "#334155" }}>./</span>{label}
    </button>
  );
}

// ── Main App ─────────────────────────────────────────────────────
export default function App() {
  const [heroReady, setHeroReady] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const [time, setTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let pos = 0;
    const t = setInterval(() => { pos = (pos + 1) % 100; setScanLine(pos); }, 30);
    return () => clearInterval(t);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMobileMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const skills = {
    frontend: ["React", "TypeScript", "JavaScript", "Next.js", "HTML/CSS", "Tailwind CSS", "Zustand", "TanStack Query"],
    backend: ["Node.js(Express.js)", "Nest.js", "PostgreSQL", "MongoDB", "Redis", "REST APIs", "Kafka"],
    tools: ["Git/GitHub", "Docker", "Postman", "Swagger", "Vite", "npm", "Yarn", "Bun"],
  };

  const projectImages: Record<string, string[]> = {
    "Reddit Clone": [
      "/reddit-images/admin panel - community page.png",
      "/reddit-images/admin panel - content page 2.png",
      "/reddit-images/admin panel - content page.png",
      "/reddit-images/admin panel - request moderator page.png",
      "/reddit-images/moderator panel - reported comment page.png",
      "/reddit-images/moderator panel - reported post page.png",
      "/reddit-images/moderator panel.png",
      "/reddit-images/reddit - community page.png",
      "/reddit-images/reddit - messages and chats page.png",
      "/reddit-images/reddit - profile page.png",
      "/reddit-images/reddit - saved page.png",
      "/reddit-images/reddit - settings page 2.png",
      "/reddit-images/reddit - settings page.png",
      "/reddit-images/reddit-create  ppost page.png",
      "/reddit-images/reddit-home page.png",
      "/reddit-images/reddit-login page.png",
      "/reddit-images/reddit-subscribed page.png",
      "/reddit-images/responcive desighn 2.png",
      "/reddit-images/responcive design.png",
    ],
    NeoShop: [
      "/neoshop-images/NeoShop - basket.png",
      "/neoshop-images/NeoShop - catalog page.png",
      "/neoshop-images/NeoShop - craete categories page.png",
      "/neoshop-images/NeoShop - create goods page.png",
      "/neoshop-images/NeoShop - favorites page.png",
      "/neoshop-images/NeoShop - home page.png",
      "/neoshop-images/NeoShop - product page 2.png",
      "/neoshop-images/NeoShop - product page.png",
      "/neoshop-images/NeoShop - responcive 2.png",
      "/neoshop-images/NeoShop - responcive.png",
      "/neoshop-images/NeoShop - settings store page.png",
      "/neoshop-images/NeoShop - store categories page.png",
      "/neoshop-images/NeoShop - store colors page.png",
      "/neoshop-images/NeoShop - store goods page.png",
      "/neoshop-images/NeoShop - store statistics page.png",
      "/neoshop-images/NeoShop- crate colors page.png",
      "/neoshop-images/NeoShop- login page.png",
    ],
    Crix: [
      "/crix-images/1.png", "/crix-images/2.png", "/crix-images/3.png",
      "/crix-images/4.png", "/crix-images/5.png", "/crix-images/6.png",
      "/crix-images/7.png", "/crix-images/8.png", "/crix-images/9.png",
      "/crix-images/10.png", "/crix-images/11.png", "/crix-images/12.png",
      "/crix-images/13.png", "/crix-images/14.png", "/crix-images/15.png",
      "/crix-images/16.png", "/crix-images/17.png", "/crix-images/18.png",
      "/crix-images/19.png", "/crix-images/20.png", "/crix-images/21.png",
    ],
    RentCar: [
      "/rentcar-images/rent-1.png", "/rentcar-images/rent-2.png", "/rentcar-images/rent-3.png",
      "/rentcar-images/rent-4.png", "/rentcar-images/rent-5.png", "/rentcar-images/rent-6.png",
      "/rentcar-images/rent-7.png", "/rentcar-images/rent-8.png", "/rentcar-images/rent-9.png",
      "/rentcar-images/rent-10.png", "/rentcar-images/rent-11.png", "/rentcar-images/rent-12.png",
      "/rentcar-images/rent-13.png", "/rentcar-images/rent-14.png", "/rentcar-images/rent-15.png",
      "/rentcar-images/rent-16.png", "/rentcar-images/rent-17.png",
    ],
  };

  const projects: Project[] = [
    { title: "Reddit Clone", description: "Full-featured Reddit clone with user authentication, post creation, voting system, real-time comments. Panel: admin, moderator, user", tech: ["React", "Node.js", "MongoDB", "Socket.io", "OAuth2.0", "Nodemailer"], github: "https://github.com/Qarib2004/reddit", status: "Completed" },
    { title: "FoodGo", description: "Users can add restaurants and food items to favorites, add food to basket, and leave reviews.", tech: ["Next.js", "PostgreSQL", "Zustand", "Auth.js", "Tailwind", "Zod", "Prisma"], github: "https://github.com/Qarib2004/fast-delivery", live_demo: "https://fast-delivery-stmn.vercel.app/", status: "Completed" },
    { title: "RentCar", description: "RentCar is a platform where car owners can rent out their vehicles, but first they must submit a request to the admin for approval. During registration, user passwords are securely hashed, and each user receives access and refresh tokens for authentication. Users can choose which car they want to rent. To communicate with the car owner, the platform provides a real-time chat powered by Socket.io, while Kafka is used to deliver real-time notifications. Users can leave reviews only after completing a car rental. The admin has access to all data about cars, users, and requests from users who want to become car owners and list their vehicles for rent.", tech: ["React", "Zustand", "TanStack Query", "NestJS", "PostgreSQL", "Prisma", "Socket.io", "Redis", "Stripe", "Docker", "Kafka", "Swagger"], github: "https://github.com/Qarib2004/rentcar", status: "Completed" },
    { title: "React Classroom", description: "Educational platform for managing classroom activities, assignments, and student-teacher interactions.", tech: ["React", "JavaScript", "Redux", "REST API", "Socket.io"], github: "https://github.com/nurlan1717/react-classroom-project", live_demo: "https://react-classroom-project.vercel.app/", status: "Completed" },
    { title: "NeoShop", description: "Modern e-commerce platform with full product catalog, Google OAuth, Stripe payments, testing suite.", tech: ["Next.js", "Nest.js", "TypeScript", "PostgreSQL", "Shadcn", "Google OAuth 2.0", "Prisma", "Docker", "Stripe", "Jest"], github: "https://github.com/Qarib2004/NeoShop", status: "Completed" },
    { title: "Cinefy", description: "Movie streaming platform with catalog, genre browsing, user authentication. Admin and user panels.", tech: ["Next.js", "Nest.js", "TypeScript", "PostgreSQL", "Prisma", "Docker", "Tailwind", "Stripe"], github: "https://github.com/Qarib2004/cinefy-project", live_demo: "https://cinefy-project.vercel.app/", status: "Completed" },
  ];

  const terminalLines: TerminalLine[] = [
    { text: "Qarib Alisultanov — Fullstack Developer", prompt: true, color: "#00ff88" },
    { text: "Location: Baku, Azerbaijan", prompt: false, color: "#64748b" },
    { text: "Stack: React · Next.js · NestJS · Node.js · PostgreSQL", prompt: false, color: "#0ea5e9" },
  ];

  const timeStr = time.toTimeString().slice(0, 8);
  const openModal = (title: string) => { setSelectedProject(title); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setSelectedProject(""); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020617; color: #94a3b8; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #00ff8840; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #00ff88; }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{text-shadow:0 0 20px #00ff8880} 50%{text-shadow:0 0 40px #00ff88,0 0 60px #00ff8840} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }

        .glitch { color: #00ff88; }
        .glitch::before, .glitch::after { content: attr(data-text); position:absolute; top:0; left:0; }
        .glitch::before { color:#0ea5e9; animation:glitch1 3s infinite; clip-path:polygon(0 30%,100% 30%,100% 50%,0 50%); }
        .glitch::after { color:#a855f7; animation:glitch2 3s infinite; clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%); }
        @keyframes glitch1 { 0%,90%,100%{transform:translateX(0)} 92%{transform:translateX(-4px)} 96%{transform:translateX(4px)} }
        @keyframes glitch2 { 0%,88%,100%{transform:translateX(0)} 90%{transform:translateX(4px)} 94%{transform:translateX(-4px)} }

        .hero-bg {
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,255,136,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(14,165,233,0.06) 0%, transparent 50%),
                      radial-gradient(ellipse 40% 30% at 20% 80%, rgba(168,85,247,0.05) 0%, transparent 50%),
                      #020617;
        }
        .section-bg { background: #030912; }
        .grid-bg {
          background-image: linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .nav-glass {
          background: rgba(2,6,23,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,255,136,0.08);
        }
        .section-title {
          font-family: 'Space Mono', monospace;
          font-size: clamp(24px, 5vw, 48px);
          color: #f8fafc;
          letter-spacing: -0.02em;
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }

        /* Mobile menu */
        .mobile-menu {
          animation: slideDown 0.2s ease forwards;
        }

        /* Responsive grids */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 20px;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr; gap: 32px; }
          .contact-grid { grid-template-columns: 1fr; gap: 32px; }
        }
        @media (max-width: 700px) {
          .projects-grid { grid-template-columns: 1fr; }
          .skills-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .hero-status-badge { flex-wrap: wrap; gap: 4px; font-size: 10px; }
        }
      `}</style>

      <MatrixRain />

      <ImageModal
        isOpen={modalOpen}
        onClose={closeModal}
        projectTitle={selectedProject}
        images={projectImages[selectedProject] || []}
      />

      {/* Navigation */}
      <nav className="nav-glass" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          {/* Logo */}
          <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 15, color: "#00ff88", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#1e293b" }}>{">"}</span>
            <span style={{ animation: "glow 3s ease-in-out infinite" }}>QA</span>
            <span style={{ color: "#1e293b", fontSize: 12 }}>|</span>
            <span style={{ color: "#334155", fontSize: 11 }}>{timeStr}</span>
          </div>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: "flex", gap: 4 }}>
            {(["about", "skills", "projects", "contact"] as const).map((id) => (
              <NavLink key={id} label={id} target={id} />
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(v => !v)}
            style={{
              background: "none", border: "1px solid #1e293b", borderRadius: 4,
              color: "#475569", cursor: "pointer", padding: "6px 10px",
              fontFamily: "monospace", fontSize: 16, lineHeight: 1,
              transition: "all 0.2s",
              display: "none",
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu" style={{
            background: "rgba(2,6,23,0.98)", borderTop: "1px solid #1e293b",
            padding: "12px 20px 16px", display: "flex", flexDirection: "column", gap: 4,
          }}>
            {(["about", "skills", "projects", "contact"] as const).map((id) => (
              <NavLink key={id} label={id} target={id} onClick={() => setMobileMenuOpen(false)} />
            ))}
          </div>
        )}
      </nav>

      {/* Responsive nav styles injected via style tag */}
      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: block !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="hero-bg grid-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: 60 }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #00ff8830, transparent)", top: `${scanLine}%`, pointerEvents: "none" }} />

        {/* Corner decorations — hide on very small screens */}
        <div style={{ position: "absolute", top: 20, left: 20, width: 40, height: 40, borderTop: "1px solid #00ff8830", borderLeft: "1px solid #00ff8830" }} />
        <div style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderTop: "1px solid #00ff8830", borderRight: "1px solid #00ff8830" }} />
        <div style={{ position: "absolute", bottom: 20, left: 20, width: 40, height: 40, borderBottom: "1px solid #00ff8830", borderLeft: "1px solid #00ff8830" }} />
        <div style={{ position: "absolute", bottom: 20, right: 20, width: 40, height: 40, borderBottom: "1px solid #00ff8830", borderRight: "1px solid #00ff8830" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "40px 20px", maxWidth: 900, width: "100%", animation: "fadeUp 0.8s ease forwards" }}>
          <div className="hero-status-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28, padding: "6px 14px", border: "1px solid #00ff8830", borderRadius: 2, fontFamily: "monospace", fontSize: 12 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", display: "inline-block", boxShadow: "0 0 8px #00ff88", flexShrink: 0 }} />
            <span style={{ color: "#475569" }}>system:</span>
            <span style={{ color: "#00ff88" }}>online</span>
            <span style={{ color: "#334155", margin: "0 2px" }}>|</span>
            <span style={{ color: "#475569" }}>mode:</span>
            <span style={{ color: "#0ea5e9" }}>available for hire</span>
          </div>

          <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(32px, 8vw, 80px)", lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.03em" }}>
            <div style={{ color: "#1e293b", fontSize: "0.35em", fontWeight: 400, marginBottom: 8, letterSpacing: "0.2em" }}>// DEVELOPER</div>
            <GlitchText text="Qarib" className="animate-glow" />
            <br />
            <span style={{ color: "#f8fafc" }}>Alisultanov</span>
          </h1>

          <div style={{ fontFamily: "'Fira Code', monospace", fontSize: "clamp(12px, 2.5vw, 18px)", color: "#475569", marginBottom: 32, minHeight: 28 }}>
            <TypeWriter text="fullstack engineer · building scalable digital experiences" speed={50} onDone={() => setHeroReady(true)} />
          </div>

          {heroReady && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 40, animation: "fadeUp 0.5s ease forwards" }}>
              {["React", "Next.js", "NestJS", "Node.js", "PostgreSQL", "TypeScript", "Docker", "Redis"].map((t, i) => (
                <span key={t} style={{
                  fontFamily: "monospace", fontSize: 12, padding: "4px 10px",
                  border: "1px solid #1e293b", borderRadius: 2, color: "#64748b",
                  animation: `slideIn 0.4s ease ${i * 80}ms both`,
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#00ff88"; (e.currentTarget as HTMLElement).style.borderColor = "#00ff8840"; (e.currentTarget as HTMLElement).style.background = "#00ff8808"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#64748b"; (e.currentTarget as HTMLElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >{t}</span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} style={{
              padding: "11px 28px", background: "transparent", border: "1px solid #00ff88",
              color: "#00ff88", fontFamily: "'Fira Code', monospace", fontSize: 13, cursor: "pointer",
              borderRadius: 2, transition: "all 0.3s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#00ff88"; (e.currentTarget as HTMLButtonElement).style.color = "#020617"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px #00ff8840"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#00ff88"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
            >ls ./projects</button>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{
              padding: "11px 28px", background: "transparent", border: "1px solid #1e293b",
              color: "#475569", fontFamily: "'Fira Code', monospace", fontSize: 13, cursor: "pointer",
              borderRadius: 2, transition: "all 0.3s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#0ea5e9"; (e.currentTarget as HTMLButtonElement).style.color = "#0ea5e9"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}
            >./contact.sh</button>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", animation: "float 2s ease-in-out infinite", textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#334155", marginBottom: 6 }}>scroll_down</div>
          <div style={{ color: "#334155", fontSize: 20 }}>↓</div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="section-bg" style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#334155", marginBottom: 12 }}>// 01. about</div>
            <h2 className="section-title"><span style={{ color: "#00ff88" }}>whoami</span></h2>
            <div style={{ width: 60, height: 1, background: "#00ff88", marginTop: 16 }} />
          </div>
          <div className="about-grid">
            <div>
              <Terminal title="~/.profile" lines={terminalLines} />
              <div style={{ marginTop: 20, padding: "18px 20px", border: "1px solid #0f172a", borderLeft: "2px solid #00ff88", fontFamily: "'Fira Code', monospace", fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
                <span style={{ color: "#334155" }}>// </span>
                Passionate fullstack developer studying Information Technology at Azerbaijan University of Architecture and Construction. I build full-stack applications from the ground up — both client and server — with attention to performance, architecture, and developer experience.
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "education", value: "Code Academy — Software Engineering (MERN)", icon: "📚", color: "#0ea5e9" },
                { label: "location", value: "Yasamal, Baku, Azerbaijan 🇦🇿", icon: "📍", color: "#00ff88" },
                { label: "commitment", value: "100% — always pushing to learn more", icon: "⚡", color: "#a855f7" },
                { label: "focus", value: "Scalable web apps, clean architecture, DX", icon: "🎯", color: "#f59e0b" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} style={{ padding: "16px 18px", background: "#020617", border: "1px solid #0f172a", borderRadius: 4, display: "flex", alignItems: "flex-start", gap: 14, transition: "border-color 0.2s, transform 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}40`; (e.currentTarget as HTMLElement).style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#0f172a"; (e.currentTarget as HTMLElement).style.transform = "translateX(0)"; }}
                >
                  <span style={{ fontSize: 18, marginTop: 1, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: "monospace", fontSize: 11, color: "#334155", marginBottom: 4 }}>→ {label}</div>
                    <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: "#94a3b8" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills" style={{ background: "#020617", padding: "80px 20px" }} className="grid-bg">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#334155", marginBottom: 12 }}>// 02. skills</div>
            <h2 className="section-title"><span style={{ color: "#0ea5e9" }}>tech_stack</span></h2>
            <div style={{ width: 60, height: 1, background: "#0ea5e9", marginTop: 16 }} />
          </div>
          <div className="skills-grid">
            {[
              { title: "frontend", skills: skills.frontend, color: "#00ff88", icon: "⬡", desc: "Client-side interfaces & UX" },
              { title: "backend", skills: skills.backend, color: "#0ea5e9", icon: "⚙", desc: "Server, APIs & databases" },
              { title: "tools & devops", skills: skills.tools, color: "#a855f7", icon: "◈", desc: "Development & deployment" },
            ].map(({ title, skills: sk, color, icon, desc }) => (
              <div key={title} style={{ background: "#030912", border: "1px solid #0f172a", borderRadius: 8, padding: "24px", transition: "border-color 0.3s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${color}30`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#0f172a"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 18, color }}>{icon}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, color: "#f8fafc" }}>{title}</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#334155", marginBottom: 20 }}>// {desc}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {sk.map((name, i) => <SkillChip key={name} name={name} delay={i * 60} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="section-bg" style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#334155", marginBottom: 12 }}>// 03. projects</div>
            <h2 className="section-title"><span style={{ color: "#a855f7" }}>featured_work</span></h2>
            <div style={{ width: 60, height: 1, background: "#a855f7", marginTop: 16 }} />
          </div>
          <div className="projects-grid">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={i}
                hasImages={!!projectImages[project.title]}
                onViewImages={openModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={{ background: "#020617", padding: "80px 20px" }} className="grid-bg">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: "#334155", marginBottom: 12 }}>// 04. contact</div>
            <h2 className="section-title"><span style={{ color: "#f59e0b" }}>get_in_touch</span></h2>
            <div style={{ width: 60, height: 1, background: "#f59e0b", marginTop: 16 }} />
          </div>
          <div className="contact-grid">
            <div>
              <p style={{ fontFamily: "'Fira Code', monospace", fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 28 }}>
                <span style={{ color: "#334155" }}>/*<br /></span>
                &nbsp;* I'm always open to discussing new opportunities,<br />
                &nbsp;* interesting projects, or just connecting.<br />
                &nbsp;* Let's build something great together.<br />
                <span style={{ color: "#334155" }}>&nbsp;*/</span>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "✉", label: "email", value: "garibalisultanov@gmail.com", href: "mailto:garibalisultanov@gmail.com", color: "#00ff88" },
                  { icon: "📱", label: "phone", value: "+994 77 611 28 88", href: "tel:+994776112888", color: "#0ea5e9" },
                  { icon: "📍", label: "location", value: "Yasamal, Baku, Azerbaijan", color: "#a855f7" },
                ].map(({ icon, label, value, href, color }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "#030912", border: "1px solid #0f172a", borderRadius: 4, transition: "border-color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${color}40`}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#0f172a"}
                  >
                    <span style={{ fontSize: 18, width: 24, textAlign: "center", flexShrink: 0 }}>{icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "monospace", fontSize: 10, color: "#334155", marginBottom: 2 }}>{label}</div>
                      {href
                        ? <a href={href} style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color, textDecoration: "none", wordBreak: "break-all" }}>{value}</a>
                        : <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: "#94a3b8" }}>{value}</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Terminal title="send_message.sh" lines={[
                { text: "Initializing connection...", prompt: true, color: "#475569" },
                { text: "→ GitHub: github.com/Qarib2004", prompt: false, color: "#00ff88" },
                { text: "→ LinkedIn: Garib Alisultanov", prompt: false, color: "#0ea5e9" },
                { text: "→ Email: garibalisultanov@gmail.com", prompt: false, color: "#a855f7" },
                { text: "Ready. Awaiting your message...", prompt: false, color: "#f59e0b" },
              ]} />
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                {[
                  { label: "github", href: "https://github.com/Qarib2004", color: "#f8fafc" },
                  { label: "linkedin", href: "https://www.linkedin.com/in/garib-alisultanov-115816325", color: "#0ea5e9" },
                  { label: "email", href: "mailto:garibalisultanov@gmail.com", color: "#00ff88" },
                ].map(({ label, href, color }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
                    flex: 1, textAlign: "center", padding: "11px 8px", border: "1px solid #1e293b",
                    color: "#475569", textDecoration: "none", fontFamily: "monospace", fontSize: 12,
                    borderRadius: 4, transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}40`; (e.currentTarget as HTMLAnchorElement).style.color = color; (e.currentTarget as HTMLAnchorElement).style.background = `${color}08`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLAnchorElement).style.color = "#475569"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                  >./{label}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#030912", borderTop: "1px solid #0f172a", padding: "28px 20px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 12, color: "#1e293b" }}>
          <span style={{ color: "#00ff88" }}>Qarib Alisultanov</span>
          {" · "}
          <span>built with React & 💚</span>
          {" · "}
          <span>© 2025</span>
        </div>
      </footer>
    </>
  );
}










// import { useState, useEffect, useRef } from "react";

// // ── Types ────────────────────────────────────────────────────────
// interface TerminalLine {
//   text: string;
//   prompt?: boolean;
//   color?: string;
// }

// interface Project {
//   title: string;
//   description: string;
//   tech: string[];
//   github: string;
//   status: string;
//   deploy?: string;
//   live_demo?: string;
// }

// interface TypeWriterProps {
//   text: string;
//   speed?: number;
//   className?: string;
//   onDone?: () => void;
// }

// interface GlitchTextProps {
//   text: string;
//   className?: string;
// }

// interface TerminalProps {
//   lines: TerminalLine[];
//   title?: string;
// }

// interface SkillChipProps {
//   name: string;
//   delay?: number;
// }

// interface ProjectCardProps {
//   project: Project;
//   index: number;
//   onViewImages?: (title: string) => void;
//   hasImages?: boolean;
// }

// interface NavLinkProps {
//   label: string;
//   target: string;
// }

// interface ImageModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   projectTitle: string;
//   images: string[];
// }

// // ── Matrix rain canvas ──────────────────────────────────────────
// function MatrixRain() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;
//     let W = (canvas.width = window.innerWidth);
//     let H = (canvas.height = window.innerHeight);
//     const fontSize = 13;
//     const cols = Math.floor(W / fontSize);
//     const drops: number[] = Array(cols).fill(1);
//     const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ</>{}[]()".split("");

//     const draw = () => {
//       ctx.fillStyle = "rgba(2, 6, 23, 0.05)";
//       ctx.fillRect(0, 0, W, H);
//       ctx.font = `${fontSize}px 'Courier New', monospace`;
//       drops.forEach((y, i) => {
//         const char = chars[Math.floor(Math.random() * chars.length)];
//         ctx.fillStyle = Math.random() > 0.95
//           ? "#fff"
//           : `rgba(0,${Math.floor(Math.random() * 100 + 155)},${Math.floor(Math.random() * 50)},${Math.random() * 0.5 + 0.1})`;
//         ctx.fillText(char, i * fontSize, y * fontSize);
//         if (y * fontSize > H && Math.random() > 0.975) drops[i] = 0;
//         drops[i]++;
//       });
//     };

//     const interval = setInterval(draw, 33);
//     const resize = () => {
//       if (!canvas) return;
//       W = canvas.width = window.innerWidth;
//       H = canvas.height = window.innerHeight;
//     };
//     window.addEventListener("resize", resize);
//     return () => { clearInterval(interval); window.removeEventListener("resize", resize); };
//   }, []);
//   return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, opacity: 0.18, pointerEvents: "none" }} />;
// }

// // ── Typing effect ───────────────────────────────────────────────
// function TypeWriter({ text, speed = 60, onDone }: TypeWriterProps) {
//   const [displayed, setDisplayed] = useState("");
//   const [done, setDone] = useState(false);
//   useEffect(() => {
//     setDisplayed("");
//     setDone(false);
//     let i = 0;
//     const t = setInterval(() => {
//       setDisplayed(text.slice(0, ++i));
//       if (i >= text.length) { clearInterval(t); setDone(true); onDone?.(); }
//     }, speed);
//     return () => clearInterval(t);
//   }, [text]);
//   return (
//     <span>
//       {displayed}
//       {!done && <span style={{ borderRight: "2px solid #00ff88", animation: "blink 1s step-end infinite" }}>&nbsp;</span>}
//     </span>
//   );
// }

// // ── Glitch text ─────────────────────────────────────────────────
// function GlitchText({ text, className = "" }: GlitchTextProps) {
//   return (
//     <span className={`glitch ${className}`} data-text={text} style={{ position: "relative" }}>
//       {text}
//     </span>
//   );
// }

// // ── Terminal window ─────────────────────────────────────────────
// function Terminal({ lines, title = "terminal" }: TerminalProps) {
//   const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
//   useEffect(() => {
//     setVisibleLines([]);
//     lines.forEach((line, i) => {
//       setTimeout(() => setVisibleLines(prev => [...prev, line]), i * 400);
//     });
//   }, []);
//   return (
//     <div style={{
//       background: "rgba(2,6,23,0.95)", border: "1px solid #00ff8833",
//       borderRadius: 8, fontFamily: "'Fira Code', 'Courier New', monospace",
//       fontSize: 13, overflow: "hidden", boxShadow: "0 0 30px #00ff8820, inset 0 0 30px rgba(0,0,0,0.5)"
//     }}>
//       <div style={{ background: "#0f172a", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #00ff8822" }}>
//         <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
//         <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
//         <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
//         <span style={{ color: "#475569", fontSize: 12, marginLeft: 8 }}>{title}</span>
//       </div>
//       <div style={{ padding: "16px 20px", minHeight: 80 }}>
//         {visibleLines.map((line, i) => (
//           <div key={i} style={{ marginBottom: 4, lineHeight: 1.6 }}>
//             {line.prompt && <span style={{ color: "#00ff88" }}>❯ </span>}
//             <span style={{ color: line.color || "#94a3b8" }}>{line.text}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Image Modal ─────────────────────────────────────────────────
// function ImageModal({ isOpen, onClose, projectTitle, images }: ImageModalProps) {
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     if (isOpen) setCurrent(0);
//     const handleKey = (e: KeyboardEvent) => {
//       if (!isOpen) return;
//       if (e.key === "ArrowRight") setCurrent(p => (p + 1) % images.length);
//       if (e.key === "ArrowLeft") setCurrent(p => (p - 1 + images.length) % images.length);
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [isOpen, images.length]);

//   if (!isOpen) return null;

//   return (
//     <div onClick={onClose} style={{
//       position: "fixed", inset: 0, zIndex: 1000,
//       background: "rgba(2,6,23,0.96)", backdropFilter: "blur(12px)",
//       display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//     }}>
//       {/* Header */}
//       <div onClick={e => e.stopPropagation()} style={{
//         width: "100%", maxWidth: 1100, padding: "0 24px 16px",
//         display: "flex", justifyContent: "space-between", alignItems: "center",
//       }}>
//         <div>
//           <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: "#334155" }}>// gallery</span>
//           <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, color: "#00ff88", marginTop: 2 }}>
//             ./{projectTitle}
//           </div>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
//           <span style={{ fontFamily: "monospace", fontSize: 12, color: "#475569" }}>
//             {current + 1} / {images.length}
//           </span>
//           <button onClick={onClose} style={{
//             background: "none", border: "1px solid #1e293b", borderRadius: 4,
//             color: "#475569", cursor: "pointer", padding: "6px 14px",
//             fontFamily: "monospace", fontSize: 13, transition: "all 0.2s",
//           }}
//             onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
//             onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}
//           >
//             ✕ close
//           </button>
//         </div>
//       </div>

//       {/* Main image */}
//       <div onClick={e => e.stopPropagation()} style={{
//         position: "relative", width: "100%", maxWidth: 1100, padding: "0 24px",
//         display: "flex", alignItems: "center", gap: 16,
//       }}>
//         <button onClick={() => setCurrent(p => (p - 1 + images.length) % images.length)} style={{
//           background: "rgba(0,255,136,0.08)", border: "1px solid #00ff8830", borderRadius: 4,
//           color: "#00ff88", cursor: "pointer", padding: "12px 16px", fontSize: 20,
//           transition: "all 0.2s", flexShrink: 0,
//         }}
//           onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,136,0.18)"; }}
//           onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,136,0.08)"; }}
//         >‹</button>

//         <div style={{
//           flex: 1, border: "1px solid #00ff8820", borderRadius: 8, overflow: "hidden",
//           boxShadow: "0 0 60px #00ff8815",
//           maxHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
//           background: "#030912",
//         }}>
//           <img
//             src={images[current]}
//             alt={`${projectTitle} screenshot ${current + 1}`}
//             style={{ maxWidth: "100%", maxHeight: "60vh", objectFit: "contain", display: "block" }}
//           />
//         </div>

//         <button onClick={() => setCurrent(p => (p + 1) % images.length)} style={{
//           background: "rgba(0,255,136,0.08)", border: "1px solid #00ff8830", borderRadius: 4,
//           color: "#00ff88", cursor: "pointer", padding: "12px 16px", fontSize: 20,
//           transition: "all 0.2s", flexShrink: 0,
//         }}
//           onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,136,0.18)"; }}
//           onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,136,0.08)"; }}
//         >›</button>
//       </div>

//       {/* Thumbnails */}
//       <div onClick={e => e.stopPropagation()} style={{
//         display: "flex", gap: 8, marginTop: 16, padding: "0 24px",
//         overflowX: "auto", maxWidth: 1100, width: "100%",
//         scrollbarWidth: "thin",
//       }}>
//         {images.map((src, i) => (
//           <div key={i} onClick={() => setCurrent(i)} style={{
//             flexShrink: 0, width: 72, height: 48, borderRadius: 4, overflow: "hidden", cursor: "pointer",
//             border: `2px solid ${i === current ? "#00ff88" : "#1e293b"}`,
//             transition: "border-color 0.2s, transform 0.2s",
//             transform: i === current ? "scale(1.08)" : "scale(1)",
//             opacity: i === current ? 1 : 0.5,
//           }}>
//             <img src={src} alt={`thumb ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//           </div>
//         ))}
//       </div>

//       {/* Keyboard hint */}
//       <div style={{ marginTop: 16, fontFamily: "monospace", fontSize: 11, color: "#1e293b" }}>
//         ← → arrow keys to navigate · ESC to close
//       </div>
//     </div>
//   );
// }

// // ── Skill chip ──────────────────────────────────────────────────
// function SkillChip({ name, delay = 0 }: SkillChipProps) {
//   const [visible, setVisible] = useState(false);
//   useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
//   return (
//     <span style={{
//       display: "inline-block", padding: "4px 12px",
//       border: "1px solid #00ff8844", borderRadius: 4,
//       color: "#00ff88", fontSize: 12, fontFamily: "'Fira Code', monospace",
//       background: "rgba(0,255,136,0.04)",
//       opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
//       transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
//       cursor: "default",
//     }}
//       onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,255,136,0.12)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px #00ff8840"; }}
//       onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,255,136,0.04)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
//     >
//       {name}
//     </span>
//   );
// }

// // ── Project card ────────────────────────────────────────────────
// function ProjectCard({ project, index, onViewImages, hasImages }: ProjectCardProps) {
//   const [hovered, setHovered] = useState(false);
//   const colors = ["#00ff88", "#0ea5e9", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4"];
//   const color = colors[index % colors.length];

//   return (
//     <div
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         background: hovered ? "rgba(15,23,42,0.95)" : "rgba(2,6,23,0.8)",
//         border: `1px solid ${hovered ? color : "#1e293b"}`,
//         borderRadius: 8, padding: "28px 28px 24px",
//         transition: "all 0.3s ease",
//         boxShadow: hovered ? `0 0 40px ${color}20, 0 0 1px ${color}` : "none",
//         transform: hovered ? "translateY(-4px)" : "translateY(0)",
//         cursor: "default", position: "relative", overflow: "hidden",
//       }}
//     >
//       {/* Corner decorations */}
//       <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s" }} />
//       <div style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s" }} />

//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
//         <h3 style={{ fontFamily: "'Fira Code', monospace", fontSize: 18, color, fontWeight: 600, margin: 0 }}>
//           <span style={{ color: "#475569", fontWeight: 400 }}>./</span>{project.title}
//         </h3>
//         <span style={{ fontSize: 10, padding: "2px 8px", border: `1px solid #00ff8844`, color: "#00ff88", borderRadius: 2, fontFamily: "monospace", flexShrink: 0, marginLeft: 12 }}>
//           {project.status.toUpperCase()}
//         </span>
//       </div>

//       <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, marginBottom: 18, fontFamily: "'Fira Code', monospace" }}>
//         <span style={{ color: "#475569" }}>// </span>{project.description}
//       </p>

//       <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
//         {project.tech.map((t, i) => (
//           <span key={i} style={{
//             fontSize: 11, padding: "2px 8px", borderRadius: 2,
//             background: `${color}10`, color, border: `1px solid ${color}30`,
//             fontFamily: "monospace"
//           }}>{t}</span>
//         ))}
//       </div>

//       {project.deploy && (
//         <div style={{ marginBottom: 16, fontFamily: "monospace", fontSize: 11, color: "#475569" }}>
//           <span style={{ color: "#334155" }}>deploy: </span>{project.deploy}
//         </div>
//       )}

//       <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//         <a href={project.github} target="_blank" rel="noopener noreferrer"
//           style={{ display: "flex", alignItems: "center", gap: 6, color: "#475569", textDecoration: "none", fontSize: 13, fontFamily: "monospace", transition: "color 0.2s", padding: "6px 12px", border: "1px solid #1e293b", borderRadius: 4 }}
//           onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = color; (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}40`; }}
//           onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#475569"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1e293b"; }}
//         >
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.73.084-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" /></svg>
//           github
//         </a>
//         {project.live_demo && (
//           <a href={project.live_demo} target="_blank" rel="noopener noreferrer"
//             style={{ display: "flex", alignItems: "center", gap: 6, color: "#475569", textDecoration: "none", fontSize: 13, fontFamily: "monospace", transition: "all 0.2s", padding: "6px 12px", border: "1px solid #1e293b", borderRadius: 4 }}
//             onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = color; (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}40`; }}
//             onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#475569"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1e293b"; }}
//           >
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
//             live
//           </a>
//         )}
//         {hasImages && onViewImages && (
//           <button onClick={() => onViewImages(project.title)} style={{
//             display: "flex", alignItems: "center", gap: 6, color: "#475569",
//             fontSize: 13, fontFamily: "monospace", transition: "all 0.2s",
//             padding: "6px 12px", border: "1px solid #1e293b", borderRadius: 4,
//             background: "none", cursor: "pointer",
//           }}
//             onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = color; (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}40`; (e.currentTarget as HTMLButtonElement).style.background = `${color}08`; }}
//             onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#475569"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
//           >
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
//             gallery
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── Nav link ────────────────────────────────────────────────────
// function NavLink({ label, target }: NavLinkProps) {
//   const scroll = () => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
//   return (
//     <button onClick={scroll} style={{
//       background: "none", border: "none", color: "#475569", cursor: "pointer",
//       fontFamily: "'Fira Code', monospace", fontSize: 13, padding: "6px 12px",
//       transition: "color 0.2s",
//     }}
//       onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#00ff88"; }}
//       onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}
//     >
//       <span style={{ color: "#334155" }}>./</span>{label}
//     </button>
//   );
// }

// // ── Main App ─────────────────────────────────────────────────────
// export default function App() {
//   const [heroReady, setHeroReady] = useState(false);
//   const [scanLine, setScanLine] = useState(0);
//   const [time, setTime] = useState(new Date());
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedProject, setSelectedProject] = useState("");

//   useEffect(() => {
//     const t = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   useEffect(() => {
//     let pos = 0;
//     const t = setInterval(() => { pos = (pos + 1) % 100; setScanLine(pos); }, 30);
//     return () => clearInterval(t);
//   }, []);

//   const skills = {
//     frontend: ["React", "TypeScript", "JavaScript", "Next.js", "HTML/CSS", "Tailwind CSS", "Zustand", "TanStack Query"],
//     backend: ["Node.js(Express.js", "Nest.js", "PostgreSQL", "MongoDB", "Redis", "REST APIs", "Kafka"],
//     tools: ["Git/GitHub", "Docker", "Postman", "Swagger", "Vite", "npm", "Yarn", "Bun"],
//   };

//   const projectImages: Record<string, string[]> = {
//     "Reddit Clone": [
//       "/reddit-images/admin panel - community page.png",
//       "/reddit-images/admin panel - content page 2.png",
//       "/reddit-images/admin panel - content page.png",
//       "/reddit-images/admin panel - request moderator page.png",
//       "/reddit-images/moderator panel - reported comment page.png",
//       "/reddit-images/moderator panel - reported post page.png",
//       "/reddit-images/moderator panel.png",
//       "/reddit-images/reddit - community page.png",
//       "/reddit-images/reddit - messages and chats page.png",
//       "/reddit-images/reddit - profile page.png",
//       "/reddit-images/reddit - saved page.png",
//       "/reddit-images/reddit - settings page 2.png",
//       "/reddit-images/reddit - settings page.png",
//       "/reddit-images/reddit-create  ppost page.png",
//       "/reddit-images/reddit-home page.png",
//       "/reddit-images/reddit-login page.png",
//       "/reddit-images/reddit-subscribed page.png",
//       "/reddit-images/responcive desighn 2.png",
//       "/reddit-images/responcive design.png",
//     ],
//     NeoShop: [
//       "/neoshop-images/NeoShop - basket.png",
//       "/neoshop-images/NeoShop - catalog page.png",
//       "/neoshop-images/NeoShop - craete categories page.png",
//       "/neoshop-images/NeoShop - create goods page.png",
//       "/neoshop-images/NeoShop - favorites page.png",
//       "/neoshop-images/NeoShop - home page.png",
//       "/neoshop-images/NeoShop - product page 2.png",
//       "/neoshop-images/NeoShop - product page.png",
//       "/neoshop-images/NeoShop - responcive 2.png",
//       "/neoshop-images/NeoShop - responcive.png",
//       "/neoshop-images/NeoShop - settings store page.png",
//       "/neoshop-images/NeoShop - store categories page.png",
//       "/neoshop-images/NeoShop - store colors page.png",
//       "/neoshop-images/NeoShop - store goods page.png",
//       "/neoshop-images/NeoShop - store statistics page.png",
//       "/neoshop-images/NeoShop- crate colors page.png",
//       "/neoshop-images/NeoShop- login page.png",
//     ],
//     Crix: [
//       "/crix-images/1.png", "/crix-images/2.png", "/crix-images/3.png",
//       "/crix-images/4.png", "/crix-images/5.png", "/crix-images/6.png",
//       "/crix-images/7.png", "/crix-images/8.png", "/crix-images/9.png",
//       "/crix-images/10.png", "/crix-images/11.png", "/crix-images/12.png",
//       "/crix-images/13.png", "/crix-images/14.png", "/crix-images/15.png",
//       "/crix-images/16.png", "/crix-images/17.png", "/crix-images/18.png",
//       "/crix-images/19.png", "/crix-images/20.png", "/crix-images/21.png",
//     ],
//     RentCar: [
//       "/rentcar-images/rent-1.png", "/rentcar-images/rent-2.png", "/rentcar-images/rent-3.png",
//       "/rentcar-images/rent-4.png", "/rentcar-images/rent-5.png", "/rentcar-images/rent-6.png",
//       "/rentcar-images/rent-7.png", "/rentcar-images/rent-8.png", "/rentcar-images/rent-9.png",
//       "/rentcar-images/rent-10.png", "/rentcar-images/rent-11.png", "/rentcar-images/rent-12.png",
//       "/rentcar-images/rent-13.png", "/rentcar-images/rent-14.png", "/rentcar-images/rent-15.png",
//       "/rentcar-images/rent-16.png", "/rentcar-images/rent-17.png",
//     ],
//   };

//   const projects: Project[] = [
//     { title: "Reddit Clone", description: "Full-featured Reddit clone with user authentication, post creation, voting system, real-time comments. Panel: admin, moderator, user", tech: ["React", "Node.js", "MongoDB", "Socket.io", "OAuth2.0", "Nodemailer"], github: "https://github.com/Qarib2004/reddit", status: "Completed" },
//     { title: "FoodGo", description: "Users can add restaurants and food items to favorites, add food to basket, and leave reviews.", tech: ["Next.js", "PostgreSQL", "Zustand", "Auth.js", "Tailwind", "Zod", "Prisma"], github: "https://github.com/Qarib2004/fast-delivery", live_demo: "https://fast-delivery-stmn.vercel.app/", status: "Completed" },
//     { title: "RentCar", description: "Platform where car owners rent vehicles. Real-time chat via Socket.io, Kafka notifications, Stripe payments, admin panel.", tech: ["React", "Zustand", "TanStack Query", "NestJS", "PostgreSQL", "Prisma", "Socket.io", "Redis", "Stripe", "Docker", "Kafka", "Swagger"], github: "https://github.com/Qarib2004/rentcar", status: "Completed" },
//     { title: "React Classroom", description: "Educational platform for managing classroom activities, assignments, and student-teacher interactions.", tech: ["React", "JavaScript", "Redux", "REST API", "Socket.io"], github: "https://github.com/nurlan1717/react-classroom-project", live_demo: "https://react-classroom-project.vercel.app/", status: "Completed" },
//     { title: "NeoShop", description: "Modern e-commerce platform with full product catalog, Google OAuth, Stripe payments, testing suite.", tech: ["Next.js", "Nest.js", "TypeScript", "PostgreSQL", "Shadcn", "Google OAuth 2.0", "Prisma", "Docker", "Stripe", "Jest"], github: "https://github.com/Qarib2004/NeoShop", status: "Completed" },
//     { title: "Cinefy", description: "Movie streaming platform with catalog, genre browsing, user authentication. Admin and user panels.", tech: ["Next.js", "Nest.js", "TypeScript", "PostgreSQL", "Prisma", "Docker", "Tailwind", "Stripe"], github: "https://github.com/Qarib2004/cinefy-project", live_demo: "https://cinefy-project.vercel.app/", status: "Completed" },
//   ];

//   const terminalLines: TerminalLine[] = [
//     { text: "Qarib Alisultanov — Fullstack Developer", prompt: true, color: "#00ff88" },
//     { text: "Location: Baku, Azerbaijan", prompt: false, color: "#64748b" },
//     { text: "Stack: React · Next.js · NestJS · Node.js(Express.js) · PostgreSQL", prompt: false, color: "#0ea5e9" },
//     // { text: "Status: Open to opportunities ✓", prompt: false, color: "#a855f7" },
//   ];

//   const timeStr = time.toTimeString().slice(0, 8);

//   const openModal = (title: string) => { setSelectedProject(title); setModalOpen(true); };
//   const closeModal = () => { setModalOpen(false); setSelectedProject(""); };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         body { background: #020617; color: #94a3b8; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: #020617; }
//         ::-webkit-scrollbar-thumb { background: #00ff8840; border-radius: 2px; }
//         ::-webkit-scrollbar-thumb:hover { background: #00ff88; }

//         @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
//         @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes glow { 0%,100%{text-shadow:0 0 20px #00ff8880} 50%{text-shadow:0 0 40px #00ff88,0 0 60px #00ff8840} }
//         @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
//         @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }

//         .glitch { color: #00ff88; }
//         .glitch::before, .glitch::after { content: attr(data-text); position:absolute; top:0; left:0; }
//         .glitch::before { color:#0ea5e9; animation:glitch1 3s infinite; clip-path:polygon(0 30%,100% 30%,100% 50%,0 50%); }
//         .glitch::after { color:#a855f7; animation:glitch2 3s infinite; clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%); }
//         @keyframes glitch1 { 0%,90%,100%{transform:translateX(0)} 92%{transform:translateX(-4px)} 96%{transform:translateX(4px)} }
//         @keyframes glitch2 { 0%,88%,100%{transform:translateX(0)} 90%{transform:translateX(4px)} 94%{transform:translateX(-4px)} }

//         .hero-bg {
//           background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,255,136,0.08) 0%, transparent 60%),
//                       radial-gradient(ellipse 50% 40% at 80% 80%, rgba(14,165,233,0.06) 0%, transparent 50%),
//                       radial-gradient(ellipse 40% 30% at 20% 80%, rgba(168,85,247,0.05) 0%, transparent 50%),
//                       #020617;
//         }
//         .section-bg { background: #030912; }
//         .grid-bg {
//           background-image: linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
//                             linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
//           background-size: 40px 40px;
//         }
//         .nav-glass {
//           background: rgba(2,6,23,0.85);
//           backdrop-filter: blur(20px);
//           border-bottom: 1px solid rgba(0,255,136,0.08);
//         }
//         .section-title {
//           font-family: 'Space Mono', monospace;
//           font-size: clamp(28px, 5vw, 48px);
//           color: #f8fafc;
//           letter-spacing: -0.02em;
//         }
//         .animate-float { animation: float 4s ease-in-out infinite; }
//         .animate-glow { animation: glow 2s ease-in-out infinite; }
//       `}</style>

//       <MatrixRain />

//       {/* Image modal */}
//       <ImageModal
//         isOpen={modalOpen}
//         onClose={closeModal}
//         projectTitle={selectedProject}
//         images={projectImages[selectedProject] || []}
//       />

//       {/* Navigation */}
//       <nav className="nav-glass" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
//           <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 15, color: "#00ff88", display: "flex", alignItems: "center", gap: 12 }}>
//             <span style={{ color: "#1e293b" }}>{">"}</span>
//             <span style={{ animation: "glow 3s ease-in-out infinite" }}>QA</span>
//             <span style={{ color: "#1e293b", fontSize: 12 }}>|</span>
//             <span style={{ color: "#334155", fontSize: 11 }}>{timeStr}</span>
//           </div>
//           <div style={{ display: "flex", gap: 4 }}>
//             {(["about", "skills", "projects", "contact"] as const).map((id) => (
//               <NavLink key={id} label={id} target={id} />
//             ))}
//           </div>
//         </div>
//       </nav>

//       {/* ── Hero ── */}
//       <section className="hero-bg grid-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: 60 }}>
//         <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #00ff8830, transparent)", top: `${scanLine}%`, pointerEvents: "none" }} />
//         <div style={{ position: "absolute", top: 20, left: 20, width: 60, height: 60, borderTop: "1px solid #00ff8830", borderLeft: "1px solid #00ff8830" }} />
//         <div style={{ position: "absolute", top: 20, right: 20, width: 60, height: 60, borderTop: "1px solid #00ff8830", borderRight: "1px solid #00ff8830" }} />
//         <div style={{ position: "absolute", bottom: 20, left: 20, width: 60, height: 60, borderBottom: "1px solid #00ff8830", borderLeft: "1px solid #00ff8830" }} />
//         <div style={{ position: "absolute", bottom: 20, right: 20, width: 60, height: 60, borderBottom: "1px solid #00ff8830", borderRight: "1px solid #00ff8830" }} />

//         <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 900, animation: "fadeUp 0.8s ease forwards" }}>
//           <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32, padding: "6px 16px", border: "1px solid #00ff8830", borderRadius: 2, fontFamily: "monospace", fontSize: 12 }}>
//             <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", display: "inline-block", boxShadow: "0 0 8px #00ff88" }} />
//             <span style={{ color: "#475569" }}>system:</span>
//             <span style={{ color: "#00ff88" }}>online</span>
//             <span style={{ color: "#334155", margin: "0 4px" }}>|</span>
//             <span style={{ color: "#475569" }}>mode:</span>
//             <span style={{ color: "#0ea5e9" }}>available for hire</span>
//           </div>

//           <h1 style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(36px, 8vw, 80px)", lineHeight: 1.1, marginBottom: 16, letterSpacing: "-0.03em" }}>
//             <div style={{ color: "#1e293b", fontSize: "0.4em", fontWeight: 400, marginBottom: 8, letterSpacing: "0.2em" }}>// DEVELOPER</div>
//             <GlitchText text="Qarib" className="animate-glow" />
//             <br />
//             <span style={{ color: "#f8fafc" }}>Alisultanov</span>
//           </h1>

//           <div style={{ fontFamily: "'Fira Code', monospace", fontSize: "clamp(14px, 2.5vw, 20px)", color: "#475569", marginBottom: 40, height: 30 }}>
//             <TypeWriter text="fullstack engineer · building scalable digital experiences" speed={50} onDone={() => setHeroReady(true)} />
//           </div>

//           {heroReady && (
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 48, animation: "fadeUp 0.5s ease forwards" }}>
//               {["React", "Next.js", "NestJS", "Node.js", "PostgreSQL", "TypeScript", "Docker", "Redis"].map((t, i) => (
//                 <span key={t} style={{
//                   fontFamily: "monospace", fontSize: 12, padding: "4px 12px",
//                   border: "1px solid #1e293b", borderRadius: 2, color: "#64748b",
//                   animation: `slideIn 0.4s ease ${i * 80}ms both`,
//                   transition: "all 0.2s",
//                 }}
//                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#00ff88"; (e.currentTarget as HTMLElement).style.borderColor = "#00ff8840"; (e.currentTarget as HTMLElement).style.background = "#00ff8808"; }}
//                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#64748b"; (e.currentTarget as HTMLElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
//                 >{t}</span>
//               ))}
//             </div>
//           )}

//           <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
//             <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} style={{
//               padding: "12px 32px", background: "transparent", border: "1px solid #00ff88",
//               color: "#00ff88", fontFamily: "'Fira Code', monospace", fontSize: 14, cursor: "pointer",
//               borderRadius: 2, transition: "all 0.3s",
//             }}
//               onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#00ff88"; (e.currentTarget as HTMLButtonElement).style.color = "#020617"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px #00ff8840"; }}
//               onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#00ff88"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
//             >ls ./projects</button>
//             <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{
//               padding: "12px 32px", background: "transparent", border: "1px solid #1e293b",
//               color: "#475569", fontFamily: "'Fira Code', monospace", fontSize: 14, cursor: "pointer",
//               borderRadius: 2, transition: "all 0.3s",
//             }}
//               onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#0ea5e9"; (e.currentTarget as HTMLButtonElement).style.color = "#0ea5e9"; }}
//               onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}
//             >./contact.sh</button>
//           </div>
//         </div>

//         <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", animation: "float 2s ease-in-out infinite", textAlign: "center" }}>
//           <div style={{ fontFamily: "monospace", fontSize: 11, color: "#334155", marginBottom: 8 }}>scroll_down</div>
//           <div style={{ color: "#334155", fontSize: 20 }}>↓</div>
//         </div>
//       </section>

//       {/* ── About ── */}
//       <section id="about" className="section-bg" style={{ padding: "100px 24px" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//           <div style={{ marginBottom: 60 }}>
//             <div style={{ fontFamily: "monospace", fontSize: 12, color: "#334155", marginBottom: 12 }}>// 01. about</div>
//             <h2 className="section-title"><span style={{ color: "#00ff88" }}>whoami</span></h2>
//             <div style={{ width: 60, height: 1, background: "#00ff88", marginTop: 16 }} />
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
//             <div>
//               <Terminal title="~/.profile" lines={terminalLines} />
//               <div style={{ marginTop: 24, padding: "20px 24px", border: "1px solid #0f172a", borderLeft: "2px solid #00ff88", fontFamily: "'Fira Code', monospace", fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
//                 <span style={{ color: "#334155" }}>// </span>
//                 Passionate fullstack developer studying Information Technology at Azerbaijan University of Architecture and Construction. I build full-stack applications from the ground up — both client and server — with attention to performance, architecture, and developer experience.
//               </div>
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               {[
//                 { label: "education", value: "Code Academy — Software Engineering (MERN)", icon: "📚", color: "#0ea5e9" },
//                 { label: "location", value: "Yasamal, Baku, Azerbaijan 🇦🇿", icon: "📍", color: "#00ff88" },
//                 { label: "commitment", value: "100% — always pushing to learn more", icon: "⚡", color: "#a855f7" },
//                 { label: "focus", value: "Scalable web apps, clean architecture, DX", icon: "🎯", color: "#f59e0b" },
//               ].map(({ label, value, icon, color }) => (
//                 <div key={label} style={{ padding: "18px 20px", background: "#020617", border: "1px solid #0f172a", borderRadius: 4, display: "flex", alignItems: "flex-start", gap: 16, transition: "border-color 0.2s, transform 0.2s" }}
//                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}40`; (e.currentTarget as HTMLElement).style.transform = "translateX(4px)"; }}
//                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#0f172a"; (e.currentTarget as HTMLElement).style.transform = "translateX(0)"; }}
//                 >
//                   <span style={{ fontSize: 20, marginTop: 1 }}>{icon}</span>
//                   <div>
//                     <div style={{ fontFamily: "monospace", fontSize: 11, color: "#334155", marginBottom: 4 }}>→ {label}</div>
//                     <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: "#94a3b8" }}>{value}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── Skills ── */}
//       <section id="skills" style={{ background: "#020617", padding: "100px 24px" }} className="grid-bg">
//         <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//           <div style={{ marginBottom: 60 }}>
//             <div style={{ fontFamily: "monospace", fontSize: 12, color: "#334155", marginBottom: 12 }}>// 02. skills</div>
//             <h2 className="section-title"><span style={{ color: "#0ea5e9" }}>tech_stack</span></h2>
//             <div style={{ width: 60, height: 1, background: "#0ea5e9", marginTop: 16 }} />
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
//             {[
//               { title: "frontend", skills: skills.frontend, color: "#00ff88", icon: "⬡", desc: "Client-side interfaces & UX" },
//               { title: "backend", skills: skills.backend, color: "#0ea5e9", icon: "⚙", desc: "Server, APIs & databases" },
//               { title: "tools & devops", skills: skills.tools, color: "#a855f7", icon: "◈", desc: "Development & deployment" },
//             ].map(({ title, skills: sk, color, icon, desc }) => (
//               <div key={title} style={{ background: "#030912", border: "1px solid #0f172a", borderRadius: 8, padding: "28px", transition: "border-color 0.3s" }}
//                 onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${color}30`}
//                 onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#0f172a"}
//               >
//                 <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
//                   <span style={{ fontSize: 20, color }}>{icon}</span>
//                   <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, color: "#f8fafc" }}>{title}</span>
//                 </div>
//                 <div style={{ fontFamily: "monospace", fontSize: 11, color: "#334155", marginBottom: 24 }}>// {desc}</div>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                   {sk.map((name, i) => <SkillChip key={name} name={name} delay={i * 60} />)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── Projects ── */}
//       <section id="projects" className="section-bg" style={{ padding: "100px 24px" }}>
//         <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//           <div style={{ marginBottom: 60 }}>
//             <div style={{ fontFamily: "monospace", fontSize: 12, color: "#334155", marginBottom: 12 }}>// 03. projects</div>
//             <h2 className="section-title"><span style={{ color: "#a855f7" }}>featured_work</span></h2>
//             <div style={{ width: 60, height: 1, background: "#a855f7", marginTop: 16 }} />
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>
//             {projects.map((project, i) => (
//               <ProjectCard
//                 key={project.title}
//                 project={project}
//                 index={i}
//                 hasImages={!!projectImages[project.title]}
//                 onViewImages={openModal}
//               />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── Contact ── */}
//       <section id="contact" style={{ background: "#020617", padding: "100px 24px" }} className="grid-bg">
//         <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//           <div style={{ marginBottom: 60 }}>
//             <div style={{ fontFamily: "monospace", fontSize: 12, color: "#334155", marginBottom: 12 }}>// 04. contact</div>
//             <h2 className="section-title"><span style={{ color: "#f59e0b" }}>get_in_touch</span></h2>
//             <div style={{ width: 60, height: 1, background: "#f59e0b", marginTop: 16 }} />
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
//             <div>
//               <p style={{ fontFamily: "'Fira Code', monospace", fontSize: 14, color: "#475569", lineHeight: 1.8, marginBottom: 32 }}>
//                 <span style={{ color: "#334155" }}>/*<br /></span>
//                 &nbsp;* I'm always open to discussing new opportunities,<br />
//                 &nbsp;* interesting projects, or just connecting.<br />
//                 &nbsp;* Let's build something great together.<br />
//                 <span style={{ color: "#334155" }}>&nbsp;*/</span>
//               </p>
//               <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                 {[
//                   { icon: "✉", label: "email", value: "garibalisultanov@gmail.com", href: "mailto:garibalisultanov@gmail.com", color: "#00ff88" },
//                   { icon: "📱", label: "phone", value: "+994 77 611 28 88", href: "tel:+994776112888", color: "#0ea5e9" },
//                   { icon: "📍", label: "location", value: "Yasamal, Baku, Azerbaijan", color: "#a855f7" },
//                 ].map(({ icon, label, value, href, color }) => (
//                   <div key={label} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "#030912", border: "1px solid #0f172a", borderRadius: 4, transition: "border-color 0.2s" }}
//                     onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${color}40`}
//                     onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#0f172a"}
//                   >
//                     <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{icon}</span>
//                     <div>
//                       <div style={{ fontFamily: "monospace", fontSize: 10, color: "#334155", marginBottom: 2 }}>{label}</div>
//                       {href
//                         ? <a href={href} style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color, textDecoration: "none" }}>{value}</a>
//                         : <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: "#94a3b8" }}>{value}</span>
//                       }
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <Terminal title="send_message.sh" lines={[
//                 { text: "Initializing connection...", prompt: true, color: "#475569" },
//                 { text: "→ GitHub: github.com/Qarib2004", prompt: false, color: "#00ff88" },
//                 { text: "→ LinkedIn: Garib Alisultanov", prompt: false, color: "#0ea5e9" },
//                 { text: "→ Email: garibalisultanov@gmail.com", prompt: false, color: "#a855f7" },
//                 { text: "Ready. Awaiting your message...", prompt: false, color: "#f59e0b" },
//               ]} />
//               <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
//                 {[
//                   { label: "github", href: "https://github.com/Qarib2004", color: "#f8fafc" },
//                   { label: "linkedin", href: "https://www.linkedin.com/in/garib-alisultanov-115816325", color: "#0ea5e9" },
//                   { label: "email", href: "mailto:garibalisultanov@gmail.com", color: "#00ff88" },
//                 ].map(({ label, href, color }) => (
//                   <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
//                     flex: 1, textAlign: "center", padding: "12px", border: "1px solid #1e293b",
//                     color: "#475569", textDecoration: "none", fontFamily: "monospace", fontSize: 13,
//                     borderRadius: 4, transition: "all 0.2s",
//                   }}
//                     onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}40`; (e.currentTarget as HTMLAnchorElement).style.color = color; (e.currentTarget as HTMLAnchorElement).style.background = `${color}08`; }}
//                     onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1e293b"; (e.currentTarget as HTMLAnchorElement).style.color = "#475569"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
//                   >./{label}</a>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer style={{ background: "#030912", borderTop: "1px solid #0f172a", padding: "32px 24px", textAlign: "center" }}>
//         <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 12, color: "#1e293b" }}>
//           <span style={{ color: "#00ff88" }}>Qarib Alisultanov</span>
//           {" · "}
//           <span>built with React & 💚</span>
//           {" · "}
//           <span>© 2025</span>
//         </div>
//       </footer>
//     </>
//   );
// }











// import {
//   Github,
//   Linkedin,
//   Mail,
//   Phone,
//   MapPin,
//   ExternalLink,
//   Code,
//   Database,
//   Server,
//   Globe,
//   Monitor,
//   Eye,
// } from "lucide-react";
// import { useState } from "react";
// import ProjectModal from "./ProjectModal";

// function App() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedProject, setSelectedProject] = useState<string>("");

//   const skills = {
//     frontend: [
//       { name: "React", level: "" },
//       { name: "TypeScript", level: "" },
//       { name: "JavaScript", level: "" },
//       { name: "Next.js", level: "" },
//       { name: "HTML/CSS", level: "" },
//       { name: "Tailwind CSS", level: "" },
//       // { name: "Redux", level: "" },
//       // { name: "Shadcn", level: ""},
//       { name: "Zustand", level: "" },
//       { name: "TanStack Query", level: "" },
//     ],
//     backend: [
//       // { name: "Java", level: "" },
//       // { name: "Spring Boot", level: "" },
//       { name: "Node.js", level: "" },
//       { name: "Nest.js", level: "" },
//       { name: "PostgreSQL", level: "" },
//       { name: "MongoDB", level: "" },
//       { name: "Redis", level: "" },
//       { name: "REST APIs", level: "" },
//       { name: "Kafka", level: "" },
//       // { name: "GraphQL", level: ""}
//     ],
//     tools: [
//       { name: "Git/GitHub", level: "" },
//       { name: "Docker", level: "" },
//       { name: "Postman", level: "" },
//       { name: "Swagger", level: "" },
//       { name: "Vite", level: "" },
//       { name: "npm", level: "" },
//       { name: "Yarn", level: "" },
//       { name: "Bun", level: "" },
//     ],
//   };

//   const projectImages: Record<string, string[]> = {
//     "Reddit Clone": [
//       "/reddit-images/admin panel - community page.png",
//       "/reddit-images/admin panel - content page 2.png",
//       "/reddit-images/admin panel - content page.png",
//       "/reddit-images/admin panel - request moderator page.png",
//       "/reddit-images/moderator panel - reported comment page.png",
//       "/reddit-images/moderator panel - reported post page.png",
//       "/reddit-images/moderator panel.png",
//       "/reddit-images/reddit - community page.png",
//       "/reddit-images/reddit - messages and chats page.png",
//       "/reddit-images/reddit - profile page.png",
//       "/reddit-images/reddit - saved page.png",
//       "/reddit-images/reddit - settings page 2.png",
//       "/reddit-images/reddit - settings page.png",
//       "/reddit-images/reddit-create  ppost page.png",
//       "/reddit-images/reddit-home page.png",
//       "/reddit-images/reddit-login page.png",
//       "/reddit-images/reddit-subscribed page.png",
//       "/reddit-images/responcive desighn 2.png",
//       "/reddit-images/responcive design.png",
//     ],
//     NeoShop: [
//       "/neoshop-images/NeoShop - basket.png",
//       "/neoshop-images/NeoShop - catalog page.png",
//       "/neoshop-images/NeoShop - craete categories page.png",
//       "/neoshop-images/NeoShop - create goods page.png",
//       "/neoshop-images/NeoShop - favorites page.png",
//       "/neoshop-images/NeoShop - home page.png",
//       "/neoshop-images/NeoShop - product page 2.png",
//       "/neoshop-images/NeoShop - product page.png",
//       "/neoshop-images/NeoShop - responcive 2.png",
//       "/neoshop-images/NeoShop - responcive.png",
//       "/neoshop-images/NeoShop - settings store page.png",
//       "/neoshop-images/NeoShop - store categories page.png",
//       "/neoshop-images/NeoShop - store colors page.png",
//       "/neoshop-images/NeoShop - store goods page.png",
//       "/neoshop-images/NeoShop - store statistics page.png",
//       "/neoshop-images/NeoShop- crate colors page.png",
//       "/neoshop-images/NeoShop- login page.png",
//     ],
//     Crix: [
//       "/crix-images/1.png",
//       "/crix-images/2.png",
//       "/crix-images/3.png",
//       "/crix-images/4.png",
//       "/crix-images/5.png",
//       "/crix-images/6.png",
//       "/crix-images/7.png",
//       "/crix-images/8.png",
//       "/crix-images/9.png",
//       "/crix-images/10.png",
//       "/crix-images/11.png",
//       "/crix-images/12.png",
//       "/crix-images/13.png",
//       "/crix-images/14.png",
//       "/crix-images/15.png",
//       "/crix-images/16.png",
//       "/crix-images/17.png",
//       "/crix-images/18.png",
//       "/crix-images/19.png",
//       "/crix-images/20.png",
//       "/crix-images/21.png",
//     ],
//     RentCar: [
//       "/rentcar-images/rent-1.png",
//       "/rentcar-images/rent-2.png",
//       "/rentcar-images/rent-3.png",
//       "/rentcar-images/rent-4.png",
//       "/rentcar-images/rent-5.png",
//       "/rentcar-images/rent-6.png",
//       "/rentcar-images/rent-7.png",
//       "/rentcar-images/rent-8.png",
//       "/rentcar-images/rent-9.png",
//       "/rentcar-images/rent-10.png",
//       "/rentcar-images/rent-11.png",
//       "/rentcar-images/rent-12.png",
//       "/rentcar-images/rent-13.png",
//       "/rentcar-images/rent-14.png",
//       "/rentcar-images/rent-15.png",
//       "/rentcar-images/rent-16.png",
//       "/rentcar-images/rent-17.png",
//     ],
//   };

//   const projects = [
//     {
//       title: "Reddit Clone",
//       description:
//         "Full-featured Reddit clone with user authentication, post creation, voting system, and real-time comments.Panel:admin,moderator,user",
//       tech: [
//         "React",
//         "Node.js",
//         "MongoDB",
//         "Socket.io",
//         "OAuth 2.0 Google",
//         "Nodemailer",
//       ],
//       github: "https://github.com/Qarib2004/reddit",
//       status: "Completed",
//     },
//     {
//       title: "FoodGo",
//       description:
//         "Users can add restaurants and food items to favorites, add food to their basket, and leave reviews for food items.",
//       tech: [
//         "Next.js",
//         "PostgreSQL",
//         "Zustand",
//         "Auth.js",
//         "Tailwind",
//         "Zod",
//         "Prisma",
//       ],
//       github: "https://github.com/Qarib2004/fast-delivery",
//       status: "Completed",
//       deploy: "Vercel,Neon Console",
//       live_demo: "https://fast-delivery-stmn.vercel.app/",
//     },
//     {
//       title: "RentCar",
//       description:
//         "RentCar is a platform where car owners can rent out their vehicles, but first they must submit a request to the admin for approval. During registration, user passwords are securely hashed, and each user receives access and refresh tokens for authentication. Users can choose which car they want to rent. To communicate with the car owner, the platform provides a real-time chat powered by Socket.io, while Kafka is used to deliver real-time notifications. Users can leave reviews only after completing a car rental. The admin has access to all data about cars, users, and requests from users who want to become car owners and list their vehicles for rent.",
//       tech: [
//         "React",
//         "Zustand",
//         "TanStack Query",
//         "Tailwind",
//         "React Hook Form",
//         "zod",
//         "Embla Carousel",
//         "TypeScript",
//         "NestJS",
//         "PostgreSQL",
//         "Prisma",
//         "Socket.io",
//         "Redis",
//         "Stripe",
//         "Docker",
//         "Kafka",
//         "Swagger"
//       ],
//       github: "https://github.com/Qarib2004/rentcar",
//       status: "Completed",
//     },
//     {
//       title: "React Classroom Project",
//       description:
//         "Educational platform for managing classroom activities, assignments, and student-teacher interactions.",
//       tech: ["React", "JavaScript", "Redux", "REST API", "Socket.io"],
//       github: "https://github.com/nurlan1717/react-classroom-project",
//       status: "Completed",
//       live_demo: "https://react-classroom-project.vercel.app/",
//     },
//     // {
//     //   title: "Commerce Backend",
//     //   description:
//     //     "Robust e-commerce backend with Java Spring Boot, featuring product management, user authentication, and order processing.",
//     //   tech: ["Java", "Spring Boot", "PostgreSQL", "JWT"],
//     //   github: "https://github.com/Qarib2004/commerce-back-java",
//     //   status: "Completed",
//     // },
//     {
//       title: "NeoShop",
//       description:
//         "Modern e-commerce platform built with Next.js frontend and Nest.js backend, featuring  product catalog and user management.",
//       tech: [
//         "Next.js",
//         "Nest.js",
//         "TypeScript",
//         "PostgreSQL",
//         "Shadcn",
//         "Google OAuth 2.0",
//         "Prisma",
//         "PostgreSQL",
//         "DOCKER",
//         "TailwindCSS",
//         " Stripe",
//         "Jest",
//         "React Testing Library",
//       ],
//       github: "https://github.com/Qarib2004/NeoShop",
//       status: "Completed",
//     },
//     {
//       title: "Cinefy",
//       description:
//         "A modern movie streaming platform built with Next.js (frontend) and Nest.js (backend). Features include movie catalog, genre-based browsing, user authentication.Panel:admin,user.",
//       tech: [
//         "Next.js",
//         "Nest.js",
//         "TypeScript",
//         "PostgreSQL",
//         "Prisma",
//         "Docker",
//         "TailwindCSS",
//         "Stripe",
//       ],
//       github: "https://github.com/Qarib2004/cinefy-project",
//       status: "Completed",
//       deploy: "Frontend:Vercel,Backend:Render,Database:Neon Console",
//       live_demo: "https://cinefy-project.vercel.app/",
//     },
//     // {
//     //   title: "DeliVery",
//     //   description:
//     //     "Features include login, registration, token-based authentication, shopping basket, favorites, search functionality, category details page, and product details page.",
//     //   tech: [
//     //     "React Native",
//     //     "Nest.js",
//     //     "TypeScript",
//     //     "PostgreSQL",
//     //     "Prisma",
//     //     "Nativewind",
//     //   ],
//     //   github: "https://github.com/Qarib2004/DeliVery",
//     //   status: "Completed",
//     // },
//     // {
//     //   title: "musify-backend",
//     //   description:"Musify is a music platform that allows you to:register users and manage roles (USER, ADMIN), upload and store albums and songs with cover images and audio files,store media files (images, audio) in Cloudinary, manage API access with Spring Security and JWT authentication,retrieve a list of albums and songs, as well as delete them.",
//     //   tech: [
//     //     "Spring Boot",
//     //     "Spring Security",
//     //     "MongoDB",
//     //     "JWT",
//     //     "Cloudinary"
//     //   ],
//     //   github: "https://github.com/Qarib2004/musify-backend",
//     //   status: "Completed"
//     // },
//     // {
//     //   title: "Crix",
//     //   description:
//     //     "I will implement the ability to conduct live broadcasts by adding a subscription system, including premium subscriptions to streamers. There will also be a chat for the stream and full profile settings: display name, information about yourself, specifying social networks and editing the password and email. Users will be able to customize the site by changing the theme, main color and interface language (Azerbaijani, Russian, English). I will create a full functionality Telegram bot that will notify users about new streams on the channels they are subscribed to, and will also allow you to view your profile.",
//     //   tech: [
//     //     " Nest.js",
//     //     "GraphQL",
//     //     "Prisma",
//     //     "PostgreSQL",
//     //     "Redis",
//     //     "Docker",
//     //     "Telegraf",
//     //     " React Email",
//     //     " Next.js",
//     //     "Tailwind",
//     //     "Apollo Client",
//     //     " Zustand",
//     //     " React Hook Form",
//     //     "Zod",
//     //     "Kafka"
//     //   ],
//     //   github: "https://github.com/Qarib2004/crix",
//     //   status: "Completed"
//     //  }
//   ];

//   const openModal = (projectTitle: string) => {
//     setSelectedProject(projectTitle);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedProject("");
//   };

//   const scrollToSection = (sectionId: string) => {
//     document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 text-white">
//       {/* Navigation */}
//       <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//               QA
//             </div>
//             <div className="hidden md:flex space-x-8">
//               {["About", "Skills", "Projects", "Contact"].map((item) => (
//                 <button
//                   key={item}
//                   onClick={() => scrollToSection(item.toLowerCase())}
//                   className="text-slate-300 hover:text-white transition-colors duration-300 font-medium"
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-emerald-900/20"></div>
//         <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
//           <div className="animate-fade-in-up">
//             <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
//               <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
//                 Qarib Alisultanov
//               </span>
//             </h1>
//             <h2 className="text-2xl md:text-3xl text-slate-300 mb-8 font-medium">
//               Fullstack Developer
//             </h2>
//             <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
//               Passionate about crafting exceptional digital experiences with
//               modern technologies. Specializing in
//               React,Next.js,NestJS,Node.js,Spring Boot, and building scalable
//               web applications.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button
//                 onClick={() => scrollToSection("projects")}
//                 className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold
//                           hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300
//                           shadow-lg hover:shadow-xl"
//               >
//                 View My Work
//               </button>
//               <button
//                 onClick={() => scrollToSection("contact")}
//                 className="px-8 py-4 border-2 border-slate-700 rounded-xl font-semibold
//                           hover:bg-slate-800 hover:border-slate-600 transition-all duration-300"
//               >
//                 Get In Touch
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//           <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
//             <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
//           </div>
//         </div>
//       </section>

//       <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//               About Me
//             </h2>
//             <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div className="space-y-6">
//               <p className="text-lg text-slate-300 leading-relaxed">
//                 I'm a passionate fullstack developer currently pursuing
//                 Information Technology at Azerbaijan University of Architecture
//                 and Construction. With a strong foundation in both frontend and
//                 backend technologies, I love creating innovative solutions that
//                 make a difference.
//               </p>
//               <p className="text-lg text-slate-300 leading-relaxed">
//                 My journey in software development has led me through various
//                 technologies, from building responsive React and Node.js
//                 applications to developing robust backend systems with Java
//                 Spring Boot. I'm always eager to learn new technologies and take
//                 on challenging projects.
//               </p>
//               <div className="flex items-center space-x-2 text-emerald-400">
//                 <MapPin className="w-5 h-5" />
//                 <span className="text-lg">Yasamal, Baku, Azerbaijan</span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
//                 <div className="text-center">
//                   <Code className="w-12 h-12 text-blue-400 mx-auto mb-4" />
//                   <h3 className="text-2xl font-bold text-white mb-2">
//                     Code Academy
//                   </h3>
//                   <p className="text-slate-400">
//                     Completed Software Engineering Diploma (MERN stack)
//                   </p>
//                 </div>
//               </div>

//               {/* <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
//                 <div className="text-center">
//                   <Database className="w-12 h-12 text-purple-400 mx-auto mb-4" />
//                   <h3 className="text-2xl font-bold text-white mb-2">
//                     Codders
//                   </h3>
//                   <p className="text-slate-400">Java Backend Program</p>
//                 </div>
//               </div> */}

//               <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-300">
//                 <div className="text-center">
//                   <Globe className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
//                   <h3 className="text-2xl font-bold text-white mb-2">
//                     Commitment
//                   </h3>
//                   <p className="text-slate-400">100%</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Skills Section */}
//       <section
//         id="skills"
//         className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30"
//       >
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
//               Skills & ise
//             </h2>
//             <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-emerald-500 mx-auto"></div>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Frontend Skills */}
//             <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
//               <div className="flex items-center mb-6">
//                 <Monitor className="w-8 h-8 text-blue-400 mr-3" />
//                 <h3 className="text-2xl font-bold text-white">Frontend</h3>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 {skills.frontend.map((skill, index) => (
//                   <div
//                     key={index}
//                     className="flex flex-col items-center p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 group"
//                   >
//                     <div className="text-center">
//                       <span className="text-slate-200 font-medium text-sm mb-2 block">
//                         {skill.name}
//                       </span>
//                       <div className="flex items-center justify-center gap-2">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                             skill.level === "95%" || skill.level === "90%"
//                               ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
//                               : skill.level === "85%"
//                               ? "bg-blue-400/20 text-blue-300 border border-blue-400/30"
//                               : "bg-blue-300/20 text-blue-300 border border-blue-300/30"
//                           }`}
//                         ></span>
//                         {/* {skill.badge && (
//                           <span
//                             className={`px-2 py-1 text-xs rounded-full ${
//                               skill.badge === "New"
//                                 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
//                                 : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
//                             }`}
//                           >
//                             {skill.badge}
//                           </span>
//                         )} */}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Backend Skills */}
//             <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300">
//               <div className="flex items-center mb-6">
//                 <Server className="w-8 h-8 text-emerald-400 mr-3" />
//                 <h3 className="text-2xl font-bold text-white">Backend</h3>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 {skills.backend.map((skill, index) => (
//                   <div
//                     key={index}
//                     className="flex flex-col items-center p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 group"
//                   >
//                     <div className="text-center">
//                       <span className="text-slate-200 font-medium text-sm mb-2 block">
//                         {skill.name}
//                       </span>
//                       <div className="flex items-center justify-center gap-2">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                             skill.level === "90%" || skill.level === "85%"
//                               ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
//                               : skill.level === "80%"
//                               ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
//                               : "bg-emerald-300/20 text-emerald-300 border border-emerald-300/30"
//                           }`}
//                         >
//                           {skill.level === "90%" || skill.level === "85%"
//                             ? ""
//                             : ""}
//                         </span>
//                         {/* {skill.badge && (
//                           <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
//                             {skill.badge}
//                           </span>
//                         )} */}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Tools & Technologies */}
//             <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
//               <div className="flex items-center mb-6">
//                 <Database className="w-8 h-8 text-purple-400 mr-3" />
//                 <h3 className="text-2xl font-bold text-white">
//                   Tools & DevOps
//                 </h3>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 {skills.tools.map((skill, index) => (
//                   <div
//                     key={index}
//                     className="flex flex-col items-center p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-300 group"
//                   >
//                     <div className="text-center">
//                       <span className="text-slate-200 font-medium text-sm mb-2 block">
//                         {skill.name}
//                       </span>
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           skill.level === "85%" || skill.level === "80%"
//                             ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
//                             : skill.level === "75%"
//                             ? "bg-purple-400/20 text-purple-300 border border-purple-400/30"
//                             : "bg-purple-300/20 text-purple-300 border border-purple-300/30"
//                         }`}
//                       >
//                         {skill.level === "85%" || skill.level === "80%"
//                           ? ""
//                           : ""}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Projects Section */}
//       <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
//               Featured Projects
//             </h2>
//             <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto"></div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-8">
//             {projects.map((project, index) => (
//               <div
//                 key={index}
//                 className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 
//                           hover:border-slate-600/50 transition-all duration-300 group hover:transform hover:scale-105"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
//                     {project.title}
//                   </h3>
//                   <div className="flex items-center gap-2">
//                     <span
//                       className={`px-3 py-1 text-xs rounded-full font-medium ${
//                         project.status === "Completed"
//                           ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
//                           : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
//                       }`}
//                     >
//                       {project.status}
//                     </span>
//                   </div>
//                 </div>

//                 <p className="text-slate-300 mb-6 leading-relaxed">
//                   {project.description}
//                 </p>

//                 <div className="flex flex-wrap gap-2 mb-6">
//                   {project.tech.map((tech, techIndex) => (
//                     <span
//                       key={techIndex}
//                       className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-sm font-medium
//                                hover:bg-slate-600/50 transition-colors duration-300"
//                     >
//                       {tech}
//                     </span>
//                   ))}
//                 </div>

//                 {project.deploy && (
//                   <div className="mb-6 text-sm text-slate-400">
//                     <span className="font-medium text-slate-300">Deploy:</span>{" "}
//                     {project.deploy}
//                   </div>
//                 )}

//                 <div className="flex gap-4">
//                   <a
//                     href={project.github}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300
//                              hover:bg-slate-700/50 px-4 py-2 rounded-lg"
//                   >
//                     <Github className="w-5 h-5" />
//                     <span>GitHub</span>
//                   </a>
//                   {project.live_demo ? (
//                     <a
//                       href={project.live_demo}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300
//            hover:bg-slate-700/50 px-4 py-2 rounded-lg"
//                     >
//                       <ExternalLink className="w-5 h-5" />
//                       <span>Live Demo</span>
//                     </a>
//                   ) : null}

//                   {projectImages[project.title] && (
//                     <button
//                       onClick={() => openModal(project.title)}
//                       className="flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-300
//                hover:bg-blue-600/20 hover:border-blue-500/30 border border-slate-600/30 px-4 py-2 rounded-lg"
//                     >
//                       <Eye className="w-5 h-5" />
//                       <span>View Details</span>
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section
//         id="contact"
//         className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30"
//       >
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
//               Get In Touch
//             </h2>
//             <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto"></div>
//             <p className="text-xl text-slate-400 mt-6 max-w-2xl mx-auto">
//               I'm always open to discussing new opportunities and interesting
//               projects. Let's connect and build something amazing together!
//             </p>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-12">
//             <div className="space-y-8">
//               <div
//                 className="flex items-center space-x-4 p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl 
//                             border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
//               >
//                 <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
//                   <Mail className="w-7 h-7 text-blue-400" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">Email</h3>
//                   <p className="text-slate-300">garibalisultanov@gmail.com</p>
//                 </div>
//               </div>

//               <div
//                 className="flex items-center space-x-4 p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl 
//                             border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300"
//               >
//                 <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
//                   <Phone className="w-7 h-7 text-emerald-400" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">Phone</h3>
//                   <p className="text-slate-300">+994 77 611 28 88</p>
//                 </div>
//               </div>

//               <div
//                 className="flex items-center space-x-4 p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl 
//                             border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300"
//               >
//                 <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
//                   <MapPin className="w-7 h-7 text-purple-400" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">Location</h3>
//                   <p className="text-slate-300">Yasamal, Baku, Azerbaijan</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="text-center md:text-left mb-6 md:mb-0">
//               <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
//                 Qarib Alisultanov
//               </h3>
//               <p className="text-slate-400">Fullstack Developer</p>
//             </div>

//             <div className="flex space-x-6">
//               <a
//                 href="https://github.com/Qarib2004"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center
//                          transition-all duration-300 hover:transform hover:scale-110 group"
//               >
//                 <Github className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors duration-300" />
//               </a>
//               <a
//                 href="https://www.linkedin.com/in/garib-alisultanov-115816325"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center
//                          transition-all duration-300 hover:transform hover:scale-110 group"
//               >
//                 <Linkedin className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
//               </a>
//               <a
//                 href="mailto:garibalisultanov@gmail.com"
//                 className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center
//                          transition-all duration-300 hover:transform hover:scale-110 group"
//               >
//                 <Mail className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors duration-300" />
//               </a>
//             </div>
//           </div>

//           <div className="mt-8 pt-8 border-t border-slate-700/50 text-center">
//             <p className="text-slate-400">
//               © 2025 Qarib Alisultanov. Built with React & Tailwind CSS.
//             </p>
//           </div>
//         </div>
//       </footer>

//       <ProjectModal
//         isOpen={modalOpen}
//         onClose={closeModal}
//         projectTitle={selectedProject}
//         images={
//           projectImages[selectedProject as keyof typeof projectImages] || []
//         }
//       />
//     </div>
//   );
// }

// export default App;
