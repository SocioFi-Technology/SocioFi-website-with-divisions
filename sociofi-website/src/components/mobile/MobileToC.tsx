'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TocItem {
  id: string;
  label: string;
  level?: number;
}

interface MobileToCProps {
  items: TocItem[];
  accentColor?: string;
}

const STYLES = `
  .mtoc-wrap {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 14px;
    margin-bottom: 32px;
    overflow: hidden;
  }
  .mtoc-trigger {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 16px 18px; min-height: 52px;
    background: transparent; border: none; cursor: pointer;
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 0.9rem; font-weight: 700;
    color: var(--text-primary); text-align: left;
  }
  .mtoc-chevron { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); flex-shrink: 0; }
  .mtoc-chevron.open { transform: rotate(180deg); }
  .mtoc-list { padding: 0 18px 14px; display: flex; flex-direction: column; gap: 2px; }
  .mtoc-item {
    display: block; padding: 10px 0;
    min-height: 44px; display: flex; align-items: center;
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-size: 0.88rem; color: var(--text-secondary);
    text-decoration: none; border-bottom: 1px solid var(--border);
    transition: color 0.2s;
  }
  .mtoc-item:last-child { border-bottom: none; }
  .mtoc-item.active { color: var(--division-accent, var(--teal, #59A392)); font-weight: 600; }
  .mtoc-item:active { color: var(--division-accent, var(--teal, #59A392)); }
  .mtoc-current {
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.68rem; color: var(--text-muted); margin-left: auto; padding-left: 12px;
    flex-shrink: 0; white-space: nowrap;
  }
`;

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4.5 6.75L9 11.25l4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2C8 2 5 1 2 2v11c3-1 6 0 6 0V2zM8 2c0 0 3-1 6 0v11c-3-1-6 0-6 0V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export default function MobileToC({ items, accentColor }: MobileToCProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setOpen(false);
    }
  };

  const currentItem = items.find((i) => i.id === activeId);

  return (
    <>
      <style>{STYLES}</style>
      <div
        className="mtoc-wrap"
        style={accentColor ? { '--division-accent': accentColor } as React.CSSProperties : undefined}
      >
        <button
          className="mtoc-trigger"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookIcon />
            Table of Contents
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!open && currentItem && (
              <span className="mtoc-current">{currentItem.label}</span>
            )}
            <span className={`mtoc-chevron${open ? ' open' : ''}`}>
              <ChevronIcon />
            </span>
          </span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="mtoc-list">
                {items.map((item) => (
                  <a
                    key={item.id}
                    className={`mtoc-item${item.id === activeId ? ' active' : ''}`}
                    href={`#${item.id}`}
                    onClick={(e) => { e.preventDefault(); scrollTo(item.id); }}
                    style={item.level === 3 ? { paddingLeft: 16 } : undefined}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
