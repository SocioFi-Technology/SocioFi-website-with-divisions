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
  .hiw-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .hiw-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .hiw-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .hiw-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .hiw-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .hiw-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:540px; }
  .hiw-section { padding:80px 0; }
  .hiw-bg-alt { background:var(--bg-2); }
  .hiw-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .hiw-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .hiw-split { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:start; }
  @media(max-width:768px) { .hiw-split { grid-template-columns:1fr; } }
  .hiw-diagram { background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:28px; }
  .hiw-diagram-title { font-family:${F.m}; font-size:0.72rem; color:var(--text-muted); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px; }
  .hiw-flow { display:flex; flex-direction:column; gap:8px; }
  .hiw-flow-box { padding:10px 14px; border-radius:8px; font-family:${F.b}; font-size:0.82rem; color:var(--text-secondary); border:1px solid var(--border); display:flex; align-items:center; gap:8px; }
  .hiw-flow-arrow { font-size:0.8rem; color:var(--text-muted); text-align:center; }
  .hiw-agent-flow-box { padding:10px 14px; border-radius:8px; font-family:${F.b}; font-size:0.82rem; color:var(--text-primary); border:1px solid rgba(139,92,246,0.3); background:rgba(139,92,246,0.05); display:flex; align-items:center; gap:8px; }
  .hiw-lifecycle { display:flex; flex-direction:column; gap:0; }
  .hiw-lc-item { display:flex; gap:24px; align-items:flex-start; padding:28px 0; border-bottom:1px solid var(--border); }
  .hiw-lc-item:last-child { border-bottom:none; }
  .hiw-lc-num { font-family:${F.h}; font-size:1.6rem; font-weight:800; color:${A}; opacity:0.3; flex-shrink:0; width:32px; line-height:1; }
  .hiw-lc-num.active-lc { opacity:1; }
  .hiw-lc-content { flex:1; }
  .hiw-lc-title { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:6px; }
  .hiw-lc-desc { font-family:${F.b}; font-size:0.88rem; color:var(--text-secondary); line-height:1.6; }
  .hiw-lc-glow { width:3px; border-radius:100px; background:rgba(139,92,246,0.2); flex-shrink:0; margin-top:6px; transition:background 0.4s; }
  .hiw-lc-glow.active-lc { background:${A}; }
  .hiw-oversight { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  @media(max-width:768px) { .hiw-oversight { grid-template-columns:1fr; } }
  .hiw-oversight-card { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:24px; border-left:3px solid ${A}; }
  .hiw-oversight-title { font-family:${F.h}; font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; }
  .hiw-oversight-desc { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; }
  .hiw-limits { display:flex; flex-direction:column; gap:16px; }
  .hiw-limit { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:20px 24px; display:flex; gap:14px; }
  .hiw-limit-x { width:24px; height:24px; border-radius:50%; background:rgba(239,68,68,0.1); color:#EF4444; font-size:0.8rem; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:700; margin-top:2px; }
  .hiw-limit-title { font-family:${F.h}; font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
  .hiw-limit-desc { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.5; }
  .hiw-security { display:flex; flex-direction:column; gap:0; }
  .hiw-sec-item { display:flex; gap:16px; align-items:flex-start; padding:20px 0; border-bottom:1px solid var(--border); }
  .hiw-sec-item:last-child { border-bottom:none; }
  .hiw-sec-icon { width:36px; height:36px; border-radius:8px; background:rgba(139,92,246,0.1); display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
  .hiw-sec-title { font-family:${F.h}; font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
  .hiw-sec-desc { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.6; }
  .hiw-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .hiw-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .hiw-btn-ghost:hover { border-color:${A}; color:${A}; }
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

const LC_NODES = [
  { label: 'Receive', desc: 'The agent receives an input — an email, a trigger event, a scheduled run, or an API call. It understands the context, not just the content.' },
  { label: 'Reason', desc: 'It reasons about what to do. Unlike rigid automation, it can handle variations, ambiguity, and edge cases by applying judgment to the situation.' },
  { label: 'Act', desc: 'It takes action — runs a query, sends a message, updates a record, generates a document. Each action is logged and reversible.' },
  { label: 'Verify', desc: 'It checks its own output. Did it do what was intended? Is the result sensible? For high-stakes actions, it requests human approval before proceeding.' },
  { label: 'Deliver', desc: 'It delivers the output to the right destination — email, Slack, database, report — and records a complete audit trail of every step.' },
  { label: 'Learn', desc: 'Over time, it learns which approaches work best for your context. Our engineers review performance monthly and tune the configuration.' },
];

const OVERSIGHT = [
  { title: 'Approval gates', desc: 'For actions like sending emails or updating records, you can require human approval before anything goes out. The agent drafts, you approve.' },
  { title: 'Confidence thresholds', desc: 'If the agent isn\'t confident about a decision (ambiguous input, unusual edge case), it escalates to a human instead of guessing.' },
  { title: 'Audit trail', desc: 'Every action is logged with a timestamp, input, output, and reason. You can review exactly what the agent did and why at any time.' },
];

const LIMITS = [
  { title: 'Creative judgment', desc: 'Agents follow configured logic and guidelines. They don\'t make high-level strategic decisions or exercise creative judgment the way a skilled human does.' },
  { title: 'Novel situations without rules', desc: 'When something genuinely unexpected happens that wasn\'t anticipated in configuration, agents escalate rather than improvise.' },
  { title: 'Deep relationship context', desc: 'An agent knows your customers\' data — not your decade of relationship history. For complex client relationships, humans should stay in the loop.' },
  { title: 'Legal or medical advice', desc: 'Agents can process, summarize, and flag — but they cannot provide professional advice. Any output in regulated fields needs human review.' },
];

const SECURITY = [
  { icon: '🔒', title: 'TLS 1.3 in transit', desc: 'All data moving between your tools and our agents is encrypted with TLS 1.3.' },
  { icon: '💾', title: 'AES-256 at rest', desc: 'Stored data is encrypted at rest using AES-256 — industry standard for sensitive data.' },
  { icon: '🏢', title: 'Hosted on SocioFi Cloud', desc: 'Agents run on our own managed infrastructure — not shared third-party platforms.' },
  { icon: '🗑', title: 'Data deletion', desc: 'All your data is deleted within 30 days of cancellation. No retention, no reuse.' },
  { icon: '👁', title: 'Access controls', desc: 'Role-based access. Only the people you designate can view agent logs and outputs.' },
];

export default function HowItWorksPage() {
  const [activeLc, setActiveLc] = useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setActiveLc(n => (n + 1) % LC_NODES.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <section className="hiw-hero">
        <div className="hiw-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="hiw-label">How It Works</div>
          </motion.div>
          <motion.h1 className="hiw-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            AI Agents, Explained.<br />No Jargon. No Hype.
          </motion.h1>
          <motion.p className="hiw-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            What exactly is an AI agent, how does it work, where do humans stay in control, and what can&apos;t it do? All answered here.
          </motion.p>
        </div>
      </section>

      {/* Section 1: What IS an AI Agent? */}
      <section className="hiw-section">
        <div className="hiw-container">
          <Reveal>
            <div className="hiw-label">The Basics</div>
            <h2 className="hiw-h2" style={{ marginBottom: 16 }}>What IS an AI Agent?</h2>
            <p className="hiw-body" style={{ maxWidth: 640, marginBottom: 48 }}>
              An AI agent is software that can reason about a task and take action to complete it — not just follow a fixed script. The key difference from traditional automation is that agents handle variation and judgment. Here&apos;s the distinction:
            </p>
          </Reveal>
          <div className="hiw-split">
            <Reveal>
              <div className="hiw-diagram">
                <div className="hiw-diagram-title">Traditional Automation (e.g. Zapier)</div>
                <div className="hiw-flow">
                  {['Trigger fires', '→ Check if field = value', '→ If yes: do Action A', '→ If no: do nothing', '→ DONE'].map((step, i) => (
                    <React.Fragment key={step}>
                      {step.startsWith('→') ? <div className="hiw-flow-arrow">{step}</div> : <div className="hiw-flow-box">⚡ {step}</div>}
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ marginTop: 16, fontFamily: F.b, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Rigid. Breaks on unexpected input. Can&apos;t handle variations. Needs a rule for every case.
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="hiw-diagram" style={{ borderColor: 'rgba(139,92,246,0.3)' }}>
                <div className="hiw-diagram-title" style={{ color: A }}>AI Agent (SocioFi)</div>
                <div className="hiw-flow">
                  {[
                    'Receive input (any format)',
                    'Understand intent + context',
                    'Reason about best action',
                    'Take action (flexible)',
                    'Verify result → deliver',
                  ].map((step) => (
                    <div key={step} className="hiw-agent-flow-box">
                      <span style={{ color: A, fontSize: '0.7rem' }}>◆</span> {step}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, fontFamily: F.b, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Flexible. Handles variation. Escalates when unsure. Gets better over time.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 2: Agent Lifecycle */}
      <section className="hiw-section hiw-bg-alt">
        <div className="hiw-container">
          <div className="hiw-split">
            <Reveal>
              <div>
                <div className="hiw-label">The Loop</div>
                <h2 className="hiw-h2" style={{ marginBottom: 8 }}>The 6-step agent lifecycle</h2>
                <p className="hiw-body" style={{ marginBottom: 32, maxWidth: 420 }}>Every action an agent takes goes through this loop — from receiving input to delivering output.</p>
              </div>
              <div className="hiw-lifecycle">
                {LC_NODES.map((node, i) => (
                  <div key={node.label} className="hiw-lc-item">
                    <div className={`hiw-lc-glow${activeLc === i ? ' active-lc' : ''}`} style={{ height: 40 }} />
                    <div className={`hiw-lc-num${activeLc === i ? ' active-lc' : ''}`}>0{i + 1}</div>
                    <div className="hiw-lc-content">
                      <div className="hiw-lc-title">{node.label}</div>
                      <div className="hiw-lc-desc">{node.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ position: 'sticky', top: 100 }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, padding: 28 }}>
                  <div style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, letterSpacing: '0.1em', marginBottom: 16, textTransform: 'uppercase' }}>
                    Currently: {LC_NODES[activeLc].label}
                  </div>
                  <div style={{ fontFamily: F.h, fontSize: '2.4rem', fontWeight: 800, color: A, opacity: 0.15, lineHeight: 1, marginBottom: 12 }}>0{activeLc + 1}</div>
                  <div style={{ fontFamily: F.h, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{LC_NODES[activeLc].label}</div>
                  <div style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{LC_NODES[activeLc].desc}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 3: Human Oversight */}
      <section className="hiw-section">
        <div className="hiw-container">
          <Reveal>
            <div className="hiw-label">Control</div>
            <h2 className="hiw-h2" style={{ marginBottom: 8 }}>Where humans stay in control</h2>
            <p className="hiw-body" style={{ maxWidth: 560, marginBottom: 40 }}>We build agents to augment human judgment, not replace it. Every agent has configurable oversight points where your team stays in the loop.</p>
          </Reveal>
          <div className="hiw-oversight">
            {OVERSIGHT.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="hiw-oversight-card">
                  <div className="hiw-oversight-title">{item.title}</div>
                  <div className="hiw-oversight-desc">{item.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: What Agents CAN'T Do */}
      <section className="hiw-section hiw-bg-alt">
        <div className="hiw-container">
          <Reveal>
            <div className="hiw-label">Honest Limitations</div>
            <h2 className="hiw-h2" style={{ marginBottom: 8 }}>What agents can&apos;t do</h2>
            <p className="hiw-body" style={{ maxWidth: 560, marginBottom: 40 }}>We&apos;d rather be honest now than disappoint you later. These are the genuine limits of current agent technology.</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            {LIMITS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="hiw-limit">
                  <div className="hiw-limit-x">✕</div>
                  <div>
                    <div className="hiw-limit-title">{item.title}</div>
                    <div className="hiw-limit-desc">{item.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div style={{ padding: '24px 28px', background: 'var(--bg-card)', border: `1px solid rgba(139,92,246,0.2)`, borderRadius: 14, maxWidth: 620 }}>
              <p style={{ fontFamily: F.h, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                &ldquo;An agent is a very capable, very reliable junior employee. Not a replacement for your best people — a force multiplier for your whole team.&rdquo;
              </p>
              <div style={{ fontFamily: F.m, fontSize: '0.7rem', color: A, letterSpacing: '0.08em' }}>Kamrul Hasan · CTO, SocioFi Technology</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section 5: Security & Data */}
      <section className="hiw-section">
        <div className="hiw-container">
          <Reveal>
            <div className="hiw-label">Security</div>
            <h2 className="hiw-h2" style={{ marginBottom: 8 }}>Security & data handling</h2>
            <p className="hiw-body" style={{ maxWidth: 540, marginBottom: 40 }}>Your data doesn&apos;t leave your environment without your permission. Here&apos;s exactly how we protect it.</p>
          </Reveal>
          <div className="hiw-security">
            {SECURITY.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="hiw-sec-item">
                  <div className="hiw-sec-icon">{item.icon}</div>
                  <div>
                    <div className="hiw-sec-title">{item.title}</div>
                    <div className="hiw-sec-desc">{item.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div style={{ marginTop: 24 }}>
              <Link href="/agents/security" style={{ fontFamily: F.h, fontSize: '0.88rem', fontWeight: 600, color: A, textDecoration: 'none' }}>
                Full security documentation →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="hiw-section hiw-bg-alt" style={{ textAlign: 'center' }}>
        <div className="hiw-container">
          <Reveal>
            <h2 className="hiw-h2" style={{ marginBottom: 12 }}>Ready to see an agent in action?</h2>
            <p className="hiw-body" style={{ maxWidth: 420, margin: '0 auto 28px' }}>Browse the catalog, pick an agent, and we&apos;ll get it running in your environment within a week.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/agents/catalog" className="hiw-btn-pri">Browse the Catalog →</Link>
              <Link href="/agents/deploy" className="hiw-btn-ghost">Deploy an Agent</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
