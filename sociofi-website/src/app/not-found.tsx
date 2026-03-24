import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'This page does not exist. Find what you need across SocioFi Technology\'s seven divisions.',
  robots: { index: false, follow: false },
};

const DIVISIONS = [
  { name: 'Studio',   href: '/studio',   accent: '#72C4B2', desc: 'Custom Software Development' },
  { name: 'Agents',   href: '/agents',   accent: '#8B5CF6', desc: 'AI Agent Systems' },
  { name: 'Academy',  href: '/academy',  accent: '#E8B84D', desc: 'Learning & Training' },
  { name: 'Services', href: '/services', accent: '#4DBFA8', desc: 'Support & Maintenance' },
  { name: 'Cloud',    href: '/cloud',    accent: '#5BB5E0', desc: 'Managed Cloud Hosting' },
  { name: 'Ventures', href: '/ventures', accent: '#6BA3E8', desc: 'Startup Co-Building' },
  { name: 'Products', href: '/products', accent: '#E8916F', desc: 'AI-Powered Products' },
];

export default function NotFound() {
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
      {/* Accent glow */}
      <div aria-hidden="true" style={{
        position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(circle, rgba(58,88,158,0.18) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Logo mark */}
      <Link href="/" aria-label="SocioFi Technology — Home" style={{ marginBottom: 48, display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M8 9L18 18L8 27" stroke="#72C4B2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 9L28 18L18 27" stroke="#3A589E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>SocioFi Technology</span>
      </Link>

      {/* 404 */}
      <div style={{
        fontSize: 'clamp(6rem, 20vw, 10rem)',
        fontFamily: 'var(--font-display, Syne, sans-serif)',
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: '-0.05em',
        background: 'linear-gradient(135deg, #4A6CB8 0%, #72C4B2 50%, #A3DFD2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: 24,
      }}>
        404
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display, Syne, sans-serif)',
        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 16,
        letterSpacing: '-0.02em',
      }}>
        This page doesn&apos;t exist
      </h1>

      <p style={{
        fontSize: '1.05rem',
        color: 'var(--text-secondary)',
        maxWidth: 480,
        lineHeight: 1.65,
        marginBottom: 48,
      }}>
        But everything else does. Find what you&apos;re looking for across our seven divisions below, or head back home.
      </p>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 72 }}>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #3A589E 0%, #59A392 100%)',
          color: '#fff',
          borderRadius: 100,
          fontSize: '0.9rem',
          fontWeight: 600,
          textDecoration: 'none',
          fontFamily: 'var(--font-display, Syne, sans-serif)',
          letterSpacing: '-0.01em',
        }}>
          Back to Homepage
        </Link>
        <Link href="/contact" style={{
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
          Contact Us
        </Link>
      </div>

      {/* Division quick links */}
      <div style={{ width: '100%', maxWidth: 860 }}>
        <p style={{
          fontFamily: 'var(--font-mono, "Fira Code", monospace)',
          fontSize: '0.72rem',
          fontWeight: 500,
          color: 'var(--teal, #59A392)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <span style={{ display: 'inline-block', width: 20, height: 1.5, background: 'var(--teal, #59A392)' }} />
          Our Divisions
          <span style={{ display: 'inline-block', width: 20, height: 1.5, background: 'var(--teal, #59A392)' }} />
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
        }}>
          {DIVISIONS.map((div) => (
            <Link key={div.href} href={div.href} style={{
              display: 'flex', flexDirection: 'column', gap: 4,
              padding: '16px 20px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              textDecoration: 'none',
              transition: 'border-color 0.3s ease, transform 0.3s ease',
            }}>
              <span style={{
                fontFamily: 'var(--font-display, Syne, sans-serif)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: div.accent,
              }}>{div.name}</span>
              <span style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}>{div.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
