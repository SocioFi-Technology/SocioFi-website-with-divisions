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
  .blg-hero { padding:140px 0 72px; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(114,196,178,0.07) 0%,transparent 70%); }
  .blg-container { max-width:1200px; margin:0 auto; padding:0 32px; }
  .blg-label { font-family:${F.m}; font-size:0.72rem; font-weight:500; color:${A}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:14px; display:flex; align-items:center; gap:10px; }
  .blg-label::before { content:''; width:20px; height:1.5px; background:${A}; display:inline-block; }
  .blg-h1 { font-family:${F.h}; font-size:clamp(2rem,4vw,3rem); font-weight:800; line-height:1.08; letter-spacing:-0.03em; color:var(--text-primary); margin:0 0 16px; }
  .blg-sub { font-family:${F.b}; font-size:1.05rem; line-height:1.7; color:var(--text-secondary); max-width:560px; }
  .blg-section { padding:80px 0; }
  .blg-bg-alt { background:var(--bg-2); }
  .blg-filters { display:flex; gap:10px; margin-bottom:48px; flex-wrap:wrap; }
  .blg-filter { font-family:${F.m}; font-size:0.72rem; font-weight:500; padding:8px 18px; border-radius:100px; border:1.5px solid var(--border); color:var(--text-secondary); background:transparent; cursor:pointer; letter-spacing:0.06em; text-transform:uppercase; transition:all 0.2s; }
  .blg-filter.active { border-color:${A}; color:${A}; background:rgba(114,196,178,0.08); }
  .blg-filter:hover:not(.active) { border-color:rgba(114,196,178,0.3); color:var(--text-primary); }
  .blg-featured { background:var(--bg-card); border:1px solid var(--border); border-radius:18px; padding:40px 44px; margin-bottom:24px; display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; transition:border-color 0.3s; text-decoration:none; }
  .blg-featured:hover { border-color:rgba(114,196,178,0.25); }
  @media(max-width:768px) { .blg-featured { grid-template-columns:1fr; padding:28px; gap:24px; } }
  .blg-featured-badge { font-family:${F.m}; font-size:0.66rem; font-weight:500; padding:4px 12px; border-radius:100px; background:rgba(114,196,178,0.12); color:${A}; text-transform:uppercase; letter-spacing:0.1em; display:inline-block; margin-bottom:14px; }
  .blg-featured-title { font-family:${F.h}; font-size:clamp(1.4rem,2.5vw,1.9rem); font-weight:800; color:var(--text-primary); line-height:1.2; letter-spacing:-0.02em; margin:0 0 14px; }
  .blg-featured-excerpt { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; margin:0 0 20px; }
  .blg-featured-meta { font-family:${F.m}; font-size:0.72rem; color:var(--text-muted); letter-spacing:0.04em; }
  .blg-featured-read { display:inline-flex; align-items:center; gap:6px; font-family:${F.h}; font-size:0.88rem; font-weight:600; color:${A}; margin-top:16px; }
  .blg-featured-visual { background:linear-gradient(135deg,rgba(58,88,158,0.15) 0%,rgba(114,196,178,0.1) 100%); border-radius:12px; height:220px; display:flex; align-items:center; justify-content:center; }
  .blg-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
  @media(max-width:900px) { .blg-grid { grid-template-columns:repeat(2,1fr); } }
  @media(max-width:580px) { .blg-grid { grid-template-columns:1fr; } }
  .blg-card { background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:24px 26px; display:flex; flex-direction:column; transition:border-color 0.3s,transform 0.3s; text-decoration:none; }
  .blg-card:hover { border-color:rgba(114,196,178,0.25); transform:translateY(-3px); }
  .blg-badge { font-family:${F.m}; font-size:0.64rem; font-weight:500; padding:4px 10px; border-radius:100px; text-transform:uppercase; letter-spacing:0.08em; display:inline-block; margin-bottom:14px; }
  .blg-badge.build-log { background:rgba(114,196,178,0.1); color:${A}; }
  .blg-badge.ai-code { background:rgba(123,111,232,0.1); color:#7B6FE8; }
  .blg-badge.guides { background:rgba(107,163,232,0.1); color:#6BA3E8; }
  .blg-badge.case-study { background:rgba(232,145,111,0.1); color:#E8916F; }
  .blg-card-title { font-family:${F.h}; font-size:1rem; font-weight:800; color:var(--text-primary); line-height:1.3; letter-spacing:-0.01em; margin:0 0 10px; flex-grow:1; }
  .blg-card-excerpt { font-family:${F.b}; font-size:0.84rem; color:var(--text-secondary); line-height:1.65; margin:0 0 16px; }
  .blg-card-footer { display:flex; align-items:center; justify-content:space-between; padding-top:14px; border-top:1px solid var(--border); }
  .blg-card-meta { font-family:${F.m}; font-size:0.68rem; color:var(--text-muted); letter-spacing:0.04em; }
  .blg-card-link { font-family:${F.h}; font-size:0.82rem; font-weight:600; color:${A}; display:flex; align-items:center; gap:4px; }
  .blg-h2 { font-family:${F.h}; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; color:var(--text-primary); margin:0 0 8px; letter-spacing:-0.02em; }
  .blg-body { font-family:${F.b}; font-size:0.95rem; color:var(--text-secondary); line-height:1.7; }
  .blg-newsletter { background:var(--bg-card); border:1px solid var(--border); border-radius:18px; padding:40px; max-width:560px; margin:0 auto; text-align:center; }
  .blg-newsletter-input { width:100%; padding:12px 16px; background:var(--bg-2); border:1.5px solid var(--border); border-radius:10px; font-family:${F.b}; font-size:0.9rem; color:var(--text-primary); outline:none; box-sizing:border-box; transition:border-color 0.2s; margin-bottom:12px; }
  .blg-newsletter-input:focus { border-color:${A}; }
  .blg-newsletter-input::placeholder { color:var(--text-muted); }
  .blg-btn-pri { display:inline-flex; width:100%; justify-content:center; align-items:center; gap:8px; padding:13px 24px; border-radius:10px; background:linear-gradient(135deg,#3A589E 0%,${A} 100%); color:#fff; font-family:${F.h}; font-size:0.9rem; font-weight:600; border:none; cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; }
  .blg-btn-pri:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(58,88,158,0.35); }
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

type Category = 'Build Logs' | 'AI & Code' | 'Guides' | 'Case Studies';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  date: string;
  readTime: string;
}

const POSTS: Post[] = [
  {
    slug: 'how-we-rescued-a-broken-saas-mvp-in-18-days',
    title: 'How We Rescued a Broken SaaS MVP in 18 Days',
    excerpt: "A deep dive into the InboxFlow project: what was broken, how we fixed it, and what every founder should know before their first deploy.",
    category: 'Build Logs',
    date: 'March 10, 2026',
    readTime: '8 min',
  },
  {
    slug: 'ai-writes-70-percent-of-our-code',
    title: 'AI Writes 70% of Our Code. Here\'s What the Other 30% Takes.',
    excerpt: "The honest breakdown of what AI development tools can and can't do — and why the 30% that requires human judgment is the 30% that matters most.",
    category: 'AI & Code',
    date: 'March 3, 2026',
    readTime: '12 min',
  },
  {
    slug: '5-things-that-break-every-ai-generated-codebase',
    title: 'The 5 Things That Break Every AI-Generated Codebase',
    excerpt: "Auth, payments, deployment, error handling, and security. Here's why AI tools consistently get these wrong and how to spot the problems early.",
    category: 'Guides',
    date: 'February 24, 2026',
    readTime: '10 min',
  },
  {
    slug: 'ai-prototype-to-production-in-3-weeks',
    title: 'How to Go From AI Prototype to Production in Under 3 Weeks',
    excerpt: "A practical framework for founders who've built something with AI tools and need to turn it into a real, deployable product.",
    category: 'Guides',
    date: 'February 17, 2026',
    readTime: '6 min',
  },
  {
    slug: 'building-brightpath-internal-tool-3-weeks',
    title: 'Building BrightPath: A 30-Person Internal Tool in 3 Weeks',
    excerpt: "How we replaced a company's entire operations workflow — 4 spreadsheets, manual data entry, and hours of reporting — with a real-time dashboard.",
    category: 'Build Logs',
    date: 'February 10, 2026',
    readTime: '7 min',
  },
  {
    slug: 'why-we-give-fixed-prices',
    title: 'Why We Give Fixed Prices When Everyone Else Bills Hourly',
    excerpt: "Hourly billing misaligns incentives. Here's why we charge fixed project prices and how we protect ourselves (and clients) when scope grows.",
    category: 'Guides',
    date: 'February 3, 2026',
    readTime: '5 min',
  },
];

type Filter = 'All' | Category;
const FILTERS: Filter[] = ['All', 'Build Logs', 'Guides', 'AI & Code', 'Case Studies'];

function badgeClass(cat: Category): string {
  if (cat === 'Build Logs') return 'blg-badge build-log';
  if (cat === 'AI & Code') return 'blg-badge ai-code';
  if (cat === 'Case Studies') return 'blg-badge case-study';
  return 'blg-badge guides';
}

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [email, setEmail] = useState('');

  const filtered = POSTS.filter(p => activeFilter === 'All' || p.category === activeFilter);
  const [featured, ...rest] = filtered;

  return (
    <>
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="blg-hero">
        <div className="blg-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="blg-label">Studio Blog</div>
          </motion.div>
          <motion.h1 className="blg-h1" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            How We Build. What We&apos;ve Learned.
          </motion.h1>
          <motion.p className="blg-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            Build logs, technical decisions, and practical guides from the SocioFi Studio team.
          </motion.p>
        </div>
      </section>

      {/* Posts */}
      <section className="blg-section">
        <div className="blg-container">

          {/* Filters */}
          <Reveal>
            <div className="blg-filters">
              {FILTERS.map(f => (
                <button
                  key={f}
                  className={`blg-filter${activeFilter === f ? ' active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                  aria-pressed={activeFilter === f}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Featured post */}
          {featured && (
            <Reveal delay={0.05}>
              <Link href={`/studio/blog/${featured.slug}`} className="blg-featured">
                <div>
                  <span className={badgeClass(featured.category)}>{featured.category}</span>
                  <h2 className="blg-featured-title">{featured.title}</h2>
                  <p className="blg-featured-excerpt">{featured.excerpt}</p>
                  <div className="blg-featured-meta">{featured.date} · {featured.readTime} read</div>
                  <div className="blg-featured-read">
                    Read more
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                </div>
                <div className="blg-featured-visual" aria-hidden="true">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Rest of posts */}
          {rest.length > 0 && (
            <div className="blg-grid" style={{ marginTop: 0 }}>
              {rest.map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.07}>
                  <Link href={`/studio/blog/${post.slug}`} className="blg-card">
                    <span className={badgeClass(post.category)}>{post.category}</span>
                    <h3 className="blg-card-title">{post.title}</h3>
                    <p className="blg-card-excerpt">{post.excerpt}</p>
                    <div className="blg-card-footer">
                      <span className="blg-card-meta">{post.date} · {post.readTime} read</span>
                      <span className="blg-card-link">
                        Read
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="blg-section blg-bg-alt">
        <div className="blg-container">
          <Reveal>
            <div className="blg-newsletter">
              <div className="blg-label" style={{ justifyContent: 'center' }}>Newsletter</div>
              <h2 className="blg-h2" style={{ marginBottom: 8 }}>Stay in the loop</h2>
              <p className="blg-body" style={{ marginBottom: 24 }}>
                Studio updates, build logs, and guides. No noise.
              </p>
              <input
                type="email"
                className="blg-newsletter-input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button className="blg-btn-pri" type="button">
                Subscribe
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
              <p style={{ fontFamily: F.b, fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 12 }}>
                Unsubscribe anytime. No spam, ever.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
