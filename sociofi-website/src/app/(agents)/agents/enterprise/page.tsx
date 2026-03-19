'use client';
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#8B5CF6';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};


const ICONS: Record<string, React.ReactElement> = {
  dollarSign: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  clipboard:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  user:       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  lock:       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};
const STYLES = `
  .ent-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .ent-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .ent-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .ent-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .ent-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .ent-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:540px; }
  .ent-section { padding:80px 0; }
  .ent-bg-alt { background:var(--bg-2); }
  .ent-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .ent-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .ent-features { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
  @media(max-width:768px) { .ent-features { grid-template-columns:1fr; } }
  .ent-feature { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:32px; border-left:3px solid ${A}; }
  .ent-feature-icon { display:flex; align-items:center; color:#8B5CF6; margin-bottom:12px; }
  .ent-feature-title { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; }
  .ent-feature-desc { font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); line-height:1.6; }
  .ent-integrations { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  @media(max-width:768px) { .ent-integrations { grid-template-columns:1fr 1fr; } }
  .ent-int { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:20px; }
  .ent-int-title { font-family:${F.h}; font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-bottom:6px; }
  .ent-int-desc { font-family:${F.b}; font-size:0.8rem; color:var(--text-secondary); line-height:1.5; }
  .ent-review-steps { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
  @media(max-width:768px) { .ent-review-steps { grid-template-columns:1fr 1fr; } }
  .ent-review-step { text-align:center; padding:20px; }
  .ent-review-num { font-family:${F.h}; font-size:2rem; font-weight:800; color:${A}; opacity:0.3; margin-bottom:8px; }
  .ent-review-title { font-family:${F.h}; font-size:0.88rem; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
  .ent-review-desc { font-family:${F.b}; font-size:0.78rem; color:var(--text-secondary); line-height:1.5; }
  .ent-form { background:var(--bg-card); border:1px solid rgba(139,92,246,0.3); border-radius:16px; padding:36px; max-width:640px; }
  .ent-field { margin-bottom:18px; }
  .ent-field-label { font-family:${F.h}; font-size:0.82rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px; display:block; }
  .ent-input { width:100%; padding:11px 14px; border-radius:8px; border:1.5px solid var(--border); background:var(--bg); color:var(--text-primary); font-family:${F.b}; font-size:0.88rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
  .ent-input:focus { border-color:${A}; }
  .ent-textarea { width:100%; padding:11px 14px; border-radius:8px; border:1.5px solid var(--border); background:var(--bg); color:var(--text-primary); font-family:${F.b}; font-size:0.88rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; resize:vertical; min-height:100px; }
  .ent-textarea:focus { border-color:${A}; }
  .ent-submit { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:14px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; border:none; cursor:pointer; }
  .ent-thanks { text-align:center; padding:32px 0; }
  .ent-thanks-title { font-family:${F.h}; font-size:1.2rem; font-weight:800; color:var(--text-primary); margin-bottom:8px; }
  .ent-thanks-desc { font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); line-height:1.7; }
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

const FEATURES = [
  { icon: 'dollarSign', title: 'Volume pricing', desc: 'Deploy 10+ agents with 25% discount applied automatically. Custom pricing available for 20+ agent deployments. Multi-year agreements unlock additional savings and locked-in rates.' },
  { icon: 'clipboard', title: 'SLA guarantees', desc: '99.9% uptime SLA with financial credits for breach. Dedicated status page. Incident escalation within 1 hour. Monthly SLA reports with root cause analysis.' },
  { icon: 'user', title: 'Dedicated support', desc: 'Assigned customer engineer on Slack. Weekly check-in calls during onboarding. Monthly strategy reviews. Direct escalation path to CTO for critical issues.' },
  { icon: 'lock', title: 'Security compliance', desc: 'SOC 2 Type II roadmap. GDPR-ready data processing agreements. Custom data retention policies. Private cloud deployment options. Full audit logs for compliance.' },
];

const CUSTOM_INTEGRATIONS = [
  { title: 'ERP Systems', desc: 'SAP, Oracle NetSuite, Microsoft Dynamics — direct API connections to your core systems.' },
  { title: 'Legacy Software', desc: 'Custom connectors for proprietary or legacy systems with RPA-style interfaces where needed.' },
  { title: 'Data Warehouses', desc: 'Snowflake, BigQuery, Redshift — agents that read and write to your analytics infrastructure.' },
  { title: 'Identity Providers', desc: 'SSO integration via Okta, Azure AD, or Google Workspace. RBAC matching your org structure.' },
  { title: 'Internal APIs', desc: 'Connect agents to your internal services and microservices via secure API integration.' },
  { title: 'Custom Webhooks', desc: 'Trigger agents from any event in your stack. Bi-directional webhook support with retry logic.' },
];

const REVIEW_STEPS = [
  { n: '01', title: 'Monthly report', desc: 'Performance metrics, task volumes, error rates, cost tracking.' },
  { n: '02', title: 'Quarterly review', desc: '45-min call reviewing ROI, optimizations, and roadmap alignment.' },
  { n: '03', title: 'Annual strategy', desc: 'Full-day planning session to evolve your agent architecture.' },
  { n: '04', title: 'On-demand access', desc: 'Book time with your customer engineer any time.' },
];

export default function EnterprisePage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', size: '', usecase: '' });

  return (
    <>
      <style>{STYLES}</style>

      <section className="ent-hero">
        <div className="ent-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="ent-label">Enterprise</div>
          </motion.div>
          <motion.h1 className="ent-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Enterprise Agent Deployments
          </motion.h1>
          <motion.p className="ent-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            For organizations deploying 10+ agents, with compliance requirements, custom integrations, or the need for dedicated engineering support.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="ent-section">
        <div className="ent-container">
          <Reveal>
            <div className="ent-label">Enterprise Tier</div>
            <h2 className="ent-h2" style={{ marginBottom: 8 }}>Built for scale and compliance</h2>
            <p className="ent-body" style={{ marginBottom: 40, maxWidth: 520 }}>Everything in the standard plans, plus the infrastructure and support that large organizations need.</p>
          </Reveal>
          <div className="ent-features">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <div className="ent-feature">
                  <div className="ent-feature-icon">{ICONS[f.icon]}</div>
                  <div className="ent-feature-title">{f.title}</div>
                  <div className="ent-feature-desc">{f.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Integrations */}
      <section className="ent-section ent-bg-alt">
        <div className="ent-container">
          <Reveal>
            <div className="ent-label">Integrations</div>
            <h2 className="ent-h2" style={{ marginBottom: 8 }}>Connect to anything in your stack</h2>
            <p className="ent-body" style={{ marginBottom: 40, maxWidth: 480 }}>Enterprise environments have complex, often proprietary systems. We build custom connectors for every environment.</p>
          </Reveal>
          <div className="ent-integrations">
            {CUSTOM_INTEGRATIONS.map((int, i) => (
              <Reveal key={int.title} delay={i * 0.07}>
                <div className="ent-int">
                  <div className="ent-int-title">{int.title}</div>
                  <div className="ent-int-desc">{int.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quarterly Review */}
      <section className="ent-section">
        <div className="ent-container">
          <Reveal>
            <div className="ent-label">Ongoing Partnership</div>
            <h2 className="ent-h2" style={{ marginBottom: 8 }}>Not a vendor — a partner</h2>
            <p className="ent-body" style={{ marginBottom: 40, maxWidth: 520 }}>Enterprise clients get a structured engagement model so your agent infrastructure evolves with your business.</p>
          </Reveal>
          <div className="ent-review-steps">
            {REVIEW_STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="ent-review-step">
                  <div className="ent-review-num">{s.n}</div>
                  <div className="ent-review-title">{s.title}</div>
                  <div className="ent-review-desc">{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="ent-section ent-bg-alt">
        <div className="ent-container">
          <Reveal>
            <div className="ent-label">Schedule a Consultation</div>
            <h2 className="ent-h2" style={{ marginBottom: 8 }}>Let&apos;s talk about your deployment</h2>
            <p className="ent-body" style={{ marginBottom: 36, maxWidth: 480 }}>Share your requirements and we&apos;ll schedule a 45-minute enterprise consultation within 2 business days.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="ent-form">
              {!submitted ? (
                <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="ent-field">
                      <label className="ent-field-label">Name *</label>
                      <input className="ent-input" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Smith" />
                    </div>
                    <div className="ent-field">
                      <label className="ent-field-label">Work email *</label>
                      <input className="ent-input" type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@company.com" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="ent-field">
                      <label className="ent-field-label">Company *</label>
                      <input className="ent-input" required value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Acme Corp" />
                    </div>
                    <div className="ent-field">
                      <label className="ent-field-label">Company size</label>
                      <input className="ent-input" value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))} placeholder="e.g. 200 employees" />
                    </div>
                  </div>
                  <div className="ent-field">
                    <label className="ent-field-label">What are you trying to automate?</label>
                    <textarea className="ent-textarea" value={form.usecase} onChange={e => setForm(p => ({ ...p, usecase: e.target.value }))} placeholder="Describe the workflows, volume, and compliance requirements..." style={{ minHeight: 120 }} />
                  </div>
                  <button className="ent-submit" type="submit">Schedule Enterprise Consultation →</button>
                </form>
              ) : (
                <div className="ent-thanks">
                  <div style={{color:"#8B5CF6",marginBottom:16,display:"flex"}}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                  <div className="ent-thanks-title">Request received.</div>
                  <div className="ent-thanks-desc">We&apos;ll email {form.email} within 2 business days to schedule your enterprise consultation. We look forward to it.</div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
