import Container from '@/components/shared/Container';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { Check } from '@/lib/icons';

export interface ComparisonRow {
  feature: string;
  /** One value per column (after the feature column) */
  values: (boolean | string)[];
  /** Visually separate this row from the next */
  divider?: boolean;
}

interface ComparisonTableProps {
  /** Column headers (first is always the feature label column) */
  headers: string[];
  rows: ComparisonRow[];
  /** Zero-based index of the column to highlight (default: 1) */
  highlightColumn?: number;
  accentColor?: string;
  className?: string;
}

function CellValue({
  value,
  isHighlight,
  accent,
}: {
  value: boolean | string;
  isHighlight: boolean;
  accent: string;
}) {
  if (typeof value === 'boolean') {
    return value ? (
      <span style={{ color: accent, display: 'inline-flex' }} aria-label="Included">
        <Check size={18} strokeWidth={2.2} />
      </span>
    ) : (
      <span style={{ color: 'var(--text-muted)', display: 'inline-flex' }} aria-label="Not included">
        <svg viewBox="0 0 24 24" fill="none" width={18} height={18}
          stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </span>
    );
  }
  return (
    <span style={{
      fontFamily: 'var(--font-body)',
      fontSize: '0.9rem',
      color: isHighlight ? 'var(--text-primary)' : 'var(--text-secondary)',
      fontWeight: isHighlight ? 500 : 400,
    }}>
      {value}
    </span>
  );
}

export default function ComparisonTable({
  headers,
  rows,
  highlightColumn = 1,
  accentColor,
  className = '',
}: ComparisonTableProps) {
  const accent = accentColor ?? 'var(--division-accent)';
  // highlightColumn is 1-based in the full table (0 = feature col, 1 = first data col)

  return (
    <div className={className}>
      <ScrollReveal>
        {/* Horizontal scroll wrapper for mobile */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table
            style={{
              width: '100%',
              minWidth: 560,
              borderCollapse: 'separate',
              borderSpacing: 0,
            }}
          >
            {/* ── Header ──────────────────────────────────────────────── */}
            <thead>
              <tr>
                {headers.map((header, colIdx) => {
                  const isFeatureCol = colIdx === 0;
                  const isHighlight = colIdx === highlightColumn;
                  return (
                    <th
                      key={colIdx}
                      scope="col"
                      style={{
                        padding: isFeatureCol ? '16px 20px 16px 0' : '16px 20px',
                        textAlign: isFeatureCol ? 'left' : 'center',
                        fontFamily: isFeatureCol ? 'var(--font-mono)' : 'var(--font-display)',
                        fontSize: isFeatureCol ? '0.7rem' : '0.95rem',
                        fontWeight: isFeatureCol ? 500 : 700,
                        letterSpacing: isFeatureCol ? '0.1em' : '-0.01em',
                        color: isHighlight
                          ? accent
                          : isFeatureCol
                          ? 'var(--text-muted)'
                          : 'var(--text-primary)',
                        textTransform: isFeatureCol ? 'uppercase' : undefined,
                        // Highlight column top accent
                        borderTop: isHighlight ? `3px solid ${accent}` : '3px solid transparent',
                        background: isHighlight
                          ? `color-mix(in srgb, ${accent} 6%, transparent)`
                          : undefined,
                        borderRadius: isHighlight ? 'var(--radius-sm) var(--radius-sm) 0 0' : undefined,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {header}
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* ── Body ────────────────────────────────────────────────── */}
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {/* Feature label */}
                  <td
                    style={{
                      padding: '14px 20px 14px 0',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      borderTop: '1px solid var(--border)',
                      paddingTop: row.divider ? 24 : 14,
                    }}
                  >
                    {row.feature}
                  </td>

                  {/* Data cells */}
                  {row.values.map((val, colIdx) => {
                    const isHighlight = colIdx + 1 === highlightColumn;
                    return (
                      <td
                        key={colIdx}
                        style={{
                          padding: '14px 20px',
                          textAlign: 'center',
                          borderTop: '1px solid var(--border)',
                          background: isHighlight
                            ? `color-mix(in srgb, ${accent} 4%, transparent)`
                            : undefined,
                          paddingTop: row.divider ? 24 : 14,
                        }}
                      >
                        <CellValue value={val} isHighlight={isHighlight} accent={accent} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </div>
  );
}
