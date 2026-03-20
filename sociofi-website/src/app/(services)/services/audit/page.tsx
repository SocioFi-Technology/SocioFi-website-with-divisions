'use client';

import Hero from '@/components/sections/Hero';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import CTASection from '@/components/shared/CTASection';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import {
  Shield,
  Database,
  Chart,
  Code,
  Gear,
  Lock,
  Globe,
  Book,
  Check,
  ArrowRight,
} from '@/lib/icons';

const A = '#4DBFA8';

// ── Audit Areas ──────────────────────────────────────────────────────────────

const auditAreas = [
  {
    icon: <Gear size={24} aria-hidden="true" />,
    title: 'Architecture Review',
    description:
      'Is your system structured for growth or held together with tape? We map your dependency graph, identify tightly coupled modules, and flag architectural patterns that will cause problems at scale.',
  },
  {
    icon: <Shield size={24} aria-hidden="true" />,
    title: 'Security Scan',
    description:
      'Known vulnerabilities in every dependency, exposed credentials in version history, outdated libraries with public CVEs. We find what attackers would find — before they do.',
  },
  {
    icon: <Database size={24} aria-hidden="true" />,
    title: 'Database Health',
    description:
      'Query performance analysis, missing indexes, N+1 query patterns, connection pool configuration, and backup verification. Most database problems are invisible until they are catastrophic.',
  },
  {
    icon: <Chart size={24} aria-hidden="true" />,
    title: 'Performance Baseline',
    description:
      'Current load times, Core Web Vitals scores, API response percentiles, and bottleneck identification. You need to know where you stand before you can know if you are improving.',
  },
  {
    icon: <Code size={24} aria-hidden="true" />,
    title: 'Dependency Audit',
    description:
      'Every library checked for active maintenance, known security issues, license compatibility, and available updates. Dependency rot is one of the most common causes of production incidents.',
  },
  {
    icon: <Book size={24} aria-hidden="true" />,
    title: 'Code Quality',
    description:
      'Test coverage analysis, documentation completeness, coding standards consistency, and technical debt identification. We assess how maintainable your codebase actually is.',
  },
  {
    icon: <Globe size={24} aria-hidden="true" />,
    title: 'Hosting Review',
    description:
      'Server configuration, environment variable management, scaling readiness, cost optimisation opportunities, and deployment process assessment. Are you paying for what you need?',
  },
  {
    icon: <Lock size={24} aria-hidden="true" />,
    title: 'Documentation Check',
    description:
      'What exists, what is missing, what is outdated. A codebase without documentation is a codebase only the original developer can maintain — and only if they remember why they made each decision.',
  },
];

// ── Report Sections ──────────────────────────────────────────────────────────

const reportSections = [
  'Overall health score (0–100) with breakdown by area',
  'Critical issues — things that need fixing now',
  'Moderate concerns — things to address in the next quarter',
  'Improvement recommendations — low-effort, high-impact wins',
  'Recommended Services plan based on what we find',
  'Architecture diagram showing system structure and data flow',
];

// ── Process Steps ─────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Give us code access',
    description:
      'A read-only token on GitHub, GitLab, or Bitbucket is all we need. No write access. No deployment credentials. If you are self-hosted, we coordinate on a secure access method.',
    duration: '15 min',
  },
  {
    num: '02',
    title: 'We review for 1–2 business days',
    description:
      'Our engineers go through the codebase methodically across all eight areas. We take notes, capture screenshots, and build the written report in parallel.',
    duration: '1–2 days',
  },
  {
    num: '03',
    title: 'Report and video walkthrough',
    description:
      'You receive a written report in plain English — no jargon, no error code dumps — plus a recorded video walkthrough where we talk you through the findings.',
    duration: '1 hour',
  },
  {
    num: '04',
    title: 'You decide what to do next',
    description:
      'Sign a plan and the $399 is credited in full. Fix things yourself using the report. Or do nothing — the report is yours to keep regardless.',
    duration: 'Your call',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function AuditPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Hero
        badge="Software Audit"
        headline={
          <>
            Don&apos;t Know What Shape Your{' '}
            <span className="gradient-text">Software Is In?</span>{' '}
            Let Us Look.
          </>
        }
        description="A comprehensive codebase review by SocioFi engineers. We check eight critical areas, write a plain-English report, and walk you through every finding. $399, credited in full to any plan."
        buttons={[
          { label: 'Request an audit', href: '#audit-form', variant: 'primary' },
          { label: 'See plans', href: '/services/plans', variant: 'ghost' },
        ]}
        layout="centered"
        showGrid
        showOrbs
      />

      {/* ── 8 Audit Areas ─────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="What we check"
              title="Eight areas. Every time."
              subtitle="Every audit covers all eight areas — no skipping the uncomfortable parts."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          <StaggerChildren>
            {auditAreas.map((area, i) => (
              <StaggerItem key={i}>
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `color-mix(in srgb, ${A} 30%, transparent)`;
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--card-hover-shadow)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-sm)',
                      background: `color-mix(in srgb, ${A} 10%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${A} 20%, transparent)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: A,
                      marginBottom: 16,
                    }}
                  >
                    {area.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: 'var(--text-primary)',
                      marginBottom: 10,
                    }}
                  >
                    {area.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      lineHeight: 1.65,
                      color: 'var(--text-secondary)',
                      margin: 0,
                    }}
                  >
                    {area.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* ── What You Get ──────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg)',
        }}
      >
        <Container>
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
            style={{ alignItems: 'center' }}
          >
            <ScrollReveal direction="right">
              <SectionHeader
                label="The deliverable"
                title="A written audit report in plain English."
                subtitle='Not a PDF full of error codes. Not a wall of terminal output. A structured report written for someone who runs a business — with context, priorities, and a clear path forward.'
                className="mb-8"
              />
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                }}
              >
                Plus a recorded video walkthrough where we talk you through every finding — so
                you understand what it means and what to do about it.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left">
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '36px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, var(--navy), ${A})`,
                  }}
                  aria-hidden="true"
                />
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    color: A,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginBottom: 20,
                  }}
                >
                  Report includes
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {reportSections.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: `color-mix(in srgb, ${A} 12%, transparent)`,
                          border: `1.5px solid color-mix(in srgb, ${A} 25%, transparent)`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 2,
                          color: A,
                        }}
                        aria-hidden="true"
                      >
                        <Check size={11} strokeWidth={2.5} />
                      </span>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                          color: 'var(--text-secondary)',
                          margin: 0,
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container narrow>
          <ScrollReveal>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '52px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, ${A} 6%, transparent) 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              />

              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: A,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: 16,
                }}
              >
                Pricing
              </p>

              <div
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: 'clamp(3rem, 6vw, 5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                $399
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.1rem',
                  color: 'var(--text-secondary)',
                  marginBottom: 32,
                }}
              >
                Flat fee. Credited in full to any Services plan.
              </p>

              <div
                style={{
                  display: 'inline-block',
                  padding: '20px 32px',
                  background: `color-mix(in srgb, ${A} 8%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${A} 20%, transparent)`,
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 32,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    margin: 0,
                    maxWidth: '48ch',
                  }}
                >
                  If you sign a plan after the audit, the $399 is credited to your first month.
                  The audit was effectively free. If you decide not to, you still keep the full
                  written report and video walkthrough.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="#audit-form"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '14px 28px',
                    background: 'var(--gradient-brand)',
                    color: 'white',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-headline)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    textDecoration: 'none',
                    boxShadow: '0 4px 24px rgba(58,88,158,0.35)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  Request an audit <ArrowRight size={16} />
                </a>
                <a
                  href="/services/plans"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '14px 28px',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-headline)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s ease, color 0.2s ease',
                  }}
                >
                  View plans
                </a>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Process ───────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="How it works"
              title="Four steps. Two business days."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          <StaggerChildren>
            {steps.map((step, i) => (
              <StaggerItem key={i}>
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px',
                    position: 'relative',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      color: A,
                      letterSpacing: '0.12em',
                      marginBottom: 12,
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: 'var(--text-primary)',
                      marginBottom: 10,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      lineHeight: 1.65,
                      color: 'var(--text-secondary)',
                      margin: '0 0 16px',
                    }}
                  >
                    {step.description}
                  </p>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: `color-mix(in srgb, ${A} 8%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${A} 15%, transparent)`,
                      borderRadius: 'var(--radius-full)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      color: A,
                    }}
                  >
                    {step.duration}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* ── CEO Quote ─────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container narrow>
          <ScrollReveal>
            <div
              style={{
                padding: '48px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, var(--navy), ${A})`,
                }}
                aria-hidden="true"
              />
              <svg
                width={32}
                height={32}
                viewBox="0 0 24 24"
                fill="none"
                stroke={A}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginBottom: 20, opacity: 0.6 }}
                aria-hidden="true"
              >
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
              </svg>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.15rem',
                  lineHeight: 1.75,
                  color: 'var(--text-primary)',
                  marginBottom: 28,
                  maxWidth: '58ch',
                }}
              >
                30% of our audits reveal critical security issues the client had no idea about.
                Not theoretical vulnerabilities — active attack vectors with known exploits.
                The audit is not pessimism. It is due diligence.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, var(--navy), ${A})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-headline)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'white',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  AR
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    Arifur Rahman
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      margin: 0,
                    }}
                  >
                    CEO, SocioFi Technology
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Audit Request Form ────────────────────────────────────────────── */}
      <section
        id="audit-form"
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg)',
          scrollMarginTop: '80px',
        }}
      >
        <Container narrow>
          <ScrollReveal>
            <SectionHeader
              label="Get started"
              title="Request a software audit"
              subtitle="Fill in the details below and we will follow up within 4 hours to arrange access and confirm the timeline."
              centered
              className="mb-12"
            />
          </ScrollReveal>

          <ScrollReveal>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '48px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, var(--navy), ${A})`,
                }}
                aria-hidden="true"
              />

              <form
                onSubmit={e => e.preventDefault()}
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label
                      htmlFor="audit-name"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.84rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Your name
                    </label>
                    <input
                      id="audit-name"
                      type="text"
                      placeholder="Arifur Rahman"
                      required
                      style={{
                        padding: '12px 16px',
                        background: 'var(--bg-2)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                      onFocus={e =>
                        ((e.target as HTMLInputElement).style.borderColor = `color-mix(in srgb, ${A} 40%, transparent)`)
                      }
                      onBlur={e =>
                        ((e.target as HTMLInputElement).style.borderColor = 'var(--border)')
                      }
                    />
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label
                      htmlFor="audit-email"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.84rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Work email
                    </label>
                    <input
                      id="audit-email"
                      type="email"
                      placeholder="you@company.com"
                      required
                      style={{
                        padding: '12px 16px',
                        background: 'var(--bg-2)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                      onFocus={e =>
                        ((e.target as HTMLInputElement).style.borderColor = `color-mix(in srgb, ${A} 40%, transparent)`)
                      }
                      onBlur={e =>
                        ((e.target as HTMLInputElement).style.borderColor = 'var(--border)')
                      }
                    />
                  </div>
                </div>

                {/* Hosting */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label
                    htmlFor="audit-hosting"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Where is your code hosted?
                  </label>
                  <select
                    id="audit-hosting"
                    required
                    style={{
                      padding: '12px 16px',
                      background: 'var(--bg-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: 'var(--text-secondary)',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onFocus={e =>
                      ((e.target as HTMLSelectElement).style.borderColor = `color-mix(in srgb, ${A} 40%, transparent)`)
                    }
                    onBlur={e =>
                      ((e.target as HTMLSelectElement).style.borderColor = 'var(--border)')
                    }
                  >
                    <option value="">Select an option</option>
                    <option value="github">GitHub</option>
                    <option value="gitlab">GitLab</option>
                    <option value="bitbucket">Bitbucket</option>
                    <option value="self-hosted">Self-hosted Git</option>
                    <option value="other">Other / not sure</option>
                  </select>
                </div>

                {/* Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label
                    htmlFor="audit-description"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.84rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Tell us about your software
                  </label>
                  <textarea
                    id="audit-description"
                    rows={4}
                    placeholder="What does your software do? What stack is it built on? Any specific concerns you have going in?"
                    style={{
                      padding: '12px 16px',
                      background: 'var(--bg-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color 0.2s ease',
                    }}
                    onFocus={e =>
                      ((e.target as HTMLTextAreaElement).style.borderColor = `color-mix(in srgb, ${A} 40%, transparent)`)
                    }
                    onBlur={e =>
                      ((e.target as HTMLTextAreaElement).style.borderColor = 'var(--border)')
                    }
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '14px 32px',
                      background: 'var(--gradient-brand)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      fontFamily: 'var(--font-headline)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 24px rgba(58,88,158,0.35)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.02)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 36px rgba(58,88,158,0.5)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(58,88,158,0.35)';
                    }}
                  >
                    Request an audit <ArrowRight size={16} />
                  </button>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.84rem',
                      color: 'var(--text-muted)',
                      margin: 0,
                    }}
                  >
                    We respond within 4 hours.
                  </p>
                </div>
              </form>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <CTASection
        title="Know exactly where your software stands."
        subtitle="A $399 codebase review by engineers. Credited to any plan. Yours to keep either way."
        primaryCTA={{ label: 'Request an audit', href: '#audit-form' }}
        ghostCTA={{ label: 'See plans', href: '/services/plans' }}
        note="1–2 business day turnaround. Written report + video walkthrough."
      />
    </>
  );
}
