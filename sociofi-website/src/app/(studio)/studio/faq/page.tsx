'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────
const A = '#72C4B2';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
.faq-page { overflow-x: hidden; background: var(--bg); }

.sec-label {
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 14px; display: flex; align-items: center; gap: 10px;
}
.sec-label::before {
  content: ''; width: 20px; height: 1.5px;
  background: ${A}; display: inline-block; flex-shrink: 0;
}
.gradient-text {
  background: linear-gradient(135deg, #4A6CB8 0%, ${A} 50%, #A3DFD2 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
@media (forced-colors: active) { .gradient-text { -webkit-text-fill-color: unset; } }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px;
  background: linear-gradient(135deg, #3A589E, ${A}); color: #fff;
  border: none; border-radius: 100px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
  cursor: pointer; text-decoration: none;
  box-shadow: 0 4px 24px rgba(58,88,158,0.35);
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease);
}
.btn-primary:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 40px rgba(58,88,158,0.5); }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px;
  background: transparent; color: var(--text-primary);
  border: 1.5px solid var(--border); border-radius: 100px;
  font-family: ${F.h}; font-size: 0.9rem; font-weight: 600; letter-spacing: -0.01em;
  cursor: pointer; text-decoration: none;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}
.btn-ghost:hover { border-color: ${A}; color: ${A}; transform: translateY(-2px); }

/* Layout */
.faq-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 48px;
  align-items: start;
}
@media (max-width: 900px) {
  .faq-layout { grid-template-columns: 1fr; gap: 32px; }
  .faq-nav { display: none; }
}

/* Sidebar nav */
.faq-nav {
  position: sticky;
  top: 100px;
}
.faq-nav-item {
  display: block;
  padding: 10px 16px;
  border-radius: 8px;
  font-family: ${F.b}; font-size: 0.86rem;
  color: var(--text-secondary);
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border: none; background: transparent;
  text-align: left; width: 100%;
}
.faq-nav-item:hover { background: var(--bg-card); color: var(--text-primary); }
.faq-nav-item.active {
  background: ${A}18; color: ${A}; font-weight: 600;
}

/* Category header */
.faq-cat-header {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 16px;
  padding: 20px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  border-bottom: 2px solid ${A}44;
}
.faq-cat-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: ${A}18; color: ${A};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Accordion */
.faq-group {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 24px;
}
.faq-group-header {
  padding: 20px 24px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 14px;
}
.faq-group-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: ${A}18; color: ${A};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.faq-item {
  border-bottom: 1px solid var(--border);
}
.faq-item:last-child { border-bottom: none; }
.faq-q-btn {
  width: 100%; background: none; border: none;
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 24px; cursor: pointer; text-align: left; gap: 16px;
  transition: background 0.2s;
}
.faq-q-btn:hover { background: var(--bg-2); }
.faq-a {
  padding: 0 24px 20px;
}

/* Count badge */
.faq-count {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 6px;
  background: var(--bg-2); border: 1px solid var(--border);
  font-family: ${F.m}; font-size: 0.68rem; font-weight: 600;
  color: var(--text-muted); margin-left: 8px;
}

/* Quick answer highlight */
.faq-highlight {
  display: inline-block;
  background: ${A}18; color: ${A};
  font-family: ${F.h}; font-size: 0.86rem; font-weight: 700;
  padding: 2px 8px; border-radius: 6px; margin-right: 4px;
}

/* Search bar */
.faq-search-wrap {
  position: relative; max-width: 600px; margin: 0 auto 48px;
}
.faq-search {
  width: 100%;
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  border-radius: 100px;
  padding: 14px 20px 14px 48px;
  font-family: ${F.b}; font-size: 0.9rem;
  color: var(--text-primary); outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.faq-search:focus { border-color: ${A}; }
.faq-search::placeholder { color: var(--text-muted); }
.faq-search-icon {
  position: absolute; left: 18px; top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted); pointer-events: none;
}

/* CTA */
.faq-cta {
  background: linear-gradient(135deg, rgba(58,88,158,0.1) 0%, rgba(89,163,146,0.1) 100%);
  border-top: 1px solid var(--border);
}

/* Category chips */
.faq-chips {
  display: flex; flex-wrap: wrap; gap: 8px;
  margin-bottom: 40px; justify-content: center;
}
.faq-chip {
  padding: 7px 18px; border-radius: 100px;
  border: 1.5px solid var(--border);
  background: var(--bg-card);
  font-family: ${F.b}; font-size: 0.82rem;
  color: var(--text-secondary);
  cursor: pointer; transition: all 0.2s;
  user-select: none;
}
.faq-chip:hover { border-color: ${A}44; color: var(--text-primary); }
.faq-chip.active { border-color: ${A}; color: ${A}; background: ${A}12; font-weight: 600; }
`;

// ── Reveal ───────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
const ArrowRight = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const ChevronDown = ({ open = false, size = 18 }: { open?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }}>
    <path d="M6 9l6 6 6-6"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
const GitBranchIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <path d="M18 9a9 9 0 0 1-9 9"/>
  </svg>
);
const DollarIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const BrainIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3.16A2.5 2.5 0 0 1 9.5 2"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3.16A2.5 2.5 0 0 0 14.5 2"/>
  </svg>
);
const LockIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const ClockIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const ZapIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

// ── FAQ data ─────────────────────────────────────────────────────────────────
type FAQEntry = { q: string; a: React.ReactNode };
type FAQCategory = { id: string; label: string; icon: React.ReactNode; items: FAQEntry[] };

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'process',
    label: 'The Process',
    icon: <GitBranchIcon size={18} />,
    items: [
      {
        q: 'How does a typical project start?',
        a: 'Fill out the start-project form or book a call directly. We review your submission within 4 hours and reply with an honest first take. Then we schedule a 30-minute discovery call — a real engineer, not a sales rep. After the call, we send a written proposal within 2 business days.',
      },
      {
        q: 'Do I need to provide a spec or requirements document?',
        a: "No. A lot of clients come in with nothing more than a problem and a rough idea of what they want. That's fine. We'll develop the spec together during the discovery call and proposal process.",
      },
      {
        q: 'How do I stay updated during the build?',
        a: 'You get: (1) weekly written status updates, (2) access to the staging environment so you can see real progress, (3) a shared project board, and (4) direct Slack or email access to your lead engineer. No status slides — actual working software.',
      },
      {
        q: 'Can I request changes during the build?',
        a: 'Yes. Changes are welcome. We triage them into two buckets: changes within the agreed scope (handled as part of the build) and scope changes (quoted in writing with timeline and cost impact before we proceed).',
      },
      {
        q: 'What happens at the end?',
        a: 'You receive a full handover: source code in your repository, deployment documentation, credentials, architecture notes, and a walkthrough session. Everything you need to run the product independently or hand it to another team.',
      },
      {
        q: 'How many revision rounds are included?',
        a: 'Unlimited reasonable revisions during the build phase. If it was in the scope, we iterate until it\'s right. Major scope changes (new features, fundamental design changes) are scoped and quoted separately.',
      },
      {
        q: 'Do you sign NDAs?',
        a: 'Yes, for every engagement that involves sensitive business logic, proprietary data, or confidential product plans. Just mention it when you fill out the start form and we include the NDA before any project details are shared.',
      },
      {
        q: 'How do I book the discovery call?',
        a: <span>Fill out the form at <Link href="/studio/start-project" style={{ color: A }}>studio/start-project</Link> and select your preferred communication method. Or go directly to <Link href="/contact" style={{ color: A }}>contact</Link> to book a call.</span>,
      },
    ],
  },
  {
    id: 'cost',
    label: 'Cost & Pricing',
    icon: <DollarIcon size={18} />,
    items: [
      {
        q: 'What are your prices?',
        a: <span><span className="faq-highlight">Starter</span> $3K–$8K (1–2 weeks) · <span className="faq-highlight">Growth</span> $8K–$20K (2–4 weeks) · <span className="faq-highlight">Scale</span> $20K+ (4–8 weeks). See full pricing at <Link href="/studio/pricing" style={{ color: A }}>studio/pricing</Link>.</span>,
      },
      {
        q: 'Are there any hidden fees?',
        a: 'No. Third-party costs (hosting, API keys, domain registration, third-party services) are disclosed upfront in the proposal and are your cost to manage. Our fee is for the build — nothing else.',
      },
      {
        q: 'What are the payment terms?',
        a: '50% upfront, 50% on delivery. Monthly retainers are billed at the start of each month. No work starts without the first payment. No delivery without the second.',
      },
      {
        q: 'Do you offer refunds?',
        a: "If we can't deliver what was agreed in the written proposal, we refund. We've never had to. If scope changes make the original proposal unworkable, we renegotiate in writing before proceeding.",
      },
      {
        q: 'Can I pay in instalments for larger projects?',
        a: 'Yes. For Scale-tier projects ($20K+), we can arrange milestone-based payments. The structure is agreed in writing before work begins.',
      },
      {
        q: 'Do you discount for startups or non-profits?',
        a: <span>For equity partnerships with early-stage startups, check <Link href="/ventures" style={{ color: A }}>SocioFi Ventures</Link>. Non-profit discounts are considered on a case-by-case basis — mention it in your project request.</span>,
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI + Human',
    icon: <BrainIcon size={18} />,
    items: [
      {
        q: 'How much of my project is AI-generated?',
        a: "Roughly 70% of initial code is AI-generated — boilerplate, scaffolding, test stubs, documentation. Engineers write the parts that require judgment: architecture design, security logic, complex integrations, and anything where the AI's output was wrong.",
      },
      {
        q: 'Is AI-generated code lower quality?',
        a: 'Not when reviewed by engineers. The risk with AI-generated code is that it can be confidently wrong. That\'s why every AI-generated file is reviewed by an engineer before it enters the codebase. We treat AI like a fast junior developer — useful, but everything gets checked.',
      },
      {
        q: 'What AI tools do you use?',
        a: 'Advanced AI development tools. We are model-agnostic and use whatever produces the best result for the task at hand. We never disclose our specific tooling publicly.',
      },
      {
        q: 'Can I ask for less AI and more human code?',
        a: "Yes. Some projects — particularly those with complex security requirements, unusual architecture, or regulatory compliance needs — warrant a different approach. Discuss it during the scoping call and we'll factor it into the proposal.",
      },
      {
        q: 'How does AI actually make it faster?',
        a: 'Boilerplate, initial codebase generation, test suites, API documentation, and scaffold code — all done in hours instead of days. Engineers then spend their time on the parts that actually require human judgment: architecture, security, logic, and debugging.',
      },
    ],
  },
  {
    id: 'ownership',
    label: 'Code Ownership',
    icon: <LockIcon size={18} />,
    items: [
      {
        q: 'Who owns the code after the project?',
        a: 'You do. 100%. From day one. The code is committed to your repository throughout the build. On delivery, everything — code, credentials, documentation — is transferred to you. No SocioFi dependencies. No strings attached.',
      },
      {
        q: 'Will SocioFi have access to my code after the project?',
        a: "Only if you authorize it for an ongoing maintenance engagement. We won't access your repository, your hosting, or your data without your explicit permission.",
      },
      {
        q: 'Can I take the code to another developer?',
        a: "Yes. No lock-in. That's the point. We write code that any competent developer can understand and maintain. We'll document the architecture to make handoffs easier.",
      },
      {
        q: 'What license is the code under?',
        a: "Work-for-hire. You own it outright. No open-source license requirements, no SocioFi attribution requirements, no revenue sharing. It's your code.",
      },
    ],
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: <ClockIcon size={18} />,
    items: [
      {
        q: 'How accurate are your timeline estimates?',
        a: 'We typically deliver within ±1 week for Starter and Growth projects. Complex Scale projects have more variance — we\'ll say so explicitly in the proposal. If we foresee a delay, we tell you immediately.',
      },
      {
        q: 'Can you do rush projects?',
        a: "Yes. Rush delivery (faster than our standard timeline) carries a 20% premium on the project price. Tell us your hard deadline during the discovery call and we'll tell you honestly whether we can hit it.",
      },
      {
        q: 'What slows projects down?',
        a: 'The most common causes of delay: slow feedback from the client, unclear requirements that change after approval, and external API integrations that are undocumented or unreliable (outside our control). We flag risks upfront and in writing.',
      },
      {
        q: 'Do weekends count in your timelines?',
        a: "We quote in business days. We sometimes work weekends on urgent projects — but you shouldn't count on it. If weekend delivery is critical, let us know.",
      },
    ],
  },
  {
    id: 'afterlaunch',
    label: 'After Launch',
    icon: <ZapIcon size={18} />,
    items: [
      {
        q: "What's included in the 30-day bug warranty?",
        a: 'Any bug we introduce during the build gets fixed at no charge within 30 days of launch. This covers: unexpected errors, broken functionality, and behaviour that doesn\'t match the agreed spec. It does not cover new features or changes to the spec.',
      },
      {
        q: 'What if I need new features after launch?',
        a: <span>Two options: (1) project-based quote for new features (same process as the original build), or (2) an ongoing retainer plan that includes continuous development capacity. See plans at <Link href="/services/plans" style={{ color: A }}>services/plans</Link>.</span>,
      },
      {
        q: 'Who handles hosting and maintenance after launch?',
        a: <span>You can manage it yourself (we document everything for this), or we offer ongoing maintenance and hosting plans. See <Link href="/services" style={{ color: A }}>SocioFi Services</Link>.</span>,
      },
      {
        q: 'What if something breaks after the warranty?',
        a: "We'll fix it. Quoted on time-and-materials basis for one-off fixes, or included if you're on a retainer plan. We don't abandon projects after delivery.",
      },
    ],
  },
];

// ── FAQ item ─────────────────────────────────────────────────────────────────
function FAQItem({ q, a }: FAQEntry) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-q-btn" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span style={{ fontFamily: F.h, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: 1.4 }}>{q}</span>
        <ChevronDown open={open} size={18} />
      </button>
      {open && (
        <motion.div className="faq-a"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>{a}</div>
        </motion.div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function FAQPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filteredCategories = FAQ_CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      query.trim() === '' ||
      item.q.toLowerCase().includes(query.toLowerCase()) ||
      (typeof item.a === 'string' && item.a.toLowerCase().includes(query.toLowerCase()))
    ),
  })).filter(cat =>
    (activeFilter === 'all' || cat.id === activeFilter) &&
    (query.trim() === '' || cat.items.length > 0)
  );

  const totalCount = FAQ_CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <main className="faq-page">
      <style>{STYLES}</style>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '120px 0 64px', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-200px', right: '-100px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: `radial-gradient(circle, ${A}12 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal>
            <div className="sec-label">FAQ</div>
            <h1 style={{
              fontFamily: F.h, fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.08,
              color: 'var(--text-primary)', maxWidth: 700, marginBottom: 20,
            }}>
              Common Questions,{' '}
              <span className="gradient-text">Honest Answers.</span>
            </h1>
            <p style={{
              fontFamily: F.b, fontSize: '1.05rem', color: 'var(--text-secondary)',
              maxWidth: 520, lineHeight: 1.75, marginBottom: 0,
            }}>
              {totalCount} questions across 6 categories. Search or browse by topic.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Search + Filter ───────────────────────────────────────────── */}
      <section style={{ padding: '32px 0 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div className="faq-search-wrap" style={{ maxWidth: '100%', margin: '0 0 24px' }}>
            <div className="faq-search-icon"><SearchIcon /></div>
            <input
              className="faq-search"
              type="text"
              placeholder="Search questions..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search FAQ"
            />
          </div>
          <div className="faq-chips">
            <div
              className={`faq-chip${activeFilter === 'all' ? ' active' : ''}`}
              onClick={() => setActiveFilter('all')}
              role="button" tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setActiveFilter('all')}>
              All ({totalCount})
            </div>
            {FAQ_CATEGORIES.map(cat => (
              <div
                key={cat.id}
                className={`faq-chip${activeFilter === cat.id ? ' active' : ''}`}
                onClick={() => setActiveFilter(cat.id)}
                role="button" tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setActiveFilter(cat.id)}>
                {cat.label} ({cat.items.length})
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Content ───────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 120px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>

          {filteredCategories.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontFamily: F.b, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                No questions found for &ldquo;{query}&rdquo;. Try a different search term.
              </p>
            </div>
          )}

          {filteredCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.05}>
              <div className="faq-group" id={cat.id} style={{ scrollMarginTop: 100 }}>
                <div className="faq-group-header">
                  <div className="faq-group-icon">{cat.icon}</div>
                  <div>
                    <div style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                      {cat.label}
                      <span className="faq-count">{cat.items.length}</span>
                    </div>
                  </div>
                </div>
                {cat.items.map((item, j) => (
                  <FAQItem key={j} q={item.q} a={item.a} />
                ))}
              </div>
            </Reveal>
          ))}

        </div>
      </section>

      {/* ── Still have questions? ─────────────────────────────────────── */}
      <section className="faq-cta" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {[
              {
                title: 'Still have a question?',
                body: 'Ask us directly. We respond within 4 hours on business days.',
                cta: 'Contact us',
                href: '/contact',
                primary: true,
              },
              {
                title: 'Ready to start?',
                body: 'Fill out the start-project form. Skip what you don\'t know.',
                cta: 'Start a project',
                href: '/studio/start-project',
                primary: true,
              },
              {
                title: 'Want to see the work?',
                body: "Browse completed projects and case studies.",
                cta: 'View portfolio',
                href: '/studio/portfolio',
                primary: false,
              },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '32px',
                }}>
                  <div style={{ fontFamily: F.h, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                    {card.title}
                  </div>
                  <div style={{ fontFamily: F.b, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                    {card.body}
                  </div>
                  <Link href={card.href} className={card.primary ? 'btn-primary' : 'btn-ghost'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', fontSize: '0.84rem' }}>
                    {card.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
