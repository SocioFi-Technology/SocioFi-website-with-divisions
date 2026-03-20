'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ── Design tokens ──────────────────────────────────────────────────────────────
const A = '#6BA3E8';
const F = {
  h: "var(--font-display,'Syne'),sans-serif",
  b: "var(--font-body,'Outfit'),sans-serif",
  m: "var(--font-mono,'Fira Code'),monospace",
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const STYLES = `
  .crit-page { background: var(--bg); min-height: 100vh; }

  @keyframes crit-orb-float {
    0%, 100% { transform: translate(0,0); }
    50% { transform: translate(-20px, 15px); }
  }

  /* ── Hero ── */
  .crit-hero {
    padding: 120px 32px 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .crit-hero-inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 2; }
  .crit-hero-orb {
    position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0;
  }
  .crit-hero-orb-1 { width: 600px; height: 600px; background: rgba(107,163,232,0.06); top: -200px; left: 50%; transform: translateX(-50%); animation: crit-orb-float 12s ease-in-out infinite; }
  .crit-hero-label {
    font-family: ${F.m}; font-size: 0.7rem; font-weight: 500; color: ${A};
    letter-spacing: 0.14em; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 10px; margin-bottom: 24px;
  }
  .crit-hero-label::before, .crit-hero-label::after {
    content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block;
  }
  .crit-hero-title {
    font-family: ${F.h}; font-size: clamp(2rem, 4vw, 3rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.03em; line-height: 1.1;
    margin-bottom: 20px;
  }
  .crit-hero-sub {
    font-family: ${F.b}; font-size: 1.05rem; color: var(--text-secondary);
    line-height: 1.75; max-width: 620px; margin: 0 auto;
  }

  /* ── Section wrapper ── */
  .crit-section {
    padding: 80px 32px;
    max-width: 900px; margin: 0 auto;
  }
  .crit-section:nth-of-type(even) { background: var(--bg-2); }

  /* ── Criterion header ── */
  .crit-cr-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    flex-wrap: wrap; gap: 16px; margin-bottom: 16px;
  }
  .crit-cr-name {
    font-family: ${F.h}; font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.025em;
  }
  .crit-weight-badge {
    display: inline-flex; align-items: center;
    background: rgba(107,163,232,0.1); border: 1px solid rgba(107,163,232,0.25);
    border-radius: 100px; padding: 6px 16px;
    font-family: ${F.m}; font-size: 0.68rem; font-weight: 500;
    color: ${A}; letter-spacing: 0.06em; white-space: nowrap;
  }
  .crit-cr-desc {
    font-family: ${F.b}; font-size: 1rem; color: var(--text-secondary);
    line-height: 1.75; margin-bottom: 32px; max-width: 700px;
  }

  /* ── Score cards ── */
  .crit-score-grid {
    display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;
    margin-bottom: 28px;
  }
  .crit-score-card {
    background: var(--bg-card); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 16px 12px; cursor: pointer;
    transition: all 0.25s; text-align: center;
  }
  .crit-score-card:hover { border-color: rgba(107,163,232,0.35); transform: translateY(-2px); }
  .crit-score-card.selected {
    border-color: ${A}; background: rgba(107,163,232,0.08);
  }
  .crit-score-num {
    font-family: ${F.h}; font-size: 1.4rem; font-weight: 800;
    color: var(--text-muted); margin-bottom: 4px; transition: color 0.2s;
  }
  .crit-score-card.selected .crit-score-num { color: ${A}; }
  .crit-score-label {
    font-family: ${F.h}; font-size: 0.72rem; font-weight: 600;
    color: var(--text-secondary); margin-bottom: 8px;
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .crit-score-desc {
    font-family: ${F.b}; font-size: 0.72rem; color: var(--text-muted);
    line-height: 1.5;
  }

  /* ── Example 5 blockquote ── */
  .crit-example {
    border-left: 3px solid ${A}; padding: 16px 20px;
    background: rgba(107,163,232,0.05); border-radius: 0 12px 12px 0;
    margin-bottom: 0;
  }
  .crit-example-label {
    font-family: ${F.m}; font-size: 0.65rem; color: ${A};
    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;
  }
  .crit-example-text {
    font-family: ${F.b}; font-size: 0.92rem; color: var(--text-secondary);
    line-height: 1.65; font-style: italic;
  }

  /* ── Self-scorer ── */
  .crit-scorer {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 24px; padding: 48px; margin: 0 auto;
    max-width: 900px;
  }
  .crit-scorer-title {
    font-family: ${F.h}; font-size: 1.6rem; font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.02em; margin-bottom: 32px;
  }
  .crit-scorer-row {
    display: flex; align-items: center; gap: 20px;
    padding: 16px 0; border-bottom: 1px solid var(--border);
  }
  .crit-scorer-row:last-of-type { border-bottom: none; }
  .crit-scorer-name {
    font-family: ${F.h}; font-size: 0.9rem; font-weight: 600;
    color: var(--text-primary); flex: 1; min-width: 0;
  }
  .crit-scorer-weight {
    font-family: ${F.m}; font-size: 0.65rem; color: var(--text-muted);
    letter-spacing: 0.06em; white-space: nowrap;
  }
  .crit-scorer-select {
    appearance: none; -webkit-appearance: none;
    background: var(--bg-2); border: 1.5px solid var(--border);
    border-radius: 8px; padding: 8px 36px 8px 12px;
    font-family: ${F.b}; font-size: 0.88rem; color: var(--text-primary);
    cursor: pointer; transition: border-color 0.2s;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237C8DB0' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
    min-width: 90px;
  }
  .crit-scorer-select:focus { outline: none; border-color: ${A}; }

  /* ── Score display ── */
  .crit-score-display { text-align: center; padding: 32px 0; }
  .crit-score-big {
    font-family: ${F.h}; font-size: 5rem; font-weight: 800;
    letter-spacing: -0.04em; line-height: 1; margin-bottom: 8px;
    transition: color 0.4s;
  }
  .crit-score-big.green { color: #4ADE80; }
  .crit-score-big.amber { color: #FBBF24; }
  .crit-score-big.red { color: #F87171; }
  .crit-score-band {
    font-family: ${F.b}; font-size: 1rem; color: var(--text-secondary);
    line-height: 1.5;
  }

  /* ── Result card ── */
  .crit-result-card {
    border-radius: 16px; padding: 24px 28px; margin-top: 28px;
    border: 1.5px solid; transition: all 0.4s;
  }
  .crit-result-card.green { background: rgba(74,222,128,0.06); border-color: rgba(74,222,128,0.3); }
  .crit-result-card.amber { background: rgba(251,191,36,0.06); border-color: rgba(251,191,36,0.3); }
  .crit-result-card.red { background: rgba(248,113,113,0.06); border-color: rgba(248,113,113,0.3); }
  .crit-result-title {
    font-family: ${F.h}; font-size: 1rem; font-weight: 700; margin-bottom: 6px;
  }
  .crit-result-card.green .crit-result-title { color: #4ADE80; }
  .crit-result-card.amber .crit-result-title { color: #FBBF24; }
  .crit-result-card.red .crit-result-title { color: #F87171; }
  .crit-result-text {
    font-family: ${F.b}; font-size: 0.9rem; color: var(--text-secondary);
    line-height: 1.6;
  }

  /* ── CTA buttons ── */
  .crit-cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
  .crit-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 12px;
    background: linear-gradient(135deg, #3A589E, ${A});
    color: white; font-family: ${F.h}; font-size: 0.9rem; font-weight: 600;
    text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(107,163,232,0.35);
  }
  .crit-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(107,163,232,0.5); }
  .crit-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px; border-radius: 12px;
    border: 1.5px solid var(--border); background: transparent;
    color: var(--text-primary); font-family: ${F.h}; font-size: 0.9rem; font-weight: 600;
    text-decoration: none; transition: all 0.2s;
  }
  .crit-btn-ghost:hover { border-color: ${A}; color: ${A}; }

  /* ── Disqualifiers ── */
  .crit-dq-section {
    padding: 80px 32px;
    background: var(--bg-2);
  }
  .crit-dq-inner { max-width: 900px; margin: 0 auto; }
  .crit-dq-label {
    font-family: ${F.m}; font-size: 0.7rem; font-weight: 500; color: #F87171;
    letter-spacing: 0.14em; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }
  .crit-dq-label::before { content: ''; width: 20px; height: 1.5px; background: #F87171; display: inline-block; }
  .crit-dq-title {
    font-family: ${F.h}; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.025em; margin-bottom: 12px;
  }
  .crit-dq-subtitle {
    font-family: ${F.b}; font-size: 0.95rem; color: var(--text-secondary);
    line-height: 1.65; margin-bottom: 36px;
  }
  .crit-dq-list { display: flex; flex-direction: column; gap: 12px; }
  .crit-dq-item {
    display: flex; align-items: flex-start; gap: 14px;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px 20px;
    transition: border-color 0.2s;
  }
  .crit-dq-item:hover { border-color: rgba(248,113,113,0.3); }
  .crit-dq-icon {
    width: 20px; height: 20px; flex-shrink: 0; margin-top: 1px;
  }
  .crit-dq-text {
    font-family: ${F.b}; font-size: 0.92rem; color: var(--text-secondary);
    line-height: 1.6;
  }
  .crit-dq-note {
    margin-top: 24px;
    font-family: ${F.b}; font-size: 0.88rem; color: var(--text-muted);
    font-style: italic;
  }

  /* ── Final CTA ── */
  .crit-final-cta {
    padding: 80px 32px;
    text-align: center;
  }
  .crit-final-inner { max-width: 640px; margin: 0 auto; }
  .crit-final-title {
    font-family: ${F.h}; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.025em; margin-bottom: 16px;
  }
  .crit-final-sub {
    font-family: ${F.b}; font-size: 1rem; color: var(--text-secondary);
    line-height: 1.75; margin-bottom: 32px;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .crit-hero { padding: 100px 20px 60px; }
    .crit-section { padding: 60px 20px; }
    .crit-score-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .crit-cr-header { flex-direction: column; }
    .crit-scorer { padding: 28px 20px; }
    .crit-scorer-row { flex-wrap: wrap; }
    .crit-dq-section { padding: 60px 20px; }
    .crit-final-cta { padding: 60px 20px; }
    .crit-score-big { font-size: 3.5rem; }
    /* ── Mobile: section header centering ── */
    .crit-hero-label { justify-content: center; }
    .crit-hero-h1 { text-align: center; }
    .crit-hero-sub { text-align: center; }
    /* ── Mobile: full-width sliders with larger thumb ── */
    input[type=range] { width: 100%; }
    input[type=range]::-webkit-slider-thumb { width: 28px; height: 28px; }
    input[type=range]::-moz-range-thumb { width: 28px; height: 28px; }
  }
  @media (max-width: 480px) {
    .crit-score-grid { grid-template-columns: repeat(2, 1fr); }
    .crit-cta-row { flex-direction: column; }
    .crit-btn-primary, .crit-btn-ghost { justify-content: center; }
  }
`;

// ── Data ───────────────────────────────────────────────────────────────────────
const CRITERIA = [
  {
    id: 'fmf',
    name: 'Founder-Market Fit',
    weight: 25,
    description:
      "You've worked in this industry. You know the customers, the problems, the language. You're not guessing — you KNOW this market needs this product.",
    scores: [
      { n: 5, label: 'Exceptional', desc: '10+ years in the industry, extensive network, has experienced the problem firsthand as a practitioner' },
      { n: 4, label: 'Strong', desc: '5+ years, good understanding, some industry connections' },
      { n: 3, label: 'Adequate', desc: '2+ years, or adjacent industry experience with demonstrated research' },
      { n: 2, label: 'Weak', desc: 'Less than 1 year, mostly research-based knowledge' },
      { n: 1, label: 'Not ready', desc: "No industry experience. 'I just think it's a good idea.'" },
    ],
    example: "I've managed restaurant operations for 8 years across 3 cities. I've dealt with reservation chaos personally at every restaurant I've run.",
  },
  {
    id: 'dv',
    name: 'Demand Validation',
    weight: 25,
    description:
      'Someone has told you they want this — ideally with their wallet. Waitlists, letters of intent, pre-orders, early customers. Evidence > opinions.',
    scores: [
      { n: 5, label: 'Exceptional', desc: 'Paying customers or pre-orders. Money has changed hands.' },
      { n: 4, label: 'Strong', desc: 'Waitlist of 100+, letters of intent, or signed pilot agreements' },
      { n: 3, label: 'Adequate', desc: '10+ customer conversations with clear positive signals and documented interest' },
      { n: 2, label: 'Weak', desc: 'A few conversations, mixed signals, or survey responses only' },
      { n: 1, label: 'Not ready', desc: "Zero validation. 'I believe the demand exists.'" },
    ],
    example: '47 restaurants have pre-paid $99/year for early access. We have a waitlist of 200 more.',
  },
  {
    id: 'rmc',
    name: 'Revenue Model Clarity',
    weight: 20,
    description:
      "You know how this makes money. Not 'we'll figure it out' — actual pricing, actual customers, actual path to revenue.",
    scores: [
      { n: 5, label: 'Exceptional', desc: 'Clear pricing, identified customers, concrete path to $10K MRR in 12 months' },
      { n: 4, label: 'Strong', desc: 'Clear pricing model, realistic revenue projections backed by market research' },
      { n: 3, label: 'Adequate', desc: 'Business model defined, rough projections, some uncertainty in pricing' },
      { n: 2, label: 'Weak', desc: "Vague monetization — 'we'll charge for premium features eventually'" },
      { n: 1, label: 'Not ready', desc: "'We'll figure out monetization later.'" },
    ],
    example: '$49/month per restaurant location. 47 pre-paying at $99/year. Target: 200 locations in year 1 = $117K ARR.',
  },
  {
    id: 'tf',
    name: 'Technical Feasibility',
    weight: 15,
    description:
      "We can build this. It fits our tech stack, it's scoped to an achievable MVP, and it doesn't require technology we don't have.",
    scores: [
      { n: 5, label: 'Exceptional', desc: 'Clear scope, fits our tech stack perfectly, buildable in 3–5 weeks, well-defined MVP' },
      { n: 4, label: 'Strong', desc: 'Good scope, mostly fits our stack, 5–8 week build estimate' },
      { n: 3, label: 'Adequate', desc: 'Reasonable scope, some unknowns, 6–10 week estimate' },
      { n: 2, label: 'Weak', desc: 'Scope creep risk, some unfamiliar technology' },
      { n: 1, label: 'Not ready', desc: 'Requires hardware, blockchain, complex gaming, or technology outside our capabilities' },
    ],
    example: 'Web app (Next.js), PostgreSQL, simple reservation management and SMS notifications. No hardware.',
  },
  {
    id: 'fc',
    name: 'Founder Commitment',
    weight: 15,
    description:
      "You're going full-time on this (or close to it) once the product is built. You'll handle sales, marketing, and growth. We build — you sell.",
    scores: [
      { n: 5, label: 'Exceptional', desc: 'Full-time on this, has a concrete growth plan, has already started sales/marketing outreach' },
      { n: 4, label: 'Strong', desc: 'Full-time or transitioning to full-time within 30 days, clear growth plan' },
      { n: 3, label: 'Adequate', desc: 'Part-time transitioning to full-time, growth plan exists but early stage' },
      { n: 2, label: 'Weak', desc: 'Part-time with no clear transition plan, vague growth strategy' },
      { n: 1, label: 'Not ready', desc: 'Hobby project, no growth plan, expects SocioFi to also do marketing and sales' },
    ],
    example: "I've already signed up to speak at 3 restaurant industry conferences. I'm resigning from my current role when we sign the term sheet.",
  },
];

const DISQUALIFIERS = [
  'No domain expertise — the founder has never worked in the industry they are building for',
  'No validation — zero evidence that anyone wants this product',
  '"Build it and they will come" mentality — no growth plan',
  'Expects SocioFi to also do marketing and sales',
  'Unwilling to sign an NDA (a red flag for trust)',
  'Product requires technology outside our capabilities (hardware, blockchain, gaming)',
  'Founder not committed to working on this full-time (or nearly full-time) post-launch',
  'Unreasonable equity expectations (wants us to build for 1–2% equity)',
];

const WEIGHTS = { fmf: 0.25, dv: 0.25, rmc: 0.20, tf: 0.15, fc: 0.15 };

// ── Helpers ────────────────────────────────────────────────────────────────────
function XIcon() {
  return (
    <svg className="crit-dq-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="#F87171" strokeWidth="1.5" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function CriteriaPage() {
  const [selectedScores, setSelectedScores] = useState<Record<string, number>>({
    fmf: 3, dv: 3, rmc: 3, tf: 3, fc: 3,
  });
  const [scorerSelections, setScorerSelections] = useState<Record<string, number>>({
    fmf: 3, dv: 3, rmc: 3, tf: 3, fc: 3,
  });

  const weightedScore =
    CRITERIA.reduce((sum, c) => sum + scorerSelections[c.id] * WEIGHTS[c.id as keyof typeof WEIGHTS], 0);
  const displayScore = weightedScore.toFixed(1);

  const scoreColor = weightedScore >= 4.0 ? 'green' : weightedScore >= 3.0 ? 'amber' : 'red';

  const bandText =
    weightedScore >= 4.0
      ? 'Strong candidate. Apply.'
      : weightedScore >= 3.5
      ? 'Competitive. Apply and emphasize your strengths.'
      : weightedScore >= 3.0
      ? 'Borderline. Consider strengthening before applying.'
      : 'Not ready yet. Here is how to improve.';

  const tipText =
    weightedScore < 3.0
      ? 'Focus on getting at least 3 paying customers or 50 waitlist sign-ups, and document your domain experience concretely before applying.'
      : null;

  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } };

  return (
    <>
      <style>{STYLES}</style>
      <main className="crit-page">

        {/* ── Hero ── */}
        <section className="crit-hero">
          <div className="crit-hero-orb crit-hero-orb-1" aria-hidden="true" />
          <motion.div
            className="crit-hero-inner"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div className="crit-hero-label" variants={fadeUp}>
              Selection Criteria
            </motion.div>
            <motion.h1 className="crit-hero-title" variants={fadeUp}>
              Here&apos;s Exactly What We Look For.<br />Score Yourself.
            </motion.h1>
            <motion.p className="crit-hero-sub" variants={fadeUp}>
              We&apos;re transparent about our evaluation process. Before you apply, check if you meet our criteria — and be honest with yourself.
            </motion.p>
          </motion.div>
        </section>

        {/* ── 5 Criterion Sections ── */}
        {CRITERIA.map((criterion, idx) => (
          <motion.section
            key={criterion.id}
            className="crit-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            style={{ background: idx % 2 === 1 ? 'var(--bg-2)' : 'var(--bg)', padding: '80px 32px' }}
          >
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <motion.div className="crit-cr-header" variants={fadeUp}>
                <h2 className="crit-cr-name">{criterion.name}</h2>
                <span className="crit-weight-badge">{criterion.weight}% of evaluation</span>
              </motion.div>

              <motion.p className="crit-cr-desc" variants={fadeUp}>
                {criterion.description}
              </motion.p>

              <motion.div className="crit-score-grid" variants={fadeUp}>
                {[...criterion.scores].reverse().map((s) => (
                  <button
                    key={s.n}
                    className={`crit-score-card${selectedScores[criterion.id] === s.n ? ' selected' : ''}`}
                    onClick={() => setSelectedScores(prev => ({ ...prev, [criterion.id]: s.n }))}
                    aria-pressed={selectedScores[criterion.id] === s.n}
                  >
                    <div className="crit-score-num">{s.n}</div>
                    <div className="crit-score-label">{s.label}</div>
                    <div className="crit-score-desc">{s.desc}</div>
                  </button>
                ))}
              </motion.div>

              <motion.blockquote className="crit-example" variants={fadeUp}>
                <div className="crit-example-label">Score 5 example</div>
                <p className="crit-example-text">&ldquo;{criterion.example}&rdquo;</p>
              </motion.blockquote>
            </div>
          </motion.section>
        ))}

        {/* ── Self-Scorer ── */}
        <motion.section
          style={{ padding: '80px 32px', background: 'var(--bg)' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <motion.div variants={fadeUp} className="crit-scorer">
              <h2 className="crit-scorer-title">Your Score</h2>

              {CRITERIA.map((c) => (
                <div key={c.id} className="crit-scorer-row">
                  <span className="crit-scorer-name">{c.name}</span>
                  <span className="crit-scorer-weight">{c.weight}%</span>
                  <select
                    className="crit-scorer-select"
                    value={scorerSelections[c.id]}
                    onChange={(e) =>
                      setScorerSelections(prev => ({ ...prev, [c.id]: Number(e.target.value) }))
                    }
                    aria-label={`Score for ${c.name}`}
                  >
                    {[5, 4, 3, 2, 1].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="crit-score-display">
                <div className={`crit-score-big ${scoreColor}`}>{displayScore}</div>
                <div className="crit-score-band">out of 5.0 weighted average</div>
              </div>

              <div className={`crit-result-card ${scoreColor}`}>
                <div className="crit-result-title">{bandText}</div>
                {tipText && <div className="crit-result-text">{tipText}</div>}
              </div>

              <div className="crit-cta-row">
                {weightedScore >= 3.5 ? (
                  <Link href="/ventures/apply" className="crit-btn-primary">
                    Apply now <ArrowRight />
                  </Link>
                ) : (
                  <>
                    <Link href="/ventures/apply" className="crit-btn-ghost">
                      Apply anyway <ArrowRight />
                    </Link>
                    <Link href="/ventures/how-it-works" className="crit-btn-ghost">
                      Learn more
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Automatic Disqualifiers ── */}
        <motion.section
          className="crit-dq-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          <div className="crit-dq-inner">
            <motion.div className="crit-dq-label" variants={fadeUp}>
              Automatic Disqualifiers
            </motion.div>
            <motion.h2 className="crit-dq-title" variants={fadeUp}>
              We won&apos;t accept applications that have ANY of these:
            </motion.h2>
            <motion.p className="crit-dq-subtitle" variants={fadeUp}>
              Check this list carefully. If any of these apply, work on them before applying.
            </motion.p>
            <div className="crit-dq-list">
              {DISQUALIFIERS.map((dq, i) => (
                <motion.div key={i} className="crit-dq-item" variants={fadeUp}>
                  <XIcon />
                  <span className="crit-dq-text">{dq}</span>
                </motion.div>
              ))}
            </div>
            <motion.p className="crit-dq-note" variants={fadeUp}>
              If any of these apply, work on them before applying.
            </motion.p>
          </div>
        </motion.section>

        {/* ── Final CTA ── */}
        <motion.section
          className="crit-final-cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div className="crit-final-inner">
            <motion.h2 className="crit-final-title" variants={fadeUp}>
              {weightedScore >= 3.5 ? "You look like a strong candidate." : "Not there yet? Keep building."}
            </motion.h2>
            <motion.p className="crit-final-sub" variants={fadeUp}>
              {weightedScore >= 3.5
                ? "We review every application personally. Tell us what you're building and why you're the person to build it."
                : "Most successful founders applied when their score was a 3.5 or higher. Get one more paying customer, document your expertise, then come back."}
            </motion.p>
            <motion.div className="crit-cta-row" style={{ justifyContent: 'center' }} variants={fadeUp}>
              <Link href="/ventures/apply" className="crit-btn-primary">
                Apply to Ventures <ArrowRight />
              </Link>
              <Link href="/ventures/calculator" className="crit-btn-ghost">
                Estimate deal terms
              </Link>
            </motion.div>
          </div>
        </motion.section>

      </main>
    </>
  );
}
