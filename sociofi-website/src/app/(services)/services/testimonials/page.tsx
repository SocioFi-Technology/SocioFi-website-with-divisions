'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────────

const A = '#4DBFA8';

// ── Styles ─────────────────────────────────────────────────────────────────────

const STYLES = `
  .tst-page {
    min-height: 100vh;
    background: var(--bg);
    padding-top: 80px;
  }

  /* ── Hero ─────────────────────────────────────────────────── */
  .tst-hero {
    padding: 100px 0 80px;
    text-align: center;
  }
  .tst-hero-inner {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .tst-label {
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
  .tst-label::before,
  .tst-label::after {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .tst-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    margin: 0 0 20px;
  }
  .tst-subtitle {
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    margin: 0;
  }

  /* ── Stats bar ────────────────────────────────────────────── */
  .tst-stats {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 32px;
  }
  .tst-stats-inner {
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
  @media (max-width: 768px) {
    .tst-stats-inner { grid-template-columns: repeat(2, 1fr); gap: 24px 0; }
  }
  .tst-stat {
    text-align: center;
    padding: 0 24px;
    border-right: 1px solid var(--border);
  }
  .tst-stat:last-child { border-right: none; }
  @media (max-width: 768px) {
    .tst-stat:nth-child(2) { border-right: none; }
    .tst-stat:nth-child(3) { border-right: 1px solid var(--border); }
  }
  .tst-stat-value {
    font-family: var(--font-headline);
    font-size: 1.5rem;
    font-weight: 800;
    color: ${A};
    letter-spacing: -0.02em;
    margin-bottom: 4px;
    display: block;
  }
  .tst-stat-label {
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--text-secondary);
    line-height: 1.4;
  }

  /* ── Filter tabs ──────────────────────────────────────────── */
  .tst-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 32px 100px;
  }
  .tst-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 48px;
  }
  .tst-filter-btn {
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
  .tst-filter-btn:hover {
    border-color: ${A};
    color: ${A};
  }
  .tst-filter-btn.active {
    border-color: ${A};
    background: rgba(77,191,168,0.1);
    color: ${A};
  }

  /* ── Grid ─────────────────────────────────────────────────── */
  .tst-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 768px) {
    .tst-grid { grid-template-columns: 1fr; }
  }

  /* ── Card ─────────────────────────────────────────────────── */
  .tst-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-left: 3px solid ${A};
    border-radius: var(--radius-lg);
    padding: 32px;
    transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
  }
  .tst-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--card-hover-shadow);
  }
  .tst-quote-mark {
    font-family: var(--font-headline);
    font-size: 2.5rem;
    font-weight: 800;
    color: ${A};
    line-height: 1;
    margin-bottom: 8px;
    opacity: 0.4;
  }
  .tst-quote-text {
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.75;
    color: var(--text-primary);
    margin: 0 0 24px;
  }
  .tst-card-footer {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .tst-author {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .tst-author-name {
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .tst-author-role {
    font-family: var(--font-body);
    font-size: 0.8rem;
    color: var(--text-secondary);
    line-height: 1.4;
  }
  .tst-badges {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }
  .tst-plan-badge {
    font-family: var(--font-mono);
    font-size: 0.66rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    background: rgba(77,191,168,0.1);
    color: ${A};
    border: 1px solid rgba(77,191,168,0.2);
    white-space: nowrap;
  }
  .tst-months {
    font-family: var(--font-body);
    font-size: 0.76rem;
    color: var(--text-muted);
    white-space: nowrap;
  }

  /* ── Empty state ──────────────────────────────────────────── */
  .tst-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 0;
    color: var(--text-muted);
    font-family: var(--font-body);
    font-size: 0.95rem;
  }

  /* ── CTA ──────────────────────────────────────────────────── */
  .tst-cta {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    padding: 100px 32px;
    text-align: center;
  }
  .tst-cta-inner {
    max-width: 480px;
    margin: 0 auto;
  }
  .tst-cta h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.025em;
    margin: 0 0 16px;
  }
  .tst-cta p {
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.7;
    margin: 0 0 36px;
  }
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: var(--gradient-brand);
    color: #fff;
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    border-radius: var(--radius-full);
    text-decoration: none;
    transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
    box-shadow: 0 4px 24px rgba(58,88,158,0.35);
  }
  .btn-primary:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(58,88,158,0.5);
  }

  @media (max-width: 768px) {
    .tst-main { padding: 40px 20px 80px; }
    .tst-hero { padding: 80px 0 60px; }
    .tst-hero-inner { padding: 0 20px; }
    .tst-cta { padding: 80px 20px; }
    .tst-stats { padding: 28px 20px; }
  }
`;

// ── Data ───────────────────────────────────────────────────────────────────────

type PlanTier = 'Essential' | 'Growth' | 'Scale';
type RoleType = 'Founder' | 'Operations' | 'CTO';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  roleType: RoleType;
  company: string;
  plan: PlanTier;
  months: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote: 'Six months after launch and I haven\'t thought about my software once. Services handles everything — the monitoring, the security patches, the occasional weird bug. I just run my business. That peace of mind is worth more than the monthly cost.',
    name: 'Marcus T.',
    role: 'Founder',
    roleType: 'Founder',
    company: 'SaaS analytics tool',
    plan: 'Growth',
    months: 8,
  },
  {
    id: 2,
    quote: 'We used to have a full-time developer just for maintenance. Their entire role was keeping things from breaking. Now Services handles all of it for a fraction of the cost — and they actually respond on weekends. Last Saturday, a payment integration failed at 2am. Fixed by 4am. Previous setup would have been Monday morning.',
    name: 'Sarah K.',
    role: 'Operations Director',
    roleType: 'Operations',
    company: 'E-commerce platform',
    plan: 'Scale',
    months: 14,
  },
  {
    id: 3,
    quote: 'The incident last month would have cost us a day of downtime with our old setup. Services caught it in 30 seconds — an anomalous spike in error rate on our payment processor integration — and had it fixed in 2 hours. We didn\'t even notice. That\'s the point.',
    name: 'James R.',
    role: 'CTO',
    roleType: 'CTO',
    company: 'Fintech startup',
    plan: 'Scale',
    months: 6,
  },
  {
    id: 4,
    quote: 'The previous agency disappeared three weeks after launch. Took me three months to find someone who understood the codebase well enough to touch it. Services audited it in two days, documented everything we had, and took over. Night and day difference. I sleep fine now.',
    name: 'Priya M.',
    role: 'Founder',
    roleType: 'Founder',
    company: 'HR automation tool',
    plan: 'Growth',
    months: 11,
  },
  {
    id: 5,
    quote: 'The security scan in the first week found three critical vulnerabilities — two in third-party libraries, one in our authentication flow. All patched before anyone noticed, before any of our healthcare clients noticed. That first audit alone was worth the entire year\'s subscription.',
    name: 'David L.',
    role: 'CEO',
    roleType: 'Founder',
    company: 'Healthcare booking platform',
    plan: 'Growth',
    months: 9,
  },
  {
    id: 6,
    quote: 'The monthly report is the thing I didn\'t know I needed. First time in two years I\'ve had a clear picture of what\'s actually happening with my software. What was patched, what was monitored, what\'s coming up. It makes me feel like a founder who knows what they\'re doing instead of someone crossing their fingers.',
    name: 'Aisha N.',
    role: 'Founder',
    roleType: 'Founder',
    company: 'Marketplace platform',
    plan: 'Essential',
    months: 5,
  },
  {
    id: 7,
    quote: 'We run four AI agents in production and the monitoring integration is seamless. Accuracy reports every week, drift detection that saved us twice in six months — once when a model update changed response formats, once when training data drift started affecting classification. Both caught before they affected customers.',
    name: 'Kevin C.',
    role: 'VP Engineering',
    roleType: 'CTO',
    company: 'Logistics automation',
    plan: 'Scale',
    months: 7,
  },
  {
    id: 8,
    quote: 'Response time on our P1 last quarter was eleven minutes. Eleven minutes from alert to engineer on it, at 11pm on a Tuesday. That\'s how you build trust. We\'ve been on Scale for a year now. I can\'t imagine managing this platform without them.',
    name: 'Emma S.',
    role: 'CTO',
    roleType: 'CTO',
    company: 'E-commerce',
    plan: 'Scale',
    months: 12,
  },
];

type FilterKey = 'All' | 'Founders' | RoleType | PlanTier;

const FILTERS: FilterKey[] = ['All', 'Founders', 'Operations', 'CTO', 'Essential', 'Growth', 'Scale'];

function matchesFilter(t: Testimonial, filter: FilterKey): boolean {
  if (filter === 'All') return true;
  if (filter === 'Founders') return t.roleType === 'Founder';
  if (filter === 'Operations') return t.roleType === 'Operations';
  if (filter === 'CTO') return t.roleType === 'CTO';
  if (filter === 'Essential' || filter === 'Growth' || filter === 'Scale') return t.plan === filter;
  return false;
}

// ── Animations ─────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 },
  }),
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

// ── Stats ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '45+', label: 'Products maintained' },
  { value: '99.97%', label: 'Avg uptime across all plans' },
  { value: '<2 hrs', label: 'Avg incident resolution' },
  { value: '100%', label: 'Client retention rate' },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ServicesTestimonialsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');

  const filtered = TESTIMONIALS.filter((t) => matchesFilter(t, activeFilter));

  return (
    <>
      <style>{STYLES}</style>
      <main className="tst-page">

        {/* ── Hero ── */}
        <section className="tst-hero">
          <motion.div
            className="tst-hero-inner"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div className="tst-label" variants={fadeUp}>Testimonials</motion.div>
            <motion.h1 className="tst-h1" variants={fadeUp}>From the Teams We Maintain.</motion.h1>
            <motion.p className="tst-subtitle" variants={fadeUp}>
              Ongoing client relationships, not one-off projects. These are the founders and engineers who trust us to watch their software every day.
            </motion.p>
          </motion.div>
        </section>

        {/* ── Stats Bar ── */}
        <motion.section
          className="tst-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="tst-stats-inner">
            {STATS.map((s) => (
              <div key={s.label} className="tst-stat">
                <span className="tst-stat-value">{s.value}</span>
                <span className="tst-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Filters + Grid ── */}
        <div className="tst-main">
          <motion.div
            className="tst-filters"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`tst-filter-btn${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
                aria-pressed={activeFilter === f}
              >
                {f}
              </button>
            ))}
          </motion.div>

          <div className="tst-grid">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.p
                  key="empty"
                  className="tst-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  No testimonials match that filter yet.
                </motion.p>
              ) : (
                filtered.map((t, i) => (
                  <motion.div
                    key={t.id}
                    className="tst-card"
                    variants={cardVariant}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    custom={i}
                    layout
                  >
                    <div className="tst-quote-mark" aria-hidden="true">&ldquo;</div>
                    <p className="tst-quote-text">{t.quote}</p>
                    <div className="tst-card-footer">
                      <div className="tst-author">
                        <span className="tst-author-name">{t.name}</span>
                        <span className="tst-author-role">{t.role}, {t.company}</span>
                      </div>
                      <div className="tst-badges">
                        <span className="tst-plan-badge">{t.plan} plan</span>
                        <span className="tst-months">{t.months} months</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── CTA ── */}
        <section className="tst-cta">
          <motion.div
            className="tst-cta-inner"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h2 variants={fadeUp}>Join them.</motion.h2>
            <motion.p variants={fadeUp}>
              Active monitoring in 48 hours. Month-to-month. No lock-in. Start with the plan that fits your stage.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/services/get-protected" className="btn-primary">
                Get protected
              </Link>
            </motion.div>
          </motion.div>
        </section>

      </main>
    </>
  );
}
