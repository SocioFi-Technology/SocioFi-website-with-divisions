'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#4DBFA8';

const STYLES = `
  .svc-mon-page {
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body);
  }

  /* ── Hero ── */
  .svc-mon-hero {
    padding: 160px 32px 100px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .svc-mon-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 700px 500px at 50% 0%, rgba(77,191,168,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 400px 300px at 20% 80%, rgba(58,88,158,0.05) 0%, transparent 60%);
    pointer-events: none;
  }
  .svc-mon-label {
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
  .svc-mon-label::before,
  .svc-mon-label::after {
    content: '';
    width: 24px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .svc-mon-label.left-align {
    justify-content: flex-start;
  }
  .svc-mon-label.left-align::after { display: none; }
  .svc-mon-h1 {
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
  .svc-mon-subtitle {
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 620px;
    margin: 0 auto 48px;
  }
  .svc-mon-hero-btns {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .svc-mon-btn-primary {
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
    border: none;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 4px 24px rgba(77,191,168,0.3);
    transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
  }
  .svc-mon-btn-primary:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(77,191,168,0.45);
  }
  .svc-mon-btn-ghost {
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
    cursor: pointer;
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
  }
  .svc-mon-btn-ghost:hover {
    border-color: ${A};
    color: ${A};
  }

  /* ── Hero Stats ── */
  .svc-mon-hero-stats {
    display: flex;
    justify-content: center;
    gap: 48px;
    margin-top: 64px;
    flex-wrap: wrap;
  }
  .svc-mon-hero-stat { text-align: center; }
  .svc-mon-hero-stat-val {
    font-family: var(--font-headline);
    font-size: 2rem;
    font-weight: 800;
    color: ${A};
    letter-spacing: -0.03em;
  }
  .svc-mon-hero-stat-label {
    font-size: 0.82rem;
    color: var(--text-muted);
    margin-top: 4px;
    font-family: var(--font-mono);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  /* ── Sections ── */
  .svc-mon-section {
    padding: 100px 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .svc-mon-section-alt {
    background: var(--bg-2);
    padding: 100px 32px;
  }
  .svc-mon-section-alt-inner {
    max-width: 1200px;
    margin: 0 auto;
  }
  .svc-mon-section-header { margin-bottom: 56px; }
  .svc-mon-section-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--text-primary);
    margin-bottom: 16px;
  }
  .svc-mon-section-desc {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 560px;
  }

  /* ── Monitoring Layers ── */
  .svc-mon-layers {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .svc-mon-layer {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: border-color 0.3s var(--ease);
    cursor: pointer;
  }
  .svc-mon-layer:hover,
  .svc-mon-layer.open { border-color: rgba(77,191,168,0.3); }
  .svc-mon-layer-bar {
    display: grid;
    grid-template-columns: 200px 1fr 160px 180px 48px;
    align-items: center;
    padding: 20px 28px;
    gap: 16px;
  }
  @media (max-width: 900px) {
    .svc-mon-layer-bar {
      grid-template-columns: 1fr auto;
      row-gap: 4px;
      padding: 16px 20px;
    }
    .svc-mon-layer-what,
    .svc-mon-layer-freq,
    .svc-mon-layer-threshold { display: none; }
  }
  .svc-mon-layer-name {
    font-family: var(--font-headline);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  .svc-mon-layer-what { font-size: 0.84rem; color: var(--text-secondary); }
  .svc-mon-layer-freq {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: ${A};
    letter-spacing: 0.03em;
  }
  .svc-mon-layer-threshold {
    font-size: 0.78rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }
  .svc-mon-layer-dot-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .svc-mon-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #22d484;
    animation: svcPulse 2s ease-in-out infinite;
  }
  .svc-mon-layer-detail {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s var(--ease), padding 0.35s var(--ease);
    border-top: 0px solid var(--border);
    padding: 0 28px;
  }
  .svc-mon-layer-detail.open {
    max-height: 200px;
    padding: 20px 28px;
    border-top: 1px solid var(--border);
  }
  .svc-mon-layer-detail p {
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--text-secondary);
  }
  .svc-mon-layer-detail-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 16px;
  }
  @media (max-width: 560px) {
    .svc-mon-layer-detail-grid { grid-template-columns: 1fr 1fr; }
  }
  .svc-mon-detail-item-label {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${A};
    margin-bottom: 4px;
  }
  .svc-mon-detail-item-val { font-size: 0.84rem; color: var(--text-secondary); }

  /* ── Agent Monitoring ── */
  .svc-mon-agent-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 40px;
  }
  @media (max-width: 900px) { .svc-mon-agent-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .svc-mon-agent-grid { grid-template-columns: 1fr; } }
  .svc-mon-agent-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 24px;
    transition: border-color 0.3s, transform 0.3s var(--ease);
  }
  .svc-mon-agent-card:hover {
    border-color: rgba(77,191,168,0.25);
    transform: translateY(-4px);
  }
  .svc-mon-agent-metric-name {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${A};
    margin-bottom: 8px;
  }
  .svc-mon-agent-metric-desc {
    font-size: 0.88rem;
    line-height: 1.6;
    color: var(--text-secondary);
  }
  .svc-mon-agent-note {
    margin-top: 40px;
    padding: 20px 28px;
    background: rgba(77,191,168,0.05);
    border: 1px solid rgba(77,191,168,0.15);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.65;
  }
  .svc-mon-agent-note a {
    color: ${A};
    text-decoration: none;
    font-weight: 600;
  }
  .svc-mon-agent-note a:hover { text-decoration: underline; }

  /* ── Dashboard ── */
  .svc-mon-dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 60px;
    align-items: center;
  }
  @media (max-width: 900px) { .svc-mon-dashboard-grid { grid-template-columns: 1fr; } }
  .svc-mon-dashboard-copy h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.3rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
    color: var(--text-primary);
    margin-bottom: 20px;
  }
  .svc-mon-dashboard-copy p {
    font-size: 1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    margin-bottom: 16px;
  }
  .svc-mon-dashboard-visual {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  }
  .svc-mon-db-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .svc-mon-db-title {
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  .svc-mon-db-live {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #22d484;
  }
  .svc-mon-db-live-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22d484;
    animation: svcPulse 1.5s ease-in-out infinite;
  }
  .svc-mon-db-uptime-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .svc-mon-db-uptime-pct {
    font-family: var(--font-headline);
    font-size: 2.4rem;
    font-weight: 800;
    color: ${A};
    letter-spacing: -0.04em;
  }
  .svc-mon-db-uptime-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
    padding-bottom: 6px;
  }
  .svc-mon-db-bar-track {
    height: 6px;
    background: rgba(255,255,255,0.05);
    border-radius: 100px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .svc-mon-db-bar-fill {
    height: 100%;
    width: 99.97%;
    background: linear-gradient(90deg, var(--navy) 0%, ${A} 100%);
    border-radius: 100px;
  }
  .svc-mon-db-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  .svc-mon-db-stat-card {
    background: var(--bg-2);
    border-radius: var(--radius-sm);
    padding: 14px 16px;
  }
  .svc-mon-db-stat-val {
    font-family: var(--font-headline);
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }
  .svc-mon-db-stat-l {
    font-size: 0.68rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 2px;
  }
  .svc-mon-db-incidents { border-top: 1px solid var(--border); padding-top: 16px; }
  .svc-mon-db-inc-title {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: 10px;
  }
  .svc-mon-db-inc-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.78rem;
  }
  .svc-mon-db-inc-row:last-child { border-bottom: none; }
  .svc-mon-db-inc-name { color: var(--text-secondary); }
  .svc-mon-db-inc-status {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    padding: 2px 8px;
    border-radius: 100px;
    background: rgba(34,212,132,0.1);
    color: #22d484;
  }
  .svc-mon-db-sparkline {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 36px;
    margin-top: 20px;
  }
  .svc-mon-db-spark-bar {
    flex: 1;
    border-radius: 2px 2px 0 0;
    background: rgba(77,191,168,0.2);
    transition: background 0.2s;
  }
  .svc-mon-db-spark-bar.hi { background: ${A}; }
  .svc-mon-db-sparkline-label {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--text-muted);
    margin-top: 6px;
  }

  /* ── Alert Flow ── */
  .svc-mon-alert-flow {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 900px) {
    .svc-mon-alert-flow { grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .svc-mon-alert-step:first-child { border-radius: var(--radius-md) var(--radius-md) 0 0 !important; }
    .svc-mon-alert-step:last-child { border-radius: 0 0 var(--radius-md) var(--radius-md) !important; }
    .svc-mon-alert-step { border-right: 1px solid var(--border) !important; border-radius: var(--radius-md) !important; }
  }
  @media (max-width: 560px) {
    .svc-mon-alert-flow { grid-template-columns: 1fr; }
    .svc-mon-alert-step { border-radius: var(--radius-md) !important; }
  }
  .svc-mon-alert-step {
    padding: 32px 28px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    position: relative;
    transition: border-color 0.3s, z-index 0s;
  }
  .svc-mon-alert-step:first-child { border-radius: var(--radius-md) 0 0 var(--radius-md); }
  .svc-mon-alert-step:last-child { border-radius: 0 var(--radius-md) var(--radius-md) 0; }
  .svc-mon-alert-step:not(:last-child) { border-right: none; }
  .svc-mon-alert-step:hover { border-color: rgba(77,191,168,0.25); z-index: 1; }
  .svc-mon-alert-num {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: ${A};
    margin-bottom: 12px;
  }
  .svc-mon-alert-step-name {
    font-family: var(--font-headline);
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  .svc-mon-alert-timing {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: ${A};
    margin-bottom: 12px;
    letter-spacing: 0.04em;
  }
  .svc-mon-alert-desc {
    font-size: 0.84rem;
    line-height: 1.6;
    color: var(--text-secondary);
  }
  .svc-mon-alert-who {
    margin-top: 12px;
    font-size: 0.72rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
  }
  .svc-mon-alert-tagline {
    text-align: center;
    margin-top: 48px;
    font-family: var(--font-headline);
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--text-secondary);
  }
  .svc-mon-alert-tagline strong { color: var(--text-primary); }

  /* ── CTA ── */
  .svc-mon-cta {
    padding: 100px 32px;
    text-align: center;
    position: relative;
    overflow: hidden;
    background: var(--bg-2);
  }
  .svc-mon-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 800px 400px at 50% 50%, rgba(77,191,168,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .svc-mon-cta-inner { position: relative; max-width: 680px; margin: 0 auto; }
  .svc-mon-cta h2 {
    font-family: var(--font-headline);
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    color: var(--text-primary);
    margin-bottom: 16px;
  }
  .svc-mon-cta p {
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 40px;
  }
  .svc-mon-cta-btns {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* ── Keyframes ── */
  @keyframes svcPulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.15); }
  }
`;

const LAYERS = [
  {
    name: 'Uptime',
    what: 'HTTP/HTTPS endpoints, TCP health',
    freq: '30s intervals',
    threshold: '2 consecutive failures',
    detail: 'Every endpoint in your application is checked from 5 global locations every 30 seconds. Two consecutive failures from at least two locations trigger an immediate P1 alert — eliminating false positives from transient network issues.',
    tooling: 'Synthetic HTTP checks',
    locations: '5 global nodes',
    retention: '12 months',
  },
  {
    name: 'Response Time',
    what: 'Page load speed, API endpoint latency',
    freq: 'Real-time',
    threshold: '>2s P95 latency',
    detail: 'We track P50, P95, and P99 response times across all your public and internal endpoints. Degradation trends alert us before users notice — a slow app is often a warning sign of an imminent outage.',
    tooling: 'APM instrumentation',
    locations: 'All endpoints',
    retention: '90 days',
  },
  {
    name: 'Error Rate',
    what: '5xx responses, unhandled exceptions, stack traces',
    freq: 'Real-time',
    threshold: '>1% error rate',
    detail: 'Application-level error tracking captures every unhandled exception, grouped by type and frequency. We triage alerts immediately — high-error-rate events get a human response within SLA, not just an automated notification.',
    tooling: 'Error tracking + log aggregation',
    locations: 'Application-wide',
    retention: '30 days',
  },
  {
    name: 'Database',
    what: 'Query speed, connection pool, disk usage',
    freq: 'Continuous',
    threshold: '>500ms slow queries',
    detail: 'Database health is one of the earliest failure signals. We monitor query execution times, connection pool saturation, disk I/O, and replication lag. Slow query alerts let us fix performance issues before they cascade into downtime.',
    tooling: 'DB metrics + query analysis',
    locations: 'All connected databases',
    retention: '60 days',
  },
  {
    name: 'Security',
    what: 'CVE feeds, dependency audit, access logs',
    freq: 'Weekly scan + continuous auth',
    threshold: 'Any critical CVE',
    detail: 'Security monitoring runs on two tracks: scheduled dependency audits against live CVE databases, and continuous monitoring of authentication events and access patterns. Anomalous login attempts trigger immediate investigation.',
    tooling: 'CVE scanner + access log analysis',
    locations: 'Infrastructure-wide',
    retention: '12 months (compliance)',
  },
  {
    name: 'SSL/TLS',
    what: 'Certificate validity, expiry, TLS grade',
    freq: 'Daily',
    threshold: '<30 days to expiry',
    detail: "SSL certificate failures take services down instantly — and they are entirely preventable. We check your certificates daily, alert at 30 days to expiry, and ensure your TLS configuration achieves an A+ rating on SSL Labs.",
    tooling: 'SSL Labs integration',
    locations: 'All domains',
    retention: 'Certificate history',
  },
  {
    name: 'Dependencies',
    what: 'Third-party API status, external services',
    freq: 'Continuous',
    threshold: 'Any degradation',
    detail: 'Modern applications depend on external services — payment processors, email providers, cloud infrastructure. We monitor the status pages and health endpoints of every third-party service in your stack, so we know when Stripe or AWS is causing issues before you do.',
    tooling: 'Status page aggregation',
    locations: 'All integrations',
    retention: '30 days',
  },
  {
    name: 'Performance',
    what: 'Core Web Vitals: LCP, INP, CLS',
    freq: 'Real-time synthetic + field data',
    threshold: 'Below "good" threshold',
    detail: 'Core Web Vitals directly affect search ranking and user retention. We run synthetic performance tests from real browsers and collect field data from actual user sessions. Regressions from code deploys are caught within minutes.',
    tooling: 'Lighthouse + RUM',
    locations: 'Key user journeys',
    retention: '90 days',
  },
];

const AGENT_METRICS = [
  { name: 'Agent Health', desc: 'Are your AI agents running, responding, and completing tasks without errors or timeouts?' },
  { name: 'Accuracy Drift', desc: 'Monitoring output quality over time to detect model drift or prompt degradation before it affects users.' },
  { name: 'Task Completion Rate', desc: 'Percentage of agent tasks that complete successfully versus those that fail, timeout, or require fallback.' },
  { name: 'Latency', desc: 'End-to-end response times for agent pipelines — from trigger to output — tracked at P50, P95, and P99.' },
  { name: 'Human Escalation Rate', desc: 'How often agents route to human review. Rising escalation rates are an early signal of agent degradation.' },
  { name: 'Cost per Invocation', desc: 'Token usage and API cost per agent run, tracked over time to catch unexpected cost spikes early.' },
];

const ALERT_STEPS = [
  {
    num: '01',
    name: 'Detection',
    timing: '< 30 seconds',
    desc: 'Monitoring checks fire every 30 seconds across all 8 layers. A failure is recorded the moment a threshold is breached.',
    who: 'Automated system',
  },
  {
    num: '02',
    name: 'Classification',
    timing: '< 60 seconds',
    desc: 'Automated rules classify the event as P1, P2, P3, or P4 based on severity, affected surface area, and historical patterns.',
    who: 'Automated + on-call engineer',
  },
  {
    num: '03',
    name: 'Alert',
    timing: 'Immediate (P1/P2)',
    desc: 'P1 and P2 events trigger simultaneous Slack, SMS, and email notifications to the on-call engineer and the client.',
    who: 'Client notified immediately',
  },
  {
    num: '04',
    name: 'Human Response',
    timing: 'Within SLA',
    desc: 'A human engineer acknowledges the incident within the SLA window and begins active investigation. No automated-only responses for P1/P2.',
    who: 'SocioFi engineer',
  },
];

const SPARKLINE = [60, 70, 55, 80, 75, 90, 85, 88, 78, 95, 92, 100, 88, 94, 90, 85, 92, 88, 96, 90, 85, 95, 88, 92, 90, 94, 88, 100];

export default function MonitoringPage() {
  const [openLayer, setOpenLayer] = useState<number | null>(null);

  const layersRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const layersInView = useInView(layersRef, { once: true, amount: 0.1 });
  const agentInView = useInView(agentRef, { once: true, amount: 0.1 });
  const dashInView = useInView(dashRef, { once: true, amount: 0.1 });
  const alertInView = useInView(alertRef, { once: true, amount: 0.1 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.1 });

  return (
    <main className="svc-mon-page">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="svc-mon-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="svc-mon-label">Monitoring</div>
          <h1 className="svc-mon-h1">
            We Watch Everything.<br />Around the Clock.
          </h1>
          <p className="svc-mon-subtitle">
            30-second check intervals. 5 global monitoring locations. 8 layers of your stack,
            all watched simultaneously. Automated classification, human response — every time something goes wrong.
          </p>
          <div className="svc-mon-hero-btns">
            <Link href="/services/get-protected" className="svc-mon-btn-primary">
              Get Protected
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/services/plans" className="svc-mon-btn-ghost">
              See Plans
            </Link>
          </div>
          <div className="svc-mon-hero-stats">
            <div className="svc-mon-hero-stat">
              <div className="svc-mon-hero-stat-val">30s</div>
              <div className="svc-mon-hero-stat-label">Check interval</div>
            </div>
            <div className="svc-mon-hero-stat">
              <div className="svc-mon-hero-stat-val">5</div>
              <div className="svc-mon-hero-stat-label">Global locations</div>
            </div>
            <div className="svc-mon-hero-stat">
              <div className="svc-mon-hero-stat-val">8</div>
              <div className="svc-mon-hero-stat-label">Monitoring layers</div>
            </div>
            <div className="svc-mon-hero-stat">
              <div className="svc-mon-hero-stat-val">24/7</div>
              <div className="svc-mon-hero-stat-label">Human on-call</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 8 MONITORING LAYERS ── */}
      <section className="svc-mon-section" ref={layersRef}>
        <div className="svc-mon-section-header">
          <div className="svc-mon-label left-align">8 Monitoring Layers</div>
          <h2 className="svc-mon-section-h2">Every layer of your stack, under observation.</h2>
          <p className="svc-mon-section-desc">
            Click any layer to see exactly what we monitor, how, and what triggers an alert.
            All 8 layers run simultaneously, every 30 seconds.
          </p>
        </div>
        <div className="svc-mon-layers">
          {LAYERS.map((layer, i) => (
            <motion.div
              key={layer.name}
              className={`svc-mon-layer${openLayer === i ? ' open' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={layersInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setOpenLayer(openLayer === i ? null : i)}
            >
              <div className="svc-mon-layer-bar">
                <div className="svc-mon-layer-name">{layer.name}</div>
                <div className="svc-mon-layer-what">{layer.what}</div>
                <div className="svc-mon-layer-freq">{layer.freq}</div>
                <div className="svc-mon-layer-threshold">{layer.threshold}</div>
                <div className="svc-mon-layer-dot-wrap">
                  <div className="svc-mon-dot" style={{ animationDelay: `${i * 0.25}s` }} />
                </div>
              </div>
              <div className={`svc-mon-layer-detail${openLayer === i ? ' open' : ''}`}>
                <p>{layer.detail}</p>
                <div className="svc-mon-layer-detail-grid">
                  <div>
                    <div className="svc-mon-detail-item-label">Tooling</div>
                    <div className="svc-mon-detail-item-val">{layer.tooling}</div>
                  </div>
                  <div>
                    <div className="svc-mon-detail-item-label">Coverage</div>
                    <div className="svc-mon-detail-item-val">{layer.locations}</div>
                  </div>
                  <div>
                    <div className="svc-mon-detail-item-label">Data retention</div>
                    <div className="svc-mon-detail-item-val">{layer.retention}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── AGENT MONITORING ── */}
      <section className="svc-mon-section-alt" ref={agentRef}>
        <div className="svc-mon-section-alt-inner">
          <div className="svc-mon-section-header">
            <div className="svc-mon-label left-align">For AI Agents</div>
            <h2 className="svc-mon-section-h2">Agent monitoring is a different problem.<br />We've built for it.</h2>
            <p className="svc-mon-section-desc">
              Traditional monitoring tells you if a server is up. Agent monitoring tells you if your AI pipeline
              is producing quality outputs, completing tasks reliably, and staying within cost bounds.
            </p>
          </div>
          <div className="svc-mon-agent-grid">
            {AGENT_METRICS.map((m, i) => (
              <motion.div
                key={m.name}
                className="svc-mon-agent-card"
                initial={{ opacity: 0, y: 20 }}
                animate={agentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="svc-mon-agent-metric-name">{m.name}</div>
                <div className="svc-mon-agent-metric-desc">{m.desc}</div>
              </motion.div>
            ))}
          </div>
          <div className="svc-mon-agent-note">
            Agent monitoring is included in Growth and Scale plans, or available as a $199/mo add-on for Essential clients.
            Includes all 6 metrics above, plus a monthly agent health report.{' '}
            <Link href="/agents">Learn about our AI agent capabilities →</Link>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <section className="svc-mon-section" ref={dashRef}>
        <div className="svc-mon-dashboard-grid">
          <motion.div
            className="svc-mon-dashboard-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={dashInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="svc-mon-label left-align">Your Dashboard</div>
            <h2>Visibility you didn't have before.</h2>
            <p>
              Every Services client gets access to a real-time monitoring dashboard. Your uptime history,
              recent incidents, current performance, and open alerts — all in one place.
            </p>
            <p>
              You can check your software's health anytime. But more importantly, we're checking it every
              30 seconds so you don't have to.
            </p>
          </motion.div>
          <motion.div
            className="svc-mon-dashboard-visual"
            initial={{ opacity: 0, x: 30 }}
            animate={dashInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="svc-mon-db-header">
              <div className="svc-mon-db-title">System Overview</div>
              <div className="svc-mon-db-live">
                <div className="svc-mon-db-live-dot" />
                Live
              </div>
            </div>
            <div className="svc-mon-db-uptime-row">
              <div className="svc-mon-db-uptime-pct">99.97%</div>
              <div className="svc-mon-db-uptime-label">Uptime — last 90 days</div>
            </div>
            <div className="svc-mon-db-bar-track">
              <div className="svc-mon-db-bar-fill" />
            </div>
            <div className="svc-mon-db-stats">
              <div className="svc-mon-db-stat-card">
                <div className="svc-mon-db-stat-val">142ms</div>
                <div className="svc-mon-db-stat-l">Avg response</div>
              </div>
              <div className="svc-mon-db-stat-card">
                <div className="svc-mon-db-stat-val">0.03%</div>
                <div className="svc-mon-db-stat-l">Error rate</div>
              </div>
              <div className="svc-mon-db-stat-card">
                <div className="svc-mon-db-stat-val">2</div>
                <div className="svc-mon-db-stat-l">Open alerts</div>
              </div>
            </div>
            <div className="svc-mon-db-incidents">
              <div className="svc-mon-db-inc-title">Recent events</div>
              {[
                { name: 'API /v2/users — Response time elevated', status: 'Resolved' },
                { name: 'SSL cert renewal — api.example.com', status: 'Resolved' },
                { name: 'DB slow query — products table', status: 'Resolved' },
              ].map((inc) => (
                <div key={inc.name} className="svc-mon-db-inc-row">
                  <span className="svc-mon-db-inc-name">{inc.name}</span>
                  <span className="svc-mon-db-inc-status">{inc.status}</span>
                </div>
              ))}
            </div>
            <div className="svc-mon-db-sparkline">
              {SPARKLINE.map((h, i) => (
                <div
                  key={i}
                  className={`svc-mon-db-spark-bar${i >= SPARKLINE.length - 3 ? ' hi' : ''}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="svc-mon-db-sparkline-label">Response time — 28 days</div>
          </motion.div>
        </div>
      </section>

      {/* ── ALERT FLOW ── */}
      <section className="svc-mon-section-alt" ref={alertRef}>
        <div className="svc-mon-section-alt-inner">
          <div className="svc-mon-section-header">
            <div className="svc-mon-label left-align">Alert Flow</div>
            <h2 className="svc-mon-section-h2">From detection to resolution, here's what happens.</h2>
          </div>
          <div className="svc-mon-alert-flow">
            {ALERT_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className="svc-mon-alert-step"
                initial={{ opacity: 0, y: 20 }}
                animate={alertInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="svc-mon-alert-num">{step.num}</div>
                <div className="svc-mon-alert-step-name">{step.name}</div>
                <div className="svc-mon-alert-timing">{step.timing}</div>
                <div className="svc-mon-alert-desc">{step.desc}</div>
                <div className="svc-mon-alert-who">↳ {step.who}</div>
              </motion.div>
            ))}
          </div>
          <p className="svc-mon-alert-tagline">
            <strong>Automated detection.</strong> Human response. <strong>Every time.</strong>
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="svc-mon-cta" ref={ctaRef}>
        <motion.div
          className="svc-mon-cta-inner"
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="svc-mon-label">Get Started</div>
          <h2>Stop finding out from your customers.</h2>
          <p>
            Full-stack monitoring active within 48 hours of onboarding.
            More visibility into your software than you've ever had before.
          </p>
          <div className="svc-mon-cta-btns">
            <Link href="/services/get-protected" className="svc-mon-btn-primary">
              Get Protected
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/services/plans" className="svc-mon-btn-ghost">
              See Plans
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
