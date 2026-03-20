'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────
const A = '#72C4B2';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
.studio-page { overflow-x: hidden; }

/* Reveal helper is handled by motion */
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

.gradient-text {
  background: linear-gradient(135deg, #4A6CB8 0%, ${A} 50%, #A3DFD2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@media (forced-colors: active) { .gradient-text { -webkit-text-fill-color: unset; } }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #3A589E, ${A});
  color: #fff;
  border: none; border-radius: 100px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
  cursor: pointer; text-decoration: none;
  box-shadow: 0 4px 24px rgba(58,88,158,0.35);
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
}
.btn-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 40px rgba(58,88,158,0.5); }

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

/* Service cards */
.svc-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--card-shadow);
  transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.35s;
  position: relative; overflow: hidden;
  display: flex; flex-direction: column;
}
.svc-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #3A589E, ${A});
  opacity: 0; transition: opacity 0.35s;
}
.svc-card::after {
  content: '';
  position: absolute; top: 0; left: 0;
  width: 3px; bottom: 0;
  background: ${A};
  opacity: 0; transition: opacity 0.35s;
}
.svc-card:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(0,0,0,0.18); border-color: var(--border-hover); }
.svc-card:hover::before { opacity: 1; }
.svc-card:hover::after { opacity: 1; }

/* Portfolio bento */
.port-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.port-card-featured { grid-column: span 2; }
.port-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 32px;
  transition: border-color 0.3s, transform 0.3s;
  cursor: pointer; text-decoration: none; display: block;
}
.port-card:hover { border-color: ${A}; transform: translateY(-4px); }

/* Pricing */
.price-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 32px; position: relative;
  transition: border-color 0.3s, transform 0.3s;
}
.price-card:hover { border-color: var(--border-hover); transform: translateY(-4px); }
.price-card.popular { border-color: ${A}44; }

/* Testimonials */
.test-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 28px;
}

/* Cross-division flow dot animation */
@keyframes dot-travel {
  0% { left: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { left: calc(100% - 8px); opacity: 0; }
}
.flow-dot {
  position: absolute; top: 50%; width: 8px; height: 8px;
  border-radius: 50%; background: ${A};
  transform: translateY(-50%);
  animation: dot-travel 2.5s ease-in-out infinite;
}
.flow-dot-2 { animation-delay: 0.83s; }
.flow-dot-3 { animation-delay: 1.66s; }

/* Process steps */
.process-step {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; flex: 1; position: relative;
}
.process-step:not(:last-child)::after {
  content: '';
  position: absolute; top: 20px; left: calc(50% + 24px); right: calc(-50% + 24px);
  height: 1px; background: var(--border);
}

/* Audience cards */
.audience-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 28px; text-decoration: none; display: block;
  transition: border-color 0.3s, transform 0.3s;
}
.audience-card:hover { border-color: ${A}; transform: translateY(-4px); }

/* Responsive */
@media (max-width: 768px) {
  .port-grid { grid-template-columns: 1fr; }
  .port-card-featured { grid-column: span 1; }
  .process-row { flex-direction: column; }
  .process-step::after { display: none; }
  .hero-split { flex-direction: column; }
  .hero-visual { display: none; }
  .split-2col { flex-direction: column; }
}
@media (max-width: 1024px) {
  .port-grid { grid-template-columns: repeat(2, 1fr); }
  .port-card-featured { grid-column: span 2; }
}
`;

// ── Reveal component ────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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
}

// ── SVG Icons ───────────────────────────────────────────────────────────────
const IconTerminal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={24} height={24} aria-hidden="true">
    <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
  </svg>
);
const IconWrench = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={24} height={24} aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);
const IconNetwork = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={24} height={24} aria-hidden="true">
    <circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="21"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
    <circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="21" r="2"/>
  </svg>
);
const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={24} height={24} aria-hidden="true">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={24} height={24} aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={24} height={24} aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ── Code Editor Visual ──────────────────────────────────────────────────────
const CODE_LINES = [
  [{ t: 'const ', c: '#79B8FF' }, { t: 'agent', c: '#E1E4E8' }, { t: ' = new ', c: '#79B8FF' }, { t: 'AgentConfig', c: '#B392F0' }, { t: '({', c: '#E1E4E8' }],
  [{ t: '  model', c: '#9ECBFF' }, { t: ': ', c: '#E1E4E8' }, { t: '"advanced-ai-model"', c: '#9ECBFF' }, { t: ',', c: '#E1E4E8' }],
  [{ t: '  tools', c: '#9ECBFF' }, { t: ': [', c: '#E1E4E8' }, { t: 'searchWeb', c: '#B392F0' }, { t: ', ', c: '#E1E4E8' }, { t: 'editCode', c: '#B392F0' }, { t: '],', c: '#E1E4E8' }],
  [{ t: '  memory', c: '#9ECBFF' }, { t: ': ', c: '#E1E4E8' }, { t: 'true', c: '#79B8FF' }, { t: ',', c: '#E1E4E8' }],
  [{ t: '  maxSteps', c: '#9ECBFF' }, { t: ': ', c: '#E1E4E8' }, { t: '25', c: '#F8C555' }, { t: ',', c: '#E1E4E8' }],
  [{ t: '});', c: '#E1E4E8' }],
  [],
  [{ t: 'const ', c: '#79B8FF' }, { t: 'result', c: '#E1E4E8' }, { t: ' = await ', c: '#79B8FF' }, { t: 'agent', c: '#E1E4E8' }, { t: '.', c: '#E1E4E8' }, { t: 'run', c: '#B392F0' }, { t: '(prompt);', c: '#E1E4E8' }],
  [],
  [{ t: '// Reviewed. Deployed. Yours.', c: '#6A737D' }],
];
const TERMINAL_LINES = [
  { text: '$ npm run build', color: A },
  { text: '  Type checking...', color: '#7C8DB0' },
  { text: '  Tests: 47/47 passed', color: A },
  { text: '  Deploying to production...', color: '#7C8DB0' },
  { text: 'Live → app.yourdomain.com', color: A },
];

function CodeEditorVisual() {
  const [visibleCode, setVisibleCode] = useState(0);
  const [visibleTerm, setVisibleTerm] = useState(0);
  const [cursor, setCursor] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) { setVisibleCode(CODE_LINES.length); setVisibleTerm(TERMINAL_LINES.length); return; }
    const cur = setInterval(() => setCursor(v => !v), 530);
    let ci = 0, ti = 0;
    function nextCode() {
      if (ci < CODE_LINES.length) { ci++; setVisibleCode(ci); timerRef.current = setTimeout(nextCode, 700); }
      else { timerRef.current = setTimeout(nextTerm, 400); }
    }
    function nextTerm() {
      if (ti < TERMINAL_LINES.length) { ti++; setVisibleTerm(ti); timerRef.current = setTimeout(nextTerm, 650); }
      else {
        timerRef.current = setTimeout(() => {
          ci = 0; ti = 0; setVisibleCode(0); setVisibleTerm(0);
          timerRef.current = setTimeout(nextCode, 600);
        }, 3000);
      }
    }
    timerRef.current = setTimeout(nextCode, 500);
    return () => { clearInterval(cur); if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div role="img" aria-label="Animated code editor showing AI agent configuration" style={{
      background: 'rgba(13,13,30,0.97)', border: `1px solid ${A}30`,
      borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem', lineHeight: 1.75,
      boxShadow: `0 24px 80px rgba(0,0,0,0.45), 0 0 0 1px ${A}10`,
    }}>
      {/* Window bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${A}12`, flexShrink: 0 }}>
        {['#FF5F57','#FEBC2E','#28C840'].map(c => (
          <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block', flexShrink: 0 }} />
        ))}
        <span style={{ marginLeft: 10, color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', letterSpacing: '0.04em' }}>agent_config.py</span>
        <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.15)', fontSize: '0.62rem' }}>Python</span>
      </div>
      {/* Code area */}
      <div style={{ flex: 1, padding: '14px 20px 10px', minHeight: 200, maxHeight: 230, overflowY: 'auto' }}>
        {CODE_LINES.slice(0, visibleCode).map((line, li) => (
          <div key={li} style={{ whiteSpace: 'pre', minHeight: '1.4em', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.65rem', width: 22, flexShrink: 0, textAlign: 'right', marginRight: 12, userSelect: 'none' }}>{li + 1}</span>
            {line.length === 0 ? <span>&nbsp;</span> : line.map((tok, ti_) => <span key={ti_} style={{ color: tok.c }}>{tok.t}</span>)}
            {li === visibleCode - 1 && visibleCode < CODE_LINES.length && (
              <span aria-hidden="true" style={{ display: 'inline-block', width: 2, height: '1em', background: A, verticalAlign: 'text-bottom', opacity: cursor ? 1 : 0, transition: 'opacity 0.08s', marginLeft: 1 }} />
            )}
          </div>
        ))}
      </div>
      {/* Terminal */}
      <div style={{ background: 'rgba(0,0,0,0.5)', borderTop: `1px solid ${A}10`, padding: '10px 20px 14px', flexShrink: 0 }}>
        <div style={{ fontSize: '0.6rem', color: `${A}60`, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Terminal</div>
        {TERMINAL_LINES.slice(0, visibleTerm).map((line, i) => (
          <div key={i} style={{ color: line.color, fontSize: '0.73rem', lineHeight: 1.6 }}>{line.text}</div>
        ))}
        {visibleTerm < TERMINAL_LINES.length && visibleCode >= CODE_LINES.length && (
          <span aria-hidden="true" style={{ display: 'inline-block', width: 2, height: '0.85em', background: A, verticalAlign: 'text-bottom', opacity: cursor ? 1 : 0, transition: 'opacity 0.08s' }} />
        )}
      </div>
    </div>
  );
}

// ── Service card data ───────────────────────────────────────────────────────
const SERVICES = [
  { icon: <IconTerminal />, title: 'Product Development', tagline: 'Idea → live product in weeks', body: 'Full-stack web and mobile apps. SaaS platforms. Customer portals. Architecture, frontend, backend, database, auth, payments, deployment — the whole thing.', time: '2–6 weeks', href: '/studio/services/product-development' },
  { icon: <IconWrench />, title: 'Rescue & Ship', tagline: 'Already started? We\'ll finish it.', body: 'You started with AI tools or a freelancer and hit a wall. We take over — code review, bug fixes, architecture cleanup, and deployment. We\'ve seen every failure mode.', time: '1–3 weeks', href: '/studio/services/rescue-ship' },
  { icon: <IconNetwork />, title: 'Automation & Integration', tagline: 'Connect. Automate. Stop copying data.', body: 'Workflow automation, API development, data pipelines, system integrations. Connect the tools that don\'t talk to each other.', time: '1–4 weeks', href: '/studio/services/automation-integration' },
  { icon: <IconGrid />, title: 'Internal Tools', tagline: 'Replace the spreadsheets your team outgrew.', body: 'Custom dashboards, admin panels, reporting tools, inventory managers. Built around how your team actually works.', time: '2–4 weeks', href: '/studio/services/internal-tools' },
  { icon: <IconLayers />, title: 'Architecture Consulting', tagline: 'Design before you build.', body: 'Architecture review, technology recommendations, scalability planning. For teams who want expert guidance before committing to a build.', time: '3–5 days', href: '/studio/services/architecture-consulting' },
  { icon: <IconShield />, title: 'Maintenance Handoff', tagline: 'We\'ll take over from here.', body: 'Have live software that needs professional care? We audit, document, set up monitoring, and transition to ongoing maintenance through our Services division.', time: '1–2 weeks', href: '/studio/services/maintenance-handoff' },
];

const PROCESS_STEPS = [
  { n: '01', title: 'Listen', desc: 'Free call — understand your goal, stack, timeline' },
  { n: '02', title: 'Plan', desc: 'Fixed scope, fixed price, written spec' },
  { n: '03', title: 'Build', desc: 'AI + engineers, daily commits, weekly check-ins' },
  { n: '04', title: 'Launch', desc: 'Production deploy, tests green, monitoring live' },
  { n: '05', title: 'Maintain', desc: '30-day warranty, then ongoing care option' },
];

const AI_DOES = [
  'Generates initial codebase from specs',
  'Writes unit and integration tests',
  'Creates API documentation',
  'Handles boilerplate and repetitive patterns',
  'Processes data transforms at scale',
];
const HUMAN_DOES = [
  'Designs the full system architecture',
  'Reviews every AI-generated file',
  'Writes complex logic, security layers, edge cases',
  'Sets up production infrastructure',
  'Handles deployment, CI/CD, monitoring',
  'Communicates with you in plain English',
];

const PORTFOLIO = [
  { label: 'SaaS Product', title: 'InboxFlow', stat: '18 days to launch', desc: 'AI-powered inbox triage tool for busy founders. Built full-stack from scratch, with auth, billing, and onboarding flows.', href: '/studio/portfolio/inboxflow', featured: true },
  { label: 'Internal Tool', title: 'BrightPath Ops', stat: '20 hrs/week saved', desc: 'Operations dashboard for a 60-person logistics company. Real-time data, role-based access.', href: '/studio/portfolio/brightpath', featured: false },
  { label: 'Customer Platform', title: 'StyleStack', stat: '5x client capacity', desc: 'Client portal replacing a patchwork of emails and spreadsheets.', href: '/studio/portfolio/stylestack', featured: false },
];

const PRICING = [
  { tier: 'Starter', range: '$3K–$8K', weeks: '2–3 wks', notes: 'MVPs, rescue jobs, automation scripts', popular: false },
  { tier: 'Growth', range: '$8K–$20K', weeks: '3–6 wks', notes: 'Full products, internal tools, integrations', popular: true },
  { tier: 'Scale', range: '$20K+', weeks: '6–12 wks', notes: 'Complex platforms, multi-service systems', popular: false },
];

const TESTIMONIALS = [
  { quote: 'I was about to hire a $50K agency. SocioFi shipped my product in 18 days for a fraction of that.', author: 'Priya D.', role: 'Founder, InboxFlow' },
  { quote: 'We needed an internal tool for 30 people. Traditional quotes were $80K and 4 months. SocioFi delivered in 3 weeks.', author: 'Marcus T.', role: 'COO, BrightPath Logistics' },
  { quote: 'What sold me is they explain everything in plain English. I\'m not a developer but I always know what\'s happening.', author: 'Lena K.', role: 'Founder, StyleStack' },
];

const AUDIENCE = [
  { title: 'Solo Founders', subtitle: 'Idea in hand, no dev team', body: 'You\'ve been building with AI coding tools. You\'re hitting walls — deployment, debugging, auth, payments. That\'s where we step in.', href: '/studio/solutions/for-founders' },
  { title: 'Growing Businesses', subtitle: 'Real business, needs real software', body: 'Your spreadsheets and off-the-shelf tools aren\'t cutting it anymore. Time for software built around how you actually work.', href: '/studio/solutions/for-sme' },
  { title: 'Teams Without Developers', subtitle: 'Budget approved, engineers needed', body: 'You have the vision and the resources. You just need the technical team to execute. That\'s us.', href: '/studio/solutions/for-teams' },
];

const FLOW = [
  { label: 'Studio', desc: 'Builds your product' },
  { label: 'Agents', desc: 'Adds intelligence' },
  { label: 'Cloud', desc: 'Hosts it reliably' },
  { label: 'Services', desc: 'Keeps it running' },
];

// ── Page ────────────────────────────────────────────────────────────────────
export default function StudioPage() {
  return (
    <>
      <style>{STYLES}</style>
      <main className="studio-page">

        {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
        <section style={{ paddingTop: 'clamp(100px,14vw,160px)', paddingBottom: 'clamp(60px,8vw,100px)', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
          {/* Background effects */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '10%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(ellipse, ${A}12 0%, transparent 65%)`, filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', bottom: 0, right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(58,88,158,0.15) 0%, transparent 65%)', filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 80% at 40% 40%, black 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 40% 40%, black 30%, transparent 100%)' }} />
          </div>

          <div style={{ maxWidth: 1200, marginInline: 'auto', paddingInline: 'clamp(20px,5vw,32px)', position: 'relative', zIndex: 1 }}>
            <div className="hero-split" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(40px,6vw,80px)' }}>
              {/* Left column */}
              <div style={{ flex: '1 1 50%', minWidth: 0 }}>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                  {/* Badge */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', border: `1px solid ${A}40`, borderRadius: 100, marginBottom: 28 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: A, display: 'inline-block' }} />
                    <span style={{ fontFamily: F.m, fontSize: '0.68rem', color: A, letterSpacing: '0.12em', textTransform: 'uppercase' }}>AI-Native Development</span>
                  </div>
                  {/* H1 */}
                  <h1 style={{ fontFamily: F.h, fontSize: 'clamp(2.4rem,5vw,3.4rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.06, color: 'var(--text-primary)', margin: '0 0 20px' }}>
                    We Build Software That <span className="gradient-text">Actually Works.</span>
                  </h1>
                  <p style={{ fontFamily: F.b, fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: '0 0 32px', maxWidth: 520 }}>
                    From broken AI prototypes to scaled production systems. AI handles the code generation. Our engineers handle everything else — architecture, security, deployment, and ongoing maintenance.
                  </p>
                  {/* CTAs */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
                    <Link href="/studio/start-project" className="btn-primary">
                      Start a Project <IconArrow />
                    </Link>
                    <Link href="/studio/portfolio" className="btn-ghost">
                      See Our Work
                    </Link>
                  </div>
                  {/* Founder quote */}
                  <blockquote style={{ borderLeft: `2px solid ${A}`, paddingLeft: 16, margin: 0 }}>
                    <p style={{ fontFamily: F.b, fontSize: '0.82rem', fontStyle: 'italic', lineHeight: 1.65, color: 'var(--text-muted)', margin: '0 0 6px' }}>
                      "We named it Studio because that's what it is — a workshop where things get built. Not a factory. Not an agency. A studio, where engineers and AI work together on your specific project."
                    </p>
                    <cite style={{ fontFamily: F.m, fontSize: '0.68rem', color: A, letterSpacing: '0.06em', fontStyle: 'normal' }}>Arifur Rahman, CEO</cite>
                  </blockquote>
                </motion.div>
              </div>
              {/* Right column — code editor */}
              <motion.div
                className="hero-visual"
                style={{ flex: '1 1 46%', minWidth: 0 }}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <CodeEditorVisual />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 2. SERVICES ──────────────────────────────────────────────────── */}
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
          {/* Dot grid background */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${A}18 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.4, maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1200, marginInline: 'auto', paddingInline: 'clamp(20px,5vw,32px)', position: 'relative' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <div className="sec-label" style={{ justifyContent: 'center' }}>What We Build</div>
                <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
                  Six Ways We Help You Ship.
                </h2>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {SERVICES.map((svc, i) => (
                <Reveal key={svc.title} delay={i * 0.08}>
                  <div className="svc-card">
                    {/* Icon */}
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${A}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: A, marginBottom: 18, flexShrink: 0 }}>
                      {svc.icon}
                    </div>
                    <h3 style={{ fontFamily: F.h, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{svc.title}</h3>
                    <p style={{ fontFamily: F.b, fontSize: '0.84rem', fontStyle: 'italic', color: A, margin: '0 0 12px', lineHeight: 1.4 }}>{svc.tagline}</p>
                    <p style={{ fontFamily: F.b, fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: '0 0 20px', flex: 1 }}>{svc.body}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      <span style={{ fontFamily: F.m, fontSize: '0.68rem', color: A, letterSpacing: '0.08em', background: `${A}14`, padding: '3px 10px', borderRadius: 100 }}>{svc.time}</span>
                      <Link href={svc.href} style={{ fontFamily: F.h, fontSize: '0.82rem', fontWeight: 600, color: A, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                        Learn more <IconArrow />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. PROCESS PREVIEW ───────────────────────────────────────────── */}
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1200, marginInline: 'auto', paddingInline: 'clamp(20px,5vw,32px)' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <div className="sec-label" style={{ justifyContent: 'center' }}>How We Build</div>
                <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '0 0 16px' }}>
                  AI Speed. Human Quality. Your Product.
                </h2>
                <p style={{ fontFamily: F.b, fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Average time from first call to live product: <strong style={{ color: A }}>3 weeks.</strong>
                </p>
              </div>
            </Reveal>
            <div className="process-row" style={{ display: 'flex', gap: 8, position: 'relative' }}>
              {PROCESS_STEPS.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.1}>
                  <div className="process-step">
                    <div style={{ width: 44, height: 44, borderRadius: '50%', border: `2px solid ${A}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, background: 'var(--bg)', position: 'relative', zIndex: 1 }}>
                      <span style={{ fontFamily: F.m, fontSize: '0.72rem', color: A }}>{step.n}</span>
                    </div>
                    <p style={{ fontFamily: F.h, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.01em' }}>{step.title}</p>
                    <p style={{ fontFamily: F.b, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.5}>
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <Link href="/studio/process" style={{ fontFamily: F.h, fontSize: '0.9rem', fontWeight: 600, color: A, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  See the full process <IconArrow />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 4. AI + HUMAN SPLIT ──────────────────────────────────────────── */}
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
          <div style={{ maxWidth: 1200, marginInline: 'auto', paddingInline: 'clamp(20px,5vw,32px)' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <div className="sec-label" style={{ justifyContent: 'center' }}>The Formula</div>
                <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
                  AI Writes Code Fast. We Make Sure It Works.
                </h2>
              </div>
            </Reveal>
            <div className="split-2col" style={{ display: 'flex', gap: 40, marginBottom: 40 }}>
              {/* AI column */}
              <div style={{ flex: 1 }}>
              <Reveal delay={0.05}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${A}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: A }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20} aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    </div>
                    <h3 style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>What AI Does</h3>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {AI_DOES.map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ color: A, flexShrink: 0, marginTop: 2 }}><IconCheck /></span>
                        <span style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontFamily: F.b, fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                    What takes agencies 3 months happens in days.
                  </p>
                </div>
              </Reveal>
              </div>
              {/* Human column */}
              <div style={{ flex: 1 }}>
              <Reveal delay={0.12}>
                <div style={{ background: 'var(--bg-card)', border: `1px solid ${A}30`, borderRadius: 'var(--radius-lg)', padding: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${A}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: A }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20} aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <h3 style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>What Our Engineers Do</h3>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {HUMAN_DOES.map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ color: A, flexShrink: 0, marginTop: 2 }}><IconCheck /></span>
                        <span style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              </div>
            </div>
            {/* CTO quote */}
            <Reveal delay={0.2}>
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(12px)', padding: '28px 32px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={32} height={32} aria-hidden="true" style={{ flexShrink: 0, opacity: 0.6 }}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                <div>
                  <p style={{ fontFamily: F.b, fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 12px', fontStyle: 'italic' }}>
                    "AI generates about 70% of the initial code in a typical project. Our engineers spend their time on the 30% that actually matters — the architecture decisions, the security configuration, the edge cases that would break in production."
                  </p>
                  <cite style={{ fontFamily: F.m, fontSize: '0.7rem', color: A, letterSpacing: '0.08em', fontStyle: 'normal' }}>Kamrul Hasan, CTO — SocioFi Technology</cite>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 5. PORTFOLIO TEASER ──────────────────────────────────────────── */}
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1200, marginInline: 'auto', paddingInline: 'clamp(20px,5vw,32px)' }}>
            <Reveal>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
                <div>
                  <div className="sec-label">Our Work</div>
                  <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
                    Real Projects. Real Clients. Running in Production.
                  </h2>
                </div>
                <Link href="/studio/portfolio" style={{ fontFamily: F.h, fontSize: '0.9rem', fontWeight: 600, color: A, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  See all projects <IconArrow />
                </Link>
              </div>
            </Reveal>
            <div className="port-grid">
              {PORTFOLIO.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.1}>
                  <Link href={p.href} className={`port-card${p.featured ? ' port-card-featured' : ''}`}>
                    <span style={{ fontFamily: F.m, fontSize: '0.65rem', color: A, letterSpacing: '0.1em', textTransform: 'uppercase', background: `${A}14`, padding: '3px 10px', borderRadius: 100, marginBottom: 20, display: 'inline-block' }}>{p.label}</span>
                    <h3 style={{ fontFamily: F.h, fontSize: p.featured ? '1.5rem' : '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>{p.title}</h3>
                    <p style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 20px' }}>{p.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: F.h, fontSize: '1.1rem', fontWeight: 800, color: A }}>{p.stat}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. PRICING PREVIEW ───────────────────────────────────────────── */}
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
          <div style={{ maxWidth: 1200, marginInline: 'auto', paddingInline: 'clamp(20px,5vw,32px)' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <div className="sec-label" style={{ justifyContent: 'center' }}>Transparent Pricing</div>
                <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
                  Honest Numbers. No Surprises.
                </h2>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 36 }}>
              {PRICING.map((tier, i) => (
                <Reveal key={tier.tier} delay={i * 0.1}>
                  <div className={`price-card${tier.popular ? ' popular' : ''}`}>
                    {tier.popular && (
                      <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: A, color: '#0C0C1D', fontFamily: F.m, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 14px', borderRadius: '0 0 10px 10px' }}>Most Popular</div>
                    )}
                    <h3 style={{ fontFamily: F.h, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.01em' }}>{tier.tier}</h3>
                    <div style={{ fontFamily: F.h, fontSize: '1.8rem', fontWeight: 800, color: tier.popular ? A : 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.03em' }}>{tier.range}</div>
                    <div style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, letterSpacing: '0.06em', marginBottom: 16 }}>{tier.weeks}</div>
                    <p style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>{tier.notes}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 28px', marginBottom: 32, textAlign: 'center' }}>
                <p style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>
                  Every project includes: AI-powered development · human code review · deployment · hosting setup · 30-day bug warranty · 100% code ownership.
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Link href="/studio/pricing" className="btn-primary">
                  See full pricing + configure your project <IconArrow />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 7. TESTIMONIALS ──────────────────────────────────────────────── */}
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1200, marginInline: 'auto', paddingInline: 'clamp(20px,5vw,32px)' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div className="sec-label" style={{ justifyContent: 'center' }}>What Clients Say</div>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.author} delay={i * 0.1}>
                  <div className="test-card">
                    <svg viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={24} height={24} aria-hidden="true" style={{ opacity: 0.5, marginBottom: 16 }}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                    <p style={{ fontFamily: F.b, fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 20px', fontStyle: 'italic' }}>"{t.quote}"</p>
                    <div>
                      <p style={{ fontFamily: F.h, fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{t.author}</p>
                      <p style={{ fontFamily: F.b, fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{t.role}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. WHO IT'S FOR ──────────────────────────────────────────────── */}
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
          <div style={{ maxWidth: 1200, marginInline: 'auto', paddingInline: 'clamp(20px,5vw,32px)' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div className="sec-label" style={{ justifyContent: 'center' }}>Built For</div>
                <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
                  Whether You're Starting, Stuck, or Scaling.
                </h2>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {AUDIENCE.map((a, i) => (
                <Reveal key={a.title} delay={i * 0.1}>
                  <Link href={a.href} className="audience-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <h3 style={{ fontFamily: F.h, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>{a.title}</h3>
                      <span style={{ color: A }}><IconArrow /></span>
                    </div>
                    <p style={{ fontFamily: F.m, fontSize: '0.68rem', color: A, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 12px' }}>{a.subtitle}</p>
                    <p style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{a.body}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. CROSS-DIVISION FLOW ───────────────────────────────────────── */}
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
          <div style={{ maxWidth: 1200, marginInline: 'auto', paddingInline: 'clamp(20px,5vw,32px)' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <div className="sec-label" style={{ justifyContent: 'center' }}>The Full Stack</div>
                <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '0 0 12px' }}>
                  Studio Builds It. The Rest of SocioFi Keeps It Running.
                </h2>
                <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
                  One team. One codebase. Complete accountability.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                {FLOW.map((item, i) => (
                  <div key={item.label} style={{ flex: 1, padding: '28px 24px', position: 'relative', borderRight: i < FLOW.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    {/* animated dots on connector line */}
                    {i < FLOW.length - 1 && (
                      <div aria-hidden="true" style={{ position: 'absolute', top: '50%', right: -1, width: 1, height: '60%', transform: 'translateY(-50%)', overflow: 'visible' }}>
                        {/* dots rendered as part of the border line — visual only */}
                      </div>
                    )}
                    <div style={{ fontFamily: F.m, fontSize: '0.65rem', color: A, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{item.label}</h3>
                    <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                    {i < FLOW.length - 1 && (
                      <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 30, overflow: 'hidden', pointerEvents: 'none' }}>
                        <div className="flow-dot" style={{ top: '40%', transform: 'none' }} />
                        <div className="flow-dot flow-dot-2" style={{ top: '50%', transform: 'none' }} />
                        <div className="flow-dot flow-dot-3" style={{ top: '60%', transform: 'none' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 10. CTA SECTION ──────────────────────────────────────────────── */}
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(ellipse, ${A}16 0%, transparent 65%)`, filter: 'blur(60px)' }} />
            <div style={{ position: 'absolute', top: 0, left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(58,88,158,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`, backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)' }} />
          </div>
          <div style={{ maxWidth: 800, marginInline: 'auto', paddingInline: 'clamp(20px,5vw,32px)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Reveal>
              <h2 style={{ fontFamily: F.h, fontSize: 'clamp(2rem,3.5vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--text-primary)', margin: '0 0 16px' }}>
                Ready to Build Something?
              </h2>
              <p style={{ fontFamily: F.b, fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: '0 0 36px' }}>
                Book a 30-minute call. Tell us what you need. We'll give you an honest assessment — timeline, cost, and whether we're the right fit.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 40 }}>
                <Link href="/studio/start-project" className="btn-primary">
                  Start Your Project <IconArrow />
                </Link>
                <Link href="/studio/pricing" className="btn-ghost">
                  See Pricing First
                </Link>
              </div>
              {/* CEO quote */}
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(12px)', padding: '20px 24px', textAlign: 'left', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={28} height={28} aria-hidden="true" style={{ flexShrink: 0, opacity: 0.6 }}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                <div>
                  <p style={{ fontFamily: F.b, fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: '0 0 8px', fontStyle: 'italic' }}>
                    "Most clients call expecting to need three months. We ship most projects in three weeks. The look on their face during the demo call is the best part of this job."
                  </p>
                  <cite style={{ fontFamily: F.m, fontSize: '0.68rem', color: A, letterSpacing: '0.08em', fontStyle: 'normal' }}>Arifur Rahman, CEO</cite>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </main>
    </>
  );
}
