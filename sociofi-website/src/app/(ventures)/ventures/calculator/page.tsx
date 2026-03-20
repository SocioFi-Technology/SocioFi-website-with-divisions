'use client';

import { useState, useEffect, useRef } from 'react';
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
  .calc-page { background: var(--bg); min-height: 100vh; }

  @keyframes calc-orb-drift {
    0%, 100% { transform: translate(0,0); }
    50% { transform: translate(30px, -20px); }
  }
  @keyframes calc-num-flash {
    0% { opacity: 0.4; }
    100% { opacity: 1; }
  }

  /* ── Hero ── */
  .calc-hero {
    padding: 120px 32px 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .calc-hero-inner { max-width: 700px; margin: 0 auto; position: relative; z-index: 2; }
  .calc-hero-orb {
    position: absolute; border-radius: 50%; filter: blur(130px);
    pointer-events: none; z-index: 0;
  }
  .calc-hero-orb-1 {
    width: 700px; height: 700px; background: rgba(107,163,232,0.055);
    top: -250px; left: 50%; transform: translateX(-50%);
    animation: calc-orb-drift 14s ease-in-out infinite;
  }
  .calc-hero-label {
    font-family: ${F.m}; font-size: 0.7rem; font-weight: 500; color: ${A};
    letter-spacing: 0.14em; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 10px; margin-bottom: 24px;
  }
  .calc-hero-label::before, .calc-hero-label::after {
    content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block;
  }
  .calc-hero-title {
    font-family: ${F.h}; font-size: clamp(2rem, 4vw, 3rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.03em; line-height: 1.1;
    margin-bottom: 20px;
  }
  .calc-hero-sub {
    font-family: ${F.b}; font-size: 1.05rem; color: var(--text-secondary);
    line-height: 1.75; max-width: 580px; margin: 0 auto;
  }

  /* ── Calculator panel ── */
  .calc-panel-wrap {
    padding: 0 32px 80px;
    max-width: 1100px; margin: 0 auto;
  }
  .calc-panel {
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: 28px; backdrop-filter: blur(16px);
    overflow: hidden;
  }
  .calc-grid {
    display: grid; grid-template-columns: 1fr 1fr; min-height: 600px;
  }

  /* ── Inputs column ── */
  .calc-inputs {
    padding: 48px; border-right: 1px solid var(--border);
  }
  .calc-inputs-title {
    font-family: ${F.h}; font-size: 0.8rem; font-weight: 600;
    color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 36px;
  }
  .calc-field { margin-bottom: 28px; }
  .calc-field-label {
    font-family: ${F.b}; font-size: 0.88rem; font-weight: 500;
    color: var(--text-secondary); margin-bottom: 10px; display: block;
  }
  .calc-select {
    appearance: none; -webkit-appearance: none;
    width: 100%; background: var(--bg-2); border: 1.5px solid var(--border);
    border-radius: 10px; padding: 12px 40px 12px 14px;
    font-family: ${F.b}; font-size: 0.9rem; color: var(--text-primary);
    cursor: pointer; transition: border-color 0.2s;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237C8DB0' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
  }
  .calc-select:focus { outline: none; border-color: ${A}; }

  /* Complexity radio pills */
  .calc-radio-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;
  }
  .calc-radio-btn {
    background: var(--bg-2); border: 1.5px solid var(--border);
    border-radius: 10px; padding: 10px 12px; cursor: pointer;
    transition: all 0.2s; text-align: left;
  }
  .calc-radio-btn:hover { border-color: rgba(107,163,232,0.3); }
  .calc-radio-btn.active { border-color: ${A}; background: rgba(107,163,232,0.08); }
  .calc-radio-name {
    font-family: ${F.h}; font-size: 0.8rem; font-weight: 600;
    color: var(--text-primary); margin-bottom: 2px;
  }
  .calc-radio-btn.active .calc-radio-name { color: ${A}; }
  .calc-radio-sub {
    font-family: ${F.b}; font-size: 0.7rem; color: var(--text-muted);
  }

  /* ── Outputs column ── */
  .calc-outputs {
    padding: 48px; display: flex; flex-direction: column; gap: 20px;
  }
  .calc-outputs-top { margin-bottom: 4px; }
  .calc-outputs-label {
    font-family: ${F.h}; font-size: 0.8rem; font-weight: 600;
    color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 8px;
  }
  .calc-cost-value {
    font-family: ${F.h}; font-size: 2.2rem; font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.03em; line-height: 1;
    transition: opacity 0.2s;
  }
  .calc-cost-sub {
    font-family: ${F.b}; font-size: 0.8rem; color: var(--text-muted);
    margin-top: 4px;
  }

  /* ── Model cards ── */
  .calc-model-card {
    background: var(--bg-card); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 20px 24px;
    transition: border-color 0.3s, transform 0.3s;
  }
  .calc-model-card:hover { border-color: rgba(107,163,232,0.3); transform: translateY(-2px); }
  .calc-model-card.recommended {
    border-color: ${A}; background: rgba(107,163,232,0.05);
  }
  .calc-model-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 12px;
  }
  .calc-model-name {
    font-family: ${F.h}; font-size: 0.95rem; font-weight: 700;
    color: var(--text-primary);
  }
  .calc-model-badge {
    font-family: ${F.m}; font-size: 0.6rem; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    background: rgba(107,163,232,0.12); border: 1px solid rgba(107,163,232,0.25);
    border-radius: 100px; padding: 3px 10px; color: ${A};
  }
  .calc-model-rows { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
  .calc-model-row {
    display: flex; justify-content: space-between; align-items: center;
  }
  .calc-model-key {
    font-family: ${F.b}; font-size: 0.8rem; color: var(--text-muted);
  }
  .calc-model-val {
    font-family: ${F.h}; font-size: 0.85rem; font-weight: 600;
    color: var(--text-primary); text-align: right;
  }
  .calc-model-hint {
    font-family: ${F.b}; font-size: 0.75rem; color: var(--text-muted);
    font-style: italic; padding-top: 8px; border-top: 1px solid var(--border);
  }

  /* ── Recommendation banner ── */
  .calc-rec-banner {
    background: linear-gradient(135deg, rgba(58,88,158,0.12), rgba(107,163,232,0.12));
    border: 1px solid rgba(107,163,232,0.25); border-radius: 14px;
    padding: 16px 20px; display: flex; align-items: center; gap: 12px;
  }
  .calc-rec-icon {
    width: 32px; height: 32px; flex-shrink: 0;
    background: rgba(107,163,232,0.15); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .calc-rec-label {
    font-family: ${F.m}; font-size: 0.65rem; color: ${A};
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2px;
  }
  .calc-rec-text {
    font-family: ${F.h}; font-size: 0.88rem; font-weight: 600;
    color: var(--text-primary);
  }

  /* ── Disclaimer ── */
  .calc-disclaimer {
    padding: 20px 24px; border-top: 1px solid var(--border);
    font-family: ${F.b}; font-size: 0.78rem; color: var(--text-muted);
    line-height: 1.6; text-align: center;
  }

  /* ── Bottom CTA ── */
  .calc-cta { padding: 60px 32px; text-align: center; }
  .calc-cta-inner { max-width: 560px; margin: 0 auto; }
  .calc-cta-title {
    font-family: ${F.h}; font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.025em; margin-bottom: 14px;
  }
  .calc-cta-sub {
    font-family: ${F.b}; font-size: 0.95rem; color: var(--text-secondary);
    line-height: 1.7; margin-bottom: 28px;
  }
  .calc-cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .calc-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 12px;
    background: linear-gradient(135deg, #3A589E, ${A});
    color: white; font-family: ${F.h}; font-size: 0.9rem; font-weight: 600;
    text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(107,163,232,0.35);
  }
  .calc-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(107,163,232,0.5); }
  .calc-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px; border-radius: 12px;
    border: 1.5px solid var(--border); background: transparent;
    color: var(--text-primary); font-family: ${F.h}; font-size: 0.9rem; font-weight: 600;
    text-decoration: none; transition: all 0.2s;
  }
  .calc-btn-ghost:hover { border-color: ${A}; color: ${A}; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .calc-grid { grid-template-columns: 1fr; }
    .calc-inputs { border-right: none; border-bottom: 1px solid var(--border); }
  }
  @media (max-width: 768px) {
    .calc-hero { padding: 100px 20px 60px; }
    .calc-panel-wrap { padding: 0 20px 60px; }
    .calc-inputs { padding: 32px 24px; }
    .calc-outputs { padding: 32px 24px; }
    .calc-cta { padding: 50px 20px; }
  }
  @media (max-width: 480px) {
    .calc-radio-grid { grid-template-columns: 1fr; }
    .calc-cta-row { flex-direction: column; align-items: stretch; }
    .calc-btn-primary, .calc-btn-ghost { justify-content: center; }
  }
`;

// ── Types ──────────────────────────────────────────────────────────────────────
type ProductType = 'MVP' | 'Web Application' | 'SaaS Platform' | 'Internal Tool' | 'Mobile App';
type Complexity = 'simple' | 'moderate' | 'complex' | 'enterprise';
type RevenueBand = 'unknown' | 'low' | 'mid-low' | 'mid' | 'mid-high' | 'high';
type BudgetBand = 'none' | 'tiny' | 'small' | 'medium' | 'large';

const PRODUCT_COSTS: Record<ProductType, number> = {
  'MVP': 8000,
  'Web Application': 10000,
  'SaaS Platform': 15000,
  'Internal Tool': 8000,
  'Mobile App': 18000,
};

const COMPLEXITY_MULTI: Record<Complexity, number> = {
  simple: 0.7,
  moderate: 1.0,
  complex: 1.4,
  enterprise: 1.9,
};

const COMPLEXITY_OPTIONS: { id: Complexity; name: string; sub: string }[] = [
  { id: 'simple', name: 'Simple', sub: '1–2 features' },
  { id: 'moderate', name: 'Moderate', sub: '3–5 features' },
  { id: 'complex', name: 'Complex', sub: '6+ features' },
  { id: 'enterprise', name: 'Enterprise', sub: '10+ features' },
];

const REVENUE_OPTIONS: { id: RevenueBand; label: string; value: number }[] = [
  { id: 'unknown', label: 'Not sure', value: 0 },
  { id: 'low', label: '$1,000–$5,000/mo', value: 3000 },
  { id: 'mid-low', label: '$5,000–$10,000/mo', value: 7500 },
  { id: 'mid', label: '$10,000–$25,000/mo', value: 17500 },
  { id: 'mid-high', label: '$25,000–$50,000/mo', value: 37500 },
  { id: 'high', label: '$50,000+/mo', value: 60000 },
];

const BUDGET_OPTIONS: { id: BudgetBand; label: string; value: number }[] = [
  { id: 'none', label: 'None ($0)', value: 0 },
  { id: 'tiny', label: 'Up to $2,000', value: 2000 },
  { id: 'small', label: '$2,000–$5,000', value: 4000 },
  { id: 'medium', label: '$5,000–$8,000', value: 6500 },
  { id: 'large', label: '$8,000+', value: 9000 },
];

// ── Animated number hook ───────────────────────────────────────────────────────
function useAnimatedNumber(target: number, decimals = 0) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | undefined>(undefined);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    startRef.current = undefined;
    const duration = 400;

    function step(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * ease;
      setDisplay(parseFloat(current.toFixed(decimals)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = target;
      }
    }
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current); };
  }, [target, decimals]);

  return display;
}

// ── Icons ──────────────────────────────────────────────────────────────────────
function LightbulbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2a5 5 0 0 1 3.5 8.5c-.5.5-.5 1-.5 1.5v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1c0-.5 0-1-.5-1.5A5 5 0 0 1 9 2z" stroke={A} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 15h4" stroke={A} strokeWidth="1.5" strokeLinecap="round" />
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

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString();
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function CalculatorPage() {
  const [productType, setProductType] = useState<ProductType>('SaaS Platform');
  const [complexity, setComplexity] = useState<Complexity>('moderate');
  const [revenueBand, setRevenueBand] = useState<RevenueBand>('mid-low');
  const [budgetBand, setBudgetBand] = useState<BudgetBand>('none');

  // Derived values
  const baseCost = PRODUCT_COSTS[productType];
  const estimatedCost = baseCost * COMPLEXITY_MULTI[complexity];
  const revenueEst = (REVENUE_OPTIONS.find(r => r.id === revenueBand) ?? REVENUE_OPTIONS[0]).value;
  const budget = (BUDGET_OPTIONS.find(b => b.id === budgetBand) ?? BUDGET_OPTIONS[0]).value;

  // Equity model
  const equityLow = Math.min(20, Math.max(5, (estimatedCost / 1000) * 0.3));
  const equityHigh = Math.min(20, equityLow * 1.5);

  // Revenue share model
  const revShare = revenueEst > 0 ? 10 : 12;
  const revShareCap = estimatedCost * 2.5;
  const revSharePayoff =
    revenueEst > 0
      ? Math.ceil(revShareCap / (revenueEst * (revShare / 100)))
      : null;

  // Hybrid model
  const hybridEquity = equityLow * (1 - budget / estimatedCost) * 0.7;
  const hybridRevShare = revShare - 2;
  const hybridCap = revShareCap * (1 - budget / estimatedCost * 0.5);

  // Recommendation
  const recommendation =
    budget === 0 && revenueEst === 0
      ? 'Equity Model'
      : budget === 0 && revenueEst > 0
      ? 'Revenue Share Model'
      : 'Hybrid Model';

  const animatedCost = useAnimatedNumber(estimatedCost, 0);

  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } };

  return (
    <>
      <style>{STYLES}</style>
      <main className="calc-page">

        {/* ── Hero ── */}
        <section className="calc-hero">
          <div className="calc-hero-orb calc-hero-orb-1" aria-hidden="true" />
          <motion.div
            className="calc-hero-inner"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div className="calc-hero-label" variants={fadeUp}>
              Deal Calculator
            </motion.div>
            <motion.h1 className="calc-hero-title" variants={fadeUp}>
              Estimate Your Partnership Terms.
            </motion.h1>
            <motion.p className="calc-hero-sub" variants={fadeUp}>
              Input your scenario. See ballpark terms for each deal model. These are estimates — actual terms are negotiated on a call.
            </motion.p>
          </motion.div>
        </section>

        {/* ── Calculator ── */}
        <motion.div
          className="calc-panel-wrap"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
        >
          <motion.div className="calc-panel" variants={fadeUp}>
            <div className="calc-grid">

              {/* INPUTS */}
              <div className="calc-inputs">
                <div className="calc-inputs-title">Your Inputs</div>

                {/* Product type */}
                <div className="calc-field">
                  <label className="calc-field-label" htmlFor="product-type">
                    What type of product?
                  </label>
                  <select
                    id="product-type"
                    className="calc-select"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as ProductType)}
                  >
                    {(Object.keys(PRODUCT_COSTS) as ProductType[]).map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>

                {/* Complexity */}
                <div className="calc-field">
                  <span className="calc-field-label">Complexity</span>
                  <div className="calc-radio-grid">
                    {COMPLEXITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        className={`calc-radio-btn${complexity === opt.id ? ' active' : ''}`}
                        onClick={() => setComplexity(opt.id)}
                        aria-pressed={complexity === opt.id}
                      >
                        <div className="calc-radio-name">{opt.name}</div>
                        <div className="calc-radio-sub">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Revenue */}
                <div className="calc-field">
                  <label className="calc-field-label" htmlFor="revenue-est">
                    Expected monthly revenue after 12 months
                  </label>
                  <select
                    id="revenue-est"
                    className="calc-select"
                    value={revenueBand}
                    onChange={(e) => setRevenueBand(e.target.value as RevenueBand)}
                  >
                    {REVENUE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div className="calc-field">
                  <label className="calc-field-label" htmlFor="budget">
                    Available upfront budget
                  </label>
                  <select
                    id="budget"
                    className="calc-select"
                    value={budgetBand}
                    onChange={(e) => setBudgetBand(e.target.value as BudgetBand)}
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* OUTPUTS */}
              <div className="calc-outputs">
                <div className="calc-outputs-top">
                  <div className="calc-outputs-label">Estimated build cost</div>
                  <div className="calc-cost-value">{fmt(animatedCost)}</div>
                  <div className="calc-cost-sub">Studio-equivalent development value</div>
                </div>

                {/* Equity model */}
                <div className={`calc-model-card${recommendation === 'Equity Model' ? ' recommended' : ''}`}>
                  <div className="calc-model-header">
                    <span className="calc-model-name">Equity Model</span>
                    {recommendation === 'Equity Model' && (
                      <span className="calc-model-badge">Recommended</span>
                    )}
                  </div>
                  <div className="calc-model-rows">
                    <div className="calc-model-row">
                      <span className="calc-model-key">Estimated equity</span>
                      <span className="calc-model-val">
                        {equityLow.toFixed(1)}–{equityHigh.toFixed(1)}%
                      </span>
                    </div>
                    <div className="calc-model-row">
                      <span className="calc-model-key">Vesting</span>
                      <span className="calc-model-val">2-yr cliff / 4-yr total</span>
                    </div>
                    <div className="calc-model-row">
                      <span className="calc-model-key">Your upfront cost</span>
                      <span className="calc-model-val">$0</span>
                    </div>
                  </div>
                  <div className="calc-model-hint">Best if: you&apos;re pre-revenue with high growth potential</div>
                </div>

                {/* Revenue share model */}
                <div className={`calc-model-card${recommendation === 'Revenue Share Model' ? ' recommended' : ''}`}>
                  <div className="calc-model-header">
                    <span className="calc-model-name">Revenue Share Model</span>
                    {recommendation === 'Revenue Share Model' && (
                      <span className="calc-model-badge">Recommended</span>
                    )}
                  </div>
                  <div className="calc-model-rows">
                    <div className="calc-model-row">
                      <span className="calc-model-key">Estimated share</span>
                      <span className="calc-model-val">{revShare}%</span>
                    </div>
                    <div className="calc-model-row">
                      <span className="calc-model-key">Cap</span>
                      <span className="calc-model-val">{fmt(revShareCap)}</span>
                    </div>
                    <div className="calc-model-row">
                      <span className="calc-model-key">Payoff timeline</span>
                      <span className="calc-model-val">
                        {revSharePayoff ? `~${revSharePayoff} months` : 'Depends on revenue'}
                      </span>
                    </div>
                    <div className="calc-model-row">
                      <span className="calc-model-key">Your upfront cost</span>
                      <span className="calc-model-val">$0</span>
                    </div>
                  </div>
                  <div className="calc-model-hint">Best if: you have clear near-term revenue</div>
                </div>

                {/* Hybrid model — only if budget > 0 */}
                {budget > 0 && (
                  <div className={`calc-model-card${recommendation === 'Hybrid Model' ? ' recommended' : ''}`}>
                    <div className="calc-model-header">
                      <span className="calc-model-name">Hybrid Model</span>
                      {recommendation === 'Hybrid Model' && (
                        <span className="calc-model-badge">Recommended</span>
                      )}
                    </div>
                    <div className="calc-model-rows">
                      <div className="calc-model-row">
                        <span className="calc-model-key">Your upfront payment</span>
                        <span className="calc-model-val">{fmt(budget)}</span>
                      </div>
                      <div className="calc-model-row">
                        <span className="calc-model-key">Reduced equity</span>
                        <span className="calc-model-val">{Math.max(1, hybridEquity).toFixed(1)}%</span>
                      </div>
                      <div className="calc-model-row">
                        <span className="calc-model-key">OR revenue share</span>
                        <span className="calc-model-val">{hybridRevShare}%, cap {fmt(hybridCap)}</span>
                      </div>
                    </div>
                    <div className="calc-model-hint">Best if: you want to minimize equity dilution</div>
                  </div>
                )}

                {/* Recommendation banner */}
                <div className="calc-rec-banner">
                  <div className="calc-rec-icon">
                    <LightbulbIcon />
                  </div>
                  <div>
                    <div className="calc-rec-label">Our likely recommendation</div>
                    <div className="calc-rec-text">{recommendation}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="calc-disclaimer">
              These are rough estimates based on typical projects. Actual terms are discussed on a call after application review. Every deal is unique.
            </div>
          </motion.div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.section
          className="calc-cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div className="calc-cta-inner">
            <motion.h2 className="calc-cta-title" variants={fadeUp}>
              Like what you see? Apply.
            </motion.h2>
            <motion.p className="calc-cta-sub" variants={fadeUp}>
              These numbers are a starting point. Every deal is negotiated based on your idea, your market, and your stage. Apply and we&apos;ll talk through the real terms.
            </motion.p>
            <motion.div className="calc-cta-row" variants={fadeUp}>
              <Link href="/ventures/apply" className="calc-btn-primary">
                Apply to Ventures <ArrowRight />
              </Link>
              <Link href="/ventures/criteria" className="calc-btn-ghost">
                Check criteria
              </Link>
            </motion.div>
          </div>
        </motion.section>

      </main>
    </>
  );
}
