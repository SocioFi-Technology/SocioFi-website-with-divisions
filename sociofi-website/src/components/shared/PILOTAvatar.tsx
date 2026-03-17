'use client';

interface PILOTAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mode?: 'dark' | 'light' | 'gradient' | 'accent';
  accentColor?: string;
  className?: string;
}

const SIZE_MAP = { sm: 24, md: 40, lg: 56, xl: 120 };

export default function PILOTAvatar({
  size = 'lg',
  mode = 'dark',
  accentColor = '#59A392',
  className = '',
}: PILOTAvatarProps) {
  const px = SIZE_MAP[size];
  const isAccentOrGradient = mode === 'gradient' || mode === 'accent';

  // Circle backgrounds
  const bgFill =
    mode === 'light'
      ? 'url(#pilot-bg-light)'
      : mode === 'gradient'
      ? 'url(#pilot-bg-gradient)'
      : mode === 'accent'
      ? accentColor
      : 'url(#pilot-bg-dark)';           // dark (default)

  // Chevron colors — two-toned unless on accent/gradient fill
  const chevronBack = isAccentOrGradient ? 'rgba(255,255,255,0.75)' : mode === 'light' ? '#3A589E' : '#4A6CB8';
  const chevronFront = isAccentOrGradient ? 'rgba(255,255,255,1)'   : mode === 'light' ? '#59A392' : '#72C4B2';

  // Ring / tick color
  const ringColor = isAccentOrGradient
    ? 'rgba(255,255,255,0.25)'
    : mode === 'light'
    ? 'rgba(58,88,158,0.25)'
    : 'rgba(89,163,146,0.25)';

  const showText = size === 'xl' || size === 'lg';

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PILOT"
    >
      <defs>
        {/* Dark background — deep navy */}
        <radialGradient id="pilot-bg-dark" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#1E2548" />
          <stop offset="100%" stopColor="#0C0E20" />
        </radialGradient>

        {/* Light background — soft white with a central glow */}
        <radialGradient id="pilot-bg-light" cx="50%" cy="40%" r="65%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E8ECF4" />
        </radialGradient>

        {/* Gradient background (brand navy→teal) */}
        <linearGradient id="pilot-bg-gradient" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#2C4478" />
          <stop offset="100%" stopColor="#59A392" />
        </linearGradient>

        {/* Subtle centre glow for dark/light */}
        <radialGradient id="pilot-glow-dark" cx="50%" cy="45%" r="45%">
          <stop offset="0%"   stopColor="#3A589E" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3A589E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pilot-glow-light" cx="50%" cy="45%" r="45%">
          <stop offset="0%"   stopColor="#59A392" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#59A392" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Background circle ── */}
      <circle cx="50" cy="50" r="50" fill={bgFill} />

      {/* ── Subtle centre glow ── */}
      {mode === 'dark' && <circle cx="50" cy="50" r="50" fill="url(#pilot-glow-dark)" />}
      {mode === 'light' && <circle cx="50" cy="50" r="50" fill="url(#pilot-glow-light)" />}

      {/* ── Compass ring + NSEW ticks (md and above) ── */}
      {size !== 'sm' && (
        <>
          {/* Inner compass ring */}
          <circle cx="50" cy="50" r="46" stroke={ringColor} strokeWidth="0.75" fill="none" />
          {/* N tick */}
          <line x1="50" y1="2"  x2="50" y2="8"  stroke={ringColor} strokeWidth="1.5" strokeLinecap="round" />
          {/* E tick */}
          <line x1="98" y1="50" x2="92" y2="50" stroke={ringColor} strokeWidth="1.5" strokeLinecap="round" />
          {/* S tick */}
          <line x1="50" y1="98" x2="50" y2="92" stroke={ringColor} strokeWidth="1.5" strokeLinecap="round" />
          {/* W tick */}
          <line x1="2"  y1="50" x2="8"  y2="50" stroke={ringColor} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}

      {/* ── Back chevron (navy / upper) ── */}
      <path
        d="M27 52 L50 28 L73 52"
        stroke={chevronBack}
        strokeWidth={size === 'sm' ? 4 : 3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Front chevron (teal / lower) ── */}
      <path
        d="M27 68 L50 44 L73 68"
        stroke={chevronFront}
        strokeWidth={size === 'sm' ? 4 : 3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── PILOT label (lg + xl) ── */}
      {showText && (
        <text
          x="50"
          y="88"
          textAnchor="middle"
          fill={isAccentOrGradient ? 'rgba(255,255,255,0.7)' : chevronFront}
          fontFamily="'Fira Code', monospace"
          fontSize={size === 'xl' ? 8 : 7}
          fontWeight="500"
          letterSpacing="4"
        >
          PILOT
        </text>
      )}
    </svg>
  );
}
