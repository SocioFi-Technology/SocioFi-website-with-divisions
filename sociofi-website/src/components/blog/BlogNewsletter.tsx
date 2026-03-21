'use client';

import { useState } from 'react';

interface BlogNewsletterProps {
  title?: string;
  subtitle?: string;
  accentColor?: string;
}

export default function BlogNewsletter({
  title = 'Get the best of SocioFi. Monthly.',
  subtitle = 'Curated by AI. Reviewed by humans. No fluff — just honest writing about building software that works.',
  accentColor = 'var(--teal)',
}: BlogNewsletterProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState('loading');
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setState('success');
    } catch {
      setState('error');
    }
  }

  return (
    <div
      className="blognl-wrap"
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)',
        backdropFilter: 'blur(12px)',
        padding: '48px',
        display: 'flex',
        alignItems: 'center',
        gap: 48,
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .blognl-wrap { padding: 28px 20px !important; gap: 24px !important; }
          .blognl-form { flex-direction: column !important; }
          .blognl-input { width: 100% !important; }
          .blognl-btn { width: 100% !important; justify-content: center; }
        }
      `}</style>
      {/* Glow orb */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor === 'var(--teal)' ? 'rgba(89,163,146,0.08)' : accentColor + '12'} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ flex: 1, minWidth: 220 }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.3rem, 2vw, 1.7rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            margin: '0 0 8px',
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            margin: 0,
            maxWidth: '40ch',
          }}
        >
          {subtitle}
        </p>
      </div>

      <div style={{ flexShrink: 0 }}>
        {state === 'success' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'var(--teal)',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            You&apos;re subscribed. First article coming soon.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="blognl-form"
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
            aria-label="Newsletter signup"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              className="blognl-input"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                padding: '11px 18px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text-primary)',
                outline: 'none',
                width: 240,
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--teal)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="blognl-btn"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.88rem',
                fontWeight: 600,
                padding: '11px 22px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)',
                color: '#fff',
                border: 'none',
                cursor: state === 'loading' ? 'wait' : 'pointer',
                whiteSpace: 'nowrap',
                opacity: state === 'loading' ? 0.7 : 1,
                transition: 'transform 0.2s, opacity 0.2s',
              }}
            >
              {state === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
            {state === 'error' && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.78rem',
                  color: '#E05555',
                  margin: '8px 0 0',
                  width: '100%',
                }}
              >
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
