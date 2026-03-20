'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ── Constants ──────────────────────────────────────────────────────────────
const A = '#6BA3E8';
const A_DARK = '#3A6DB8';
const F = {
  h: 'var(--font-display, Syne)',
  b: 'var(--font-body, Outfit)',
  m: 'var(--font-mono, "Fira Code")',
};

// ── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
.faq-wrap { background: var(--bg); color: var(--text-primary); min-height: 100vh; font-family: ${F.b}; overflow-x: hidden; }

/* ── Hero ── */
.faq-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
.faq-hero-inner { max-width: 700px; margin: 0 auto; position: relative; z-index: 2; }

.faq-badge {
  display: inline-flex; align-items: center; gap: 10px; justify-content: center;
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 28px;
}
.faq-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; flex-shrink: 0; }
[data-theme="light"] .faq-badge { color: ${A_DARK}; }
[data-theme="light"] .faq-badge::before { background: ${A_DARK}; }

.faq-h1 {
  font-family: ${F.h}; font-size: clamp(2.4rem, 4.5vw, 3.6rem); font-weight: 800;
  line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary);
  margin-bottom: 24px;
}
.faq-gradient-text {
  background: linear-gradient(135deg, #4A85CC, ${A}, #9BC0F0);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
@media (forced-colors: active) { .faq-gradient-text { -webkit-text-fill-color: unset; } }

/* ── Shared sections ── */
.faq-section { padding: 100px 32px; background: var(--bg); }
.faq-section-alt { padding: 80px 32px; background: var(--bg-2); }
.faq-container { max-width: 860px; margin: 0 auto; }

.faq-category-label {
  display: flex; align-items: center; gap: 10px;
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 20px;
}
.faq-category-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; flex-shrink: 0; }
[data-theme="light"] .faq-category-label { color: ${A_DARK}; }

.faq-category-title {
  font-family: ${F.h}; font-size: clamp(1.4rem, 2.5vw, 1.8rem); font-weight: 700;
  color: var(--text-primary); letter-spacing: -0.015em;
  margin-bottom: 28px;
}

/* ── Accordion ── */
.faq-accordion { display: flex; flex-direction: column; gap: 8px; }
.faq-item {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 14px; overflow: hidden;
  transition: border-color 0.3s;
}
.faq-item.faq-open { border-color: ${A}30; }
.faq-item-btn {
  width: 100%; padding: 22px 24px; display: flex; align-items: center;
  justify-content: space-between; gap: 16px;
  cursor: pointer; background: transparent; border: none; text-align: left;
}
.faq-item-btn:hover .faq-q { color: var(--text-primary); }
.faq-q {
  font-family: ${F.h}; font-size: 1rem; font-weight: 600;
  color: var(--text-primary); line-height: 1.4; flex: 1;
  transition: color 0.2s;
}
.faq-chevron {
  flex-shrink: 0; color: var(--text-muted);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s;
}
.faq-open .faq-chevron { transform: rotate(180deg); color: ${A}; }
.faq-item-body {
  padding: 0 24px 24px;
  font-size: 0.95rem; line-height: 1.7;
  color: var(--text-secondary);
}
.faq-item-body strong { color: var(--text-primary); font-weight: 600; }

/* ── Category spacing ── */
.faq-category-group { margin-bottom: 60px; }
.faq-category-group:last-child { margin-bottom: 0; }

/* ── Buttons ── */
.faq-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; background: linear-gradient(135deg, #4A85CC, ${A});
  color: #fff; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem;
  font-weight: 600; text-decoration: none; transition: all 0.2s;
}
.faq-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(107,163,232,0.35); }

/* ── Final CTA ── */
.faq-final-cta { padding: 100px 32px; background: linear-gradient(135deg, ${A}12, var(--bg-2), ${A}08); text-align: center; }
.faq-cta-h2 {
  font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700;
  color: var(--text-primary); margin-bottom: 14px; letter-spacing: -0.025em;
}
.faq-cta-sub { font-size: 1rem; color: var(--text-secondary); max-width: 440px; margin: 0 auto 28px; line-height: 1.7; }

@media (max-width: 768px) {
  .faq-hero { padding: 120px 20px 80px; }
  .faq-section { padding: 80px 20px; }
  .faq-section-alt { padding: 60px 20px; }
  .faq-final-cta { padding: 80px 20px; }
  .faq-item-btn { padding: 18px 20px; }
  .faq-item-body { padding: 0 20px 20px; }
}
`;

// ── Scroll Reveal ──────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ── SVG Icons ──────────────────────────────────────────────────────────────
const ChevronDown = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ArrowRight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── FAQ Data ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    label: 'Application Process',
    title: 'Applying to Ventures',
    items: [
      {
        q: 'How long does the application take?',
        a: 'About 10 minutes. We ask for honest answers, not polished ones. No pitch deck required. No financial projections. Just tell us what you\'re building, who it\'s for, and why you\'re the right person to build it.',
      },
      {
        q: 'When will I hear back?',
        a: 'Within 7 business days. Guaranteed. Every applicant gets a response — yes, no, or "let\'s talk more." You will never be left wondering if your application arrived.',
      },
      {
        q: 'What if I\'m rejected?',
        a: 'We explain exactly why and what would make a stronger application. We don\'t ghost. Even if the answer is no, we\'ll tell you what was missing — demand validation, scope clarity, or something else entirely.',
      },
      {
        q: 'Can I reapply?',
        a: 'Yes, after 3 months. Strengthen the weaknesses we identify and reapply. We\'ve accepted founders on their second application who addressed exactly what we flagged the first time.',
      },
      {
        q: 'Is my application confidential?',
        a: 'Yes. We treat everything as confidential. We sign NDAs on request — just ask in your application or during the follow-up conversation.',
      },
    ],
  },
  {
    label: 'Deal Terms',
    title: 'Deal Structure & Terms',
    items: [
      {
        q: 'Can I negotiate the terms?',
        a: 'Yes. The initial term sheet is a starting point, not a take-it-or-leave-it offer. We discuss the specifics on the founder call. Deal structure, equity percentage, revenue share cap, and scope are all negotiable.',
      },
      {
        q: 'What if I can\'t decide between equity and revenue share?',
        a: 'We\'ll recommend based on your specific situation on the discovery call. Equity makes more sense for high-growth-potential startups. Revenue share makes more sense for businesses with clear, near-term revenue. We\'ll walk through the math together.',
      },
      {
        q: 'Who owns the code?',
        a: 'You do. 100%. Regardless of deal model. Always. This is non-negotiable from our side — it\'s written into every agreement. No vendor lock-in, ever.',
      },
      {
        q: 'What if I want to add features after the initial build?',
        a: 'Additional features are available through Studio at standard rates, or we can extend the Ventures terms to cover them if the scope is significant. We discuss this on the deal call so there are no surprises.',
      },
      {
        q: 'What happens if the partnership doesn\'t work out?',
        a: 'You keep the code — always. SocioFi keeps our equity or revenue share rights under the signed agreement. We don\'t have the ability to take the product from you, and we wouldn\'t want to.',
      },
    ],
  },
  {
    label: 'Build Process',
    title: 'What Gets Built and How',
    items: [
      {
        q: 'Is the build quality the same as Studio?',
        a: 'Identical. Same engineers. Same AI-powered development process. Same architecture standards and code quality. The only difference is how the project is paid for — not how it\'s built.',
      },
      {
        q: 'How long does the build take?',
        a: '2–6 weeks, same as Studio. Timeline depends on scope. We agree on the scope and timeline before signing — there are no surprises on delivery dates.',
      },
      {
        q: 'Do I get updates during the build?',
        a: 'Weekly progress updates, same as Studio. You\'ll see what\'s been built, what\'s next, and any questions we have for you. You\'re never in the dark.',
      },
      {
        q: 'Can I request changes during the build?',
        a: 'Within the agreed scope, yes. Minor adjustments and refinements are expected and welcome. Major scope changes — adding a whole new feature, changing the core product direction — are discussed separately and may affect the agreed terms.',
      },
    ],
  },
  {
    label: 'Post-Launch',
    title: 'After You Launch',
    items: [
      {
        q: 'What support do I get after launch?',
        a: '3 months of Services monitoring, maintenance, and bug fixes — included in the deal. Plus 6 months of SocioFi Cloud hosting. Both are part of every Ventures agreement at no extra cost.',
      },
      {
        q: 'What happens when the free period ends?',
        a: 'Continue with Services and Cloud plans at standard rates, or go fully independent. Your code runs anywhere — there\'s no lock-in. We\'d love to keep working together, but the choice is always yours.',
      },
      {
        q: 'Can I use SocioFi Agents?',
        a: 'Yes, at partner pricing. Ventures founders get access to SocioFi Agents at a discount for things like automated customer support, internal tools, and workflow automation.',
      },
      {
        q: 'Will SocioFi help me fundraise?',
        a: "We don't do fundraising advisory. But our track record as your technical partner strengthens your pitch — investors want to see solid engineering behind a product. We can speak to the technical quality of what we built if asked.",
      },
    ],
  },
  {
    label: 'Legal',
    title: 'Legal & Agreements',
    items: [
      {
        q: 'What legal structure is used?',
        a: 'Standard investment agreement for the equity model, or a revenue share agreement for revenue share or hybrid models. We recommend that both sides have independent legal counsel review before signing. It protects everyone.',
      },
      {
        q: 'Can I use my own lawyer?',
        a: "Please do. We strongly encourage it. We cover our own legal costs. You cover yours. If you don't have a lawyer, we can recommend resources — but we can't advise you legally.",
      },
    ],
  },
];

// ── Accordion Item Component ───────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={index * 0.05}>
      <div className={`faq-item${open ? ' faq-open' : ''}`}>
        <button
          className="faq-item-btn"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <span className="faq-q">{q}</span>
          <span className="faq-chevron"><ChevronDown /></span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="faq-item-body">{a}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function FAQPage() {
  return (
    <main className="faq-wrap">
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="faq-hero">
        <div className="faq-hero-inner">
          <Reveal>
            <div className="faq-badge">Frequently Asked Questions</div>
            <h1 className="faq-h1">
              Everything You Want to Know About{' '}
              <span className="faq-gradient-text">Ventures.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ Categories ── */}
      <section className="faq-section">
        <div className="faq-container">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="faq-category-group">
              <Reveal>
                <div className="faq-category-label">{cat.label}</div>
                <div className="faq-category-title">{cat.title}</div>
              </Reveal>
              <div className="faq-accordion">
                {cat.items.map((item, i) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="faq-final-cta">
        <Reveal>
          <div className="faq-category-label" style={{ justifyContent: 'center', display: 'flex' }}>
            Still Have Questions?
          </div>
          <h2 className="faq-cta-h2">Apply and ask on the call.</h2>
          <p className="faq-cta-sub">
            The founder call is 60 minutes. Bring every question you have. We&apos;ll answer all of them.
          </p>
          <Link href="/ventures/apply" className="faq-btn-primary">
            Apply to Ventures <ArrowRight />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
