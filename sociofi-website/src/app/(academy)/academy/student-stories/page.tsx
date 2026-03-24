import type { Metadata } from 'next';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import CTASection from '@/components/shared/CTASection';
import AnimatedGrid from '@/components/visual/AnimatedGrid';
import TestimonialCard from '@/components/cards/TestimonialCard';

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Student Stories — SocioFi Academy',
  description:
    'Real outcomes from SocioFi Academy students. Developers, founders, and teams who built and shipped AI-native software.',
  openGraph: {
    title: 'Student Stories — SocioFi Academy',
    description:
      'Real outcomes from SocioFi Academy students. Developers, founders, and teams who built and shipped AI-native software.',
    type: 'website',
    images: [{ url: '/academy/opengraph-image' }],
  },
  twitter: { card: 'summary_large_image' },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const accentColor = '#E8B84D';

const featuredStories = [
  {
    quote:
      "I had a prototype I'd built with an AI coding tool. It worked in my browser but crashed with 10 concurrent users. After From Prototype to Production, I rebuilt the infrastructure, added proper auth and monitoring, and launched to 200 users. It's been running without incident for 3 months.",
    stat: { value: '200', label: 'users on launch day' },
    author: 'Independent founder',
    built: 'B2B SaaS MVP',
  },
  {
    quote:
      "I'd been doing backend development for 5 years and knew nothing about AI systems beyond the hype. AI-Native Development Fundamentals gave me a complete mental model. I shipped my first RAG-based feature at work 2 weeks after finishing the course.",
    stat: { value: '2 weeks', label: 'from course completion to production' },
    author: 'Senior Software Engineer',
    built: 'Internal document search tool',
  },
  {
    quote:
      "We enrolled our whole backend team — 8 engineers. We did the custom training programme. Three months later, we've shipped two production AI features and one engineer has started the SCARL path.",
    stat: { value: '2', label: 'production AI features shipped' },
    author: 'CTO, Growth-stage fintech',
    built: 'AI-assisted underwriting and document processing',
  },
];

const testimonials = [
  {
    quote:
      "The production debugging module alone was worth the entire course price. I'd been chasing a context window issue for two weeks. Fixed it in an afternoon after watching module 4.",
    author: 'Alex M.',
    role: 'Full-Stack Developer',
    company: 'Self-enrolled',
  },
  {
    quote:
      "As a non-technical founder, I didn't enroll to learn to code. I enrolled to understand what my engineers were building — and to spec AI features that actually made sense.",
    author: 'Startup Founder',
    role: 'Non-technical',
    company: 'EdTech startup',
  },
  {
    quote:
      "SCARL certification was the hardest thing I've done professionally since my first senior interview. Worth it.",
    author: 'Rachel T.',
    role: 'Software Engineer',
    company: 'Enterprise software firm',
  },
  {
    quote:
      'The agent architecture sprint workshop saved us months of wrong turns. We went in with a vague idea of what we wanted to build and came out with a real architecture document.',
    author: 'Engineering Lead',
    role: 'Team of 5',
    company: 'Logistics SaaS',
  },
  {
    quote:
      "I'd done three online AI courses before this one. This is the only one that ended with me deploying something real.",
    author: 'David L.',
    role: 'Backend Engineer',
    company: 'Career switcher',
  },
  {
    quote:
      'The corporate training programme was specifically designed around our use case — document processing in a regulated industry. Generic AI content wouldn\'t have been appropriate. This was.',
    author: 'Head of Engineering',
    role: 'Financial services firm',
    company: 'Corporate client',
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StudentStoriesPage() {
  return (
    <main>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          background: 'var(--bg)',
          paddingTop: 'calc(var(--space-section) + 60px)',
          paddingBottom: 'var(--space-3xl)',
          overflow: 'hidden',
        }}
      >
        <AnimatedGrid />
        <Container>
          <ScrollReveal>
            <div className="sec-label" style={{ marginBottom: 16 }}>
              Academy · Student stories
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 'clamp(2.6rem, 5vw, 4rem)',
                fontWeight: 400,
                lineHeight: 1.06,
                color: 'var(--text-primary)',
                letterSpacing: '-0.035em',
                marginBottom: 20,
              }}
            >
              What students built
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                maxWidth: 560,
              }}
            >
              Not testimonials about how good the content is — outcomes. What people built, shipped,
              and achieved after going through Academy.
            </p>
          </ScrollReveal>
        </Container>
      </section>

      {/* Metrics row */}
      <section
        style={{
          background: 'var(--bg-2)',
          padding: 'var(--space-2xl) 0',
        }}
      >
        <Container>
          <ScrollReveal>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-2xl)',
                justifyContent: 'center',
              }}
            >
              {[
                { value: '500+', label: 'Students' },
                { value: '94%', label: 'Completion rate' },
                { value: '12', label: 'Courses' },
                { value: '4', label: 'Workshops per quarter' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{ textAlign: 'center', minWidth: 120 }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                      fontWeight: 400,
                      color: accentColor,
                      letterSpacing: '-0.025em',
                      lineHeight: 1.1,
                      marginBottom: 6,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.84rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Featured stories */}
      <section
        style={{
          background: 'var(--bg)',
          padding: 'var(--space-section) 0',
        }}
      >
        <Container>
          <SectionHeader
            label="From students"
            title="Real projects. Real outcomes."
            accentColor={accentColor}
          />
          <div style={{ display: 'grid', gap: 24, marginTop: 48 }}>
          <StaggerChildren>
            {featuredStories.map((story) => (
              <StaggerItem key={story.author}>
                <div
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-lg)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    padding: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                  }}
                >
                  {/* Quote */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      lineHeight: 1.75,
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic',
                    }}
                  >
                    &ldquo;{story.quote}&rdquo;
                  </p>

                  {/* Stat */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '1.8rem',
                        fontWeight: 400,
                        color: accentColor,
                        letterSpacing: '-0.025em',
                      }}
                    >
                      {story.stat.value}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.84rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {story.stat.label}
                    </span>
                  </div>

                  {/* Author + built */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 16,
                      paddingTop: 4,
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {story.author}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: accentColor,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      Built: {story.built}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* Testimonials grid */}
      <section
        style={{
          background: 'var(--bg-2)',
          padding: 'var(--space-section) 0',
        }}
      >
        <Container>
          <SectionHeader
            label="More student voices"
            title="From developers, founders, and teams"
            accentColor={accentColor}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
              marginTop: 48,
            }}
          >
          <StaggerChildren>
            {testimonials.map((t, i) => (
              <StaggerItem key={t.author + i}>
                <TestimonialCard
                  quote={t.quote}
                  author={t.author}
                  role={t.role}
                  company={t.company}
                  accentColor={accentColor}
                  glass={i === 0}
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to build something?"
        subtitle="First module of every course is free. No account required to start."
        primaryCTA={{ label: 'Browse courses', href: '/academy/courses' }}
        ghostCTA={{ label: 'Free resources', href: '/academy/free' }}
        accentColor={accentColor}
      />
    </main>
  );
}
