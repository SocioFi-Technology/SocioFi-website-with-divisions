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
  .faq-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .faq-container { max-width:900px; margin:0 auto; padding:0 32px; }
  .faq-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .faq-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .faq-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .faq-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:540px; }
  .faq-section { padding:60px 0; }
  .faq-cat-label { font-family:${F.h}; font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:10px; }
  .faq-cat-label::before { content:''; width:4px; height:20px; background:${A}; border-radius:2px; display:inline-block; }
  .faq-list { display:flex; flex-direction:column; gap:0; border:1px solid var(--border); border-radius:16px; overflow:hidden; margin-bottom:48px; }
  .faq-item { border-bottom:1px solid var(--border); }
  .faq-item:last-child { border-bottom:none; }
  .faq-q { padding:18px 24px; font-family:${F.h}; font-size:0.9rem; font-weight:600; color:var(--text-primary); cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:12px; transition:color 0.2s; }
  .faq-q:hover { color:${A}; }
  .faq-q .arr { font-size:0.9rem; color:var(--text-muted); transition:transform 0.3s; flex-shrink:0; }
  .faq-q .arr.open { transform:rotate(180deg); color:${A}; }
  .faq-a { padding:0 24px 18px; font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); line-height:1.7; }
  .faq-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .faq-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .faq-btn-ghost:hover { border-color:${A}; color:${A}; }
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

const FAQ_DATA: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: 'Getting Started',
    items: [
      { q: 'What exactly is an AI agent?', a: 'An AI agent is software that can understand a task, reason about how to do it, take action, and verify the result — not just follow a rigid script. Unlike automation tools that follow pre-defined flowcharts, agents handle variation, ambiguity, and edge cases by applying judgment.' },
      { q: 'How is this different from Zapier or Make?', a: 'Zapier and Make follow rules — if X then Y. They break when inputs vary from the expected format. Agents understand the intent of a task and adapt. A vendor invoice with different column names? Automation fails. An agent reads the content and figures it out.' },
      { q: 'Do I need any technical knowledge to use agents?', a: 'No. You describe your workflow in plain English. We handle all the technical configuration, integration setup, and testing. You review the outputs and tell us if something needs adjusting.' },
      { q: 'How long does setup take?', a: '3–7 business days for most catalog agents. Custom agents take longer — typically 2–6 weeks depending on complexity. We handle all setup work; you need to be available for a 30-minute configuration call.' },
      { q: 'What do I need to provide to get started?', a: 'Access to the tools you want connected (we\'ll guide you through this), a description of your workflow, and a 30-minute call to review your setup. That\'s it.' },
      { q: 'Can I try an agent before committing?', a: 'We don\'t offer a free trial, but if the agent isn\'t working the way you expected within the first 30 days, we\'ll refund the first month\'s subscription — no questions asked.' },
      { q: 'How many agents can I run simultaneously?', a: 'No limit. Most clients start with 2–3 and grow from there. We offer bundle discounts for 3+ agents — see the pricing page.' },
      { q: 'What happens when my business processes change?', a: 'You contact us and we reconfigure the agent. Minor adjustments are included in your subscription. Major reconfigurations may require a scoping call, but we\'ll always give you a clear answer upfront.' },
    ],
  },
  {
    category: 'Billing & Pricing',
    items: [
      { q: 'Is there a contract or minimum term?', a: 'No contracts. All subscriptions are month-to-month. Cancel with 30 days notice — no penalties, no exit fees.' },
      { q: 'What\'s included in the monthly fee?', a: 'Everything: agent software, setup, all listed integrations, monitoring, uptime alerts, monthly performance report, and engineer support via Slack. No hidden fees.' },
      { q: 'Do you offer refunds?', a: 'We offer a 30-day money-back guarantee on the first month if the agent doesn\'t perform as expected. After 30 days, all charges are final.' },
      { q: 'How does bundle pricing work?', a: 'Subscribe to 3+ agents and you automatically qualify for the Team Pack (15% off). 5+ agents = Growth Pack (20% off). 10+ agents = Business Pack (25% off + custom dev). Discounts apply to the total monthly bill.' },
      { q: 'Can I switch agents after subscribing?', a: 'Yes. You can swap agents monthly — cancel one, add another. The new agent is configured within the standard 3–7 day window.' },
      { q: 'What payment methods do you accept?', a: 'Credit card (Visa, Mastercard, Amex) for monthly billing. Bank transfer or invoice available for Business Pack clients on annual agreements.' },
    ],
  },
  {
    category: 'Technical',
    items: [
      { q: 'Where do agents run?', a: 'On SocioFi\'s own managed infrastructure — not shared public cloud platforms. Each client\'s agents run in isolated containerized environments.' },
      { q: 'What integrations are supported?', a: 'Over 40 integrations across CRM, email, productivity, support, accounting, and data tools. See each agent\'s page for specific integrations. Custom connectors available for unlisted tools.' },
      { q: 'Can agents connect to our internal systems?', a: 'Yes. We build custom connectors for internal systems, proprietary APIs, and legacy software. This is scoped as part of the setup — tell us what you have and we\'ll assess feasibility.' },
      { q: 'How do agents handle errors?', a: 'Every agent has error handling logic. On ambiguous input, it escalates to a human. On failed actions (e.g. API timeout), it retries with exponential backoff and alerts you if it can\'t resolve automatically.' },
      { q: 'Can I see what the agent is doing?', a: 'Yes. You have access to a dashboard showing every task, input, output, and decision the agent made. Full audit trail, searchable by date and event type.' },
      { q: 'What are the uptime guarantees?', a: 'Standard plans: 99.5% uptime. Growth Pack and above: 99.9% uptime SLA with financial credits for breach. Enterprise: custom SLA with dedicated status page.' },
    ],
  },
  {
    category: 'Security & Data',
    items: [
      { q: 'Who can access my data?', a: 'Only the SocioFi engineers assigned to your account, and only for support and configuration purposes. All access is logged and audited.' },
      { q: 'Do you use my data to train AI models?', a: 'No. Your data is never used to train our models or shared with any third party. Full stop.' },
      { q: 'How is data encrypted?', a: 'TLS 1.3 in transit, AES-256 at rest. Encryption keys are rotated quarterly. No sensitive data is ever stored in plain text.' },
      { q: 'What happens to my data when I cancel?', a: 'All your data — inputs, outputs, logs, credentials, configuration — is deleted within 30 days of cancellation. We\'ll send a deletion confirmation on request.' },
      { q: 'Is there a GDPR-compliant data processing agreement?', a: 'Yes. We offer a Data Processing Agreement (DPA) that covers GDPR requirements. Contact us at the time of signup or any time to request it.' },
    ],
  },
  {
    category: 'Custom Agents',
    items: [
      { q: 'What makes something a "custom" agent vs. a catalog agent?', a: 'Catalog agents are pre-built for common, well-defined workflows. Custom agents are built specifically for your unique workflow, industry context, or complex integration requirements — things that don\'t fit a general-purpose template.' },
      { q: 'How long does a custom agent take to build?', a: 'Standard complexity: 2–3 weeks. Advanced: 3–5 weeks. Enterprise/complex: 4–8 weeks. Timeline starts after the scoping call and signed proposal.' },
      { q: 'Can I own the custom agent code?', a: 'The agent architecture belongs to SocioFi, but all your configuration, data, and outputs always belong to you. If you cancel, we delete everything and you retain your own data.' },
      { q: 'What if my custom agent doesn\'t work as expected?', a: 'We iterate until it does. Custom agent development includes a two-week post-launch tuning period. If fundamental issues remain after tuning, we scope a remediation plan at no additional build cost.' },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <style>{STYLES}</style>

      <section className="faq-hero">
        <div className="faq-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="faq-label">FAQ</div>
          </motion.div>
          <motion.h1 className="faq-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            Everything You Need to Know
          </motion.h1>
          <motion.p className="faq-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            {FAQ_DATA.reduce((acc, cat) => acc + cat.items.length, 0)} questions organized by category. If you still have questions, talk to PILOT or email us directly.
          </motion.p>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-container">
          {FAQ_DATA.map((cat, ci) => (
            <Reveal key={cat.category} delay={ci * 0.08}>
              <div className="faq-cat-label">{cat.category}</div>
              <div className="faq-list">
                {cat.items.map((item, i) => {
                  const key = `${ci}-${i}`;
                  return (
                    <div key={key} className="faq-item">
                      <div className="faq-q" onClick={() => toggle(key)}>
                        <span>{item.q}</span>
                        <span className={`arr${openItems[key] ? ' open' : ''}`}>▾</span>
                      </div>
                      {openItems[key] && (
                        <motion.div className="faq-a" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                          {item.a}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Reveal>
          ))}

          <Reveal>
            <div style={{ textAlign: 'center', padding: '20px 0 60px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontFamily: F.h, fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 8 }}>
                Still have questions?
              </div>
              <div style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
                Chat with PILOT (our AI assistant, bottom right) or send us a message directly.
              </div>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/agents/deploy" className="faq-btn-pri">Talk to the Team →</Link>
                <Link href="/agents/catalog" className="faq-btn-ghost">Browse the Catalog</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
