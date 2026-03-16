interface GradientOrbsProps {
  accentColor?: string;
  variant?: 'default' | 'hero' | 'cta' | 'minimal';
}

interface OrbDef {
  size: number;
  color: string;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  cls: string;
}

export default function GradientOrbs({
  accentColor,
  variant = 'default',
}: GradientOrbsProps) {
  const accent = accentColor ?? 'var(--division-accent)';

  const sets: Record<string, OrbDef[]> = {
    hero: [
      { size: 700, color: 'var(--navy)',  top: '-15%', left: '-8%',  cls: 'orb-1' },
      { size: 600, color: accent,          bottom: '-20%', right: '-5%', cls: 'orb-2' },
      { size: 380, color: 'var(--teal)',   top: '35%', right: '18%',  cls: 'orb-3' },
    ],
    default: [
      { size: 600, color: 'var(--navy)',  top: '-10%', left: '-5%',  cls: 'orb-1' },
      { size: 500, color: accent,          bottom: '-10%', right: '-5%', cls: 'orb-2' },
    ],
    cta: [
      { size: 650, color: accent,         top: '50%', left: '50%', cls: 'orb-1' },
      { size: 400, color: 'var(--navy)',  top: '0%', left: '-10%',  cls: 'orb-3' },
      { size: 350, color: accent,         bottom: '0%', right: '5%', cls: 'orb-4' },
    ],
    minimal: [
      { size: 400, color: accent, top: '-20%', right: '10%', cls: 'orb-2' },
    ],
  };

  const orbs = sets[variant] ?? sets.default;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`orb ${orb.cls}`}
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            // cta variant: centre orb needs transform to truly centre
            transform: variant === 'cta' && i === 0
              ? 'translate(-50%, -50%)'
              : undefined,
          }}
        />
      ))}
    </div>
  );
}
