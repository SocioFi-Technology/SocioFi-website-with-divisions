import { ReactNode } from 'react';
import ScrollReveal from '@/components/shared/ScrollReveal';

export interface TimelineStep {
  title: string;
  description: string;
  icon?: ReactNode;
  duration?: string;
}

interface ProcessTimelineProps {
  steps: TimelineStep[];
  accentColor?: string;
  className?: string;
}

export default function ProcessTimeline({
  steps,
  accentColor,
  className = '',
}: ProcessTimelineProps) {
  const accent = accentColor ?? 'var(--division-accent)';

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Gradient vertical connector — absolutely positioned behind circles */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 23,
          top: 24,
          bottom: 24,
          width: 2,
          background: `linear-gradient(to bottom, ${accent}, var(--navy-deep))`,
          opacity: 0.15,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {steps.map((step, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <div
              style={{
                display: 'flex',
                gap: 28,
                paddingBottom: i < steps.length - 1 ? 48 : 0,
              }}
            >
              {/* Numbered / icon circle */}
              <div
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: `color-mix(in srgb, ${accent} 15%, transparent)`,
                  border: `1.5px solid ${accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}
                aria-hidden="true"
              >
                {step.icon ? (
                  <span style={{ color: accent }}>{step.icon}</span>
                ) : (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: accent,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={{ paddingTop: 10, flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    flexWrap: 'wrap',
                    gap: '8px 12px',
                    marginBottom: 10,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    {step.title}
                  </h3>
                  {step.duration && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        fontWeight: 500,
                        color: accent,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        background: `color-mix(in srgb, ${accent} 10%, transparent)`,
                        border: `1px solid ${accent}`,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {step.duration}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    margin: 0,
                    maxWidth: '56ch',
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
