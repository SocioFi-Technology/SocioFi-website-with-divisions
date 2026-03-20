'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#5BB5E0';
const F = {
  headline: 'var(--font-display, Syne)',
  body: 'var(--font-body, Outfit)',
  mono: 'var(--font-mono, "Fira Code")',
};

const STYLES = `
  .bl-wrap { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); min-height: 100vh; font-family: ${F.body}; }

  /* Hero */
  .bl-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
  .bl-hero-inner { max-width: 680px; margin: 0 auto; position: relative; z-index: 2; }
  .bl-glow { position: absolute; top: -80px; left: 50%; transform: translateX(-50%); width: 640px; height: 420px; background: radial-gradient(ellipse at center, ${A}0D 0%, transparent 70%); pointer-events: none; }
  .bl-label { display: flex; align-items: center; justify-content: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px; }
  .bl-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .bl-h1 { font-family: ${F.headline}; font-size: clamp(2.4rem, 4.5vw, 3.6rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.035em; color: var(--text-primary, #fff); margin-bottom: 24px; }
  .bl-sub { font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary, #8E9FC4); max-width: 520px; margin: 0 auto; }

  /* Section */
  .bl-section { padding: 100px 32px; }
  .bl-section-alt { background: var(--bg-2, #111128); }
  .bl-container { max-width: 1100px; margin: 0 auto; }
  .bl-container-narrow { max-width: 720px; margin: 0 auto; }
  .bl-sec-label { display: flex; align-items: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
  .bl-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .bl-sec-h2 { font-family: ${F.headline}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary, #fff); margin-bottom: 16px; }

  /* Article grid */
  .bl-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 56px; }
  @media(max-width: 768px) { .bl-grid { grid-template-columns: 1fr; } }

  /* Article card */
  .bl-card { display: flex; flex-direction: column; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); border-radius: 16px; overflow: hidden; text-decoration: none; transition: all 0.35s; position: relative; }
  .bl-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); opacity: 0; transition: opacity 0.35s; }
  .bl-card:hover { border-color: ${A}25; transform: translateY(-5px); box-shadow: 0 16px 48px rgba(0,0,0,0.2); }
  .bl-card:hover::before { opacity: 1; }
  .bl-card-body { padding: 32px; flex: 1; display: flex; flex-direction: column; }
  .bl-cat { display: inline-block; font-family: ${F.mono}; font-size: 0.65rem; font-weight: 600; color: ${A}; text-transform: uppercase; letter-spacing: 0.1em; background: ${A}14; padding: 4px 10px; border-radius: 100px; margin-bottom: 16px; }
  .bl-title { font-family: ${F.headline}; font-size: 1.1rem; font-weight: 700; color: var(--text-primary, #fff); line-height: 1.3; letter-spacing: -0.01em; margin-bottom: 12px; }
  .bl-excerpt { font-size: 0.88rem; line-height: 1.65; color: var(--text-secondary, #8E9FC4); flex: 1; margin-bottom: 20px; }
  .bl-meta { display: flex; align-items: center; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border, rgba(91,181,224,0.06)); }
  .bl-read { font-family: ${F.mono}; font-size: 0.7rem; color: var(--text-muted, #4A5578); }
  .bl-date { font-family: ${F.mono}; font-size: 0.7rem; color: var(--text-muted, #4A5578); margin-left: auto; }

  /* Newsletter */
  .bl-newsletter { padding: 64px 48px; border-radius: 20px; background: var(--bg-card, #13132B); border: 1px solid ${A}20; max-width: 620px; margin: 0 auto; position: relative; overflow: hidden; }
  .bl-newsletter::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); }
  .bl-newsletter-label { font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  .bl-newsletter-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; }
  .bl-newsletter-h3 { font-family: ${F.headline}; font-size: 1.5rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 10px; letter-spacing: -0.02em; }
  .bl-newsletter-desc { font-size: 0.92rem; line-height: 1.65; color: var(--text-secondary, #8E9FC4); margin-bottom: 28px; }
  .bl-newsletter-form { display: flex; gap: 10px; flex-wrap: wrap; }
  .bl-newsletter-input { flex: 1; min-width: 200px; padding: 13px 18px; background: var(--bg-2, #111128); border: 1px solid var(--border, rgba(91,181,224,0.12)); border-radius: 10px; color: var(--text-primary, #fff); font-family: ${F.body}; font-size: 0.9rem; outline: none; transition: border-color 0.2s; }
  .bl-newsletter-input:focus { border-color: ${A}40; }
  .bl-newsletter-input::placeholder { color: var(--text-muted, #4A5578); }
  .bl-newsletter-btn { padding: 13px 24px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border: none; border-radius: 10px; font-family: ${F.headline}; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .bl-newsletter-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(91,181,224,0.3); }
  .bl-newsletter-success { font-family: ${F.mono}; font-size: 0.84rem; color: ${A}; margin-top: 16px; display: flex; align-items: center; gap: 8px; }

  /* PILOT CTA */
  .bl-pilot-cta { padding: 48px 32px; text-align: center; }
  .bl-pilot-text { font-size: 1rem; color: var(--text-secondary, #8E9FC4); margin-bottom: 20px; }
  .bl-pilot-link { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.headline}; font-size: 0.9rem; font-weight: 600; color: ${A}; text-decoration: none; transition: gap 0.2s; }
  .bl-pilot-link:hover { gap: 12px; }
`;

const ARTICLES = [
  {
    slug: 'aws-vs-digitalocean-vs-vercel',
    cat: 'Provider Comparison',
    title: 'AWS vs DigitalOcean vs Vercel: An Honest Comparison for Non-Technical Founders',
    excerpt: 'Three different providers. Wildly different prices, complexity, and use cases. We cut through the marketing to tell you which one actually fits your product.',
    read: '8 min',
    date: 'Feb 12, 2026',
  },
  {
    slug: 'what-managed-hosting-actually-means',
    cat: 'Infrastructure',
    title: "What \"Managed Hosting\" Actually Means (And Why It's Worth It)",
    excerpt: "Everyone says they're \"managed.\" Most of them just mean they provisioned a server for you. Here's what managed infrastructure actually involves.",
    read: '6 min',
    date: 'Jan 25, 2026',
  },
  {
    slug: 'how-we-reduced-hosting-bill-50-percent',
    cat: 'Case Study',
    title: "How We Reduced a Client's Hosting Bill by 50% Without Sacrificing Performance",
    excerpt: 'A real migration from AWS to DigitalOcean — same stack, same traffic, half the cost. The numbers, the process, and what we learned.',
    read: '7 min',
    date: 'Dec 18, 2025',
  },
  {
    slug: 'real-cost-of-self-managed-infrastructure',
    cat: 'Cost Analysis',
    title: 'The Real Cost of Self-Managed Infrastructure',
    excerpt: "The server itself is cheap. It's everything else that kills you. A breakdown of what founders actually spend managing their own infrastructure.",
    read: '5 min',
    date: 'Nov 20, 2025',
  },
];

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="bl-newsletter">
      <div className="bl-newsletter-label">Infrastructure Insights</div>
      <h3 className="bl-newsletter-h3">Get infrastructure insights.</h3>
      <p className="bl-newsletter-desc">No-fluff posts about running software in production. When we publish something worth reading, we&rsquo;ll send it.</p>
      {submitted ? (
        <div className="bl-newsletter-success">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          You&rsquo;re in. We&rsquo;ll be in touch.
        </div>
      ) : (
        <form className="bl-newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="bl-newsletter-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
          />
          <button type="submit" className="bl-newsletter-btn">Get infrastructure insights</button>
        </form>
      )}
    </div>
  );
}

export default function CloudBlogPage() {
  return (
    <main className="bl-wrap">
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="bl-hero">
        <div className="bl-glow" />
        <div className="bl-hero-inner">
          <Reveal>
            <div className="bl-label">Infrastructure Blog</div>
            <h1 className="bl-h1">Infrastructure Insights.</h1>
            <p className="bl-sub">No-fluff content about running software in production.</p>
          </Reveal>
        </div>
      </section>

      {/* Articles */}
      <section className="bl-section">
        <div className="bl-container">
          <Reveal>
            <div className="bl-sec-label">All articles</div>
          </Reveal>
          <div className="bl-grid">
            {ARTICLES.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.08}>
                <Link href={`/cloud/blog/${a.slug}`} className="bl-card">
                  <div className="bl-card-body">
                    <span className="bl-cat">{a.cat}</span>
                    <div className="bl-title">{a.title}</div>
                    <p className="bl-excerpt">{a.excerpt}</p>
                    <div className="bl-meta">
                      <span className="bl-read">{a.read} read</span>
                      <span className="bl-date">{a.date}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bl-section bl-section-alt">
        <div className="bl-container">
          <Reveal>
            <Newsletter />
          </Reveal>
        </div>
      </section>

      {/* PILOT CTA */}
      <section className="bl-pilot-cta">
        <Reveal>
          <p className="bl-pilot-text">Have a hosting question?</p>
          <a href="#pilot" className="bl-pilot-link">
            Ask PILOT
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </Reveal>
      </section>
    </main>
  );
}
