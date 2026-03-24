'use client';

import { useState } from 'react';
import Link from 'next/link';
import { divisionList, type Division, type LogoModifier } from '@/lib/divisions';
import { ArrowRight } from '@/lib/icons';
import { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';

// ── Per-division logo icons ────────────────────────────────────────────────────
// Each modifier maps to a distinct SVG mark that communicates the division's identity.

function DivisionLogoIcon({
  modifier,
  accent,
  size = 44,
}: {
  modifier: LogoModifier;
  accent: string;
  size?: number;
}) {
  const navy = 'var(--navy-bright, #4A6CB8)';

  const icons: Record<LogoModifier, React.ReactNode> = {
    // Technology (parent) — double chevron >>
    none: (
      <>
        <path d="M22 16L38 50L22 84" stroke={navy} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M46 16L62 50L46 84" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),

    // Studio — corner brackets [ ]
    'corner-brackets': (
      <>
        <path d="M14 28L14 14L28 14" stroke={navy} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M72 14L86 14L86 28" stroke={navy} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 72L14 86L28 86" stroke={accent} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M86 72L86 86L72 86" stroke={accent} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),

    // Agents — node network (3 dots connected by lines)
    'agent-node-network': (
      <>
        <circle cx="50" cy="18" r="7" fill={accent} />
        <circle cx="18" cy="74" r="7" fill={navy} />
        <circle cx="82" cy="74" r="7" fill={navy} />
        <line x1="50" y1="25" x2="20" y2="67" stroke={navy} strokeWidth="5" strokeLinecap="round" />
        <line x1="50" y1="25" x2="80" y2="67" stroke={navy} strokeWidth="5" strokeLinecap="round" />
        <line x1="25" y1="74" x2="75" y2="74" stroke={accent} strokeWidth="5" strokeLinecap="round" />
      </>
    ),

    // Services — signal arcs (wifi-style)
    'signal-arcs': (
      <>
        <circle cx="50" cy="78" r="6" fill={accent} />
        <path d="M33 62 Q50 46 67 62" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M20 48 Q50 22 80 48" stroke={navy} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
        <path d="M9 34 Q50 0 91 34" stroke={navy} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.4" />
      </>
    ),

    // Cloud — stacked horizontal lines with arrow
    'stacked-lines': (
      <>
        <line x1="14" y1="32" x2="72" y2="32" stroke={navy} strokeWidth="7" strokeLinecap="round" />
        <line x1="14" y1="50" x2="72" y2="50" stroke={accent} strokeWidth="7" strokeLinecap="round" />
        <line x1="14" y1="68" x2="58" y2="68" stroke={navy} strokeWidth="7" strokeLinecap="round" opacity="0.6" />
        <path d="M64 60L82 68L64 76" stroke={accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),

    // Academy — open book
    'open-book': (
      <>
        <path d="M50 25 L50 80" stroke={accent} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M50 25 C50 25 36 22 18 30 L18 80 C36 72 50 75 50 75" stroke={navy} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M50 25 C50 25 64 22 82 30 L82 80 C64 72 50 75 50 75" stroke={accent} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ),

    // Ventures — ascending branch
    'ascending-branch': (
      <>
        <line x1="22" y1="85" x2="22" y2="42" stroke={navy} strokeWidth="6.5" strokeLinecap="round" />
        <path d="M22 62 L50 44" stroke={navy} strokeWidth="6.5" strokeLinecap="round" />
        <line x1="50" y1="44" x2="50" y2="28" stroke={accent} strokeWidth="6.5" strokeLinecap="round" />
        <path d="M50 38 L74 22" stroke={accent} strokeWidth="6.5" strokeLinecap="round" />
        <circle cx="74" cy="20" r="5" fill={accent} />
        <circle cx="22" cy="85" r="5" fill={navy} />
      </>
    ),

    // Labs — particle dots (scattered, varying sizes)
    'particle-dots': (
      <>
        <circle cx="26" cy="28" r="5.5" fill={accent} />
        <circle cx="72" cy="22" r="8" fill={accent} opacity="0.6" />
        <circle cx="82" cy="62" r="6" fill={navy} />
        <circle cx="44" cy="68" r="4" fill={navy} opacity="0.7" />
        <circle cx="18" cy="72" r="4.5" fill={accent} opacity="0.5" />
        <circle cx="60" cy="46" r="3.5" fill={navy} opacity="0.5" />
        <circle cx="34" cy="48" r="7" fill={navy} opacity="0.3" />
      </>
    ),

    // Stacked diamonds (products — not in main grid but defined)
    'stacked-diamonds': (
      <>
        <path d="M50 14L70 34L50 54L30 34Z" stroke={accent} strokeWidth="5.5" fill="none" strokeLinejoin="round" />
        <path d="M50 46L70 66L50 86L30 66Z" stroke={navy} strokeWidth="5.5" fill="none" strokeLinejoin="round" opacity="0.5" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 100 100" fill="none" width={size} height={size} aria-hidden="true">
      {icons[modifier] ?? icons['none']}
    </svg>
  );
}

// ── Division Card ─────────────────────────────────────────────────────────────

function DivisionCard({
  division,
  variant = 'default',
}: {
  division: Division;
  variant?: 'hero' | 'featured' | 'default';
}) {
  const [hovered, setHovered] = useState(false);
  const accent = division.accent;
  const isHero = variant === 'hero';
  const isFeatured = variant === 'featured';

  return (
    <Link
      href={division.url}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          background: isHero
            ? `linear-gradient(135deg, var(--bg-card) 0%, ${accent}0A 100%)`
            : 'var(--bg-card)',
          border: `1px solid ${hovered ? accent + '45' : isHero ? accent + '20' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: isHero ? '40px 48px' : isFeatured ? '36px 40px' : '28px 32px',
          height: '100%',
          display: 'flex',
          flexDirection: isHero ? 'row' : 'column',
          alignItems: isHero ? 'center' : 'flex-start',
          gap: isHero ? 48 : isFeatured ? 20 : 16,
          overflow: 'hidden',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered
            ? `0 20px 48px rgba(0,0,0,0.18), 0 0 0 1px ${accent}22`
            : isHero
            ? `var(--card-shadow), 0 0 0 1px ${accent}10`
            : 'var(--card-shadow)',
          transition: 'transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.25s',
        }}
      >
        {/* Gradient top stripe */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            background: `linear-gradient(90deg, var(--navy), ${accent})`,
            opacity: isHero || hovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Background glow orb */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-20%', right: '-15%',
            width: isHero ? 320 : isFeatured ? 260 : 200,
            height: isHero ? 320 : isFeatured ? 260 : 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
            opacity: hovered ? (isHero ? 0.1 : 0.08) : isHero ? 0.06 : 0.04,
            filter: 'blur(40px)',
            transition: 'opacity 0.4s',
            pointerEvents: 'none',
          }}
        />

        {/* Logo icon */}
        <div style={{ flexShrink: 0 }}>
          <DivisionLogoIcon
            modifier={division.modifier}
            accent={accent}
            size={isHero ? 64 : isFeatured ? 52 : 44}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Subtitle / tagline */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            fontWeight: 500,
            color: accent,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: '0 0 6px',
          }}>
            {division.subtitle}
          </p>

          {/* Division name */}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isHero ? '1.6rem' : isFeatured ? '1.3rem' : '1.1rem',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            margin: '0 0 10px',
          }}>
            {division.name}
          </h3>

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: isHero ? '1rem' : isFeatured ? '0.95rem' : '0.88rem',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            margin: 0,
            maxWidth: isHero ? 480 : undefined,
          }}>
            {division.description}
          </p>

          {/* CTA */}
          {division.cta && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: hovered ? 10 : 6,
              marginTop: isHero ? 24 : 16,
              fontFamily: 'var(--font-display)',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: accent,
              transition: 'gap 0.2s var(--ease)',
            }}>
              {division.cta.label}
              <ArrowRight size={14} color={accent} />
            </div>
          )}

          {/* Hero: "Explore all divisions" link instead of CTA */}
          {!division.cta && isHero && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: hovered ? 10 : 6,
              marginTop: 24,
              fontFamily: 'var(--font-display)',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: accent,
              transition: 'gap 0.2s var(--ease)',
            }}>
              Explore all divisions
              <ArrowRight size={14} color={accent} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Grid Layout ───────────────────────────────────────────────────────────────

export default function DivisionGrid({ className = '' }: { className?: string }) {
  // divisionList is already in the correct order: technology, studio, agents, services, cloud, academy, ventures, labs
  const [parent, studio, agents, services, cloud, academy, ventures, labs] = divisionList;

  return (
    <div className={className}>
      <StaggerChildren>

        {/* Row 1: Parent — full-width hero card */}
        <StaggerItem className="mb-5">
          <DivisionCard division={parent} variant="hero" />
        </StaggerItem>

        {/* Row 2: Studio (featured 2-col) + Agents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <StaggerItem className="md:col-span-2">
            <DivisionCard division={studio} variant="featured" />
          </StaggerItem>
          <StaggerItem>
            <DivisionCard division={agents} variant="featured" />
          </StaggerItem>
        </div>

        {/* Row 3: Services, Cloud (3-col, cloud spans 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <StaggerItem>
            <DivisionCard division={services} />
          </StaggerItem>
          <StaggerItem className="md:col-span-2">
            <DivisionCard division={cloud} variant="featured" />
          </StaggerItem>
        </div>

        {/* Row 4: Academy, Ventures, Labs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StaggerItem>
            <DivisionCard division={academy} />
          </StaggerItem>
          <StaggerItem>
            <DivisionCard division={ventures} />
          </StaggerItem>
          <StaggerItem>
            <DivisionCard division={labs} />
          </StaggerItem>
        </div>

      </StaggerChildren>
    </div>
  );
}
