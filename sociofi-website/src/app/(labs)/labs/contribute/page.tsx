'use client';

import { useRef, useState } from 'react';
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
  .contrib-page { background: var(--bg); min-height: 100vh; }

  /* Hero */
  .contrib-hero { padding: 148px 0 100px; position: relative; overflow: hidden; }
  .contrib-hero-bg { position: absolute; inset: 0; pointer-events: none; }
  .contrib-hero-orb { position: absolute; border-radius: 50%; filter: blur(110px); }
  .contrib-hero-orb-1 { width: 600px; height: 500px; background: radial-gradient(circle, rgba(123,111,232,0.07) 0%, transparent 70%); top: -150px; right: -100px; }
  .contrib-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; position: relative; }
  .contrib-hero-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 28px; }
  .contrib-hero-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .contrib-hero-h1 { font-family: ${F.h}; font-size: clamp(2.4rem, 4vw, 3.4rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.035em; color: var(--text-primary); margin: 0 0 24px; max-width: 700px; }
  .contrib-hero-accent { background: linear-gradient(135deg, #5548B0, ${A}, #9D94F0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .contrib-hero-sub { font-family: ${F.b}; font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary); max-width: 600px; margin: 0; }

  /* Section */
  .contrib-section { padding: 100px 0; }
  .contrib-section-alt { background: var(--bg-2); }
  .contrib-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  .contrib-sec-label { display: flex; align-items: center; gap: 10px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 14px; }
  .contrib-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .contrib-section-title { font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary); margin: 0 0 16px; }
  .contrib-section-sub { font-family: ${F.b}; font-size: 1rem; line-height: 1.7; color: var(--text-secondary); max-width: 640px; margin: 0 0 56px; }

  /* Three paths */
  .contrib-paths { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .contrib-path-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 36px 32px; position: relative; overflow: hidden; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
  .contrib-path-card:hover { transform: translateY(-4px); box-shadow: var(--card-hover-shadow); border-color: rgba(123,111,232,0.2); }
  .contrib-path-num { font-family: ${F.m}; font-size: 2.4rem; font-weight: 700; color: rgba(123,111,232,0.12); line-height: 1; margin-bottom: 20px; letter-spacing: -0.06em; }
  .contrib-path-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(123,111,232,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
  .contrib-path-icon-svg { width: 22px; height: 22px; stroke: ${A}; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .contrib-path-type { font-family: ${F.m}; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 8px; }
  .contrib-path-title { font-family: ${F.h}; font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 12px; letter-spacing: -0.01em; }
  .contrib-path-desc { font-family: ${F.b}; font-size: 0.88rem; line-height: 1.7; color: var(--text-secondary); margin: 0 0 20px; }
  .contrib-path-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .contrib-path-list li { font-family: ${F.b}; font-size: 0.82rem; color: var(--text-muted); padding-left: 14px; position: relative; }
  .contrib-path-list li::before { content: '→'; position: absolute; left: 0; color: ${A}; font-size: 0.75rem; }

  /* Guidelines */
  .contrib-guidelines-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .contrib-guideline { display: flex; gap: 16px; align-items: flex-start; padding: 20px 24px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); transition: border-color 0.2s; }
  .contrib-guideline:hover { border-color: rgba(123,111,232,0.2); }
  .contrib-guideline-num { font-family: ${F.m}; font-size: 0.8rem; color: ${A}; font-weight: 600; flex-shrink: 0; padding-top: 1px; }
  .contrib-guideline-content { flex: 1; }
  .contrib-guideline-title { font-family: ${F.h}; font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 0 0 4px; }
  .contrib-guideline-desc { font-family: ${F.b}; font-size: 0.82rem; line-height: 1.6; color: var(--text-secondary); margin: 0; }

  /* Open needs */
  .contrib-streams { display: flex; flex-direction: column; gap: 20px; }
  .contrib-stream { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; transition: border-color 0.3s; }
  .contrib-stream:hover { border-color: rgba(123,111,232,0.2); }
  .contrib-stream-header { padding: 20px 24px; background: var(--bg-2); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
  .contrib-stream-dot { width: 8px; height: 8px; border-radius: 50%; background: ${A}; flex-shrink: 0; }
  .contrib-stream-name { font-family: ${F.h}; font-size: 0.95rem; font-weight: 700; color: var(--text-primary); flex: 1; }
  .contrib-stream-badge { font-family: ${F.m}; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.08em; padding: 3px 10px; border-radius: 100px; }
  .contrib-stream-badge.open { background: rgba(72,196,150,0.12); color: #48C496; }
  .contrib-stream-badge.priority { background: rgba(232,184,77,0.12); color: #E8B84D; }
  .contrib-stream-body { padding: 20px 24px; }
  .contrib-stream-needs { display: flex; flex-direction: column; gap: 10px; }
  .contrib-stream-need { display: flex; gap: 12px; align-items: flex-start; }
  .contrib-stream-need-type { font-family: ${F.m}; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 8px; border-radius: 100px; flex-shrink: 0; margin-top: 1px; }
  .contrib-stream-need-type.data { background: rgba(123,111,232,0.1); color: ${A}; }
  .contrib-stream-need-type.review { background: rgba(91,181,224,0.1); color: #5BB5E0; }
  .contrib-stream-need-type.code { background: rgba(72,196,150,0.1); color: #48C496; }
  .contrib-stream-need-type.research { background: rgba(232,184,77,0.1); color: #E8B84D; }
  .contrib-stream-need-desc { font-family: ${F.b}; font-size: 0.85rem; line-height: 1.6; color: var(--text-secondary); }

  /* Form */
  .contrib-form-section { padding: 100px 0; }
  .contrib-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
  .contrib-form-left { }
  .contrib-form-left-title { font-family: ${F.h}; font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight: 700; color: var(--text-primary); margin: 0 0 16px; letter-spacing: -0.025em; }
  .contrib-form-left-sub { font-family: ${F.b}; font-size: 0.95rem; line-height: 1.75; color: var(--text-secondary); margin: 0 0 32px; }
  .contrib-form-note { padding: 18px 20px; background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius-md); font-family: ${F.b}; font-size: 0.84rem; color: var(--text-secondary); line-height: 1.65; }
  .contrib-form-note strong { color: var(--text-primary); }
  .contrib-form-right { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 36px; }
  .contrib-form-field { margin-bottom: 18px; }
  .contrib-form-label { display: block; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
  .contrib-form-input, .contrib-form-select, .contrib-form-textarea { width: 100%; padding: 12px 14px; border-radius: 10px; background: var(--bg); border: 1.5px solid var(--border); color: var(--text-primary); font-family: ${F.b}; font-size: 0.9rem; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
  .contrib-form-input:focus, .contrib-form-select:focus, .contrib-form-textarea:focus { border-color: ${A}; }
  .contrib-form-input::placeholder, .contrib-form-textarea::placeholder { color: var(--text-muted); }
  .contrib-form-select { appearance: none; cursor: pointer; }
  .contrib-form-textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
  .contrib-form-submit { width: 100%; padding: 14px; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; color: #fff; background: linear-gradient(135deg, #5548B0, ${A}); border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(123,111,232,0.4); margin-top: 4px; }
  .contrib-form-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(123,111,232,0.55); }
  .contrib-form-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .contrib-form-success { text-align: center; padding: 32px 0; }
  .contrib-form-success-icon { width: 44px; height: 44px; border-radius: 50%; background: rgba(72,196,150,0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
  .contrib-form-success-title { font-family: ${F.h}; font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 8px; }
  .contrib-form-success-sub { font-family: ${F.b}; font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.65; }

  @media (max-width: 768px) {
    .contrib-hero { padding: 120px 0 80px; }
    .contrib-container { padding: 0 20px; }
    .contrib-section { padding: 72px 0; }
    .contrib-paths { grid-template-columns: 1fr; }
    .contrib-guidelines-grid { grid-template-columns: 1fr; }
    .contrib-form-grid { grid-template-columns: 1fr; }
    .contrib-form-right { padding: 24px; }
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const PATHS = [
  {
    num: '01',
    type: 'Research collaboration',
    title: 'Partner on experiments',
    desc: 'If you are working on problems that overlap with our research streams — agent reliability, evaluation methodology, AI system failure modes, or developer tooling — we occasionally partner on experiments with external researchers.',
    steps: [
      'Contact us with your research context and what you are working on',
      'We will respond within 5 business days if there is potential overlap',
      'Collaborative experiments are co-authored; data sharing is documented and consented',
      'We do not do "we review your work" collaborations — it is a real partnership or nothing',
    ],
    icon: (
      <svg viewBox="0 0 24 24" className="contrib-path-icon-svg">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    num: '02',
    type: 'Open source',
    title: 'Contribute to our repos',
    desc: 'Each open-source repository has its own CONTRIBUTING.md with specific guidelines. Generally: we welcome PRs, issue reports, documentation improvements, and test coverage additions.',
    steps: [
      'Check the existing issues before opening a new one',
      'For large changes, open an issue first to discuss before writing code',
      'PRs must include tests and pass the existing CI pipeline',
      'Documentation PRs are especially welcome — code without docs is half-finished',
    ],
    icon: (
      <svg viewBox="0 0 24 24" className="contrib-path-icon-svg">
        <circle cx="12" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="6" r="3" />
        <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
        <line x1="12" y1="12" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    num: '03',
    type: 'Share your data',
    title: 'Improve the benchmarks',
    desc: 'Anonymised real-world data from your AI systems helps make our benchmarks more representative. We credit data contributors in the methodology notes and share relevant findings back.',
    steps: [
      'Data must be anonymised — no client names, no identifiable project details',
      'You retain ownership; we get a research licence for the specific experiment',
      'We share our findings with you before publishing',
      'We note data contributors in the benchmark methodology section',
    ],
    icon: (
      <svg viewBox="0 0 24 24" className="contrib-path-icon-svg">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
];

const GUIDELINES = [
  {
    num: '01',
    title: 'Be specific about what you are offering',
    desc: 'Vague offers to "help" are hard to act on. Tell us what you have: a dataset, a specific skill, a research context, time to review methodology.',
  },
  {
    num: '02',
    title: 'Do not ghost mid-collaboration',
    desc: 'Research timelines depend on contributors following through. If circumstances change, tell us early. An early "I cannot continue" is far better than a silent drop-off.',
  },
  {
    num: '03',
    title: 'Disagreement is welcome, disrespect is not',
    desc: 'We want people who will challenge our methodology and point out where we are wrong. We do not want people who are rude about it. The distinction matters.',
  },
  {
    num: '04',
    title: 'Credit goes to the people who did the work',
    desc: 'We credit contributions accurately. If you reviewed methodology, you are credited as a reviewer. If you co-designed the experiment, you are a co-author. We do not inflate or deflate credit.',
  },
  {
    num: '05',
    title: 'We publish failures too',
    desc: 'If a collaboration produces a result that contradicts our prior findings, we publish that. Contributing to a result that overturns a previous conclusion is still a valid contribution.',
  },
  {
    num: '06',
    title: 'Timelines are estimates',
    desc: 'Research takes longer than planned. We communicate timeline changes proactively and expect the same from collaborators. Build slack into your own commitments.',
  },
];

const OPEN_NEEDS = [
  {
    name: 'Agent reliability & failure modes',
    badge: 'priority',
    needs: [
      { type: 'data', desc: 'Anonymised logs of agent task failures in production — especially silent failures where the agent returns an output but it is subtly wrong.' },
      { type: 'research', desc: 'Literature review support: surveying existing academic work on AI agent failure taxonomies to compare with our empirically-derived classification.' },
      { type: 'review', desc: 'Methodology review for our Q2 2026 benchmark update — particularly the section on multi-agent coordination failures.' },
    ],
  },
  {
    name: 'Evaluation methodology',
    badge: 'open',
    needs: [
      { type: 'research', desc: 'We are designing a new evaluation protocol for code correctness that goes beyond test coverage. Looking for collaborators with evaluation methodology expertise.' },
      { type: 'data', desc: 'Real-world code review comments paired with AI-generated code — to understand where human reviewers catch things automated tests do not.' },
    ],
  },
  {
    name: 'Spec-to-code pipelines',
    badge: 'open',
    needs: [
      { type: 'data', desc: 'Feature specifications paired with the code that implemented them — to study how well specifications translate to implementation across different specification styles.' },
      { type: 'code', desc: 'Testing harness improvements for our spec-evaluation pipeline. The current harness is slow and we need help optimising it.' },
    ],
  },
  {
    name: 'Developer tooling',
    badge: 'open',
    needs: [
      { type: 'review', desc: 'UX feedback on our observability dashboard prototype. Looking for engineers who work with AI pipelines daily and can give us informed critique.' },
      { type: 'code', desc: 'TypeScript SDK improvements — particularly around the streaming output handling and error classification utilities.' },
    ],
  },
];

const INTEREST_AREAS = [
  'Research collaboration',
  'Open source contribution',
  'Data sharing',
  'Methodology review',
  'Guest blog post',
  'Other',
];

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
export default function ContributePage() {
  const [formData, setFormData] = useState({ name: '', email: '', area: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('success');
  };

  return (
    <div className="contrib-page">
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="contrib-hero">
        <div className="contrib-hero-bg">
          <div className="contrib-hero-orb contrib-hero-orb-1" />
        </div>
        <div className="contrib-hero-inner">
          <Reveal>
            <div className="contrib-hero-badge">Labs · Contribute</div>
            <h1 className="contrib-hero-h1">
              Contribute to{' '}
              <span className="contrib-hero-accent">Labs.</span>
            </h1>
            <p className="contrib-hero-sub">
              Three ways to get involved: research collaboration, open source contributions,
              or sending us data. We are selective but genuinely open — the right collaborator
              on the right problem makes a real difference to what we can learn.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Three paths ── */}
      <section className="contrib-section contrib-section-alt">
        <div className="contrib-container">
          <Reveal>
            <div className="contrib-sec-label">How to get involved</div>
            <h2 className="contrib-section-title">Three contribution paths.</h2>
            <p className="contrib-section-sub">
              Each path has different expectations and different benefits. Read them carefully
              before reaching out — the clearer you are about which path you are interested in,
              the faster we can respond.
            </p>
          </Reveal>
          <div className="contrib-paths">
            {PATHS.map((path, i) => (
              <Reveal key={path.num} delay={i * 0.08}>
                <div className="contrib-path-card">
                  <div className="contrib-path-num">{path.num}</div>
                  <div className="contrib-path-icon">{path.icon}</div>
                  <div className="contrib-path-type">{path.type}</div>
                  <div className="contrib-path-title">{path.title}</div>
                  <p className="contrib-path-desc">{path.desc}</p>
                  <ul className="contrib-path-list">
                    {path.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guidelines ── */}
      <section className="contrib-section">
        <div className="contrib-container">
          <Reveal>
            <div className="contrib-sec-label">General principles</div>
            <h2 className="contrib-section-title">How we work with contributors.</h2>
            <p className="contrib-section-sub">
              These are not formal rules — they are the norms that make collaborations go well.
              We hold ourselves to them and expect the same from contributors.
            </p>
          </Reveal>
          <div className="contrib-guidelines-grid">
            {GUIDELINES.map((g, i) => (
              <Reveal key={g.num} delay={i * 0.05}>
                <div className="contrib-guideline">
                  <div className="contrib-guideline-num">{g.num}</div>
                  <div className="contrib-guideline-content">
                    <div className="contrib-guideline-title">{g.title}</div>
                    <p className="contrib-guideline-desc">{g.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open needs ── */}
      <section className="contrib-section contrib-section-alt">
        <div className="contrib-container">
          <Reveal>
            <div className="contrib-sec-label">Current needs</div>
            <h2 className="contrib-section-title">What we are actively looking for.</h2>
            <p className="contrib-section-sub">
              These are open needs across our four research streams as of March 2026.
              We update this list quarterly. Reaching out about a specific need here
              gets a faster response than a general inquiry.
            </p>
          </Reveal>
          <div className="contrib-streams">
            {OPEN_NEEDS.map((stream, i) => (
              <Reveal key={stream.name} delay={i * 0.06}>
                <div className="contrib-stream">
                  <div className="contrib-stream-header">
                    <div className="contrib-stream-dot" />
                    <div className="contrib-stream-name">{stream.name}</div>
                    <span className={`contrib-stream-badge ${stream.badge}`}>
                      {stream.badge === 'priority' ? 'High priority' : 'Open'}
                    </span>
                  </div>
                  <div className="contrib-stream-body">
                    <div className="contrib-stream-needs">
                      {stream.needs.map((need, j) => (
                        <div key={j} className="contrib-stream-need">
                          <span className={`contrib-stream-need-type ${need.type}`}>{need.type}</span>
                          <div className="contrib-stream-need-desc">{need.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact form ── */}
      <section className="contrib-form-section">
        <div className="contrib-container">
          <div className="contrib-form-grid">
            <Reveal>
              <div className="contrib-form-left">
                <div className="contrib-sec-label">Get in touch</div>
                <h2 className="contrib-form-left-title">Tell us what you are working on.</h2>
                <p className="contrib-form-left-sub">
                  We respond to every genuine inquiry, even if the answer is &ldquo;not right now.&rdquo;
                  The more context you give us about your background and what you are working on,
                  the more useful our response can be.
                </p>
                <div className="contrib-form-note">
                  <strong>Response time:</strong> We aim to respond within 5 business days.
                  If you are reaching out about a specific open need listed above, mention it in your message —
                  those get routed directly to the relevant researcher.
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="contrib-form-right">
                {status === 'success' ? (
                  <div className="contrib-form-success">
                    <div className="contrib-form-success-icon">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#48C496" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="contrib-form-success-title">Message received.</div>
                    <p className="contrib-form-success-sub">
                      We will review your inquiry and respond within 5 business days.
                      If you mentioned a specific open need, it will be routed to the right person.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="contrib-form-field">
                      <label className="contrib-form-label" htmlFor="name">Name</label>
                      <input
                        className="contrib-form-input"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="contrib-form-field">
                      <label className="contrib-form-label" htmlFor="email">Email</label>
                      <input
                        className="contrib-form-input"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="contrib-form-field">
                      <label className="contrib-form-label" htmlFor="area">Area of interest</label>
                      <select
                        className="contrib-form-select"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Select an area…</option>
                        {INTEREST_AREAS.map((area) => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                    </div>
                    <div className="contrib-form-field">
                      <label className="contrib-form-label" htmlFor="message">Message</label>
                      <textarea
                        className="contrib-form-textarea"
                        id="message"
                        name="message"
                        placeholder="Tell us what you are working on, what you are offering, and what you are looking to get out of a collaboration. The more specific, the better."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button
                      className="contrib-form-submit"
                      type="submit"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? 'Sending…' : 'Send message'}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
