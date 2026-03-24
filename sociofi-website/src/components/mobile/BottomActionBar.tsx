'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface BottomActionBarProps {
  label: string;
  href: string;
  accentColor?: string;
}

const STYLES = `
  .bab-wrap {
    position: fixed; bottom: 0; left: 0; right: 0;
    padding: 12px 20px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
    background: var(--bg);
    border-top: 1px solid var(--border);
    z-index: 899;
    transform: translateY(100%);
    animation: babSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) 2s forwards;
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .bab-wrap.bab-hidden {
    transform: translateY(100%) !important;
    animation: none !important;
  }
  @keyframes babSlideUp {
    to { transform: translateY(0); }
  }
  .bab-btn {
    display: flex; align-items: center; justify-content: center;
    width: 100%; min-height: 52px; border-radius: 12px;
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 0.95rem; font-weight: 700;
    color: white; text-decoration: none;
    background: linear-gradient(135deg, var(--navy, #3A589E), var(--division-accent, var(--teal, #59A392)));
    box-shadow: 0 4px 20px rgba(58,88,158,0.3);
    letter-spacing: -0.01em; gap: 8px;
    transition: opacity 0.2s, transform 0.1s;
  }
  .bab-btn:active { opacity: 0.88; transform: scale(0.98); }
`;

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BottomActionBar({ label, href, accentColor }: BottomActionBarProps) {
  const [hidden, setHidden] = useState(false);
  const ctaRef = useRef<Element | null>(null);

  useEffect(() => {
    // Find the page CTA section — hide bottom bar when it's visible
    ctaRef.current = document.querySelector('[data-cta-section]');
    if (!ctaRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  // Publish bar height as a CSS variable so PILOTChat can offset its button
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bab-height', hidden ? '0px' : '76px');
    return () => { root.style.removeProperty('--bab-height'); };
  }, [hidden]);

  return (
    <>
      <style>{STYLES}</style>
      <div
        className={`bab-wrap${hidden ? ' bab-hidden' : ''}`}
        style={accentColor ? ({ '--division-accent': accentColor } as React.CSSProperties) : undefined}
      >
        <Link href={href} className="bab-btn">
          {label}
          <ArrowRight />
        </Link>
      </div>
    </>
  );
}
