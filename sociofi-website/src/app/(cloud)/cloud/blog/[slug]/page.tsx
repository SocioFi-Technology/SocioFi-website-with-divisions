'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

export function generateStaticParams() {
  return [{ slug: 'aws-vs-digitalocean-vs-vercel' }];
}

const A = '#5BB5E0';
const F = {
  headline: 'var(--font-display, Syne)',
  body: 'var(--font-body, Outfit)',
  mono: 'var(--font-mono, "Fira Code")',
};

const STYLES = `
  .art-wrap { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); min-height: 100vh; font-family: ${F.body}; }

  /* Hero */
  .art-hero { position: relative; padding: 140px 32px 80px; overflow: hidden; text-align: center; }
  .art-hero-inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 2; }
  .art-glow { position: absolute; top: -80px; left: 50%; transform: translateX(-50%); width: 600px; height: 400px; background: radial-gradient(ellipse at center, ${A}0D 0%, transparent 70%); pointer-events: none; }

  .art-back { display: inline-flex; align-items: center; gap: 6px; font-family: ${F.mono}; font-size: 0.7rem; color: var(--text-muted, #4A5578); text-decoration: none; margin-bottom: 32px; transition: color 0.2s; letter-spacing: 0.06em; text-transform: uppercase; }
  .art-back:hover { color: ${A}; }
  .art-cat { display: inline-block; font-family: ${F.mono}; font-size: 0.65rem; font-weight: 600; color: ${A}; text-transform: uppercase; letter-spacing: 0.1em; background: ${A}14; padding: 4px 10px; border-radius: 100px; margin-bottom: 20px; }
  .art-h1 { font-family: ${F.headline}; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; color: var(--text-primary, #fff); margin-bottom: 28px; }
  .art-meta { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; }
  .art-meta-item { display: flex; align-items: center; gap: 6px; font-family: ${F.mono}; font-size: 0.7rem; color: var(--text-muted, #4A5578); letter-spacing: 0.04em; }
  .art-meta-sep { width: 3px; height: 3px; border-radius: 50%; background: var(--text-muted, #4A5578); }

  /* Layout */
  .art-layout { display: grid; grid-template-columns: 220px 1fr; gap: 64px; max-width: 1060px; margin: 0 auto; padding: 80px 32px 120px; align-items: start; }
  @media(max-width: 900px) { .art-layout { grid-template-columns: 1fr; gap: 48px; } }

  /* TOC */
  .art-toc { position: sticky; top: 100px; }
  @media(max-width: 900px) { .art-toc { position: static; } }
  .art-toc-label { font-family: ${F.mono}; font-size: 0.65rem; font-weight: 600; color: var(--text-muted, #4A5578); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 16px; }
  .art-toc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
  .art-toc-btn { display: block; width: 100%; text-align: left; font-size: 0.83rem; color: var(--text-muted, #4A5578); background: none; border: none; border-left: 2px solid transparent; padding: 6px 0 6px 12px; cursor: pointer; transition: all 0.2s; line-height: 1.4; font-family: ${F.body}; }
  .art-toc-btn:hover { color: ${A}; border-left-color: ${A}; padding-left: 16px; }
  .art-toc-btn.active { color: ${A}; border-left-color: ${A}; }

  /* Article body */
  .art-body { min-width: 0; }
  .art-body h2 { font-family: ${F.headline}; font-size: 1.5rem; font-weight: 700; color: var(--text-primary, #fff); letter-spacing: -0.02em; margin: 48px 0 16px; line-height: 1.25; padding-top: 8px; border-top: 1px solid var(--border, rgba(91,181,224,0.08)); }
  .art-body h2:first-child { margin-top: 0; border-top: none; padding-top: 0; }
  .art-body p { font-size: 1rem; line-height: 1.8; color: var(--text-secondary, #8E9FC4); margin: 0 0 20px; }
  .art-body strong { color: var(--text-primary, #fff); font-weight: 600; }

  /* Callout */
  .art-callout { padding: 24px 28px; border-radius: 0 12px 12px 0; background: ${A}0A; border: 1px solid ${A}20; border-left: 3px solid ${A}; margin: 28px 0; }
  .art-callout-label { font-family: ${F.mono}; font-size: 0.63rem; font-weight: 600; color: ${A}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
  .art-callout p { font-size: 0.93rem; line-height: 1.7; color: var(--text-primary, #fff); margin: 0; }

  /* Divider */
  .art-divider { height: 1px; background: var(--border, rgba(91,181,224,0.08)); margin: 48px 0; }

  /* Related */
  .art-related { padding: 80px 32px 100px; background: var(--bg-2, #111128); }
  .art-related-inner { max-width: 860px; margin: 0 auto; }
  .art-related-label { font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
  .art-related-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; }
  .art-related-h2 { font-family: ${F.headline}; font-size: 1.4rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 32px; letter-spacing: -0.02em; }
  .art-related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  @media(max-width: 640px) { .art-related-grid { grid-template-columns: 1fr; } }
  .art-rel-card { display: flex; flex-direction: column; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); border-radius: 14px; padding: 24px 28px; text-decoration: none; transition: all 0.3s; position: relative; overflow: hidden; }
  .art-rel-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); opacity: 0; transition: opacity 0.3s; }
  .art-rel-card:hover { border-color: ${A}25; transform: translateY(-4px); }
  .art-rel-card:hover::before { opacity: 1; }
  .art-rel-cat { font-family: ${F.mono}; font-size: 0.63rem; font-weight: 600; color: ${A}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
  .art-rel-title { font-family: ${F.headline}; font-size: 0.97rem; font-weight: 700; color: var(--text-primary, #fff); line-height: 1.3; margin-bottom: 8px; }
  .art-rel-read { font-family: ${F.mono}; font-size: 0.68rem; color: var(--text-muted, #4A5578); margin-top: auto; padding-top: 12px; }

  /* CTA */
  .art-cta { padding: 100px 32px; background: linear-gradient(135deg, ${A}12, var(--bg, #0C0C1D), ${A}08); text-align: center; }
  .art-cta-label { font-family: ${F.mono}; font-size: 0.72rem; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .art-cta-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; }
  .art-cta-h2 { font-family: ${F.headline}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 14px; letter-spacing: -0.025em; }
  .art-cta-sub { font-size: 1rem; color: var(--text-secondary, #8E9FC4); max-width: 420px; margin: 0 auto 32px; line-height: 1.7; }
  .art-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .art-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.headline}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .art-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(91,181,224,0.3); }
  .art-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border: 1.5px solid var(--border, rgba(91,181,224,0.15)); color: var(--text-primary, #fff); border-radius: 100px; font-family: ${F.headline}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .art-btn-ghost:hover { border-color: ${A}; color: ${A}; }
`;

const TOC = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'three-main-options', label: 'The Three Main Options' },
  { id: 'aws', label: 'AWS: When You Actually Need It' },
  { id: 'digitalocean', label: 'DigitalOcean: The Default Choice' },
  { id: 'vercel', label: 'Vercel: Frontend First' },
  { id: 'how-we-choose', label: 'How We Actually Choose' },
  { id: 'bottom-line', label: 'The Bottom Line' },
];

const RELATED = [
  {
    slug: 'what-managed-hosting-actually-means',
    cat: 'Infrastructure',
    title: 'What "Managed Hosting" Actually Means (And Why It\'s Worth It)',
    read: '6 min',
  },
  {
    slug: 'real-cost-of-self-managed-infrastructure',
    cat: 'Cost Analysis',
    title: 'The Real Cost of Self-Managed Infrastructure',
    read: '5 min',
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

const ArrowRight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function BlogPostPage() {
  const [active, setActive] = useState('introduction');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  };

  return (
    <main className="art-wrap">
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="art-hero">
        <div className="art-glow" />
        <div className="art-hero-inner">
          <Reveal>
            <Link href="/cloud/blog" className="art-back">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back to blog
            </Link>
            <div><span className="art-cat">Provider Comparison</span></div>
            <h1 className="art-h1">AWS vs DigitalOcean vs Vercel: An Honest Comparison for Non-Technical Founders</h1>
            <div className="art-meta">
              <span className="art-meta-item">
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Feb 12, 2026
              </span>
              <span className="art-meta-sep" />
              <span className="art-meta-item">
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                8 min read
              </span>
              <span className="art-meta-sep" />
              <span className="art-meta-item">SocioFi Cloud Team</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Article layout: TOC + body */}
      <div className="art-layout">

        {/* TOC */}
        <Reveal>
          <nav className="art-toc" aria-label="Table of contents">
            <div className="art-toc-label">On this page</div>
            <ul className="art-toc-list">
              {TOC.map((item) => (
                <li key={item.id}>
                  <button className={`art-toc-btn${active === item.id ? ' active' : ''}`} onClick={() => scrollTo(item.id)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        {/* Article */}
        <Reveal delay={0.1}>
          <article className="art-body">

            <h2 id="introduction">Introduction</h2>
            <p>
              Most founders spend more time choosing a cloud provider than they need to. There are thousands of words online comparing AWS vs. DigitalOcean vs. Vercel — most of them written by people trying to sell you something. This one is written by engineers who choose providers for clients every week, with no financial interest in which one you pick.
            </p>
            <p>
              The short version: for 80% of startups, the provider decision is less important than you think. The configuration and management on top of it matters far more. But the decision still has real cost and complexity implications, so here is the honest breakdown.
            </p>

            <h2 id="three-main-options">The Three Main Options</h2>
            <p>
              When most non-technical founders think about "where their app lives," they&rsquo;re choosing between three categories: AWS (Amazon Web Services), DigitalOcean (or equivalent straightforward VPS providers), and Vercel (or similar frontend-focused platforms). Each represents a fundamentally different philosophy about infrastructure.
            </p>
            <p>
              AWS is the everything store — powerful, complex, and priced for enterprises that will use a fraction of what they configure. DigitalOcean is the practical workhorse — capable enough for almost anything, priced honestly, and designed to be understood by humans. Vercel is the specialist — exceptional for what it does, limited outside that lane.
            </p>

            <h2 id="aws">AWS: When You Actually Need It</h2>
            <p>
              AWS has genuine advantages: it runs at a scale nothing else matches, it has services for every niche use case, and if you need compliance certifications like HIPAA or SOC 2, the audit trail is cleaner on AWS than anywhere else.
            </p>
            <p>
              The problem is that most startups don&rsquo;t need any of that. They need a server to run their backend, a database to store their data, and a CDN to serve their static assets. AWS can do all three — at roughly twice the cost of DigitalOcean, with ten times the configuration complexity.
            </p>
            <p>
              AWS is the right choice when: your product genuinely requires AWS-specific services, you have compliance requirements that mandate it, or you expect massive scale within 12 months and want to start where you&rsquo;ll end up.
            </p>

            <div className="art-callout">
              <div className="art-callout-label">The most common mistake</div>
              <p>Choosing AWS because it sounds professional. For 80% of startups, DigitalOcean does everything you need at half the cost. "Real companies use AWS" is not a technical requirement — it&rsquo;s a cargo cult.</p>
            </div>

            <h2 id="digitalocean">DigitalOcean: The Default Choice</h2>
            <p>
              DigitalOcean is our default recommendation for most full-stack products, and it&rsquo;s not a close call. Equivalent compute resources cost roughly 40% less than AWS. The managed database offering is straightforward and reliable. The networking is simpler to configure correctly. The documentation is written for humans.
            </p>
            <p>
              For a typical product — a Next.js frontend, a Node.js or Python backend, a PostgreSQL database, and a few background workers — DigitalOcean handles everything cleanly. We&rsquo;ve run products serving millions of requests per month on DigitalOcean without issue.
            </p>
            <p>
              The honest limitations: DigitalOcean doesn&rsquo;t have the breadth of specialized services AWS does. If you need machine learning infrastructure, niche compliance tooling, or hyperscale global distribution, you may eventually outgrow it. Most products don&rsquo;t get there.
            </p>

            <h2 id="vercel">Vercel: Frontend First</h2>
            <p>
              Vercel is genuinely excellent at what it does. For a purely frontend application — Next.js in particular — Vercel&rsquo;s deployment experience is hard to beat. Git push, instant preview deployments, global edge network, automatic SSL. For simple apps, it just works.
            </p>
            <p>
              The limitation appears the moment you have a complex backend. Vercel&rsquo;s serverless functions have cold start issues, execution limits, and per-invocation pricing that becomes expensive at scale. If you need persistent server processes, long-running background jobs, stateful connections, or a managed database with serious tuning, you end up cobbling together multiple services — and you&rsquo;ve lost the simplicity that made Vercel attractive.
            </p>

            <h2 id="how-we-choose">How We Actually Choose</h2>
            <p>
              When a client comes to Cloud, we start with questions about their product, not their preferences about providers. What does the backend look like? What database? Are there background jobs? What are the traffic patterns? Is there a compliance requirement?
            </p>
            <p>
              The answers map almost mechanically to a provider recommendation. Frontend-only Next.js app with no complex backend: Vercel. Full-stack product, typical startup scale, cost matters: DigitalOcean. Enterprise workload, compliance requirements: AWS. Early-stage product that needs to go live fast: Railway.
            </p>
            <p>
              We don&rsquo;t have preferred partnerships. There&rsquo;s no kickback for recommending DigitalOcean over AWS. The recommendation comes from the product requirements.
            </p>

            <div className="art-divider" />

            <h2 id="bottom-line">The Bottom Line</h2>
            <p>
              Don&rsquo;t let "real companies use AWS" pressure you into unnecessary complexity. For most startups, it&rsquo;s the wrong starting point — it&rsquo;s more expensive, harder to manage, and you won&rsquo;t use the features that justify the premium.
            </p>
            <p>
              Start with DigitalOcean unless you have a clear technical reason not to. If your product outgrows it, migration is manageable. If you stay on it forever, that&rsquo;s fine — it runs serious production workloads at a price that doesn&rsquo;t punish you for growing.
            </p>
            <p>
              The provider is commodity infrastructure. What matters is what runs on top of it, and how well it&rsquo;s configured and maintained.
            </p>

          </article>
        </Reveal>
      </div>

      {/* Related articles */}
      <section className="art-related">
        <div className="art-related-inner">
          <Reveal>
            <div className="art-related-label">Keep reading</div>
            <h2 className="art-related-h2">Related articles</h2>
            <div className="art-related-grid">
              {RELATED.map((r, i) => (
                <Reveal key={r.slug} delay={i * 0.08}>
                  <Link href={`/cloud/blog/${r.slug}`} className="art-rel-card">
                    <div className="art-rel-cat">{r.cat}</div>
                    <div className="art-rel-title">{r.title}</div>
                    <div className="art-rel-read">{r.read} read</div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="art-cta">
        <Reveal>
          <div className="art-cta-label">Ready to choose?</div>
          <h2 className="art-cta-h2">Want us to choose for you?</h2>
          <p className="art-cta-sub">Tell us about your product and we&rsquo;ll recommend the right provider, plan, and setup — no guesswork required.</p>
          <div className="art-btns">
            <Link href="/cloud/get-hosted" className="art-btn-primary">
              Get Hosted <ArrowRight />
            </Link>
            <Link href="/cloud/plans" className="art-btn-ghost">See our plans</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
