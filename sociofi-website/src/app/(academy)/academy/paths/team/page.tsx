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
.tp-hero {
  min-height: 52vh;
  display: flex;
  align-items: center;
  padding: 130px 0 68px;
  position: relative;
  overflow: hidden;
}
.tp-hero::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 640px; height: 640px;
  background: radial-gradient(circle, rgba(232,184,77,0.07) 0%, transparent 68%);
  pointer-events: none;
}
.tp-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
.tp-label {
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
.tp-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.tp-hero-title {
  font-family: ${F.h};
  font-size: clamp(1.9rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 18px;
  max-width: 720px;
}
.tp-hero-sub {
  font-family: ${F.b};
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.72;
  max-width: 580px;
}
.tp-section-label {
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
.tp-section-label::before {
  content: '';
  width: 20px; height: 1.5px;
  background: ${A};
  display: inline-block;
  flex-shrink: 0;
}
.tp-section-title {
  font-family: ${F.h};
  font-size: clamp(1.4rem, 2.8vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 20px;
}

/* ── Why ── */
.tp-why-section {
  padding: 72px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.tp-why-body {
  font-family: ${F.b};
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.75;
  max-width: 680px;
}

/* ── Timeline ── */
.tp-timeline-section {
  padding: 80px 0;
  background: var(--bg);
}
.tp-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}
.tp-timeline::before {
  content: '';
  position: absolute;
  left: 31px;
  top: 48px;
  bottom: 48px;
  width: 1.5px;
  background: linear-gradient(to bottom, rgba(232,184,77,0.5), rgba(232,184,77,0.1));
}
@media (max-width: 640px) { .tp-timeline::before { display: none; } }
.tp-step {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 28px;
  align-items: start;
  padding-bottom: 40px;
  position: relative;
}
@media (max-width: 640px) { .tp-step { grid-template-columns: 1fr; } }
.tp-step-num-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}
.tp-step-num {
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
.tp-step-why {
  font-family: ${F.m};
  font-size: 0.58rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: 6px;
  letter-spacing: 0.04em;
  max-width: 60px;
}
.tp-step-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.35s ease;
}
.tp-step-card:hover { border-color: rgba(232,184,77,0.3); transform: translateX(4px); }
.tp-step-thumb { height: 80px; }
.tp-step-body { padding: 20px; }
.tp-step-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.tp-step-duration {
  font-family: ${F.m};
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  background: var(--bg-2);
  padding: 3px 8px;
  border-radius: 100px;
  border: 1px solid var(--border);
}
.tp-step-price {
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 700;
  color: ${A};
}
.tp-step-title {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
  line-height: 1.3;
}
.tp-step-outcome {
  font-family: ${F.b};
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.55;
  margin-bottom: 14px;
}
.tp-step-enroll {
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
.tp-step-enroll:hover { opacity: 0.75; }

/* ── Outcomes ── */
.tp-outcomes-section {
  padding: 72px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.tp-outcomes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
@media (max-width: 768px) { .tp-outcomes-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .tp-outcomes-grid { grid-template-columns: 1fr; } }
.tp-outcome-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}
.tp-outcome-check {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: rgba(232,184,77,0.12);
  border: 1px solid rgba(232,184,77,0.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  color: ${A};
}
.tp-outcome-text {
  font-family: ${F.b};
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

/* ── Bundle ── */
.tp-bundle-section {
  padding: 80px 0;
  background: var(--bg);
}
.tp-bundle-card {
  background: linear-gradient(135deg, var(--bg-card), rgba(232,184,77,0.04));
  border: 1.5px solid rgba(232,184,77,0.35);
  border-radius: 20px;
  padding: 40px 36px;
  max-width: 600px;
  position: relative;
  overflow: hidden;
}
.tp-bundle-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, ${A}, rgba(232,184,77,0.3));
}
.tp-bundle-badge {
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
.tp-bundle-title {
  font-family: ${F.h};
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 6px;
}
.tp-bundle-pricing {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 6px;
}
.tp-bundle-price {
  font-family: ${F.h};
  font-size: 2.4rem;
  font-weight: 800;
  color: ${A};
}
.tp-bundle-original {
  font-family: ${F.b};
  font-size: 0.9rem;
  color: var(--text-muted);
  text-decoration: line-through;
}
.tp-bundle-save {
  font-family: ${F.m};
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}
.tp-bundle-cta {
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
.tp-bundle-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(232,184,77,0.4); }
.tp-bundle-note {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0;
}

/* ── Corporate Notice ── */
.tp-corporate-notice {
  margin-top: 20px;
  padding: 18px 20px;
  background: rgba(232,184,77,0.06);
  border: 1px solid rgba(232,184,77,0.18);
  border-radius: 12px;
  max-width: 600px;
  font-family: ${F.b};
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
.tp-corporate-notice a {
  color: ${A};
  text-decoration: none;
  font-weight: 600;
}
.tp-corporate-notice a:hover { opacity: 0.8; }

/* ── Individual ── */
.tp-individuals-section {
  padding: 48px 0 72px;
  background: var(--bg);
  border-top: 1px solid var(--border);
}
.tp-individual-label {
  font-family: ${F.b};
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}
.tp-individual-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
@media (max-width: 768px) { .tp-individual-grid { grid-template-columns: 1fr; } }
.tp-ind-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
}
.tp-ind-card:hover { border-color: rgba(232,184,77,0.3); transform: translateY(-3px); }
.tp-ind-price {
  font-family: ${F.h};
  font-size: 1rem;
  font-weight: 800;
  color: ${A};
  margin-bottom: 6px;
}
.tp-ind-name {
  font-family: ${F.h};
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.3;
}
.tp-ind-meta {
  font-family: ${F.m};
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

/* ── Testimonial ── */
.tp-testimonial-section {
  padding: 72px 0;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
}
.tp-testimonial-wrap { max-width: 680px; }
.tp-testimonial-quote {
  font-family: ${F.h};
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.6;
  letter-spacing: -0.01em;
  font-style: italic;
  margin-bottom: 20px;
}
.tp-testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}
.tp-testimonial-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(232,184,77,0.3), rgba(77,191,168,0.3));
  border: 1.5px solid rgba(232,184,77,0.3);
  display: flex; align-items: center; justify-content: center;
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 800;
  color: ${A};
}
.tp-testimonial-name {
  font-family: ${F.h};
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}
.tp-testimonial-meta {
  font-family: ${F.b};
  font-size: 0.75rem;
  color: var(--text-muted);
}
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
    whyNow: 'The foundation',
    title: 'Technical Literacy for Non-Technical Teams',
    duration: '6 hours',
    price: '$149',
    outcome: 'Understand how software is built, what APIs and databases are, and how modern AI development tools work. The foundation everyone on the team needs.',
    gradient: 'linear-gradient(135deg,rgba(77,191,168,0.2),rgba(232,184,77,0.25))',
    slug: 'technical-literacy-for-teams',
  },
  {
    num: '2',
    whyNow: 'Apply it today',
    title: 'Working with AI Agents in Your Organization',
    duration: '3 hours',
    price: '$79',
    outcome: 'Learn how to collaborate with AI agents in your workflows: what to delegate, what to oversee, and how to give useful feedback when things go wrong.',
    gradient: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(232,184,77,0.2))',
    slug: 'working-with-ai-agents',
  },
  {
    num: '3',
    whyNow: 'Stop the panic',
    title: 'Reading Technical Documentation (Without Panicking)',
    duration: '2 hours',
    price: '$39',
    outcome: 'Understand what developers actually write. Parse API docs, technical specs, and README files without needing a translator.',
    gradient: 'linear-gradient(135deg,rgba(232,184,77,0.15),rgba(91,181,224,0.2))',
    slug: 'reading-technical-documentation',
  },
];

const OUTCOMES = [
  'Join technical meetings as an active participant, not a bystander',
  'Write requirements and tickets that developers can actually use',
  'Work alongside AI agents without guessing what they need',
  'Read a technical document without needing a translator',
  'Know when to escalate a technical issue vs handle it yourself',
  'Collaborate across the business-engineering gap with confidence',
];

const rveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } };

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TeamPathPage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="tp-hero">
        <div className="tp-inner">
          <motion.div {...rveal}>
            <div className="tp-label">Team Path</div>
            <h1 className="tp-hero-title">The Team's Path to Technical Literacy</h1>
            <p className="tp-hero-sub">
              3 courses. 11 hours. The technical baseline every non-technical team member needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Why ── */}
      <section className="tp-why-section">
        <div className="tp-inner">
          <motion.div {...rveal}>
            <div className="tp-section-label">Why this path exists</div>
            <h2 className="tp-section-title">The gap nobody addresses.</h2>
            <p className="tp-why-body">
              Your team works alongside developers, evaluates AI tools, and interfaces with technical decisions every day — but nobody gave them the foundation to do it confidently. The result: meetings that waste everyone's time, requirements that get misunderstood, and AI tools that go unused because nobody knows how to work with them. This path fixes the foundation. Three courses, in order, that build real technical fluency from scratch — no coding required, no prior knowledge assumed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Course Timeline ── */}
      <section className="tp-timeline-section">
        <div className="tp-inner">
          <motion.div {...rveal}>
            <div className="tp-section-label">Course sequence</div>
            <h2 className="tp-section-title">Three courses, in order.</h2>
          </motion.div>
          <div className="tp-timeline">
            {STEPS.map((step, i) => (
              <motion.div key={step.num} className="tp-step"
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="tp-step-num-wrap">
                  <div className="tp-step-num">{step.num}</div>
                  <div className="tp-step-why">{step.whyNow}</div>
                </div>
                <div className="tp-step-card">
                  <div className="tp-step-thumb" style={{ background: step.gradient }} />
                  <div className="tp-step-body">
                    <div className="tp-step-meta">
                      <span className="tp-step-duration">{step.duration}</span>
                      <span className="tp-step-price">{step.price}</span>
                    </div>
                    <div className="tp-step-title">{step.title}</div>
                    <p className="tp-step-outcome">{step.outcome}</p>
                    <Link href={`/academy/enroll?course=${step.slug}`} className="tp-step-enroll">
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
      <section className="tp-outcomes-section">
        <div className="tp-inner">
          <motion.div {...rveal}>
            <div className="tp-section-label">What your team will be able to do</div>
            <h2 className="tp-section-title">After the Team Path.</h2>
          </motion.div>
          <div className="tp-outcomes-grid">
            {OUTCOMES.map((outcome, i) => (
              <motion.div key={i} className="tp-outcome-item"
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <div className="tp-outcome-check"><Check size={10} /></div>
                <span className="tp-outcome-text">{outcome}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bundle ── */}
      <section className="tp-bundle-section">
        <div className="tp-inner">
          <motion.div {...rveal}>
            <div className="tp-section-label">Best value</div>
            <h2 className="tp-section-title">Get the bundle.</h2>
          </motion.div>
          <motion.div className="tp-bundle-card"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="tp-bundle-badge">Team Bundle — All 3 Courses</div>
            <div className="tp-bundle-title">Get all 3 courses for $199/person</div>
            <div className="tp-bundle-pricing">
              <span className="tp-bundle-price">$199</span>
              <span className="tp-bundle-original">$267 individually</span>
            </div>
            <div className="tp-bundle-save">Save 25% per person · Lifetime access to all 3 courses</div>
            <Link href="/academy/enroll?bundle=team" className="tp-bundle-cta">
              Enroll in Team Bundle <ArrowRight size={14} />
            </Link>
            <p className="tp-bundle-note">Includes: Technical Literacy for Teams + Working with AI Agents + Reading Technical Documentation</p>
          </motion.div>

          <motion.div className="tp-corporate-notice"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            For teams of 5 or more, <Link href="/academy/corporate">see corporate pricing</Link> for significant per-seat savings — plus live sessions, custom scheduling, and post-training support included.
          </motion.div>
        </div>
      </section>

      {/* ── Individual Courses ── */}
      <section className="tp-individuals-section">
        <div className="tp-inner">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="tp-individual-label">Or enroll in individual courses:</p>
            <div className="tp-individual-grid">
              {STEPS.map((step, i) => (
                <motion.div key={step.num}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <Link href={`/academy/enroll?course=${step.slug}`} className="tp-ind-card">
                    <div className="tp-ind-price">{step.price}</div>
                    <div className="tp-ind-name">{step.title}</div>
                    <div className="tp-ind-meta">{step.duration}</div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="tp-testimonial-section">
        <div className="tp-inner">
          <motion.div className="tp-testimonial-wrap" {...rveal}>
            <p className="tp-testimonial-quote">
              "Our ops team was involved in a lot of technical decisions they didn't fully understand. After this path, they started catching issues in requirements before dev even saw them. The time we saved in back-and-forth alone was worth it."
            </p>
            <div className="tp-testimonial-author">
              <div className="tp-testimonial-avatar">N</div>
              <div>
                <div className="tp-testimonial-name">Nadia R.</div>
                <div className="tp-testimonial-meta">Operations Director, e-commerce company</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
