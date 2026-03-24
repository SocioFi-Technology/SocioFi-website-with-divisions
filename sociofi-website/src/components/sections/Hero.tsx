import { ReactNode } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/shared/Button';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
// Lazy client wrappers — deferred so they don't block initial paint
import AnimatedGrid from '@/components/visual/AnimatedGridLazy';
import GradientOrbs from '@/components/visual/GradientOrbsLazy';

type Layout = 'split' | 'centered' | 'minimal';

export interface HeroButton {
  label: string;
  href: string;
  variant?: 'primary' | 'ghost' | 'accent' | 'text';
}

export interface HeroProps {
  badge?: string;
  /** Supports ReactNode — use <span className="gradient-text"> for shimmer words */
  headline: ReactNode;
  description?: string;
  buttons?: HeroButton[];
  /** Right-column content for 'split' layout (FloatingCards, mockups, etc.) */
  rightContent?: ReactNode;
  accentColor?: string;
  layout?: Layout;
  className?: string;
  minHeight?: string;
  showGrid?: boolean;
  showOrbs?: boolean;
}

export default function Hero({
  badge,
  headline,
  description,
  buttons = [],
  rightContent,
  accentColor,
  layout = 'split',
  className = '',
  minHeight,
  showGrid = true,
  showOrbs = true,
}: HeroProps) {
  const accent = accentColor ?? 'var(--division-accent)';
  const isCentered = layout === 'centered';
  const isMinimal = layout === 'minimal';
  const hasSplit = layout === 'split' && !!rightContent;

  return (
    <section
      className={`relative overflow-hidden flex items-center ${className}`}
      style={{
        minHeight: minHeight ?? (isMinimal ? '60vh' : '88vh'),
        paddingBlock: isMinimal ? 'var(--space-4xl)' : 'var(--space-section)',
        background: 'var(--bg)',
      }}
    >
      {/* ── Backgrounds ───────────────────────────────────────────────────── */}
      {showGrid && <AnimatedGrid />}
      {showOrbs && <GradientOrbs accentColor={accent} variant="hero" />}

      {/* Noise texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--noise-opacity)',
          // Inline SVG noise filter — no external asset needed
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          pointerEvents: 'none',
        }}
      />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <Container
        wide={hasSplit}
        className="relative z-10"
      >
        <div
          className={
            hasSplit
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center'
              : ''
          }
          style={
            isCentered
              ? {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }
              : undefined
          }
        >
          {/* ── Text block ──────────────────────────────────────────────── */}
          <StaggerChildren delay={0.3} stagger={0.15}>
            {/* Badge */}
            {badge && (
              <StaggerItem>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '5px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${accent}`,
                    background: `color-mix(in srgb, ${accent} 10%, transparent)`,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: accent,
                    marginBottom: 'var(--space-lg)',
                  }}
                >
                  {badge}
                </div>
              </StaggerItem>
            )}

            {/* Headline */}
            <StaggerItem withScale>
              <h1
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: isMinimal
                    ? 'clamp(2rem, 3.5vw, 2.8rem)'
                    : 'clamp(2.6rem, 5vw, 4rem)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.06,
                  color: 'var(--text-primary)',
                  margin: 0,
                  maxWidth: isCentered ? '22ch' : hasSplit ? '16ch' : '20ch',
                  marginInline: isCentered ? 'auto' : undefined,
                }}
              >
                {headline}
              </h1>
            </StaggerItem>

            {/* Description */}
            {description && (
              <StaggerItem>
                <p
                  style={{
                    marginTop: 'var(--space-lg)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.1rem',
                    lineHeight: 1.75,
                    color: 'var(--text-secondary)',
                    maxWidth: isCentered ? '46ch' : '42ch',
                    marginInline: isCentered ? 'auto' : undefined,
                  }}
                >
                  {description}
                </p>
              </StaggerItem>
            )}

            {/* Buttons */}
            {buttons.length > 0 && (
              <StaggerItem>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 12,
                    marginTop: 'var(--space-xl)',
                    justifyContent: isCentered ? 'center' : undefined,
                  }}
                >
                  {buttons.map((btn, i) => (
                    <Button
                      key={i}
                      variant={btn.variant ?? (i === 0 ? 'accent' : 'ghost')}
                      size="lg"
                      href={btn.href}
                      accentColor={accent}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </div>
              </StaggerItem>
            )}
          </StaggerChildren>

          {/* ── Right content ── split layout only ─────────────────────── */}
          {hasSplit && (
            <ScrollReveal direction="left" delay={0.6}>
              <div className="relative flex items-center justify-center lg:justify-end">
                {rightContent}
              </div>
            </ScrollReveal>
          )}
        </div>
      </Container>
    </section>
  );
}
