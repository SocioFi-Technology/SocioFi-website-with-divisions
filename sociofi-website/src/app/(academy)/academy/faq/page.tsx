'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ── Constants ────────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Scroll Reveal ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
function ChevronDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  label: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    id: 'courses',
    label: 'Courses',
    items: [
      {
        q: "Do I need a technical background?",
        a: "No. Every course is designed for non-technical professionals. We explain concepts clearly without assuming prior knowledge. If you can read a business proposal, you can follow our courses.",
      },
      {
        q: "How long do I have access?",
        a: "Lifetime. Once enrolled, you can rewatch every lesson, redownload all materials, and access future updates forever. There is no expiry, no renewal fee, and no time limit.",
      },
      {
        q: "Are the courses self-paced?",
        a: "Yes. Start immediately after enrollment, watch at your own speed, and pause and resume at any point. Most learners complete individual courses in 1-2 focused sessions.",
      },
      {
        q: "Is there a certificate?",
        a: "Yes. Every course includes a digital certificate of completion you can share on LinkedIn or include in your profile. SCARL graduates additionally receive the full SCARL certification badge — our highest credential.",
      },
      {
        q: "What if I don't finish?",
        a: "You keep lifetime access regardless. Most courses are 2-6 hours total, but there is no deadline. Many learners revisit specific modules later when a situation comes up where it's relevant.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes — 30-day money-back guarantee. If you complete a course and aren't satisfied, email us within 30 days and we'll refund in full. No questions asked, no hoops to jump through.",
      },
      {
        q: "Are courses updated?",
        a: "Yes. We update content as AI development tools, frameworks, and best practices evolve. AI moves fast, and our courses reflect what's actually happening on projects today. All updates are free for existing enrollees.",
      },
      {
        q: "What devices can I use?",
        a: "All courses are fully responsive and work on desktop, tablet, and mobile. Download materials for offline use on any device.",
      },
    ],
  },
  {
    id: 'workshops',
    label: 'Workshops',
    items: [
      {
        q: "What platform are workshops on?",
        a: "All workshops run on Zoom. You'll receive a link and calendar invite when you register. No special software installation required.",
      },
      {
        q: "What if I can't attend the live session?",
        a: "We record all workshops. The recording and any shared materials are sent to registered attendees within 24 hours of the session. You won't miss the content — though live attendance means you can ask questions in real time.",
      },
      {
        q: "Are workshops included with course enrollment?",
        a: "No. Workshops are separate from courses and have separate registration. Free webinars are open to anyone. Paid workshops require registration.",
      },
      {
        q: "Can I ask questions during workshops?",
        a: "Yes. All workshops include live Q&A — that's the main reason to attend live rather than watching the recording. Come with your specific situation and get direct answers.",
      },
      {
        q: "What's the refund policy on workshops?",
        a: "Full refund if you cancel more than 48 hours before the session. Within 48 hours, you'll receive the recording and materials instead.",
      },
    ],
  },
  {
    id: 'scarl',
    label: 'SCARL Certification',
    items: [
      {
        q: "What is SCARL?",
        a: "SocioFi Certified AI-Ready Leader. A 6-week structured program combining self-paced content, weekly live sessions, and a practical final assessment. It's the most rigorous program in the Academy catalog, designed for professionals who want a formal credential.",
      },
      {
        q: "Is the assessment an exam?",
        a: "No. The assessment is practical: evaluate a real technical proposal and write a project brief. We're testing whether you can do the work, not whether you can remember definitions. If you can do this well, you're ready to lead AI development projects.",
      },
      {
        q: "How much time does it take?",
        a: "Roughly 4 hours per week for 6 weeks. That's self-paced module content (your schedule) plus one hour of weekly live sessions (scheduled). Total commitment: approximately 24 hours.",
      },
      {
        q: "Can I take SCARL at my own pace?",
        a: "The self-paced modules are fully flexible — complete them whenever works for you each week. The weekly live sessions are scheduled, but recordings are available within 24 hours if you miss one.",
      },
      {
        q: "Is there a corporate SCARL rate?",
        a: "Yes. Groups of 5 or more receive pricing at $349 per person (versus $499 individual). For larger cohorts, contact us for custom pricing. See our corporate page for full details.",
      },
      {
        q: "What's the refund policy?",
        a: "Full refund if you withdraw before Week 2 begins. After Week 2 starts, refunds are not available — you have access to all content for the full 6 weeks regardless.",
      },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    items: [
      {
        q: "What payment methods do you accept?",
        a: "Credit and debit cards via Stripe. Visa, Mastercard, and American Express are supported. We don't store your card details — all payment processing is handled by Stripe.",
      },
      {
        q: "Can I get a corporate invoice?",
        a: "Yes. For teams of 5 or more, we can provide a formal invoice for accounting and expense reporting. Contact us with your team size and we'll arrange it.",
      },
      {
        q: "Are there discounts for multiple courses?",
        a: "Yes — bundles save between 23% and 34% depending on which bundle you choose. The Complete Academy bundle (all 10 courses) offers the highest savings. See /academy/pricing for the full breakdown.",
      },
      {
        q: "Do prices include tax?",
        a: "Prices listed are before any applicable taxes based on your location. Tax, if applicable, is calculated and displayed at checkout before you complete your purchase.",
      },
      {
        q: "Can I upgrade from an individual course to a bundle?",
        a: "Yes. Contact our support team and we'll credit what you've already paid toward the bundle price. You only pay the difference.",
      },
    ],
  },
  {
    id: 'corporate',
    label: 'Corporate Training',
    items: [
      {
        q: "How is corporate training different from buying team seats?",
        a: "Corporate training includes customization for your organization's context, private sessions for your team only, scheduling flexibility, a dedicated account manager, and volume pricing. Seat purchases give individuals access to the standard course catalog. Corporate is the right choice when you want a program tailored to your team.",
      },
      {
        q: "Can you train in Bangla or other languages?",
        a: "Please inquire directly. We can discuss language options for corporate programs depending on the program and team size. Our default delivery is in English.",
      },
      {
        q: "Is in-person training available?",
        a: "Yes, in Dhaka, Bangladesh. Virtual delivery is available globally for all programs. In-person sessions include hands-on components not available in virtual format.",
      },
      {
        q: "How quickly can you start?",
        a: "Typically 2-3 weeks from initial inquiry to first session. This allows time for needs assessment, customization, and scheduling. Expedited starts may be possible — contact us to discuss.",
      },
    ],
  },
];

// ── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.faq-page { background: var(--bg); min-height: 100vh; }

/* Hero */
.faq-hero {
  padding: 160px 32px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.faq-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 800px 400px at 50% 0%, rgba(232,184,77,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.faq-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.faq-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: ${A};
  display: inline-block;
}
.faq-hero-title {
  font-family: ${F.h};
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin: 0 auto 16px;
  max-width: 600px;
}
.faq-hero-sub {
  font-family: ${F.b};
  font-size: 1.1rem;
  line-height: 1.75;
  color: var(--text-secondary);
  max-width: 580px;
  margin: 0 auto;
}

/* Content */
.faq-content {
  padding: 60px 32px 120px;
  max-width: 860px;
  margin: 0 auto;
}

/* Category */
.faq-category {
  margin-bottom: 64px;
}
.faq-cat-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}
.faq-cat-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: ${A};
}

/* Accordion */
.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.faq-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.3s;
}
.faq-item.open {
  border-color: ${A}44;
}
.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: ${F.h};
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}
.faq-question:hover { color: ${A}; }
.faq-chevron {
  flex-shrink: 0;
  color: var(--text-muted);
  transition: transform 0.3s ease, color 0.3s;
}
.faq-item.open .faq-chevron {
  transform: rotate(180deg);
  color: ${A};
}
.faq-answer-wrap {
  overflow: hidden;
}
.faq-answer {
  padding: 0 24px 20px;
  font-family: ${F.b};
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-secondary);
  border-top: 1px solid var(--border);
  padding-top: 16px;
}

/* Still have questions */
.faq-contact {
  background: var(--bg-2);
  padding: 80px 32px;
  text-align: center;
}
.faq-contact-inner { max-width: 500px; margin: 0 auto; }
.faq-contact-title {
  font-family: ${F.h};
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}
.faq-contact-sub {
  font-family: ${F.b};
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 28px;
}
.faq-contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${A};
  color: #0C0C1D;
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  border-radius: 100px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px ${A}44;
}
.faq-contact-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 32px ${A}55;
}

@media (max-width: 768px) {
  .faq-hero { padding: 120px 20px 60px; }
  .faq-content { padding: 40px 20px 80px; }
  .faq-contact { padding: 60px 20px; }
  .faq-question { padding: 16px 20px; font-size: 0.9rem; }
  .faq-answer { padding: 12px 20px 16px; }
}
`;

// ── Accordion Item ────────────────────────────────────────────────────────────
function FAQAccordionItem({ item, isOpen, onToggle }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <button className="faq-question" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.q}</span>
        <span className="faq-chevron"><ChevronDownIcon /></span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="faq-answer-wrap"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="faq-answer">{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, number | null>>({});

  const toggle = (catId: string, idx: number) => {
    setOpenItems(prev => ({
      ...prev,
      [catId]: prev[catId] === idx ? null : idx,
    }));
  };

  return (
    <main className="faq-page">
      <style>{STYLES}</style>

      {/* Hero */}
      <section className="faq-hero">
        <Reveal>
          <div className="faq-label">FAQ</div>
          <h1 className="faq-hero-title">Questions About Academy.</h1>
          <p className="faq-hero-sub">
            Everything about courses, workshops, certification, billing, and corporate training.
          </p>
        </Reveal>
      </section>

      {/* FAQ Content */}
      <section className="faq-content">
        {FAQ_DATA.map((cat, ci) => (
          <Reveal key={cat.id} delay={ci * 0.05}>
            <div className="faq-category">
              <div className="faq-cat-label">{cat.label}</div>
              <div className="faq-accordion">
                {cat.items.map((item, i) => (
                  <FAQAccordionItem
                    key={i}
                    item={item}
                    isOpen={openItems[cat.id] === i}
                    onToggle={() => toggle(cat.id, i)}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Still have questions */}
      <section className="faq-contact">
        <Reveal>
          <div className="faq-contact-inner">
            <h2 className="faq-contact-title">Still have questions?</h2>
            <p className="faq-contact-sub">
              If your question isn&apos;t covered above, send us a message.
              We typically respond within one business day.
            </p>
            <Link href="/contact" className="faq-contact-btn">
              Contact Us
              <ArrowRightIcon />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
