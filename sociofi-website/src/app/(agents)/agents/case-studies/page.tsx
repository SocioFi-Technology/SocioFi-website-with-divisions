'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#8B5CF6';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .cs-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .cs-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .cs-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .cs-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .cs-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .cs-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:540px; }
  .cs-section { padding:80px 0; }
  .cs-bg-alt { background:var(--bg-2); }
  .cs-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .cs-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .cs-cards { display:flex; flex-direction:column; gap:32px; }
  .cs-card { background:var(--bg-card); border:1px solid var(--border); border-radius:20px; overflow:hidden; display:grid; grid-template-columns:1fr 1.4fr; }
  @media(max-width:900px) { .cs-card { grid-template-columns:1fr; } }
  .cs-card-left { padding:40px; background:linear-gradient(135deg,rgba(139,92,246,0.06) 0%,rgba(139,92,246,0.02) 100%); display:flex; flex-direction:column; }
  .cs-card-tag { font-family:${F.m}; font-size:0.68rem; color:${A}; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:12px; }
  .cs-card-name { font-family:${F.h}; font-size:1.4rem; font-weight:800; color:var(--text-primary); margin-bottom:8px; }
  .cs-card-desc { font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); line-height:1.6; flex:1; margin-bottom:20px; }
  .cs-card-metrics { display:flex; gap:24px; flex-wrap:wrap; margin-bottom:24px; }
  .cs-metric { }
  .cs-metric-val { font-family:${F.h}; font-size:1.4rem; font-weight:800; color:${A}; }
  .cs-metric-label { font-family:${F.b}; font-size:0.76rem; color:var(--text-muted); }
  .cs-card-link { display:inline-flex; align-items:center; gap:6px; padding:10px 20px; border-radius:8px; border:1.5px solid rgba(139,92,246,0.4); color:${A}; font-family:${F.h}; font-size:0.84rem; font-weight:600; text-decoration:none; transition:background 0.2s; width:fit-content; }
  .cs-card-link:hover { background:rgba(139,92,246,0.08); }
  .cs-card-right { padding:40px; display:flex; flex-direction:column; gap:20px; border-left:1px solid var(--border); }
  .cs-detail-label { font-family:${F.m}; font-size:0.68rem; color:var(--text-muted); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:6px; }
  .cs-detail-val { font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); line-height:1.6; }
  .cs-detail-title { font-family:${F.h}; font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
  .cs-agents-used { display:flex; flex-wrap:wrap; gap:8px; }
  .cs-agent-tag { font-family:${F.m}; font-size:0.68rem; color:${A}; background:rgba(139,92,246,0.1); border-radius:100px; padding:4px 12px; }
  .cs-context { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:32px; max-width:720px; margin:0 auto; border-left:3px solid ${A}; }
  .cs-context-title { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; }
  .cs-context-body { font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); line-height:1.7; }
  .cs-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .cs-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .cs-btn-ghost:hover { border-color:${A}; color:${A}; }
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

const CASES = [
  {
    tag: 'Multi-Agent Platform · Products Division',
    name: 'FabricxAI',
    desc: 'FabricxAI is SocioFi\'s flagship multi-agent platform for e-commerce automation. It orchestrates 8+ specialized agents to handle product catalog management, order processing, customer communication, inventory alerts, and supplier coordination — all working in parallel.',
    metrics: [{ val: '8+', label: 'Agents deployed' }, { val: '~40h', label: 'Saved per week' }, { val: '<2min', label: 'Order-to-confirmation' }],
    link: '/products/fabricxai',
    linkLabel: 'View FabricxAI →',
    agents: ['Report Generator', 'Inventory Monitor', 'Customer Service Agent', 'Email Triage Agent', 'Document Processor'],
    challenge: 'E-commerce operators were spending hours each day manually managing product listings, responding to order inquiries, and tracking stock across multiple channels.',
    solution: 'A coordinated multi-agent system where each agent owns one domain — inventory, communication, reporting — and passes context between them.',
    outcome: 'Operators now monitor via a single dashboard instead of manually checking 6 different tools. Support response time dropped from 4h to under 2 minutes.',
  },
  {
    tag: 'Conversational AI Platform · Products Division',
    name: 'NEXUS ARIA',
    desc: 'NEXUS ARIA is a custom multi-agent conversational intelligence platform. It uses a network of specialized agents to understand user intent, retrieve relevant context, generate responses, and continuously improve from interactions — across customer service, internal support, and knowledge management.',
    metrics: [{ val: '12+', label: 'Agent types' }, { val: '94%', label: 'First-contact resolution' }, { val: '24/7', label: 'Coverage' }],
    link: '/products/nexus-aria',
    linkLabel: 'View NEXUS ARIA →',
    agents: ['Customer Service Agent', 'Ticket Triage Agent', 'Knowledge Base Agent', 'Sentiment Analyzer'],
    challenge: 'Companies were relying on rigid FAQ bots that failed on any question that didn\'t exactly match a trained response.',
    solution: 'A reasoning-first architecture where agents understand context and intent, not just keywords — with escalation paths built into every flow.',
    outcome: '94% of inquiries handled without human escalation, with full audit trail and continuous learning from every interaction.',
  },
  {
    tag: 'Internal Infrastructure · Labs Division',
    name: 'Internal Agent Pipeline',
    desc: 'SocioFi\'s own engineering team uses a suite of internal agents to handle code review summaries, release notes generation, incident reports, client communication drafts, and performance monitoring — freeing engineers to focus on architecture and problem-solving instead of documentation.',
    metrics: [{ val: '6', label: 'Internal agents' }, { val: '~20h', label: 'Saved weekly' }, { val: '100%', label: 'Internal usage' }],
    link: '/labs',
    linkLabel: 'Visit SocioFi Labs →',
    agents: ['Report Generator', 'Meeting Summarizer', 'Email Triage Agent', 'Document Processor'],
    challenge: 'Engineering teams were spending significant time on status reports, meeting notes, and client update drafts — all repetitive, low-leverage work.',
    solution: 'A suite of catalog agents deployed on our own infrastructure, connected to our project management tools and communication channels.',
    outcome: 'Engineers now spend virtually zero time on documentation. All reports, summaries, and updates are generated automatically and reviewed in minutes.',
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <style>{STYLES}</style>

      <section className="cs-hero">
        <div className="cs-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="cs-label">Case Studies</div>
          </motion.div>
          <motion.h1 className="cs-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Agents in Production.<br />Not in Theory.
          </motion.h1>
          <motion.p className="cs-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            These aren&apos;t demos. These are live deployments powering real products and internal workflows at SocioFi — built with the same catalog agents available to you.
          </motion.p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-cards">
            {CASES.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.1}>
                <div className="cs-card">
                  <div className="cs-card-left">
                    <div className="cs-card-tag">{c.tag}</div>
                    <div className="cs-card-name">{c.name}</div>
                    <div className="cs-card-desc">{c.desc}</div>
                    <div className="cs-card-metrics">
                      {c.metrics.map(m => (
                        <div key={m.label} className="cs-metric">
                          <div className="cs-metric-val">{m.val}</div>
                          <div className="cs-metric-label">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <Link href={c.link} className="cs-card-link">{c.linkLabel}</Link>
                  </div>
                  <div className="cs-card-right">
                    <div>
                      <div className="cs-detail-label">The Challenge</div>
                      <div className="cs-detail-val">{c.challenge}</div>
                    </div>
                    <div>
                      <div className="cs-detail-label">The Approach</div>
                      <div className="cs-detail-val">{c.solution}</div>
                    </div>
                    <div>
                      <div className="cs-detail-label">The Outcome</div>
                      <div className="cs-detail-val">{c.outcome}</div>
                    </div>
                    <div>
                      <div className="cs-detail-label">Agents Used</div>
                      <div className="cs-agents-used">
                        {c.agents.map(a => <span key={a} className="cs-agent-tag">{a}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Context Note */}
      <section className="cs-section cs-bg-alt">
        <div className="cs-container">
          <Reveal>
            <div className="cs-context">
              <div className="cs-context-title">Catalog agents vs. multi-agent platforms</div>
              <div className="cs-context-body">
                The products above (FabricxAI, NEXUS ARIA) are multi-agent platforms — architectures where multiple specialized agents work together. The catalog agents on this site are individual, standalone agents you subscribe to separately. <br /><br />
                Many clients start with 1–3 catalog agents, then later combine them into more sophisticated workflows. If you need a fully orchestrated multi-agent system from day one, that&apos;s a custom project — talk to us about it.
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="cs-section" style={{ textAlign: 'center' }}>
        <div className="cs-container">
          <Reveal>
            <h2 className="cs-h2" style={{ marginBottom: 12 }}>Ready to build your own?</h2>
            <p className="cs-body" style={{ maxWidth: 420, margin: '0 auto 28px' }}>
              Start with the catalog. Add more as you need. Or tell us what you&apos;re trying to automate and we&apos;ll design the right approach.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/agents/catalog" className="cs-btn-pri">Browse the Catalog →</Link>
              <Link href="/agents/custom" className="cs-btn-ghost">Custom Build</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
