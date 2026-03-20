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
.ff-wrap { background: var(--bg); color: var(--text-primary); min-height: 100vh; font-family: ${F.b}; overflow-x: hidden; }

/* ── Hero ── */
.ff-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
.ff-hero-inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 2; }
.ff-canvas { position: absolute; inset: 0; pointer-events: none; }

.ff-badge {
  display: inline-flex; align-items: center; gap: 10px; justify-content: center;
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 28px;
}
.ff-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; flex-shrink: 0; }
[data-theme="light"] .ff-badge { color: ${A_DARK}; }
[data-theme="light"] .ff-badge::before { background: ${A_DARK}; }

.ff-h1 {
  font-family: ${F.h}; font-size: clamp(2.4rem, 4.5vw, 3.6rem); font-weight: 800;
  line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary);
  margin-bottom: 24px;
}
.ff-gradient-text {
  background: linear-gradient(135deg, #4A85CC, ${A}, #9BC0F0);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
@media (forced-colors: active) { .ff-gradient-text { -webkit-text-fill-color: unset; } }

.ff-sub {
  font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary);
  max-width: 580px; margin: 0 auto;
}

/* ── Shared section styles ── */
.ff-section { padding: 100px 32px; background: var(--bg); }
.ff-section-alt { padding: 100px 32px; background: var(--bg-2); }
.ff-container { max-width: 1100px; margin: 0 auto; }
.ff-centered { text-align: center; }
.ff-centered .ff-sec-label { justify-content: center; }

.ff-sec-label {
  display: flex; align-items: center; gap: 10px;
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 14px;
}
.ff-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; flex-shrink: 0; }
[data-theme="light"] .ff-sec-label { color: ${A_DARK}; }
[data-theme="light"] .ff-sec-label::before { background: ${A_DARK}; }

.ff-sec-h2 {
  font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700;
  line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary);
  margin-bottom: 16px;
}

/* ── Buttons ── */
.ff-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; background: linear-gradient(135deg, #4A85CC, ${A});
  color: #fff; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem;
  font-weight: 600; text-decoration: none; transition: all 0.2s;
}
.ff-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(107,163,232,0.35); }
.ff-btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border: 1.5px solid var(--border);
  color: var(--text-primary); border-radius: 100px; font-family: ${F.h};
  font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s;
}
.ff-btn-ghost:hover { border-color: ${A}; color: ${A}; }
.ff-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 32px; }

/* ── Section intro ── */
.ff-section-intro {
  max-width: 700px; margin: 0 auto 56px;
}
.ff-section-intro.ff-centered { text-align: center; }

/* ── Checklist items ── */
.ff-list { display: flex; flex-direction: column; gap: 16px; margin-top: 40px; max-width: 700px; }
.ff-list-item { display: flex; align-items: flex-start; gap: 16px; }
.ff-list-icon { flex-shrink: 0; margin-top: 1px; }
.ff-list-text { font-size: 1rem; line-height: 1.65; color: var(--text-secondary); }
.ff-list-text strong { color: var(--text-primary); font-weight: 600; }

/* ── Two-column choose layout ── */
.ff-choose-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 20px; }
@media (max-width: 768px) { .ff-choose-grid { grid-template-columns: 1fr; } }

.ff-choose-col {
  padding: 36px; border-radius: 20px;
  background: var(--bg-card); border: 1px solid var(--border);
  transition: all 0.35s;
}
.ff-choose-col.ff-ventures-col { border-left: 3px solid ${A}; }
.ff-choose-col.ff-studio-col { border-left: 3px solid var(--border); }
.ff-choose-col:hover { border-color: var(--border-hover); }
.ff-choose-col.ff-ventures-col:hover { border-left-color: ${A}; }

.ff-choose-col-title {
  font-family: ${F.h}; font-size: 1.2rem; font-weight: 700;
  color: var(--text-primary); margin-bottom: 24px;
}

/* ── "Neither" section ── */
.ff-neither-box {
  max-width: 700px; margin: 0 auto;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 20px; padding: 40px 44px;
}
.ff-neither-note {
  margin-top: 32px; padding: 20px 24px; border-radius: 12px;
  background: ${A}08; border: 1px solid ${A}20;
  font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7;
  font-style: italic;
}

/* ── Decision Tree ── */
.ff-tree { max-width: 680px; margin: 48px auto 0; }
.ff-tree-question {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 16px; padding: 28px 32px; margin-bottom: 0;
  position: relative; overflow: hidden;
}
.ff-tree-question.ff-active { border-color: ${A}40; }
.ff-tree-question::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, #4A85CC, ${A});
  opacity: 0; transition: opacity 0.3s;
}
.ff-tree-question.ff-active::before { opacity: 1; }

.ff-tree-q-text {
  font-family: ${F.h}; font-size: 1.05rem; font-weight: 600;
  color: var(--text-primary); margin-bottom: 20px;
}
.ff-tree-step-num {
  font-family: ${F.m}; font-size: 0.7rem; color: ${A};
  letter-spacing: 0.08em; margin-bottom: 10px; text-transform: uppercase;
}
.ff-tree-btns { display: flex; gap: 12px; flex-wrap: wrap; }
.ff-tree-btn {
  padding: 10px 22px; border-radius: 100px; font-family: ${F.h};
  font-size: 0.88rem; font-weight: 600; cursor: pointer;
  border: 1.5px solid var(--border); background: transparent;
  color: var(--text-primary); transition: all 0.2s;
}
.ff-tree-btn:hover { border-color: ${A}; color: ${A}; }
.ff-tree-btn.ff-selected { background: ${A}; border-color: ${A}; color: #fff; }

.ff-tree-connector {
  display: flex; justify-content: center; padding: 8px 0;
}
.ff-tree-result {
  padding: 24px 32px; border-radius: 16px; text-align: center;
  background: linear-gradient(135deg, ${A}12, var(--bg-card));
  border: 1.5px solid ${A}30; margin-top: 0;
}
.ff-tree-result-label {
  font-family: ${F.m}; font-size: 0.7rem; color: ${A};
  letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 10px;
}
.ff-tree-result-text {
  font-family: ${F.h}; font-size: 1.05rem; font-weight: 700;
  color: var(--text-primary); margin-bottom: 14px;
}
.ff-tree-result.ff-result-stop {
  background: rgba(234,100,100,0.06); border-color: rgba(234,100,100,0.2);
}
.ff-tree-result.ff-result-stop .ff-tree-result-label { color: #E46464; }

/* ── Final CTA ── */
.ff-final-cta { padding: 100px 32px; background: linear-gradient(135deg, ${A}12, var(--bg-2), ${A}08); text-align: center; }
.ff-cta-h2 {
  font-family: ${F.h}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700;
  color: var(--text-primary); margin-bottom: 16px; letter-spacing: -0.025em;
}
.ff-cta-sub { font-size: 1.05rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }

@media (max-width: 768px) {
  .ff-hero { padding: 120px 20px 80px; }
  .ff-section, .ff-section-alt { padding: 80px 20px; }
  .ff-final-cta { padding: 80px 20px; }
  .ff-neither-box { padding: 28px 24px; }
  .ff-tree-question { padding: 24px; }
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
const ArrowRight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = ({ color = A }: { color?: string }) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={1.5} opacity={0.25} />
    <polyline points="8 12 11 15 16 9" />
  </svg>
);

const ArrowNeutral = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const XIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#E46464" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="#E46464" strokeWidth={1.5} opacity={0.25} />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const ConnectorArrow = () => (
  <svg width={24} height={32} viewBox="0 0 24 32" fill="none" aria-hidden="true">
    <line x1="12" y1="0" x2="12" y2="24" stroke={`${A}40`} strokeWidth={1.5} strokeDasharray="4 3" />
    <polyline points="6 20 12 28 18 20" stroke={`${A}60`} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Decision Tree Component ────────────────────────────────────────────────
function DecisionTree() {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const answer = (q: number, val: string) => {
    const next: Record<number, string> = {};
    for (let i = 0; i < q; i++) next[i] = answers[i];
    next[q] = val;
    setAnswers(next);
  };

  const q1Answer = answers[0];
  const q2Answer = answers[1];
  const q3Answer = answers[2];

  return (
    <div className="ff-tree">
      {/* Q1 */}
      <div className={`ff-tree-question ${!q1Answer ? 'ff-active' : ''}`}>
        <div className="ff-tree-step-num">Question 1 of 3</div>
        <div className="ff-tree-q-text">Do you have validated demand? (A waitlist, paying customers, or multiple conversations where someone offered to pay)</div>
        <div className="ff-tree-btns">
          <button className={`ff-tree-btn${q1Answer === 'yes' ? ' ff-selected' : ''}`} onClick={() => answer(0, 'yes')}>Yes</button>
          <button className={`ff-tree-btn${q1Answer === 'no' ? ' ff-selected' : ''}`} onClick={() => answer(0, 'no')}>No, not yet</button>
        </div>
      </div>

      <AnimatePresence>
        {q1Answer === 'no' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="ff-tree-connector"><ConnectorArrow /></div>
            <div className="ff-tree-result ff-result-stop">
              <div className="ff-tree-result-label">Get validation first</div>
              <div className="ff-tree-result-text">Ventures requires validated demand before accepting an application. Come back once you have real signal — even 3-5 people who said &ldquo;I&apos;d pay for this.&rdquo;</div>
            </div>
          </motion.div>
        )}
        {q1Answer === 'yes' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="ff-tree-connector"><ConnectorArrow /></div>
            {/* Q2 */}
            <div className={`ff-tree-question ${q1Answer && !q2Answer ? 'ff-active' : ''}`}>
              <div className="ff-tree-step-num">Question 2 of 3</div>
              <div className="ff-tree-q-text">Do you have the budget to pay Studio rates? ($8K–$20K upfront for your project)</div>
              <div className="ff-tree-btns">
                <button className={`ff-tree-btn${q2Answer === 'yes' ? ' ff-selected' : ''}`} onClick={() => answer(1, 'yes')}>Yes, I have budget</button>
                <button className={`ff-tree-btn${q2Answer === 'no' ? ' ff-selected' : ''}`} onClick={() => answer(1, 'no')}>No, budget is the issue</button>
              </div>
            </div>

            <AnimatePresence>
              {q2Answer === 'yes' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                  <div className="ff-tree-connector"><ConnectorArrow /></div>
                  <div className="ff-tree-result">
                    <div className="ff-tree-result-label">Consider Studio</div>
                    <div className="ff-tree-result-text">If you have budget, Studio is faster and cleaner — no equity or revenue obligations. You own 100% from day one.</div>
                    <Link href="/studio" className="ff-btn-primary" style={{ display: 'inline-flex', marginTop: 16 }}>
                      Explore Studio <ArrowRight />
                    </Link>
                  </div>
                </motion.div>
              )}
              {q2Answer === 'no' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                  <div className="ff-tree-connector"><ConnectorArrow /></div>
                  {/* Q3 */}
                  <div className={`ff-tree-question ${q2Answer && !q3Answer ? 'ff-active' : ''}`}>
                    <div className="ff-tree-step-num">Question 3 of 3</div>
                    <div className="ff-tree-q-text">Are you open to giving SocioFi equity or a revenue share in exchange for building the product?</div>
                    <div className="ff-tree-btns">
                      <button className={`ff-tree-btn${q3Answer === 'yes' ? ' ff-selected' : ''}`} onClick={() => answer(2, 'yes')}>Yes, I&apos;m open to it</button>
                      <button className={`ff-tree-btn${q3Answer === 'no' ? ' ff-selected' : ''}`} onClick={() => answer(2, 'no')}>No, I want to keep everything</button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {q3Answer === 'no' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                        <div className="ff-tree-connector"><ConnectorArrow /></div>
                        <div className="ff-tree-result ff-result-stop">
                          <div className="ff-tree-result-label">Ventures may not be the right fit</div>
                          <div className="ff-tree-result-text">Ventures is built on a genuine partnership. If equity or revenue share isn&apos;t an option, consider saving for Studio or exploring a co-founder relationship instead.</div>
                        </div>
                      </motion.div>
                    )}
                    {q3Answer === 'yes' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                        <div className="ff-tree-connector"><ConnectorArrow /></div>
                        <div className="ff-tree-result">
                          <div className="ff-tree-result-label">Apply to Ventures</div>
                          <div className="ff-tree-result-text">You&apos;ve got validated demand, you need a builder, and you&apos;re open to a partnership. That&apos;s exactly who Ventures is for.</div>
                          <Link href="/ventures/apply" className="ff-btn-primary" style={{ display: 'inline-flex', marginTop: 16 }}>
                            Apply Now <ArrowRight />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ForFoundersPage() {
  return (
    <main className="ff-wrap">
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="ff-hero">
        <div className="ff-hero-inner">
          <Reveal>
            <div className="ff-badge">Is Ventures Right for Me?</div>
            <h1 className="ff-h1">
              A <span className="ff-gradient-text">Honest Decision Guide</span>
              <br />for Founders.
            </h1>
            <p className="ff-sub">
              Not everyone who visits Ventures should apply. Here&apos;s how to figure out if this is the right path for you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Section 1: Choose Ventures ── */}
      <section className="ff-section-alt">
        <div className="ff-container">
          <div className="ff-choose-grid">
            <div>
              <Reveal>
                <div className="ff-sec-label">The Fit</div>
                <h2 className="ff-sec-h2">Choose Ventures if:</h2>
              </Reveal>
              <div className="ff-list">
                {[
                  'You have deep domain expertise in your target market',
                  'You have validated demand (waitlist, conversations, or early customers)',
                  'You know how the product will make money',
                  'You cannot afford Studio pricing right now',
                  'You\'re ready to work full-time on growth once the product is built',
                  'You\'re excited about having SocioFi as a long-term technical partner',
                ].map((item, i) => (
                  <Reveal key={item} delay={i * 0.07}>
                    <div className="ff-list-item">
                      <div className="ff-list-icon"><CheckIcon color={A} /></div>
                      <div className="ff-list-text">{item}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.5}>
                <div className="ff-btns" style={{ justifyContent: 'flex-start', marginTop: 36 }}>
                  <Link href="/ventures/apply" className="ff-btn-primary">
                    Apply to Ventures <ArrowRight />
                  </Link>
                </div>
              </Reveal>
            </div>

            <div>
              <Reveal>
                <div className="ff-sec-label">The Alternative</div>
                <h2 className="ff-sec-h2">Choose Studio if:</h2>
              </Reveal>
              <div className="ff-list">
                {[
                  'You have budget for a full project ($8K–$20K)',
                  'You want speed without equity or revenue obligations',
                  'You\'ve already validated and just need the product built fast',
                  'You need a one-off project without an ongoing partnership',
                  'You want full control without any SocioFi stake in your company',
                ].map((item, i) => (
                  <Reveal key={item} delay={i * 0.07}>
                    <div className="ff-list-item">
                      <div className="ff-list-icon"><ArrowNeutral /></div>
                      <div className="ff-list-text">{item}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.45}>
                <div className="ff-btns" style={{ justifyContent: 'flex-start', marginTop: 36 }}>
                  <Link href="/studio" className="ff-btn-ghost">
                    Explore Studio <ArrowRight />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Consider Waiting ── */}
      <section className="ff-section">
        <div className="ff-container">
          <Reveal>
            <div className="ff-centered">
              <div className="ff-sec-label">Honest Assessment</div>
              <h2 className="ff-sec-h2">Consider waiting if:</h2>
            </div>
          </Reveal>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <div className="ff-neither-box">
              <div className="ff-list">
                {[
                  'Your idea isn\'t validated yet (no one has expressed willingness to pay)',
                  'You don\'t have a revenue model ("we\'ll figure it out later")',
                  'This is a hobby project — you\'re not planning to commit full time',
                  'You\'re not sure you\'ll work in this industry full time',
                ].map((item, i) => (
                  <Reveal key={item} delay={i * 0.08}>
                    <div className="ff-list-item">
                      <div className="ff-list-icon"><XIcon /></div>
                      <div className="ff-list-text">{item}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.4}>
                <div className="ff-neither-note">
                  We&apos;d rather you come back with a stronger application than apply now and get rejected. Come back when you have validation.
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Decision Tree ── */}
      <section className="ff-section-alt">
        <div className="ff-container">
          <Reveal>
            <div className="ff-centered">
              <div className="ff-sec-label">Find Your Path</div>
              <h2 className="ff-sec-h2">Three Questions to Find Your Answer.</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
                Answer honestly. There are no wrong answers — only answers that help you pick the right next step.
              </p>
            </div>
          </Reveal>

          <DecisionTree />
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="ff-final-cta">
        <Reveal>
          <div className="ff-sec-label" style={{ justifyContent: 'center', display: 'flex' }}>
            What&apos;s next
          </div>
          <h2 className="ff-cta-h2">Ready for Ventures?</h2>
          <p className="ff-cta-sub">
            Apply in 10 minutes. We respond within 7 business days. Every application reviewed personally.
          </p>
          <div className="ff-btns">
            <Link href="/ventures/apply" className="ff-btn-primary">
              Apply to Ventures <ArrowRight />
            </Link>
            <Link href="/studio" className="ff-btn-ghost">
              Explore Studio instead
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
