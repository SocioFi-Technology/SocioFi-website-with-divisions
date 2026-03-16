'use client';

import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';

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
  /** Parallax multiplier: 0.3 = moves at 30% of scroll speed */
  parallaxRate?: number;
}

export default function GradientOrbs({
  accentColor,
  variant = 'default',
}: GradientOrbsProps) {
  const accent = accentColor ?? 'var(--division-accent)';
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  const sets: Record<string, OrbDef[]> = {
    hero: [
      { size: 700, color: 'var(--navy)',  top: '-15%', left: '-8%',  cls: 'orb-1', parallaxRate: 0.25 },
      { size: 600, color: accent,          bottom: '-20%', right: '-5%', cls: 'orb-2', parallaxRate: -0.15 },
      { size: 380, color: 'var(--teal)',   top: '35%', right: '18%',  cls: 'orb-3', parallaxRate: 0.35 },
    ],
    default: [
      { size: 600, color: 'var(--navy)',  top: '-10%', left: '-5%',  cls: 'orb-1', parallaxRate: 0.2 },
      { size: 500, color: accent,          bottom: '-10%', right: '-5%', cls: 'orb-2', parallaxRate: -0.1 },
    ],
    cta: [
      { size: 650, color: accent,         top: '50%', left: '50%', cls: 'orb-1', parallaxRate: 0.15 },
      { size: 400, color: 'var(--navy)',  top: '0%', left: '-10%',  cls: 'orb-3', parallaxRate: 0.25 },
      { size: 350, color: accent,         bottom: '0%', right: '5%', cls: 'orb-4', parallaxRate: -0.1 },
    ],
    minimal: [
      { size: 400, color: accent, top: '-20%', right: '10%', cls: 'orb-2', parallaxRate: 0.3 },
    ],
  };

  const orbs = sets[variant] ?? sets.default;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <OrbElement
          key={i}
          orb={orb}
          isCtaCenter={variant === 'cta' && i === 0}
          scrollY={scrollY}
          reduced={reduced ?? false}
        />
      ))}
    </div>
  );
}

function OrbElement({
  orb,
  isCtaCenter,
  scrollY,
  reduced,
}: {
  orb: OrbDef;
  isCtaCenter: boolean;
  scrollY: ReturnType<typeof useScroll>['scrollY'];
  reduced: boolean;
}) {
  const rate = orb.parallaxRate ?? 0.3;
  const y = useTransform(scrollY, [0, 1000], [0, reduced ? 0 : 1000 * rate]);

  // For the cta centre orb, use a wrapper div for translate(-50%,-50%) to
  // avoid conflicting with framer-motion's y MotionValue on the same element.
  if (isCtaCenter) {
    return (
      <div style={{
        position: 'absolute',
        top: orb.top,
        left: orb.left,
        right: orb.right,
        bottom: orb.bottom,
        transform: 'translate(-50%, -50%)',
      }}>
        <motion.div
          className={`orb ${orb.cls}`}
          style={{
            position: 'relative',
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            y,
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className={`orb ${orb.cls}`}
      style={{
        width: orb.size,
        height: orb.size,
        background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
        top: orb.top,
        left: orb.left,
        right: orb.right,
        bottom: orb.bottom,
        y,
      }}
    />
  );
}
