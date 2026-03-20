'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// ── Constants ────────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.corp-hero {
  min-height: 56vh;
  display: flex;
  align-items: center;
  padding: 130px 0 70px;
  position: relative;
  overflow: hidden;
}
.corp-hero::before {
  content: '';
  position: absolute;
  top: -180px; right: -180px;
  width: 640px; height: 640px;
  background: radial-gradient(circle, rgba(232,184,77,0.07) 0%, transparent 68%);
  pointer-events: none;
}
.corp-hero::after {
  content: '';
  position: absolute;
  bottom: -120px; left: -120px;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(74,108,184,0.05) 0%, transparent 68%);
  pointer-events: none;
}
.corp-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
.corp-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.corp-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.corp-hero-title {
  font-family: ${F.h};
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.07;
  letter-spacing: -0.032em;
  color: var(--text-primary);
  margin-bottom: 20px;
  max-width: 760px;
}
.corp-hero-sub {
  font-family: ${F.b};
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.72;
  max-width: 560px;
  margin-bottom: 36px;
}
.corp-hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: ${A};
  color: #1a1a1a;
  font-family: ${F.h};
  font-size: 0.92rem;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.22s ease;
  cursor: pointer;
  border: none;
}
.corp-hero-cta:hover { opacity: 0.88; transform: translateY(-2px); }

/* ── Pain Points ── */
.corp-pain-section {
  padding: 80px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.corp-section-label {
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
.corp-section-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.corp-section-title {
  font-family: ${F.h};
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 40px;
}
.corp-pain-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 1024px) { .corp-pain-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .corp-pain-grid { grid-template-columns: 1fr; } }
.corp-pain-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  transition: all 0.35s ease;
  position: relative;
}
.corp-pain-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, ${A}, rgba(232,184,77,0.3));
  border-radius: 16px 16px 0 0;
  opacity: 0;
  transition: opacity 0.35s ease;
}
.corp-pain-card:hover { border-color: rgba(232,184,77,0.3); transform: translateY(-4px); }
.corp-pain-card:hover::before { opacity: 1; }
.corp-pain-icon {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: rgba(232,184,77,0.12);
  border: 1px solid rgba(232,184,77,0.25);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 18px;
  color: ${A};
}
.corp-pain-title {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
  line-height: 1.3;
}
.corp-pain-desc {
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* ── Packages ── */
.corp-packages-section {
  padding: 80px 0;
  background: var(--bg);
}
.corp-packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 1024px) { .corp-packages-grid { grid-template-columns: 1fr; max-width: 500px; } }
.corp-pkg-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 32px 28px;
  position: relative;
  transition: all 0.35s ease;
}
.corp-pkg-card:hover { border-color: rgba(232,184,77,0.3); transform: translateY(-4px); box-shadow: 0 16px 48px rgba(232,184,77,0.07); }
.corp-pkg-card.popular {
  border-color: rgba(232,184,77,0.45);
  background: linear-gradient(160deg, var(--bg-card), rgba(232,184,77,0.04));
}
.corp-popular-badge {
  position: absolute;
  top: -12px; left: 50%; transform: translateX(-50%);
  background: ${A};
  color: #1a1a1a;
  font-family: ${F.m};
  font-size: 0.58rem;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 100px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}
.corp-pkg-name {
  font-family: ${F.m};
  font-size: 0.68rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 6px;
}
.corp-pkg-subtitle {
  font-family: ${F.b};
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}
.corp-pkg-price {
  font-family: ${F.h};
  font-size: 2rem;
  font-weight: 800;
  color: ${A};
  line-height: 1;
  margin-bottom: 4px;
}
.corp-pkg-price-note {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}
.corp-pkg-divider {
  height: 1px;
  background: var(--border);
  margin-bottom: 20px;
}
.corp-pkg-features {
  list-style: none;
  padding: 0; margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.corp-pkg-feature {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-family: ${F.b};
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.45;
}
.corp-pkg-feature svg { flex-shrink: 0; margin-top: 2px; }
.corp-pkg-cta {
  display: block;
  width: 100%;
  padding: 11px 20px;
  background: rgba(232,184,77,0.1);
  border: 1.5px solid rgba(232,184,77,0.35);
  border-radius: 10px;
  color: ${A};
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  transition: all 0.22s ease;
  text-decoration: none;
}
.corp-pkg-card.popular .corp-pkg-cta {
  background: ${A};
  border-color: ${A};
  color: #1a1a1a;
}
.corp-pkg-cta:hover { background: ${A}; border-color: ${A}; color: #1a1a1a; }

/* ── Customize ── */
.corp-customize-section {
  padding: 80px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.corp-customize-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 1024px) { .corp-customize-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .corp-customize-grid { grid-template-columns: 1fr; } }
.corp-custom-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  transition: all 0.3s ease;
}
.corp-custom-item:hover { border-color: rgba(232,184,77,0.25); transform: translateY(-2px); }
.corp-custom-num {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: ${A};
  font-weight: 700;
  letter-spacing: 0.06em;
  flex-shrink: 0;
  padding-top: 2px;
}
.corp-custom-title {
  font-family: ${F.h};
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 5px;
}
.corp-custom-desc {
  font-family: ${F.b};
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

/* ── Case Studies ── */
.corp-cases-section {
  padding: 80px 0;
  background: var(--bg);
}
.corp-cases-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
@media (max-width: 768px) { .corp-cases-grid { grid-template-columns: 1fr; } }
.corp-case-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  position: relative;
  overflow: hidden;
}
.corp-case-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, ${A}, rgba(232,184,77,0.3));
}
.corp-case-tag {
  font-family: ${F.m};
  font-size: 0.6rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}
.corp-case-metric {
  font-family: ${F.h};
  font-size: 2rem;
  font-weight: 800;
  color: ${A};
  line-height: 1;
  margin-bottom: 4px;
}
.corp-case-metric-label {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}
.corp-case-body {
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* ── CEO Quote ── */
.corp-quote-section {
  padding: 72px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.corp-quote-wrap {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 32px;
  text-align: center;
}
.corp-quote-mark {
  color: ${A};
  opacity: 0.4;
  font-size: 4rem;
  font-family: Georgia, serif;
  line-height: 0.8;
  margin-bottom: 16px;
}
.corp-quote-text {
  font-family: ${F.h};
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.55;
  letter-spacing: -0.015em;
  margin-bottom: 24px;
  font-style: italic;
}
.corp-quote-author {
  font-family: ${F.m};
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.corp-quote-author span {
  color: ${A};
}

/* ── Form ── */
.corp-form-section {
  padding: 80px 0 100px;
  background: var(--bg);
}
.corp-form-wrap {
  max-width: 680px;
}
.corp-form-title {
  font-family: ${F.h};
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.corp-form-sub {
  font-family: ${F.b};
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
}
.corp-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 640px) { .corp-form-grid { grid-template-columns: 1fr; } }
.corp-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.corp-form-group.full { grid-column: 1 / -1; }
.corp-form-label {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.corp-form-input,
.corp-form-select,
.corp-form-textarea {
  padding: 12px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text-primary);
  font-family: ${F.b};
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}
.corp-form-input:focus,
.corp-form-select:focus,
.corp-form-textarea:focus {
  border-color: rgba(232,184,77,0.5);
  box-shadow: 0 0 0 3px rgba(232,184,77,0.08);
}
.corp-form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237C8DB0' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
  cursor: pointer;
}
.corp-form-textarea { resize: vertical; min-height: 100px; }
.corp-form-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(135deg, ${A}, #d4a33a);
  color: #1a1a1a;
  font-family: ${F.h};
  font-size: 0.92rem;
  font-weight: 700;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.22s ease;
  margin-top: 8px;
  box-shadow: 0 4px 20px rgba(232,184,77,0.3);
}
.corp-form-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(232,184,77,0.4); }
.corp-form-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.corp-success {
  background: var(--bg-card);
  border: 1px solid rgba(232,184,77,0.35);
  border-radius: 16px;
  padding: 40px 32px;
  text-align: center;
}
.corp-success-icon {
  width: 52px; height: 52px;
  border-radius: 50%;
  background: rgba(232,184,77,0.12);
  border: 1.5px solid rgba(232,184,77,0.4);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
  color: ${A};
}
.corp-success-title {
  font-family: ${F.h};
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.corp-success-sub {
  font-family: ${F.b};
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
`;

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function Check({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function AlertCircle() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx={12} cy={12} r={10} />
      <line x1={12} y1={8} x2={12} y2={12} />
      <line x1={12} y1={16} x2="12.01" y2={16} />
    </svg>
  );
}
function Users() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx={9} cy={7} r={4} />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
function Brain() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 2A2.5 2.5 0 017 4.5v1A2.5 2.5 0 004.5 8h-1a2.5 2.5 0 000 5h1A2.5 2.5 0 007 15.5v1a2.5 2.5 0 002.5 2.5h5a2.5 2.5 0 002.5-2.5v-1a2.5 2.5 0 002.5-2.5h1a2.5 2.5 0 000-5h-1A2.5 2.5 0 0017 5.5v-1A2.5 2.5 0 0014.5 2h-5z" />
    </svg>
  );
}
function Layers() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
function CheckCircle() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke={A} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const PAIN_POINTS = [
  {
    icon: <Users />,
    title: "Your team doesn't understand what developers do",
    desc: "Every miscommunication between business and engineering costs days. Technical literacy eliminates the translation problem.",
  },
  {
    icon: <Brain />,
    title: "You're deploying AI agents but nobody knows how to manage them",
    desc: "AI agents need oversight, feedback, and human judgment. Without training, your team is flying blind.",
  },
  {
    icon: <AlertCircle />,
    title: "You're evaluating build/buy decisions without technical context",
    desc: "Uninformed decisions at this stage cost hundreds of thousands. The right training pays for itself in the first project.",
  },
];

const PACKAGES = [
  {
    name: 'Team',
    subtitle: '5–15 people',
    price: '$149',
    priceNote: 'per person',
    popular: false,
    features: [
      'Any 3 courses + private Q&A session',
      'Virtual delivery',
      '30 days post-training support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Department',
    subtitle: '15–50 people',
    price: '$129',
    priceNote: 'per person',
    popular: true,
    features: [
      'Full curriculum (all 10 courses)',
      '2 live sessions included',
      'Optional SCARL certification for participants',
      'Custom Q&A sessions',
      '60 days post-training support',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Custom Program',
    subtitle: 'Any size',
    price: 'Custom',
    priceNote: 'quote',
    popular: false,
    features: [
      'Tailored curriculum for your organization',
      'Custom scheduling around your team',
      'In-person option (Dhaka) available',
      'Executive briefings available',
      'Ongoing monthly follow-up sessions',
    ],
    cta: 'Request Quote',
  },
];

const CUSTOMIZE_ITEMS = [
  { title: 'Course selection', desc: 'Choose from our catalog or request custom modules built for your industry.' },
  { title: 'Industry examples', desc: 'We use your actual business scenarios and workflows in every session.' },
  { title: 'Scheduling', desc: 'We work around your team\'s calendar — no disrupting operations.' },
  { title: 'Format', desc: 'Virtual, in-person Dhaka, or hybrid — whatever works for your team.' },
  { title: 'Assessment', desc: 'Optional SCARL certification available for all participants.' },
  { title: 'Follow-up', desc: 'Monthly check-in sessions available to keep skills sharp over time.' },
];

const rveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } };

// ── Form ──────────────────────────────────────────────────────────────────────
function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1000);
  };

  if (submitted) {
    return (
      <motion.div className="corp-success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="corp-success-icon">
          <Check size={22} />
        </div>
        <div className="corp-success-title">Proposal request received.</div>
        <p className="corp-success-sub">We'll review your training needs and respond within 24 hours with a customized proposal and availability.</p>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="corp-form-grid">
        <div className="corp-form-group">
          <label className="corp-form-label">Company name</label>
          <input type="text" className="corp-form-input" placeholder="Acme Corp" required />
        </div>
        <div className="corp-form-group">
          <label className="corp-form-label">Team size</label>
          <input type="number" className="corp-form-input" placeholder="25" min={1} required />
        </div>
        <div className="corp-form-group">
          <label className="corp-form-label">Primary goal</label>
          <select className="corp-form-select" required defaultValue="">
            <option value="" disabled>Select a goal</option>
            <option>AI Development literacy</option>
            <option>AI Agents training</option>
            <option>Product Management</option>
            <option>Mixed curriculum</option>
          </select>
        </div>
        <div className="corp-form-group">
          <label className="corp-form-label">Preferred format</label>
          <select className="corp-form-select" required defaultValue="">
            <option value="" disabled>Select format</option>
            <option>Virtual</option>
            <option>In-person Dhaka</option>
            <option>Hybrid</option>
          </select>
        </div>
        <div className="corp-form-group">
          <label className="corp-form-label">Timeline</label>
          <select className="corp-form-select" required defaultValue="">
            <option value="" disabled>When do you need this?</option>
            <option>Within 1 month</option>
            <option>1–3 months</option>
            <option>Flexible</option>
          </select>
        </div>
        <div className="corp-form-group">
          <label className="corp-form-label">Contact email</label>
          <input type="email" className="corp-form-input" placeholder="you@company.com" required />
        </div>
        <div className="corp-form-group full">
          <label className="corp-form-label">Anything else we should know? (optional)</label>
          <textarea className="corp-form-textarea" placeholder="Specific topics, constraints, or questions..." />
        </div>
      </div>
      <button type="submit" className="corp-form-submit" disabled={loading}>
        {loading ? 'Sending...' : <><span>Request Training Proposal</span> <ArrowRight size={14} /></>}
      </button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CorporateTrainingPage() {
  const formSectionRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="corp-hero">
        <div className="corp-inner">
          <motion.div {...rveal}>
            <div className="corp-label">Corporate Training</div>
            <h1 className="corp-hero-title">
              Train Your Team to Work with AI.<br />
              Without Pulling Them Off the Job.
            </h1>
            <p className="corp-hero-sub">
              Custom training programs for organizations adopting AI development tools, AI agents, or working with external development teams. Virtual or in-person.
            </p>
            <button className="corp-hero-cta" onClick={scrollToForm}>
              Request Training Proposal <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="corp-pain-section">
        <div className="corp-inner">
          <motion.div {...rveal}>
            <div className="corp-section-label">Why corporate training</div>
            <h2 className="corp-section-title">The problems we solve.</h2>
          </motion.div>
          <div className="corp-pain-grid">
            {PAIN_POINTS.map((p, i) => (
              <motion.div key={i} className="corp-pain-card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="corp-pain-icon">{p.icon}</div>
                <div className="corp-pain-title">{p.title}</div>
                <p className="corp-pain-desc">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Package Tiers ── */}
      <section className="corp-packages-section">
        <div className="corp-inner">
          <motion.div {...rveal}>
            <div className="corp-section-label">Training packages</div>
            <h2 className="corp-section-title">Pick the package that fits.</h2>
          </motion.div>
          <div className="corp-packages-grid">
            {PACKAGES.map((pkg, i) => (
              <motion.div key={pkg.name} className={`corp-pkg-card${pkg.popular ? ' popular' : ''}`}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                {pkg.popular && <span className="corp-popular-badge">Most Popular</span>}
                <div className="corp-pkg-name">{pkg.name}</div>
                <div className="corp-pkg-subtitle">{pkg.subtitle}</div>
                <div className="corp-pkg-price">{pkg.price}</div>
                <div className="corp-pkg-price-note">{pkg.priceNote}</div>
                <div className="corp-pkg-divider" />
                <ul className="corp-pkg-features">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="corp-pkg-feature">
                      <CheckCircle />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className="corp-pkg-cta" onClick={scrollToForm}>{pkg.cta}</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Customize ── */}
      <section className="corp-customize-section">
        <div className="corp-inner">
          <motion.div {...rveal}>
            <div className="corp-section-label">Tailored to you</div>
            <h2 className="corp-section-title">What we customize.</h2>
          </motion.div>
          <div className="corp-customize-grid">
            {CUSTOMIZE_ITEMS.map((item, i) => (
              <motion.div key={i} className="corp-custom-item"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }}>
                <div className="corp-custom-num">0{i + 1}</div>
                <div>
                  <div className="corp-custom-title">{item.title}</div>
                  <div className="corp-custom-desc">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case Studies ── */}
      <section className="corp-cases-section">
        <div className="corp-inner">
          <motion.div {...rveal}>
            <div className="corp-section-label">Real results</div>
            <h2 className="corp-section-title">What happens after training.</h2>
          </motion.div>
          <div className="corp-cases-grid">
            <motion.div className="corp-case-card"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="corp-case-tag">Logistics company — 40 people</div>
              <div className="corp-case-metric">3 months</div>
              <div className="corp-case-metric-label">to measurable improvement in requirements quality</div>
              <p className="corp-case-body">"40-person operations team trained. Within 3 months, the development team reported the clearest requirements they'd ever received from the business side. The training paid for itself in the first project."</p>
            </motion.div>
            <motion.div className="corp-case-card"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div className="corp-case-tag">Fintech company — 12 people</div>
              <div className="corp-case-metric">4 days</div>
              <div className="corp-case-metric-label">vendor evaluation time (down from 6 weeks)</div>
              <p className="corp-case-body">"12-person product team trained on AI agents. Reduced vendor evaluation time from 6 weeks to 4 days. The team had the vocabulary to ask the right questions and a framework to compare answers."</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CEO Quote ── */}
      <section className="corp-quote-section">
        <motion.div className="corp-quote-wrap" {...rveal}>
          <div className="corp-quote-mark">"</div>
          <p className="corp-quote-text">
            We trained a 40-person operations team for a logistics company. Three months later, their dev team told us they'd never had such clear requirements from the business side. The training paid for itself in the first project.
          </p>
          <div className="corp-quote-author">
            <span>Arifur Rahman</span> — CEO, SocioFi Technology
          </div>
        </motion.div>
      </section>

      {/* ── Inquiry Form ── */}
      <section className="corp-form-section" ref={formSectionRef}>
        <div className="corp-inner">
          <motion.div {...rveal}>
            <div className="corp-section-label">Get in touch</div>
            <h2 className="corp-form-title">Tell us about your training needs.</h2>
            <p className="corp-form-sub">We'll review your situation and respond with a customized proposal within 24 hours.</p>
          </motion.div>
          <motion.div className="corp-form-wrap"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <InquiryForm />
          </motion.div>
        </div>
      </section>
    </>
  );
}
