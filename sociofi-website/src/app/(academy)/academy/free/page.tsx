'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// ── Design tokens ─────────────────────────────────────────────────────────────
const A = '#E8B84D';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
  .free-page { background: var(--bg); min-height: 100vh; }

  /* Hero */
  .free-hero {
    min-height: 52vh; display: flex; align-items: center;
    padding: 120px 0 80px; position: relative; overflow: hidden;
  }
  .free-hero-orb1 { position: absolute; width: 600px; height: 600px; border-radius: 50%; filter: blur(120px); background: rgba(232,184,77,0.05); top: -150px; left: -200px; pointer-events: none; }
  .free-hero-orb2 { position: absolute; width: 400px; height: 400px; border-radius: 50%; filter: blur(100px); background: rgba(232,184,77,0.04); bottom: -100px; right: -100px; pointer-events: none; }
  .free-hero-inner { max-width: 900px; margin: 0 auto; padding: 0 32px; position: relative; z-index: 1; text-align: center; }
  .free-label {
    font-family: ${F.m}; font-size: 0.7rem; font-weight: 500; color: ${A};
    letter-spacing: 0.14em; text-transform: uppercase;
    display: inline-flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }
  .free-label::before, .free-label::after { content: ''; width: 24px; height: 1.5px; background: ${A}; display: inline-block; }
  .free-hero-title {
    font-family: ${F.h}; font-size: clamp(2.2rem, 4vw, 3rem); font-weight: 800;
    color: var(--text-primary); letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 20px;
  }
  .free-hero-sub { font-family: ${F.b}; font-size: 1.05rem; color: var(--text-secondary); line-height: 1.7; max-width: 600px; margin: 0 auto 16px; }
  .free-hero-note { font-family: ${F.b}; font-size: 0.82rem; color: var(--text-muted); }
  .free-hero-note strong { color: var(--text-secondary); }

  /* Section */
  .free-section { padding: 80px 32px; max-width: 1000px; margin: 0 auto; }
  .free-section-title { font-family: ${F.h}; font-size: 1.5rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; margin-bottom: 32px; }
  .free-divider { height: 1px; background: var(--border); margin: 0 32px; }

  /* Resource grid */
  .free-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  /* Base resource card */
  .free-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
    transition: all 0.35s ease; position: relative;
  }
  .free-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(232,184,77,0.1); border-color: rgba(232,184,77,0.25); }
  .free-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #D4A030, #E8B84D);
    opacity: 0; transition: opacity 0.3s;
  }
  .free-card:hover::before { opacity: 1; }

  /* Featured card (full span) */
  .free-card-featured {
    grid-column: 1 / -1;
    display: grid; grid-template-columns: 1fr 1fr; gap: 0;
  }
  .free-card-featured-visual {
    background: linear-gradient(135deg, rgba(232,184,77,0.15) 0%, rgba(212,160,48,0.08) 100%);
    border-right: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    padding: 40px; position: relative; overflow: hidden; min-height: 240px;
  }
  .free-card-featured-visual::before {
    content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%;
    border: 1.5px solid rgba(232,184,77,0.1);
    top: 50%; left: 50%; transform: translate(-50%, -50%);
  }
  .free-card-featured-visual::after {
    content: ''; position: absolute; width: 200px; height: 200px; border-radius: 50%;
    border: 1px solid rgba(232,184,77,0.08);
    top: 50%; left: 50%; transform: translate(-50%, -50%);
  }
  .free-play-btn {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, #D4A030, #E8B84D);
    display: flex; align-items: center; justify-content: center;
    position: relative; z-index: 1;
    box-shadow: 0 4px 20px rgba(232,184,77,0.35);
  }
  .free-card-body { padding: 32px; }
  .free-card-inner-body { padding: 24px; }

  /* Type badge */
  .free-type-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: ${F.m}; font-size: 0.58rem; color: ${A}; letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 12px;
  }
  .free-type-dot { width: 5px; height: 5px; border-radius: 50%; background: ${A}; flex-shrink: 0; }

  .free-card-title { font-family: ${F.h}; font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
  .free-card-title-sm { font-family: ${F.h}; font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
  .free-card-desc { font-family: ${F.b}; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 18px; }
  .free-card-meta { font-family: ${F.m}; font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.08em; margin-bottom: 18px; }
  .free-cta-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 22px; border-radius: 8px;
    background: linear-gradient(135deg, #D4A030, #E8B84D);
    color: #1a1a1a; font-family: ${F.h}; font-size: 0.82rem; font-weight: 700;
    text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
  }
  .free-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(232,184,77,0.4); }
  .free-cta-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 22px; border-radius: 8px;
    background: rgba(232,184,77,0.1); color: ${A};
    border: 1px solid rgba(232,184,77,0.3);
    font-family: ${F.h}; font-size: 0.82rem; font-weight: 700;
    text-decoration: none; transition: background 0.2s;
  }
  .free-cta-ghost:hover { background: rgba(232,184,77,0.18); }

  /* Assessment card */
  .free-assessment-inner { padding: 28px; display: flex; flex-direction: column; height: 100%; }
  .free-decision-tree { flex: 1; display: flex; align-items: center; justify-content: center; margin: 20px 0; }
  .free-dt-node { background: rgba(232,184,77,0.1); border: 1.5px solid rgba(232,184,77,0.3); border-radius: 8px; padding: 8px 14px; font-family: ${F.m}; font-size: 0.6rem; color: ${A}; letter-spacing: 0.06em; }
  .free-dt-arrow { font-family: ${F.b}; font-size: 0.75rem; color: var(--text-muted); margin: 0 8px; }

  /* Webinar card — calendar style date badge */
  .free-webinar-date {
    background: linear-gradient(135deg, #D4A030, #E8B84D);
    margin: 0 24px 16px; border-radius: 10px; padding: 12px 16px;
    display: flex; align-items: center; gap: 16px;
  }
  .free-web-day { font-family: ${F.h}; font-size: 2rem; font-weight: 800; color: #fff; line-height: 1; }
  .free-web-month { font-family: ${F.m}; font-size: 0.7rem; color: rgba(255,255,255,0.85); letter-spacing: 0.1em; }
  .free-web-label { font-family: ${F.b}; font-size: 0.82rem; color: rgba(255,255,255,0.9); font-weight: 500; }

  /* Downloads card — sub-items */
  .free-downloads-inner { padding: 24px; }
  .free-dl-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; margin-bottom: 16px; }
  .free-dl-item { background: var(--bg-2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 12px; transition: border-color 0.25s; }
  .free-dl-item:hover { border-color: rgba(232,184,77,0.25); }
  .free-dl-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(232,184,77,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .free-dl-info { flex: 1; }
  .free-dl-name { font-family: ${F.h}; font-size: 0.84rem; font-weight: 700; color: var(--text-primary); margin-bottom: 2px; }
  .free-dl-desc { font-family: ${F.b}; font-size: 0.75rem; color: var(--text-muted); }
  .free-dl-btn {
    display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;
    padding: 5px 12px; border-radius: 6px;
    background: rgba(232,184,77,0.1); color: ${A};
    border: 1px solid rgba(232,184,77,0.3);
    font-family: ${F.m}; font-size: 0.58rem; font-weight: 600; letter-spacing: 0.06em;
    text-decoration: none; transition: background 0.2s; margin-top: 2px; white-space: nowrap;
  }
  .free-dl-btn:hover { background: rgba(232,184,77,0.18); }
  .free-dl-note { font-family: ${F.b}; font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }

  /* Upsell */
  .free-upsell {
    background: var(--bg-2); border-top: 1px solid var(--border);
    padding: 80px 32px; text-align: center;
  }
  .free-upsell-inner { max-width: 560px; margin: 0 auto; }
  .free-upsell-eyebrow { font-family: ${F.m}; font-size: 0.65rem; color: ${A}; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 14px; }
  .free-upsell-title { font-family: ${F.h}; font-size: 1.4rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; margin-bottom: 12px; }
  .free-upsell-sub { font-family: ${F.b}; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 28px; }
  .free-upsell-row { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }
  .free-upsell-note { font-family: ${F.b}; font-size: 0.8rem; color: var(--text-muted); margin-top: 16px; }

  @media (max-width: 800px) {
    .free-grid { grid-template-columns: 1fr; }
    .free-card-featured { grid-template-columns: 1fr; }
    .free-card-featured-visual { min-height: 180px; }
    .free-card-featured-visual { border-right: none; border-bottom: 1px solid var(--border); }
  }
  @media (max-width: 600px) {
    .free-hero { padding: 100px 0 60px; }
    .free-section { padding: 60px 20px; }
    .free-divider { margin: 0 20px; }
    .free-upsell { padding: 60px 20px; }
    .free-dl-item { flex-direction: column; }
  }
`;

// ── Icons ─────────────────────────────────────────────────────────────────────
function IcoArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function IcoPlay() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(26,26,26,0.9)" stroke="none">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}
function IcoDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IcoCheckCircle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IcoMail() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FreeResourcesPage() {
  return (
    <>
      <style>{STYLES}</style>
      <main className="free-page">

        {/* Hero */}
        <section className="free-hero">
          <div className="free-hero-orb1" />
          <div className="free-hero-orb2" />
          <div className="free-hero-inner">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="free-label">Start Free</div>
            </motion.div>
            <motion.h1 className="free-hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
              Learn Something Valuable. On Us.
            </motion.h1>
            <motion.p className="free-hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.14 }}>
              No email wall. No credit card. No catch. Just useful content for people who want to understand AI development and AI agents.
            </motion.p>
            <motion.p className="free-hero-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.22 }}>
              Some templates require email — <strong>no spam, unsubscribe anytime</strong>.
            </motion.p>
          </div>
        </section>

        <div className="free-divider" />

        {/* Resources grid */}
        <section className="free-section">
          <h2 className="free-section-title">Free resources</h2>
          <div className="free-grid">

            {/* 1 — AI Development 101 mini-course (featured, full width) */}
            <motion.div
              className="free-card free-card-featured"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="free-card-featured-visual">
                <div className="free-play-btn"><IcoPlay /></div>
              </div>
              <div className="free-card-body">
                <div className="free-type-badge"><div className="free-type-dot" />Free Mini-Course</div>
                <h3 className="free-card-title">AI Development 101</h3>
                <p className="free-card-desc">
                  What happens when AI builds software? This 30-minute overview explains the entire process — from idea to live product — in plain English. 5 short lessons, no coding required.
                </p>
                <div className="free-card-meta">30 minutes &nbsp;&middot;&nbsp; 5 lessons &nbsp;&middot;&nbsp; No coding required</div>
                <Link href="/academy/courses/ai-development-101" className="free-cta-btn">
                  Start Course <IcoArrow />
                </Link>
              </div>
            </motion.div>

            {/* 2 — Build or Buy assessment */}
            <motion.div
              className="free-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.48, delay: 0.05 }}
            >
              <div className="free-assessment-inner">
                <div className="free-type-badge"><div className="free-type-dot" />Interactive Tool</div>
                <h3 className="free-card-title-sm">Should You Build or Buy?</h3>
                <p className="free-card-desc">
                  Answer 10 questions about your business. Get a clear recommendation: build custom, buy off-the-shelf, or deploy AI agents.
                </p>
                <div className="free-decision-tree">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div className="free-dt-node">BUILD</div>
                    <span className="free-dt-arrow">or</span>
                    <div className="free-dt-node">BUY</div>
                    <span className="free-dt-arrow">or</span>
                    <div className="free-dt-node">AGENTS</div>
                  </div>
                </div>
                <div className="free-card-meta" style={{ marginBottom: 16 }}>3 minutes &nbsp;&middot;&nbsp; 10 questions</div>
                <Link href="/academy/free/build-or-buy-assessment" className="free-cta-btn">
                  Take the Assessment <IcoArrow />
                </Link>
              </div>
            </motion.div>

            {/* 3 — Monthly webinar */}
            <motion.div
              className="free-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.48, delay: 0.1 }}
            >
              <div className="free-card-inner-body">
                <div className="free-type-badge"><div className="free-type-dot" />Free Webinar</div>
                <div className="free-webinar-date">
                  <div>
                    <div className="free-web-day">8</div>
                    <div className="free-web-month">APR</div>
                  </div>
                  <div className="free-web-label">AI Development Q&A — April Session</div>
                </div>
                <h3 className="free-card-title-sm">Ask Our Engineers Anything</h3>
                <p className="free-card-desc">
                  Join SocioFi engineers live for 90 minutes of questions about AI development, AI agents, and modern software. No slides. No sales pitch. Real answers.
                </p>
                <div className="free-card-meta">2:00 PM – 3:30 PM BST &nbsp;&middot;&nbsp; 90 minutes</div>
                <Link href="/academy/workshops/ai-development-101-q-a" className="free-cta-btn">
                  Register Free <IcoArrow />
                </Link>
              </div>
            </motion.div>

            {/* 4 — Downloadable templates */}
            <motion.div
              className="free-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.48, delay: 0.15 }}
            >
              <div className="free-downloads-inner">
                <div className="free-type-badge"><div className="free-type-dot" />Free Downloads</div>
                <h3 className="free-card-title-sm">3 Practical Templates</h3>
                <p className="free-card-desc" style={{ marginBottom: 0 }}>
                  The same tools we use with clients — now yours to keep.
                </p>
                <div className="free-dl-list">
                  <div className="free-dl-item">
                    <div className="free-dl-icon"><IcoDownload /></div>
                    <div className="free-dl-info">
                      <div className="free-dl-name">Product Spec Template</div>
                      <div className="free-dl-desc">The exact format we use for client proposals</div>
                      <Link href="#" className="free-dl-btn"><IcoCheckCircle /> Download Free</Link>
                    </div>
                  </div>
                  <div className="free-dl-item">
                    <div className="free-dl-icon"><IcoDownload /></div>
                    <div className="free-dl-info">
                      <div className="free-dl-name">Vendor Evaluation Checklist</div>
                      <div className="free-dl-desc">How to compare development teams objectively</div>
                      <Link href="#" className="free-dl-btn"><IcoCheckCircle /> Download Free</Link>
                    </div>
                  </div>
                  <div className="free-dl-item">
                    <div className="free-dl-icon"><IcoDownload /></div>
                    <div className="free-dl-info">
                      <div className="free-dl-name">Agent Readiness Assessment</div>
                      <div className="free-dl-desc">Is your business ready for AI agents?</div>
                      <Link href="#" className="free-dl-btn"><IcoCheckCircle /> Download Free</Link>
                    </div>
                  </div>
                </div>
                <div className="free-dl-note"><IcoMail /> Email required for templates — no spam, unsubscribe anytime</div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Upsell */}
        <section className="free-upsell">
          <div className="free-upsell-inner">
            <motion.div className="free-upsell-eyebrow" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              Want to go deeper?
            </motion.div>
            <motion.h2 className="free-upsell-title" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.06 }}>
              There&apos;s more when you&apos;re ready.
            </motion.h2>
            <motion.p className="free-upsell-sub" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}>
              Free resources give you the foundation. Courses go deeper with structure, exercises, and a record of your progress. SCARL gives you a credential you can actually show people.
            </motion.p>
            <motion.div className="free-upsell-row" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.14 }}>
              <Link href="/academy/courses" className="free-cta-btn">
                Browse All Courses <IcoArrow />
              </Link>
              <Link href="/academy/certification" className="free-cta-ghost">
                See SCARL Certification <IcoArrow />
              </Link>
            </motion.div>
            <motion.p className="free-upsell-note" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.2 }}>
              Academy courses start from $39. Lifetime access. 30-day money-back guarantee.
            </motion.p>
          </div>
        </section>

      </main>
    </>
  );
}
