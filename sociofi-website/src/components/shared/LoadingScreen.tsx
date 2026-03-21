'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Total duration before exit begins (ms)
const HOLD_MS = 3200;
// Exit fade duration (ms)
const EXIT_MS = 500;

const SOCIOFI_CHARS = 'SocioFi'.split('');
const TECHNOLOGY_CHARS = 'Technology'.split('');

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion — skip animation, show briefly then exit
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReducedMotion(true);
      const t = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      // Signal hero animations to start (Option B)
      if (typeof window !== 'undefined') {
        (window as any).__sfLoadingDone = true;
        window.dispatchEvent(new CustomEvent('loading-done'));
      }
      setVisible(false);
    }, HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  if (reducedMotion && !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: EXIT_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#0C0C1D',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          aria-label="Loading SocioFi Technology"
          role="progressbar"
          aria-busy="true"
        >
          {/* ── Background orbs ────────────────────────────────────────────── */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.1 }}
            style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(89,163,146,0.07) 0%, transparent 65%)',
              pointerEvents: 'none',
              filter: 'blur(40px)',
            }}
          />
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.3 }}
            style={{
              position: 'absolute',
              bottom: '25%',
              right: '30%',
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(58,88,158,0.08) 0%, transparent 65%)',
              pointerEvents: 'none',
              filter: 'blur(40px)',
            }}
          />

          {/* ── Logo mark ──────────────────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
            }}
          >
            {/* SVG logo with draw-on animation */}
            <div style={{ position: 'relative', width: 96, height: 96 }}>
              {/* Glow behind the chevrons */}
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  position: 'absolute',
                  inset: -20,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(89,163,146,0.2) 0%, transparent 70%)',
                  filter: 'blur(10px)',
                  pointerEvents: 'none',
                }}
              />

              <svg
                viewBox="0 0 48 48"
                fill="none"
                width={96}
                height={96}
                aria-hidden="true"
              >
                {/* Left chevron — navy blue */}
                <motion.path
                  d="M10 12 L22 24 L10 36"
                  stroke="#4A6CB8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.1, delay: 0.15 },
                  }}
                />
                {/* Right chevron — teal */}
                <motion.path
                  d="M20 12 L32 24 L20 36"
                  stroke="#72C4B2"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.6, delay: 0.38, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.1, delay: 0.38 },
                  }}
                />
              </svg>
            </div>

            {/* Wordmark — per-character stagger */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              {/* "SocioFi" — each character animates in */}
              <div
                style={{
                  display: 'flex',
                  overflow: 'hidden',
                  paddingBottom: 2,
                }}
              >
                {SOCIOFI_CHARS.map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.85 + i * 0.055,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      fontFamily: 'var(--font-syne, "Syne", sans-serif)',
                      fontWeight: 800,
                      fontSize: '2rem',
                      color: '#FFFFFF',
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                      display: 'inline-block',
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* "Technology" — characters stagger in with letter-spacing expand */}
              <div
                style={{
                  display: 'flex',
                  overflow: 'hidden',
                }}
              >
                {TECHNOLOGY_CHARS.map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 1.35 + i * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      fontFamily: 'var(--font-fira, "Fira Code", monospace)',
                      fontWeight: 500,
                      fontSize: '0.62rem',
                      color: '#72C4B2',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                      display: 'inline-block',
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-fira, "Fira Code", monospace)',
                fontSize: '0.68rem',
                color: 'rgba(160,180,220,0.9)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              AI-Native Development: Human Verified
            </motion.p>
          </div>

          {/* ── Progress bar ───────────────────────────────────────────────── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'rgba(89,163,146,0.08)',
            }}
          >
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: HOLD_MS / 1000 - 0.1,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #3A589E 0%, #59A392 60%, #72C4B2 100%)',
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* ── Animated dots ──────────────────────────────────────────────── */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.3 }}
            style={{
              position: 'absolute',
              bottom: 32,
              display: 'flex',
              gap: 6,
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.2,
                  delay: 1.3 + i * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  display: 'block',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#59A392',
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
