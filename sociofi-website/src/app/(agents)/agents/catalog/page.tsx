'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { agents, CATEGORY_META, CATEGORY_ORDER, type AgentCategory } from '@/lib/agents';

const A = '#8B5CF6';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .cat-hero { padding: 140px 0 72px; background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%); }
  .cat-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .cat-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .cat-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .cat-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .cat-h1 .vi { background:linear-gradient(135deg,${A} 0%,#C4B5FD 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .cat-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:560px; }
  .cat-filters { position:sticky; top:0; z-index:40; background:var(--bg); border-bottom:1px solid var(--border); padding:16px 0; }
  .cat-filter-inner { max-width:1200px; margin:0 auto; padding:0 32px; display:flex; gap:8px; flex-wrap:wrap; }
  @media(max-width:768px) {
    .cat-filter-inner { flex-wrap:nowrap; overflow-x:auto; -webkit-overflow-scrolling:touch; scroll-snap-type:x mandatory; padding:0 20px; scrollbar-width:none; -ms-overflow-style:none; }
    .cat-filter-inner::-webkit-scrollbar { display:none; }
    .cat-tab { scroll-snap-align:start; flex-shrink:0; }
    .cat-filters { mask-image:linear-gradient(to right, transparent 0%, black 5%, black 92%, transparent 100%); -webkit-mask-image:linear-gradient(to right, transparent 0%, black 5%, black 92%, transparent 100%); }
    .cat-grid-section { padding:32px 0 60px; }
    .cat-container { padding:0 20px; }
    .cat-hero { padding:120px 0 56px; }
  }
  .cat-tab { font-family:${F.h}; font-size:0.84rem; font-weight:600; padding:8px 18px; border-radius:100px; border:1.5px solid var(--border); color:var(--text-secondary); cursor:pointer; transition:all 0.2s; background:transparent; }
  .cat-tab:hover { border-color:${A}; color:${A}; }
  .cat-tab.active { background:${A}; border-color:${A}; color:#fff; }
  .cat-grid-section { padding:48px 0 80px; }
  .cat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  @media(max-width:1024px) { .cat-grid { grid-template-columns:1fr 1fr; } }
  @media(max-width:600px) { .cat-grid { grid-template-columns:1fr; } }
  .cat-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:28px; display:flex; flex-direction:column; position:relative; overflow:hidden; transition:transform 0.3s,border-color 0.3s,box-shadow 0.3s; }
  .cat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,${A},#C4B5FD); opacity:0; transition:opacity 0.3s; }
  .cat-card:hover { transform:translateY(-4px); border-color:rgba(139,92,246,0.3); box-shadow:0 12px 40px rgba(139,92,246,0.12); }
  .cat-card:hover::before { opacity:1; }
  .cat-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
  .cat-card-badge { font-family:${F.m}; font-size:0.66rem; color:${A}; background:rgba(139,92,246,0.1); border-radius:100px; padding:3px 10px; letter-spacing:0.08em; text-transform:uppercase; }
  .cat-card-pulse { width:8px; height:8px; border-radius:50%; background:${A}; animation:cpulse 2.5s infinite; }
  @keyframes cpulse { 0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,0.4)} 50%{box-shadow:0 0 0 6px rgba(139,92,246,0)} }
  .cat-card-name { font-family:${F.h}; font-size:1.05rem; font-weight:800; color:var(--text-primary); margin-bottom:8px; }
  .cat-card-desc { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; flex:1; margin-bottom:16px; }
  .cat-card-bottom { display:flex; align-items:center; justify-content:space-between; margin-top:auto; }
  .cat-card-price { font-family:${F.h}; font-size:1rem; font-weight:700; color:${A}; }
  .cat-card-price span { font-family:${F.b}; font-size:0.75rem; font-weight:400; color:var(--text-muted); }
  .cat-card-ints { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px; }
  .cat-card-int { font-family:${F.m}; font-size:0.64rem; color:var(--text-muted); background:var(--bg-2); border-radius:4px; padding:2px 8px; }
  .cat-card-link { font-family:${F.h}; font-size:0.82rem; font-weight:600; color:${A}; text-decoration:none; }
  .cat-card-link:hover { text-decoration:underline; }
  .cat-bundles { padding:0 0 80px; }
  .cat-bundle-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  @media(max-width:768px) { .cat-bundle-grid { grid-template-columns:1fr; } }
  .cat-bundle { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:28px; }
  .cat-bundle.featured { border-color:rgba(139,92,246,0.4); }
  .cat-bundle-name { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:6px; }
  .cat-bundle-discount { font-family:${F.m}; font-size:0.68rem; color:#fff; background:${A}; border-radius:100px; padding:2px 10px; display:inline-block; margin-bottom:12px; }
  .cat-bundle-desc { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; margin-bottom:16px; }
  .cat-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:12px 22px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.84rem; font-weight:600; text-decoration:none; }
  .cat-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:12px 22px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.84rem; font-weight:600; text-decoration:none; }
  .cat-btn-ghost:hover { border-color:${A}; color:${A}; }
  .cat-empty { text-align:center; padding:60px 0; color:var(--text-muted); font-family:${F.b}; }
  .cat-section-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .cat-section-sub { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); margin-bottom:32px; line-height:1.6; }
`;

type FilterKey = 'all' | AgentCategory;

const TABS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: `All (${agents.length})` },
  ...CATEGORY_ORDER.map(c => ({ key: c as FilterKey, label: `${CATEGORY_META[c].label} (${agents.filter(a => a.category === c).length})` })),
];

const BUNDLES = [
  { name: 'Team Pack', discount: '15% off', count: 'Any 3 agents', desc: 'The starting point for teams that want to cover multiple workflows without committing to the full suite.', featured: false },
  { name: 'Growth Pack', discount: '20% off', count: 'Any 5 agents', desc: 'The most popular option. Cover ops, sales, and support simultaneously. Most clients see ROI within 30 days.', featured: true },
  { name: 'Business Pack', discount: '25% off + custom', count: '10+ agents', desc: 'Full-team coverage with custom agent development included. Dedicated onboarding and priority support.', featured: false },
];

export default function CatalogPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const filtered = activeFilter === 'all' ? agents : agents.filter(a => a.category === activeFilter);

  return (
    <>
      <style>{STYLES}</style>

      <section className="cat-hero">
        <div className="cat-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="cat-label">Agent Catalog</div>
          </motion.div>
          <motion.h1 className="cat-h1" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            16 Agents. 5 Categories. <span className="vi">Pick the ones you need.</span>
          </motion.h1>
          <motion.p className="cat-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Every agent is pre-built, pre-tested, and ready to deploy in 3–7 business days. No dev work required on your end.
          </motion.p>
        </div>
      </section>

      <div className="cat-filters">
        <div className="cat-filter-inner">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`cat-tab${activeFilter === tab.key ? ' active' : ''}`}
              onClick={() => setActiveFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <section className="cat-grid-section">
        <div className="cat-container">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <div className="cat-empty">No agents in this category yet.</div>
            ) : (
              <motion.div className="cat-grid" layout>
                {filtered.map((agent, i) => (
                  <motion.div
                    key={agent.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                  >
                    <div className="cat-card">
                      <div className="cat-card-top">
                        <div className="cat-card-badge">{CATEGORY_META[agent.category].label}</div>
                        <div className="cat-card-pulse" />
                      </div>
                      <div className="cat-card-name">{agent.name}</div>
                      <div className="cat-card-desc">{agent.tagline}</div>
                      <div className="cat-card-ints">
                        {agent.integrations.slice(0, 4).map(int => (
                          <span key={int.name} className="cat-card-int">{int.name}</span>
                        ))}
                        {agent.integrations.length > 4 && (
                          <span className="cat-card-int">+{agent.integrations.length - 4} more</span>
                        )}
                      </div>
                      <div className="cat-card-bottom">
                        <div className="cat-card-price">${agent.price}<span>/mo</span></div>
                        <Link href={`/agents/catalog/${agent.slug}`} className="cat-card-link">Learn More →</Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Bundles */}
      <section className="cat-bundles" style={{ background: 'var(--bg-2)', padding: '80px 0' }}>
        <div className="cat-container">
          <div className="cat-label">Bundle & Save</div>
          <h2 className="cat-section-h2">More agents, better value.</h2>
          <p className="cat-section-sub">Subscribe to 3 or more agents and unlock automatic discounts. No negotiation, no contracts.</p>
          <div className="cat-bundle-grid">
            {BUNDLES.map(b => (
              <div key={b.name} className={`cat-bundle${b.featured ? ' featured' : ''}`}>
                <div className="cat-bundle-name">{b.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div className="cat-bundle-discount">{b.discount}</div>
                  <div style={{ fontFamily: F.m, fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.count}</div>
                </div>
                <div className="cat-bundle-desc">{b.desc}</div>
                <Link href="/agents/pricing" className={b.featured ? 'cat-btn-pri' : 'cat-btn-ghost'}>See pricing →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="cat-container">
          <h2 className="cat-section-h2" style={{ marginBottom: 12 }}>Don&apos;t see what you need?</h2>
          <p className="cat-section-sub" style={{ maxWidth: 480, margin: '0 auto 28px' }}>
            We build custom agents for workflows that don&apos;t fit the catalog. Tell us what you need and we&apos;ll scope it.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/agents/custom" className="cat-btn-pri">Build a Custom Agent →</Link>
            <Link href="/agents/deploy" className="cat-btn-ghost">Talk to the Team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
