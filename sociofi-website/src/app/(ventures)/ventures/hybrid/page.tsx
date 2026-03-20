'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const A = '#6BA3E8';

const STYLES = `
  .hy-page {
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body, 'Outfit', sans-serif);
    min-height: 100vh;
    padding-top: 100px;
  }

  /* HERO */
  .hy-hero {
    text-align: center;
    padding: 80px 32px 100px;
    max-width: 800px;
    margin: 0 auto;
  }
  .hy-label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 20px;
  }
  .hy-label::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 1.5px;
    background: ${A};
  }
  .hy-h1 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary);
    margin: 0 0 24px;
  }
  .hy-subtitle {
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 620px;
    margin: 0 auto 40px;
  }
  .hy-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #3A589E 0%, ${A} 100%);
    color: #fff;
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 0.9rem;
    font-weight: 600;
    padding: 14px 28px;
    border-radius: 100px;
    text-decoration: none;
    box-shadow: 0 4px 24px rgba(107,163,232,0.35);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .hy-cta-btn:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(107,163,232,0.5);
  }

  /* SECTIONS */
  .hy-section {
    padding: 80px 32px;
    max-width: 1100px;
    margin: 0 auto;
  }
  .hy-section-alt {
    background: var(--bg-2);
    padding: 80px 0;
  }
  .hy-section-alt .hy-section {
    padding-top: 0;
    padding-bottom: 0;
  }
  .hy-sh2 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 0 0 16px;
  }
  .hy-sdesc {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.7;
    max-width: 600px;
    margin: 0 0 40px;
  }

  /* BALANCE SCALE */
  .hy-scale-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px 20px;
  }
  .hy-scale-svg {
    width: 100%;
    max-width: 520px;
    height: auto;
  }

  /* STEPS */
  .hy-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .hy-step {
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 24px;
    padding: 28px 0;
    border-bottom: 1px solid var(--border);
    align-items: flex-start;
  }
  .hy-step:last-child { border-bottom: none; }
  .hy-step-num {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1.5px solid ${A};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.82rem;
    font-weight: 500;
    color: ${A};
    flex-shrink: 0;
  }
  .hy-step h3 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }
  .hy-step p {
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.65;
  }

  /* TERMS TABLE */
  .hy-table-wrap {
    overflow-x: auto;
    border-radius: 16px;
    border: 1px solid var(--border);
  }
  .hy-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--bg-card);
    font-size: 0.9rem;
  }
  .hy-table th {
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 16px 24px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }
  .hy-table td {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
    line-height: 1.5;
  }
  .hy-table tr:last-child td { border-bottom: none; }
  .hy-table td:first-child {
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
  }
  .hy-table td:nth-child(2) {
    color: ${A};
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.84rem;
  }

  /* CALC CARDS */
  .hy-calc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 768px) { .hy-calc-grid { grid-template-columns: 1fr; } }
  .hy-calc-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }
  .hy-calc-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3A589E, ${A});
  }
  .hy-calc-card h3 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }
  .hy-calc-card .hy-calc-context {
    font-size: 0.82rem;
    color: var(--text-muted);
    margin: 0 0 20px;
    font-family: var(--font-mono, 'Fira Code', monospace);
  }
  .hy-calc-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.88rem;
  }
  .hy-calc-row:last-child { border-bottom: none; }
  .hy-calc-row-label { color: var(--text-secondary); }
  .hy-calc-row-value {
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.82rem;
    color: ${A};
    white-space: nowrap;
  }

  /* WHEN IT MAKES SENSE */
  .hy-when-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 768px) { .hy-when-grid { grid-template-columns: 1fr; } }
  .hy-when-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px;
  }
  .hy-when-icon {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    color: ${A};
    margin-top: 2px;
  }
  .hy-when-text {
    font-size: 0.92rem;
    color: var(--text-secondary);
    line-height: 1.65;
  }

  /* COMPARISON TABLE */
  .hy-comp-wrap {
    overflow-x: auto;
    border-radius: 16px;
    border: 1px solid var(--border);
  }
  .hy-comp-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--bg-card);
    font-size: 0.88rem;
  }
  .hy-comp-table th {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 0.88rem;
    font-weight: 700;
    padding: 14px 20px;
    text-align: left;
    border-bottom: 1px solid var(--border);
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .hy-comp-table th.active {
    color: ${A};
    background: rgba(107,163,232,0.06);
  }
  .hy-comp-table td {
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
    line-height: 1.5;
  }
  .hy-comp-table tr:last-child td { border-bottom: none; }
  .hy-comp-table td.active {
    background: rgba(107,163,232,0.04);
    color: var(--text-primary);
    font-weight: 500;
  }
  .hy-comp-table td:first-child {
    font-weight: 600;
    color: var(--text-primary);
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.8rem;
  }

  /* FAQ */
  .hy-faq {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }
  .hy-faq-item { border-bottom: 1px solid var(--border); }
  .hy-faq-item:last-child { border-bottom: none; }
  .hy-faq-btn {
    width: 100%;
    background: var(--bg-card);
    border: none;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    cursor: pointer;
    text-align: left;
    transition: background 0.2s;
  }
  .hy-faq-btn:hover { background: var(--bg-card-hover); }
  .hy-faq-q {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .hy-faq-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: ${A};
    transition: transform 0.3s ease;
  }
  .hy-faq-icon.open { transform: rotate(45deg); }
  .hy-faq-body {
    padding: 0 24px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease, padding 0.35s ease;
    background: var(--bg-card);
  }
  .hy-faq-body.open { max-height: 400px; padding: 0 24px 20px; }
  .hy-faq-a {
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.65;
  }

  /* CTA */
  .hy-cta-section {
    padding: 80px 32px;
    text-align: center;
    background: linear-gradient(135deg, rgba(58,88,158,0.12) 0%, rgba(107,163,232,0.08) 100%);
    border-top: 1px solid var(--border);
  }
  .hy-cta-h2 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    margin: 0 0 16px;
    color: var(--text-primary);
  }
  .hy-cta-sub {
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0 auto 32px;
    max-width: 480px;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    .hy-hero { padding: 60px 20px 80px; }
    .hy-section { padding: 60px 20px; }
    .hy-step { grid-template-columns: 40px 1fr; gap: 16px; }
  }
`;

function BalanceScale() {
  const ref = useRef<SVGGElement>(null);
  const [phase, setPhase] = useState<'idle' | 'tilt-left' | 'tilt-right' | 'balanced'>('idle');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase('tilt-left');
          setTimeout(() => setPhase('tilt-right'), 700);
          setTimeout(() => setPhase('balanced'), 1400);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const beamRotate =
    phase === 'tilt-left' ? -8 :
    phase === 'tilt-right' ? 8 :
    phase === 'balanced' ? 0 : 0;

  const transition = phase !== 'idle' ? 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)' : 'none';

  // Beam pivot at (260, 120)
  const pivotX = 260;
  const pivotY = 120;
  const beamHalf = 180;

  const leftEnd = { x: pivotX - beamHalf, y: pivotY };
  const rightEnd = { x: pivotX + beamHalf, y: pivotY };

  // Pan positions relative to beam ends (offset by rotation visually via group transform)
  return (
    <div className="hy-scale-wrap">
      <svg viewBox="0 0 520 300" className="hy-scale-svg" aria-label="Balance scale showing cash vs equity tradeoff">
        {/* Stand */}
        <line x1={pivotX} y1={pivotY} x2={pivotX} y2={260} stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx={pivotX} cy={262} rx={40} ry={8} fill="var(--bg-3)" />

        {/* Beam group (rotates around pivot) */}
        <g
          ref={ref}
          style={{
            transformOrigin: `${pivotX}px ${pivotY}px`,
            transform: `rotate(${beamRotate}deg)`,
            transition,
          }}
        >
          {/* Beam */}
          <line
            x1={pivotX - beamHalf}
            y1={pivotY}
            x2={pivotX + beamHalf}
            y2={pivotY}
            stroke="var(--text-secondary)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Pivot dot */}
          <circle cx={pivotX} cy={pivotY} r="7" fill={A} />

          {/* Left pan strings */}
          <line x1={pivotX - beamHalf} y1={pivotY} x2={pivotX - beamHalf - 20} y2={pivotY + 50} stroke="var(--text-muted)" strokeWidth="1.5" />
          <line x1={pivotX - beamHalf} y1={pivotY} x2={pivotX - beamHalf + 20} y2={pivotY + 50} stroke="var(--text-muted)" strokeWidth="1.5" />
          {/* Left pan */}
          <rect x={pivotX - beamHalf - 44} y={pivotY + 50} width="88" height="40" rx="8" fill="var(--bg-card)" stroke={A} strokeWidth="1.5" />
          {/* Left pan label */}
          <text x={pivotX - beamHalf} y={pivotY + 66} textAnchor="middle" fill={A} fontSize="10" fontFamily="var(--font-mono, 'Fira Code', monospace)" fontWeight="500">$$ CASH</text>
          <text x={pivotX - beamHalf} y={pivotY + 81} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-body, 'Outfit', sans-serif)">(30–50%)</text>

          {/* Right pan strings */}
          <line x1={pivotX + beamHalf} y1={pivotY} x2={pivotX + beamHalf - 20} y2={pivotY + 50} stroke="var(--text-muted)" strokeWidth="1.5" />
          <line x1={pivotX + beamHalf} y1={pivotY} x2={pivotX + beamHalf + 20} y2={pivotY + 50} stroke="var(--text-muted)" strokeWidth="1.5" />
          {/* Right pan */}
          <rect x={pivotX + beamHalf - 56} y={pivotY + 50} width="112" height="40" rx="8" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1.5" />
          {/* Right pan label */}
          <text x={pivotX + beamHalf} y={pivotY + 64} textAnchor="middle" fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono, 'Fira Code', monospace)" fontWeight="500">EQUITY /</text>
          <text x={pivotX + beamHalf} y={pivotY + 76} textAnchor="middle" fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono, 'Fira Code', monospace)" fontWeight="500">REV SHARE</text>
          <text x={pivotX + beamHalf} y={pivotY + 87} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-body, 'Outfit', sans-serif)">(smaller %)</text>
        </g>

        {/* Balanced label */}
        {phase === 'balanced' && (
          <text
            x={pivotX}
            y={290}
            textAnchor="middle"
            fill={A}
            fontSize="11"
            fontFamily="var(--font-mono, 'Fira Code', monospace)"
            fontWeight="500"
            style={{ animation: 'fadeIn 0.5s ease' }}
          >
            Balanced risk. Lower exposure on both sides.
          </text>
        )}
        <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
      </svg>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="hy-faq-item">
      <button className="hy-faq-btn" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="hy-faq-q">{q}</span>
        <svg className={`hy-faq-icon ${open ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <div className={`hy-faq-body ${open ? 'open' : ''}`}>
        <p className="hy-faq-a">{a}</p>
      </div>
    </div>
  );
}

const CheckIcon = () => (
  <svg className="hy-when-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const steps = [
  {
    heading: 'You pay 30-50% of the estimated Studio cost upfront',
    body: 'This covers a meaningful portion of the build. It reduces our risk, which means we can offer a smaller equity or revenue share percentage in return.',
  },
  {
    heading: 'SocioFi takes a smaller equity stake or revenue share',
    body: 'Equity option: 3-8% (versus 5-20% with pure equity). Revenue share option: 5-10% of revenue with a lower cap (versus 8-15% and a higher cap).',
  },
  {
    heading: 'Product is built to full Studio quality',
    body: 'Same AI-plus-human development process. Same engineering standards. The hybrid model doesn\'t mean a reduced scope or lower quality build.',
  },
  {
    heading: 'Both sides have lower risk than pure models',
    body: 'You pay less upfront than a full Studio project. We take a smaller stake than a pure equity deal. Lower exposure for everyone.',
  },
];

const faqs = [
  {
    q: 'How is the upfront amount calculated?',
    a: 'We start with the Studio-equivalent cost of your project and find an amount within your budget. If your budget is 40% of that cost, we use 40%. We find a number that works for both sides — there\'s no rigid formula.',
  },
  {
    q: 'Can I choose equity or revenue share for the back-end portion?',
    a: 'Yes. After the upfront is agreed, you choose whether the back-end is an equity stake or a revenue share arrangement. We\'ll give you a recommendation based on your situation, but the choice is yours.',
  },
  {
    q: 'What if I can pay more than 50%?',
    a: 'At that point, Studio is probably the cleaner option. We\'ll be honest with you: if you can cover 70%+ of the cost, a straight Studio project with no equity or revenue share is simpler and better for both sides.',
  },
  {
    q: 'Is hybrid available for all project types?',
    a: 'Yes, as long as the economics make sense. Very small projects (under $5K equivalent) are usually better served by Studio. Very large projects may need a custom structure. We\'ll assess during the intro call.',
  },
];

export default function HybridPage() {
  return (
    <>
      <style>{STYLES}</style>
      <main className="hy-page">

        {/* HERO */}
        <section className="hy-hero">
          <div className="hy-label">Hybrid Model</div>
          <h1 className="hy-h1">Hybrid: Split the Risk.</h1>
          <p className="hy-subtitle">
            You pay a reduced upfront fee. We take a smaller equity stake or revenue share. Both sides have lower exposure.
          </p>
          <Link href="/ventures/apply" className="hy-cta-btn">
            Apply with Hybrid Model
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </section>

        {/* BALANCE SCALE */}
        <div className="hy-section-alt">
          <div className="hy-section">
            <BalanceScale />
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section className="hy-section">
          <div className="hy-label">Process</div>
          <h2 className="hy-sh2">How it works</h2>
          <p className="hy-sdesc">Four steps to a lower-risk build for both sides.</p>
          <div className="hy-steps">
            {steps.map((step, i) => (
              <div key={i} className="hy-step">
                <div className="hy-step-num">0{i + 1}</div>
                <div>
                  <h3>{step.heading}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TERMS TABLE */}
        <div className="hy-section-alt">
          <div className="hy-section">
            <div className="hy-label">Terms</div>
            <h2 className="hy-sh2">Standard hybrid terms</h2>
            <p className="hy-sdesc">The split makes both sides more flexible.</p>
            <div className="hy-table-wrap">
              <table className="hy-table">
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Typical Range</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Upfront payment</td><td>30–50% of Studio cost</td><td>Paid before build begins</td></tr>
                  <tr><td>Equity option</td><td>3–8%</td><td>Lower than pure equity due to upfront contribution</td></tr>
                  <tr><td>Revenue share option</td><td>5–10%, lower cap</td><td>Reduced rate vs. pure revenue share model</td></tr>
                  <tr><td>Build scope</td><td>Full MVP / V1</td><td>Same Studio quality, no compromise</td></tr>
                  <tr><td>Code ownership</td><td>100% founder</td><td>Day one, regardless of structure</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CALCULATION EXAMPLES */}
        <section className="hy-section">
          <div className="hy-label">Examples</div>
          <h2 className="hy-sh2">What the numbers look like</h2>
          <p className="hy-sdesc">If the Studio-equivalent cost is $15K and you pay $6K upfront (40%):</p>
          <div className="hy-calc-grid">
            <div className="hy-calc-card">
              <h3>Equity option</h3>
              <div className="hy-calc-context">$15K project · $6K upfront (40%)</div>
              {[
                ['Equity stake', '~4–5%'],
                ['Pure equity (no upfront)', '8–12%'],
                ['Your upfront payment', '$6,000'],
                ['Saving vs. pure equity', 'Half the dilution'],
              ].map(([label, value], i) => (
                <div key={i} className="hy-calc-row">
                  <span className="hy-calc-row-label">{label}</span>
                  <span className="hy-calc-row-value">{value}</span>
                </div>
              ))}
            </div>
            <div className="hy-calc-card">
              <h3>Revenue share option</h3>
              <div className="hy-calc-context">$15K project · $6K upfront (40%)</div>
              {[
                ['Revenue share %', '~6%'],
                ['Payment cap', '~$22K'],
                ['Pure rev-share (no upfront)', '10%, cap $45K'],
                ['Your upfront payment', '$6,000'],
              ].map(([label, value], i) => (
                <div key={i} className="hy-calc-row">
                  <span className="hy-calc-row-label">{label}</span>
                  <span className="hy-calc-row-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHEN IT MAKES SENSE */}
        <div className="hy-section-alt">
          <div className="hy-section">
            <div className="hy-label">Fit</div>
            <h2 className="hy-sh2">When hybrid makes sense</h2>
            <div className="hy-when-grid" style={{ marginTop: '32px' }}>
              <div className="hy-when-item">
                <CheckIcon />
                <span className="hy-when-text">You have some budget but not enough for full Studio pricing. Hybrid bridges that gap without requiring pure equity.</span>
              </div>
              <div className="hy-when-item">
                <CheckIcon />
                <span className="hy-when-text">You want to minimize equity dilution but can&apos;t cover the full build cost. Pay what you can upfront, give up less equity.</span>
              </div>
              <div className="hy-when-item">
                <CheckIcon />
                <span className="hy-when-text">Lower risk tolerance on both sides. Neither party wants maximum exposure — hybrid reduces the stakes for everyone.</span>
              </div>
              <div className="hy-when-item">
                <CheckIcon />
                <span className="hy-when-text">Product has moderate (not explosive) growth potential. Pure equity bets work best for high-upside markets. Hybrid fits steady builders.</span>
              </div>
            </div>
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <section className="hy-section">
          <div className="hy-label">Comparison</div>
          <h2 className="hy-sh2">How hybrid stacks up</h2>
          <div className="hy-comp-wrap" style={{ marginTop: '32px' }}>
            <table className="hy-comp-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Equity</th>
                  <th>Revenue Share</th>
                  <th className="active">Hybrid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Upfront cost</td>
                  <td>$0</td>
                  <td>$0</td>
                  <td className="active">30–50% of Studio cost</td>
                </tr>
                <tr>
                  <td>Equity given</td>
                  <td>5–20%</td>
                  <td>0%</td>
                  <td className="active">3–8%</td>
                </tr>
                <tr>
                  <td>Revenue share</td>
                  <td>None</td>
                  <td>8–15%</td>
                  <td className="active">5–10%</td>
                </tr>
                <tr>
                  <td>Best for</td>
                  <td>Pre-revenue startups</td>
                  <td>Clear revenue model</td>
                  <td className="active">Some budget, minimize dilution</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <div className="hy-section-alt">
          <div className="hy-section">
            <div className="hy-label">FAQ</div>
            <h2 className="hy-sh2">Common questions</h2>
            <div className="hy-faq" style={{ marginTop: '32px' }}>
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="hy-cta-section">
          <div className="hy-label" style={{ justifyContent: 'center' }}>Apply</div>
          <h2 className="hy-cta-h2">Lower risk. Full quality.</h2>
          <p className="hy-cta-sub">Tell us your situation. We&apos;ll find a structure that works for both sides.</p>
          <Link href="/ventures/apply" className="hy-cta-btn">
            Apply with Hybrid Model
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

      </main>
    </>
  );
}
