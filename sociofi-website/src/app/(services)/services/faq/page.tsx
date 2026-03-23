'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────────

const A = '#4DBFA8';

// ── Styles ─────────────────────────────────────────────────────────────────────

const STYLES = `
  .faq-page {
    min-height: 100vh;
    background: var(--bg);
    padding-top: 80px;
  }

  /* ── Hero ─────────────────────────────────────────────────── */
  .faq-hero {
    padding: 100px 0 80px;
    text-align: center;
  }
  .faq-hero-inner {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .faq-label {
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
  .faq-label::before,
  .faq-label::after {
    content: '';
    width: 20px;
    height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .faq-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    margin: 0 0 20px;
  }
  .faq-subtitle {
    font-family: var(--font-body);
    font-size: 1.05rem;
    line-height: 1.75;
    color: var(--text-secondary);
    margin: 0;
  }

  /* ── Layout ───────────────────────────────────────────────── */
  .faq-body {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 60px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px 100px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .faq-body { grid-template-columns: 1fr; gap: 40px; }
  }

  /* ── Category nav ─────────────────────────────────────────── */
  .faq-nav {
    position: sticky;
    top: 100px;
  }
  .faq-nav-label {
    font-family: var(--font-mono);
    font-size: 0.66rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 14px;
    padding-left: 2px;
  }
  .faq-nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  @media (max-width: 900px) {
    .faq-nav {
      position: static;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .faq-nav-label { display: none; }
    .faq-nav-list { flex-direction: row; flex-wrap: wrap; gap: 8px; }
  }
  .faq-nav-btn {
    display: block;
    width: 100%;
    text-align: left;
    font-family: var(--font-body);
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s var(--ease);
    line-height: 1.3;
  }
  .faq-nav-btn:hover { color: var(--text-primary); background: var(--bg-2); }
  .faq-nav-btn.active {
    color: ${A};
    background: rgba(77,191,168,0.08);
  }
  @media (max-width: 900px) {
    .faq-nav-btn { width: auto; padding: 6px 14px; border: 1.5px solid var(--border); border-radius: var(--radius-full); }
    .faq-nav-btn.active { border-color: ${A}; }
  }

  /* ── Content ──────────────────────────────────────────────── */
  .faq-content {
    display: flex;
    flex-direction: column;
    gap: 60px;
  }

  /* ── Category group ───────────────────────────────────────── */
  .faq-group {}
  .faq-group-header {
    margin-bottom: 8px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .faq-group-num {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    color: ${A};
    letter-spacing: 0.05em;
    opacity: 0.6;
  }
  .faq-group-title {
    font-family: var(--font-headline);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    margin: 0;
  }

  /* ── Accordion ────────────────────────────────────────────── */
  .faq-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .faq-item {
    border-bottom: 1px solid var(--border);
  }
  .faq-item:last-child { border-bottom: none; }
  .faq-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 0;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
  }
  .faq-trigger:hover .faq-q { color: ${A}; }
  .faq-q {
    font-family: var(--font-headline);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.4;
    transition: color 0.2s;
    flex: 1;
  }
  .faq-chevron {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    color: var(--text-muted);
    transition: transform 0.3s var(--ease);
  }
  .faq-chevron.open {
    transform: rotate(180deg);
    color: ${A};
  }
  .faq-answer {
    overflow: hidden;
  }
  .faq-answer-inner {
    padding: 0 0 20px;
    font-family: var(--font-body);
    font-size: 0.93rem;
    line-height: 1.75;
    color: var(--text-secondary);
  }
  .faq-answer-inner p {
    margin: 0 0 12px;
  }
  .faq-answer-inner p:last-child {
    margin-bottom: 0;
  }
  .faq-answer-inner a {
    color: ${A};
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  /* ── Bottom CTA ───────────────────────────────────────────── */
  .faq-cta {
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    padding: 80px 32px;
    text-align: center;
  }
  .faq-cta-inner {
    max-width: 520px;
    margin: 0 auto;
  }
  .faq-cta h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.6rem, 2.5vw, 2rem);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 16px;
  }
  .faq-cta p {
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.7;
    margin: 0 0 36px;
  }
  .faq-cta-buttons {
    display: flex;
    gap: 14px;
    justify-content: center;
    flex-wrap: wrap;
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
  .btn-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 40px rgba(58,88,158,0.5); }
  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: transparent;
    color: var(--text-primary);
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    border-radius: var(--radius-full);
    border: 1.5px solid var(--border);
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-ghost:hover { border-color: ${A}; color: ${A}; }

  @media (max-width: 768px) {
    .faq-hero { padding: 80px 0 60px; }
    .faq-hero-inner { padding: 0 20px; }
    .faq-body { padding: 0 20px 80px; }
    .faq-cta { padding: 80px 20px; }
  }
`;

// ── Data ───────────────────────────────────────────────────────────────────────

interface FAQItem {
  q: string;
  a: string | React.ReactNode;
}

interface FAQCategory {
  id: string;
  title: string;
  questions: FAQItem[];
}

const CATEGORIES: FAQCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    questions: [
      {
        q: "What's the difference between Essential, Growth, and Scale?",
        a: "Essential is monitoring, security patches, and a limited number of bug fixes — it's the foundation for products that need a watchful eye without active development. Growth adds more bug fixes, feature development hours (up to 8/month), and a monthly video check-in, designed for products that are actively growing post-launch. Scale is the full-service tier: priority response SLAs, unlimited feature hours, a dedicated engineer, and quarterly security audits for mission-critical products. Full comparison on the plans page.",
      },
      {
        q: "Do I need my software to have been built by SocioFi to use Services?",
        a: "No. The majority of our clients come to us with software built by other agencies, freelancers, or AI coding tools. We start every new engagement with an audit — we assess the codebase, document what we find, identify risks, and propose a plan. If we can maintain it confidently, we tell you. If we can't, we tell you that too.",
      },
      {
        q: "What happens during onboarding?",
        a: "Onboarding takes 48 hours and happens at no extra cost. We request read access to your repository and hosting provider. We run a dependency audit, set up monitoring across your stack (uptime, error rates, performance), document your tech stack and architecture, and produce a baseline health report. By end of day two, monitoring is live and you have your first written report.",
      },
      {
        q: "How long does it take to get started?",
        a: "From signing up to active monitoring: 48 hours. We process new accounts within one business day. The technical onboarding itself takes another 24–48 hours depending on the complexity of your infrastructure.",
      },
      {
        q: "What access do you need to our codebase?",
        a: "Read access to your version-controlled repository (GitHub, GitLab, or Bitbucket). Write access is only requested when deploying patches — and only with your explicit sign-off on each deployment. We use least-privilege access patterns: we never request admin rights when read or write access is sufficient. All credentials are stored in encrypted vaults and never handled in plain text.",
      },
      {
        q: "Will my software have downtime during onboarding?",
        a: "No. Monitoring setup is read-only and observation-only. We do not touch your production infrastructure during onboarding. If we identify an urgent issue during the initial audit, we will flag it and propose a fix — but no changes happen without your explicit approval.",
      },
    ],
  },
  {
    id: 'plans-pricing',
    title: 'Plans & Pricing',
    questions: [
      {
        q: "Can I start with Essential and upgrade?",
        a: "Yes. Most clients start on Essential to get monitoring and security in place, then upgrade to Growth or Scale once they understand how much active maintenance their product needs. Upgrades are prorated — you pay the difference for the remaining days in your current billing cycle. The change takes effect immediately.",
      },
      {
        q: "What if I need more than 5 bug fixes on Essential?",
        a: "Additional bug fixes beyond your monthly allocation are scoped individually. We assess the bug, give you a fixed quote, and you decide whether to proceed. We do not bill for out-of-scope work without written approval. If you consistently need more bug fixes than your plan covers, we will recommend upgrading rather than running up add-on charges every month.",
      },
      {
        q: "What counts as a bug fix vs a feature?",
        a: "A bug fix restores functionality that was previously working as expected — broken forms, failed API calls, broken authentication, database errors. A feature request adds new functionality that was not in the original scope. Edge cases (like changing the behavior of an existing feature) are assessed individually. When it's unclear, we tell you before we start work and agree on how to classify it.",
      },
      {
        q: "Are there long-term contracts?",
        a: "No. All plans are month-to-month. Cancel before your next billing date and you won't be charged again. There are no early termination fees, no lock-in periods, no minimums.",
      },
      {
        q: "What if I'm not happy in the first month?",
        a: "We offer a full refund within the first 30 days if you're not satisfied — no questions, no conditions. This rarely happens, but we think it's the right policy. If something isn't working for you, tell us first — most issues are fixable.",
      },
      {
        q: "Can I pause my plan?",
        a: "If you have a genuine reason to pause — launching a major rebuild, going through an acquisition, seasonal product — contact us. We handle pauses on a case-by-case basis for clients who have been with us for three months or more. Monitoring stays active during a pause at a reduced rate.",
      },
      {
        q: "Do you support multiple products on one plan?",
        a: "Each plan covers one production codebase. If you have multiple products, each needs its own plan. We offer a multi-product discount starting at the third product. Contact us before signing up for two or more plans.",
      },
      {
        q: "What about hosting costs — are they included?",
        a: "No. Services covers the engineering and maintenance work. Your hosting costs (Vercel, AWS, DigitalOcean, etc.) are billed directly to you by your hosting provider. We help you optimize your infrastructure costs as part of our ongoing maintenance work, but we do not resell hosting.",
      },
    ],
  },
  {
    id: 'monitoring-security',
    title: 'Monitoring & Security',
    questions: [
      {
        q: "What exactly do you monitor?",
        a: "Uptime and availability (HTTP checks every 60 seconds from multiple regions), application error rates and exception counts, server resource utilization (CPU, memory, disk), database query performance and connection pool health, cache hit rates, and SSL certificate expiry. On Growth and Scale plans, we also monitor deployment pipelines and add custom business metric alerts on request.",
      },
      {
        q: "How do you handle security vulnerabilities?",
        a: "We run weekly automated dependency audits using OWASP and NVD databases. When a critical CVE (CVSS score 7+) is published that affects your dependencies, we patch it within 24 hours. For lower-severity issues, patches are batched into monthly security updates. Before any patch is deployed, we test it in a staging environment and inform you of the change. You can review and approve before it hits production.",
      },
      {
        q: "How quickly will I know if something breaks?",
        a: "On Essential, alerts go to you within 5 minutes of a detected issue via email and Slack. On Growth, an engineer is paged simultaneously. On Scale, an engineer is paged within 1 minute and you are notified within 5 minutes. Incident response begins immediately upon engineer page — not upon client response.",
      },
      {
        q: "Can I see my monitoring data?",
        a: "Yes. You get a read-only dashboard link during onboarding where you can view uptime history, error rates, and performance trends in real time. The monthly report summarises everything in plain language — what was monitored, what alerted, how it was resolved, and what was patched.",
      },
      {
        q: "What's your uptime SLA if you miss it?",
        a: "On Growth and Scale plans, our response SLAs are backed by service credits. If we miss the incident response SLA on a verified P1 incident, you receive a one-month credit. On Essential, response times are targets rather than guaranteed SLAs. Full SLA details are in your service agreement.",
      },
    ],
  },
  {
    id: 'bug-fixes-features',
    title: 'Bug Fixes & Features',
    questions: [
      {
        q: "How do I report a bug?",
        a: "Email your designated support address or submit via the client portal. Include what you expected to happen, what actually happened, and steps to reproduce if you have them. For critical issues (something completely broken in production), use the priority channel — your onboarding document includes a phone/WhatsApp number for production emergencies.",
      },
      {
        q: "How quickly are bugs fixed?",
        a: "P1 bugs (production down, data loss risk, security breach): response within 1–24 hours depending on your plan. P2 bugs (major feature broken, significant user impact): within 1–3 business days. P3 bugs (minor issues, edge cases, cosmetic problems): batched into your monthly maintenance cycle. Timelines are defined in writing in your service agreement.",
      },
      {
        q: "What counts as a 'bug' vs a 'feature request'?",
        a: "A bug is behaviour that differs from the original intended functionality — something that worked before and no longer does, or something that clearly should work but doesn't. A feature request adds new capability. If the original behaviour was never defined or the expected behaviour is ambiguous, we discuss it with you before classifying and starting work.",
      },
      {
        q: "What's included in 'feature hours'?",
        a: "Feature hours on Growth and Scale cover scoped development work — new pages, integrations, workflow changes, UI improvements. The hours are for hands-on engineering time. Discovery, scoping, and QA testing are included in the quoted scope, not deducted from your hours separately.",
      },
      {
        q: "Can I roll over unused feature hours?",
        a: "Unused feature hours do not roll over between months. If you consistently have unused hours, you may be on a higher plan than you need — we will tell you honestly. Upgrades and downgrades are always available before your next billing date.",
      },
    ],
  },
  {
    id: 'ai-agents',
    title: 'AI Agents',
    questions: [
      {
        q: "Do you monitor AI agents?",
        a: "Yes. On Growth and Scale plans, we can set up monitoring for AI agents in production — accuracy tracking, latency, error rates, output quality scoring, and drift detection. This includes weekly accuracy reports and automatic alerts when metrics fall outside defined thresholds.",
      },
      {
        q: "What happens if an agent's accuracy drops?",
        a: "We alert you immediately and begin triage. Common causes of accuracy drift include model version changes from providers, input data format changes, and context window issues. We identify the cause, propose a fix (prompt adjustment, evaluation set updates, input pre-processing), and implement with your approval. We do not modify agent logic without explicit sign-off.",
      },
      {
        q: "I'm not running agents yet — can I add monitoring later?",
        a: "Yes. Agent monitoring is an add-on that can be enabled at any time on Growth and Scale plans. When you are ready to deploy agents, contact us two weeks in advance. We will integrate monitoring during your pre-production testing phase so you go live with visibility from day one.",
      },
    ],
  },
  {
    id: 'cancellation',
    title: 'Cancellation',
    questions: [
      {
        q: "How do I cancel?",
        a: "Email your account manager or use the client portal. Cancel before your next billing date and you won't be charged for the following month. No cancellation fees, no exit interviews required. We do ask for a reason — not to talk you out of it, but to improve.",
      },
      {
        q: "What happens to my monitoring setup when I cancel?",
        a: "We produce a full handover document within 5 business days of cancellation: all monitoring configurations, dependency audit history, every change we made to your codebase, incident logs, and access credentials in a secure transfer. You get everything we built for you. Nothing is held back.",
      },
      {
        q: "Can I come back after cancelling?",
        a: "Yes, and it happens more often than you might expect — usually when a client pauses for a rebuild and returns once the new version is live. When you come back, we pick up from the handover document, onboarding takes less time since we already know your stack, and you go back onto a standard plan at the current pricing.",
      },
    ],
  },
];

// ── Accordion item ─────────────────────────────────────────────────────────────

function AccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="faq-item">
      <button
        className="faq-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="faq-q">{item.q}</span>
        <svg
          className={`faq-chevron${open ? ' open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="faq-answer-inner">
              {typeof item.a === 'string' ? <p>{item.a}</p> : item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function ServicesFAQPage() {
  const [activeNav, setActiveNav] = useState<string>(CATEGORIES[0].id);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  function scrollTo(id: string) {
    setActiveNav(id);
    const el = sectionRefs.current[id];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <main className="faq-page">

        {/* ── Hero ── */}
        <section className="faq-hero">
          <motion.div
            className="faq-hero-inner"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div className="faq-label" variants={fadeUp}>FAQ</motion.div>
            <motion.h1 className="faq-h1" variants={fadeUp}>Everything You Need to Know.</motion.h1>
            <motion.p className="faq-subtitle" variants={fadeUp}>
              30 questions across 6 categories — getting started, pricing, monitoring, bug fixes, AI agents, and cancellation. If yours isn&apos;t here, ask us directly.
            </motion.p>
          </motion.div>
        </section>

        {/* ── Body ── */}
        <div className="faq-body">
          {/* Nav */}
          <nav className="faq-nav" aria-label="FAQ categories">
            <p className="faq-nav-label">Jump to</p>
            <ul className="faq-nav-list">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    className={`faq-nav-btn${activeNav === cat.id ? ' active' : ''}`}
                    onClick={() => scrollTo(cat.id)}
                  >
                    {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Accordion groups */}
          <div className="faq-content">
            {CATEGORIES.map((cat, ci) => (
              <motion.section
                key={cat.id}
                id={cat.id}
                className="faq-group"
                ref={(el) => { sectionRefs.current[cat.id] = el; }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: ci * 0.04 }}
              >
                <div className="faq-group-header">
                  <span className="faq-group-num">0{ci + 1}</span>
                  <h2 className="faq-group-title">{cat.title}</h2>
                </div>
                <ul className="faq-list">
                  {cat.questions.map((item) => (
                    <AccordionItem key={item.q} item={item} />
                  ))}
                </ul>
              </motion.section>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <section className="faq-cta">
          <motion.div
            className="faq-cta-inner"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h2 variants={fadeUp}>Still have questions?</motion.h2>
            <motion.p variants={fadeUp}>
              Fill out the intake form and we will get back to you within one business day. Or email us directly — real answers from real people.
            </motion.p>
            <motion.div className="faq-cta-buttons" variants={fadeUp}>
              <Link href="/services/get-protected" className="btn-primary">Ask us directly</Link>
              <a href="mailto:services@sociofitechnology.com" className="btn-ghost">services@sociofitechnology.com</a>
            </motion.div>
          </motion.div>
        </section>

      </main>
    </>
  );
}
