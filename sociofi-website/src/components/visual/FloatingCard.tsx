import { ReactNode } from 'react';

interface FloatingCardProps {
  icon?: ReactNode;
  label: string;
  value: string;
  /** 0-4: selects a built-in animation delay offset for staggered float */
  delay?: number;
  accentColor?: string;
  className?: string;
}

const DELAYS = ['0s', '-2s', '-4s', '-1.5s', '-3.5s'];

export default function FloatingCard({
  icon,
  label,
  value,
  delay = 0,
  accentColor,
  className = '',
}: FloatingCardProps) {
  const accent = accentColor ?? 'var(--division-accent)';

  return (
    <div
      className={`animate-float-slow ${className}`}
      style={{
        animationDelay: DELAYS[delay % DELAYS.length],
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
        userSelect: 'none',
      }}
      aria-label={`${label}: ${value}`}
    >
      {icon && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-sm)',
            background: `color-mix(in srgb, ${accent} 15%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginTop: 3,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
