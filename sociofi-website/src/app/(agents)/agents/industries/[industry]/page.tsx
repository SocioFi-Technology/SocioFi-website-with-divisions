'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { agents } from '@/lib/agents';

const A = '#8B5CF6';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .ind-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .ind-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .ind-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .ind-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .ind-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .ind-h1 .vi { background:linear-gradient(135deg,${A} 0%,#C4B5FD 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .ind-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:540px; }
  .ind-section { padding:80px 0; }
  .ind-bg-alt { background:var(--bg-2); }
  .ind-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .ind-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .ind-pain { display:flex; flex-direction:column; gap:12px; }
  .ind-pain-item { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:20px 24px; display:flex; gap:14px; }
  .ind-pain-x { font-size:1rem; flex-shrink:0; margin-top:2px; }
  .ind-pain-title { font-family:${F.h}; font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
  .ind-pain-desc { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.5; }
  .ind-agent-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  @media(max-width:1024px) { .ind-agent-grid { grid-template-columns:1fr 1fr; } }
  @media(max-width:600px) { .ind-agent-grid { grid-template-columns:1fr; } }
  .ind-agent-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:28px; display:flex; flex-direction:column; transition:border-color 0.3s,transform 0.3s; position:relative; overflow:hidden; }
  .ind-agent-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,${A},#C4B5FD); opacity:0; transition:opacity 0.3s; }
  .ind-agent-card:hover { border-color:rgba(139,92,246,0.3); transform:translateY(-4px); }
  .ind-agent-card:hover::before { opacity:1; }
  .ind-agent-cat { font-family:${F.m}; font-size:0.66rem; color:${A}; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:8px; }
  .ind-agent-name { font-family:${F.h}; font-size:1rem; font-weight:800; color:var(--text-primary); margin-bottom:8px; }
  .ind-agent-why { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; flex:1; margin-bottom:16px; }
  .ind-agent-price { font-family:${F.h}; font-size:0.95rem; font-weight:700; color:${A}; margin-bottom:12px; }
  .ind-agent-link { font-family:${F.h}; font-size:0.82rem; font-weight:600; color:${A}; text-decoration:none; }
  .ind-agent-link:hover { text-decoration:underline; }
  .ind-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .ind-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .ind-btn-ghost:hover { border-color:${A}; color:${A}; }
  .ind-not-found { padding:160px 0; text-align:center; }
`;

const INDUSTRY_DATA: Record<string, {
  label: string;
  headline: string;
  sub: string;
  pains: { icon: string; title: string; desc: string }[];
  agentSlugs: string[];
  agentWhys: Record<string, string>;
}> = {
  manufacturing: {
    label: 'Manufacturing',
    headline: 'Agents Built for Manufacturing Operations',
    sub: 'Inventory management, compliance documentation, production reporting, and supplier communication — all automated for manufacturing environments.',
    pains: [
      { icon: '📦', title: 'Manual inventory reconciliation', desc: 'Stock counts across warehouses, production floors, and supplier systems never match. Teams spend hours reconciling weekly.' },
      { icon: '📋', title: 'Compliance documentation burden', desc: 'ISO, quality control, and safety documentation requires constant review and updates. Keeping documents compliant is a full-time job.' },
      { icon: '📊', title: 'Lagging operations reporting', desc: 'Production metrics, yield rates, and downtime data are compiled manually — often days after the period being reported.' },
      { icon: '📧', title: 'Supplier communication overhead', desc: 'Order updates, delivery confirmations, and issue escalations with 20+ suppliers create inbox chaos.' },
    ],
    agentSlugs: ['inventory-monitor', 'compliance-checker', 'report-generator', 'email-triage'],
    agentWhys: {
      'inventory-monitor': 'Track stock across multiple locations with automatic reorder alerts and cross-system sync.',
      'compliance-checker': 'Keep quality and safety documentation current against your regulatory requirements.',
      'report-generator': 'Automated daily and weekly production reports delivered to your team automatically.',
      'email-triage': 'Intelligently manage supplier communications across your operations team\'s shared inbox.',
    },
  },
  ecommerce: {
    label: 'E-Commerce',
    headline: 'Agents Built for E-Commerce Operations',
    sub: 'Order processing, customer support, inventory management, and review management — all automated for e-commerce teams managing high volume.',
    pains: [
      { icon: '🎧', title: 'Customer support at scale', desc: 'Hundreds of order inquiries, return requests, and shipping questions every day. Same questions, answered again and again.' },
      { icon: '📦', title: 'Inventory across multiple channels', desc: 'Stock counts differ between your website, marketplaces, and warehouse. Overselling and stockouts eat into margins.' },
      { icon: '⭐', title: 'Review management backlog', desc: 'Customers leaving reviews on Google, Trustpilot, and Capterra. Responding promptly matters — but there aren\'t enough hours.' },
      { icon: '📊', title: 'Sales reporting for management', desc: 'Leadership needs daily and weekly revenue summaries. Finance needs reconciliation reports. Both need them fast.' },
    ],
    agentSlugs: ['customer-service', 'inventory-monitor', 'review-responder', 'report-generator'],
    agentWhys: {
      'customer-service': 'Handle first-line order inquiries 24/7 — delivery status, returns, sizing questions — with your product knowledge.',
      'inventory-monitor': 'Keep stock levels synced across Shopify, marketplace listings, and warehouse — prevent overselling automatically.',
      'review-responder': 'Draft on-brand responses to reviews across Google, Trustpilot, and G2 — approve and publish from one queue.',
      'report-generator': 'Daily revenue summaries, weekly trend reports, and monthly financials — delivered automatically.',
    },
  },
  'professional-services': {
    label: 'Professional Services',
    headline: 'Agents Built for Professional Services Firms',
    sub: 'Client proposals, contract review, CRM hygiene, and meeting documentation — all automated for consulting, legal, and agency teams.',
    pains: [
      { icon: '📄', title: 'Proposal drafting time', desc: 'Every proposal takes 4–8 hours to write. With 15+ proposals per month, the team is spending 2 days per week on first drafts.' },
      { icon: '📋', title: 'Contract review before signing', desc: 'Reviewing vendor and client contracts for unfavorable terms falls through the cracks or creates legal bottlenecks.' },
      { icon: '📌', title: 'CRM data that\'s always out of date', desc: 'Deal notes aren\'t logged, contacts aren\'t enriched, duplicate records multiply. CRM becomes useless for forecasting.' },
      { icon: '📝', title: 'Post-meeting documentation', desc: 'Action items from client calls get forgotten or emailed manually. Follow-up is inconsistent across the team.' },
    ],
    agentSlugs: ['proposal-drafter', 'contract-analyzer', 'crm-updater', 'meeting-summarizer'],
    agentWhys: {
      'proposal-drafter': 'Turn project briefs and client emails into first-draft proposals in your format — reduce turnaround from days to hours.',
      'contract-analyzer': 'Pre-review vendor and client contracts for unfavorable terms and renewal dates before they go to legal.',
      'crm-updater': 'Keep your CRM clean automatically — logged notes, updated stages, enriched contacts, no duplicates.',
      'meeting-summarizer': 'Capture every client call, extract action items, and distribute structured summaries immediately after.',
    },
  },
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

export default function IndustryPage() {
  const params = useParams();
  const industrySlug = typeof params.industry === 'string' ? params.industry : Array.isArray(params.industry) ? params.industry[0] : '';
  const data = INDUSTRY_DATA[industrySlug];

  if (!data) {
    return (
      <div className="ind-not-found">
        <style>{STYLES}</style>
        <div style={{ fontFamily: F.h, fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 12 }}>Industry page not found</div>
        <p style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20 }}>Available industries: manufacturing, ecommerce, professional-services</p>
        <Link href="/agents/catalog" style={{ color: A, fontFamily: F.h, fontWeight: 600, textDecoration: 'none' }}>Browse the full catalog →</Link>
      </div>
    );
  }

  const recommendedAgents = data.agentSlugs
    .map(slug => agents.find(a => a.slug === slug))
    .filter(Boolean) as typeof agents;

  return (
    <>
      <style>{STYLES}</style>

      <section className="ind-hero">
        <div className="ind-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="ind-label">{data.label}</div>
          </motion.div>
          <motion.h1 className="ind-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <span className="vi">{data.label}</span> Agent Stack
          </motion.h1>
          <motion.p className="ind-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            {data.sub}
          </motion.p>
        </div>
      </section>

      {/* Pain Points */}
      <section className="ind-section">
        <div className="ind-container">
          <Reveal>
            <div className="ind-label">The Problems</div>
            <h2 className="ind-h2" style={{ marginBottom: 8 }}>What {data.label.toLowerCase()} teams deal with</h2>
            <p className="ind-body" style={{ marginBottom: 40, maxWidth: 520 }}>These are the workflows that eat the most time in {data.label.toLowerCase()} operations — and the ones where agents deliver the clearest ROI.</p>
          </Reveal>
          <div className="ind-pain">
            {data.pains.map((pain, i) => (
              <Reveal key={pain.title} delay={i * 0.08}>
                <div className="ind-pain-item">
                  <div className="ind-pain-x">{pain.icon}</div>
                  <div>
                    <div className="ind-pain-title">{pain.title}</div>
                    <div className="ind-pain-desc">{pain.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Agents */}
      <section className="ind-section ind-bg-alt">
        <div className="ind-container">
          <Reveal>
            <div className="ind-label">Recommended for {data.label}</div>
            <h2 className="ind-h2" style={{ marginBottom: 8 }}>The {recommendedAgents.length}-agent stack for {data.label.toLowerCase()}</h2>
            <p className="ind-body" style={{ marginBottom: 40, maxWidth: 520 }}>These agents address the core bottlenecks above. Deploy all four for full coverage, or start with the one that hurts most.</p>
          </Reveal>
          <div className="ind-agent-grid">
            {recommendedAgents.map((agent, i) => (
              <Reveal key={agent.slug} delay={i * 0.1}>
                <div className="ind-agent-card">
                  <div className="ind-agent-cat">{agent.category}</div>
                  <div className="ind-agent-name">{agent.name}</div>
                  <div className="ind-agent-why">{data.agentWhys[agent.slug] || agent.tagline}</div>
                  <div className="ind-agent-price">${agent.price}/month</div>
                  <Link href={`/agents/catalog/${agent.slug}`} className="ind-agent-link">Learn more →</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ind-section" style={{ textAlign: 'center' }}>
        <div className="ind-container">
          <Reveal>
            <h2 className="ind-h2" style={{ marginBottom: 12 }}>Ready to deploy your {data.label.toLowerCase()} agent stack?</h2>
            <p className="ind-body" style={{ maxWidth: 420, margin: '0 auto 28px' }}>
              We&apos;ll have your first agent running in 3–7 business days. Bundle all four for a 20% discount.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/agents/deploy" className="ind-btn-pri">Deploy These Agents →</Link>
              <Link href="/agents/catalog" className="ind-btn-ghost">Full Catalog</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
