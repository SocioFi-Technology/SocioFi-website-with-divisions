'use client';

import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';

export default function AnimatedGrid() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  // Scroll-linked translateY at 0.1x scroll speed — adds subtle parallax depth
  const y = useTransform(scrollY, [0, 1000], [0, reduced ? 0 : 100]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 animate-grid-drift"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 0%, black 40%, transparent 100%)',
          y,
        }}
      />
    </div>
  );
}
