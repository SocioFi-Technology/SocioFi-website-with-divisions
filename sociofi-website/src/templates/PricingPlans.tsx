import Hero, { type HeroButton } from '@/components/sections/Hero';
import ComparisonTable, { type ComparisonRow } from '@/components/sections/ComparisonTable';
import FAQAccordion, { type FAQItem } from '@/components/sections/FAQAccordion';
import TrustBar from '@/components/sections/TrustBar';
import CTASection from '@/components/shared/CTASection';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import PricingCard from '@/components/cards/PricingCard';
import Button from '@/components/shared/Button';
import ProjectConfigurator from '@/components/sections/ProjectConfigurator';
import PlanRecommender from '@/components/sections/PlanRecommender';

// ── Content Interfaces ────────────────────────────────────────────────────────

interface PricingFeature {
  text: string;
  included?: boolean;
}

export interface PricingPlan {
  name: string;
  badge?: string;
  description?: string;
  price: string;
  period?: string;
  priceNote?: string;
  features: (string | PricingFeature)[];
  cta: string;
  ctaHref: string;
  featured?: boolean;
}

export interface PricingBundle {
  label?: string;
  headline: string;
  description: string;
  items: string[];
  price?: string;
  cta?: string;
  ctaHref?: string;
}

export interface PricingPlansContent {
  hero: {
    badge?: string;
    headline: string;
    description: string;
    buttons?: HeroButton[];
  };
  showConfigurator?: boolean;
  showRecommender?: boolean;
  plans: PricingPlan[];
  comparisonHeaders?: string[];
  comparisonRows?: ComparisonRow[];
  comparisonHighlight?: number;
  bundle?: PricingBundle;
  trustItems?: string[];
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

export default function PricingPlans({ content }: { content: PricingPlansContent }) {
  const {
    hero, plans, showConfigurator, showRecommender,
    comparisonHeaders, comparisonRows, comparisonHighlight = 1,
    bundle, trustItems, faqs, cta,
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
        minHeight="50vh"
        showGrid
        showOrbs={false}
      />

      {/* ── Project Configurator (Studio only) ───────────────────────────── */}
      {showConfigurator && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
          <Container>
            <ScrollReveal>
              <SectionHeader
                label="Estimate"
                title="Get a ballpark before the call"
                subtitle="Select your project type and complexity — we'll give you a rough range. The real number comes from the scoping call."
                centered
                className="mb-12"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <ProjectConfigurator />
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* ── Plan Recommender (Services only) ─────────────────────────────── */}
      {showRecommender && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
          <Container>
            <ScrollReveal>
              <SectionHeader
                label="Not sure which plan?"
                title="Answer 3 questions — we'll tell you"
                subtitle="No sales call needed. Tell us where you are, and we'll point you to the right coverage level."
                centered
                className="mb-12"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <PlanRecommender />
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* ── Pricing cards ────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <StaggerItem key={i}>
                <PricingCard
                  name={plan.name}
                  badge={plan.badge}
                  description={plan.description}
                  price={plan.price}
                  period={plan.period}
                  priceNote={plan.priceNote}
                  features={plan.features}
                  cta={plan.cta}
                  ctaHref={plan.ctaHref}
                  featured={plan.featured}
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ── Comparison table ─────────────────────────────────────────────── */}
      {comparisonHeaders && comparisonRows && comparisonRows.length > 0 && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
          <Container>
            <ScrollReveal>
              <SectionHeader
                label="Compare plans"
                title="Everything side by side"
                centered
                className="mb-12"
              />
            </ScrollReveal>

            <ComparisonTable
              headers={comparisonHeaders}
              rows={comparisonRows}
              highlightColumn={comparisonHighlight}
            />
          </Container>
        </section>
      )}

      {/* ── Bundle section ───────────────────────────────────────────────── */}
      {bundle && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
          <Container narrow>
            <ScrollReveal>
              <div style={{
                padding: '48px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Decorative gradient corner */}
                <div style={{
                  position: 'absolute',
                  top: -80,
                  right: -80,
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, var(--division-accent) 0%, transparent 70%)',
                  opacity: 0.05,
                  pointerEvents: 'none',
                }} aria-hidden="true" />

                <p className="sec-label">{bundle.label ?? 'Bundle & save'}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10" style={{ alignItems: 'center' }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                      fontWeight: 400,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                      marginBottom: 16,
                    }}>
                      {bundle.headline}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      lineHeight: 1.7,
                      color: 'var(--text-secondary)',
                      marginBottom: bundle.price ? 24 : 0,
                    }}>
                      {bundle.description}
                    </p>
                    {bundle.price && (
                      <div style={{ marginBottom: 28 }}>
                        <span style={{
                          fontFamily: 'var(--font-headline)',
                          fontSize: '2rem',
                          fontWeight: 400,
                          letterSpacing: '-0.04em',
                          color: 'var(--division-accent)',
                        }}>
                          {bundle.price}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9rem',
                          color: 'var(--text-muted)',
                          marginLeft: 8,
                        }}>
                          /month
                        </span>
                      </div>
                    )}
                    {bundle.ctaHref && bundle.cta && (
                      <Button href={bundle.ctaHref} variant="accent">
                        {bundle.cta}
                      </Button>
                    )}
                  </div>

                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {bundle.items.map((item, i) => (
                      <li key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.92rem',
                        color: 'var(--text-secondary)',
                      }}>
                        <svg viewBox="0 0 24 24" fill="none" width={16} height={16}
                          stroke="var(--division-accent)" strokeWidth={2.5}
                          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
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

      {/* TrustBar — before footer */}
      {trustItems && trustItems.length > 0 && (
        <TrustBar items={trustItems} />
      )}
    </>
  );
}
