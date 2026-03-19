'use client';
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAgent, agents, CATEGORY_META } from '@/lib/agents';

const A = '#8B5CF6';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .ad-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .ad-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .ad-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .ad-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .ad-h1 { font-family:${F.h}; font-size:clamp(2rem,4vw,2.6rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 16px; }
  .ad-desc { font-family:${F.b}; font-size:1.05rem; line-height:1.75; color:var(--text-secondary); max-width:620px; margin:0 0 28px; }
  .ad-hero-row { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
  .ad-price-badge { display:inline-flex; align-items:center; gap:6px; padding:8px 18px; border-radius:100px; background:${A}; color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:700; }
  .ad-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; box-shadow:0 4px 24px rgba(139,92,246,0.35); transition:transform 0.2s,box-shadow 0.2s; }
  .ad-btn-pri:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(139,92,246,0.5); }
  .ad-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; transition:border-color 0.2s,color 0.2s; }
  .ad-btn-ghost:hover { border-color:${A}; color:${A}; }
  .ad-section { padding:80px 0; }
  .ad-bg-alt { background:var(--bg-2); }
  .ad-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .ad-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .ad-lifecycle { display:flex; align-items:center; gap:0; overflow-x:auto; padding:24px 0; }
  .ad-lc-node { flex-shrink:0; display:flex; flex-direction:column; align-items:center; gap:10px; }
  .ad-lc-box { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:14px 20px; font-family:${F.h}; font-size:0.84rem; font-weight:700; color:var(--text-primary); white-space:nowrap; transition:border-color 0.4s,box-shadow 0.4s; position:relative; overflow:hidden; }
  .ad-lc-box.active { border-color:${A}; box-shadow:0 0 0 2px rgba(139,92,246,0.2),0 4px 20px rgba(139,92,246,0.2); }
  .ad-lc-box.active::before { content:''; position:absolute; top:0;left:0;right:0;height:2px; background:linear-gradient(90deg,${A},#C4B5FD); }
  .ad-lc-label { font-family:${F.m}; font-size:0.64rem; color:var(--text-muted); letter-spacing:0.08em; }
  .ad-lc-arrow { color:var(--text-muted); font-size:1.2rem; margin:0 8px; flex-shrink:0; margin-bottom:24px; }
  .ad-dot-flow { position:relative; width:40px; height:2px; background:var(--border); overflow:visible; flex-shrink:0; margin-bottom:24px; }
  .ad-dot-flow::after { content:''; position:absolute; width:6px;height:6px; border-radius:50%; background:${A}; top:-2px; animation:flow 1.5s linear infinite; }
  @keyframes flow { 0%{left:-6px;opacity:0} 20%{opacity:1} 80%{opacity:1} 100%{left:40px;opacity:0} }
  .ad-caps { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  @media(max-width:640px) { .ad-caps { grid-template-columns:1fr; } }
  .ad-cap { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:24px; display:flex; gap:16px; }
  .ad-cap-dot { width:8px; height:8px; border-radius:50%; background:${A}; flex-shrink:0; margin-top:6px; }
  .ad-cap-title { font-family:${F.h}; font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:6px; }
  .ad-cap-detail { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; }
  .ad-ints { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px; }
  .ad-int { background:var(--bg-card); border:1px solid var(--border); border-radius:10px; padding:14px 16px; }
  .ad-int-name { font-family:${F.h}; font-size:0.84rem; font-weight:600; color:var(--text-secondary); margin-bottom:4px; }
  .ad-int-cat { font-family:${F.m}; font-size:0.64rem; color:var(--text-muted); }
  .ad-price-card { background:var(--bg-card); border:2px solid rgba(139,92,246,0.3); border-radius:16px; padding:32px; max-width:480px; }
  .ad-price-val { font-family:${F.h}; font-size:2.4rem; font-weight:800; color:${A}; margin-bottom:4px; }
  .ad-price-val span { font-family:${F.b}; font-size:0.9rem; font-weight:400; color:var(--text-muted); }
  .ad-price-items { list-style:none; padding:0; margin:20px 0; display:flex; flex-direction:column; gap:10px; }
  .ad-price-items li { font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); display:flex; align-items:center; gap:8px; }
  .ad-price-items li::before { content:''; display:inline-block; width:7px; height:12px; border-right:2px solid;border-bottom:2px solid; transform:rotate(40deg) translateY(-3px); color:${A}; font-weight:700; }
  .ad-faq { display:flex; flex-direction:column; gap:0; border:1px solid var(--border); border-radius:16px; overflow:hidden; }
  .ad-faq-item { border-bottom:1px solid var(--border); }
  .ad-faq-item:last-child { border-bottom:none; }
  .ad-faq-q { padding:20px 24px; font-family:${F.h}; font-size:0.95rem; font-weight:600; color:var(--text-primary); cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:12px; transition:color 0.2s; }
  .ad-faq-q:hover { color:${A}; }
  .ad-faq-q .arrow { font-size:1rem; color:var(--text-muted); transition:transform 0.3s; flex-shrink:0; }
  .ad-faq-q .arrow.open { transform:rotate(180deg); }
  .ad-faq-a { padding:0 24px 20px; font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); line-height:1.7; }
  .ad-related { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  @media(max-width:768px) { .ad-related { grid-template-columns:1fr; } }
  .ad-rel-card { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:24px; transition:border-color 0.3s; text-decoration:none; display:block; }
  .ad-rel-card:hover { border-color:rgba(139,92,246,0.3); }
  .ad-rel-cat { font-family:${F.m}; font-size:0.66rem; color:${A}; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:8px; }
  .ad-rel-name { font-family:${F.h}; font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:6px; }
  .ad-rel-price { font-family:${F.h}; font-size:0.9rem; font-weight:600; color:${A}; }
  .ad-not-found { padding:160px 0; text-align:center; font-family:${F.b}; color:var(--text-secondary); }
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

const LC_NODES = ['Receive', 'Reason', 'Act', 'Verify', 'Deliver'];

export default function AgentDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';
  const agent = getAgent(slug);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeNode, setActiveNode] = useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setActiveNode(n => (n + 1) % LC_NODES.length), 1200);
    return () => clearInterval(id);
  }, []);

  if (!agent) {
    return (
      <div className="ad-not-found">
        <style>{STYLES}</style>
        <h2 style={{ fontFamily: F.h, fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 12 }}>Agent not found</h2>
        <p>This agent doesn&apos;t exist in the catalog.</p>
        <Link href="/agents/catalog" style={{ color: A, fontFamily: F.h, fontWeight: 600 }}>Back to catalog →</Link>
      </div>
    );
  }

  const relatedAgents = agent.relatedAgents
    .map(s => agents.find(a => a.slug === s))
    .filter(Boolean) as typeof agents;

  return (
    <>
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="ad-hero">
        <div className="ad-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="ad-label">{CATEGORY_META[agent.category].label}</div>
          </motion.div>
          <motion.h1 className="ad-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            {agent.name}
          </motion.h1>
          <motion.p className="ad-desc" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            {agent.description}
          </motion.p>
          <motion.div className="ad-hero-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="ad-price-badge">${agent.price}/month</div>
            <Link href={`/agents/deploy?agent=${agent.slug}`} className="ad-btn-pri">Deploy This Agent →</Link>
            <Link href="/agents/catalog" className="ad-btn-ghost">All Agents</Link>
          </motion.div>
        </div>
      </section>

      {/* Lifecycle Visual */}
      <section className="ad-section ad-bg-alt">
        <div className="ad-container">
          <Reveal>
            <div className="ad-label">How It Works</div>
            <h2 className="ad-h2" style={{ marginBottom: 8 }}>The agent lifecycle</h2>
            <p className="ad-body" style={{ marginBottom: 32, maxWidth: 520 }}>Every agent follows a reasoning-action loop. It receives inputs, reasons about them, takes action, verifies the output, and delivers results.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="ad-lifecycle">
              {LC_NODES.map((node, i) => (
                <React.Fragment key={node}>
                  <div className="ad-lc-node">
                    <div className={`ad-lc-box${activeNode === i ? ' active' : ''}`}>{node}</div>
                    <div className="ad-lc-label">Step {i + 1}</div>
                  </div>
                  {i < LC_NODES.length - 1 && <div className="ad-dot-flow" />}
                </React.Fragment>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="ad-section">
        <div className="ad-container">
          <Reveal>
            <div className="ad-label">What It Does</div>
            <h2 className="ad-h2" style={{ marginBottom: 8 }}>Capabilities</h2>
            <p className="ad-body" style={{ marginBottom: 32, maxWidth: 480 }}>Every capability is configured during setup based on your workflows and tools.</p>
          </Reveal>
          <div className="ad-caps">
            {agent.capabilities.map((cap, i) => (
              <Reveal key={cap.title} delay={i * 0.08}>
                <div className="ad-cap">
                  <div className="ad-cap-dot" />
                  <div>
                    <div className="ad-cap-title">{cap.title}</div>
                    <div className="ad-cap-detail">{cap.detail}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="ad-section ad-bg-alt">
        <div className="ad-container">
          <Reveal>
            <div className="ad-label">Integrations</div>
            <h2 className="ad-h2" style={{ marginBottom: 8 }}>Works with your existing tools</h2>
            <p className="ad-body" style={{ marginBottom: 32, maxWidth: 480 }}>We handle the integration setup. You just tell us what software you use.</p>
          </Reveal>
          <div className="ad-ints">
            {agent.integrations.map((int, i) => (
              <Reveal key={int.name} delay={i * 0.06}>
                <div className="ad-int">
                  <div className="ad-int-name">{int.name}</div>
                  <div className="ad-int-cat">Integration</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Configuration */}
      <section className="ad-section">
        <div className="ad-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            <Reveal>
              <div>
                <div className="ad-label">Setup & Configuration</div>
                <h2 className="ad-h2" style={{ marginBottom: 16 }}>Configured for your business</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Setup takes ' + agent.setupDays + ' from purchase',
                    'We connect to your existing tools — no dev work needed from you',
                    'Configuration call to define your rules, schedules, and preferences',
                    'Test run with sample data before going live',
                    'Engineer oversight during the first 2 weeks of operation',
                  ].map(item => (
                    <li key={item} style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.6 }}>
                      <span style={{ color: A, fontWeight: 700, flexShrink: 0 }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div style={{ fontFamily: F.m, fontSize: '0.72rem', color: 'var(--text-muted)', padding: '12px 16px', background: 'var(--bg-2)', borderRadius: 8, borderLeft: `3px solid ${A}` }}>
                  A SocioFi engineer reviews every agent deployment before it goes live.
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="ad-price-card">
                <div style={{ fontFamily: F.h, fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 4 }}>{agent.name}</div>
                <div className="ad-price-val">${agent.price}<span>/month</span></div>
                <div style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: 16 }}>Everything included in your subscription:</div>
                <ul className="ad-price-items">
                  {['Agent software license', 'Initial setup & configuration', 'All integrations listed above', 'Monitoring & uptime alerts', 'Monthly performance report', 'Engineer support via Slack'].map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link href={`/agents/deploy?agent=${agent.slug}`} className="ad-btn-pri" style={{ display: 'flex', justifyContent: 'center' }}>Deploy This Agent →</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ad-section ad-bg-alt">
        <div className="ad-container" style={{ maxWidth: 720 }}>
          <Reveal>
            <div className="ad-label">Common Questions</div>
            <h2 className="ad-h2" style={{ marginBottom: 32 }}>FAQ — {agent.name}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="ad-faq">
              {[
                ...agent.faq,
                { q: `How long does setup take?`, a: `Typically ${agent.setupDays}. We handle all integration work — you just need to be available for a 30-minute configuration call.` },
                { q: 'What if the agent makes a mistake?', a: 'All outputs go through a verification step. For high-stakes actions, human approval is required before anything is sent or changed.' },
                { q: 'Can I pause or cancel anytime?', a: 'Yes. Cancel with 30 days notice. No penalties, no exit fees. Your data is deleted within 30 days of cancellation.' },
                { q: 'Do I need technical knowledge to use this?', a: 'No. You describe your workflow to us in plain English. We handle all the technical setup.' },
              ].map((item, i) => (
                <div key={i} className="ad-faq-item">
                  <div className="ad-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{item.q}</span>
                    <span className={`arrow${openFaq === i ? ' open' : ''}`}>▾</span>
                  </div>
                  {openFaq === i && (
                    <motion.div className="ad-faq-a" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                      {item.a}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related Agents */}
      {relatedAgents.length > 0 && (
        <section className="ad-section">
          <div className="ad-container">
            <Reveal>
              <div className="ad-label">Related Agents</div>
              <h2 className="ad-h2" style={{ marginBottom: 32 }}>Often deployed together</h2>
            </Reveal>
            <div className="ad-related">
              {relatedAgents.map((rel, i) => (
                <Reveal key={rel.slug} delay={i * 0.1}>
                  <Link href={`/agents/catalog/${rel.slug}`} className="ad-rel-card">
                    <div className="ad-rel-cat">{CATEGORY_META[rel.category].label}</div>
                    <div className="ad-rel-name">{rel.name}</div>
                    <div style={{ fontFamily: F.b, fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{rel.tagline}</div>
                    <div className="ad-rel-price">${rel.price}/mo</div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer */}
      <section style={{ padding: '80px 0', background: 'var(--bg-2)', textAlign: 'center' }}>
        <div className="ad-container">
          <Reveal>
            <h2 className="ad-h2" style={{ marginBottom: 12 }}>Ready to deploy the {agent.name}?</h2>
            <p className="ad-body" style={{ maxWidth: 460, margin: '0 auto 28px' }}>Setup takes {agent.setupDays}. We handle everything.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={`/agents/deploy?agent=${agent.slug}`} className="ad-btn-pri">Deploy This Agent →</Link>
              <Link href="/agents/catalog" className="ad-btn-ghost">Back to Catalog</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
