/**
 * Tailwind CSS safelist — do NOT import this in application code.
 * This file exists solely so the Tailwind content scanner finds all
 * responsive utility classes used across the 91-page site and includes
 * them in the compiled CSS output.
 */
export const _safelist = [
  // ── Responsive grid columns ─────────────────────────────────────────
  'sm:grid-cols-1', 'sm:grid-cols-2', 'sm:grid-cols-3', 'sm:grid-cols-4',
  'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4', 'md:grid-cols-5',
  'lg:grid-cols-1', 'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4', 'lg:grid-cols-5',
  'xl:grid-cols-2', 'xl:grid-cols-3', 'xl:grid-cols-4',

  // ── Column spans ─────────────────────────────────────────────────────
  'md:col-span-1', 'md:col-span-2', 'md:col-span-3', 'md:col-span-4', 'md:col-span-5',
  'lg:col-span-1', 'lg:col-span-2', 'lg:col-span-3', 'lg:col-span-4', 'lg:col-span-5',

  // ── Display ───────────────────────────────────────────────────────────
  'sm:hidden', 'sm:flex', 'sm:block',
  'md:hidden', 'md:flex', 'md:block', 'md:inline-flex', 'md:inline-block',
  'lg:hidden', 'lg:flex', 'lg:block', 'lg:inline-flex',
  'xl:hidden', 'xl:flex', 'xl:block',

  // ── Flex ─────────────────────────────────────────────────────────────
  'md:flex-row', 'md:flex-col', 'md:flex-wrap',
  'lg:flex-row', 'lg:flex-col',
  'md:items-start', 'md:items-center', 'md:items-end',
  'lg:items-start', 'lg:items-center',
  'md:justify-start', 'md:justify-center', 'md:justify-between', 'md:justify-end',
  'lg:justify-start', 'lg:justify-center', 'lg:justify-between',

  // ── Gap ──────────────────────────────────────────────────────────────
  'md:gap-4', 'md:gap-5', 'md:gap-6', 'md:gap-8', 'md:gap-10', 'md:gap-12', 'md:gap-16',
  'lg:gap-4', 'lg:gap-5', 'lg:gap-6', 'lg:gap-8', 'lg:gap-10', 'lg:gap-12', 'lg:gap-16', 'lg:gap-20',
  'xl:gap-8', 'xl:gap-12', 'xl:gap-16',

  // ── Padding / Margin ─────────────────────────────────────────────────
  'md:px-6', 'md:px-8', 'md:py-8', 'md:py-12', 'md:py-16',
  'lg:px-8', 'lg:py-12', 'lg:py-16', 'lg:py-20',

  // ── Text ─────────────────────────────────────────────────────────────
  'md:text-left', 'md:text-center', 'md:text-right',
  'lg:text-left', 'lg:text-center',

  // ── Width ────────────────────────────────────────────────────────────
  'md:w-full', 'md:w-auto', 'lg:w-full', 'lg:w-auto',
  'md:max-w-none', 'lg:max-w-none',

  // ── Alignment + positioning ──────────────────────────────────────────
  'lg:justify-end', 'lg:items-end',
  'md:self-start', 'md:self-center', 'lg:self-start',

  // ── Used in specific templates ────────────────────────────────────────
  'lg:col-span-3', // ConversionForm sidebar
  'mb-5',          // DivisionGrid spacing
];
