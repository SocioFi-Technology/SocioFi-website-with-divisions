'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface MobileFilterDrawerProps {
  options: FilterOption[];
  active: string;
  onChange: (value: string) => void;
  accentColor?: string;
  allLabel?: string;
}

const STYLES = `
  .mfd-trigger {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; min-height: 44px;
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 100px; cursor: pointer;
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-size: 0.85rem; font-weight: 500; color: var(--text-secondary);
    transition: border-color 0.2s;
  }
  .mfd-trigger:active { border-color: var(--division-accent, var(--teal, #59A392)); }
  .mfd-backdrop {
    position: fixed; inset: 0; z-index: 998;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
  }
  .mfd-drawer {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 999;
    background: var(--bg-card);
    border-radius: 20px 20px 0 0;
    border-top: 1px solid var(--border);
    padding: 0 20px;
    padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
    max-height: 70vh; overflow-y: auto;
  }
  .mfd-handle {
    width: 36px; height: 4px; border-radius: 2px;
    background: var(--border); margin: 12px auto 20px;
  }
  .mfd-title {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 1rem; font-weight: 700;
    color: var(--text-primary); margin-bottom: 16px;
  }
  .mfd-options { display: flex; flex-direction: column; gap: 6px; }
  .mfd-option {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; min-height: 52px;
    background: var(--bg-2); border: 1px solid var(--border);
    border-radius: 12px; cursor: pointer;
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-size: 0.9rem; font-weight: 500; color: var(--text-secondary);
    transition: border-color 0.2s, background 0.2s;
  }
  .mfd-option.active {
    border-color: var(--division-accent, var(--teal, #59A392));
    background: color-mix(in srgb, var(--division-accent, var(--teal, #59A392)) 10%, var(--bg-card));
    color: var(--text-primary);
  }
  .mfd-count {
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.7rem; color: var(--text-muted);
  }
  .mfd-apply {
    width: 100%; margin-top: 16px; padding: 15px;
    min-height: 52px; border-radius: 12px; border: none; cursor: pointer;
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 0.95rem; font-weight: 700; color: white;
    background: linear-gradient(135deg, var(--navy, #3A589E), var(--division-accent, var(--teal, #59A392)));
    transition: opacity 0.2s;
  }
  .mfd-apply:active { opacity: 0.85; }
`;

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MobileFilterDrawer({
  options,
  active,
  onChange,
  accentColor,
  allLabel = 'All',
}: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(active);

  const allOptions = [{ label: allLabel, value: 'all' }, ...options];
  const activeLabel = allOptions.find((o) => o.value === active)?.label ?? allLabel;

  const apply = () => {
    onChange(pending);
    setOpen(false);
  };

  return (
    <>
      <style>{STYLES}</style>
      <button
        className="mfd-trigger"
        onClick={() => { setPending(active); setOpen(true); }}
        style={accentColor ? { '--division-accent': accentColor } as React.CSSProperties : undefined}
        aria-label="Open filter"
      >
        <FilterIcon />
        {activeLabel}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="mfd-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="mfd-drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={accentColor ? { '--division-accent': accentColor } as React.CSSProperties : undefined}
            >
              <div className="mfd-handle" />
              <div className="mfd-title">Filter</div>
              <div className="mfd-options">
                {allOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`mfd-option${pending === opt.value ? ' active' : ''}`}
                    onClick={() => setPending(opt.value)}
                  >
                    <span>{opt.label}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {opt.count != null && <span className="mfd-count">{opt.count}</span>}
                      {pending === opt.value && <CheckIcon />}
                    </span>
                  </button>
                ))}
              </div>
              <button className="mfd-apply" onClick={apply}>Apply</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
