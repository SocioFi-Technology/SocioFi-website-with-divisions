'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const A = '#4DBFA8';

const STYLES = `
  @keyframes svcPulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.15); }
  }

  .hiw-hero {
    position: relative;
    padding: 160px 0 100px;
    background: var(--bg);
    overflow: hidden;
    text-align: center;
  }
  .hiw-hero-orb-a {
    position: absolute;
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(77,191,168,0.10) 0%, transparent 65%);
    top: -280px; left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    animation: svcPulse 9s ease-in-out infinite;
  }
  .hiw-hero-orb-b {
    position: absolute;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(58,88,158,0.09) 0%, transparent 65%);
    bottom: -80px; right: 8%;
    pointer-events: none;
    animation: svcPulse 11s ease-in-out infinite 2.5s;
  }

  .hiw-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
  }
  @media (max-width: 768px) { .hiw-wrap { padding: 0 20px; } }

  .hiw-mono-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .hiw-mono-label::before,
  .hiw-mono-label::after {
    content: '';
    width: 20px; height: 1.5px;
    background: ${A};
    display: inline-block;
  }

  .hiw-sec-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }
  .hiw-sec-label::before {
    content: '';
    width: 20px; height: 1.5px;
    background: ${A};
  }

  .hiw-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.4rem, 4.5vw, 3.8rem);
    font-weight: 800;
    line-height: 1.07;
    letter-spacing: -0.033em;
    color: var(--text-primary);
    margin: 0 auto 24px;
    max-width: 880px;
  }
  .hiw-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 0 0 16px;
  }
  .hiw-hero-sub {
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 580px;
    margin: 0 auto 40px;
  }
  .hiw-grad {
    background: linear-gradient(135deg, #4A6CB8, ${A});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hiw-btn-row {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .hiw-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: ${A};
    color: #fff;
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    border-radius: var(--radius-full);
    text-decoration: none;
    transition: all 0.25s var(--ease);
    box-shadow: 0 4px 24px rgba(77,191,168,0.3);
  }
  .hiw-btn-primary:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(77,191,168,0.5);
  }
  .hiw-btn-ghost {
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
    transition: all 0.25s var(--ease);
  }
  .hiw-btn-ghost:hover {
    border-color: ${A};
    color: ${A};
  }

  /* ── Paths ── */
  .hiw-paths { padding: 100px 0; background: var(--bg-2); }
  .hiw-paths-header { text-align: center; margin-bottom: 60px; }
  .hiw-paths-sub {
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.65;
    max-width: 540px;
    margin: 0 auto;
  }
  .hiw-paths-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  @media (max-width: 768px) { .hiw-paths-grid { grid-template-columns: 1fr; } }

  .hiw-path-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 36px;
    transition: all 0.4s var(--ease);
    position: relative;
    overflow: hidden;
    box-shadow: var(--card-shadow);
  }
  .hiw-path-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--navy), ${A});
    opacity: 0;
    transition: opacity 0.4s;
  }
  .hiw-path-card:hover { transform: translateY(-6px); box-shadow: var(--card-hover-shadow); border-color: var(--border-hover); }
  .hiw-path-card:hover::before { opacity: 1; }
  .hiw-path-featured { border-color: rgba(77,191,168,0.28); }
  .hiw-path-featured::before { opacity: 1 !important; }

  .hiw-path-badge {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    margin-bottom: 20px;
  }
  .hiw-badge-a { background: rgba(58,88,158,0.14); color: #6B8CD4; border: 1px solid rgba(58,88,158,0.2); }
  .hiw-badge-b { background: rgba(77,191,168,0.10); color: ${A}; border: 1px solid rgba(77,191,168,0.22); }

  .hiw-path-icon {
    width: 48px; height: 48px;
    border-radius: var(--radius-md);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }
  .hiw-icon-a { background: rgba(58,88,158,0.14); }
  .hiw-icon-b { background: rgba(77,191,168,0.10); }

  .hiw-path-title {
    font-family: var(--font-headline);
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--text-primary);
    margin: 0 0 12px;
  }
  .hiw-path-desc {
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.65;
    color: var(--text-secondary);
    margin: 0 0 24px;
  }
  .hiw-path-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 28px;
  }
  .hiw-tag {
    font-family: var(--font-mono);
    font-size: 0.71rem;
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    background: var(--bg-2);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .hiw-path-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-headline);
    font-size: 0.88rem;
    font-weight: 600;
    color: ${A};
    text-decoration: none;
    transition: gap 0.2s var(--ease);
  }
  .hiw-path-cta:hover { gap: 10px; }

  /* ── Timeline ── */
  .hiw-timeline-sec { padding: 100px 0; background: var(--bg); }
  .hiw-timeline-header { text-align: center; margin-bottom: 72px; }
  .hiw-timeline-body {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }
  .hiw-timeline-body::before {
    content: '';
    position: absolute;
    left: 27px; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, ${A}, rgba(77,191,168,0.08));
  }

  .hiw-step {
    display: flex;
    gap: 32px;
    margin-bottom: 48px;
    position: relative;
  }
  .hiw-step:last-child { margin-bottom: 0; }

  .hiw-step-num {
    width: 56px; height: 56px; min-width: 56px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 2px solid ${A};
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono);
    font-size: 0.88rem;
    font-weight: 700;
    color: ${A};
    position: relative; z-index: 1;
    box-shadow: 0 0 20px rgba(77,191,168,0.14);
  }
  .hiw-step-body { flex: 1; padding-top: 10px; }
  .hiw-step-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }
  .hiw-step-title {
    font-family: var(--font-headline);
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text-primary);
  }
  .hiw-day-badge {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: ${A};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    background: rgba(77,191,168,0.09);
    border: 1px solid rgba(77,191,168,0.18);
  }
  .hiw-price-badge {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: #E8B84D;
    letter-spacing: 0.05em;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    background: rgba(232,184,77,0.08);
    border: 1px solid rgba(232,184,77,0.14);
  }
  .hiw-step-desc {
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.65;
    color: var(--text-secondary);
    margin: 0 0 16px;
  }
  .hiw-step-items {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 20px;
  }
  .hiw-step-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: var(--font-body);
    font-size: 0.84rem;
    color: var(--text-secondary);
  }
  .hiw-step-item::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: ${A};
    flex-shrink: 0;
  }
  .hiw-step-note {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-left: 3px solid ${A};
    border-radius: var(--radius-md);
    padding: 14px 20px;
    margin-top: 16px;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: ${A};
    line-height: 1.55;
  }

  /* ── Rhythm ── */
  .hiw-rhythm { padding: 100px 0; background: var(--bg-2); }
  .hiw-rhythm-header { text-align: center; margin-bottom: 60px; }
  .hiw-rhythm-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  @media (max-width: 1024px) { .hiw-rhythm-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px) { .hiw-rhythm-grid { grid-template-columns: 1fr; } }

  .hiw-rhythm-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px;
    transition: all 0.4s var(--ease);
    box-shadow: var(--card-shadow);
  }
  .hiw-rhythm-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--card-hover-shadow);
    border-color: var(--border-hover);
  }
  .hiw-rhythm-freq {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 12px;
    padding: 3px 10px;
    border-radius: var(--radius-full);
    background: rgba(77,191,168,0.08);
    border: 1px solid rgba(77,191,168,0.16);
    display: inline-block;
  }
  .hiw-rhythm-title {
    font-family: var(--font-headline);
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 14px;
    letter-spacing: -0.01em;
  }
  .hiw-rhythm-note {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-bottom: 12px;
  }
  .hiw-rhythm-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 8px;
  }
  .hiw-rhythm-list li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-family: var(--font-body);
    font-size: 0.84rem;
    line-height: 1.55;
    color: var(--text-secondary);
  }
  .hiw-rhythm-list li::before {
    content: '';
    width: 5px; height: 5px;
    min-width: 5px;
    border-radius: 50%;
    background: ${A};
    margin-top: 7px;
    flex-shrink: 0;
  }

  /* ── CTA ── */
  .hiw-cta { padding: 100px 0; background: var(--bg); text-align: center; position: relative; overflow: hidden; }
  .hiw-cta-orb {
    position: absolute;
    width: 700px; height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(77,191,168,0.07) 0%, transparent 65%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .hiw-cta-inner { position: relative; z-index: 1; }
  .hiw-cta-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--text-primary);
    margin: 0 0 16px;
  }
  .hiw-cta-sub {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.65;
    color: var(--text-secondary);
    max-width: 480px;
    margin: 0 auto 36px;
  }
  .hiw-cta-note {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-top: 20px;
    letter-spacing: 0.02em;
  }
  .sec-body-sub {
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.65;
    max-width: 520px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .hiw-hero { padding: 120px 0 80px; }
    .hiw-paths, .hiw-timeline-sec, .hiw-rhythm, .hiw-cta { padding: 80px 0; }
    .hiw-timeline-body::before { left: 21px; }
    .hiw-step-num { width: 44px; height: 44px; min-width: 44px; font-size: 0.8rem; }
    .hiw-step { gap: 20px; }
  }
`;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
};

const STEPS = [
  {
    n: '01', title: 'Discovery Call', day: 'Day 0', price: null,
    desc: "A free 30-minute call with a Services engineer. No sales script — just an honest conversation about your software, who maintains it now, and what's keeping you up at night.",
    items: ['Walk through your stack', 'Identify immediate risk areas', 'Discuss the right plan', 'Answer every question you have'],
    note: null,
  },
  {
    n: '02', title: 'Codebase Audit', day: 'Days 1–2', price: '$399 — credited to your plan',
    desc: 'We request read access to your repository, hosting, and infrastructure. Our engineers review every layer of your software — not just the surface. Nothing is off-limits.',
    items: ['Architecture & code quality', 'Security vulnerabilities & exposed secrets', 'Database schema & query performance', 'Hosting configuration & cost', 'Dependency freshness & known CVEs', 'Existing documentation quality'],
    note: 'The $399 audit fee is credited in full toward your first month on any plan.',
  },
  {
    n: '03', title: 'Audit Report', day: 'Days 2–3', price: null,
    desc: 'You receive a written report and a recorded video walkthrough. Honest findings — not a sales pitch. Every issue is categorised by severity: critical, moderate, or low. We recommend a plan, but you choose.',
    items: ['Severity-graded issue list', 'Video walkthrough of findings', 'Plan recommendation with clear reasoning', 'No pressure, no upsell'],
    note: null,
  },
  {
    n: '04', title: 'Monitoring Setup', day: 'Days 3–4', price: null,
    desc: 'We configure your monitoring stack while you review the audit. This runs in parallel with critical fixes so nothing is waiting on anything else.',
    items: ['Uptime checks (30s interval, 5 global locations)', 'Error rate & exception tracking', 'Performance & response time monitoring', 'Database query performance', 'Security event detection', 'Custom alert thresholds you approve'],
    note: null,
  },
  {
    n: '05', title: 'Critical Fixes', day: 'Days 3–4 (parallel)', price: null,
    desc: "Anything marked critical in the audit gets fixed immediately — without waiting for the plan to start. Exposed API keys, broken auth, SQL injection risks. All included in the audit fee.",
    items: ['All critical-severity issues resolved', 'Changes reviewed before deployment', 'No production surprises', 'Every fix documented'],
    note: 'Critical fixes are included in the $399 audit fee. No extra charge.',
  },
  {
    n: '06', title: 'Documentation', day: 'Days 4–5', price: null,
    desc: 'If your software has no documentation — or outdated documentation — we create it. Goal: any qualified engineer should be able to understand your system from cold.',
    items: ['Architecture map', 'Dependency list & current versions', 'Environment variables documented', 'Deployment process written out'],
    note: null,
  },
  {
    n: '07', title: 'Active Protection Begins', day: 'Day 5', price: null,
    desc: "Monitoring is live. Your Slack channel (or email thread) is open. Your plan starts, minus the credited audit fee. From here, we're watching and you know exactly who to contact.",
    items: ['Monitoring active across all configured checks', 'First monthly report scheduled', 'Your dedicated contact confirmed', 'Emergency escalation path documented'],
    note: null,
  },
];

const RHYTHM = [
  {
    freq: 'Monthly',
    title: 'Security & Performance Review',
    note: null,
    items: [
      'Full dependency audit — every package, every version',
      'Security scan for new vulnerabilities',
      'Performance review vs previous month',
      'Written report with findings and actions taken',
    ]
  },
  {
    freq: 'Weekly',
    title: 'Maintenance Cycle',
    note: 'Growth & Scale plans',
    items: [
      'Security patch review & deployment',
      'Monitoring alert review',
      'Async update or brief call',
      'Dedicated Slack review (Scale)',
    ]
  },
  {
    freq: 'Daily',
    title: 'Automated Checks',
    note: null,
    items: [
      'Uptime from 5 global locations every 30 seconds',
      'Error rate trending & anomaly detection',
      'Database performance monitoring',
      'Alert response within your plan SLA',
    ]
  },
  {
    freq: 'As Needed',
    title: 'On-Demand Work',
    note: null,
    items: [
      "Bug fixes — within your plan's response SLA",
      'Feature hours (Growth & Scale plans)',
      'Incident response & postmortems',
      'Critical security patches for new CVEs',
    ]
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="hiw-hero">
        <div className="hiw-hero-orb-a" aria-hidden="true" />
        <div className="hiw-hero-orb-b" aria-hidden="true" />
        <div className="hiw-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="hiw-mono-label">HOW IT WORKS</div>
          </motion.div>

          <motion.h1
            className="hiw-h1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            From First Contact to{' '}
            <span className="hiw-grad">Full Protection in 5 Days.</span>
          </motion.h1>

          <motion.p
            className="hiw-hero-sub"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            It doesn&apos;t matter what your software is built on, who built it, or how long it&apos;s
            been running. If it&apos;s in production and people depend on it, we can protect it.
          </motion.p>

          <motion.div
            className="hiw-btn-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
          >
            <Link href="/services/get-protected" className="hiw-btn-primary">
              Get Protected
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/services/plans" className="hiw-btn-ghost">
              See Plans &amp; Pricing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Two Paths ── */}
      <section className="hiw-paths">
        <div className="hiw-wrap">
          <motion.div
            className="hiw-paths-header"
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="hiw-sec-label" style={{ justifyContent: 'center' }}>YOUR STARTING POINT</div>
            <h2 className="hiw-h2">Two ways in. Same destination.</h2>
            <p className="hiw-paths-sub">
              Whether your software was built by us or by someone else, we can take it on.
              The path to full protection is slightly different depending on where you&apos;re starting.
            </p>
          </motion.div>

          <div className="hiw-paths-grid">
            <motion.div
              className="hiw-path-card"
              variants={fadeUp} initial="hidden" whileInView="visible" custom={0}
              viewport={{ once: true, amount: 0.15 }}
            >
              <div className="hiw-path-badge hiw-badge-a">PATH A</div>
              <div className="hiw-path-icon hiw-icon-a">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B8CD4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="hiw-path-title">Built by SocioFi Studio</h3>
              <p className="hiw-path-desc">
                If your product was built or launched by SocioFi Studio, the handover to Services is
                seamless. We already know your codebase, your infrastructure, and your deployment process.
                Monitoring goes live the same day your project ships — no separate audit needed.
              </p>
              <div className="hiw-path-tags">
                <span className="hiw-tag">No audit needed</span>
                <span className="hiw-tag">Same-day monitoring</span>
                <span className="hiw-tag">Automatic handover</span>
                <span className="hiw-tag">Zero onboarding friction</span>
              </div>
              <Link href="/services/plans" className="hiw-path-cta" style={{ color: '#6B8CD4' }}>
                Browse plans
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </motion.div>

            <motion.div
              className="hiw-path-card hiw-path-featured"
              variants={fadeUp} initial="hidden" whileInView="visible" custom={0.08}
              viewport={{ once: true, amount: 0.15 }}
            >
              <div className="hiw-path-badge hiw-badge-b">PATH B</div>
              <div className="hiw-path-icon hiw-icon-b">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h3 className="hiw-path-title">Built by someone else</h3>
              <p className="hiw-path-desc">
                Agency, freelancer, previous in-house team, or an AI-assisted build — doesn&apos;t matter.
                We start with a thorough 5-day audit and onboarding to understand your software from the ground up.
                Then monitoring goes live and we take on ongoing maintenance.
              </p>
              <div className="hiw-path-tags">
                <span className="hiw-tag">5-day onboarding</span>
                <span className="hiw-tag">Codebase audit $399</span>
                <span className="hiw-tag">Critical fixes included</span>
                <span className="hiw-tag">Documentation created</span>
              </div>
              <Link href="/services/audit" className="hiw-path-cta">
                Start with an audit
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 7-Step Timeline ── */}
      <section className="hiw-timeline-sec">
        <div className="hiw-wrap">
          <motion.div
            className="hiw-timeline-header"
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="hiw-sec-label" style={{ justifyContent: 'center' }}>THE ONBOARDING PROCESS</div>
            <h2 className="hiw-h2">7 steps. 5 days. You&apos;re protected.</h2>
            <p className="sec-body-sub">
              For software we didn&apos;t build. Every step is intentional — nothing is rushed, nothing is skipped.
            </p>
          </motion.div>

          <div className="hiw-timeline-body">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                className="hiw-step"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i * 0.07}
                viewport={{ once: true, amount: 0.1 }}
              >
                <div className="hiw-step-num">{step.n}</div>
                <div className="hiw-step-body">
                  <div className="hiw-step-meta">
                    <span className="hiw-step-title">{step.title}</span>
                    <span className="hiw-day-badge">{step.day}</span>
                    {step.price && <span className="hiw-price-badge">{step.price}</span>}
                  </div>
                  <p className="hiw-step-desc">{step.desc}</p>
                  <div className="hiw-step-items">
                    {step.items.map((item) => (
                      <span key={item} className="hiw-step-item">{item}</span>
                    ))}
                  </div>
                  {step.note && (
                    <div className="hiw-step-note">{step.note}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ongoing Rhythm ── */}
      <section className="hiw-rhythm">
        <div className="hiw-wrap">
          <motion.div
            className="hiw-rhythm-header"
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="hiw-sec-label" style={{ justifyContent: 'center' }}>ONGOING PROTECTION</div>
            <h2 className="hiw-h2">What happens after day 5.</h2>
            <p className="sec-body-sub">
              Protection isn&apos;t a one-time setup. Here&apos;s the rhythm that keeps your software
              stable and your customers unaffected.
            </p>
          </motion.div>

          <div className="hiw-rhythm-grid">
            {RHYTHM.map((item, i) => (
              <motion.div
                key={item.freq}
                className="hiw-rhythm-card"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i * 0.08}
                viewport={{ once: true, amount: 0.15 }}
              >
                <div className="hiw-rhythm-freq">{item.freq}</div>
                <h3 className="hiw-rhythm-title">{item.title}</h3>
                {item.note && <p className="hiw-rhythm-note">{item.note}</p>}
                <ul className="hiw-rhythm-list">
                  {item.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hiw-cta">
        <div className="hiw-cta-orb" aria-hidden="true" />
        <div className="hiw-wrap hiw-cta-inner">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="hiw-mono-label">READY TO START</div>
            <h2 className="hiw-cta-h2">Your software deserves a watchful eye.</h2>
            <p className="hiw-cta-sub">
              Pick the right plan for your stage, or start with a codebase audit if you&apos;re not sure.
              Either way, you&apos;ll know exactly where you stand within 48 hours.
            </p>
            <div className="hiw-btn-row">
              <Link href="/services/get-protected" className="hiw-btn-primary">
                Get Protected
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/services/audit" className="hiw-btn-ghost">
                Start with the audit
              </Link>
            </div>
            <p className="hiw-cta-note">Month-to-month. No contracts. Cancel any time.</p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
