'use client';

import { BlogCategory, CATEGORY_CONFIG } from '@/lib/blog';

const CATEGORIES = Object.keys(CATEGORY_CONFIG) as BlogCategory[];

interface BlogCategoryBarProps {
  activeCategory?: BlogCategory;
  onChange: (cat?: BlogCategory) => void;
}

export default function BlogCategoryBar({ activeCategory, onChange }: BlogCategoryBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter articles by category"
      style={{
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none' as const,
      }}
    >
      <style>{`
        [role="tablist"]::-webkit-scrollbar { display: none; }
        .cat-tab { transition: all 0.2s cubic-bezier(0.16,1,0.3,1); cursor: pointer; white-space: nowrap; }
        .cat-tab:hover:not(.cat-tab--active) { border-color: var(--border-hover) !important; color: var(--text-primary) !important; }
      `}</style>

      {/* "All" tab */}
      <button
        role="tab"
        aria-selected={!activeCategory}
        onClick={() => onChange(undefined)}
        className={`cat-tab${!activeCategory ? ' cat-tab--active' : ''}`}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.84rem',
          fontWeight: 500,
          padding: '7px 16px',
          borderRadius: 'var(--radius-full)',
          border: `1.5px solid ${!activeCategory ? 'var(--teal)' : 'var(--border)'}`,
          background: !activeCategory ? 'rgba(89,163,146,0.1)' : 'transparent',
          color: !activeCategory ? 'var(--teal)' : 'var(--text-secondary)',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        All
      </button>

      {CATEGORIES.map((cat) => {
        const cfg = CATEGORY_CONFIG[cat];
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat)}
            className={`cat-tab${isActive ? ' cat-tab--active' : ''}`}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.84rem',
              fontWeight: 500,
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              border: `1.5px solid ${isActive ? cfg.color : 'var(--border)'}`,
              background: isActive ? cfg.color + '15' : 'transparent',
              color: isActive ? cfg.color : 'var(--text-secondary)',
              cursor: 'pointer',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {cfg.label}
            {/* Active underline indicator */}
            {isActive && (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: -1,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: 2,
                  background: cfg.color,
                  borderRadius: 2,
                  display: 'block',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
