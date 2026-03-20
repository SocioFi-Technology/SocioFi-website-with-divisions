'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ── Constants ──────────────────────────────────────────────────────────────
const A = '#6BA3E8';
const A_DARK = '#3A6DB8';
const F = {
  h: 'var(--font-display, Syne)',
  b: 'var(--font-body, Outfit)',
  m: 'var(--font-mono, "Fira Code")',
};

// ── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
.cmp-wrap { background: var(--bg); color: var(--text-primary); min-height: 100vh; font-family: ${F.b}; overflow-x: hidden; }

/* ── Hero ── */
.cmp-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
.cmp-hero-inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 2; }

.cmp-badge {
  display: inline-flex; align-items: center; gap: 10px; justify-content: center;
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 28px;
}
.cmp-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; flex-shrink: 0; }
[data-theme="light"] .cmp-badge { color: ${A_DARK}; }
[data-theme="light"] .cmp-badge::before { background: ${A_DARK}; }

.cmp-h1 {
  font-family: ${F.h}; font-size: clamp(2.4rem, 4.5vw, 3.6rem); font-weight: 800;
  line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary);
  margin-bottom: 24px;
}
.cmp-gradient-text {
  background: linear-gradient(135deg, #4A85CC, ${A}, #9BC0F0);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
@media (forced-colors: active) { .cmp-gradient-text { -webkit-text-fill-color: unset; } }

.cmp-sub {
  font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary);
  max-width: 560px; margin: 0 auto;
}

/* ── Shared sections ── */
.cmp-section { padding: 100px 32px; background: var(--bg); }
.cmp-section-alt { padding: 100px 32px; background: var(--bg-2); }
.cmp-container { max-width: 1200px; margin: 0 auto; }
.cmp-centered { text-align: center; }
.cmp-centered .cmp-sec-label { justify-content: center; }

.cmp-sec-label {
  display: flex; align-items: center; gap: 10px;
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 14px;
}
.cmp-sec-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; flex-shrink: 0; }
[data-theme="light"] .cmp-sec-label { color: ${A_DARK}; }
[data-theme="light"] .cmp-sec-label::before { background: ${A_DARK}; }

.cmp-sec-h2 {
  font-family: ${F.h}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700;
  line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary);
  margin-bottom: 16px;
}

/* ── Buttons ── */
.cmp-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; background: linear-gradient(135deg, #4A85CC, ${A});
  color: #fff; border-radius: 100px; font-family: ${F.h}; font-size: 0.9rem;
  font-weight: 600; text-decoration: none; transition: all 0.2s;
}
.cmp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(107,163,232,0.35); }
.cmp-btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border: 1.5px solid var(--border);
  color: var(--text-primary); border-radius: 100px; font-family: ${F.h};
  font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s;
}
.cmp-btn-ghost:hover { border-color: ${A}; color: ${A}; }
.cmp-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 32px; }

/* ── Comparison Table ── */
.cmp-table-wrap { overflow-x: auto; margin-top: 48px; border-radius: 16px; border: 1px solid var(--border); }
.cmp-table {
  width: 100%; border-collapse: collapse; min-width: 700px;
  font-size: 0.9rem; color: var(--text-secondary);
}
.cmp-table thead tr { background: var(--bg-2); }
.cmp-table th {
  padding: 18px 20px; text-align: left;
  font-family: ${F.h}; font-size: 0.88rem; font-weight: 700;
  color: var(--text-primary); border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.cmp-table th:first-child { width: 160px; }
.cmp-table th.cmp-th-highlight {
  background: ${A}18; color: ${A};
  border-bottom-color: ${A}30;
}
[data-theme="light"] .cmp-table th.cmp-th-highlight { color: ${A_DARK}; }
.cmp-table td { padding: 16px 20px; border-bottom: 1px solid var(--border); vertical-align: top; line-height: 1.55; }
.cmp-table tr:last-child td { border-bottom: none; }
.cmp-table tr:nth-child(even) td { background: var(--bg-2); }
.cmp-table td.cmp-td-highlight { background: ${A}08 !important; border-left: 2px solid ${A}30; border-right: 2px solid ${A}30; }
.cmp-table tr:last-child td.cmp-td-highlight { border-bottom: 2px solid ${A}30; border-radius: 0 0 4px 4px; }
.cmp-table tr:first-child td.cmp-td-highlight { border-top: 2px solid ${A}30; }
.cmp-row-label {
  font-family: ${F.h}; font-size: 0.84rem; font-weight: 600;
  color: var(--text-primary);
}

/* ── When NOT section ── */
.cmp-not-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
@media (max-width: 900px) { .cmp-not-grid { grid-template-columns: 1fr; } }
.cmp-not-card {
  padding: 28px 32px; border-radius: 16px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-left: 3px solid rgba(234,100,100,0.4);
  transition: all 0.3s;
}
.cmp-not-card:hover { border-color: var(--border-hover); }
.cmp-not-card-title {
  font-family: ${F.h}; font-size: 1rem; font-weight: 700;
  color: var(--text-primary); margin-bottom: 10px;
}
.cmp-not-card-text { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65; }

/* ── Deep-dive two-col ── */
.cmp-deep-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 48px; }
@media (max-width: 768px) { .cmp-deep-grid { grid-template-columns: 1fr; } }

.cmp-deep-col {
  padding: 32px; border-radius: 20px;
  background: var(--bg-card); border: 1px solid var(--border);
  transition: all 0.35s;
}
.cmp-deep-col.cmp-col-highlight {
  border-color: ${A}30;
  background: linear-gradient(160deg, ${A}08, var(--bg-card));
}
.cmp-deep-col-title {
  font-family: ${F.m}; font-size: 0.72rem; font-weight: 500;
  color: ${A}; text-transform: uppercase; letter-spacing: 0.1em;
  margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
}
.cmp-deep-col-title::before { content: ''; width: 16px; height: 1.5px; background: ${A}; display: inline-block; flex-shrink: 0; }

.cmp-deep-row { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px; }
.cmp-deep-row:last-child { margin-bottom: 0; }
.cmp-deep-row-label { font-family: ${F.h}; font-size: 0.84rem; font-weight: 600; color: var(--text-muted); min-width: 120px; flex-shrink: 0; }
.cmp-deep-row-val { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.55; }
.cmp-deep-row-val.cmp-highlight-val { color: ${A}; font-weight: 500; }
[data-theme="light"] .cmp-deep-row-val.cmp-highlight-val { color: ${A_DARK}; }

/* ── Final CTA ── */
.cmp-final-cta { padding: 100px 32px; background: linear-gradient(135deg, ${A}12, var(--bg-2), ${A}08); text-align: center; }
.cmp-cta-h2 {
  font-family: ${F.h}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700;
  color: var(--text-primary); margin-bottom: 16px; letter-spacing: -0.025em;
}
.cmp-cta-sub { font-size: 1.05rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }

@media (max-width: 768px) {
  .cmp-hero { padding: 120px 20px 80px; }
  .cmp-section, .cmp-section-alt { padding: 80px 20px; }
  .cmp-final-cta { padding: 80px 20px; }
  /* ── Mobile: section header centering ── */
  .cmp-sec-label { justify-content: center; }
  .cmp-sec-h2 { text-align: center; }
  /* ── Mobile: hide comparison table, show stacked metric cards ── */
  .cmp-table-wrap { display: none; }
  .cmp-mobile-cards { display: flex; flex-direction: column; gap: 12px; margin-top: 32px; }
  .cmp-mobile-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 16px; padding: 20px;
  }
  .cmp-mobile-card-metric {
    font-family: ${F.h}; font-size: 0.88rem; font-weight: 700;
    color: var(--text-primary); margin-bottom: 12px;
    padding-bottom: 10px; border-bottom: 1px solid var(--border);
  }
  .cmp-mobile-card-row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 6px; font-size: 0.82rem; }
  .cmp-mobile-card-label { color: var(--text-muted); flex-shrink: 0; min-width: 110px; }
  .cmp-mobile-card-val { color: var(--text-secondary); text-align: right; }
  .cmp-mobile-card-val.highlight { color: ${A}; font-weight: 600; }
}
/* ── Desktop: hide mobile cards ── */
.cmp-mobile-cards { display: none; }
`;

// ── Scroll Reveal ──────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ── SVG Icons ──────────────────────────────────────────────────────────────
const ArrowRight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckSmall = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Table data ─────────────────────────────────────────────────────────────
const TABLE_ROWS = [
  { label: 'Upfront cost', cto: '$0 (but 30–50% equity)', vc: '$0 (but dilution + investor control)', studio: '$3K–$20K (pay Studio)', ventures: '$0 (equity / rev share)' },
  { label: 'Equity given', cto: '30–50%', vc: '15–30% per round', studio: '0%', ventures: '5–20% (or 0% rev share)' },
  { label: 'Build quality', cto: 'Depends on CTO skill', vc: 'Depends on team they hire', studio: 'SocioFi Studio quality', ventures: 'SocioFi Studio quality' },
  { label: 'Timeline', cto: 'Months to find + onboard', vc: '3–6 months fundraising first', studio: '2–6 weeks', ventures: '2–6 weeks (after acceptance)' },
  { label: 'Post-launch support', cto: 'CTO maintains (or leaves)', vc: 'You manage the team', studio: 'Services plan available', ventures: '3 months Services included' },
  { label: 'Control', cto: 'Shared with CTO', vc: 'Shared with investors', studio: '100% yours', ventures: '100% yours (code ownership)' },
  { label: 'Your risk', cto: 'CTO might leave', vc: 'Investor pressure, milestone expectations', studio: 'Pay upfront, no upside sharing', ventures: 'SocioFi keeps equity / rev share if successful' },
  { label: "SocioFi's risk", cto: 'N/A', vc: 'N/A', studio: 'None', ventures: 'Dev capacity if product fails' },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default function ComparePage() {
  return (
    <main className="cmp-wrap">
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="cmp-hero">
        <div className="cmp-hero-inner">
          <Reveal>
            <div className="cmp-badge">Compare Your Options</div>
            <h1 className="cmp-h1">
              Ventures vs.{' '}
              <span className="cmp-gradient-text">Your Other Options.</span>
            </h1>
            <p className="cmp-sub">
              There are several ways to get a technical partner. Here&apos;s an honest comparison.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Main Comparison Table ── */}
      <section className="cmp-section-alt">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-centered">
              <div className="cmp-sec-label">Side by Side</div>
              <h2 className="cmp-sec-h2">Four Paths to Getting Your Product Built.</h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="cmp-table-wrap">
              <table className="cmp-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Hire a CTO</th>
                    <th>VC Funding</th>
                    <th>Bootstrap + Studio</th>
                    <th className="cmp-th-highlight">SocioFi Ventures</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((row) => (
                    <tr key={row.label}>
                      <td><div className="cmp-row-label">{row.label}</div></td>
                      <td>{row.cto}</td>
                      <td>{row.vc}</td>
                      <td>{row.studio}</td>
                      <td className="cmp-td-highlight">{row.ventures}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile: stacked metric cards */}
            <div className="cmp-mobile-cards" aria-hidden="false">
              {TABLE_ROWS.map((row) => (
                <div key={row.label} className="cmp-mobile-card">
                  <div className="cmp-mobile-card-metric">{row.label}</div>
                  <div className="cmp-mobile-card-row">
                    <span className="cmp-mobile-card-label">Hire a CTO</span>
                    <span className="cmp-mobile-card-val">{row.cto}</span>
                  </div>
                  <div className="cmp-mobile-card-row">
                    <span className="cmp-mobile-card-label">VC Funding</span>
                    <span className="cmp-mobile-card-val">{row.vc}</span>
                  </div>
                  <div className="cmp-mobile-card-row">
                    <span className="cmp-mobile-card-label">Studio</span>
                    <span className="cmp-mobile-card-val">{row.studio}</span>
                  </div>
                  <div className="cmp-mobile-card-row">
                    <span className="cmp-mobile-card-label">SocioFi Ventures</span>
                    <span className="cmp-mobile-card-val highlight">{row.ventures}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── When Ventures ISN'T right ── */}
      <section className="cmp-section">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-centered">
              <div className="cmp-sec-label">Honest Assessment</div>
              <h2 className="cmp-sec-h2">When Ventures Isn&apos;t the Right Choice.</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
                We&apos;d rather you pick the best path than the path that benefits us.
              </p>
            </div>
          </Reveal>

          <div className="cmp-not-grid">
            {[
              {
                title: 'If you have budget',
                text: 'Studio is faster and cleaner. No equity obligations, no revenue share. You own 100% from day one. Ventures makes sense when budget is genuinely the blocker.',
              },
              {
                title: 'If you can find a great technical co-founder',
                text: "A co-founder relationship may be deeper than a Ventures partnership. We build the product — we don't run the company with you. If you can find someone who will, that might be a better fit.",
              },
              {
                title: 'If you need strategic or business guidance',
                text: "We're engineers. We'll help you build a great product but we won't mentor you on fundraising, go-to-market strategy, or investor relations. Ventures is a technical partnership, not an advisory one.",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 0.1}>
                <div className="cmp-not-card">
                  <div className="cmp-not-card-title">{card.title}</div>
                  <p className="cmp-not-card-text">{card.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── vs Hire a CTO ── */}
      <section className="cmp-section-alt">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-centered">
              <div className="cmp-sec-label">Deep Dive</div>
              <h2 className="cmp-sec-h2">Ventures vs. Hiring a CTO.</h2>
            </div>
          </Reveal>

          <div className="cmp-deep-grid">
            <Reveal delay={0.1}>
              <div className="cmp-deep-col cmp-col-highlight">
                <div className="cmp-deep-col-title">SocioFi Ventures</div>
                {[
                  { label: 'Equity taken', val: '5–20%', highlight: true },
                  { label: 'Availability', val: 'Ready now — no hiring process', highlight: true },
                  { label: 'Build quality', val: 'Proven process, same as Studio', highlight: true },
                  { label: 'Post-launch', val: '3 months maintenance + 6 months hosting included', highlight: true },
                  { label: 'Risk', val: 'Partnership. SocioFi only succeeds if you do.', highlight: true },
                ].map((row) => (
                  <div className="cmp-deep-row" key={row.label}>
                    <div className="cmp-deep-row-label">{row.label}</div>
                    <div className={`cmp-deep-row-val${row.highlight ? ' cmp-highlight-val' : ''}`}>{row.val}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="cmp-deep-col">
                <div className="cmp-deep-col-title" style={{ color: 'var(--text-muted)' }}>Hiring a CTO</div>
                {[
                  { label: 'Equity taken', val: '30–50%' },
                  { label: 'Availability', val: '2–6 months to find and onboard the right person' },
                  { label: 'Build quality', val: 'Highly variable — depends on the individual' },
                  { label: 'Post-launch', val: 'You manage them. If they leave, you start over.' },
                  { label: 'Risk', val: "They can walk away. You can't get the equity back." },
                ].map((row) => (
                  <div className="cmp-deep-row" key={row.label}>
                    <div className="cmp-deep-row-label">{row.label}</div>
                    <div className="cmp-deep-row-val">{row.val}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── vs VC Funding ── */}
      <section className="cmp-section">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-centered">
              <div className="cmp-sec-label">Deep Dive</div>
              <h2 className="cmp-sec-h2">Ventures vs. Raising VC.</h2>
            </div>
          </Reveal>

          <div className="cmp-deep-grid">
            <Reveal delay={0.1}>
              <div className="cmp-deep-col cmp-col-highlight">
                <div className="cmp-deep-col-title">SocioFi Ventures</div>
                {[
                  { label: 'What you need', val: 'Validated idea + domain expertise', highlight: true },
                  { label: 'Timeline to product', val: '2–6 weeks after acceptance', highlight: true },
                  { label: 'Equity dilution', val: '5–20% to SocioFi', highlight: true },
                  { label: 'Control retained', val: 'Founder keeps full operational control', highlight: true },
                  { label: 'Strategy', val: 'Build first. Raise on traction if you want to.', highlight: true },
                ].map((row) => (
                  <div className="cmp-deep-row" key={row.label}>
                    <div className="cmp-deep-row-label">{row.label}</div>
                    <div className={`cmp-deep-row-val${row.highlight ? ' cmp-highlight-val' : ''}`}>{row.val}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="cmp-deep-col">
                <div className="cmp-deep-col-title" style={{ color: 'var(--text-muted)' }}>Raising VC</div>
                {[
                  { label: 'What you need', val: 'Traction + pitch deck + network + luck' },
                  { label: 'Timeline to product', val: '3–6 months of fundraising before building' },
                  { label: 'Equity dilution', val: '15–30% per round (multiple rounds expected)' },
                  { label: 'Control retained', val: 'Board oversight, investor expectations, milestone pressure' },
                  { label: 'Strategy', val: 'Raise to build. Investors expect rapid scale.' },
                ].map((row) => (
                  <div className="cmp-deep-row" key={row.label}>
                    <div className="cmp-deep-row-label">{row.label}</div>
                    <div className="cmp-deep-row-val">{row.val}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Venture advantages summary ── */}
      <section className="cmp-section-alt">
        <div className="cmp-container">
          <Reveal>
            <div className="cmp-centered">
              <div className="cmp-sec-label">Why Ventures</div>
              <h2 className="cmp-sec-h2">When Ventures Is the Right Choice.</h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ maxWidth: 680, margin: '40px auto 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'You\'ve validated demand but can\'t afford Studio rates right now',
                'You want to build your product without spending months fundraising first',
                'You have deep domain expertise and just need the technical side handled',
                'You\'re comfortable sharing upside because you believe in the outcome',
                'You want a technical partner who\'s invested in your success — not just a vendor',
                'You need post-launch support included without extra negotiation',
              ].map((item, i) => (
                <Reveal key={item} delay={i * 0.06}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flexShrink: 0, marginTop: 2 }}><CheckSmall /></div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{item}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="cmp-final-cta">
        <Reveal>
          <div className="cmp-sec-label" style={{ justifyContent: 'center', display: 'flex' }}>
            Next Step
          </div>
          <h2 className="cmp-cta-h2">Convinced? Apply to Ventures.</h2>
          <p className="cmp-cta-sub">
            10 minutes to apply. 7 business days to hear back. Every application reviewed personally.
          </p>
          <div className="cmp-btns">
            <Link href="/ventures/apply" className="cmp-btn-primary">
              Apply to Ventures <ArrowRight />
            </Link>
            <Link href="/studio/pricing" className="cmp-btn-ghost">
              Prefer to pay for Studio?
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
