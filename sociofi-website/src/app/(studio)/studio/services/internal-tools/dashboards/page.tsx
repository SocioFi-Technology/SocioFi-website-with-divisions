'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#72C4B2';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .sd-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(114,196,178,0.07) 0%,transparent 70%); }
  .sd-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .sd-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .sd-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .sd-h1 { font-family:${F.h}; font-size:clamp(2rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 16px; }
  .sd-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.75; color:var(--text-secondary); max-width:580px; margin:0 0 28px; }
  .sd-back { display:inline-flex; align-items:center; gap:6px; font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); text-decoration:none; margin-bottom:28px; transition:color 0.2s; }
  .sd-back:hover { color:${A}; }
  .sd-section { padding:80px 0; }
  .sd-bg-alt { background:var(--bg-2); }
  .sd-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .sd-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .sd-caps-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
  @media(max-width:640px) { .sd-caps-grid { grid-template-columns:1fr; } }
  .sd-cap-card { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:24px; transition:border-color 0.3s; }
  .sd-cap-card:hover { border-color:rgba(114,196,178,0.25); }
  .sd-cap-icon { width:40px; height:40px; border-radius:10px; background:rgba(114,196,178,0.1); display:flex; align-items:center; justify-content:center; margin-bottom:12px; color:${A}; }
  .sd-cap-title { font-family:${F.h}; font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; }
  .sd-cap-body { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.65; }
  .sd-meta-card { background:var(--bg-card); border:1px solid var(--border); border-left:3px solid ${A}; border-radius:14px; padding:28px 32px; display:flex; gap:48px; flex-wrap:wrap; }
  .sd-meta-item dt { font-family:${F.m}; font-size:0.68rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:6px; }
  .sd-meta-item dd { font-family:${F.h}; font-size:1.1rem; font-weight:700; color:var(--text-primary); margin:0; }
  .sd-dash-types { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  @media(max-width:768px) { .sd-dash-types { grid-template-columns:1fr; } }
  .sd-dash-type { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:22px; }
  .sd-dash-type-label { font-family:${F.m}; font-size:0.68rem; color:${A}; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:8px; }
  .sd-dash-type-title { font-family:${F.h}; font-size:0.92rem; font-weight:700; color:var(--text-primary); margin-bottom:6px; }
  .sd-dash-type-body { font-family:${F.b}; font-size:0.82rem; color:var(--text-secondary); line-height:1.6; }
  .sd-principles { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
  .sd-principles li { font-family:${F.b}; font-size:0.9rem; color:var(--text-secondary); display:flex; align-items:flex-start; gap:10px; line-height:1.6; }
  .sd-cta-box { background:var(--bg-card); border:1px solid var(--border); border-radius:18px; padding:48px; text-align:center; }
  .sd-cta-title { font-family:${F.h}; font-size:1.5rem; font-weight:700; color:var(--text-primary); letter-spacing:-0.015em; margin:0 0 10px; }
  .sd-cta-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; margin:0 0 24px; }
  .sd-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,#3A589E 0%,${A} 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; transition:transform 0.2s,box-shadow 0.2s; }
  .sd-btn-pri:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(58,88,158,0.35); }
  .sd-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; transition:border-color 0.2s,color 0.2s; }
  .sd-btn-ghost:hover { border-color:${A}; color:${A}; }
`;

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

const CAPABILITIES = [
  {
    title: 'Real-time data visualization',
    body: 'Live charts, gauges, and KPI cards that update as data changes. No refresh required. The right visual format for each metric.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    title: 'Multi-source data integration',
    body: 'Pull data from databases, APIs, spreadsheets, and third-party tools — unified in one view. No more switching between 5 tabs to understand what\'s happening.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>
      </svg>
    ),
  },
  {
    title: 'Drill-down and filtering',
    body: 'Summary views with the ability to dig into the detail when something looks off. Filter by date range, team, product, or any relevant dimension.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </svg>
    ),
  },
  {
    title: 'Automated report delivery',
    body: 'Scheduled email or Slack delivery of dashboard snapshots. Decision-makers get the data without logging in — formatted exactly as they need it.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
];

const DASH_TYPES = [
  {
    label: 'Operational',
    title: 'Day-to-day operations',
    body: 'Real-time status of ongoing work — orders, tickets, shipments, tasks. Built for the people doing the work.',
  },
  {
    label: 'Executive',
    title: 'High-level KPIs',
    body: 'Revenue, growth, key ratios. Weekly or monthly trends. Built for decision-makers who need the signal without the noise.',
  },
  {
    label: 'Analytics',
    title: 'Deep data exploration',
    body: 'Cohort analysis, funnel visualization, custom queries. Built for analysts who need to ask questions and get answers.',
  },
];

const GOOD_DASHBOARD = [
  'Shows the right metrics for the audience — not everything, just what matters',
  'Updates frequently enough to be actionable, not so often it\'s noise',
  'Makes anomalies obvious — bad numbers should stand out visually',
  'Loads fast — a dashboard that takes 10 seconds to load doesn\'t get used',
  'Has clear context — every metric should be understandable without explanation',
];

export default function DashboardsPage() {
  return (
    <>
      <style>{STYLES}</style>

      <section className="sd-hero">
        <div className="sd-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/studio/services/internal-tools" className="sd-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Internal Tools
            </Link>
            <div className="sd-label">Custom Dashboard Development</div>
          </motion.div>
          <motion.h1 className="sd-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            See What&apos;s Happening in Your Business — Right Now.
          </motion.h1>
          <motion.p className="sd-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Custom dashboards pull data from your actual systems and present exactly what each audience needs to make decisions. Built for your data, your metrics, and your team — not a generic template.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/studio/start-project" className="sd-btn-pri">
                Start a Project
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link href="/studio/pricing" className="sd-btn-ghost">See Pricing</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What makes a good dashboard */}
      <section className="sd-section sd-bg-alt">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">Design Principles</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>What makes a dashboard actually useful.</h2>
            <p className="sd-body" style={{ marginBottom: 24, maxWidth: 540 }}>
              Most dashboards get built once and stop being used. Here&apos;s how we avoid that.
            </p>
            <ul className="sd-principles">
              {GOOD_DASHBOARD.map((item, i) => (
                <li key={i}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Dashboard types */}
      <section className="sd-section">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">Dashboard Types</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>Three audiences, three dashboard types.</h2>
            <p className="sd-body" style={{ marginBottom: 32, maxWidth: 520 }}>
              The right dashboard depends on who&apos;s using it and what decisions they need to make. We build all three.
            </p>
          </Reveal>
          <div className="sd-dash-types">
            {DASH_TYPES.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.1}>
                <div className="sd-dash-type" style={{ borderTop: `3px solid ${A}` }}>
                  <div className="sd-dash-type-label">{d.label}</div>
                  <div className="sd-dash-type-title">{d.title}</div>
                  <div className="sd-dash-type-body">{d.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="sd-section sd-bg-alt">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">Capabilities</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>What every dashboard includes.</h2>
            <p className="sd-body" style={{ marginBottom: 32, maxWidth: 520 }}>
              More than pretty charts — a dashboard that integrates with your data sources and delivers it when you need it.
            </p>
          </Reveal>
          <div className="sd-caps-grid">
            {CAPABILITIES.map((cap, i) => (
              <Reveal key={cap.title} delay={i * 0.08}>
                <div className="sd-cap-card">
                  <div className="sd-cap-icon">{cap.icon}</div>
                  <div className="sd-cap-title">{cap.title}</div>
                  <div className="sd-cap-body">{cap.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline & Price */}
      <section className="sd-section">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">Timeline & Pricing</div>
            <h2 className="sd-h2" style={{ marginBottom: 24 }}>What to expect.</h2>
            <div className="sd-meta-card">
              <dl className="sd-meta-item">
                <dt>Timeline</dt>
                <dd>2–3 weeks</dd>
              </dl>
              <dl className="sd-meta-item">
                <dt>Starting at</dt>
                <dd>$3,000</dd>
              </dl>
              <dl className="sd-meta-item">
                <dt>Billing</dt>
                <dd>Fixed price</dd>
              </dl>
              <dl className="sd-meta-item">
                <dt>Ownership</dt>
                <dd>100% yours</dd>
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="sd-section sd-bg-alt">
        <div className="sd-container">
          <Reveal>
            <div className="sd-cta-box">
              <div className="sd-label" style={{ justifyContent: 'center' }}>Get Started</div>
              <h2 className="sd-cta-title">Ready to see your data clearly?</h2>
              <p className="sd-cta-body">
                Tell us what you need to track, where the data lives, and who needs to see it. We&apos;ll design and build the right dashboard.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/studio/start-project" className="sd-btn-pri">
                  Start a Project
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <Link href="/studio/services/internal-tools" className="sd-btn-ghost">Back to Internal Tools</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
