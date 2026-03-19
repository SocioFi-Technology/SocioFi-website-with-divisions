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

const STYLES = `
  .pr-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .pr-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .pr-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .pr-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .pr-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .pr-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:540px; }
  .pr-section { padding:80px 0; }
  .pr-bg-alt { background:var(--bg-2); }
  .pr-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .pr-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .pr-tiers { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
  @media(max-width:1024px) { .pr-tiers { grid-template-columns:1fr 1fr; } }
  @media(max-width:600px) { .pr-tiers { grid-template-columns:1fr; } }
  .pr-tier { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:28px; position:relative; display:flex; flex-direction:column; }
  .pr-tier.featured { border-color:rgba(139,92,246,0.4); box-shadow:0 0 0 1px rgba(139,92,246,0.2),0 8px 32px rgba(139,92,246,0.1); }
  .pr-tier-badge { position:absolute; top:-12px; left:50%; transform:translateX(-50%); font-family:${F.m}; font-size:0.68rem; color:#fff; background:${A}; border-radius:100px; padding:4px 14px; letter-spacing:0.08em; white-space:nowrap; }
  .pr-tier-name { font-family:${F.h}; font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
  .pr-tier-sub { font-family:${F.m}; font-size:0.72rem; color:var(--text-muted); margin-bottom:16px; }
  .pr-tier-price { font-family:${F.h}; font-size:2rem; font-weight:800; color:${A}; margin-bottom:4px; }
  .pr-tier-price span { font-family:${F.b}; font-size:0.84rem; font-weight:400; color:var(--text-muted); }
  .pr-tier-saving { font-family:${F.m}; font-size:0.72rem; color:${A}; margin-bottom:20px; }
  .pr-tier-items { list-style:none; padding:0; margin:0 0 24px; display:flex; flex-direction:column; gap:10px; flex:1; }
  .pr-tier-items li { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); display:flex; align-items:flex-start; gap:8px; line-height:1.5; }
  .pr-tier-items li::before { content:''; display:inline-block; width:7px; height:12px; border-right:2px solid;border-bottom:2px solid; transform:rotate(40deg) translateY(-3px); color:${A}; font-weight:700; flex-shrink:0; margin-top:1px; }
  .pr-btn-pri { display:flex; align-items:center; justify-content:center; gap:8px; padding:13px 20px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.88rem; font-weight:600; text-decoration:none; margin-top:auto; }
  .pr-btn-ghost { display:flex; align-items:center; justify-content:center; gap:8px; padding:13px 20px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.88rem; font-weight:600; text-decoration:none; margin-top:auto; }
  .pr-btn-ghost:hover { border-color:${A}; color:${A}; }
  .pr-custom-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  @media(max-width:768px) { .pr-custom-grid { grid-template-columns:1fr; } }
  .pr-custom-card { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:28px; }
  .pr-custom-name { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:6px; }
  .pr-custom-range { font-family:${F.h}; font-size:1.6rem; font-weight:800; color:${A}; margin-bottom:4px; }
  .pr-custom-mo { font-family:${F.m}; font-size:0.72rem; color:var(--text-muted); margin-bottom:16px; }
  .pr-custom-desc { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; }
  .pr-included { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
  @media(max-width:1024px) { .pr-included { grid-template-columns:1fr 1fr; } }
  @media(max-width:480px) { .pr-included { grid-template-columns:1fr; } }
  .pr-incl-item { display:flex; align-items:flex-start; gap:12px; }
  .pr-incl-icon { width:36px; height:36px; border-radius:8px; background:rgba(139,92,246,0.1); display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
  .pr-incl-title { font-family:${F.h}; font-size:0.88rem; font-weight:600; color:var(--text-primary); margin-bottom:3px; }
  .pr-incl-desc { font-family:${F.b}; font-size:0.78rem; color:var(--text-secondary); line-height:1.5; }
  .pr-compare { width:100%; border-collapse:collapse; }
  .pr-compare th { font-family:${F.h}; font-size:0.88rem; font-weight:700; padding:16px; text-align:left; border-bottom:1px solid var(--border); color:var(--text-primary); }
  .pr-compare th.hi { color:#fff; background:rgba(139,92,246,0.15); }
  .pr-compare td { font-family:${F.b}; font-size:0.84rem; padding:14px 16px; border-bottom:1px solid var(--border); color:var(--text-secondary); vertical-align:top; }
  .pr-compare td.hi { background:rgba(139,92,246,0.05); color:var(--text-primary); font-weight:500; }
  .pr-compare tr:last-child td { border-bottom:none; }
  .pr-faq { display:flex; flex-direction:column; gap:0; border:1px solid var(--border); border-radius:16px; overflow:hidden; max-width:800px; }
  .pr-faq-item { border-bottom:1px solid var(--border); }
  .pr-faq-item:last-child { border-bottom:none; }
  .pr-faq-q { padding:18px 24px; font-family:${F.h}; font-size:0.9rem; font-weight:600; color:var(--text-primary); cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:12px; }
  .pr-faq-q:hover { color:${A}; }
  .pr-faq-q .arr { font-size:0.9rem; color:var(--text-muted); transition:transform 0.3s; }
  .pr-faq-q .arr.open { transform:rotate(180deg); }
  .pr-faq-a { padding:0 24px 18px; font-family:${F.b}; font-size:0.85rem; color:var(--text-secondary); line-height:1.7; }
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

const PREBUILT_TIERS = [
  { name: 'Single Agent', sub: '1 agent', price: 'From $149', saving: null, items: ['Any 1 agent from catalog', 'Setup & configuration included', 'All listed integrations', 'Monitoring & alerts', 'Monthly report'], featured: false },
  { name: 'Team Pack', sub: 'Any 3 agents', price: 'From $380', saving: '~15% off', items: ['Any 3 agents from catalog', 'Priority setup (2-5 days)', 'Cross-agent workflows', 'Unified Slack channel', 'Quarterly strategy review'], featured: false },
  { name: 'Growth Pack', sub: 'Any 5 agents', price: 'From $599', saving: '~20% off', items: ['Any 5 agents from catalog', 'Dedicated engineer', 'Custom automations between agents', 'Weekly performance reports', 'SLA: 99.5% uptime'], featured: true, badge: 'MOST POPULAR' },
  { name: 'Business Pack', sub: '10+ agents', price: 'Custom', saving: '25% off + custom dev', items: ['10+ agents + custom built', 'Dedicated team', 'Full workflow architecture', 'Monthly exec review', 'Priority SLA + on-call'], featured: false },
];

const CUSTOM_TIERS = [
  { name: 'Standard', range: '$2K–$4K', mo: '+ $199/month', desc: 'Simple to moderate complexity. Single workflow, 2–4 integrations. Delivery: 2–3 weeks.' },
  { name: 'Advanced', range: '$4K–$8K', mo: '+ $299/month', desc: 'Multi-step reasoning, branching logic, 5+ integrations, or high data volume. Delivery: 3–5 weeks.' },
  { name: 'Enterprise', range: '$8K–$15K', mo: '+ $399/month', desc: 'Complex multi-agent systems, custom ML components, or compliance requirements. Delivery: 4–8 weeks.' },
];

const Icons = {
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Server: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  ),
  Chart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Zap: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Wrench: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  FileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  RefreshCw: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
};

const INCLUDED = [
  { icon: <Icons.Settings />, title: 'Full Setup', desc: 'We configure everything from scratch' },
  { icon: <Icons.Server />, title: 'All Integrations', desc: 'Connect to your existing tools' },
  { icon: <Icons.Chart />, title: 'Monthly Reports', desc: 'Performance summaries every month' },
  { icon: <Icons.Zap />, title: 'Alerts', desc: 'Uptime and error notifications' },
  { icon: <Icons.Users />, title: 'Engineer Support', desc: 'Via Slack during business hours' },
  { icon: <Icons.Wrench />, title: 'Bug Fixes', desc: 'We fix issues, not you' },
  { icon: <Icons.FileText />, title: 'Documentation', desc: 'Clear runbooks for your team' },
  { icon: <Icons.RefreshCw />, title: 'Free Updates', desc: 'As we improve the catalog' },
];

const COMPARE_ROWS = [
  ['Cost', '$2K–$7K/month salary+benefits', '$99–$600/month SaaS fee', 'From $149/month per agent'],
  ['Setup time', '1–3 months hiring', 'Hours (but complex config)', '3–7 business days'],
  ['Reasoning ability', 'Full human judgment', 'Rule-based only', 'Contextual reasoning'],
  ['Availability', 'Business hours only', '24/7 (if configured)', '24/7'],
  ['Scales with volume', 'Hire more people', 'Tier upgrades', 'Add more agents'],
  ['Handles exceptions', 'Yes', 'Often fails', 'Escalates to human'],
  ['Human oversight', 'Self-managed', 'No oversight built-in', 'Engineer monitors'],
];

const FAQS = [
  { q: 'Is there a contract or minimum term?', a: 'No contracts. Month-to-month. Cancel with 30 days notice — no penalties or fees.' },
  { q: 'What\'s included in "setup"?', a: 'Everything: integration connections, configuration, testing with your data, and a live walkthrough before go-live.' },
  { q: 'Can I switch agents after subscribing?', a: 'Yes. Swap agents monthly. You pay for whatever agents are active that month.' },
  { q: 'What payment methods do you accept?', a: 'Credit card, bank transfer, or invoice (for Business Pack and above).' },
  { q: 'Is pricing negotiable?', a: 'The catalog pricing is fixed. For custom agents or Business Pack, we scope and quote.' },
  { q: 'What if I need an agent not in the catalog?', a: 'We build custom agents. See the Custom Agents page for scoping options.' },
  { q: 'What happens if an agent breaks?', a: 'We fix it. Agent maintenance is included in your subscription — we monitor uptime and fix issues.' },
  { q: 'Do you offer a free trial?', a: 'We don\'t offer a trial, but setup is low-risk: cancel within the first 30 days if it\'s not working and we\'ll refund the first month.' },
  { q: 'Can I use my own API keys?', a: 'Yes. For some configurations we use your existing API subscriptions to reduce your costs.' },
  { q: 'How do I get started?', a: 'Go to the Deploy page, tell us what you need, and we\'ll send a setup plan within 1 business day.' },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <style>{STYLES}</style>

      <section className="pr-hero">
        <div className="pr-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="pr-label">Pricing</div>
          </motion.div>
          <motion.h1 className="pr-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Honest Pricing. Per Agent. Per Month.
          </motion.h1>
          <motion.p className="pr-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            No contracts. No surprise fees. No &ldquo;contact sales for pricing.&rdquo; Subscribe to the agents you need. Cancel when you want.
          </motion.p>
        </div>
      </section>

      {/* Pre-built Pricing */}
      <section className="pr-section">
        <div className="pr-container">
          <Reveal>
            <div className="pr-label">Pre-Built Agents</div>
            <h2 className="pr-h2" style={{ marginBottom: 8 }}>Choose your plan</h2>
            <p className="pr-body" style={{ marginBottom: 40, maxWidth: 480 }}>Pick any agent from our 16-agent catalog. Bundle for automatic discounts.</p>
          </Reveal>
          <div className="pr-tiers">
            {PREBUILT_TIERS.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 0.08}>
                <div className={`pr-tier${tier.featured ? ' featured' : ''}`}>
                  {tier.badge && <div className="pr-tier-badge">{tier.badge}</div>}
                  <div className="pr-tier-name">{tier.name}</div>
                  <div className="pr-tier-sub">{tier.sub}</div>
                  <div className="pr-tier-price">{tier.price}<span>/mo</span></div>
                  {tier.saving && <div className="pr-tier-saving">{tier.saving}</div>}
                  <ul className="pr-tier-items">
                    {tier.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                  <Link href="/agents/deploy" className={tier.featured ? 'pr-btn-pri' : 'pr-btn-ghost'}>
                    {tier.name === 'Business Pack' ? 'Contact us →' : 'Get started →'}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Agent Pricing */}
      <section className="pr-section pr-bg-alt">
        <div className="pr-container">
          <Reveal>
            <div className="pr-label">Custom Agents</div>
            <h2 className="pr-h2" style={{ marginBottom: 8 }}>Need something built from scratch?</h2>
            <p className="pr-body" style={{ marginBottom: 40, maxWidth: 480 }}>One-time build fee + monthly subscription. Scoped after a free consultation.</p>
          </Reveal>
          <div className="pr-custom-grid">
            {CUSTOM_TIERS.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 0.1}>
                <div className="pr-custom-card">
                  <div className="pr-custom-name">{tier.name}</div>
                  <div className="pr-custom-range">{tier.range}</div>
                  <div className="pr-custom-mo">{tier.mo}</div>
                  <div className="pr-custom-desc">{tier.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div style={{ marginTop: 32 }}>
              <Link href="/agents/custom" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 10, background: `linear-gradient(135deg,${A} 0%,#7C3AED 100%)`, color: '#fff', fontFamily: F.h, fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}>
                Explore Custom Agents →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Always Included */}
      <section className="pr-section">
        <div className="pr-container">
          <Reveal>
            <div className="pr-label">What You Get</div>
            <h2 className="pr-h2" style={{ marginBottom: 8 }}>Always included. Every plan.</h2>
            <p className="pr-body" style={{ marginBottom: 40, maxWidth: 480 }}>Every subscription includes the full stack — not just the software.</p>
          </Reveal>
          <div className="pr-included">
            {INCLUDED.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="pr-incl-item">
                  <div className="pr-incl-icon" style={{ color: A }}>{item.icon}</div>
                  <div>
                    <div className="pr-incl-title">{item.title}</div>
                    <div className="pr-incl-desc">{item.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pr-section pr-bg-alt">
        <div className="pr-container">
          <Reveal>
            <div className="pr-label">How We Compare</div>
            <h2 className="pr-h2" style={{ marginBottom: 8 }}>SocioFi vs the alternatives</h2>
            <p className="pr-body" style={{ marginBottom: 32, maxWidth: 480 }}>Hiring costs more. Automation tools can&apos;t reason. We sit in the right spot.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ overflowX: 'auto' }}>
              <table className="pr-compare">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th>Hire an Employee</th>
                    <th>Zapier / Make</th>
                    <th className="hi">SocioFi Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map(row => (
                    <tr key={row[0]}>
                      <td style={{ fontFamily: F.h, fontWeight: 600, color: 'var(--text-primary)' }}>{row[0]}</td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td className="hi">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="pr-section">
        <div className="pr-container">
          <Reveal>
            <div className="pr-label">Questions</div>
            <h2 className="pr-h2" style={{ marginBottom: 32 }}>Pricing FAQ</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="pr-faq">
              {FAQS.map((item, i) => (
                <div key={i} className="pr-faq-item">
                  <div className="pr-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{item.q}</span>
                    <span className={`arr${openFaq === i ? ' open' : ''}`}>▾</span>
                  </div>
                  {openFaq === i && (
                    <motion.div className="pr-faq-a" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                      {item.a}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="pr-section pr-bg-alt" style={{ textAlign: 'center' }}>
        <div className="pr-container">
          <Reveal>
            <div className="pr-label" style={{ justifyContent: 'center' }}>Get Started</div>
            <h2 className="pr-h2" style={{ marginBottom: 12 }}>Ready to deploy your first agent?</h2>
            <p className="pr-body" style={{ maxWidth: 460, margin: '0 auto 28px' }}>Browse the catalog, pick what you need, and we&apos;ll have it running in under a week.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/agents/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 10, background: `linear-gradient(135deg,${A} 0%,#7C3AED 100%)`, color: '#fff', fontFamily: F.h, fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
                Browse the Catalog →
              </Link>
              <Link href="/agents/deploy" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 10, border: '1.5px solid var(--border)', color: 'var(--text-primary)', fontFamily: F.h, fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
                Talk to the Team
              </Link>
            </div>
            <div style={{ marginTop: 40, padding: '28px 32px', background: 'var(--bg-card)', border: `1px solid rgba(139,92,246,0.2)`, borderRadius: 14, maxWidth: 600, marginInline: 'auto' }}>
              <p style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                &ldquo;We don&apos;t believe in lock-in. If our agents aren&apos;t saving you more than they cost, you shouldn&apos;t pay for them.&rdquo;
              </p>
              <div style={{ fontFamily: F.m, fontSize: '0.7rem', color: A, letterSpacing: '0.08em' }}>Arifur Rahman · CEO, SocioFi Technology</div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
