'use client';

import { useEffect, useState, useRef } from 'react';
import Container from '@/components/shared/Container';

const SUBPAGES = [
  { label: 'Overview', href: '/about' },
  { label: 'Full Team', href: '/about/team' },
  { label: 'Our Story', href: '/about/story' },
  { label: 'Values', href: '/about/values' },
  { label: 'Timeline', href: '/about/timeline' },
  { label: 'Press Kit', href: '/about/press' },
];

export default function AboutSubNav({ active }: { active: string }) {
  // Track the nav's bottom edge in the viewport (drops to 0 as nav hides on scroll)
  const [navBottom, setNavBottom] = useState(68);
  // Track this bar's own height so we can add an equivalent spacer
  const [barHeight, setBarHeight] = useState(44);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      const nav = document.querySelector('header.nav') as HTMLElement | null;
      if (nav) {
        // .bottom gives the actual viewport position including CSS transforms
        const bottom = nav.getBoundingClientRect().bottom;
        setNavBottom(Math.max(0, bottom));
      }
      if (barRef.current) {
        setBarHeight(barRef.current.getBoundingClientRect().height);
      }
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <>
      {/* Fixed bar — follows nav as it slides in/out */}
      <div
        ref={barRef}
        className="about-subnav"
        style={{
          position: 'fixed',
          top: navBottom,
          left: 0,
          right: 0,
          zIndex: 40,
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-2)',
          transition: 'top 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Container>
          <div className="about-subnav-list">
            {SUBPAGES.map((p) => {
              const isActive = p.href === active;
              return (
                <a
                  key={p.href}
                  href={p.href}
                  className={`about-subnav-link${isActive ? ' active' : ''}`}
                >
                  {p.label}
                </a>
              );
            })}
          </div>
        </Container>
      </div>

      {/* Spacer — keeps page content from hiding behind the fixed bar */}
      <div style={{ height: barHeight }} aria-hidden="true" />
    </>
  );
}
