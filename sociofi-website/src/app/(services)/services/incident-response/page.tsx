'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#4DBFA8';

const STYLES = `
  .svc-ir-page {
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body);
  }

  /* ── Hero ── */
  .svc-ir-hero {
    padding: 160px 32px 100px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .svc-ir-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 700px 500px at 50% 0%, rgba(77,191,168,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 400px 300px at 15% 75%, rgba(58,88,158,0.05) 0%, transparent 60%);
    pointer-events: none;
  }
  .svc-ir-label {
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
  .svc-ir-label::before,
  .svc-ir-label::after {
    content: '';
    width: 24px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .svc-ir-label.left-align {
    justify-content: flex-start;
  }
  .svc-ir-label.left-align::after { display: none; }
  .svc-ir-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary);
    margin-bottom: 24px;
    max-width: 920px;
    margin-left: auto;
    margin-right: auto;
  }
  .svc-ir-subtitle {
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto 48px;
  }
  .svc-ir-hero-btns {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .svc-ir-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: linear-gradient(135deg, var(--navy) 0%, ${A} 100%);
    color: #fff;
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 100px;
    text-decoration: none;
    box-shadow: 0 4px 24px rgba(77,191,168,0.3);
    transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
  }
  .svc-ir-btn-primary:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(77,191,168,0.45);
  }
  .svc-ir-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: transparent;
    color: var(--text-primary);
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 100px;
    border: 1.5px solid var(--border);
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
  }
  .svc-ir-btn-ghost:hover {
    border-color: ${A};
    color: ${A};
  }

  /* ── Sections ── */
  .svc-ir-section {
    padding: 100px 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .svc-ir-section-alt {
    background: var(--bg-2);
    padding: 100px 32px;
  }
  .svc-ir-section-alt-inner {
    max-width: 1200px;
    margin: 0 auto;
  }
  .svc-ir-section-header { margin-bottom: 56px; }
  .svc-ir-section-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--text-primary);
    margin-bottom: 16px;
  }
  .svc-ir-section-desc {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 560px;
  }

  /* ── 10-Step Process ── */
  .svc-ir-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
  }
  .svc-ir-steps::before {
    content: '';
    position: absolute;
    left: 28px;
    top: 0;
    bottom: 0;
    width: 1.5px;
    background: linear-gradient(180deg, ${A} 0%, rgba(77,191,168,0.1) 100%);
  }
  .svc-ir-step {
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: 24px;
    padding: 0 0 32px 0;
    position: relative;
  }
  .svc-ir-step:last-child { padding-bottom: 0; }
  .svc-ir-step-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }
  .svc-ir-step-circle {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 1.5px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-muted);
    transition: border-color 0.4s, color 0.4s, background 0.4s;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
  .svc-ir-step.active .svc-ir-step-circle {
    background: ${A};
    border-color: ${A};
    color: #fff;
    box-shadow: 0 0 0 4px rgba(77,191,168,0.15);
  }
  .svc-ir-step-content {
    padding-top: 12px;
    padding-bottom: 8px;
  }
  .svc-ir-step-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 8px;
  }
  .svc-ir-step-name {
    font-family: var(--font-headline);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .svc-ir-step-timing {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: ${A};
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .svc-ir-step-desc {
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 680px;
  }
  .svc-ir-step-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
  }

  /* Mobile step layout */
  @media (max-width: 640px) {
    .svc-ir-steps::before { left: 20px; }
    .svc-ir-step { grid-template-columns: 40px 1fr; gap: 16px; }
    .svc-ir-step-circle { width: 40px; height: 40px; font-size: 0.65rem; }
  }

  /* ── CTO Quote ── */
  .svc-ir-quote-wrap {
    margin: 56px 0 0;
    padding: 32px 40px;
    background: rgba(77,191,168,0.05);
    border: 1px solid rgba(77,191,168,0.15);
    border-radius: var(--radius-lg);
    position: relative;
  }
  .svc-ir-quote-wrap::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px;
    height: 100%;
    background: ${A};
    border-radius: 100px 0 0 100px;
  }
  .svc-ir-quote-text {
    font-family: var(--font-headline);
    font-size: 1.05rem;
    font-weight: 500;
    line-height: 1.6;
    color: var(--text-primary);
    font-style: italic;
    margin-bottom: 16px;
  }
  .svc-ir-quote-attr {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }
  .svc-ir-quote-attr span { color: ${A}; }

  /* ── Response Table (reused from SLA) ── */
  .svc-ir-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .svc-ir-table thead tr { background: var(--bg-card); }
  .svc-ir-table th {
    padding: 18px 24px;
    text-align: left;
    font-family: var(--font-headline);
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border);
  }
  .svc-ir-table th:first-child {
    width: 80px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    font-weight: 400;
  }
  .svc-ir-table td {
    padding: 16px 24px;
    font-size: 0.88rem;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border);
    line-height: 1.5;
    vertical-align: top;
  }
  .svc-ir-table tr:last-child td { border-bottom: none; }
  .svc-ir-table .priority-cell {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
  }
  .svc-ir-table .p1 { color: #ef4444; }
  .svc-ir-table .p2 { color: #f97316; }
  .svc-ir-table .p3 { color: #eab308; }
  .svc-ir-table .p4 { color: var(--text-muted); }
  .svc-ir-table .priority-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .svc-ir-table .p1 .priority-dot { background: #ef4444; }
  .svc-ir-table .p2 .priority-dot { background: #f97316; }
  .svc-ir-table .p3 .priority-dot { background: #eab308; }
  .svc-ir-table .p4 .priority-dot { background: var(--text-muted); }
  .svc-ir-table .desc-cell { color: var(--text-muted); font-size: 0.82rem; }
  .svc-ir-table .growth-cell { color: ${A}; font-weight: 500; }
  .svc-ir-table .scale-cell { color: var(--text-primary); font-weight: 500; }
  @media (max-width: 768px) {
    .svc-ir-table { font-size: 0.8rem; }
    .svc-ir-table th, .svc-ir-table td { padding: 12px 14px; }
    .svc-ir-table .desc-cell { display: none; }
  }

  /* ── Real Incident Example ── */
  .svc-ir-example {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  .svc-ir-example-header {
    padding: 28px 36px;
    border-bottom: 1px solid var(--border);
    background: rgba(77,191,168,0.03);
  }
  .svc-ir-example-label {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${A};
    margin-bottom: 8px;
  }
  .svc-ir-example-title {
    font-family: var(--font-headline);
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    margin-bottom: 8px;
  }
  .svc-ir-example-context {
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }
  .svc-ir-timeline {
    padding: 28px 36px;
  }
  .svc-ir-tl-title {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-bottom: 20px;
  }
  .svc-ir-tl-items {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
  }
  .svc-ir-tl-items::before {
    content: '';
    position: absolute;
    left: 56px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--border);
  }
  .svc-ir-tl-item {
    display: grid;
    grid-template-columns: 56px 24px 1fr;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
  }
  .svc-ir-tl-time {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: ${A};
    letter-spacing: 0.04em;
    text-align: right;
    flex-shrink: 0;
  }
  .svc-ir-tl-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${A};
    margin: 0 auto;
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }
  .svc-ir-tl-dot.resolved {
    background: #22d484;
    box-shadow: 0 0 0 3px rgba(34,212,132,0.2);
  }
  .svc-ir-tl-text {
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }
  .svc-ir-tl-text strong {
    color: var(--text-primary);
    font-family: var(--font-headline);
    font-weight: 600;
  }
  .svc-ir-example-result {
    padding: 24px 36px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(34,212,132,0.03);
  }
  .svc-ir-result-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #22d484;
    flex-shrink: 0;
    animation: svcPulse 2s ease-in-out infinite;
  }
  .svc-ir-result-text {
    font-family: var(--font-headline);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  .svc-ir-result-sub {
    font-size: 0.82rem;
    color: var(--text-muted);
    margin-top: 2px;
  }

  /* ── CTA ── */
  .svc-ir-cta {
    padding: 100px 32px;
    text-align: center;
    position: relative;
    overflow: hidden;
    background: var(--bg-2);
  }
  .svc-ir-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 800px 400px at 50% 50%, rgba(77,191,168,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .svc-ir-cta-inner { position: relative; max-width: 700px; margin: 0 auto; }
  .svc-ir-cta h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3.5vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: var(--text-primary);
    margin-bottom: 16px;
  }
  .svc-ir-cta p {
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 40px;
  }
  .svc-ir-cta-btns {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  @keyframes svcPulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.15); }
  }
`;

const STEPS = [
  {
    num: '01',
    name: 'Detect',
    timing: '< 30 seconds',
    desc: 'Monitoring checks fire every 30 seconds from 5 global locations. The moment a threshold is breached — uptime, error rate, response time, security event — a potential incident is flagged and recorded. This happens without any human in the loop.',
    tag: 'Automated',
  },
  {
    num: '02',
    name: 'Classify',
    timing: '< 60 seconds',
    desc: 'The automated system applies classification rules to determine priority. P1 means service is down or data is at risk. P2 means major degradation. P3 is significant but a workaround exists. P4 is minor. Severity directly determines the speed of everything that follows.',
    tag: 'Automated + On-call review',
  },
  {
    num: '03',
    name: 'Alert',
    timing: 'Immediate on P1/P2',
    desc: "P1 and P2 incidents trigger simultaneous Slack notification, SMS to on-call mobile, and email to the incident channel. You receive the same alert we do at the same time — there's no 'internal first, client later' delay.",
    tag: 'You + On-call engineer notified',
  },
  {
    num: '04',
    name: 'Acknowledge',
    timing: 'Within SLA window',
    desc: "The on-call engineer confirms the incident is being actively worked. You receive a second notification with the engineer's name and an initial assessment. This is the point where your SLA response time clock stops — not when the fix is deployed.",
    tag: 'Engineer assigned',
  },
  {
    num: '05',
    name: 'Investigate',
    timing: 'Variable — typically < 10 min',
    desc: 'Root cause analysis begins. Because our team already knows your codebase, infrastructure, and recent change history, investigation is significantly faster than for someone seeing the system for the first time. We check recent deployments, database changes, and traffic patterns first.',
    tag: 'Active investigation',
  },
  {
    num: '06',
    name: 'Communicate',
    timing: 'Continuous throughout',
    desc: 'Plain-English updates to you at every stage change: we know what it is, we know how to fix it, fix is in staging, fix is deploying, monitoring recovery. No silence. No "still looking." The team that communicates worst during incidents is the one clients leave.',
    tag: 'You receive updates at every stage',
  },
  {
    num: '07',
    name: 'Fix',
    timing: 'Variable — hours, not days',
    desc: 'The code, configuration, database, or infrastructure fix is implemented in a staging environment first. Even under pressure, we do not skip testing. Some fixes are applied in minutes. Complex root causes can take hours. We communicate timeline estimates honestly.',
    tag: 'Staging fix implemented',
  },
  {
    num: '08',
    name: 'Test',
    timing: 'Before every production deploy',
    desc: 'The fix is verified in staging against the conditions that caused the incident. For P1/P2 events, a second engineer reviews the fix before it ships. We verify the error condition is resolved, not just that the service starts.',
    tag: 'Second-engineer review on P1/P2',
  },
  {
    num: '09',
    name: 'Deploy & Verify',
    timing: '30-min monitoring window',
    desc: 'The fix is deployed to production. We open a 30-minute active monitoring window — watching all 8 monitoring layers for any sign of recurrence or unexpected side effects. The incident is not closed until monitoring is clean for 30 consecutive minutes.',
    tag: 'Active post-deploy watch',
  },
  {
    num: '10',
    name: 'Postmortem',
    timing: 'Within 48 hours (P1/P2 only)',
    desc: "For P1 and P2 incidents, we write a postmortem: what happened, root cause, how we responded, what we're changing to prevent recurrence. You receive this as a document within 48 hours. This is how we get better — and how you stay informed.",
    tag: 'You receive full written report',
  },
];

const RESPONSE_ROWS = [
  {
    priority: 'P1', desc: 'Service down, data at risk', essential: '<8 hrs (business hours)', growth: '<4 hrs (business hours)', scale: '<15 min (24/7)',
  },
  {
    priority: 'P2', desc: 'Major feature broken, significant degradation', essential: '<8 hrs (business hours)', growth: '<4 hrs (business hours)', scale: '<1 hr (24/7)',
  },
  {
    priority: 'P3', desc: 'Minor bug, workaround available', essential: 'Next business day', growth: '<8 hrs (business hours)', scale: '<4 hrs (business hours)',
  },
  {
    priority: 'P4', desc: 'Cosmetic issue, minor UX problem', essential: 'Next maintenance window', growth: 'Next business day', scale: 'Next business day',
  },
];

const TIMELINE_ITEMS = [
  { time: '0:00', label: 'Detection', text: 'Database connection pool saturation detected — 98% of connections exhausted.', resolved: false },
  { time: '0:00:30', label: 'Alert', text: 'P2 alert fired. On-call engineer and client notified simultaneously.', resolved: false },
  { time: '0:02', label: 'Acknowledge', text: 'Engineer acknowledged. Initial diagnosis: connection leak in background job processor.', resolved: false },
  { time: '0:08', label: 'Root cause', text: 'Confirmed: a connection opened inside a retry loop without guaranteed close on failure.', resolved: false },
  { time: '0:12', label: 'Fix staged', text: 'Fix deployed to staging. Connection pool behavior verified under simulated load.', resolved: false },
  { time: '0:15', label: 'Production deploy', text: 'Fix deployed. Connection pool immediately began recovering — 43% → 12% utilization.', resolved: false },
  { time: '0:16', label: 'Normal', text: 'All requests processing normally. Response times back to baseline.', resolved: false },
  { time: '0:45', label: 'Monitoring complete', text: '30-min clean monitoring window completed. Incident closed.', resolved: true },
];

export default function IncidentResponsePage() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const exampleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const stepsInView = useInView(stepsRef, { once: true, amount: 0.05 });
  const tableInView = useInView(tableRef, { once: true, amount: 0.1 });
  const exampleInView = useInView(exampleRef, { once: true, amount: 0.1 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.1 });

  return (
    <main className="svc-ir-page">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="svc-ir-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="svc-ir-label">Incident Response</div>
          <h1 className="svc-ir-h1">
            When Something Breaks,<br />Here's Exactly What Happens.
          </h1>
          <p className="svc-ir-subtitle">
            Detection in seconds. Human acknowledgment within SLA. Resolution in hours, not days.
            A 10-step process that runs every time, without exception.
          </p>
          <div className="svc-ir-hero-btns">
            <Link href="/services/get-protected" className="svc-ir-btn-primary">
              Get Protected
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/services/sla" className="svc-ir-btn-ghost">
              See SLA Guarantees
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── 10-STEP PROCESS ── */}
      <section className="svc-ir-section" ref={stepsRef}>
        <div className="svc-ir-section-header">
          <div className="svc-ir-label left-align">The Process</div>
          <h2 className="svc-ir-section-h2">10 steps. Every incident, every time.</h2>
          <p className="svc-ir-section-desc">
            This is not a marketing document. This is the actual process our engineers follow.
            Every step has a clear owner, a timing expectation, and a defined output.
          </p>
        </div>
        <div className="svc-ir-steps">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              className={`svc-ir-step${stepsInView ? ' active' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={stepsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="svc-ir-step-node">
                <div className={`svc-ir-step-circle${stepsInView ? ' active' : ''}`}
                  style={stepsInView ? { transitionDelay: `${i * 0.06}s` } : {}}>
                  {step.num}
                </div>
              </div>
              <div className="svc-ir-step-content">
                <div className="svc-ir-step-header">
                  <span className="svc-ir-step-name">{step.name}</span>
                  <span className="svc-ir-step-timing">{step.timing}</span>
                </div>
                <div className="svc-ir-step-desc">{step.desc}</div>
                <div className="svc-ir-step-tag">
                  <span>↳</span>
                  {step.tag}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTO Quote */}
        <motion.div
          className="svc-ir-quote-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={stepsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="svc-ir-quote-text">
            "The most important thing during an incident is not the fix — it's the communication. A client who
            knows what's happening and what we're doing about it can handle a 2-hour outage. A client who gets
            silence for 20 minutes cannot."
          </div>
          <div className="svc-ir-quote-attr">
            <span>Kamrul Hasan</span>
            <span style={{ color: 'var(--text-muted)' }}>—</span>
            CTO, SocioFi Technology
          </div>
        </motion.div>
      </section>

      {/* ── RESPONSE TIME TABLE ── */}
      <section className="svc-ir-section-alt" ref={tableRef}>
        <div className="svc-ir-section-alt-inner">
          <div className="svc-ir-section-header">
            <div className="svc-ir-label left-align">Response Time Guarantees</div>
            <h2 className="svc-ir-section-h2">How fast we respond, by priority and plan.</h2>
            <p className="svc-ir-section-desc">
              Response time is from incident creation to first meaningful human response.
              Automated notifications don't count.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <table className="svc-ir-table" aria-label="Incident response SLA by priority and plan">
              <thead>
                <tr>
                  <th scope="col">Priority</th>
                  <th scope="col">Description</th>
                  <th scope="col">Essential</th>
                  <th scope="col">Growth</th>
                  <th scope="col">Scale</th>
                </tr>
              </thead>
              <tbody>
                {RESPONSE_ROWS.map((row) => (
                  <tr key={row.priority}>
                    <td>
                      <span className={`priority-cell ${row.priority.toLowerCase()}`}>
                        <span className="priority-dot" aria-hidden="true" />
                        {row.priority}
                      </span>
                    </td>
                    <td className="desc-cell">{row.desc}</td>
                    <td>{row.essential}</td>
                    <td className="growth-cell">{row.growth}</td>
                    <td className="scale-cell">{row.scale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── REAL INCIDENT EXAMPLE ── */}
      <section className="svc-ir-section" ref={exampleRef}>
        <div className="svc-ir-section-header">
          <div className="svc-ir-label left-align">Real Example</div>
          <h2 className="svc-ir-section-h2">What incident response looks like in practice.</h2>
          <p className="svc-ir-section-desc">
            Anonymized from a real incident, with identifying details changed.
            This is a typical P2 resolution on the Growth plan.
          </p>
        </div>
        <motion.div
          className="svc-ir-example"
          initial={{ opacity: 0, y: 24 }}
          animate={exampleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="svc-ir-example-header">
            <div className="svc-ir-example-label">Incident · Growth Plan · P2</div>
            <div className="svc-ir-example-title">Database connection pool exhausted during traffic spike</div>
            <div className="svc-ir-example-context">
              A Growth plan client's application began returning slow responses and occasional 503 errors
              during their morning peak traffic window. The root cause was a connection leak in a background
              job that had been introduced in a release 3 days earlier.
            </div>
          </div>
          <div className="svc-ir-timeline">
            <div className="svc-ir-tl-title">Resolution timeline</div>
            <div className="svc-ir-tl-items">
              {TIMELINE_ITEMS.map((item, i) => (
                <div key={i} className="svc-ir-tl-item">
                  <div className="svc-ir-tl-time">{item.time}</div>
                  <div className={`svc-ir-tl-dot${item.resolved ? ' resolved' : ''}`} aria-hidden="true" />
                  <div className="svc-ir-tl-text">
                    <strong>{item.label} — </strong>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="svc-ir-example-result">
            <div className="svc-ir-result-dot" aria-hidden="true" />
            <div>
              <div className="svc-ir-result-text">Total impact: 16 minutes of degraded performance. Zero data loss. Zero downtime.</div>
              <div className="svc-ir-result-sub">Postmortem delivered within 48 hours. Connection pool monitoring threshold added to prevent recurrence.</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="svc-ir-cta" ref={ctaRef}>
        <motion.div
          className="svc-ir-cta-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="svc-ir-label">Be Prepared</div>
          <h2>Your software will have an incident eventually. The question is who's watching when it does.</h2>
          <p>
            Every production application breaks at some point. The difference between a crisis and
            a footnote is whether someone is watching at 3am and knows what to do.
          </p>
          <div className="svc-ir-cta-btns">
            <Link href="/services/get-protected" className="svc-ir-btn-primary">
              Get Protected
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/services/plans" className="svc-ir-btn-ghost">
              See Plans
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
