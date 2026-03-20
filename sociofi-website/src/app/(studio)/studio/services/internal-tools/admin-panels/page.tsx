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
  .sd-features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  @media(max-width:768px) { .sd-features-grid { grid-template-columns:1fr 1fr; } }
  @media(max-width:480px) { .sd-features-grid { grid-template-columns:1fr; } }
  .sd-feature-chip { background:var(--bg-card); border:1px solid var(--border); border-radius:10px; padding:14px 16px; display:flex; align-items:center; gap:10px; }
  .sd-feature-chip-dot { width:8px; height:8px; border-radius:50%; background:${A}; flex-shrink:0; }
  .sd-feature-chip-label { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); }
  .sd-solve-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
  .sd-solve-list li { font-family:${F.b}; font-size:0.9rem; color:var(--text-secondary); display:flex; align-items:flex-start; gap:10px; line-height:1.6; }
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
    title: 'CRUD interfaces',
    body: 'Create, read, update, and delete records in your database through a clean interface — no SQL required. Tables, forms, filters, search, and bulk actions.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    title: 'Role-based access control',
    body: 'Different team members see different things and can take different actions. Admins get everything; support gets customer management; finance gets billing.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    title: 'Audit logs',
    body: 'Every action logged — who did what, when, on which record. Essential for compliance, debugging, and accountability in any business-critical tool.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    title: 'Actions and workflows',
    body: 'Trigger operations from the admin panel — send a notification, apply a credit, reset a password, escalate a ticket — without touching the database directly.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

const STANDARD_FEATURES = [
  'Data tables with search, sort, and filter',
  'Form-based record creation and editing',
  'Bulk select and bulk actions',
  'CSV import and export',
  'User management (invite, suspend, reset)',
  'Audit log with timestamps and actor',
  'Role-based access control',
  'Full-text search across records',
  'Soft delete and restore',
  'Pagination and infinite scroll',
  'Inline editing',
  'Custom action buttons',
];

const SOLVE = [
  'Managing customer accounts without access to the production database',
  'Moderating user-generated content without a developer on call',
  'Applying manual adjustments (credits, overrides) to records',
  'Supporting customers by viewing their full account history',
  'Running internal reports without exporting to spreadsheets',
];

export default function AdminPanelsPage() {
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
            <div className="sd-label">Admin Panel Development</div>
          </motion.div>
          <motion.h1 className="sd-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Manage Your Product Without Touching the Database.
          </motion.h1>
          <motion.p className="sd-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Admin panels give your team the ability to manage users, content, and data through a secure interface — without a developer on call for every manual change. The tool you need the moment you have paying customers.
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

      {/* What it solves */}
      <section className="sd-section sd-bg-alt">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">What It Solves</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>Stop calling a developer every time something needs updating.</h2>
            <p className="sd-body" style={{ marginBottom: 24, maxWidth: 560 }}>
              Without an admin panel, every manual operation requires a developer to write a database query. With one, your team can handle it directly.
            </p>
            <ul className="sd-solve-list">
              {SOLVE.map((item, i) => (
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

      {/* Standard Features */}
      <section className="sd-section">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">Standard Features</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>What every admin panel includes.</h2>
            <p className="sd-body" style={{ marginBottom: 32, maxWidth: 520 }}>
              These are the baseline features every admin panel needs. Additional capabilities are scoped per project.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="sd-features-grid">
              {STANDARD_FEATURES.map((f, i) => (
                <div key={i} className="sd-feature-chip">
                  <div className="sd-feature-chip-dot" aria-hidden="true" />
                  <span className="sd-feature-chip-label">{f}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="sd-section sd-bg-alt">
        <div className="sd-container">
          <Reveal>
            <div className="sd-label">Core Capabilities</div>
            <h2 className="sd-h2" style={{ marginBottom: 8 }}>Built for the way your team actually works.</h2>
            <p className="sd-body" style={{ marginBottom: 32, maxWidth: 520 }}>
              More than a data viewer — an admin panel that lets your team take action, with the controls to do it safely.
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
              <h2 className="sd-cta-title">Ready to give your team control?</h2>
              <p className="sd-cta-body">
                Tell us what data your team needs to manage and what actions they need to take. We&apos;ll scope and build the right admin panel.
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
