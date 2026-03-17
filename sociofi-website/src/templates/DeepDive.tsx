import { ReactNode } from 'react';
import Hero, { type HeroButton } from '@/components/sections/Hero';
import FAQAccordion, { type FAQItem } from '@/components/sections/FAQAccordion';
import CTASection from '@/components/shared/CTASection';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import Card from '@/components/cards/Card';
import GlassPanel from '@/components/visual/GlassPanel';

// ── Content Interfaces ────────────────────────────────────────────────────────

export interface UseCase {
  icon?: ReactNode;
  title: string;
  description: string;
}

export interface DeliverableItem {
  label: string;
  detail?: string;
}

export interface DeepDiveContent {
  hero: {
    badge?: string;
    headline: ReactNode;
    description: string;
    buttons?: HeroButton[];
  };
  useCases: UseCase[];
  useCasesLabel?: string;
  useCasesTitle?: string;
  deliverable: {
    label?: string;
    headline: string;
    description: string;
    items: DeliverableItem[];
  };
  timeline?: {
    duration: string;
    price?: string;
    note?: string;
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

export default function DeepDive({ content }: { content: DeepDiveContent }) {
  const {
    hero, useCases,
    useCasesLabel = 'Use cases',
    useCasesTitle = 'When to use this',
    deliverable, timeline, faqs, cta,
  } = content;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Hero
        badge={hero.badge}
        headline={hero.headline}
        description={hero.description}
        buttons={hero.buttons}
        layout="minimal"
        showGrid
        showOrbs={false}
      />

      {/* ── Use cases ────────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label={useCasesLabel}
              title={useCasesTitle}
              centered
              className="mb-14"
            />
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <StaggerItem key={i}>
                <Card
                  title={uc.title}
                  description={uc.description}
                  icon={uc.icon}
                  as="article"
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ── Deliverable mockup ───────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16" style={{ alignItems: 'center' }}>

            <ScrollReveal direction="right">
              <SectionHeader
                label={deliverable.label ?? "What you'll get"}
                title={deliverable.headline}
                subtitle={deliverable.description}
                className="mb-8"
              />

              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {deliverable.items.map((item, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}>
                    <span style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'color-mix(in srgb, var(--division-accent) 12%, transparent)',
                      border: '1.5px solid color-mix(in srgb, var(--division-accent) 30%, transparent)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" width={10} height={10}
                        stroke="var(--division-accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <div>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                      }}>
                        {item.label}
                      </span>
                      {item.detail && (
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.88rem',
                          color: 'var(--text-muted)',
                          marginLeft: 6,
                        }}>
                          — {item.detail}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            {/* Timeline + price indicator */}
            <ScrollReveal direction="left">
              <GlassPanel style={{ padding: '36px' }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: 20,
                }}>
                  At a glance
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {timeline && (
                    <>
                      <IndicatorRow label="Timeline" value={timeline.duration} />
                      {timeline.price && <IndicatorRow label="Starting from" value={timeline.price} isAccent />}
                    </>
                  )}
                  <IndicatorRow label="Deliverable type" value="Fixed-scope project" />
                  <IndicatorRow label="Communication" value="Async + weekly sync" />
                  <IndicatorRow label="Revisions" value="Unlimited within scope" />
                </div>

                {timeline?.note && (
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                    marginTop: 20,
                    paddingTop: 20,
                    borderTop: '1px solid var(--border)',
                  }}>
                    {timeline.note}
                  </p>
                )}
              </GlassPanel>
            </ScrollReveal>
          </div>
        </Container>
      </section>

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

function IndicatorRow({ label, value, isAccent = false }: {
  label: string;
  value: string;
  isAccent?: boolean;
}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      paddingBottom: 16,
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.84rem',
        color: 'var(--text-muted)',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: isAccent ? 'var(--font-headline)' : 'var(--font-mono)',
        fontSize: isAccent ? '1.1rem' : '0.84rem',
        fontWeight: isAccent ? 700 : 400,
        color: isAccent ? 'var(--division-accent)' : 'var(--text-primary)',
        letterSpacing: isAccent ? '-0.02em' : undefined,
      }}>
        {value}
      </span>
    </div>
  );
}
