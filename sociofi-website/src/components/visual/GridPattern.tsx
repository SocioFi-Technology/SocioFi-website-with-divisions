interface GridPatternProps {
  className?: string;
  /** 'lines' (default) or 'dots' */
  variant?: 'lines' | 'dots';
  size?: number;
  /** Fade edges with a radial mask */
  fade?: boolean;
  id?: string;
}

export default function GridPattern({
  className = '',
  variant = 'lines',
  size = 80,
  fade = true,
  id = 'gp',
}: GridPatternProps) {
  const patternId = `${id}-pat`;
  const maskId = `${id}-mask`;
  const fadeId = `${id}-fade`;

  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <defs>
        {variant === 'lines' ? (
          <pattern
            id={patternId}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${size} 0 L 0 0 0 ${size}`}
              fill="none"
              stroke="var(--grid-color)"
              strokeWidth="1"
            />
          </pattern>
        ) : (
          <pattern
            id={patternId}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r="1.5"
              fill="var(--grid-color)"
            />
          </pattern>
        )}

        {fade && (
          <>
            <radialGradient id={fadeId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id={maskId}>
              <rect width="100%" height="100%" fill={`url(#${fadeId})`} />
            </mask>
          </>
        )}
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        mask={fade ? `url(#${maskId})` : undefined}
      />
    </svg>
  );
}
