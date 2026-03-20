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
.lp-hero {
  min-height: 52vh;
  display: flex;
  align-items: center;
  padding: 130px 0 68px;
  position: relative;
  overflow: hidden;
}
.lp-hero::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 640px; height: 640px;
  background: radial-gradient(circle, rgba(232,184,77,0.07) 0%, transparent 68%);
  pointer-events: none;
}
.lp-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
.lp-label {
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
.lp-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.lp-hero-title {
  font-family: ${F.h};
  font-size: clamp(1.9rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 18px;
  max-width: 720px;
}
.lp-hero-sub {
  font-family: ${F.b};
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.72;
  max-width: 580px;
}
.lp-section-label {
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
.lp-section-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.lp-section-title {
  font-family: ${F.h};
  font-size: clamp(1.4rem, 2.8vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 20px;
}

/* ── Why ── */
.lp-why-section {
  padding: 72px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.lp-why-body {
  font-family: ${F.b};
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.75;
  max-width: 680px;
}

/* ── Timeline ── */
.lp-timeline-section {
  padding: 80px 0;
  background: var(--bg);
}
.lp-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}
.lp-timeline::before {
  content: '';
  position: absolute;
  left: 31px;
  top: 48px;
  bottom: 48px;
  width: 1.5px;
  background: linear-gradient(to bottom, rgba(232,184,77,0.5), rgba(232,184,77,0.1));
}
@media (max-width: 640px) { .lp-timeline::before { display: none; } }
.lp-step {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 28px;
  align-items: start;
  padding-bottom: 40px;
  position: relative;
}
@media (max-width: 640px) { .lp-step { grid-template-columns: 1fr; } }
.lp-step-num-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}
.lp-step-num {
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
.lp-step-why {
  font-family: ${F.m};
  font-size: 0.58rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: 6px;
  letter-spacing: 0.04em;
  max-width: 60px;
}
.lp-step-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.35s ease;
}
.lp-step-card:hover { border-color: rgba(232,184,77,0.3); transform: translateX(4px); }
.lp-step-thumb {
  height: 80px;
}
.lp-step-body { padding: 20px; }
.lp-step-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.lp-step-duration {
  font-family: ${F.m};
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  background: var(--bg-2);
  padding: 3px 8px;
  border-radius: 100px;
  border: 1px solid var(--border);
}
.lp-step-price {
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 700;
  color: ${A};
}
.lp-step-title {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
  line-height: 1.3;
}
.lp-step-outcome {
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.55;
  margin-bottom: 14px;
}
.lp-step-enroll {
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
.lp-step-enroll:hover { opacity: 0.75; }

/* ── Outcomes ── */
.lp-outcomes-section {
  padding: 72px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.lp-outcomes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
@media (max-width: 768px) { .lp-outcomes-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .lp-outcomes-grid { grid-template-columns: 1fr; } }
.lp-outcome-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}
.lp-outcome-check {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: rgba(232,184,77,0.12);
  border: 1px solid rgba(232,184,77,0.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  color: ${A};
}
.lp-outcome-text {
  font-family: ${F.b};
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

/* ── Bundle ── */
.lp-bundle-section {
  padding: 80px 0;
  background: var(--bg);
}
.lp-bundle-card {
  background: linear-gradient(135deg, var(--bg-card), rgba(232,184,77,0.04));
  border: 1.5px solid rgba(232,184,77,0.35);
  border-radius: 20px;
  padding: 40px 36px;
  max-width: 600px;
  position: relative;
  overflow: hidden;
}
.lp-bundle-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, ${A}, rgba(232,184,77,0.3));
}
.lp-bundle-badge {
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
.lp-bundle-title {
  font-family: ${F.h};
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 6px;
}
.lp-bundle-pricing {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 6px;
}
.lp-bundle-price {
  font-family: ${F.h};
  font-size: 2.4rem;
  font-weight: 800;
  color: ${A};
}
.lp-bundle-original {
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-muted);
  text-decoration: line-through;
}
.lp-bundle-save {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}
.lp-bundle-cta {
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
.lp-bundle-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(232,184,77,0.4); }
.lp-bundle-note {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* ── Individual ── */
.lp-individuals-section {
  padding: 48px 0 72px;
  background: var(--bg);
  border-top: 1px solid var(--border);
}
.lp-individual-label {
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}
.lp-individual-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
@media (max-width: 768px) { .lp-individual-grid { grid-template-columns: 1fr; } }
.lp-ind-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
}
.lp-ind-card:hover { border-color: rgba(232,184,77,0.3); transform: translateY(-3px); }
.lp-ind-price {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: ${A};
  margin-bottom: 6px;
}
.lp-ind-name {
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.3;
}
.lp-ind-meta {
  font-family: ${F.m};
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

/* ── Testimonial ── */
.lp-testimonial-section {
  padding: 72px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.lp-testimonial-wrap {
  max-width: 680px;
}
.lp-testimonial-quote {
  font-family: ${F.h};
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.6;
  letter-spacing: -0.01em;
  font-style: italic;
  margin-bottom: 20px;
}
.lp-testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}
.lp-testimonial-avatar {
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
.lp-testimonial-name {
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}
.lp-testimonial-meta {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* ── Next Step ── */
.lp-next-section {
  padding: 72px 0 80px;
  background: var(--bg);
}
.lp-next-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px 32px;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.lp-next-eyebrow {
  font-family: ${F.m};
  font-size: 0.62rem;
  color: ${A};
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.lp-next-title {
  font-family: ${F.h};
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.lp-next-body {
  font-family: ${F.b};
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.65;
}
.lp-next-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: ${F.h};
  font-size: 0.88rem;
  font-weight: 700;
  color: ${A};
  text-decoration: none;
}
.lp-next-link:hover { opacity: 0.8; }
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
    title: 'Managing AI-Powered Development',
    duration: '5 hours',
    price: '$129',
    outcome: 'Learn to manage teams and vendors using AI development tools. Understand sprints, reviews, and delivery milestones without needing to read code.',
    gradient: 'linear-gradient(135deg,rgba(232,184,77,0.2),rgba(77,191,168,0.2))',
    slug: 'managing-ai-powered-development',
  },
  {
    num: '2',
    whyNow: 'Understand the shift',
    title: 'The SaaS to AaaS Transition',
    duration: '3 hours',
    price: '$79',
    outcome: 'Understand what the shift from software-as-a-service to agent-as-a-service means for your business model, your vendor relationships, and your competitive landscape.',
    gradient: 'linear-gradient(135deg,rgba(74,108,184,0.2),rgba(232,184,77,0.3))',
    slug: 'saas-to-aaas-transition',
  },
  {
    num: '3',
    whyNow: 'Make better decisions',
    title: 'Build vs Buy vs Agent',
    duration: '2 hours',
    price: '$49',
    outcome: 'A decision framework with real cost analysis. Stop making $200k decisions based on gut feel — apply a structured approach every time.',
    gradient: 'linear-gradient(135deg,rgba(232,184,77,0.35),rgba(58,88,158,0.15))',
    slug: 'build-vs-buy-vs-agent',
  },
];

const OUTCOMES = [
  'Run a vendor evaluation with a clear framework',
  'Understand what AI agents replace — and what they don\'t',
  'Manage a development team without reading code',
  'Evaluate build vs buy decisions with real cost context',
  'Lead strategic conversations about AI adoption',
  'Know when to push back on a timeline or proposal',
];

const rveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } };

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LeaderPathPage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-inner">
          <motion.div {...rveal}>
            <div className="lp-label">Leader Path</div>
            <h1 className="lp-hero-title">The Leader's Path to AI Fluency</h1>
            <p className="lp-hero-sub">
              3 courses. 10 hours. The technical literacy every business leader needs in 2026.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Why ── */}
      <section className="lp-why-section">
        <div className="lp-inner">
          <motion.div {...rveal}>
            <div className="lp-section-label">Why this path exists</div>
            <h2 className="lp-section-title">The gap no one warned you about.</h2>
            <p className="lp-why-body">
              You're leading a team that works with AI tools and developers. You sit in meetings where half the conversation is in a language you don't fully understand. You approve budgets for projects you can't evaluate. You've nodded through enough vendor demos to last a lifetime. This path changes that. Three courses, each immediately applicable to your actual job — not a theory course, but a practical framework you'll use in the next meeting after you finish it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Course Timeline ── */}
      <section className="lp-timeline-section">
        <div className="lp-inner">
          <motion.div {...rveal}>
            <div className="lp-section-label">Course sequence</div>
            <h2 className="lp-section-title">Three courses, in order.</h2>
          </motion.div>
          <div className="lp-timeline">
            {STEPS.map((step, i) => (
              <motion.div key={step.num} className="lp-step"
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="lp-step-num-wrap">
                  <div className="lp-step-num">{step.num}</div>
                  <div className="lp-step-why">{step.whyNow}</div>
                </div>
                <div className="lp-step-card">
                  <div className="lp-step-thumb" style={{ background: step.gradient }} />
                  <div className="lp-step-body">
                    <div className="lp-step-meta">
                      <span className="lp-step-duration">{step.duration}</span>
                      <span className="lp-step-price">{step.price}</span>
                    </div>
                    <div className="lp-step-title">{step.title}</div>
                    <p className="lp-step-outcome">{step.outcome}</p>
                    <Link href={`/academy/enroll?course=${step.slug}`} className="lp-step-enroll">
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
      <section className="lp-outcomes-section">
        <div className="lp-inner">
          <motion.div {...rveal}>
            <div className="lp-section-label">What you'll be able to do</div>
            <h2 className="lp-section-title">After the Leader Path.</h2>
          </motion.div>
          <div className="lp-outcomes-grid">
            {OUTCOMES.map((outcome, i) => (
              <motion.div key={i} className="lp-outcome-item"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <div className="lp-outcome-check"><Check size={10} /></div>
                <span className="lp-outcome-text">{outcome}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bundle ── */}
      <section className="lp-bundle-section">
        <div className="lp-inner">
          <motion.div {...rveal}>
            <div className="lp-section-label">Best value</div>
            <h2 className="lp-section-title">Get the bundle.</h2>
          </motion.div>
          <motion.div className="lp-bundle-card"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="lp-bundle-badge">Leader Bundle — All 3 Courses</div>
            <div className="lp-bundle-title">Get all 3 courses for $199</div>
            <div className="lp-bundle-pricing">
              <span className="lp-bundle-price">$199</span>
              <span className="lp-bundle-original">$257 individually</span>
            </div>
            <div className="lp-bundle-save">Save 23% · Lifetime access to all 3 courses</div>
            <Link href="/academy/enroll?bundle=leader" className="lp-bundle-cta">
              Enroll in Leader Bundle <ArrowRight size={14} />
            </Link>
            <p className="lp-bundle-note">Includes: Managing AI-Powered Development + The SaaS to AaaS Transition + Build vs Buy vs Agent</p>
          </motion.div>
        </div>
      </section>

      {/* ── Individual Courses ── */}
      <section className="lp-individuals-section">
        <div className="lp-inner">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="lp-individual-label">Or enroll in individual courses:</p>
            <div className="lp-individual-grid">
              {STEPS.map((step, i) => (
                <motion.div key={step.num}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <Link href={`/academy/enroll?course=${step.slug}`} className="lp-ind-card">
                    <div className="lp-ind-price">{step.price}</div>
                    <div className="lp-ind-name">{step.title}</div>
                    <div className="lp-ind-meta">{step.duration}</div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="lp-testimonial-section">
        <div className="lp-inner">
          <motion.div className="lp-testimonial-wrap" {...rveal}>
            <p className="lp-testimonial-quote">
              "I've sat through 3 years of vendor demos not really knowing what I was evaluating. After Build vs Buy vs Agent, I ran our next vendor evaluation with an actual framework. We made a decision in 4 days that would have taken us 6 weeks before."
            </p>
            <div className="lp-testimonial-author">
              <div className="lp-testimonial-avatar">S</div>
              <div>
                <div className="lp-testimonial-name">Shadman A.</div>
                <div className="lp-testimonial-meta">Head of Product, financial services firm</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Next Step ── */}
      <section className="lp-next-section">
        <div className="lp-inner">
          <motion.div {...rveal}>
            <div className="lp-section-label">What comes next</div>
            <h2 className="lp-section-title">After the Leader Path.</h2>
          </motion.div>
          <motion.div className="lp-next-card"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="lp-next-eyebrow">Recommended next step</div>
            <div className="lp-next-title">See how Studio works for your organization.</div>
            <p className="lp-next-body">
              Most Leader Path graduates approach their next software project differently. They know what questions to ask, what to look for in proposals, and how to evaluate delivery. If your organization needs a product built, Studio is the next conversation.
            </p>
            <Link href="/studio/solutions/for-enterprises" className="lp-next-link">
              See how Studio works for organizations <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
