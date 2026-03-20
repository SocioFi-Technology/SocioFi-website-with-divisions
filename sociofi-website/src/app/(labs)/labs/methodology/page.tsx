'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CYCLE_STEPS = [
  {
    number: '01',
    title: 'Identify the question',
    description:
      'A good research question is falsifiable and practically relevant — it must be possible to get a definitive answer, and the answer must matter to real engineering decisions. We do not investigate "how good is AI at X?" We investigate "does approach A outperform approach B on metric M in context C?"',
    note: 'Falsifiable + practically relevant. Both conditions required.',
  },
  {
    number: '02',
    title: 'Form a hypothesis',
    description:
      'Specific, measurable, tied to a practical outcome. Not "LLMs are good at classification" but "LLMs will achieve >90% accuracy on invoice classification, matching or exceeding our existing rule-based system." The hypothesis defines success and failure before you start.',
    note: 'Write the hypothesis before touching any data.',
  },
  {
    number: '03',
    title: 'Design the experiment',
    description:
      'Control conditions, success metrics, and failure criteria are defined upfront — before any code is written. What constitutes a confirmed hypothesis? What constitutes a failed one? What would make you abandon the experiment early? Document all of this.',
    note: 'Pre-register success criteria. No moving the goalposts.',
  },
  {
    number: '04',
    title: 'Run it',
    description:
      'Minimum viable experiment first. Do not over-engineer the experimental setup before you have signal. A lightweight version that can confirm or deny the hypothesis in two days is more valuable than a comprehensive study that takes three weeks to set up.',
    note: 'Minimum viable experiment. Signal first, fidelity second.',
  },
  {
    number: '05',
    title: 'Document thoroughly',
    description:
      'Methods, environment, model versions, prompts, data samples, observations — all recorded during the experiment, not reconstructed afterward. This is where most lab processes fail: documentation that relies on memory is documentation that will be wrong.',
    note: 'Document as you go. Memory is not a research tool.',
  },
  {
    number: '06',
    title: 'Publish',
    description:
      'Results go on the experiment log regardless of outcome. Notable findings — particularly unexpected ones, significant failures, or results that contradict common assumptions — become longer-form articles on the Labs blog. The publication step is not optional.',
    note: 'Publication is part of the experiment, not a postscript.',
  },
  {
    number: '07',
    title: 'Iterate',
    description:
      'Failed experiments define the next question. A confirmed hypothesis opens up the next-order question. Abandoned experiments leave a documented record of the dead end so future researchers do not repeat it. Every experiment either confirms, denies, or redirects — all three outcomes are useful.',
    note: 'The cycle ends when we run out of questions. It has not ended yet.',
  },
];

const PUBLICATION_STANDARDS = [
  {
    title: 'We publish everything',
    items: [
      'Completed experiments with confirmed or disconfirmed hypotheses',
      'Failed experiments with honest failure analysis',
      'Abandoned experiments with the reason for abandonment',
      'Running experiments with current status and preliminary observations',
      'Methodology updates and corrections when prior findings are revised',
    ],
  },
  {
    title: 'How we structure experiment logs',
    items: [
      'Experiment ID, stream, and date range',
      'Hypothesis stated in falsifiable form',
      'Methods: what we did, what tools, what data, what environment',
      'Results: the numbers or findings, raw',
      'Analysis: what the results mean and why',
      'Key learnings: concrete takeaways transferable to other contexts',
      'Next steps: what this opens or closes',
    ],
  },
  {
    title: 'How findings become articles',
    items: [
      'Findings that contradict common assumptions become deep-dive articles',
      'Experiments that reveal architectural principles get expanded treatment',
      'Failed experiments with broadly applicable failure patterns get their own posts',
      'No experiment becomes an article purely because the results were positive',
    ],
  },
  {
    title: 'Internal peer review',
    items: [
      'Every experiment write-up is reviewed by at least one engineer not involved in running it',
      'Reviewers check for: hypothesis clarity, method rigor, result interpretation, and conclusion validity',
      'Disagreements are noted in the write-up, not resolved by omission',
      'The review is documented alongside the experiment record',
    ],
  },
];

const ETHICS_PRINCIPLES = [
  {
    title: 'No cherry-picking',
    description:
      'Results are reported in full. If an experiment produced mixed or contradictory results, we publish the full distribution — not the subset that supports the hypothesis. An honest negative result is worth more than a misleading positive one.',
  },
  {
    title: 'Transparent about limitations',
    description:
      'Every experiment has scope constraints — sample sizes, controlled conditions, specific model versions, particular document types. We state these limitations explicitly. Findings that are true in our test conditions may not generalize; we say so.',
  },
  {
    title: 'Clear distinction between findings and recommendations',
    description:
      'A finding is what the data showed. A recommendation is what we think practitioners should do based on that data. These are different things. We keep them clearly separated in all published work — a finding becomes a recommendation only after explicit reasoning.',
  },
  {
    title: 'Acknowledge prior work',
    description:
      'When our findings confirm or contradict existing research or published work from others, we say so. We are not the first people to run experiments in applied AI. Situating our work in the broader landscape makes it more useful, not less.',
  },
];

// ─── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  .meth-page {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body);
  }

  .meth-hero {
    padding: 160px 0 100px;
    position: relative;
    overflow: hidden;
  }
  .meth-hero-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .meth-hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    animation: methOrb 16s ease-in-out infinite;
  }
  .meth-hero-orb-1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(123, 111, 232, 0.12) 0%, transparent 70%);
    top: -150px;
    left: -100px;
  }
  .meth-hero-orb-2 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(89, 163, 146, 0.07) 0%, transparent 70%);
    bottom: 0;
    right: 5%;
    animation-delay: 8s;
  }
  @keyframes methOrb {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-20px) scale(1.03); }
  }

  .meth-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .meth-label {
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
  .meth-label::before {
    content: '';
    width: 20px;
    height: 1.5px;
    background: var(--division-accent);
    display: inline-block;
  }

  .meth-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.6rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary);
    margin-bottom: 24px;
  }

  .meth-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    line-height: 1.15;
    margin-bottom: 16px;
  }

  .meth-subtitle {
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 640px;
  }

  /* Cycle section */
  .meth-cycle-section {
    padding: 100px 0;
    background: var(--bg);
    border-top: 1px solid var(--border);
  }
  .meth-cycle-header {
    margin-bottom: 64px;
  }
  .meth-cycle-grid {
    display: grid;
    grid-template-columns: 1fr;
    position: relative;
  }
  .meth-cycle-step {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 32px;
    padding: 32px 0;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .meth-cycle-step:last-child {
    border-bottom: none;
  }
  .meth-step-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 4px;
  }
  .meth-step-number {
    font-family: var(--font-mono);
    font-size: 2rem;
    font-weight: 700;
    color: var(--division-accent);
    line-height: 1;
    opacity: 0.7;
  }
  .meth-step-right {
    padding-top: 4px;
  }
  .meth-step-title {
    font-family: var(--font-headline);
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--text-primary);
    margin-bottom: 12px;
    line-height: 1.25;
  }
  .meth-step-desc {
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 14px;
  }
  .meth-step-note {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--division-accent);
    opacity: 0.8;
    letter-spacing: 0.02em;
  }
  .meth-step-note::before {
    content: '→';
    opacity: 0.6;
  }

  /* Publication standards section */
  .meth-pub-section {
    padding: 100px 0;
    background: var(--bg-2);
    border-top: 1px solid var(--border);
  }
  .meth-pub-header {
    margin-bottom: 56px;
  }
  .meth-pub-body {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 600px;
    margin-bottom: 0;
  }
  .meth-pub-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .meth-pub-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  }
  .meth-pub-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-4px);
    box-shadow: var(--card-hover-shadow);
  }
  .meth-pub-card-title {
    font-family: var(--font-headline);
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text-primary);
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }
  .meth-pub-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .meth-pub-list li {
    font-family: var(--font-body);
    font-size: 0.88rem;
    line-height: 1.6;
    color: var(--text-secondary);
    padding-left: 14px;
    position: relative;
  }
  .meth-pub-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 9px;
    width: 5px;
    height: 1.5px;
    background: var(--division-accent);
    opacity: 0.5;
  }

  /* Reproducibility section */
  .meth-repro-section {
    padding: 100px 0;
    background: var(--bg);
    border-top: 1px solid var(--border);
  }
  .meth-repro-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }
  .meth-body {
    font-family: var(--font-body);
    font-size: 0.97rem;
    line-height: 1.75;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }
  .meth-repro-checklist {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .meth-check-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-family: var(--font-body);
    font-size: 0.92rem;
    line-height: 1.6;
    color: var(--text-secondary);
  }
  .meth-check-icon {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: rgba(123, 111, 232, 0.12);
    border: 1px solid rgba(123, 111, 232, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .meth-check-icon svg {
    width: 10px;
    height: 10px;
  }
  .meth-tech-table {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }
  .meth-tech-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 0;
    border-bottom: 1px solid var(--border);
  }
  .meth-tech-row:last-child {
    border-bottom: none;
  }
  .meth-tech-key {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 14px 16px;
    background: rgba(123, 111, 232, 0.04);
    border-right: 1px solid var(--border);
    display: flex;
    align-items: center;
  }
  .meth-tech-val {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--text-secondary);
    padding: 14px 16px;
    display: flex;
    align-items: center;
  }

  /* Ethics section */
  .meth-ethics-section {
    padding: 100px 0;
    background: var(--bg-2);
    border-top: 1px solid var(--border);
  }
  .meth-ethics-header {
    margin-bottom: 56px;
  }
  .meth-ethics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  .meth-ethics-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 28px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  }
  .meth-ethics-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--division-accent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .meth-ethics-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-4px);
    box-shadow: var(--card-hover-shadow);
  }
  .meth-ethics-card:hover::before {
    opacity: 1;
  }
  .meth-ethics-title {
    font-family: var(--font-headline);
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text-primary);
    margin-bottom: 12px;
  }
  .meth-ethics-body {
    font-family: var(--font-body);
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  /* CTA */
  .meth-cta-section {
    padding: 100px 0 120px;
    background: var(--bg);
    border-top: 1px solid var(--border);
  }
  .meth-cta-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
  }
  .meth-cta-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    line-height: 1.15;
    max-width: 500px;
  }
  .meth-cta-sub {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 480px;
  }
  .meth-cta-links {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .meth-cta-link-primary {
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
    box-shadow: 0 4px 20px rgba(123, 111, 232, 0.3);
  }
  .meth-cta-link-primary:hover {
    transform: translateY(-3px) scale(1.02);
    filter: brightness(1.1);
  }
  .meth-cta-link-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: var(--radius-full);
    background: transparent;
    color: var(--text-primary);
    border: 1.5px solid var(--border);
    font-family: var(--font-headline);
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
  }
  .meth-cta-link-ghost:hover {
    border-color: var(--division-accent);
    color: var(--division-accent);
  }

  @media (max-width: 768px) {
    .meth-hero { padding: 120px 0 80px; }
    .meth-container { padding: 0 20px; }
    .meth-cycle-step { grid-template-columns: 56px 1fr; gap: 20px; }
    .meth-pub-grid { grid-template-columns: 1fr; }
    .meth-repro-layout { grid-template-columns: 1fr; gap: 48px; }
    .meth-ethics-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .meth-h1 { font-size: 2.1rem; }
    .meth-step-number { font-size: 1.5rem; }
  }
`;

// ─── Page component ────────────────────────────────────────────────────────────

export default function MethodologyPage() {
  return (
    <>
      <style>{STYLES}</style>
      <main className="meth-page">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="meth-hero">
          <div className="meth-hero-bg" aria-hidden="true">
            <div className="meth-hero-orb meth-hero-orb-1" />
            <div className="meth-hero-orb meth-hero-orb-2" />
          </div>
          <div className="meth-container">
            <ScrollReveal>
              <p className="meth-label">Research methodology</p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h1 className="meth-h1">How we research.</h1>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="meth-subtitle">
                Our approach to experiments, publishing, and maintaining intellectual honesty
                in applied AI research. We run structured experiments, document everything,
                and publish regardless of outcome.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Research Cycle ────────────────────────────────────────────── */}
        <section className="meth-cycle-section">
          <div className="meth-container">
            <ScrollReveal className="meth-cycle-header">
              <p className="meth-label">The research cycle</p>
              <h2 className="meth-h2">Seven steps. Every experiment.</h2>
              <p className="meth-body" style={{ maxWidth: 560 }}>
                Every experiment we run follows this cycle — from question to publication.
                The steps are not guidelines. Skipping any of them is how labs end up
                publishing results they cannot reproduce.
              </p>
            </ScrollReveal>

            <div className="meth-cycle-grid">
              {CYCLE_STEPS.map((step, i) => (
                <ScrollReveal key={step.number} delay={i * 0.07}>
                  <div className="meth-cycle-step">
                    <div className="meth-step-left">
                      <span className="meth-step-number">{step.number}</span>
                    </div>
                    <div className="meth-step-right">
                      <h3 className="meth-step-title">{step.title}</h3>
                      <p className="meth-step-desc">{step.description}</p>
                      <span className="meth-step-note">{step.note}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Publication Standards ─────────────────────────────────────── */}
        <section className="meth-pub-section">
          <div className="meth-container">
            <ScrollReveal className="meth-pub-header">
              <p className="meth-label">Publication standards</p>
              <h2 className="meth-h2">What we publish and how.</h2>
              <p className="meth-pub-body">
                Publication is not an afterthought — it is built into the experimental design.
                Before we run an experiment, we know what a publishable result looks like.
              </p>
            </ScrollReveal>

            <StaggerChildren className="meth-pub-grid" stagger={0.08} delay={0.1}>
              {PUBLICATION_STANDARDS.map((block) => (
                <StaggerItem key={block.title}>
                  <div className="meth-pub-card">
                    <h3 className="meth-pub-card-title">{block.title}</h3>
                    <ul className="meth-pub-list">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* ── Reproducibility ───────────────────────────────────────────── */}
        <section className="meth-repro-section">
          <div className="meth-container">
            <div className="meth-repro-layout">
              {/* Left: text */}
              <ScrollReveal>
                <div>
                  <p className="meth-label">Reproducibility</p>
                  <h2 className="meth-h2">Built to be repeated.</h2>
                  <p className="meth-body">
                    A finding that cannot be reproduced is not a finding. Every experiment we
                    design is built with reproducibility as a constraint — not an aspiration.
                  </p>
                  <p className="meth-body">
                    This means documenting not just what we did, but what environment we did it in,
                    what exact model versions we used, what data we worked with, and what parameters
                    we set. A published experiment should be executable by anyone who reads it.
                  </p>
                  <p className="meth-body">
                    Where code and datasets are not proprietary, we open-source them. We release
                    tools, prompts, and evaluation frameworks where we can. Research that lives only
                    in a blog post is research that cannot be verified.
                  </p>
                  <div className="meth-repro-checklist">
                    {[
                      'Model name and version pinned for every experiment',
                      'Prompts published verbatim in experiment logs',
                      'Evaluation datasets released under open license when possible',
                      'Environment specs (hardware, OS, dependency versions) documented',
                      'Code open-sourced under MIT where no proprietary constraint exists',
                      'Results tables include raw numbers, not just summarized conclusions',
                    ].map((item) => (
                      <div className="meth-check-item" key={item}>
                        <span className="meth-check-icon">
                          <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
                            <path
                              d="M2 5.5L4 7.5L8 3"
                              stroke="var(--division-accent)"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Right: environment spec example */}
              <ScrollReveal delay={0.15}>
                <div>
                  <p className="meth-label" style={{ marginBottom: 20 }}>Example: environment spec</p>
                  <p className="meth-body" style={{ marginBottom: 20 }}>
                    This is the level of documentation we include in every published experiment:
                  </p>
                  <div className="meth-tech-table">
                    {[
                      ['Experiment', 'EXP-004 — Document Classification'],
                      ['Date', '2025-08-14 → 2025-10-02'],
                      ['Model', 'claude-3-5-sonnet-20241022'],
                      ['Temp', '0 (deterministic)'],
                      ['Eval set', '1,200 documents (invoices, POs, receipts)'],
                      ['Baseline', 'Rule-based classifier v2.1.3'],
                      ['Hardware', 'Single GPU instance, 8x A100'],
                      ['Framework', 'Python 3.12 / LangChain 0.3.1'],
                      ['Metric', 'Top-1 accuracy on held-out test split (20%)'],
                    ].map(([key, val]) => (
                      <div className="meth-tech-row" key={key}>
                        <span className="meth-tech-key">{key}</span>
                        <span className="meth-tech-val">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Research Ethics ───────────────────────────────────────────── */}
        <section className="meth-ethics-section">
          <div className="meth-container">
            <ScrollReveal className="meth-ethics-header">
              <p className="meth-label">Research ethics</p>
              <h2 className="meth-h2">The rules we do not break.</h2>
              <p className="meth-body" style={{ maxWidth: 560, marginBottom: 0 }}>
                Applied AI research is young and the norms are still forming. We operate by
                principles that we think should be the standard — even when they are not convenient.
              </p>
            </ScrollReveal>

            <StaggerChildren className="meth-ethics-grid" stagger={0.08} delay={0.1}>
              {ETHICS_PRINCIPLES.map((principle) => (
                <StaggerItem key={principle.title}>
                  <div className="meth-ethics-card">
                    <h3 className="meth-ethics-title">{principle.title}</h3>
                    <p className="meth-ethics-body">{principle.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="meth-cta-section">
          <div className="meth-container">
            <ScrollReveal>
              <div className="meth-cta-inner">
                <p className="meth-label" style={{ justifyContent: 'center' }}>See it in practice</p>
                <h2 className="meth-cta-h2">Read the experiment log.</h2>
                <p className="meth-cta-sub">
                  Every experiment we have run — completed, failed, and abandoned — is published
                  in the experiment log. Methodology in action.
                </p>
                <div className="meth-cta-links">
                  <Link href="/labs/experiments" className="meth-cta-link-primary">
                    View experiment log →
                  </Link>
                  <Link href="/labs/blog" className="meth-cta-link-ghost">
                    Read the blog
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </main>
    </>
  );
}
