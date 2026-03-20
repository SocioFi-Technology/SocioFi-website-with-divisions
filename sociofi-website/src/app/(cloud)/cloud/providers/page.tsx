'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

const A = '#5BB5E0';
const F = {
  headline: "var(--font-display, 'Syne', sans-serif)",
  body: "var(--font-body, 'Outfit', sans-serif)",
  mono: "var(--font-mono, 'Fira Code', monospace)",
};

const STYLES = `
  .cpv-page {
    background: var(--bg, #0C0C1D);
    color: var(--text-primary, #fff);
    min-height: 100vh;
    font-family: ${F.body};
  }

  /* ── Hero ── */
  .cpv-hero {
    padding: 160px 32px 120px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cpv-hero-inner {
    max-width: 760px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }
  .cpv-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: ${F.mono};
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 24px;
  }
  .cpv-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .cpv-h1 {
    font-family: ${F.headline};
    font-size: clamp(2.6rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary, #fff);
    margin-bottom: 24px;
  }
  .cpv-sub {
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary, #7C8DB0);
    max-width: 600px;
    margin: 0 auto;
  }
  .cpv-hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
  }

  /* ── Section Base ── */
  .cpv-section {
    padding: 100px 32px;
  }
  .cpv-section-alt {
    background: var(--bg-2, #111128);
  }
  .cpv-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .cpv-sec-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: ${F.mono};
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 14px;
  }
  .cpv-sec-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .cpv-sec-h2 {
    font-family: ${F.headline};
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--text-primary, #fff);
    margin-bottom: 16px;
    text-align: center;
  }
  .cpv-sec-desc {
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--text-secondary, #7C8DB0);
    max-width: 560px;
    margin: 0 auto;
    text-align: center;
  }

  /* ── Provider Cards (stacked full-width, alternating) ── */
  .cpv-providers {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 56px;
  }
  .cpv-provider-card {
    background: var(--bg-card, #13132B);
    border: 1px solid var(--border, rgba(91,181,224,0.08));
    border-radius: 24px;
    padding: 44px 48px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: start;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
  }
  .cpv-provider-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--navy, #3A589E), ${A});
    opacity: 0;
    transition: opacity 0.3s;
  }
  .cpv-provider-card:hover {
    border-color: ${A}25;
    box-shadow: 0 24px 60px rgba(0,0,0,0.2);
  }
  .cpv-provider-card:hover::before {
    opacity: 1;
  }
  /* Reverse layout for even cards */
  .cpv-provider-card.cpv-reverse {
    direction: rtl;
  }
  .cpv-provider-card.cpv-reverse > * {
    direction: ltr;
  }
  @media (max-width: 900px) {
    .cpv-provider-card,
    .cpv-provider-card.cpv-reverse {
      grid-template-columns: 1fr;
      direction: ltr;
      padding: 32px 28px;
      gap: 28px;
    }
  }

  /* Card left: identity */
  .cpv-provider-identity {}
  .cpv-provider-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: ${F.mono};
    font-size: 0.65rem;
    font-weight: 600;
    color: ${A};
    background: ${A}15;
    border: 1px solid ${A}25;
    border-radius: 100px;
    padding: 4px 12px;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .cpv-provider-name {
    font-family: ${F.headline};
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    color: var(--text-primary, #fff);
    margin-bottom: 6px;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .cpv-provider-tagline {
    font-family: ${F.mono};
    font-size: 0.78rem;
    color: ${A};
    margin-bottom: 20px;
    letter-spacing: 0.04em;
  }
  .cpv-provider-desc {
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-secondary, #7C8DB0);
    margin-bottom: 24px;
  }
  .cpv-tech-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }
  .cpv-tech-badge {
    font-family: ${F.mono};
    font-size: 0.7rem;
    padding: 5px 12px;
    border-radius: 6px;
    background: var(--bg-3, #161636);
    border: 1px solid var(--border, rgba(91,181,224,0.08));
    color: var(--text-secondary, #7C8DB0);
  }
  .cpv-cost-range {
    font-family: ${F.headline};
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary, #fff);
  }
  .cpv-cost-label {
    font-size: 0.78rem;
    color: var(--text-muted, #4A5578);
    margin-top: 2px;
  }

  /* Card right: strengths + usage */
  .cpv-provider-meta {}
  .cpv-strengths-title {
    font-family: ${F.headline};
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-muted, #4A5578);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 14px;
  }
  .cpv-bullets {
    list-style: none;
    padding: 0;
    margin: 0 0 32px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .cpv-bullet {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--text-secondary, #7C8DB0);
  }
  .cpv-bullet-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${A};
    flex-shrink: 0;
    margin-top: 7px;
  }

  /* Usage bar */
  .cpv-usage-label {
    font-family: ${F.mono};
    font-size: 0.72rem;
    color: var(--text-muted, #4A5578);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .cpv-usage-pct {
    color: ${A};
    font-weight: 600;
  }
  .cpv-usage-track {
    height: 6px;
    border-radius: 3px;
    background: var(--bg-3, #161636);
    overflow: hidden;
  }
  .cpv-usage-fill {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--navy, #3A589E), ${A});
    transition: width 1s cubic-bezier(0.16,1,0.3,1);
  }

  /* Recommended badge override */
  .cpv-badge-recommended {
    background: linear-gradient(135deg, var(--navy, #3A589E), ${A});
    color: #fff;
    border-color: transparent;
  }

  /* ── Decision Tree ── */
  .cpv-tree {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-top: 48px;
  }
  @media (max-width: 700px) {
    .cpv-tree { grid-template-columns: 1fr; }
  }
  .cpv-tree-item {
    background: var(--bg-card, #13132B);
    border: 1px solid var(--border, rgba(91,181,224,0.08));
    border-radius: 14px;
    padding: 20px 24px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    transition: all 0.3s;
    cursor: default;
  }
  .cpv-tree-item:hover {
    border-color: ${A}25;
    transform: translateY(-2px);
  }
  .cpv-tree-q {
    font-size: 0.88rem;
    line-height: 1.5;
    color: var(--text-secondary, #7C8DB0);
    flex: 1;
  }
  .cpv-tree-arrow {
    flex-shrink: 0;
    color: ${A};
    opacity: 0.6;
    margin-top: 2px;
  }
  .cpv-tree-a {
    font-family: ${F.headline};
    font-size: 0.88rem;
    font-weight: 700;
    color: ${A};
    white-space: nowrap;
    flex-shrink: 0;
  }
  .cpv-tree-note {
    text-align: center;
    margin-top: 32px;
    font-size: 0.9rem;
    color: var(--text-secondary, #7C8DB0);
    line-height: 1.6;
  }

  /* ── CTA ── */
  .cpv-cta-section {
    padding: 100px 32px;
    position: relative;
    overflow: hidden;
  }
  .cpv-cta-inner {
    max-width: 560px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 2;
  }
  .cpv-cta-h2 {
    font-family: ${F.headline};
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--text-primary, #fff);
    margin-bottom: 16px;
  }
  .cpv-cta-desc {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary, #7C8DB0);
    margin-bottom: 36px;
  }
  .cpv-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: linear-gradient(135deg, var(--navy, #3A589E), ${A});
    color: #fff;
    border-radius: 100px;
    font-family: ${F.headline};
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    letter-spacing: -0.01em;
  }
  .cpv-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(91,181,224,0.3);
  }
  .cpv-cta-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
`;

// ── SVG Icons ────────────────────────────────────────────────────────────────
function IconArrowRight({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconChevronRight({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconStar({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const PROVIDERS = [
  {
    name: 'Vercel',
    tagline: 'Frontend-first products, Next.js apps, JAMstack',
    desc: "If your product is built with Next.js (most of our Studio projects are), Vercel is the simplest, fastest option. Automatic deployments, edge caching, serverless functions, and a developer experience that's hard to beat. For products that don't need a complex backend, this is our default recommendation.",
    strengths: [
      'Automatic deploys on every push',
      'Global edge network for fast load times',
      'Zero-config SSL certificates',
      'Image optimization built in',
      'Preview environments per pull request',
    ],
    badges: ['Landing pages', 'Marketing sites', 'Simple SaaS', 'Content platforms'],
    cost: '$0–50/mo',
    costLabel: 'Typical hosting cost',
    usage: 25,
    usageLabel: 'We use for 25% of clients',
    recommended: false,
    reverse: false,
  },
  {
    name: 'DigitalOcean',
    tagline: 'Most full-stack products — the balanced choice',
    desc: "DigitalOcean is our most-recommended provider. It strikes the perfect balance between simplicity and capability. Droplets for compute, managed databases, spaces for storage, app platform for containers. Costs about 40% less than AWS for equivalent performance.",
    strengths: [
      'Simple, predictable pricing',
      'Managed databases (no ops overhead)',
      'Reliable performance and uptime',
      'Excellent API for automation',
      'Strong community and documentation',
    ],
    badges: ['Web apps', 'SaaS', 'Internal tools', 'API backends', 'Growing products'],
    cost: '$48–300/mo',
    costLabel: 'Typical monthly cost',
    usage: 45,
    usageLabel: 'We use for 45% of clients',
    recommended: true,
    reverse: true,
  },
  {
    name: 'AWS',
    tagline: 'Complex architectures, enterprise compliance, specific AWS services',
    desc: "AWS when you genuinely need it — not because someone told you 'real companies use AWS.' We recommend AWS when you need RDS Aurora, Lambda at scale, SQS/SNS event systems, S3 for massive storage, or specific compliance certifications.",
    strengths: [
      'Massive service catalog for every use case',
      'Global regions and availability zones',
      'Enterprise compliance certifications',
      'Mature, battle-tested ecosystem',
    ],
    badges: ['Enterprise', 'Regulated industries', 'Event-driven architectures', 'Massive scale'],
    cost: '$100–2,000+/mo',
    costLabel: 'Typical monthly cost',
    usage: 15,
    usageLabel: 'We use for 15% of clients',
    recommended: false,
    reverse: false,
  },
  {
    name: 'Railway',
    tagline: 'Quick launches, early-stage products, container-based',
    desc: "Railway is the modern replacement for Heroku. If you need to deploy quickly, experiment fast, and don't need enterprise features yet, Railway gets your product live in minutes.",
    strengths: [
      'Fastest deploy experience available',
      'Simple, usage-based pricing',
      'Native GitHub integration',
      'Great for prototypes and MVPs',
    ],
    badges: ['MVPs', 'Proof of concepts', 'Small APIs', 'Early-stage products'],
    cost: '$5–50/mo',
    costLabel: 'Typical monthly cost',
    usage: 10,
    usageLabel: 'We use for 10% of clients',
    recommended: false,
    reverse: true,
  },
  {
    name: 'Hetzner',
    tagline: 'Cost-optimized compute, European data residency',
    desc: "Hetzner offers the best price-to-performance ratio in the industry. If your product needs raw compute power and you don't need managed services, or if you need EU data residency for GDPR compliance, Hetzner is the answer.",
    strengths: [
      'Exceptional pricing (50–80% cheaper than AWS)',
      'EU data centers for GDPR compliance',
      'Powerful hardware at low cost',
      'Good for compute-heavy workloads',
    ],
    badges: ['Budget-conscious', 'Compute-heavy', 'EU data requirements', 'Batch processing'],
    cost: '$5–100/mo',
    costLabel: 'Typical monthly cost',
    usage: 5,
    usageLabel: 'We use for 5% of clients',
    recommended: false,
    reverse: false,
  },
];

const DECISION_TREE = [
  { q: 'Is your product built with Next.js?', a: 'Vercel or DigitalOcean' },
  { q: 'Do you need enterprise compliance (SOC 2, HIPAA)?', a: 'AWS' },
  { q: 'Is budget your primary concern?', a: 'Hetzner or Railway' },
  { q: 'Do you need a managed database?', a: 'DigitalOcean or AWS' },
  { q: 'Are you launching fast and iterating?', a: 'Railway or Vercel' },
  { q: "None of the above?", a: 'DigitalOcean' },
];

// ── Animated Provider Card ────────────────────────────────────────────────────
function ProviderCard({ provider, index }: { provider: typeof PROVIDERS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [barReady, setBarReady] = useState(false);

  return (
    <motion.div
      ref={ref}
      className={`cpv-provider-card${provider.reverse ? ' cpv-reverse' : ''}`}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => setBarReady(true)}
    >
      {/* Identity column */}
      <div className="cpv-provider-identity">
        {provider.recommended && (
          <div className="cpv-provider-badge cpv-badge-recommended">
            <IconStar size={10} color="#fff" />
            Our Most Recommended
          </div>
        )}
        {!provider.recommended && <div style={{ height: 28 }} />}
        <div className="cpv-provider-name">{provider.name}</div>
        <div className="cpv-provider-tagline">Best for: {provider.tagline}</div>
        <p className="cpv-provider-desc">{provider.desc}</p>
        <div className="cpv-tech-badges">
          {provider.badges.map((b, i) => (
            <span key={i} className="cpv-tech-badge">{b}</span>
          ))}
        </div>
        <div className="cpv-cost-range">{provider.cost}</div>
        <div className="cpv-cost-label">{provider.costLabel}</div>
      </div>

      {/* Meta column */}
      <div className="cpv-provider-meta">
        <div className="cpv-strengths-title">Strengths</div>
        <ul className="cpv-bullets">
          {provider.strengths.map((s, i) => (
            <li key={i} className="cpv-bullet">
              <span className="cpv-bullet-dot" />
              <span>{s}</span>
            </li>
          ))}
        </ul>

        {/* Usage bar */}
        <div className="cpv-usage-label">
          <span>{provider.usageLabel}</span>
          <span className="cpv-usage-pct">{provider.usage}%</span>
        </div>
        <div className="cpv-usage-track">
          <div
            className="cpv-usage-fill"
            style={{ width: barReady ? `${provider.usage}%` : '0%' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CloudProvidersPage() {
  const treeRef = useRef(null);
  const treeInView = useInView(treeRef, { once: true, margin: '-80px' });

  return (
    <>
      <style>{STYLES}</style>
      <div className="cpv-page">

        {/* ── Hero ── */}
        <section className="cpv-hero">
          <div className="cpv-hero-orb" style={{ width: 700, height: 700, background: `${A}15`, top: -300, left: '50%', transform: 'translateX(-50%)' }} />
          <div className="cpv-hero-orb" style={{ width: 300, height: 300, background: '#7B6FE820', top: 120, right: '8%' }} />

          <div className="cpv-hero-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="cpv-label">Providers</div>
            </motion.div>

            <motion.h1
              className="cpv-h1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              We Work With the Best. We Recommend What Fits.
            </motion.h1>

            <motion.p
              className="cpv-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              SocioFi Cloud isn&apos;t tied to one provider. We choose the right infrastructure for your product&apos;s needs and your budget. Here&apos;s who we work with and when.
            </motion.p>
          </div>
        </section>

        {/* ── Provider Cards ── */}
        <section className="cpv-section">
          <div className="cpv-container">
            <div className="cpv-sec-label">Infrastructure partners</div>
            <h2 className="cpv-sec-h2">Five providers. One team that knows them all.</h2>
            <p className="cpv-sec-desc">We&apos;ve deployed production workloads on all of these. No learning curve — just the right choice for your product.</p>

            <div className="cpv-providers">
              {PROVIDERS.map((provider, i) => (
                <ProviderCard key={provider.name} provider={provider} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Decision Helper ── */}
        <section className="cpv-section cpv-section-alt">
          <div className="cpv-container">
            <div className="cpv-sec-label">Decision guide</div>
            <h2 className="cpv-sec-h2">Not sure which provider is right?</h2>
            <p className="cpv-sec-desc">A quick reference. For anything more complex, we&apos;ll just tell you directly.</p>

            <motion.div
              ref={treeRef}
              className="cpv-tree"
              initial={{ opacity: 0 }}
              animate={treeInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
            >
              {DECISION_TREE.map((item, i) => (
                <motion.div
                  key={i}
                  className="cpv-tree-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={treeInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="cpv-tree-q">{item.q}</span>
                  <span className="cpv-tree-arrow">
                    <IconChevronRight size={14} color={A} />
                  </span>
                  <span className="cpv-tree-a">{item.a}</span>
                </motion.div>
              ))}
            </motion.div>

            <p className="cpv-tree-note">
              Or just ask us. We&apos;ll recommend based on your actual product, not a quiz.
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cpv-cta-section">
          <div className="cpv-cta-orb" style={{ width: 500, height: 500, background: `${A}15`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          <div className="cpv-cta-inner">
            <div className="cpv-sec-label" style={{ justifyContent: 'center' }}>Get a Recommendation</div>
            <h2 className="cpv-cta-h2">Tell us about your product. We&apos;ll tell you where it should live.</h2>
            <p className="cpv-cta-desc">Free assessment. No pitch, no pressure. We&apos;ll look at your stack and give you a straight answer on where to host and what it&apos;ll cost.</p>
            <Link href="/cloud/get-hosted" className="cpv-btn-primary">
              Get a Recommendation
              <IconArrowRight size={16} color="#fff" />
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
