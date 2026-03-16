import { ReactNode } from 'react';
import Link from 'next/link';
import Hero, { type HeroButton } from '@/components/sections/Hero';
import DivisionGrid from '@/components/sections/DivisionGrid';
import CTASection from '@/components/shared/CTASection';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import LogoMarquee from '@/components/sections/LogoMarquee';
import AnimatedGrid from '@/components/visual/AnimatedGrid';

// ── Content Interfaces ────────────────────────────────────────────────────────

export interface HubCard {
  label?: string;
  headline: string;
  description: string;
  href: string;
  cta?: string;
  accent?: string;
  icon?: ReactNode;
}

export interface FlowStep {
  number?: string;
  title: string;
  description: string;
}

export interface HubRouterContent {
  hero: {
    badge?: string;
    headline: ReactNode;
    description: string;
    buttons?: HeroButton[];
    rightContent?: ReactNode;
  };
  /**
   * 'divisions' — render the full DivisionGrid (homepage)
   * 'cards' — render custom HubCards (solutions hub, product hub)
   */
  gridMode: 'divisions' | 'cards';
  gridLabel?: string;
  gridTitle?: string;
  /** Required when gridMode = 'cards' */
  cards?: HubCard[];
  flow?: {
    label?: string;
    headline: string;
    steps: FlowStep[];
  };
  partners?: boolean;
  cta: {
    title: string;
    subtitle?: string;
    primaryCTA?: { label: string; href: string };
    ghostCTA?: { label: string; href: string };
    note?: string;
  };
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function HubRouter({ content }: { content: HubRouterContent }) {
  const {
    hero, gridMode, gridLabel, gridTitle, cards, flow, partners = false, cta,
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

      {/* ── Grid (Divisions or Cards) ────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}>
        {gridMode === 'divisions' ? (
          <Container>
            {(gridLabel || gridTitle) && (
              <ScrollReveal>
                <SectionHeader
                  label={gridLabel ?? 'What we build'}
                  title={gridTitle ?? 'Every discipline under one roof'}
                  centered
                  className="mb-14"
                />
              </ScrollReveal>
            )}
            <DivisionGrid />
          </Container>
        ) : (
          <Container>
            {(gridLabel || gridTitle) && (
              <ScrollReveal>
                <SectionHeader
                  label={gridLabel}
                  title={gridTitle ?? 'Choose your path'}
                  centered
                  className="mb-14"
                />
              </ScrollReveal>
            )}
            {cards && (
              <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, i) => (
                  <StaggerItem key={i}>
                    <HubCardComponent card={card} />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            )}
          </Container>
        )}
      </section>

      {/* ── How it connects (flow) ───────────────────────────────────────── */}
      {flow && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16" style={{ alignItems: 'start' }}>
              <ScrollReveal direction="right">
                <SectionHeader
                  label={flow.label ?? 'How it works'}
                  title={flow.headline}
                  className="mb-4"
                />
              </ScrollReveal>

              <div>
                <StaggerChildren className="flex flex-col">
                  {flow.steps.map((step, i) => (
                    <StaggerItem key={i}>
                      <FlowStepItem step={step} index={i} total={flow.steps.length} />
                    </StaggerItem>
                  ))}
                </StaggerChildren>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Partners / Logo marquee ──────────────────────────────────────── */}
      {partners && (
        <LogoMarquee label="Trusted by builders worldwide" />
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

// ── Sub-components ────────────────────────────────────────────────────────────

function HubCardComponent({ card }: { card: HubCard }) {
  const accent = card.accent ?? 'var(--division-accent)';

  return (
    <Link
      href={card.href}
      style={{ display: 'block', textDecoration: 'none', height: '100%' }}
    >
      <article
        className="card"
        style={{
          padding: '32px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          cursor: 'pointer',
        }}
      >
        {card.icon && (
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-sm)',
            background: `color-mix(in srgb, ${accent} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
            flexShrink: 0,
          }}>
            {card.icon}
          </div>
        )}

        {card.label && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            fontWeight: 500,
            color: accent,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: 0,
          }}>
            {card.label}
          </p>
        )}

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.15rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.25,
          margin: 0,
        }}>
          {card.headline}
        </h3>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          lineHeight: 1.65,
          color: 'var(--text-secondary)',
          margin: 0,
          flex: 1,
        }}>
          {card.description}
        </p>

        {card.cta && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: accent,
            marginTop: 'auto',
          }}>
            {card.cta}
            <svg viewBox="0 0 24 24" fill="none" width={14} height={14}
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </article>
    </Link>
  );
}

function FlowStepItem({
  step, index, total,
}: {
  step: FlowStep;
  index: number;
  total: number;
}) {
  const isLast = index === total - 1;
  const num = step.number ?? String(index + 1).padStart(2, '0');

  return (
    <div style={{
      display: 'flex',
      gap: 20,
      paddingBottom: isLast ? 0 : 28,
      position: 'relative',
    }}>
      {/* Connector line */}
      {!isLast && (
        <div style={{
          position: 'absolute',
          left: 19,
          top: 40,
          bottom: 0,
          width: 2,
          background: 'var(--border)',
        }} aria-hidden="true" />
      )}

      {/* Number circle */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'color-mix(in srgb, var(--division-accent) 10%, transparent)',
        border: '1.5px solid color-mix(in srgb, var(--division-accent) 25%, transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        fontWeight: 600,
        color: 'var(--division-accent)',
        flexShrink: 0,
        zIndex: 1,
        position: 'relative',
      }}>
        {num}
      </div>

      <div style={{ paddingTop: 8 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          marginBottom: 6,
        }}>
          {step.title}
        </div>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          lineHeight: 1.65,
          color: 'var(--text-secondary)',
          margin: 0,
        }}>
          {step.description}
        </p>
      </div>
    </div>
  );
}
