'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ── Constants ──────────────────────────────────────────────────────────────
const A = '#6BA3E8';
const A_DARK = '#3A6DB8';
const F = {
  h: 'var(--font-display, Syne)',
  b: 'var(--font-body, Outfit)',
  m: 'var(--font-mono, "Fira Code")',
};

// ── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
.vt-wrap { background: var(--bg); color: var(--text-primary); min-height: 100vh; font-family: ${F.b}; overflow-x: hidden; }

/* ── Hero ── */
.vt-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; }
.vt-hero-inner { max-width: 800px; margin: 0 auto; text-align: center; position: relative; z-index: 2; }
.vt-canvas { position: absolute; inset: 0; pointer-events: none; }

.vt-badge {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 28px;
}
.vt-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; flex-shrink: 0; }

[data-theme="light"] .vt-badge { color: ${A_DARK}; }
[data-theme="light"] .vt-badge::before { background: ${A_DARK}; }

.vt-h1 {
  font-family: ${F.h}; font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 800;
  line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary);
  margin-bottom: 24px;
}
.vt-gradient-text {
  background: linear-gradient(135deg, #4A85CC, ${A}, #9BC0F0);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
@media (forced-colors: active) { .vt-gradient-text { -webkit-text-fill-color: unset; } }

.vt-sub {
  font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary);
  max-width: 620px; margin: 0 auto 40px;
}
.vt-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px; }
.vt-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; background: linear-gradient(135deg, #4A85CC, ${A});
  color: #fff; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem;
  font-weight: 600; text-decoration: none; transition: all 0.2s;
}
.vt-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(107,163,232,0.35); }
.vt-btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border: 1.5px solid var(--border);
  color: var(--text-primary); border-radius: 100px; font-family: ${F.h};
  font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s;
}
.vt-btn-ghost:hover { border-color: ${A}; color: ${A}; }
.vt-accept-note {
  font-family: ${F.m}; font-size: 0.72rem; color: var(--text-muted);
  letter-spacing: 0.06em; text-align: center;
}

/* CEO quote card */
.vt-ceo-quote {
  margin: 48px auto 0; max-width: 680px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 20px; padding: 32px 36px; text-align: left;
  position: relative;
}
.vt-ceo-quote::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, #4A85CC, ${A});
  border-radius: 20px 20px 0 0;
}
.vt-quote-text {
  font-size: 1rem; line-height: 1.7; color: var(--text-secondary);
  font-style: italic; margin-bottom: 16px;
}
.vt-quote-attr {
  font-family: ${F.m}; font-size: 0.72rem; color: ${A};
  letter-spacing: 0.08em; text-transform: uppercase;
}

/* ── Shared section styles ── */
.vt-section { padding: 100px 32px; background: var(--bg); }
.vt-section-alt { padding: 100px 32px; background: var(--bg-2); }
.vt-container { max-width: 1200px; margin: 0 auto; }
.vt-centered { text-align: center; }
.vt-centered .vt-sec-label { justify-content: center; }
.vt-centered .vt-sec-desc { margin: 0 auto; }

.vt-sec-label {
  display: flex; align-items: center; gap: 10px;
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 14px;
}
.vt-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; flex-shrink: 0; }
[data-theme="light"] .vt-sec-label { color: ${A_DARK}; }
[data-theme="light"] .vt-sec-label::before { background: ${A_DARK}; }

.vt-sec-h2 {
  font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700;
  line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary);
  margin-bottom: 16px;
}
.vt-sec-desc {
  font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary);
  max-width: 560px;
}

/* ── "Not What You Think" clarification cards ── */
.vt-clarify-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
@media (max-width: 900px) { .vt-clarify-grid { grid-template-columns: 1fr; } }
.vt-clarify-card {
  padding: 32px; border-radius: 20px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-left: 3px solid transparent;
  transition: all 0.35s;
}
.vt-clarify-card:hover { border-color: var(--border-hover); border-left-color: ${A}; transform: translateY(-4px); }
.vt-clarify-card-title {
  font-family: ${F.h}; font-size: 1.05rem; font-weight: 700;
  color: var(--text-primary); margin-bottom: 12px;
  display: flex; align-items: center; gap: 10px;
}
.vt-clarify-card-title span {
  font-family: ${F.m}; font-size: 0.72rem; color: ${A};
  padding: 2px 8px; border: 1px solid ${A}30; border-radius: 4px;
}
.vt-clarify-card-body { font-size: 0.9rem; line-height: 1.65; color: var(--text-secondary); }

/* ── Deal Models ── */
.vt-models-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
@media (max-width: 900px) { .vt-models-grid { grid-template-columns: 1fr; } }
.vt-model-card {
  padding: 32px; border-radius: 20px; position: relative; overflow: hidden;
  background: var(--bg-card); border: 1px solid var(--border);
  transition: all 0.35s;
}
.vt-model-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, #4A85CC, ${A});
  opacity: 0; transition: opacity 0.35s;
}
.vt-model-card:hover { border-color: ${A}30; transform: translateY(-4px); box-shadow: 0 16px 48px rgba(107,163,232,0.12); }
.vt-model-card:hover::before { opacity: 1; }
.vt-model-icon {
  width: 48px; height: 48px; border-radius: 12px;
  background: ${A}15; display: flex; align-items: center;
  justify-content: center; color: ${A}; margin-bottom: 20px;
  transition: all 0.3s;
}
.vt-model-card:hover .vt-model-icon { background: ${A}25; box-shadow: 0 0 16px ${A}30; }
.vt-model-name { font-family: ${F.h}; font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.vt-model-tagline { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5; }
.vt-model-terms {
  font-family: ${F.m}; font-size: 0.72rem; color: ${A};
  letter-spacing: 0.04em; margin-bottom: 16px;
  padding: 10px 14px; background: ${A}10; border-radius: 8px;
}
.vt-model-bestfor { font-size: 0.84rem; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5; }
.vt-model-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: ${F.h}; font-size: 0.84rem; font-weight: 600;
  color: ${A}; text-decoration: none; transition: gap 0.2s;
}
.vt-model-link:hover { gap: 10px; }
.vt-models-note {
  text-align: center; margin-top: 28px;
  font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;
}

/* ── Who We're Looking For ── */
.vt-cto-quote {
  max-width: 760px; margin: 0 auto 48px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 20px; padding: 28px 32px;
  position: relative;
}
.vt-cto-quote::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, #4A85CC, ${A});
  border-radius: 20px 20px 0 0;
}

.vt-criteria-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 900px) { .vt-criteria-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .vt-criteria-grid { grid-template-columns: 1fr; } }
.vt-criteria-card {
  padding: 28px; border-radius: 16px;
  background: var(--bg-card); border: 1px solid var(--border);
  transition: all 0.3s;
}
.vt-criteria-card:hover { border-color: ${A}30; transform: translateY(-4px); }
.vt-criteria-icon {
  width: 44px; height: 44px; border-radius: 10px;
  background: ${A}15; display: flex; align-items: center;
  justify-content: center; color: ${A}; margin-bottom: 14px;
}
.vt-criteria-name { font-family: ${F.h}; font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
.vt-criteria-weight {
  font-family: ${F.m}; font-size: 0.7rem; color: ${A};
  letter-spacing: 0.06em; margin-bottom: 10px;
  display: inline-block; padding: 2px 8px;
  background: ${A}12; border-radius: 4px; border: 1px solid ${A}20;
}
.vt-criteria-desc { font-size: 0.84rem; color: var(--text-secondary); line-height: 1.6; }
.vt-criteria-note {
  text-align: center; margin-top: 28px;
  font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;
}
.vt-criteria-cta-row { display: flex; justify-content: center; margin-top: 20px; }

/* ── Portfolio Placeholders ── */
.vt-portfolio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
@media (max-width: 900px) { .vt-portfolio-grid { grid-template-columns: 1fr; } }
@keyframes vt-breathe {
  0%, 100% { transform: scale(0.99); opacity: 0.7; }
  50% { transform: scale(1.01); opacity: 1; }
}
.vt-placeholder-card {
  padding: 48px 32px; border-radius: 20px; text-align: center;
  border: 1.5px dashed ${A}30; background: ${A}06;
  animation: vt-breathe 3s ease-in-out infinite;
}
.vt-placeholder-card:nth-child(2) { animation-delay: 1s; }
.vt-placeholder-card:nth-child(3) { animation-delay: 2s; }
.vt-placeholder-title {
  font-family: ${F.h}; font-size: 1.1rem; font-weight: 600;
  color: var(--text-muted); margin-bottom: 14px;
}
.vt-placeholder-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: ${F.h}; font-size: 0.84rem; font-weight: 600;
  color: ${A}; text-decoration: none; transition: gap 0.2s;
}
.vt-placeholder-link:hover { gap: 10px; }
.vt-portfolio-note {
  text-align: center; margin-top: 24px;
  font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;
}

/* ── Timeline ── */
.vt-timeline { display: flex; align-items: flex-start; gap: 0; margin-top: 56px; position: relative; }
@media (max-width: 768px) { .vt-timeline { flex-direction: column; gap: 0; } }
.vt-timeline::before {
  content: ''; position: absolute; top: 28px; left: 0; right: 0; height: 1.5px;
  background: linear-gradient(90deg, ${A}40, ${A}20);
}
@media (max-width: 768px) { .vt-timeline::before { display: none; } }
.vt-timeline-step { flex: 1; text-align: center; padding: 0 12px; position: relative; }
@media (max-width: 768px) { .vt-timeline-step { display: flex; gap: 20px; text-align: left; padding: 0 0 32px 0; } }
.vt-timeline-dot {
  width: 56px; height: 56px; border-radius: 50%;
  background: linear-gradient(135deg, #4A85CC, ${A});
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; position: relative; z-index: 1;
  font-family: ${F.m}; font-size: 0.72rem; color: #fff;
  font-weight: 600; letter-spacing: 0.04em;
  flex-shrink: 0;
}
@media (max-width: 768px) { .vt-timeline-dot { margin: 0; } }
.vt-timeline-step-body { flex: 1; }
.vt-timeline-label {
  font-family: ${F.h}; font-size: 0.95rem; font-weight: 700;
  color: var(--text-primary); margin-bottom: 4px;
}
.vt-timeline-day {
  font-family: ${F.m}; font-size: 0.7rem; color: ${A};
  letter-spacing: 0.06em;
}
.vt-timeline-note { margin-top: 28px; text-align: center; font-size: 0.9rem; color: var(--text-muted); }

/* ── What You Get checklist ── */
.vt-checklist { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 48px; }
@media (max-width: 700px) { .vt-checklist { grid-template-columns: 1fr; } }
.vt-check-item { display: flex; align-items: flex-start; gap: 14px; }
.vt-check-icon { color: ${A}; flex-shrink: 0; margin-top: 2px; }
.vt-check-content {}
.vt-check-title { font-family: ${F.h}; font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
.vt-check-desc { font-size: 0.87rem; color: var(--text-secondary); line-height: 1.6; }
.vt-checklist-note {
  margin-top: 28px; padding: 20px 24px; border-radius: 12px;
  background: ${A}08; border: 1px solid ${A}20;
  font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;
  text-align: center;
}

/* ── Calculator CTA ── */
.vt-calc-section { padding: 80px 32px; background: var(--bg-2); }
.vt-calc-inner {
  max-width: 680px; margin: 0 auto; text-align: center;
  padding: 48px; border-radius: 24px;
  background: linear-gradient(135deg, ${A}10, var(--bg-card));
  border: 1px solid ${A}25;
}
.vt-calc-h2 {
  font-family: ${F.h}; font-size: clamp(1.6rem, 2.5vw, 2rem); font-weight: 700;
  color: var(--text-primary); margin-bottom: 14px; letter-spacing: -0.02em;
}
.vt-calc-desc { font-size: 1rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 28px; }

/* ── Ecosystem ── */
.vt-ecosystem { margin-top: 48px; max-width: 800px; margin-left: auto; margin-right: auto; }
.vt-eco-flow { display: flex; align-items: center; gap: 0; flex-wrap: wrap; justify-content: center; margin-top: 36px; }
.vt-eco-node {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 20px 16px; min-width: 120px;
}
.vt-eco-node-icon {
  width: 48px; height: 48px; border-radius: 12px;
  background: ${A}15; display: flex; align-items: center;
  justify-content: center; color: ${A}; margin-bottom: 10px; border: 1px solid ${A}20;
}
.vt-eco-node-name { font-family: ${F.h}; font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.vt-eco-node-detail { font-family: ${F.m}; font-size: 0.68rem; color: ${A}; letter-spacing: 0.04em; }
.vt-eco-arrow { color: ${A}; opacity: 0.5; display: flex; align-items: center; padding: 0 4px; }

/* ── Final CTA ── */
.vt-final-cta { padding: 100px 32px; background: linear-gradient(135deg, ${A}12, var(--bg-2), ${A}08); text-align: center; }
.vt-cta-h2 {
  font-family: ${F.h}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700;
  color: var(--text-primary); margin-bottom: 16px; letter-spacing: -0.025em;
}
.vt-cta-sub { font-size: 1.05rem; color: var(--text-secondary); max-width: 500px; margin: 0 auto 36px; line-height: 1.7; }
.vt-cta-note {
  margin-top: 20px; font-family: ${F.m}; font-size: 0.72rem;
  color: var(--text-muted); letter-spacing: 0.06em;
}
.vt-cta-quote {
  max-width: 600px; margin: 48px auto 0;
  border-top: 1px solid var(--border); padding-top: 32px;
  text-align: left;
}
.vt-cta-quote-text {
  font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary);
  font-style: italic; margin-bottom: 12px;
}
.vt-cta-quote-attr { font-family: ${F.m}; font-size: 0.7rem; color: ${A}; letter-spacing: 0.08em; text-transform: uppercase; }

@media (max-width: 768px) {
  .vt-hero { padding: 120px 20px 80px; }
  .vt-section, .vt-section-alt { padding: 80px 20px; }
  .vt-final-cta { padding: 80px 20px; }
  .vt-calc-section { padding: 60px 20px; }
  .vt-calc-inner { padding: 32px 24px; }
  .vt-ceo-quote { padding: 24px; }
}
`;

// ── Scroll Reveal component ────────────────────────────────────────────────
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

// ── Rising Particles Canvas ────────────────────────────────────────────────
function RisingParticles() {
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
    type Dot = { x: number; y: number; speed: number; opacity: number; size: number };
    const dots: Dot[] = [];
    for (let i = 0; i < 70; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.3,
        size: 1 + Math.random() * 2,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.y -= d.speed;
        if (d.y < 0) { d.y = canvas.height; d.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(107,163,232,${d.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="vt-canvas" style={{ width: '100%', height: '100%' }} />;
}

// ── Arrow Right SVG ────────────────────────────────────────────────────────
const ArrowRight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Check SVG ─────────────────────────────────────────────────────────────
const Check = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Deal Model icons ────────────────────────────────────────────────────────
const IconPieChart = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);

const IconTrendingUp = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconSplitArrows = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12" />
    <polyline points="9 6 3 12 9 18" />
    <polyline points="15 6 21 12 15 18" />
  </svg>
);

// ── Criteria icons ────────────────────────────────────────────────────────
const IconTarget = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconChecklist = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <polyline points="3 6 4 7 6 5" /><polyline points="3 12 4 13 6 11" /><polyline points="3 18 4 19 6 17" />
  </svg>
);

const IconDollar = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconCode = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconRocket = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

// ── Ecosystem icons ───────────────────────────────────────────────────────
const IconBuild = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="12" y2="17" />
  </svg>
);

const IconCloud = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const IconShield = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconAgents = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" /><circle cx="3" cy="5" r="2" /><circle cx="21" cy="5" r="2" /><circle cx="3" cy="19" r="2" /><circle cx="21" cy="19" r="2" />
    <line x1="5" y1="6" x2="10" y2="10" /><line x1="19" y1="6" x2="14" y2="10" /><line x1="5" y1="18" x2="10" y2="14" /><line x1="19" y1="18" x2="14" y2="14" />
  </svg>
);

const IconBook = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

// ── Page component ────────────────────────────────────────────────────────
export default function VenturesPage() {
  return (
    <main className="vt-wrap">
      <style>{STYLES}</style>

      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="vt-hero">
        <RisingParticles />
        <div className="vt-hero-inner">
          <Reveal>
            <div className="vt-badge">Equity Partnerships</div>
            <h1 className="vt-h1">
              We Invest Development, Not Money.
              <br />
              You Bring the Idea. We{' '}
              <span className="vt-gradient-text">Build the Product.</span>
            </h1>
            <p className="vt-sub">
              Can&apos;t afford a development team? We build your product in exchange for equity or
              revenue share — the same Studio quality, without the upfront cost. You grow the
              business. We share in the success.
            </p>
            <div className="vt-btns">
              <Link href="/ventures/apply" className="vt-btn-primary">
                Apply to Ventures
                <ArrowRight />
              </Link>
              <Link href="/ventures/how-it-works" className="vt-btn-ghost">
                See How It Works
              </Link>
            </div>
            <p className="vt-accept-note">
              We accept 2-4 projects per quarter. ~15-20% acceptance rate.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="vt-ceo-quote">
              <p className="vt-quote-text">
                &ldquo;I started SocioFi because I couldn&apos;t afford to get my own ideas built.
                Ventures exists for founders in that exact position — people with real domain
                expertise and validated ideas who just need a technical partner. We&apos;re not
                doing charity. We&apos;re making a bet on founders we believe in.&rdquo;
              </p>
              <div className="vt-quote-attr">Arifur Rahman · CEO, SocioFi Technology</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 2. Not What You Think ───────────────────────────────────────── */}
      <section className="vt-section-alt">
        <div className="vt-container">
          <Reveal>
            <div className="vt-centered">
              <div className="vt-sec-label">Not What You Think</div>
              <h2 className="vt-sec-h2">This Isn&apos;t Charity. It&apos;s Aligned Incentives.</h2>
            </div>
          </Reveal>
          <div className="vt-clarify-grid">
            {[
              {
                not: 'NOT',
                title: "We're NOT a VC Fund",
                body: "We don't write checks. We write code. Our investment is development capacity — the same engineers and AI-powered process that Studio clients pay for. Instead of a wire transfer, you get a built product.",
              },
              {
                not: 'NOT',
                title: "We're NOT an Incubator",
                body: "No office space. No cohort. No mentorship program. We build your product and support it for 3 months post-launch. You handle everything else — sales, marketing, growth, fundraising. That's the deal.",
              },
              {
                not: 'NOT',
                title: "We're NOT Free Development",
                body: "There's a real exchange. Equity, revenue share, or both. We're taking a risk — betting our development capacity on your success. The terms reflect that risk.",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 0.1}>
                <div className="vt-clarify-card">
                  <div className="vt-clarify-card-title">
                    {card.title}
                    <span>{card.not}</span>
                  </div>
                  <p className="vt-clarify-card-body">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Three Deal Models ────────────────────────────────────────── */}
      <section className="vt-section">
        <div className="vt-container">
          <Reveal>
            <div className="vt-centered">
              <div className="vt-sec-label">Three Ways to Partner</div>
              <h2 className="vt-sec-h2">Pick the Model That Fits Your Situation.</h2>
            </div>
          </Reveal>

          <div className="vt-models-grid">
            {[
              {
                icon: <IconPieChart />,
                name: 'Equity',
                tagline: 'We build. You give us equity.',
                terms: '5-20% equity · 4-year vesting · No upfront cost',
                bestFor: 'Pre-revenue startups with high growth potential',
                href: '/ventures/equity',
              },
              {
                icon: <IconTrendingUp />,
                name: 'Revenue Share',
                tagline: 'We build. You share revenue until a cap.',
                terms: '8-15% of revenue · 2-3x cap · Payments stop when cap is hit',
                bestFor: 'Products with clear, near-term revenue',
                href: '/ventures/revenue-share',
              },
              {
                icon: <IconSplitArrows />,
                name: 'Hybrid',
                tagline: 'You pay some upfront. We take less equity or revenue.',
                terms: '30-50% upfront · 3-8% equity OR 5-10% revenue share',
                bestFor: 'Founders with some budget who want to minimize dilution',
                href: '/ventures/hybrid',
              },
            ].map((model, i) => (
              <Reveal key={model.name} delay={i * 0.1}>
                <div className="vt-model-card">
                  <div className="vt-model-icon">{model.icon}</div>
                  <div className="vt-model-name">{model.name}</div>
                  <p className="vt-model-tagline">{model.tagline}</p>
                  <div className="vt-model-terms">{model.terms}</div>
                  <p className="vt-model-bestfor">Best for: {model.bestFor}</p>
                  <Link href={model.href} className="vt-model-link">
                    See full terms <ArrowRight />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <p className="vt-models-note">
              Not sure which model fits? The application includes a preference question. We&apos;ll
              discuss the best structure on the call.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 4. Who We're Looking For ────────────────────────────────────── */}
      <section className="vt-section-alt">
        <div className="vt-container">
          <Reveal>
            <div className="vt-centered">
              <div className="vt-sec-label">Ideal Founder</div>
              <h2 className="vt-sec-h2">We&apos;re Selective Because We&apos;re Investing Our Time.</h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="vt-cto-quote">
              <p className="vt-quote-text">
                &ldquo;We turn down 80% of applications. Not because they&apos;re bad ideas —
                because we need to be certain we can build something that works AND that the founder
                can grow it. If either side of that equation is missing, nobody wins.&rdquo;
              </p>
              <div className="vt-quote-attr">Kamrul Hasan · CTO, SocioFi Technology</div>
            </div>
          </Reveal>

          <div className="vt-criteria-grid">
            {[
              { icon: <IconTarget />, name: 'Founder-Market Fit', weight: '25%', desc: 'Do you deeply understand the market you are building for? Years of experience, industry connections, and firsthand exposure to the problem.' },
              { icon: <IconChecklist />, name: 'Demand Validation', weight: '25%', desc: 'Has anyone told you they want this with their wallet or at least their commitment? Pre-paying customers, waitlists, or letters of intent.' },
              { icon: <IconDollar />, name: 'Revenue Model Clarity', weight: '20%', desc: 'Do you know exactly how this makes money? Clear pricing, identified customers, a concrete path to revenue within 12 months.' },
              { icon: <IconCode />, name: 'Technical Feasibility', weight: '15%', desc: 'Can SocioFi build this within our capabilities and timeline? Well-defined MVP scope that fits our tech stack and build process.' },
              { icon: <IconRocket />, name: 'Founder Commitment', weight: '15%', desc: 'Will you be working full-time on growth once the product is built? We build the product. You own the growth.' },
            ].map((c, i) => (
              <Reveal key={c.name} delay={i * 0.08}>
                <div className="vt-criteria-card">
                  <div className="vt-criteria-icon">{c.icon}</div>
                  <div className="vt-criteria-name">{c.name}</div>
                  <div className="vt-criteria-weight">{c.weight} weight</div>
                  <p className="vt-criteria-desc">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <p className="vt-criteria-note">
              Score yourself honestly. If you&apos;re a 2 on demand validation, strengthen that
              before applying.
            </p>
            <div className="vt-criteria-cta-row">
              <Link href="/ventures/criteria" className="vt-btn-ghost" style={{ display: 'inline-flex' }}>
                See full criteria + self-assessment <ArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 5. Portfolio Placeholders ────────────────────────────────────── */}
      <section className="vt-section">
        <div className="vt-container">
          <Reveal>
            <div className="vt-centered">
              <div className="vt-sec-label">Backed by SocioFi</div>
              <h2 className="vt-sec-h2">Companies We&apos;ve Built With.</h2>
            </div>
          </Reveal>

          <div className="vt-portfolio-grid">
            {[1, 2, 3].map(n => (
              <div key={n} className="vt-placeholder-card">
                <div className="vt-placeholder-title">Your Company Here</div>
                <Link href="/ventures/apply" className="vt-placeholder-link">
                  Apply <ArrowRight />
                </Link>
              </div>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="vt-portfolio-note">
              Our first 2-4 portfolio companies will launch this quarter. Be one of them.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 6. Application Process Preview ─────────────────────────────── */}
      <section className="vt-section-alt">
        <div className="vt-container">
          <Reveal>
            <div className="vt-centered">
              <div className="vt-sec-label">The Process</div>
              <h2 className="vt-sec-h2">From Application to Build in 3 Weeks.</h2>
            </div>
          </Reveal>

          <div className="vt-timeline">
            {[
              { label: 'Apply', day: 'Day 0', dot: '01' },
              { label: 'Review', day: 'Days 1-7', dot: '02' },
              { label: 'Call', day: 'Days 8-10', dot: '03' },
              { label: 'Terms', day: 'Days 10-14', dot: '04' },
              { label: 'Build', day: 'Day 14-21', dot: '05' },
            ].map((step, i) => (
              <Reveal key={step.label} delay={i * 0.1}>
                <div className="vt-timeline-step">
                  <div className="vt-timeline-dot">{step.dot}</div>
                  <div className="vt-timeline-step-body">
                    <div className="vt-timeline-label">{step.label}</div>
                    <div className="vt-timeline-day">{step.day}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <p className="vt-timeline-note">
              Every applicant hears back within 7 business days. If we say no, we tell you why.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 7. What You Get ─────────────────────────────────────────────── */}
      <section className="vt-section">
        <div className="vt-container">
          <Reveal>
            <div className="vt-centered">
              <div className="vt-sec-label">What You Get</div>
              <h2 className="vt-sec-h2">The Full Ventures Package.</h2>
            </div>
          </Reveal>

          <div className="vt-checklist" style={{ marginTop: 48 }}>
            {[
              { title: 'Full product built', desc: 'The same Studio quality — same engineers, same AI-powered build process — applied to your product.' },
              { title: 'Architecture design and technical decisions handled', desc: 'We make the hard technical calls so you can focus on the business.' },
              { title: 'Deployment to SocioFi Cloud', desc: '6 months of managed hosting included. We get your product live and keep it running.' },
              { title: '3 months of Services maintenance post-launch', desc: 'Bug fixes, updates, and monitoring for 3 months after you go live. No surprise bills.' },
              { title: 'Code ownership', desc: 'You own 100% of the code, regardless of the deal model. No vendor lock-in. Ever.' },
              { title: 'A technical partner who understands your product', desc: "We built it. So when something breaks or needs extending, we know exactly where to look." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.07}>
                <div className="vt-check-item">
                  <div className="vt-check-icon"><Check /></div>
                  <div className="vt-check-content">
                    <div className="vt-check-title">{item.title}</div>
                    <p className="vt-check-desc">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="vt-checklist-note">
              The only thing different from a Studio project is how you pay for it.
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 8. Deal Calculator CTA ─────────────────────────────────────── */}
      <div className="vt-calc-section">
        <Reveal>
          <div className="vt-calc-inner">
            <div className="vt-sec-label" style={{ justifyContent: 'center', display: 'flex' }}>
              Deal Estimator
            </div>
            <h2 className="vt-calc-h2">Estimate Your Terms</h2>
            <p className="vt-calc-desc">
              Input your product complexity, expected revenue timeline, and preferred model. Get a
              ballpark estimate of what the deal might look like.
            </p>
            <Link href="/ventures/calculator" className="vt-btn-primary" style={{ display: 'inline-flex' }}>
              Try the Deal Calculator <ArrowRight />
            </Link>
          </div>
        </Reveal>
      </div>

      {/* ── 9. Ecosystem Connection ─────────────────────────────────────── */}
      <section className="vt-section-alt">
        <div className="vt-container">
          <Reveal>
            <div className="vt-centered">
              <div className="vt-sec-label">The Ventures Advantage</div>
              <h2 className="vt-sec-h2">Ventures founders get the ENTIRE SocioFi ecosystem.</h2>
              <p className="vt-sec-desc" style={{ margin: '0 auto' }}>
                From first line of code to first paying customer — every division is part of the deal.
              </p>
            </div>
          </Reveal>

          <div className="vt-ecosystem">
            <div className="vt-eco-flow">
              {[
                { icon: <IconBuild />, name: 'Studio builds', detail: 'MVP → V1' },
                { arrow: true },
                { icon: <IconCloud />, name: 'Cloud hosts', detail: '6mo free' },
                { arrow: true },
                { icon: <IconShield />, name: 'Services maintains', detail: '3mo free' },
                { arrow: true },
                { icon: <IconAgents />, name: 'Agents', detail: 'Partner rates' },
                { arrow: true },
                { icon: <IconBook />, name: 'Academy', detail: 'Founder courses' },
              ].map((item, i) => (
                item.arrow ? (
                  <div key={i} className="vt-eco-arrow">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                ) : (
                  <Reveal key={item.name} delay={i * 0.06}>
                    <div className="vt-eco-node">
                      <div className="vt-eco-node-icon">{item.icon}</div>
                      <div className="vt-eco-node-name">{item.name}</div>
                      <div className="vt-eco-node-detail">{item.detail}</div>
                    </div>
                  </Reveal>
                )
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Final CTA ────────────────────────────────────────────────── */}
      <section className="vt-final-cta">
        <Reveal>
          <div className="vt-sec-label" style={{ justifyContent: 'center', display: 'flex' }}>
            Apply Now
          </div>
          <h2 className="vt-cta-h2">Have an Idea Worth Building? Let&apos;s Talk.</h2>
          <p className="vt-cta-sub">
            Apply to Ventures. It takes 10 minutes. We respond within 7 business days.
          </p>
          <div className="vt-btns">
            <Link href="/ventures/apply" className="vt-btn-primary">
              Apply Now <ArrowRight />
            </Link>
            <Link href="/ventures/criteria" className="vt-btn-ghost">
              Check If You Qualify First
            </Link>
          </div>
          <p className="vt-cta-note">Response within 7 business days — every application reviewed personally.</p>

          <div className="vt-cta-quote" style={{ maxWidth: 600, margin: '48px auto 0' }}>
            <p className="vt-cta-quote-text">
              &ldquo;The best Ventures application we ever received was two paragraphs long. She
              described her market, her validation, and her vision. No pitch deck. No financial
              projections. Just clarity. That&apos;s what we look for.&rdquo;
            </p>
            <div className="vt-cta-quote-attr">Arifur Rahman · CEO, SocioFi Technology</div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
