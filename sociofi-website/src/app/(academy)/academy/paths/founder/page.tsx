'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// ── Constants ────────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.fp-hero {
  min-height: 52vh;
  display: flex;
  align-items: center;
  padding: 130px 0 68px;
  position: relative;
  overflow: hidden;
}
.fp-hero::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 640px; height: 640px;
  background: radial-gradient(circle, rgba(232,184,77,0.07) 0%, transparent 68%);
  pointer-events: none;
}
.fp-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
.fp-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.fp-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.fp-hero-title {
  font-family: ${F.h};
  font-size: clamp(1.9rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 18px;
  max-width: 720px;
}
.fp-hero-sub {
  font-family: ${F.b};
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.72;
  max-width: 580px;
}

/* ── Why Section ── */
.fp-why-section {
  padding: 72px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.fp-section-label {
  font-family: ${F.m};
  font-size: 0.72rem;
  font-weight: 500;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.fp-section-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.fp-section-title {
  font-family: ${F.h};
  font-size: clamp(1.4rem, 2.8vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 20px;
}
.fp-why-body {
  font-family: ${F.b};
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.75;
  max-width: 680px;
}

/* ── Timeline ── */
.fp-timeline-section {
  padding: 80px 0;
  background: var(--bg);
}
.fp-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}
.fp-timeline::before {
  content: '';
  position: absolute;
  left: 31px;
  top: 48px;
  bottom: 48px;
  width: 1.5px;
  background: linear-gradient(to bottom, rgba(232,184,77,0.5), rgba(232,184,77,0.1));
}
@media (max-width: 640px) {
  .fp-timeline::before { display: none; }
}
.fp-step {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 28px;
  align-items: start;
  padding-bottom: 40px;
  position: relative;
}
@media (max-width: 640px) { .fp-step { grid-template-columns: 1fr; } }
.fp-step-num-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  position: relative;
  z-index: 1;
}
.fp-step-num {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: rgba(232,184,77,0.12);
  border: 1.5px solid rgba(232,184,77,0.4);
  display: flex; align-items: center; justify-content: center;
  font-family: ${F.h};
  font-size: 1.4rem;
  font-weight: 800;
  color: ${A};
  flex-shrink: 0;
}
.fp-step-why {
  font-family: ${F.m};
  font-size: 0.58rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: 6px;
  letter-spacing: 0.04em;
  max-width: 60px;
}
.fp-step-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.35s ease;
}
.fp-step-card:hover { border-color: rgba(232,184,77,0.3); transform: translateX(4px); }
.fp-step-thumb {
  height: 80px;
  position: relative;
}
.fp-step-body { padding: 20px; }
.fp-step-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.fp-step-duration {
  font-family: ${F.m};
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  background: var(--bg-2);
  padding: 3px 8px;
  border-radius: 100px;
  border: 1px solid var(--border);
}
.fp-step-price {
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 700;
  color: ${A};
}
.fp-step-title {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
  line-height: 1.3;
}
.fp-step-outcome {
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.55;
  margin-bottom: 14px;
}
.fp-step-enroll {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: ${F.m};
  font-size: 0.65rem;
  color: ${A};
  text-decoration: none;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.fp-step-enroll:hover { opacity: 0.75; }

/* ── Outcomes ── */
.fp-outcomes-section {
  padding: 72px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.fp-outcomes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
@media (max-width: 768px) { .fp-outcomes-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .fp-outcomes-grid { grid-template-columns: 1fr; } }
.fp-outcome-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}
.fp-outcome-check {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: rgba(232,184,77,0.12);
  border: 1px solid rgba(232,184,77,0.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  color: ${A};
}
.fp-outcome-text {
  font-family: ${F.b};
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

/* ── Bundle CTA ── */
.fp-bundle-section {
  padding: 80px 0;
  background: var(--bg);
}
.fp-bundle-card {
  background: linear-gradient(135deg, var(--bg-card), rgba(232,184,77,0.04));
  border: 1.5px solid rgba(232,184,77,0.35);
  border-radius: 20px;
  padding: 40px 36px;
  max-width: 640px;
  position: relative;
  overflow: hidden;
}
.fp-bundle-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, ${A}, rgba(232,184,77,0.3));
}
.fp-bundle-badge {
  display: inline-block;
  background: rgba(232,184,77,0.12);
  border: 1px solid rgba(232,184,77,0.3);
  color: ${A};
  font-family: ${F.m};
  font-size: 0.6rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 100px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 18px;
}
.fp-bundle-title {
  font-family: ${F.h};
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 6px;
}
.fp-bundle-pricing {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 6px;
}
.fp-bundle-price {
  font-family: ${F.h};
  font-size: 2.4rem;
  font-weight: 800;
  color: ${A};
}
.fp-bundle-original {
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-muted);
  text-decoration: line-through;
}
.fp-bundle-save {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}
.fp-bundle-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(135deg, ${A}, #d4a33a);
  color: #1a1a1a;
  font-family: ${F.h};
  font-size: 0.92rem;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.22s ease;
  box-shadow: 0 4px 20px rgba(232,184,77,0.3);
  margin-bottom: 12px;
}
.fp-bundle-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(232,184,77,0.4); }
.fp-bundle-note {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* ── Individual Courses ── */
.fp-individuals-section {
  padding: 48px 0 72px;
  background: var(--bg);
  border-top: 1px solid var(--border);
}
.fp-individual-label {
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}
.fp-individual-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
@media (max-width: 1024px) { .fp-individual-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .fp-individual-grid { grid-template-columns: 1fr; } }
.fp-ind-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
}
.fp-ind-card:hover { border-color: rgba(232,184,77,0.3); transform: translateY(-3px); }
.fp-ind-price {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: ${A};
  margin-bottom: 6px;
}
.fp-ind-name {
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.3;
}
.fp-ind-meta {
  font-family: ${F.m};
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

/* ── Testimonial ── */
.fp-testimonial-section {
  padding: 72px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.fp-testimonial-wrap {
  max-width: 680px;
}
.fp-testimonial-quote {
  font-family: ${F.h};
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.6;
  letter-spacing: -0.01em;
  font-style: italic;
  margin-bottom: 20px;
}
.fp-testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}
.fp-testimonial-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(232,184,77,0.3), rgba(74,108,184,0.3));
  border: 1.5px solid rgba(232,184,77,0.3);
  display: flex; align-items: center; justify-content: center;
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 800;
  color: ${A};
}
.fp-testimonial-name {
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}
.fp-testimonial-meta {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* ── Next Step ── */
.fp-next-section {
  padding: 72px 0 80px;
  background: var(--bg);
}
.fp-next-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px 32px;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.fp-next-eyebrow {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.fp-next-title {
  font-family: ${F.h};
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.fp-next-body {
  font-family: ${F.b};
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.65;
}
.fp-next-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  color: ${A};
  text-decoration: none;
}
.fp-next-link:hover { opacity: 0.8; }
`;

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function Check({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: '1',
    whyNow: 'Start here',
    title: 'From Idea to MVP',
    duration: '3 hours',
    price: '$59',
    outcome: 'Understand the fastest path from concept to working product. Leave with a structured plan for your own idea.',
    whyOrder: 'Start with the big picture before diving into details.',
    gradient: 'linear-gradient(135deg,rgba(232,184,77,0.25),rgba(232,184,77,0.4))',
    href: '/academy/courses/from-idea-to-mvp',
  },
  {
    num: '2',
    whyNow: 'Build on it',
    title: 'How to Spec a Software Product',
    duration: '4 hours',
    price: '$79',
    outcome: 'Write requirements that developers can actually build from. Stop losing time to misunderstandings.',
    whyOrder: 'Learn to articulate exactly what you need.',
    gradient: 'linear-gradient(135deg,rgba(232,184,77,0.25),rgba(74,108,184,0.2))',
    href: '/academy/courses/how-to-spec-a-software-product',
  },
  {
    num: '3',
    whyNow: 'Go deeper',
    title: 'AI Development for Founders',
    duration: '6 hours',
    price: '$149',
    outcome: 'Understand how AI builds software. Evaluate vendor proposals, timelines, and technical decisions with confidence.',
    whyOrder: 'Understand the technology powering your product.',
    gradient: 'linear-gradient(135deg,rgba(232,184,77,0.3),rgba(114,196,178,0.2))',
    href: '/academy/courses/ai-development-for-founders',
  },
  {
    num: '4',
    whyNow: 'Future-proof',
    title: 'Understanding AI Agents for Business',
    duration: '4 hours',
    price: '$99',
    outcome: 'Understand what AI agents are, what they can replace, and how to evaluate whether you need them.',
    whyOrder: "Learn what's coming and what it means for you.",
    gradient: 'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(232,184,77,0.25))',
    href: '/academy/courses/understanding-ai-agents-for-business',
  },
];

const OUTCOMES = [
  'Evaluate a developer\'s proposal without needing a translator',
  'Write a product spec that development teams can actually build from',
  'Understand how AI tools are used in real software development',
  'Spot when a timeline is unrealistic before you sign anything',
  'Know the right questions to ask in any technical conversation',
  'Decide whether you need AI agents and what that means for your product',
];

const rveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } };

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FounderPathPage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="fp-hero">
        <div className="fp-inner">
          <motion.div {...rveal}>
            <div className="fp-label">Founder Path</div>
            <h1 className="fp-hero-title">The Founder's Path to Technical Confidence</h1>
            <p className="fp-hero-sub">
              4 courses. 17 hours. Everything you need to lead a software project without writing code.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Why This Path ── */}
      <section className="fp-why-section">
        <div className="fp-inner">
          <motion.div {...rveal}>
            <div className="fp-section-label">Why this path exists</div>
            <h2 className="fp-section-title">The wall most founders hit.</h2>
            <p className="fp-why-body">
              Most founders we work with hit the same wall: they can see what the product should do, but they can't evaluate whether the team is doing it right. They sign proposals they don't understand, accept timelines that are wrong, and can't tell good code from bad. This path fixes that. Four courses, in a specific order, each building on the last — so by the end you can lead a software project with real confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Course Timeline ── */}
      <section className="fp-timeline-section">
        <div className="fp-inner">
          <motion.div {...rveal}>
            <div className="fp-section-label">Course sequence</div>
            <h2 className="fp-section-title">Four courses, in order.</h2>
          </motion.div>
          <div className="fp-timeline">
            {STEPS.map((step, i) => (
              <motion.div key={step.num} className="fp-step"
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="fp-step-num-wrap">
                  <div className="fp-step-num">{step.num}</div>
                  <div className="fp-step-why">{step.whyNow}</div>
                </div>
                <div className="fp-step-card">
                  <div className="fp-step-thumb" style={{ background: step.gradient }} />
                  <div className="fp-step-body">
                    <div className="fp-step-meta">
                      <span className="fp-step-duration">{step.duration}</span>
                      <span className="fp-step-price">{step.price}</span>
                    </div>
                    <div className="fp-step-title">{step.title}</div>
                    <p className="fp-step-outcome">{step.outcome}</p>
                    <Link href={`/academy/enroll?course=${step.href.split('/').pop()}`} className="fp-step-enroll">
                      Enroll <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outcomes ── */}
      <section className="fp-outcomes-section">
        <div className="fp-inner">
          <motion.div {...rveal}>
            <div className="fp-section-label">What you'll be able to do</div>
            <h2 className="fp-section-title">After the Founder Path.</h2>
          </motion.div>
          <div className="fp-outcomes-grid">
            {OUTCOMES.map((outcome, i) => (
              <motion.div key={i} className="fp-outcome-item"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <div className="fp-outcome-check"><Check size={10} /></div>
                <span className="fp-outcome-text">{outcome}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bundle CTA ── */}
      <section className="fp-bundle-section">
        <div className="fp-inner">
          <motion.div {...rveal}>
            <div className="fp-section-label">Best value</div>
            <h2 className="fp-section-title">Get the bundle.</h2>
          </motion.div>
          <motion.div className="fp-bundle-card"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="fp-bundle-badge">Founder Bundle — All 4 Courses</div>
            <div className="fp-bundle-title">Get all 4 courses for $299</div>
            <div className="fp-bundle-pricing">
              <span className="fp-bundle-price">$299</span>
              <span className="fp-bundle-original">$386 individually</span>
            </div>
            <div className="fp-bundle-save">Save 23% · Lifetime access to all 4 courses</div>
            <Link href="/academy/enroll?bundle=founder" className="fp-bundle-cta">
              Enroll in Founder Bundle <ArrowRight size={14} />
            </Link>
            <p className="fp-bundle-note">Includes: From Idea to MVP + How to Spec a Software Product + AI Development for Founders + Understanding AI Agents for Business</p>
          </motion.div>
        </div>
      </section>

      {/* ── Individual Courses ── */}
      <section className="fp-individuals-section">
        <div className="fp-inner">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="fp-individual-label">Or enroll in individual courses:</p>
            <div className="fp-individual-grid">
              {STEPS.map((step, i) => (
                <motion.div key={step.num}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <Link href={`/academy/enroll?course=${step.href.split('/').pop()}`} className="fp-ind-card">
                    <div className="fp-ind-price">{step.price}</div>
                    <div className="fp-ind-name">{step.title}</div>
                    <div className="fp-ind-meta">{step.duration}</div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="fp-testimonial-section">
        <div className="fp-inner">
          <motion.div className="fp-testimonial-wrap" {...rveal}>
            <p className="fp-testimonial-quote">
              "Before this path, every meeting with my developers felt like I was just nodding along. After the AI Development for Founders course specifically, I could actually push back on their estimates with real reasons. We saved weeks on the first build cycle."
            </p>
            <div className="fp-testimonial-author">
              <div className="fp-testimonial-avatar">R</div>
              <div>
                <div className="fp-testimonial-name">Rashed K.</div>
                <div className="fp-testimonial-meta">Founder, logistics SaaS startup</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Next Step ── */}
      <section className="fp-next-section">
        <div className="fp-inner">
          <motion.div {...rveal}>
            <div className="fp-section-label">What comes next</div>
            <h2 className="fp-section-title">After the Founder Path.</h2>
          </motion.div>
          <motion.div className="fp-next-card"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="fp-next-eyebrow">Recommended next step</div>
            <div className="fp-next-title">Start a Studio project.</div>
            <p className="fp-next-body">
              Most Founder Path graduates start a Studio project within 90 days. You'll have the language to scope it clearly and the knowledge to evaluate the proposal. You won't sign anything you don't understand.
            </p>
            <Link href="/studio/solutions/for-founders" className="fp-next-link">
              See how Studio works for founders <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
