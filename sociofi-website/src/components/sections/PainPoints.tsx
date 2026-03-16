import { ReactNode } from 'react';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';

export interface PainPoint {
  title: string;
  description: string;
  icon?: ReactNode;
}

interface PainPointsProps {
  label?: string;
  title: string;
  intro?: string;
  points: PainPoint[];
  closing?: string;
  accentColor?: string;
  className?: string;
}

// Warning tone — pain sections always use this, not division accent
const WARN = '#E8916F';

// Warning triangle icon
function WarnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={16} height={16}
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function PainPoints({
  label = 'The Problem',
  title,
  intro,
  points,
  closing,
  accentColor,
  className = '',
}: PainPointsProps) {
  const divisionAccent = accentColor ?? 'var(--division-accent)';

  return (
    <section
      className={className}
      style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg-2)' }}
    >
      <Container>
        <ScrollReveal>
          <SectionHeader label={label} title={title} accentColor={WARN} />
        </ScrollReveal>

        {intro && (
          <ScrollReveal delay={0.1}>
            <p style={{
              marginTop: 'var(--space-xl)',
              fontFamily: 'var(--font-body)',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              maxWidth: '58ch',
            }}>
              {intro}
            </p>
          </ScrollReveal>
        )}

        <StaggerChildren delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            style={{ marginTop: 'var(--space-2xl)' }}>
            {points.map((point, i) => (
              <StaggerItem key={i}>
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(232,145,111,0.12)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  height: '100%',
                }}>
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(232,145,111,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: WARN, flexShrink: 0,
                  }} aria-hidden="true">
                    {point.icon ?? <WarnIcon />}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.05rem', fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: 'var(--text-primary)', margin: 0,
                  }}>
                    {point.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem', lineHeight: 1.65,
                    color: 'var(--text-secondary)', margin: 0,
                  }}>
                    {point.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerChildren>

        {closing && (
          <ScrollReveal delay={0.2}>
            <p style={{
              marginTop: 'var(--space-3xl)',
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              fontWeight: 600,
              lineHeight: 1.4,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
              maxWidth: '52ch',
              paddingLeft: 20,
              borderLeft: `3px solid ${divisionAccent}`,
            }}>
              {closing}
            </p>
          </ScrollReveal>
        )}
      </Container>
    </section>
  );
}
