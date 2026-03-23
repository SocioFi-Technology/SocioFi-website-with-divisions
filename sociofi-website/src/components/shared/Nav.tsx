'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/shared/Logo';
import ThemeToggle from '@/components/shared/ThemeToggle';
import Button from '@/components/shared/Button';
import MobileNav from '@/components/mobile/MobileNav';
import { divisions } from '@/lib/divisions';
import type { Division, NavLink } from '@/lib/divisions';
import { ChevronDown, Menu } from '@/lib/icons';
import { useScrollDirection } from '@/hooks/useScrollDirection';

interface NavProps {
  division?: Division;
}

export default function Nav({ division }: NavProps) {
  const ctx = division ?? divisions.technology;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { navVisible } = useScrollDirection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const openDrop = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };

  const closeDrop = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    // Fragment needed: MobileNav must be a SIBLING of motion.header, not a child.
    // motion.header applies CSS transform (for hide-on-scroll), and CSS transforms
    // on an ancestor create a new containing block for position:fixed children —
    // the MobileNav overlay would be clipped to the nav bar instead of the viewport.
    <>
    <motion.header
      className={`nav${scrolled ? ' scrolled' : ''}`}
      role="banner"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: navVisible ? 0 : -100, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)' }}
    >
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}>

          {/* Logo */}
          <Logo
            division={ctx.slug}
            size="md"
            showWordmark
            href={ctx.url}
          />

          {/* Desktop nav links */}
          <nav
            aria-label="Main navigation"
            className="show-desktop nav-links-desktop"
            style={{ alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}
          >
            {ctx.navLinks.map((link) => (
              <DesktopNavItem
                key={link.label}
                link={link}
                isActive={isActive}
                openDropdown={openDropdown}
                openDrop={openDrop}
                closeDrop={closeDrop}
                accent={ctx.accent}
              />
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <ThemeToggle />

            {/* CTA button — desktop only */}
            {ctx.cta && (
              <div className="show-desktop-block" style={{ display: 'none' }}>
                <Button
                  href={ctx.cta.href}
                  variant="primary"
                  size="sm"
                  accentColor={ctx.accent}
                >
                  {ctx.cta.label}
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

    </motion.header>

    {/* MobileNav is a sibling of motion.header — NOT inside it.
        If rendered inside, the header's CSS transform (hide-on-scroll)
        would make position:fixed resolve to the header box, not the viewport. */}
    <MobileNav
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      division={division}
      currentPath={pathname}
    />
    </>
  );
}

// ── Desktop nav item with dropdown ──────────────────────────────────────────

function DesktopNavItem({
  link,
  isActive,
  openDropdown,
  openDrop,
  closeDrop,
  accent,
}: {
  link: NavLink;
  isActive: (href: string) => boolean;
  openDropdown: string | null;
  openDrop: (label: string) => void;
  closeDrop: () => void;
  accent: string;
}) {
  const active = isActive(link.href);
  const isOpen = openDropdown === link.label;

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => link.dropdown && openDrop(link.label)}
      onMouseLeave={() => link.dropdown && closeDrop()}
    >
      <Link
        href={link.href}
        className="nav-link"
        aria-current={active ? 'page' : undefined}
        aria-haspopup={link.dropdown ? 'true' : undefined}
        aria-expanded={link.dropdown ? isOpen : undefined}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '8px 12px',
        }}
      >
        {link.label}
        {link.dropdown && (
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'inline-flex', color: 'var(--text-muted)' }}
            aria-hidden="true"
          >
            <ChevronDown size={13} strokeWidth={1.8} />
          </motion.span>
        )}
      </Link>

      {/* Dropdown panel */}
      <AnimatePresence>
        {link.dropdown && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => openDrop(link.label)}
            onMouseLeave={() => closeDrop()}
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              left: '50%',
              transform: 'translateX(-50%)',
              minWidth: 240,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              overflow: 'hidden',
              zIndex: 200,
              padding: 8,
            }}
          >
            {/* Decorative top accent */}
            <div style={{
              height: 2,
              background: `linear-gradient(90deg, transparent, ${accent}66, transparent)`,
              margin: '-8px -8px 8px',
            }} />

            {link.dropdown.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'block',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.15s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: item.description ? 3 : 0,
                  letterSpacing: '-0.01em',
                }}>
                  {item.label}
                </div>
                {item.description && (
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.77rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.45,
                  }}>
                    {item.description}
                  </div>
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

