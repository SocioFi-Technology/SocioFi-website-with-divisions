'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#4DBFA8';

const STYLES = `
  .svc-sla-page {
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body);
  }

  /* ── Hero ── */
  .svc-sla-hero {
    padding: 160px 32px 100px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .svc-sla-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 700px 500px at 50% 0%, rgba(77,191,168,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 350px 280px at 85% 60%, rgba(58,88,158,0.05) 0%, transparent 60%);
    pointer-events: none;
  }
  .svc-sla-label {
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
  .svc-sla-label::before,
  .svc-sla-label::after {
    content: '';
    width: 24px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .svc-sla-label.left-align {
    justify-content: flex-start;
  }
  .svc-sla-label.left-align::after { display: none; }
  .svc-sla-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary);
    margin-bottom: 24px;
    max-width: 860px;
    margin-left: auto;
    margin-right: auto;
  }
  .svc-sla-subtitle {
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 580px;
    margin: 0 auto 48px;
  }
  .svc-sla-hero-btn {
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
  .svc-sla-hero-btn:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(77,191,168,0.45);
  }

  /* ── Sections ── */
  .svc-sla-section {
    padding: 100px 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .svc-sla-section-alt {
    background: var(--bg-2);
    padding: 100px 32px;
  }
  .svc-sla-section-alt-inner {
    max-width: 1200px;
    margin: 0 auto;
  }
  .svc-sla-section-header { margin-bottom: 48px; }
  .svc-sla-section-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--text-primary);
    margin-bottom: 16px;
  }
  .svc-sla-section-desc {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 560px;
  }

  /* ── Response Time Table ── */
  .svc-sla-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .svc-sla-table thead tr { background: var(--bg-card); }
  .svc-sla-table th {
    padding: 18px 24px;
    text-align: left;
    font-family: var(--font-headline);
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border);
  }
  .svc-sla-table th:first-child {
    width: 80px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    font-weight: 400;
  }
  .svc-sla-table td {
    padding: 16px 24px;
    font-size: 0.88rem;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border);
    line-height: 1.5;
    vertical-align: top;
  }
  .svc-sla-table tr:last-child td { border-bottom: none; }
  .svc-sla-table .priority-cell {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
  }
  .svc-sla-table .p1 { color: #ef4444; }
  .svc-sla-table .p2 { color: #f97316; }
  .svc-sla-table .p3 { color: #eab308; }
  .svc-sla-table .p4 { color: var(--text-muted); }
  .svc-sla-table .priority-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .svc-sla-table .p1 .priority-dot { background: #ef4444; }
  .svc-sla-table .p2 .priority-dot { background: #f97316; }
  .svc-sla-table .p3 .priority-dot { background: #eab308; }
  .svc-sla-table .p4 .priority-dot { background: var(--text-muted); }
  .svc-sla-table .desc-cell { color: var(--text-muted); font-size: 0.82rem; }
  .svc-sla-table .essential-cell { color: var(--text-secondary); }
  .svc-sla-table .growth-cell { color: ${A}; font-weight: 500; }
  .svc-sla-table .scale-cell { color: var(--text-primary); font-weight: 500; }
  @media (max-width: 768px) {
    .svc-sla-table { font-size: 0.8rem; }
    .svc-sla-table th, .svc-sla-table td { padding: 12px 14px; }
    .svc-sla-table .desc-cell { display: none; }
  }

  /* ── Uptime Guarantees ── */
  .svc-sla-uptime-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 48px;
  }
  @media (max-width: 640px) { .svc-sla-uptime-grid { grid-template-columns: 1fr; } }
  .svc-sla-uptime-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 32px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .svc-sla-uptime-card.featured {
    border-color: rgba(77,191,168,0.3);
  }
  .svc-sla-uptime-card.featured::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--navy), ${A});
  }
  .svc-sla-uptime-plan {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-bottom: 12px;
  }
  .svc-sla-uptime-pct {
    font-family: var(--font-headline);
    font-size: 2.8rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  .svc-sla-uptime-card.featured .svc-sla-uptime-pct { color: ${A}; }
  .svc-sla-uptime-desc {
    font-size: 0.84rem;
    color: var(--text-muted);
    line-height: 1.55;
    margin-bottom: 20px;
  }
  .svc-sla-uptime-bar-track {
    height: 6px;
    background: rgba(255,255,255,0.05);
    border-radius: 100px;
    overflow: hidden;
  }
  .svc-sla-uptime-bar-fill {
    height: 100%;
    border-radius: 100px;
    background: linear-gradient(90deg, var(--navy), ${A});
  }
  .svc-sla-downtime-note {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-top: 10px;
    letter-spacing: 0.02em;
  }

  /* ── Miss SLA / Credits ── */
  .svc-sla-credits-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  @media (max-width: 768px) { .svc-sla-credits-grid { grid-template-columns: 1fr; } }
  .svc-sla-credit-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 32px;
    transition: border-color 0.3s, transform 0.3s var(--ease);
  }
  .svc-sla-credit-card:hover {
    border-color: rgba(77,191,168,0.2);
    transform: translateY(-4px);
  }
  .svc-sla-credit-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(77,191,168,0.08);
    border: 1px solid rgba(77,191,168,0.15);
    border-radius: var(--radius-sm);
    margin-bottom: 20px;
    color: ${A};
  }
  .svc-sla-credit-title {
    font-family: var(--font-headline);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 12px;
  }
  .svc-sla-credit-desc {
    font-size: 0.88rem;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  /* ── How We Measure ── */
  .svc-sla-measure-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 40px;
  }
  .svc-sla-measure-item {
    display: flex;
    gap: 20px;
    padding: 24px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    align-items: flex-start;
    transition: border-color 0.3s;
  }
  .svc-sla-measure-item:hover { border-color: rgba(77,191,168,0.2); }
  .svc-sla-measure-num {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${A};
    padding-top: 3px;
    flex-shrink: 0;
    width: 28px;
  }
  .svc-sla-measure-content {}
  .svc-sla-measure-title {
    font-family: var(--font-headline);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 6px;
  }
  .svc-sla-measure-desc {
    font-size: 0.88rem;
    line-height: 1.65;
    color: var(--text-secondary);
  }

  /* ── Exclusions ── */
  .svc-sla-exclusions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  @media (max-width: 640px) { .svc-sla-exclusions-grid { grid-template-columns: 1fr; } }
  .svc-sla-exclusion-item {
    display: flex;
    gap: 16px;
    padding: 20px 24px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    align-items: flex-start;
  }
  .svc-sla-exclusion-dash {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--text-muted);
    flex-shrink: 0;
    padding-top: 2px;
  }
  .svc-sla-exclusion-text {
    font-size: 0.88rem;
    line-height: 1.6;
    color: var(--text-secondary);
  }
  .svc-sla-exclusion-text strong {
    color: var(--text-primary);
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
    font-family: var(--font-headline);
    font-size: 0.9rem;
  }

  /* ── Reporting ── */
  .svc-sla-reporting-box {
    background: rgba(77,191,168,0.04);
    border: 1px solid rgba(77,191,168,0.15);
    border-radius: var(--radius-lg);
    padding: 40px 48px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
  }
  @media (max-width: 768px) {
    .svc-sla-reporting-box { grid-template-columns: 1fr; padding: 28px; }
  }
  .svc-sla-reporting-text h3 {
    font-family: var(--font-headline);
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin-bottom: 12px;
  }
  .svc-sla-reporting-text p {
    font-size: 0.92rem;
    line-height: 1.7;
    color: var(--text-secondary);
  }
  .svc-sla-reporting-stats {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .svc-sla-report-stat {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .svc-sla-report-stat-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22d484;
    animation: svcPulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  .svc-sla-report-stat-text {
    font-size: 0.88rem;
    color: var(--text-secondary);
  }
  .svc-sla-report-stat-text strong {
    color: var(--text-primary);
    font-weight: 600;
    font-family: var(--font-headline);
  }

  /* ── CTA ── */
  .svc-sla-cta {
    padding: 100px 32px;
    text-align: center;
    position: relative;
    overflow: hidden;
    background: var(--bg-2);
  }
  .svc-sla-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 800px 400px at 50% 50%, rgba(77,191,168,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .svc-sla-cta-inner { position: relative; max-width: 680px; margin: 0 auto; }
  .svc-sla-cta h2 {
    font-family: var(--font-headline);
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    color: var(--text-primary);
    margin-bottom: 16px;
  }
  .svc-sla-cta p {
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 40px;
  }
  .svc-sla-cta-btn {
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
  .svc-sla-cta-btn:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(77,191,168,0.45);
  }

  @keyframes svcPulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.15); }
  }
`;

const RESPONSE_ROWS = [
  {
    priority: 'P1',
    label: 'Critical',
    desc: 'Service down, data at risk, security breach',
    essential: '<8 hrs (business hours)',
    growth: '<4 hrs (business hours)',
    scale: '<15 min (24/7)',
  },
  {
    priority: 'P2',
    label: 'High',
    desc: 'Major feature broken, significant degradation',
    essential: '<8 hrs (business hours)',
    growth: '<4 hrs (business hours)',
    scale: '<1 hr (24/7)',
  },
  {
    priority: 'P3',
    label: 'Medium',
    desc: 'Minor bug, workaround available',
    essential: 'Next business day',
    growth: '<8 hrs (business hours)',
    scale: '<4 hrs (business hours)',
  },
  {
    priority: 'P4',
    label: 'Low',
    desc: 'Cosmetic issue, minor UX problem',
    essential: 'Next maintenance window',
    growth: 'Next business day',
    scale: 'Next business day',
  },
];

const UPTIME_TIERS = [
  { plan: 'Essential', pct: '99.5%', fill: 99.5, desc: 'Up to 43 hours downtime per year.', note: '43.8 hrs/year max', featured: false },
  { plan: 'Growth', pct: '99.9%', fill: 99.9, desc: 'Up to 8.7 hours downtime per year.', note: '8.7 hrs/year max', featured: true },
  { plan: 'Scale', pct: '99.95%', fill: 99.95, desc: 'Up to 4.4 hours downtime per year.', note: '4.4 hrs/year max', featured: false },
];

const CREDIT_CARDS = [
  {
    title: 'How credits are calculated',
    desc: 'On the Scale plan, a P1 SLA miss earns you 1 day of service credit for every hour we exceed the 15-minute response SLA. Credits are prorated based on your monthly plan cost. Credits apply to future invoices — not refunds.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    title: 'How to claim a credit',
    desc: 'Submit a credit request via your account dashboard or email your account manager within 30 days of the missed SLA. Include the incident ID from your monitoring dashboard. We review and apply within 5 business days.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    title: 'What counts as an SLA miss',
    desc: 'An SLA miss is recorded when our team exceeds the published first-response time for a confirmed incident, as measured from the time we created the incident in our system. Initial detection time is excluded.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    title: 'Credit limits',
    desc: "Credits are capped at 30 days of service per calendar month. SLA credits cannot be combined with other promotions or discounts. Credits don't carry over to new contract periods.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
  },
];

const MEASURE_ITEMS = [
  {
    num: '01',
    title: '30-second checks from 5 locations',
    desc: 'Uptime is measured via synthetic HTTP checks fired every 30 seconds from monitoring nodes in North America, Europe, Southeast Asia, East Asia, and Australia. Latency and response codes are recorded on every check.',
  },
  {
    num: '02',
    title: 'Two consecutive failures = downtime',
    desc: 'A single failed check does not count as downtime. Two consecutive failures from at least two monitoring locations must occur before an incident is opened. This eliminates false positives from transient network issues.',
  },
  {
    num: '03',
    title: 'Scheduled maintenance is excluded',
    desc: "Downtime during a maintenance window announced at least 48 hours in advance does not count against your uptime SLA. Maintenance windows are published in your dashboard. We work outside business hours whenever possible.",
  },
  {
    num: '04',
    title: "Downtime ends when we verify recovery",
    desc: "An incident is closed when 3 consecutive checks from all 5 locations return successful responses. We don't close incidents based on a single positive check — we confirm recovery is sustained before marking it resolved.",
  },
];

const EXCLUSIONS = [
  {
    title: 'Scheduled maintenance',
    desc: 'Announced at least 48 hours in advance via your dashboard and email. We schedule outside your peak traffic hours.',
  },
  {
    title: 'Force majeure',
    desc: 'Natural disasters, widespread internet outages, war, pandemic, or other events beyond reasonable control.',
  },
  {
    title: 'Client-caused issues',
    desc: 'Downtime resulting directly from changes made by the client to code, infrastructure, or configuration without our involvement.',
  },
  {
    title: 'Third-party service outages',
    desc: 'Outages caused by AWS, Stripe, Cloudflare, or other third-party services outside our control. We escalate and communicate, but cannot guarantee third-party SLAs.',
  },
  {
    title: 'Free or trial plans',
    desc: 'SLA guarantees apply to paid plans only. Free consultations and trial periods do not include uptime or response time commitments.',
  },
  {
    title: 'Billing disputes',
    desc: 'SLA credits are not available to accounts with overdue balances or accounts that have violated the terms of service.',
  },
];

export default function SLAPage() {
  const responseRef = useRef<HTMLDivElement>(null);
  const uptimeRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const exclusionsRef = useRef<HTMLDivElement>(null);
  const reportingRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const responseInView = useInView(responseRef, { once: true, amount: 0.1 });
  const uptimeInView = useInView(uptimeRef, { once: true, amount: 0.1 });
  const creditsInView = useInView(creditsRef, { once: true, amount: 0.1 });
  const measureInView = useInView(measureRef, { once: true, amount: 0.1 });
  const exclusionsInView = useInView(exclusionsRef, { once: true, amount: 0.1 });
  const reportingInView = useInView(reportingRef, { once: true, amount: 0.1 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.1 });

  return (
    <main className="svc-sla-page">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="svc-sla-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="svc-sla-label">SLA</div>
          <h1 className="svc-sla-h1">
            Our Commitments,<br />in Plain English.
          </h1>
          <p className="svc-sla-subtitle">
            Response times, uptime guarantees, and what happens if we miss a commitment.
            No fine print. No "subject to change." Clear obligations, clearly stated.
          </p>
          <Link href="/services/get-protected" className="svc-sla-hero-btn">
            Get the SLA you deserve
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </motion.div>
      </section>

      {/* ── RESPONSE TIME GUARANTEES ── */}
      <section className="svc-sla-section" ref={responseRef}>
        <div className="svc-sla-section-header">
          <div className="svc-sla-label left-align">Response Time Guarantees</div>
          <h2 className="svc-sla-section-h2">How fast we respond, by priority and plan.</h2>
          <p className="svc-sla-section-desc">
            Response time is measured from incident creation to the first meaningful human response from a SocioFi engineer.
            Automated notifications don't count.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={responseInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <table className="svc-sla-table" aria-label="Response time SLA by priority and plan">
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
                  <td className="essential-cell">{row.essential}</td>
                  <td className="growth-cell">{row.growth}</td>
                  <td className="scale-cell">{row.scale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* ── UPTIME GUARANTEES ── */}
      <section className="svc-sla-section-alt" ref={uptimeRef}>
        <div className="svc-sla-section-alt-inner">
          <div className="svc-sla-section-header">
            <div className="svc-sla-label left-align">Uptime Guarantees</div>
            <h2 className="svc-sla-section-h2">Guaranteed uptime by plan.</h2>
            <p className="svc-sla-section-desc">
              Uptime is measured as a rolling monthly average across all monitored services.
              The numbers below represent the maximum allowed downtime under each plan.
            </p>
          </div>
          <div className="svc-sla-uptime-grid">
            {UPTIME_TIERS.map((tier, i) => (
              <motion.div
                key={tier.plan}
                className={`svc-sla-uptime-card${tier.featured ? ' featured' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={uptimeInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="svc-sla-uptime-plan">{tier.plan}</div>
                <div className="svc-sla-uptime-pct">{tier.pct}</div>
                <div className="svc-sla-uptime-desc">{tier.desc}</div>
                <div className="svc-sla-uptime-bar-track">
                  <div className="svc-sla-uptime-bar-fill" style={{ width: `${tier.fill}%` }} />
                </div>
                <div className="svc-sla-downtime-note">{tier.note}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT IF WE MISS SLA ── */}
      <section className="svc-sla-section" ref={creditsRef}>
        <div className="svc-sla-section-header">
          <div className="svc-sla-label left-align">What If We Miss</div>
          <h2 className="svc-sla-section-h2">We miss SLAs occasionally. Here's what happens.</h2>
          <p className="svc-sla-section-desc">
            We take SLA commitments seriously. When we miss them, we make it right. Here's the credit policy, stated plainly.
          </p>
        </div>
        <div className="svc-sla-credits-grid">
          {CREDIT_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              className="svc-sla-credit-card"
              initial={{ opacity: 0, y: 20 }}
              animate={creditsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="svc-sla-credit-icon">{card.icon}</div>
              <div className="svc-sla-credit-title">{card.title}</div>
              <div className="svc-sla-credit-desc">{card.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW WE MEASURE ── */}
      <section className="svc-sla-section-alt" ref={measureRef}>
        <div className="svc-sla-section-alt-inner">
          <div className="svc-sla-section-header">
            <div className="svc-sla-label left-align">How We Measure</div>
            <h2 className="svc-sla-section-h2">Uptime measurement, exactly defined.</h2>
            <p className="svc-sla-section-desc">
              Vague SLAs are worth nothing. Here's precisely how we measure, what counts as downtime,
              and when an incident is considered closed.
            </p>
          </div>
          <div className="svc-sla-measure-list">
            {MEASURE_ITEMS.map((item, i) => (
              <motion.div
                key={item.num}
                className="svc-sla-measure-item"
                initial={{ opacity: 0, x: -20 }}
                animate={measureInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="svc-sla-measure-num">{item.num}</div>
                <div className="svc-sla-measure-content">
                  <div className="svc-sla-measure-title">{item.title}</div>
                  <div className="svc-sla-measure-desc">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXCLUSIONS ── */}
      <section className="svc-sla-section" ref={exclusionsRef}>
        <div className="svc-sla-section-header">
          <div className="svc-sla-label left-align">Exclusions</div>
          <h2 className="svc-sla-section-h2">What's not covered.</h2>
          <p className="svc-sla-section-desc">
            These are the only situations where uptime SLA credits do not apply.
            We keep this list short because it should be.
          </p>
        </div>
        <motion.div
          className="svc-sla-exclusions-grid"
          initial={{ opacity: 0, y: 24 }}
          animate={exclusionsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {EXCLUSIONS.map((exc) => (
            <div key={exc.title} className="svc-sla-exclusion-item">
              <span className="svc-sla-exclusion-dash" aria-hidden="true">—</span>
              <div className="svc-sla-exclusion-text">
                <strong>{exc.title}</strong>
                {exc.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── REPORTING ── */}
      <section className="svc-sla-section-alt" ref={reportingRef}>
        <div className="svc-sla-section-alt-inner">
          <motion.div
            className="svc-sla-reporting-box"
            initial={{ opacity: 0, y: 24 }}
            animate={reportingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="svc-sla-reporting-text">
              <h3>Uptime is always visible.</h3>
              <p>
                Your monitoring dashboard shows real-time uptime data and a full incident history. You never
                have to wait for a report to know how your software is performing. Monthly reports are sent
                automatically on the 1st of each month, covering the previous period.
              </p>
            </div>
            <div className="svc-sla-reporting-stats">
              <div className="svc-sla-report-stat">
                <div className="svc-sla-report-stat-dot" />
                <div className="svc-sla-report-stat-text"><strong>Real-time dashboard</strong> — check anytime, no login required for status page</div>
              </div>
              <div className="svc-sla-report-stat">
                <div className="svc-sla-report-stat-dot" style={{ animationDelay: '0.5s' }} />
                <div className="svc-sla-report-stat-text"><strong>Monthly automated report</strong> — sent to all account contacts on the 1st</div>
              </div>
              <div className="svc-sla-report-stat">
                <div className="svc-sla-report-stat-dot" style={{ animationDelay: '1s' }} />
                <div className="svc-sla-report-stat-text"><strong>Incident history</strong> — full timeline of every incident, cause, and resolution</div>
              </div>
              <div className="svc-sla-report-stat">
                <div className="svc-sla-report-stat-dot" style={{ animationDelay: '1.5s' }} />
                <div className="svc-sla-report-stat-text"><strong>P1/P2 postmortems</strong> — detailed root cause report within 48 hours</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="svc-sla-cta" ref={ctaRef}>
        <motion.div
          className="svc-sla-cta-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="svc-sla-label">Get Protected</div>
          <h2>Get the SLA you deserve.</h2>
          <p>
            Real response time commitments. Real uptime guarantees. Real credits if we miss them.
            Not the kind of SLA that sounds good but delivers nothing.
          </p>
          <Link href="/services/get-protected" className="svc-sla-cta-btn">
            Get Protected
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
