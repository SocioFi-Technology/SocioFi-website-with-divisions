'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// ── Design tokens ──────────────────────────────────────────────────────────────
const A = '#6BA3E8';
const F = {
  h: "var(--font-display,'Syne'),sans-serif",
  b: "var(--font-body,'Outfit'),sans-serif",
  m: "var(--font-mono,'Fira Code'),monospace",
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const STYLES = `
  .port-page { background: var(--bg); min-height: 100vh; }

  @keyframes port-orb-drift {
    0%, 100% { transform: translate(0,0); }
    50% { transform: translate(-25px, 18px); }
  }
  @keyframes port-card-breathe {
    0%, 100% { transform: scale(0.99); }
    50% { transform: scale(1.01); }
  }
  @keyframes port-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }

  /* ── Hero ── */
  .port-hero {
    padding: 120px 32px 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .port-hero-inner { max-width: 740px; margin: 0 auto; position: relative; z-index: 2; }
  .port-hero-orb {
    position: absolute; border-radius: 50%; filter: blur(120px);
    pointer-events: none; z-index: 0;
  }
  .port-hero-orb-1 {
    width: 650px; height: 650px; background: rgba(107,163,232,0.06);
    top: -240px; left: 50%; transform: translateX(-50%);
    animation: port-orb-drift 13s ease-in-out infinite;
  }
  .port-hero-orb-2 {
    width: 400px; height: 400px; background: rgba(89,163,146,0.04);
    bottom: -100px; right: -100px;
    animation: port-orb-drift 16s ease-in-out infinite reverse;
  }
  .port-hero-label {
    font-family: ${F.m}; font-size: 0.7rem; font-weight: 500; color: ${A};
    letter-spacing: 0.14em; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 10px; margin-bottom: 24px;
  }
  .port-hero-label::before, .port-hero-label::after {
    content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block;
  }
  .port-hero-title {
    font-family: ${F.h}; font-size: clamp(2rem, 4vw, 3rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.03em; line-height: 1.1;
    margin-bottom: 20px;
  }
  .port-hero-sub {
    font-family: ${F.b}; font-size: 1.05rem; color: var(--text-secondary);
    line-height: 1.75; max-width: 600px; margin: 0 auto;
  }

  /* ── Empty state section ── */
  .port-empty {
    padding: 60px 32px 80px;
    max-width: 1000px; margin: 0 auto;
  }
  .port-empty-header { text-align: center; margin-bottom: 48px; }
  .port-empty-title {
    font-family: ${F.h}; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.025em; margin-bottom: 14px;
  }
  .port-empty-body {
    font-family: ${F.b}; font-size: 1rem; color: var(--text-secondary);
    line-height: 1.75; max-width: 600px; margin: 0 auto;
  }

  /* ── Placeholder cards ── */
  .port-placeholder-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
    margin-bottom: 40px;
  }
  .port-placeholder-card {
    border: 1.5px dashed rgba(107,163,232,0.3);
    border-radius: 20px; padding: 32px 28px;
    background: rgba(107,163,232,0.02);
    animation: port-card-breathe 3s ease-in-out infinite;
    display: flex; flex-direction: column; gap: 16px;
    min-height: 240px;
  }
  .port-placeholder-card:nth-child(2) { animation-delay: 1s; }
  .port-placeholder-card:nth-child(3) { animation-delay: 2s; }
  .port-placeholder-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(107,163,232,0.08); border: 1.5px dashed rgba(107,163,232,0.25);
    display: flex; align-items: center; justify-content: center;
  }
  .port-placeholder-title {
    font-family: ${F.h}; font-size: 1rem; font-weight: 700;
    color: var(--text-muted);
  }
  .port-placeholder-badge {
    display: inline-flex; align-items: center;
    background: rgba(107,163,232,0.06); border: 1px dashed rgba(107,163,232,0.2);
    border-radius: 100px; padding: 4px 12px;
    font-family: ${F.m}; font-size: 0.62rem; color: var(--text-muted);
    letter-spacing: 0.06em; text-transform: uppercase; width: fit-content;
  }
  .port-placeholder-lines { display: flex; flex-direction: column; gap: 6px; flex: 1; }
  .port-placeholder-line {
    height: 8px; border-radius: 4px;
    background: rgba(107,163,232,0.08); animation: port-pulse 2.5s ease-in-out infinite;
  }
  .port-placeholder-line:nth-child(2) { animation-delay: 0.4s; width: 75%; }
  .port-placeholder-line:nth-child(3) { animation-delay: 0.8s; width: 55%; }
  .port-placeholder-link {
    font-family: ${F.h}; font-size: 0.82rem; font-weight: 600;
    color: ${A}; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
    margin-top: auto; transition: gap 0.2s;
  }
  .port-placeholder-link:hover { gap: 10px; }

  .port-cohort-note {
    text-align: center;
    font-family: ${F.b}; font-size: 0.95rem; color: var(--text-secondary);
    line-height: 1.6;
  }
  .port-cohort-note strong { color: var(--text-primary); font-weight: 600; }

  /* ── Ecosystem perks ── */
  .port-perks-section {
    padding: 80px 32px;
    background: var(--bg-2);
  }
  .port-perks-inner { max-width: 900px; margin: 0 auto; }
  .port-perks-label {
    font-family: ${F.m}; font-size: 0.7rem; font-weight: 500; color: ${A};
    letter-spacing: 0.14em; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }
  .port-perks-label::before {
    content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block;
  }
  .port-perks-title {
    font-family: ${F.h}; font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.025em; margin-bottom: 40px;
  }
  .port-perks-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
  .port-perk-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px;
    transition: border-color 0.3s, transform 0.3s;
  }
  .port-perk-card:hover { border-color: rgba(107,163,232,0.25); transform: translateY(-3px); }
  .port-perk-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
  }
  .port-perk-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .port-perk-division {
    font-family: ${F.m}; font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .port-perk-desc {
    font-family: ${F.b}; font-size: 0.88rem; color: var(--text-secondary);
    line-height: 1.6;
  }

  /* ── CTA section ── */
  .port-cta {
    padding: 80px 32px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .port-cta-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(107,163,232,0.08), transparent);
  }
  .port-cta-inner { max-width: 600px; margin: 0 auto; position: relative; z-index: 2; }
  .port-cta-title {
    font-family: ${F.h}; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.025em; margin-bottom: 14px;
  }
  .port-cta-sub {
    font-family: ${F.b}; font-size: 1rem; color: var(--text-secondary);
    line-height: 1.75; margin-bottom: 32px;
  }
  .port-cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .port-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 12px;
    background: linear-gradient(135deg, #3A589E, ${A});
    color: white; font-family: ${F.h}; font-size: 0.9rem; font-weight: 600;
    text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(107,163,232,0.35);
  }
  .port-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(107,163,232,0.5); }
  .port-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px; border-radius: 12px;
    border: 1.5px solid var(--border); background: transparent;
    color: var(--text-primary); font-family: ${F.h}; font-size: 0.9rem; font-weight: 600;
    text-decoration: none; transition: all 0.2s;
  }
  .port-btn-ghost:hover { border-color: ${A}; color: ${A}; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .port-hero { padding: 100px 20px 60px; }
    .port-empty { padding: 40px 20px 60px; }
    .port-placeholder-grid { grid-template-columns: 1fr; gap: 14px; }
    .port-perks-section { padding: 60px 20px; }
    .port-cta { padding: 60px 20px; }
  }
  @media (max-width: 480px) {
    .port-cta-row { flex-direction: column; align-items: stretch; }
    .port-btn-primary, .port-btn-ghost { justify-content: center; }
  }
`;

// ── Perk icons (inline SVG) ────────────────────────────────────────────────────
function CodeIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M6 5l-4 4 4 4M12 5l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ZapIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M10 2L4 10h5l-1 6 6-8h-5l1-6z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CloudIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M13 14H5a3 3 0 0 1 0-6 4 4 0 0 1 8 1 2.5 2.5 0 0 1 0 5z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ShieldIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2l6 2.5v4.5c0 3.5-2.5 6.5-6 8-3.5-1.5-6-4.5-6-8V4.5L9 2z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BookIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 3h10a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 3v12M7 8h5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function PlaceholderBuildIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="16" height="16" rx="4" stroke="rgba(107,163,232,0.35)" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M11 7v8M7 11h8" stroke="rgba(107,163,232,0.4)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Perk data ──────────────────────────────────────────────────────────────────
const PERKS = [
  {
    icon: <CodeIcon color="#72C4B2" />,
    iconBg: 'rgba(114,196,178,0.1)',
    division: 'Studio',
    divisionColor: '#72C4B2',
    desc: 'Priority queue for feature development — your product requests jump ahead of general pipeline.',
  },
  {
    icon: <ZapIcon color="#7B6FE8" />,
    iconBg: 'rgba(123,111,232,0.1)',
    division: 'Agents',
    divisionColor: '#7B6FE8',
    desc: 'Partner pricing on AI agent subscriptions — access our full agent stack at founder rates.',
  },
  {
    icon: <CloudIcon color="#5BB5E0" />,
    iconBg: 'rgba(91,181,224,0.1)',
    division: 'Cloud',
    divisionColor: '#5BB5E0',
    desc: '6 months free managed hosting — deployment, scaling, and infrastructure handled at no cost.',
  },
  {
    icon: <ShieldIcon color="#4DBFA8" />,
    iconBg: 'rgba(77,191,168,0.1)',
    division: 'Services',
    divisionColor: '#4DBFA8',
    desc: '3 months free maintenance — bug fixes, security updates, and uptime monitoring included.',
  },
  {
    icon: <BookIcon color="#E8B84D" />,
    iconBg: 'rgba(232,184,77,0.1)',
    division: 'Academy',
    divisionColor: '#E8B84D',
    desc: 'All founder courses included — product strategy, fundraising, growth, and technical literacy.',
  },
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } };
  const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

  return (
    <>
      <style>{STYLES}</style>
      <main className="port-page">

        {/* ── Hero ── */}
        <section className="port-hero">
          <div className="port-hero-orb port-hero-orb-1" aria-hidden="true" />
          <div className="port-hero-orb port-hero-orb-2" aria-hidden="true" />
          <motion.div
            className="port-hero-inner"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div className="port-hero-label" variants={fadeUp}>
              Portfolio
            </motion.div>
            <motion.h1 className="port-hero-title" variants={fadeUp}>
              Companies We&apos;ve Built With.
            </motion.h1>
            <motion.p className="port-hero-sub" variants={fadeUp}>
              Every company here was built through Ventures — SocioFi invested development capacity in exchange for equity or revenue share.
            </motion.p>
          </motion.div>
        </section>

        {/* ── Empty state ── */}
        <motion.section
          className="port-empty"
          initial="hidden"
          animate="visible"
          variants={{ ...stagger, hidden: { opacity: 1 } }}
        >
          <motion.div className="port-empty-header" variants={fadeUp}>
            <h2 className="port-empty-title">We&apos;re Building Our First Portfolio.</h2>
            <p className="port-empty-body">
              SocioFi Ventures is accepting applications for our first cohort. These empty cards are waiting for founders like you.
            </p>
          </motion.div>

          <motion.div
            className="port-placeholder-grid"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {[
              { model: 'Equity Deal' },
              { model: 'Revenue Share' },
              { model: 'Hybrid Model' },
            ].map((card, i) => (
              <motion.div key={i} className="port-placeholder-card" variants={fadeUp}>
                <div className="port-placeholder-icon">
                  <PlaceholderBuildIcon />
                </div>
                <div className="port-placeholder-title">Your Company Here</div>
                <span className="port-placeholder-badge">{card.model}</span>
                <div className="port-placeholder-lines">
                  <div className="port-placeholder-line" />
                  <div className="port-placeholder-line" />
                  <div className="port-placeholder-line" />
                </div>
                <Link href="/ventures/apply" className="port-placeholder-link">
                  Apply <ArrowIcon />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.p className="port-cohort-note" variants={fadeUp}>
            <strong>Our first 2–4 portfolio companies launch this quarter.</strong> Be one of them.
          </motion.p>
        </motion.section>

        {/* ── Ecosystem perks ── */}
        <motion.section
          className="port-perks-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div className="port-perks-inner">
            <motion.div className="port-perks-label" variants={fadeUp}>
              Ecosystem access
            </motion.div>
            <motion.h2 className="port-perks-title" variants={fadeUp}>
              Ventures founders get preferential access to the full ecosystem:
            </motion.h2>
            <motion.div
              className="port-perks-grid"
              variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            >
              {PERKS.map((perk, i) => (
                <motion.div key={i} className="port-perk-card" variants={fadeUp}>
                  <div className="port-perk-header">
                    <div
                      className="port-perk-icon"
                      style={{ background: perk.iconBg }}
                    >
                      {perk.icon}
                    </div>
                    <span
                      className="port-perk-division"
                      style={{ color: perk.divisionColor }}
                    >
                      {perk.division}
                    </span>
                  </div>
                  <p className="port-perk-desc">{perk.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* ── CTA ── */}
        <motion.section
          className="port-cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div className="port-cta-glow" aria-hidden="true" />
          <div className="port-cta-inner">
            <motion.h2 className="port-cta-title" variants={fadeUp}>
              Want your company in this portfolio?
            </motion.h2>
            <motion.p className="port-cta-sub" variants={fadeUp}>
              We&apos;re reviewing applications for our first cohort now. Every application is read personally — no automated filters.
            </motion.p>
            <motion.div className="port-cta-row" variants={fadeUp}>
              <Link href="/ventures/apply" className="port-btn-primary">
                Apply to Ventures <ArrowIcon />
              </Link>
              <Link href="/ventures/criteria" className="port-btn-ghost">
                Check criteria
              </Link>
            </motion.div>
          </div>
        </motion.section>

      </main>
    </>
  );
}
