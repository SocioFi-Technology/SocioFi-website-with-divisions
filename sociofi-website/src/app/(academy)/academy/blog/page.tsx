'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ── Constants ────────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Scroll Reveal ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const FEATURED_POST = {
  slug: '5-things-founders-should-know-before-hiring-dev-team',
  title: '5 Things Every Founder Should Know Before Hiring a Dev Team',
  category: 'AI Development',
  author: 'Arifur Rahman',
  date: 'March 15, 2026',
  preview: 'Most founders hire a dev team before they\'re ready. Not because they don\'t care — because nobody told them what "ready" actually means. Here\'s what you need to understand before you sign anything.',
};

const POSTS = [
  {
    slug: 'what-ai-agents-actually-are',
    title: 'What AI Agents Actually Are (No Hype, No Jargon)',
    category: 'AI Agents',
    author: 'Kamrul Hasan',
    date: 'March 10, 2026',
    preview: 'The word "agent" is everywhere. Here\'s what it actually means — and what it doesn\'t.',
  },
  {
    slug: 'how-to-read-a-technical-proposal-in-10-minutes',
    title: 'How to Read a Technical Proposal in 10 Minutes',
    category: 'Product Management',
    author: 'Arifur Rahman',
    date: 'March 5, 2026',
    preview: 'A framework for evaluating what developers propose — without needing a technical background.',
  },
  {
    slug: '70-30-rule-ai-and-engineers',
    title: 'The 70/30 Rule: How AI and Engineers Actually Split the Work',
    category: 'AI Development',
    author: 'Kamrul Hasan',
    date: 'February 28, 2026',
    preview: 'AI generates the code. Engineers handle the 30% that makes it production-ready. That 30% is where the cost lives.',
  },
  {
    slug: 'build-buy-or-agent',
    title: 'Build, Buy, or Agent? A Framework for Non-Technical Leaders',
    category: 'Business Strategy',
    author: 'Arifur Rahman',
    date: 'February 21, 2026',
    preview: 'Three options. Different costs, timelines, and risk profiles. Here\'s how to decide which one applies to your situation.',
  },
  {
    slug: 'why-your-product-spec-is-wrong',
    title: 'Why Your Product Spec Is Wrong (And How to Fix It)',
    category: 'Product Management',
    author: 'Arifur Rahman',
    date: 'February 14, 2026',
    preview: 'The most common reason projects go over budget isn\'t the dev team — it\'s the spec they were given. Let\'s fix yours.',
  },
];

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'AI Development', label: 'AI Development' },
  { key: 'AI Agents', label: 'AI Agents' },
  { key: 'Product Management', label: 'Product Management' },
  { key: 'Business Strategy', label: 'Business Strategy' },
];

const CATEGORY_GRADIENTS: Record<string, string> = {
  'AI Development': `linear-gradient(135deg, ${A}44 0%, rgba(74,108,184,0.3) 100%)`,
  'AI Agents': `linear-gradient(135deg, rgba(123,111,232,0.3) 0%, ${A}33 100%)`,
  'Product Management': `linear-gradient(135deg, ${A}33 0%, rgba(77,191,168,0.3) 100%)`,
  'Business Strategy': `linear-gradient(135deg, rgba(58,88,158,0.3) 0%, ${A}44 100%)`,
};

function getCatGradient(cat: string) {
  return CATEGORY_GRADIENTS[cat] || `linear-gradient(135deg, ${A}33 0%, ${A}11 100%)`;
}

// ── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.blog-page { background: var(--bg); min-height: 100vh; }

/* Hero */
.blog-hero {
  padding: 160px 32px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.blog-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 900px 400px at 50% 0%, rgba(232,184,77,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.blog-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.blog-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
}
.blog-hero-title {
  font-family: ${F.h};
  font-size: clamp(2.4rem, 5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin: 0 auto 16px;
  max-width: 680px;
}
.blog-hero-sub {
  font-family: ${F.b};
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--text-secondary);
  max-width: 580px;
  margin: 0 auto 32px;
}
.blog-filters {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
.blog-filter-btn {
  font-family: ${F.b};
  font-size: 0.86rem;
  font-weight: 500;
  padding: 7px 18px;
  border-radius: 100px;
  border: 1.5px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.blog-filter-btn:hover {
  border-color: ${A}55;
  color: var(--text-primary);
}
.blog-filter-btn.active {
  background: ${A};
  border-color: ${A};
  color: #0C0C1D;
  font-weight: 600;
}

/* Content */
.blog-content {
  padding: 60px 32px 100px;
  max-width: 1100px;
  margin: 0 auto;
}

/* Featured */
.blog-featured {
  margin-bottom: 60px;
}
.blog-featured-card {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: border-color 0.3s, transform 0.3s;
  text-decoration: none;
  color: inherit;
}
.blog-featured-card:hover {
  border-color: ${A}44;
  transform: translateY(-4px);
  box-shadow: var(--card-hover-shadow);
}
.blog-featured-thumb {
  aspect-ratio: auto;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.blog-featured-thumb-inner {
  position: absolute;
  inset: 0;
}
.blog-featured-cat-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  font-family: ${F.m};
  font-size: 0.68rem;
  color: ${A};
  background: rgba(12,12,29,0.7);
  border: 1px solid ${A}44;
  border-radius: 6px;
  padding: 4px 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
}
.blog-featured-body {
  padding: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.blog-featured-title {
  font-family: ${F.h};
  font-size: clamp(1.3rem, 2.2vw, 1.7rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  line-height: 1.2;
  margin-bottom: 14px;
}
.blog-featured-preview {
  font-family: ${F.b};
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 20px;
}
.blog-featured-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-muted);
}
.blog-featured-meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
}
.blog-featured-read {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${F.h};
  font-size: 0.84rem;
  font-weight: 600;
  color: ${A};
  margin-top: 4px;
}

/* Post Grid */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 900px) {
  .blog-grid { grid-template-columns: repeat(2, 1fr); }
  .blog-featured-card { grid-template-columns: 1fr; }
  .blog-featured-thumb { min-height: 180px; }
}
@media (max-width: 600px) {
  .blog-grid { grid-template-columns: 1fr; }
}
.blog-post-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: border-color 0.3s, transform 0.3s;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}
.blog-post-card:hover {
  border-color: ${A}44;
  transform: translateY(-4px);
  box-shadow: var(--card-hover-shadow);
}
.blog-post-thumb {
  height: 140px;
  position: relative;
  overflow: hidden;
}
.blog-post-cat {
  position: absolute;
  top: 12px;
  left: 12px;
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  background: rgba(12,12,29,0.65);
  border: 1px solid ${A}44;
  border-radius: 5px;
  padding: 3px 8px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  backdrop-filter: blur(6px);
}
.blog-post-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.blog-post-title {
  font-family: ${F.h};
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  line-height: 1.35;
  margin-bottom: 8px;
}
.blog-post-preview {
  font-family: ${F.b};
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 14px;
  flex: 1;
}
.blog-post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.blog-post-meta {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-muted);
}
.blog-post-read {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: ${F.h};
  font-size: 0.78rem;
  font-weight: 600;
  color: ${A};
}

/* Newsletter */
.blog-newsletter {
  background: var(--bg-2);
  padding: 80px 32px;
  border-top: 1px solid var(--border);
}
.blog-newsletter-inner {
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
}
.blog-newsletter-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
}
.blog-newsletter-title {
  font-family: ${F.h};
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 8px;
}
.blog-newsletter-sub {
  font-family: ${F.b};
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
}
.blog-newsletter-form {
  display: flex;
  gap: 10px;
  max-width: 420px;
  margin: 0 auto 12px;
}
.blog-newsletter-input {
  flex: 1;
  padding: 12px 18px;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  border-radius: 100px;
  font-family: ${F.b};
  font-size: 0.88rem;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s;
}
.blog-newsletter-input::placeholder { color: var(--text-muted); }
.blog-newsletter-input:focus { border-color: ${A}66; }
.blog-newsletter-btn {
  padding: 12px 22px;
  background: ${A};
  color: #0C0C1D;
  font-family: ${F.h};
  font-size: 0.86rem;
  font-weight: 700;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px ${A}44;
}
.blog-newsletter-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px ${A}55;
}
.blog-newsletter-note {
  font-family: ${F.b};
  font-size: 0.78rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .blog-hero { padding: 120px 20px 60px; }
  .blog-content { padding: 40px 20px 80px; }
  .blog-newsletter { padding: 60px 20px; }
  .blog-newsletter-form { flex-direction: column; border-radius: 12px; }
  .blog-newsletter-input { border-radius: 12px; }
  .blog-newsletter-btn { border-radius: 12px; }
}
`;

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AcademyBlogPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [email, setEmail] = useState('');

  const filteredPosts = POSTS.filter(p =>
    activeFilter === 'all' ? true : p.category === activeFilter
  );

  return (
    <main className="blog-page">
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="blog-hero">
        <Reveal>
          <div className="blog-label">ACADEMY BLOG</div>
          <h1 className="blog-hero-title">The Practical AI Education Blog.</h1>
          <p className="blog-hero-sub">
            No hype, no theory-heavy research papers. Practical guides for founders, leaders,
            and teams learning to work with AI development and AI agents.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="blog-filters">
            {CATEGORY_FILTERS.map(f => (
              <button
                key={f.key}
                className={`blog-filter-btn${activeFilter === f.key ? ' active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Content */}
      <section className="blog-content">
        {/* Featured Post */}
        {(activeFilter === 'all' || activeFilter === FEATURED_POST.category) && (
          <Reveal>
            <div className="blog-featured">
              <Link href={`/academy/blog/${FEATURED_POST.slug}`} className="blog-featured-card">
                <div className="blog-featured-thumb">
                  <div
                    className="blog-featured-thumb-inner"
                    style={{ background: getCatGradient(FEATURED_POST.category) }}
                  />
                  <span className="blog-featured-cat-badge">{FEATURED_POST.category}</span>
                </div>
                <div className="blog-featured-body">
                  <h2 className="blog-featured-title">{FEATURED_POST.title}</h2>
                  <p className="blog-featured-preview">{FEATURED_POST.preview}</p>
                  <div className="blog-featured-meta">
                    <span>{FEATURED_POST.author}</span>
                    <span className="blog-featured-meta-dot" />
                    <span>{FEATURED_POST.date}</span>
                  </div>
                  <span className="blog-featured-read">
                    Read Article <ArrowRightIcon />
                  </span>
                </div>
              </Link>
            </div>
          </Reveal>
        )}

        {/* Post Grid */}
        <div className="blog-grid">
          {filteredPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.07}>
              <Link href={`/academy/blog/${post.slug}`} className="blog-post-card">
                <div
                  className="blog-post-thumb"
                  style={{ background: getCatGradient(post.category) }}
                >
                  <span className="blog-post-cat">{post.category}</span>
                </div>
                <div className="blog-post-body">
                  <h3 className="blog-post-title">{post.title}</h3>
                  <p className="blog-post-preview">{post.preview}</p>
                  <div className="blog-post-footer">
                    <span className="blog-post-meta">{post.author} · {post.date}</span>
                    <span className="blog-post-read">
                      Read <ArrowRightIcon />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="blog-newsletter">
        <Reveal>
          <div className="blog-newsletter-inner">
            <div className="blog-newsletter-label">
              <MailIcon />
            </div>
            <h2 className="blog-newsletter-title">Get new articles every Tuesday.</h2>
            <p className="blog-newsletter-sub">
              Practical AI education — straight to your inbox.
            </p>
            <div className="blog-newsletter-form">
              <input
                type="email"
                className="blog-newsletter-input"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Email address for newsletter"
              />
              <button className="blog-newsletter-btn">Subscribe</button>
            </div>
            <p className="blog-newsletter-note">No spam. Unsubscribe anytime.</p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
