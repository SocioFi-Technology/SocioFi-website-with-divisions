'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const A = '#6BA3E8';

const STYLES = `
  .rs-page {
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body, 'Outfit', sans-serif);
    min-height: 100vh;
    padding-top: 100px;
  }

  /* HERO */
  .rs-hero {
    text-align: center;
    padding: 80px 32px 100px;
    max-width: 800px;
    margin: 0 auto;
  }
  .rs-label {
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
  .rs-label::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 1.5px;
    background: ${A};
  }
  .rs-h1 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary);
    margin: 0 0 24px;
  }
  .rs-subtitle {
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 640px;
    margin: 0 auto 40px;
  }
  .rs-cta-btn {
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
  .rs-cta-btn:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(107,163,232,0.5);
  }

  /* SECTIONS */
  .rs-section {
    padding: 80px 32px;
    max-width: 1100px;
    margin: 0 auto;
  }
  .rs-section-alt {
    background: var(--bg-2);
    padding: 80px 0;
  }
  .rs-section-alt .rs-section {
    padding-top: 0;
    padding-bottom: 0;
  }
  .rs-sh2 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 0 0 16px;
  }
  .rs-sdesc {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.7;
    max-width: 600px;
    margin: 0 0 40px;
  }

  /* LINE CHART */
  .rs-chart-wrap {
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  .rs-chart-svg {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  /* STEPS */
  .rs-steps {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 768px) { .rs-steps { grid-template-columns: 1fr; } }
  .rs-step {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    padding: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px;
  }
  .rs-step-num {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid ${A};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.75rem;
    font-weight: 500;
    color: ${A};
    flex-shrink: 0;
  }
  .rs-step h3 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }
  .rs-step p {
    font-size: 0.88rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.6;
  }

  /* TABLE */
  .rs-table-wrap {
    overflow-x: auto;
    border-radius: 16px;
    border: 1px solid var(--border);
  }
  .rs-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--bg-card);
    font-size: 0.9rem;
  }
  .rs-table th {
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
  .rs-table td {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
    line-height: 1.5;
  }
  .rs-table tr:last-child td { border-bottom: none; }
  .rs-table td:first-child {
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
  }
  .rs-table td:nth-child(2) {
    color: ${A};
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.84rem;
  }

  /* EXAMPLE CARD */
  .rs-example {
    border-left: 3px solid ${A};
    background: var(--bg-card);
    border-radius: 0 16px 16px 0;
    padding: 28px 32px;
    border-top: 1px solid var(--border);
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .rs-example h3 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 16px;
    letter-spacing: -0.01em;
  }
  .rs-example-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.9rem;
    align-items: center;
  }
  .rs-example-row:last-child { border-bottom: none; }
  .rs-example-label { color: var(--text-secondary); }
  .rs-example-value {
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.84rem;
    color: ${A};
    white-space: nowrap;
  }
  .rs-example-final {
    margin-top: 16px;
    padding: 14px 16px;
    background: rgba(107,163,232,0.08);
    border-radius: 8px;
    font-size: 0.9rem;
    color: var(--text-primary);
    font-weight: 600;
    text-align: center;
  }

  /* EXPLAINER BOXES */
  .rs-explainers {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 768px) { .rs-explainers { grid-template-columns: 1fr; } }
  .rs-explainer {
    padding: 24px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px;
  }
  .rs-explainer-title {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 0.95rem;
    font-weight: 600;
    color: ${A};
    margin: 0 0 10px;
    letter-spacing: -0.01em;
  }
  .rs-explainer p {
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.65;
    margin: 0;
  }

  /* FAQ ACCORDION */
  .rs-faq {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }
  .rs-faq-item { border-bottom: 1px solid var(--border); }
  .rs-faq-item:last-child { border-bottom: none; }
  .rs-faq-btn {
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
  .rs-faq-btn:hover { background: var(--bg-card-hover); }
  .rs-faq-q {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .rs-faq-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: ${A};
    transition: transform 0.3s ease;
  }
  .rs-faq-icon.open { transform: rotate(45deg); }
  .rs-faq-body {
    padding: 0 24px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease, padding 0.35s ease;
    background: var(--bg-card);
  }
  .rs-faq-body.open { max-height: 400px; padding: 0 24px 20px; }
  .rs-faq-a {
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.65;
  }

  /* CTA */
  .rs-cta-section {
    padding: 80px 32px;
    text-align: center;
    background: linear-gradient(135deg, rgba(58,88,158,0.12) 0%, rgba(107,163,232,0.08) 100%);
    border-top: 1px solid var(--border);
  }
  .rs-cta-h2 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    margin: 0 0 16px;
    color: var(--text-primary);
  }
  .rs-cta-sub {
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0 auto 32px;
    max-width: 480px;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    .rs-hero { padding: 60px 20px 80px; }
    .rs-section { padding: 60px 20px; }
  }
`;

function RevenueChart() {
  const ref = useRef<SVGPathElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // SVG coordinate space: 700 wide x 320 tall
  // X: months 0-30, Y: 0-50000 (cap is 45000)
  const W = 700;
  const H = 320;
  const padL = 60;
  const padB = 40;
  const plotW = W - padL - 20;
  const plotH = H - padB - 20;
  const cap = 45000;
  const capY = H - padB - (cap / cap) * plotH;

  // Simplified growth curve: slow start, accelerating, then cap
  const months = [0, 3, 4, 8, 12, 14, 18, 24, 27, 30];
  const cumulative = [0, 0, 200, 2200, 7200, 12200, 22200, 34200, 40200, 45000];

  const toSVGX = (m: number) => padL + (m / 30) * plotW;
  const toSVGY = (v: number) => H - padB - (Math.min(v, cap) / cap) * plotH;

  const pathData = months
    .map((m, i) => `${i === 0 ? 'M' : 'L'} ${toSVGX(m)} ${toSVGY(cumulative[i])}`)
    .join(' ');

  const areaPath = pathData + ` L ${toSVGX(30)} ${H - padB} L ${padL} ${H - padB} Z`;

  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(1000);
  useEffect(() => {
    if (pathRef.current) {
      setPathLen(pathRef.current.getTotalLength());
    }
  }, []);

  const capLineY = toSVGY(cap);
  const paymentsStopX = toSVGX(24);

  return (
    <div className="rs-chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="rs-chart-svg" aria-label="Cumulative revenue share payments over time">
        <defs>
          <linearGradient id="rsAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={A} stopOpacity="0.2" />
            <stop offset="100%" stopColor={A} stopOpacity="0.02" />
          </linearGradient>
          <clipPath id="rsLineClip">
            <rect
              x={padL}
              y={0}
              width={animated ? plotW : 0}
              height={H}
              style={{ transition: 'width 3s cubic-bezier(0.16,1,0.3,1)' }}
            />
          </clipPath>
        </defs>

        {/* Y-axis gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = H - padB - pct * plotH;
          return (
            <g key={pct}>
              <line x1={padL} y1={y} x2={W - 20} y2={y} stroke="var(--border)" strokeWidth="1" />
              <text x={padL - 8} y={y + 4} textAnchor="end" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono, 'Fira Code', monospace)">
                ${(pct * 45).toFixed(0)}K
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {[0, 6, 12, 18, 24, 30].map(m => (
          <text key={m} x={toSVGX(m)} y={H - padB + 18} textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono, 'Fira Code', monospace)">
            Mo {m}
          </text>
        ))}

        {/* Cap line */}
        <line
          x1={padL}
          y1={capLineY}
          x2={W - 20}
          y2={capLineY}
          stroke={A}
          strokeWidth="1.5"
          strokeDasharray="6 4"
          opacity="0.6"
        />
        <text x={W - 22} y={capLineY - 6} textAnchor="end" fill={A} fontSize="10" fontFamily="var(--font-mono, 'Fira Code', monospace)" fontWeight="500">
          Cap: $45K
        </text>

        {/* Area fill */}
        <path d={areaPath} fill="url(#rsAreaGrad)" clipPath="url(#rsLineClip)" />

        {/* Main line */}
        <path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke={A}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath="url(#rsLineClip)"
        />

        {/* PAYMENTS STOP marker */}
        {animated && (
          <>
            <line
              x1={paymentsStopX}
              y1={capLineY}
              x2={paymentsStopX}
              y2={H - padB}
              stroke="#4ade80"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              style={{ animation: 'fadeIn 0.5s 2.8s ease both' }}
            />
            <circle cx={paymentsStopX} cy={capLineY} r="5" fill="#4ade80" style={{ animation: 'fadeIn 0.5s 2.8s ease both' }} />
            <text
              x={paymentsStopX + 8}
              y={capLineY - 10}
              fill="#4ade80"
              fontSize="10"
              fontFamily="var(--font-mono, 'Fira Code', monospace)"
              fontWeight="500"
              style={{ animation: 'fadeIn 0.5s 2.8s ease both' }}
            >
              PAYMENTS STOP
            </text>
          </>
        )}

        <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
      </svg>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rs-faq-item">
      <button className="rs-faq-btn" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="rs-faq-q">{q}</span>
        <svg className={`rs-faq-icon ${open ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <div className={`rs-faq-body ${open ? 'open' : ''}`}>
        <p className="rs-faq-a">{a}</p>
      </div>
    </div>
  );
}

const steps = [
  { heading: 'We scope the project', body: 'We estimate the Studio-equivalent cost of building your product — typically $8K–$20K for an MVP.' },
  { heading: 'We agree on the revenue share %', body: 'Typically 8–15% of monthly gross revenue from the product. Negotiated based on scope and risk.' },
  { heading: 'We agree on the cap', body: 'The total amount you\'ll ever pay us. Usually 2.5–3x the estimated project cost. Once hit, payments stop permanently.' },
  { heading: 'We build the product', body: 'AI agents + human engineers. Same quality and process as a paid Studio project.' },
  { heading: 'You launch and start building revenue', body: 'Payments only begin once monthly revenue exceeds $1,000. We want you to build initial traction first.' },
  { heading: 'You pay monthly based on actual revenue', body: 'Slow month? Small payment. Strong month? Larger payment. Always capped at the agreed percentage.' },
  { heading: 'Payments stop when you hit the cap', body: 'Once cumulative payments reach the cap, payments stop permanently. Done.' },
  { heading: '36-month limit regardless of cap', body: 'Even if you haven\'t hit the cap, payments stop at 36 months. This is a finite obligation, not an indefinite one.' },
];

const faqs = [
  {
    q: 'What if my revenue is seasonal?',
    a: 'Payments are based on actual monthly revenue. A slow month means a smaller payment. A $0 revenue month means a $0 payment. The agreement mirrors what the business actually does.',
  },
  {
    q: 'What counts as revenue?',
    a: 'Gross revenue from the specific product we built. We define this precisely in the agreement — subscriptions, one-time purchases, usage fees. Not total company revenue if you have other products.',
  },
  {
    q: 'Can I pay the cap off early?',
    a: 'Yes. Lump-sum payoff is always available. If you raise a round or have a good month, you can close out the deal early. The lump-sum amount equals the remaining cap balance.',
  },
  {
    q: 'What if I pivot the product?',
    a: 'Revenue from the new direction still counts toward the cap. If the pivot is significant enough to be considered a completely different product, we renegotiate. We\'re reasonable about this.',
  },
  {
    q: 'What happens at 36 months?',
    a: 'Payments stop, regardless of whether the cap was reached. If you\'ve paid $20K of a $45K cap over 36 months, we don\'t pursue the remaining $25K. Time limits exist for a reason.',
  },
];

export default function RevenueSharePage() {
  return (
    <>
      <style>{STYLES}</style>
      <main className="rs-page">

        {/* HERO */}
        <section className="rs-hero">
          <div className="rs-label">Revenue Share Model</div>
          <h1 className="rs-h1">Revenue Share: We Build,<br />You Pay From Profits.</h1>
          <p className="rs-subtitle">
            No equity. No upfront payment. Once you hit the cap, payments stop and you own 100% free and clear.
          </p>
          <Link href="/ventures/apply" className="rs-cta-btn">
            Apply with Revenue Share
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </section>

        {/* CHART */}
        <div className="rs-section-alt">
          <div className="rs-section">
            <RevenueChart />
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section className="rs-section">
          <div className="rs-label">Process</div>
          <h2 className="rs-sh2">How it works</h2>
          <p className="rs-sdesc">Eight steps from project scoping to payments stopping completely.</p>
          <div className="rs-steps">
            {steps.map((step, i) => (
              <div key={i} className="rs-step">
                <div className="rs-step-num">0{i + 1}</div>
                <div>
                  <h3>{step.heading}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TERMS TABLE */}
        <div className="rs-section-alt">
          <div className="rs-section">
            <div className="rs-label">Terms</div>
            <h2 className="rs-sh2">Standard revenue share terms</h2>
            <p className="rs-sdesc">Every deal is negotiated, but these are the typical defaults.</p>
            <div className="rs-table-wrap">
              <table className="rs-table">
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Typical Range</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Revenue share %</td><td>8–15%</td><td>Of monthly gross revenue from the product</td></tr>
                  <tr><td>Payment cap</td><td>2.5–3x project cost</td><td>Payments stop permanently once reached</td></tr>
                  <tr><td>Grace period</td><td>Until MRR exceeds $1,000</td><td>Payments don&apos;t start until you have traction</td></tr>
                  <tr><td>Time limit</td><td>36 months</td><td>Payments stop regardless of cap status</td></tr>
                  <tr><td>Early payoff</td><td>Available anytime</td><td>Lump-sum equal to remaining cap balance</td></tr>
                  <tr><td>Equity</td><td>None</td><td>Zero dilution to your cap table</td></tr>
                  <tr><td>Code ownership</td><td>100% founder</td><td>Day one, regardless of payment status</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* EXAMPLE SCENARIO */}
        <section className="rs-section">
          <div className="rs-label">Example</div>
          <h2 className="rs-sh2">A real scenario</h2>
          <p className="rs-sdesc">Project cost equivalent: $15,000 &middot; Revenue share: 10% &middot; Cap: $45,000</p>
          <div className="rs-example">
            <h3>Month-by-month breakdown</h3>
            {[
              ['Month 1–3', '$0 revenue', '$0 payments (building traction)'],
              ['Month 4', '$2,000 MRR', '$200 payment'],
              ['Month 8', '$5,000 MRR', '$500 payment'],
              ['Month 14', '$10,000 MRR', '$1,000 payment'],
              ['Month 24', 'Cap reached', 'Cumulative payments hit $45,000 — PAYMENTS STOP'],
            ].map(([month, revenue, payment], i) => (
              <div key={i} className="rs-example-row">
                <span className="rs-example-label">{month} — {revenue}</span>
                <span className="rs-example-value">{payment}</span>
              </div>
            ))}
            <div className="rs-example-final">
              From month 25 onward: you keep 100%. Deal complete.
            </div>
          </div>
        </section>

        {/* EXPLAINERS */}
        <div className="rs-section-alt">
          <div className="rs-section">
            <div className="rs-label">Key concepts</div>
            <h2 className="rs-sh2">Three things to understand</h2>
            <div className="rs-explainers" style={{ marginTop: '32px' }}>
              <div className="rs-explainer">
                <div className="rs-explainer-title">Grace period</div>
                <p>Payments only start when monthly revenue exceeds $1,000. We want you to build initial traction before payments begin. Zero pressure during the early growth phase.</p>
              </div>
              <div className="rs-explainer">
                <div className="rs-explainer-title">The cap</div>
                <p>The cap is the total amount you&apos;ll ever pay SocioFi under this model. Once hit, payments stop permanently. You keep 100% of revenue forever after.</p>
              </div>
              <div className="rs-explainer">
                <div className="rs-explainer-title">36-month limit</div>
                <p>Even if you haven&apos;t reached the cap in 36 months, payments stop. We believe in time limits — this isn&apos;t an indefinite obligation that follows you for years.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="rs-section">
          <div className="rs-label">FAQ</div>
          <h2 className="rs-sh2">Common questions</h2>
          <div className="rs-faq" style={{ marginTop: '32px' }}>
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rs-cta-section">
          <div className="rs-label" style={{ justifyContent: 'center' }}>Apply</div>
          <h2 className="rs-cta-h2">No equity. No upfront. Just results.</h2>
          <p className="rs-cta-sub">Tell us about your product. We&apos;ll assess fit within 5 business days.</p>
          <Link href="/ventures/apply" className="rs-cta-btn">
            Apply with Revenue Share
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
