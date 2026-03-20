'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#5BB5E0';
const F = {
  display: 'var(--font-display, Syne)',
  body: 'var(--font-body, Outfit)',
  mono: 'var(--font-mono, "Fira Code")',
};

const STYLES = `
  .sk-wrap { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); font-family: ${F.body}; }

  /* ── Hero ── */
  .sk-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
  .sk-hero-canvas { position: absolute; inset: 0; pointer-events: none; width: 100%; height: 100%; }
  .sk-hero-inner { position: relative; z-index: 2; max-width: 760px; margin: 0 auto; }

  .sk-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 28px; }
  .sk-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: ${A}; flex-shrink: 0; animation: sk-pulse 2s ease-in-out infinite; }
  @keyframes sk-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  .sk-h1 { font-family: ${F.display}; font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary, #fff); margin-bottom: 24px; }
  .sk-grad { background: linear-gradient(135deg, ${A}, #A3DFD2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .sk-sub { font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary, #7C8DB0); max-width: 580px; margin: 0 auto 40px; }

  .sk-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .sk-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 24px rgba(91,181,224,0.25); }
  .sk-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(91,181,224,0.4); }
  .sk-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border: 1.5px solid var(--border, rgba(91,181,224,0.15)); color: var(--text-primary, #fff); border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .sk-btn-ghost:hover { border-color: ${A}; color: ${A}; }

  /* ── Shared section ── */
  .sk-section { padding: 100px 32px; }
  .sk-section-alt { background: var(--bg-2, #111128); }
  .sk-container { max-width: 1200px; margin: 0 auto; }
  .sk-label { display: flex; align-items: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
  .sk-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .sk-h2 { font-family: ${F.display}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .sk-desc { font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary, #7C8DB0); max-width: 580px; }
  .sk-centered { text-align: center; }
  .sk-centered .sk-label { justify-content: center; }
  .sk-centered .sk-desc { margin: 0 auto; }

  /* ── Section split ── */
  .sk-split { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; margin-top: 56px; }
  @media(max-width: 900px) { .sk-split { grid-template-columns: 1fr; gap: 48px; } }

  /* ── Code block ── */
  .sk-code-panel { background: var(--code-bg, #0C0C1D); border: 1px solid var(--code-border, rgba(91,181,224,0.1)); border-radius: 16px; overflow: hidden; }
  .sk-code-bar { display: flex; align-items: center; gap: 8px; padding: 14px 18px; border-bottom: 1px solid var(--code-border, rgba(91,181,224,0.1)); background: rgba(91,181,224,0.04); }
  .sk-code-dot { width: 10px; height: 10px; border-radius: 50%; }
  .sk-code-filename { font-family: ${F.mono}; font-size: 0.72rem; color: var(--text-muted, #4A5578); margin-left: 8px; }
  .sk-code-body { padding: 28px 24px; font-family: ${F.mono}; font-size: 0.82rem; line-height: 1.8; overflow-x: auto; }
  .sk-code-kw { color: #7B6FE8; }
  .sk-code-str { color: #72C4B2; }
  .sk-code-num { color: ${A}; }
  .sk-code-comment { color: var(--text-muted, #4A5578); font-style: italic; }
  .sk-code-attr { color: #E8B84D; }
  .sk-code-line { display: block; }

  /* ── Container diagram ── */
  .sk-cluster { border: 1.5px solid ${A}30; border-radius: 18px; padding: 28px; background: ${A}04; margin-top: 56px; max-width: 680px; margin-left: auto; margin-right: auto; }
  .sk-cluster-label { font-family: ${F.mono}; font-size: 0.65rem; color: ${A}; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .sk-node { border: 1.5px solid ${A}20; border-radius: 14px; padding: 20px; background: ${A}06; margin-bottom: 12px; }
  .sk-node-label { font-family: ${F.mono}; font-size: 0.65rem; color: var(--text-muted, #4A5578); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 14px; }
  .sk-pod { border: 1.5px solid ${A}30; border-radius: 10px; padding: 16px; background: ${A}0A; margin-bottom: 10px; }
  .sk-pod-label { font-family: ${F.mono}; font-size: 0.65rem; color: ${A}; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }
  .sk-containers-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .sk-container-box { border: 1px solid ${A}35; border-radius: 7px; padding: 10px 14px; background: ${A}12; font-family: ${F.mono}; font-size: 0.7rem; color: ${A}; white-space: nowrap; }
  .sk-container-box-dim { border-color: rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: var(--text-muted, #4A5578); }

  /* ── Network stack diagram ── */
  .sk-net-stack { max-width: 600px; margin: 56px auto 0; display: flex; flex-direction: column; align-items: stretch; gap: 0; }
  .sk-net-layer { padding: 22px 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .sk-net-layer-1 { background: linear-gradient(90deg, ${A}18, ${A}0A); border: 1px solid ${A}35; border-radius: 14px 14px 0 0; }
  .sk-net-layer-2 { background: linear-gradient(90deg, ${A}10, ${A}06); border: 1px solid ${A}25; border-left: 1px solid ${A}25; border-right: 1px solid ${A}25; border-top: none; border-bottom: none; }
  .sk-net-layer-3 { background: linear-gradient(90deg, ${A}08, ${A}04); border: 1px solid ${A}20; border-left: 1px solid ${A}20; border-right: 1px solid ${A}20; border-top: none; border-bottom: none; }
  .sk-net-layer-4 { background: linear-gradient(90deg, rgba(255,255,255,0.02), transparent); border: 1px solid rgba(255,255,255,0.07); border-radius: 0 0 14px 14px; border-top: none; }
  .sk-net-arrow { display: flex; justify-content: center; padding: 6px 0; color: ${A}; opacity: 0.5; }
  .sk-net-left { flex: 1; min-width: 140px; }
  .sk-net-num { font-family: ${F.mono}; font-size: 0.65rem; color: ${A}; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
  .sk-net-name { font-family: ${F.display}; font-size: 0.95rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 2px; }
  .sk-net-sub { font-size: 0.8rem; color: var(--text-secondary, #7C8DB0); }
  .sk-net-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .sk-net-tag { font-family: ${F.mono}; font-size: 0.62rem; padding: 3px 9px; border-radius: 4px; background: ${A}12; color: ${A}; border: 1px solid ${A}22; }
  .sk-net-tag-dim { background: rgba(255,255,255,0.03); color: var(--text-muted, #4A5578); border-color: rgba(255,255,255,0.07); }

  /* ── Backup calendar ── */
  .sk-backup-wrap { max-width: 680px; margin: 56px auto 0; }
  .sk-backup-status { display: flex; align-items: center; gap: 10px; font-family: ${F.mono}; font-size: 0.8rem; color: ${A}; margin-bottom: 24px; justify-content: center; }
  .sk-backup-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; flex-shrink: 0; animation: sk-pulse 1.8s ease-in-out infinite; }
  .sk-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
  .sk-cal-header { font-family: ${F.mono}; font-size: 0.6rem; color: var(--text-muted, #4A5578); text-align: center; letter-spacing: 0.06em; text-transform: uppercase; padding-bottom: 6px; }
  .sk-cal-day { aspect-ratio: 1; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); font-family: ${F.mono}; font-size: 0.65rem; color: var(--text-muted, #4A5578); }
  .sk-cal-day.has-daily { border-color: ${A}25; color: var(--text-secondary, #7C8DB0); }
  .sk-cal-day.has-weekly { background: ${A}15; border-color: ${A}40; color: ${A}; }
  .sk-cal-day.today { background: ${A}20; border-color: ${A}60; color: ${A}; font-weight: 700; }
  .sk-cal-day-dot { width: 5px; height: 5px; border-radius: 50%; background: ${A}; }
  .sk-cal-day-dot-weekly { width: 5px; height: 5px; border-radius: 50%; background: #E8B84D; }
  .sk-cal-legend { display: flex; gap: 20px; justify-content: center; margin-top: 16px; flex-wrap: wrap; }
  .sk-cal-legend-item { display: flex; align-items: center; gap: 6px; font-family: ${F.mono}; font-size: 0.62rem; color: var(--text-secondary, #7C8DB0); }
  .sk-cal-legend-dot { width: 8px; height: 8px; border-radius: 50%; }

  /* ── Security grid ── */
  .sk-sec-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 56px; }
  @media(max-width: 700px) { .sk-sec-grid { grid-template-columns: 1fr; } }
  .sk-sec-item { display: flex; gap: 20px; align-items: flex-start; padding: 24px 28px; border-radius: 14px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); transition: all 0.3s; }
  .sk-sec-item:hover { border-color: ${A}25; transform: translateY(-3px); }
  .sk-sec-icon { width: 40px; height: 40px; border-radius: 10px; background: ${A}15; display: flex; align-items: center; justify-content: center; color: ${A}; flex-shrink: 0; }
  .sk-sec-name { font-family: ${F.display}; font-size: 0.9rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 6px; }
  .sk-sec-desc { font-size: 0.84rem; color: var(--text-secondary, #7C8DB0); line-height: 1.55; }

  /* ── Comparison table ── */
  .sk-table-wrap { margin-top: 56px; overflow-x: auto; }
  .sk-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; min-width: 540px; }
  .sk-table th { font-family: ${F.mono}; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 20px; color: var(--text-muted, #4A5578); text-align: left; border-bottom: 1px solid var(--border, rgba(91,181,224,0.08)); }
  .sk-table th:nth-child(2) { color: var(--text-secondary, #7C8DB0); }
  .sk-table th:nth-child(3) { color: ${A}; }
  .sk-table td { padding: 16px 20px; border-bottom: 1px solid var(--border, rgba(91,181,224,0.06)); color: var(--text-secondary, #7C8DB0); vertical-align: middle; }
  .sk-table tr:last-child td { border-bottom: none; }
  .sk-table tr:hover td { background: ${A}05; }
  .sk-table td:first-child { font-family: ${F.display}; font-size: 0.87rem; font-weight: 600; color: var(--text-primary, #fff); }
  .sk-table td:nth-child(2) { font-family: ${F.mono}; font-size: 0.78rem; color: var(--text-muted, #4A5578); }
  .sk-table td:nth-child(3) { font-family: ${F.mono}; font-size: 0.78rem; color: ${A}; }
  .sk-table-incl { display: inline-flex; align-items: center; gap: 6px; color: ${A}; }
  .sk-table-incl-check { width: 14px; height: 14px; }

  /* ── CTA section ── */
  .sk-cta-section { padding: 100px 32px; background: linear-gradient(135deg, ${A}10, var(--bg-2, #111128), ${A}06); text-align: center; }
  .sk-cta-h2 { font-family: ${F.display}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; letter-spacing: -0.025em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .sk-cta-sub { font-size: 1.05rem; color: var(--text-secondary, #7C8DB0); max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }
`;

// ── Reveal utility ──
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ── Hero Canvas ──
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles: { x: number; y: number; vx: number; vy: number; opacity: number; size: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 1200),
        y: Math.random() * (canvas.height || 700),
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.4 + Math.random() * 1.2),
        opacity: 0.08 + Math.random() * 0.22,
        size: 1 + Math.random() * 2.5,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(91,181,224,${p.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="sk-hero-canvas" />;
}

// ── Backup timer ──
function BackupTimer() {
  const [seconds, setSeconds] = useState(47 * 60 + 23);
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const display = m >= 60
    ? `${Math.floor(m / 60)}h ${m % 60}m ago`
    : `${m}m ${s.toString().padStart(2, '0')}s ago`;
  return <span>{display}</span>;
}

// ── Backup Calendar ──
function BackupCalendar() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const total = 30;
  const today = 20;
  const cells: { num: number; isSunday: boolean; isToday: boolean }[] = [];
  // fill leading empties (month starts on Wed = index 3)
  const startDay = 3;
  for (let i = 0; i < startDay; i++) cells.push({ num: 0, isSunday: false, isToday: false });
  for (let d = 1; d <= total; d++) {
    const dayOfWeek = (startDay + d - 1) % 7;
    cells.push({ num: d, isSunday: dayOfWeek === 0, isToday: d === today });
  }
  return (
    <div className="sk-backup-wrap">
      <div className="sk-backup-status">
        <span className="sk-backup-status-dot" />
        Last backup: <BackupTimer />
      </div>
      <div className="sk-cal-grid">
        {days.map(d => <div key={d} className="sk-cal-header">{d}</div>)}
        {cells.map((c, i) => {
          if (c.num === 0) return <div key={`e-${i}`} />;
          let cls = 'sk-cal-day';
          if (c.isToday) cls += ' today';
          else if (c.isSunday) cls += ' has-weekly';
          else if (c.num <= today) cls += ' has-daily';
          return (
            <div key={c.num} className={cls}>
              <span>{c.num}</span>
              {c.isToday && <span className="sk-cal-day-dot" />}
              {!c.isToday && c.isSunday && c.num <= today && <span className="sk-cal-day-dot-weekly" />}
              {!c.isToday && !c.isSunday && c.num <= today && <span className="sk-cal-day-dot" />}
            </div>
          );
        })}
      </div>
      <div className="sk-cal-legend">
        <div className="sk-cal-legend-item">
          <span className="sk-cal-legend-dot" style={{ background: A }} />
          Daily snapshot
        </div>
        <div className="sk-cal-legend-item">
          <span className="sk-cal-legend-dot" style={{ background: '#E8B84D' }} />
          Weekly full backup
        </div>
        <div className="sk-cal-legend-item">
          <span className="sk-cal-legend-dot" style={{ background: '#4ade80' }} />
          Today
        </div>
      </div>
    </div>
  );
}

const ArrowRight = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const ArrowDown = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
  </svg>
);

const CheckIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SECURITY_ITEMS = [
  {
    title: 'Firewall rules',
    desc: 'Only ports your application actually needs are open. Everything else is dropped by default at the network level.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: 'SSH key authentication',
    desc: 'Password logins are disabled on all servers. Access is exclusively via SSH keys — no brute-forceable credentials.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    ),
  },
  {
    title: 'Fail2ban',
    desc: 'Repeated failed login attempts trigger automatic IP bans. Brute force attacks are stopped before they get anywhere.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Unattended security upgrades',
    desc: 'OS-level security patches apply automatically within 24 hours of release. No human intervention needed, no windows left open.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
      </svg>
    ),
  },
  {
    title: 'Encrypted volumes',
    desc: 'All data at rest is encrypted using AES-256. Even if someone physically accessed the hardware, your data is unreadable.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: 'VPC isolation',
    desc: 'Database servers and internal services live on private networking. Only your application can reach them — not the public internet.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: 'Secret management',
    desc: 'Environment variables are injected at runtime, never stored in plain text, never logged, never committed to version control.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    title: 'Rate limiting',
    desc: 'Edge-level rate limiting via Cloudflare absorbs DDoS traffic before it reaches your servers. Your infrastructure stays calm.',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

const COMPARISON_ROWS = [
  { task: 'IaC Setup', self: '~12 hrs/month', managed: 'Included' },
  { task: 'Container Orchestration', self: '~8 hrs/month', managed: 'Included' },
  { task: 'SSL Renewal', self: '~2 hrs/month', managed: 'Included' },
  { task: 'Security Patching', self: '~6 hrs/month', managed: 'Included' },
  { task: 'Backup Management', self: '~4 hrs/month', managed: 'Included' },
  { task: 'Monitoring Setup', self: '~10 hrs/month', managed: 'Included' },
  { task: 'Scaling Config', self: '~5 hrs/month', managed: 'Included' },
  { task: 'Incident Response', self: 'On-call rotation required', managed: 'On-call included' },
];

export default function CloudStackPage() {
  return (
    <main className="sk-wrap">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="sk-hero">
        <HeroCanvas />
        <div className="sk-hero-inner">
          <Reveal>
            <div className="sk-badge">
              <span className="sk-badge-dot" />
              Our Tech Stack
            </div>
            <h1 className="sk-h1">
              The <span className="sk-grad">Infrastructure</span> Behind the Uptime
            </h1>
            <p className="sk-sub">
              Every tool we use is chosen because it earns its place. No over-engineering. No unnecessary complexity. Here&rsquo;s exactly how we run production systems.
            </p>
            <div className="sk-btns">
              <Link href="/cloud/get-hosted" className="sk-btn-primary">
                Get Hosted <ArrowRight />
              </Link>
              <Link href="/cloud/plans" className="sk-btn-ghost">
                See Pricing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 1: Infrastructure as Code ── */}
      <section className="sk-section sk-section-alt">
        <div className="sk-container">
          <Reveal>
            <div className="sk-label">Infrastructure as Code</div>
            <h2 className="sk-h2">Every Server Defined in Code. Not Clicked Into Existence.</h2>
            <p className="sk-desc">
              We use Terraform and Ansible to manage all infrastructure declaratively. That means every server, firewall rule, and DNS record is in version control. Reproducible. Auditable. Recoverable in minutes, not days.
            </p>
          </Reveal>

          <div className="sk-split">
            <Reveal delay={0.08}>
              <div>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-secondary, #7C8DB0)', marginBottom: 20 }}>
                  When your infrastructure is code, rebuilding it from scratch after a catastrophic failure takes the same amount of time as a fresh deploy. We&rsquo;ve tested this.
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-secondary, #7C8DB0)', marginBottom: 20 }}>
                  Terraform handles the &ldquo;what&rdquo; — what servers, what sizes, what networking rules. Ansible handles the &ldquo;how&rdquo; — how those servers are configured, what software is installed, how services are started.
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-secondary, #7C8DB0)' }}>
                  The result: your infrastructure is documented, consistent across environments, and never depends on one engineer&rsquo;s memory.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="sk-code-panel">
                <div className="sk-code-bar">
                  <span className="sk-code-dot" style={{ background: '#ff5f57' }} />
                  <span className="sk-code-dot" style={{ background: '#febc2e' }} />
                  <span className="sk-code-dot" style={{ background: '#28c840' }} />
                  <span className="sk-code-filename">main.tf</span>
                </div>
                <div className="sk-code-body">
                  <code>
                    <span className="sk-code-line"><span className="sk-code-comment"># DigitalOcean Droplet — app server</span></span>
                    <span className="sk-code-line"> </span>
                    <span className="sk-code-line"><span className="sk-code-kw">resource</span> <span className="sk-code-str">&quot;digitalocean_droplet&quot;</span> <span className="sk-code-str">&quot;app&quot;</span> {'{'}</span>
                    <span className="sk-code-line">  <span className="sk-code-attr">name</span>   = <span className="sk-code-str">&quot;sociofi-prod-01&quot;</span></span>
                    <span className="sk-code-line">  <span className="sk-code-attr">size</span>   = <span className="sk-code-str">&quot;s-2vcpu-4gb&quot;</span></span>
                    <span className="sk-code-line">  <span className="sk-code-attr">image</span>  = <span className="sk-code-str">&quot;ubuntu-22-04-x64&quot;</span></span>
                    <span className="sk-code-line">  <span className="sk-code-attr">region</span> = <span className="sk-code-str">&quot;nyc1&quot;</span></span>
                    <span className="sk-code-line">  <span className="sk-code-attr">vpc_uuid</span> = <span className="sk-code-kw">digitalocean_vpc</span>.main.id</span>
                    <span className="sk-code-line">  <span className="sk-code-attr">ssh_keys</span> = [<span className="sk-code-kw">var</span>.ssh_key_id]</span>
                    <span className="sk-code-line">  <span className="sk-code-attr">tags</span>   = [<span className="sk-code-str">&quot;production&quot;</span>, <span className="sk-code-str">&quot;app&quot;</span>]</span>
                    <span className="sk-code-line">{'}'}</span>
                    <span className="sk-code-line"> </span>
                    <span className="sk-code-line"><span className="sk-code-kw">resource</span> <span className="sk-code-str">&quot;digitalocean_firewall&quot;</span> <span className="sk-code-str">&quot;app&quot;</span> {'{'}</span>
                    <span className="sk-code-line">  <span className="sk-code-attr">name</span>        = <span className="sk-code-str">&quot;sociofi-prod-fw&quot;</span></span>
                    <span className="sk-code-line">  <span className="sk-code-attr">droplet_ids</span> = [<span className="sk-code-kw">digitalocean_droplet</span>.app.id]</span>
                    <span className="sk-code-line"> </span>
                    <span className="sk-code-line">  <span className="sk-code-kw">inbound_rule</span> {'{'}</span>
                    <span className="sk-code-line">    <span className="sk-code-attr">protocol</span>         = <span className="sk-code-str">&quot;tcp&quot;</span></span>
                    <span className="sk-code-line">    <span className="sk-code-attr">port_range</span>       = <span className="sk-code-str">&quot;443&quot;</span></span>
                    <span className="sk-code-line">    <span className="sk-code-attr">source_addresses</span> = [<span className="sk-code-str">&quot;0.0.0.0/0&quot;</span>]</span>
                    <span className="sk-code-line">  {'}'}</span>
                    <span className="sk-code-line">{'}'}</span>
                  </code>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Containerization ── */}
      <section className="sk-section">
        <div className="sk-container">
          <Reveal>
            <div className="sk-centered">
              <div className="sk-label">Containerization</div>
              <h2 className="sk-h2">Docker Everywhere. Kubernetes When You Need It.</h2>
              <p className="sk-desc">
                Every application runs in containers. For most products, Docker Compose on a well-provisioned server is the right answer — simpler to debug, easier to understand. When traffic demands it, we graduate to Kubernetes.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="sk-cluster">
              <div className="sk-cluster-label">
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                Kubernetes Cluster
              </div>

              <div className="sk-node">
                <div className="sk-node-label">Node — app-node-01 (4 vCPU / 8GB)</div>

                <div className="sk-pod">
                  <div className="sk-pod-label">Pod — web</div>
                  <div className="sk-containers-row">
                    <div className="sk-container-box">app:latest</div>
                    <div className="sk-container-box">nginx-proxy</div>
                    <div className="sk-container-box">log-shipper</div>
                  </div>
                </div>

                <div className="sk-pod">
                  <div className="sk-pod-label">Pod — workers</div>
                  <div className="sk-containers-row">
                    <div className="sk-container-box">queue-worker</div>
                    <div className="sk-container-box">cron-jobs</div>
                  </div>
                </div>
              </div>

              <div className="sk-node" style={{ opacity: 0.65, marginBottom: 0 }}>
                <div className="sk-node-label">Node — app-node-02 (standby / auto-scale)</div>
                <div className="sk-containers-row">
                  <div className="sk-container-box sk-container-box-dim">Waiting for scale trigger...</div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p style={{ textAlign: 'center', marginTop: 28, fontSize: '0.87rem', color: 'var(--text-secondary, #7C8DB0)', lineHeight: 1.7, maxWidth: 580, margin: '28px auto 0' }}>
              For most clients, a single well-configured node with Docker Compose is simpler and equally reliable. We scale to Kubernetes when your traffic patterns justify it — not before.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 3: Networking ── */}
      <section className="sk-section sk-section-alt">
        <div className="sk-container">
          <Reveal>
            <div className="sk-centered">
              <div className="sk-label">Networking Architecture</div>
              <h2 className="sk-h2">Four Layers. Traffic Flows Down. Problems Stay Out.</h2>
              <p className="sk-desc">
                Every request to your application passes through four layers of infrastructure before reaching your code. Each layer serves a specific purpose.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="sk-net-stack">
              <div className="sk-net-layer sk-net-layer-1">
                <div className="sk-net-left">
                  <div className="sk-net-num">Layer 1</div>
                  <div className="sk-net-name">DNS + CDN</div>
                  <div className="sk-net-sub">Global edge — closest server to your visitor</div>
                </div>
                <div className="sk-net-tags">
                  <span className="sk-net-tag">Cloudflare</span>
                  <span className="sk-net-tag">BunnyCDN</span>
                  <span className="sk-net-tag">DDoS protection</span>
                  <span className="sk-net-tag">Edge cache</span>
                </div>
              </div>

              <div className="sk-net-arrow"><ArrowDown /></div>

              <div className="sk-net-layer sk-net-layer-2">
                <div className="sk-net-left">
                  <div className="sk-net-num">Layer 2</div>
                  <div className="sk-net-name">Load Balancer</div>
                  <div className="sk-net-sub">Distributes traffic across healthy instances</div>
                </div>
                <div className="sk-net-tags">
                  <span className="sk-net-tag">Health checks</span>
                  <span className="sk-net-tag">SSL termination</span>
                  <span className="sk-net-tag">Failover</span>
                </div>
              </div>

              <div className="sk-net-arrow"><ArrowDown /></div>

              <div className="sk-net-layer sk-net-layer-3">
                <div className="sk-net-left">
                  <div className="sk-net-num">Layer 3</div>
                  <div className="sk-net-name">Application Servers</div>
                  <div className="sk-net-sub">Your code, running in containers</div>
                </div>
                <div className="sk-net-tags">
                  <span className="sk-net-tag">Docker containers</span>
                  <span className="sk-net-tag">Private VPC</span>
                  <span className="sk-net-tag">Auto-scale ready</span>
                </div>
              </div>

              <div className="sk-net-arrow"><ArrowDown /></div>

              <div className="sk-net-layer sk-net-layer-4">
                <div className="sk-net-left">
                  <div className="sk-net-num">Layer 4</div>
                  <div className="sk-net-name">Database + Cache</div>
                  <div className="sk-net-sub">Isolated on private networking — never public</div>
                </div>
                <div className="sk-net-tags">
                  <span className="sk-net-tag sk-net-tag-dim">PostgreSQL</span>
                  <span className="sk-net-tag sk-net-tag-dim">Redis</span>
                  <span className="sk-net-tag sk-net-tag-dim">S3-compatible storage</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 4: Backup Architecture ── */}
      <section className="sk-section">
        <div className="sk-container">
          <Reveal>
            <div className="sk-centered">
              <div className="sk-label">Backup Architecture</div>
              <h2 className="sk-h2">Data Loss Is Not Acceptable. So We Treat It That Way.</h2>
              <p className="sk-desc">
                Three layers of backup protection, running automatically. Every day. Every week. Across regions on Professional plans and above.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, maxWidth: 860, margin: '48px auto 0' }}>
              {[
                { label: 'Daily snapshots', desc: 'Automated volume snapshots to object storage. 30-day retention.', accent: true },
                { label: 'Weekly full backups', desc: 'Complete database dumps every Sunday at 3am. Separate retention policy.', accent: false },
                { label: 'Cross-region replication', desc: 'Professional+ plans: backups replicate to a second region automatically.', accent: false },
                { label: 'Point-in-time recovery', desc: 'Enterprise: restore your database to any 1-hour window in the past 7 days.', accent: false },
              ].map((item, i) => (
                <Reveal key={item.label} delay={i * 0.07}>
                  <div style={{
                    padding: '24px 24px',
                    borderRadius: 14,
                    background: item.accent ? `${A}12` : 'var(--bg-card, #13132B)',
                    border: `1px solid ${item.accent ? `${A}35` : 'var(--border, rgba(91,181,224,0.08))'}`,
                  }}>
                    <div style={{ fontFamily: F.display, fontSize: '0.9rem', fontWeight: 700, color: item.accent ? A : 'var(--text-primary, #fff)', marginBottom: 8 }}>{item.label}</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary, #7C8DB0)', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <BackupCalendar />
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 5: Security Hardening ── */}
      <section className="sk-section sk-section-alt">
        <div className="sk-container">
          <Reveal>
            <div className="sk-centered">
              <div className="sk-label">Security Hardening</div>
              <h2 className="sk-h2">Eight Layers of Security. Applied to Every Server.</h2>
              <p className="sk-desc">
                These aren&rsquo;t optional add-ons. Every server we manage gets all eight of these configurations applied on day one.
              </p>
            </div>
          </Reveal>

          <div className="sk-sec-grid">
            {SECURITY_ITEMS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="sk-sec-item">
                  <div className="sk-sec-icon">{item.icon}</div>
                  <div>
                    <div className="sk-sec-name">{item.title}</div>
                    <div className="sk-sec-desc">{item.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: Managed vs Self-Managed ── */}
      <section className="sk-section">
        <div className="sk-container">
          <Reveal>
            <div className="sk-centered">
              <div className="sk-label">Honest Comparison</div>
              <h2 className="sk-h2">Managed vs. Self-Managed. What It Actually Costs.</h2>
              <p className="sk-desc">
                Managing infrastructure yourself isn&rsquo;t free — it costs engineering hours. Here&rsquo;s what these tasks realistically take per month.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="sk-table-wrap">
              <table className="sk-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>You manage it</th>
                    <th>SocioFi Cloud</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map(row => (
                    <tr key={row.task}>
                      <td>{row.task}</td>
                      <td>{row.self}</td>
                      <td>
                        <span className="sk-table-incl">
                          <svg className="sk-table-incl-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {row.managed}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <p style={{ marginTop: 28, fontSize: '0.87rem', color: 'var(--text-muted, #4A5578)', lineHeight: 1.7, maxWidth: 640, margin: '28px auto 0', textAlign: 'center' }}>
              At a conservative $75/hr engineering rate, the self-managed column above adds up to roughly $3,500/month in hidden labor cost. Our management fee starts at $149/month.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sk-cta-section">
        <Reveal>
          <div className="sk-label" style={{ justifyContent: 'center', display: 'flex' }}>Get Started</div>
          <h2 className="sk-cta-h2">Ready to Stop Managing Infrastructure?</h2>
          <p className="sk-cta-sub">
            Tell us what you&rsquo;re running and we&rsquo;ll set up everything above — on the right provider, at the right scale, for your budget.
          </p>
          <div className="sk-btns">
            <Link href="/cloud/get-hosted" className="sk-btn-primary">
              Get Hosted <ArrowRight />
            </Link>
            <Link href="/cloud/plans" className="sk-btn-ghost">
              See Pricing
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
