import Container from '@/components/shared/Container';
import Button from '@/components/shared/Button';
import ScrollReveal from '@/components/shared/ScrollReveal';

interface CTALink {
  label: string;
  href: string;
}

interface CTASectionProps {
  title: string;
  subtitle?: string;
  primaryCTA?: CTALink;
  ghostCTA?: CTALink;
  accentColor?: string;
  /** Fine print below buttons */
  note?: string;
  className?: string;
}

export default function CTASection({
  title,
  subtitle,
  primaryCTA,
  ghostCTA,
  accentColor,
  note = 'No commitment. No technical knowledge required.',
  className = '',
}: CTASectionProps) {
  const accent = accentColor ?? 'var(--division-accent)';

  return (
    <section
      className={className}
      style={{
        position: 'relative',
        paddingBlock: 'var(--space-section)',
        overflow: 'hidden',
        background: 'var(--bg-2)',
      }}
    >
      {/* ── Background glow ─────────────────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* Centre radial bloom */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${accent}18 0%, transparent 65%)`,
            filter: 'blur(60px)',
          }}
        />
        {/* Left orb */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '-10%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, var(--navy)22 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />
        {/* Right orb */}
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '-8%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${accent}14 0%, transparent 70%)`,
            filter: 'blur(70px)',
          }}
        />
        {/* Subtle grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(var(--grid-color) 1px, transparent 1px),
              linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          }}
        />
      </div>

      <Container>
        <ScrollReveal>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 'var(--space-xl)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* ── Heading ───────────────────────────────────────────────── */}
            <div style={{ maxWidth: 720 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.12,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  style={{
                    marginTop: 16,
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.1rem',
                    lineHeight: 1.75,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* ── Buttons ───────────────────────────────────────────────── */}
            {(primaryCTA || ghostCTA) && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  justifyContent: 'center',
                }}
              >
                {primaryCTA && (
                  <Button variant="accent" size="lg" href={primaryCTA.href} accentColor={accent}>
                    {primaryCTA.label}
                  </Button>
                )}
                {ghostCTA && (
                  <Button variant="ghost" size="lg" href={ghostCTA.href}>
                    {ghostCTA.label}
                  </Button>
                )}
              </div>
            )}

            {/* ── Fine print ────────────────────────────────────────────── */}
            {note && (
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.04em',
                  margin: 0,
                }}
              >
                {note}
              </p>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
