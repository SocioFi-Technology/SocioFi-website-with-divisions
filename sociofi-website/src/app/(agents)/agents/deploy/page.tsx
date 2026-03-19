'use client';
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { agents, CATEGORY_META } from '@/lib/agents';

const A = '#8B5CF6';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .dp-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .dp-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .dp-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .dp-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .dp-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .dp-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:540px; }
  .dp-paths { display:grid; grid-template-columns:1fr 1fr; gap:32px; padding:72px 0 80px; align-items:start; }
  @media(max-width:768px) { .dp-paths { grid-template-columns:1fr; } }
  .dp-path { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:32px; }
  .dp-path.active-path { border-color:rgba(139,92,246,0.4); }
  .dp-path-label { font-family:${F.m}; font-size:0.68rem; color:${A}; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:12px; }
  .dp-path-title { font-family:${F.h}; font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; }
  .dp-path-desc { font-family:${F.b}; font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin-bottom:24px; }
  .dp-agent-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:24px; }
  .dp-agent-chip { padding:10px 14px; border-radius:10px; border:1.5px solid var(--border); cursor:pointer; transition:all 0.2s; background:var(--bg); }
  .dp-agent-chip.sel { border-color:${A}; background:rgba(139,92,246,0.08); }
  .dp-agent-chip-name { font-family:${F.h}; font-size:0.82rem; font-weight:600; color:var(--text-primary); margin-bottom:2px; }
  .dp-agent-chip-cat { font-family:${F.m}; font-size:0.64rem; color:var(--text-muted); }
  .dp-agent-chip.sel .dp-agent-chip-name { color:${A}; }
  .dp-field { margin-bottom:16px; }
  .dp-label-sm { font-family:${F.h}; font-size:0.82rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px; display:block; }
  .dp-input { width:100%; padding:11px 14px; border-radius:8px; border:1.5px solid var(--border); background:var(--bg); color:var(--text-primary); font-family:${F.b}; font-size:0.88rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
  .dp-input:focus { border-color:${A}; }
  .dp-textarea { width:100%; padding:11px 14px; border-radius:8px; border:1.5px solid var(--border); background:var(--bg); color:var(--text-primary); font-family:${F.b}; font-size:0.88rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; resize:vertical; min-height:100px; }
  .dp-textarea:focus { border-color:${A}; }
  .dp-btn { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:14px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; border:none; cursor:pointer; transition:opacity 0.2s; }
  .dp-btn:hover { opacity:0.9; }
  .dp-btn:disabled { opacity:0.5; cursor:not-allowed; }
  .dp-selected-list { font-family:${F.m}; font-size:0.72rem; color:${A}; margin-bottom:16px; }
  .dp-thanks { text-align:center; padding:40px 0; }
  .dp-thanks-icon { display:flex; align-items:center; justify-content:center; margin-bottom:16px; color:#8B5CF6; }
  .dp-thanks-title { font-family:${F.h}; font-size:1.3rem; font-weight:800; color:var(--text-primary); margin-bottom:8px; }
  .dp-thanks-desc { font-family:${F.b}; font-size:0.9rem; color:var(--text-secondary); line-height:1.7; max-width:380px; margin:0 auto; }
  .dp-trust { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; padding:0 0 80px; }
  @media(max-width:768px) { .dp-trust { grid-template-columns:1fr; } }
  .dp-trust-item { text-align:center; padding:20px; }
  .dp-trust-num { font-family:${F.h}; font-size:1.8rem; font-weight:800; color:${A}; margin-bottom:4px; }
  .dp-trust-label { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); }
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

export default function DeployPage() {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [pathASubmitted, setPathASubmitted] = useState(false);
  const [pathBSubmitted, setPathBSubmitted] = useState(false);
  const [formA, setFormA] = useState({ company: '', name: '', email: '', systems: '' });
  const [formB, setFormB] = useState({ name: '', email: '', company: '', message: '' });

  const toggleAgent = (slug: string) => {
    setSelectedAgents(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const handleSubmitA = (e: React.FormEvent) => {
    e.preventDefault();
    setPathASubmitted(true);
  };

  const handleSubmitB = (e: React.FormEvent) => {
    e.preventDefault();
    setPathBSubmitted(true);
  };

  return (
    <>
      <style>{STYLES}</style>

      <section className="dp-hero">
        <div className="dp-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="dp-label">Deploy</div>
          </motion.div>
          <motion.h1 className="dp-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Tell Us What You Need.<br />We&apos;ll Make It Happen.
          </motion.h1>
          <motion.p className="dp-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Two paths: know exactly what you want, or need help figuring it out. Both get you to running agents in 3–7 business days.
          </motion.p>
        </div>
      </section>

      <div className="dp-container">
        <div className="dp-paths">
          {/* Path A */}
          <Reveal>
            <div className={`dp-path${selectedAgents.length > 0 ? ' active-path' : ''}`}>
              <div className="dp-path-label">Path A</div>
              <div className="dp-path-title">I Know What I Want</div>
              <div className="dp-path-desc">Select the agents you want deployed. We&apos;ll send a setup plan within 1 business day.</div>

              {!pathASubmitted ? (
                <form onSubmit={handleSubmitA}>
                  <div style={{ fontFamily: F.h, fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
                    Select agents (click to select multiple):
                  </div>
                  <div className="dp-agent-grid">
                    {agents.map(agent => (
                      <div
                        key={agent.slug}
                        className={`dp-agent-chip${selectedAgents.includes(agent.slug) ? ' sel' : ''}`}
                        onClick={() => toggleAgent(agent.slug)}
                      >
                        <div className="dp-agent-chip-name">{agent.name}</div>
                        <div className="dp-agent-chip-cat">{CATEGORY_META[agent.category].label} · ${agent.price}/mo</div>
                      </div>
                    ))}
                  </div>

                  {selectedAgents.length > 0 && (
                    <div className="dp-selected-list">
                      {selectedAgents.length} agent{selectedAgents.length > 1 ? 's' : ''} selected
                      {selectedAgents.length >= 3 && ` · Bundle discount applies`}
                    </div>
                  )}

                  <div className="dp-field">
                    <label className="dp-label-sm">Your name *</label>
                    <input className="dp-input" required value={formA.name} onChange={e => setFormA(p => ({ ...p, name: e.target.value }))} placeholder="Jane Smith" />
                  </div>
                  <div className="dp-field">
                    <label className="dp-label-sm">Work email *</label>
                    <input className="dp-input" type="email" required value={formA.email} onChange={e => setFormA(p => ({ ...p, email: e.target.value }))} placeholder="jane@company.com" />
                  </div>
                  <div className="dp-field">
                    <label className="dp-label-sm">Company name</label>
                    <input className="dp-input" value={formA.company} onChange={e => setFormA(p => ({ ...p, company: e.target.value }))} placeholder="Acme Inc." />
                  </div>
                  <div className="dp-field">
                    <label className="dp-label-sm">Systems you use (CRM, email, etc.)</label>
                    <textarea className="dp-textarea" value={formA.systems} onChange={e => setFormA(p => ({ ...p, systems: e.target.value }))} placeholder="e.g. HubSpot, Gmail, Google Sheets, Slack" />
                  </div>
                  <button className="dp-btn" type="submit" disabled={selectedAgents.length === 0 || !formA.name || !formA.email}>
                    Submit Deployment Request →
                  </button>
                </form>
              ) : (
                <div className="dp-thanks">
                  <div className="dp-thanks-icon"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                  <div className="dp-thanks-title">Request received.</div>
                  <div className="dp-thanks-desc">We&apos;ll send a setup plan to {formA.email} within 1 business day. Your selected agents: {selectedAgents.join(', ')}.</div>
                </div>
              )}
            </div>
          </Reveal>

          {/* Path B */}
          <Reveal delay={0.15}>
            <div className="dp-path">
              <div className="dp-path-label">Path B</div>
              <div className="dp-path-title">I Need Help Deciding</div>
              <div className="dp-path-desc">Tell us about your business and what&apos;s slowing you down. We&apos;ll recommend the right agents on a free 30-minute call.</div>

              {!pathBSubmitted ? (
                <form onSubmit={handleSubmitB}>
                  <div className="dp-field">
                    <label className="dp-label-sm">Your name *</label>
                    <input className="dp-input" required value={formB.name} onChange={e => setFormB(p => ({ ...p, name: e.target.value }))} placeholder="Jane Smith" />
                  </div>
                  <div className="dp-field">
                    <label className="dp-label-sm">Work email *</label>
                    <input className="dp-input" type="email" required value={formB.email} onChange={e => setFormB(p => ({ ...p, email: e.target.value }))} placeholder="jane@company.com" />
                  </div>
                  <div className="dp-field">
                    <label className="dp-label-sm">Company & what you do</label>
                    <input className="dp-input" value={formB.company} onChange={e => setFormB(p => ({ ...p, company: e.target.value }))} placeholder="e.g. Acme Inc. — B2B SaaS for HR teams" />
                  </div>
                  <div className="dp-field">
                    <label className="dp-label-sm">What&apos;s taking too much of your team&apos;s time?</label>
                    <textarea className="dp-textarea" required value={formB.message} onChange={e => setFormB(p => ({ ...p, message: e.target.value }))} placeholder="e.g. We manually qualify leads from our contact form every morning, process invoices from email, and write the same support responses 50 times a day..." style={{ minHeight: 140 }} />
                  </div>
                  <button className="dp-btn" type="submit" disabled={!formB.name || !formB.email || !formB.message}>
                    Book a Free Consultation →
                  </button>
                </form>
              ) : (
                <div className="dp-thanks">
                  <div className="dp-thanks-icon"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                  <div className="dp-thanks-title">We&apos;ll be in touch.</div>
                  <div className="dp-thanks-desc">We&apos;ll email {formB.email} within 4 business hours to book your 30-minute call. No sales pitch — just an honest recommendation.</div>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* Trust signals */}
        <div className="dp-trust">
          <Reveal>
            <div className="dp-trust-item">
              <div className="dp-trust-num">1 day</div>
              <div className="dp-trust-label">Response time after you submit</div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="dp-trust-item">
              <div className="dp-trust-num">3–7 days</div>
              <div className="dp-trust-label">From signup to agent running live</div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="dp-trust-item">
              <div className="dp-trust-num">No lock-in</div>
              <div className="dp-trust-label">Cancel anytime, 30-day notice</div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
