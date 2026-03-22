'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { courses, workshops, getCourseImage } from '@/lib/academy';

// ── Constants ──────────────────────────────────────────────────────────────
const A = '#E8B84D';
const A_DARK = '#9A6910';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
.acad-page { overflow-x: hidden; }

/* Warm amber background tint on bg-2 sections */
.acad-section { background: var(--bg); }
.acad-section-alt { background: var(--bg-2); }
.acad-warm-tint { background: color-mix(in srgb, var(--bg) 97%, #E8B84D 3%); }

.sec-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.sec-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}

[data-theme="light"] .sec-label { color: ${A_DARK}; }
[data-theme="light"] .sec-label::before { background: ${A_DARK}; }

.gradient-text {
  background: linear-gradient(135deg, #D4A030, #E8B84D, #F0D080);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@media (forced-colors: active) { .gradient-text { -webkit-text-fill-color: unset; } }

.btn-amber {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #D4A030, ${A});
  color: #0C0C1D;
  border: none; border-radius: 100px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 700; letter-spacing: -0.01em;
  cursor: pointer; text-decoration: none;
  box-shadow: 0 4px 24px rgba(232,184,77,0.35);
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
}
.btn-amber:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 40px rgba(232,184,77,0.5); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border); border-radius: 100px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
  cursor: pointer; text-decoration: none;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}
.btn-ghost:hover { border-color: ${A}; color: ${A}; transform: translateY(-2px); }

/* Audience pill selector */
.audience-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px; }
.audience-pill {
  padding: 8px 20px;
  border-radius: 100px;
  font-family: ${F.b}; font-size: 0.84rem; font-weight: 500;
  cursor: pointer; border: 1.5px solid var(--border);
  color: var(--text-secondary);
  background: transparent;
  transition: all 0.2s var(--ease);
}
.audience-pill:hover { border-color: ${A}; color: ${A}; }
.audience-pill.active {
  background: ${A};
  border-color: ${A};
  color: #0C0C1D;
  font-weight: 700;
}

/* Hero stacked cards */
.hero-cards-wrap {
  position: relative;
  width: 340px; height: 360px;
  flex-shrink: 0;
}
.hero-card-bg {
  position: absolute;
  width: 280px; height: 160px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--card-shadow);
}
.hero-card-bg:nth-child(1) { top: 0; left: 30px; transform: rotate(-4deg); }
.hero-card-bg:nth-child(2) { top: 100px; left: 10px; transform: rotate(-1deg); }
.hero-card-bg:nth-child(3) { top: 200px; left: 20px; transform: rotate(2deg); }

/* Path cards */
.path-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  box-shadow: var(--card-shadow);
  transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.35s;
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; gap: 16px;
}
.path-card::after {
  content: '';
  position: absolute; top: 0; left: 0;
  width: 3px; height: 100%;
  background: ${A};
  opacity: 0; transition: opacity 0.35s;
}
.path-card:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(0,0,0,0.15); border-color: rgba(232,184,77,0.25); }
.path-card:hover::after { opacity: 1; }
.path-icon {
  width: 48px; height: 48px;
  background: rgba(232,184,77,0.1);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: ${A};
  flex-shrink: 0;
}

/* Quiz */
.quiz-panel {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(12px);
  padding: 40px;
  max-width: 600px; margin: 0 auto;
}
.quiz-option {
  width: 100%;
  padding: 16px 20px;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  text-align: left;
  font-family: ${F.b}; font-size: 0.95rem; font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s var(--ease);
  display: flex; align-items: center; gap: 12px;
}
.quiz-option:hover { border-color: rgba(232,184,77,0.4); background: rgba(232,184,77,0.04); }
.quiz-option.selected { border-color: ${A}; background: rgba(232,184,77,0.08); color: var(--text-primary); }
.quiz-dot {
  width: 20px; height: 20px; border-radius: 50%;
  border: 2px solid var(--border);
  flex-shrink: 0; transition: all 0.2s;
}
.quiz-option.selected .quiz-dot { background: ${A}; border-color: ${A}; }
.quiz-progress { display: flex; gap: 8px; margin-bottom: 32px; }
.quiz-step {
  height: 3px; flex: 1; border-radius: 2px;
  background: var(--border); transition: background 0.3s;
}
.quiz-step.done { background: ${A}; }

/* Course tiles */
.course-tile {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.35s;
  cursor: pointer; text-decoration: none;
  display: flex; flex-direction: column;
}
.course-tile:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.18); border-color: rgba(232,184,77,0.2); }
.course-thumb {
  height: 120px; position: relative;
  display: flex; align-items: flex-end; padding: 12px;
  overflow: hidden;
}
.course-thumb-badge {
  font-family: ${F.m}; font-size: 0.68rem; font-weight: 500;
  background: ${A}; color: #0C0C1D;
  padding: 3px 10px; border-radius: 100px;
  position: absolute; top: 12px; right: 12px;
}
.course-thumb-price {
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 600;
  background: var(--bg-card); color: var(--text-primary);
  padding: 4px 10px; border-radius: 100px;
  border: 1px solid var(--border);
  position: absolute; top: 12px; left: 12px;
}
.course-audience {
  font-family: ${F.m}; font-size: 0.68rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.1em;
  margin-bottom: 6px;
}
[data-theme="light"] .course-audience { color: ${A_DARK}; }
.course-body { padding: 20px 20px 24px; display: flex; flex-direction: column; gap: 8px; flex: 1; }

/* Workshop cards */
.ws-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--card-shadow);
  display: flex; gap: 20px; align-items: flex-start;
  transition: transform 0.3s var(--ease), border-color 0.3s;
}
.ws-card:hover { transform: translateY(-4px); border-color: rgba(232,184,77,0.2); }
.ws-date-badge {
  min-width: 64px; height: 64px;
  background: ${A}; color: #0C0C1D;
  border-radius: 12px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ws-date-day { font-family: ${F.h}; font-size: 1.4rem; font-weight: 800; line-height: 1; }
.ws-date-mon { font-family: ${F.m}; font-size: 0.62rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
.ws-format-badge {
  font-family: ${F.m}; font-size: 0.65rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.1em;
  padding: 3px 10px; border-radius: 100px;
  border: 1px solid rgba(232,184,77,0.3);
  color: ${A};
}
[data-theme="light"] .ws-format-badge { color: ${A_DARK}; border-color: rgba(154,105,16,0.3); }
.ws-seats {
  font-family: ${F.m}; font-size: 0.7rem;
  color: var(--text-muted);
}
.ws-seats.low { color: #F87171; }

/* SCARL panel */
.scarl-panel {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(16px);
  padding: 48px 40px;
  display: grid; grid-template-columns: 1fr 1.6fr; gap: 48px; align-items: center;
}
@media (max-width: 768px) { .scarl-panel { grid-template-columns: 1fr; } }
.scarl-badge {
  width: 120px; height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(232,184,77,0.2), rgba(232,184,77,0.05));
  border: 2px solid rgba(232,184,77,0.3);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 24px;
  position: relative;
}
.scarl-badge::after {
  content: '';
  position: absolute; inset: 6px;
  border-radius: 50%;
  border: 1px dashed rgba(232,184,77,0.25);
  animation: scarl-spin 20s linear infinite;
}
@keyframes scarl-spin { to { transform: rotate(360deg); } }

/* Resource cards */
.resource-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--card-shadow);
  transition: transform 0.3s var(--ease), border-color 0.3s;
  position: relative;
}
.resource-card:hover { transform: translateY(-4px); border-color: rgba(232,184,77,0.2); }
.free-badge {
  position: absolute; top: -10px; right: 16px;
  background: ${A}; color: #0C0C1D;
  font-family: ${F.m}; font-size: 0.65rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 100px;
}

/* Flow section */
.flow-steps { display: flex; align-items: center; gap: 0; flex-wrap: wrap; }
.flow-step {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  flex: 1; min-width: 120px;
  text-align: center;
}
.flow-step-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: rgba(232,184,77,0.08);
  border: 1.5px solid rgba(232,184,77,0.2);
  display: flex; align-items: center; justify-content: center;
  color: ${A};
}
.flow-arrow {
  color: var(--text-muted); font-size: 1.2rem;
  flex-shrink: 0; padding: 0 8px;
}

/* Testimonial cards */
.testi-card {
  background: var(--bg-card);
  border: 1px solid rgba(232,184,77,0.1);
  border-radius: var(--radius-lg);
  padding: 28px 28px 24px;
  box-shadow: var(--card-shadow);
  position: relative;
  transition: transform 0.3s var(--ease);
}
.testi-card:hover { transform: translateY(-4px); }
.testi-quote-mark {
  font-family: ${F.h}; font-size: 3rem; font-weight: 800;
  color: ${A}; opacity: 0.25;
  line-height: 1; position: absolute;
  top: 16px; left: 24px;
}

/* CTA section */
.cta-section {
  position: relative; overflow: hidden;
  background: var(--bg-2);
}
.cta-glow {
  position: absolute;
  width: 600px; height: 300px;
  background: radial-gradient(ellipse, rgba(232,184,77,0.12) 0%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  pointer-events: none;
}

/* Corporate section */
.corporate-section {
  background: linear-gradient(135deg, rgba(232,184,77,0.06) 0%, rgba(232,184,77,0.02) 100%);
  border: 1px solid rgba(232,184,77,0.1);
  border-radius: var(--radius-xl);
  padding: 48px 40px;
}

/* Grid helpers */
.grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
.grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; }
@media (max-width: 1024px) {
  .grid-3 { grid-template-columns: repeat(2,1fr); }
  .hero-cards-wrap { display: none; }
  .scarl-panel { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .ws-card { flex-direction: column; }

  /* ── Mobile: audience pills — full-width vertical stack ── */
  .audience-pills { flex-direction: column; gap: 10px; }
  .audience-pill {
    width: 100%;
    min-height: 48px;
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
    border-radius: 12px;
  }

  /* ── Mobile: fanned cards — show only the first, hide the others ── */
  .hero-card-bg:nth-child(2),
  .hero-card-bg:nth-child(3) { display: none; }
  .hero-card-bg:nth-child(1) { transform: none; top: 0; left: 0; }

  /* ── Mobile: quiz options full-width ── */
  .quiz-panel { padding: 28px 20px; }
  .quiz-option { width: 100%; }

  /* ── Mobile: section header centering ── */
  .sec-label { justify-content: center; }
  .scarl-panel { padding: 32px 20px; }
  .corporate-section { padding: 32px 20px; }

  /* ── Mobile: course card grid 1-column ── */
  .course-tile { width: 100%; }
}

`;

// ── Helpers ────────────────────────────────────────────────────────────────
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
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Container({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', ...style }}>
      {children}
    </div>
  );
}

// ── SVG Icons ──────────────────────────────────────────────────────────────
const IconBookOpen = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
const IconUsers = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconBriefcase = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const IconArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const IconStar = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconPlay = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);
const IconZap = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconCloud = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);
const IconTool = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const IconCheck = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconBuilding = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h.01M9 12h.01M9 15h.01M15 9h.01M15 12h.01M15 15h.01"/>
  </svg>
);

// ── Quiz Data ──────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    question: "What's your role?",
    options: ['Founder / CEO', 'Business Leader', 'Team Member', 'Other'],
  },
  {
    question: "What's your main goal?",
    options: ['Build a product', 'Manage AI projects', 'Deploy agents', 'Understand AI'],
  },
  {
    question: 'How much time do you have?',
    options: ['A few hours', 'A full day', 'A week', 'Ongoing'],
  },
];

const QUIZ_RESULTS: Record<string, { course: string; slug: string; price: number; path: string }> = {
  '0-0': { course: 'AI Development for Founders', slug: 'ai-development-for-founders', price: 149, path: 'Founder Path' },
  '0-1': { course: 'From Idea to MVP', slug: 'from-idea-to-mvp', price: 59, path: 'Founder Path' },
  '0-2': { course: 'AI Development for Founders', slug: 'ai-development-for-founders', price: 149, path: 'Founder Path' },
  '0-3': { course: 'AI Development for Founders', slug: 'ai-development-for-founders', price: 149, path: 'Founder Path' },
  '1-0': { course: 'Managing AI-Powered Development', slug: 'managing-ai-powered-development', price: 129, path: 'Leader Path' },
  '1-1': { course: 'Managing AI-Powered Development', slug: 'managing-ai-powered-development', price: 129, path: 'Leader Path' },
  '1-2': { course: 'Understanding AI Agents for Business', slug: 'understanding-ai-agents-for-business', price: 99, path: 'Leader Path' },
  '1-3': { course: 'SaaS to AaaS Transition', slug: 'saas-to-aaas-transition', price: 79, path: 'Leader Path' },
  '2-0': { course: 'Technical Literacy for Non-Technical Teams', slug: 'technical-literacy-for-teams', price: 149, path: 'Team Path' },
  '2-1': { course: 'Working with AI Agents', slug: 'working-with-ai-agents', price: 79, path: 'Team Path' },
  '2-2': { course: 'Working with AI Agents', slug: 'working-with-ai-agents', price: 79, path: 'Team Path' },
  '2-3': { course: 'Technical Literacy for Non-Technical Teams', slug: 'technical-literacy-for-teams', price: 149, path: 'Team Path' },
  '3-0': { course: 'AI Development for Founders', slug: 'ai-development-for-founders', price: 149, path: 'Founder Path' },
  '3-1': { course: 'How to Spec a Software Product', slug: 'how-to-spec-a-software-product', price: 79, path: 'Founder Path' },
  '3-2': { course: 'Reading Technical Documentation', slug: 'reading-technical-documentation', price: 39, path: 'Team Path' },
  '3-3': { course: 'Build vs. Buy vs. Agent', slug: 'build-vs-buy-vs-agent', price: 49, path: 'Leader Path' },
};

function getQuizResult(answers: number[]): { course: string; slug: string; price: number; path: string } {
  if (answers.length < 2) return QUIZ_RESULTS['0-0'];
  const key = `${answers[0]}-${answers[1]}`;
  return QUIZ_RESULTS[key] ?? QUIZ_RESULTS['0-0'];
}

// ── Sub-components ─────────────────────────────────────────────────────────
function LearningPathQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  function pickOption(idx: number) {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ((q) => q + 1), 300);
    } else {
      setTimeout(() => setDone(true), 300);
    }
  }

  function reset() {
    setCurrentQ(0);
    setAnswers([]);
    setDone(false);
  }

  const result = done ? getQuizResult(answers) : null;

  return (
    <div className="quiz-panel">
      <div className="quiz-progress">
        {QUIZ_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`quiz-step${i <= currentQ || done ? ' done' : ''}`}
          />
        ))}
      </div>

      {!done ? (
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
          </p>
          <h3 style={{ fontFamily: F.h, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>
            {QUIZ_QUESTIONS[currentQ].question}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-option${answers[currentQ] === i ? ' selected' : ''}`}
                onClick={() => pickOption(i)}
              >
                <span className="quiz-dot" />
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <p style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Your recommendation
          </p>
          <h3 style={{ fontFamily: F.h, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
            {result!.course}
          </h3>
          <p style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
            Path: {result!.path}
          </p>
          <p style={{ fontFamily: F.m, fontSize: '0.9rem', fontWeight: 700, color: A, marginBottom: 28 }}>
            ${result!.price}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href={`/academy/courses/${result!.slug}`} className="btn-amber" style={{ fontSize: '0.84rem', padding: '11px 22px' }}>
              Enroll Now <IconArrowRight size={14} />
            </Link>
            <button onClick={reset} className="btn-ghost" style={{ fontSize: '0.84rem', padding: '11px 22px' }}>
              Retake Quiz
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Featured Courses Data ──────────────────────────────────────────────────
const FEATURED_SLUGS = [
  'ai-development-for-founders',
  'understanding-ai-agents-for-business',
  'technical-literacy-for-teams',
];

const AUDIENCE_LABELS: Record<string, string> = {
  founder: 'For Founders',
  leader: 'For Leaders',
  team: 'For Teams',
};

// ── Date helpers ───────────────────────────────────────────────────────────
function parseDateBadge(dateStr: string): { day: string; mon: string } {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    day: d.getDate().toString(),
    mon: d.toLocaleString('en-GB', { month: 'short' }).toUpperCase(),
  };
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function AcademyPage() {
  const [activeAudience, setActiveAudience] = useState<'founder' | 'leader' | 'team'>('founder');

  const featuredCourses = FEATURED_SLUGS.map((s) => courses.find((c) => c.slug === s)!).filter(Boolean);
  const upcomingWorkshops = workshops.slice(0, 3);

  return (
    <main className="acad-page">
      <style>{STYLES}</style>

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="acad-section" style={{ paddingTop: 140, paddingBottom: 100 }}>
        <Container>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
              <Reveal>
                <div className="sec-label" style={{ justifyContent: 'center' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: A, display: 'inline-block', flexShrink: 0 }} />
                  Education &amp; Training
                </div>
                <h1 style={{ fontFamily: F.h, fontSize: 'clamp(2.6rem,5vw,4rem)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.035em', color: 'var(--text-primary)', marginBottom: 24 }}>
                  Learn to Build with AI. Or{' '}
                  <br />
                  <span className="gradient-text">Lead Teams That Do.</span>
                </h1>
                <p style={{ fontFamily: F.b, fontSize: '1.1rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' }}>
                  Practical courses for non-technical founders, business leaders, and teams. Understand AI development well enough to commission it, manage it, and build on it.
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="audience-pills" style={{ justifyContent: 'center' }}>
                  {(['founder', 'leader', 'team'] as const).map((a) => (
                    <button
                      key={a}
                      className={`audience-pill${activeAudience === a ? ' active' : ''}`}
                      onClick={() => setActiveAudience(a)}
                    >
                      {a === 'founder' ? "I'm a Founder" : a === 'leader' ? "I'm a Leader" : "I'm on a Team"}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32, justifyContent: 'center' }}>
                  <Link href="/academy/courses" className="btn-amber">
                    Browse Courses <IconArrowRight size={14} />
                  </Link>
                  <Link href="/academy/free" className="btn-ghost">
                    Try Something Free
                  </Link>
                </div>

                <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  &ldquo;I wish someone had explained this to me before I hired my first dev team.&rdquo; — Tamar, SaaS founder
                </p>
              </Reveal>

          </div>
        </Container>
      </section>

      {/* ── 2. CHOOSE YOUR PATH ─────────────────────────────────────────── */}
      <section className="acad-section-alt" style={{ padding: '100px 0' }}>
        <Container>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}>Where do you start?</div>
              <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 0 }}>
                Three Paths. Pick the One That Fits.
              </h2>
            </div>
          </Reveal>

          <div className="grid-3">
            {[
              {
                icon: <IconBookOpen size={22} />,
                title: 'Founder Path',
                body: 'You are building or planning to build a product. Learn how AI development works, how to spec your idea, and how to work with a dev team — without needing to write code.',
                meta: '4 courses · 16 hours · from $59',
                cta: 'Start as a Founder',
                href: '/academy/courses?audience=founder',
              },
              {
                icon: <IconBriefcase size={22} />,
                title: 'Leader Path',
                body: 'You manage teams, budgets, or strategy. Understand the AI development landscape well enough to lead decisions, evaluate vendors, and drive adoption.',
                meta: '4 courses · 14 hours · from $49',
                cta: 'Start as a Leader',
                href: '/academy/courses?audience=leader',
              },
              {
                icon: <IconUsers size={22} />,
                title: 'Team Path',
                body: 'You work alongside engineers or AI tools. Build the technical literacy to collaborate confidently, understand documentation, and work with AI agents.',
                meta: '3 courses · 11 hours · from $39',
                cta: 'Start as a Team Member',
                href: '/academy/courses?audience=team',
              },
            ].map((path, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="path-card" style={{ background: 'color-mix(in srgb, var(--bg-card) 97%, #E8B84D 3%)' }}>
                  <div className="path-icon">{path.icon}</div>
                  <h3 style={{ fontFamily: F.h, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {path.title}
                  </h3>
                  <p style={{ fontFamily: F.b, fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
                    {path.body}
                  </p>
                  <p style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, letterSpacing: '0.05em', margin: 0 }}>
                    {path.meta}
                  </p>
                  <Link
                    href={path.href}
                    style={{ fontFamily: F.h, fontSize: '0.84rem', fontWeight: 600, color: A, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto' }}
                  >
                    {path.cta} <IconArrowRight size={13} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. LEARNING PATH QUIZ ───────────────────────────────────────── */}
      <section className="acad-warm-tint" style={{ padding: '100px 0' }}>
        <Container>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}>
                Find Your Course
              </div>
              <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 16 }}>
                Not Sure Where to Start?
              </h2>
              <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
                Answer three quick questions and we will recommend the right course for you.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <LearningPathQuiz />
          </Reveal>
        </Container>
      </section>

      {/* ── 4. FEATURED COURSES ─────────────────────────────────────────── */}
      <section className="acad-section" style={{ padding: '100px 0' }}>
        <Container>
          <Reveal>
            <div className="sec-label">Most Popular</div>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12, maxWidth: 560 }}>
              Courses Founders and Leaders Start With.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 48, maxWidth: 520 }}>
              Three courses that cover the most common gaps between business understanding and technical reality.
            </p>
          </Reveal>

          <div className="grid-3">
            {featuredCourses.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.1}>
                <Link href={`/academy/courses/${c.slug}`} className="course-tile">
                  <div className="course-thumb" style={{ background: c.thumbnailGradient, position: 'relative' }}>
                    <img src={getCourseImage(c.category)} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span className="course-thumb-price" style={{ position: 'relative', zIndex: 1 }}>${c.price}</span>
                    <span className="course-thumb-badge" style={{ position: 'relative', zIndex: 1 }}>{c.duration}</span>
                  </div>
                  <div className="course-body">
                    <p className="course-audience">{AUDIENCE_LABELS[c.audience]}</p>
                    <h3 style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, margin: 0 }}>
                      {c.name}
                    </h3>
                    <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, flex: 1 }}>
                      {c.tagline}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: A, fontFamily: F.h, fontSize: '0.84rem', fontWeight: 600, marginTop: 8 }}>
                      Enroll <IconArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link href="/academy/courses" className="btn-ghost">
                View All 10 Courses <IconArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── 5. UPCOMING WORKSHOPS ───────────────────────────────────────── */}
      <section className="acad-section-alt" style={{ padding: '100px 0' }}>
        <Container>
          <Reveal>
            <div className="sec-label">Live Workshops</div>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12, maxWidth: 560 }}>
              Learn Together. Ask Questions Live.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 48, maxWidth: 520 }}>
              Small cohorts, expert facilitators, real feedback. Every session is practical, not theoretical.
            </p>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {upcomingWorkshops.map((ws, i) => {
              const { day, mon } = parseDateBadge(ws.date);
              const isLow = ws.seatsRemaining <= 10;
              return (
                <Reveal key={ws.slug} delay={i * 0.08}>
                  <div className="ws-card">
                    <div className="ws-date-badge">
                      <span className="ws-date-day">{day}</span>
                      <span className="ws-date-mon">{mon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                        <h3 style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          {ws.name}
                        </h3>
                        <span className="ws-format-badge">{ws.format}</span>
                      </div>
                      <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 8px' }}>
                        {ws.time} · {ws.duration}
                      </p>
                      <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {ws.description}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                      <p style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {ws.price === 0 ? 'Free' : `$${ws.price}`}
                      </p>
                      <span className={`ws-seats${isLow ? ' low' : ''}`}>
                        {ws.seatsRemaining} / {ws.maxSeats} seats
                      </span>
                      <Link
                        href={`/academy/workshops/${ws.slug}`}
                        className="btn-amber"
                        style={{ fontSize: '0.8rem', padding: '9px 18px', whiteSpace: 'nowrap' }}
                      >
                        {ws.price === 0 ? 'Register Free' : 'Register'}
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.3}>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link href="/academy/workshops" style={{ fontFamily: F.h, fontSize: '0.9rem', fontWeight: 600, color: A, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                See all workshops <IconArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── 6. SCARL CERTIFICATION ─────────────────────────────────────── */}
      <section className="acad-warm-tint" style={{ padding: '100px 0' }}>
        <Container>
          <Reveal>
            <div className="sec-label">Certification</div>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 48, maxWidth: 560 }}>
              Become a Certified AI-Ready Leader.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="scarl-panel">
              <div style={{ textAlign: 'center' }}>
                <div className="scarl-badge">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                    <path d="M28 8 L38 18 L50 20 L40 30 L42 44 L28 36 L14 44 L16 30 L6 20 L18 18 Z" stroke={A} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
                    <path d="M22 28 L26 32 L34 24" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p style={{ fontFamily: F.m, fontSize: '0.84rem', fontWeight: 700, color: A, letterSpacing: '0.1em', textTransform: 'uppercase' }}>SCARL</p>
                <p style={{ fontFamily: F.b, fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  SocioFi Certified<br />AI-Ready Leader
                </p>
              </div>

              <div>
                <p style={{ fontFamily: F.b, fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  A structured 6-week program combining all three leader-path courses with live sessions, peer cohorts, and a final project review. Complete it and earn a credential that signals genuine AI literacy to teams, investors, and partners.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
                  {[['6 weeks', 'Duration'], ['~4 hrs/week', 'Commitment'], ['30 per cohort', 'Cohort size']].map(([val, lbl]) => (
                    <div key={lbl} style={{ textAlign: 'center', padding: '14px 8px', background: 'rgba(232,184,77,0.06)', borderRadius: 12, border: '1px solid rgba(232,184,77,0.1)' }}>
                      <p style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{val}</p>
                      <p style={{ fontFamily: F.b, fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{lbl}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                  <p style={{ fontFamily: F.h, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>$499</p>
                  <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: A, margin: 0 }}>$399 early bird through June 2026</p>
                </div>

                <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 24, borderLeft: `2px solid rgba(232,184,77,0.3)`, paddingLeft: 14 }}>
                  "We designed SCARL for people who need to lead AI-driven organisations, not write the code." — Kamrul Hasan, CTO
                </p>

                <Link href="/academy/certification" className="btn-amber">
                  Learn More About SCARL <IconArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── 7. FREE RESOURCES ───────────────────────────────────────────── */}
      <section className="acad-section" style={{ padding: '100px 0' }}>
        <Container>
          <Reveal>
            <div className="sec-label">Start Free</div>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12, maxWidth: 560 }}>
              Not Ready to Commit? Start Here.
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 48, maxWidth: 520 }}>
              No email required. No sign-up. Three free resources to help you understand what you are getting into before you invest.
            </p>
          </Reveal>

          <div className="grid-3">
            {[
              { title: 'AI Development Glossary', desc: 'The 60 technical terms every founder and leader needs to know. Bookmark it before your next dev meeting.', icon: <IconBookOpen size={22} />, href: '/academy/free#glossary' },
              { title: 'The Founder\'s Cost Guide', desc: 'What software actually costs — broken down by project type, team size, and approach. No agency BS.', icon: <IconBriefcase size={22} />, href: '/academy/free#cost-guide' },
              { title: 'Is AI Development Right for You?', desc: 'A 5-minute self-assessment. Answer honestly and you will know whether to build with AI, buy a tool, or wait.', icon: <IconZap size={22} />, href: '/academy/free#assessment' },
            ].map((r, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="resource-card">
                  <span className="free-badge">Free</span>
                  <div style={{ width: 40, height: 40, background: 'rgba(232,184,77,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: A, marginBottom: 16 }}>
                    {r.icon}
                  </div>
                  <h3 style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    {r.title}
                  </h3>
                  <p style={{ fontFamily: F.b, fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 16 }}>
                    {r.desc}
                  </p>
                  <Link href={r.href} style={{ fontFamily: F.h, fontSize: '0.84rem', fontWeight: 600, color: A, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    Access Free <IconArrowRight size={13} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 8. CORPORATE TRAINING ───────────────────────────────────────── */}
      <section className="acad-section-alt" style={{ padding: '80px 0' }}>
        <Container>
          <Reveal>
            <div className="corporate-section">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
                <div>
                  <div className="sec-label">For Organisations</div>
                  <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.6rem,2.5vw,2.1rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12 }}>
                    Train Your Entire Team.
                  </h2>
                  <p style={{ fontFamily: F.b, fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 520, margin: 0 }}>
                    Private cohorts, custom curriculum, live facilitation. We run bespoke training sessions for teams of 5 to 200. Technical literacy, AI agent workflows, and leadership programmes — tailored to your organisation.
                  </p>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <Link href="/academy/corporate" className="btn-amber">
                    Inquire About Corporate Training <IconArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── 9. TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="acad-section" style={{ padding: '100px 0' }}>
        <Container>
          <Reveal>
            <div className="sec-label">What Learners Say</div>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 48, maxWidth: 560 }}>
              From founders who were exactly where you are.
            </h2>
          </Reveal>

          <div className="grid-3">
            {[
              {
                quote: 'I went into my first developer meeting able to actually evaluate their proposals. Before the course, I was nodding along hoping they were being honest. After it, I was asking the right questions.',
                name: 'Priya S.',
                role: 'Founder, logistics startup',
                rating: 5,
              },
              {
                quote: 'The spec writing workshop saved me at least two months of back-and-forth. I handed the team a brief they could actually build from, and they shipped ahead of schedule.',
                name: 'Marcus L.',
                role: 'CEO, B2B SaaS company',
                rating: 5,
              },
              {
                quote: "My whole ops team took the technical literacy course before we rolled out our first AI agent. The adoption was smoother than anything we'd done before. They understood what it was doing.",
                name: 'Fatima A.',
                role: 'COO, 80-person professional services firm',
                rating: 5,
              },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="testi-card">
                  <span className="testi-quote-mark">"</span>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 16, paddingTop: 24 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} style={{ color: A }}>
                        <IconStar size={14} />
                      </span>
                    ))}
                  </div>
                  <p style={{ fontFamily: F.b, fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 20 }}>
                    {t.quote}
                  </p>
                  <div>
                    <p style={{ fontFamily: F.h, fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{t.name}</p>
                    <p style={{ fontFamily: F.b, fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 10. ACADEMY → SOCIOFI FLOW ──────────────────────────────────── */}
      <section className="acad-section-alt" style={{ padding: '100px 0' }}>
        <Container>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}>Learn Then Build</div>
              <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12 }}>
                Academy Prepares You. The Rest of SocioFi Delivers.
              </h2>
              <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
                Academy graduates are better clients, better collaborators, and better leaders. Every division in SocioFi exists to support what you build next.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flow-steps">
              {[
                { icon: <IconBookOpen size={22} />, label: 'Learn', sub: 'Academy', href: '/academy' },
                null,
                { icon: <IconTool size={22} />, label: 'Build', sub: 'Studio', href: '/studio' },
                null,
                { icon: <IconZap size={22} />, label: 'Deploy Agents', sub: 'Agents', href: '/agents' },
                null,
                { icon: <IconCloud size={22} />, label: 'Host', sub: 'Cloud', href: '/cloud' },
                null,
                { icon: <IconTool size={22} />, label: 'Maintain', sub: 'Services', href: '/services' },
              ].map((item, i) =>
                item === null ? (
                  <div key={i} className="flow-arrow">
                    <IconArrowRight size={16} />
                  </div>
                ) : (
                  <Link key={i} href={item.href} className="flow-step" style={{ textDecoration: 'none' }}>
                    <div className={`flow-step-icon${item.href === '/academy' ? '' : ''}`} style={item.href === '/academy' ? { background: 'rgba(232,184,77,0.15)', borderColor: A } : {}}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontFamily: F.h, fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{item.label}</p>
                      <p style={{ fontFamily: F.m, fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>{item.sub}</p>
                    </div>
                  </Link>
                )
              )}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── 11. CTA ─────────────────────────────────────────────────────── */}
      <section className="cta-section" style={{ padding: '120px 0' }}>
        <div className="cta-glow" />
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
              <div className="sec-label" style={{ justifyContent: 'center' }}>Ready to Learn?</div>
              <h2 style={{ fontFamily: F.h, fontSize: 'clamp(2rem,3.5vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 20 }}>
                Start with one course. Change how you work.
              </h2>
              <p style={{ fontFamily: F.b, fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 16 }}>
                Every course is practical, jargon-free, and built for the kind of person who is moving fast and needs real answers — not academic theory.
              </p>
              <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 36, borderLeft: `2px solid rgba(232,184,77,0.3)`, paddingLeft: 14, textAlign: 'left', maxWidth: 480, margin: '0 auto 36px' }}>
                "We built Academy because every time a founder hired us without understanding the basics, the project took twice as long." — Arifur Rahman, CEO
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/academy/courses" className="btn-amber">
                  Browse All Courses <IconArrowRight size={14} />
                </Link>
                <Link href="/academy/free" className="btn-ghost">
                  Start Free
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
