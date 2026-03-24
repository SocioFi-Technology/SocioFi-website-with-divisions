'use client';

import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// ── Timing ────────────────────────────────────────────────────────────────────
// NOTE: DO NOT read window.innerWidth at module level — that runs during SSR
// where `window` is undefined, and also captures the width only once (stale).
// Mobile detection is done inside useEffect where window is always available.
const FIRST_LOAD_DESKTOP_MS = 3200;
const FIRST_LOAD_MOBILE_MS  = 1500;  // 1.5s on mobile — skip character stagger
const TRANSITION_DESKTOP_MS = 1400;
const TRANSITION_MOBILE_MS  =  600;  // 0.6s transition on mobile — feels snappy
const EXIT_MS = 500;

// ── Division helpers ──────────────────────────────────────────────────────────
const TOP_DIVISIONS = ['studio', 'services', 'labs', 'products', 'academy', 'ventures', 'cloud'];

function getDivision(path: string): string {
  if (path === '/' || path === '') return '__home__';
  const first = path.replace(/^\//, '').split('/')[0] ?? '';
  return TOP_DIVISIONS.includes(first) ? first : '__parent__';
}

// /about/* ↔ /about/* navigations never trigger a loading screen
function isAboutPath(path: string) {
  return /^\/about(\/|$)/.test(path);
}

// ── Wordmark chars ────────────────────────────────────────────────────────────
const SOCIOFI_CHARS    = 'SocioFi'.split('');
const TECHNOLOGY_CHARS = 'Technology'.split('');

// ── Component ─────────────────────────────────────────────────────────────────
export default function LoadingScreen() {
  const pathname = usePathname();

  // 'full'       → logo draw + wordmark stagger + tagline + progress bar
  // 'transition' → logo draw + static wordmark + progress bar
  const [mode,          setMode]         = useState<'full' | 'transition'>('full');
  const [visible,       setVisible]      = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  // isMobile is resolved in useEffect (window is available there, not at module level)
  const [isMobile,      setIsMobile]     = useState(false);

  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathnameRef = useRef(pathname);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

  // ── 1. First page load (mount only) ──────────────────────────────────────
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    const done = () => {
      (window as any).__sfLoadingDone = true;
      window.dispatchEvent(new CustomEvent('loading-done'));
      setVisible(false);
    };

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReducedMotion(true);
      timerRef.current = setTimeout(done, 400);
    } else {
      const holdMs = mobile ? FIRST_LOAD_MOBILE_MS : FIRST_LOAD_DESKTOP_MS;
      timerRef.current = setTimeout(done, holdMs);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 2. Intercept link clicks → show transition screen BEFORE navigation ──
  //
  // We use the CAPTURE phase so our handler fires before Next.js handles the
  // click. flushSync forces React to commit the loading-screen DOM update
  // synchronously, so the overlay is painted in the SAME browser frame as the
  // click — the user never sees a flash of the new page.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href') ?? '';
      // Skip: external links, hashes, mailto, tel
      if (!href || !href.startsWith('/') || href.startsWith('//')) return;

      const currentPath = pathnameRef.current;
      const currentDiv  = getDivision(currentPath);
      const targetDiv   = getDivision(href);

      // Skip: within /about/* tab navigation
      if (isAboutPath(currentPath) && isAboutPath(href)) return;

      // Show transition screen when division changes (includes to/from homepage)
      if (currentDiv !== targetDiv) {
        if (timerRef.current) clearTimeout(timerRef.current);

        // flushSync: render the loading screen synchronously before Next.js
        // finishes processing the navigation, so there is no content flash.
        flushSync(() => {
          setMode('transition');
          setVisible(true);
        });

        const transitionMs = window.innerWidth < 768
          ? TRANSITION_MOBILE_MS
          : TRANSITION_DESKTOP_MS;

        timerRef.current = setTimeout(() => {
          setVisible(false);
        }, transitionMs);
      }
    };

    // Capture phase = fires before the element's own handlers
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []); // stable — reads pathname via ref

  const holdMs = mode === 'full'
    ? (isMobile ? FIRST_LOAD_MOBILE_MS  : FIRST_LOAD_DESKTOP_MS)
    : (isMobile ? TRANSITION_MOBILE_MS  : TRANSITION_DESKTOP_MS);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`loading-${mode}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: EXIT_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#0C0C1D',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            // Prevent the background page from scrolling on touch while overlay is up
            touchAction: 'none',
          }}
          aria-label="Loading SocioFi Technology"
          role="progressbar"
          aria-busy="true"
        >
          {/* ── Background orbs ──────────────────────────────────────────────── */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: mode === 'full' ? 1.2 : 0.5, delay: 0.05 }}
            style={{
              position: 'absolute', top: '20%', left: '50%',
              transform: 'translateX(-50%)',
              width: 600, height: 600, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(89,163,146,0.07) 0%, transparent 65%)',
              pointerEvents: 'none', filter: 'blur(40px)',
            }}
          />
          {mode === 'full' && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.3 }}
              style={{
                position: 'absolute', bottom: '25%', right: '30%',
                width: 320, height: 320, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(58,88,158,0.08) 0%, transparent 65%)',
                pointerEvents: 'none', filter: 'blur(40px)',
              }}
            />
          )}

          {/* ── Logo + wordmark ───────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

            {/* Chevron logo mark */}
            <div style={{ position: 'relative', width: 96, height: 96 }}>
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: mode === 'full' ? 0.7 : 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  position: 'absolute', inset: -20, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(89,163,146,0.2) 0%, transparent 70%)',
                  filter: 'blur(10px)', pointerEvents: 'none',
                }}
              />
              <svg viewBox="0 0 48 48" fill="none" width={96} height={96} aria-hidden="true">
                <motion.path
                  d="M10 12 L22 24 L10 36"
                  stroke="#4A6CB8" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round" fill="none"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.55, delay: mode === 'full' ? 0.15 : 0.05, ease: [0.16, 1, 0.3, 1] },
                    opacity:    { duration: 0.1,  delay: mode === 'full' ? 0.15 : 0.05 },
                  }}
                />
                <motion.path
                  d="M20 12 L32 24 L20 36"
                  stroke="#72C4B2" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round" fill="none"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.55, delay: mode === 'full' ? 0.38 : 0.22, ease: [0.16, 1, 0.3, 1] },
                    opacity:    { duration: 0.1,  delay: mode === 'full' ? 0.38 : 0.22 },
                  }}
                />
              </svg>
            </div>

            {/* Full mode — animated character-by-character wordmark (desktop only).
                On mobile use the instant static wordmark to keep the intro snappy. */}
            {mode === 'full' && !isMobile && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', overflow: 'hidden', paddingBottom: 2 }}>
                  {SOCIOFI_CHARS.map((char, i) => (
                    <motion.span key={i}
                      initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.85 + i * 0.055, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        fontFamily: 'var(--font-syne, "Syne", sans-serif)',
                        fontWeight: 800, fontSize: '2rem',
                        color: '#FFFFFF', letterSpacing: '-0.03em',
                        lineHeight: 1, display: 'inline-block',
                      }}
                    >{char}</motion.span>
                  ))}
                </div>
                <div style={{ display: 'flex', overflow: 'hidden' }}>
                  {TECHNOLOGY_CHARS.map((char, i) => (
                    <motion.span key={i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 1.35 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        fontFamily: 'var(--font-fira, "Fira Code", monospace)',
                        fontWeight: 500, fontSize: '0.62rem',
                        color: '#72C4B2', letterSpacing: '0.18em',
                        textTransform: 'uppercase', lineHeight: 1, display: 'inline-block',
                      }}
                    >{char}</motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Transition mode OR mobile full mode — instant static wordmark */}
            {(mode === 'transition' || isMobile) && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
              >
                <span style={{
                  fontFamily: 'var(--font-syne, "Syne", sans-serif)',
                  fontWeight: 800, fontSize: '1.7rem',
                  color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1,
                }}>SocioFi</span>
                <span style={{
                  fontFamily: 'var(--font-fira, "Fira Code", monospace)',
                  fontWeight: 500, fontSize: '0.58rem',
                  color: '#72C4B2', letterSpacing: '0.18em',
                  textTransform: 'uppercase', lineHeight: 1,
                }}>Technology</span>
              </motion.div>
            )}

            {/* Tagline — full mode only */}
            {mode === 'full' && !reducedMotion && (
              <motion.p
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-fira, "Fira Code", monospace)',
                  fontSize: '0.68rem', color: 'rgba(160,180,220,0.9)',
                  letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0,
                }}
              >
                AI-Native Development: Human Verified
              </motion.p>
            )}
          </div>

          {/* ── Progress bar ──────────────────────────────────────────────────── */}
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 2, background: 'rgba(89,163,146,0.08)',
          }}>
            <motion.div
              initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: holdMs / 1000 - 0.1, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #3A589E 0%, #59A392 60%, #72C4B2 100%)',
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* ── Animated dots — full mode only ────────────────────────────────── */}
          {mode === 'full' && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.3 }}
              style={{ position: 'absolute', bottom: 32, display: 'flex', gap: 6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, delay: 1.3 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ display: 'block', width: 4, height: 4, borderRadius: '50%', background: '#59A392' }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
