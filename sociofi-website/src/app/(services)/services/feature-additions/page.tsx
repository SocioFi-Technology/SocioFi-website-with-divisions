'use client';

import Hero from '@/components/sections/Hero';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import CTASection from '@/components/shared/CTASection';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import { Check, ArrowRight, Code, GitBranch, Rocket } from '@/lib/icons';

const A = '#4DBFA8';

// ── What Feature Hours Cover ──────────────────────────────────────────────────

const coverageItems = [
  'New pages or sections added to your existing app',
  'Form updates — new fields, validation logic, submission handling',
  'Workflow changes and simple automations',
  'API integrations with third-party services (standard scope)',
  'Dashboard updates — new charts, filters, data views',
  'UI improvements and small-scope redesigns',
  'Email templates and transactional notifications',
  'User role and permission changes',
];

// ── What Requires Studio ──────────────────────────────────────────────────────

const studioItems = [
  'New products or major features that exceed 20 hours',
  'Architectural changes to your data model or system design',
  'New integrations requiring significant backend infrastructure',
  'Full redesigns of core application flows',
];

// ── Request Process ───────────────────────────────────────────────────────────

const requestProcess = [
  {
    num: '01',
    title: 'Describe it in plain English',
    description:
      'Tell us what you want. No technical spec required. We understand your codebase — you just need to explain what you want it to do.',
    duration: '5 min',
  },
  {
    num: '02',
    title: 'We scope and estimate hours',
    description:
      'Within 24 hours we investigate the codebase, check for impact on existing functionality, and send you a written scope with a time estimate.',
    duration: '< 24 hours',
  },
  {
    num: '03',
    title: 'You approve before we start',
    description:
      'Nothing gets built without your sign-off on the scope and hours. If the estimate is higher than expected, we discuss alternatives.',
    duration: '1 approval',
  },
  {
    num: '04',
    title: 'We build in a feature branch',
    description:
      'Development happens in isolation. We follow your existing patterns and coding conventions so new code reads like it belongs.',
    duration: 'Per scope',
  },
  {
    num: '05',
    title: 'Review on staging',
    description:
      'Deployed to staging for your review before anything touches production. Iterate until it matches your expectations.',
    duration: '1–3 days',
  },
  {
    num: '06',
    title: 'Deploy to production',
    description:
      'Coordinated production deployment at a time that minimises disruption. Migration-safe if schema changes are involved.',
    duration: '1 hour',
  },
];

// ── Example Requests ──────────────────────────────────────────────────────────

const exampleRequests = [
  {
    request: '"Add a CSV export to the admin dashboard"',
    hours: '2 hrs',
    details:
      'Query builder for current filter state, CSV generation on the backend, download trigger on the frontend.',
  },
  {
    request: '"Send a welcome email when a new user signs up"',
    hours: '1.5 hrs',
    details:
      'Email template, transactional send via existing provider, trigger on registration event.',
  },
  {
    request: '"Add a \'pending\' status to orders"',
    hours: '3 hrs',
    details:
      'Schema migration for the new status, UI state updates, admin filter update, customer-facing status display.',
  },
  {
    request: '"Create a simple analytics page showing signups per day"',
    hours: '4 hrs',
    details:
      'Date-grouped query, chart component, date range filter, basic loading and empty states.',
  },
];

// ── Hours by Plan ─────────────────────────────────────────────────────────────

const planHours = [
  {
    plan: 'Essential',
    hours: '0',
    extra: 'Not included',
    note: 'Bug fixes and monitoring only',
    featured: false,
  },
  {
    plan: 'Growth',
    hours: '4 hrs',
    extra: '$120/hr additional',
    note: 'Hours reset monthly',
    featured: true,
  },
  {
    plan: 'Scale',
    hours: '10 hrs',
    extra: '$120/hr additional',
    note: 'Hours reset monthly',
    featured: true,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function FeatureAdditionsPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Hero
        badge="Feature Additions"
        headline={
          <>
            New Features From the Team That{' '}
            <span className="gradient-text">Knows Your Code.</span>
          </>
        }
        description="Growth and Scale plans include monthly feature hours. Describe what you want in plain English — we scope it, estimate the hours, and build once you approve. No surprises."
        buttons={[
          { label: 'See plans', href: '/services/plans', variant: 'primary' },
          { label: 'Get protected', href: '/services/get-protected', variant: 'ghost' },
        ]}
        layout="centered"
        showGrid
        showOrbs
      />

      {/* ── What Feature Hours Cover ──────────────────────────────────────── */}
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
                label="What's included"
                title="Small improvements built by engineers who know the codebase."
                subtitle="Feature hours are for additions that extend what already works — not rebuilds or large new directions."
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
                Because we already maintain your codebase, we can build these additions faster
                and more safely than any outside developer who would need weeks just to understand
                your system.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left">
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {coverageItems.map((item, i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
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
                          marginTop: 1,
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

      {/* ── What Requires Studio ──────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg)',
        }}
      >
        <Container narrow>
          <ScrollReveal>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
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
                  background: 'linear-gradient(90deg, var(--navy), var(--color-studio))',
                }}
                aria-hidden="true"
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      color: 'var(--color-studio)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: 12,
                    }}
                  >
                    Scope too large? → SocioFi Studio
                  </p>
                  <h3
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                      marginBottom: 10,
                    }}
                  >
                    Some things belong in a proper build engagement.
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
                    When a request exceeds the scope of monthly feature hours, we route it
                    through Studio — our dedicated product build division — for a proper scoped
                    engagement.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                    {studioItems.map((item, i) => (
                      <div
                        key={i}
                        style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
                      >
                        <span
                          style={{
                            color: 'var(--color-studio)',
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                          aria-hidden="true"
                        >
                          <ArrowRight size={14} />
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
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  <a
                    href="/studio"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily: 'var(--font-headline)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--color-studio)',
                      textDecoration: 'none',
                    }}
                  >
                    Explore Studio <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Request Process ───────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="How to request"
              title="Plain English in. Working feature out."
              subtitle="No technical spec required. We translate your description into a scope document, estimate hours, and wait for your approval before building."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}>
            <StaggerChildren>
            {requestProcess.map((step, i) => (
              <StaggerItem key={i}>
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      color: A,
                      letterSpacing: '0.12em',
                      marginBottom: 10,
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: 'var(--text-primary)',
                      marginBottom: 8,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      lineHeight: 1.65,
                      color: 'var(--text-secondary)',
                      margin: '0 0 14px',
                    }}
                  >
                    {step.description}
                  </p>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      background: `color-mix(in srgb, ${A} 8%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${A} 15%, transparent)`,
                      borderRadius: 'var(--radius-full)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
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

      {/* ── Hours by Plan ─────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Feature hours"
              title="Included hours per plan."
              centered
              className="mb-12"
            />
          </ScrollReveal>

          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
              maxWidth: 780,
              margin: '0 auto 32px',
            }}>
            <StaggerChildren>
            {planHours.map((tier, i) => (
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
                      fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.03em',
                      color: tier.featured ? A : 'var(--text-secondary)',
                      lineHeight: 1.1,
                      marginBottom: 16,
                    }}
                  >
                    {tier.hours}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.84rem',
                        color: 'var(--text-secondary)',
                        margin: 0,
                      }}
                    >
                      {tier.extra}
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
                padding: '20px 24px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                maxWidth: 780,
                margin: '0 auto',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>
                  Unused hours do not roll over.
                </strong>{' '}
                This is intentional. Monthly feature work keeps your product improving on a
                steady cadence rather than accumulating a backlog that gets built all at once and
                introduces risk.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Example Requests ──────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Real examples"
              title="The kinds of things feature hours get done."
              subtitle="Actual requests from clients, with the hour estimates we provided."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 16,
            }}>
            <StaggerChildren>
            {exampleRequests.map((ex, i) => (
              <StaggerItem key={i}>
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px',
                    height: '100%',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      color: 'var(--text-primary)',
                      fontStyle: 'italic',
                      marginBottom: 16,
                    }}
                  >
                    {ex.request}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      lineHeight: 1.65,
                      color: 'var(--text-secondary)',
                      marginBottom: 16,
                    }}
                  >
                    {ex.details}
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      background: `color-mix(in srgb, ${A} 10%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${A} 22%, transparent)`,
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      width={13}
                      height={13}
                      stroke={A}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: A,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {ex.hours}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <CTASection
        title="Need more hours than a plan includes?"
        subtitle="Scale includes 10 hours per month. Or scope something larger through Studio."
        primaryCTA={{ label: 'See plans', href: '/services/plans' }}
        ghostCTA={{ label: 'Explore Studio', href: '/studio' }}
        note="Feature hours available on Growth and Scale plans."
      />
    </>
  );
}
