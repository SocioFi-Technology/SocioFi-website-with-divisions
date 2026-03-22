'use client';

import { useEffect, useState } from 'react';
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
  const [navHeight, setNavHeight] = useState(68);

  useEffect(() => {
    const measure = () => {
      const nav = document.querySelector('header.nav') as HTMLElement | null;
      if (nav) setNavHeight(nav.getBoundingClientRect().height);
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
    <div
      className="about-subnav"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-2)',
        position: 'sticky',
        top: navHeight,
        zIndex: 40,
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
  );
}
