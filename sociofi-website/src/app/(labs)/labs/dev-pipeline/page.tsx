'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';

// ─── Data ─────────────────────────────────────────────────────────────────────

const AGENTS = [
  {
    number: '01',
    name: 'Spec Agent',
    tagline: 'Brief → Executable specification',
    role: 'Receives your unstructured brief, asks targeted clarifying questions, and produces a structured specification document with acceptance criteria. The Spec Agent treats ambiguity as a blocking error — it does not proceed until requirements are unambiguous.',
    input: 'Unstructured brief: a paragraph, a voice note transcript, a Notion doc, a Figma link',
    output: 'Structured specification: feature list, acceptance criteria, out-of-scope definition, open questions resolved',
    time: '30–60 min',
    timeNote: 'Includes back-and-forth Q&A with the client or product owner',
    color: '#7B6FE8',
  },
  {
    number: '02',
    name: 'Architecture Agent',
    tagline: 'Specification → System design',
    role: 'Designs the system: component breakdown, data models, API contracts, infrastructure topology, and third-party service selection. Flags architectural risks and trade-offs for human architect review before implementation begins.',
    input: 'Structured specification from Spec Agent',
    output: 'Architecture document: component diagram, data model, API contracts, infrastructure choices, flagged risks',
    time: '1–2 hours',
    timeNote: 'Human architect reviews output before proceeding — this is not optional',
    color: '#6B8CD4',
  },
  {
    number: '03',
    name: 'Scaffold Agent',
    tagline: 'Architecture → Project skeleton',
    role: 'Generates the project skeleton from the architecture document: folder structure, dependency manifests, environment configurations, CI/CD pipeline templates, and base boilerplate. Creates a runnable (empty) project that the Implementation Agent can populate.',
    input: 'Architecture document',
    output: 'Initialized repository: folder structure, package.json / requirements.txt, .env templates, CI/CD config, README skeleton',
    time: '15–30 min',
    timeNote: 'Deterministic and fast — the scaffold is generated, not designed',
    color: '#5BB5E0',
  },
  {
    number: '04',
    name: 'Implementation Agent',
    tagline: 'Spec + scaffold → Working code',
    role: 'Writes feature code against the specification. Works file by file, following the architecture document, committing frequently with descriptive commit messages. Consults the spec on every decision — the spec is the source of truth, not the agent\'s priors.',
    input: 'Spec document + project scaffold + architecture document',
    output: 'Implemented features with passing basic smoke tests, committed to feature branches with descriptive history',
    time: '2–8 hours',
    timeNote: 'Scope-dependent. A single feature takes 2-3 hours; a full MVP may span multiple sessions',
    color: '#4DBFA8',
  },
  {
    number: '05',
    name: 'Review Agent',
    tagline: 'Code → Written review',
    role: 'Reads every line of the implementation. Checks for security vulnerabilities, code quality issues, spec compliance, missing edge case handling, and architectural drift from the design document. Produces a written review with prioritized findings.',
    input: 'All implementation code + original spec + architecture document',
    output: 'Review report: security findings (P0/P1/P2), spec gaps, quality issues, recommended changes — prioritized by severity',
    time: '1–2 hours',
    timeNote: 'Catches ~85% of security issues and ~70% of spec gaps before QA',
    color: '#E8B84D',
  },
  {
    number: '06',
    name: 'Test Agent',
    tagline: 'Spec + code → Test suite',
    role: 'Generates unit tests, integration tests, and edge case tests derived directly from the spec\'s acceptance criteria. Every acceptance criterion becomes at least one test. Edge cases that appeared in the Review Agent\'s output get targeted tests.',
    input: 'Spec acceptance criteria + implementation code + Review Agent findings',
    output: 'Test suite: unit tests, integration tests, edge case tests — all passing before proceeding',
    time: '1–3 hours',
    timeNote: 'Average 94% test coverage on new code. Higher for business logic, lower for UI rendering',
    color: '#E8916F',
  },
  {
    number: '07',
    name: 'Debug Agent',
    tagline: 'Test failures → Patches',
    role: 'Runs the full test suite, investigates failures, traces root causes, and patches bugs. Iterates until the test pass rate meets the threshold defined in the architecture document. Logs every bug found with root cause analysis for the project record.',
    input: 'Test suite + implementation code',
    output: 'Patched code with passing test suite + bug log with root cause analysis for each resolved issue',
    time: 'Variable: 30 min – 4 hours',
    timeNote: 'Depends on bug count and complexity. More than 4 hours signals a spec or architecture issue — we escalate',
    color: '#f87171',
  },
  {
    number: '08',
    name: 'Documentation Agent',
    tagline: 'Code + spec → Documentation',
    role: 'Writes inline code documentation, README, API documentation, deployment guide, and operations runbook. Documentation is generated from the actual code, not from memory — it is always synchronized with the implementation.',
    input: 'Final implementation code + spec document',
    output: 'Inline docs, README, API reference, deployment guide, operations runbook — all versioned with the code',
    time: '1–2 hours',
    timeNote: 'Documentation is a deliverable, not an afterthought. Clients get it as part of every project',
    color: '#a78bfa',
  },
  {
    number: '09',
    name: 'Deploy Agent',
    tagline: 'Code → Running production system',
    role: 'Configures infrastructure based on the architecture document, sets up CI/CD pipelines, manages environment variables and secrets, configures health checks, and executes the first production deployment. Does not proceed without a passing test suite.',
    input: 'Final code + infrastructure spec from architecture document + credentials',
    output: 'Running production environment: cloud infrastructure, CI/CD pipeline, configured secrets, health checks active, deployment verified',
    time: '1–3 hours',
    timeNote: 'Infrastructure-as-code means this is reproducible — staging and production environments are configured identically',
    color: '#34d399',
  },
  {
    number: '10',
    name: 'Monitor Agent',
    tagline: 'Live system → Observability',
    role: 'Configures the observability stack post-launch: error tracking, performance monitoring, uptime checks, and alerting rules. Sets baseline metrics during the first 48 hours and configures alerts against those baselines. Runs continuously.',
    input: 'Running production system + performance requirements from spec',
    output: 'Observability stack: error tracking, APM, uptime monitoring, alerting rules, baseline metrics, on-call runbook',
    time: 'Ongoing',
    timeNote: 'Initial setup takes 1-2 hours. Monitoring runs continuously and feeds back into the Services team',
    color: '#60a5fa',
  },
];

const HUMAN_ROLES = [
  {
    title: 'Architect',
    when: 'Between agents 02 and 03',
    responsibilities: [
      'Reviews Architecture Agent output against real-world constraints not captured in the spec',
      'Approves or modifies the system design before implementation begins',
      'Considers: team skill set, existing infrastructure, compliance requirements, budget constraints',
      'Acts as the final technical authority — no implementation without architect sign-off',
    ],
  },
  {
    title: 'Review Engineer',
    when: 'Between agents 05 and 06, and post-deploy',
    responsibilities: [
      'Reviews Review Agent findings and validates severity assessments',
      'Makes judgment calls on architectural trade-offs the agent flagged but could not resolve',
      'Handles the 15% of security issues and 30% of spec gaps the Review Agent misses',
      'Approves the release before the Deploy Agent proceeds',
    ],
  },
  {
    title: 'Operations Engineer',
    when: 'Post-deploy, ongoing',
    responsibilities: [
      'Interprets Monitor Agent alerts and decides whether to page, investigate, or ignore',
      'Handles failure scenarios that require judgment: data migrations, rollbacks, incident response',
      'Feeds operational learnings back into spec and architecture templates for future projects',
      'Maintains the relationship with the client — the human face of delivery',
    ],
  },
];

const METRICS = [
  {
    value: '3–5×',
    label: 'Faster than traditional development',
    note: 'For greenfield projects with well-defined requirements',
    color: '#4ade80',
  },
  {
    value: '~85%',
    label: 'Security issues caught by Review Agent',
    note: 'Before QA, based on internal data across 40+ projects',
    color: 'var(--division-accent)',
  },
  {
    value: '94%',
    label: 'Average test coverage on new code',
    note: 'Higher for business logic; lower for UI rendering layers',
    color: '#60a5fa',
  },
  {
    value: 'Hours',
    label: 'Deployment time, not days',
    note: 'Infrastructure-as-code means staging and production deploy identically',
    color: '#E8B84D',
  },
];

// ─── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  .dp-page {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body);
  }

  /* Hero */
  .dp-hero {
    padding: 160px 0 100px;
    position: relative;
    overflow: hidden;
  }
  .dp-hero-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .dp-hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(140px);
    animation: dpOrb 16s ease-in-out infinite;
  }
  .dp-hero-orb-1 {
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(123, 111, 232, 0.13) 0%, transparent 70%);
    top: -200px;
    right: -100px;
  }
  .dp-hero-orb-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(58, 88, 158, 0.1) 0%, transparent 70%);
    bottom: 0;
    left: 5%;
    animation-delay: 8s;
  }
  @keyframes dpOrb {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-22px) scale(1.03); }
  }

  .dp-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .dp-label {
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
  .dp-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: var(--division-accent);
    display: inline-block;
  }

  .dp-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.6rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary);
    margin-bottom: 24px;
  }

  .dp-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    line-height: 1.15;
    margin-bottom: 16px;
  }

  .dp-subtitle {
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 600px;
    margin-bottom: 40px;
  }

  .dp-hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: var(--radius-full);
    background: var(--division-accent);
    color: #fff;
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
    box-shadow: 0 4px 20px rgba(123, 111, 232, 0.35);
  }
  .dp-hero-cta:hover {
    transform: translateY(-3px) scale(1.02);
    filter: brightness(1.1);
    box-shadow: 0 8px 32px rgba(123, 111, 232, 0.5);
  }

  .dp-hero-note {
    margin-top: 16px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }

  /* Pipeline section */
  .dp-pipeline-section {
    padding: 100px 0;
    background: var(--bg);
    border-top: 1px solid var(--border);
  }
  .dp-pipeline-header {
    margin-bottom: 64px;
  }
  .dp-body {
    font-family: var(--font-body);
    font-size: 0.97rem;
    line-height: 1.75;
    color: var(--text-secondary);
    margin-bottom: 16px;
  }

  /* Agent timeline */
  .dp-timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
  }
  .dp-timeline::before {
    content: '';
    position: absolute;
    left: 39px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(123, 111, 232, 0.3) 5%,
      rgba(123, 111, 232, 0.3) 95%,
      transparent
    );
  }

  .dp-agent-card {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 32px;
    padding: 36px 0;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .dp-agent-card:last-child {
    border-bottom: none;
  }

  .dp-agent-number-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  .dp-agent-number-badge {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    border: 1.5px solid;
    position: relative;
    flex-shrink: 0;
    background: var(--bg);
    transition: transform 0.3s var(--ease);
  }
  .dp-agent-card:hover .dp-agent-number-badge {
    transform: scale(1.1);
  }

  .dp-agent-content {
    padding-top: 10px;
  }
  .dp-agent-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .dp-agent-name {
    font-family: var(--font-headline);
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--text-primary);
    line-height: 1.2;
  }
  .dp-agent-tagline {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.04em;
    margin-top: 3px;
  }
  .dp-time-badge {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: var(--radius-full);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    background: rgba(123, 111, 232, 0.08);
    color: var(--division-accent);
    border: 1px solid rgba(123, 111, 232, 0.2);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .dp-agent-role {
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }

  .dp-io-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 14px;
  }
  .dp-io-box {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 14px 16px;
  }
  .dp-io-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 6px;
  }
  .dp-io-label.input { color: #60a5fa; }
  .dp-io-label.output { color: #4ade80; }
  .dp-io-text {
    font-family: var(--font-body);
    font-size: 0.82rem;
    line-height: 1.55;
    color: var(--text-secondary);
  }

  .dp-time-note {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.02em;
    display: flex;
    align-items: flex-start;
    gap: 6px;
  }
  .dp-time-note::before {
    content: '↳';
    opacity: 0.5;
    flex-shrink: 0;
  }

  /* Human roles section */
  .dp-humans-section {
    padding: 100px 0;
    background: var(--bg-2);
    border-top: 1px solid var(--border);
  }
  .dp-humans-header {
    margin-bottom: 56px;
  }
  .dp-humans-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .dp-human-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  }
  .dp-human-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--navy), var(--division-accent));
    opacity: 0;
    transition: opacity 0.3s;
  }
  .dp-human-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-4px);
    box-shadow: var(--card-hover-shadow);
  }
  .dp-human-card:hover::before {
    opacity: 1;
  }
  .dp-human-role-title {
    font-family: var(--font-headline);
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text-primary);
    margin-bottom: 6px;
  }
  .dp-human-when {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--division-accent);
    letter-spacing: 0.04em;
    margin-bottom: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .dp-human-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .dp-human-list li {
    font-family: var(--font-body);
    font-size: 0.87rem;
    line-height: 1.6;
    color: var(--text-secondary);
    padding-left: 14px;
    position: relative;
  }
  .dp-human-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 9px;
    width: 5px;
    height: 1.5px;
    background: var(--division-accent);
    opacity: 0.5;
  }

  .dp-philosophy-strip {
    margin-top: 48px;
    background: rgba(123, 111, 232, 0.06);
    border: 1px solid rgba(123, 111, 232, 0.15);
    border-radius: var(--radius-lg);
    padding: 28px 32px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  .dp-philosophy-quote {
    font-family: var(--font-headline);
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text-primary);
    flex: 1;
    min-width: 200px;
  }
  .dp-philosophy-body {
    font-family: var(--font-body);
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--text-secondary);
    flex: 2;
    min-width: 260px;
  }

  /* Metrics section */
  .dp-metrics-section {
    padding: 100px 0;
    background: var(--bg);
    border-top: 1px solid var(--border);
  }
  .dp-metrics-header {
    margin-bottom: 56px;
  }
  .dp-metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  .dp-metric-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    position: relative;
    overflow: hidden;
  }
  .dp-metric-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--metric-color, var(--division-accent));
    opacity: 0.4;
  }
  .dp-metric-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-4px);
    box-shadow: var(--card-hover-shadow);
  }
  .dp-metric-value {
    font-family: var(--font-headline);
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 8px;
  }
  .dp-metric-label {
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.4;
    margin-bottom: 8px;
  }
  .dp-metric-note {
    font-family: var(--font-body);
    font-size: 0.8rem;
    line-height: 1.55;
    color: var(--text-muted);
  }

  /* CTA section */
  .dp-cta-section {
    padding: 100px 0 120px;
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }
  .dp-cta-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .dp-cta-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(123, 111, 232, 0.1) 0%, transparent 70%);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .dp-cta-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
  }
  .dp-cta-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    line-height: 1.1;
    max-width: 560px;
  }
  .dp-cta-sub {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 500px;
  }
  .dp-cta-buttons {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .dp-cta-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
    border-radius: var(--radius-full);
    background: var(--gradient-brand);
    color: #fff;
    font-family: var(--font-headline);
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    box-shadow: 0 4px 24px rgba(58, 88, 158, 0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .dp-cta-btn-primary:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 12px 40px rgba(58, 88, 158, 0.55);
  }
  .dp-cta-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
    border-radius: var(--radius-full);
    background: transparent;
    border: 1.5px solid var(--border);
    color: var(--text-primary);
    font-family: var(--font-headline);
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
  }
  .dp-cta-btn-ghost:hover {
    border-color: var(--division-accent);
    color: var(--division-accent);
  }
  .dp-cta-footnote {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }

  @media (max-width: 1024px) {
    .dp-metrics-grid { grid-template-columns: repeat(2, 1fr); }
    .dp-humans-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .dp-hero { padding: 120px 0 80px; }
    .dp-container { padding: 0 20px; }
    .dp-timeline::before { left: 23px; }
    .dp-agent-card { grid-template-columns: 56px 1fr; gap: 20px; }
    .dp-agent-number-badge { width: 36px; height: 36px; font-size: 0.65rem; }
    .dp-io-grid { grid-template-columns: 1fr; }
    .dp-metrics-grid { grid-template-columns: repeat(2, 1fr); }
    .dp-agent-header { flex-direction: column; align-items: flex-start; }
  }
  @media (max-width: 480px) {
    .dp-h1 { font-size: 2.1rem; }
    .dp-metrics-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Page component ────────────────────────────────────────────────────────────

export default function DevPipelinePage() {
  return (
    <>
      <style>{STYLES}</style>
      <main className="dp-page">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="dp-hero">
          <div className="dp-hero-bg" aria-hidden="true">
            <div className="dp-hero-orb dp-hero-orb-1" />
            <div className="dp-hero-orb dp-hero-orb-2" />
          </div>
          <div className="dp-container">
            <ScrollReveal>
              <p className="dp-label">The 10-Agent Pipeline</p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h1 className="dp-h1">How we build software<br />with AI.</h1>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="dp-subtitle">
                Not AI-assisted development. AI-orchestrated development, with humans as
                architects and reviewers. Ten specialized agents. Each with a single job.
                All coordinated by our engineers.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <Link href="/studio/start-project" className="dp-hero-cta">
                Start a project with us →
              </Link>
              <p className="dp-hero-note">Free consultation · No commitment · Honest scope assessment</p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Pipeline ──────────────────────────────────────────────────── */}
        <section className="dp-pipeline-section">
          <div className="dp-container">
            <ScrollReveal className="dp-pipeline-header">
              <p className="dp-label">Agent sequence</p>
              <h2 className="dp-h2">Ten agents. One pipeline.</h2>
              <p className="dp-body" style={{ maxWidth: 580 }}>
                Each agent has a specific input, a specific output, and a specific failure mode.
                No agent starts until the previous one has produced a verified output.
                Humans review at critical junctions — not as a formality, but as an architectural requirement.
              </p>
            </ScrollReveal>

            <div className="dp-timeline" role="list">
              {AGENTS.map((agent, i) => (
                <ScrollReveal key={agent.number} delay={i < 4 ? i * 0.06 : 0}>
                  <div className="dp-agent-card" role="listitem">
                    {/* Number column */}
                    <div className="dp-agent-number-col">
                      <div
                        className="dp-agent-number-badge"
                        style={{
                          color: agent.color,
                          borderColor: `color-mix(in srgb, ${agent.color} 35%, transparent)`,
                          backgroundColor: `color-mix(in srgb, ${agent.color} 8%, var(--bg))`,
                        }}
                        aria-hidden="true"
                      >
                        {agent.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="dp-agent-content">
                      <div className="dp-agent-header">
                        <div>
                          <h3 className="dp-agent-name" style={{ color: agent.color }}>
                            {agent.name}
                          </h3>
                          <p className="dp-agent-tagline">{agent.tagline}</p>
                        </div>
                        <span className="dp-time-badge">{agent.time}</span>
                      </div>

                      <p className="dp-agent-role">{agent.role}</p>

                      <div className="dp-io-grid">
                        <div className="dp-io-box">
                          <p className="dp-io-label input">Input</p>
                          <p className="dp-io-text">{agent.input}</p>
                        </div>
                        <div className="dp-io-box">
                          <p className="dp-io-label output">Output</p>
                          <p className="dp-io-text">{agent.output}</p>
                        </div>
                      </div>

                      <p className="dp-time-note">{agent.timeNote}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Human Roles ───────────────────────────────────────────────── */}
        <section className="dp-humans-section">
          <div className="dp-container">
            <ScrollReveal className="dp-humans-header">
              <p className="dp-label">Human roles</p>
              <h2 className="dp-h2">AI writes. Humans architect.</h2>
              <p className="dp-body" style={{ maxWidth: 580, marginBottom: 0 }}>
                The pipeline does not replace engineers. It changes what they spend their time on.
                Human engineers handle the 20% of decisions that require genuine judgment —
                the work that cannot be specified upfront.
              </p>
            </ScrollReveal>

            <StaggerChildren className="dp-humans-grid" stagger={0.1} delay={0.1}>
              {HUMAN_ROLES.map((role) => (
                <StaggerItem key={role.title}>
                  <div className="dp-human-card">
                    <h3 className="dp-human-role-title">{role.title}</h3>
                    <p className="dp-human-when">{role.when}</p>
                    <ul className="dp-human-list">
                      {role.responsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>

            <ScrollReveal delay={0.2}>
              <div className="dp-philosophy-strip">
                <p className="dp-philosophy-quote">&ldquo;AI writes. Humans architect. You scale.&rdquo;</p>
                <p className="dp-philosophy-body">
                  The agents handle throughput — volume, repetition, consistency, documentation.
                  The engineers handle judgment — trade-offs, constraints, edge cases, client relationships.
                  Neither works without the other. That is the model.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Metrics ───────────────────────────────────────────────────── */}
        <section className="dp-metrics-section">
          <div className="dp-container">
            <ScrollReveal className="dp-metrics-header">
              <p className="dp-label">Pipeline performance</p>
              <h2 className="dp-h2">What the numbers say.</h2>
              <p className="dp-body" style={{ maxWidth: 540, marginBottom: 0 }}>
                Internal data across 40+ projects built on the pipeline since we formalized
                the approach in mid-2025. These are honest averages — not best-case results.
              </p>
            </ScrollReveal>

            <StaggerChildren className="dp-metrics-grid" stagger={0.1} delay={0.1}>
              {METRICS.map((metric) => (
                <StaggerItem key={metric.label}>
                  <div
                    className="dp-metric-card"
                    style={{ '--metric-color': metric.color } as React.CSSProperties}
                  >
                    <div className="dp-metric-value" style={{ color: metric.color }}>
                      {metric.value}
                    </div>
                    <div className="dp-metric-label">{metric.label}</div>
                    <div className="dp-metric-note">{metric.note}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="dp-cta-section">
          <div className="dp-cta-bg" aria-hidden="true">
            <div className="dp-cta-orb" />
          </div>
          <div className="dp-container">
            <ScrollReveal>
              <div className="dp-cta-inner">
                <p className="dp-label" style={{ justifyContent: 'center' }}>Ready to ship</p>
                <h2 className="dp-cta-h2">Use this pipeline for your project.</h2>
                <p className="dp-cta-sub">
                  Bring us your idea, your broken prototype, or your backlog. We run the pipeline,
                  you get a production-ready product. Our engineers stay on to keep it running.
                </p>
                <div className="dp-cta-buttons">
                  <Link href="/studio/start-project" className="dp-cta-btn-primary">
                    Start a project →
                  </Link>
                  <Link href="/studio/process" className="dp-cta-btn-ghost">
                    See the full process
                  </Link>
                </div>
                <p className="dp-cta-footnote">
                  Free consultation · Honest timeline and cost estimate · No enterprise sales process
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </main>
    </>
  );
}
