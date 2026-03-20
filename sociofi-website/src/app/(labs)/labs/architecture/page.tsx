'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────
const A = '#7B6FE8';
const F = {
  h: "var(--font-manrope,'Manrope'),sans-serif",
  b: "var(--font-dm-sans,'DM Sans'),sans-serif",
  m: "var(--font-jb-mono,'JetBrains Mono'),monospace",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  .arch-page { background: var(--bg); min-height: 100vh; }

  /* Hero */
  .arch-hero { padding: 148px 0 100px; position: relative; overflow: hidden; }
  .arch-hero-bg { position: absolute; inset: 0; pointer-events: none; }
  .arch-hero-orb { position: absolute; border-radius: 50%; filter: blur(100px); }
  .arch-hero-orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(123,111,232,0.08) 0%, transparent 70%); top: -200px; left: -100px; }
  .arch-hero-orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(85,72,176,0.06) 0%, transparent 70%); bottom: -100px; right: 100px; }
  .arch-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; position: relative; }
  .arch-hero-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 28px; }
  .arch-hero-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .arch-hero-h1 { font-family: ${F.h}; font-size: clamp(2.6rem, 4.5vw, 3.6rem); font-weight: 800; line-height: 1.08; letter-spacing: -0.035em; color: var(--text-primary); margin: 0 0 24px; max-width: 700px; }
  .arch-hero-accent { background: linear-gradient(135deg, #5548B0, ${A}, #9D94F0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .arch-hero-sub { font-family: ${F.b}; font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary); max-width: 580px; margin: 0 0 40px; }
  .arch-hero-meta { display: flex; gap: 32px; flex-wrap: wrap; }
  .arch-meta-item { font-family: ${F.m}; font-size: 0.75rem; color: var(--text-muted); }
  .arch-meta-item strong { color: ${A}; }

  /* Section base */
  .arch-section { padding: 100px 0; }
  .arch-section-alt { background: var(--bg-2); }
  .arch-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  .arch-sec-label { display: flex; align-items: center; gap: 10px; font-family: ${F.m}; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 14px; }
  .arch-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .arch-section-title { font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary); margin: 0 0 16px; }
  .arch-section-sub { font-family: ${F.b}; font-size: 1rem; line-height: 1.7; color: var(--text-secondary); max-width: 600px; margin: 0 0 56px; }

  /* Principles */
  .arch-principles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .arch-principle-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; position: relative; overflow: hidden; transition: all 0.4s cubic-bezier(0.16,1,0.3,1); border-left: 3px solid transparent; }
  .arch-principle-card:hover { transform: translateY(-4px); box-shadow: var(--card-hover-shadow); border-left-color: ${A}; border-color: var(--border-hover); }
  .arch-principle-num { font-family: ${F.m}; font-size: 2rem; font-weight: 700; color: rgba(123,111,232,0.12); line-height: 1; margin-bottom: 16px; letter-spacing: -0.05em; }
  .arch-principle-title { font-family: ${F.h}; font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 0 0 10px; letter-spacing: -0.01em; }
  .arch-principle-desc { font-family: ${F.b}; font-size: 0.88rem; line-height: 1.7; color: var(--text-secondary); margin: 0; }
  .arch-principle-note { margin-top: 14px; font-family: ${F.m}; font-size: 0.75rem; color: ${A}; opacity: 0.8; }

  /* Reference Architecture */
  .arch-diagram { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
  .arch-diagram-header { padding: 18px 24px; background: var(--bg-2); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
  .arch-diagram-dot { width: 10px; height: 10px; border-radius: 50%; }
  .arch-diagram-title { font-family: ${F.m}; font-size: 0.78rem; color: var(--text-muted); margin-left: 8px; }
  .arch-diagram-body { padding: 32px; overflow-x: auto; }
  .arch-diagram-code { font-family: ${F.m}; font-size: 0.82rem; line-height: 2; color: var(--text-primary); white-space: pre; margin: 0; }
  .arch-diagram-accent { color: ${A}; }
  .arch-diagram-dim { color: var(--text-muted); }
  .arch-diagram-green { color: #48C496; }
  .arch-diagram-yellow { color: #E8B84D; }
  .arch-diagram-red { color: #E87B6F; }

  /* Tech Decisions */
  .arch-tech-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .arch-tech-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 24px 28px; transition: border-color 0.3s; }
  .arch-tech-card:hover { border-color: rgba(123,111,232,0.25); }
  .arch-tech-category { font-family: ${F.m}; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: ${A}; margin-bottom: 8px; }
  .arch-tech-what { font-family: ${F.h}; font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0 0 10px; }
  .arch-tech-why { font-family: ${F.b}; font-size: 0.85rem; line-height: 1.65; color: var(--text-secondary); margin: 0 0 14px; }
  .arch-tech-tools { display: flex; gap: 8px; flex-wrap: wrap; }
  .arch-tech-tool { font-family: ${F.m}; font-size: 0.7rem; padding: 3px 10px; border-radius: 100px; background: rgba(123,111,232,0.1); color: ${A}; border: 1px solid rgba(123,111,232,0.15); }

  /* Anti-patterns */
  .arch-antipatterns-list { display: flex; flex-direction: column; gap: 16px; }
  .arch-antipattern { display: flex; gap: 20px; align-items: flex-start; padding: 24px 28px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); border-left: 3px solid #E87B6F; }
  .arch-antipattern-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(232,123,111,0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.9rem; }
  .arch-antipattern-content { flex: 1; }
  .arch-antipattern-title { font-family: ${F.h}; font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 0 0 6px; }
  .arch-antipattern-desc { font-family: ${F.b}; font-size: 0.85rem; line-height: 1.65; color: var(--text-secondary); margin: 0 0 10px; }
  .arch-antipattern-lesson { font-family: ${F.m}; font-size: 0.75rem; color: #48C496; }
  .arch-antipattern-lesson::before { content: '→ '; }

  /* Related links */
  .arch-related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .arch-related-card { display: flex; align-items: center; justify-content: space-between; padding: 24px 28px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); text-decoration: none; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
  .arch-related-card:hover { border-color: ${A}; transform: translateX(4px); }
  .arch-related-label { font-family: ${F.m}; font-size: 0.68rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: ${A}; margin-bottom: 6px; }
  .arch-related-title { font-family: ${F.h}; font-size: 1rem; font-weight: 700; color: var(--text-primary); }
  .arch-related-arrow { font-size: 1.2rem; color: var(--text-muted); transition: color 0.2s; }
  .arch-related-card:hover .arch-related-arrow { color: ${A}; }

  @keyframes archPulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
  @media (max-width: 768px) {
    .arch-hero { padding: 120px 0 80px; }
    .arch-principles-grid, .arch-tech-grid, .arch-related-grid { grid-template-columns: 1fr; }
    .arch-container { padding: 0 20px; }
    .arch-section { padding: 72px 0; }
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRINCIPLES = [
  {
    num: '01',
    title: 'Reliability over raw performance',
    desc: 'A system that returns the right answer in 400ms is better than one that returns a maybe in 80ms. We optimise for correctness first, then throughput. Latency is a product constraint; wrong answers are a product failure.',
    note: 'Applies to every agent call, every tool execution, every output validation.',
  },
  {
    num: '02',
    title: 'Observability first',
    desc: 'Every LLM call is logged with its full input, output, cost, latency, and model version before it reaches production. You cannot debug a system you cannot see. We instrument before we optimise.',
    note: 'Structured logs shipped to a queryable store from day one.',
  },
  {
    num: '03',
    title: 'Fail loudly, not silently',
    desc: 'Silent degradation is the worst failure mode in AI systems. A hallucinated answer that looks correct is more dangerous than a visible error. Our systems raise explicit exceptions on validation failures — they do not patch over them.',
    note: 'Output schema violations trigger immediate retry or escalation, never silent pass-through.',
  },
  {
    num: '04',
    title: 'Human review at decision boundaries',
    desc: 'Autonomous agents are powerful in bounded task spaces. At any decision point that crosses a trust boundary — shipping code, modifying production data, sending external communication — a human approves. Always.',
    note: 'Not optional. Hardcoded into the pipeline.',
  },
  {
    num: '05',
    title: 'Composable over monolithic',
    desc: 'Large language models are not good at multi-step reasoning in a single prompt. We break complex tasks into small, testable, composable units — each with a clear input schema, a clear output schema, and a clear success condition.',
    note: 'A 10-step pipeline of simple agents outperforms one mega-prompt every time.',
  },
];

const TECH_DECISIONS = [
  {
    category: 'Reasoning layer',
    what: 'Large language models for unstructured reasoning',
    why: 'LLMs excel at natural language understanding, code generation, and ambiguous instruction following. They are not calculators — we use them for what they are good at: interpreting intent and generating structured outputs from fuzzy inputs.',
    tools: ['Structured outputs', 'JSON mode', 'Tool calling', 'Temperature: 0.1'],
  },
  {
    category: 'Memory layer',
    what: 'Vector databases for semantic retrieval',
    why: 'LLMs have finite context windows. For systems that need to recall information across long sessions or large knowledge bases, we embed information into vectors and retrieve by semantic similarity. We do not stuff context windows.',
    tools: ['pgvector', 'Pinecone', 'Cosine similarity', 'Chunking strategies'],
  },
  {
    category: 'Coordination layer',
    what: 'Message queues for agent orchestration',
    why: 'Multi-agent pipelines need durable, retryable task distribution. We use message queues rather than direct agent-to-agent calls so that failed tasks can be retried, work can be distributed across workers, and the system degrades gracefully under load.',
    tools: ['BullMQ', 'Redis', 'Dead letter queues', 'Priority lanes'],
  },
  {
    category: 'Output layer',
    what: 'Structured output validation with Zod schemas',
    why: 'Every agent output is validated against a typed schema before it enters the next pipeline stage. Invalid outputs trigger automatic retry with the validation error appended to the prompt. This eliminates an entire class of downstream failures.',
    tools: ['Zod', 'JSON Schema', 'Auto-retry', 'Validation errors as prompts'],
  },
  {
    category: 'Observability layer',
    what: 'Structured logs for every LLM interaction',
    why: 'Debugging AI systems without logs is guessing. We log every request and response — including cost, latency, model version, and validation outcome — in a structured format queryable by agent, task type, and failure mode.',
    tools: ['Structured JSON logs', 'Cost tracking', 'Latency percentiles', 'Error classification'],
  },
  {
    category: 'Deployment layer',
    what: 'Human-gated CI for AI-generated code',
    why: 'AI-generated code does not ship automatically. It enters a review queue where an engineer reads, tests, and approves it. The pipeline automates the generation and testing; the human approves the merge. Speed without trust is a liability.',
    tools: ['GitHub Actions', 'Required reviews', 'Auto-test on PR', 'Staging gates'],
  },
];

const ANTI_PATTERNS = [
  {
    title: 'Over-agentic systems',
    desc: 'Giving a single agent responsibility for a long, multi-step workflow with external side effects — sending emails, modifying databases, deploying code — without checkpoints. When the agent misunderstands step 2, you find out at step 9 with irreversible consequences.',
    lesson: 'Break long tasks into short tasks. Add human checkpoints at state-changing boundaries.',
  },
  {
    title: 'Shared mutable state between agents',
    desc: "Multiple agents writing to the same data structure without coordination creates race conditions and conflicting interpretations. We've seen agents overwrite each other's outputs, producing results that reflect neither agent's reasoning correctly.",
    lesson: 'Agents read shared state; they write to their own output slots. A coordinator merges.',
  },
  {
    title: 'No observability in early builds',
    desc: 'Skipping logging "to keep things simple" during development means the first production failure is undebuggable. Retrofitting observability into a running AI system is far harder than adding it from the start.',
    lesson: 'Log every LLM call before you write your first feature. Non-negotiable.',
  },
  {
    title: '100% automated deployment',
    desc: "Pipelines that generate code and auto-merge PRs without human review. We ran this experiment. AI-generated code that passes tests is still AI-generated code — it can be subtly wrong in ways tests don't catch.",
    lesson: 'Automate generation and testing. Keep the merge decision with a human.',
  },
  {
    title: 'Prompt-only validation',
    desc: 'Telling the LLM to "always return valid JSON" and hoping for the best. LLMs ignore instructions under certain input conditions. Validation must be in code, not in prompts.',
    lesson: 'Parse and validate every output in code. Treat prompts as hints, not guarantees.',
  },
];

// ─── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ArchitecturePage() {
  return (
    <div className="arch-page">
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="arch-hero">
        <div className="arch-hero-bg">
          <div className="arch-hero-orb arch-hero-orb-1" />
          <div className="arch-hero-orb arch-hero-orb-2" />
        </div>
        <div className="arch-hero-inner">
          <Reveal>
            <div className="arch-hero-badge">Labs · Architecture</div>
            <h1 className="arch-hero-h1">
              How we architect{' '}
              <span className="arch-hero-accent">AI-native systems.</span>
            </h1>
            <p className="arch-hero-sub">
              Five years of building production AI systems taught us what works, what breaks under load,
              and what looks good in demos but fails at 3am. This documents the decisions we landed on and why.
            </p>
            <div className="arch-hero-meta">
              <span className="arch-meta-item">Last updated: <strong>March 2026</strong></span>
              <span className="arch-meta-item">Version: <strong>2.1</strong></span>
              <span className="arch-meta-item">Status: <strong>Living document</strong></span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Core Principles ── */}
      <section className="arch-section arch-section-alt">
        <div className="arch-container">
          <Reveal>
            <div className="arch-sec-label">Core principles</div>
            <h2 className="arch-section-title">What we believe about AI system design.</h2>
            <p className="arch-section-sub">
              These are not aspirations. They are constraints we impose on every system we build.
              Violating them is how you end up with a system that works in staging and breaks in production.
            </p>
          </Reveal>
          <div className="arch-principles-grid">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.num} delay={i * 0.07}>
                <div className="arch-principle-card">
                  <div className="arch-principle-num">{p.num}</div>
                  <div className="arch-principle-title">{p.title}</div>
                  <p className="arch-principle-desc">{p.desc}</p>
                  <div className="arch-principle-note">{p.note}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reference Architecture ── */}
      <section className="arch-section">
        <div className="arch-container">
          <Reveal>
            <div className="arch-sec-label">Reference architecture</div>
            <h2 className="arch-section-title">How the pieces fit together.</h2>
            <p className="arch-section-sub">
              A conceptual map of the system layers we use in production AI pipelines. Every real
              system adapts this to its specific requirements, but the layer structure stays consistent.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="arch-diagram">
              <div className="arch-diagram-header">
                <div className="arch-diagram-dot" style={{ background: '#E87B6F' }} />
                <div className="arch-diagram-dot" style={{ background: '#E8B84D' }} />
                <div className="arch-diagram-dot" style={{ background: '#48C496' }} />
                <span className="arch-diagram-title">SocioFi AI System — Reference Architecture v2.1</span>
              </div>
              <div className="arch-diagram-body">
                <pre className="arch-diagram-code">{`
  ┌─────────────────────────────────────────────────────────────────────┐
  │                        EXTERNAL INPUTS                              │
  │    User request │ Webhook │ Scheduled job │ API call                │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │                      INPUT VALIDATION LAYER                         │
  │    Schema validation │ Auth check │ Rate limiting │ Sanitisation    │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │                       TASK ROUTER / PLANNER                         │
  │                                                                     │
  │    ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐  │
  │    │  Task queue  │   │  Task type   │   │   Priority / budget  │  │
  │    │  (BullMQ)    │ → │  classifier  │ → │   enforcement        │  │
  │    └──────────────┘   └──────────────┘   └──────────────────────┘  │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Agent A  │  │ Agent B  │  │ Agent C  │  │ Agent N  │
  │ (Spec)   │  │ (Code)   │  │ (Review) │  │ (Deploy) │
  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
       │              │              │              │
       └──────────────┴──────────────┴──────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │                      TOOL EXECUTION LAYER                           │
  │                                                                     │
  │    ┌─────────────┐  ┌────────────┐  ┌──────────┐  ┌────────────┐  │
  │    │  Code tools │  │  DB tools  │  │ File I/O │  │  Web tools │  │
  │    │  (run,lint) │  │  (query)   │  │  (read,  │  │  (search,  │  │
  │    └─────────────┘  └────────────┘  │  write)  │  │  fetch)    │  │
  │                                     └──────────┘  └────────────┘  │
  │    All tool calls: retried 3× with exponential backoff             │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │                      MEMORY LAYER                                   │
  │                                                                     │
  │    Working memory    │  Episodic store   │  Semantic index          │
  │    (in-context)      │  (Redis/Postgres) │  (pgvector)              │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │                  OUTPUT VALIDATION LAYER                            │
  │                                                                     │
  │    Zod schema parse → Pass → next stage                            │
  │                      → Fail → retry with error injected (max 3×)   │
  │                      → Fail after 3× → human escalation queue      │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
  ┌──────────────────────┐    ┌───────────────────────────────────────┐
  │  HUMAN REVIEW GATE   │    │         OBSERVABILITY LAYER            │
  │                      │    │                                        │
  │  Decision boundary:  │    │  Every LLM call logged:               │
  │  • Ship to prod      │    │  • Input/output (full)                │
  │  • Modify prod DB    │    │  • Cost + latency                     │
  │  • External comms    │    │  • Model + temperature                │
  │  • Auth changes      │    │  • Validation result                  │
  │                      │    │  • Agent + task context               │
  │  Human approves.     │    │                                        │
  │  Always.             │    │  Queryable. Alertable. Auditable.     │
  └──────────────────────┘    └───────────────────────────────────────┘
`}
                </pre>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Technology Decisions ── */}
      <section className="arch-section arch-section-alt">
        <div className="arch-container">
          <Reveal>
            <div className="arch-sec-label">Technology decisions</div>
            <h2 className="arch-section-title">What we use and why.</h2>
            <p className="arch-section-sub">
              Not recommendations. These are the specific technology choices we made after testing
              alternatives in production, with the reasoning behind each.
            </p>
          </Reveal>
          <div className="arch-tech-grid">
            {TECH_DECISIONS.map((t, i) => (
              <Reveal key={t.category} delay={i * 0.06}>
                <div className="arch-tech-card">
                  <div className="arch-tech-category">{t.category}</div>
                  <div className="arch-tech-what">{t.what}</div>
                  <p className="arch-tech-why">{t.why}</p>
                  <div className="arch-tech-tools">
                    {t.tools.map((tool) => (
                      <span key={tool} className="arch-tech-tool">{tool}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Anti-patterns ── */}
      <section className="arch-section">
        <div className="arch-container">
          <Reveal>
            <div className="arch-sec-label">Anti-patterns</div>
            <h2 className="arch-section-title">What we learned not to do.</h2>
            <p className="arch-section-sub">
              Every one of these we either did ourselves or saw break in a system we were brought in to fix.
              Documenting failures is more useful than documenting successes.
            </p>
          </Reveal>
          <div className="arch-antipatterns-list">
            {ANTI_PATTERNS.map((ap, i) => (
              <Reveal key={ap.title} delay={i * 0.07}>
                <div className="arch-antipattern">
                  <div className="arch-antipattern-icon">✗</div>
                  <div className="arch-antipattern-content">
                    <div className="arch-antipattern-title">{ap.title}</div>
                    <p className="arch-antipattern-desc">{ap.desc}</p>
                    <div className="arch-antipattern-lesson">{ap.lesson}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related ── */}
      <section className="arch-section arch-section-alt">
        <div className="arch-container">
          <Reveal>
            <div className="arch-sec-label">Go deeper</div>
            <h2 className="arch-section-title">Related reading.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="arch-related-grid">
              <Link href="/labs/methodology" className="arch-related-card">
                <div>
                  <div className="arch-related-label">Research</div>
                  <div className="arch-related-title">Methodology — how we run experiments</div>
                </div>
                <span className="arch-related-arrow">→</span>
              </Link>
              <Link href="/labs/dev-pipeline" className="arch-related-card">
                <div>
                  <div className="arch-related-label">Engineering</div>
                  <div className="arch-related-title">Dev pipeline — how we ship AI-generated code</div>
                </div>
                <span className="arch-related-arrow">→</span>
              </Link>
              <Link href="/labs/components" className="arch-related-card">
                <div>
                  <div className="arch-related-label">Patterns</div>
                  <div className="arch-related-title">Component library — reusable system patterns</div>
                </div>
                <span className="arch-related-arrow">→</span>
              </Link>
              <Link href="/labs/benchmarks" className="arch-related-card">
                <div>
                  <div className="arch-related-label">Data</div>
                  <div className="arch-related-title">Benchmarks — measured performance numbers</div>
                </div>
                <span className="arch-related-arrow">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
