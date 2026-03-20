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
.vbp-back-bar { padding: 120px 32px 0; }
.vbp-back-bar-inner { max-width: 860px; margin: 0 auto; }
.vbp-back {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: ${F.h}; font-size: 0.84rem; font-weight: 600;
  color: var(--text-muted); text-decoration: none;
  transition: color 0.2s;
}
.vbp-back:hover { color: ${A}; }
[data-theme="light"] .vbp-back:hover { color: ${A_DARK}; }

/* ── Article Header ── */
.vbp-header { padding: 48px 32px 60px; text-align: center; }
.vbp-header-inner { max-width: 740px; margin: 0 auto; }

.vbp-meta { display: flex; align-items: center; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px; }
.vbp-cat {
  font-family: ${F.m}; font-size: 0.7rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.1em;
  padding: 4px 12px; background: ${A}12; border: 1px solid ${A}20;
  border-radius: 4px;
}
[data-theme="light"] .vbp-cat { color: ${A_DARK}; background: ${A_DARK}10; border-color: ${A_DARK}20; }
.vbp-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-muted); }
.vbp-meta-txt { font-family: ${F.m}; font-size: 0.7rem; color: var(--text-muted); letter-spacing: 0.04em; }

.vbp-title {
  font-family: ${F.h}; font-size: clamp(2rem, 4vw, 3rem); font-weight: 800;
  line-height: 1.1; letter-spacing: -0.03em; color: var(--text-primary);
  margin-bottom: 24px;
}
.vbp-gradient-text {
  background: linear-gradient(135deg, #4A85CC, ${A}, #9BC0F0);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
@media (forced-colors: active) { .vbp-gradient-text { -webkit-text-fill-color: unset; } }

.vbp-author-row {
  display: flex; align-items: center; gap: 14px; justify-content: center;
  padding-top: 24px; border-top: 1px solid var(--border);
}
.vbp-author-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, #4A85CC, ${A});
  display: flex; align-items: center; justify-content: center;
  font-family: ${F.h}; font-size: 0.72rem; font-weight: 700; color: #fff;
  flex-shrink: 0;
}
.vbp-author-name { font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
.vbp-author-role { font-family: ${F.m}; font-size: 0.68rem; color: var(--text-muted); letter-spacing: 0.04em; }

/* ── Article Layout: TOC + body ── */
.vbp-article { padding: 0 32px 100px; }
.vbp-article-inner { max-width: 860px; margin: 0 auto; display: grid; grid-template-columns: 220px 1fr; gap: 60px; align-items: flex-start; }
@media (max-width: 900px) { .vbp-article-inner { grid-template-columns: 1fr; } }

/* ── TOC ── */
.vbp-toc { position: sticky; top: 100px; }
@media (max-width: 900px) { .vbp-toc { position: static; } }
.vbp-toc-title {
  font-family: ${F.m}; font-size: 0.68rem; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.1em;
  margin-bottom: 14px;
}
.vbp-toc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
@media (max-width: 900px) { .vbp-toc-list { flex-direction: row; flex-wrap: wrap; gap: 8px; } }
.vbp-toc-item a {
  font-family: ${F.b}; font-size: 0.84rem; color: var(--text-muted);
  text-decoration: none; line-height: 1.5; display: block;
  padding: 4px 0 4px 12px; border-left: 2px solid transparent;
  transition: all 0.2s;
}
.vbp-toc-item a:hover { color: ${A}; border-left-color: ${A}; }
[data-theme="light"] .vbp-toc-item a:hover { color: ${A_DARK}; border-left-color: ${A_DARK}; }
@media (max-width: 900px) {
  .vbp-toc-item a { border-left: none; border-radius: 4px; padding: 4px 10px; background: var(--bg-2); font-size: 0.8rem; }
  .vbp-toc-item a:hover { background: ${A}12; }
}

/* ── Article Body ── */
.vbp-body { font-size: 1rem; line-height: 1.8; color: var(--text-secondary); }
.vbp-body h2 {
  font-family: ${F.h}; font-size: 1.5rem; font-weight: 700;
  color: var(--text-primary); margin: 48px 0 16px; letter-spacing: -0.015em;
  scroll-margin-top: 100px;
}
.vbp-body h3 {
  font-family: ${F.h}; font-size: 1.15rem; font-weight: 600;
  color: var(--text-primary); margin: 32px 0 12px; letter-spacing: -0.01em;
}
.vbp-body p { margin-bottom: 20px; }
.vbp-body p:last-child { margin-bottom: 0; }
.vbp-body strong { color: var(--text-primary); font-weight: 600; }
.vbp-body ul { margin: 16px 0 20px 0; padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.vbp-body ul li { display: flex; gap: 12px; align-items: flex-start; }
.vbp-body ul li::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%;
  background: ${A}; flex-shrink: 0; margin-top: 8px;
}
.vbp-callout {
  background: ${A}08; border: 1px solid ${A}20; border-left: 3px solid ${A};
  border-radius: 0 12px 12px 0; padding: 20px 24px; margin: 28px 0;
  font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary);
}
.vbp-callout strong { color: var(--text-primary); }

/* ── Related Articles ── */
.vbp-related { padding: 80px 32px; background: var(--bg-2); }
.vbp-related-inner { max-width: 860px; margin: 0 auto; }
.vbp-related-label {
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 8px; display: flex; align-items: center; gap: 8px;
}
.vbp-related-label::before { content: ''; width: 16px; height: 1.5px; background: ${A}; display: inline-block; }
.vbp-related-title {
  font-family: ${F.h}; font-size: 1.5rem; font-weight: 700;
  color: var(--text-primary); margin-bottom: 32px; letter-spacing: -0.015em;
}
.vbp-related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
@media (max-width: 600px) { .vbp-related-grid { grid-template-columns: 1fr; } }
.vbp-related-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 16px; padding: 24px 28px;
  text-decoration: none; color: inherit;
  display: flex; flex-direction: column; gap: 10px;
  transition: all 0.35s;
}
.vbp-related-card:hover { border-color: ${A}30; transform: translateY(-4px); }
.vbp-related-card-cat { font-family: ${F.m}; font-size: 0.68rem; color: ${A}; letter-spacing: 0.06em; text-transform: uppercase; }
[data-theme="light"] .vbp-related-card-cat { color: ${A_DARK}; }
.vbp-related-card-title { font-family: ${F.h}; font-size: 1rem; font-weight: 700; color: var(--text-primary); line-height: 1.35; }
.vbp-related-card-read { font-family: ${F.m}; font-size: 0.68rem; color: var(--text-muted); }

/* ── Article CTA ── */
.vbp-article-cta { padding: 100px 32px; background: linear-gradient(135deg, ${A}12, var(--bg-2), ${A}08); text-align: center; }
.vbp-cta-h2 { font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; color: var(--text-primary); margin-bottom: 14px; letter-spacing: -0.025em; }
.vbp-cta-sub { font-size: 1rem; color: var(--text-secondary); max-width: 420px; margin: 0 auto 28px; line-height: 1.7; }
.vbp-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; background: linear-gradient(135deg, #4A85CC, ${A});
  color: #fff; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem;
  font-weight: 600; text-decoration: none; transition: all 0.2s;
}
.vbp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(107,163,232,0.35); }

@media (max-width: 768px) {
  .vbp-back-bar { padding-top: 100px; }
  .vbp-article { padding: 0 20px 80px; }
  .vbp-header { padding: 40px 20px 48px; }
  .vbp-related { padding: 60px 20px; }
  .vbp-article-cta { padding: 80px 20px; }
  .vbp-back-bar { padding-left: 20px; padding-right: 20px; }
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
const ArrowLeft = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Static params ──────────────────────────────────────────────────────────
export function generateStaticParams() {
  return [{ slug: 'equity-vs-revenue-share' }];
}

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
export default function VenturesBlogPostPage() {
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
                <div className="vbp-author-role">SocioFi Technology · Ventures Division</div>
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
                This article lays out the decision framework we use when helping founders choose — and what the math actually looks like in practice.
              </p>

              <h2 id="the-core-question">The Core Question</h2>
              <p>
                The core question isn&apos;t &ldquo;which is cheaper?&rdquo; — it&apos;s <strong>&ldquo;which aligns our incentives better given your specific situation?&rdquo;</strong>
              </p>
              <p>
                Equity says: &ldquo;SocioFi gets a share of whatever this company becomes — big, small, or nothing.&rdquo;
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
                <li>Your product has high growth potential — you&apos;re building something that could scale significantly</li>
                <li>Revenue will take 12+ months to materialize — equity doesn&apos;t require you to start paying before you&apos;re profitable</li>
                <li>You plan to raise investment — equity investors are familiar with this structure and won&apos;t be confused by it</li>
                <li>You&apos;re comfortable with a long-term partner — equity means SocioFi has a stake in your company indefinitely</li>
              </ul>
              <div className="vbp-callout">
                <strong>Example:</strong> You&apos;re building a B2B SaaS product. Revenue won&apos;t start for 6–8 months and you plan to raise a seed round in 12 months. Equity makes sense — you won&apos;t have cash flow early, and SocioFi sharing your upside aligns incentives.
              </div>

              <h2 id="when-revenue-share-makes-sense">When Revenue Share Makes Sense</h2>
              <p>
                Revenue share is a better choice when:
              </p>
              <ul>
                <li>You have clear, near-term revenue — your product will generate cash within 3–6 months of launch</li>
                <li>You want to keep full equity — revenue share lets you pay SocioFi back without diluting ownership</li>
                <li>Your business doesn&apos;t fit a high-growth VC narrative — services businesses, marketplaces, and lifestyle businesses may not suit equity partnerships</li>
                <li>You want a clean exit from the partnership — once you hit the cap, the obligation ends. Equity doesn&apos;t work that way.</li>
              </ul>
              <div className="vbp-callout">
                <strong>Example:</strong> You&apos;re building a marketplace with clear transaction fees. You expect $8–15K per month within 4 months. Revenue share at 10% with a 2.5x cap means you&apos;ll pay SocioFi back in roughly 2 years and keep 100% of your equity. Clean.
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
                <li><strong>Revenue in &lt;6 months</strong> and you want to keep equity → revenue share</li>
                <li><strong>High growth potential</strong> and revenue is distant → equity</li>
                <li><strong>Somewhere in the middle</strong> → hybrid: partial upfront + smaller equity or rev share</li>
              </ul>
              <p>
                There&apos;s no wrong answer. The best deal structure is the one that lets both sides feel genuinely aligned — where SocioFi wants your product to succeed because we&apos;ve structured the incentives that way.
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
