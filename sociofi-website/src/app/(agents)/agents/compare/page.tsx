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
  .cmp-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(139,92,246,0.07) 0%,transparent 70%); }
  .cmp-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .cmp-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .cmp-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .cmp-h1 { font-family:${F.h}; font-size:clamp(1.9rem,3.5vw,2.8rem); font-weight:800; line-height:1.1; letter-spacing:-0.025em; color:var(--text-primary); margin:0 0 14px; }
  .cmp-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:540px; }
  .cmp-section { padding:80px 0; }
  .cmp-bg-alt { background:var(--bg-2); }
  .cmp-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .cmp-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .cmp-table { width:100%; border-collapse:collapse; }
  .cmp-table th { font-family:${F.h}; font-size:0.84rem; font-weight:700; padding:14px 16px; text-align:left; border-bottom:1px solid var(--border); color:var(--text-secondary); white-space:nowrap; }
  .cmp-table th.hi { color:#fff; background:${A}; border-radius:4px 4px 0 0; }
  .cmp-table td { font-family:${F.b}; font-size:0.84rem; padding:14px 16px; border-bottom:1px solid var(--border); color:var(--text-secondary); vertical-align:top; line-height:1.5; }
  .cmp-table td.hi { background:rgba(139,92,246,0.05); color:var(--text-primary); font-weight:500; }
  .cmp-table tr:last-child td { border-bottom:none; }
  .cmp-table td.row-label { font-family:${F.h}; font-weight:600; color:var(--text-primary); font-size:0.88rem; }
  .cmp-insight { background:var(--bg-card); border:2px solid rgba(139,92,246,0.3); border-radius:16px; padding:36px; max-width:760px; }
  .cmp-insight-title { font-family:${F.h}; font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:12px; }
  .cmp-insight-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .cmp-decision { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  @media(max-width:768px) { .cmp-decision { grid-template-columns:1fr; } }
  .cmp-decision-card { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:24px; }
  .cmp-decision-when { font-family:${F.m}; font-size:0.68rem; color:var(--text-muted); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:8px; }
  .cmp-decision-title { font-family:${F.h}; font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; }
  .cmp-decision-items { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px; }
  .cmp-decision-items li { font-family:${F.b}; font-size:0.82rem; color:var(--text-secondary); display:flex; align-items:flex-start; gap:6px; line-height:1.5; }
  .cmp-decision-items li::before { content:'·'; color:${A}; flex-shrink:0; font-size:1rem; line-height:1.2; }
  .cmp-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,${A} 0%,#7C3AED 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .cmp-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; }
  .cmp-btn-ghost:hover { border-color:${A}; color:${A}; }
  .cmp-check { color:#22C55E; font-weight:700; }
  .cmp-x { color:#EF4444; font-weight:700; }
  .cmp-partial { color:#F59E0B; font-weight:700; }
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

const TABLE_ROWS: [string, string, string, string, string, string][] = [
  ['Monthly cost', '$3K–$8K salary+benefits', '$99–$600/month', '$149–$499/month', '$2K–$5K/month', '0 (but your time)'],
  ['Setup time', '1–3 months hiring', 'Hours–days', '3–7 business days', 'Weeks–months', 'Immediate'],
  ['Can reason + adapt', 'YES: Full judgment', 'NO: Rules only', 'YES: Contextual', 'NO: Rules only', 'YES: Human judgment'],
  ['Handles exceptions', 'YES: Yes', 'NO: Often fails', 'YES: Escalates', 'NO: Usually fails', 'YES: Yes'],
  ['Scales with volume', 'NO: Hire more', 'PARTIAL: Tier upgrades', 'YES: Add agents', 'PARTIAL: Limited', 'NO: Hits limits'],
  ['Available 24/7', 'NO: Business hours', 'YES: If configured', 'YES: Yes', 'YES: Yes', 'NO: You sleep'],
  ['Human oversight built-in', 'YES: Self-managed', 'NO: No', 'YES: Approval gates', 'NO: Minimal', 'YES: You are the oversight'],
  ['Setup complexity', 'High (HR, onboarding)', 'Medium (config)', 'Low (we do it)', 'Very high', 'None'],
  ['Improves over time', 'YES: Learning employee', 'NO: Manual updates', 'YES: Monthly tuning', 'NO: Manual rules', 'YES: You improve'],
  ['Good for new tasks', 'YES: Flexible', 'NO: Needs reprogramming', 'YES: Reconfigure', 'NO: Hard to change', 'YES: Flexible'],
];

const DECISION = [
  {
    when: 'Use agents when',
    title: 'Repetitive, high-volume work',
    items: [
      'Same task done 10–100+ times per week',
      'Clear inputs and expected outputs',
      'Rules or guidelines can be articulated',
      'Speed and consistency matter more than novelty',
    ],
  },
  {
    when: 'Use automation when',
    title: 'Simple, fully deterministic flows',
    items: [
      'Exactly the same every time with no variation',
      'No judgment or interpretation needed',
      'Zapier/Make can handle it with 3 steps',
      'You never need exceptions handled',
    ],
  },
  {
    when: 'Keep humans when',
    title: 'Judgment, creativity, relationships',
    items: [
      'Strategic decisions with high stakes',
      'Deep relationship management',
      'Creative work that requires originality',
      'Truly novel situations without precedent',
    ],
  },
];


function CmpCell({ v, isHighlight }: { v: string; isHighlight?: boolean }) {
  const yes = v.startsWith('YES:') || v.startsWith('Yes');
  const no  = v.startsWith('NO:') || v.startsWith('No') || v.startsWith('None');
  const partial = v.startsWith('PARTIAL:') || v.startsWith('Partial');
  const color = yes ? (isHighlight ? '#8B5CF6' : '#22C55E') : no ? '#EF4444' : '#F59E0B';
  const icon = yes
    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    : no
    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
  const label = v.replace(/^(YES:|NO:|PARTIAL:) ?/, '');
  return <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>{icon}<span style={{ fontSize:'0.78rem', color:'var(--text-secondary)' }}>{label}</span></span>;
}
export default function ComparePage() {
  return (
    <>
      <style>{STYLES}</style>

      <section className="cmp-hero">
        <div className="cmp-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="cmp-label">Comparison</div>
          </motion.div>
          <motion.h1 className="cmp-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            How Do AI Agents Compare?
          </motion.h1>
          <motion.p className="cmp-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Side-by-side comparison of AI agents vs. the common alternatives — so you can make the right choice for your situation.
          </motion.p>
        </div>
      </section>

      {/* Big Table */}
      <section className="cmp-section">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-label">Full Comparison</div>
            <h2 className="cmp-h2" style={{ marginBottom: 8 }}>SocioFi Agents vs. everything else</h2>
            <p className="cmp-body" style={{ marginBottom: 32, maxWidth: 520 }}>All numbers are approximations. Your mileage may vary — but the patterns hold consistently.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ overflowX: 'auto' }}>
              <table className="cmp-table">
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th>Hire Employee</th>
                    <th>Zapier / Make</th>
                    <th className="hi">SocioFi Agent</th>
                    <th>Traditional RPA</th>
                    <th>Do It Manually</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map(row => (
                    <tr key={row[0]}>
                      <td className="row-label">{row[0]}</td>
                      <td><CmpCell v={row[1]} /></td>
                      <td><CmpCell v={row[2]} /></td>
                      <td className="hi"><CmpCell v={row[3]} isHighlight /></td>
                      <td><CmpCell v={row[4]} /></td>
                      <td><CmpCell v={row[5]} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Key Insight */}
      <section className="cmp-section cmp-bg-alt">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-insight">
              <div className="cmp-insight-title">"Agents reason. Automation follows rules."</div>
              <div className="cmp-insight-body">
                The fundamental difference between an AI agent and traditional automation (Zapier, Make, RPA) is how they handle variation. Automation executes a pre-defined flowchart — if the input matches the expected format, it works. If it doesn&apos;t, it breaks.<br /><br />
                An agent understands the intent of a task, not just its format. If a vendor sends an invoice with a slightly different column structure than usual, the agent reads the content and adapts. Automation would fail silently or error out.<br /><br />
                This isn&apos;t a theoretical distinction — it&apos;s the difference between an agent that runs reliably for years and an automation that needs maintenance every time something changes.
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Decision Guide */}
      <section className="cmp-section">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-label">Decision Guide</div>
            <h2 className="cmp-h2" style={{ marginBottom: 8 }}>Agents vs. automation vs. humans</h2>
            <p className="cmp-body" style={{ marginBottom: 40, maxWidth: 520 }}>The best solution depends on the nature of the work. Here&apos;s a simple decision framework.</p>
          </Reveal>
          <div className="cmp-decision">
            {DECISION.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.1}>
                <div className="cmp-decision-card" style={{ borderTop: `3px solid ${i === 0 ? A : i === 1 ? '#22C55E' : '#F59E0B'}` }}>
                  <div className="cmp-decision-when">{d.when}</div>
                  <div className="cmp-decision-title">{d.title}</div>
                  <ul className="cmp-decision-items">
                    {d.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cmp-section cmp-bg-alt" style={{ textAlign: 'center' }}>
        <div className="cmp-container">
          <Reveal>
            <h2 className="cmp-h2" style={{ marginBottom: 12 }}>Think agents are the right fit?</h2>
            <p className="cmp-body" style={{ maxWidth: 420, margin: '0 auto 28px' }}>Browse the catalog and deploy your first agent in under a week.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/agents/catalog" className="cmp-btn-pri">Browse the Catalog →</Link>
              <Link href="/agents/how-it-works" className="cmp-btn-ghost">How It Works</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
