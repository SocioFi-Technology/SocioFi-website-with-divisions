import { ReactNode } from 'react';
import Hero, { type HeroButton } from '@/components/sections/Hero';
import MetricBar, { type Metric } from '@/components/sections/MetricBar';
import CTASection from '@/components/shared/CTASection';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import ServiceCard from '@/components/cards/ServiceCard';
import Card from '@/components/cards/Card';
import TestimonialCard from '@/components/cards/TestimonialCard';

// ── Content Interfaces ────────────────────────────────────────────────────────

export interface DivisionService {
  icon?: ReactNode;
  title: string;
  description: string;
  href?: string;
  linkText?: string;
}

export interface DivisionFeature {
  icon?: ReactNode;
  title: string;
  description: string;
}

export interface DivisionTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface FeaturedItem {
  label: string;
  headline: string;
  description: string;
  href?: string;
  cta?: string;
  visual?: ReactNode;
}

export interface DivisionOverviewContent {
  hero: {
    badge?: string;
    headline: ReactNode;
    description: string;
    buttons?: HeroButton[];
    rightContent?: ReactNode;
  };
  metrics?: Metric[];
  services: DivisionService[];
  servicesLabel?: string;
  servicesTitle?: string;
  features?: DivisionFeature[];
  featuresLabel?: string;
  featuresTitle?: string;
  featured?: FeaturedItem;
  testimonials?: DivisionTestimonial[];
  cta: {
    title: string;
    subtitle?: string;
    primaryCTA?: { label: string; href: string };
    ghostCTA?: { label: string; href: string };
    note?: string;
  };
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function DivisionOverview({ content }: { content: DivisionOverviewContent }) {
  const {
    hero, metrics, services,
    servicesLabel = 'What we do',
    servicesTitle = 'Everything you need to ship',
    features, featuresLabel = 'Why us',
    featuresTitle = 'Built differently',
    featured, testimonials, cta,
  } = content;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Hero
        badge={hero.badge}
        headline={hero.headline}
        description={hero.description}
        buttons={hero.buttons}
        rightContent={hero.rightContent}
        layout={hero.rightContent ? 'split' : 'centered'}
        showGrid
        showOrbs
      />

      {/* ── Metrics ──────────────────────────────────────────────────────── */}
      {metrics && metrics.length > 0 && (
        <MetricBar metrics={metrics} background />
      )}

      {/* ── Services / Card grid ─────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label={servicesLabel}
              title={servicesTitle}
              centered
              className="mb-16"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <StaggerItem key={i}>
                <ServiceCard
                  title={svc.title}
                  description={svc.description}
                  icon={svc.icon}
                  href={svc.href}
                  linkText={svc.linkText}
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ── Differentiators ──────────────────────────────────────────────── */}
      {features && features.length > 0 && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
          <Container>
            <ScrollReveal>
              <SectionHeader
                label={featuresLabel}
                title={featuresTitle}
                centered
                className="mb-16"
              />
            </ScrollReveal>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <StaggerItem key={i}>
                  <Card
                    title={f.title}
                    description={f.description}
                    icon={f.icon}
                    as="article"
                  />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </section>
      )}

      {/* ── Featured item ────────────────────────────────────────────────── */}
      {featured && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
          <Container>
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-16"
              style={{ alignItems: 'center' }}
            >
              <ScrollReveal direction="right">
                <div>
                  <p className="sec-label">{featured.label}</p>
                  <h2 style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    color: 'var(--text-primary)',
                    marginBottom: 20,
                  }}>
                    {featured.headline}
                  </h2>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.05rem',
                    lineHeight: 1.75,
                    color: 'var(--text-secondary)',
                    marginBottom: 32,
                  }}>
                    {featured.description}
                  </p>
                  {featured.href && featured.cta && (
                    <a
                      href={featured.href}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        fontFamily: 'var(--font-headline)',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: 'var(--division-accent)',
                        letterSpacing: '-0.01em',
                      }}
                      className="hover-arrow"
                    >
                      {featured.cta}
                      <svg viewBox="0 0 24 24" fill="none" width={16} height={16}
                        stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                        strokeLinejoin="round" className="arrow-icon" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                </div>
              </ScrollReveal>

              {featured.visual ? (
                <ScrollReveal direction="left">
                  {featured.visual}
                </ScrollReveal>
              ) : (
                <ScrollReveal direction="left">
                  <FeaturedPlaceholder />
                </ScrollReveal>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      {testimonials && testimonials.length > 0 && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
          <Container>
            <ScrollReveal>
              <SectionHeader
                label="What clients say"
                title="Results that speak"
                centered
                className="mb-12"
              />
            </ScrollReveal>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <StaggerItem key={i}>
                  <TestimonialCard
                    quote={t.quote}
                    author={t.author}
                    role={t.role}
                    company={t.company}
                    glass={i === 0}
                  />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <CTASection
        title={cta.title}
        subtitle={cta.subtitle}
        primaryCTA={cta.primaryCTA}
        ghostCTA={cta.ghostCTA}
        note={cta.note}
      />
    </>
  );
}

// Placeholder visual for featured section when no visual prop supplied
function FeaturedPlaceholder() {
  return (
    <div style={{
      aspectRatio: '4/3',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        Visual coming soon
      </div>
    </div>
  );
}
