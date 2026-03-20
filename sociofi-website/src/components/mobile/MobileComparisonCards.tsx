'use client';

const STYLES = `
  .mcc-wrap { display: flex; flex-direction: column; gap: 12px; width: 100%; }
  .mcc-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }
  .mcc-card.highlight {
    border-color: var(--division-accent, var(--teal, #59A392));
    box-shadow: 0 0 0 1px var(--division-accent, var(--teal, #59A392))30;
  }
  .mcc-card.highlight::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--navy, #3A589E), var(--division-accent, var(--teal, #59A392)));
  }
  .mcc-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.62rem; font-weight: 500;
    color: var(--division-accent, var(--teal, #59A392));
    text-transform: uppercase; letter-spacing: 0.1em;
    margin-bottom: 12px;
  }
  .mcc-title {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 1.1rem; font-weight: 700;
    color: var(--text-primary); margin-bottom: 14px;
    letter-spacing: -0.01em;
  }
  .mcc-row {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 10px 0; border-bottom: 1px solid var(--border);
    gap: 12px;
  }
  .mcc-row:last-child { border-bottom: none; }
  .mcc-row-label {
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-size: 0.82rem; color: var(--text-muted); flex-shrink: 0;
  }
  .mcc-row-value {
    font-family: var(--font-body, 'Outfit', sans-serif);
    font-size: 0.88rem; font-weight: 500;
    color: var(--text-primary); text-align: right;
  }
`;

interface ComparisonRow {
  label: string;
  value: string;
}

interface ComparisonCard {
  title: string;
  highlighted?: boolean;
  badge?: string;
  rows: ComparisonRow[];
}

interface MobileComparisonCardsProps {
  cards: ComparisonCard[];
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 1l1.5 3 3 .5-2.2 2 .5 3L6 8l-2.8 1.5.5-3L1.5 4.5l3-.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export default function MobileComparisonCards({ cards }: MobileComparisonCardsProps) {
  // Highlighted card goes first
  const sorted = [...cards].sort((a, b) => (b.highlighted ? 1 : 0) - (a.highlighted ? 1 : 0));

  return (
    <>
      <style>{STYLES}</style>
      <div className="mcc-wrap">
        {sorted.map((card) => (
          <div key={card.title} className={`mcc-card${card.highlighted ? ' highlight' : ''}`}>
            {card.badge && (
              <div className="mcc-badge">
                <StarIcon />
                {card.badge}
              </div>
            )}
            <div className="mcc-title">{card.title}</div>
            {card.rows.map((row) => (
              <div key={row.label} className="mcc-row">
                <span className="mcc-row-label">{row.label}</span>
                <span className="mcc-row-value">{row.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
