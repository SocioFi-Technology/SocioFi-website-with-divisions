'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error tracking service in production
    console.error('[SocioFi Error]', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body, Outfit, sans-serif)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      textAlign: 'center',
    }}>
      {/* Warm glow — error tone */}
      <div aria-hidden="true" style={{
        position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 400,
        background: 'radial-gradient(circle, rgba(232,145,111,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Logo */}
      <Link href="/" aria-label="SocioFi Technology — Home" style={{ marginBottom: 48, display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M8 9L18 18L8 27" stroke="#72C4B2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 9L28 18L18 27" stroke="#3A589E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>SocioFi Technology</span>
      </Link>

      {/* Error icon */}
      <div style={{
        width: 72, height: 72,
        borderRadius: '50%',
        background: 'rgba(232,145,111,0.12)',
        border: '1.5px solid rgba(232,145,111,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8916F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display, Syne, sans-serif)',
        fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 14,
        letterSpacing: '-0.025em',
      }}>
        Something went wrong
      </h1>

      <p style={{
        fontSize: '1rem',
        color: 'var(--text-secondary)',
        maxWidth: 440,
        lineHeight: 1.65,
        marginBottom: 40,
      }}>
        An unexpected error occurred. This has been logged. Try refreshing — it&apos;s usually a one-off.
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #3A589E 0%, #59A392 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 100,
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-display, Syne, sans-serif)',
            letterSpacing: '-0.01em',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 .49-3.1"/>
          </svg>
          Try Again
        </button>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 24px',
          background: 'transparent',
          color: 'var(--text-primary)',
          border: '1.5px solid var(--border)',
          borderRadius: 100,
          fontSize: '0.9rem',
          fontWeight: 600,
          textDecoration: 'none',
          fontFamily: 'var(--font-display, Syne, sans-serif)',
          letterSpacing: '-0.01em',
        }}>
          Go Home
        </Link>
        <Link href="/contact" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 24px',
          background: 'transparent',
          color: 'var(--text-muted)',
          border: '1.5px solid var(--border)',
          borderRadius: 100,
          fontSize: '0.9rem',
          fontWeight: 600,
          textDecoration: 'none',
          fontFamily: 'var(--font-display, Syne, sans-serif)',
          letterSpacing: '-0.01em',
        }}>
          Report Issue
        </Link>
      </div>

      {/* Digest for debugging */}
      {error.digest && (
        <p style={{
          marginTop: 32,
          fontFamily: 'var(--font-mono, "Fira Code", monospace)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.04em',
        }}>
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
