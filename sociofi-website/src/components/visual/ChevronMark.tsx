interface ChevronMarkProps {
  /** Overall render size in px */
  size?: number;
  /** Accent color for the right (teal) chevron */
  color?: string;
  /** Opacity — keep low (0.03–0.08) for watermark use */
  opacity?: number;
  /** Add animate-spin-slow CSS animation */
  animate?: boolean;
  className?: string;
}

export default function ChevronMark({
  size = 320,
  color = 'var(--division-accent)',
  opacity = 0.05,
  animate = false,
  className = '',
}: ChevronMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      width={size}
      height={size}
      className={`${animate ? 'animate-spin-slow' : ''} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <path
        d="M25 15L55 50L25 85"
        stroke="var(--navy-bright, #4A6CB8)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M45 15L75 50L45 85"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
