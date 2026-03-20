'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  researchStreams,
  articles,
  experiments,
  openSourceProjects,
} from '@/lib/labs';

// ─── Constants ───────────────────────────────────────────────

const A = '#7B6FE8';
const F = {
  display: 'var(--font-headline)',
  body: 'var(--font-body)',
  mono: "var(--font-fira,'Fira Code'),monospace",
};

// ─── Data helpers ───────────────────────────────────────────────

const FEATURED_ARTICLES = articles
  .filter((a) => a.featured && a.status === 'published')
  .slice(0, 3);

const PREVIEW_EXPERIMENTS = (() => {
  const failed = experiments.find((e) => e.status === 'failed');
  const completed = experiments.find((e) => e.status === 'completed');
  const running = experiments.find((e) => e.status === 'running');
  return [failed, completed, running].filter(Boolean) as typeof experiments;
})();

const STREAM_LABEL: Record<string, string> = {
  'agent-architecture': 'Agent Architecture',
  'applied-ai': 'Applied AI',
  'developer-tooling': 'Developer Tooling',
  'industry-automation': 'Industry Automation',
};

const PIPELINE_AGENTS = [
  { num: '01', name: 'Spec Agent', role: 'Converts project briefs into structured, reviewable specifications' },
  { num: '02', name: 'Architecture Agent', role: 'Designs system structure, data models, and service boundaries' },
  { num: '03', name: 'Scaffold Agent', role: 'Generates project skeleton — routes, configs, folder structure' },
  { num: '04', name: 'Implementation Agent', role: 'Writes feature code against the architecture specification' },
  { num: '05', name: 'Review Agent', role: 'Code quality, style consistency, and logic validation' },
  { num: '06', name: 'Test Agent', role: 'Generates unit, integration, and regression test suites' },
  { num: '07', name: 'Debug Agent', role: 'Identifies failure causes and proposes targeted fixes' },
  { num: '08', name: 'Documentation Agent', role: 'Writes technical docs, API references, and inline comments' },
  { num: '09', name: 'Deploy Agent', role: 'Configures infrastructure, environment variables, and pipelines' },
  { num: '10', name: 'Monitor Agent', role: 'Observability setup — logging, alerting, uptime tracking' },
];

// ─── Styles ───────────────────────────────────────────────────────────

const STYLES = `
  .lp-hero {
    position: relative; min-height: 100vh; display: flex; align-items: center;
    overflow: hidden; padding: 140px 0 100px; background: var(--bg);
  }
  .lp-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
  .lp-hero-inner { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; text-align: center; }
  .lp-label {
    font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.14em;
    text-transform: uppercase; color: ${A}; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 28px;
  }
  .lp-label::before { content: ''; display: inline-block; width: 20px; height: 1.5px; background: ${A}; flex-shrink: 0; }
  .lp-h1 {
    font-family: ${F.display}; font-size: clamp(2.8rem, 5.5vw, 4.4rem); font-weight: 800;
    line-height: 1.04; letter-spacing: -0.04em; color: var(--text-primary); margin: 0 0 28px;
  }
  .lp-h1 .lp-accent { color: ${A}; }
  .lp-h1 .lp-line { display: block; }
  .lp-sub { font-family: ${F.body}; font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary); margin: 0 auto 40px; max-width: 600px; }
  .lp-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
  .lp-btn-pri {
    font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
    color: #fff; background: ${A}; border: none; border-radius: var(--radius-full); padding: 13px 28px;
    cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
    transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease), background 0.2s;
    box-shadow: 0 4px 20px rgba(123,111,232,0.35);
  }
  .lp-btn-pri:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 32px rgba(123,111,232,0.5); background: #8A7FF0; }
  .lp-btn-ghost {
    font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
    color: var(--text-secondary); background: transparent; border: 1.5px solid var(--border);
    border-radius: var(--radius-full); padding: 13px 28px; cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px; transition: border-color 0.2s, color 0.2s, transform 0.2s;
  }
  .lp-btn-ghost:hover { border-color: ${A}; color: ${A}; transform: translateY(-2px); }
  .lp-section { padding: 100px 0; position: relative; }
  .lp-section-alt { background: var(--bg-2); }
  .lp-wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  .lp-sec-label {
    font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: ${A}; display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .lp-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; flex-shrink: 0; }
  .lp-sec-title { font-family: ${F.display}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary); margin: 0 0 12px; }
  .lp-sec-sub { font-family: ${F.body}; font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary); max-width: 540px; margin: 0 0 52px; }
  .streams-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .stream-card {
    background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg);
    padding: 28px 32px; text-decoration: none; display: block; position: relative; overflow: hidden;
    transition: border-color 0.3s, transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
  }
  .stream-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: ${A}; opacity: 0; transition: opacity 0.3s;
  }
  .stream-card:hover { border-color: var(--border-hover); transform: translateY(-4px); box-shadow: var(--card-hover-shadow); }
  .stream-card:hover::before { opacity: 1; }
  .stream-card-hd { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
  .stream-card-title { font-family: ${F.display}; font-size: 1.1rem; font-weight: 600; letter-spacing: -0.01em; color: var(--text-primary); margin: 0; }
  .stream-status { font-family: ${F.mono}; font-size: 0.63rem; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; padding: 3px 8px; border-radius: var(--radius-full); flex-shrink: 0; }
  .st-active { background: rgba(123,111,232,0.12); color: ${A}; border: 1px solid rgba(123,111,232,0.2); }
  .st-paused { background: rgba(232,184,77,0.1); color: #E8B84D; border: 1px solid rgba(232,184,77,0.2); }
  .st-completed { background: rgba(89,163,146,0.1); color: #59A392; border: 1px solid rgba(89,163,146,0.2); }
  .stream-tagline { font-family: ${F.body}; font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary); margin: 0 0 20px; }
  .stream-stats { display: flex; gap: 20px; }
  .stream-stat { font-family: ${F.mono}; font-size: 0.73rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px; }
  .stream-stat strong { color: ${A}; font-weight: 600; }
  .oss-panel {
    background: var(--bg-card); border: 1px solid rgba(123,111,232,0.2);
    border-radius: var(--radius-xl); padding: 56px 64px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
  }
  .oss-headline { font-family: ${F.display}; font-size: clamp(1.6rem, 2.8vw, 2.2rem); font-weight: 700; letter-spacing: -0.025em; line-height: 1.2; color: var(--text-primary); margin: 0 0 16px; }
  .oss-desc { font-family: ${F.body}; font-size: 1rem; line-height: 1.7; color: var(--text-secondary); margin: 0 0 28px; }
  .oss-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
  .oss-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .oss-name { font-family: ${F.mono}; font-size: 0.85rem; font-weight: 500; color: var(--text-primary); }
  .oss-cat { font-family: ${F.mono}; font-size: 0.63rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 2px 8px; border-radius: var(--radius-full); background: rgba(123,111,232,0.1); color: ${A}; border: 1px solid rgba(123,111,232,0.15); flex-shrink: 0; }
  .exp-intro { font-family: ${F.body}; font-size: 1rem; line-height: 1.7; color: var(--text-secondary); max-width: 600px; margin: 0 0 24px; }
  .exp-note { display: inline-flex; align-items: center; gap: 8px; background: rgba(220,100,100,0.08); border: 1px solid rgba(220,100,100,0.15); border-radius: var(--radius-md); padding: 10px 16px; margin-bottom: 36px; font-family: ${F.mono}; font-size: 0.7rem; color: #DC6464; letter-spacing: 0.04em; }
  .exp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 36px; }
  .exp-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px 28px; transition: border-color 0.25s; }
  .exp-card:hover { border-color: var(--border-hover); }
  .exp-card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
  .exp-badge { font-family: ${F.mono}; font-size: 0.62rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 8px; border-radius: var(--radius-full); }
  .eb-completed { background: rgba(89,163,146,0.12); color: #59A392; border: 1px solid rgba(89,163,146,0.2); }
  .eb-running { background: rgba(107,163,232,0.12); color: #6BA3E8; border: 1px solid rgba(107,163,232,0.2); }
  .eb-failed { background: rgba(220,100,100,0.12); color: #DC6464; border: 1px solid rgba(220,100,100,0.2); }
  .eb-abandoned { background: rgba(124,141,176,0.1); color: var(--text-muted); border: 1px solid var(--border); }
  .exp-date { font-family: ${F.mono}; font-size: 0.7rem; color: var(--text-muted); }
  .exp-title { font-family: ${F.display}; font-size: 0.95rem; font-weight: 600; line-height: 1.35; color: var(--text-primary); margin: 0 0 8px; }
  .exp-hyp { font-family: ${F.body}; font-size: 0.84rem; line-height: 1.6; color: var(--text-secondary); margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .exp-stream { font-family: ${F.mono}; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
  .pipeline-grid { display: grid; grid-template-columns: repeat(2, 1fr); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; background: var(--bg-card); }
  .pip-item { display: flex; gap: 18px; padding: 22px 28px; border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); transition: background 0.2s; }
  .pip-item:hover { background: var(--bg-2); }
  .pip-item:nth-child(even) { border-right: none; }
  .pip-item:nth-last-child(-n+2) { border-bottom: none; }
  .pip-num { font-family: ${F.mono}; font-size: 0.73rem; font-weight: 600; color: ${A}; opacity: 0.8; flex-shrink: 0; padding-top: 2px; width: 26px; }
  .pip-name { font-family: ${F.display}; font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin: 0 0 4px; letter-spacing: -0.01em; }
  .pip-role { font-family: ${F.body}; font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary); margin: 0; }
  .articles-list { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; background: var(--bg-card); margin-bottom: 32px; }
  .art-row { display: flex; align-items: center; gap: 16px; padding: 20px 28px; border-bottom: 1px solid var(--border); text-decoration: none; transition: background 0.2s; }
  .art-row:last-child { border-bottom: none; }
  .art-row:hover { background: var(--bg-2); }
  .art-dot { width: 7px; height: 7px; border-radius: 50%; background: ${A}; flex-shrink: 0; }
  .art-body { flex: 1; min-width: 0; }
  .art-title { font-family: ${F.display}; font-size: 1rem; font-weight: 600; color: var(--text-primary); letter-spacing: -0.01em; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .art-excerpt { font-family: ${F.body}; font-size: 0.84rem; color: var(--text-secondary); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .art-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
  .art-tag { font-family: ${F.mono}; font-size: 0.63rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: ${A}; background: rgba(123,111,232,0.1); border: 1px solid rgba(123,111,232,0.15); padding: 2px 8px; border-radius: var(--radius-full); }
  .art-time { font-family: ${F.mono}; font-size: 0.68rem; color: var(--text-muted); }
  .stats-bar { display: flex; align-items: stretch; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; background: var(--bg-card); }
  .stat-item { flex: 1; padding: 32px 28px; text-align: center; }
  .stat-divider { width: 1px; background: var(--border); flex-shrink: 0; }
  .stat-num { font-family: ${F.display}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 800; letter-spacing: -0.03em; color: ${A}; line-height: 1; margin-bottom: 6px; }
  .stat-lbl { font-family: ${F.body}; font-size: 0.84rem; color: var(--text-secondary); line-height: 1.4; }
  .lp-cta { background: var(--bg-2); border-top: 1px solid var(--border); }
  .lp-cta-inner { text-align: center; max-width: 560px; margin: 0 auto; }
  .lp-cta-title { font-family: ${F.display}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.12; color: var(--text-primary); margin: 0 0 16px; }
  .lp-cta-sub { font-family: ${F.body}; font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary); margin: 0 0 36px; }
  .lp-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  @media (max-width: 1024px) { .lp-section { padding: 80px 0; } .oss-panel { padding: 40px; } }
  @media (max-width: 900px) {
    .streams-grid { grid-template-columns: 1fr; }
    .exp-grid { grid-template-columns: 1fr; }
    .oss-panel { grid-template-columns: 1fr; gap: 36px; padding: 36px 32px; }
  }
  @media (max-width: 768px) {
    .lp-section { padding: 64px 0; } .lp-wrap { padding: 0 20px; } .lp-hero { padding: 120px 0 80px; }
    .pipeline-grid { grid-template-columns: 1fr; }
    .pip-item:nth-child(even) { border-right: 1px solid var(--border); }
    .pip-item:last-child { border-bottom: none; }
    .pip-item:nth-last-child(2) { border-bottom: 1px solid var(--border); }
    .stats-bar { flex-direction: column; } .stat-divider { width: 100%; height: 1px; }
    .art-excerpt { display: none; }
    /* ── Mobile: 1-column card grids ── */
    .streams-grid { grid-template-columns: 1fr; }
    .exp-grid { grid-template-columns: 1fr; }
    /* ── Mobile: center section headers ── */
    .lp-sec-label { justify-content: center; }
    .lp-sec-title { text-align: center; }
    .lp-sec-sub { text-align: center; margin-left: auto; margin-right: auto; }
    .exp-intro { text-align: center; margin-left: auto; margin-right: auto; }
    /* ── Mobile: blog/research cards full-width ── */
    .stream-card { width: 100%; }
  }
  @media (max-width: 480px) {
    .lp-h1 { font-size: 2.4rem; } .oss-panel { padding: 28px 20px; }
    .exp-card { padding: 20px; } .art-row { padding: 16px 20px; }
    .pip-item { padding: 18px 20px; } .stat-item { padding: 24px 16px; }
  }
`;

// ─── Particle Canvas ─────────────────────────────────────────────

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const isMobile = window.innerWidth < 768;
    const CONNECT = 120;
    const COUNT = isMobile ? 15 : 65;
    const SPEED_FACTOR = isMobile ? 0.5 : 1;

    interface Dot {
      x: number; y: number; vx: number; vy: number;
      r: number; pulse: number; pDir: number;
    }

    let dots: Dot[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      dots = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3 * SPEED_FACTOR,
        vy: (Math.random() - 0.5) * 0.3 * SPEED_FACTOR,
        r: Math.random() * 1.6 + 0.7,
        pulse: Math.random(),
        pDir: Math.random() > 0.5 ? 1 : -1,
      }));
    };

    const tick = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((d) => {
        d.x += d.vx; d.y += d.vy; d.pulse += 0.005 * d.pDir;
        if (d.pulse > 1 || d.pulse < 0) d.pDir *= -1;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
      });

      if (!isMobile) {
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECT) {
              const alpha = (1 - dist / CONNECT) * 0.22;
              ctx.beginPath();
              ctx.moveTo(dots[i].x, dots[i].y);
              ctx.lineTo(dots[j].x, dots[j].y);
              ctx.strokeStyle = `rgba(123,111,232,${alpha})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }
      }

      dots.forEach((d) => {
        const a = 0.35 + d.pulse * 0.5;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123,111,232,${a})`;
        ctx.fill();
        const grd = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3.5);
        grd.addColorStop(0, `rgba(123,111,232,${a * 0.3})`);
        grd.addColorStop(1, 'rgba(123,111,232,0)');
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      animId = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas);
    resize();
    init();
    tick();

    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="lp-canvas" aria-hidden="true" />;
}

// ─── Scroll Reveal ────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Arrow Icon ────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────

export default function LabsPage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* 1 — Hero */}
      <section className="lp-hero">
        <ParticleCanvas />
        <div className="lp-wrap" style={{ width: '100%' }}>
          <Reveal>
            <div className="lp-hero-inner">
              <div className="lp-label">SocioFi Labs</div>
              <h1 className="lp-h1">
                <span className="lp-line">Research.</span>
                <span className="lp-line">Build.</span>
                <span className="lp-line">Publish.</span>
                <span className="lp-line lp-accent">Open source.</span>
              </h1>
              <p className="lp-sub">
                Where SocioFi pushes the boundaries of AI-native development. We research
                what&apos;s coming, experiment in public, and release tools the community can use.
              </p>
              <div className="lp-btns">
                <Link href="/labs/research" className="lp-btn-pri">
                  Explore research <ArrowRight />
                </Link>
                <Link href="/labs/blog" className="lp-btn-ghost">
                  Read the blog
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 — Research Streams */}
      <section className="lp-section lp-section-alt">
        <div className="lp-wrap">
          <Reveal>
            <div className="lp-sec-label">Four streams</div>
            <h2 className="lp-sec-title">What we&apos;re investigating.</h2>
            <p className="lp-sec-sub">
              Four sustained research programs — each with its own question, its own experiments,
              and its own published findings.
            </p>
          </Reveal>
          <div className="streams-grid">
            {researchStreams.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.07}>
                <Link href={`/labs/research/${s.slug}`} className="stream-card">
                  <div className="stream-card-hd">
                    <h3 className="stream-card-title">{s.title}</h3>
                    <span className={`stream-status st-${s.status}`}>{s.status}</span>
                  </div>
                  <p className="stream-tagline">{s.tagline}</p>
                  <div className="stream-stats">
                    <span className="stream-stat"><strong>{s.articles}</strong>&nbsp;articles</span>
                    <span className="stream-stat"><strong>{s.experiments}</strong>&nbsp;experiments</span>
                    <span className="stream-stat">since {s.since}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Open Source Teaser */}
      <section className="lp-section">
        <div className="lp-wrap">
          <Reveal>
            <div className="oss-panel">
              <div>
                <div className="lp-sec-label">Open source</div>
                <h2 className="oss-headline">
                  6 open-source tools.<br />Free, forever.
                </h2>
                <p className="oss-desc">
                  Every useful tool that comes out of our research goes back to the community.
                  If we solved a hard problem, you should not have to solve it again.
                </p>
                <Link href="/labs/open-source" className="lp-btn-pri">
                  Browse all repos <ArrowRight />
                </Link>
              </div>
              <ul className="oss-list">
                {openSourceProjects.map((p) => (
                  <li key={p.slug} className="oss-item">
                    <span className="oss-name">{p.name}</span>
                    <span className="oss-cat">{p.category}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 — Experiment Log Preview */}
      <section className="lp-section lp-section-alt">
        <div className="lp-wrap">
          <Reveal>
            <div className="lp-sec-label">Experiment log</div>
            <h2 className="lp-sec-title">We publish everything, including failures.</h2>
            <p className="exp-intro">
              Every experiment gets logged — hypothesis, method, result. Failed experiments
              are as valuable as successes. Probably more.
            </p>
            <div className="exp-note">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Failed experiments are marked — transparency is the point, not the exception.
            </div>
          </Reveal>
          <div className="exp-grid">
            {PREVIEW_EXPERIMENTS.map((exp, i) => (
              <Reveal key={exp.id} delay={i * 0.09}>
                <div className="exp-card">
                  <div className="exp-card-top">
                    <span className={`exp-badge eb-${exp.status}`}>
                      {exp.status === 'failed' ? 'FAILED' : exp.status.toUpperCase()}
                    </span>
                    <span className="exp-date">{exp.ended ?? exp.started}</span>
                  </div>
                  <h3 className="exp-title">{exp.title}</h3>
                  <p className="exp-hyp">{exp.hypothesis}</p>
                  <span className="exp-stream">{STREAM_LABEL[exp.stream] ?? exp.stream}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Link href="/labs/experiments" className="lp-btn-ghost">
              View all experiments <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 5 — The 10-Agent Pipeline */}
      <section className="lp-section">
        <div className="lp-wrap">
          <Reveal>
            <div className="lp-sec-label">How we build</div>
            <h2 className="lp-sec-title">The 10-Agent Pipeline.</h2>
            <p className="lp-sec-sub">
              Every SocioFi project runs through ten specialized AI agents, each with a defined
              role, scope, and handoff protocol — refined across 45 production deployments.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="pipeline-grid">
              {PIPELINE_AGENTS.map((ag) => (
                <div key={ag.num} className="pip-item">
                  <span className="pip-num">{ag.num}</span>
                  <div>
                    <p className="pip-name">{ag.name}</p>
                    <p className="pip-role">{ag.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 — Latest Articles */}
      <section className="lp-section lp-section-alt">
        <div className="lp-wrap">
          <Reveal>
            <div className="lp-sec-label">Latest from the blog</div>
            <h2 className="lp-sec-title">What we&apos;ve been writing.</h2>
          </Reveal>
          <Reveal delay={0.09}>
            <div className="articles-list">
              {FEATURED_ARTICLES.map((art) => (
                <Link key={art.slug} href={`/labs/blog/${art.slug}`} className="art-row">
                  <span className="art-dot" aria-hidden="true" />
                  <div className="art-body">
                    <p className="art-title">{art.title}</p>
                    <p className="art-excerpt">{art.excerpt}</p>
                  </div>
                  <div className="art-meta">
                    <span className="art-tag">{STREAM_LABEL[art.stream] ?? art.stream}</span>
                    <span className="art-time">{art.readTime} min read</span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <Link href="/labs/blog" className="lp-btn-ghost">
              All articles <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 7 — Stats Bar */}
      <section className="lp-section">
        <div className="lp-wrap">
          <Reveal>
            <div className="stats-bar">
              <div className="stat-item">
                <div className="stat-num">4</div>
                <div className="stat-lbl">Active research streams</div>
              </div>
              <div className="stat-divider" aria-hidden="true" />
              <div className="stat-item">
                <div className="stat-num">12+</div>
                <div className="stat-lbl">Open-source repos</div>
              </div>
              <div className="stat-divider" aria-hidden="true" />
              <div className="stat-item">
                <div className="stat-num">3</div>
                <div className="stat-lbl">Products spawned from Labs</div>
              </div>
              <div className="stat-divider" aria-hidden="true" />
              <div className="stat-item">
                <div className="stat-num">100+</div>
                <div className="stat-lbl">Technical articles</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8 — CTA */}
      <section className="lp-section lp-cta">
        <div className="lp-wrap">
          <Reveal>
            <div className="lp-cta-inner">
              <h2 className="lp-cta-title">Follow the research.</h2>
              <p className="lp-cta-sub">
                We publish what we learn — including failures. Subscribe to the newsletter
                or browse the blog.
              </p>
              <div className="lp-cta-btns">
                <Link href="/labs/newsletter" className="lp-btn-pri">
                  Subscribe to newsletter
                </Link>
                <Link href="/labs/blog" className="lp-btn-ghost">
                  Browse the blog
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
