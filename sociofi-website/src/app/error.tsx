'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to error monitoring service in production
    console.error('[app error]', error)
  }, [error])

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '40px 24px',
        textAlign: 'center',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(232,145,111,0.1)',
          border: '1.5px solid rgba(232,145,111,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
        aria-hidden="true"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#E8916F"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      {/* Section label */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          fontWeight: 500,
          color: '#E8916F',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ width: 20, height: 1.5, background: '#E8916F', display: 'inline-block' }} />
        Something went wrong
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          margin: '0 0 14px',
        }}
      >
        An unexpected error occurred.
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          margin: '0 0 36px',
          maxWidth: '44ch',
        }}
      >
        Something broke on our end. Our team has been notified.
        You can try reloading the page or head back to safety.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            fontWeight: 600,
            padding: '13px 28px',
            borderRadius: '100px',
            background: 'linear-gradient(135deg, #3A589E 0%, #59A392 100%)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M23 4v6h-6"/>
            <path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Try again
        </button>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            fontWeight: 600,
            padding: '13px 28px',
            borderRadius: '100px',
            border: '1.5px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          Back to home
        </Link>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <details
          style={{
            marginTop: 48,
            padding: '16px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            maxWidth: 640,
            width: '100%',
            textAlign: 'left',
          }}
        >
          <summary
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            Error details (dev only)
          </summary>
          <pre
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: '#E8916F',
              marginTop: 12,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
        </details>
      )}
    </main>
  )
}
