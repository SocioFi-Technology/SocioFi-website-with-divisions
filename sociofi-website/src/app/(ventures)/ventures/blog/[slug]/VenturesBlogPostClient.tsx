'use client';

import { useRef } from 'react';
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
.vbp-wrap { background: var(--bg); color: var(--text-primary); min-height: 100vh; font-family: ${F.b}; overflow-x: hidden; }

/* ── Back link ── */
.vbp-back-bar { background: var(--bg-2, #111128); border-bottom: 1px solid var(--border); padding: 14px 0; }
.vbp-back-bar-inner { max-width: 1100px; margin: 0 auto; padding: 0 32px; }
.vbp-back { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.m}; font-size: 0.7rem; color: var(--text-muted); text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s; }
.vbp-back:hover { color: ${A}; }
.vbp-back svg { flex-shrink: 0; }

/* ── Article header ── */
.vbp-header { padding: 80px 32px 60px; background: var(--bg); position: relative; overflow: hidden; text-align: center; }
.vbp-header::before { content: ''; position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 700px; height: 500px; background: radial-gradient(ellipse at center, ${A}10 0%, transparent 70%); pointer-events: none; }
.vbp-header-inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 1; }
.vbp-meta { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 24px; }
.vbp-cat { font-family: ${F.m}; font-size: 0.65rem; font-weight: 600; color: ${A}; text-transform: uppercase; letter-spacing: 0.1em; background: ${A}14; padding: 4px 12px; border-radius: 100px; }
.vbp-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-muted); }
.vbp-meta-txt { font-family: ${F.m}; font-size: 0.68rem; color: var(--text-muted); letter-spacing: 0.04em; }
.vbp-title { font-family: ${F.h}; font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; color: var(--text-primary); margin-bottom: 32px; }
.vbp-gradient-text { background: linear-gradient(135deg, var(--navy-bright, #4A6CB8), ${A}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.vbp-author-row { display: flex; align-items: center; justify-content: center; gap: 12px; }
.vbp-author-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); display: flex; align-items: center; justify-content: center; font-family: ${F.m}; font-size: 0.65rem; font-weight: 700; color: #fff; flex-shrink: 0; }
.vbp-author-name { font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
.vbp-author-role { font-family: ${F.b}; font-size: 0.78rem; color: var(--text-muted); }

/* ── Article layout ── */
.vbp-article { padding: 60px 32px 100px; }
.vbp-article-inner { max-width: 1060px; margin: 0 auto; display: grid; grid-template-columns: 220px 1fr; gap: 60px; align-items: start; }
@media (max-width: 900px) { .vbp-article-inner { grid-template-columns: 1fr; } }

/* ── TOC ── */
.vbp-toc { position: sticky; top: 100px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 24px; }
@media (max-width: 900px) { .vbp-toc { position: static; } }
.vbp-toc-title { font-family: ${F.m}; font-size: 0.63rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
.vbp-toc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
.vbp-toc-item a { display: block; font-size: 0.82rem; color: var(--text-muted); text-decoration: none; padding: 5px 0 5px 10px; border-left: 2px solid transparent; transition: all 0.2s; line-height: 1.4; font-family: ${F.b}; }
.vbp-toc-item a:hover { color: ${A}; border-left-color: ${A}; padding-left: 14px; }

/* ── Body ── */
.vbp-body { min-width: 0; }
.vbp-body h2 { font-family: ${F.h}; font-size: 1.45rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; margin: 48px 0 16px; line-height: 1.25; padding-top: 8px; border-top: 1px solid var(--border); }
.vbp-body h2:first-child { margin-top: 0; border-top: none; padding-top: 0; }
.vbp-body p { font-size: 1rem; line-height: 1.8; color: var(--text-secondary); margin: 0 0 20px; }
.vbp-body ul { padding-left: 20px; margin: 0 0 20px; display: flex; flex-direction: column; gap: 8px; }
.vbp-body li { font-size: 1rem; line-height: 1.7; color: var(--text-secondary); }
.vbp-body strong { color: var(--text-primary); font-weight: 600; }
.vbp-callout { background: ${A}0A; border: 1px solid ${A}22; border-left: 3px solid ${A}; border-radius: 0 12px 12px 0; padding: 20px 24px; margin: 24px 0; font-size: 0.93rem; line-height: 1.7; color: var(--text-secondary); }
.vbp-callout strong { color: var(--text-primary); }

/* ── Related ── */
.vbp-related { padding: 80px 32px; background: var(--bg-2); }
.vbp-related-inner { max-width: 900px; margin: 0 auto; }
.vbp-related-label { font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
.vbp-related-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
.vbp-related-title { font-family: ${F.h}; font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin-bottom: 32px; letter-spacing: -0.02em; }
.vbp-related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
@media (max-width: 640px) { .vbp-related-grid { grid-template-columns: 1fr; } }
.vbp-related-card { display: flex; flex-direction: column; background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 24px 28px; text-decoration: none; transition: all 0.3s; position: relative; overflow: hidden; }
.vbp-related-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); opacity: 0; transition: opacity 0.3s; }
.vbp-related-card:hover { border-color: ${A}25; transform: translateY(-4px); }
.vbp-related-card:hover::before { opacity: 1; }
.vbp-related-card-cat { font-family: ${F.m}; font-size: 0.63rem; font-weight: 600; color: ${A}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
.vbp-related-card-title { font-family: ${F.h}; font-size: 0.95rem; font-weight: 700; color: var(--text-primary); line-height: 1.3; margin-bottom: 8px; }
.vbp-related-card-read { font-family: ${F.m}; font-size: 0.67rem; color: var(--text-muted); margin-top: auto; padding-top: 12px; }

/* ── Article CTA ── */
.vbp-article-cta { padding: 100px 32px; background: linear-gradient(135deg, ${A}12, var(--bg), ${A}08); text-align: center; }
.vbp-cta-h2 { font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; color: var(--text-primary); margin-bottom: 14px; letter-spacing: -0.025em; }
.vbp-cta-sub { font-size: 1rem; color: var(--text-secondary); max-width: 420px; margin: 0 auto 32px; line-height: 1.7; }
.vbp-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
.vbp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px ${A}40; }
`;

// ── Helpers ────────────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

const ArrowLeft = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── TOC Sections ──────────────────────────────────────────────────────────
const TOC_SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'the-core-question', label: 'The Core Question' },
  { id: 'when-equity-makes-sense', label: 'When Equity Makes Sense' },
  { id: 'when-revenue-share-makes-sense', label: 'When Revenue Share Makes Sense' },
  { id: 'the-math-that-matters', label: 'The Math That Matters' },
  { id: 'making-the-decision', label: 'Making the Decision' },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default function VenturesBlogPostClient() {
  return (
    <main className="vbp-wrap">
      <style>{STYLES}</style>

      {/* ── Back Link ── */}
      <div className="vbp-back-bar">
        <div className="vbp-back-bar-inner">
          <Link href="/ventures/blog" className="vbp-back">
            <ArrowLeft /> Back to Ventures Blog
          </Link>
        </div>
      </div>

      {/* ── Article Header ── */}
      <Reveal>
        <header className="vbp-header">
          <div className="vbp-header-inner">
            <div className="vbp-meta">
              <span className="vbp-cat">Deal Models</span>
              <span className="vbp-meta-dot" aria-hidden="true" />
              <span className="vbp-meta-txt">8 min read</span>
              <span className="vbp-meta-dot" aria-hidden="true" />
              <span className="vbp-meta-txt">January 20, 2026</span>
            </div>
            <h1 className="vbp-title">
              <span className="vbp-gradient-text">Equity vs Revenue Share:</span>
              <br />Which Model Fits Your Startup?
            </h1>
            <div className="vbp-author-row">
              <div className="vbp-author-avatar" aria-hidden="true">SV</div>
              <div>
                <div className="vbp-author-name">SocioFi Ventures Team</div>
                <div className="vbp-author-role">SocioFi Technology &middot; Ventures Division</div>
              </div>
            </div>
          </div>
        </header>
      </Reveal>

      {/* ── Article Body ── */}
      <article className="vbp-article">
        <div className="vbp-article-inner">
          {/* TOC */}
          <Reveal delay={0.1}>
            <nav className="vbp-toc" aria-label="Table of contents">
              <div className="vbp-toc-title">In this article</div>
              <ul className="vbp-toc-list">
                {TOC_SECTIONS.map((sec) => (
                  <li className="vbp-toc-item" key={sec.id}>
                    <a href={`#${sec.id}`}>{sec.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          {/* Body */}
          <Reveal delay={0.15}>
            <div className="vbp-body">
              <h2 id="introduction">Introduction</h2>
              <p>
                When founders apply to Ventures, one of the most common questions on the call is simple: <strong>&ldquo;Should I go equity or revenue share?&rdquo;</strong> It&apos;s a fair question, and there&apos;s no universal right answer. The decision depends on what kind of business you&apos;re building, how quickly it will generate revenue, and how you think about the long-term ownership of your company.
              </p>
              <p>
                This article lays out the decision framework we use when helping founders choose &mdash; and what the math actually looks like in practice.
              </p>

              <h2 id="the-core-question">The Core Question</h2>
              <p>
                The core question isn&apos;t &ldquo;which is cheaper?&rdquo; &mdash; it&apos;s <strong>&ldquo;which aligns our incentives better given your specific situation?&rdquo;</strong>
              </p>
              <p>
                Equity says: &ldquo;SocioFi gets a share of whatever this company becomes &mdash; big, small, or nothing.&rdquo;
                Revenue share says: &ldquo;SocioFi gets paid back from the revenue you generate, then we&apos;re done.&rdquo;
              </p>
              <p>
                One is a permanent tie to your company&apos;s value. The other is a finite obligation tied to your cash flow. Both are valid. The right one depends on your trajectory.
              </p>

              <h2 id="when-equity-makes-sense">When Equity Makes Sense</h2>
              <p>
                Equity is a better choice when:
              </p>
              <ul>
                <li>Your product has high growth potential &mdash; you&apos;re building something that could scale significantly</li>
                <li>Revenue will take 12+ months to materialize &mdash; equity doesn&apos;t require you to start paying before you&apos;re profitable</li>
                <li>You plan to raise investment &mdash; equity investors are familiar with this structure and won&apos;t be confused by it</li>
                <li>You&apos;re comfortable with a long-term partner &mdash; equity means SocioFi has a stake in your company indefinitely</li>
              </ul>
              <div className="vbp-callout">
                <strong>Example:</strong> You&apos;re building a B2B SaaS product. Revenue won&apos;t start for 6&ndash;8 months and you plan to raise a seed round in 12 months. Equity makes sense &mdash; you won&apos;t have cash flow early, and SocioFi sharing your upside aligns incentives.
              </div>

              <h2 id="when-revenue-share-makes-sense">When Revenue Share Makes Sense</h2>
              <p>
                Revenue share is a better choice when:
              </p>
              <ul>
                <li>You have clear, near-term revenue &mdash; your product will generate cash within 3&ndash;6 months of launch</li>
                <li>You want to keep full equity &mdash; revenue share lets you pay SocioFi back without diluting ownership</li>
                <li>Your business doesn&apos;t fit a high-growth VC narrative &mdash; services businesses, marketplaces, and lifestyle businesses may not suit equity partnerships</li>
                <li>You want a clean exit from the partnership &mdash; once you hit the cap, the obligation ends. Equity doesn&apos;t work that way.</li>
              </ul>
              <div className="vbp-callout">
                <strong>Example:</strong> You&apos;re building a marketplace with clear transaction fees. You expect $8&ndash;15K per month within 4 months. Revenue share at 10% with a 2.5x cap means you&apos;ll pay SocioFi back in roughly 2 years and keep 100% of your equity. Clean.
              </div>

              <h2 id="the-math-that-matters">The Math That Matters</h2>
              <p>
                Let&apos;s say your build costs $15,000 in development equivalent. Here&apos;s how each model plays out:
              </p>
              <p>
                <strong>Equity at 10%:</strong> SocioFi keeps 10% of your company. If you sell for $5M, that&apos;s $500K to SocioFi. If you never sell, the equity just sits there. If the company fails, nobody gets anything.
              </p>
              <p>
                <strong>Revenue share at 10% with a 2x cap:</strong> SocioFi gets 10% of revenue until you&apos;ve paid $30,000 (2x the equivalent value). At $10K/month revenue, that&apos;s 30 months. At $50K/month, that&apos;s 6 months. Then it stops.
              </p>
              <p>
                The &ldquo;better deal&rdquo; depends entirely on your revenue trajectory and exit scenario. We run through this math with every founder on the discovery call.
              </p>

              <h2 id="making-the-decision">Making the Decision</h2>
              <p>
                Here&apos;s the decision framework we use:
              </p>
              <ul>
                <li><strong>Revenue in &lt;6 months</strong> and you want to keep equity &rarr; revenue share</li>
                <li><strong>High growth potential</strong> and revenue is distant &rarr; equity</li>
                <li><strong>Somewhere in the middle</strong> &rarr; hybrid: partial upfront + smaller equity or rev share</li>
              </ul>
              <p>
                There&apos;s no wrong answer. The best deal structure is the one that lets both sides feel genuinely aligned &mdash; where SocioFi wants your product to succeed because we&apos;ve structured the incentives that way.
              </p>
              <p>
                If you&apos;re still unsure, apply and bring the question to the call. We&apos;ll work through the numbers with you.
              </p>
            </div>
          </Reveal>
        </div>
      </article>

      {/* ── Related Articles ── */}
      <Reveal>
        <section className="vbp-related">
          <div className="vbp-related-inner">
            <div className="vbp-related-label">Continue Reading</div>
            <div className="vbp-related-title">Related Articles</div>
            <div className="vbp-related-grid">
              {[
                {
                  slug: 'why-we-accept-15-percent',
                  category: 'Ventures Insights',
                  title: 'Why We Accept 15% of Applications (And How to Be One of Them)',
                  readTime: '7 min',
                },
                {
                  slug: 'when-ventures-company-fails',
                  category: 'Transparency',
                  title: 'What Happens When a Ventures Company Fails: An Honest Account',
                  readTime: '9 min',
                },
              ].map((article) => (
                <Link key={article.slug} href={`/ventures/blog/${article.slug}`} className="vbp-related-card">
                  <div className="vbp-related-card-cat">{article.category}</div>
                  <div className="vbp-related-card-title">{article.title}</div>
                  <div className="vbp-related-card-read">{article.readTime} read</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Article CTA ── */}
      <section className="vbp-article-cta">
        <Reveal>
          <div style={{ fontFamily: F.m, fontSize: '0.72rem', color: A, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 20, height: 1.5, background: A, display: 'inline-block' }} />
            Ready to Explore a Deal?
          </div>
          <h2 className="vbp-cta-h2">Ready to explore a deal?</h2>
          <p className="vbp-cta-sub">
            Apply to Ventures. Bring your questions to the call. We&apos;ll figure out the right structure together.
          </p>
          <Link href="/ventures/apply" className="vbp-btn-primary">
            Apply to Ventures <ArrowRight />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
