/**
 * Shared motion primitives — import from here instead of hard-coding inline.
 *
 * Usage in a client component:
 *   import { EASE, fadeUp, transitionPreset } from '@/lib/motion';
 *   <motion.div variants={fadeUp} transition={transitionPreset(0.7, 0.1)} />
 *
 * ScrollReveal / StaggerChildren already bake these in — use those components
 * for standard scroll reveals. These primitives are for one-off animations where
 * you need finer control (hero entrances, modal transitions, etc.).
 */

// ── Easing curves ─────────────────────────────────────────────────────────────
/** Primary ease — smooth deceleration. Matches --ease CSS variable. */
export const EASE        = [0.16, 1, 0.3, 1]     as const;
/** Spring ease — slight overshoot. Matches --ease-spring CSS variable. */
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;
/** Fast-out ease. Matches --ease-out CSS variable. */
export const EASE_OUT    = [0, 0, 0.2, 1]         as const;

// ── Variant presets ───────────────────────────────────────────────────────────
/** Fade + translateY(24px) → visible. Standard scroll-reveal. */
export const fadeUp: MotionVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0  },
};

/** Mobile-optimised version — shorter travel distance. */
export const fadeUpMobile: MotionVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0  },
};

/** Pure opacity fade — safest, no layout shift. */
export const fadeIn: MotionVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

/** Scale + fade — for cards, modals, tooltips. */
export const scaleIn: MotionVariants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1    },
};

/** Slide in from left. */
export const slideLeft: MotionVariants = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0  },
};

/** Slide in from right. */
export const slideRight: MotionVariants = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1,  x: 0  },
};

// ── Stagger container ─────────────────────────────────────────────────────────
/**
 * Stagger parent variants. Pair with child variants (e.g. fadeUp):
 *   <motion.ul variants={staggerContainer(0.1, 0.2)}>
 *     <motion.li variants={fadeUp}>…</motion.li>
 *   </motion.ul>
 */
export function staggerContainer(stagger = 0.1, delay = 0): MotionVariants {
  return {
    hidden:  {},
    visible: {
      transition: { delayChildren: delay, staggerChildren: stagger },
    },
  };
}

// ── Transition helpers ────────────────────────────────────────────────────────
/**
 * Returns a Framer Motion transition object.
 * @param duration  seconds (default 0.7)
 * @param delay     seconds (default 0)
 * @param easing    defaults to EASE
 */
export function transitionPreset(
  duration = 0.7,
  delay    = 0,
  easing: readonly number[] = EASE,
) {
  return { duration, delay, ease: easing } as const;
}

/** Reduced-motion safe transition — fast fade only. */
export const transitionReduced = { duration: 0.15, ease: EASE_OUT } as const;

// ── Internal type ─────────────────────────────────────────────────────────────
type MotionVariants = Record<string, Record<string, unknown>>;
