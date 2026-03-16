import { ReactNode } from 'react';

interface SectionHeaderProps {
  label?: string;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  centered?: boolean;
  accentColor?: string;
  /** Render title as h1 (hero) or h2 (section, default) */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  centered = false,
  accentColor,
  as: Tag = 'h2',
  className = '',
}: SectionHeaderProps) {
  const accent = accentColor ?? 'var(--division-accent, var(--teal))';

  const titleSize =
    Tag === 'h1'
      ? 'clamp(2.6rem, 5vw, 4rem)'
      : Tag === 'h3'
      ? '1.2rem'
      : 'clamp(1.8rem, 3vw, 2.4rem)';

  const titleWeight = Tag === 'h1' ? 800 : 700;
  const titleTracking = Tag === 'h1' ? '-0.035em' : '-0.02em';
  const titleLineHeight = Tag === 'h1' ? 1.06 : 1.15;

  return (
    <div
      className={className}
      style={{ textAlign: centered ? 'center' : undefined }}
    >
      {label && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 500,
            color: accent,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: 14,
          }}
        >
          {/* The "— " prefix line */}
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: 20,
              height: 1.5,
              background: accent,
              flexShrink: 0,
            }}
          />
          {label}
        </div>
      )}

      <Tag
        style={{
          fontFamily: 'var(--font-headline)',
          fontSize: titleSize,
          fontWeight: titleWeight,
          letterSpacing: titleTracking,
          lineHeight: titleLineHeight,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        {title}
      </Tag>

      {subtitle && (
        <p
          style={{
            marginTop: 16,
            fontFamily: 'var(--font-body)',
            fontSize: '1.1rem',
            fontWeight: 400,
            lineHeight: 1.75,
            color: 'var(--text-secondary)',
            maxWidth: centered ? '42rem' : undefined,
            marginInline: centered ? 'auto' : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
