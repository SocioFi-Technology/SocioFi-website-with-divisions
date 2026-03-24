'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  /** Distance in px for translate animations */
  distance?: number;
  /** Once: animate once (default). False: re-animate on re-entry. */
  once?: boolean;
}

function getVariants(direction: Direction, distance: number, reduced: boolean) {
  if (reduced) {
    return {
      hidden:  { opacity: 0 },
      visible: { opacity: 1 },
    };
  }

  const translate: Record<Direction, { x?: number; y?: number; scale?: number }> = {
    up:    { y: distance },
    down:  { y: -distance },
    left:  { x: distance },
    right: { x: -distance },
    scale: { scale: 0.94 },
    fade:  {},
  };

  return {
    hidden:  { opacity: 0, ...translate[direction] },
    visible: { opacity: 1, x: 0, y: 0, scale: 1 },
  };
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  className = '',
  distance = 30,
  once = true,
}: ScrollRevealProps) {
  const reduced  = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  // On mobile: shorter travel distance (less jank), faster duration (snappier),
  // and a slightly higher viewport threshold so the animation only fires when
  // the element is meaningfully visible — avoids triggering too early on narrow screens.
  const effectiveDistance = isMobile ? Math.min(distance, 16) : distance;
  const effectiveDuration = isMobile ? Math.min(duration, 0.5) : duration;
  const viewportAmount   = isMobile ? 0.2 : 0.15;

  const variants = getVariants(direction, effectiveDistance, reduced);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: viewportAmount }}
      variants={variants}
      transition={{
        duration: reduced ? 0.15 : effectiveDuration,
        delay:    reduced ? 0    : delay,
        ease:     [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger container helper ──────────────────────────────────────────────────

interface StaggerProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
}

export function StaggerChildren({ children, stagger = 0.1, delay = 0, className = '' }: StaggerProps) {
  const reduced  = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  // Tighter stagger on mobile: avoids long waits when there are many children
  const effectiveStagger = isMobile ? Math.min(stagger, 0.06) : stagger;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: isMobile ? 0.1 : 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren:  reduced ? 0 : delay,
            staggerChildren: reduced ? 0 : effectiveStagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
  direction = 'up',
  withScale = false,
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  /** Combine translateY with a slight scale-in (0.97→1) for headlines */
  withScale?: boolean;
}) {
  const reduced  = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  // Shorter travel on mobile
  const distance = isMobile ? 14 : 24;
  const variants = getVariants(direction, distance, reduced);

  const scaledVariants = withScale && !reduced ? {
    hidden:  { ...variants.hidden,  scale: 0.97 },
    visible: { ...variants.visible, scale: 1 },
  } : variants;

  return (
    <motion.div
      variants={scaledVariants}
      transition={{ duration: isMobile ? 0.45 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
