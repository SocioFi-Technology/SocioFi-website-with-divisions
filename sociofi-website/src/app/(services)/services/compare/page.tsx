'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────────

const A = '#4DBFA8';

// ── Styles ─────────────────────────────────────────────────────────────────────

const STYLES = `
  .cmp-page {
    min-height: 100vh;
    background: var(--bg);
    padding-top: 80px;
  }

  /* ── Hero ─────────────────────────────────────────────────── */
  .cmp-hero {
    padding: 100px 0 80px;
    text-align: center;
  }
  .cmp-hero-inner {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .cmp-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .cmp-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .cmp-label::after {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .cmp-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    margin: 0 0 20px;
  }
  .cmp-subtitle {
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    margin: 0;
  }

  /* ── Comparison Table ─────────────────────────────────────── */
  .cmp-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px 80px;
  }
  .cmp-table-wrap {
    overflow-x: auto;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
  }
  .cmp-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-body);
    font-size: 0.9rem;
    min-width: 800px;
  }
  .cmp-table thead tr {
    background: var(--bg-2);
    border-bottom: 1px solid var(--border);
  }
  .cmp-table thead th {
    padding: 18px 20px;
    text-align: center;
    font-family: var(--font-headline);
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    white-space: nowrap;
  }
  .cmp-table thead th:first-child {
    text-align: left;
    width: 200px;
  }
  .cmp-table thead th.col-sociofi {
    background: rgba(77,191,168,0.08);
    color: ${A};
    border-left: 2px solid rgba(77,191,168,0.3);
    border-right: 2px solid rgba(77,191,168,0.3);
  }
  .cmp-table tbody tr {
    border-bottom: 1px solid var(--border);
  }
  .cmp-table tbody tr:last-child {
    border-bottom: none;
  }
  .cmp-table tbody tr:hover {
    background: var(--bg-2);
  }
  .cmp-table tbody td {
    padding: 16px 20px;
    text-align: center;
    color: var(--text-secondary);
    vertical-align: middle;
    line-height: 1.4;
  }
  .cmp-table tbody td:first-child {
    text-align: left;
    font-weight: 500;
    color: var(--text-primary);
    font-size: 0.88rem;
  }
  .cmp-table tbody td.col-sociofi {
    background: rgba(77,191,168,0.04);
    color: var(--text-primary);
    font-weight: 500;
    border-left: 2px solid rgba(77,191,168,0.3);
    border-right: 2px solid rgba(77,191,168,0.3);
  }
  .cmp-table tbody tr:last-child td.col-sociofi {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .check-y {
    color: ${A};
    font-weight: 700;
  }
  .check-n {
    color: var(--text-muted);
  }
  .check-partial {
    color: var(--text-secondary);
    font-size: 0.82rem;
  }

  /* ── Two-col grid ─────────────────────────────────────────── */
  .cmp-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    margin-top: 0;
  }
  @media (max-width: 768px) {
    .cmp-two-col { grid-template-columns: 1fr; }
  }
  .cmp-decision-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 36px;
  }
  .cmp-decision-card.is {
    border-top: 3px solid ${A};
  }
  .cmp-decision-card.is-not {
    border-top: 3px solid var(--text-muted);
  }
  .cmp-decision-title {
    font-family: var(--font-headline);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 24px;
    letter-spacing: -0.01em;
  }
  .cmp-decision-card.is .cmp-decision-title { color: ${A}; }
  .cmp-decision-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .cmp-decision-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-left: 20px;
    position: relative;
  }
  .cmp-decision-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${A};
  }
  .cmp-decision-card.is-not .cmp-decision-item::before {
    background: var(--text-muted);
  }
  .cmp-decision-main {
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
    line-height: 1.4;
  }
  .cmp-decision-note {
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--text-secondary);
    line-height: 1.5;
    font-style: italic;
  }
  .cmp-decision-note a {
    color: ${A};
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  /* ── Section header ───────────────────────────────────────── */
  .cmp-sec-header {
    margin-bottom: 40px;
  }
  .cmp-sec-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cmp-sec-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
  }
  .cmp-sec-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.6rem, 2.5vw, 2rem);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 12px;
  }
  .cmp-sec-desc {
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.7;
    max-width: 600px;
    margin: 0;
  }
  .cmp-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 0 0 80px;
  }

  /* ── Cost Reality ─────────────────────────────────────────── */
  .cmp-cost-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }
  @media (max-width: 768px) {
    .cmp-cost-grid { grid-template-columns: 1fr; }
  }
  .cmp-cost-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 36px;
  }
  .cmp-cost-card.bad {
    border-top: 3px solid #E87560;
  }
  .cmp-cost-card.good {
    border-top: 3px solid ${A};
  }
  .cmp-cost-card-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 20px;
    color: var(--text-muted);
  }
  .cmp-cost-card.bad .cmp-cost-card-label { color: #E87560; }
  .cmp-cost-card.good .cmp-cost-card-label { color: ${A}; }
  .cmp-cost-card-title {
    font-family: var(--font-headline);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 20px;
    letter-spacing: -0.01em;
  }
  .cmp-year-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .cmp-year-item {
    display: grid;
    grid-template-columns: 60px 1fr;
    gap: 12px;
    align-items: start;
  }
  .cmp-year-badge {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
    padding-top: 2px;
    letter-spacing: 0.05em;
  }
  .cmp-year-text {
    font-family: var(--font-body);
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }
  .cmp-year-text strong {
    color: var(--text-primary);
    font-weight: 600;
  }
  .cmp-year-text.highlight {
    color: #E87560;
  }
  .cmp-year-text.good-highlight {
    color: ${A};
  }

  /* ── CTA ──────────────────────────────────────────────────── */
  .cmp-cta {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    padding: 100px 32px;
    text-align: center;
  }
  .cmp-cta-inner {
    max-width: 560px;
    margin: 0 auto;
  }
  .cmp-cta h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.6rem, 2.5vw, 2rem);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 16px;
  }
  .cmp-cta p {
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.7;
    margin: 0 0 36px;
  }
  .cmp-btn-row {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: var(--gradient-brand);
    color: #fff;
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    border-radius: var(--radius-full);
    text-decoration: none;
    transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
    box-shadow: 0 4px 24px rgba(58,88,158,0.35);
  }
  .btn-primary:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(58,88,158,0.5);
  }
  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: transparent;
    color: var(--text-primary);
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    border-radius: var(--radius-full);
    border: 1.5px solid var(--border);
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-ghost:hover {
    border-color: ${A};
    color: ${A};
  }

  @media (max-width: 768px) {
    .cmp-section { padding: 0 20px 60px; }
    .cmp-hero { padding: 80px 0 60px; }
    .cmp-hero-inner { padding: 0 20px; }
    .cmp-cta { padding: 80px 20px; }
  }
`;

// ── Table data ─────────────────────────────────────────────────────────────────

type CellValue = string | boolean | null;

interface TableRow {
  feature: string;
  nothing: CellValue;
  freelancer: CellValue;
  fulltime: CellValue;
  inhouse: CellValue;
  sociofi: CellValue;
}

const TABLE_ROWS: TableRow[] = [
  {
    feature: 'Monthly cost',
    nothing: '$0',
    freelancer: '$500–2,000',
    fulltime: '$8,000–15,000',
    inhouse: '$30,000+',
    sociofi: '$499–1,999',
  },
  {
    feature: 'Response time',
    nothing: 'Never',
    freelancer: '1–3 days',
    fulltime: 'Hours (if available)',
    inhouse: 'Hours (if available)',
    sociofi: '1–24 hours (SLA)',
  },
  {
    feature: 'Security patches',
    nothing: false,
    freelancer: null,
    fulltime: null,
    inhouse: true,
    sociofi: true,
  },
  {
    feature: 'Knows your codebase',
    nothing: false,
    freelancer: null,
    fulltime: true,
    inhouse: true,
    sociofi: true,
  },
  {
    feature: 'Available 24/7',
    nothing: false,
    freelancer: false,
    fulltime: false,
    inhouse: null,
    sociofi: true,
  },
  {
    feature: 'Monitoring',
    nothing: false,
    freelancer: false,
    fulltime: null,
    inhouse: null,
    sociofi: true,
  },
  {
    feature: 'Bug fixes',
    nothing: false,
    freelancer: true,
    fulltime: true,
    inhouse: true,
    sociofi: true,
  },
  {
    feature: 'Feature additions',
    nothing: false,
    freelancer: true,
    fulltime: true,
    inhouse: true,
    sociofi: 'Growth & Scale',
  },
  {
    feature: 'Knows your history',
    nothing: false,
    freelancer: false,
    fulltime: true,
    inhouse: true,
    sociofi: true,
  },
  {
    feature: 'One vendor accountability',
    nothing: false,
    freelancer: null,
    fulltime: false,
    inhouse: false,
    sociofi: true,
  },
];

// ── Cell renderer ──────────────────────────────────────────────────────────────

function Cell({ value, isSocioFi = false }: { value: CellValue; isSocioFi?: boolean }) {
  if (value === true) return <span className="check-y">Yes</span>;
  if (value === false) return <span className="check-n">No</span>;
  if (value === null) return <span className="check-partial">Sometimes</span>;
  return <span style={isSocioFi ? { color: A, fontWeight: 600 } : {}}>{value}</span>;
}

// ── Fade-in ────────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ServicesComparePage() {
  return (
    <>
      <style>{STYLES}</style>
      <main className="cmp-page">

        {/* ── Hero ── */}
        <section className="cmp-hero">
          <motion.div
            className="cmp-hero-inner"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div className="cmp-label" variants={fadeUp}>Compare</motion.div>
            <motion.h1 className="cmp-h1" variants={fadeUp}>
              Every Option for Maintaining Your Software.
            </motion.h1>
            <motion.p className="cmp-subtitle" variants={fadeUp}>
              We&apos;ll be honest about when Services IS the right choice — and when it isn&apos;t. You deserve a clear picture before you commit.
            </motion.p>
          </motion.div>
        </section>

        {/* ── Comparison Table ── */}
        <motion.section
          className="cmp-section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div className="cmp-sec-header" variants={fadeUp}>
            <div className="cmp-sec-label">Side by side</div>
            <h2 className="cmp-sec-h2">How the options compare.</h2>
            <p className="cmp-sec-desc">
              An honest look at every realistic choice for a non-technical founder managing live software.
            </p>
          </motion.div>

          <motion.div className="cmp-table-wrap" variants={fadeUp}>
            <table className="cmp-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Do Nothing</th>
                  <th>Part-time Freelancer</th>
                  <th>Full-time Hire</th>
                  <th>In-house Team</th>
                  <th className="col-sociofi">SocioFi Services</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td><Cell value={row.nothing} /></td>
                    <td><Cell value={row.freelancer} /></td>
                    <td><Cell value={row.fulltime} /></td>
                    <td><Cell value={row.inhouse} /></td>
                    <td className="col-sociofi"><Cell value={row.sociofi} isSocioFi /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.section>

        <hr className="cmp-divider" />

        {/* ── When IS / IS NOT ── */}
        <motion.section
          className="cmp-section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div className="cmp-sec-header" variants={fadeUp}>
            <div className="cmp-sec-label">Honest assessment</div>
            <h2 className="cmp-sec-h2">Is Services right for your situation?</h2>
            <p className="cmp-sec-desc">
              We turn away clients who are not a good fit. Here&apos;s how to know before you contact us.
            </p>
          </motion.div>

          <motion.div className="cmp-two-col" variants={fadeUp}>
            {/* IS the right choice */}
            <div className="cmp-decision-card is">
              <h3 className="cmp-decision-title">When Services IS the right choice</h3>
              <ul className="cmp-decision-list">
                <li className="cmp-decision-item">
                  <span className="cmp-decision-main">Solo founder without a tech team</span>
                  <span className="cmp-decision-note">Your product is live. You have no engineer. You need someone watching it full-time without hiring full-time.</span>
                </li>
                <li className="cmp-decision-item">
                  <span className="cmp-decision-main">Product built by an agency that disappeared</span>
                  <span className="cmp-decision-note">You have running software, no documentation, and no one who knows the codebase. We audit it and take over.</span>
                </li>
                <li className="cmp-decision-item">
                  <span className="cmp-decision-main">In-house team overloaded with new features</span>
                  <span className="cmp-decision-note">Your engineers are building — not watching. Maintenance falls through the cracks. We cover the gap.</span>
                </li>
                <li className="cmp-decision-item">
                  <span className="cmp-decision-main">AI agents that need human oversight</span>
                  <span className="cmp-decision-note">You are running agents in production and need accuracy monitoring, drift detection, and intervention when things go wrong.</span>
                </li>
                <li className="cmp-decision-item">
                  <span className="cmp-decision-main">Products where downtime means lost revenue</span>
                  <span className="cmp-decision-note">Every hour down costs you money. You need a guaranteed response time, not a best-effort arrangement.</span>
                </li>
              </ul>
            </div>

            {/* IS NOT the right choice */}
            <div className="cmp-decision-card is-not">
              <h3 className="cmp-decision-title">When Services IS NOT the right choice</h3>
              <ul className="cmp-decision-list">
                <li className="cmp-decision-item">
                  <span className="cmp-decision-main">You have a senior engineer with capacity</span>
                  <span className="cmp-decision-note">
                    You probably don&apos;t need us. What you might benefit from is better infrastructure. Check{' '}
                    <Link href="/cloud">Cloud</Link>.
                  </span>
                </li>
                <li className="cmp-decision-item">
                  <span className="cmp-decision-main">You are pre-revenue with an MVP that barely works</span>
                  <span className="cmp-decision-note">
                    Start with Studio&apos;s{' '}
                    <Link href="/studio/services/rescue-ship">Rescue &amp; Ship</Link>{' '}
                    to get it production-ready. Come back to Services once it is live.
                  </span>
                </li>
                <li className="cmp-decision-item">
                  <span className="cmp-decision-main">You need a 10-person team for a massive feature build</span>
                  <span className="cmp-decision-note">
                    That is product development, not maintenance. That is{' '}
                    <Link href="/studio">Studio</Link> territory.
                  </span>
                </li>
                <li className="cmp-decision-item">
                  <span className="cmp-decision-main">You have an internal DevOps team already</span>
                  <span className="cmp-decision-note">
                    Redundant monitoring and conflicting incident ownership is worse than neither. Your team already has this covered.
                  </span>
                </li>
                <li className="cmp-decision-item">
                  <span className="cmp-decision-main">You want full-time embedded engineers</span>
                  <span className="cmp-decision-note">
                    We work async. We are not embedded staff augmentation. If you need a full-time engineer on Slack, that is a different engagement.
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.section>

        <hr className="cmp-divider" />

        {/* ── Cost Reality Check ── */}
        <motion.section
          className="cmp-section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div className="cmp-sec-header" variants={fadeUp}>
            <div className="cmp-sec-label">The real numbers</div>
            <h2 className="cmp-sec-h2">What does ignoring maintenance actually cost?</h2>
            <p className="cmp-sec-desc">
              The honest three-year scenario for a typical small business product — doing nothing vs. a consistent maintenance plan.
            </p>
          </motion.div>

          <motion.div className="cmp-cost-grid" variants={fadeUp}>
            <div className="cmp-cost-card bad">
              <div className="cmp-cost-card-label">Scenario: Do nothing</div>
              <h3 className="cmp-cost-card-title">The &quot;free&quot; option over 3 years</h3>
              <ul className="cmp-year-list">
                <li className="cmp-year-item">
                  <span className="cmp-year-badge">Year 1</span>
                  <span className="cmp-year-text"><strong>$0 direct cost.</strong> Software works fine. Dependencies quietly age. No visible problems. You feel validated.</span>
                </li>
                <li className="cmp-year-item">
                  <span className="cmp-year-badge">Year 2</span>
                  <span className="cmp-year-text highlight"><strong>First major incident.</strong> One cascading failure — a dependency conflict, a server misconfiguration, a missed security patch. Emergency freelancer: $2,000–5,000. Lost revenue from 18 hours downtime: $8,000–15,000.</span>
                </li>
                <li className="cmp-year-item">
                  <span className="cmp-year-badge">Year 3</span>
                  <span className="cmp-year-text highlight"><strong>Security breach.</strong> Unpatched vulnerability exploited. Data exposure incident. Legal/compliance response: $20,000–80,000. Customer churn from lost trust: incalculable.</span>
                </li>
                <li className="cmp-year-item">
                  <span className="cmp-year-badge">Total</span>
                  <span className="cmp-year-text highlight"><strong>$30,000–100,000+</strong> in reactive costs. Plus the time cost: 3–6 months of distraction during each crisis.</span>
                </li>
              </ul>
            </div>

            <div className="cmp-cost-card good">
              <div className="cmp-cost-card-label">Scenario: SocioFi Services</div>
              <h3 className="cmp-cost-card-title">Consistent maintenance over 3 years</h3>
              <ul className="cmp-year-list">
                <li className="cmp-year-item">
                  <span className="cmp-year-badge">Year 1</span>
                  <span className="cmp-year-text good-highlight"><strong>$5,988–23,988/yr</strong> (Essential to Scale). Monitoring live. Weekly dependency audits. 2 security vulnerabilities patched before anyone noticed. Zero incidents.</span>
                </li>
                <li className="cmp-year-item">
                  <span className="cmp-year-badge">Year 2</span>
                  <span className="cmp-year-text good-highlight"><strong>Same cost.</strong> One potential incident detected and resolved in 90 minutes. No downtime. No emergency freelancer. No lost revenue. You barely noticed.</span>
                </li>
                <li className="cmp-year-item">
                  <span className="cmp-year-badge">Year 3</span>
                  <span className="cmp-year-text good-highlight"><strong>Same cost.</strong> Security audit found a critical CVE. Patched within 24 hours. No breach. No lawyers. No customer notifications. Clean bill of health.</span>
                </li>
                <li className="cmp-year-item">
                  <span className="cmp-year-badge">Total</span>
                  <span className="cmp-year-text good-highlight"><strong>$18,000–72,000</strong> over 3 years. Predictable. Budgetable. Zero crisis events. Full attention on building your business.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.section>

        {/* ── CTA ── */}
        <section className="cmp-cta">
          <motion.div
            className="cmp-cta-inner"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h2 variants={fadeUp}>Make the right choice for your situation.</motion.h2>
            <motion.p variants={fadeUp}>
              If Services sounds like a fit, start with an audit. We will assess your codebase and tell you exactly what it needs — before you commit to a plan.
            </motion.p>
            <motion.div className="cmp-btn-row" variants={fadeUp}>
              <Link href="/services/get-protected" className="btn-primary">Get protected</Link>
              <Link href="/services/audit" className="btn-ghost">Request a free audit</Link>
            </motion.div>
          </motion.div>
        </section>

      </main>
    </>
  );
}
