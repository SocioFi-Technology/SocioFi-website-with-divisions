'use client';

import Link from 'next/link';
import Container from '@/components/shared/Container';
import Logo from '@/components/shared/Logo';
import { divisions } from '@/lib/divisions';
import type { Division } from '@/lib/divisions';
import { Mail, ArrowRight } from '@/lib/icons';

interface FooterProps {
  division?: Division;
}

const DIVISIONS_NAV = [
  { label: 'Studio',   href: '/studio',   accent: '#72C4B2', desc: 'Software development' },
  { label: 'Services', href: '/services', accent: '#4DBFA8', desc: 'Ongoing support' },
  { label: 'Labs',     href: '/labs',     accent: '#7B6FE8', desc: 'Research & open source' },
  { label: 'Products', href: '/products', accent: '#E8916F', desc: 'AI-powered products' },
  { label: 'Academy',  href: '/academy',  accent: '#E8B84D', desc: 'Learning & training' },
  { label: 'Ventures', href: '/ventures', accent: '#6BA3E8', desc: 'Startup co-building' },
  { label: 'Cloud',    href: '/cloud',    accent: '#5BB5E0', desc: 'Managed hosting' },
];

const COMPANY_LINKS = [
  { label: 'About us',      href: '/about' },
  { label: 'Blog',          href: '/labs/blog' },
  { label: 'Careers',       href: '/careers' },
  { label: 'Contact',       href: '/contact' },
  { label: 'Partnerships',  href: '/partnerships' },
];

const LEGAL_LINKS = [
  { label: 'Legal',           href: '/legal' },
  { label: 'Privacy Policy',  href: '/legal#privacy' },
  { label: 'Terms of Service', href: '/legal#terms' },
  { label: 'Cookie Policy',   href: '/legal#cookies' },
];

function ColumnHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.68rem',
      fontWeight: 500,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      marginBottom: 18,
    }}>
      {children}
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.84rem',
        color: 'var(--text-muted)',
        transition: 'color 0.2s var(--ease)',
        display: 'block',
        lineHeight: 1,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
      }}
    >
      {children}
    </Link>
  );
}

export default function Footer({ division }: FooterProps) {
  const ctx = division ?? divisions.technology;

  return (
    <footer
      role="contentinfo"
      style={{
        background: 'var(--bg-2)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <Container>
        {/* ── Main grid ─────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16"
          style={{ paddingBlock: 'var(--space-4xl)' }}
        >
          {/* Brand column — 4 cols */}
          <div
            className="md:col-span-4"
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            <Logo division={ctx.slug} size="md" showWordmark href={ctx.url} />

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              lineHeight: 1.7,
              color: 'var(--text-muted)',
              maxWidth: '30ch',
            }}>
              AI builds. Humans architect. You scale.
              <br />
              Based in Dhaka, Bangladesh.
            </p>

            <a
              href="mailto:hello@sociofi.tech"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-body)',
                fontSize: '0.84rem',
                color: 'var(--text-muted)',
                transition: 'color 0.2s var(--ease)',
                width: 'fit-content',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
              }}
            >
              <Mail size={14} aria-hidden="true" />
              hello@sociofi.tech
            </a>

            {/* Start a project nudge */}
            <Link
              href="/contact"
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
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.gap = '10px';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.gap = '6px';
              }}
            >
              Start a project
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {/* Divisions column — 3 cols */}
          <div className="md:col-span-3">
            <ColumnHeader>Divisions</ColumnHeader>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {DIVISIONS_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.84rem',
                      color: 'var(--text-muted)',
                      transition: 'color 0.2s var(--ease)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = item.accent;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                    }}
                  >
                    <span style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: item.accent,
                      flexShrink: 0,
                      opacity: 0.55,
                    }} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column — 2 cols */}
          <div className="md:col-span-2">
            <ColumnHeader>Company</ColumnHeader>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {COMPANY_LINKS.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column — 3 cols */}
          <div className="md:col-span-3">
            <ColumnHeader>Legal</ColumnHeader>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>

            {/* Built-with badge */}
            <div style={{
              marginTop: 28,
              padding: '10px 14px',
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 4,
              }}>
                Built with
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '-0.01em',
              }}>
                AI agents + human engineers
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────── */}
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
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: ctx.accent,
                flexShrink: 0,
              }} aria-hidden="true" />
              {ctx.name}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
