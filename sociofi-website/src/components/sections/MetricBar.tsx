'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import Container from '@/components/shared/Container';

export interface Metric {
  /** Display label */
  label: string;
  /** The numeric target for count-up animation */
  numeric: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places (default 0) */
  decimals?: number;
}

interface MetricBarProps {
  metrics: Metric[];
  accentColor?: string;
  /** Render on a bg-2 section band */
  background?: boolean;
  className?: string;
}

function Counter({
  target,
  prefix = '',
  suffix = '',
  decimals = 0,
  accent,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  accent: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    if (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return;
    }
    const duration = 1600;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, decimals]);

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString();

  return (
    <span ref={ref} className="gradient-text" style={{ color: accent }}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

export default function MetricBar({
  metrics,
  accentColor,
  background = false,
  className = '',
}: MetricBarProps) {
  const accent = accentColor ?? 'var(--division-accent)';

  return (
    <div
      className={className}
      style={{
        paddingBlock: 'var(--space-2xl)',
        background: background ? 'var(--bg-2)' : undefined,
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1,
                marginBottom: 8,
              }}>
                <Counter
                  target={m.numeric}
                  prefix={m.prefix}
                  suffix={m.suffix}
                  decimals={m.decimals}
                  accent={accent}
                />
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
