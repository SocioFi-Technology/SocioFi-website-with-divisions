'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ── Constants ──────────────────────────────────────────────────────────────
const A = '#6BA3E8';
const A_DARK = '#3A6DB8';
const F = {
  h: 'var(--font-display, Syne)',
  b: 'var(--font-body, Outfit)',
  m: 'var(--font-mono, "Fira Code")',
};

// ── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
.vblog-wrap { background: var(--bg); color: var(--text-primary); min-height: 100vh; font-family: ${F.b}; overflow-x: hidden; }

/* ── Hero ── */
.vblog-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
.vblog-hero-inner { max-width: 700px; margin: 0 auto; position: relative; z-index: 2; }

.vblog-badge {
  display: inline-flex; align-items: center; gap: 10px; justify-content: center;
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 28px;
}
.vblog-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; flex-shrink: 0; }
[data-theme="light"] .vblog-badge { color: ${A_DARK}; }
[data-theme="light"] .vblog-badge::before { background: ${A_DARK}; }

.vblog-h1 {
  font-family: ${F.h}; font-size: clamp(2.4rem, 4.5vw, 3.4rem); font-weight: 800;
  line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary);
  margin-bottom: 24px;
}
.vblog-gradient-text {
  background: linear-gradient(135deg, #4A85CC, ${A}, #9BC0F0);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
@media (forced-colors: active) { .vblog-gradient-text { -webkit-text-fill-color: unset; } }

.vblog-sub {
  font-size: 1.05rem; line-height: 1.75; color: var(--text-secondary);
  max-width: 520px; margin: 0 auto;
}

/* ── Sections ── */
.vblog-section { padding: 100px 32px; background: var(--bg); }
.vblog-section-alt { padding: 100px 32px; background: var(--bg-2); }
.vblog-container { max-width: 1100px; margin: 0 auto; }
.vblog-centered { text-align: center; }

.vblog-sec-label {
  display: flex; align-items: center; gap: 10px;
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 14px;
}
.vblog-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; flex-shrink: 0; }
[data-theme="light"] .vblog-sec-label { color: ${A_DARK}; }

.vblog-sec-h2 {
  font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700;
  line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary);
  margin-bottom: 16px;
}

/* ── Article Card Grid ── */
.vblog-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 48px; }
@media (max-width: 768px) { .vblog-grid { grid-template-columns: 1fr; } }

.vblog-card {
  display: flex; flex-direction: column;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 20px; overflow: hidden; position: relative;
  text-decoration: none; color: inherit;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.vblog-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, #4A85CC, ${A});
  opacity: 0; transition: opacity 0.4s;
}
.vblog-card:hover { border-color: ${A}30; transform: translateY(-6px); box-shadow: 0 20px 48px rgba(107,163,232,0.12); }
.vblog-card:hover::before { opacity: 1; }

.vblog-card-body { padding: 32px 32px 28px; flex: 1; display: flex; flex-direction: column; }
.vblog-card-meta {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 16px; flex-wrap: wrap;
}
.vblog-card-cat {
  font-family: ${F.m}; font-size: 0.68rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.08em;
  padding: 3px 10px; background: ${A}12; border: 1px solid ${A}20;
  border-radius: 4px;
}
[data-theme="light"] .vblog-card-cat { color: ${A_DARK}; background: ${A_DARK}10; border-color: ${A_DARK}20; }
.vblog-card-read {
  font-family: ${F.m}; font-size: 0.68rem; color: var(--text-muted);
  letter-spacing: 0.04em;
}

.vblog-card-title {
  font-family: ${F.h}; font-size: 1.15rem; font-weight: 700;
  color: var(--text-primary); line-height: 1.3; margin-bottom: 12px;
  flex: 1;
  transition: color 0.2s;
}
.vblog-card:hover .vblog-card-title { color: ${A}; }
[data-theme="light"] .vblog-card:hover .vblog-card-title { color: ${A_DARK}; }

.vblog-card-date {
  font-family: ${F.m}; font-size: 0.68rem; color: var(--text-muted);
  letter-spacing: 0.04em; margin-top: auto; padding-top: 16px;
  border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.vblog-card-arrow { color: ${A}; opacity: 0; transition: opacity 0.2s, transform 0.2s; }
.vblog-card:hover .vblog-card-arrow { opacity: 1; transform: translateX(4px); }

/* ── Newsletter ── */
.vblog-newsletter {
  max-width: 560px; margin: 60px auto 0;
  background: var(--bg-card); border: 1px solid ${A}25;
  border-radius: 20px; padding: 36px 40px; text-align: center;
  position: relative; overflow: hidden;
}
.vblog-newsletter::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, #4A85CC, ${A});
}
.vblog-nl-title {
  font-family: ${F.h}; font-size: 1.2rem; font-weight: 700;
  color: var(--text-primary); margin-bottom: 10px;
}
.vblog-nl-sub {
  font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65;
  margin-bottom: 24px;
}
.vblog-nl-form { display: flex; gap: 10px; flex-wrap: wrap; }
.vblog-nl-input {
  flex: 1; min-width: 200px;
  padding: 12px 18px; border-radius: 100px;
  background: var(--bg-2); border: 1.5px solid var(--border);
  color: var(--text-primary); font-family: ${F.b}; font-size: 0.9rem;
  outline: none; transition: border-color 0.2s;
}
.vblog-nl-input:focus { border-color: ${A}; }
.vblog-nl-input::placeholder { color: var(--text-muted); }
.vblog-nl-btn {
  padding: 12px 22px; border-radius: 100px;
  background: linear-gradient(135deg, #4A85CC, ${A});
  color: #fff; font-family: ${F.h}; font-size: 0.88rem; font-weight: 600;
  border: none; cursor: pointer; transition: all 0.2s;
  white-space: nowrap;
}
.vblog-nl-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(107,163,232,0.3); }

/* ── Buttons ── */
.vblog-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; background: linear-gradient(135deg, #4A85CC, ${A});
  color: #fff; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem;
  font-weight: 600; text-decoration: none; transition: all 0.2s;
}
.vblog-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(107,163,232,0.35); }

/* ── Final CTA ── */
.vblog-final-cta { padding: 100px 32px; background: linear-gradient(135deg, ${A}12, var(--bg-2), ${A}08); text-align: center; }
.vblog-cta-h2 {
  font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700;
  color: var(--text-primary); margin-bottom: 14px; letter-spacing: -0.025em;
}
.vblog-cta-sub { font-size: 1rem; color: var(--text-secondary); max-width: 440px; margin: 0 auto 28px; line-height: 1.7; }

@media (max-width: 768px) {
  .vblog-hero { padding: 120px 20px 80px; }
  .vblog-section, .vblog-section-alt { padding: 80px 20px; }
  .vblog-final-cta { padding: 80px 20px; }
  .vblog-card-body { padding: 24px; }
  .vblog-newsletter { padding: 28px 24px; }
  .vblog-nl-form { flex-direction: column; }
  .vblog-nl-input { min-width: unset; }
}
`;

// ── Scroll Reveal ──────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ── SVG Icons ──────────────────────────────────────────────────────────────
const ArrowRight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Article Data ───────────────────────────────────────────────────────────
const ARTICLES = [
  {
    slug: 'why-we-accept-15-percent',
    title: 'Why We Accept 15% of Applications (And How to Be One of Them)',
    category: 'Ventures Insights',
    readTime: '7 min',
    date: '2026-02-15',
    dateDisplay: 'February 15, 2026',
  },
  {
    slug: 'equity-vs-revenue-share',
    title: 'Equity vs Revenue Share: Which Model Fits Your Startup?',
    category: 'Deal Models',
    readTime: '8 min',
    date: '2026-01-20',
    dateDisplay: 'January 20, 2026',
  },
  {
    slug: 'founder-we-almost-rejected',
    title: 'The Founder We Almost Rejected (And Why We\'re Glad We Didn\'t)',
    category: 'Founder Stories',
    readTime: '6 min',
    date: '2025-12-10',
    dateDisplay: 'December 10, 2025',
  },
  {
    slug: 'when-ventures-company-fails',
    title: 'What Happens When a Ventures Company Fails: An Honest Account',
    category: 'Transparency',
    readTime: '9 min',
    date: '2025-11-05',
    dateDisplay: 'November 5, 2025',
  },
];

// ── Newsletter Component ───────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <Reveal delay={0.3}>
      <div className="vblog-newsletter">
        <div className="vblog-nl-title">Get Ventures Updates</div>
        <p className="vblog-nl-sub">
          New articles on equity partnerships, deal structures, and founder stories — directly to your inbox. No noise.
        </p>
        {submitted ? (
          <p style={{ color: A, fontFamily: F.m, fontSize: '0.84rem', letterSpacing: '0.04em' }}>
            You&apos;re subscribed. We&apos;ll be in touch.
          </p>
        ) : (
          <form className="vblog-nl-form" onSubmit={handleSubmit}>
            <input
              className="vblog-nl-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address"
            />
            <button className="vblog-nl-btn" type="submit">
              Get Ventures updates
            </button>
          </form>
        )}
      </div>
    </Reveal>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function VenturesBlogPage() {
  return (
    <main className="vblog-wrap">
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="vblog-hero">
        <div className="vblog-hero-inner">
          <Reveal>
            <div className="vblog-badge">Ventures Blog</div>
            <h1 className="vblog-h1">
              Founder Stories &amp;{' '}
              <span className="vblog-gradient-text">Partnership Guides.</span>
            </h1>
            <p className="vblog-sub">
              Honest content about building companies with equity partnerships.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Articles ── */}
      <section className="vblog-section-alt">
        <div className="vblog-container">
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="vblog-sec-label">Latest</div>
                <h2 className="vblog-sec-h2">Recent Articles.</h2>
              </div>
            </div>
          </Reveal>

          <div className="vblog-grid">
            {ARTICLES.map((article, i) => (
              <Reveal key={article.slug} delay={i * 0.08}>
                <Link href={`/ventures/blog/${article.slug}`} className="vblog-card">
                  <div className="vblog-card-body">
                    <div className="vblog-card-meta">
                      <span className="vblog-card-cat">{article.category}</span>
                      <span className="vblog-card-read">{article.readTime} read</span>
                    </div>
                    <div className="vblog-card-title">{article.title}</div>
                    <div className="vblog-card-date">
                      <span>{article.dateDisplay}</span>
                      <span className="vblog-card-arrow">
                        <ArrowRight />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Newsletter />
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="vblog-final-cta">
        <Reveal>
          <div className="vblog-sec-label" style={{ justifyContent: 'center', display: 'flex' }}>
            Ready to Apply?
          </div>
          <h2 className="vblog-cta-h2">Ready to apply?</h2>
          <p className="vblog-cta-sub">
            10 minutes to apply. 7 business days to hear back. Every application reviewed personally.
          </p>
          <Link href="/ventures/apply" className="vblog-btn-primary">
            Apply to Ventures <ArrowRight />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
