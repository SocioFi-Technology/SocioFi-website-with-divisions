'use client';

import Hero from '@/components/sections/Hero';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import CTASection from '@/components/shared/CTASection';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import { Brain, Eye, Chart, Zap, Shield, Users, ArrowRight, Check } from '@/lib/icons';

const A = '#4DBFA8';

// ── Why Agents Need Monitoring ───────────────────────────────────────────────

const driftReasons = [
  {
    title: 'Accuracy drifts as data changes',
    description:
      'Agent behavior depends on the patterns in your data and user requests. As both evolve, accuracy degrades without anyone deliberately breaking anything.',
  },
  {
    title: 'Edge cases appear over time',
    description:
      'Real users find inputs no one anticipated. Edge cases that never appeared during testing show up at scale — and unmonitored agents handle them silently and incorrectly.',
  },
  {
    title: 'Third-party integrations change',
    description:
      'APIs update, webhooks change, external data formats shift. Agents that call external services break in subtle ways when upstream providers make changes.',
  },
  {
    title: 'Token limits and context windows evolve',
    description:
      'Model providers update limits, pricing, and behavior. An agent built against last quarter\'s API may be silently truncating context or exceeding budget.',
  },
  {
    title: 'Cost per task can balloon',
    description:
      'Without cost monitoring, a single prompt change can increase token usage 5x. Unmonitored agents can generate unexpected spend without any visible failure.',
  },
];

// ── 6 Metrics We Track ────────────────────────────────────────────────────────

const metrics = [
  {
    icon: <Eye size={22} aria-hidden="true" />,
    title: 'Agent health',
    description:
      'Is the agent running, responding, and completing tasks? Uptime checks specific to agent endpoints, queue depth monitoring, and task completion rate over time.',
  },
  {
    icon: <Chart size={22} aria-hidden="true" />,
    title: 'Accuracy rate',
    description:
      'Correct outputs versus incorrect, trended over time. We establish a baseline accuracy score and alert when performance drops below threshold.',
  },
  {
    icon: <Brain size={22} aria-hidden="true" />,
    title: 'Drift detection',
    description:
      'Declining accuracy over days or weeks, not just single-point failures. We catch slow degradation before it becomes a customer problem.',
  },
  {
    icon: <Check size={22} aria-hidden="true" />,
    title: 'Task completion rate',
    description:
      'Percentage of tasks successfully completed end-to-end versus abandoned, errored, or timed out. A falling completion rate is often the first sign of a problem.',
  },
  {
    icon: <Zap size={22} aria-hidden="true" />,
    title: 'Latency tracking',
    description:
      'Time per task versus historical average, with anomaly detection. Sudden latency spikes indicate upstream API issues or runaway context growth.',
  },
  {
    icon: <Users size={22} aria-hidden="true" />,
    title: 'Human escalation rate',
    description:
      'How often the agent routes to a human. Too high means something changed in the input distribution. We investigate when it rises above baseline.',
  },
];

// ── Detection + Response ──────────────────────────────────────────────────────

const responseSteps = [
  {
    trigger: 'Accuracy drops below 95%',
    action: 'Automated alert to assigned engineer',
    duration: '< 5 min',
    color: '#E85555',
  },
  {
    trigger: 'Engineer investigates',
    action: 'Review recent inputs, outputs, and any upstream changes',
    duration: '< 2 hours',
    color: '#E8914F',
  },
  {
    trigger: 'Root cause identified',
    action: 'Determine if prompt adjustment, retraining trigger, or integration fix is needed',
    duration: '2–4 hours',
    color: '#E8B84D',
  },
  {
    trigger: 'Fix deployed and verified',
    action: 'Accuracy confirmed back above threshold on a validation set',
    duration: '< 24 hours',
    color: A,
  },
];

// ── Pricing ───────────────────────────────────────────────────────────────────

const pricingTiers = [
  {
    plan: 'Essential',
    included: false,
    description: 'Not included by default',
    addOn: '$199/month per agent',
    features: ['Health monitoring', 'Uptime checks', 'Alert on complete failure'],
  },
  {
    plan: 'Growth',
    included: true,
    description: 'Basic health monitoring included',
    addOn: 'Full monitoring: $149/mo add-on',
    features: [
      'Health monitoring',
      'Task completion tracking',
      'Latency anomaly detection',
      'Weekly summary report',
    ],
    featured: true,
  },
  {
    plan: 'Scale',
    included: true,
    description: 'Full monitoring included',
    addOn: 'Additional agents: $99/mo each',
    features: [
      'All six metrics tracked',
      'Drift detection',
      'Accuracy rate trending',
      'Escalation rate analysis',
      'Dedicated agent engineer',
    ],
    featured: true,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function AgentMonitoringPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Hero
        badge="Agent Monitoring"
        headline={
          <>
            Your AI Agents,{' '}
            <span className="gradient-text">Always Performing.</span>
          </>
        }
        description="AI agents are not set-and-forget. Accuracy drifts. Integrations change. Costs creep. We monitor your agents continuously — health, accuracy, latency, and cost — and intervene before your users notice."
        buttons={[
          { label: 'Get protected', href: '/services/get-protected', variant: 'primary' },
          { label: 'See plans', href: '/services/plans', variant: 'ghost' },
        ]}
        layout="centered"
        showGrid
        showOrbs
      />

      {/* ── Why Agents Need Monitoring ────────────────────────────────────── */}
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
                label="The problem"
                title='AI agents aren&apos;t set-and-forget.'
                subtitle="You shipped an agent that works. That does not mean it will keep working. The conditions that made it work change constantly."
                className="mb-8"
              />

              <div
                style={{
                  padding: '20px 24px',
                  background: `color-mix(in srgb, #E85555 6%, var(--bg-card))`,
                  border: `1px solid color-mix(in srgb, #E85555 18%, transparent)`,
                  borderRadius: 'var(--radius-md)',
                  marginTop: 8,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: 'var(--text-primary)',
                    margin: 0,
                    fontStyle: 'italic',
                  }}
                >
                  An agent running at 70% accuracy is worse than no agent — your customers think
                  it is supposed to work.
                </p>
              </div>
            </ScrollReveal>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <StaggerChildren>
              {driftReasons.map((reason, i) => (
                <StaggerItem key={i}>
                  <div
                    style={{
                      padding: '18px 22px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <h4
                      style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: 6,
                      }}
                    >
                      {reason.title}
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
                      {reason.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 6 Metrics ─────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="What we track"
              title="Six metrics. Every agent."
              subtitle="A comprehensive monitoring profile for each agent — not just uptime."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}>
            <StaggerChildren>
            {metrics.map((metric, i) => (
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
                    transition: 'border-color 0.3s ease, transform 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `color-mix(in srgb, ${A} 25%, transparent)`;
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-sm)',
                        background: `color-mix(in srgb, ${A} 10%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${A} 20%, transparent)`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: A,
                        flexShrink: 0,
                      }}
                    >
                      {metric.icon}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: A,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 10,
                    }}
                  >
                    {metric.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      lineHeight: 1.65,
                      color: 'var(--text-secondary)',
                      margin: 0,
                    }}
                  >
                    {metric.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* ── Detection + Response ──────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container narrow>
          <ScrollReveal>
            <SectionHeader
              label="Detection and response"
              title="Accuracy drops. We respond."
              subtitle="The full response flow when agent performance degrades — from alert to verified recovery."
              centered
              className="mb-12"
            />
          </ScrollReveal>

          <ScrollReveal>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '40px',
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {responseSteps.map((step, i, arr) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 20,
                      alignItems: 'flex-start',
                      paddingBottom: i < arr.length - 1 ? 28 : 0,
                      paddingTop: i > 0 ? 28 : 0,
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    {/* Connector line + dot */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flexShrink: 0,
                        gap: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: step.color,
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                        aria-hidden="true"
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          flexWrap: 'wrap',
                          marginBottom: 6,
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: 'var(--font-headline)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            margin: 0,
                          }}
                        >
                          {step.trigger}
                        </h4>
                        <span
                          style={{
                            padding: '3px 10px',
                            background: `color-mix(in srgb, ${step.color} 10%, transparent)`,
                            border: `1px solid color-mix(in srgb, ${step.color} 22%, transparent)`,
                            borderRadius: 'var(--radius-full)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            color: step.color,
                            fontWeight: 600,
                          }}
                        >
                          {step.duration}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.88rem',
                          lineHeight: 1.65,
                          color: 'var(--text-secondary)',
                          margin: 0,
                        }}
                      >
                        {step.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Integration with Agents Division ─────────────────────────────── */}
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
                  background: 'linear-gradient(90deg, var(--navy), var(--color-labs))',
                }}
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--color-labs)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: 12,
                    }}
                  >
                    Built with SocioFi?
                  </p>
                  <h3
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                      marginBottom: 12,
                    }}
                  >
                    Monitoring setup is seamless.
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
                    If your agents were built and deployed through SocioFi, monitoring
                    integration requires no additional access handover — we already have full
                    visibility into the deployment architecture and instrumentation hooks.
                  </p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <a
                      href="/agents"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily: 'var(--font-headline)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--color-labs)',
                        textDecoration: 'none',
                      }}
                    >
                      Explore Agents <ArrowRight size={15} />
                    </a>
                    <a
                      href="/agents/catalog"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily: 'var(--font-headline)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                      }}
                    >
                      Agent catalog <ArrowRight size={15} />
                    </a>
                  </div>
                </div>

                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: 12,
                    }}
                  >
                    External agents
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      lineHeight: 1.65,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    For agents built outside SocioFi, we set up monitoring instrumentation
                    during onboarding. Standard integrations typically take 48 hours. Custom
                    agent architectures are assessed on a case-by-case basis.
                  </p>
                  <div
                    style={{
                      marginTop: 16,
                      padding: '12px 16px',
                      background: 'var(--bg-2)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        margin: 0,
                      }}
                    >
                      Compatible with LangChain, AutoGen, custom API-based agents, and most
                      major agent frameworks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Pricing"
              title="Agent monitoring by plan."
              centered
              className="mb-12"
            />
          </ScrollReveal>

          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
            }}>
            <StaggerChildren>
            {pricingTiers.map((tier, i) => (
              <StaggerItem key={i}>
                <div
                  style={{
                    background: tier.featured ? `color-mix(in srgb, ${A} 5%, var(--bg-card))` : 'var(--bg-card)',
                    border: tier.featured
                      ? `1px solid color-mix(in srgb, ${A} 22%, transparent)`
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
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: tier.featured ? A : 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        margin: 0,
                      }}
                    >
                      {tier.plan}
                    </p>
                    {tier.included && (
                      <span
                        style={{
                          padding: '3px 8px',
                          background: `color-mix(in srgb, ${A} 10%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${A} 20%, transparent)`,
                          borderRadius: 'var(--radius-full)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          color: A,
                        }}
                      >
                        Included
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)',
                      marginBottom: 16,
                    }}
                  >
                    {tier.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    {tier.features.map((feat, j) => (
                      <div
                        key={j}
                        style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
                      >
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: `color-mix(in srgb, ${A} 10%, transparent)`,
                            border: `1.5px solid color-mix(in srgb, ${A} 20%, transparent)`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: 2,
                            color: A,
                          }}
                          aria-hidden="true"
                        >
                          <svg viewBox="0 0 24 24" fill="none" width={9} height={9} stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.84rem',
                            lineHeight: 1.5,
                            color: 'var(--text-secondary)',
                            margin: 0,
                          }}
                        >
                          {feat}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      borderTop: '1px solid var(--border)',
                      paddingTop: 12,
                      margin: 0,
                    }}
                  >
                    {tier.addOn}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>

          {/* Not running agents yet */}
          <ScrollReveal>
            <div
              style={{
                marginTop: 28,
                padding: '20px 28px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  flex: 1,
                  minWidth: 200,
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>
                  Not running agents yet?
                </strong>{' '}
                See what SocioFi can build and deploy for your business.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a
                  href="/agents"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 20px',
                    background: `color-mix(in srgb, var(--color-labs) 10%, transparent)`,
                    border: `1px solid color-mix(in srgb, var(--color-labs) 25%, transparent)`,
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-headline)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: 'var(--color-labs)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Explore Agents <ArrowRight size={13} />
                </a>
                <a
                  href="/agents/catalog"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-headline)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Agent catalog <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <CTASection
        title="Keep your agents performing."
        subtitle="Accuracy tracking, drift detection, and immediate response when something changes."
        primaryCTA={{ label: 'Get protected', href: '/services/get-protected' }}
        ghostCTA={{ label: 'See all plans', href: '/services/plans' }}
        note="Agent monitoring active within 48 hours of onboarding."
      />
    </>
  );
}
