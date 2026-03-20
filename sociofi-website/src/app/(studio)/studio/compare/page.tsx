'use client';
import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#72C4B2';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

const STYLES = `
  .cmp-hero { padding:140px 0 80px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(114,196,178,0.07) 0%,transparent 70%); }
  .cmp-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .cmp-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .cmp-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .cmp-h1 { font-family:${F.h}; font-size:clamp(2rem,4vw,3rem); font-weight:800; line-height:1.08; letter-spacing:-0.03em; color:var(--text-primary); margin:0 0 16px; }
  .cmp-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:560px; margin:0; }
  .cmp-section { padding:80px 0; }
  .cmp-bg-alt { background:var(--bg-2); }
  .cmp-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .cmp-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .cmp-table-wrap { overflow-x:auto; border-radius:14px; border:1px solid var(--border); }
  .cmp-table { width:100%; border-collapse:collapse; min-width:720px; }
  .cmp-table thead tr { background:var(--bg-2); }
  .cmp-table th { font-family:${F.h}; font-size:0.82rem; font-weight:700; padding:14px 18px; text-align:left; border-bottom:2px solid var(--border); color:var(--text-secondary); white-space:nowrap; }
  .cmp-table th.hi { color:#fff; background:${A}; border-bottom:2px solid ${A}; }
  .cmp-table td { font-family:${F.b}; font-size:0.84rem; padding:14px 18px; border-bottom:1px solid var(--border); color:var(--text-secondary); vertical-align:middle; line-height:1.5; }
  .cmp-table td.hi { background:rgba(114,196,178,0.06); color:var(--text-primary); font-weight:500; }
  .cmp-table tr:last-child td { border-bottom:none; }
  .cmp-table td.row-label { font-family:${F.h}; font-weight:600; color:var(--text-primary); font-size:0.88rem; white-space:nowrap; }
  .cmp-table tr:hover td { background:rgba(114,196,178,0.03); }
  .cmp-table tr:hover td.hi { background:rgba(114,196,178,0.09); }
  .cmp-scenarios { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
  @media(max-width:1024px) { .cmp-scenarios { grid-template-columns:repeat(2,1fr); } }
  @media(max-width:600px) { .cmp-scenarios { grid-template-columns:1fr; } }
  .cmp-scenario-card { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:24px; transition:border-color 0.3s; }
  .cmp-scenario-card:hover { border-color:rgba(114,196,178,0.3); }
  .cmp-scenario-who { font-family:${F.m}; font-size:0.68rem; color:${A}; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:8px; }
  .cmp-scenario-title { font-family:${F.h}; font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:10px; }
  .cmp-scenario-items { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px; }
  .cmp-scenario-items li { font-family:${F.b}; font-size:0.82rem; color:var(--text-secondary); display:flex; align-items:flex-start; gap:6px; line-height:1.5; }
  .cmp-scenario-items li::before { content:'·'; color:${A}; flex-shrink:0; font-size:1rem; line-height:1.2; }
  .cmp-honest { background:var(--bg-card); border:1px solid var(--border); border-left:3px solid #EF4444; border-radius:14px; padding:32px 36px; }
  .cmp-honest-title { font-family:${F.h}; font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:16px; }
  .cmp-honest-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
  .cmp-honest-list li { font-family:${F.b}; font-size:0.9rem; color:var(--text-secondary); display:flex; align-items:flex-start; gap:10px; line-height:1.55; }
  .cmp-btn-pri { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; background:linear-gradient(135deg,#3A589E 0%,${A} 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; transition:transform 0.2s,box-shadow 0.2s; }
  .cmp-btn-pri:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(58,88,158,0.35); }
  .cmp-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:10px; border:1.5px solid var(--border); color:var(--text-primary); font-family:${F.h}; font-size:0.9rem; font-weight:600; text-decoration:none; transition:border-color 0.2s,color 0.2s; }
  .cmp-btn-ghost:hover { border-color:${A}; color:${A}; }
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

function CmpCell({ v, isHighlight }: { v: string; isHighlight?: boolean }) {
  const yes = v.startsWith('YES:');
  const no  = v.startsWith('NO:');
  const color = yes ? (isHighlight ? '#72C4B2' : '#22C55E') : no ? '#EF4444' : '#F59E0B';
  const icon = yes
    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
    : no
    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
  const label = v.replace(/^(YES:|NO:|PARTIAL:) ?/, '');
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
      {icon}
      <span style={{ fontSize:'0.78rem', color:'var(--text-secondary)' }}>{label}</span>
    </span>
  );
}

// [factor, traditional agency, freelancer, in-house, sociofi studio]
const TABLE_ROWS: [string, string, string, string, string][] = [
  ['Simple MVP cost',        '$20K–50K',             '$5K–15K',              'N/A',                   '$3K–8K'],
  ['Full product cost',      '$50K–150K',             '$15K–40K',             '3–6 months salary',     '$8K–20K'],
  ['Timeline',               '3–6 months',            '2–4 months',           'Ongoing',               '2–6 weeks'],
  ['After-launch support',   'New contract',          'Uncertain',            'You manage',            'YES: Services team'],
  ['Code ownership',         'PARTIAL: Varies',       'YES: Usually',         'YES: Yes',              'YES: Always'],
  ['Fixed price',            'NO: Usually hourly',    'PARTIAL: Sometimes',   'NO: Salary',            'YES: Yes'],
  ['Handles scope changes',  'PARTIAL: Change orders','YES: Flexible',        'YES: Yes',              'YES: Scoped changes'],
  ['AI-accelerated',         'PARTIAL: Some agencies','PARTIAL: Maybe',       'PARTIAL: Depends',      'YES: Core capability'],
  ['Human oversight',        'YES: Teams review',     'NO: Solo',             'YES: Your team',        'YES: Engineers review all'],
  ['No lock-in',             'PARTIAL: Varies',       'YES: Usually',         'NO: Employment',        'YES: 100% code ownership'],
];

const SCENARIOS = [
  {
    who: 'Choose SocioFi when',
    title: 'Fast, fixed, and yours forever',
    items: [
      'Fixed budget with hard ceiling',
      'Need to ship in weeks, not months',
      'Want 100% code ownership always',
      'AI-accelerated speed matters',
    ],
    accent: A,
  },
  {
    who: 'Choose an agency when',
    title: 'Full-service creative + dev',
    items: [
      'Need brand identity + development',
      'Large ongoing multi-year program',
      'Have budget for $50K+ retainer',
      'Need integrated media and strategy',
    ],
    accent: '#6BA3E8',
  },
  {
    who: 'Choose a freelancer when',
    title: 'Simple, one-off task',
    items: [
      'Narrow, well-defined single feature',
      'Small budget, low complexity',
      'Comfortable managing the person',
      'Low risk if quality varies',
    ],
    accent: '#F59E0B',
  },
  {
    who: 'Choose in-house when',
    title: 'Core team, continuous work',
    items: [
      'Building a technology company',
      'Continuous IP-sensitive development',
      'Need embedded team culture',
      'Long-term proprietary roadmap',
    ],
    accent: '#E8916F',
  },
];

const NOT_FOR_US = [
  'You need ongoing fractional CTO services — we build, we don\'t manage your roadmap',
  'You want someone to own your entire technical strategy long-term',
  'You have a $500 budget (we\'re not the cheapest option — we\'re the best value at our price point)',
  'You need someone to attend 5+ hours of meetings per week',
  'Your project requires government or defense security clearances',
];

export default function ComparePage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="cmp-hero">
        <div className="cmp-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="cmp-label">Alternatives</div>
          </motion.div>
          <motion.h1 className="cmp-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            SocioFi Studio vs. Everyone Else.
          </motion.h1>
          <motion.p className="cmp-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            An honest comparison. We&apos;ll tell you when we&apos;re not the right choice.
          </motion.p>
        </div>
      </section>

      {/* Big Comparison Table */}
      <section className="cmp-section">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-label">Full Comparison</div>
            <h2 className="cmp-h2" style={{ marginBottom: 8 }}>How we stack up — row by row</h2>
            <p className="cmp-body" style={{ marginBottom: 32, maxWidth: 540 }}>
              All estimates are real ranges, not marketing figures. Prices and timelines vary — but the patterns hold.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="cmp-table-wrap">
              <table className="cmp-table">
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th>Traditional Agency</th>
                    <th>Freelancer</th>
                    <th>In-House Hire</th>
                    <th className="hi">SocioFi Studio</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map(row => (
                    <tr key={row[0]}>
                      <td className="row-label">{row[0]}</td>
                      <td><CmpCell v={row[1]} /></td>
                      <td><CmpCell v={row[2]} /></td>
                      <td><CmpCell v={row[3]} /></td>
                      <td className="hi"><CmpCell v={row[4]} isHighlight /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* When to choose each */}
      <section className="cmp-section cmp-bg-alt">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-label">Decision Guide</div>
            <h2 className="cmp-h2" style={{ marginBottom: 8 }}>When to choose each option</h2>
            <p className="cmp-body" style={{ marginBottom: 40, maxWidth: 540 }}>
              Every option exists for a reason. The right choice depends on your situation, not on who has the best marketing.
            </p>
          </Reveal>
          <div className="cmp-scenarios">
            {SCENARIOS.map((s, i) => (
              <Reveal key={s.who} delay={i * 0.08}>
                <div className="cmp-scenario-card" style={{ borderTop: `3px solid ${s.accent}` }}>
                  <div className="cmp-scenario-who" style={{ color: s.accent }}>{s.who}</div>
                  <div className="cmp-scenario-title">{s.title}</div>
                  <ul className="cmp-scenario-items">
                    {s.items.map(item => (
                      <li key={item} style={{ listStyle: 'none' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Honest section */}
      <section className="cmp-section">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-label">Honest Assessment</div>
            <h2 className="cmp-h2" style={{ marginBottom: 8 }}>We&apos;re NOT the right choice if:</h2>
            <p className="cmp-body" style={{ marginBottom: 32, maxWidth: 540 }}>
              We&apos;d rather you know this now than figure it out two weeks into a project.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="cmp-honest">
              <div className="cmp-honest-title">These situations call for someone else</div>
              <ul className="cmp-honest-list">
                {NOT_FOR_US.map((item, i) => (
                  <li key={i}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="cmp-section cmp-bg-alt" style={{ textAlign: 'center' }}>
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-label" style={{ justifyContent: 'center' }}>Next Step</div>
            <h2 className="cmp-h2" style={{ marginBottom: 12 }}>Think we&apos;re the right fit?</h2>
            <p className="cmp-body" style={{ maxWidth: 420, margin: '0 auto 28px' }}>
              Tell us what you&apos;re building. We&apos;ll scope it honestly and tell you if we&apos;re the right team.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/studio/start-project" className="cmp-btn-pri">
                Start a Project
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link href="/studio/pricing" className="cmp-btn-ghost">View Pricing</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
