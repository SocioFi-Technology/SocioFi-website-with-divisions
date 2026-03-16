'use client';

interface LogoItem {
  name: string;
  /** Optional SVG path/content or text initials */
  initials?: string;
}

interface LogoMarqueeProps {
  items?: LogoItem[];
  label?: string;
  speed?: number;
  className?: string;
}

const DEFAULT_ITEMS: LogoItem[] = [
  { name: 'Buildstack', initials: 'BS' },
  { name: 'Launchpad', initials: 'LP' },
  { name: 'Nexora', initials: 'NX' },
  { name: 'Orbify', initials: 'OR' },
  { name: 'Stratify', initials: 'ST' },
  { name: 'Vaultify', initials: 'VT' },
  { name: 'Crafter', initials: 'CR' },
  { name: 'Driftworks', initials: 'DW' },
];

function LogoPlaceholder({ item }: { item: LogoItem }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        whiteSpace: 'nowrap',
        filter: 'grayscale(1)',
        opacity: 0.5,
        transition: 'filter 0.3s, opacity 0.3s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.filter = 'grayscale(0)';
        el.style.opacity = '1';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.filter = 'grayscale(1)';
        el.style.opacity = '0.5';
      }}
      aria-label={item.name}
    >
      {item.initials && (
        <div style={{
          width: 28, height: 28,
          borderRadius: 'var(--radius-xs)',
          background: 'var(--bg-3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: '0.65rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '0.04em',
        }}>
          {item.initials}
        </div>
      )}
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        letterSpacing: '-0.01em',
      }}>
        {item.name}
      </span>
    </div>
  );
}

export default function LogoMarquee({
  items = DEFAULT_ITEMS,
  label = 'Trusted by builders worldwide',
  speed = 40,
  className = '',
}: LogoMarqueeProps) {
  // Duration: pixels / speed → higher speed = faster
  const duration = `${Math.round((items.length * 180) / speed)}s`;

  // Duplicate for seamless loop
  const track = [...items, ...items];

  return (
    <div className={className} style={{ paddingBlock: 'var(--space-2xl)' }}>
      {label && (
        <p style={{
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          fontWeight: 500,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 28,
        }}>
          {label}
        </p>
      )}

      {/* Scroll container with edge fades */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          // Edge gradient masks
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        <div
          style={{
            display: 'flex',
            gap: 12,
            width: 'max-content',
            animation: `marquee ${duration} linear infinite`,
          }}
        >
          {track.map((item, i) => (
            <LogoPlaceholder key={`${item.name}-${i}`} item={item} />
          ))}
        </div>
      </div>

      {/* Inline keyframe — avoids needing globals */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation: marquee"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
