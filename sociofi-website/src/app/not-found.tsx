import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | SocioFi Technology',
  description: 'This page does not exist.',
}

export default function NotFound() {
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background orb */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(89,163,146,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* 404 numeral */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(6rem, 20vw, 12rem)',
          fontWeight: 800,
          letterSpacing: '-0.05em',
          lineHeight: 1,
          background: 'linear-gradient(135deg, rgba(58,88,158,0.15) 0%, rgba(89,163,146,0.15) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 8,
          userSelect: 'none',
        }}
      >
        404
      </div>

      {/* Section label */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          fontWeight: 500,
          color: 'var(--teal)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ width: 20, height: 1.5, background: 'var(--teal)', display: 'inline-block' }} />
        Page not found
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: 'var(--text-primary)',
          margin: '0 0 16px',
          maxWidth: '18ch',
        }}
      >
        This page went off the map.
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.05rem',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          margin: '0 0 40px',
          maxWidth: '44ch',
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Let&apos;s get you back somewhere useful.
      </p>

      {/* Action links */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            fontWeight: 600,
            padding: '13px 28px',
            borderRadius: '100px',
            background: 'linear-gradient(135deg, #3A589E 0%, #59A392 100%)',
            color: '#fff',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 24px rgba(58,88,158,0.3)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Back to home
        </Link>
        <Link
          href="/contact"
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
          Contact us
        </Link>
      </div>

      {/* Quick nav */}
      <div
        style={{
          marginTop: 64,
          paddingTop: 40,
          borderTop: '1px solid var(--border)',
          width: '100%',
          maxWidth: 640,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 20,
          }}
        >
          Or explore a division
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'Studio',   href: '/studio',   color: '#72C4B2' },
            { label: 'Services', href: '/services', color: '#4DBFA8' },
            { label: 'Labs',     href: '/labs',     color: '#7B6FE8' },
            { label: 'Academy',  href: '/academy',  color: '#E8B84D' },
            { label: 'Ventures', href: '/ventures', color: '#6BA3E8' },
            { label: 'Cloud',    href: '/cloud',    color: '#5BB5E0' },
          ].map((div) => (
            <Link
              key={div.href}
              href={div.href}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                fontWeight: 500,
                padding: '7px 16px',
                borderRadius: '100px',
                border: `1.5px solid ${div.color}30`,
                background: div.color + '10',
                color: div.color,
                textDecoration: 'none',
              }}
            >
              {div.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
