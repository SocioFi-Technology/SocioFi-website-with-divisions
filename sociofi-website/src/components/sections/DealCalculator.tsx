'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';

// ── Types ──────────────────────────────────────────────────────────────────────

type DealModel = 'equity' | 'revenue' | 'hybrid';
type Stage = 'idea' | 'prototype' | 'mvp' | 'growing';
type Size = 'small' | 'medium' | 'large';

// ── Deal model descriptions ────────────────────────────────────────────────────

const MODELS: { id: DealModel; label: string; tagline: string }[] = [
  { id: 'equity', label: 'Equity Deal', tagline: 'Zero upfront. We share the upside.' },
  { id: 'revenue', label: 'Revenue Share', tagline: 'No dilution. We earn from revenue.' },
  { id: 'hybrid', label: 'Hybrid Model', tagline: 'Reduced upfront + partial equity.' },
];

const STAGES: { id: Stage; label: string; desc: string }[] = [
  { id: 'idea', label: 'Just an idea', desc: 'No code, no validation yet' },
  { id: 'prototype', label: 'Early prototype', desc: 'Something exists but not production-ready' },
  { id: 'mvp', label: 'MVP shipped', desc: 'Users exist, early traction' },
  { id: 'growing', label: 'Growing product', desc: 'Revenue or significant user base' },
];

const SIZES: { id: Size; label: string }[] = [
  { id: 'small', label: 'Small (landing page + core feature)' },
  { id: 'medium', label: 'Medium (full SaaS or mobile app)' },
  { id: 'large', label: 'Large (complex platform or multi-tenant)' },
];

// ── Range calculation ──────────────────────────────────────────────────────────

function calcResult(model: DealModel, stage: Stage, size: Size) {
  const stageMultiplier = { idea: 1.2, prototype: 1.0, mvp: 0.85, growing: 0.7 }[stage];
  const sizeBase = { small: 5, medium: 12, large: 25 }[size]; // in %

  if (model === 'equity') {
    const base = Math.round(sizeBase * stageMultiplier);
    const lo = Math.max(3, base - 2);
    const hi = Math.min(25, base + 4);
    return {
      primary: `${lo}–${hi}% equity`,
      secondary: 'No cash payment required',
      note: 'Typical vesting: 4 years with 1-year cliff',
      href: '/ventures/models/equity',
    };
  }

  if (model === 'revenue') {
    const pct = Math.round(sizeBase * stageMultiplier * 0.5);
    const lo = Math.max(2, pct - 1);
    const hi = lo + 3;
    const cap = Math.round(sizeBase * 8);
    return {
      primary: `${lo}–${hi}% revenue`,
      secondary: `Until ${cap}× our build cost recovered`,
      note: 'Paid monthly from revenue. Zero equity.',
      href: '/ventures/models/revenue-share',
    };
  }

  // hybrid
  const equityLo = Math.max(2, Math.round(sizeBase * stageMultiplier * 0.5) - 1);
  const equityHi = equityLo + 3;
  const fee = { small: '$2,500–$5,000', medium: '$5,000–$12,000', large: '$12,000–$25,000' }[size];
  return {
    primary: `${fee} + ${equityLo}–${equityHi}% equity`,
    secondary: 'Reduced cash + reduced equity stake',
    note: 'Best for founders who want both parties invested.',
    href: '/ventures/models/hybrid',
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function DealCalculator() {
  const [model, setModel] = useState<DealModel | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [size, setSize] = useState<Size | null>(null);

  const result = model && stage && size ? calcResult(model, stage, size) : null;

  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 18px',
    borderRadius: 'var(--radius-full)',
    border: `1.5px solid ${active ? 'var(--division-accent)' : 'var(--border)'}`,
    background: active ? 'rgba(107,163,232,0.08)' : 'var(--bg-2)',
    color: active ? 'var(--division-accent)' : 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.88rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <div style={{
      maxWidth: 740,
      marginInline: 'auto',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '36px 40px' }}>

        {/* Step 1 — Model */}
        <div style={{ marginBottom: 32 }}>
          <div className="sec-label" style={{ marginBottom: 16 }}>Step 1 — Deal structure</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {MODELS.map(m => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                style={pillStyle(model === m.id)}
              >
                <span style={{ fontWeight: 600, display: 'block' }}>{m.label}</span>
                <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>{m.tagline}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — Stage */}
        <div style={{ marginBottom: 32 }}>
          <div className="sec-label" style={{ marginBottom: 16 }}>Step 2 — Product stage</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {STAGES.map(s => (
              <button
                key={s.id}
                onClick={() => setStage(s.id)}
                style={pillStyle(stage === s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3 — Size */}
        <div style={{ marginBottom: 32 }}>
          <div className="sec-label" style={{ marginBottom: 16 }}>Step 3 — Build scope</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SIZES.map(sz => (
              <button
                key={sz.id}
                onClick={() => setSize(sz.id)}
                style={{
                  ...pillStyle(size === sz.id),
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                  width: '100%',
                  padding: '12px 18px',
                }}
              >
                {sz.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div style={{
          padding: '28px 32px',
          background: result ? 'rgba(107,163,232,0.06)' : 'var(--bg-2)',
          border: `1px solid ${result ? 'rgba(107,163,232,0.2)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {result ? (
            <>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.64rem', fontWeight: 500,
                color: 'var(--division-accent)', textTransform: 'uppercase', letterSpacing: '0.12em',
                marginBottom: 10,
              }}>
                Indicative deal range
              </div>
              <div style={{
                fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                fontWeight: 700, color: 'var(--division-accent)', letterSpacing: '-0.02em',
                lineHeight: 1.1, marginBottom: 8,
              }}>
                {result.primary}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                color: 'var(--text-secondary)', marginBottom: 6,
              }}>
                {result.secondary}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                color: 'var(--text-muted)', marginBottom: 24,
              }}>
                {result.note}
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <Button href="/ventures/apply" variant="primary" size="md">
                  Apply to co-build
                </Button>
                <Button href={result.href} variant="ghost" size="md">
                  How this model works
                </Button>
              </div>
            </>
          ) : (
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              color: 'var(--text-muted)', textAlign: 'center',
            }}>
              Select all three options above to see an indicative deal range.
            </p>
          )}
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.66rem',
          color: 'var(--text-muted)', textAlign: 'center', marginTop: 16,
          lineHeight: 1.6,
        }}>
          Estimates only — every deal is negotiated individually. Apply to get a real term sheet.
        </p>

      </div>
    </div>
  );
}
