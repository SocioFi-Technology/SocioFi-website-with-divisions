'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

const A = '#6BA3E8';

const STYLES = `
  .eq-page {
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body, 'Outfit', sans-serif);
    min-height: 100vh;
    padding-top: 100px;
  }

  /* HERO */
  .eq-hero {
    text-align: center;
    padding: 80px 32px 100px;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
  }
  .eq-label {
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
  .eq-label::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 1.5px;
    background: ${A};
  }
  .eq-h1 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary);
    margin: 0 0 24px;
  }
  .eq-subtitle {
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 620px;
    margin: 0 auto 40px;
  }
  .eq-hero-cta {
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
  .eq-hero-cta:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 40px rgba(107,163,232,0.5);
  }

  /* SECTIONS */
  .eq-section {
    padding: 80px 32px;
    max-width: 1100px;
    margin: 0 auto;
  }
  .eq-section-alt {
    background: var(--bg-2);
    padding: 80px 0;
  }
  .eq-section-alt .eq-section {
    padding-top: 0;
    padding-bottom: 0;
  }

  /* PIE CHART */
  .eq-pie-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 60px 32px;
    max-width: 500px;
    margin: 0 auto;
  }
  .eq-pie-svg {
    width: 260px;
    height: 260px;
  }
  .eq-pie-caption {
    font-size: 0.84rem;
    color: var(--text-muted);
    text-align: center;
    font-family: var(--font-mono, 'Fira Code', monospace);
    letter-spacing: 0.04em;
  }
  .eq-pie-legend {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .eq-pie-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.84rem;
    color: var(--text-secondary);
  }
  .eq-pie-legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  /* STEPS */
  .eq-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .eq-step {
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 24px;
    padding: 28px 0;
    border-bottom: 1px solid var(--border);
    align-items: flex-start;
  }
  .eq-step:last-child { border-bottom: none; }
  .eq-step-num {
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
  .eq-step-content h3 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }
  .eq-step-content p {
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.65;
  }

  /* TABLE */
  .eq-table-wrap {
    overflow-x: auto;
    border-radius: 16px;
    border: 1px solid var(--border);
  }
  .eq-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--bg-card);
    font-size: 0.9rem;
  }
  .eq-table th {
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
  .eq-table td {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
    line-height: 1.5;
  }
  .eq-table tr:last-child td { border-bottom: none; }
  .eq-table td:first-child {
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
  }
  .eq-table td:nth-child(2) {
    color: ${A};
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.84rem;
  }

  /* VESTING TIMELINE */
  .eq-vesting {
    position: relative;
    padding: 40px 0;
  }
  .eq-vesting-track {
    display: flex;
    align-items: center;
    gap: 0;
    position: relative;
    margin-bottom: 40px;
  }
  .eq-vesting-line {
    flex: 1;
    height: 3px;
    background: var(--border);
    position: relative;
  }
  .eq-vesting-line-fill {
    height: 100%;
    background: linear-gradient(90deg, #3A589E, ${A});
    transition: width 1s ease;
  }
  .eq-vesting-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
    flex-shrink: 0;
  }
  .eq-vesting-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--bg-3);
    border: 2px solid var(--border);
    position: relative;
    z-index: 1;
  }
  .eq-vesting-dot.active {
    background: ${A};
    border-color: ${A};
    box-shadow: 0 0 12px rgba(107,163,232,0.4);
  }
  .eq-vesting-label {
    font-family: var(--font-mono, 'Fira Code', monospace);
    font-size: 0.7rem;
    color: var(--text-muted);
    white-space: nowrap;
    position: absolute;
    top: 28px;
    transform: translateX(-50%);
    left: 50%;
  }
  .eq-vesting-label.active { color: ${A}; }
  .eq-vesting-percent {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
    position: absolute;
    bottom: 28px;
    transform: translateX(-50%);
    left: 50%;
    white-space: nowrap;
  }
  .eq-vesting-percent.active { color: ${A}; }

  /* BLOCKQUOTE */
  .eq-blockquote {
    border-left: 3px solid ${A};
    padding: 24px 32px;
    background: var(--bg-card);
    border-radius: 0 12px 12px 0;
    font-style: italic;
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.75;
    margin: 0;
  }

  /* BULLETS */
  .eq-bullets {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .eq-bullet {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.65;
  }
  .eq-bullet-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${A};
    flex-shrink: 0;
    margin-top: 8px;
  }

  /* SECTION TITLES */
  .eq-sh2 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 0 0 16px;
  }
  .eq-sdesc {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.7;
    max-width: 600px;
    margin: 0 0 40px;
  }

  /* FAQ ACCORDION */
  .eq-faq {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }
  .eq-faq-item {
    border-bottom: 1px solid var(--border);
  }
  .eq-faq-item:last-child { border-bottom: none; }
  .eq-faq-btn {
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
  .eq-faq-btn:hover { background: var(--bg-card-hover); }
  .eq-faq-q {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .eq-faq-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: ${A};
    transition: transform 0.3s ease;
  }
  .eq-faq-icon.open { transform: rotate(45deg); }
  .eq-faq-body {
    padding: 0 24px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease, padding 0.35s ease;
    background: var(--bg-card);
  }
  .eq-faq-body.open {
    max-height: 400px;
    padding: 0 24px 20px;
  }
  .eq-faq-a {
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.65;
  }

  /* CTA SECTION */
  .eq-cta-section {
    padding: 80px 32px;
    text-align: center;
    background: linear-gradient(135deg, rgba(58,88,158,0.12) 0%, rgba(107,163,232,0.08) 100%);
    border-top: 1px solid var(--border);
  }
  .eq-cta-h2 {
    font-family: var(--font-display, 'Syne', sans-serif);
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    margin: 0 0 16px;
    color: var(--text-primary);
  }
  .eq-cta-sub {
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0 auto 32px;
    max-width: 480px;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    .eq-hero { padding: 60px 20px 80px; }
    .eq-section { padding: 60px 20px; }
    .eq-step { grid-template-columns: 40px 1fr; gap: 16px; }
    .eq-table td, .eq-table th { padding: 12px 16px; }
    /* ── Mobile: section header centering ── */
    .eq-hero-label { justify-content: center; }
    .eq-hero-h1 { text-align: center; }
    .eq-hero-sub { text-align: center; }
    /* ── Mobile: equity pie chart capped at 240px ── */
    .eq-chart-wrap { max-width: 240px; margin: 0 auto; }
    .eq-chart-wrap svg { width: 100%; height: auto; }
    /* ── Mobile: comparison table scrollable ── */
    .eq-table-wrap { overflow-x: auto; }
  }
`;

function PieChart() {
  const ref = useRef<SVGCircleElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const radius = 100;
  const cx = 130;
  const cy = 130;
  const circumference = 2 * Math.PI * radius;
  // SocioFi slice: 12% of circle
  const sociofiDash = animated ? (circumference * 0.12) : 0;
  const founderDash = circumference * 0.88;

  return (
    <div className="eq-pie-wrapper">
      <svg viewBox="0 0 260 260" className="eq-pie-svg" aria-label="Equity split pie chart">
        {/* Founder slice — full background circle */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--bg-3)"
          strokeWidth="36"
        />
        {/* SocioFi slice — animated */}
        <circle
          ref={ref}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={A}
          strokeWidth="36"
          strokeDasharray={`${sociofiDash} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          style={{ transition: animated ? 'stroke-dasharray 1.4s cubic-bezier(0.16,1,0.3,1)' : 'none' }}
        />
        {/* Center text */}
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill="var(--text-primary)"
          fontFamily="var(--font-display, Syne, sans-serif)"
          fontSize="22"
          fontWeight="800"
        >
          88%+
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontFamily="var(--font-body, Outfit, sans-serif)"
          fontSize="11"
        >
          You keep
        </text>
      </svg>
      <div className="eq-pie-legend">
        <div className="eq-pie-legend-item">
          <div className="eq-pie-legend-dot" style={{ background: A }} />
          <span>SocioFi (~12%)</span>
        </div>
        <div className="eq-pie-legend-item">
          <div className="eq-pie-legend-dot" style={{ background: 'var(--bg-3)' }} />
          <span>Founder (88%+)</span>
        </div>
      </div>
      <p className="eq-pie-caption">Typical equity: 5-20% to SocioFi. Founder retains the vast majority.</p>
    </div>
  );
}

function VestingTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const nodes = [
    { label: 'Year 0', pct: '0%', active: true },
    { label: 'Year 2', pct: 'Cliff', active: true },
    { label: 'Year 3', pct: '50%', active: animated },
    { label: 'Year 4', pct: '100%', active: animated },
  ];

  return (
    <div className="eq-vesting" ref={ref}>
      <div className="eq-vesting-track" style={{ padding: '32px 0 60px', position: 'relative' }}>
        {nodes.map((node, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < nodes.length - 1 ? '1' : '0' }}>
            <div className="eq-vesting-node">
              <span className={`eq-vesting-percent ${node.active ? 'active' : ''}`}>{node.pct}</span>
              <div className={`eq-vesting-dot ${node.active ? 'active' : ''}`} />
              <span className={`eq-vesting-label ${node.active ? 'active' : ''}`}>{node.label}</span>
            </div>
            {i < nodes.length - 1 && (
              <div className="eq-vesting-line" style={{ flex: 1 }}>
                <div
                  className="eq-vesting-line-fill"
                  style={{
                    width: animated && i >= 1 ? '100%' : (i < 1 ? '100%' : '0%'),
                    transition: `width 0.8s ease ${i * 0.2}s`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: '8px' }}>
        Vesting means our equity stake earns in over time. If we part ways before 2 years, we get nothing. After 2 years, we&apos;ve earned half. At 4 years, it&apos;s fully vested. This protects both sides — you know we&apos;re committed for the long haul.
      </p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="eq-faq-item">
      <button className="eq-faq-btn" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="eq-faq-q">{q}</span>
        <svg className={`eq-faq-icon ${open ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <div className={`eq-faq-body ${open ? 'open' : ''}`}>
        <p className="eq-faq-a">{a}</p>
      </div>
    </div>
  );
}

const steps = [
  {
    heading: 'We estimate the Studio-equivalent cost',
    body: 'We scope your project as if you were paying for it directly. This gives us a dollar value ($X,XXX) that anchors the equity negotiation — both sides know what "the build" is worth.',
  },
  {
    heading: 'We negotiate an equity percentage',
    body: 'Based on the estimated cost, the market potential, your traction, and the risk profile — we agree on a percentage. Typical range: 5-20%.',
  },
  {
    heading: 'We build the product',
    body: 'Same process as Studio: AI agents handle the bulk of development, human engineers architect, review, and debug. You stay in the loop, we stay on scope.',
  },
  {
    heading: 'Equity vests over 4 years with a 2-year cliff',
    body: 'Our stake earns in over time. We don\'t get anything if we part ways before 2 years. Standard vesting protects you if the partnership doesn\'t work out.',
  },
  {
    heading: 'If the company fails, we lose — same as you',
    body: 'Our equity is worth nothing if the startup doesn\'t succeed. We accept this risk knowingly. That\'s why we\'re selective about which deals we take on.',
  },
];

const faqs = [
  {
    q: 'What if I raise a funding round?',
    a: 'We dilute alongside you. Standard pro-rata dilution applies. We don\'t have anti-dilution protections — if new investors come in, we all dilute together.',
  },
  {
    q: 'Can I buy back the equity?',
    a: 'Yes, buyback is negotiable and we\'re generally open to it. The buyout price is defined at signing so there are no surprises. Discuss the specifics on the intro call.',
  },
  {
    q: 'What if the company fails?',
    a: 'Our equity is worth nothing. That\'s our risk. We accept it going in. We don\'t chase founders for reimbursement or partial payment — the deal was equity-based.',
  },
  {
    q: 'Do you take a board seat?',
    a: 'No. We build software. We don\'t govern companies. For larger stakes, we may request observer rights — the ability to attend board meetings without voting. Never a seat.',
  },
  {
    q: 'What kind of equity — common or preferred?',
    a: 'Typically common stock with standard founder-friendly protections. We don\'t ask for liquidation preferences or participating preferred — those are investor terms, not builder terms.',
  },
];

export default function EquityPage() {
  return (
    <>
      <style>{STYLES}</style>
      <main className="eq-page">

        {/* HERO */}
        <section className="eq-hero">
          <div className="eq-label">Equity Model</div>
          <h1 className="eq-h1">Equity Model: We Build,<br />You Share Ownership.</h1>
          <p className="eq-subtitle">
            SocioFi builds your product in exchange for an equity stake. No upfront payment. No monthly fees during the build.
          </p>
          <Link href="/ventures/apply" className="eq-hero-cta">
            Apply with Equity Model
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </section>

        {/* PIE CHART */}
        <div className="eq-section-alt">
          <div className="eq-section">
            <PieChart />
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section className="eq-section">
          <div className="eq-label">Process</div>
          <h2 className="eq-sh2">How it works</h2>
          <p className="eq-sdesc">Five steps from intro call to equity agreement to shipped product.</p>
          <div className="eq-steps">
            {steps.map((step, i) => (
              <div key={i} className="eq-step">
                <div className="eq-step-num">0{i + 1}</div>
                <div className="eq-step-content">
                  <h3>{step.heading}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TERMS TABLE */}
        <div className="eq-section-alt">
          <div className="eq-section">
            <div className="eq-label">Terms</div>
            <h2 className="eq-sh2">Standard equity terms</h2>
            <p className="eq-sdesc">Every deal is negotiated, but these are the typical ranges and defaults.</p>
            <div className="eq-table-wrap">
              <table className="eq-table">
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Typical Range</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Equity %</td><td>5–20%</td><td>Based on project scope and market potential</td></tr>
                  <tr><td>Vesting schedule</td><td>2-year cliff, 4-year total</td><td>Standard — protects both sides</td></tr>
                  <tr><td>Anti-dilution</td><td>None (standard dilution)</td><td>We dilute alongside founders in future rounds</td></tr>
                  <tr><td>Board seat</td><td>No</td><td>We&apos;re builders, not board members</td></tr>
                  <tr><td>Build scope</td><td>Full MVP / V1</td><td>Same quality as $8K–$20K Studio project</td></tr>
                  <tr><td>Post-launch</td><td>3 mo. Services + 6 mo. Cloud</td><td>Included at no additional cost</td></tr>
                  <tr><td>Code ownership</td><td>100% founder</td><td>Regardless of equity arrangement</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* VESTING EXPLAINER */}
        <section className="eq-section">
          <div className="eq-label">Vesting</div>
          <h2 className="eq-sh2">How vesting works</h2>
          <VestingTimeline />
        </section>

        {/* WHEN EQUITY MAKES SENSE */}
        <div className="eq-section-alt">
          <div className="eq-section">
            <div className="eq-label">Fit</div>
            <h2 className="eq-sh2">When equity makes sense</h2>
            <div className="eq-bullets">
              <div className="eq-bullet"><div className="eq-bullet-dot" /><span>You have strong conviction in the market but limited cash to invest in development upfront.</span></div>
              <div className="eq-bullet"><div className="eq-bullet-dot" /><span>You want an engineering partner who is financially aligned with the outcome, not just a vendor.</span></div>
              <div className="eq-bullet"><div className="eq-bullet-dot" /><span>You&apos;re pre-revenue or pre-seed — you have the idea and the drive, but not a development budget.</span></div>
              <div className="eq-bullet"><div className="eq-bullet-dot" /><span>You&apos;re building in a market with clear upside potential that makes an equity bet worthwhile for both sides.</span></div>
            </div>
          </div>
        </div>

        {/* HONEST CAVEAT */}
        <section className="eq-section">
          <div className="eq-label">Honest caveat</div>
          <blockquote className="eq-blockquote">
            Equity is a long-term bet. If your startup doesn&apos;t succeed, our equity is worth nothing. We accept this risk. In exchange, we ask for enough equity to make the bet worthwhile for us. 1-2% isn&apos;t enough — that&apos;s why our range starts at 5%.
          </blockquote>
        </section>

        {/* FAQ */}
        <div className="eq-section-alt">
          <div className="eq-section">
            <div className="eq-label">FAQ</div>
            <h2 className="eq-sh2">Common questions</h2>
            <div className="eq-faq" style={{ marginTop: '32px' }}>
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="eq-cta-section">
          <div className="eq-label" style={{ justifyContent: 'center' }}>Apply</div>
          <h2 className="eq-cta-h2">Ready to build together?</h2>
          <p className="eq-cta-sub">Tell us about your idea. We review every application and respond within 5 business days.</p>
          <Link href="/ventures/apply" className="eq-hero-cta">
            Apply with Equity Model
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
