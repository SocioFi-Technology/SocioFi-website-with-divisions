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
  .sd-use-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  @media(max-width:768px) { .sd-use-grid { grid-template-columns:1fr; } }
  .sd-use-card { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:18px 20px; }
  .sd-use-title { font-family:${F.h}; font-size:0.88rem; font-weight:700; color:var(--text-primary); margin-bottom:6px; }
  .sd-use-body { font-family:${F.b}; font-size:0.8rem; color:var(--text-secondary); line-height:1.6; }
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
    title: 'Custom API development',
    body: 'REST or GraphQL APIs with proper error responses, rate limiting, versioning, input validation, and structured logging. Built for other systems to consume reliably.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    title: 'Third-party API integration',
    body: 'Connecting your app to Stripe, Salesforce, HubSpot, Twilio, SendGrid, Slack, or any platform with an API. Proper error handling, retry logic, and webhook processing.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>
      </svg>
    ),
  },
  {
    title: 'Webhook handling',
    body: 'Receiving and processing webhooks from payment processors, CRMs, communication platforms, and any service that pushes data to you.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    title: 'Authentication (OAuth, JWT, API keys)',
    body: 'Implementing auth flows for APIs — OAuth 2.0 for user-facing integrations, JWT for service-to-service, API key management with scoping and rotation.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
      </svg>
    ),
  },
];

const USE_CASES = [
  { title: 'CRM sync', body: 'New customer in your app automatically creates a contact in Salesforce or HubSpot.' },
  { title: 'Payment webhooks', body: 'Stripe fires an event, your app updates the user\'s subscription status in real time.' },
  { title: 'Communication APIs', body: 'Trigger SMS via Twilio or emails via SendGrid based on actions in your system.' },
  { title: 'Data export/import', body: 'Accept data from partner systems, transform it, and load it into your database.' },
  { title: 'OAuth integrations', body: 'Let your users connect their Google Calendar, GitHub, or Slack accounts to your app.' },
  { title: 'Public API', body: 'Expose your product\'s data to external developers with authentication, versioning, and documentation.' },
];

export default function APIPage() {
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
            <div className="sd-label">API Development & Integration</div>
          </motion.div>
          <motion.h1 className="sd-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Build APIs. Connect Systems. Stop Moving Data Manually.
          </motion.h1>
          <motion.p className="sd-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Whether you need to expose your own data as an API, connect to a third-party service, or handle incoming webhooks reliably — we build the connections that make your software ecosystem work together.
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

      {/* Use Cases */}
      <section className="sd-section sd-bg-alt">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">Common Use Cases</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>What people hire us to build.</h2>
            <p className="sd-body" style={{ marginBottom: 32, maxWidth: 540 }}>
              If your systems aren&apos;t talking to each other, or you need to expose your data to partners or your own front end, this is the work.
            </p>
          </Reveal>
          <div className="sd-use-grid">
            {USE_CASES.map((uc, i) => (
              <Reveal key={uc.title} delay={i * 0.06}>
                <div className="sd-use-card">
                  <div className="sd-use-title">{uc.title}</div>
                  <div className="sd-use-body">{uc.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="sd-section">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">Capabilities</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>What we build and how.</h2>
            <p className="sd-body" style={{ marginBottom: 32, maxWidth: 520 }}>
              APIs are only useful if they&apos;re reliable, documented, and secured. We build them right.
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
      <section className="sd-section sd-bg-alt">
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
      <section className="sd-section">
        <div className="sd-container">
          <Reveal>
            <div className="sd-cta-box">
              <div className="sd-label" style={{ justifyContent: 'center' }}>Get Started</div>
              <h2 className="sd-cta-title">Ready to connect your systems?</h2>
              <p className="sd-cta-body">
                Tell us what you need to connect, what data needs to flow where, and how often. We&apos;ll scope it and quote it before you commit.
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
