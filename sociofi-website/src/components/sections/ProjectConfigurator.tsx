'use client';
import { useState } from 'react';

const PROJECT_TYPES = [
  { id: 'mvp',       label: 'MVP / Web App',   base: [3000, 8000],  weeks: '2–4' },
  { id: 'saas',      label: 'SaaS Product',     base: [8000, 20000], weeks: '4–8' },
  { id: 'internal',  label: 'Internal Tool',    base: [4000, 10000], weeks: '3–6' },
  { id: 'automation',label: 'Automation',        base: [2000, 6000],  weeks: '2–4' },
  { id: 'rescue',    label: 'Rescue & Ship',     base: [2000, 8000],  weeks: '2–4' },
];

const COMPLEXITY = ['Simple', 'Moderate', 'Complex', 'Enterprise'];
const MULTIPLIERS = [1, 1.5, 2.5, 4];

const TIMELINES = ['ASAP', 'Standard (4–6 wks)', 'Relaxed (6–10 wks)', 'Flexible'];
const TIMELINE_ADD = [0, 2, 4, 0];

function fmt(n: number) {
  return '$' + Math.round(n / 500) * 500 + ',000'.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export default function ProjectConfigurator() {
  const [type, setType] = useState<string | null>(null);
  const [complexity, setComplexity] = useState(1);
  const [timeline, setTimeline] = useState(1);

  const selected = PROJECT_TYPES.find(p => p.id === type);
  const multiplier = MULTIPLIERS[complexity];
  const extraWeeks = TIMELINE_ADD[timeline];

  let priceRange = '';
  let weeksRange = '';
  if (selected) {
    const lo = selected.base[0] * multiplier / 1000;
    const hi = selected.base[1] * multiplier / 1000;
    priceRange = `$${Math.round(lo).toLocaleString()}k – $${Math.round(hi).toLocaleString()}k`;
    const [wlo, whi] = selected.weeks.split('–').map(Number);
    weeksRange = timeline === 3
      ? 'Flexible'
      : `${wlo + extraWeeks}–${whi + extraWeeks} weeks`;
  }

  return (
    <div style={{
      maxWidth: 680, margin: '0 auto',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '40px 36px',
      position: 'relative',
    }}>
      {/* Accent top line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, var(--navy), var(--division-accent, var(--teal)))',
        borderRadius: '24px 24px 0 0',
      }} />

      <div style={{ marginBottom: 8 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--division-accent, var(--teal))', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
          Studio · Instant Estimate
        </p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Configure Your Project
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Select your project type, complexity, and timeline to get a ballpark estimate.
        </p>
      </div>

      {/* Step 1 — Project Type */}
      <div style={{ marginTop: 28, marginBottom: 24 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 12 }}>
          1. What are you building?
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PROJECT_TYPES.map(pt => (
            <button
              key={pt.id}
              onClick={() => setType(pt.id)}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '0.84rem', fontWeight: 500,
                padding: '8px 16px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                border: type === pt.id ? '1.5px solid var(--division-accent, var(--teal))' : '1.5px solid var(--border)',
                background: type === pt.id ? 'rgba(var(--division-accent-rgb, 89,163,146),0.1)' : 'transparent',
                color: type === pt.id ? 'var(--division-accent, var(--teal))' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — Complexity */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            2. Complexity
          </p>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--division-accent, var(--teal))' }}>
            {COMPLEXITY[complexity]}
          </span>
        </div>
        <input
          type="range" min={0} max={3} step={1}
          value={complexity}
          onChange={e => setComplexity(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--division-accent, var(--teal))' }}
          aria-label={`Complexity: ${COMPLEXITY[complexity]}`}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          {COMPLEXITY.map(c => (
            <span key={c} style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Step 3 — Timeline */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 10 }}>
          3. Timeline preference
        </p>
        <select
          value={timeline}
          onChange={e => setTimeline(Number(e.target.value))}
          style={{
            width: '100%', padding: '10px 14px',
            background: 'var(--bg-2)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)', fontSize: '0.88rem', cursor: 'pointer',
          }}
          aria-label="Timeline preference"
        >
          {TIMELINES.map((t, i) => <option key={t} value={i}>{t}</option>)}
        </select>
      </div>

      {/* Result */}
      {selected ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(58,88,158,0.08) 0%, rgba(89,163,146,0.08) 100%)',
          border: '1px solid var(--border-hover)',
          borderRadius: 'var(--radius-md)',
          padding: '24px 28px',
          marginBottom: 20,
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Estimated range
          </p>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, var(--navy-bright), var(--division-accent, var(--teal)))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: 8,
          }}>
            {priceRange}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Timeline: <strong style={{ color: 'var(--text-primary)' }}>{weeksRange}</strong>
            &nbsp;·&nbsp;{selected.label}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
            Includes architecture, development, deployment, and 30 days post-launch support.
          </p>
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-2)', border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-md)', padding: '24px',
          textAlign: 'center', marginBottom: 20,
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Select a project type above to see your estimate
          </p>
        </div>
      )}

      <a
        href="/studio/start-project"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '13px 24px',
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)',
          color: '#fff', borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600,
          textDecoration: 'none',
          boxShadow: '0 4px 24px rgba(58,88,158,0.35)',
          transition: 'all 0.2s',
        }}
      >
        Get an exact quote
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
        Free scoping call. No commitment required.
      </p>
    </div>
  );
}
