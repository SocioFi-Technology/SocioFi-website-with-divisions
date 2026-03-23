/**
 * ScribeIcon — Inline SVG logo for the SCRIBE AI content agent.
 *
 * A pen-nib with three small node dots (suggesting AI authorship).
 * Stroke-only, scales via the `size` prop, works inside any circle wrapper.
 */
const C = '#7B6FE8';

export function ScribeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={C}
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Pen body — diagonal stroke from top-right to bottom-left */}
      <path d="M17 3a2 2 0 0 1 2.83 2.83L8 17.66 4 20l2.34-4L17 3z" />
      {/* Pen highlight — inner edge of the nib */}
      <path d="M14.5 5.5l4 4" />
      {/* Three AI node dots — forming a small triangle in the top-left */}
      <circle cx="3.5" cy="10.5" r="0.9" fill={C} stroke="none" />
      <circle cx="3"   cy="8"    r="0.7" fill={C} stroke="none" />
      <circle cx="5.5" cy="8.5"  r="0.7" fill={C} stroke="none" />
    </svg>
  );
}
