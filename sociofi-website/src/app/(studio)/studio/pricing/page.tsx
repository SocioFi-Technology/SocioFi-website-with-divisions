'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const A = '#72C4B2';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const STYLES = `
  .pr-page { background: var(--bg); min-height: 100vh; }

  .sec-label {
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .sec-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
    flex-shrink: 0;
  }

  /* Hero */
  .pr-hero {
    padding: clamp(100px,12vw,160px) 32px 60px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .pr-hero-title {
    font-family: ${F.h};
    font-size: clamp(2.2rem,4.5vw,3.2rem);
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    line-height: 1.08;
    margin: 0 0 20px;
    max-width: 760px;
  }
  .pr-hero-sub {
    font-family: ${F.b};
    font-size: 1.05rem;
    color: var(--text-secondary);
    line-height: 1.75;
    margin: 0 0 32px;
    max-width: 560px;
  }
  .pr-ceo-quote {
    background: ${A}08;
    border: 1px solid ${A}22;
    border-left: 3px solid ${A};
    border-radius: 0 16px 16px 0;
    padding: 20px 24px;
    max-width: 760px;
  }
  .pr-ceo-quote-text {
    font-family: ${F.b};
    font-size: 0.9rem;
    color: var(--text-primary);
    font-style: italic;
    line-height: 1.65;
    margin: 0 0 10px;
  }
  .pr-ceo-quote-attr {
    font-family: ${F.m};
    font-size: 0.68rem;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* Tier cards */
  .pr-tiers {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 32px;
  }
  .pr-tiers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    align-items: start;
  }
  .pr-tier-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    transition: border-color 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
  }
  .pr-tier-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3A589E, ${A});
    border-radius: 20px 20px 0 0;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .pr-tier-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-6px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.22);
  }
  .pr-tier-card:hover::before { opacity: 1; }
  .pr-tier-card.featured {
    border-color: ${A}44;
    background: ${A}06;
  }
  .pr-tier-card.featured::before { opacity: 1; }

  .pr-tier-top { margin-bottom: 24px; }
  .pr-tier-badges {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    min-height: 24px;
  }
  .pr-tier-badge {
    font-family: ${F.m};
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 100px;
    color: ${A};
    border: 1px solid ${A}44;
    background: ${A}11;
  }
  .pr-tier-name {
    font-family: ${F.h};
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 8px;
  }
  .pr-tier-desc {
    font-family: ${F.b};
    font-size: 0.84rem;
    color: var(--text-muted);
    line-height: 1.55;
    margin: 0;
  }

  .pr-tier-price-wrap { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
  .pr-tier-price {
    font-family: ${F.h};
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    display: block;
    margin-bottom: 4px;
  }
  .pr-tier-timeline {
    font-family: ${F.m};
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.06em;
  }
  .pr-tier-best-for {
    font-family: ${F.b};
    font-size: 0.78rem;
    color: var(--text-secondary);
    margin-bottom: 16px;
  }
  .pr-tier-best-for strong {
    color: var(--text-primary);
    font-weight: 600;
  }

  .pr-tier-features { margin-bottom: 28px; flex: 1; }
  .pr-tier-feature {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }
  .pr-tier-feature:last-child { border-bottom: none; }
  .pr-tier-feature-text {
    font-family: ${F.b};
    font-size: 0.84rem;
    color: var(--text-secondary);
    line-height: 1.45;
  }

  .pr-tier-cta {
    font-family: ${F.h};
    font-size: 0.88rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    padding: 13px 20px;
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;
  }
  .pr-tier-cta.primary {
    background: linear-gradient(135deg, #3A589E, ${A});
    color: white;
    border: none;
    box-shadow: 0 4px 24px rgba(58,88,158,0.35);
  }
  .pr-tier-cta.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(58,88,158,0.5);
  }
  .pr-tier-cta.ghost {
    background: transparent;
    color: var(--text-primary);
    border: 1.5px solid var(--border);
  }
  .pr-tier-cta.ghost:hover {
    border-color: ${A};
    color: ${A};
  }

  /* Configurator */
  .pr-config {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 80px 32px;
  }
  .pr-config-inner { max-width: 1000px; margin: 0 auto; }
  .pr-config-title {
    font-family: ${F.h};
    font-size: clamp(1.5rem,2.5vw,2rem);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 8px;
  }
  .pr-config-sub {
    font-family: ${F.b};
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin: 0 0 40px;
    line-height: 1.65;
  }
  .pr-config-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    margin-bottom: 32px;
  }
  .pr-config-field { }
  .pr-config-field-label {
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 12px;
    display: block;
  }
  .pr-config-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .pr-config-pill {
    font-family: ${F.b};
    font-size: 0.84rem;
    padding: 8px 16px;
    border-radius: 100px;
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .pr-config-pill:hover {
    border-color: ${A}66;
    color: var(--text-primary);
  }
  .pr-config-pill.selected {
    border-color: ${A};
    color: ${A};
    background: ${A}12;
  }

  .pr-config-result {
    background: var(--bg-card);
    border: 1.5px solid ${A}33;
    border-radius: 20px;
    padding: 32px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    align-items: center;
  }
  .pr-config-result-left { }
  .pr-config-result-label {
    font-family: ${F.m};
    font-size: 0.68rem;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 6px;
  }
  .pr-config-result-range {
    font-family: ${F.h};
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    display: block;
    margin-bottom: 6px;
  }
  .pr-config-result-details {
    font-family: ${F.b};
    font-size: 0.84rem;
    color: var(--text-secondary);
  }
  .pr-config-result-tier {
    font-family: ${F.m};
    font-size: 0.72rem;
    color: ${A};
    background: ${A}15;
    border: 1px solid ${A}33;
    border-radius: 100px;
    padding: 4px 12px;
    display: inline-block;
    margin-top: 6px;
  }

  /* Retainers */
  .pr-retainers {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 32px;
  }
  .pr-retainer-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 40px;
  }
  .pr-retainer-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    transition: border-color 0.3s, transform 0.3s;
  }
  .pr-retainer-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-4px);
  }
  .pr-retainer-name {
    font-family: ${F.h};
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 4px;
  }
  .pr-retainer-hours {
    font-family: ${F.m};
    font-size: 0.72rem;
    color: var(--text-muted);
    margin-bottom: 20px;
    letter-spacing: 0.06em;
  }
  .pr-retainer-price {
    font-family: ${F.h};
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    margin-bottom: 4px;
  }
  .pr-retainer-period {
    font-family: ${F.b};
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-bottom: 20px;
  }

  /* Always Included */
  .pr-included {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 80px 32px;
  }
  .pr-included-inner { max-width: 1200px; margin: 0 auto; }
  .pr-included-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 40px;
  }
  .pr-included-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
  }
  .pr-included-item-text {
    font-family: ${F.b};
    font-size: 0.84rem;
    color: var(--text-secondary);
    line-height: 1.4;
  }

  /* Comparison table */
  .pr-compare {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 32px;
  }
  .pr-compare-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 40px;
  }
  .pr-compare-table th,
  .pr-compare-table td {
    padding: 16px 20px;
    text-align: left;
    border-bottom: 1px solid var(--border);
    font-family: ${F.b};
    font-size: 0.88rem;
  }
  .pr-compare-table th {
    font-family: ${F.m};
    font-size: 0.68rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: var(--bg-2);
  }
  .pr-compare-table th.highlight,
  .pr-compare-table td.highlight {
    background: ${A}08;
    color: ${A};
    border-left: 2px solid ${A}33;
    border-right: 2px solid ${A}33;
  }
  .pr-compare-table td.highlight { color: ${A}; font-weight: 600; }
  .pr-compare-table td:first-child {
    color: var(--text-muted);
    font-size: 0.8rem;
  }
  .pr-compare-table tr:last-child td { border-bottom: none; }
  .pr-compare-table td:not(:first-child):not(.highlight) {
    color: var(--text-secondary);
  }

  /* FAQ */
  .pr-faq {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    padding: 80px 32px;
  }
  .pr-faq-inner { max-width: 800px; margin: 0 auto; }
  .pr-faq-item {
    border-bottom: 1px solid var(--border);
  }
  .pr-faq-item:last-child { border-bottom: none; }
  .pr-faq-q {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    cursor: pointer;
    gap: 16px;
    background: transparent;
    border: none;
    text-align: left;
    width: 100%;
  }
  .pr-faq-q-text {
    font-family: ${F.h};
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .pr-faq-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    transition: transform 0.3s;
  }
  .pr-faq-icon.open { transform: rotate(45deg); }
  .pr-faq-a {
    overflow: hidden;
  }
  .pr-faq-a-inner {
    font-family: ${F.b};
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.7;
    padding-bottom: 20px;
  }
  .pr-faq-a-inner a { color: ${A}; text-decoration: none; }
  .pr-faq-a-inner a:hover { text-decoration: underline; }

  /* CTA */
  .pr-cta {
    padding: 100px 32px;
    text-align: center;
  }
  .pr-cta-inner { max-width: 600px; margin: 0 auto; }
  .pr-cta-title {
    font-family: ${F.h};
    font-size: clamp(1.8rem,3vw,2.4rem);
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 16px;
  }
  .pr-cta-sub {
    font-family: ${F.b};
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0 0 40px;
    line-height: 1.7;
  }
  .pr-cta-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }
  .btn-primary {
    font-family: ${F.h};
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    padding: 14px 28px;
    background: linear-gradient(135deg, #3A589E, ${A});
    color: white;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 24px rgba(58,88,158,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-primary:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(58,88,158,0.5);
  }
  .btn-ghost {
    font-family: ${F.h};
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    padding: 13px 28px;
    background: transparent;
    color: var(--text-primary);
    border: 1.5px solid var(--border);
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-ghost:hover {
    border-color: ${A};
    color: ${A};
  }

  @media (max-width: 900px) {
    .pr-tiers-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
    .pr-config-grid { grid-template-columns: 1fr; }
    .pr-config-result { grid-template-columns: 1fr; }
    .pr-retainer-grid { grid-template-columns: 1fr; max-width: 400px; margin: 40px auto 0; }
    .pr-included-grid { grid-template-columns: repeat(2, 1fr); }
    .pr-compare { overflow-x: auto; }
  }
  @media (max-width: 768px) {
    .pr-hero { padding: 100px 20px 60px; }
    .pr-tiers { padding: 60px 20px; }
    .pr-config { padding: 60px 20px; }
    .pr-retainers { padding: 60px 20px; }
    .pr-included { padding: 60px 20px; }
    .pr-compare { padding: 60px 20px; }
    .pr-faq { padding: 60px 20px; }
    .pr-included-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .pr-included-grid { grid-template-columns: 1fr; }
  }
`;

// ── Configurator logic ──────────────────────────────────────────────────────

type ProjectType = 'MVP / Prototype' | 'Web Application' | 'SaaS Platform' | 'Internal Tool / Dashboard' | 'Automation / Integration' | 'Rescue / Fix Existing Code';
type Complexity = 'Simple (1–2 features)' | 'Moderate (3–5 features)' | 'Complex (6+ features)' | 'Enterprise (multi-module)';
type TimelinePref = 'ASAP (+20% rush premium)' | 'Standard (recommended)' | 'Flexible (−5% discount)';

interface ConfigState {
  projectType: ProjectType | null;
  complexity: Complexity | null;
  timeline: TimelinePref | null;
  maintenance: boolean | null;
}

type PriceResult = {
  low: number;
  high: number;
  weeks: string;
  tier: 'Starter' | 'Growth' | 'Scale';
};

const BASE_PRICES: Record<string, [number, number]> = {
  'MVP / Prototype': [3000, 8000],
  'Web Application': [5000, 15000],
  'SaaS Platform': [10000, 25000],
  'Internal Tool / Dashboard': [5000, 12000],
  'Automation / Integration': [3000, 10000],
  'Rescue / Fix Existing Code': [2000, 6000],
};

const COMPLEXITY_MULTIPLIERS: Record<string, number> = {
  'Simple (1–2 features)': 0.7,
  'Moderate (3–5 features)': 1.0,
  'Complex (6+ features)': 1.5,
  'Enterprise (multi-module)': 2.2,
};

const BASE_WEEKS: Record<string, string> = {
  'MVP / Prototype': '2–3',
  'Web Application': '3–5',
  'SaaS Platform': '5–8',
  'Internal Tool / Dashboard': '3–5',
  'Automation / Integration': '2–4',
  'Rescue / Fix Existing Code': '1–3',
};

function calculatePrice(config: ConfigState): PriceResult | null {
  if (!config.projectType || !config.complexity) return null;

  const [baseL, baseH] = BASE_PRICES[config.projectType];
  const mult = COMPLEXITY_MULTIPLIERS[config.complexity];

  let low = Math.round(baseL * mult);
  let high = Math.round(baseH * mult);

  if (config.timeline === 'ASAP (+20% rush premium)') {
    low = Math.round(low * 1.2);
    high = Math.round(high * 1.2);
  } else if (config.timeline === 'Flexible (−5% discount)') {
    low = Math.round(low * 0.95);
    high = Math.round(high * 0.95);
  }

  if (config.maintenance) {
    high = Math.round(high * 1.1);
  }

  // Round to nearest 500
  low = Math.round(low / 500) * 500;
  high = Math.round(high / 500) * 500;

  const weeksBase = BASE_WEEKS[config.projectType];

  let tier: 'Starter' | 'Growth' | 'Scale' = 'Starter';
  if (high > 20000) tier = 'Scale';
  else if (high > 8000) tier = 'Growth';

  return { low, high, weeks: weeksBase, tier };
}

function fmtPrice(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `$${n}`;
}

// ── FAQ items ────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'Can I start with Starter and upgrade?',
    a: 'Yes. Most clients do. We build with clean architecture from day one, so scaling to a larger scope later is straightforward. Just let us know during scoping if you expect to expand the product.',
  },
  {
    q: 'What if the final cost goes over the estimate?',
    a: 'We tell you before doing any extra work. Every scope change is handled in writing — you see the new cost and approve it before we proceed. No surprises, ever.',
  },
  {
    q: 'Do you bill hourly?',
    a: 'No. All projects are fixed price. You know the number before we start, and it doesn\'t change unless you add scope. No hourly tracking, no surprise invoices.',
  },
  {
    q: "What's NOT included in the price?",
    a: 'Third-party costs like hosting, domain registration, and external API fees are not included — but we document them upfront so you know exactly what your running costs will be. Typically $20–$150/month depending on infrastructure.',
  },
  {
    q: 'What are the payment terms?',
    a: '50% upfront when you approve the proposal. 50% on final delivery, before handover. No lock-in, no ongoing obligations unless you choose a maintenance plan.',
  },
  {
    q: "What if I'm not happy with the result?",
    a: "We revise until you are — that's in the contract. Revision rounds are included. If we genuinely can't deliver what was in the proposal, we refund. In 5 years, we've never had to.",
  },
  {
    q: 'Do I own the code?',
    a: '100%, from day one. The code is yours. The repository is yours. You can take it anywhere. We don\'t retain any rights to what we build for you.',
  },
  {
    q: 'Can I cancel mid-project?',
    a: 'Yes. You pay for work completed to date, nothing more. No cancellation penalty. We\'ll document what\'s been built and hand everything over cleanly.',
  },
  {
    q: 'Can you handle rush jobs?',
    a: 'Yes, with a 20% rush premium. Tell us your hard deadline during the scoping call and we\'ll tell you whether we can hit it. We don\'t promise timelines we can\'t keep.',
  },
  {
    q: 'Are there discounts for early-stage startups?',
    a: <span>Check out <Link href="/ventures" style={{ color: A }}>SocioFi Ventures</Link> — we do equity-based partnerships for early-stage companies that qualify. Not right for everyone, but worth a look if you&apos;re pre-revenue.</span>,
  },
];

// ── Components ───────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
      <polyline points="3,8 6.5,11.5 13,5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 7h10M7 2l5 5-5 5" />
    </svg>
  );
}

function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`pr-faq-icon${open ? ' open' : ''}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="10" y1="4" x2="10" y2="16" />
      <line x1="4" y1="10" x2="16" y2="10" />
    </svg>
  );
}

function FAQItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pr-faq-item">
      <button className="pr-faq-q" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="pr-faq-q-text">{q}</span>
        <PlusIcon open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="pr-faq-a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="pr-faq-a-inner">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PROJECT_TYPES: ProjectType[] = ['MVP / Prototype', 'Web Application', 'SaaS Platform', 'Internal Tool / Dashboard', 'Automation / Integration', 'Rescue / Fix Existing Code'];
const COMPLEXITIES: Complexity[] = ['Simple (1–2 features)', 'Moderate (3–5 features)', 'Complex (6+ features)', 'Enterprise (multi-module)'];
const TIMELINE_PREFS: TimelinePref[] = ['ASAP (+20% rush premium)', 'Standard (recommended)', 'Flexible (−5% discount)'];

function Configurator() {
  const [config, setConfig] = useState<ConfigState>({
    projectType: null,
    complexity: null,
    timeline: 'Standard (recommended)',
    maintenance: false,
  });

  const result = calculatePrice(config);

  function pill<T extends string>(
    options: T[],
    value: T | null | boolean,
    onSelect: (v: T) => void,
  ) {
    return options.map((opt) => (
      <button
        key={opt}
        className={`pr-config-pill${value === opt ? ' selected' : ''}`}
        onClick={() => onSelect(opt)}
      >
        {opt}
      </button>
    ));
  }

  return (
    <div>
      <div className="pr-config-grid">
        <div className="pr-config-field">
          <span className="pr-config-field-label">Project type</span>
          <div className="pr-config-pills">
            {PROJECT_TYPES.map((opt) => (
              <button
                key={opt}
                className={`pr-config-pill${config.projectType === opt ? ' selected' : ''}`}
                onClick={() => setConfig((c) => ({ ...c, projectType: opt }))}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="pr-config-field">
          <span className="pr-config-field-label">Complexity</span>
          <div className="pr-config-pills">
            {COMPLEXITIES.map((opt) => (
              <button
                key={opt}
                className={`pr-config-pill${config.complexity === opt ? ' selected' : ''}`}
                onClick={() => setConfig((c) => ({ ...c, complexity: opt }))}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="pr-config-field">
          <span className="pr-config-field-label">Timeline preference</span>
          <div className="pr-config-pills">
            {TIMELINE_PREFS.map((opt) => (
              <button
                key={opt}
                className={`pr-config-pill${config.timeline === opt ? ' selected' : ''}`}
                onClick={() => setConfig((c) => ({ ...c, timeline: opt }))}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="pr-config-field">
          <span className="pr-config-field-label">Ongoing maintenance?</span>
          <div className="pr-config-pills">
            {(['Yes', 'No'] as const).map((opt) => (
              <button
                key={opt}
                className={`pr-config-pill${config.maintenance === (opt === 'Yes') ? ' selected' : ''}`}
                onClick={() => setConfig((c) => ({ ...c, maintenance: opt === 'Yes' }))}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            className="pr-config-result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="pr-config-result-left">
              <p className="pr-config-result-label">Estimated range</p>
              <span className="pr-config-result-range">
                {fmtPrice(result.low)} – {fmtPrice(result.high)}
              </span>
              <p className="pr-config-result-details">
                Estimated timeline: {result.weeks} weeks
              </p>
              <span className="pr-config-result-tier">Recommended tier: {result.tier}</span>
            </div>
            <div>
              <Link href="/studio/start-project" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                Get an exact quote
                <ArrowIcon />
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            className="pr-config-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ justifyContent: 'center', textAlign: 'center' }}
          >
            <p style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Select a project type and complexity above to see an estimate.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const INCLUDED_ITEMS = [
  'AI-powered development',
  'Human code review on every build',
  'Architecture design',
  'Deployment & hosting setup',
  '30-day bug warranty',
  '100% code ownership',
  'Plain-English updates',
  'No long-term contracts',
];

const COMPARE_ROWS = [
  { label: 'Simple MVP', agency: '$40K–$80K, 3–5 months', freelancer: '$5K–$15K, unpredictable', inhouse: '$80K+ salary + benefits', sociofi: '$3K–$8K, 2–3 weeks' },
  { label: 'Full product', agency: '$80K–$200K, 6–12 months', freelancer: 'Hard to find + manage', inhouse: '6–12 months to hire + ramp', sociofi: '$8K–$20K, 4–6 weeks' },
  { label: 'Timeline', agency: '3x–6x slower', freelancer: 'Variable, risky', inhouse: 'Months before first line', sociofi: 'Weeks, fixed' },
  { label: 'After launch', agency: 'New contract', freelancer: 'Gone or expensive retainer', inhouse: 'Works out — if they stay', sociofi: 'Maintenance plan or hand off' },
  { label: 'Code quality', agency: 'Varies widely', freelancer: 'Varies widely', inhouse: 'Depends on hire', sociofi: 'Human-reviewed, documented' },
];

const RETAINERS = [
  { name: 'Build', hours: '20 hrs / month', price: '$3,000', period: '/month', desc: 'Ongoing features, fixes, and improvements for live products.' },
  { name: 'Build+', hours: '40 hrs / month', price: '$5,500', period: '/month', desc: 'Heavier development cadence — new features, integrations, performance work.' },
  { name: 'Dedicated', hours: '80+ hrs / month', price: 'Custom', period: '/month', desc: 'A dedicated engineering team for your product. Volume pricing on request.' },
];

const TIER_FEATURES = {
  starter: [
    'Full-stack development',
    'Architecture and system design',
    'Production deployment and hosting setup',
    'Authentication (login, sign-up, sessions)',
    '30-day post-launch bug warranty',
    '100% code ownership from day one',
    'Weekly plain-English progress updates',
  ],
  growth: [
    'Everything in Starter',
    'Stripe payments and webhook handling',
    'Role-based access control',
    'Complex database design',
    'REST or GraphQL API development',
    'Third-party integrations',
    'Extended QA and load testing',
  ],
  scale: [
    'Everything in Growth',
    'Dedicated project lead',
    'Architecture documentation',
    'Load testing and performance optimization',
    'Security audit',
    'Data migration support',
    'Team onboarding and training materials',
  ],
};

const inview = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 as const },
  transition: { duration: 0.7, ease: EASE },
};

export default function PricingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="pr-page">

        {/* Hero */}
        <section className="pr-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="sec-label">Pricing</p>
            <h1 className="pr-hero-title">Honest Pricing. No Surprises. No Hidden Fees.</h1>
            <p className="pr-hero-sub">See exactly what things cost before you commit. Every project is fixed scope and fixed price — agreed in writing before we start.</p>
            <div className="pr-ceo-quote">
              <p className="pr-ceo-quote-text">
                "I hated the 'contact us for pricing' game when I was looking for a dev team. So we put our numbers on the website. If you can't afford to be transparent about cost, you probably can't afford to be trusted with someone's project."
              </p>
              <p className="pr-ceo-quote-attr">Arifur Rahman — CEO, SocioFi Technology</p>
            </div>
          </motion.div>
        </section>

        {/* Tier Cards */}
        <section className="pr-tiers">
          <motion.div {...inview} style={{ marginBottom: 40 }}>
            <p className="sec-label">Project pricing</p>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              Three tiers. Real numbers.
            </h2>
          </motion.div>

          <motion.div className="pr-tiers-grid" {...inview}>
            {/* Starter */}
            <div className="pr-tier-card">
              <div className="pr-tier-top">
                <div className="pr-tier-badges"><span style={{ minHeight: 24, display: 'block' }} /></div>
                <h3 className="pr-tier-name">Starter</h3>
                <p className="pr-tier-desc">For MVPs, simple apps, and rescue projects</p>
              </div>
              <div className="pr-tier-price-wrap">
                <span className="pr-tier-price">$3,000–$8,000</span>
                <span className="pr-tier-timeline">2–3 weeks · fixed price</span>
              </div>
              <div className="pr-tier-best-for">
                <strong>Best for:</strong> First products, landing pages, AI prototype rescue, simple dashboards
              </div>
              <div className="pr-tier-features">
                {TIER_FEATURES.starter.map((f) => (
                  <div key={f} className="pr-tier-feature">
                    <CheckIcon />
                    <span className="pr-tier-feature-text">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/studio/start-project" className="pr-tier-cta ghost">
                Start a Starter Project
                <ArrowIcon />
              </Link>
            </div>

            {/* Growth */}
            <div className="pr-tier-card featured">
              <div className="pr-tier-top">
                <div className="pr-tier-badges">
                  <span className="pr-tier-badge">Most popular</span>
                </div>
                <h3 className="pr-tier-name">Growth</h3>
                <p className="pr-tier-desc">For full products and serious tools</p>
              </div>
              <div className="pr-tier-price-wrap">
                <span className="pr-tier-price">$8,000–$20,000</span>
                <span className="pr-tier-timeline">3–6 weeks · fixed price</span>
              </div>
              <div className="pr-tier-best-for">
                <strong>Best for:</strong> SaaS products, complex internal tools, customer platforms, multi-feature apps
              </div>
              <div className="pr-tier-features">
                {TIER_FEATURES.growth.map((f) => (
                  <div key={f} className="pr-tier-feature">
                    <CheckIcon />
                    <span className="pr-tier-feature-text">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/studio/start-project" className="pr-tier-cta primary">
                Start a Growth Project
                <ArrowIcon />
              </Link>
            </div>

            {/* Scale */}
            <div className="pr-tier-card">
              <div className="pr-tier-top">
                <div className="pr-tier-badges"><span style={{ minHeight: 24, display: 'block' }} /></div>
                <h3 className="pr-tier-name">Scale</h3>
                <p className="pr-tier-desc">For large platforms and enterprise tools</p>
              </div>
              <div className="pr-tier-price-wrap">
                <span className="pr-tier-price">$20,000+</span>
                <span className="pr-tier-timeline">6–12 weeks · custom scope</span>
              </div>
              <div className="pr-tier-best-for">
                <strong>Best for:</strong> Multi-module platforms, enterprise software, complex SaaS
              </div>
              <div className="pr-tier-features">
                {TIER_FEATURES.scale.map((f) => (
                  <div key={f} className="pr-tier-feature">
                    <CheckIcon />
                    <span className="pr-tier-feature-text">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/studio/start-project" className="pr-tier-cta ghost">
                Talk to Us About Scale
                <ArrowIcon />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Configurator */}
        <section className="pr-config">
          <div className="pr-config-inner">
            <motion.div {...inview}>
              <p className="sec-label">Project configurator</p>
              <h2 className="pr-config-title">Not Sure Which Tier? Configure Your Project.</h2>
              <p className="pr-config-sub">Select your project type and complexity to see a live estimate. These are real numbers — not ranges designed to get you on a call.</p>
              <Configurator />
            </motion.div>
          </div>
        </section>

        {/* Monthly Retainers */}
        <section className="pr-retainers">
          <motion.div {...inview}>
            <p className="sec-label">Monthly retainers</p>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
              Ongoing development, predictable cost
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.65 }}>
              For products that are live and need continuous improvement.
            </p>
            <div className="pr-retainer-grid">
              {RETAINERS.map((r) => (
                <div key={r.name} className="pr-retainer-card">
                  <h3 className="pr-retainer-name">{r.name}</h3>
                  <p className="pr-retainer-hours">{r.hours}</p>
                  <p className="pr-retainer-price">{r.price}</p>
                  <p className="pr-retainer-period">{r.period}</p>
                  <p style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Always Included */}
        <section className="pr-included">
          <div className="pr-included-inner">
            <motion.div {...inview}>
              <p className="sec-label">What's always included</p>
              <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                Every project. Every tier. No exceptions.
              </h2>
              <div className="pr-included-grid">
                {INCLUDED_ITEMS.map((item) => (
                  <div key={item} className="pr-included-item">
                    <CheckIcon />
                    <span className="pr-included-item-text">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="pr-compare">
          <motion.div {...inview}>
            <p className="sec-label">How we compare</p>
            <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
              SocioFi Studio vs. your other options
            </h2>
            <p style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Honest comparisons. We're not right for every situation — but for most, we're the best option.
            </p>
            <table className="pr-compare-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Traditional Agency</th>
                  <th>Freelancer</th>
                  <th>In-House Hire</th>
                  <th className="highlight">SocioFi Studio</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>{row.agency}</td>
                    <td>{row.freelancer}</td>
                    <td>{row.inhouse}</td>
                    <td className="highlight">{row.sociofi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="pr-faq">
          <div className="pr-faq-inner">
            <motion.div {...inview} style={{ marginBottom: 40 }}>
              <p className="sec-label">FAQ</p>
              <h2 style={{ fontFamily: F.h, fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                Questions about pricing
              </h2>
            </motion.div>
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pr-cta">
          <div className="pr-cta-inner">
            <motion.div {...inview}>
              <p className="sec-label" style={{ justifyContent: 'center' }}>Start a project</p>
              <h2 className="pr-cta-title">Know what you need? Let's scope it.</h2>
              <p className="pr-cta-sub">Tell us what you're building. We respond within 4 hours with an honest assessment and a clear path forward.</p>
              <div className="pr-cta-btns">
                <Link href="/studio/start-project" className="btn-primary">
                  Start Your Project
                  <ArrowIcon />
                </Link>
                <Link href="/contact" className="btn-ghost">
                  Book a Free Call
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}
