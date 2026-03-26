'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[admin error]', error)
  }, [error])

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0C0C1D',
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
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>

      {/* Section label */}
      <div
        style={{
          fontFamily: 'var(--font-mono, "Fira Code", monospace)',
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
        Admin panel error
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display, "Syne", sans-serif)',
          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: '#FFFFFF',
          margin: '0 0 12px',
        }}
      >
        Admin panel error
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-body, "Outfit", sans-serif)',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: '#7C8DB0',
          margin: '0 0 36px',
          maxWidth: '48ch',
        }}
      >
        Something went wrong in the admin panel.
        Check the browser console for details, or try reloading.
      </p>

      {/* Always-visible error detail for admin (technical users) */}
      <div
        style={{
          marginBottom: 36,
          padding: '16px 20px',
          background: 'rgba(12,12,29,0.8)',
          border: '1px solid rgba(232,145,111,0.2)',
          borderRadius: '12px',
          maxWidth: 680,
          width: '100%',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono, "Fira Code", monospace)',
            fontSize: '0.68rem',
            color: '#4A5578',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 10,
          }}
        >
          Error details
        </div>
        <pre
          style={{
            fontFamily: 'var(--font-mono, "Fira Code", monospace)',
            fontSize: '0.75rem',
            color: '#E8916F',
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.7,
          }}
        >
          {error.message || 'Unknown error'}
          {error.digest ? `\n\nDigest: ${error.digest}` : ''}
        </pre>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            fontFamily: 'var(--font-display, "Syne", sans-serif)',
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
          href="/admin"
          style={{
            fontFamily: 'var(--font-display, "Syne", sans-serif)',
            fontSize: '0.9rem',
            fontWeight: 600,
            padding: '13px 28px',
            borderRadius: '100px',
            border: '1.5px solid rgba(89,163,146,0.15)',
            background: 'transparent',
            color: '#FFFFFF',
            textDecoration: 'none',
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
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          Go to dashboard
        </Link>
      </div>
    </main>
  )
}
