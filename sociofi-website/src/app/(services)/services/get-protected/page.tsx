'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const A = '#4DBFA8';

const STYLES = `
  @keyframes svcPulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.15); }
  }

  .gp-page {
    background: var(--bg);
    min-height: 100vh;
  }

  .gp-hero {
    position: relative;
    padding: 140px 0 64px;
    background: var(--bg);
    text-align: center;
    overflow: hidden;
  }
  .gp-hero-orb {
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(77,191,168,0.09) 0%, transparent 65%);
    top: -220px; left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    animation: svcPulse 9s ease-in-out infinite;
  }

  .gp-wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  @media (max-width: 768px) { .gp-wrap { padding: 0 20px; } }

  .gp-mono-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }
  .gp-mono-label::before, .gp-mono-label::after {
    content: ''; width: 20px; height: 1.5px; background: ${A};
  }

  .gp-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2rem, 3.8vw, 3.2rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    margin: 0 auto 16px;
    max-width: 720px;
  }
  .gp-hero-sub {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 500px;
    margin: 0 auto;
  }
  .gp-grad {
    background: linear-gradient(135deg, #4A6CB8, ${A});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Main Layout ── */
  .gp-main { padding: 64px 0 100px; background: var(--bg); }
  .gp-grid {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 48px;
    align-items: start;
  }
  @media (max-width: 1024px) {
    .gp-grid { grid-template-columns: 1fr; }
    .gp-sidebar { order: -1; }
  }

  /* ── Form Card ── */
  .gp-form-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
  }

  /* Progress Bar */
  .gp-progress-bar {
    height: 3px;
    background: var(--border);
    position: relative;
  }
  .gp-progress-fill {
    height: 100%;
    background: ${A};
    transition: width 0.5s var(--ease);
    border-radius: 2px;
  }

  .gp-form-inner { padding: 40px 44px; }
  @media (max-width: 640px) { .gp-form-inner { padding: 28px 24px; } }

  /* Step header */
  .gp-step-header { margin-bottom: 32px; }
  .gp-step-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }
  .gp-step-title {
    font-family: var(--font-headline);
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.25;
  }

  /* Form fields */
  .gp-field { margin-bottom: 24px; }
  .gp-label {
    display: block;
    font-family: var(--font-body);
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  .gp-label-opt {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-muted);
    font-weight: 400;
    margin-left: 6px;
  }
  .gp-input, .gp-textarea {
    width: 100%;
    background: var(--bg-2);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-md);
    padding: 12px 16px;
    font-family: var(--font-body);
    font-size: 0.92rem;
    color: var(--text-primary);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .gp-input:focus, .gp-textarea:focus {
    border-color: ${A};
    box-shadow: 0 0 0 3px rgba(77,191,168,0.12);
  }
  .gp-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
  .gp-input::placeholder, .gp-textarea::placeholder { color: var(--text-muted); }

  /* Radio/Checkbox groups */
  .gp-radio-group, .gp-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .gp-radio-group-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  @media (max-width: 480px) { .gp-radio-group-row { grid-template-columns: 1fr; } }

  .gp-radio-item, .gp-checkbox-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border);
    cursor: pointer;
    transition: all 0.2s var(--ease);
    font-family: var(--font-body);
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.4;
    user-select: none;
  }
  .gp-radio-item:hover, .gp-checkbox-item:hover {
    border-color: ${A};
    color: var(--text-primary);
  }
  .gp-radio-item-selected, .gp-checkbox-item-selected {
    border-color: ${A} !important;
    background: rgba(77,191,168,0.07) !important;
    color: var(--text-primary) !important;
  }
  .gp-radio-dot {
    width: 16px; height: 16px; min-width: 16px;
    border-radius: 50%;
    border: 2px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, background 0.2s;
    flex-shrink: 0;
  }
  .gp-radio-dot-selected {
    border-color: ${A};
    background: ${A};
  }
  .gp-radio-inner {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #fff;
  }
  .gp-check-box {
    width: 16px; height: 16px; min-width: 16px;
    border-radius: 4px;
    border: 2px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .gp-check-box-selected {
    border-color: ${A};
    background: ${A};
  }

  /* Form nav buttons */
  .gp-form-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 32px;
    gap: 12px;
  }
  .gp-btn-back {
    background: transparent;
    border: 1.5px solid var(--border);
    color: var(--text-secondary);
    font-family: var(--font-headline);
    font-size: 0.88rem;
    font-weight: 600;
    padding: 12px 22px;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all 0.2s;
  }
  .gp-btn-back:hover { border-color: var(--text-secondary); color: var(--text-primary); }
  .gp-btn-next {
    background: ${A};
    color: #fff;
    border: none;
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    padding: 13px 28px;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all 0.25s var(--ease);
    box-shadow: 0 4px 20px rgba(77,191,168,0.28);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .gp-btn-next:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(77,191,168,0.4); }
  .gp-btn-next:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* Step dots */
  .gp-step-dots {
    display: flex;
    gap: 6px;
  }
  .gp-step-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--border);
    transition: background 0.3s, width 0.3s;
  }
  .gp-step-dot-active {
    width: 18px;
    border-radius: 3px;
    background: ${A};
  }

  /* Success state */
  .gp-success {
    padding: 48px 44px;
    text-align: center;
  }
  .gp-success-icon {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: rgba(77,191,168,0.12);
    border: 2px solid rgba(77,191,168,0.3);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
  }
  .gp-success-h {
    font-family: var(--font-headline);
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 0 0 12px;
  }
  .gp-success-p {
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 380px;
    margin: 0 auto 28px;
  }
  .gp-success-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 300px;
    margin: 0 auto;
  }
  .gp-success-link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-body);
    font-size: 0.88rem;
    color: ${A};
    text-decoration: none;
    transition: gap 0.2s;
    justify-content: center;
  }
  .gp-success-link:hover { gap: 12px; }

  /* ── Sidebar ── */
  .gp-sidebar { position: sticky; top: 100px; }

  .gp-sidebar-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 36px;
    margin-bottom: 20px;
  }

  .gp-sidebar-title {
    font-family: var(--font-headline);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 24px;
    letter-spacing: -0.01em;
  }

  .gp-next-steps { display: flex; flex-direction: column; gap: 18px; }
  .gp-next-step {
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }
  .gp-step-num-sm {
    width: 28px; height: 28px; min-width: 28px;
    border-radius: 50%;
    background: rgba(77,191,168,0.10);
    border: 1.5px solid rgba(77,191,168,0.25);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    color: ${A};
    flex-shrink: 0;
    margin-top: 1px;
  }
  .gp-next-step-title {
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }
  .gp-next-step-desc {
    font-family: var(--font-body);
    font-size: 0.82rem;
    line-height: 1.55;
    color: var(--text-secondary);
    margin: 0;
  }

  /* Trust badges */
  .gp-trust-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .gp-trust-badge {
    padding: 12px;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    text-align: center;
  }
  .gp-trust-badge-icon {
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 6px; color: ${A};
  }
  .gp-trust-badge-text {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-secondary);
    line-height: 1.4;
    text-align: center;
  }

  /* Dynamic recommendation */
  .gp-rec-card {
    background: var(--bg-2);
    border: 1.5px solid rgba(77,191,168,0.2);
    border-radius: var(--radius-lg);
    padding: 20px 24px;
  }
  .gp-rec-label {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }
  .gp-rec-plan {
    font-family: var(--font-headline);
    font-size: 1.1rem;
    font-weight: 800;
    color: ${A};
    margin: 0 0 6px;
    letter-spacing: -0.015em;
  }
  .gp-rec-reason {
    font-family: var(--font-body);
    font-size: 0.82rem;
    line-height: 1.55;
    color: var(--text-secondary);
    margin: 0;
  }

  @media (max-width: 1024px) {
    .gp-sidebar { position: relative; top: 0; }
  }
  @media (max-width: 768px) {
    .gp-hero { padding: 110px 0 48px; }
    .gp-main { padding: 48px 0 80px; }
    .gp-form-inner { padding: 28px 24px; }
    .gp-success { padding: 32px 24px; }
    .gp-sidebar-card { padding: 24px; }
  }
`;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
};

// ── Form types ───────────────────────────────────────────────────────────────
interface FormState {
  // Step 1
  productDesc: string;
  builtBy: string;
  howLong: string;
  customers: string;
  // Step 2
  concerns: string[];
  anythingElse: string;
  // Step 3
  name: string;
  email: string;
  company: string;
  preferredPlan: string;
}

const INITIAL: FormState = {
  productDesc: '',
  builtBy: '',
  howLong: '',
  customers: '',
  concerns: [],
  anythingElse: '',
  name: '',
  email: '',
  company: '',
  preferredPlan: '',
};

function inferPlan(form: FormState): { plan: string; reason: string } {
  const c = form.customers;
  const customers10k = c === '10,000 – 50,000' || c === '50,000+';
  const customers1k = c === '1,000 – 10,000';
  const missionCrit = form.concerns.includes('Nobody monitoring') || form.concerns.includes('Peace of mind');
  const needsFeatures = form.concerns.includes('Need features');
  const hasAgents = form.concerns.includes('AI agents need oversight');

  if (customers10k || (customers1k && (needsFeatures || hasAgents))) {
    return {
      plan: 'Scale — $1,999/mo',
      reason: 'High traffic volume or active feature work with AI agents typically needs dedicated engineering coverage and 24/7 response.',
    };
  }
  if (customers1k || needsFeatures || hasAgents || form.concerns.length >= 3) {
    return {
      plan: 'Growth — $999/mo',
      reason: 'Your profile — real users, active product, and the concerns you flagged — points to Growth. Unlimited bugs, 4 feature hours, dedicated Slack.',
    };
  }
  return {
    plan: 'Essential — $499/mo',
    reason: "You're at a stage where solid monitoring and security is the right foundation. Essential covers the basics and you can upgrade any time.",
  };
}

// ── Radio Option ─────────────────────────────────────────────────────────────
function RadioOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <div
      className={`gp-radio-item ${selected ? 'gp-radio-item-selected' : ''}`}
      onClick={onClick}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? onClick() : null}
    >
      <span className={`gp-radio-dot ${selected ? 'gp-radio-dot-selected' : ''}`}>
        {selected && <span className="gp-radio-inner" />}
      </span>
      {label}
    </div>
  );
}

// ── Checkbox Option ──────────────────────────────────────────────────────────
function CheckOption({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <div
      className={`gp-checkbox-item ${selected ? 'gp-checkbox-item-selected' : ''}`}
      onClick={onClick}
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? onClick() : null}
    >
      <span className={`gp-check-box ${selected ? 'gp-check-box-selected' : ''}`} aria-hidden="true">
        {selected && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        )}
      </span>
      {label}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function GetProtectedPage() {
  const [step, setStep] = useState(0); // 0,1,2 = form steps; 3 = success
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [dynRec, setDynRec] = useState<{ plan: string; reason: string } | null>(null);

  // Update recommendation dynamically as user fills the form
  useEffect(() => {
    if (form.customers) {
      setDynRec(inferPlan(form));
    }
  }, [form.customers, form.concerns]);

  const totalSteps = 3;
  const progress = ((step + 1) / totalSteps) * 100;

  function setField<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function toggleConcern(c: string) {
    setForm((f) => ({
      ...f,
      concerns: f.concerns.includes(c)
        ? f.concerns.filter((x) => x !== c)
        : [...f.concerns, c],
    }));
  }

  function step1Valid() {
    return form.productDesc.trim().length > 10 && form.builtBy && form.howLong && form.customers;
  }
  function step2Valid() {
    return form.concerns.length > 0;
  }
  function step3Valid() {
    return form.name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  }

  async function handleSubmit() {
    if (!step3Valid() || submitting) return;
    setSubmitting(true);
    // Simulate submission delay
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setStep(3);
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="gp-step-header">
              <p className="gp-step-label">STEP 1 OF 3</p>
              <h2 className="gp-step-title">About your software</h2>
            </div>

            <div className="gp-field">
              <label className="gp-label">What does your product do?</label>
              <textarea
                className="gp-textarea"
                placeholder="e.g. A SaaS platform for restaurant inventory management, built with Next.js and hosted on Vercel."
                value={form.productDesc}
                onChange={(e) => setField('productDesc', e.target.value)}
              />
            </div>

            <div className="gp-field">
              <label className="gp-label">Who built it?</label>
              <div className="gp-radio-group-row">
                {['SocioFi Studio', 'Another agency', 'A freelancer', 'In-house team', 'I built it myself', 'AI-assisted build'].map((opt) => (
                  <RadioOption key={opt} label={opt} selected={form.builtBy === opt} onClick={() => setField('builtBy', opt)} />
                ))}
              </div>
            </div>

            <div className="gp-field">
              <label className="gp-label">How long has it been live?</label>
              <div className="gp-radio-group">
                {['Less than 3 months', '3 – 12 months', '1 – 2 years', 'More than 2 years'].map((opt) => (
                  <RadioOption key={opt} label={opt} selected={form.howLong === opt} onClick={() => setField('howLong', opt)} />
                ))}
              </div>
            </div>

            <div className="gp-field">
              <label className="gp-label">How many active customers?</label>
              <div className="gp-radio-group-row">
                {['Under 100', '100 – 1,000', '1,000 – 10,000', '10,000 – 50,000', '50,000+', "Not sure yet"].map((opt) => (
                  <RadioOption key={opt} label={opt} selected={form.customers === opt} onClick={() => setField('customers', opt)} />
                ))}
              </div>
            </div>

            <div className="gp-form-nav">
              <div className="gp-step-dots">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`gp-step-dot ${i === step ? 'gp-step-dot-active' : ''}`} />
                ))}
              </div>
              <button
                className="gp-btn-next"
                disabled={!step1Valid()}
                onClick={() => setStep(1)}
              >
                Next
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="gp-step-header">
              <p className="gp-step-label">STEP 2 OF 3</p>
              <h2 className="gp-step-title">What&apos;s going on?</h2>
            </div>

            <div className="gp-field">
              <label className="gp-label">What&apos;s your biggest concern right now? <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>Select all that apply</span></label>
              <div className="gp-checkbox-group">
                {[
                  'Security vulnerabilities',
                  'Performance issues',
                  'Bugs in production',
                  'Nobody monitoring it',
                  'Need new features',
                  'Developer disappeared',
                  'AI agents need oversight',
                  'Just want peace of mind',
                ].map((opt) => (
                  <CheckOption key={opt} label={opt} selected={form.concerns.includes(opt)} onClick={() => toggleConcern(opt)} />
                ))}
              </div>
            </div>

            <div className="gp-field">
              <label className="gp-label">Anything else we should know? <span className="gp-label-opt">optional</span></label>
              <textarea
                className="gp-textarea"
                placeholder="Recent incidents, specific technical concerns, timeline requirements, things that didn't go well..."
                value={form.anythingElse}
                onChange={(e) => setField('anythingElse', e.target.value)}
              />
            </div>

            <div className="gp-form-nav">
              <button className="gp-btn-back" onClick={() => setStep(0)}>Back</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="gp-step-dots">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`gp-step-dot ${i === step ? 'gp-step-dot-active' : ''}`} />
                  ))}
                </div>
                <button
                  className="gp-btn-next"
                  disabled={!step2Valid()}
                  onClick={() => setStep(2)}
                >
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="gp-step-header">
              <p className="gp-step-label">STEP 3 OF 3</p>
              <h2 className="gp-step-title">About you</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <div className="gp-field">
                <label className="gp-label">Your name</label>
                <input
                  type="text"
                  className="gp-input"
                  placeholder="Sarah Johnson"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div className="gp-field">
                <label className="gp-label">Work email</label>
                <input
                  type="email"
                  className="gp-input"
                  placeholder="sarah@company.com"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="gp-field">
              <label className="gp-label">Company <span className="gp-label-opt">optional</span></label>
              <input
                type="text"
                className="gp-input"
                placeholder="Your company or product name"
                value={form.company}
                onChange={(e) => setField('company', e.target.value)}
                autoComplete="organization"
              />
            </div>

            <div className="gp-field">
              <label className="gp-label">Which plan are you leaning toward?</label>
              <div className="gp-radio-group">
                {['Essential — $499/month', 'Growth — $999/month', 'Scale — $1,999/month', "Not sure — help me decide"].map((opt) => (
                  <RadioOption key={opt} label={opt} selected={form.preferredPlan === opt} onClick={() => setField('preferredPlan', opt)} />
                ))}
              </div>
            </div>

            <div className="gp-form-nav">
              <button className="gp-btn-back" onClick={() => setStep(1)}>Back</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="gp-step-dots">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`gp-step-dot ${i === step ? 'gp-step-dot-active' : ''}`} />
                  ))}
                </div>
                <button
                  className="gp-btn-next"
                  disabled={!step3Valid() || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? 'Sending...' : 'Request Protection Plan'}
                  {!submitting && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="gp-success">
              <div className="gp-success-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="gp-success-h">Got it. We&apos;re on it.</h2>
              <p className="gp-success-p">
                We&apos;re reviewing your software details now. A Services engineer will contact you
                within 4 business hours to discuss the right plan and next steps.
              </p>
              <div className="gp-success-links">
                <Link href="/services/plans" className="gp-success-link">
                  Review plan details
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/services/how-it-works" className="gp-success-link">
                  Review the onboarding process
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/services" className="gp-success-link">
                  Explore all Services pages
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="gp-page">

        {/* ── Hero ── */}
        <section className="gp-hero">
          <div className="gp-hero-orb" aria-hidden="true" />
          <div className="gp-wrap" style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="gp-mono-label">GET PROTECTED</div>
            </motion.div>
            <motion.h1
              className="gp-h1"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Tell Us About Your Software.
              <br />
              <span className="gp-grad">We&apos;ll Recommend a Plan.</span>
            </motion.h1>
            <motion.p
              className="gp-hero-sub"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
            >
              3 quick steps. No commitment. A real Services engineer reviews every submission
              and responds within 4 business hours.
            </motion.p>
          </div>
        </section>

        {/* ── Main Form + Sidebar ── */}
        <section className="gp-main">
          <div className="gp-wrap">
            <div className="gp-grid">

              {/* Form */}
              <motion.div
                variants={fadeUp} initial="hidden" animate="visible"
              >
                <div className="gp-form-card">
                  {step < 3 && (
                    <div className="gp-progress-bar">
                      <div className="gp-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                  <div className={step === 3 ? '' : 'gp-form-inner'}>
                    <AnimatePresence mode="wait">
                      {renderStep()}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                className="gp-sidebar"
                variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
              >
                {/* What Happens Next */}
                <div className="gp-sidebar-card">
                  <h3 className="gp-sidebar-title">What happens next</h3>
                  <div className="gp-next-steps">
                    {[
                      {
                        n: '1',
                        title: 'We review your request',
                        desc: 'Within 4 business hours, a Services engineer reads your submission and prepares a response.',
                      },
                      {
                        n: '2',
                        title: 'Initial conversation',
                        desc: 'We contact you by email (or Slack if you prefer) to discuss your software and confirm the right plan.',
                      },
                      {
                        n: '3',
                        title: 'Codebase audit (if needed)',
                        desc: 'If your software was built outside of SocioFi, we start with a $399 audit — credited to your first month.',
                      },
                      {
                        n: '4',
                        title: 'Monitoring goes live',
                        desc: 'Within 5 business days of starting, your software is under active monitoring with alerts configured.',
                      },
                      {
                        n: '5',
                        title: 'Protection starts',
                        desc: 'Your plan is active, your Slack channel is open, and we\'re watching around the clock.',
                      },
                    ].map((s) => (
                      <div key={s.n} className="gp-next-step">
                        <div className="gp-step-num-sm">{s.n}</div>
                        <div>
                          <p className="gp-next-step-title">{s.title}</p>
                          <p className="gp-next-step-desc">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="gp-sidebar-card">
                  <h3 className="gp-sidebar-title" style={{ marginBottom: 16 }}>Why people trust us</h3>
                  <div className="gp-trust-grid">
                    {[
                      {
                        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                        text: 'No commitment required',
                      },
                      {
                        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                        text: 'Month-to-month billing',
                      },
                      {
                        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                        text: 'Same team, always',
                      },
                      {
                        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
                        text: 'First month refundable',
                      },
                    ].map((b) => (
                      <div key={b.text} className="gp-trust-badge">
                        <div className="gp-trust-badge-icon">{b.icon}</div>
                        <p className="gp-trust-badge-text">{b.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic recommendation */}
                {dynRec && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="gp-sidebar-card" style={{ background: 'var(--bg-card)', border: '1.5px solid rgba(77,191,168,0.2)' }}>
                      <h3 className="gp-sidebar-title" style={{ marginBottom: 14 }}>Based on what you&apos;ve told us</h3>
                      <div className="gp-rec-card">
                        <p className="gp-rec-label">We&apos;d likely recommend</p>
                        <p className="gp-rec-plan">{dynRec.plan}</p>
                        <p className="gp-rec-reason">{dynRec.reason}</p>
                      </div>
                      <p style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                        marginTop: 12,
                        lineHeight: 1.5,
                      }}>
                        This updates as you fill out the form. Final recommendation comes from a real engineer.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Testimonial */}
                <div className="gp-sidebar-card">
                  <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                    <svg width="24" height="20" viewBox="0 0 30 24" fill={A} fillOpacity="0.25" aria-hidden="true"><path d="M0 24V14.4C0 6.48 4.5 1.44 13.5 0l2 3.6C10.5 5.04 8.25 7.68 7.5 11.4H13.5V24H0zm16.5 0V14.4C16.5 6.48 21 1.44 30 0l2 3.6C27 5.04 24.75 7.68 24 11.4H30V24H16.5z"/></svg>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-secondary)', fontStyle: 'italic', margin: '0 0 14px' }}>
                    &ldquo;I submitted the form on a Tuesday. By Thursday morning my app was under monitoring
                    and they&apos;d already flagged a dependency with a known CVE — unpacked and unknown to me.
                    Absolutely worth every dollar.&rdquo;
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: A }}>— David R., Founder, PivotLab</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
