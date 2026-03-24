/**
 * Skeleton loading primitives.
 * Use these while async data is fetching to prevent layout shift and
 * give users immediate visual feedback.
 */

import { CSSProperties } from 'react';

const pulseStyle: CSSProperties = {
  background: 'var(--bg-3)',
  borderRadius: 6,
  animation: 'skeleton-pulse 1.6s ease-in-out infinite',
};

const pulse = `
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
`;

// ── SkeletonLine ──────────────────────────────────────────────────────────────

interface SkeletonLineProps {
  width?: string | number;
  height?: number;
  style?: CSSProperties;
}

export function SkeletonLine({ width = '100%', height = 14, style }: SkeletonLineProps) {
  return (
    <>
      <div aria-hidden="true" style={{ ...pulseStyle, width, height, ...style }} />
      <style>{pulse}</style>
    </>
  );
}

// ── SkeletonCard ──────────────────────────────────────────────────────────────

interface SkeletonCardProps {
  /** Show a tall image placeholder at the top */
  image?: boolean;
  imageHeight?: number;
  lines?: number;
  style?: CSSProperties;
}

export function SkeletonCard({ image = true, imageHeight = 200, lines = 3, style }: SkeletonCardProps) {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          ...style,
        }}
      >
        {image && (
          <div style={{
            height: imageHeight,
            background: 'var(--bg-3)',
            animation: 'skeleton-pulse 1.6s ease-in-out infinite',
          }} />
        )}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Title line — wider */}
          <div style={{ ...pulseStyle, width: '70%', height: 16 }} />
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} style={{
              ...pulseStyle,
              width: i === lines - 1 ? '55%' : '100%',
              height: 12,
              animationDelay: `${i * 0.08}s`,
            }} />
          ))}
        </div>
      </div>
      <style>{pulse}</style>
    </>
  );
}

// ── SkeletonGrid ──────────────────────────────────────────────────────────────

interface SkeletonGridProps {
  count?: number;
  columns?: number;
  /** Props forwarded to each SkeletonCard */
  cardProps?: SkeletonCardProps;
}

export function SkeletonGrid({ count = 6, columns = 3, cardProps }: SkeletonGridProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading content"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 24,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} {...cardProps} />
      ))}
    </div>
  );
}

// ── SkeletonText ──────────────────────────────────────────────────────────────

/** Multi-line text block skeleton (e.g. article body placeholder) */
export function SkeletonText({ lines = 4 }: { lines?: number }) {
  return (
    <>
      <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} style={{
            ...pulseStyle,
            width: i === lines - 1 ? '60%' : '100%',
            height: 14,
            animationDelay: `${i * 0.06}s`,
          }} />
        ))}
      </div>
      <style>{pulse}</style>
    </>
  );
}
