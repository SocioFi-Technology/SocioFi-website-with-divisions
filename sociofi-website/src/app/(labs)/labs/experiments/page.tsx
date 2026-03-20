'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'completed' | 'running' | 'failed' | 'abandoned';
type Stream = 'agent-architecture' | 'applied-ai' | 'developer-tooling' | 'industry-automation';

interface Experiment {
  id: number;
  title: string;
  stream: Stream;
  status: Status;
  hypothesis: string;
  result: string;
  learnings: string[];
  dateRange: string;
  nextExperiment?: string;
  failureReason?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STREAM_LABELS: Record<Stream, string> = {
  'agent-architecture': 'Agent Architecture',
  'applied-ai': 'Applied AI',
  'developer-tooling': 'Developer Tooling',
  'industry-automation': 'Industry Automation',
};

const EXPERIMENTS: Experiment[] = [
  {
    id: 1,
    title: 'Multi-Agent Handoff Protocol v1',
    stream: 'agent-architecture',
    status: 'completed',
    hypothesis: 'A shared message queue reduces inter-agent latency by >30% compared to direct point-to-point agent communication.',
    result: 'Reduced by 41% in 3-agent chains. Performance degraded significantly in 7+ agent chains — queue saturation at high concurrency introduced new bottlenecks we had not anticipated.',
    learnings: [
      'Message queue architecture scales well up to 5-6 agents but requires a different topology beyond that — a hub-and-spoke model outperforms linear queues at scale.',
      'Backpressure handling is the critical engineering problem in multi-agent systems; most early approaches ignore it until they hit production.',
      'The 41% improvement confirms the hypothesis for the tested range, but the failure at 7+ agents is the more valuable finding — it defines the boundary conditions.',
    ],
    dateRange: 'Oct 2025 – Dec 2025',
    nextExperiment: 'Long-Context Agent Memory Architecture',
  },
  {
    id: 2,
    title: 'RAG Chunking Strategy Comparison',
    stream: 'applied-ai',
    status: 'completed',
    hypothesis: 'Semantic chunking outperforms fixed-size chunking for technical documentation retrieval accuracy.',
    result: 'Semantic chunking was 23% more accurate on technical Q&A benchmarks versus fixed-size chunking at 512 tokens. It indexed 8% slower. The accuracy gain justifies the indexing overhead for documentation use cases.',
    learnings: [
      'Fixed-size chunking breaks mid-sentence and mid-concept at exactly the points where retrieval needs coherence — the failure mode is systematic, not random.',
      'Semantic chunking gains are largest for long-form technical documentation (API references, architecture docs) and smallest for short-form structured content (FAQs, changelogs).',
      'The 8% indexing overhead is a one-time cost that matters less than retrieval quality in most production scenarios; the tradeoff analysis depends heavily on update frequency.',
    ],
    dateRange: 'Nov 2025 – Jan 2026',
    nextExperiment: 'Cross-Model Prompt Portability',
  },
  {
    id: 3,
    title: 'Spec-to-Code Accuracy Measurement',
    stream: 'developer-tooling',
    status: 'completed',
    hypothesis: 'Structured specification documents reduce ambiguity and improve first-pass code accuracy compared to free-form brief inputs.',
    result: '34% reduction in revision cycles when using structured specs versus free-form briefs. First-pass acceptance rate improved from 51% to 79% across a sample of 40 feature implementations.',
    learnings: [
      'The format of the spec matters as much as its completeness — specs with explicit acceptance criteria drove the largest improvements, not just specs with more detail.',
      'Agent-generated specs (where the AI asks clarifying questions to build the spec) performed nearly as well as human-written specs, suggesting the spec-generation step itself can be automated.',
      'The 34% reduction likely understates the full efficiency gain; revision cycles have non-linear cost — later revisions are exponentially more expensive than earlier ones.',
    ],
    dateRange: 'Sep 2025 – Nov 2025',
    nextExperiment: 'Automated Architecture Generation',
  },
  {
    id: 4,
    title: 'Industry Document Classification Pipeline',
    stream: 'industry-automation',
    status: 'completed',
    hypothesis: 'LLMs can replace rule-based classifiers for business document routing with higher accuracy and lower maintenance overhead.',
    result: '95.3% accuracy on invoice/purchase order/receipt classification, outperforming our rule-based system at 89.1%. The LLM approach required zero maintenance when document formats changed — rule-based systems required manual rule updates for every format variation.',
    learnings: [
      'The accuracy advantage is real but not the most important finding — the maintenance advantage is. Rule-based classifiers require constant upkeep as document formats drift; the LLM approach adapts without intervention.',
      'The 4.7% error rate is concentrated in heavily damaged or non-standard documents that humans also struggle with — the system fails in the same places human judgment fails, which is the right failure profile.',
      'Confidence scoring matters: routing high-confidence classifications automatically and flagging low-confidence items for human review brings effective accuracy above 99% in practice.',
    ],
    dateRange: 'Aug 2025 – Oct 2025',
    nextExperiment: 'Zero-Shot Industry Automation',
  },
  {
    id: 5,
    title: 'Long-Context Agent Memory Architecture',
    stream: 'agent-architecture',
    status: 'running',
    hypothesis: 'Hierarchical memory (working memory / episodic memory / semantic memory) enables coherent reasoning across 100+ step tasks where flat context windows fail.',
    result: 'In progress. Early results suggest working memory compression at step transitions is the key engineering challenge. Preliminary data shows 60% fewer context loss errors versus flat context at 50+ steps.',
    learnings: [
      'Episodic memory (storing summarized task history) is showing more value than expected — agents can reference earlier decisions without re-reading full context.',
      'Memory retrieval timing is critical — retrieving too early or too late in the reasoning cycle introduces noise. Still characterizing the optimal retrieval window.',
    ],
    dateRange: 'Feb 2026 – ongoing',
  },
  {
    id: 6,
    title: 'Cross-Model Prompt Portability',
    stream: 'applied-ai',
    status: 'running',
    hypothesis: 'Prompts optimized for one model lose less than 15% effectiveness when ported to another model if they follow a structured format with explicit role, context, constraints, and output format sections.',
    result: 'In progress. Testing across 4 model families on 12 task categories. Initial data shows structured prompts retain 83-91% effectiveness on transfer, versus 64-72% for unstructured prompts.',
    learnings: [
      'Early finding: instruction-following and output-format prompts transfer well; reasoning-intensive prompts show the most degradation across models.',
      'Model-specific idioms ("think step by step", chain-of-thought triggers) reduce portability significantly — need a model-agnostic instruction vocabulary.',
    ],
    dateRange: 'Jan 2026 – ongoing',
  },
  {
    id: 7,
    title: 'Agent Self-Correction Loop',
    stream: 'agent-architecture',
    status: 'failed',
    hypothesis: 'An agent reviewing its own output before submission would reduce output errors by 50% versus no self-review.',
    result: 'No statistically significant improvement. Agent self-reviews showed the same blind spots as the original outputs. Abandoned after 3 weeks of structured testing across 200 generation tasks.',
    failureReason: 'The self-review mechanism was flawed by design: the same model that made an error in generation will make the same error in evaluation. Self-review is not an independent check — it is the same process run twice.',
    learnings: [
      'LLMs exhibit systematic self-evaluation blind spots — errors in reasoning are not detectable by the same reasoning process that produced them. This is a fundamental constraint, not an implementation problem.',
      'The failure clarifies the role of human review and multi-model validation: the only reliable error-catching mechanism is an independent evaluator with different priors.',
      'The experiment ruled out an entire category of optimization approaches. That is genuinely useful: we can stop testing self-review variants and redirect research toward cross-model or human-in-the-loop verification.',
    ],
    dateRange: 'Jul 2025 – Aug 2025',
  },
  {
    id: 8,
    title: 'Zero-Shot Industry Automation',
    stream: 'industry-automation',
    status: 'failed',
    hypothesis: 'Zero-shot LLM prompting can replace fine-tuned models for structured data extraction from industry-specific documents, reducing the need for labeled training data.',
    result: 'Accuracy dropped from 95% (fine-tuned model) to 71% (zero-shot) on edge cases. Not production-viable for high-stakes document processing where errors have financial or compliance consequences.',
    failureReason: 'Edge cases in real-world documents require domain-specific pattern recognition that generalizes poorly from zero-shot prompting. The 24% accuracy gap concentrates on exactly the document types where errors matter most.',
    learnings: [
      'Zero-shot works for common document patterns but degrades on domain-specific variants — the long tail of document formats is where fine-tuned models earn their keep.',
      'The failure identifies a clear threshold: zero-shot is viable when error cost is low and coverage of common patterns is sufficient; fine-tuning is required when edge-case accuracy is critical.',
      'Few-shot prompting with carefully selected examples recovers approximately half the accuracy gap (from 71% to ~83%) — a middle ground that may be viable for medium-stakes use cases.',
    ],
    dateRange: 'Nov 2025 – Dec 2025',
  },
  {
    id: 9,
    title: 'Automated Architecture Generation',
    stream: 'developer-tooling',
    status: 'failed',
    hypothesis: 'LLM can generate production-ready system architecture from high-level requirements, reducing the architect review step to final sign-off rather than active design.',
    result: 'Generated architectures were technically valid but missed domain-specific constraints in 60% of cases. Required full human architect review for every output — no efficiency gain over starting from scratch.',
    failureReason: 'High-level requirements do not encode the organizational, compliance, operational, and political constraints that shape real architecture decisions. The LLM optimized for technical correctness while missing the constraints that actually determine what gets built.',
    learnings: [
      'System architecture is constrained by factors outside the technical specification — existing infrastructure, team skill sets, regulatory requirements, vendor relationships. These are not capturable in a brief.',
      'The experiment revealed that LLM architecture generation is most useful as a starting point for discussion, not as an output — it surfaces options and trade-offs that a human architect can then evaluate against real constraints.',
      'A more promising direction: LLM as architecture reviewer rather than generator — checking proposed architectures against a library of anti-patterns and common failure modes.',
    ],
    dateRange: 'Dec 2025 – Jan 2026',
  },
  {
    id: 10,
    title: 'Cross-Provider LLM Routing',
    stream: 'applied-ai',
    status: 'abandoned',
    hypothesis: 'Dynamic routing between LLM providers based on task type and complexity reduces total inference cost by 40% with less than 5% accuracy degradation.',
    result: 'The routing decision overhead — classification latency, routing logic, fallback handling — exceeded the cost savings in most real-world usage patterns. In high-volume scenarios the economics improved, but the engineering complexity was not justified.',
    failureReason: 'The simpler solution — selecting the appropriate provider at deployment time based on use-case characteristics — achieves most of the cost benefit without runtime routing complexity. We shipped the simpler approach.',
    learnings: [
      'Dynamic routing adds latency and operational complexity. When the savings are real but achievable through simpler means, the simpler means wins — this is a recurring pattern in applied AI infrastructure.',
      'Task classification for routing purposes is itself a non-trivial AI problem, creating a recursive dependency (you need an LLM to decide which LLM to use).',
      'The experiment was valuable because it validated the cost savings hypothesis in principle while revealing that the deployment-time selection approach captures most of the benefit — we abandoned the complex approach and shipped the simple one.',
    ],
    dateRange: 'Sep 2025 – Oct 2025',
  },
];

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  completed: {
    label: 'COMPLETED',
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.08)',
    border: 'rgba(74, 222, 128, 0.2)',
  },
  running: {
    label: 'RUNNING',
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.08)',
    border: 'rgba(96, 165, 250, 0.2)',
  },
  failed: {
    label: 'FAILED',
    color: '#f87171',
    bg: 'rgba(248, 113, 113, 0.06)',
    border: 'rgba(248, 113, 113, 0.2)',
  },
  abandoned: {
    label: 'ABANDONED',
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.06)',
    border: 'rgba(148, 163, 184, 0.15)',
  },
};

const FILTER_TABS: { label: string; value: Status | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Running', value: 'running' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Abandoned', value: 'abandoned' },
];

// ─── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  .exp-page {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body);
  }

  /* Hero */
  .exp-hero {
    padding: 160px 0 80px;
    position: relative;
    overflow: hidden;
  }
  .exp-hero-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .exp-hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    animation: orbFloat 14s ease-in-out infinite;
  }
  .exp-hero-orb-1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(123, 111, 232, 0.14) 0%, transparent 70%);
    top: -100px;
    right: -80px;
  }
  .exp-hero-orb-2 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(89, 163, 146, 0.08) 0%, transparent 70%);
    bottom: 20px;
    left: 10%;
    animation-delay: 7s;
  }
  @keyframes orbFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-24px) scale(1.04); }
  }

  .exp-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .exp-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--division-accent);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .exp-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: var(--division-accent);
    display: inline-block;
  }

  .exp-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.6rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary);
    margin-bottom: 20px;
  }

  .exp-subtitle {
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 600px;
    margin-bottom: 40px;
  }

  .exp-stats-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .exp-stat-item {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    letter-spacing: 0.04em;
  }
  .exp-stat-dot {
    color: var(--text-muted);
    font-size: 0.6rem;
  }
  .exp-stat-completed { color: #4ade80; }
  .exp-stat-running { color: #60a5fa; }
  .exp-stat-failed { color: #f87171; }
  .exp-stat-abandoned { color: #94a3b8; }

  /* Filter bar */
  .exp-filter-section {
    padding: 0 0 48px;
    position: sticky;
    top: 60px;
    z-index: 10;
    background: var(--bg);
  }
  .exp-filter-inner {
    border-bottom: 1px solid var(--border);
    padding: 20px 0;
  }
  .exp-filter-tabs {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }
  .exp-tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: var(--radius-full);
    border: 1.5px solid transparent;
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    background: transparent;
    color: var(--text-secondary);
    transition: all 0.2s var(--ease);
    position: relative;
  }
  .exp-tab:hover {
    color: var(--text-primary);
    border-color: var(--border-hover);
  }
  .exp-tab.active {
    background: rgba(123, 111, 232, 0.12);
    border-color: rgba(123, 111, 232, 0.35);
    color: var(--division-accent);
  }
  .exp-tab-count {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    opacity: 0.7;
  }

  /* Experiment grid */
  .exp-grid-section {
    padding: 0 0 80px;
  }
  .exp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  /* Experiment card */
  .exp-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 32px;
    transition: border-color 0.3s var(--ease), transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
    position: relative;
    overflow: hidden;
  }
  .exp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .exp-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--card-hover-shadow);
  }
  .exp-card:hover::before {
    opacity: 1;
  }
  .exp-card.status-completed::before {
    background: linear-gradient(90deg, var(--division-accent), #4ade80);
  }
  .exp-card.status-running::before {
    background: linear-gradient(90deg, #60a5fa, var(--division-accent));
  }
  .exp-card.status-failed {
    background: color-mix(in srgb, var(--bg-card) 95%, #f87171 5%);
    border-color: rgba(248, 113, 113, 0.15);
  }
  .exp-card.status-failed::before {
    background: linear-gradient(90deg, #ef4444, #f87171);
  }
  .exp-card.status-abandoned {
    opacity: 0.85;
  }
  .exp-card.status-abandoned::before {
    background: linear-gradient(90deg, #64748b, #94a3b8);
  }

  .exp-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .exp-card-badges {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .exp-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    border: 1px solid;
  }
  .exp-status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .exp-status-dot.running {
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .exp-stream-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    background: rgba(123, 111, 232, 0.1);
    color: var(--division-accent);
    border: 1px solid rgba(123, 111, 232, 0.2);
  }
  .exp-date {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-muted);
    white-space: nowrap;
    padding-top: 2px;
  }

  .exp-card-title {
    font-family: var(--font-headline);
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--text-primary);
    margin-bottom: 20px;
    line-height: 1.3;
  }

  .exp-field-label {
    font-family: var(--font-mono);
    font-size: 0.67rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-bottom: 8px;
  }
  .exp-field-text {
    font-family: var(--font-body);
    font-size: 0.92rem;
    line-height: 1.65;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }
  .exp-field-text.result {
    color: var(--text-primary);
  }

  .exp-failure-box {
    background: rgba(248, 113, 113, 0.06);
    border: 1px solid rgba(248, 113, 113, 0.15);
    border-radius: var(--radius-sm);
    padding: 14px 16px;
    margin-bottom: 20px;
  }
  .exp-failure-box .exp-field-label {
    color: #f87171;
  }
  .exp-failure-box .exp-field-text {
    color: rgba(248, 113, 113, 0.85);
    margin-bottom: 0;
  }

  .exp-learnings {
    background: rgba(123, 111, 232, 0.05);
    border: 1px solid rgba(123, 111, 232, 0.1);
    border-radius: var(--radius-sm);
    padding: 16px 18px;
    margin-bottom: 20px;
  }
  .exp-learnings .exp-field-label {
    color: var(--division-accent);
    margin-bottom: 10px;
  }
  .exp-learnings-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .exp-learnings-list li {
    font-family: var(--font-body);
    font-size: 0.88rem;
    line-height: 1.65;
    color: var(--text-secondary);
    padding-left: 16px;
    position: relative;
  }
  .exp-learnings-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 9px;
    width: 5px;
    height: 1.5px;
    background: var(--division-accent);
    opacity: 0.6;
  }

  .exp-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .exp-next-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--division-accent);
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.2s, transform 0.2s;
  }
  .exp-next-link:hover {
    opacity: 1;
    transform: translateX(3px);
  }
  .exp-exp-id {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-muted);
  }

  /* Philosophy section */
  .exp-philosophy-section {
    padding: 80px 0 120px;
    border-top: 1px solid var(--border);
  }
  .exp-philosophy-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }
  .exp-philosophy-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    line-height: 1.15;
    margin-bottom: 8px;
  }
  .exp-philosophy-body {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    margin-bottom: 24px;
  }
  .exp-philosophy-quote {
    border-left: 2px solid var(--division-accent);
    padding-left: 20px;
    margin: 24px 0;
    font-family: var(--font-body);
    font-size: 1rem;
    font-style: italic;
    line-height: 1.7;
    color: var(--text-primary);
    opacity: 0.9;
  }
  .exp-philosophy-callout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .exp-callout-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 20px;
  }
  .exp-callout-number {
    font-family: var(--font-mono);
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 6px;
  }
  .exp-callout-label {
    font-family: var(--font-body);
    font-size: 0.82rem;
    color: var(--text-muted);
    line-height: 1.4;
  }

  /* Empty state */
  .exp-empty {
    padding: 80px 0;
    text-align: center;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    .exp-hero { padding: 120px 0 60px; }
    .exp-container { padding: 0 20px; }
    .exp-card { padding: 24px; }
    .exp-philosophy-inner { grid-template-columns: 1fr; gap: 40px; }
    .exp-philosophy-callout-grid { grid-template-columns: 1fr 1fr; }
    .exp-card-header { flex-direction: column; }
  }
  @media (max-width: 480px) {
    .exp-h1 { font-size: 2.1rem; }
    .exp-philosophy-callout-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Sub-components ────────────────────────────────────────────────────────────

function ExperimentCard({ experiment, index }: { experiment: Experiment; index: number }) {
  const sc = STATUS_CONFIG[experiment.status];

  return (
    <motion.article
      className={`exp-card status-${experiment.status}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      layout
    >
      {/* Header */}
      <div className="exp-card-header">
        <div className="exp-card-badges">
          {/* Status badge */}
          <span
            className="exp-status-badge"
            style={{ color: sc.color, background: sc.bg, borderColor: sc.border }}
          >
            <span
              className={`exp-status-dot${experiment.status === 'running' ? ' running' : ''}`}
              style={{ background: sc.color }}
            />
            {sc.label}
          </span>
          {/* Stream badge */}
          <span className="exp-stream-badge">
            {STREAM_LABELS[experiment.stream]}
          </span>
        </div>
        <span className="exp-date">{experiment.dateRange}</span>
      </div>

      {/* Title */}
      <h2 className="exp-card-title">{experiment.title}</h2>

      {/* Hypothesis */}
      <p className="exp-field-label">Hypothesis</p>
      <p className="exp-field-text">{experiment.hypothesis}</p>

      {/* Result */}
      <p className="exp-field-label">
        {experiment.status === 'running' ? 'Current Status' : 'Result'}
      </p>
      <p className="exp-field-text result">{experiment.result}</p>

      {/* Failure reason (failed / abandoned only) */}
      {experiment.failureReason && (
        <div className="exp-failure-box">
          <p className="exp-field-label">
            {experiment.status === 'failed' ? 'Why it failed' : 'Why it was abandoned'}
          </p>
          <p className="exp-field-text">{experiment.failureReason}</p>
        </div>
      )}

      {/* Learnings */}
      <div className="exp-learnings">
        <p className="exp-field-label">Key Learnings</p>
        <ul className="exp-learnings-list">
          {experiment.learnings.map((learning, i) => (
            <li key={i}>{learning}</li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="exp-card-footer">
        <span className="exp-exp-id">EXP-{String(experiment.id).padStart(3, '0')}</span>
        {experiment.nextExperiment && (
          <span className="exp-next-link">
            Led to: {experiment.nextExperiment} →
          </span>
        )}
      </div>
    </motion.article>
  );
}

// ─── Page component ────────────────────────────────────────────────────────────

export default function ExperimentsPage() {
  const [activeFilter, setActiveFilter] = useState<Status | 'all'>('all');

  const filtered = activeFilter === 'all'
    ? EXPERIMENTS
    : EXPERIMENTS.filter(e => e.status === activeFilter);

  const counts: Record<Status, number> = {
    completed: EXPERIMENTS.filter(e => e.status === 'completed').length,
    running: EXPERIMENTS.filter(e => e.status === 'running').length,
    failed: EXPERIMENTS.filter(e => e.status === 'failed').length,
    abandoned: EXPERIMENTS.filter(e => e.status === 'abandoned').length,
  };

  return (
    <>
      <style>{STYLES}</style>
      <main className="exp-page">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="exp-hero">
          <div className="exp-hero-bg" aria-hidden="true">
            <div className="exp-hero-orb exp-hero-orb-1" />
            <div className="exp-hero-orb exp-hero-orb-2" />
          </div>
          <div className="exp-container">
            <ScrollReveal>
              <p className="exp-label">Experiment Log</p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h1 className="exp-h1">We publish everything.<br />Including failures.</h1>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="exp-subtitle">
                Every experiment we run is logged here — completed, running, failed, abandoned.
                Negative results are results. The failures are often the most useful data.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <div className="exp-stats-row">
                <span className="exp-stat-item exp-stat-completed">{counts.completed} completed</span>
                <span className="exp-stat-dot">·</span>
                <span className="exp-stat-item exp-stat-running">{counts.running} running</span>
                <span className="exp-stat-dot">·</span>
                <span className="exp-stat-item exp-stat-failed">{counts.failed} failed</span>
                <span className="exp-stat-dot">·</span>
                <span className="exp-stat-item exp-stat-abandoned">{counts.abandoned} abandoned</span>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Filter Bar ────────────────────────────────────────────────── */}
        <div className="exp-filter-section">
          <div className="exp-container">
            <div className="exp-filter-inner">
              <div className="exp-filter-tabs" role="tablist" aria-label="Filter experiments by status">
                {FILTER_TABS.map(tab => {
                  const count = tab.value === 'all' ? EXPERIMENTS.length : counts[tab.value as Status];
                  return (
                    <button
                      key={tab.value}
                      role="tab"
                      aria-selected={activeFilter === tab.value}
                      className={`exp-tab${activeFilter === tab.value ? ' active' : ''}`}
                      onClick={() => setActiveFilter(tab.value as Status | 'all')}
                    >
                      {tab.label}
                      <span className="exp-tab-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Experiment Grid ───────────────────────────────────────────── */}
        <section className="exp-grid-section" aria-live="polite" aria-label="Experiment list">
          <div className="exp-container">
            {filtered.length === 0 ? (
              <div className="exp-empty">No experiments in this category yet.</div>
            ) : (
              <motion.div className="exp-grid" layout>
                <AnimatePresence mode="popLayout">
                  {filtered.map((exp, i) => (
                    <ExperimentCard key={exp.id} experiment={exp} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>

        {/* ── Philosophy Section ────────────────────────────────────────── */}
        <section className="exp-philosophy-section">
          <div className="exp-container">
            <div className="exp-philosophy-inner">
              {/* Left: text */}
              <ScrollReveal>
                <div>
                  <p className="exp-label">Research philosophy</p>
                  <h2 className="exp-philosophy-h2">Why we publish failures.</h2>
                  <p className="exp-philosophy-body">
                    Most research labs only publish successes. We think that is wrong — and counterproductive.
                    Failed experiments contain some of the most useful information in applied AI research.
                    They tell you where the edges of what is possible actually are.
                  </p>
                  <blockquote className="exp-philosophy-quote">
                    &ldquo;A failed experiment that is well-documented is worth more than
                    ten successful experiments that are not.&rdquo;
                  </blockquote>
                  <p className="exp-philosophy-body">
                    When we abandon a direction, we explain exactly why — not because it makes us look transparent,
                    but because the next person working on the same problem deserves not to repeat the same three
                    weeks we just spent. That is how the field moves forward.
                  </p>
                  <p className="exp-philosophy-body">
                    We also publish running experiments because the process matters. Seeing what questions we are
                    currently asking is as useful as knowing what we have already answered.
                  </p>
                </div>
              </ScrollReveal>

              {/* Right: callout cards */}
              <ScrollReveal delay={0.15}>
                <div className="exp-philosophy-callout-grid">
                  {[
                    { number: '100%', color: '#4ade80', label: 'Of experiments documented, regardless of outcome' },
                    { number: '3', color: 'var(--division-accent)', label: 'Failed experiments that directly improved our process' },
                    { number: '40+', color: '#60a5fa', label: 'Hours of engineering time saved by published failure analyses' },
                    { number: '0', color: '#94a3b8', label: 'Cherry-picked results. The raw data is what it is.' },
                  ].map(({ number, color, label }) => (
                    <div className="exp-callout-card" key={label}>
                      <div className="exp-callout-number" style={{ color }}>{number}</div>
                      <div className="exp-callout-label">{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 24 }}>
                  <Link
                    href="/labs/methodology"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: 'var(--division-accent)',
                      textDecoration: 'none',
                      transition: 'gap 0.2s',
                    }}
                  >
                    Read our full research methodology
                    <span style={{ fontSize: '1.1rem' }}>→</span>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
