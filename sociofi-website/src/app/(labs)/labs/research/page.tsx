'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Metadata } from 'next';

// ── Accent ───────────────────────────────────────────────────────────────────
const A = '#7B6FE8';

// ── Streams data ─────────────────────────────────────────────────────────────
const STREAMS = [
  {
    num: '01',
    slug: 'agent-architecture',
    title: 'Agent Architecture',
    question:
      'How do you build AI agents that are reliable, observable, and composable in production?',
    topics: ['Multi-agent coordination', 'Tool use', 'Memory systems', 'Failure recovery'],
    articles: 5,
    experiments: 8,
    findings: [
      'Orchestrator-worker is the only pattern that scales past 5 agents — every other coordination model degrades under load',
      'Agents lose coherence after ~30 minutes without explicit memory architecture — short-term context alone is insufficient',
      'Human oversight gates reduced critical failures by 94% in our FabricxAI deployment — position matters as much as presence',
      'Graceful degradation requires as much design effort as the happy path; agent systems without explicit failure modes degrade catastrophically',
    ],
  },
  {
    num: '02',
    slug: 'applied-ai',
    title: 'Applied AI',
    question:
      'What does AI actually do well — and where does it fail — in real production software?',
    topics: ['LLM benchmarking', 'Prompt engineering', 'RAG pipelines', 'Hallucination mitigation'],
    articles: 4,
    experiments: 7,
    findings: [
      'RAG retrieval quality, not model capability, is the dominant factor in answer accuracy for domain-specific questions',
      'Structured output extraction fails silently — models return plausible-looking JSON that violates the schema without signalling the error',
      'Prompt regression is real: a prompt that works well today degrades measurably after a model update, with no notification',
      'Hallucination mitigation via self-consistency checking adds 40–60% cost but reduces confident wrong answers by over 80%',
    ],
  },
  {
    num: '03',
    slug: 'developer-tooling',
    title: 'Developer Tooling',
    question:
      'How do we make AI-assisted development workflows faster, safer, and more auditable?',
    topics: ['AI code review', 'Testing automation', 'Spec-to-code pipelines', 'CI/CD with AI gates'],
    articles: 4,
    experiments: 6,
    findings: [
      'AI code review tools are abandoned within 2 weeks unless they surface issues engineers cannot easily catch manually — redundancy kills adoption',
      'Spec-to-code pipelines fail at the architecture layer: AI generates syntactically correct code built on structurally wrong assumptions',
      'Test generation from existing code achieves 82% average coverage (up from 45%) but consistently misses security and edge case scenarios',
      'AI deployment gates that block on uncertainty — rather than just flag — reduce production incidents by 67% with acceptable false-positive rates',
    ],
  },
  {
    num: '04',
    slug: 'industry-automation',
    title: 'Industry Automation',
    question:
      'Which vertical-specific business processes are genuinely automatable today, and which are not?',
    topics: ['Document processing', 'Customer communication', 'Data extraction', 'Workflow orchestration'],
    articles: 3,
    experiments: 5,
    findings: [
      'Document extraction accuracy degrades sharply on non-standard layouts — 94% on clean forms, 61% on free-form documents with the same model',
      'Customer communication automation works for high-volume, low-stakes interactions but requires mandatory human escalation paths; without them, the 15% error rate causes outsized damage',
      'Compliance automation in regulated industries requires explainability by default — "the AI decided" is not an acceptable audit trail in fintech or legal contexts',
      'Workflow orchestration bottlenecks are almost never technical — they are data quality and change management problems that AI amplifies rather than solves',
    ],
  },
];

// ── Recent experiments ────────────────────────────────────────────────────────
const EXPERIMENTS = [
  {
    title: 'Multi-model agent orchestration (routing by task complexity)',
    stream: 'Agent Architecture',
    streamSlug: 'agent-architecture',
    date: 'February 2026',
    status: 'success' as const,
    result: '40% cost reduction with no measurable quality loss. Now standard in all deployments.',
  },
  {
    title: 'Autonomous code review with no human reviewer',
    stream: 'Developer Tooling',
    streamSlug: 'developer-tooling',
    date: 'March 2026',
    status: 'failed' as const,
    result: 'Caught 60% of issues; missed every security vulnerability. Human gates are non-negotiable.',
  },
  {
    title: 'RAG pipeline with semantic query routing pre-retrieval',
    stream: 'Applied AI',
    streamSlug: 'applied-ai',
    date: 'January 2026',
    status: 'success' as const,
    result: 'Answer relevance improved 38%. Query routing is now a first-class architectural concern.',
  },
];

const STATUS_COLORS: Record<string, string> = {
  success: '#4DBFA8',
  partial: '#E8B84D',
  failed: '#E87070',
};
const STATUS_LABELS: Record<string, string> = {
  success: 'Confirmed',
  partial: 'Partial',
  failed: 'Disproven',
};

// ── Animations ────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: EASE } }),
};

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLES = `
.res-page { background: var(--bg); min-height: 100vh; }

/* Hero */
.res-hero {
  padding: 140px 0 80px;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
}
.res-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  color: ${A};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 20px;
}
.res-label::before {
  content: '';
  display: block;
  width: 18px;
  height: 1.5px;
  background: ${A};
}
.res-h1 {
  font-family: var(--font-headline);
  font-size: clamp(2.4rem, 4.5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin: 0 0 20px;
  max-width: 640px;
}
.res-subtitle {
  font-family: var(--font-body);
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--text-secondary);
  max-width: 520px;
  margin: 0;
}

/* Streams grid */
.res-streams {
  background: var(--bg-2);
  padding: 80px 0 100px;
}
.res-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
.res-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
@media (max-width: 900px) { .res-grid { grid-template-columns: 1fr; } }

/* Stream card */
.scard {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid ${A};
  border-radius: var(--radius-lg);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
  cursor: default;
}
.scard:hover {
  border-color: ${A};
  box-shadow: 0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(123,111,232,0.12);
  transform: translateY(-4px);
}
.scard-num {
  font-family: var(--font-mono);
  font-size: 3.2rem;
  font-weight: 600;
  color: ${A};
  opacity: 0.22;
  line-height: 1;
  letter-spacing: -0.04em;
}
.scard-head { display: flex; flex-direction: column; gap: 8px; }
.scard-title {
  font-family: var(--font-headline);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}
.scard-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4DBFA8;
  background: rgba(77,191,168,0.08);
  border: 1px solid rgba(77,191,168,0.18);
  border-radius: 999px;
  padding: 3px 10px;
  width: fit-content;
}
.scard-badge::before {
  content: '';
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #4DBFA8;
}
.scard-q {
  font-family: var(--font-body);
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-secondary);
  font-style: italic;
  border-left: 2px solid rgba(123,111,232,0.25);
  padding-left: 14px;
  margin: 0;
}
.scard-stats {
  display: flex;
  gap: 24px;
}
.scard-stat { display: flex; flex-direction: column; gap: 2px; }
.scard-stat-n {
  font-family: var(--font-headline);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}
.scard-stat-l {
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: var(--text-muted, #6B7A9B);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.scard-findings-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 500;
  color: ${A};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.scard-findings { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 9px; }
.scard-findings li {
  font-family: var(--font-body);
  font-size: 0.84rem;
  line-height: 1.55;
  color: var(--text-secondary);
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.scard-findings li::before {
  content: '—';
  color: ${A};
  opacity: 0.55;
  font-size: 0.78rem;
  flex-shrink: 0;
  margin-top: 1px;
}
.scard-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-headline);
  font-size: 0.85rem;
  font-weight: 600;
  color: ${A};
  text-decoration: none;
  margin-top: auto;
  padding-top: 8px;
  transition: gap 0.2s ease, opacity 0.2s ease;
}
.scard-link:hover { gap: 11px; opacity: 0.85; }
.scard-topics { display: flex; flex-wrap: wrap; gap: 6px; }
.scard-topic {
  font-family: var(--font-mono);
  font-size: 0.63rem;
  letter-spacing: 0.06em;
  color: var(--text-muted, #6B7A9B);
  background: var(--bg-3, rgba(255,255,255,0.04));
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 3px 8px;
}

/* Experiments section */
.res-exps { padding: 80px 0 100px; background: var(--bg); }
.res-sec-head { margin-bottom: 40px; }
.res-sec-label {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 500;
  color: ${A};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 10px;
  display: flex; align-items: center; gap: 10px;
}
.res-sec-label::before {
  content: '';
  display: block;
  width: 18px; height: 1.5px;
  background: ${A};
}
.res-sec-title {
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin: 0;
}
.exp-list { display: flex; flex-direction: column; gap: 2px; }
.exp-row {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 22px 28px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: center;
  transition: border-color 0.3s ease, background 0.3s ease;
}
.exp-row:hover { border-color: var(--border-hover); background: var(--bg-card-hover); }
.exp-left { display: flex; flex-direction: column; gap: 8px; }
.exp-title {
  font-family: var(--font-headline);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}
.exp-result {
  font-family: var(--font-body);
  font-size: 0.83rem;
  line-height: 1.55;
  color: var(--text-secondary);
}
.exp-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
.exp-stream {
  font-family: var(--font-mono);
  font-size: 0.63rem;
  letter-spacing: 0.08em;
  color: ${A};
  background: rgba(123,111,232,0.08);
  border: 1px solid rgba(123,111,232,0.15);
  border-radius: 4px;
  padding: 2px 8px;
  text-decoration: none;
}
.exp-stream:hover { background: rgba(123,111,232,0.14); }
.exp-date {
  font-family: var(--font-mono);
  font-size: 0.63rem;
  color: var(--text-muted, #6B7A9B);
  letter-spacing: 0.05em;
}
.exp-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.exp-badge {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid;
  white-space: nowrap;
}

/* CTA */
.res-cta {
  background: var(--bg-2);
  padding: 64px 0 80px;
  text-align: center;
}
.res-cta-inner { max-width: 560px; margin: 0 auto; padding: 0 32px; }
.res-cta-title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin: 0 0 10px;
}
.res-cta-desc {
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0 0 28px;
}
.res-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background: ${A};
  border: none;
  border-radius: 999px;
  padding: 13px 28px;
  text-decoration: none;
  transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 24px rgba(123,111,232,0.3);
}
.res-cta-btn:hover {
  opacity: 0.88;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(123,111,232,0.4);
}

@media (max-width: 768px) {
  .res-hero { padding: 120px 20px 60px; }
  .res-inner { padding: 0 20px; }
  .res-streams { padding: 60px 0 80px; }
  .res-exps { padding: 60px 0 80px; }
  .exp-row { grid-template-columns: 1fr; }
  .exp-right { flex-direction: row; align-items: center; flex-wrap: wrap; }
  .scard { padding: 24px; }
  /* ── Mobile: 1-column card grid ── */
  .res-grid { grid-template-columns: 1fr; }
  /* ── Mobile: center section headers ── */
  .res-label { justify-content: center; text-align: center; }
  .res-h1 { text-align: center; }
  .res-subtitle { text-align: center; margin-left: auto; margin-right: auto; }
}
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function LabsResearchPage() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="res-page">

        {/* ── Hero ── */}
        <section className="res-hero">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.09 } } }}>
            <motion.div className="res-label" variants={fadeUp}>Research Streams</motion.div>
            <motion.h1 className="res-h1" variants={fadeUp}>
              Four questions.<br />Hundreds of experiments.
            </motion.h1>
            <motion.p className="res-subtitle" variants={fadeUp}>
              We publish everything we learn — methods, results, and failures. Four active streams, all open.
            </motion.p>
          </motion.div>
        </section>

        {/* ── Streams grid ── */}
        <section className="res-streams">
          <div className="res-inner">
            <div className="res-grid">
              {STREAMS.map((s, i) => (
                <motion.div
                  key={s.slug}
                  className="scard"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.15 }}
                  custom={i * 0.5}
                  variants={fadeUp}
                >
                  <div className="scard-num">{s.num}</div>

                  <div className="scard-head">
                    <div className="scard-badge">Active</div>
                    <div className="scard-title">{s.title}</div>
                  </div>

                  <p className="scard-q">{s.question}</p>

                  <div className="scard-stats">
                    <div className="scard-stat">
                      <span className="scard-stat-n">{s.articles}</span>
                      <span className="scard-stat-l">Articles</span>
                    </div>
                    <div className="scard-stat">
                      <span className="scard-stat-n">{s.experiments}</span>
                      <span className="scard-stat-l">Experiments</span>
                    </div>
                  </div>

                  <div>
                    <div className="scard-findings-label">Key findings so far</div>
                    <ul className="scard-findings">
                      {s.findings.map((f, fi) => (
                        <li key={fi}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="scard-topics">
                    {s.topics.map((t) => (
                      <span key={t} className="scard-topic">{t}</span>
                    ))}
                  </div>

                  <Link href={`/labs/research/${s.slug}`} className="scard-link">
                    Read the research
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Recent experiments ── */}
        <section className="res-exps">
          <div className="res-inner">
            <div className="res-sec-head">
              <div className="res-sec-label">Latest results</div>
              <h2 className="res-sec-title">Recent experiment results</h2>
            </div>

            <div className="exp-list">
              {EXPERIMENTS.map((e, i) => (
                <motion.div
                  key={i}
                  className="exp-row"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={i * 0.5}
                  variants={fadeUp}
                >
                  <div className="exp-left">
                    <div className="exp-title">{e.title}</div>
                    <div className="exp-result">{e.result}</div>
                    <div className="exp-meta">
                      <Link href={`/labs/research/${e.streamSlug}`} className="exp-stream">
                        {e.stream}
                      </Link>
                      <span className="exp-date">{e.date}</span>
                    </div>
                  </div>
                  <div className="exp-right">
                    <span
                      className="exp-badge"
                      style={{
                        color: STATUS_COLORS[e.status],
                        borderColor: `${STATUS_COLORS[e.status]}30`,
                        background: `${STATUS_COLORS[e.status]}0D`,
                      }}
                    >
                      {STATUS_LABELS[e.status]}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="res-cta">
          <div className="res-cta-inner">
            <h2 className="res-cta-title">All experiments, including the failures.</h2>
            <p className="res-cta-desc">
              The experiments log documents every hypothesis we tested — what we expected, what happened, and what we changed because of it.
            </p>
            <Link href="/labs/experiments" className="res-cta-btn">
              Browse all experiments
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
