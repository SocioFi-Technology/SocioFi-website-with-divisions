'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ─── Constants ────────────────────────────────────────────────────────────────
const A = '#7B6FE8';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  .nl-page { background: var(--bg); min-height: 100vh; }

  /* Hero */
  .nl-hero { padding: 148px 0 100px; position: relative; overflow: hidden; }
  .nl-hero-bg { position: absolute; inset: 0; pointer-events: none; }
  .nl-hero-orb { position: absolute; border-radius: 50%; filter: blur(120px); }
  .nl-hero-orb-1 { width: 700px; height: 600px; background: radial-gradient(circle, rgba(123,111,232,0.08) 0%, transparent 70%); top: -200px; left: 50%; transform: translateX(-50%); }
  .nl-hero-inner { max-width: 780px; margin: 0 auto; padding: 0 32px; text-align: center; position: relative; }
  .nl-hero-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 28px; }
  .nl-hero-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .nl-hero-badge::after { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .nl-hero-h1 { font-family: ${F.h}; font-size: clamp(2.8rem, 5vw, 4.4rem); font-weight: 800; line-height: 1.04; letter-spacing: -0.04em; color: var(--text-primary); margin: 0 0 24px; }
  .nl-hero-accent { background: linear-gradient(135deg, #5548B0, ${A}, #9D94F0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .nl-hero-sub { font-family: ${F.b}; font-size: 1.2rem; line-height: 1.7; color: var(--text-secondary); margin: 0 0 16px; }
  .nl-hero-tagline { font-family: ${F.m}; font-size: 0.82rem; color: var(--text-muted); font-style: italic; margin-bottom: 40px; }
  .nl-hero-count { display: inline-flex; align-items: center; gap: 10px; font-family: ${F.b}; font-size: 0.9rem; color: var(--text-secondary); }
  .nl-hero-count-num { font-family: ${F.h}; font-size: 1.6rem; font-weight: 800; color: ${A}; letter-spacing: -0.04em; }

  /* Section */
  .nl-section { padding: 100px 0; }
  .nl-section-alt { background: var(--bg-2); }
  .nl-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  .nl-container-narrow { max-width: 780px; margin: 0 auto; padding: 0 32px; }
  .nl-sec-label { display: flex; align-items: center; gap: 10px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 14px; }
  .nl-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .nl-section-title { font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary); margin: 0 0 16px; }
  .nl-section-sub { font-family: ${F.b}; font-size: 1rem; line-height: 1.7; color: var(--text-secondary); max-width: 600px; margin: 0 0 48px; }

  /* What you get */
  .nl-gets-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .nl-get-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 24px 20px; }
  .nl-get-icon { width: 36px; height: 36px; border-radius: 8px; background: rgba(123,111,232,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
  .nl-get-icon-svg { width: 18px; height: 18px; stroke: ${A}; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .nl-get-title { font-family: ${F.h}; font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 0 0 6px; }
  .nl-get-desc { font-family: ${F.b}; font-size: 0.82rem; line-height: 1.6; color: var(--text-secondary); margin: 0; }

  /* Past issues */
  .nl-issues-list { display: flex; flex-direction: column; gap: 2px; margin-bottom: 36px; }
  .nl-issue-item { display: grid; grid-template-columns: 110px 1fr auto; gap: 24px; align-items: center; padding: 20px 16px; border-radius: 10px; border: 1px solid transparent; transition: all 0.2s; cursor: pointer; }
  .nl-issue-item:hover { background: var(--bg-card); border-color: var(--border); }
  .nl-issue-num { font-family: ${F.m}; font-size: 0.72rem; color: var(--text-muted); }
  .nl-issue-num strong { color: ${A}; }
  .nl-issue-content { }
  .nl-issue-title { font-family: ${F.h}; font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0 0 4px; letter-spacing: -0.01em; }
  .nl-issue-topics { font-family: ${F.b}; font-size: 0.8rem; color: var(--text-muted); }
  .nl-issue-date { font-family: ${F.m}; font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; }
  .nl-issues-note { font-family: ${F.b}; font-size: 0.84rem; color: var(--text-muted); font-style: italic; }

  /* Subscription form */
  .nl-form-section { padding: 100px 0; }
  .nl-form-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 64px; position: relative; overflow: hidden; }
  .nl-form-glow { position: absolute; width: 600px; height: 400px; background: radial-gradient(ellipse, rgba(123,111,232,0.07) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; }
  .nl-form-title { font-family: ${F.h}; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; color: var(--text-primary); margin: 0 0 12px; letter-spacing: -0.025em; text-align: center; position: relative; }
  .nl-form-sub { font-family: ${F.b}; font-size: 1rem; color: var(--text-secondary); text-align: center; margin: 0 0 40px; line-height: 1.7; position: relative; max-width: 480px; margin-left: auto; margin-right: auto; }
  .nl-form { display: flex; gap: 10px; max-width: 480px; margin: 0 auto 20px; position: relative; }
  .nl-form-input { flex: 1; padding: 14px 18px; border-radius: 100px; background: var(--bg); border: 1.5px solid var(--border); color: var(--text-primary); font-family: ${F.b}; font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
  .nl-form-input:focus { border-color: ${A}; }
  .nl-form-input::placeholder { color: var(--text-muted); }
  .nl-form-submit { padding: 14px 24px; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; color: #fff; background: linear-gradient(135deg, #5548B0, ${A}); border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(123,111,232,0.4); white-space: nowrap; }
  .nl-form-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(123,111,232,0.55); }
  .nl-form-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .nl-form-privacy { font-family: ${F.b}; font-size: 0.78rem; color: var(--text-muted); text-align: center; position: relative; }
  .nl-form-success { text-align: center; padding: 32px; position: relative; }
  .nl-form-success-icon { width: 48px; height: 48px; border-radius: 50%; background: rgba(72,196,150,0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
  .nl-form-success-title { font-family: ${F.h}; font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin: 0 0 8px; }
  .nl-form-success-sub { font-family: ${F.b}; font-size: 0.9rem; color: var(--text-secondary); margin: 0; }

  /* Social proof */
  .nl-proof-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .nl-proof-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 24px; }
  .nl-proof-quote { font-family: ${F.b}; font-size: 0.9rem; line-height: 1.7; color: var(--text-secondary); margin: 0 0 16px; font-style: italic; }
  .nl-proof-author { font-family: ${F.m}; font-size: 0.72rem; color: var(--text-muted); }
  .nl-proof-author strong { color: var(--text-secondary); display: block; margin-bottom: 2px; font-style: normal; }

  @media (max-width: 768px) {
    .nl-hero { padding: 120px 0 80px; }
    .nl-container, .nl-container-narrow { padding: 0 20px; }
    .nl-section { padding: 72px 0; }
    .nl-gets-grid, .nl-proof-grid { grid-template-columns: 1fr 1fr; }
    .nl-form-box { padding: 32px 24px; }
    .nl-form { flex-direction: column; }
    .nl-issue-item { grid-template-columns: 1fr; gap: 8px; }
    .nl-issue-date { display: none; }
  }
  @media (max-width: 480px) {
    .nl-gets-grid, .nl-proof-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const WHAT_YOU_GET = [
  {
    title: 'Research findings',
    desc: 'Summaries of completed experiments with methodology, results, and honest assessment of what worked and what did not.',
    icon: (
      <svg viewBox="0 0 24 24" className="nl-get-icon-svg">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    title: 'Experiment logs',
    desc: 'What we are running right now: hypothesis, current state, early observations. We write these before we know the outcome.',
    icon: (
      <svg viewBox="0 0 24 24" className="nl-get-icon-svg">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: 'Open-source releases',
    desc: 'First notice of new repositories, major updates to existing tools, and deprecations. With the reasoning behind each.',
    icon: (
      <svg viewBox="0 0 24 24" className="nl-get-icon-svg">
        <circle cx="12" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="6" r="3" />
        <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
        <line x1="12" y1="12" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    title: 'Upcoming talks',
    desc: 'Where we are presenting next, what we are planning to say, and links to slides and recordings after the event.',
    icon: (
      <svg viewBox="0 0 24 24" className="nl-get-icon-svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Occasional deep-dives',
    desc: 'When we have something long to say that does not fit a standard article format — a detailed post-mortem, a technical tutorial, a research design document.',
    icon: (
      <svg viewBox="0 0 24 24" className="nl-get-icon-svg">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    title: 'What failed',
    desc: 'We document experiments that did not work. These are sometimes the most useful issues — a documented failure prevents someone else from repeating the same mistake.',
    icon: (
      <svg viewBox="0 0 24 24" className="nl-get-icon-svg">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

const PAST_ISSUES = [
  {
    num: '#024',
    title: 'The Output Validation Problem: Why Prompts Are Not Enough',
    topics: 'Output validation · Schema enforcement · Retry design · Production failure modes',
    date: 'Feb 2026',
  },
  {
    num: '#023',
    title: 'Six Months of pgvector in Production: What We Learned',
    topics: 'RAG · Vector search · Embedding drift · Query optimisation',
    date: 'Jan 2026',
  },
  {
    num: '#022',
    title: 'Why We Archived Two Open-Source Repositories',
    topics: 'Open source maintenance · Sustainability · Deprecation process',
    date: 'Dec 2025',
  },
  {
    num: '#021',
    title: 'Benchmark Update: Q4 2025 Numbers and What Changed',
    topics: 'Benchmarks · Model updates · Accuracy regression · New measurements',
    date: 'Nov 2025',
  },
  {
    num: '#020',
    title: 'The 40% Threshold: When to Trust AI and When Not To',
    topics: 'Automation thresholds · Human oversight · Decision boundaries',
    date: 'Oct 2025',
  },
];

const TESTIMONIALS = [
  {
    quote: "The Labs Letter is the only AI newsletter I read where the author admits when something didn't work. That alone makes it worth subscribing.",
    author: 'Senior Engineer at a fintech startup',
    role: 'Subscriber since issue #012',
  },
  {
    quote: "I've implemented three patterns from the Labs research directly in our production systems. The observability middleware alone saved us hours of debugging.",
    author: 'CTO, SaaS company',
    role: 'Subscriber since issue #008',
  },
  {
    quote: "Short, dense, no padding. Every issue has something I can use in the week it arrives. That's rare.",
    author: 'Independent researcher',
    role: 'Subscriber since issue #001',
  },
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
export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // Simulate submission — replace with real endpoint
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('success');
  };

  return (
    <div className="nl-page">
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="nl-hero">
        <div className="nl-hero-bg">
          <div className="nl-hero-orb nl-hero-orb-1" />
        </div>
        <div className="nl-hero-inner">
          <Reveal>
            <div className="nl-hero-badge">Labs · Newsletter</div>
            <h1 className="nl-hero-h1">
              <span className="nl-hero-accent">The Labs Letter.</span>
            </h1>
            <p className="nl-hero-sub">
              What we are researching. What we shipped. What failed.
            </p>
            <p className="nl-hero-tagline">Monthly, no marketing.</p>
            <div className="nl-hero-count">
              <span className="nl-hero-count-num">1,200+</span>
              researchers, engineers, and founders already subscribed
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── What you get ── */}
      <section className="nl-section nl-section-alt">
        <div className="nl-container">
          <Reveal>
            <div className="nl-sec-label">Every issue</div>
            <h2 className="nl-section-title">What subscribers get.</h2>
            <p className="nl-section-sub">
              We do not write to fill a schedule. Each issue is sent when we have something worth saying.
              Usually once a month, sometimes more, sometimes less.
            </p>
          </Reveal>
          <div className="nl-gets-grid">
            {WHAT_YOU_GET.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="nl-get-card">
                  <div className="nl-get-icon">{item.icon}</div>
                  <div className="nl-get-title">{item.title}</div>
                  <p className="nl-get-desc">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Past issues ── */}
      <section className="nl-section">
        <div className="nl-container">
          <Reveal>
            <div className="nl-sec-label">Archive preview</div>
            <h2 className="nl-section-title">Recent issues.</h2>
            <p className="nl-section-sub">
              A sample of what the last few issues covered. The full archive is available to subscribers.
            </p>
          </Reveal>
          <div className="nl-issues-list">
            {PAST_ISSUES.map((issue, i) => (
              <Reveal key={issue.num} delay={i * 0.05}>
                <div className="nl-issue-item">
                  <div className="nl-issue-num">Issue <strong>{issue.num}</strong></div>
                  <div className="nl-issue-content">
                    <div className="nl-issue-title">{issue.title}</div>
                    <div className="nl-issue-topics">{issue.topics}</div>
                  </div>
                  <div className="nl-issue-date">{issue.date}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="nl-issues-note">
              Issue #001 through #019 available in the archive after subscribing.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="nl-section nl-section-alt">
        <div className="nl-container">
          <Reveal>
            <div className="nl-sec-label">What subscribers say</div>
            <h2 className="nl-section-title">From the readers.</h2>
          </Reveal>
          <div className="nl-proof-grid">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="nl-proof-card">
                  <p className="nl-proof-quote">&ldquo;{t.quote}&rdquo;</p>
                  <div className="nl-proof-author">
                    <strong>{t.author}</strong>
                    {t.role}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="nl-form-section">
        <div className="nl-container-narrow">
          <Reveal>
            <div className="nl-form-box">
              <div className="nl-form-glow" />
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="nl-form-success"
                  >
                    <div className="nl-form-success-icon">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#48C496" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="nl-form-success-title">You are on the list.</div>
                    <p className="nl-form-success-sub">
                      The next issue of The Labs Letter will land in your inbox.
                      We send when we have something worth saying — not on a fixed schedule.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="nl-form-title">Subscribe to The Labs Letter.</h2>
                    <p className="nl-form-sub">
                      Research, experiments, releases, and failures — once a month, directly from
                      the engineers building and studying AI systems in production.
                    </p>
                    <form className="nl-form" onSubmit={handleSubmit}>
                      <input
                        className="nl-form-input"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <button
                        className="nl-form-submit"
                        type="submit"
                        disabled={status === 'loading'}
                      >
                        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
                      </button>
                    </form>
                    <p className="nl-form-privacy">
                      We never sell your email. One email per month. Unsubscribe anytime — no dark patterns, no re-subscribe tricks.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
