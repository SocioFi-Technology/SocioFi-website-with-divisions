import { ReactNode } from 'react';
import Hero, { type HeroButton } from '@/components/sections/Hero';
import PainPoints, { type PainPoint } from '@/components/sections/PainPoints';
import ProcessTimeline, { type TimelineStep } from '@/components/sections/ProcessTimeline';
import MetricBar, { type Metric } from '@/components/sections/MetricBar';
import FAQAccordion, { type FAQItem } from '@/components/sections/FAQAccordion';
import CTASection from '@/components/shared/CTASection';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import Card from '@/components/cards/Card';
import TestimonialCard from '@/components/cards/TestimonialCard';
import Button from '@/components/shared/Button';

// ── Content Interfaces ────────────────────────────────────────────────────────

export interface Deliverable {
  icon?: ReactNode;
  title: string;
  description: string;
}

export interface AudienceTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface AudienceLandingContent {
  hero: {
    badge?: string;
    headline: ReactNode;
    description: string;
    buttons?: HeroButton[];
  };
  painPoints: {
    label?: string;
    title: string;
    intro?: string;
    points: PainPoint[];
    closing?: string;
  };
  process: TimelineStep[];
  processLabel?: string;
  processTitle?: string;
  processSubtitle?: string;
  deliverables: Deliverable[];
  deliverablesLabel?: string;
  deliverablesTitle?: string;
  testimonials?: AudienceTestimonial[];
  metrics?: Metric[];
  pricingTeaser?: {
    headline: string;
    description: string;
    href: string;
    cta: string;
  };
  faqs?: FAQItem[];
  cta: {
    title: string;
    subtitle?: string;
    primaryCTA?: { label: string; href: string };
    ghostCTA?: { label: string; href: string };
    note?: string;
  };
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function AudienceLanding({ content }: { content: AudienceLandingContent }) {
  const {
    hero, painPoints, process,
    processLabel = 'How it works',
    processTitle = 'From first call to shipped product',
    processSubtitle,
    deliverables,
    deliverablesLabel = 'What you get',
    deliverablesTitle = "Everything you've been missing",
    testimonials, metrics, pricingTeaser, faqs, cta,
  } = content;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Hero
        badge={hero.badge}
        headline={hero.headline}
        description={hero.description}
        buttons={hero.buttons}
        layout="centered"
        showGrid
        showOrbs
      />

      {/* ── Pain points ──────────────────────────────────────────────────── */}
      <PainPoints
        label={painPoints.label}
        title={painPoints.title}
        intro={painPoints.intro}
        points={painPoints.points}
        closing={painPoints.closing}
      />

      {/* ── Process timeline ─────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label={processLabel}
              title={processTitle}
              subtitle={processSubtitle}
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <div style={{ maxWidth: 680, marginInline: 'auto' }}>
            <ScrollReveal>
              <ProcessTimeline steps={process} />
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* ── Deliverables grid ────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label={deliverablesLabel}
              title={deliverablesTitle}
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {deliverables.map((item, i) => (
              <StaggerItem key={i}>
                <Card
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  as="article"
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      {testimonials && testimonials.length > 0 && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
          <Container>
            <ScrollReveal>
              <SectionHeader
                label="From clients like you"
                title="They were in your shoes too"
                centered
                className="mb-12"
              />
            </ScrollReveal>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <StaggerItem key={i}>
                  <TestimonialCard
                    quote={t.quote}
                    author={t.author}
                    role={t.role}
                    company={t.company}
                    glass={i % 3 === 0}
                  />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </section>
      )}

      {/* ── Metrics ──────────────────────────────────────────────────────── */}
      {metrics && metrics.length > 0 && (
        <MetricBar metrics={metrics} background />
      )}

      {/* ── Pricing teaser ───────────────────────────────────────────────── */}
      {pricingTeaser && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
          <Container narrow>
            <ScrollReveal>
              <div style={{
                textAlign: 'center',
                padding: '48px 32px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
              }}>
                <p className="sec-label sec-label-center" style={{ marginBottom: 16 }}>Transparent pricing</p>
                <h3 style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: 16,
                }}>
                  {pricingTeaser.headline}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  marginBottom: 28,
                  maxWidth: '50ch',
                  marginInline: 'auto',
                }}>
                  {pricingTeaser.description}
                </p>
                <Button href={pricingTeaser.href} variant="ghost">
                  {pricingTeaser.cta}
                </Button>
              </div>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {faqs && faqs.length > 0 && (
        <FAQAccordion items={faqs} standalone />
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
