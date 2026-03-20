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
  factory:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>,
  gitBranch:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
  link:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  trendingUp:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};
const STYLES = `
  .cu-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .cu-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .cu-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .cu-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .cu-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .cu-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:540px; }
  .cu-section { padding:80px 0; }
  .cu-bg-alt { background:var(--bg-2); }
  .cu-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .cu-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .cu-scenarios { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
  @media(max-width:768px) { .cu-scenarios { grid-template-columns:1fr; } }
  .cu-scenario { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:28px; border-left:3px solid ${A}; }
  .cu-scenario-icon { display:flex; align-items:center; color:#8B5CF6; margin-bottom:12px; }
  .cu-scenario-title { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; }
  .cu-scenario-desc { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; }
  .cu-timeline { display:flex; flex-direction:column; gap:0; position:relative; }
  .cu-timeline::before { content:''; position:absolute; left:16px; top:0; bottom:0; width:2px; background:var(--border); }
  .cu-step { display:flex; gap:24px; align-items:flex-start; padding:0 0 32px; position:relative; }
  .cu-step-dot { width:32px; height:32px; border-radius:50%; border:2px solid ${A}; background:var(--bg); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-family:${F.h}; font-size:0.8rem; font-weight:700; color:${A}; position:relative; z-index:1; }
  .cu-step-title { font-family:${F.h}; font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
  .cu-step-days { font-family:${F.m}; font-size:0.68rem; color:${A}; letter-spacing:0.08em; margin-bottom:6px; }
  .cu-step-desc { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; }
  .cu-pricing { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  @media(max-width:768px) { .cu-pricing { grid-template-columns:1fr; } }
  .cu-price-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:28px; }
  .cu-price-name { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; }
  .cu-price-build { font-family:${F.h}; font-size:1.6rem; font-weight:800; color:${A}; margin-bottom:4px; }
  .cu-price-mo { font-family:${F.m}; font-size:0.72rem; color:var(--text-muted); margin-bottom:12px; }
  .cu-price-desc { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; }
  .cu-form { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:36px; max-width:720px; }
  .cu-field { margin-bottom:20px; }
  .cu-field-label { font-family:${F.h}; font-size:0.82rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px; display:block; }
  .cu-input { width:100%; padding:11px 14px; border-radius:8px; border:1.5px solid var(--border); background:var(--bg); color:var(--text-primary); font-family:${F.b}; font-size:0.88rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
  .cu-input:focus { border-color:${A}; }
  .cu-textarea { width:100%; padding:11px 14px; border-radius:8px; border:1.5px solid var(--border); background:var(--bg); color:var(--text-primary); font-family:${F.b}; font-size:0.88rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; resize:vertical; min-height:100px; }
  .cu-textarea:focus { border-color:${A}; }
  .cu-submit { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:14px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; border:none; cursor:pointer; }
  .cu-submit:hover { opacity:0.9; }
  .cu-thanks { text-align:center; padding:32px 0; }
  .cu-thanks-title { font-family:${F.h}; font-size:1.2rem; font-weight:800; color:var(--text-primary); margin-bottom:8px; }
  .cu-thanks-desc { font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); line-height:1.7; }
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

const SCENARIOS = [
  { icon: 'factory', title: 'Industry-specific workflows', desc: 'Your industry has unique terminology, compliance requirements, or data formats that a generic catalog agent can\'t handle. We build it to your exact context.' },
  { icon: 'gitBranch', title: 'Multi-step workflows', desc: 'Your workflow crosses multiple systems, has complex branching logic, or involves orchestrating several sub-tasks in sequence. We architect the whole thing.' },
  { icon: 'link', title: 'Complex integrations', desc: 'You need to connect with internal systems, proprietary databases, legacy software, or APIs that have no existing connectors. We build the integration.' },
  { icon: 'trendingUp', title: 'High-volume processing', desc: 'You process thousands of records, emails, or documents per day. You need an agent built for scale, not just for occasional tasks.' },
];

const STEPS = [
  { n: '1', title: 'Scoping call', days: 'Day 1', desc: 'Free 45-minute call to understand your workflow, data sources, success criteria, and edge cases. No commitment.' },
  { n: '2', title: 'Proposal & pricing', days: 'Days 2–3', desc: 'We send a written proposal with scope, timeline, one-time build fee, and monthly subscription cost.' },
  { n: '3', title: 'Build phase', days: 'Weeks 2–6', desc: 'Engineering team builds and tests your agent in an isolated environment using sample data you provide.' },
  { n: '4', title: 'Integration & testing', days: 'Days before launch', desc: 'We connect to your live systems, run integration tests, and verify outputs match your expectations.' },
  { n: '5', title: 'Launch & handover', days: 'Go-live', desc: 'Agent goes live. We monitor the first two weeks, tune based on real usage, and hand over documentation.' },
];

const PRICING = [
  { name: 'Standard', build: '$2K–$4K', mo: '+ $199/month', desc: 'Single workflow, 2–4 integrations, moderate complexity. Delivery: 2–3 weeks.' },
  { name: 'Advanced', build: '$4K–$8K', mo: '+ $299/month', desc: 'Multi-step reasoning, branching logic, 5+ integrations, or high data volume. Delivery: 3–5 weeks.' },
  { name: 'Enterprise', build: '$8K–$15K', mo: '+ $399/month', desc: 'Complex multi-agent systems, custom ML, compliance requirements. Delivery: 4–8 weeks.' },
];

export default function CustomPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', workflow: '', inputs: '', outputs: '', systems: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <style>{STYLES}</style>

      <section className="cu-hero">
        <div className="cu-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="cu-label">Custom Agents</div>
          </motion.div>
          <motion.h1 className="cu-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Need an Agent That Doesn&apos;t<br />Exist Yet? We Build It.
          </motion.h1>
          <motion.p className="cu-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Our 16-agent catalog covers common workflows. But if your process is unique, complex, or industry-specific — we build exactly what you need.
          </motion.p>
        </div>
      </section>

      {/* Scenarios */}
      <section className="cu-section">
        <div className="cu-container">
          <Reveal>
            <div className="cu-label">When to Go Custom</div>
            <h2 className="cu-h2" style={{ marginBottom: 8 }}>Four reasons to build from scratch</h2>
            <p className="cu-body" style={{ marginBottom: 40, maxWidth: 480 }}>If any of these fit your situation, a custom agent will serve you better than anything in the catalog.</p>
          </Reveal>
          <div className="cu-scenarios">
            {SCENARIOS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="cu-scenario">
                  <div className="cu-scenario-icon">{ICONS[s.icon]}</div>
                  <div className="cu-scenario-title">{s.title}</div>
                  <div className="cu-scenario-desc">{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="cu-section cu-bg-alt">
        <div className="cu-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <Reveal>
            <div className="cu-label">The Process</div>
            <h2 className="cu-h2" style={{ marginBottom: 8 }}>From idea to running agent</h2>
            <p className="cu-body" style={{ marginBottom: 40 }}>Every custom build follows the same disciplined process. No surprises.</p>
            <div className="cu-timeline">
              {STEPS.map((s, i) => (
                <div key={s.n} className="cu-step">
                  <div className="cu-step-dot">{s.n}</div>
                  <div>
                    <div className="cu-step-title">{s.title}</div>
                    <div className="cu-step-days">{s.days}</div>
                    <div className="cu-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="cu-label">Pricing</div>
            <h2 className="cu-h2" style={{ marginBottom: 8 }}>Build fee + monthly</h2>
            <p className="cu-body" style={{ marginBottom: 24 }}>One-time build fee. Monthly subscription for hosting, monitoring, and support.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {PRICING.map((p, i) => (
                <div key={p.name} className="cu-price-card">
                  <div className="cu-price-name">{p.name}</div>
                  <div className="cu-price-build">{p.build}</div>
                  <div className="cu-price-mo">{p.mo}</div>
                  <div className="cu-price-desc">{p.desc}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Scoping Form */}
      <section className="cu-section">
        <div className="cu-container">
          <Reveal>
            <div className="cu-label">Start the Conversation</div>
            <h2 className="cu-h2" style={{ marginBottom: 8 }}>Tell us about your workflow</h2>
            <p className="cu-body" style={{ marginBottom: 36, maxWidth: 480 }}>Fill this out and we&apos;ll review before scheduling the scoping call. The more detail, the better.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="cu-form">
              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="cu-field">
                      <label className="cu-field-label">Your name *</label>
                      <input className="cu-input" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Smith" />
                    </div>
                    <div className="cu-field">
                      <label className="cu-field-label">Work email *</label>
                      <input className="cu-input" type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@company.com" />
                    </div>
                  </div>
                  <div className="cu-field">
                    <label className="cu-field-label">Describe the workflow you want to automate *</label>
                    <textarea className="cu-textarea" required value={form.workflow} onChange={e => setForm(p => ({ ...p, workflow: e.target.value }))} placeholder="e.g. We receive invoice PDFs from 20+ vendors via email, extract line items, validate against PO numbers, and enter them into our accounting system..." style={{ minHeight: 120 }} />
                  </div>
                  <div className="cu-field">
                    <label className="cu-field-label">What are the inputs to this workflow?</label>
                    <textarea className="cu-textarea" value={form.inputs} onChange={e => setForm(p => ({ ...p, inputs: e.target.value }))} placeholder="e.g. Email attachments (PDF), Slack messages, CSV files from Shopify..." />
                  </div>
                  <div className="cu-field">
                    <label className="cu-field-label">What outputs or actions do you need?</label>
                    <textarea className="cu-textarea" value={form.outputs} onChange={e => setForm(p => ({ ...p, outputs: e.target.value }))} placeholder="e.g. Updated spreadsheet, Slack notification, entry in QuickBooks..." />
                  </div>
                  <div className="cu-field">
                    <label className="cu-field-label">What systems does this need to connect to?</label>
                    <textarea className="cu-textarea" value={form.systems} onChange={e => setForm(p => ({ ...p, systems: e.target.value }))} placeholder="e.g. QuickBooks, Gmail, Google Sheets, our custom ERP API..." />
                  </div>
                  <button className="cu-submit" type="submit">Submit for Review →</button>
                </form>
              ) : (
                <div className="cu-thanks">
                  <div style={{color:"#8B5CF6",marginBottom:16,display:"flex"}}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                  <div className="cu-thanks-title">Received. We&apos;ll review and reach out.</div>
                  <div className="cu-thanks-desc">We&apos;ll email {form.email} within 1 business day to confirm we&apos;ve reviewed your scope. Scoping call typically happens within 2–3 business days.</div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Kamrul Quote */}
      <section className="cu-section cu-bg-alt" style={{ textAlign: 'center' }}>
        <div className="cu-container">
          <Reveal>
            <div style={{ maxWidth: 620, margin: '0 auto', background: 'var(--bg-card)', border: `1px solid rgba(139,92,246,0.2)`, borderRadius: 16, padding: '36px 40px' }}>
              <p style={{ fontFamily: F.h, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.5 }}>
                &ldquo;Our best custom agents came from founders who described their problem really clearly. The more specific you are about what&apos;s broken, the better the agent we build.&rdquo;
              </p>
              <div style={{ fontFamily: F.m, fontSize: '0.7rem', color: A, letterSpacing: '0.08em' }}>Kamrul Hasan · CTO, SocioFi Technology</div>
            </div>
            <div style={{ marginTop: 32, display: 'flex', gap: 14, justifyContent: 'center' }}>
              <Link href="/agents/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: 10, border: '1.5px solid var(--border)', color: 'var(--text-primary)', fontFamily: F.h, fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}>
                Browse the Catalog instead
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
