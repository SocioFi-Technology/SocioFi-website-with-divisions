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
  .sd-auto-types { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  @media(max-width:768px) { .sd-auto-types { grid-template-columns:1fr; } }
  .sd-auto-type { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:22px; }
  .sd-auto-type-label { font-family:${F.m}; font-size:0.68rem; color:${A}; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:8px; }
  .sd-auto-type-title { font-family:${F.h}; font-size:0.92rem; font-weight:700; color:var(--text-primary); margin-bottom:6px; }
  .sd-auto-type-body { font-family:${F.b}; font-size:0.82rem; color:var(--text-secondary); line-height:1.6; }
  .sd-insight { background:var(--bg-card); border:1px solid var(--border); border-left:3px solid ${A}; border-radius:14px; padding:28px 32px; }
  .sd-insight-title { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:10px; }
  .sd-insight-body { font-family:${F.b}; font-size:0.9rem; color:var(--text-secondary); line-height:1.7; }
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
    title: 'Workflow analysis',
    body: 'Before writing code, we map your current process — steps, decision points, exceptions, and who does what. This is where we find the automation opportunities you didn\'t know you had.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
  {
    title: 'Custom automation code',
    body: 'When Zapier or Make can\'t handle the complexity — custom logic, multi-step decisions, error handling, retry mechanisms — we write automation that behaves exactly as the business requires.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    title: 'Approval and escalation flows',
    body: 'Workflows that require human review at certain steps — send a notification, wait for approval, branch based on the decision, and continue automatically.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: 'Monitoring and alerting',
    body: 'Automation that breaks silently is worse than no automation. We build in logging, failure alerts, and dashboards so you always know what\'s running and what isn\'t.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
];

const AUTO_TYPES = [
  {
    label: 'Trigger-based',
    title: 'When this happens, do that',
    body: 'A new lead comes in → create a task, send a Slack message, add to CRM. Event-driven, immediate.',
  },
  {
    label: 'Scheduled',
    title: 'On a set schedule',
    body: 'Every Monday at 9am → generate the weekly report, email it to the team, archive last week\'s data.',
  },
  {
    label: 'Event-driven',
    title: 'In response to system events',
    body: 'When a payment fails → pause access, notify the account owner, start the retry sequence three days later.',
  },
];

export default function WorkflowPage() {
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
            <div className="sd-label">Workflow Automation</div>
          </motion.div>
          <motion.h1 className="sd-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Automate the Work That Shouldn&apos;t Require a Human.
          </motion.h1>
          <motion.p className="sd-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Workflow automation replaces repetitive manual processes with code that runs reliably, on schedule or on trigger, without anyone having to remember to do it. If your team does the same thing more than once a week, it can probably be automated.
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

      {/* Beyond Zapier */}
      <section className="sd-section sd-bg-alt">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">When You&apos;ve Outgrown Zapier</div>
            <h2 className="sd-h2" style={{ marginBottom: 16 }}>Custom automation — when no-code tools hit their limit.</h2>
            <div className="sd-insight">
              <div className="sd-insight-title">Zapier and Make are great tools. Until they&apos;re not.</div>
              <div className="sd-insight-body">
                No-code automation tools handle simple linear workflows well. But when you need conditional branching based on business logic, complex error handling, multi-step decision trees, or integration with internal systems that don&apos;t have pre-built connectors — you need code. We build the automation that no-code tools can&apos;t, and we build it to run reliably in production for years.
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Types of automation */}
      <section className="sd-section">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">Automation Types</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>Three patterns, every business.</h2>
            <p className="sd-body" style={{ marginBottom: 32, maxWidth: 520 }}>
              Almost every workflow automation falls into one of these three categories. Many workflows combine all three.
            </p>
          </Reveal>
          <div className="sd-auto-types">
            {AUTO_TYPES.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.1}>
                <div className="sd-auto-type" style={{ borderTop: `3px solid ${A}` }}>
                  <div className="sd-auto-type-label">{t.label}</div>
                  <div className="sd-auto-type-title">{t.title}</div>
                  <div className="sd-auto-type-body">{t.body}</div>
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
            <div className="sd-label">What We Build</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>From analysis to running automation.</h2>
            <p className="sd-body" style={{ marginBottom: 32, maxWidth: 520 }}>
              We start with understanding the workflow before touching code. The best automation comes from understanding what the business actually needs.
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
                <dd>1–4 weeks</dd>
              </dl>
              <dl className="sd-meta-item">
                <dt>Starting at</dt>
                <dd>$2,500</dd>
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
              <h2 className="sd-cta-title">Ready to automate your workflow?</h2>
              <p className="sd-cta-body">
                Describe the manual process you want to eliminate. We&apos;ll map it, scope the automation, and quote it before you commit.
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
