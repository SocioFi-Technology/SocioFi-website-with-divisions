'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import type { Metadata } from 'next';

/* ═══════════════════════════════════════════════════════════════════════
   VENTURES — HOW IT WORKS
   Three deal models explained in depth with animated visuals.
   ═══════════════════════════════════════════════════════════════════════ */

const A = '#6BA3E8';

const F = {
  h: "var(--font-display, 'Syne'), sans-serif",
  b: "var(--font-body, 'Outfit'), sans-serif",
  m: "var(--font-mono, 'Fira Code'), monospace",
};

/* ── Scoped CSS ─────────────────────────────────────────────────────── */
const STYLES = `
  .hiw-page { min-height: 100vh; background: var(--bg); }

  /* Hero */
  .hiw-hero {
    padding: 140px 0 100px;
    background: var(--bg);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hiw-hero-glow {
    position: absolute;
    width: 700px; height: 400px;
    border-radius: 50%;
    filter: blur(120px);
    background: ${A}18;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .hiw-hero-inner {
    max-width: 760px;
    margin: 0 auto;
    padding: 0 32px;
    position: relative;
    z-index: 1;
  }
  .hiw-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 20px;
  }
  .hiw-label::before {
    content: '';
    width: 20px; height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .hiw-h1 {
    font-family: ${F.h};
    font-size: clamp(2.4rem, 4.5vw, 3.6rem);
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: var(--text-primary);
    margin: 0 0 24px;
  }
  .hiw-subtitle {
    font-family: ${F.b};
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 640px;
    margin: 0 auto;
  }

  /* Sections */
  .hiw-sec {
    padding: 100px 0;
    position: relative;
  }
  .hiw-sec-alt { background: var(--bg-2); }
  .hiw-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
  }

  /* Section header */
  .hiw-sec-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 14px;
  }
  .hiw-sec-label::before {
    content: '';
    width: 20px; height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .hiw-h2 {
    font-family: ${F.h};
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 0 0 48px;
    max-width: 680px;
  }

  /* 2-col layout */
  .hiw-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .hiw-2col { grid-template-columns: 1fr; gap: 40px; }
  }

  /* Numbered steps */
  .hiw-steps { display: flex; flex-direction: column; gap: 20px; }
  .hiw-step {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }
  .hiw-step-num {
    flex-shrink: 0;
    width: 30px; height: 30px;
    border-radius: 50%;
    background: ${A}18;
    border: 1.5px solid ${A}40;
    display: flex; align-items: center; justify-content: center;
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 600;
    color: ${A};
    margin-top: 1px;
  }
  .hiw-step-text {
    font-family: ${F.b};
    font-size: 0.95rem;
    line-height: 1.65;
    color: var(--text-secondary);
  }

  /* Terms table */
  .hiw-table-wrap {
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    margin-top: 40px;
  }
  .hiw-table-head {
    display: grid;
    grid-template-columns: 1fr 1fr 1.4fr;
    padding: 12px 20px;
    background: ${A}0D;
    border-bottom: 1px solid var(--border);
  }
  .hiw-table-head span {
    font-family: ${F.m};
    font-size: 0.68rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .hiw-table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1.4fr;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
  }
  .hiw-table-row:last-child { border-bottom: none; }
  .hiw-table-row:hover { background: ${A}08; }
  .hiw-table-cell-label {
    font-family: ${F.b};
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--text-primary);
  }
  .hiw-table-cell-val {
    font-family: ${F.m};
    font-size: 0.82rem;
    color: ${A};
  }
  .hiw-table-cell-note {
    font-family: ${F.b};
    font-size: 0.82rem;
    color: var(--text-muted);
  }

  /* Bullets */
  .hiw-bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .hiw-bullet {
    display: flex; gap: 10px; align-items: flex-start;
    font-family: ${F.b};
    font-size: 0.92rem;
    line-height: 1.6;
    color: var(--text-secondary);
  }
  .hiw-bullet::before {
    content: '';
    flex-shrink: 0;
    margin-top: 8px;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${A};
  }

  /* Caveat blockquote */
  .hiw-caveat {
    margin: 40px 0 0;
    padding: 24px 28px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-left: 3px solid ${A};
    border-radius: var(--radius-md);
  }
  .hiw-caveat p {
    font-family: ${F.b};
    font-size: 0.92rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0;
    font-style: italic;
  }

  /* Scenario card */
  .hiw-scenario {
    margin-top: 40px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  .hiw-scenario-header {
    padding: 20px 24px;
    background: ${A}12;
    border-bottom: 1px solid var(--border);
  }
  .hiw-scenario-title {
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 6px;
  }
  .hiw-scenario-params {
    font-family: ${F.b};
    font-size: 0.88rem;
    color: var(--text-primary);
    font-weight: 500;
  }
  .hiw-scenario-params span {
    color: ${A};
    font-family: ${F.m};
    font-weight: 600;
  }
  .hiw-scenario-rows { padding: 8px 0; }
  .hiw-scenario-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 24px;
    border-bottom: 1px solid var(--border);
  }
  .hiw-scenario-row:last-child { border-bottom: none; }
  .hiw-scenario-month {
    font-family: ${F.m};
    font-size: 0.78rem;
    color: var(--text-muted);
  }
  .hiw-scenario-detail {
    font-family: ${F.b};
    font-size: 0.88rem;
    color: var(--text-secondary);
    flex: 1;
    margin: 0 16px;
  }
  .hiw-scenario-payment {
    font-family: ${F.m};
    font-size: 0.88rem;
    color: var(--text-primary);
    font-weight: 500;
  }
  .hiw-scenario-row-cap {
    background: ${A}10;
    border-top: 1.5px solid ${A}40;
  }
  .hiw-scenario-row-cap .hiw-scenario-payment {
    color: ${A};
    font-weight: 700;
  }
  .hiw-scenario-footer {
    padding: 16px 24px;
    background: var(--bg-2);
    font-family: ${F.b};
    font-size: 0.88rem;
    color: var(--text-secondary);
    font-style: italic;
  }

  /* Decision tree */
  .hiw-decision {
    margin-top: 40px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 36px;
  }
  .hiw-decision-node {
    display: inline-block;
    padding: 10px 18px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: ${F.b};
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--text-primary);
    background: var(--bg-card);
    text-align: center;
  }
  .hiw-decision-answer {
    display: inline-block;
    padding: 6px 14px;
    border-radius: var(--radius-full);
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 500;
    background: ${A}15;
    border: 1px solid ${A}30;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .hiw-decision-result {
    display: inline-block;
    padding: 8px 16px;
    border-radius: var(--radius-sm);
    font-family: ${F.b};
    font-size: 0.85rem;
    font-weight: 600;
    background: ${A}18;
    border: 1.5px solid ${A}40;
    color: ${A};
  }
  .hiw-decision-line {
    width: 2px;
    min-height: 24px;
    background: var(--border);
    margin: 4px auto;
  }
  .hiw-decision-row {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    margin-top: 4px;
  }
  .hiw-decision-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hiw-decision-h-line {
    height: 2px;
    background: var(--border);
    flex: 1;
    margin-top: 14px;
  }
  .hiw-decision-row-wrap {
    display: flex;
    align-items: flex-start;
    gap: 0;
  }

  /* CTA section */
  .hiw-cta {
    padding: 100px 0;
    background: var(--bg);
    text-align: center;
  }
  .hiw-cta-inner {
    max-width: 640px;
    margin: 0 auto;
    padding: 0 32px;
  }
  .hiw-cta h2 {
    font-family: ${F.h};
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 0 0 16px;
  }
  .hiw-cta p {
    font-family: ${F.b};
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0 0 36px;
  }
  .hiw-cta-btns {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .hiw-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: ${A};
    color: #fff;
    font-family: ${F.h};
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    border-radius: var(--radius-full);
    text-decoration: none;
    transition: all 0.2s;
  }
  .hiw-btn-primary:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 32px ${A}50;
  }
  .hiw-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: transparent;
    color: var(--text-primary);
    font-family: ${F.h};
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-full);
    text-decoration: none;
    transition: all 0.2s;
  }
  .hiw-btn-ghost:hover {
    border-color: ${A};
    color: ${A};
  }

  /* Sub-section divider */
  .hiw-subsec-label {
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 16px;
  }

  /* Balance scale visual */
  @keyframes hiw-scale-settle {
    0% { transform: rotate(-8deg); }
    60% { transform: rotate(3deg); }
    80% { transform: rotate(-1.5deg); }
    100% { transform: rotate(0deg); }
  }
  .hiw-scale-arm { transform-origin: center; animation: hiw-scale-settle 1.8s ease-out forwards; }

  /* Responsive */
  @media (max-width: 768px) {
    .hiw-hero { padding: 120px 0 80px; }
    .hiw-sec { padding: 70px 0; }
    .hiw-container { padding: 0 20px; }
    .hiw-h2 { font-size: 1.7rem; margin-bottom: 32px; }
    .hiw-table-head, .hiw-table-row { grid-template-columns: 1fr 1fr; }
    .hiw-table-head span:last-child, .hiw-table-cell-note { display: none; }
    .hiw-decision { padding: 24px 20px; }
  }
`;

/* ── Animated Pie Chart (SVG) ──────────────────────────────────────── */
function PieChart() {
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView({ current: ref.current ? ref.current.closest('svg') as Element : null }, { once: true, amount: 0.5 });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (inView) setAnimated(true);
  }, [inView]);

  const r = 80;
  const cx = 110;
  const cy = 110;
  const circumference = 2 * Math.PI * r;
  // SocioFi = 12%, founder = 88%
  const sociofiArc = circumference * 0.12;
  const founderArc = circumference * 0.88;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <svg
        width="220" height="220"
        viewBox="0 0 220 220"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        {/* Founder slice — 88% (background) */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={`${A}22`}
          strokeWidth="36"
        />
        {/* Founder slice — colored */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={`${A}55`}
          strokeWidth="36"
          strokeDasharray={`${founderArc} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
        />
        {/* SocioFi slice — 12%, animated fill */}
        <circle
          ref={ref}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={A}
          strokeWidth="40"
          strokeDasharray={animated ? `${sociofiArc} ${circumference}` : `0 ${circumference}`}
          strokeDashoffset={circumference * 0.25 + founderArc}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: `${cx}px ${cy}px`,
            transition: 'stroke-dasharray 1.4s cubic-bezier(0.16,1,0.3,1)',
            filter: `drop-shadow(0 0 8px ${A}80)`,
          }}
        />
        {/* Center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text-primary)"
          fontFamily={F.h} fontSize="22" fontWeight="800">88%</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text-muted)"
          fontFamily={F.b} fontSize="11">Founder keeps</text>

        {/* SocioFi label */}
        <text x={cx + 95} y={cy - 32} textAnchor="middle" fill={A}
          fontFamily={F.h} fontSize="16" fontWeight="700">12%</text>
        <text x={cx + 90} y={cy - 16} textAnchor="middle" fill="var(--text-muted)"
          fontFamily={F.b} fontSize="10">SocioFi</text>
      </svg>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: `${A}55` }} />
          <span style={{ fontFamily: F.b, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Founder (88%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: A }} />
          <span style={{ fontFamily: F.b, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>SocioFi equity (12%)</span>
        </div>
      </div>
    </div>
  );
}

/* ── Revenue Chart (SVG Line) ─────────────────────────────────────── */
function RevenueChart() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => { if (inView) setAnimated(true); }, [inView]);

  const W = 340, H = 180;
  const pad = { t: 20, r: 20, b: 36, l: 48 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;

  // Months 0-24, revenue grows, cap line at 45000
  const cap = 45000;
  const points: [number, number][] = [
    [0, 0], [2, 0], [3, 2000], [6, 5000], [9, 8000],
    [12, 10000], [15, 13000], [18, 16000], [21, 18000], [24, cap],
  ];
  const xScale = (m: number) => pad.l + (m / 24) * iW;
  const yScale = (v: number) => H - pad.b - (v / 60000) * iH;
  const capY = yScale(cap * 0.85);

  const linePath = points.map(([m, v], i) =>
    `${i === 0 ? 'M' : 'L'}${xScale(m).toFixed(1)},${yScale(v).toFixed(1)}`
  ).join(' ');

  const areaPath = linePath + ` L${xScale(24)},${H - pad.b} L${xScale(0)},${H - pad.b} Z`;

  const totalLen = 600; // approx

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={pad.l} y1={H - pad.b - t * iH}
            x2={W - pad.r} y2={H - pad.b - t * iH}
            stroke="var(--border)" strokeWidth="1"
          />
        ))}
        {/* Cap line */}
        <line
          x1={pad.l} y1={capY}
          x2={W - pad.r} y2={capY}
          stroke={A} strokeWidth="1.5" strokeDasharray="6,4"
          opacity="0.6"
        />
        <text x={W - pad.r + 4} y={capY + 4} fill={A}
          fontFamily={F.m} fontSize="9" fontWeight="500">Cap</text>

        {/* Area fill */}
        <clipPath id="rev-clip">
          <rect x={pad.l} y={0} width={animated ? iW : 0} height={H}
            style={{ transition: 'width 2s cubic-bezier(0.16,1,0.3,1)' }} />
        </clipPath>
        <path d={areaPath} fill={`${A}15`} clipPath="url(#rev-clip)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={A}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={animated ? `${totalLen} 0` : `0 ${totalLen}`}
          style={{ transition: 'stroke-dasharray 2s cubic-bezier(0.16,1,0.3,1)' }}
        />

        {/* Axes */}
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b}
          stroke="var(--border)" strokeWidth="1" />
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b}
          stroke="var(--border)" strokeWidth="1" />

        {/* X labels */}
        {[0, 6, 12, 18, 24].map((m) => (
          <text key={m} x={xScale(m)} y={H - pad.b + 16}
            textAnchor="middle" fill="var(--text-muted)"
            fontFamily={F.b} fontSize="10">
            M{m}
          </text>
        ))}

        {/* Cap label at line */}
        <text x={pad.l + iW * 0.55} y={capY - 8} textAnchor="middle"
          fill={A} fontFamily={F.b} fontSize="10" fontWeight="600">
          Payments stop. You keep everything.
        </text>
      </svg>
    </div>
  );
}

/* ── Balance Scale (SVG) ─────────────────────────────────────────── */
function BalanceScale() {
  const [settled, setSettled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  useEffect(() => { if (inView) setTimeout(() => setSettled(true), 100); }, [inView]);

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <svg width="280" height="180" viewBox="0 0 280 180" aria-hidden="true">
        {/* Fulcrum */}
        <polygon points="140,145 125,165 155,165" fill="var(--text-muted)" opacity="0.4" />
        <rect x="115" y="163" width="50" height="6" rx="3" fill="var(--text-muted)" opacity="0.4" />

        {/* Arm */}
        <g
          className="hiw-scale-arm"
          style={settled ? { animation: 'hiw-scale-settle 1.8s ease-out forwards' } : {}}
        >
          <line x1="40" y1="100" x2="240" y2="100" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
          {/* Pivot */}
          <circle cx="140" cy="100" r="6" fill={A} />
          {/* Left pan — 30-50% cash */}
          <line x1="55" y1="100" x2="55" y2="128" stroke="var(--border)" strokeWidth="2" />
          <rect x="28" y="128" width="54" height="30" rx="8" fill={`${A}20`} stroke={`${A}40`} strokeWidth="1.5" />
          <text x="55" y="141" textAnchor="middle" fill={A} fontFamily={F.h} fontSize="11" fontWeight="700">30–50%</text>
          <text x="55" y="153" textAnchor="middle" fill="var(--text-muted)" fontFamily={F.b} fontSize="9">Cash</text>

          {/* Right pan — smaller equity */}
          <line x1="225" y1="100" x2="225" y2="128" stroke="var(--border)" strokeWidth="2" />
          <rect x="198" y="128" width="54" height="30" rx="8" fill={`${A}12`} stroke={`${A}30`} strokeWidth="1.5" />
          <text x="225" y="141" textAnchor="middle" fill={A} fontFamily={F.h} fontSize="11" fontWeight="700">Smaller</text>
          <text x="225" y="153" textAnchor="middle" fill="var(--text-muted)" fontFamily={F.b} fontSize="9">Equity / Rev</text>
        </g>

        {/* Label */}
        <text x="140" y="30" textAnchor="middle" fill="var(--text-muted)" fontFamily={F.b} fontSize="11">
          Lower upfront cost · Lower equity / revenue share
        </text>
      </svg>
      <p style={{ fontFamily: F.b, fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 260 }}>
        The more cash you put in, the less equity or revenue share we ask for.
      </p>
    </div>
  );
}

/* ── Decision Tree ───────────────────────────────────────────────── */
function DecisionTree() {
  return (
    <div className="hiw-decision">
      <p className="hiw-subsec-label">Deal model guide</p>

      {/* Row 1: Budget question */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="hiw-decision-node">Do you have any budget?</div>
        <div className="hiw-decision-line" />

        {/* Branch: No / Yes */}
        <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', width: '100%', maxWidth: 580 }}>
          {/* No branch */}
          <div className="hiw-decision-col">
            <div className="hiw-decision-answer">No</div>
            <div className="hiw-decision-line" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="hiw-decision-result">Equity</div>
              <div className="hiw-decision-result">Revenue Share</div>
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1, height: 2, background: 'var(--border)', marginTop: 14 }} />

          {/* Yes branch */}
          <div className="hiw-decision-col">
            <div className="hiw-decision-answer">Yes</div>
            <div className="hiw-decision-line" />
            <div className="hiw-decision-node" style={{ fontSize: '0.82rem', padding: '8px 14px' }}>
              How much vs Studio cost?
            </div>
            <div className="hiw-decision-line" />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: F.m, fontSize: '0.68rem', color: 'var(--text-muted)' }}>&lt;30%</span>
                <div className="hiw-decision-result" style={{ fontSize: '0.78rem', padding: '6px 10px' }}>Rev Share / Equity</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: F.m, fontSize: '0.68rem', color: 'var(--text-muted)' }}>30–50%</span>
                <div className="hiw-decision-result" style={{ fontSize: '0.78rem', padding: '6px 10px' }}>Hybrid</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: F.m, fontSize: '0.68rem', color: 'var(--text-muted)' }}>&gt;50%</span>
                <div className="hiw-decision-result" style={{ fontSize: '0.78rem', padding: '6px 10px' }}>Consider Studio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '36px 0', height: '1px', background: 'var(--border)' }} />

      {/* Row 2: Equity question */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="hiw-decision-node">Do you want to keep 100% equity?</div>
        <div className="hiw-decision-line" />
        <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', width: '100%', maxWidth: 440 }}>
          <div className="hiw-decision-col">
            <div className="hiw-decision-answer">Yes</div>
            <div className="hiw-decision-line" />
            <div className="hiw-decision-result">Revenue Share</div>
          </div>
          <div style={{ flex: 1, height: 2, background: 'var(--border)', marginTop: 14 }} />
          <div className="hiw-decision-col">
            <div className="hiw-decision-answer">No</div>
            <div className="hiw-decision-line" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="hiw-decision-result">Equity</div>
              <div className="hiw-decision-result">Hybrid</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontFamily: F.b, fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
          Still not sure? Apply and we&apos;ll discuss the best model on the call.
        </p>
      </div>
    </div>
  );
}

/* ── Terms Table ─────────────────────────────────────────────────── */
interface TermRow { term: string; range: string; notes: string; }

function TermsTable({ rows }: { rows: TermRow[] }) {
  return (
    <div className="hiw-table-wrap">
      <div className="hiw-table-head">
        <span>Term</span>
        <span>Typical Range</span>
        <span>Notes</span>
      </div>
      {rows.map((row) => (
        <div key={row.term} className="hiw-table-row">
          <div className="hiw-table-cell-label">{row.term}</div>
          <div className="hiw-table-cell-val">{row.range}</div>
          <div className="hiw-table-cell-note">{row.notes}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Section Fade-in wrapper ─────────────────────────────────────── */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
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
}

/* ── Page component ──────────────────────────────────────────────── */
export default function HowItWorksPage() {
  const equityTerms: TermRow[] = [
    { term: 'Equity %', range: '5–20%', notes: 'Based on project scope and market potential' },
    { term: 'Vesting schedule', range: '2-year cliff, 4-year total', notes: 'Standard — protects both sides' },
    { term: 'Anti-dilution', range: 'None (standard dilution)', notes: 'We dilute alongside founders in future rounds' },
    { term: 'Board seat', range: 'No', notes: "We're builders, not board members" },
    { term: 'Build scope', range: 'Full MVP / V1', notes: 'Same quality as $8K–$20K Studio project' },
    { term: 'Post-launch', range: '3 months Services + 6 months Cloud', notes: 'Included at no additional cost' },
    { term: 'Code ownership', range: '100% founder', notes: 'Regardless of equity arrangement' },
  ];

  const revTerms: TermRow[] = [
    { term: 'Revenue share %', range: '8–15% of monthly revenue', notes: 'Higher % = lower cap' },
    { term: 'Cap', range: '2–3x estimated project cost', notes: 'e.g., $20K project → $40–60K cap' },
    { term: 'Payment start', range: 'Revenue > $1,000/month', notes: 'Grace period for early traction' },
    { term: 'Duration limit', range: '36 months maximum', notes: 'Payments stop regardless at 36mo' },
    { term: 'Build scope', range: 'Full MVP / V1', notes: 'Same quality as Studio' },
    { term: 'Post-launch', range: '3 months Services + 6 months Cloud', notes: 'Included' },
    { term: 'Code ownership', range: '100% founder', notes: 'Always' },
  ];

  const hybridTerms: TermRow[] = [
    { term: 'Upfront payment', range: '30–50% of Studio cost', notes: "Founder's available budget" },
    { term: 'Equity option', range: '3–8%', notes: 'Smaller because of upfront payment' },
    { term: 'Revenue option', range: '5–10%, 1.5–2x cap', notes: 'Lower % and lower cap' },
    { term: 'Build scope', range: 'Full MVP / V1', notes: 'Same quality' },
    { term: 'Post-launch', range: '3 months Services + 6 months Cloud', notes: 'Included' },
  ];

  const equitySteps = [
    'We estimate the Studio-equivalent cost of your project',
    'We negotiate an equity percentage that reflects that value + risk',
    'We build the product (same process as Studio)',
    'Equity vests over 4 years with a 2-year cliff',
    'If the company fails, we lose — same risk as the founder',
  ];

  const revSteps = [
    'We estimate the Studio-equivalent project cost',
    'We set a revenue share % and a total cap (2–3x the project cost)',
    'We build the product',
    'You launch. Revenue starts.',
    'Once monthly revenue exceeds $1,000, payments begin',
    'You pay X% of monthly revenue to SocioFi',
    'When total payments reach the cap, payments stop permanently',
    'If cap isn\'t reached within 36 months, payments stop anyway',
  ];

  const hybridSteps = [
    'You pay a partial upfront fee (30–50% of the equivalent Studio cost)',
    'We agree on a smaller equity stake or revenue share to cover the remainder',
    'We build the product with the same quality standards as any Studio project',
    'Post-launch support is included — same as all Ventures deals',
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="hiw-page">

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="hiw-hero">
          <div className="hiw-hero-glow" />
          <div className="hiw-hero-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hiw-label">How It Works</div>
              <h1 className="hiw-h1">Three Deal Models. One Goal: Build Your Product.</h1>
              <p className="hiw-subtitle">
                We&apos;re flexible on structure. What we&apos;re not flexible on is quality — every Ventures project
                gets the same engineering standards as a Studio project.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Section 1: Equity Model ──────────────────────────────── */}
        <section className="hiw-sec hiw-sec-alt">
          <div className="hiw-container">
            <FadeIn>
              <div className="hiw-sec-label">Model 1</div>
              <h2 className="hiw-h2">Equity Model: We Build, You Share Ownership.</h2>
            </FadeIn>

            <div className="hiw-2col">
              <FadeIn delay={0.1}>
                <div>
                  <p className="hiw-subsec-label" style={{ marginBottom: 12 }}>How it works</p>
                  <div className="hiw-steps">
                    {equitySteps.map((step, i) => (
                      <div key={i} className="hiw-step">
                        <div className="hiw-step-num">{i + 1}</div>
                        <div className="hiw-step-text">{step}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 36 }}>
                    <p className="hiw-subsec-label" style={{ marginBottom: 12 }}>When equity makes sense</p>
                    <ul className="hiw-bullets">
                      <li className="hiw-bullet">You&apos;re pre-revenue and can&apos;t commit cash to development</li>
                      <li className="hiw-bullet">You believe in the idea enough to give up a small stake for a real engineering team</li>
                      <li className="hiw-bullet">Your startup has high growth potential and equity has real upside</li>
                      <li className="hiw-bullet">You&apos;re working on this full-time — not a side project</li>
                    </ul>
                  </div>

                  <div className="hiw-caveat">
                    <p>
                      &ldquo;Equity is a long-term bet. If your startup doesn&apos;t succeed, our equity is worth nothing.
                      We accept this risk. In exchange, we ask for enough equity to make the bet worthwhile for us.
                      1–2% isn&apos;t enough — that&apos;s why our range starts at 5%.&rdquo;
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  <PieChart />
                  <div>
                    <p style={{ fontFamily: F.m, fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                      Typical equity split
                    </p>
                    <p style={{ fontFamily: F.b, fontSize: '0.88rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
                      The chart above shows a representative 12% example. Actual percentage depends on project scope,
                      market size, and founder commitment. Range: 5–20%.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.15}>
              <TermsTable rows={equityTerms} />
            </FadeIn>
          </div>
        </section>

        {/* ── Section 2: Revenue Share ─────────────────────────────── */}
        <section className="hiw-sec">
          <div className="hiw-container">
            <FadeIn>
              <div className="hiw-sec-label">Model 2</div>
              <h2 className="hiw-h2">Revenue Share: We Build, You Pay From Profits.</h2>
            </FadeIn>

            <div className="hiw-2col">
              <FadeIn delay={0.1}>
                <div>
                  <p className="hiw-subsec-label" style={{ marginBottom: 12 }}>How it works</p>
                  <div className="hiw-steps">
                    {revSteps.map((step, i) => (
                      <div key={i} className="hiw-step">
                        <div className="hiw-step-num">{i + 1}</div>
                        <div className="hiw-step-text">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <p style={{ fontFamily: F.m, fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                      Revenue vs payments over time
                    </p>
                    <RevenueChart />
                  </div>
                  <div style={{ background: 'var(--bg-card)', border: `1px solid ${A}25`, borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
                    <p style={{ fontFamily: F.m, fontSize: '0.68rem', color: A, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                      What the dotted line means
                    </p>
                    <p style={{ fontFamily: F.b, fontSize: '0.88rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
                      Once your cumulative payments reach the cap, all payments stop — permanently.
                      From that point forward you keep 100% of revenue.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.1}>
              <TermsTable rows={revTerms} />
            </FadeIn>

            {/* Scenario card */}
            <FadeIn delay={0.15}>
              <div className="hiw-scenario">
                <div className="hiw-scenario-header">
                  <div className="hiw-scenario-title">Example scenario</div>
                  <div className="hiw-scenario-params">
                    Project cost equivalent: <span>$15,000</span> &nbsp;·&nbsp;
                    Revenue share: <span>10%</span> &nbsp;·&nbsp;
                    Cap: <span>$45,000</span>
                  </div>
                </div>
                <div className="hiw-scenario-rows">
                  {[
                    { m: 'Month 1–3', detail: '$0 revenue', pay: '$0 payments' },
                    { m: 'Month 4', detail: '$2,000 MRR', pay: '$200 payment' },
                    { m: 'Month 8', detail: '$5,000 MRR', pay: '$500 payment' },
                    { m: 'Month 14', detail: '$10,000 MRR', pay: '$1,000 payment' },
                  ].map((r) => (
                    <div key={r.m} className="hiw-scenario-row">
                      <div className="hiw-scenario-month">{r.m}</div>
                      <div className="hiw-scenario-detail">{r.detail}</div>
                      <div className="hiw-scenario-payment">{r.pay}</div>
                    </div>
                  ))}
                  <div className={`hiw-scenario-row hiw-scenario-row-cap`}>
                    <div className="hiw-scenario-month">Month 24</div>
                    <div className="hiw-scenario-detail">Cumulative payments reach $45,000 cap</div>
                    <div className="hiw-scenario-payment">PAYMENTS STOP</div>
                  </div>
                </div>
                <div className="hiw-scenario-footer">
                  From month 25 onward: you keep 100%. Deal complete.
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Section 3: Hybrid ────────────────────────────────────── */}
        <section className="hiw-sec hiw-sec-alt">
          <div className="hiw-container">
            <FadeIn>
              <div className="hiw-sec-label">Model 3</div>
              <h2 className="hiw-h2">Hybrid: Some Cash Now, Less Equity/Revenue Later.</h2>
            </FadeIn>

            <div className="hiw-2col">
              <FadeIn delay={0.1}>
                <div>
                  <p className="hiw-subsec-label" style={{ marginBottom: 12 }}>How it works</p>
                  <div className="hiw-steps">
                    {hybridSteps.map((step, i) => (
                      <div key={i} className="hiw-step">
                        <div className="hiw-step-num">{i + 1}</div>
                        <div className="hiw-step-text">{step}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 32 }}>
                    <TermsTable rows={hybridTerms} />
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <BalanceScale />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Section 4: Decision Guide ─────────────────────────────── */}
        <section className="hiw-sec">
          <div className="hiw-container">
            <FadeIn>
              <div className="hiw-sec-label">Which model fits you?</div>
              <h2 className="hiw-h2">How to Choose the Right Deal Structure.</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <DecisionTree />
            </FadeIn>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="hiw-cta">
          <div className="hiw-cta-inner">
            <FadeIn>
              <div className="hiw-sec-label" style={{ justifyContent: 'center', marginBottom: 24 }}>
                Next step
              </div>
              <h2>Ready to explore a partnership?</h2>
              <p>
                Every application is reviewed by a person. Tell us what you&apos;re building and we&apos;ll tell you which
                model fits — or whether Ventures is the right fit at all.
              </p>
              <div className="hiw-cta-btns">
                <Link href="/ventures/apply" className="hiw-btn-primary">
                  Apply to Ventures
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/ventures" className="hiw-btn-ghost">
                  Back to Ventures
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </>
  );
}
