'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────
const A = '#7B6FE8';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  .bench-page { background: var(--bg); min-height: 100vh; }

  /* Hero */
  .bench-hero { padding: 148px 0 100px; position: relative; overflow: hidden; }
  .bench-hero-bg { position: absolute; inset: 0; pointer-events: none; }
  .bench-hero-orb { position: absolute; border-radius: 50%; filter: blur(110px); }
  .bench-hero-orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(123,111,232,0.07) 0%, transparent 70%); top: -200px; right: -100px; }
  .bench-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; position: relative; }
  .bench-hero-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 28px; }
  .bench-hero-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .bench-hero-h1 { font-family: ${F.h}; font-size: clamp(2.4rem, 4vw, 3.4rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.035em; color: var(--text-primary); margin: 0 0 24px; max-width: 700px; }
  .bench-hero-accent { background: linear-gradient(135deg, #5548B0, ${A}, #9D94F0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .bench-hero-sub { font-family: ${F.b}; font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary); max-width: 580px; margin: 0 0 36px; }
  .bench-hero-meta { display: flex; gap: 24px; flex-wrap: wrap; align-items: center; }
  .bench-hero-tag { font-family: ${F.m}; font-size: 0.7rem; padding: 4px 12px; border-radius: 100px; border: 1px solid rgba(123,111,232,0.2); color: ${A}; background: rgba(123,111,232,0.07); }

  /* Section */
  .bench-section { padding: 100px 0; }
  .bench-section-alt { background: var(--bg-2); }
  .bench-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  .bench-sec-label { display: flex; align-items: center; gap: 10px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 14px; }
  .bench-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .bench-section-title { font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary); margin: 0 0 16px; }
  .bench-section-sub { font-family: ${F.b}; font-size: 1rem; line-height: 1.7; color: var(--text-secondary); max-width: 640px; margin: 0 0 56px; }

  /* Benchmark cards */
  .bench-cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 0; }
  .bench-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; position: relative; overflow: hidden; }
  .bench-card-category { font-family: ${F.m}; font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px; }
  .bench-card-name { font-family: ${F.h}; font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 0 0 20px; letter-spacing: -0.01em; }
  .bench-card-primary { margin-bottom: 16px; }
  .bench-card-primary-val { font-family: ${F.h}; font-size: 3rem; font-weight: 800; letter-spacing: -0.05em; line-height: 1; }
  .bench-card-primary-label { font-family: ${F.b}; font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; }
  .bench-card-bar { height: 6px; background: var(--bg-2); border-radius: 100px; overflow: hidden; margin: 16px 0; }
  .bench-card-bar-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, #5548B0, ${A}); transition: width 1s cubic-bezier(0.16,1,0.3,1); }
  .bench-card-secondary { display: flex; gap: 20px; flex-wrap: wrap; }
  .bench-card-sec-item { font-family: ${F.m}; font-size: 0.75rem; color: var(--text-muted); }
  .bench-card-sec-item strong { color: var(--text-secondary); }
  .bench-card-desc { font-family: ${F.b}; font-size: 0.84rem; line-height: 1.65; color: var(--text-secondary); margin-top: 16px; border-top: 1px solid var(--border); padding-top: 16px; }
  .bench-card-badge { position: absolute; top: 20px; right: 20px; font-family: ${F.m}; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 10px; border-radius: 100px; }
  .bench-card-badge.q1-2026 { background: rgba(123,111,232,0.12); color: ${A}; }
  .bench-card-badge.q4-2025 { background: rgba(72,196,150,0.12); color: #48C496; }

  /* Methodology */
  .bench-method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
  .bench-method-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 24px 28px; }
  .bench-method-num { font-family: ${F.m}; font-size: 1.5rem; font-weight: 700; color: rgba(123,111,232,0.2); margin-bottom: 12px; letter-spacing: -0.04em; }
  .bench-method-title { font-family: ${F.h}; font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0 0 8px; }
  .bench-method-desc { font-family: ${F.b}; font-size: 0.84rem; line-height: 1.65; color: var(--text-secondary); margin: 0; }
  .bench-update-note { background: rgba(123,111,232,0.06); border: 1px solid rgba(123,111,232,0.15); border-radius: var(--radius-md); padding: 18px 24px; font-family: ${F.b}; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.65; }
  .bench-update-note strong { color: ${A}; }

  /* Limitations */
  .bench-limits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 40px; }
  .bench-limit-item { padding: 20px 24px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); border-left: 3px solid #E8B84D; }
  .bench-limit-title { font-family: ${F.h}; font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 0 0 6px; }
  .bench-limit-desc { font-family: ${F.b}; font-size: 0.82rem; line-height: 1.6; color: var(--text-secondary); margin: 0; }

  /* Still struggling */
  .bench-struggles { display: flex; flex-direction: column; gap: 10px; }
  .bench-struggle-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; }
  .bench-struggle-icon { width: 20px; height: 20px; border-radius: 50%; background: rgba(232,184,77,0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.7rem; margin-top: 1px; }
  .bench-struggle-text { font-family: ${F.b}; font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary); }
  .bench-struggle-text strong { color: var(--text-primary); }

  /* Comparison table */
  .bench-table-wrapper { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
  .bench-table { width: 100%; border-collapse: collapse; }
  .bench-table thead tr { background: var(--bg-2); }
  .bench-table th { font-family: ${F.m}; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 14px 20px; text-align: left; color: var(--text-muted); border-bottom: 1px solid var(--border); }
  .bench-table th:not(:first-child) { text-align: center; }
  .bench-table td { font-family: ${F.b}; font-size: 0.88rem; padding: 14px 20px; border-bottom: 1px solid var(--border); color: var(--text-secondary); vertical-align: middle; }
  .bench-table td:not(:first-child) { text-align: center; }
  .bench-table tbody tr:last-child td { border-bottom: none; }
  .bench-table tbody tr:hover td { background: var(--bg-2); }
  .bench-table .td-dim { color: var(--text-muted); font-size: 0.8rem; }
  .bench-table .td-label { font-family: ${F.h}; font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }
  .bench-table .td-good { color: #48C496; font-weight: 600; font-family: ${F.m}; font-size: 0.82rem; }
  .bench-table .td-ok { color: #E8B84D; font-family: ${F.m}; font-size: 0.82rem; }
  .bench-table .td-bad { color: #E87B6F; font-family: ${F.m}; font-size: 0.82rem; }
  .bench-table .td-ai { color: ${A}; font-weight: 600; font-family: ${F.m}; font-size: 0.82rem; }
  .bench-table-note { font-family: ${F.b}; font-size: 0.8rem; color: var(--text-muted); margin-top: 16px; font-style: italic; }

  @media (max-width: 768px) {
    .bench-hero { padding: 120px 0 80px; }
    .bench-container { padding: 0 20px; }
    .bench-section { padding: 72px 0; }
    .bench-cards-grid, .bench-method-grid, .bench-limits-grid { grid-template-columns: 1fr; }
    .bench-table-wrapper { overflow-x: auto; }
    .bench-table { min-width: 600px; }
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const BENCHMARKS = [
  {
    category: 'Code generation',
    name: 'Spec-to-code accuracy',
    primaryVal: '78%',
    primaryLabel: 'first-pass accuracy on medium complexity features',
    barPct: 78,
    secondary: [
      { label: 'Simple features', val: '94%' },
      { label: 'High complexity', val: '52%' },
      { label: 'Sample size', val: '840 tasks' },
    ],
    desc: 'Measured on features with written acceptance criteria. "Accuracy" means the generated code passes all acceptance criteria on first attempt without human modification. Complex features involving multi-service integrations score lower.',
    badge: 'Q1 2026',
    color: A,
  },
  {
    category: 'Security',
    name: 'Security issue detection rate',
    primaryVal: '85%',
    primaryLabel: 'detection rate on known vulnerability patterns',
    barPct: 85,
    secondary: [
      { label: 'False positive rate', val: '12%' },
      { label: 'Novel patterns', val: '41%' },
      { label: 'Sample size', val: '320 scans' },
    ],
    desc: 'Tested against a labelled set of known vulnerability patterns (OWASP Top 10 + SANS 25). Detection rate is high for known patterns; novel attack vectors not in training data perform significantly worse.',
    badge: 'Q4 2025',
    color: '#48C496',
  },
  {
    category: 'Testing',
    name: 'AI-generated test coverage',
    primaryVal: '94%',
    primaryLabel: 'average line coverage on newly generated code',
    barPct: 94,
    secondary: [
      { label: 'Edge case coverage', val: '71%' },
      { label: 'Integration tests', val: '68%' },
      { label: 'Sample size', val: '1,200 modules' },
    ],
    desc: 'Coverage is high on the happy path and common error cases. Edge cases that require deep domain knowledge — unusual state combinations, race conditions, subtle business rules — still require human-authored tests.',
    badge: 'Q1 2026',
    color: A,
  },
  {
    category: 'Documentation',
    name: 'Documentation completeness',
    primaryVal: '89%',
    primaryLabel: 'alignment between docs and actual code behaviour',
    barPct: 89,
    secondary: [
      { label: 'API docs', val: '96%' },
      { label: 'Architecture docs', val: '74%' },
      { label: 'Sample size', val: '480 modules' },
    ],
    desc: 'Alignment measured by asking engineers to use only the documentation to implement usage examples, then checking if examples work. API-level documentation scores higher than architecture-level, which requires understanding of intent.',
    badge: 'Q4 2025',
    color: '#48C496',
  },
  {
    category: 'DevOps',
    name: 'Deployment pipeline reliability',
    primaryVal: '99.2%',
    primaryLabel: 'successful deployments without human intervention',
    barPct: 99.2,
    secondary: [
      { label: 'MTTR on failure', val: '< 12 min' },
      { label: 'Rollback success', val: '100%' },
      { label: 'Sample size', val: '2,400 deploys' },
    ],
    desc: 'Measured across all Studio client projects over 18 months. Failures (0.8%) fall into three categories: environment-specific configuration drift, external service outages, and manual override errors. AI-generated infrastructure code has a lower failure rate than human-written equivalent.',
    badge: 'Q1 2026',
    color: A,
  },
];

const METHOD_STEPS = [
  {
    num: '01',
    title: 'Real workloads only',
    desc: 'All benchmarks use real tasks from Studio client projects, anonymised and with client permission. Synthetic test cases are used only to supplement, never as the primary measurement.',
  },
  {
    num: '02',
    title: 'Blind evaluation',
    desc: 'Where possible, evaluation is done by an engineer who does not know whether the output was AI-generated or human-written. This removes confirmation bias from quality assessments.',
  },
  {
    num: '03',
    title: 'Quarterly update cycle',
    desc: 'Numbers are recalculated every quarter with fresh data. Published benchmarks include the measurement date. We do not retroactively improve historical figures.',
  },
  {
    num: '04',
    title: 'Failure classification',
    desc: 'Every failure is classified by type — model error, prompt design, tool failure, evaluation error. This lets us attribute improvements to their actual causes.',
  },
];

const LIMITATIONS = [
  {
    title: 'These are our numbers on our workloads',
    desc: 'Benchmark results vary significantly by codebase maturity, domain, and task complexity. Do not extrapolate these numbers to your specific project without understanding the measurement conditions.',
  },
  {
    title: 'Coverage ≠ correctness',
    desc: 'High test coverage does not mean the tests are testing the right things. Our 94% coverage figure measures line coverage, not semantic correctness of the test assertions.',
  },
  {
    title: 'Complexity is a strong mediating variable',
    desc: 'Every metric has a strong complexity dependency. Simple tasks score significantly higher. Our reported numbers are averages across complexity bands — the distribution is wide.',
  },
  {
    title: 'Models change frequently',
    desc: 'AI model capabilities improve (and occasionally regress) with new versions. Our benchmarks reflect the model versions in use at measurement time, noted in each benchmark record.',
  },
];

const STRUGGLES = [
  {
    title: 'Multi-file refactoring',
    desc: 'Coordinated changes across many files with complex interdependencies — especially refactors that require understanding implicit contracts between modules.',
  },
  {
    title: 'Performance debugging',
    desc: 'Identifying non-obvious bottlenecks, especially in concurrent systems where the problem is an emergent property of multiple components interacting.',
  },
  {
    title: 'Security in novel attack surfaces',
    desc: 'Vulnerability patterns that do not appear in training data. AI security tools excel at known patterns, not novel ones.',
  },
  {
    title: 'Long-horizon planning',
    desc: 'Architectural decisions that require predicting how a system will need to evolve over 12-18 months. Short-context reasoning performs well; long-range planning still needs humans.',
  },
  {
    title: 'Legacy codebase understanding',
    desc: 'Code with undocumented conventions, implicit state, and historical decisions not captured anywhere. The more context is tacit, the worse AI performs.',
  },
];

const COMPARISON = [
  { dimension: 'Time to first working prototype', traditional: '4–8 weeks', ai: '5–10 days', winner: 'ai' },
  { dimension: 'Code generation throughput', traditional: '~400 lines/day', ai: '2,000–5,000 lines/day', winner: 'ai' },
  { dimension: 'Test coverage on new code', traditional: '60–75%', ai: '88–96%', winner: 'ai' },
  { dimension: 'Documentation completeness', traditional: '40–60%', ai: '85–92%', winner: 'ai' },
  { dimension: 'Cost per feature (small)', traditional: '$800–$2,000', ai: '$200–$600', winner: 'ai' },
  { dimension: 'Architectural decision quality', traditional: 'High (with senior devs)', ai: 'Medium (human oversight needed)', winner: 'traditional' },
  { dimension: 'Novel problem-solving', traditional: 'High', ai: 'Medium (pattern-dependent)', winner: 'traditional' },
  { dimension: 'Security audit depth', traditional: 'High (with specialists)', ai: 'Medium (known patterns only)', winner: 'traditional' },
  { dimension: 'Long-term maintenance cost', traditional: 'Variable', ai: 'Lower (consistent patterns)', winner: 'ai' },
  { dimension: 'Deployment reliability', traditional: '94–98%', ai: '98.5–99.5%', winner: 'ai' },
];

// ─── Animated bar ──────────────────────────────────────────────────────────────
function AnimatedBar({ pct }: { pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div className="bench-card-bar" ref={ref}>
      <motion.div
        className="bench-card-bar-fill"
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : {}}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

// ─── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BenchmarksPage() {
  return (
    <div className="bench-page">
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="bench-hero">
        <div className="bench-hero-bg">
          <div className="bench-hero-orb bench-hero-orb-1" />
        </div>
        <div className="bench-hero-inner">
          <Reveal>
            <div className="bench-hero-badge">Labs · Benchmarks</div>
            <h1 className="bench-hero-h1">
              What AI can{' '}
              <span className="bench-hero-accent">actually do.</span>
              {' '}Numbers, not marketing.
            </h1>
            <p className="bench-hero-sub">
              We publish our benchmark results publicly because we think the industry needs more honesty
              about what AI development tools can and cannot do. These are real numbers from real workloads,
              updated quarterly.
            </p>
            <div className="bench-hero-meta">
              <span className="bench-hero-tag">Updated Q1 2026</span>
              <span className="bench-hero-tag">Real workloads</span>
              <span className="bench-hero-tag">Blind evaluation</span>
              <span className="bench-hero-tag">Open methodology</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Benchmark categories ── */}
      <section className="bench-section bench-section-alt">
        <div className="bench-container">
          <Reveal>
            <div className="bench-sec-label">Results</div>
            <h2 className="bench-section-title">Five benchmark categories.</h2>
            <p className="bench-section-sub">
              Each benchmark measures a specific capability against labelled data from real Studio projects.
              Methodology notes follow each card.
            </p>
          </Reveal>
          <div className="bench-cards-grid">
            {BENCHMARKS.map((b, i) => (
              <Reveal key={b.name} delay={i * 0.07}>
                <div className="bench-card">
                  <span className={`bench-card-badge ${b.badge.toLowerCase().replace(' ', '-')}`}>{b.badge}</span>
                  <div className="bench-card-category">{b.category}</div>
                  <div className="bench-card-name">{b.name}</div>
                  <div className="bench-card-primary">
                    <div className="bench-card-primary-val" style={{ color: b.color }}>{b.primaryVal}</div>
                    <div className="bench-card-primary-label">{b.primaryLabel}</div>
                  </div>
                  <AnimatedBar pct={b.barPct} />
                  <div className="bench-card-secondary">
                    {b.secondary.map((s) => (
                      <div key={s.label} className="bench-card-sec-item">
                        {s.label}: <strong>{s.val}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="bench-card-desc">{b.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Methodology ── */}
      <section className="bench-section">
        <div className="bench-container">
          <Reveal>
            <div className="bench-sec-label">Methodology</div>
            <h2 className="bench-section-title">How we measure.</h2>
            <p className="bench-section-sub">
              Benchmarks are only as useful as their methodology is honest. Here is exactly how these
              numbers are collected and what "updated quarterly" means in practice.
            </p>
          </Reveal>
          <div className="bench-method-grid">
            {METHOD_STEPS.map((m, i) => (
              <Reveal key={m.num} delay={i * 0.07}>
                <div className="bench-method-card">
                  <div className="bench-method-num">{m.num}</div>
                  <div className="bench-method-title">{m.title}</div>
                  <p className="bench-method-desc">{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="bench-update-note">
              <strong>On quarterly updates:</strong> Numbers are recalculated in January, April, July, and October.
              Each published figure is timestamped. If a model update significantly changes performance between
              quarterly cycles, we publish an interim update and note the cause. We do not retroactively edit
              historical benchmark records.
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Limitations ── */}
      <section className="bench-section bench-section-alt">
        <div className="bench-container">
          <Reveal>
            <div className="bench-sec-label">Limitations</div>
            <h2 className="bench-section-title">What these numbers do not tell you.</h2>
            <p className="bench-section-sub">
              We believe documenting limitations is as important as documenting results. Read these before
              drawing conclusions from the numbers above.
            </p>
          </Reveal>
          <div className="bench-limits-grid">
            {LIMITATIONS.map((l, i) => (
              <Reveal key={l.title} delay={i * 0.06}>
                <div className="bench-limit-item">
                  <div className="bench-limit-title">{l.title}</div>
                  <p className="bench-limit-desc">{l.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <div className="bench-sec-label" style={{ marginTop: 48, marginBottom: 20 }}>Where AI still struggles</div>
            <div className="bench-struggles">
              {STRUGGLES.map((s, i) => (
                <div key={s.title} className="bench-struggle-row">
                  <div className="bench-struggle-icon">!</div>
                  <div className="bench-struggle-text">
                    <strong>{s.title}: </strong>{s.desc}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="bench-section">
        <div className="bench-container">
          <Reveal>
            <div className="bench-sec-label">Comparison</div>
            <h2 className="bench-section-title">AI-native vs. traditional development.</h2>
            <p className="bench-section-sub">
              A direct comparison across time, cost, and quality dimensions. We include dimensions
              where traditional development wins — because pretending otherwise helps nobody.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bench-table-wrapper">
              <table className="bench-table">
                <thead>
                  <tr>
                    <th>Dimension</th>
                    <th>Traditional development</th>
                    <th>AI-native pipeline</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.dimension}>
                      <td className="td-label">{row.dimension}</td>
                      <td className={row.winner === 'traditional' ? 'td-good' : 'td-dim'}>{row.traditional}</td>
                      <td className={row.winner === 'ai' ? 'td-ai' : 'td-ok'}>{row.ai}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="bench-table-note">
              Traditional development figures based on industry surveys (Stack Overflow Developer Survey 2025, GitLab DevSecOps Report 2025) and our own experience
              running hybrid projects. AI-native figures are our internal measurements. Both assume competent practitioners.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
