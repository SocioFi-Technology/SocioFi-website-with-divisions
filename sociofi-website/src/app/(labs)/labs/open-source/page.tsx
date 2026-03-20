'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ── Constants ──────────────────────────────────────────────────────────────────

const A = '#7B6FE8';

// ── Types ──────────────────────────────────────────────────────────────────────

type Category = 'tooling' | 'benchmark' | 'framework' | 'dataset';
type Language = 'TypeScript' | 'Python';
type License = 'MIT' | 'Apache 2.0' | 'CC-BY 4.0';
type Status = 'ACTIVE' | 'MAINTENANCE';

interface Project {
  name: string;
  tagline: string;
  description: string;
  language: Language;
  category: Category;
  license: License;
  stars: number;
  status: Status;
  hasDocs: boolean;
}

// ── Data ───────────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    name: 'agent-eval',
    tagline: 'Evaluation harness for multi-agent systems',
    description:
      'Standardized benchmarks for testing multi-agent coordination, tool use reliability, and failure recovery. 47 built-in test scenarios covering common failure modes in production agent systems.',
    language: 'TypeScript',
    category: 'tooling',
    license: 'MIT',
    stars: 312,
    status: 'ACTIVE',
    hasDocs: true,
  },
  {
    name: 'prompt-guard',
    tagline: 'Prompt injection detection and sanitization',
    description:
      'Detects and blocks prompt injection attempts with <2ms latency. 94% accuracy on our benchmark dataset. Supports custom allowlists and configurable sensitivity thresholds for different deployment contexts.',
    language: 'Python',
    category: 'tooling',
    license: 'Apache 2.0',
    stars: 489,
    status: 'ACTIVE',
    hasDocs: true,
  },
  {
    name: 'rag-bench',
    tagline: 'Benchmarking suite for RAG pipelines',
    description:
      'Compare retrieval strategies, chunking methods, and embedding models on standardized datasets. Used by 200+ teams to evaluate RAG configurations before production deployment.',
    language: 'Python',
    category: 'benchmark',
    license: 'MIT',
    stars: 271,
    status: 'ACTIVE',
    hasDocs: true,
  },
  {
    name: 'spec-runner',
    tagline: 'Spec-to-test pipeline',
    description:
      'Convert natural language specifications into executable test suites. Integrates with Jest and Vitest. Extracts behavioral requirements from specs and generates property-based and example-based tests.',
    language: 'TypeScript',
    category: 'framework',
    license: 'MIT',
    stars: 156,
    status: 'ACTIVE',
    hasDocs: true,
  },
  {
    name: 'industry-datasets',
    tagline: 'Curated labeled datasets for business document automation',
    description:
      'Annotated real-world business documents for training and evaluating automation models. 50K+ examples across invoices, purchase orders, contracts, and insurance forms. CC-BY licensed.',
    language: 'Python',
    category: 'dataset',
    license: 'CC-BY 4.0',
    stars: 98,
    status: 'ACTIVE',
    hasDocs: false,
  },
  {
    name: 'flow-tracer',
    tagline: 'Observability for multi-step AI workflows',
    description:
      'Trace, visualize, and debug complex agent pipelines. OpenTelemetry compatible. Captures tool call inputs and outputs, latency at each step, and token usage per agent. Works with any orchestration framework.',
    language: 'TypeScript',
    category: 'tooling',
    license: 'MIT',
    stars: 203,
    status: 'ACTIVE',
    hasDocs: true,
  },
];

const CATEGORY_LABELS: Record<Category, string> = {
  tooling: 'TOOLING',
  benchmark: 'BENCHMARK',
  framework: 'FRAMEWORK',
  dataset: 'DATASET',
};

const CATEGORY_COLORS: Record<Category, string> = {
  tooling: A,
  benchmark: '#4DBFA8',
  framework: '#E8916F',
  dataset: '#E8B84D',
};

// ── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  .oss-page {
    background: var(--bg);
    min-height: 100vh;
  }
  .oss-hero {
    padding-top: calc(var(--space-section) + 60px);
    padding-bottom: 80px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }
  .oss-hero::before {
    content: '';
    position: absolute;
    top: -160px;
    left: -160px;
    width: 560px;
    height: 560px;
    background: radial-gradient(circle, color-mix(in srgb, ${A} 10%, transparent) 0%, transparent 70%);
    pointer-events: none;
  }
  .oss-hero::after {
    content: '';
    position: absolute;
    bottom: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, color-mix(in srgb, #4DBFA8 8%, transparent) 0%, transparent 70%);
    pointer-events: none;
  }
  .oss-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .oss-container--narrow {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .oss-label {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .oss-label::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1.5px;
    background: ${A};
  }
  .oss-h1 {
    font-family: var(--font-headline);
    font-size: clamp(2.2rem, 4.5vw, 3.4rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.08;
    color: var(--text-primary);
    margin-bottom: 20px;
    max-width: 18ch;
  }
  .oss-subtitle {
    font-family: var(--font-body);
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 52ch;
    margin-bottom: 40px;
  }
  .oss-stats {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .oss-stat {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--text-muted);
    background: var(--bg-2);
    border: 1px solid var(--border);
    padding: 6px 14px;
    border-radius: 100px;
  }
  .oss-stat-sep {
    color: var(--border);
    font-size: 0.8rem;
  }
  .oss-projects {
    padding: 80px 0;
    background: var(--bg);
  }
  .oss-projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  .project-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 32px;
    display: flex;
    flex-direction: column;
    transition: border-color 0.3s var(--ease), transform 0.3s var(--ease);
    position: relative;
    overflow: hidden;
  }
  .project-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--card-accent-color, ${A}), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .project-card:hover {
    border-color: color-mix(in srgb, ${A} 30%, transparent);
    transform: translateY(-3px);
  }
  .project-card:hover::before {
    opacity: 1;
  }
  .project-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }
  .project-name {
    font-family: var(--font-mono);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .project-badges {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .badge-category {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    padding: 3px 8px;
    border-radius: 100px;
    border: 1px solid;
    white-space: nowrap;
  }
  .badge-language {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    color: var(--text-muted);
    background: var(--bg-2);
    border: 1px solid var(--border);
    padding: 3px 8px;
    border-radius: 100px;
    white-space: nowrap;
  }
  .badge-license {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    font-weight: 500;
    color: var(--text-muted);
    background: transparent;
    border: 1px solid var(--border);
    padding: 3px 7px;
    border-radius: 100px;
    white-space: nowrap;
  }
  .badge-status-active {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #4DBFA8;
    background: color-mix(in srgb, #4DBFA8 10%, transparent);
    border: 1px solid color-mix(in srgb, #4DBFA8 25%, transparent);
    padding: 3px 8px;
    border-radius: 100px;
    white-space: nowrap;
  }
  .badge-status-maintenance {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    background: var(--bg-2);
    border: 1px solid var(--border);
    padding: 3px 8px;
    border-radius: 100px;
    white-space: nowrap;
  }
  .project-tagline {
    font-family: var(--font-body);
    font-size: 0.84rem;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }
  .project-description {
    font-family: var(--font-body);
    font-size: 0.88rem;
    line-height: 1.65;
    color: var(--text-secondary);
    flex: 1;
    margin-bottom: 24px;
  }
  .project-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }
  .project-stars {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-muted);
  }
  .star-icon {
    width: 13px;
    height: 13px;
    color: var(--text-muted);
  }
  .project-links {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .project-link {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: opacity 0.2s;
  }
  .project-link:hover {
    opacity: 0.7;
  }
  .project-link-sep {
    color: var(--border);
    font-size: 0.8rem;
  }
  .oss-contributing {
    padding: 80px 0;
    background: var(--bg-2);
    border-top: 1px solid var(--border);
  }
  .contributing-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
  }
  .contributing-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .contributing-label::before {
    content: '';
    display: inline-block;
    width: 18px;
    height: 1.5px;
    background: ${A};
  }
  .contributing-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: var(--text-primary);
    margin-bottom: 16px;
  }
  .contributing-p {
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }
  .contributing-steps {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .contributing-step {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }
  .contributing-step-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: color-mix(in srgb, ${A} 12%, transparent);
    border: 1px solid color-mix(in srgb, ${A} 25%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    color: ${A};
    flex-shrink: 0;
    margin-top: 2px;
  }
  .contributing-step-text {
    font-family: var(--font-body);
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--text-secondary);
  }
  .contributing-step-text strong {
    color: var(--text-primary);
    font-weight: 600;
  }
  .contributing-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-headline);
    font-size: 0.88rem;
    font-weight: 600;
    color: ${A};
    text-decoration: none;
    border: 1.5px solid color-mix(in srgb, ${A} 35%, transparent);
    padding: 10px 22px;
    border-radius: 100px;
    transition: all 0.2s var(--ease);
    margin-top: 8px;
  }
  .contributing-link:hover {
    background: color-mix(in srgb, ${A} 10%, transparent);
    border-color: ${A};
    transform: translateY(-2px);
  }
  .oss-philosophy {
    padding: 80px 0 120px;
    background: var(--bg);
    border-top: 1px solid var(--border);
  }
  .philosophy-inner {
    max-width: 760px;
  }
  .philosophy-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${A};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .philosophy-label::before {
    content: '';
    display: inline-block;
    width: 18px;
    height: 1.5px;
    background: ${A};
  }
  .philosophy-h2 {
    font-family: var(--font-headline);
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: var(--text-primary);
    margin-bottom: 24px;
  }
  .philosophy-p {
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.78;
    color: var(--text-secondary);
    margin-bottom: 16px;
  }
  .philosophy-quote {
    margin: 36px 0;
    padding: 24px 28px;
    background: color-mix(in srgb, ${A} 6%, var(--bg-card));
    border-left: 3px solid ${A};
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    font-family: var(--font-body);
    font-size: 0.98rem;
    font-style: italic;
    line-height: 1.7;
    color: var(--text-primary);
  }
  @media (max-width: 1024px) {
    .contributing-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }
  @media (max-width: 768px) {
    .oss-container {
      padding: 0 20px;
    }
    .oss-container--narrow {
      padding: 0 20px;
    }
    .oss-projects-grid {
      grid-template-columns: 1fr;
    }
    .project-badges {
      justify-content: flex-start;
    }
  }
`;

// ── Components ────────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accentColor = CATEGORY_COLORS[project.category];

  return (
    <motion.article
      className="project-card"
      style={{ '--card-accent-color': accentColor } as React.CSSProperties}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="project-card-header">
        <div className="project-name">{project.name}</div>
        <div className="project-badges">
          <span
            className="badge-category"
            style={{
              color: accentColor,
              background: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
              borderColor: `color-mix(in srgb, ${accentColor} 25%, transparent)`,
            }}
          >
            {CATEGORY_LABELS[project.category]}
          </span>
          <span className={project.status === 'ACTIVE' ? 'badge-status-active' : 'badge-status-maintenance'}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Tagline */}
      <div className="project-tagline">{project.tagline}</div>

      {/* Description */}
      <p className="project-description">{project.description}</p>

      {/* Footer */}
      <div className="project-footer">
        <div className="project-stars">
          <svg className="star-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
          </svg>
          {project.stars.toLocaleString()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge-language">{project.language}</span>
          <span className="badge-license">{project.license}</span>
        </div>
        <div className="project-links">
          <a href="#" className="project-link" aria-label={`View ${project.name} on GitHub`}>
            GitHub
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9" />
              <path d="M13 3h-4m4 0v4m0-4L7 9" />
            </svg>
          </a>
          {project.hasDocs && (
            <>
              <span className="project-link-sep">·</span>
              <a href="#" className="project-link" aria-label={`View ${project.name} documentation`}>
                Docs
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9" />
                  <path d="M13 3h-4m4 0v4m0-4L7 9" />
                </svg>
              </a>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LabsOpenSourcePage() {
  const [email, setEmail] = useState('');

  const totalStars = PROJECTS.reduce((sum, p) => sum + p.stars, 0);

  return (
    <div className="oss-page">
      <style>{STYLES}</style>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="oss-hero">
        <div className="oss-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="oss-label">Labs · Open Source</div>
            <h1 className="oss-h1">Open source tools from the Labs team.</h1>
            <p className="oss-subtitle">
              We build things for our own work, then release them. No strings. MIT or Apache licensed. These tools run in our own production systems before anyone else touches them.
            </p>
            <div className="oss-stats">
              <span className="oss-stat">6 repos</span>
              <span className="oss-stat-sep">·</span>
              <span className="oss-stat">{totalStars.toLocaleString()}+ total stars</span>
              <span className="oss-stat-sep">·</span>
              <span className="oss-stat">4 languages</span>
              <span className="oss-stat-sep">·</span>
              <span className="oss-stat">3 licenses</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Projects grid ────────────────────────────────────────────────── */}
      <section className="oss-projects">
        <div className="oss-container">
          <div className="oss-projects-grid">
            {PROJECTS.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contributing ─────────────────────────────────────────────────── */}
      <section className="oss-contributing">
        <div className="oss-container">
          <div className="contributing-grid">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="contributing-label">Contributing</div>
              <h2 className="contributing-h2">
                Contributions<br />are welcome.
              </h2>
              <p className="contributing-p">
                Every project has a{' '}
                <code
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85em',
                    color: A,
                    background: `color-mix(in srgb, ${A} 8%, transparent)`,
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  CONTRIBUTING.md
                </code>{' '}
                with setup instructions and contribution guidelines. We review pull requests from the community and typically respond within 3 business days.
              </p>
              <Link href="/labs/contribute" className="contributing-link">
                Contribution guide
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="contributing-steps">
                {[
                  {
                    step: '01',
                    text: (
                      <>
                        <strong>Fork the repository</strong> and create a branch from{' '}
                        <code
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85em',
                            color: A,
                            background: `color-mix(in srgb, ${A} 8%, transparent)`,
                            padding: '1px 5px',
                            borderRadius: 3,
                          }}
                        >
                          main
                        </code>
                        . Name it descriptively.
                      </>
                    ),
                  },
                  {
                    step: '02',
                    text: (
                      <>
                        <strong>Run the test suite</strong> locally before making changes. All contributions must pass existing tests and include tests for new behavior.
                      </>
                    ),
                  },
                  {
                    step: '03',
                    text: (
                      <>
                        <strong>Open a pull request</strong> with a clear description of what you changed and why. Reference any related issues.
                      </>
                    ),
                  },
                  {
                    step: '04',
                    text: (
                      <>
                        <strong>Address review feedback.</strong> Our team reviews all PRs and may request changes or clarification before merging.
                      </>
                    ),
                  },
                ].map(({ step, text }) => (
                  <div key={step} className="contributing-step">
                    <div className="contributing-step-num">{step}</div>
                    <div className="contributing-step-text">{text}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Usage philosophy ─────────────────────────────────────────────── */}
      <section className="oss-philosophy">
        <div className="oss-container">
          <motion.div
            className="philosophy-inner"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="philosophy-label">Why we open source</div>
            <h2 className="philosophy-h2">
              Tools we built<br />for ourselves first.
            </h2>
            <p className="philosophy-p">
              Every project in this catalog started as internal tooling. We built agent-eval because we needed a standardized way to measure tool use reliability across client systems. We built prompt-guard because we were handling prompt injection incidents manually and it was not sustainable. We built flow-tracer because debugging production agent pipelines without observability was costing us hours per incident.
            </p>
            <div className="philosophy-quote">
              "These tools run in our own production systems first. We release them when they are ready for others — when the rough edges are smoothed out and the documentation is good enough that someone outside our team can use them without help."
            </div>
            <p className="philosophy-p">
              We release under permissive licenses (MIT, Apache 2.0, CC-BY 4.0) because we believe the tooling ecosystem for AI engineering is still early and fragmented. Keeping useful tools proprietary slows the whole field down. There is nothing in these repos that is a competitive differentiator for us — our advantage is in how we apply these tools, not in the tools themselves.
            </p>
            <p className="philosophy-p">
              We maintain these repositories because we still use them. If we stop using a tool internally, we will archive the repository and say so clearly. We will not let projects rot silently.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
