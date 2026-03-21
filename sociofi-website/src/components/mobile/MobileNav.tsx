'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LogoMark } from '@/components/shared/Logo';
import type { Division } from '@/lib/divisions';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  division?: Division;
  currentPath?: string;
}

// Division pills data
const DIVISION_PILLS = [
  { name: 'Studio',   href: '/studio',   slug: 'studio'   },
  { name: 'Agents',   href: '/agents',   slug: 'agents'   },
  { name: 'Services', href: '/services', slug: 'services' },
  { name: 'Cloud',    href: '/cloud',    slug: 'cloud'    },
  { name: 'Labs',     href: '/labs',     slug: 'labs'     },
  { name: 'Products', href: '/products', slug: 'products' },
  { name: 'Academy',  href: '/academy',  slug: 'academy'  },
  { name: 'Ventures', href: '/ventures', slug: 'ventures' },
];

// Parent nav links (used when no division context)
const PARENT_LINKS = [
  { label: 'Studio', href: '/studio' },
  { label: 'Agents', href: '/agents' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

const STYLES = `
  .mnav-overlay {
    position: fixed; inset: 0; z-index: 999;
    background: var(--bg);
    display: flex; flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .mnav-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .mnav-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none;
  }
  .mnav-wordmark {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 1rem; font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }
  .mnav-close {
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: none; cursor: pointer;
    color: var(--text-primary); border-radius: 8px;
    transition: background 0.15s;
  }
  .mnav-close:active { background: var(--bg-2); }
  .mnav-body {
    flex: 1; padding: 16px 20px 0;
    display: flex; flex-direction: column; gap: 0;
  }
  .mnav-back {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.72rem; font-weight: 500;
    color: var(--text-muted); letter-spacing: 0.06em;
    text-decoration: none; text-transform: uppercase;
    padding: 8px 0; margin-bottom: 8px;
  }
  .mnav-link {
    display: flex; align-items: center;
    width: 100%; padding: 16px 0;
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 1.2rem; font-weight: 700;
    color: var(--text-primary); text-decoration: none;
    border-bottom: 1px solid var(--border);
    letter-spacing: -0.01em;
    min-height: 56px;
    transition: color 0.2s;
  }
  .mnav-link:active { color: var(--teal-light, #72C4B2); }
  .mnav-link.active { color: var(--division-accent, var(--teal, #59A392)); }
  .mnav-cta {
    display: flex; align-items: center; justify-content: center;
    width: 100%; margin-top: 16px; padding: 16px;
    min-height: 56px; border-radius: 12px;
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 0.95rem; font-weight: 700;
    color: white; text-decoration: none;
    background: linear-gradient(135deg, var(--navy, #3A589E), var(--division-accent, var(--teal, #59A392)));
    letter-spacing: -0.01em;
    transition: opacity 0.2s;
  }
  .mnav-cta:active { opacity: 0.85; }
  .mnav-section-label {
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.62rem; font-weight: 500;
    color: var(--text-muted); letter-spacing: 0.12em;
    text-transform: uppercase; margin-top: 24px; margin-bottom: 12px;
  }
  .mnav-pills {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;
    margin-bottom: 8px;
  }
  .mnav-pill {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 14px; min-height: 48px;
    background: var(--bg-2); border: 1px solid var(--border);
    border-radius: 10px; text-decoration: none;
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-size: 0.85rem; font-weight: 500;
    color: var(--text-secondary);
    transition: border-color 0.2s;
  }
  .mnav-pill:active { border-color: var(--border-hover); }
  .mnav-footer {
    padding: 20px; border-top: 1px solid var(--border);
    margin-top: 24px; flex-shrink: 0;
  }
  .mnav-contact-link {
    display: flex; align-items: center;
    padding: 10px 0;
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-size: 0.85rem; color: var(--text-muted);
    text-decoration: none; min-height: 44px;
  }
`;

const overlayVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const linkVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      delay: 0.05 + i * 0.05,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

function ChevronMark({ color = '#59A392', size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8 8L16 16L8 24" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 8L24 16L16 24" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MobileNav({ open, onClose, division, currentPath = '' }: MobileNavProps) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on back button
  useEffect(() => {
    if (!open) return;
    const handler = () => onClose();
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [open, onClose]);

  const divisionLinks = division?.navLinks ?? [];
  const ctaLabel = division?.cta?.label ?? 'Talk to Us';
  const ctaHref = division?.cta?.href ?? '/contact';
  const accentColor = division?.accent ?? '#59A392';

  const primaryLinks = division ? divisionLinks : PARENT_LINKS;

  return (
    <>
      <style>{STYLES}</style>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mnav-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="mnav-header">
              <Link href="/" className="mnav-logo" onClick={onClose}>
                <ChevronMark color={accentColor} size={28} />
                <span className="mnav-wordmark">SocioFi</span>
              </Link>
              <button className="mnav-close" onClick={onClose} aria-label="Close menu">
                <XIcon />
              </button>
            </div>

            {/* Body */}
            <div className="mnav-body">
              {/* Back to parent link for division pages */}
              {division && (
                <motion.div
                  variants={linkVariants}
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link href="/" className="mnav-back" onClick={onClose}>
                    <ArrowLeftIcon />
                    SocioFi Technology
                  </Link>
                </motion.div>
              )}

              {/* Primary nav links */}
              {primaryLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  variants={linkVariants}
                  custom={i + (division ? 1 : 0)}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link
                    href={link.href}
                    className={`mnav-link${currentPath === link.href ? ' active' : ''}`}
                    onClick={onClose}
                    style={currentPath === link.href ? { color: accentColor } : undefined}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Primary CTA button */}
              <motion.div
                variants={linkVariants}
                custom={primaryLinks.length + (division ? 1 : 0) + 1}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Link
                  href={ctaHref}
                  className="mnav-cta"
                  onClick={onClose}
                  style={{ '--division-accent': accentColor } as React.CSSProperties}
                >
                  {ctaLabel}
                </Link>
              </motion.div>

              {/* Division pills */}
              <div className="mnav-section-label">Divisions</div>
              <div className="mnav-pills">
                {DIVISION_PILLS.map((pill, i) => (
                  <motion.div
                    key={pill.href}
                    variants={linkVariants}
                    custom={primaryLinks.length + (division ? 1 : 0) + 3 + i}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Link href={pill.href} className="mnav-pill" onClick={onClose}>
                      <LogoMark division={pill.slug} size="xs" />
                      {pill.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mnav-footer">
              <a href="mailto:hello@sociofitechnology.com" className="mnav-contact-link">
                hello@sociofitechnology.com
              </a>
              <a href="tel:+8801700000000" className="mnav-contact-link">
                Call us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
