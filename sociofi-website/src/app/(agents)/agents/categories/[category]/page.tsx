'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { agents, CATEGORY_META, type AgentCategory } from '@/lib/agents';

const A = '#8B5CF6';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .cat-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .cat-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .cat-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .cat-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .cat-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .cat-h1 .vi { background:linear-gradient(135deg,${A} 0%,#C4B5FD 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .cat-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:540px; }
  .cat-section { padding:80px 0; }
  .cat-bg-alt { background:var(--bg-2); }
  .cat-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .cat-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .cat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  @media(max-width:1024px) { .cat-grid { grid-template-columns:1fr 1fr; } }
  @media(max-width:600px) { .cat-grid { grid-template-columns:1fr; } }
  .cat-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:28px; display:flex; flex-direction:column; position:relative; overflow:hidden; transition:transform 0.3s,border-color 0.3s,box-shadow 0.3s; }
  .cat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,${A},#C4B5FD); opacity:0; transition:opacity 0.3s; }
  .cat-card:hover { transform:translateY(-4px); border-color:rgba(139,92,246,0.3); box-shadow:0 12px 40px rgba(139,92,246,0.12); }
  .cat-card:hover::before { opacity:1; }
  .cat-card-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
  .cat-card-pulse { width:8px; height:8px; border-radius:50%; background:${A}; animation:cpulse 2.5s infinite; }
  @keyframes cpulse { 0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,0.4)} 50%{box-shadow:0 0 0 6px rgba(139,92,246,0)} }
  .cat-card-name { font-family:${F.h}; font-size:1.05rem; font-weight:800; color:var(--text-primary); margin-bottom:8px; }
  .cat-card-desc { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; flex:1; margin-bottom:16px; }
  .cat-card-bottom { display:flex; align-items:center; justify-content:space-between; margin-top:auto; }
  .cat-card-price { font-family:${F.h}; font-size:1rem; font-weight:700; color:${A}; }
  .cat-card-price span { font-family:${F.b}; font-size:0.75rem; font-weight:400; color:var(--text-muted); }
  .cat-card-link { font-family:${F.h}; font-size:0.82rem; font-weight:600; color:${A}; text-decoration:none; }
  .cat-card-link:hover { text-decoration:underline; }
  .cat-usecases { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  @media(max-width:600px) { .cat-usecases { grid-template-columns:1fr; } }
  .cat-usecase { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:20px 24px; border-left:3px solid ${A}; }
  .cat-usecase-title { font-family:${F.h}; font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
  .cat-usecase-desc { font-family:${F.b}; font-size:0.82rem; color:var(--text-secondary); line-height:1.5; }
  .cat-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .cat-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .cat-btn-ghost:hover { border-color:${A}; color:${A}; }
  .cat-not-found { padding:160px 0; text-align:center; }
`;

const CATEGORY_USE_CASES: Record<AgentCategory, { title: string; desc: string }[]> = {
  operations: [
    { title: 'Weekly executive reporting', desc: 'Auto-generated reports land in leadership inboxes every Monday morning before the team meeting.' },
    { title: 'Multi-warehouse inventory sync', desc: 'Stock counts stay consistent across 5 warehouses and 3 sales channels without manual reconciliation.' },
    { title: 'Contract compliance review', desc: 'Legal team gets pre-flagged documents to review instead of reading every contract from scratch.' },
    { title: 'Post-meeting action tracking', desc: 'Action items from every client call are automatically captured, assigned, and tracked in your PM tool.' },
  ],
  sales: [
    { title: 'High-volume inbound qualification', desc: 'SaaS company receives 200+ leads/week. Agent scores and routes them — sales team talks to the right ones.' },
    { title: 'Proposal turnaround at scale', desc: 'Agency sends 30 proposals/month. Agent drafts each one in your format, reducing turnaround from 2 days to 2 hours.' },
    { title: 'CRM data hygiene', desc: 'Inheriting a messy CRM from a previous team. Agent cleans and enriches 10,000 contacts over a weekend.' },
  ],
  support: [
    { title: '24/7 first response coverage', desc: 'E-commerce store gets 500+ support emails/day. Agent handles 80% autonomously; routes the rest.' },
    { title: 'Ticket triage for mixed-type inboxes', desc: 'SaaS support@ inbox receives billing, bug reports, and feature requests. Agent sorts and routes each type.' },
    { title: 'Review response at scale', desc: 'Brand with 50+ locations manages Google and Trustpilot reviews from one queue with on-brand responses.' },
  ],
  data: [
    { title: 'Invoice data entry elimination', desc: 'Finance team was spending 3 hours/day entering vendor invoice data. Agent does it in minutes with zero errors.' },
    { title: 'Shared inbox management for growing team', desc: 'Sales team\'s shared inbox getting 300+ emails/week. Agent triages, drafts, and routes — team reviews.' },
    { title: 'Brand mention early warning system', desc: 'PR team gets a daily brief on brand mentions, competitor activity, and sentiment shifts across social.' },
  ],
  documents: [
    { title: 'Vendor invoice processing', desc: '200 invoices/month from 40+ vendors in different formats. Agent extracts all key data into your system.' },
    { title: 'Contract portfolio management', desc: 'Legal team tracks 150+ vendor contracts. Agent monitors renewal dates and flags unfavorable terms.' },
    { title: 'Research synthesis for analysts', desc: 'Investment team reads 50 reports/week. Agent generates 1-page summaries with key data points highlighted.' },
  ],
};

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = typeof params.category === 'string' ? params.category : Array.isArray(params.category) ? params.category[0] : '';
  const isValidCategory = Object.keys(CATEGORY_META).includes(categorySlug);

  if (!isValidCategory) {
    return (
      <div className="cat-not-found">
        <style>{STYLES}</style>
        <div style={{ fontFamily: F.h, fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 12 }}>Category not found</div>
        <Link href="/agents/catalog" style={{ color: A, fontFamily: F.h, fontWeight: 600, textDecoration: 'none' }}>Back to catalog →</Link>
      </div>
    );
  }

  const category = categorySlug as AgentCategory;
  const meta = CATEGORY_META[category];
  const categoryAgents = agents.filter(a => a.category === category);
  const useCases = CATEGORY_USE_CASES[category] || [];

  return (
    <>
      <style>{STYLES}</style>

      <section className="cat-hero">
        <div className="cat-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="cat-label">Agent Category</div>
          </motion.div>
          <motion.h1 className="cat-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <span className="vi">{meta.label}</span> Agents
          </motion.h1>
          <motion.p className="cat-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            {meta.description}. {categoryAgents.length} agents ready to deploy in this category.
          </motion.p>
        </div>
      </section>

      {/* Agents in this category */}
      <section className="cat-section">
        <div className="cat-container">
          <Reveal>
            <div className="cat-label">{meta.label} Agents</div>
            <h2 className="cat-h2" style={{ marginBottom: 8 }}>{categoryAgents.length} agents in this category</h2>
            <p className="cat-body" style={{ marginBottom: 40 }}>Each agent is pre-built and ready to deploy in 3–7 business days. Mix and match from any category.</p>
          </Reveal>
          <div className="cat-grid">
            {categoryAgents.map((agent, i) => (
              <Reveal key={agent.slug} delay={i * 0.1}>
                <div className="cat-card">
                  <div className="cat-card-top">
                    <div style={{ fontFamily: F.m, fontSize: '0.68rem', color: A, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{meta.label}</div>
                    <div className="cat-card-pulse" />
                  </div>
                  <div className="cat-card-name">{agent.name}</div>
                  <div className="cat-card-desc">{agent.tagline}</div>
                  <div style={{ fontFamily: F.m, fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {agent.integrations.slice(0, 3).map(int => (
                      <span key={int.name} style={{ background: 'var(--bg-2)', borderRadius: 4, padding: '2px 8px' }}>{int.name}</span>
                    ))}
                    {agent.integrations.length > 3 && <span style={{ background: 'var(--bg-2)', borderRadius: 4, padding: '2px 8px' }}>+{agent.integrations.length - 3}</span>}
                  </div>
                  <div className="cat-card-bottom">
                    <div className="cat-card-price">${agent.price}<span>/mo</span></div>
                    <Link href={`/agents/catalog/${agent.slug}`} className="cat-card-link">Learn More →</Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="cat-section cat-bg-alt">
        <div className="cat-container">
          <Reveal>
            <div className="cat-label">Real Use Cases</div>
            <h2 className="cat-h2" style={{ marginBottom: 8 }}>{meta.label} agents in practice</h2>
            <p className="cat-body" style={{ marginBottom: 40, maxWidth: 480 }}>How businesses actually use {meta.label.toLowerCase()} agents in production — not hypothetical scenarios.</p>
          </Reveal>
          <div className="cat-usecases">
            {useCases.map((uc, i) => (
              <Reveal key={uc.title} delay={i * 0.08}>
                <div className="cat-usecase">
                  <div className="cat-usecase-title">{uc.title}</div>
                  <div className="cat-usecase-desc">{uc.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cat-section" style={{ textAlign: 'center' }}>
        <div className="cat-container">
          <Reveal>
            <h2 className="cat-h2" style={{ marginBottom: 12 }}>Ready to deploy a {meta.label.toLowerCase()} agent?</h2>
            <p className="cat-body" style={{ maxWidth: 400, margin: '0 auto 28px' }}>Pick the agent that fits your workflow. We&apos;ll have it running in under a week.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/agents/deploy" className="cat-btn-pri">Deploy an Agent →</Link>
              <Link href="/agents/catalog" className="cat-btn-ghost">Full Catalog</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
