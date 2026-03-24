'use client';

import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';

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
  const accent  = accentColor ?? 'var(--division-accent)';
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
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

  const fullOrbs = sets[variant] ?? sets.default;

  // On mobile: use only the first orb, shrunk to 60% size — less GPU load
  const orbs = isMobile ? [{ ...fullOrbs[0], size: Math.round(fullOrbs[0].size * 0.6) }] : fullOrbs;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      // CSS containment prevents orb repaints from triggering ancestor layout
      style={{ contain: 'layout style paint' }}
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <OrbElement
          key={i}
          orb={orb}
          isCtaCenter={variant === 'cta' && i === 0}
          scrollY={scrollY}
          reduced={reduced ?? false}
          isMobile={isMobile}
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
  isMobile,
}: {
  orb: OrbDef;
  isCtaCenter: boolean;
  scrollY: ReturnType<typeof useScroll>['scrollY'];
  reduced: boolean;
  isMobile: boolean;
}) {
  const rate = orb.parallaxRate ?? 0.3;
  // Disable parallax entirely on mobile — saves useTransform recalc every scroll tick
  const y = useTransform(scrollY, [0, 1000], [0, (reduced || isMobile) ? 0 : 1000 * rate]);

  // Smaller blur radius on mobile to reduce GPU compositing cost
  const blurPx = isMobile ? 60 : 100;

  const baseStyle = {
    width:   orb.size,
    height:  orb.size,
    background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
    filter:  `blur(${blurPx}px)`,
    opacity: 0.45,
  };

  if (isCtaCenter) {
    return (
      <div style={{
        position: 'absolute',
        top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
        transform: 'translate(-50%, -50%)',
      }}>
        <motion.div
          className={`orb ${orb.cls}`}
          style={{ position: 'relative', ...baseStyle, y }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className={`orb ${orb.cls}`}
      style={{
        ...baseStyle,
        top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
        y,
      }}
    />
  );
}
