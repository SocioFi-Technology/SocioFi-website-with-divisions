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
  .sd-etl-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; position:relative; }
  @media(max-width:700px) { .sd-etl-steps { grid-template-columns:1fr; } }
  .sd-etl-step { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:24px; text-align:center; }
  .sd-etl-num { font-family:${F.m}; font-size:0.72rem; color:${A}; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:8px; }
  .sd-etl-title { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; }
  .sd-etl-body { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; }
  .sd-use-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
  .sd-use-list li { font-family:${F.b}; font-size:0.9rem; color:var(--text-secondary); display:flex; align-items:flex-start; gap:10px; line-height:1.6; }
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
    title: 'CRM to data warehouse sync',
    body: 'Pull records from Salesforce, HubSpot, or any CRM and load them into your analytics warehouse — clean, deduplicated, and on a schedule.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
  },
  {
    title: 'Form and event processing',
    body: 'Process form submissions, user events, or sensor data — validate, enrich, and route each record to the right destination in real time or in batches.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    title: 'Automated reporting pipelines',
    body: 'Compile data from multiple sources, apply business logic, and deliver formatted reports — daily, weekly, or on-demand — without manual work.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    title: 'Data normalization and deduplication',
    body: 'The unglamorous but critical work: standardizing formats, resolving duplicates, handling null values, and ensuring data quality before it reaches your database.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
];

const USE_CASES = [
  'Sync your CRM contacts to a data warehouse for analytics and reporting',
  'Process incoming webhook events and route them to the right internal systems',
  'Aggregate sales data from multiple channels into a single reporting database',
  'Automatically generate and distribute weekly reports from live data',
  'Migrate data from a legacy system to a new database with transformation and validation',
];

export default function DataPipelinesPage() {
  return (
    <>
      <style>{STYLES}</style>

      <section className="sd-hero">
        <div className="sd-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/studio/services/automation-integration" className="sd-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Automation & Integration
            </Link>
            <div className="sd-label">Data Pipeline Development</div>
          </motion.div>
          <motion.h1 className="sd-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Move Data Where It Needs to Go. Automatically.
          </motion.h1>
          <motion.p className="sd-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Data pipelines move information from where it lives to where it&apos;s useful — reliably, on schedule, without manual intervention. If you&apos;re copying data between systems by hand, there&apos;s a better way.
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

      {/* ETL explained */}
      <section className="sd-section sd-bg-alt">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">How It Works</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>Extract. Transform. Load.</h2>
            <p className="sd-body" style={{ marginBottom: 32, maxWidth: 560 }}>
              Every data pipeline follows the same three steps. The complexity is in the details — data formats, business logic, error handling, and scheduling.
            </p>
          </Reveal>
          <div className="sd-etl-steps">
            {[
              { step: '01 Extract', title: 'Get the data', body: 'Pull data from the source — database, API, file, CRM, spreadsheet. Handle auth, pagination, rate limits, and incremental updates.' },
              { step: '02 Transform', title: 'Clean and shape it', body: 'Apply business logic, normalize formats, deduplicate records, handle nulls, join with other data sources, validate quality.' },
              { step: '03 Load', title: 'Put it where it belongs', body: 'Write the processed data to the destination — database, warehouse, API, or file. Handle conflicts, retries, and confirmation.' },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.1}>
                <div className="sd-etl-step" style={{ borderTop: `3px solid ${A}` }}>
                  <div className="sd-etl-num">{s.step}</div>
                  <div className="sd-etl-title">{s.title}</div>
                  <div className="sd-etl-body">{s.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="sd-section">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">Use Cases</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>What data pipelines replace.</h2>
            <p className="sd-body" style={{ marginBottom: 24, maxWidth: 540 }}>
              If any of these sound familiar, a data pipeline is likely the right solution.
            </p>
            <ul className="sd-use-list">
              {USE_CASES.map((item, i) => (
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

      {/* Capabilities */}
      <section className="sd-section sd-bg-alt">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">What We Build</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>The pipelines we build most often.</h2>
            <p className="sd-body" style={{ marginBottom: 32, maxWidth: 520 }}>
              Each project is different, but these four categories cover the majority of what businesses need.
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
                <dd>1–3 weeks</dd>
              </dl>
              <dl className="sd-meta-item">
                <dt>Starting at</dt>
                <dd>$2,000</dd>
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
              <h2 className="sd-cta-title">Ready to automate your data flow?</h2>
              <p className="sd-cta-body">
                Tell us where the data lives, where it needs to go, and how often. We&apos;ll scope the pipeline and quote it before you commit.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/studio/start-project" className="sd-btn-pri">
                  Start a Project
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <Link href="/studio/services/automation-integration" className="sd-btn-ghost">Back to Automation</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
