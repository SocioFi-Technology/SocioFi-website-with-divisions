'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import Link from 'next/link';
import { plans } from '@/lib/services-plans';

const A = '#4DBFA8';

const F = {
  display: 'var(--font-headline)',
  body: 'var(--font-body)',
  mono: 'var(--font-mono)',
};

const STYLES = `
  /* ── Scan-line overlay ── */
  .srv-scanlines {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(77, 191, 168, 0.008) 3px,
      rgba(77, 191, 168, 0.008) 4px
    );
  }

  /* ── Pulsing dot ── */
  @keyframes srv-pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50%       { transform: scale(1.35); opacity: 1; }
  }
  @keyframes srv-pulse-amber {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50%       { transform: scale(1.3); opacity: 1; }
  }
  .srv-dot-green {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #4DBFA8;
    box-shadow: 0 0 6px rgba(77,191,168,0.8);
    animation: srv-pulse 2s ease-in-out infinite;
  }
  .srv-dot-amber {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #F0A030;
    box-shadow: 0 0 6px rgba(240,160,48,0.8);
    animation: srv-pulse-amber 1.5s ease-in-out infinite;
  }
  .srv-dot-badge {
    display: inline-block;
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #4DBFA8;
    box-shadow: 0 0 8px rgba(77,191,168,0.9);
    animation: srv-pulse 2.4s ease-in-out infinite;
  }

  /* ── Uptime bar animation ── */
  @keyframes srv-uptime-fill {
    from { width: 0%; }
    to   { width: 99.97%; }
  }
  .srv-uptime-bar {
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, #4DBFA8, #72C4B2);
    width: 0%;
    transition: width 2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .srv-uptime-bar.active {
    animation: srv-uptime-fill 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* ── Dashboard panel ── */
  .srv-dashboard {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    overflow: hidden;
    font-family: var(--font-mono);
  }
  .srv-dashboard-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--glass-border);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: var(--text-secondary);
  }
  .srv-dashboard-row {
    display: grid;
    grid-template-columns: 14px 1fr auto auto;
    align-items: center;
    gap: 10px;
    padding: 9px 16px;
    font-size: 0.72rem;
    border-bottom: 1px solid rgba(77,191,168,0.04);
    transition: background 0.2s;
  }
  .srv-dashboard-row:hover { background: rgba(77,191,168,0.04); }
  .srv-status-up   { color: #4DBFA8; font-weight: 600; }
  .srv-status-busy { color: #F0A030; font-weight: 600; }
  .srv-latency { color: var(--text-muted); font-size: 0.68rem; }

  /* ── Problem cards ── */
  .srv-problem-card {
    background: var(--bg-card);
    border: 1px solid rgba(220,80,80,0.15);
    border-radius: 16px;
    padding: 24px 28px;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  .srv-problem-card:hover {
    border-color: rgba(220,80,80,0.3);
    transform: translateY(-4px);
    box-shadow: var(--card-hover-shadow);
  }

  /* ── Capability card ── */
  .srv-cap-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px 24px 20px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .srv-cap-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3A589E, #4DBFA8);
    opacity: 0;
    transition: opacity 0.4s;
  }
  .srv-cap-card:hover { border-color: var(--border-hover); transform: translateY(-5px); box-shadow: var(--card-hover-shadow); }
  .srv-cap-card:hover::before { opacity: 1; }

  /* ── Status badge ── */
  .srv-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 100px;
    background: rgba(77,191,168,0.1);
    border: 1px solid rgba(77,191,168,0.2);
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    font-family: var(--font-mono);
    color: #4DBFA8;
    font-weight: 600;
  }
  .srv-status-badge.scanning {
    background: rgba(240,160,48,0.1);
    border-color: rgba(240,160,48,0.2);
    color: #F0A030;
  }
  .srv-status-badge.optimizing {
    background: rgba(107,163,232,0.1);
    border-color: rgba(107,163,232,0.2);
    color: #6BA3E8;
  }

  /* ── Progress bar for feature hours ── */
  @keyframes srv-progress-fill {
    from { width: 0%; }
    to   { width: 50%; }
  }
  .srv-progress-track {
    height: 4px;
    border-radius: 2px;
    background: var(--border);
    overflow: hidden;
    margin-top: 4px;
  }
  .srv-progress-fill {
    height: 100%;
    border-radius: 2px;
    background: #4DBFA8;
    width: 50%;
  }

  /* ── Pipeline stages ── */
  .srv-pipeline {
    display: flex;
    align-items: flex-start;
    gap: 0;
    position: relative;
  }
  .srv-stage {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .srv-stage-node {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 2px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-muted);
    transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
    z-index: 2;
    position: relative;
  }
  .srv-stage-node.active {
    background: #4DBFA8;
    border-color: #4DBFA8;
    color: white;
    box-shadow: 0 0 16px rgba(77,191,168,0.5);
  }
  .srv-stage-line {
    position: absolute;
    top: 18px;
    left: calc(50% + 18px);
    right: calc(-50% + 18px);
    height: 2px;
    background: var(--border);
    z-index: 1;
    transition: background 0.5s;
  }
  .srv-stage-line.active { background: #4DBFA8; }
  .srv-stage:last-child .srv-stage-line { display: none; }
  .srv-stage-label {
    margin-top: 10px;
    font-size: 0.72rem;
    font-family: var(--font-body);
    color: var(--text-secondary);
    text-align: center;
    line-height: 1.3;
    transition: color 0.5s;
  }
  .srv-stage-label.active { color: #4DBFA8; font-weight: 600; }
  .srv-stage-day {
    font-size: 0.62rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
    margin-top: 2px;
    text-align: center;
  }

  /* ── Comparison columns ── */
  .srv-compare-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 0;
    font-size: 0.88rem;
    font-family: var(--font-body);
    line-height: 1.5;
    border-bottom: 1px solid var(--border);
  }
  .srv-compare-item:last-child { border-bottom: none; }
  .srv-compare-icon {
    flex-shrink: 0;
    width: 18px; height: 18px;
    margin-top: 2px;
  }

  /* ── Incident flow nodes ── */
  .srv-incident-flow {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0;
    justify-content: center;
  }
  .srv-incident-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    position: relative;
  }
  .srv-incident-circle {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 2px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .srv-incident-circle.lit {
    background: rgba(77,191,168,0.15);
    border-color: #4DBFA8;
    box-shadow: 0 0 12px rgba(77,191,168,0.3);
  }
  .srv-incident-arrow {
    width: 20px; height: 2px;
    background: var(--border);
    margin: 0 2px;
    margin-bottom: 22px;
    transition: background 0.4s;
    flex-shrink: 0;
  }
  .srv-incident-arrow.lit { background: #4DBFA8; }
  .srv-incident-label {
    font-size: 0.65rem;
    font-family: var(--font-mono);
    color: var(--text-muted);
    text-align: center;
    letter-spacing: 0.04em;
    transition: color 0.4s;
    white-space: nowrap;
  }
  .srv-incident-label.lit { color: #4DBFA8; }

  /* ── Plan card ── */
  .srv-plan-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    box-shadow: var(--card-shadow);
  }
  .srv-plan-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-6px);
    box-shadow: var(--card-hover-shadow);
  }
  .srv-plan-card.popular {
    border-color: rgba(77,191,168,0.4);
    box-shadow: 0 0 0 1px rgba(77,191,168,0.2), var(--card-shadow);
  }
  .srv-plan-card.popular:hover {
    border-color: rgba(77,191,168,0.7);
    box-shadow: 0 0 0 1px rgba(77,191,168,0.4), 0 20px 60px rgba(0,0,0,0.25);
  }
  .srv-plan-card.popular::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3A589E, #4DBFA8);
  }

  /* ── Neural/agent dot ── */
  @keyframes srv-neural {
    0%   { transform: scale(1);    opacity: 0.7; box-shadow: 0 0 4px rgba(77,191,168,0.5); }
    33%  { transform: scale(1.4);  opacity: 1;   box-shadow: 0 0 10px rgba(77,191,168,0.9); }
    66%  { transform: scale(0.85); opacity: 0.6; box-shadow: 0 0 2px rgba(77,191,168,0.3); }
    100% { transform: scale(1);    opacity: 0.7; box-shadow: 0 0 4px rgba(77,191,168,0.5); }
  }
  .srv-dot-neural {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #4DBFA8;
    animation: srv-neural 2.2s ease-in-out infinite;
  }

  /* ── Lifecycle flow ── */
  .srv-lifecycle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    flex-wrap: wrap;
  }
  .srv-lc-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .srv-lc-box {
    padding: 14px 20px;
    border-radius: 12px;
    font-family: var(--font-body);
    font-size: 0.88rem;
    font-weight: 600;
    text-align: center;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-primary);
    transition: all 0.3s;
    white-space: nowrap;
  }
  .srv-lc-box.highlight {
    background: rgba(77,191,168,0.12);
    border-color: rgba(77,191,168,0.4);
    color: #4DBFA8;
  }
  .srv-lc-arrow {
    display: flex;
    align-items: center;
    padding: 0 4px;
    margin-bottom: 28px;
  }
  .srv-lc-label {
    font-size: 0.7rem;
    font-family: var(--font-mono);
    color: var(--text-muted);
    text-align: center;
    letter-spacing: 0.06em;
  }

  /* ── Metrics bar ── */
  .srv-metrics-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0;
  }
  .srv-metric-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 20px 40px;
    border-right: 1px solid var(--border);
  }
  .srv-metric-item:last-child { border-right: none; }
  .srv-metric-num {
    font-family: var(--font-headline);
    font-size: 1.8rem;
    font-weight: 800;
    color: #4DBFA8;
    letter-spacing: -0.025em;
    line-height: 1;
  }
  .srv-metric-label {
    font-family: var(--font-body);
    font-size: 0.8rem;
    color: var(--text-muted);
    text-align: center;
  }

  /* ── Response table ── */
  .srv-resp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.84rem;
    font-family: var(--font-body);
  }
  .srv-resp-table th {
    padding: 10px 16px;
    text-align: left;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    font-weight: 500;
  }
  .srv-resp-table td {
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
  }
  .srv-resp-table td:first-child { color: var(--text-primary); font-weight: 500; }
  .srv-resp-table tr:last-child td { border-bottom: none; }
  .srv-resp-table .fast { color: #4DBFA8; font-weight: 600; }

  /* ── Testimonial card ── */
  .srv-testimonial {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    transition: all 0.35s;
  }
  .srv-testimonial:hover {
    border-color: var(--border-hover);
    transform: translateY(-4px);
    box-shadow: var(--card-hover-shadow);
  }

  /* ── Section bottom gradient ── */
  .srv-section-fade {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 120px;
    background: linear-gradient(to top, rgba(77,191,168,0.04), transparent);
    pointer-events: none;
  }

  /* ── Gradient text ── */
  .srv-gradient-text {
    background: linear-gradient(135deg, #4DBFA8 0%, #72C4B2 50%, #A3DFD2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (forced-colors: active) {
    .srv-gradient-text { -webkit-text-fill-color: unset; }
  }

  /* ── CEO quote ── */
  .srv-ceo-quote {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 20px;
    border-left: 2px solid rgba(77,191,168,0.4);
    background: rgba(77,191,168,0.04);
    border-radius: 0 10px 10px 0;
    font-style: italic;
    color: var(--text-secondary);
    font-size: 0.92rem;
    line-height: 1.65;
    font-family: var(--font-body);
  }

  /* ── Section label ── */
  .srv-sec-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    color: #4DBFA8;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .srv-sec-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: #4DBFA8;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .srv-pipeline { flex-direction: column; align-items: flex-start; gap: 16px; }
    .srv-stage { flex-direction: row; align-items: center; gap: 14px; }
    .srv-stage-node { flex-shrink: 0; }
    .srv-stage-line { display: none !important; }
    .srv-stage-label { text-align: left; margin-top: 0; }
    .srv-stage-day { text-align: left; }
    .srv-incident-flow { gap: 0; }
    .srv-incident-arrow { width: 12px; }
    .srv-lifecycle { gap: 8px; flex-direction: column; }
    .srv-lc-arrow { display: none; }
    .srv-metrics-bar { flex-direction: column; }
    .srv-metric-item { border-right: none; border-bottom: 1px solid var(--border); width: 100%; padding: 16px; }
    .srv-metric-item:last-child { border-bottom: none; }
    .srv-resp-table { font-size: 0.78rem; }
    .srv-resp-table th, .srv-resp-table td { padding: 8px 10px; }
  }
`;

// ── Fade-in variant
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const stagger = (i: number): Variants => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE, delay: i * 0.1 } },
});

// ── Dashboard component
function MonitoringDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView && barRef.current) {
      barRef.current.classList.add('active');
    }
  }, [inView]);

  const rows = [
    { dot: 'green', name: 'API Gateway',        metric: '42ms',        status: 'UP',   statusClass: 'srv-status-up' },
    { dot: 'green', name: 'PostgreSQL Primary',  metric: '8ms',         status: 'UP',   statusClass: 'srv-status-up' },
    { dot: 'amber', name: 'Worker Queue',        metric: '340 jobs',    status: 'BUSY', statusClass: 'srv-status-busy' },
    { dot: 'green', name: 'Redis Cache',         metric: '0.4ms',       status: 'UP',   statusClass: 'srv-status-up' },
    { dot: 'green', name: 'CDN Edge Nodes',      metric: '12ms avg',    status: 'UP',   statusClass: 'srv-status-up' },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="srv-dashboard"
      style={{ maxWidth: 480, width: '100%', margin: '0 auto' }}
    >
      <div className="srv-dashboard-header">
        <span className="srv-dot-green" style={{ width: 6, height: 6 }} />
        SYSTEM STATUS
        <span style={{ marginLeft: 'auto', color: A, fontWeight: 600 }}>All Operational</span>
      </div>
      {rows.map((r) => (
        <div className="srv-dashboard-row" key={r.name}>
          <span className={r.dot === 'green' ? 'srv-dot-green' : 'srv-dot-amber'} style={{ width: 7, height: 7 }} />
          <span style={{ color: 'var(--text-primary)', fontSize: '0.73rem' }}>{r.name}</span>
          <span className="srv-latency">{r.metric}</span>
          <span className={r.statusClass} style={{ fontSize: '0.66rem', letterSpacing: '0.06em' }}>{r.status}</span>
        </div>
      ))}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
          <span>UPTIME (30d)</span>
          <span style={{ color: A, fontWeight: 600 }}>99.97%</span>
        </div>
        <div style={{ background: 'var(--border)', borderRadius: 3, overflow: 'hidden', height: 6 }}>
          <div ref={barRef} className="srv-uptime-bar" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Pipeline component
function OnboardingPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [activeStage, setActiveStage] = useState(-1);

  const stages = [
    { num: '01', label: 'Codebase Audit', day: 'Day 1–2' },
    { num: '02', label: 'Monitoring Setup', day: 'Day 2–3' },
    { num: '03', label: 'Security Scan', day: 'Day 3' },
    { num: '04', label: 'Documentation', day: 'Day 3–4' },
    { num: '05', label: 'Active Protection', day: 'Day 5+' },
  ];

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const timer = setInterval(() => {
      setActiveStage(i);
      i++;
      if (i >= stages.length) clearInterval(timer);
    }, 400);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <div ref={ref}>
      <div className="srv-pipeline">
        {stages.map((s, idx) => (
          <div className="srv-stage" key={s.num}>
            <div className={`srv-stage-node${idx <= activeStage ? ' active' : ''}`}>{s.num}</div>
            <div className={`srv-stage-line${idx <= activeStage - 1 ? ' active' : ''}`} />
            <div className={`srv-stage-label${idx <= activeStage ? ' active' : ''}`}>{s.label}</div>
            <div className="srv-stage-day">{s.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Incident flow
function IncidentFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [litCount, setLitCount] = useState(0);

  const nodes = [
    { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>, label: 'Detection' },
    { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, label: 'Classify' },
    { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>, label: 'Alert' },
    { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>, label: 'Acknowledge' },
    { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, label: 'Investigate' },
    { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>, label: 'Fix' },
    { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>, label: 'Deploy' },
    { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>, label: 'Verify' },
    { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: 'Prevention' },
  ];

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const timer = setInterval(() => {
      setLitCount((prev) => {
        if (prev >= nodes.length) { clearInterval(timer); return prev; }
        return prev + 1;
      });
      i++;
      if (i >= nodes.length) clearInterval(timer);
    }, 200);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <div ref={ref} className="srv-incident-flow" style={{ rowGap: 16 }}>
      {nodes.map((n, i) => (
        <div key={n.label} style={{ display: 'flex', alignItems: 'center' }}>
          <div className="srv-incident-node">
            <div className={`srv-incident-circle${i < litCount ? ' lit' : ''}`}>
              {n.icon}
            </div>
            <div className={`srv-incident-label${i < litCount ? ' lit' : ''}`}>{n.label}</div>
          </div>
          {i < nodes.length - 1 && (
            <div className={`srv-incident-arrow${i < litCount - 1 ? ' lit' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main page
export default function ServicesPage() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="srv-scanlines" aria-hidden="true" />

      {/* ══════════ 1. HERO ══════════ */}
      <section
        style={{
          position: 'relative',
          paddingTop: 140,
          paddingBottom: 100,
          background: 'var(--bg)',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {/* Background gradient orb */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(77,191,168,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 100,
              background: 'rgba(77,191,168,0.08)',
              border: '1px solid rgba(77,191,168,0.2)',
              fontFamily: F.mono, fontSize: '0.7rem',
              letterSpacing: '0.1em', color: A, fontWeight: 600,
            }}>
              <span className="srv-dot-badge" />
              MANAGED OPERATIONS &amp; SUPPORT
            </div>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            style={{
              fontFamily: F.display,
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.06,
              color: 'var(--text-primary)',
              marginBottom: 24,
            }}
          >
            Your Software,{' '}
            <span className="srv-gradient-text">Always Running.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
            style={{
              fontFamily: F.body,
              fontSize: '1.05rem',
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
              maxWidth: 620,
              margin: '0 auto 36px',
            }}
          >
            Something broke at 2am? Security vulnerabilities piling up? Need new features but nobody to build them?
            We monitor, maintain, and evolve your live software — so you can focus on your business.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}
          >
            <Link
              href="/services/get-protected"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 28px', borderRadius: 100,
                background: `linear-gradient(135deg, #3A589E, ${A})`,
                color: 'white', fontFamily: F.display,
                fontSize: '0.9rem', fontWeight: 600,
                letterSpacing: '-0.01em', textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(77,191,168,0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(77,191,168,0.45)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(77,191,168,0.3)'; }}
            >
              Get Protected
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link
              href="/services/plans"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 28px', borderRadius: 100,
                background: 'transparent',
                color: 'var(--text-primary)', fontFamily: F.display,
                fontSize: '0.9rem', fontWeight: 600,
                border: '1.5px solid var(--border)',
                letterSpacing: '-0.01em', textDecoration: 'none',
                transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = A; e.currentTarget.style.color = A; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            >
              See Plans
            </Link>
          </motion.div>

          {/* CEO quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ maxWidth: 520, margin: '0 auto 56px', padding: '12px 20px', borderLeft: `2px solid rgba(77,191,168,0.35)`, background: 'rgba(77,191,168,0.04)', borderRadius: '0 10px 10px 0', textAlign: 'left' }}
          >
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, margin: 0, fontFamily: F.body }}>
              "Most software breaks silently after launch. Not because it was built badly — but because nobody was watching."
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '6px 0 0', fontFamily: F.mono, letterSpacing: '0.04em' }}>— Kamrul Hasan, CTO, SocioFi Technology</p>
          </motion.div>

          {/* Dashboard mockup */}
          <MonitoringDashboard />
        </div>

        <div className="srv-section-fade" />
      </section>

      {/* ══════════ 2. PROBLEM SECTION ══════════ */}
      <section style={{ padding: '100px 32px', background: 'var(--bg-2)', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="srv-sec-label" style={{ justifyContent: 'center' }}>THE REALITY</div>
            <h2 style={{ fontFamily: F.display, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: 16, maxWidth: 600, margin: '0 auto 16px' }}>
              Software Doesn't Stop Needing Care After Launch.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 28px', fontFamily: F.body }}>
              Your product is live. Your customers are using it. And right now, things are quietly going wrong — you just don't know it yet.
            </p>
            <blockquote style={{ maxWidth: 580, margin: '0 auto', fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65, borderLeft: '2px solid rgba(77,191,168,0.3)', paddingLeft: 20, textAlign: 'left', fontFamily: F.body }}>
              "We had a memory leak slowly killing our server every 3 days. We didn't know it was happening. SocioFi caught it on day two of monitoring."
              <footer style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6, fontFamily: F.mono, fontStyle: 'normal' }}>— Marcus T., Founder, TaskBridge</footer>
            </blockquote>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              {
                title: 'Security Vulnerabilities',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(220,80,80,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                ),
                desc: 'New vulnerabilities are discovered weekly in the packages your app depends on. Without regular patching, your software accumulates risk — silently.',
              },
              {
                title: 'Performance Degradation',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(220,80,80,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                ),
                desc: "Your product works great with 100 customers. At 1,000, slow queries and unoptimized endpoints start costing you. Growth breaks things you didn't expect.",
              },
              {
                title: 'Dependency Rot',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(220,80,80,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                ),
                desc: 'Your software uses dozens of third-party libraries. They release updates constantly. Ignoring them long enough means critical updates become breaking migrations.',
              },
              {
                title: 'Silent Downtime',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(220,80,80,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ),
                desc: 'Every hour of downtime costs you customers, reputation, and revenue. Without monitoring, you find out about outages when angry users tweet — not before.',
              },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger(i)} className="srv-problem-card">
                <div style={{ marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontFamily: F.display, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0, fontFamily: F.body }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="srv-section-fade" />
      </section>

      {/* ══════════ 3. CAPABILITIES ══════════ */}
      <section style={{ padding: '100px 32px', background: 'var(--bg)', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="srv-sec-label" style={{ justifyContent: 'center' }}>HOW WE PROTECT YOU</div>
            <h2 style={{ fontFamily: F.display, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--text-primary)', margin: '0 auto' }}>
              Six Ways We Keep Your Software Running.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              {
                title: '24/7 Monitoring',
                href: '/services/monitoring',
                desc: 'Real-time uptime checks, error rate tracking, and performance monitoring. We know when something breaks before your customers do.',
                status: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="srv-dot-green" />
                    <span className="srv-status-badge">24/7 ACTIVE</span>
                  </div>
                ),
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ),
              },
              {
                title: 'Security Patching',
                href: '/services/security',
                desc: 'Dependency audits, CVE scanning, and patch deployment on a schedule — not after a breach. Your stack stays current.',
                status: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="srv-dot-amber" />
                    <span className="srv-status-badge scanning">SCANNING</span>
                  </div>
                ),
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                ),
              },
              {
                title: 'Bug Fixes',
                href: '/services/bug-fixes',
                desc: 'Priority triage, root cause analysis, fixes deployed to staging first. Every bug fix includes a brief post-mortem.',
                status: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="srv-status-badge" style={{ fontSize: '0.7rem', letterSpacing: '0.04em', fontFamily: F.mono }}>&lt;4HR</span>
                  </div>
                ),
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                ),
              },
              {
                title: 'Feature Additions',
                href: '/services/feature-updates',
                desc: 'Scoped additions to your existing product. New integrations, pages, workflows — built on your architecture without breaking what works.',
                status: (
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: F.mono, marginBottom: 3 }}>4hrs/mo included</div>
                    <div className="srv-progress-track"><div className="srv-progress-fill" /></div>
                  </div>
                ),
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                ),
              },
              {
                title: 'Performance Optimization',
                href: '/services/performance',
                desc: 'Profiling, database tuning, caching layers, CDN configuration. We measure before and after — every change ships with documented improvements.',
                status: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="srv-dot-green" />
                    <span className="srv-status-badge optimizing">OPTIMIZING</span>
                  </div>
                ),
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                ),
              },
              {
                title: 'Agent Monitoring',
                href: '/services/agent-monitoring',
                desc: 'Dedicated observability for AI agents in production — token usage, failure loops, output quality, and auto-restart triggers.',
                status: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="srv-dot-neural" />
                    <span className="srv-status-badge">WATCHING</span>
                  </div>
                ),
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                ),
              },
            ].map((cap, i) => (
              <motion.div key={cap.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger(i % 3)} className="srv-cap-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  {cap.icon}
                  <div style={{ marginLeft: 'auto' }}>{cap.status}</div>
                </div>
                <h3 style={{ fontFamily: F.display, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 8 }}>{cap.title}</h3>
                <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 16px', fontFamily: F.body, flexGrow: 1 }}>{cap.desc}</p>
                <Link href={cap.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: A, fontFamily: F.mono, fontSize: '0.72rem', letterSpacing: '0.06em', textDecoration: 'none', fontWeight: 600 }}>
                  LEARN MORE
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 4. ONBOARDING PIPELINE ══════════ */}
      <section style={{ padding: '100px 32px', background: 'var(--bg-2)', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="srv-sec-label" style={{ justifyContent: 'center' }}>GETTING STARTED</div>
            <h2 style={{ fontFamily: F.display, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--text-primary)', maxWidth: 580, margin: '0 auto 12px' }}>
              From First Contact to Active Monitoring in 5 Days.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 480, margin: '0 auto', fontFamily: F.body }}>
              No long discovery phases. No months of onboarding. We're watching your production system within a week.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
            <OnboardingPipeline />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }} style={{ textAlign: 'center', marginTop: 40 }}>
            <Link
              href="/services/get-protected"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 100,
                background: `linear-gradient(135deg, #3A589E, ${A})`,
                color: 'white', fontFamily: F.display,
                fontSize: '0.88rem', fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(77,191,168,0.25)',
              }}
            >
              Start your onboarding
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </motion.div>
        </div>
        <div className="srv-section-fade" />
      </section>

      {/* ══════════ 5. SAME TEAM ══════════ */}
      <section style={{ padding: '100px 32px', background: 'var(--bg)', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="srv-sec-label" style={{ justifyContent: 'center' }}>THE DIFFERENCE</div>
            <h2 style={{ fontFamily: F.display, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--text-primary)', maxWidth: 540, margin: '0 auto 20px' }}>
              The Team That Built It Maintains It.
            </h2>
            <div className="srv-ceo-quote" style={{ maxWidth: 560, margin: '0 auto' }}>
              <p style={{ margin: 0 }}>"When the team that built your software is the same team maintaining it, nothing gets lost in translation. No knowledge transfer, no ramp-up time, no excuses."</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6, fontFamily: F.mono, fontStyle: 'normal', letterSpacing: '0.04em' }}>— Arifur Rahman, CEO</p>
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            {/* Left — usual way */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger(0)} style={{ opacity: 0.55 }}>
              <h3 style={{ fontFamily: F.mono, fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 20, textTransform: 'uppercase' }}>How It Usually Works</h3>
              {[
                'Agency builds your product',
                'Project ends. Agency moves on.',
                'Bug appears. You email support.',
                'Support doesn\'t know the codebase.',
                'They request full access. Again.',
                'Two weeks of back-and-forth.',
                'Bug fixed. Context lost. See you next time.',
              ].map((step, i) => (
                <div key={i} className="srv-compare-item">
                  <svg className="srv-compare-icon" viewBox="0 0 24 24" fill="none" stroke="rgba(220,80,80,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span style={{ color: 'var(--text-muted)' }}>{step}</span>
                </div>
              ))}
            </motion.div>
            {/* Right — SocioFi way */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger(0.15)}>
              <h3 style={{ fontFamily: F.mono, fontSize: '0.72rem', fontWeight: 600, color: A, letterSpacing: '0.06em', marginBottom: 20, textTransform: 'uppercase' }}>How SocioFi Services Works</h3>
              {[
                'SocioFi Studio builds your product',
                'Same team moves to Services plan',
                'Bug appears. We already saw it.',
                'We know the codebase — we wrote it.',
                'Fix in hours, not weeks.',
                'Post-mortem + prevention added.',
                'Continuous improvement, no interruption.',
              ].map((step, i) => (
                <div key={i} className="srv-compare-item" style={{ borderBottomColor: `rgba(77,191,168,0.1)` }}>
                  <svg className="srv-compare-icon" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ color: 'var(--text-primary)' }}>{step}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ 6. INCIDENT RESPONSE ══════════ */}
      <section style={{ padding: '100px 32px', background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="srv-sec-label" style={{ justifyContent: 'center' }}>WHEN THINGS GO WRONG</div>
            <h2 style={{ fontFamily: F.display, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--text-primary)', maxWidth: 580, margin: '0 auto 12px' }}>
              Detection to Resolution. Here's Exactly What Happens.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontFamily: F.body, maxWidth: 480, margin: '0 auto' }}>
              When production goes down, every minute counts. This is our exact playbook.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ marginBottom: 60 }}>
            <IncidentFlow />
          </motion.div>

          {/* Response time table */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: F.mono, fontSize: '0.72rem', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>RESPONSE TIME SLA BY PRIORITY &amp; PLAN</span>
              </div>
              <table className="srv-resp-table">
                <thead>
                  <tr>
                    <th>Priority</th>
                    <th>Essential</th>
                    <th>Growth</th>
                    <th>Scale</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { p: 'P1 — Production Down', e: '4 hours', g: '1 hour', s: '15 min', highlight: true },
                    { p: 'P2 — Major Feature Broken', e: '8 hours', g: '4 hours', s: '1 hour', highlight: false },
                    { p: 'P3 — Minor Bug', e: '24 hours', g: '8 hours', s: '4 hours', highlight: false },
                    { p: 'P4 — Cosmetic / Low', e: '72 hours', g: '24 hours', s: '8 hours', highlight: false },
                  ].map((row) => (
                    <tr key={row.p}>
                      <td>{row.p}</td>
                      <td>{row.e}</td>
                      <td className={row.highlight ? 'fast' : ''}>{row.g}</td>
                      <td className="fast">{row.s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
        <div className="srv-section-fade" />
      </section>

      {/* ══════════ 7. PLANS PREVIEW ══════════ */}
      <section style={{ padding: '100px 32px', background: 'var(--bg)', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="srv-sec-label" style={{ justifyContent: 'center' }}>PLANS</div>
            <h2 style={{ fontFamily: F.display, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--text-primary)', margin: '0 auto 12px' }}>
              Pick the Coverage That Fits.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontFamily: F.body, maxWidth: 420, margin: '0 auto' }}>
              Month-to-month. No lock-in. Upgrade or downgrade anytime.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
            {plans.map((plan, i) => (
              <motion.div key={plan.slug} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger(i)} className={`srv-plan-card${plan.badge ? ' popular' : ''}`}>
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16,
                    background: A, color: 'white',
                    fontFamily: F.mono, fontSize: '0.6rem', letterSpacing: '0.1em',
                    padding: '3px 8px', borderRadius: 100, fontWeight: 700,
                  }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ marginBottom: 6, fontFamily: F.mono, fontSize: '0.68rem', letterSpacing: '0.1em', color: A, fontWeight: 600 }}>
                  {plan.name.toUpperCase()}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontFamily: F.display, fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>${plan.price.toLocaleString()}</span>
                  <span style={{ fontFamily: F.body, fontSize: '0.85rem', color: 'var(--text-muted)' }}>/mo</span>
                </div>
                <p style={{ fontFamily: F.body, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 20 }}>{plan.tagline}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: F.body, lineHeight: 1.4 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/services/get-protected"
                  style={{
                    display: 'block', textAlign: 'center',
                    padding: '11px 20px', borderRadius: 100,
                    background: plan.badge ? `linear-gradient(135deg, #3A589E, ${A})` : 'transparent',
                    border: plan.badge ? 'none' : `1.5px solid var(--border)`,
                    color: plan.badge ? 'white' : 'var(--text-primary)',
                    fontFamily: F.display, fontSize: '0.88rem', fontWeight: 600,
                    textDecoration: 'none', marginTop: 'auto',
                    transition: 'all 0.25s',
                    boxShadow: plan.badge ? '0 4px 20px rgba(77,191,168,0.25)' : 'none',
                  }}
                >
                  Get {plan.name}
                </Link>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/services/plans" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: A, fontFamily: F.mono, fontSize: '0.75rem', letterSpacing: '0.08em', textDecoration: 'none', fontWeight: 600 }}>
              SEE FULL PLAN COMPARISON
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ 8. CROSS-DIVISION LIFECYCLE ══════════ */}
      <section style={{ padding: '100px 32px', background: 'var(--bg-2)', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="srv-sec-label" style={{ justifyContent: 'center' }}>THE FULL LIFECYCLE</div>
            <h2 style={{ fontFamily: F.display, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--text-primary)', maxWidth: 600, margin: '0 auto 12px' }}>
              Studio Builds. Services Maintains. You Focus on Business.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontFamily: F.body, maxWidth: 500, margin: '0 auto' }}>
              SocioFi divisions work together as a single engineering team for your entire product lifecycle.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="srv-lifecycle" style={{ gap: 0 }}>
              {[
                { label: 'SocioFi Studio', sub: 'Design & Build', accent: '#72C4B2' },
                null,
                { label: 'SocioFi Cloud', sub: 'Deploy & Host', accent: '#5BB5E0' },
                null,
                { label: 'SocioFi Services', sub: 'Monitor & Maintain', accent: A, highlight: true },
              ].map((node, i) => {
                if (!node) return (
                  <div key={i} className="srv-lc-arrow">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: 0.5 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                );
                return (
                  <div key={node.label} className="srv-lc-node">
                    <div className={`srv-lc-box${node.highlight ? ' highlight' : ''}`} style={{ borderColor: node.highlight ? `${A}60` : undefined }}>
                      <div style={{ fontFamily: F.display, fontSize: '0.95rem', fontWeight: 700, color: node.highlight ? A : 'var(--text-primary)' }}>{node.label}</div>
                    </div>
                    <div className="srv-lc-label">{node.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Agent side branch */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 1.5, height: 24, background: 'var(--border)' }} />
                <div style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', fontFamily: F.body, fontSize: '0.85rem', fontWeight: 600, color: '#8B5CF6', textAlign: 'center' }}>
                  SocioFi Agents
                  <div style={{ fontFamily: F.mono, fontSize: '0.65rem', color: 'rgba(139,92,246,0.7)', marginTop: 3, letterSpacing: '0.06em' }}>AI Agent Ops</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ 9. TESTIMONIALS ══════════ */}
      <section style={{ padding: '100px 32px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="srv-sec-label" style={{ justifyContent: 'center' }}>WHAT CLIENTS SAY</div>
            <h2 style={{ fontFamily: F.display, fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              From the People We Protect.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              {
                quote: 'We had a memory leak slowly killing our server every 3 days. SocioFi caught it on day two of monitoring, diagnosed it in an hour, and deployed the fix the same day. We didn\'t even know it was happening.',
                name: 'Marcus T.',
                role: 'Founder',
                company: 'TaskBridge',
              },
              {
                quote: 'The monthly reports are genuinely useful — not just a summary of what we already knew. They flag things we would never have thought to look at. Three months in and our P95 response time is down 40%.',
                name: 'Sarah K.',
                role: 'CTO',
                company: 'LoopDesk',
              },
              {
                quote: "We switched from a freelancer setup where every fix felt like a negotiation. Now we just open a ticket and it gets done. The SLA gives us confidence to promise things to our own customers.",
                name: 'David O.',
                role: 'CEO',
                company: 'Refinr',
              },
            ].map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger(i)} className="srv-testimonial">
                <div style={{ marginBottom: 16 }}>
                  <svg width="24" height="18" viewBox="0 0 24 18" fill={A} opacity={0.3} aria-hidden="true"><path d="M10.5 0C4.7 0 0 4.7 0 10.5v7.5h10.5V7.5H3c0-4.1 3.4-7.5 7.5-7.5V0zm13.5 0c-5.8 0-10.5 4.7-10.5 10.5v7.5H24V7.5h-7.5C16.5 3.4 19.9 0 24 0v0z"/></svg>
                </div>
                <p style={{ fontFamily: F.body, fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 20, fontStyle: 'italic' }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `rgba(77,191,168,0.15)`, border: `1px solid rgba(77,191,168,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: '0.85rem', fontWeight: 700, color: A }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontFamily: F.display, fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</div>
                    <div style={{ fontFamily: F.mono, fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{t.role} · {t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 10. METRICS BAR ══════════ */}
      <section style={{ padding: '60px 32px', background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="srv-metrics-bar">
              {[
                { num: '99.97%', label: 'average uptime across all clients' },
                { num: '<2hr', label: 'average P1 resolution time' },
                { num: '0', label: 'clients lost to preventable downtime' },
                { num: 'Day 1', label: 'same team from build to maintenance' },
              ].map((m, i) => (
                <div key={m.label} className="srv-metric-item">
                  <div className="srv-metric-num">{m.num}</div>
                  <div className="srv-metric-label">{m.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ 11. CTA ══════════ */}
      <section style={{ padding: '100px 32px', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        {/* Glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(77,191,168,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <div className="srv-sec-label" style={{ justifyContent: 'center', marginBottom: 20 }}>GET PROTECTED</div>
            <h2 style={{ fontFamily: F.display, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: 20 }}>
              Your Software Deserves{' '}
              <span className="srv-gradient-text">Professional Care.</span>
            </h2>
            <p style={{ fontFamily: F.body, fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Tell us what you've built and how many people use it. We'll look at the stack, the traffic, and the risk profile — then recommend the right plan.
            </p>
            <p style={{ fontFamily: F.body, fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 36 }}>
              Free initial audit. No commitment required.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/services/get-protected"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 32px', borderRadius: 100,
                  background: `linear-gradient(135deg, #3A589E, ${A})`,
                  color: 'white', fontFamily: F.display,
                  fontSize: '0.92rem', fontWeight: 600,
                  letterSpacing: '-0.01em', textDecoration: 'none',
                  boxShadow: '0 4px 24px rgba(77,191,168,0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(77,191,168,0.45)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(77,191,168,0.3)'; }}
              >
                Get Protected
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                href="/services/audit"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 32px', borderRadius: 100,
                  background: 'transparent',
                  color: 'var(--text-primary)', fontFamily: F.display,
                  fontSize: '0.92rem', fontWeight: 600,
                  border: '1.5px solid var(--border)',
                  letterSpacing: '-0.01em', textDecoration: 'none',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = A; e.currentTarget.style.color = A; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              >
                Start With an Audit
              </Link>
            </div>
            <p style={{ fontFamily: F.mono, fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 20, letterSpacing: '0.06em' }}>
              SETUP IN 48 HOURS · MONTH-TO-MONTH · CANCEL ANYTIME
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
