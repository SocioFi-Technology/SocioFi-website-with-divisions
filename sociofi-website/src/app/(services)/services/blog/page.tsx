'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────────

const A = '#4DBFA8';

// ── Styles ─────────────────────────────────────────────────────────────────────

const STYLES = `
  .sblog-page {
    min-height: 100vh;
    background: var(--bg);
    padding-top: 80px;
  }

  /* ── Hero ─────────────────────────────────────────────────── */
  .sblog-hero {
    padding: 100px 0 80px;
    text-align: center;
  }
  .sblog-hero-inner {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .sblog-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .sblog-label::before,
  .sblog-label::after {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .sblog-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.2rem, 4vw, 3rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    margin: 0 0 20px;
  }
  .sblog-subtitle {
    font-family: var(--font-body);
    font-size: 1.05rem;
    line-height: 1.75;
    color: var(--text-secondary);
    margin: 0;
  }

  /* ── Main content area ────────────────────────────────────── */
  .sblog-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px 100px;
  }

  /* ── Section label ────────────────────────────────────────── */
  .sblog-sec-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sblog-sec-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }

  /* ── Featured post ────────────────────────────────────────── */
  .sblog-featured {
    margin-bottom: 80px;
  }
  .sblog-featured-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
    text-decoration: none;
    color: inherit;
  }
  .sblog-featured-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--card-hover-shadow);
  }
  @media (max-width: 768px) {
    .sblog-featured-card { grid-template-columns: 1fr; }
  }
  .sblog-featured-visual {
    background: linear-gradient(135deg, rgba(77,191,168,0.12) 0%, rgba(58,88,158,0.12) 100%);
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .sblog-featured-visual::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(77,191,168,0.06) 0%, transparent 60%);
  }
  .sblog-featured-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    background-image: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 40px,
      ${A} 40px,
      ${A} 41px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 40px,
      ${A} 40px,
      ${A} 41px
    );
  }
  .sblog-featured-cat {
    position: absolute;
    top: 24px;
    left: 24px;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${A};
    padding: 6px 12px;
    background: rgba(77,191,168,0.12);
    border: 1px solid rgba(77,191,168,0.2);
    border-radius: var(--radius-full);
  }
  .sblog-featured-number {
    font-family: var(--font-headline);
    font-size: 5rem;
    font-weight: 800;
    color: ${A};
    opacity: 0.12;
    letter-spacing: -0.05em;
    position: relative;
    z-index: 1;
  }
  .sblog-featured-body {
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .sblog-featured-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .sblog-featured-date {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
  }
  .sblog-featured-read {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
  }
  .sblog-featured-title {
    font-family: var(--font-headline);
    font-size: clamp(1.4rem, 2.5vw, 1.8rem);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 16px;
  }
  .sblog-featured-excerpt {
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.75;
    color: var(--text-secondary);
    margin: 0 0 28px;
    flex: 1;
  }
  .sblog-read-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-headline);
    font-size: 0.88rem;
    font-weight: 600;
    color: ${A};
    letter-spacing: -0.01em;
    transition: gap 0.2s;
  }
  .sblog-featured-card:hover .sblog-read-link { gap: 12px; }
  .sblog-read-link svg { transition: transform 0.2s; }
  .sblog-featured-card:hover .sblog-read-link svg { transform: translateX(4px); }

  /* ── Article grid ─────────────────────────────────────────── */
  .sblog-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 0 0 60px;
  }
  .sblog-articles-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;
  }
  .sblog-count {
    font-family: var(--font-body);
    font-size: 0.84rem;
    color: var(--text-muted);
  }
  .sblog-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  @media (max-width: 768px) {
    .sblog-grid { grid-template-columns: 1fr; }
  }

  /* ── Article card ─────────────────────────────────────────── */
  .sblog-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.35s;
  }
  .sblog-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-hover-shadow);
    border-color: var(--border-hover);
  }
  .sblog-card-top {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(77,191,168,0.08) 0%, rgba(58,88,158,0.06) 100%);
    position: relative;
    overflow: hidden;
  }
  .sblog-card-top-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.04;
    background-image: repeating-linear-gradient(
      45deg,
      ${A},
      ${A} 1px,
      transparent 1px,
      transparent 20px
    );
  }
  .sblog-card-cat-badge {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${A};
    padding: 6px 12px;
    background: rgba(77,191,168,0.1);
    border: 1px solid rgba(77,191,168,0.2);
    border-radius: var(--radius-full);
    position: relative;
    z-index: 1;
  }
  .sblog-card-body {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }
  .sblog-card-meta {
    display: flex;
    gap: 14px;
    align-items: center;
    flex-wrap: wrap;
  }
  .sblog-card-date,
  .sblog-card-read {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
  }
  .sblog-card-title {
    font-family: var(--font-headline);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.3;
    margin: 0;
  }
  .sblog-card-excerpt {
    font-family: var(--font-body);
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.65;
    margin: 0;
    flex: 1;
  }
  .sblog-card-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-headline);
    font-size: 0.82rem;
    font-weight: 600;
    color: ${A};
    letter-spacing: -0.01em;
    transition: gap 0.2s;
    margin-top: 4px;
  }
  .sblog-card:hover .sblog-card-link { gap: 10px; }
  .sblog-card-link svg { transition: transform 0.2s; }
  .sblog-card:hover .sblog-card-link svg { transform: translateX(3px); }

  /* ── Newsletter ───────────────────────────────────────────── */
  .sblog-newsletter {
    margin-top: 80px;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 60px;
    text-align: center;
  }
  .sblog-nl-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    color: ${A};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .sblog-nl-title {
    font-family: var(--font-headline);
    font-size: clamp(1.4rem, 2vw, 1.8rem);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 12px;
  }
  .sblog-nl-desc {
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.65;
    margin: 0 0 32px;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }
  .sblog-nl-form {
    display: flex;
    gap: 12px;
    max-width: 420px;
    margin: 0 auto;
    flex-wrap: wrap;
    justify-content: center;
  }
  .sblog-nl-input {
    flex: 1;
    min-width: 220px;
    padding: 13px 18px;
    border-radius: var(--radius-full);
    border: 1.5px solid var(--border);
    background: var(--bg-card);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .sblog-nl-input:focus { border-color: ${A}; }
  .sblog-nl-input::placeholder { color: var(--text-muted); }
  .sblog-nl-btn {
    padding: 13px 24px;
    background: ${A};
    color: #fff;
    font-family: var(--font-headline);
    font-size: 0.88rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    border-radius: var(--radius-full);
    border: none;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    white-space: nowrap;
  }
  .sblog-nl-btn:hover { opacity: 0.88; transform: translateY(-2px); }
  .sblog-nl-note {
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-top: 14px;
  }

  @media (max-width: 768px) {
    .sblog-main { padding: 0 20px 80px; }
    .sblog-hero { padding: 80px 0 60px; }
    .sblog-hero-inner { padding: 0 20px; }
    .sblog-featured-body { padding: 28px; }
    .sblog-newsletter { padding: 40px 24px; }
  }
`;

// ── Data ───────────────────────────────────────────────────────────────────────

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  date: string;
  featured: boolean;
}

const ARTICLES: Article[] = [
  {
    slug: 'the-true-cost-of-not-maintaining-your-software',
    title: 'The True Cost of Not Maintaining Your Software',
    excerpt: 'Zero is not what software maintenance costs when you do nothing — it is just deferred. Year one looks fine. Year two, an incident. Year three, a breach. The math on ignoring maintenance is not kind.',
    category: 'Maintenance',
    readTime: 8,
    date: '2026-03-10',
    featured: true,
  },
  {
    slug: '5-security-vulnerabilities-every-small-business-should-check-for',
    title: '5 Security Vulnerabilities Every Small Business Should Check For',
    excerpt: 'You do not need to be a security expert to protect your software. You need to know which five things kill the most small business products — and what to do about each one.',
    category: 'Security',
    readTime: 6,
    date: '2026-02-24',
    featured: false,
  },
  {
    slug: 'when-to-upgrade-your-maintenance-plan-warning-signs',
    title: 'When to Upgrade Your Maintenance Plan: Warning Signs',
    excerpt: 'Starting on Essential is smart. Staying on Essential while your product outgrows it is expensive. Five signs it is time to move to Growth or Scale — and what you are risking if you wait.',
    category: 'Plans',
    readTime: 5,
    date: '2026-02-08',
    featured: false,
  },
  {
    slug: 'how-we-reduced-a-clients-downtime-to-zero-in-6-months',
    title: 'How We Reduced a Client\'s Downtime to Zero in 6 Months',
    excerpt: 'When we took over this e-commerce platform, it had averaged 14 hours of unplanned downtime per month for 18 months. Six months later: zero. A detailed case study of what we found, what we fixed, and how.',
    category: 'Case Study',
    readTime: 9,
    date: '2026-01-20',
    featured: false,
  },
  {
    slug: 'ai-agents-in-production-why-monitoring-is-non-negotiable',
    title: 'AI Agents in Production: Why Monitoring Is Non-Negotiable',
    excerpt: 'AI agents fail differently from traditional software. They do not throw exceptions — they quietly drift. Understanding accuracy decay, edge case accumulation, and what good production monitoring actually looks like.',
    category: 'Agents',
    readTime: 7,
    date: '2026-01-05',
    featured: false,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Arrow icon ─────────────────────────────────────────────────────────────────

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ── Animations ─────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ServicesBlogPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const featured = ARTICLES.find((a) => a.featured)!;
  const rest = ARTICLES.filter((a) => !a.featured);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.includes('@')) setSubmitted(true);
  }

  return (
    <>
      <style>{STYLES}</style>
      <main className="sblog-page">

        {/* ── Hero ── */}
        <section className="sblog-hero">
          <motion.div
            className="sblog-hero-inner"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div className="sblog-label" variants={fadeUp}>The Services Blog</motion.div>
            <motion.h1 className="sblog-h1" variants={fadeUp}>
              Maintenance Guides, Security Alerts &amp; Case Studies.
            </motion.h1>
            <motion.p className="sblog-subtitle" variants={fadeUp}>
              Practical articles for founders and operations teams who want to understand what good software maintenance actually looks like — and what neglect costs.
            </motion.p>
          </motion.div>
        </section>

        <div className="sblog-main">

          {/* ── Featured ── */}
          <motion.section
            className="sblog-featured"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div className="sblog-sec-label" variants={fadeUp}>Featured</motion.div>
            <motion.div variants={fadeUp}>
              <Link href={`/services/blog/${featured.slug}`} className="sblog-featured-card">
                <div className="sblog-featured-visual">
                  <div className="sblog-featured-pattern" aria-hidden="true" />
                  <span className="sblog-featured-cat">{featured.category}</span>
                  <span className="sblog-featured-number" aria-hidden="true">01</span>
                </div>
                <div className="sblog-featured-body">
                  <div className="sblog-featured-meta">
                    <span className="sblog-featured-date">{formatDate(featured.date)}</span>
                    <span className="sblog-featured-read">{featured.readTime} min read</span>
                  </div>
                  <h2 className="sblog-featured-title">{featured.title}</h2>
                  <p className="sblog-featured-excerpt">{featured.excerpt}</p>
                  <span className="sblog-read-link">
                    Read article <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            </motion.div>
          </motion.section>

          {/* ── Grid ── */}
          <hr className="sblog-divider" />
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <div className="sblog-articles-header">
              <div className="sblog-sec-label" style={{ marginBottom: 0 }}>All articles</div>
              <span className="sblog-count">{rest.length} articles</span>
            </div>
            <div className="sblog-grid">
              {rest.map((article, i) => (
                <motion.div
                  key={article.slug}
                  variants={fadeUp}
                  custom={i}
                >
                  <Link href={`/services/blog/${article.slug}`} className="sblog-card">
                    <div className="sblog-card-top">
                      <div className="sblog-card-top-pattern" aria-hidden="true" />
                      <span className="sblog-card-cat-badge">{article.category}</span>
                    </div>
                    <div className="sblog-card-body">
                      <div className="sblog-card-meta">
                        <span className="sblog-card-date">{formatDate(article.date)}</span>
                        <span className="sblog-card-read">{article.readTime} min read</span>
                      </div>
                      <h3 className="sblog-card-title">{article.title}</h3>
                      <p className="sblog-card-excerpt">{article.excerpt}</p>
                      <span className="sblog-card-link">
                        Read <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── Newsletter ── */}
          <motion.section
            className="sblog-newsletter"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="sblog-nl-label">Newsletter</p>
            <h2 className="sblog-nl-title">Get maintenance tips monthly.</h2>
            <p className="sblog-nl-desc">
              One email per month. Practical guides, security alerts, and case studies from our maintenance team. No sales, no fluff.
            </p>
            {submitted ? (
              <p style={{ fontFamily: 'var(--font-body)', color: A, fontSize: '0.95rem', fontWeight: 500 }}>
                You&apos;re in. First issue lands next month.
              </p>
            ) : (
              <form className="sblog-nl-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  className="sblog-nl-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                />
                <button type="submit" className="sblog-nl-btn">Subscribe</button>
              </form>
            )}
            <p className="sblog-nl-note">Monthly only. Unsubscribe any time.</p>
          </motion.section>

        </div>
      </main>
    </>
  );
}
