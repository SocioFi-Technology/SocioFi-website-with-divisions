'use client';

import Hero from '@/components/sections/Hero';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import CTASection from '@/components/shared/CTASection';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import { Database, Zap, Chart, Globe, Code, Gear, Shield, ArrowRight } from '@/lib/icons';

const A = '#4DBFA8';

// ── What We Optimize ──────────────────────────────────────────────────────────

const optimizations = [
  {
    icon: <Database size={22} aria-hidden="true" />,
    title: 'Database queries',
    description:
      'Index analysis, query optimization, N+1 query elimination, and connection pool tuning. Most application slowdowns trace back to the database.',
  },
  {
    icon: <Zap size={22} aria-hidden="true" />,
    title: 'Caching layers',
    description:
      'Redis for query results and session data, CDN for static assets, and browser caching headers configured correctly. Cache the right things — not everything.',
  },
  {
    icon: <Globe size={22} aria-hidden="true" />,
    title: 'CDN configuration',
    description:
      'Static assets served from the edge, global distribution, cache invalidation strategies. Geographic latency eliminated for your international audience.',
  },
  {
    icon: <Chart size={22} aria-hidden="true" />,
    title: 'Image optimization',
    description:
      'Compression, WebP conversion, responsive srcsets, and lazy loading. Images are the most common cause of poor Core Web Vitals scores.',
  },
  {
    icon: <Code size={22} aria-hidden="true" />,
    title: 'Code splitting and lazy loading',
    description:
      'Bundle analysis, route-based splitting, and component-level lazy loading. Ship less JavaScript on initial load — your users notice.',
  },
  {
    icon: <Gear size={22} aria-hidden="true" />,
    title: 'Core Web Vitals',
    description:
      'LCP, INP, and CLS — the three metrics Google uses to rank your site. We track them continuously and optimize toward the "Good" threshold on all three.',
  },
  {
    icon: <Zap size={22} aria-hidden="true" />,
    title: 'API response times',
    description:
      'Response payload analysis, endpoint profiling, pagination where large datasets are returned, and async processing for heavy operations.',
  },
  {
    icon: <Shield size={22} aria-hidden="true" />,
    title: 'Server configuration',
    description:
      'Memory limits, worker process count, connection timeouts, keep-alive settings. Server misconfiguration causes slowdowns that look like code problems.',
  },
];

// ── Core Web Vitals ────────────────────────────────────────────────────────────

const vitals = [
  {
    metric: 'LCP',
    name: 'Largest Contentful Paint',
    target: '< 2.5s',
    description: 'How fast your main content loads. The number your users feel most.',
    goodColor: '#22C55E',
  },
  {
    metric: 'INP',
    name: 'Interaction to Next Paint',
    target: '< 200ms',
    description: 'Responsiveness to clicks, taps, and keyboard input.',
    goodColor: '#22C55E',
  },
  {
    metric: 'CLS',
    name: 'Cumulative Layout Shift',
    target: '< 0.1',
    description: 'Visual stability — content not jumping around as the page loads.',
    goodColor: '#22C55E',
  },
];

// ── Optimization Schedule ────────────────────────────────────────────────────

const schedule = [
  {
    plan: 'Essential',
    frequency: 'Quarterly review',
    includes: [
      'Performance baseline audit',
      'Bottleneck identification report',
      'Recommendations document',
    ],
    extra: 'Active optimization billed separately',
    featured: false,
  },
  {
    plan: 'Growth',
    frequency: 'Monthly optimization',
    includes: [
      'Everything in Essential',
      'Active optimization work each month',
      'Core Web Vitals tracking',
      'Database query monitoring',
    ],
    extra: 'Load testing: $299/test',
    featured: true,
  },
  {
    plan: 'Scale',
    frequency: 'Continuous + load testing',
    includes: [
      'Everything in Growth',
      'Quarterly load testing included',
      'Real-time performance alerting',
      'Dedicated performance engineer',
    ],
    extra: 'Additional load tests: $199/test',
    featured: true,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function PerformancePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Hero
        badge="Performance"
        headline={
          <>
            Fast Software.{' '}
            <span className="gradient-text">Happy Customers.</span>
          </>
        }
        description="A 1-second delay in load time reduces conversions by 7%. Every 100ms matters. We profile your application, identify the real bottlenecks, and measure the improvement after every change."
        buttons={[
          { label: 'Get protected', href: '/services/get-protected', variant: 'primary' },
          { label: 'See plans', href: '/services/plans', variant: 'ghost' },
        ]}
        layout="centered"
        showGrid
        showOrbs
      />

      {/* ── What We Optimize ──────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Optimization areas"
              title="Eight areas. Measured before and after."
              subtitle="We establish a baseline before touching anything. Every change is measured. Every report shows the delta."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: 16,
            }}>
            <StaggerChildren>
            {optimizations.map((opt, i) => (
              <StaggerItem key={i}>
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    height: '100%',
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
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-sm)',
                      background: `color-mix(in srgb, ${A} 10%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${A} 20%, transparent)`,
                      color: A,
                      marginBottom: 14,
                    }}
                    aria-hidden="true"
                  >
                    {opt.icon}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 8,
                    }}
                  >
                    {opt.title}
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
                    {opt.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* ── Before / After Case Study ─────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg)',
        }}
      >
        <Container narrow>
          <ScrollReveal>
            <SectionHeader
              label="Performance in practice"
              title='How we reduced a client&apos;s page load from 4.2s to 0.8s.'
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

              {/* Metrics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: 16,
                  marginBottom: 40,
                }}
              >
                {[
                  { before: '4.2s', after: '0.8s', label: 'Page load time', improvement: '−81%' },
                  { before: '—', after: '+23%', label: 'Conversion rate', improvement: 'increase' },
                  { before: '—', after: '−67%', label: 'Server costs', improvement: 'reduction' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '20px',
                      background: 'var(--bg-2)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                    }}
                  >
                    {stat.before !== '—' && (
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          textDecoration: 'line-through',
                          marginBottom: 4,
                        }}
                      >
                        {stat.before}
                      </p>
                    )}
                    <div
                      style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: 'clamp(1.6rem, 3vw, 2rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        color: A,
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      {stat.after}
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        margin: 0,
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: A,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: 20,
                }}
              >
                What we did — in order
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  {
                    step: '01',
                    action: 'Baseline audit',
                    detail: 'Captured P50/P95/P99 response times, database query counts per page load, and bundle analysis. Found 47 DB queries on a single page — unchecked ORM lazy loading.',
                    impact: 'Established the starting point',
                  },
                  {
                    step: '02',
                    action: 'Database indexing',
                    detail: 'Added 6 missing composite indexes identified in the slow query log. Replaced ORM lazy loading with 3 optimised joins.',
                    impact: '4.2s → 1.8s',
                  },
                  {
                    step: '03',
                    action: 'Query result caching',
                    detail: 'Implemented Redis caching for read-heavy queries with low write frequency. Cache invalidation tied to mutation events.',
                    impact: '1.8s → 1.1s',
                  },
                  {
                    step: '04',
                    action: 'CDN and image optimization',
                    detail: 'Moved static assets to CDN with long-lived cache headers. Converted images to WebP with lazy loading. Code-split two large components.',
                    impact: '1.1s → 0.8s',
                  },
                ].map((item, i, arr) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 20,
                      paddingBottom: i < arr.length - 1 ? 24 : 0,
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                      paddingTop: i > 0 ? 24 : 0,
                    }}
                  >
                    <div style={{ flexShrink: 0, width: 28 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          color: A,
                          fontWeight: 600,
                        }}
                      >
                        {item.step}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          flexWrap: 'wrap',
                          marginBottom: 8,
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
                          {item.action}
                        </h4>
                        <span
                          style={{
                            padding: '3px 10px',
                            background: `color-mix(in srgb, ${A} 10%, transparent)`,
                            border: `1px solid color-mix(in srgb, ${A} 20%, transparent)`,
                            borderRadius: 'var(--radius-full)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            color: A,
                            fontWeight: 600,
                          }}
                        >
                          {item.impact}
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
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Core Web Vitals ───────────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg-2)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Core web vitals"
              title="The three metrics that determine your search ranking."
              subtitle="Google uses Core Web Vitals to rank search results. We track these continuously on Growth and Scale plans."
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
              maxWidth: 960,
              margin: '0 auto',
            }}>
            <StaggerChildren>
            {vitals.map((vital, i) => (
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
                      background: vital.goodColor,
                    }}
                    aria-hidden="true"
                  />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: A,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {vital.metric}
                    </span>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(34,197,94,0.1)',
                        border: '1px solid rgba(34,197,94,0.2)',
                        borderRadius: 'var(--radius-full)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: vital.goodColor,
                      }}
                    >
                      {vital.target}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 8,
                    }}
                  >
                    {vital.name}
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
                    {vital.description}
                  </p>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 16,
                      padding: '4px 10px',
                      background: `color-mix(in srgb, ${A} 8%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${A} 15%, transparent)`,
                      borderRadius: 'var(--radius-full)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: A,
                    }}
                  >
                    Tracked on Growth &amp; Scale
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* ── Optimization by Plan ──────────────────────────────────────────── */}
      <section
        style={{
          paddingBlock: 'var(--space-section)',
          background: 'var(--bg)',
        }}
      >
        <Container>
          <ScrollReveal>
            <SectionHeader
              label="Plans"
              title="Optimization schedule by plan."
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
            {schedule.map((tier, i) => (
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
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: tier.featured ? A : 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 8,
                    }}
                  >
                    {tier.plan}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 16,
                    }}
                  >
                    {tier.frequency}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {tier.includes.map((item, j) => (
                      <div
                        key={j}
                        style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
                      >
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: `color-mix(in srgb, ${A} 12%, transparent)`,
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
                          {item}
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
                    {tier.extra}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* ── Load Testing ──────────────────────────────────────────────────── */}
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
                  background: `linear-gradient(90deg, var(--navy), ${A})`,
                }}
                aria-hidden="true"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: A,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: 12,
                    }}
                  >
                    Load testing
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
                    Know your limits before your users find them.
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      lineHeight: 1.65,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Quarterly load testing is included in Scale. Available as a $299 add-on for
                    Essential and Growth plans. We simulate real concurrent user scenarios and
                    find your breaking point before a traffic spike does.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    'Concurrent users — how many simultaneous sessions until degradation',
                    'Traffic spikes — sudden 10x surges, can your system absorb them',
                    'Database under load — query times at scale, lock contention, connection exhaustion',
                    'API under load — endpoint-by-endpoint throughput limits',
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
                    >
                      <span style={{ color: A, flexShrink: 0, marginTop: 2 }} aria-hidden="true">
                        <ArrowRight size={13} />
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
                  <div
                    style={{
                      marginTop: 8,
                      padding: '16px 20px',
                      background: `color-mix(in srgb, ${A} 6%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${A} 15%, transparent)`,
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.88rem',
                        color: 'var(--text-secondary)',
                        margin: 0,
                      }}
                    >
                      You get a bottleneck report, specific recommendations, and a
                      before/after comparison after each test.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <CTASection
        title="Slow software costs customers. Let's fix it."
        subtitle="Performance baseline delivered within 48 hours. Optimizations start from there."
        primaryCTA={{ label: 'Get protected', href: '/services/get-protected' }}
        ghostCTA={{ label: 'See all plans', href: '/services/plans' }}
        note="Performance baseline included on all plans. Active optimization on Growth and Scale."
      />
    </>
  );
}
