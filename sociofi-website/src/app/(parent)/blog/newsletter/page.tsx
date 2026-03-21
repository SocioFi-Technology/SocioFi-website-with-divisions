'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

// Note: metadata export not usable in 'use client' — SEO handled via parent layout.

const CATEGORIES = [
  { id: 'ai-development', label: 'AI Development', color: '#72C4B2' },
  { id: 'ai-agents', label: 'AI Agents', color: '#8B5CF6' },
  { id: 'engineering', label: 'Engineering', color: '#7B6FE8' },
  { id: 'business', label: 'Business', color: '#6BA3E8' },
  { id: 'case-studies', label: 'Case Studies', color: '#E8916F' },
  { id: 'tutorials', label: 'Tutorials', color: '#E8B84D' },
  { id: 'company', label: 'Company', color: '#4DBFA8' },
  { id: 'experiments', label: 'Experiments', color: '#E05555' },
];

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function toggleCategory(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState('loading');
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, categories: selected }),
      });
      setState('success');
    } catch {
      setState('error');
    }
  }

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 'calc(var(--space-section, 120px) + 60px)',
          paddingBottom: 80,
          background: 'var(--bg)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(89,163,146,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 500,
              color: 'var(--teal)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <span aria-hidden="true" style={{ width: 20, height: 1.5, background: 'var(--teal)', display: 'inline-block' }} />
            Newsletter
            <span aria-hidden="true" style={{ width: 20, height: 1.5, background: 'var(--teal)', display: 'inline-block' }} />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              color: 'var(--text-primary)',
              margin: '0 0 16px',
            }}
          >
            Get the Best of SocioFi. Monthly.
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              margin: '0 0 8px',
            }}
          >
            Curated by AI. Reviewed by humans.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              lineHeight: 1.65,
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            One email per month. No fluff — just the articles, case studies, and research
            worth reading. Unsubscribe any time.
          </p>
        </div>
      </section>

      {/* ── Subscription form ─────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 100px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 32px' }}>
          {state === 'success' ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 40px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(89,163,146,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: '0 0 8px',
                  letterSpacing: '-0.02em',
                }}
              >
                You&apos;re subscribed.
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                First edition coming next month. In the meantime, explore the blog.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '40px 40px',
              }}
              aria-label="Newsletter subscription"
            >
              {/* Email */}
              <div style={{ marginBottom: 28 }}>
                <label
                  htmlFor="newsletter-email"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    marginBottom: 8,
                  }}
                >
                  Your email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--teal)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>

              {/* Category checkboxes */}
              <div style={{ marginBottom: 32 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    marginBottom: 12,
                  }}
                >
                  Topics you care about{' '}
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                    (optional — we&apos;ll curate based on your selection)
                  </span>
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {CATEGORIES.map((cat) => {
                    const isChecked = selected.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-full)',
                          border: `1.5px solid ${isChecked ? cat.color : 'var(--border)'}`,
                          background: isChecked ? cat.color + '15' : 'transparent',
                          color: isChecked ? cat.color : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          transition: 'all 0.2s',
                          userSelect: 'none',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat.id)}
                          style={{ display: 'none' }}
                          aria-label={cat.label}
                        />
                        {isChecked && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                        {cat.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={state === 'loading'}
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  padding: '14px 24px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)',
                  color: '#fff',
                  border: 'none',
                  cursor: state === 'loading' ? 'wait' : 'pointer',
                  opacity: state === 'loading' ? 0.7 : 1,
                  letterSpacing: '-0.01em',
                  transition: 'transform 0.2s, opacity 0.2s',
                  boxSizing: 'border-box',
                }}
              >
                {state === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>

              {state === 'error' && (
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    color: '#E05555',
                    margin: '12px 0 0',
                    textAlign: 'center',
                  }}
                >
                  Something went wrong. Please try again.
                </p>
              )}

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  margin: '16px 0 0',
                }}
              >
                No spam. Unsubscribe any time. Curated by AI, reviewed by humans, sent monthly.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
