'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────────

const A = '#7B6FE8';

// ── Data ───────────────────────────────────────────────────────────────────────

type Stream = 'agent-architecture' | 'applied-ai' | 'developer-tooling' | 'industry-automation';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  stream: Stream;
  date: string;
  readTime: number;
  tags: string[];
  featured: boolean;
}

const STREAM_LABELS: Record<Stream, string> = {
  'agent-architecture': 'Agent Architecture',
  'applied-ai': 'Applied AI',
  'developer-tooling': 'Developer Tooling',
  'industry-automation': 'Industry Automation',
};

const ARTICLES: Article[] = [
  {
    slug: 'why-multi-agent-systems-fail-at-scale',
    title: 'Why Multi-Agent Systems Fail at Scale',
    excerpt:
      'Multi-agent systems look elegant in architecture diagrams. In production, they develop failure modes that are difficult to reproduce, nearly impossible to debug, and expensive to fix. After running several production multi-agent systems, we have identified the patterns that cause cascading failures — and what actually prevents them.',
    stream: 'agent-architecture',
    date: '2026-03-15',
    readTime: 14,
    tags: ['multi-agent', 'reliability', 'production'],
    featured: true,
  },
  {
    slug: 'tool-use-reliability-six-month-benchmark',
    title: 'Tool Use Reliability: Our 6-Month Benchmark',
    excerpt:
      'We ran structured reliability benchmarks on tool-calling behavior across six months and three production systems. The results were surprising: raw accuracy was less important than how agents handled tool failures. Here is the full benchmark methodology and what we learned.',
    stream: 'agent-architecture',
    date: '2026-02-20',
    readTime: 18,
    tags: ['benchmarks', 'tool-use', 'reliability'],
    featured: true,
  },
  {
    slug: 'memory-systems-for-long-running-agents',
    title: 'Memory Systems for Long-Running Agents',
    excerpt:
      'Agents that run for more than a few turns degrade in predictable ways: context fills up, earlier instructions get truncated, and the agent starts making assumptions it should be asking about. We built and tested four different memory architectures to understand what actually works.',
    stream: 'agent-architecture',
    date: '2025-12-08',
    readTime: 12,
    tags: ['memory', 'context', 'long-running'],
    featured: false,
  },
  {
    slug: 'llm-accuracy-in-production-what-benchmarks-dont-tell-you',
    title: 'LLM Accuracy in Production: What the Benchmarks Don\'t Tell You',
    excerpt:
      'Academic benchmarks measure accuracy on clean, well-defined tasks with unambiguous ground truth. Production is messier: ambiguous queries, contradictory context, real-world document noise, and users who do not phrase things the way the benchmark assumed. Here is what we actually measure.',
    stream: 'applied-ai',
    date: '2026-03-01',
    readTime: 16,
    tags: ['benchmarks', 'accuracy', 'production'],
    featured: true,
  },
  {
    slug: 'prompt-engineering-is-engineering',
    title: 'Prompt Engineering Is Engineering',
    excerpt:
      'The term "prompt engineering" is misleading — it implies that writing prompts is a soft skill, something between copywriting and magic. It is not. Prompt design is a systems engineering problem with measurable inputs, testable outputs, and real-world failure modes. Here is how we treat it.',
    stream: 'applied-ai',
    date: '2025-11-14',
    readTime: 10,
    tags: ['prompting', 'engineering', 'methodology'],
    featured: false,
  },
  {
    slug: 'rag-vs-fine-tuning-the-wrong-question',
    title: 'RAG vs Fine-Tuning: The Wrong Question',
    excerpt:
      'Every few months, a new article declares that fine-tuning has finally beaten RAG, or that RAG has made fine-tuning obsolete. Both claims miss the point. The real question is not which technique is better — it is what problem you are actually trying to solve. Here is a framework for thinking about it.',
    stream: 'applied-ai',
    date: '2025-10-02',
    readTime: 11,
    tags: ['RAG', 'fine-tuning', 'architecture'],
    featured: false,
  },
  {
    slug: 'building-a-spec-to-code-pipeline-that-actually-works',
    title: 'Building a Spec-to-Code Pipeline That Actually Works',
    excerpt:
      'We spent six months building and iterating on a pipeline that takes natural language specifications and produces production-ready code. The naive version works about 40% of the time. The version we ship works reliably. Here is everything we changed between those two states.',
    stream: 'developer-tooling',
    date: '2026-02-05',
    readTime: 20,
    tags: ['spec-to-code', 'pipeline', 'automation'],
    featured: true,
  },
  {
    slug: 'ai-code-review-where-it-helps-where-it-lies',
    title: 'AI Code Review: Where It Helps, Where It Lies',
    excerpt:
      'AI code review tools are useful for catching certain categories of bugs and anti-patterns. They are actively misleading for others. After a year of integrating AI review into our engineering process, we have a clear picture of which is which — and how to configure your review pipeline accordingly.',
    stream: 'developer-tooling',
    date: '2025-12-22',
    readTime: 13,
    tags: ['code-review', 'tooling', 'reliability'],
    featured: false,
  },
  {
    slug: 'testing-ai-generated-code-at-scale',
    title: 'Testing AI-Generated Code at Scale',
    excerpt:
      'Testing AI-generated code is not the same as testing human-written code. The failure modes are different. Edge cases appear in unexpected places. And the standard advice — "write tests first" — does not map cleanly to a workflow where the code arrives pre-written. Here is the testing strategy we landed on.',
    stream: 'developer-tooling',
    date: '2025-09-18',
    readTime: 15,
    tags: ['testing', 'quality', 'ai-generated-code'],
    featured: false,
  },
  {
    slug: 'the-40-percent-automation-threshold',
    title: 'The 40% Automation Threshold',
    excerpt:
      'After automating dozens of business processes, we noticed a consistent pattern: processes where AI can handle 40% or more of cases reliably are worth automating. Below that threshold, the overhead of routing, reviewing, and correcting AI output typically exceeds the savings. Here is how we measure and where the lines tend to fall.',
    stream: 'industry-automation',
    date: '2026-01-18',
    readTime: 12,
    tags: ['automation', 'ROI', 'decision-framework'],
    featured: true,
  },
  {
    slug: 'document-processing-what-structured-ai-gets-right',
    title: 'Document Processing: What Structured AI Gets Right',
    excerpt:
      'Business document processing — invoices, contracts, reports, forms — was one of the first real automation opportunities we identified. After processing millions of documents across industries, we understand exactly where structured AI excels, where it struggles, and what the failure modes look like in production.',
    stream: 'industry-automation',
    date: '2025-11-30',
    readTime: 14,
    tags: ['document-processing', 'structured-output', 'production'],
    featured: false,
  },
  {
    slug: 'when-to-automate-a-decision-framework',
    title: 'When to Automate: A Decision Framework',
    excerpt:
      'Not every business process should be automated, and not every automation project makes financial sense. We have developed a framework that helps teams make this decision based on measurable criteria rather than enthusiasm or fear. It accounts for volume, complexity, error costs, and maintenance overhead.',
    stream: 'industry-automation',
    date: '2025-08-25',
    readTime: 9,
    tags: ['automation', 'framework', 'decision-making'],
    featured: false,
  },
];

const FEATURED = ARTICLES.filter((a) => a.featured);
const TABS = ['All', 'Agent Architecture', 'Applied AI', 'Developer Tooling', 'Industry Automation'];

// ── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  .blog-hero {
    padding-top: calc(var(--space-section) + 60px);
    padding-bottom: 80px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }
  .blog-hero::before {
    content: '';
    position: absolute;
    top: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, color-mix(in srgb, ${A} 12%, transparent) 0%, transparent 70%);
    pointer-events: none;
  }
  .blog-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .blog-container--narrow {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .blog-masthead-label {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .blog-masthead-label::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1.5px;
    background: ${A};
  }
  .blog-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.05;
    color: var(--text-primary);
    margin-bottom: 20px;
  }
  .blog-subtitle {
    font-family: var(--font-body);
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 56ch;
  }
  .featured-section {
    padding: 80px 0;
    background: var(--bg);
  }
  .featured-hero-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    text-decoration: none;
    transition: border-color 0.3s var(--ease), transform 0.3s var(--ease);
    margin-bottom: 24px;
  }
  .featured-hero-card:hover {
    border-color: ${A};
    transform: translateY(-4px);
  }
  .featured-hero-visual {
    background: linear-gradient(135deg, #1a1640 0%, #0d0d28 100%);
    position: relative;
    overflow: hidden;
    min-height: 340px;
  }
  .featured-hero-visual::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(123,111,232,0.08) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(123,111,232,0.08) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .featured-hero-orb {
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, color-mix(in srgb, ${A} 25%, transparent) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
  .featured-hero-content {
    padding: 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .article-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .stream-tag {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${A};
    background: color-mix(in srgb, ${A} 10%, transparent);
    border: 1px solid color-mix(in srgb, ${A} 20%, transparent);
    padding: 3px 9px;
    border-radius: var(--radius-full);
  }
  .read-time {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-muted);
  }
  .article-title-large {
    font-family: var(--font-headline);
    font-size: clamp(1.4rem, 2.5vw, 2rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: var(--text-primary);
    margin-bottom: 16px;
  }
  .article-excerpt {
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 24px;
  }
  .featured-badge {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${A};
    border: 1px solid color-mix(in srgb, ${A} 30%, transparent);
    padding: 3px 8px;
    border-radius: var(--radius-full);
    margin-bottom: 16px;
  }
  .featured-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .featured-small-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px;
    display: block;
    text-decoration: none;
    transition: border-color 0.3s var(--ease), transform 0.3s var(--ease);
    position: relative;
    overflow: hidden;
  }
  .featured-small-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${A}, transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .featured-small-card:hover {
    border-color: color-mix(in srgb, ${A} 40%, transparent);
    transform: translateY(-3px);
  }
  .featured-small-card:hover::before {
    opacity: 1;
  }
  .featured-small-title {
    font-family: var(--font-headline);
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.3;
    color: var(--text-primary);
    margin-bottom: 10px;
  }
  .featured-small-excerpt {
    font-family: var(--font-body);
    font-size: 0.85rem;
    line-height: 1.65;
    color: var(--text-secondary);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .all-articles-section {
    padding: 80px 0 120px;
    background: var(--bg-2);
    border-top: 1px solid var(--border);
  }
  .section-heading {
    font-family: var(--font-headline);
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: var(--text-primary);
    margin-bottom: 32px;
  }
  .filter-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 48px;
  }
  .filter-tab {
    font-family: var(--font-body);
    font-size: 0.84rem;
    font-weight: 500;
    padding: 8px 18px;
    border-radius: var(--radius-full);
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s var(--ease);
  }
  .filter-tab:hover {
    border-color: color-mix(in srgb, ${A} 40%, transparent);
    color: var(--text-primary);
  }
  .filter-tab--active {
    border-color: ${A};
    background: color-mix(in srgb, ${A} 10%, transparent);
    color: ${A};
  }
  .articles-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .article-row {
    display: grid;
    grid-template-columns: 120px 1fr auto;
    gap: 24px;
    align-items: baseline;
    padding: 24px 0;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
    transition: all 0.2s var(--ease);
  }
  .article-row:first-child {
    border-top: 1px solid var(--border);
  }
  .article-row:hover .article-row-title {
    color: ${A};
  }
  .article-row-date {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    white-space: nowrap;
  }
  .article-row-body {}
  .article-row-stream {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 5px;
  }
  .article-row-title {
    font-family: var(--font-headline);
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.3;
    color: var(--text-primary);
    margin-bottom: 5px;
    transition: color 0.2s var(--ease);
  }
  .article-row-excerpt {
    font-family: var(--font-body);
    font-size: 0.84rem;
    line-height: 1.6;
    color: var(--text-muted);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .article-row-readtime {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-muted);
    white-space: nowrap;
  }
  .newsletter-section {
    padding: 80px 0;
    background: var(--bg);
    border-top: 1px solid var(--border);
  }
  .newsletter-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 56px 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
    position: relative;
    overflow: hidden;
  }
  .newsletter-card::before {
    content: '';
    position: absolute;
    top: -120px;
    right: -120px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, color-mix(in srgb, ${A} 8%, transparent) 0%, transparent 70%);
    pointer-events: none;
  }
  .newsletter-heading {
    font-family: var(--font-headline);
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    margin-bottom: 10px;
  }
  .newsletter-sub {
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.65;
    color: var(--text-secondary);
    max-width: 42ch;
  }
  .newsletter-form {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
  }
  .newsletter-input {
    font-family: var(--font-body);
    font-size: 0.9rem;
    padding: 12px 20px;
    border-radius: var(--radius-full);
    border: 1.5px solid var(--border);
    background: var(--bg-2);
    color: var(--text-primary);
    outline: none;
    width: 240px;
    transition: border-color 0.2s var(--ease);
  }
  .newsletter-input:focus {
    border-color: ${A};
  }
  .newsletter-input::placeholder {
    color: var(--text-muted);
  }
  .newsletter-btn {
    font-family: var(--font-headline);
    font-size: 0.88rem;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: var(--radius-full);
    border: none;
    background: ${A};
    color: #fff;
    cursor: pointer;
    transition: all 0.2s var(--ease);
    white-space: nowrap;
  }
  .newsletter-btn:hover {
    background: #9187f0;
    transform: translateY(-2px);
  }
  .arrow-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-left: 4px;
  }
  @media (max-width: 1024px) {
    .featured-hero-card {
      grid-template-columns: 1fr;
    }
    .featured-hero-visual {
      min-height: 200px;
    }
    .featured-hero-content {
      padding: 36px;
    }
    .featured-grid {
      grid-template-columns: 1fr 1fr;
    }
    .newsletter-card {
      flex-direction: column;
      align-items: flex-start;
      padding: 40px 36px;
    }
  }
  @media (max-width: 768px) {
    .blog-container {
      padding: 0 20px;
    }
    .blog-container--narrow {
      padding: 0 20px;
    }
    .featured-grid {
      grid-template-columns: 1fr;
    }
    .article-row {
      grid-template-columns: 1fr;
      gap: 6px;
    }
    .article-row-date {
      display: none;
    }
    .article-row-readtime {
      display: none;
    }
    .newsletter-form {
      flex-direction: column;
      width: 100%;
    }
    .newsletter-input {
      width: 100%;
    }
    .newsletter-btn {
      width: 100%;
      text-align: center;
    }
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function streamLabel(s: Stream) {
  return STREAM_LABELS[s];
}

// ── Components ────────────────────────────────────────────────────────────────

function FeaturedHeroCard({ article }: { article: Article }) {
  return (
    <Link href={`/labs/blog/${article.slug}`} className="featured-hero-card">
      <div className="featured-hero-visual">
        <div className="featured-hero-orb" aria-hidden="true" />
      </div>
      <div className="featured-hero-content">
        <div className="featured-badge">Featured</div>
        <div className="article-meta">
          <span className="stream-tag">{streamLabel(article.stream)}</span>
          <span className="read-time">{article.readTime} min read</span>
        </div>
        <div className="article-title-large">{article.title}</div>
        <p className="article-excerpt">{article.excerpt}</p>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
        }}>
          {formatDate(article.date)}
        </div>
      </div>
    </Link>
  );
}

function FeaturedSmallCard({ article }: { article: Article }) {
  return (
    <Link href={`/labs/blog/${article.slug}`} className="featured-small-card">
      <div className="article-meta">
        <span className="stream-tag">{streamLabel(article.stream)}</span>
        <span className="read-time">{article.readTime} min</span>
      </div>
      <div className="featured-small-title">{article.title}</div>
      <p className="featured-small-excerpt">{article.excerpt}</p>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        color: 'var(--text-muted)',
        marginTop: 16,
      }}>
        {formatDate(article.date)}
      </div>
    </Link>
  );
}

function ArticleRow({ article }: { article: Article }) {
  return (
    <Link href={`/labs/blog/${article.slug}`} className="article-row">
      <div className="article-row-date">{formatDate(article.date)}</div>
      <div className="article-row-body">
        <div className="article-row-stream">{streamLabel(article.stream)}</div>
        <div className="article-row-title">{article.title}</div>
        <p className="article-row-excerpt">{article.excerpt}</p>
      </div>
      <div className="article-row-readtime">{article.readTime} min</div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LabsBlogPage() {
  const [activeTab, setActiveTab] = useState('All');

  const filteredArticles = activeTab === 'All'
    ? ARTICLES
    : ARTICLES.filter((a) => streamLabel(a.stream) === activeTab);

  // For featured section: first featured as hero, next 3 as small cards
  const [heroFeatured, ...restFeatured] = FEATURED;
  const smallFeatured = restFeatured.slice(0, 3);

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero / Masthead ─────────────────────────────────────────────── */}
      <section className="blog-hero">
        <div className="blog-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="blog-masthead-label">The Labs Blog</div>
            <h1 className="blog-h1">
              Technical writing from<br />the research team.
            </h1>
            <p className="blog-subtitle">
              We write about what we build, what fails, and what we learn.
              No marketing. Just engineering.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Articles ────────────────────────────────────────────── */}
      <section className="featured-section">
        <div className="blog-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {heroFeatured && <FeaturedHeroCard article={heroFeatured} />}
          </motion.div>

          {smallFeatured.length > 0 && (
            <div className="featured-grid">
              {smallFeatured.map((article, i) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <FeaturedSmallCard article={article} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── All Articles ─────────────────────────────────────────────────── */}
      <section className="all-articles-section">
        <div className="blog-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="section-heading">All articles</h2>

            {/* Filter tabs */}
            <div className="filter-tabs" role="tablist" aria-label="Filter by stream">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`filter-tab${activeTab === tab ? ' filter-tab--active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Article list */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="articles-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredArticles.map((article) => (
                <ArticleRow key={article.slug} article={article} />
              ))}
              {filteredArticles.length === 0 && (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-muted)',
                  padding: '48px 0',
                  textAlign: 'center',
                }}>
                  No articles in this stream yet.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Newsletter CTA ───────────────────────────────────────────────── */}
      <section className="newsletter-section">
        <div className="blog-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="newsletter-card">
              <div>
                <h2 className="newsletter-heading">Get the research, not the noise.</h2>
                <p className="newsletter-sub">
                  New articles from the Labs team. We publish when we have something
                  worth saying — usually every 2–3 weeks. No digest spam.
                </p>
              </div>
              <form
                className="newsletter-form"
                onSubmit={(e) => e.preventDefault()}
                aria-label="Newsletter signup"
              >
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="your@email.com"
                  aria-label="Email address"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
