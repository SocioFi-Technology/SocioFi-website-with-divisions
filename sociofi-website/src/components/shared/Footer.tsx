'use client';

import Link from 'next/link';
import Container from '@/components/shared/Container';
import Logo, { LogoMark } from '@/components/shared/Logo';
import { divisions } from '@/lib/divisions';
import type { Division } from '@/lib/divisions';
import { Mail, ArrowRight } from '@/lib/icons';

interface FooterProps {
  division?: Division;
}

const DIVISIONS_NAV = [
  { label: 'Studio',   slug: 'studio',   href: '/studio',   accent: '#72C4B2' },
  { label: 'Services', slug: 'services', href: '/services', accent: '#4DBFA8' },
  { label: 'Labs',     slug: 'labs',     href: '/labs',     accent: '#7B6FE8' },
  { label: 'Products', slug: 'products', href: '/products', accent: '#E8916F' },
  { label: 'Academy',  slug: 'academy',  href: '/academy',  accent: '#E8B84D' },
  { label: 'Ventures', slug: 'ventures', href: '/ventures', accent: '#6BA3E8' },
  { label: 'Cloud',    slug: 'cloud',    href: '/cloud',    accent: '#5BB5E0' },
];

const COMPANY_LINKS = [
  { label: 'About us',     href: '/about' },
  { label: 'Blog',         href: '/labs/blog' },
  { label: 'Careers',      href: '/careers' },
  { label: 'Contact',      href: '/contact' },
  { label: 'Partnerships', href: '/partnerships' },
];

const LEGAL_LINKS = [
  { label: 'Legal',            href: '/legal' },
  { label: 'Privacy Policy',   href: '/legal#privacy' },
  { label: 'Terms of Service', href: '/legal#terms' },
  { label: 'Cookie Policy',    href: '/legal#cookies' },
];

function ColHeader({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.68rem',
      fontWeight: 500,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      marginBottom: 20,
    }}>
      {children}
    </p>
  );
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.84rem',
          lineHeight: 1,
          color: 'var(--text-muted)',
          transition: 'color 0.2s var(--ease)',
          display: 'block',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer({ division }: FooterProps) {
  const ctx = division ?? divisions.technology;

  return (
    <footer
      role="contentinfo"
      style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}
    >
      <Container>

        {/* ── 4-column main grid ──────────────────────────────────────── */}
        <div
          style={{
            paddingBlock: 'var(--space-4xl)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
          }}
          className="footer-grid"
        >

          {/* ── Col 1 · Brand ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Logo division={ctx.slug} size="md" showWordmark href={ctx.url} />

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.87rem',
              lineHeight: 1.75,
              color: 'var(--text-muted)',
              maxWidth: '26ch',
            }}>
              AI builds. Humans architect. You scale.
            </p>

            <a
              href="mailto:hello@sociofitechnology.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontFamily: 'var(--font-body)',
                fontSize: '0.84rem',
                color: 'var(--text-muted)',
                transition: 'color 0.2s var(--ease)',
                width: 'fit-content',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
            >
              <Mail size={14} aria-hidden="true" />
              hello@sociofitechnology.com
            </a>

            <Link
              href="/studio/start-project"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-display)',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: ctx.accent,
                transition: 'gap 0.2s var(--ease)',
                width: 'fit-content',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.gap = '10px'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.gap = '6px'; }}
            >
              Start a project
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {/* ── Col 2 · Divisions ─────────────────────────────────────── */}
          <div>
            <ColHeader>Divisions</ColHeader>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {DIVISIONS_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 9,
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.84rem',
                      color: 'var(--text-muted)',
                      transition: 'color 0.2s var(--ease)',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = item.accent; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                  >
                    <LogoMark division={item.slug} size="xs" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3 · Company ───────────────────────────────────────── */}
          <div>
            <ColHeader>Company</ColHeader>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {COMPANY_LINKS.map((item) => (
                <FLink key={item.href} href={item.href}>{item.label}</FLink>
              ))}
            </ul>
          </div>

          {/* ── Col 4 · Legal + built-with ────────────────────────────── */}
          <div>
            <ColHeader>Legal</ColHeader>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {LEGAL_LINKS.map((item) => (
                <FLink key={item.href} href={item.href}>{item.label}</FLink>
              ))}
            </ul>

            {/* Built-with badge */}
            <div style={{
              marginTop: 32,
              padding: '12px 16px',
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.63rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 5,
              }}>
                Built with
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '-0.01em',
              }}>
                AI agents + human engineers
              </p>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────── */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingBlock: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            &copy; {new Date().getFullYear()} SocioFi Technology Ltd. All rights reserved.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Dhaka, Bangladesh
            </span>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
            }}>
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: ctx.accent,
                  flexShrink: 0,
                }}
              />
              {ctx.name}
            </div>
          </div>
        </div>

      </Container>
    </footer>
  );
}
