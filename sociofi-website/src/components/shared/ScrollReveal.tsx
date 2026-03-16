'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

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
      hidden: { opacity: 0 },
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
    hidden: { opacity: 0, ...translate[direction] },
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
  const reduced = useReducedMotion() ?? false;
  const variants = getVariants(direction, distance, reduced);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      variants={variants}
      transition={{
        duration: reduced ? 0.15 : duration,
        delay: reduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
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
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: reduced ? 0 : delay,
            staggerChildren: reduced ? 0 : stagger,
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
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
}) {
  const reduced = useReducedMotion() ?? false;
  const variants = getVariants(direction, 24, reduced);

  return (
    <motion.div
      variants={variants}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
