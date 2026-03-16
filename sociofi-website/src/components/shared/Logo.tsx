'use client';

import Link from 'next/link';
import { getDivision, type DivisionSlug, type LogoModifier } from '@/lib/divisions';

interface LogoProps {
  division?: DivisionSlug | string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  href?: string;
  className?: string;
}

const sizeMap = {
  sm: { mark: 28, wordmark: 14, sub: 10, gap: 8 },
  md: { mark: 40, wordmark: 18, sub: 11, gap: 10 },
  lg: { mark: 56, wordmark: 24, sub: 13, gap: 12 },
};

// ── Division modifier elements (rendered inside the 48×48 SVG) ──────────────
// Modifier area: right side of mark, roughly x 33–46, y 12–36

function modifierElements(modifier: LogoModifier, accent: string) {
  switch (modifier) {
    // Studio — crosshair with ring
    case 'corner-brackets':
      return (
        <>
          <line x1="38" y1="14" x2="38" y2="34" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="34" y1="24" x2="42" y2="24" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="38" cy="24" r="3.5" stroke={accent} strokeWidth="1.5" fill="none" />
          <circle cx="38" cy="24" r="1.2" fill={accent} />
        </>
      );

    // Services — signal arcs
    case 'signal-arcs':
      return (
        <>
          <circle cx="35" cy="24" r="1.5" fill={accent} />
          <path d="M35 24 A4 4 0 0 1 39 20" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M34 24 A7 7 0 0 1 41 17" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M33 24 A10 10 0 0 1 43 14" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
        </>
      );

    // Labs — particle dots
    case 'particle-dots':
      return (
        <>
          <circle cx="38" cy="14" r="2.5" fill={accent} />
          <circle cx="42" cy="22" r="1.8" fill={accent} opacity="0.8" />
          <circle cx="38" cy="30" r="2" fill={accent} opacity="0.6" />
          <circle cx="43" cy="32" r="1.2" fill={accent} opacity="0.4" />
        </>
      );

    // Products — stacked diamonds
    case 'stacked-diamonds':
      return (
        <>
          <path d="M38 16 L42 20 L38 24 L34 20Z" stroke={accent} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
          <path d="M38 20 L42 24 L38 28 L34 24Z" stroke={accent} strokeWidth="1.4" fill="none" strokeLinejoin="round" opacity="0.65" />
          <path d="M38 24 L42 28 L38 32 L34 28Z" stroke={accent} strokeWidth="1.4" fill="none" strokeLinejoin="round" opacity="0.35" />
        </>
      );

    // Academy — open book with rays
    case 'open-book':
      return (
        <>
          <line x1="38" y1="34" x2="38" y2="17" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M38 17 Q31 18 30 33 L38 34" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M38 17 Q45 18 46 33 L38 34" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.55" />
          <line x1="38" y1="13" x2="38" y2="10" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          <line x1="35" y1="14" x2="33" y2="11" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <line x1="41" y1="14" x2="43" y2="11" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        </>
      );

    // Ventures — ascending branch
    case 'ascending-branch':
      return (
        <>
          <path d="M38 38 L38 16" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M38 28 L28 18" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          <path d="M38 22 L46 14" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
          <circle cx="38" cy="38" r="2" fill={accent} />
          <circle cx="28" cy="18" r="1.6" fill={accent} opacity="0.7" />
          <circle cx="46" cy="14" r="1.4" fill={accent} opacity="0.5" />
        </>
      );

    // Cloud — stacked lines with arrow
    case 'stacked-lines':
      return (
        <>
          <line x1="33" y1="17" x2="44" y2="17" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
          <line x1="33" y1="23" x2="42" y2="23" stroke={accent} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
          <line x1="33" y1="29" x2="39" y2="29" stroke={accent} strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
          <path d="M45 14 L45 20" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M42 17 L45 14 L48 17" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );

    default:
      return null;
  }
}

// ── Main Logo ────────────────────────────────────────────────────────────────

export default function Logo({
  division = 'technology',
  size = 'md',
  showWordmark = true,
  href = '/',
  className = '',
}: LogoProps) {
  const config = getDivision(division);
  const dims = sizeMap[size];
  const accent = config.accent;
  const isParent = division === 'technology';
  const divisionLabel = isParent ? null : config.name.replace('SocioFi ', '');

  // Division logos shift the right chevron left to make room for the modifier
  const leftChevron  = isParent ? 'M11 12 L23 24 L11 36' : 'M10 12 L22 24 L10 36';
  const rightChevron = isParent ? 'M23 12 L35 24 L23 36' : 'M20 12 L32 24 L20 36';

  const mark = (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      width={dims.mark}
      height={dims.mark}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Left chevron — navy */}
      <path
        d={leftChevron}
        stroke="#4A6CB8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right chevron — division accent */}
      <path
        d={rightChevron}
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Division modifier */}
      {!isParent && modifierElements(config.modifier, accent)}
    </svg>
  );

  const wordmark = showWordmark && (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display, Syne, sans-serif)',
          fontWeight: 800,
          fontSize: dims.wordmark,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        SocioFi
      </span>
      {divisionLabel && (
        <span
          style={{
            fontFamily: 'var(--font-display, Syne, sans-serif)',
            fontWeight: 500,
            fontSize: dims.sub,
            color: accent,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          {divisionLabel}
        </span>
      )}
    </span>
  );

  return (
    <Link
      href={href}
      style={{ textDecoration: 'none', display: 'inline-flex' }}
      aria-label={`${config.name} — Home`}
    >
      <span
        style={{ display: 'inline-flex', alignItems: 'center', gap: dims.gap }}
        className={className}
      >
        {mark}
        {wordmark}
      </span>
    </Link>
  );
}
