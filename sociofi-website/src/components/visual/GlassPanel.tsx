import { ReactNode, CSSProperties, ElementType } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  padding?: string | number;
  /** Show a subtle gradient border using the division accent */
  accentBorder?: boolean;
  accentColor?: string;
  style?: CSSProperties;
  as?: ElementType;
}

export default function GlassPanel({
  children,
  className = '',
  padding = '32px',
  accentBorder = false,
  accentColor,
  style,
  as: Tag = 'div',
}: GlassPanelProps) {
  const accent = accentColor ?? 'var(--division-accent)';

  // ── Gradient border technique:
  // Outer wrapper has gradient background + 1px padding → creates border
  // Inner wrapper has the actual glass background
  // When accentBorder=false, use standard var(--glass-border) outline.

  if (accentBorder) {
    return (
      <div
        className={className}
        style={{
          background: `linear-gradient(135deg, var(--navy-deep) 0%, ${accent} 100%)`,
          borderRadius: 'var(--radius-lg)',
          padding: 1,
          ...style,
        }}
      >
        <Tag
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 'calc(var(--radius-lg) - 1px)',
            padding: typeof padding === 'number' ? `${padding}px` : padding,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </Tag>
      </div>
    );
  }

  return (
    <Tag
      className={className}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        padding: typeof padding === 'number' ? `${padding}px` : padding,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
