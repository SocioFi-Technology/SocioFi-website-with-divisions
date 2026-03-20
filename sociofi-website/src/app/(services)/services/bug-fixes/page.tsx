'use client';

import Hero from '@/components/sections/Hero';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import CTASection from '@/components/shared/CTASection';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import { Mail, Check, ArrowRight, Shield, Wrench, Target } from '@/lib/icons';

const A = '#4DBFA8';

// ── Priority Levels ───────────────────────────────────────────────────────────

const priorities = [
  {
    level: 'P1',
    label: 'Critical',
    color: '#E85555',
    response: '< 4 hours',
    resolution: 'Same day',
    definition:
      'Application is down, data is being lost, payments are failing, or a security breach is in progress. All hands.',
  },
  {
    level: 'P2',
    label: 'High',
    color: '#E8914F',
    response: '< 8 hours',
    resolution: '< 24 hours',
    definition:
      'Core feature is broken for a significant portion of your audience. Not down, but seriously degraded. Users are noticing.',
  },
  {
    level: 'P3',
    label: 'Medium',
    color: '#E8B84D',
    response: '< 24 hours',
    resolution: '< 48 hours',
    definition:
      'A feature is broken for a subset of users, or a workaround exists. Business is not impacted but the issue needs to be resolved.',
  },
  {
    level: 'P4',
    label: 'Low',
    color: A,
    response: '< 48 hours',
    resolution: 'Next window',
    definition:
      'Cosmetic issues, minor usability problems, or technical debt that should be addressed but is not causing user-facing problems.',
  },
];

// ── Bug vs Feature ────────────────────────────────────────────────────────────

const bugExamples = [
  'A button that worked last week throws a JavaScript error',
  'Emails that used to send are now going to spam or not arriving',
  'A calculation that was correct is now producing wrong results',
  'A feature that was in the original spec never actually worked correctly',
];

const featureExamples = [
  'Adding a new payment method that was not in the original scope',
  'Changing how user roles work to support a new workflow',
  'Building a new dashboard section your customers have been requesting',
  'Integrating a third-party service that was not in the original build',
];

// ── Prevention Measures ───────────────────────────────────────────────────────

const preventionItems = [
  {
    icon: <Shield size={22} aria-hidden="true" />,
    title: 'Code review on every change',
    description:
      'Every code change goes through review before it reaches production. We catch bugs before they ship rather than after your users find them.',
  },
  {
    icon: <Wrench size={22} aria-hidden="true" />,
    title: 'Dependency updates on schedule',
    description:
      'Outdated dependencies introduce bugs. We keep your stack current so version conflicts and deprecated APIs do not break your application silently.',
  },
  {
    icon: <Target size={22} aria-hidden="true" />,
    title: 'Monitoring catches regressions early',
    description:
      'Error rate spikes after a deploy are caught within minutes, not days. Early detection means smaller blast radius and faster resolution.',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function BugFixesPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Hero
        badge="Bug Fixes"
        headline={
          <>
            Every Bug Fixed. By Engineers Who{' '}
            <span className="gradient-text">Know Your Code.</span>
          </>
        }
        description="Priority triage, root cause analysis, and fixes deployed to staging before production. We respond fast, document everything, and make sure the same bug does not come back."
        buttons={[
          { label: 'Get a plan', href: '/services/plans', variant: 'primary' },
          { label: 'Get protected', href: '/services/get-protected', variant: 'ghost' },
        ]}
        layout="centered"
        showGrid
        showOrbs
      />

      {/* ── How to Report ─────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Reporting a bug"
              title="Three ways to reach us."
              subtitle="However you prefer to communicate. We monitor all channels and triage within the SLA window."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}>
            <StaggerChildren>
            {/* Slack */}
            <StaggerItem>
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px',
                  height: '100%',
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
                    height: 2,
                    background: `linear-gradient(90deg, var(--navy), ${A})`,
                  }}
                  aria-hidden="true"
                />
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '4px 12px',
                    background: `color-mix(in srgb, ${A} 8%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${A} 20%, transparent)`,
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: A,
                    letterSpacing: '0.08em',
                    marginBottom: 16,
                  }}
                >
                  Growth &amp; Scale plans
                </div>
                {/* Slack icon */}
                <svg
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={A}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginBottom: 14 }}
                  aria-hidden="true"
                >
                  <rect x="3" y="8" width="5" height="5" rx="1" />
                  <rect x="3" y="16" width="5" height="5" rx="1" />
                  <rect x="11" y="3" width="5" height="5" rx="1" />
                  <rect x="11" y="11" width="5" height="5" rx="1" />
                  <rect x="16" y="16" width="5" height="5" rx="1" />
                </svg>
                <h3
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 10,
                  }}
                >
                  Shared Slack channel
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
                  The fastest path to an engineer. Post in your dedicated channel with a brief
                  description, what you expected, and what is actually happening. Tag{' '}
                  <code
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      padding: '1px 6px',
                      background: 'var(--bg-2)',
                      borderRadius: 4,
                    }}
                  >
                    @oncall
                  </code>{' '}
                  for P1 or P2 issues.
                </p>
              </div>
            </StaggerItem>

            {/* Email */}
            <StaggerItem>
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px',
                  height: '100%',
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
                    height: 2,
                    background: `linear-gradient(90deg, var(--navy), ${A})`,
                  }}
                  aria-hidden="true"
                />
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '4px 12px',
                    background: 'rgba(89,163,146,0.06)',
                    border: '1px solid rgba(89,163,146,0.12)',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.08em',
                    marginBottom: 16,
                  }}
                >
                  All plans
                </div>
                <div style={{ marginBottom: 14, color: A }}><Mail size={28} aria-hidden="true" /></div>
                <h3
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 10,
                  }}
                >
                  Email support
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
                  Send a bug report to your dedicated support address. Include screenshots,
                  screen recordings, or error logs if you have them. We create a tracked
                  ticket and confirm receipt with a priority classification within the SLA
                  window.
                </p>
              </div>
            </StaggerItem>

            {/* Form */}
            <StaggerItem>
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px',
                  height: '100%',
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
                    height: 2,
                    background: `linear-gradient(90deg, var(--navy), ${A})`,
                  }}
                  aria-hidden="true"
                />
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '4px 12px',
                    background: 'rgba(89,163,146,0.06)',
                    border: '1px solid rgba(89,163,146,0.12)',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.08em',
                    marginBottom: 16,
                  }}
                >
                  All plans
                </div>
                <svg
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={A}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginBottom: 14 }}
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <h3
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 10,
                  }}
                >
                  Bug report form
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    margin: '0 0 20px',
                  }}
                >
                  Structured form with fields for environment, steps to reproduce, expected
                  versus actual behavior, and priority assessment. Good for non-urgent issues
                  where context matters.
                </p>
                <a
                  href="/services/get-protected"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    color: A,
                    textDecoration: 'none',
                  }}
                >
                  Available after onboarding <ArrowRight size={14} />
                </a>
              </div>
            </StaggerItem>
          </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* ── Triage + Timeline ─────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Priority system"
              title="Classified, triaged, tracked."
              subtitle="Every bug report gets a priority level. Priority drives response time, escalation, and the engineer assigned."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
            }}>
            <StaggerChildren>
            {priorities.map((p, i) => (
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
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: p.color,
                    }}
                    aria-hidden="true"
                  />
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: p.color,
                        padding: '3px 8px',
                        background: `color-mix(in srgb, ${p.color} 12%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${p.color} 25%, transparent)`,
                        borderRadius: 4,
                      }}
                    >
                      {p.level}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {p.label}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      lineHeight: 1.65,
                      color: 'var(--text-secondary)',
                      marginBottom: 20,
                    }}
                  >
                    {p.definition}
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 12px',
                        background: 'var(--bg-2)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: 4,
                        }}
                      >
                        Response
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-headline)',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: p.color,
                          margin: 0,
                        }}
                      >
                        {p.response}
                      </p>
                    </div>
                    <div
                      style={{
                        padding: '10px 12px',
                        background: 'var(--bg-2)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: 4,
                        }}
                      >
                        Resolution
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-headline)',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          margin: 0,
                        }}
                      >
                        {p.resolution}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* ── Bug vs Feature ────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Clear definitions"
              title="Bug vs feature. We keep it clear."
              subtitle="The distinction matters because it affects which plan hours are used and whether something gets built under maintenance or scoped separately."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bug */}
            <ScrollReveal direction="right">
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
                    background: '#E85555',
                  }}
                  aria-hidden="true"
                />
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    color: '#E85555',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginBottom: 12,
                  }}
                >
                  Bug — covered by plan
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 8,
                  }}
                >
                  Something that was working stopped working
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    marginBottom: 20,
                  }}
                >
                  Or never worked correctly as originally specified. If the original build
                  promised a behavior and that behavior is broken or absent, it is a bug.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {bugExamples.map((ex, i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
                    >
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: 'rgba(232,85,85,0.1)',
                          border: '1.5px solid rgba(232,85,85,0.25)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          width={10}
                          height={10}
                          stroke="#E85555"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                        >
                          <circle cx="12" cy="12" r="1" fill="#E85555" />
                        </svg>
                      </span>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.88rem',
                          lineHeight: 1.6,
                          color: 'var(--text-secondary)',
                          margin: 0,
                        }}
                      >
                        {ex}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Feature */}
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
                    marginBottom: 12,
                  }}
                >
                  Feature — uses feature hours
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 8,
                  }}
                >
                  New capability or changed behavior
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    marginBottom: 20,
                  }}
                >
                  Anything not in the original spec, any changed behavior, or any new
                  capability — regardless of size. Small does not mean it is a bug.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {featureExamples.map((ex, i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
                    >
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: `color-mix(in srgb, ${A} 10%, transparent)`,
                          border: `1.5px solid color-mix(in srgb, ${A} 22%, transparent)`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 2,
                          color: A,
                        }}
                        aria-hidden="true"
                      >
                        <ArrowRight size={10} strokeWidth={2.5} />
                      </span>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.88rem',
                          lineHeight: 1.6,
                          color: 'var(--text-secondary)',
                          margin: 0,
                        }}
                      >
                        {ex}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ── Monthly Limits ────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Plan limits"
              title="Bugs per month by plan."
              centered
              className="mb-12"
            />
          </ScrollReveal>

          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
              maxWidth: 860,
              margin: '0 auto',
            }}>
            <StaggerChildren>
            {[
              {
                plan: 'Essential',
                bugs: '5',
                unit: 'bugs/month',
                overflow: '$99 per additional bug',
                note: 'Covers P1–P4',
              },
              {
                plan: 'Growth',
                bugs: 'Unlimited',
                unit: '',
                overflow: 'No extra charge',
                note: 'P1/P2 always prioritised',
                featured: true,
              },
              {
                plan: 'Scale',
                bugs: 'Unlimited',
                unit: '',
                overflow: 'Dedicated engineer',
                note: 'SLA guaranteed',
                featured: true,
              },
            ].map((tier, i) => (
              <StaggerItem key={i}>
                <div
                  style={{
                    background: tier.featured ? `color-mix(in srgb, ${A} 5%, var(--bg-card))` : 'var(--bg-card)',
                    border: tier.featured
                      ? `1px solid color-mix(in srgb, ${A} 25%, transparent)`
                      : '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {tier.featured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: `linear-gradient(90deg, var(--navy), ${A})`,
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: tier.featured ? A : 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 12,
                    }}
                  >
                    {tier.plan}
                  </p>
                  <div
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.03em',
                      color: tier.featured ? A : 'var(--text-primary)',
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {tier.bugs}
                  </div>
                  {tier.unit && (
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.84rem',
                        color: 'var(--text-muted)',
                        marginBottom: 16,
                      }}
                    >
                      {tier.unit}
                    </p>
                  )}
                  <div style={{ marginTop: tier.unit ? 0 : 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.84rem',
                        color: 'var(--text-secondary)',
                        margin: 0,
                      }}
                    >
                      {tier.overflow}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        margin: 0,
                      }}
                    >
                      {tier.note}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>

          <ScrollReveal>
            <div
              style={{
                marginTop: 24,
                padding: '20px 24px',
                background: `color-mix(in srgb, ${A} 5%, var(--bg-card))`,
                border: `1px solid color-mix(in srgb, ${A} 15%, transparent)`,
                borderRadius: 'var(--radius-md)',
                maxWidth: 860,
                margin: '24px auto 0',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: A, flexShrink: 0, marginTop: 2 }}>
                  <Shield size={18} aria-hidden="true" />
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  <strong style={{ color: 'var(--text-primary)' }}>
                    P1 and P2 bugs are always prioritised
                  </strong>{' '}
                  regardless of plan or monthly count. A critical production outage is not
                  something we triage against a quota.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Prevention ────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16" style={{ alignItems: 'start' }}>
            <ScrollReveal direction="right">
              <SectionHeader
                label="Prevention"
                title="Fewer bugs over time. Not just faster fixes."
                subtitle="Every plan includes maintenance practices that reduce the bug rate — not just the fix rate."
              />
            </ScrollReveal>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <StaggerChildren>
              {preventionItems.map((item, i) => (
                <StaggerItem key={i}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 16,
                      padding: '20px 24px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <span
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-sm)',
                        background: `color-mix(in srgb, ${A} 10%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${A} 20%, transparent)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: A,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <h4
                        style={{
                          fontFamily: 'var(--font-headline)',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginBottom: 6,
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.88rem',
                          lineHeight: 1.65,
                          color: 'var(--text-secondary)',
                          margin: 0,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <CTASection
        title="Bugs happen. How fast they get fixed is the variable."
        subtitle="Get a plan that includes guaranteed response times, root cause analysis, and unlimited fixes on Growth and Scale."
        primaryCTA={{ label: 'Get unlimited bug fixes', href: '/services/plans' }}
        ghostCTA={{ label: 'Get protected', href: '/services/get-protected' }}
        note="P1 and P2 bugs always prioritised. Response within 4 hours."
      />
    </>
  );
}
