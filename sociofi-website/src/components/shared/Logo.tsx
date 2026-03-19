'use client';

import Link from 'next/link';
import { getDivision, type DivisionSlug, type LogoModifier } from '@/lib/divisions';

interface LogoProps {
  division?: DivisionSlug | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  href?: string;
  className?: string;
}

const sizeMap = {
  xs: { mark: 18, wordmark: 12, sub: 9,  gap: 6  },
  sm: { mark: 28, wordmark: 14, sub: 10, gap: 8  },
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

    // Services — 3 concentric arcs radiating from apex (32,24) at ±55°
    // Radii 7/11/15 scaled from HTML spec 22/36/52 to fit 48×48 viewBox
    case 'signal-arcs':
      return (
        <>
          <path d="M 36.0 18.3 A 7 7 0 0 1 36.0 29.7" stroke={accent} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
          <path d="M 38.3 15.0 A 11 11 0 0 1 38.3 33.0" stroke={accent} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M 40.6 11.7 A 15 15 0 0 1 40.6 36.3" stroke={accent} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.22" />
          <circle cx="32" cy="24" r="3" fill={accent} opacity="0.85" />
          <circle cx="32" cy="24" r="5.5" stroke={accent} strokeWidth="1.2" fill="none" opacity="0.3" />
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

    // Products — three stacked diamonds (vertical stack, back-to-front render)
    // D1 (front/top, strongest) at y=16, D2 (mid) at y=23, D3 (ghost) at y=30
    // Top vertex of D1 = shipped-state dot + halo
    case 'stacked-diamonds':
      return (
        <>
          {/* Dashed connector: apex → D1 left vertex */}
          <line x1="32" y1="24" x2="33" y2="16" stroke={accent} strokeWidth="0.8" strokeLinecap="round" strokeDasharray="1.5 2.5" opacity="0.18" />
          {/* D3 — back/ghost (drawn first = behind) */}
          <path d="M39 26 L43 30 L39 34 L35 30 Z" stroke={accent} strokeWidth="1.2" strokeLinejoin="round" fill="none" opacity="0.22" />
          {/* D2 — mid */}
          <path d="M39 18 L44 23 L39 28 L34 23 Z" stroke={accent} strokeWidth="1.6" strokeLinejoin="round" fill={`${accent}0D`} opacity="0.5" />
          {/* D1 — front (drawn last = on top) */}
          <path d="M39 10 L45 16 L39 22 L33 16 Z" stroke={accent} strokeWidth="2" strokeLinejoin="round" fill={`${accent}14`} opacity="0.9" />
          {/* Shipped state dot at D1 top vertex */}
          <circle cx="39" cy="10" r="2.2" fill={accent} opacity="0.9" />
          {/* Halo ring */}
          <circle cx="39" cy="10" r="4" stroke={accent} strokeWidth="1.2" fill="none" opacity="0.22" />
          {/* D1 centre dot */}
          <circle cx="39" cy="16" r="1.2" fill={accent} opacity="0.4" />
          {/* Apex ghost */}
          <circle cx="32" cy="24" r="2" fill={accent} opacity="0.18" />
        </>
      );

    // Academy — open book (two tapered pages + spine + page rules) + 3 upward rays + tip dots
    // Book: centre spine x=39, crown y=12, bottom y=25. Left page tapers left, right tapers right.
    case 'open-book':
      return (
        <>
          {/* Left page */}
          <path d="M39 12 L32 15 L33 25 L39 25 Z"
            stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            fill={`${accent}14`} opacity="0.9" />
          {/* Right page */}
          <path d="M39 12 L46 15 L45 25 L39 25 Z"
            stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            fill={`${accent}0C`} opacity="0.75" />
          {/* Spine */}
          <line x1="39" y1="12" x2="39" y2="25" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          {/* Page rules — left */}
          <line x1="33.5" y1="18" x2="37.5" y2="17.5" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.4" />
          <line x1="34" y1="21.5" x2="37.5" y2="21.5" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.25" />
          {/* Page rules — right */}
          <line x1="40.5" y1="17.5" x2="44.5" y2="18" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.35" />
          <line x1="40.5" y1="21.5" x2="44.5" y2="21.5" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.22" />
          {/* Centre ray — strongest */}
          <line x1="39" y1="12" x2="39" y2="5" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
          {/* Left ray — 30° from vertical */}
          <line x1="36" y1="13.5" x2="32" y2="7" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
          {/* Right ray — 30° from vertical */}
          <line x1="42" y1="13.5" x2="46" y2="7" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
          {/* Tip dots */}
          <circle cx="39" cy="4" r="2" fill={accent} opacity="0.9" />
          <circle cx="31" cy="6" r="1.5" fill={accent} opacity="0.5" />
          <circle cx="47" cy="6" r="1.5" fill={accent} opacity="0.4" />
          {/* Apex glow — links chevron to modifier */}
          <circle cx="32" cy="24" r="2.5" fill={accent} opacity="0.3" />
        </>
      );

    // Ventures — ascending fork: trunk from ground → fork node → two diverging branches
    // L branch (primary, 85%) = founder's path; R branch (secondary, 55%) = equity position
    case 'ascending-branch':
      return (
        <>
          {/* Ground base tick — entry anchor */}
          <line x1="38" y1="30" x2="44" y2="30" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.35" />
          {/* Trunk — rises from base to fork */}
          <line x1="41" y1="29" x2="41" y2="20" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
          {/* Fork node */}
          <circle cx="41" cy="20" r="1.6" fill={accent} opacity="0.95" />
          {/* Halo at fork */}
          <circle cx="41" cy="20" r="3" stroke={accent} strokeWidth="1.2" fill="none" opacity="0.25" />
          {/* Branch Left — primary (85% op) */}
          <line x1="41" y1="20" x2="36" y2="13" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
          {/* Branch Right — secondary (55% op) */}
          <line x1="41" y1="20" x2="46" y2="13" stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
          {/* Arrowhead Left */}
          <path d="M36 13 L38 17 L34 17 Z" fill={accent} opacity="0.85" />
          {/* Arrowhead Right */}
          <path d="M46 13 L47 17 L44 17 Z" fill={accent} opacity="0.5" />
          {/* Terminal dot Left */}
          <circle cx="36" cy="11" r="1.3" fill={accent} opacity="0.9" />
          {/* Terminal dot Right */}
          <circle cx="46" cy="11" r="0.9" fill={accent} opacity="0.55" />
          {/* Horizon dash — shared horizon line */}
          <line x1="36" y1="11" x2="46" y2="11" stroke={accent} strokeWidth="0.8" strokeLinecap="round" strokeDasharray="2 3" opacity="0.15" />
          {/* Apex ghost — links chevron to modifier */}
          <circle cx="32" cy="24" r="1.5" fill={accent} opacity="0.25" />
        </>
      );

    // Cloud — infrastructure stack (3 tapered layers) + deploy arrow punching through
    // L3 foundation (widest) → L2 app → L1 deploy surface (split); arrow rises from L3
    // centre, punches through L1 gap, terminates in deployed dot + halo above
    case 'stacked-lines':
      return (
        <>
          {/* Layer 3 — Foundation (widest, 90% op) */}
          <line x1="33" y1="32" x2="47" y2="32" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
          {/* Layer 2 — Application (65% op) */}
          <line x1="35" y1="26" x2="45" y2="26" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
          {/* Layer 1 — Deployment surface, split left of arrow */}
          <line x1="36" y1="20" x2="38" y2="20" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.38" />
          {/* Layer 1 — right of arrow */}
          <line x1="42" y1="20" x2="44" y2="20" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.38" />
          {/* Arrow shaft — originates at L3, punches through L1 */}
          <line x1="40" y1="31" x2="40" y2="20" stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.95" />
          {/* Arrowhead */}
          <path d="M37 20 L40 13 L43 20 Z" fill={accent} opacity="0.95" />
          {/* Terminal deployed dot */}
          <circle cx="40" cy="12" r="1.8" fill={accent} opacity="0.95" />
          {/* Halo ring */}
          <circle cx="40" cy="12" r="3.5" stroke={accent} strokeWidth="1.2" fill="none" opacity="0.22" />
          {/* Layer endpoint dots */}
          <circle cx="33" cy="32" r="1.5" fill={accent} opacity="0.5" />
          <circle cx="35" cy="26" r="1.2" fill={accent} opacity="0.35" />
          {/* Apex ghost — links chevron to modifier */}
          <circle cx="32" cy="24" r="2" fill={accent} opacity="0.18" />
        </>
      );

    // Agents — hexagonal orchestrator + satellite agent nodes
    // Hex: flat-top, r=5, centre (38,18). Nodes: A(38,9) B(44,26) C(32,30)
    case 'agent-node-network':
      return (
        <>
          {/* Connector from chevron apex to hex left vertex */}
          <line x1="32" y1="24" x2="33" y2="18" stroke={accent} strokeWidth="0.8" strokeLinecap="round" strokeDasharray="1.5 2.5" opacity="0.3" />
          {/* Pulse ring */}
          <circle cx="38" cy="18" r="9" stroke={accent} strokeWidth="0.8" fill="none" strokeDasharray="2 4" opacity="0.15" />
          {/* Connection C -> hex bottom-left (35.5,22.3) */}
          <line x1="32" y1="30" x2="35.5" y2="22.3" stroke={accent} strokeWidth="0.9" strokeLinecap="round" strokeDasharray="1.5 3" opacity="0.28" />
          {/* Connection B -> hex right vertex (43,18) */}
          <line x1="44" y1="26" x2="43" y2="18" stroke={accent} strokeWidth="1" strokeLinecap="round" opacity="0.45" />
          {/* Connection A -> hex top-right vertex (40.5,13.7) */}
          <line x1="38" y1="9" x2="40.5" y2="13.7" stroke={accent} strokeWidth="1" strokeLinecap="round" strokeDasharray="1.5 2.5" opacity="0.55" />
          {/* Hexagon orchestrator — flat-top r=5 centre(38,18) */}
          <path
            d="M43 18 L40.5 22.3 L35.5 22.3 L33 18 L35.5 13.7 L40.5 13.7 Z"
            stroke={accent} strokeWidth="1.6" strokeLinejoin="round"
            fill={`${accent}18`} opacity="0.9"
          />
          {/* Hex centre dot */}
          <circle cx="38" cy="18" r="1.5" fill={accent} opacity="0.7" />
          {/* Hex centre halo */}
          <circle cx="38" cy="18" r="4" stroke={accent} strokeWidth="0.8" fill="none" opacity="0.25" />
          {/* Node A — top (primary) */}
          <circle cx="38" cy="9" r="2.5" fill={accent} opacity="0.88" />
          <circle cx="38" cy="9" r="4.5" stroke={accent} strokeWidth="0.8" fill="none" opacity="0.2" />
          {/* Node B — right (secondary) */}
          <circle cx="44" cy="26" r="1.8" fill={accent} opacity="0.62" />
          <circle cx="44" cy="26" r="3.5" stroke={accent} strokeWidth="0.7" fill="none" opacity="0.15" />
          {/* Node C — lower (tertiary) */}
          <circle cx="32" cy="30" r="1.4" fill={accent} opacity="0.42" />
          {/* Apex ghost */}
          <circle cx="32" cy="24" r="2" fill={accent} opacity="0.16" />
        </>
      );

    default:
      return null;
  }
}

// ── LogoMark — SVG only, no Link wrapper ─────────────────────────────────────
// Use this when embedding the mark inside an existing interactive element (e.g. <a>)

export function LogoMark({
  division = 'technology',
  size = 'md',
}: {
  division?: DivisionSlug | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  const config = getDivision(division);
  const dims = sizeMap[size];
  const accent = config.accent;
  const isParent = division === 'technology';
  const leftChevron  = isParent ? 'M11 12 L23 24 L11 36' : 'M10 12 L22 24 L10 36';
  const rightChevron = isParent ? 'M23 12 L35 24 L23 36' : 'M20 12 L32 24 L20 36';
  const rightChevronColor = isParent ? '#72C4B2' : accent;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      width={dims.mark}
      height={dims.mark}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d={leftChevron} stroke="#4A6CB8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d={rightChevron} stroke={rightChevronColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {!isParent && modifierElements(config.modifier, accent)}
    </svg>
  );
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
  const divisionLabel = isParent ? 'Technology' : config.name.replace('SocioFi ', '');

  // Division logos shift the right chevron left to make room for the modifier
  const leftChevron  = isParent ? 'M11 12 L23 24 L11 36' : 'M10 12 L22 24 L10 36';
  const rightChevron = isParent ? 'M23 12 L35 24 L23 36' : 'M20 12 L32 24 L20 36';
  // Parent logo: right chevron uses teal-light to create the two-tone brand mark
  const rightChevronColor = isParent ? '#72C4B2' : accent;

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
      {/* Right chevron — teal for parent, division accent for divisions */}
      <path
        d={rightChevron}
        stroke={rightChevronColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Division modifier */}
      {!isParent && modifierElements(config.modifier, accent)}
    </svg>
  );

  // For division pages: mark + "SocioFi" links to /, division label links to division root
  // For parent (technology): single link to /
  if (!isParent && showWordmark) {
    return (
      <span
        style={{ display: 'inline-flex', alignItems: 'center', gap: dims.gap }}
        className={className}
      >
        {/* Mark → homepage */}
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', flexShrink: 0 }} aria-label="SocioFi Technology — Home">
          {mark}
        </Link>

        {/* Stacked wordmark: SocioFi → /, DIVISION → division root */}
        <span style={{ display: 'flex', flexDirection: 'column', gap: 1, lineHeight: 1 }}>
          <Link href="/" style={{ textDecoration: 'none' }} aria-label="SocioFi Technology — Home">
            <span style={{
              fontFamily: 'var(--font-syne, "Syne"), sans-serif',
              fontWeight: 800,
              fontSize: dims.wordmark,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              display: 'block',
            }}>
              SocioFi
            </span>
          </Link>
          <Link href={href} style={{ textDecoration: 'none' }} aria-label={config.name}>
            <span style={{
              fontFamily: 'var(--font-syne, "Syne"), sans-serif',
              fontWeight: 800,
              fontSize: dims.sub,
              color: accent,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1,
              display: 'block',
            }}>
              {divisionLabel}
            </span>
          </Link>
        </span>
      </span>
    );
  }

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
          fontFamily: 'var(--font-syne, "Syne"), sans-serif',
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
            fontFamily: 'var(--font-syne, "Syne"), sans-serif',
            fontWeight: 800,
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
