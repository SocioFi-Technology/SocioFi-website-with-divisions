'use client';

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface MagneticTiltProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt angle in degrees (default: 4) */
  maxAngle?: number;
}

/**
 * Wraps children with a cursor-following magnetic tilt effect.
 * Max 4deg rotation. Disabled for reduced-motion and mobile.
 * Used on division overview cards.
 */
export default function MagneticTilt({
  children,
  className = '',
  maxAngle = 4,
}: MagneticTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Normalised cursor position: -0.5 to +0.5
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 };
  const rotateX = useSpring(
    useTransform(cursorY, [-0.5, 0.5], [maxAngle, -maxAngle]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(cursorX, [-0.5, 0.5], [-maxAngle, maxAngle]),
    springConfig,
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    cursorX.set((e.clientX - left) / width - 0.5);
    cursorY.set((e.clientY - top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    cursorX.set(0);
    cursorY.set(0);
  };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
