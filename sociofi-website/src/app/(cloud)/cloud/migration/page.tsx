'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

const A = '#5BB5E0';
const F = {
  headline: "var(--font-display, 'Syne', sans-serif)",
  body: "var(--font-body, 'Outfit', sans-serif)",
  mono: "var(--font-mono, 'Fira Code', monospace)",
};

const STYLES = `
  .cm-page {
    background: var(--bg, #0C0C1D);
    color: var(--text-primary, #fff);
    min-height: 100vh;
    font-family: ${F.body};
  }

  /* ── Hero ── */
  .cm-hero {
    padding: 160px 32px 120px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cm-hero-inner {
    max-width: 780px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }
  .cm-label {
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
  .cm-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .cm-h1 {
    font-family: ${F.headline};
    font-size: clamp(2.6rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary, #fff);
    margin-bottom: 24px;
  }
  .cm-sub {
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary, #7C8DB0);
    max-width: 620px;
    margin: 0 auto;
  }
  .cm-hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
  }

  /* ── Section Base ── */
  .cm-section {
    padding: 100px 32px;
  }
  .cm-section-alt {
    background: var(--bg-2, #111128);
  }
  .cm-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .cm-sec-label {
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
  .cm-sec-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .cm-sec-h2 {
    font-family: ${F.headline};
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--text-primary, #fff);
    margin-bottom: 16px;
    text-align: center;
  }
  .cm-sec-desc {
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--text-secondary, #7C8DB0);
    max-width: 560px;
    margin: 0 auto;
    text-align: center;
  }

  /* ── Scenario Cards ── */
  .cm-scenarios {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 56px;
  }
  @media (max-width: 768px) {
    .cm-scenarios { grid-template-columns: 1fr; }
  }
  .cm-scenario {
    background: var(--bg-card, #13132B);
    border: 1px solid var(--border, rgba(91,181,224,0.08));
    border-radius: 20px;
    padding: 32px;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
  }
  .cm-scenario::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--navy, #3A589E), ${A});
    opacity: 0;
    transition: opacity 0.3s;
  }
  .cm-scenario:hover {
    border-color: ${A}30;
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  }
  .cm-scenario:hover::before {
    opacity: 1;
  }
  .cm-scenario-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: ${A}15;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${A};
    margin-bottom: 20px;
  }
  .cm-scenario-title {
    font-family: ${F.headline};
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary, #fff);
    margin-bottom: 10px;
    letter-spacing: -0.01em;
  }
  .cm-scenario-desc {
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--text-secondary, #7C8DB0);
  }

  /* ── Timeline (vertical, alternating) ── */
  .cm-timeline-wrap {
    margin-top: 56px;
    position: relative;
  }
  .cm-timeline-steps {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 960px;
    margin: 0 auto;
    position: relative;
  }
  .cm-timeline-center-line {
    position: absolute;
    left: 50%;
    top: 28px;
    bottom: 28px;
    width: 2px;
    background: linear-gradient(180deg, ${A}40, ${A}10);
    transform: translateX(-50%);
    pointer-events: none;
  }
  @media (max-width: 768px) {
    .cm-timeline-center-line { display: none; }
  }
  .cm-step {
    display: grid;
    grid-template-columns: 1fr 60px 1fr;
    gap: 0;
    align-items: start;
    min-height: 80px;
    padding: 12px 0;
  }
  .cm-step-left {
    padding-right: 28px;
    display: flex;
    justify-content: flex-end;
  }
  .cm-step-right {
    padding-left: 28px;
    display: flex;
    justify-content: flex-start;
  }
  .cm-step:nth-child(even) .cm-step-left { opacity: 0; pointer-events: none; }
  .cm-step:nth-child(odd) .cm-step-right { opacity: 0; pointer-events: none; }
  .cm-step-center-col {
    display: flex;
    justify-content: center;
    padding-top: 4px;
  }
  .cm-step-circle {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--bg-card, #13132B);
    border: 2px solid ${A};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${F.mono};
    font-size: 0.8rem;
    font-weight: 600;
    color: ${A};
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
  .cm-step-content {
    background: var(--bg-card, #13132B);
    border: 1px solid var(--border, rgba(91,181,224,0.08));
    border-radius: 16px;
    padding: 24px 28px;
    max-width: 380px;
    transition: border-color 0.3s;
  }
  .cm-step-content:hover {
    border-color: ${A}25;
  }
  .cm-step-day {
    font-family: ${F.mono};
    font-size: 0.68rem;
    color: ${A};
    margin-bottom: 8px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .cm-step-title {
    font-family: ${F.headline};
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary, #fff);
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }
  .cm-step-desc {
    font-size: 0.875rem;
    line-height: 1.65;
    color: var(--text-secondary, #7C8DB0);
  }

  /* Mobile timeline */
  @media (max-width: 768px) {
    .cm-step {
      grid-template-columns: 52px 1fr;
      grid-template-rows: auto;
    }
    .cm-step-left,
    .cm-step:nth-child(even) .cm-step-left,
    .cm-step:nth-child(odd) .cm-step-right { display: none; }
    .cm-step:nth-child(even) .cm-step-right,
    .cm-step:nth-child(odd) .cm-step-right {
      opacity: 1;
      pointer-events: auto;
      padding-left: 16px;
      justify-content: flex-start;
    }
    .cm-step-center-col {
      padding-top: 2px;
    }
    .cm-step-content {
      max-width: 100%;
    }
  }

  .cm-timeline-note-wrap {
    text-align: center;
    margin-top: 48px;
  }
  .cm-timeline-note {
    font-family: ${F.mono};
    font-size: 0.8rem;
    color: ${A};
    padding: 14px 24px;
    background: ${A}10;
    border-radius: 100px;
    display: inline-block;
    border: 1px solid ${A}20;
  }

  /* ── Pricing Cards ── */
  .cm-pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 48px;
  }
  @media (max-width: 900px) { .cm-pricing-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px) { .cm-pricing-grid { grid-template-columns: 1fr; } }
  .cm-price-card {
    background: var(--bg-card, #13132B);
    border: 1px solid var(--border, rgba(91,181,224,0.08));
    border-radius: 20px;
    padding: 32px;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    text-align: center;
  }
  .cm-price-card:hover {
    border-color: ${A}30;
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  }
  .cm-price-tier {
    font-family: ${F.headline};
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-secondary, #7C8DB0);
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cm-price-amount {
    font-family: ${F.headline};
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 800;
    color: ${A};
    line-height: 1;
    margin-bottom: 8px;
    letter-spacing: -0.03em;
  }
  .cm-price-desc {
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--text-secondary, #7C8DB0);
    margin-top: 12px;
  }
  .cm-price-note {
    margin-top: 36px;
    text-align: center;
    font-size: 0.875rem;
    color: var(--text-secondary, #7C8DB0);
    line-height: 1.6;
    padding: 20px 28px;
    background: ${A}08;
    border-radius: 12px;
    border: 1px solid ${A}15;
  }

  /* ── Quote ── */
  .cm-quote-wrap {
    max-width: 860px;
    margin: 0 auto;
    padding: 48px;
    background: var(--bg-card, #13132B);
    border: 1px solid var(--border, rgba(91,181,224,0.08));
    border-radius: 24px;
    position: relative;
  }
  .cm-quote-mark {
    position: absolute;
    top: 24px;
    left: 32px;
    font-family: ${F.headline};
    font-size: 6rem;
    font-weight: 800;
    line-height: 1;
    color: ${A};
    opacity: 0.12;
    pointer-events: none;
  }
  .cm-quote-text {
    font-size: 1.05rem;
    line-height: 1.75;
    color: var(--text-secondary, #7C8DB0);
    font-style: italic;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }
  .cm-quote-attr {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cm-quote-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--navy, #3A589E), ${A});
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${F.headline};
    font-size: 0.85rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .cm-quote-name {
    font-family: ${F.headline};
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary, #fff);
  }
  .cm-quote-role {
    font-family: ${F.mono};
    font-size: 0.72rem;
    color: ${A};
    margin-top: 2px;
  }

  /* ── CTA ── */
  .cm-cta-section {
    padding: 100px 32px;
    position: relative;
    overflow: hidden;
  }
  .cm-cta-inner {
    max-width: 620px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 2;
  }
  .cm-cta-h2 {
    font-family: ${F.headline};
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--text-primary, #fff);
    margin-bottom: 16px;
  }
  .cm-cta-desc {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary, #7C8DB0);
    margin-bottom: 36px;
  }
  .cm-cta-btns {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .cm-btn-primary {
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
  .cm-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(91,181,224,0.3);
  }
  .cm-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border: 1.5px solid var(--border, rgba(91,181,224,0.15));
    color: var(--text-primary, #fff);
    border-radius: 100px;
    font-family: ${F.headline};
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    letter-spacing: -0.01em;
    background: transparent;
  }
  .cm-btn-ghost:hover {
    border-color: ${A};
    color: ${A};
  }
  .cm-cta-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }
`;

// ── SVG Icons ────────────────────────────────────────────────────────────────
function IconDollar({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function IconZap({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconRefresh({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4" />
    </svg>
  );
}

function IconTrendingUp({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconArrowRight({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    title: 'Your hosting is too expensive',
    desc: 'We audit, optimize, and often reduce costs by 30–50%.',
    icon: <IconDollar size={20} color={A} />,
  },
  {
    title: 'Your hosting is too complicated',
    desc: 'AWS console giving you nightmares? We simplify.',
    icon: <IconZap size={20} color={A} />,
  },
  {
    title: 'Your provider is shutting down or changing pricing',
    desc: "We've migrated clients off Heroku, Render, and providers that changed terms overnight.",
    icon: <IconRefresh size={20} color={A} />,
  },
  {
    title: "You need to scale and don't know how",
    desc: "Your current setup can't handle growth. We migrate to an architecture that scales.",
    icon: <IconTrendingUp size={20} color={A} />,
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Assessment',
    day: 'Day 1',
    desc: "We audit your current infrastructure — what's running, where, how it's configured, what needs to change. We produce a complete map of your stack.",
  },
  {
    num: '02',
    title: 'Planning',
    day: 'Day 1–2',
    desc: "We design the target architecture. Choose the right provider. Map every service, database, and configuration that needs to move.",
  },
  {
    num: '03',
    title: 'Parallel Build',
    day: 'Day 2–4',
    desc: "We build the new infrastructure alongside your existing setup. Nothing changes for your customers yet.",
  },
  {
    num: '04',
    title: 'Data Migration',
    day: 'Day 4–5',
    desc: "Databases, file storage, environment configuration — migrated with verification checksums. Every record accounted for.",
  },
  {
    num: '05',
    title: 'Testing',
    day: 'Day 5–6',
    desc: "Full testing on the new infrastructure. Performance, functionality, security. Side-by-side comparison with the old setup.",
  },
  {
    num: '06',
    title: 'Switchover',
    day: 'Day 6–7',
    desc: "DNS switch to the new infrastructure. Zero-downtime cutover. Old infrastructure kept on standby for 7 days as rollback safety net.",
  },
];

const PRICING = [
  {
    tier: 'Simple Migration',
    amount: '$499',
    desc: 'Single server, single database',
  },
  {
    tier: 'Standard Migration',
    amount: '$999',
    desc: 'Multi-service, database + cache',
  },
  {
    tier: 'Complex Migration',
    amount: '$1,999–3,999',
    desc: 'Multi-region, enterprise, large databases',
  },
];

// ── Animated Step ─────────────────────────────────────────────────────────────
function TimelineStep({ step, index, inView }: { step: typeof STEPS[0]; index: number; inView: boolean }) {
  const isOdd = index % 2 === 0; // 0-indexed: 0,2,4 go left

  return (
    <motion.div
      className="cm-step"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left slot */}
      <div className="cm-step-left">
        {isOdd && (
          <div className="cm-step-content">
            <div className="cm-step-day">{step.day}</div>
            <div className="cm-step-title">{step.title}</div>
            <div className="cm-step-desc">{step.desc}</div>
          </div>
        )}
      </div>

      {/* Center circle */}
      <div className="cm-step-center-col">
        <div className="cm-step-circle">{step.num}</div>
      </div>

      {/* Right slot */}
      <div className="cm-step-right">
        {!isOdd && (
          <div className="cm-step-content">
            <div className="cm-step-day">{step.day}</div>
            <div className="cm-step-title">{step.title}</div>
            <div className="cm-step-desc">{step.desc}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CloudMigrationPage() {
  const scenariosRef = useRef(null);
  const timelineRef = useRef(null);
  const pricingRef = useRef(null);
  const quoteRef = useRef(null);
  const scenariosInView = useInView(scenariosRef, { once: true, margin: '-80px' });
  const timelineInView = useInView(timelineRef, { once: true, margin: '-80px' });
  const pricingInView = useInView(pricingRef, { once: true, margin: '-80px' });
  const quoteInView = useInView(quoteRef, { once: true, margin: '-80px' });

  return (
    <>
      <style>{STYLES}</style>
      <div className="cm-page">

        {/* ── Hero ── */}
        <section className="cm-hero">
          <div className="cm-hero-orb" style={{ width: 700, height: 700, background: `${A}15`, top: -300, left: '50%', transform: 'translateX(-50%)' }} />
          <div className="cm-hero-orb" style={{ width: 300, height: 300, background: '#4DBFA820', bottom: 0, right: '5%' }} />

          <div className="cm-hero-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="cm-label">Migration</div>
            </motion.div>

            <motion.h1
              className="cm-h1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Already Hosted Somewhere? We&apos;ll Move You. Zero Downtime.
            </motion.h1>

            <motion.p
              className="cm-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Whether you&apos;re on Heroku, a random VPS, AWS you can&apos;t manage, or hosting you&apos;ve outgrown — we migrate everything to a setup that works. No data loss. No downtime. No panic.
            </motion.p>
          </div>
        </section>

        {/* ── When to Migrate ── */}
        <section className="cm-section cm-section-alt">
          <div className="cm-container">
            <div className="cm-sec-label">When to migrate</div>
            <h2 className="cm-sec-h2">Four signs it&apos;s time to move.</h2>
            <p className="cm-sec-desc">Any of these sound familiar? You&apos;re not stuck — you just need the right team.</p>

            <motion.div
              ref={scenariosRef}
              className="cm-scenarios"
              initial={{ opacity: 0 }}
              animate={scenariosInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
            >
              {SCENARIOS.map((s, i) => (
                <motion.div
                  key={i}
                  className="cm-scenario"
                  initial={{ opacity: 0, y: 28 }}
                  animate={scenariosInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="cm-scenario-icon">{s.icon}</div>
                  <div className="cm-scenario-title">{s.title}</div>
                  <div className="cm-scenario-desc">{s.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── 6-Step Process ── */}
        <section className="cm-section">
          <div className="cm-container">
            <div className="cm-sec-label">Migration process</div>
            <h2 className="cm-sec-h2">Six steps. One week. Done.</h2>
            <p className="cm-sec-desc">A proven process we&apos;ve run dozens of times. Predictable, documented, zero surprises.</p>

            <div className="cm-timeline-wrap" ref={timelineRef}>
              <div className="cm-timeline-center-line" />
              <div className="cm-timeline-steps">
                {STEPS.map((step, i) => (
                  <TimelineStep key={step.num} step={step} index={i} inView={timelineInView} />
                ))}
              </div>
            </div>

            <div className="cm-timeline-note-wrap">
              <span className="cm-timeline-note">Total migration time: 5–7 business days for most products.</span>
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="cm-section cm-section-alt">
          <div className="cm-container">
            <div className="cm-sec-label">Pricing</div>
            <h2 className="cm-sec-h2">Migration is a one-time service.</h2>
            <p className="cm-sec-desc">Pay once for the migration. Then keep us on for ongoing cloud management.</p>

            <motion.div
              ref={pricingRef}
              className="cm-pricing-grid"
              initial={{ opacity: 0 }}
              animate={pricingInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
            >
              {PRICING.map((p, i) => (
                <motion.div
                  key={i}
                  className="cm-price-card"
                  initial={{ opacity: 0, y: 28 }}
                  animate={pricingInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="cm-price-tier">{p.tier}</div>
                  <div className="cm-price-amount">{p.amount}</div>
                  <div className="cm-price-desc">{p.desc}</div>
                </motion.div>
              ))}
            </motion.div>

            <div className="cm-price-note">
              Migration cost is credited to your first 3 months of Cloud management.
            </div>
          </div>
        </section>

        {/* ── CTO Quote ── */}
        <section className="cm-section">
          <div className="cm-container">
            <motion.div
              ref={quoteRef}
              className="cm-quote-wrap"
              initial={{ opacity: 0, y: 30 }}
              animate={quoteInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="cm-quote-mark">&ldquo;</div>
              <p className="cm-quote-text">
                The scariest part of migration is data. Will anything get lost? Will the database be corrupted? That&apos;s why we run checksums on every table, verify row counts, and keep the old infrastructure running for a full week after switchover. Belt, suspenders, and a safety net.
              </p>
              <div className="cm-quote-attr">
                <div className="cm-quote-avatar">KH</div>
                <div>
                  <div className="cm-quote-name">Kamrul Hasan</div>
                  <div className="cm-quote-role">CTO, SocioFi Technology</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cm-cta-section cm-section-alt">
          <div className="cm-cta-orb" style={{ width: 500, height: 500, background: `${A}15`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          <div className="cm-cta-inner">
            <div className="cm-sec-label" style={{ justifyContent: 'center' }}>Get Moving</div>
            <h2 className="cm-cta-h2">Tell us where you&apos;re hosted now. We&apos;ll tell you what a migration looks like.</h2>
            <p className="cm-cta-desc">Free assessment. We scope the work, estimate the timeline, and give you a firm price before anything starts.</p>
            <div className="cm-cta-btns">
              <Link href="/cloud/get-hosted" className="cm-btn-primary">
                Request Migration Assessment
                <IconArrowRight size={16} color="#fff" />
              </Link>
              <Link href="/cloud/plans" className="cm-btn-ghost">
                See Cloud Plans
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
