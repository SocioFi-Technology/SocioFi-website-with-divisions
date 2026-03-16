'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from '@/lib/icons';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Avoid hydration mismatch — render invisible placeholder until mounted
  if (!mounted) {
    return <div style={{ width: 38, height: 38, flexShrink: 0 }} aria-hidden="true" />;
  }

  const isDark = theme !== 'light';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 38,
        height: 38,
        borderRadius: 'var(--radius-full)',
        border: '1.5px solid var(--border)',
        background: 'transparent',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        transition: 'color 0.2s var(--ease), border-color 0.2s var(--ease), background 0.2s var(--ease)',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.color = 'var(--text-primary)';
        el.style.borderColor = 'var(--border-hover)';
        el.style.background = 'var(--bg-3)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.color = 'var(--text-muted)';
        el.style.borderColor = 'var(--border)';
        el.style.background = 'transparent';
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
