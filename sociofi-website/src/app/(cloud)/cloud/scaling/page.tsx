'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#5BB5E0';
const F = {
  display: 'var(--font-display, Syne)',
  body: 'var(--font-body, Outfit)',
  mono: 'var(--font-mono, "Fira Code")',
};

const STYLES = `
  .sc-wrap { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); font-family: ${F.body}; }

  /* ── Hero ── */
  .sc-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
  .sc-hero-orb { position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 900px; height: 700px; background: radial-gradient(ellipse at center, ${A}16 0%, transparent 65%); filter: blur(80px); pointer-events: none; }
  .sc-hero-inner { position: relative; z-index: 2; max-width: 780px; margin: 0 auto; }
  .sc-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 28px; }
  .sc-badge::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .sc-h1 { font-family: ${F.display}; font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary, #fff); margin-bottom: 24px; }
  .sc-grad { background: linear-gradient(135deg, ${A} 0%, #A3DFD2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .sc-sub { font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary, #7C8DB0); max-width: 580px; margin: 0 auto; }

  /* ── Shared section ── */
  .sc-section { padding: 100px 32px; }
  .sc-section-alt { background: var(--bg-2, #111128); }
  .sc-container { max-width: 1200px; margin: 0 auto; }
  .sc-label { display: flex; align-items: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
  .sc-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .sc-h2 { font-family: ${F.display}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .sc-desc { font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary, #7C8DB0); max-width: 580px; }
  .sc-centered { text-align: center; }
  .sc-centered .sc-label { justify-content: center; }
  .sc-centered .sc-desc { margin: 0 auto; }

  /* ── Section 1: Problem ── */
  .sc-problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; margin-top: 64px; }
  @media(max-width: 900px) { .sc-problem-grid { grid-template-columns: 1fr; gap: 40px; } }
  .sc-problem-text h3 { font-family: ${F.display}; font-size: 1.1rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 12px; }
  .sc-problem-text p { font-size: 0.95rem; color: var(--text-secondary, #7C8DB0); line-height: 1.75; margin-bottom: 16px; }
  .sc-problem-bullet { display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: var(--text-secondary, #7C8DB0); line-height: 1.55; margin-bottom: 10px; }
  .sc-problem-bullet-dot { width: 6px; height: 6px; border-radius: 50%; background: #E8916F; flex-shrink: 0; margin-top: 7px; }
  .sc-server-visual { position: relative; }
  .sc-server-box { background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); border-radius: 16px; padding: 28px; position: relative; overflow: hidden; }
  .sc-server-box::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(232,145,111,0.06), transparent); }
  .sc-server-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .sc-server-title { font-family: ${F.mono}; font-size: 0.7rem; color: var(--text-secondary, #7C8DB0); letter-spacing: 0.08em; text-transform: uppercase; }
  .sc-error-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; background: rgba(232,145,111,0.15); border: 1px solid rgba(232,145,111,0.4); border-radius: 100px; font-family: ${F.mono}; font-size: 0.65rem; font-weight: 700; color: #E8916F; animation: sc-error-pulse 1.5s ease-in-out infinite; }
  @keyframes sc-error-pulse { 0%,100%{opacity:1}50%{opacity:0.6} }
  .sc-error-dot { width: 6px; height: 6px; border-radius: 50%; background: #E8916F; }
  .sc-bar-row { margin-bottom: 12px; }
  .sc-bar-label { display: flex; justify-content: space-between; font-family: ${F.mono}; font-size: 0.65rem; color: var(--text-muted, #4A5578); margin-bottom: 5px; }
  .sc-bar-label span:last-child { color: #E8916F; }
  .sc-bar-track { height: 8px; background: var(--bg-2, #111128); border-radius: 4px; overflow: hidden; }
  .sc-bar-fill { height: 100%; border-radius: 4px; }
  .sc-bar-fill-ok { background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); }
  .sc-bar-fill-warn { background: linear-gradient(90deg, #E8B84D, #E8916F); }
  .sc-bar-fill-crit { background: linear-gradient(90deg, #E8916F, #D94F4F); animation: sc-bar-overflow 1.2s ease-in-out infinite; }
  @keyframes sc-bar-overflow { 0%,100%{opacity:1}50%{opacity:0.7} }
  .sc-response-code { margin-top: 20px; padding: 14px 16px; background: var(--bg-2, #111128); border-radius: 10px; border: 1px solid rgba(232,145,111,0.2); font-family: ${F.mono}; }
  .sc-response-line { font-size: 0.75rem; line-height: 1.7; }
  .sc-response-line.red { color: #E8916F; }
  .sc-response-line.dim { color: var(--text-muted, #4A5578); }

  /* ── Section 2: Scaling types diagram ── */
  .sc-scaling-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 56px; max-width: 860px; margin-left: auto; margin-right: auto; }
  @media(max-width: 680px) { .sc-scaling-grid { grid-template-columns: 1fr; } }
  .sc-scaling-card { padding: 40px 32px 32px; border-radius: 20px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); text-align: center; position: relative; overflow: hidden; transition: all 0.35s; }
  .sc-scaling-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); opacity: 0; transition: opacity 0.35s; }
  .sc-scaling-card:hover { transform: translateY(-4px); border-color: ${A}25; }
  .sc-scaling-card:hover::before { opacity: 1; }
  .sc-scaling-diagram { margin: 0 auto 24px; display: flex; justify-content: center; }
  .sc-scaling-title { font-family: ${F.display}; font-size: 1.1rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 10px; }
  .sc-scaling-desc { font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); line-height: 1.65; }
  .sc-scaling-badge { display: inline-block; margin-top: 14px; font-family: ${F.mono}; font-size: 0.62rem; padding: 3px 10px; border-radius: 100px; background: ${A}12; color: ${A}; border: 1px solid ${A}22; }

  /* ── Section 3: Auto-scaling rules ── */
  .sc-rules-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
  @media(max-width: 900px) { .sc-rules-grid { grid-template-columns: 1fr; } }
  .sc-rule-card { padding: 32px 28px; border-radius: 18px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); position: relative; overflow: hidden; transition: all 0.35s; }
  .sc-rule-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); opacity: 0; transition: opacity 0.35s; }
  .sc-rule-card:hover { transform: translateY(-4px); border-color: ${A}25; }
  .sc-rule-card:hover::after { opacity: 1; }
  .sc-rule-icon { width: 44px; height: 44px; border-radius: 10px; background: ${A}15; display: flex; align-items: center; justify-content: center; color: ${A}; margin-bottom: 18px; }
  .sc-rule-title { font-family: ${F.display}; font-size: 1rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 14px; }
  .sc-rule-triggers { display: flex; flex-direction: column; gap: 10px; }
  .sc-rule-trigger { display: flex; align-items: flex-start; gap: 10px; }
  .sc-rule-metric { font-family: ${F.mono}; font-size: 0.7rem; font-weight: 600; color: ${A}; background: ${A}12; border: 1px solid ${A}22; border-radius: 5px; padding: 3px 8px; white-space: nowrap; flex-shrink: 0; margin-top: 1px; }
  .sc-rule-action { font-size: 0.84rem; color: var(--text-secondary, #7C8DB0); line-height: 1.5; }

  /* ── Section 4: Scenarios ── */
  .sc-scenarios { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
  @media(max-width: 900px) { .sc-scenarios { grid-template-columns: 1fr; } }
  .sc-scenario { padding: 28px; border-radius: 18px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); overflow: hidden; transition: all 0.35s; }
  .sc-scenario:hover { transform: translateY(-4px); border-color: ${A}22; }
  .sc-scenario-tag { font-family: ${F.mono}; font-size: 0.62rem; font-weight: 600; color: ${A}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
  .sc-scenario-title { font-family: ${F.display}; font-size: 0.98rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 8px; }
  .sc-scenario-desc { font-size: 0.84rem; color: var(--text-secondary, #7C8DB0); line-height: 1.6; margin-bottom: 20px; }
  .sc-chart { width: 100%; height: 72px; margin-bottom: 16px; }
  .sc-scenario-outcome { display: flex; align-items: center; gap: 8px; font-family: ${F.mono}; font-size: 0.65rem; color: ${A}; text-transform: uppercase; letter-spacing: 0.08em; }
  .sc-scenario-outcome-dot { width: 6px; height: 6px; border-radius: 50%; background: ${A}; flex-shrink: 0; }

  /* ── Section 5: Metrics bar ── */
  .sc-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 56px; }
  @media(max-width: 768px) { .sc-metrics { grid-template-columns: 1fr; } }
  .sc-metric { padding: 36px 32px; border-radius: 18px; background: var(--bg-card, #13132B); border: 1px solid ${A}18; text-align: center; }
  .sc-metric-num { font-family: ${F.display}; font-size: 2.8rem; font-weight: 800; line-height: 1; letter-spacing: -0.04em; color: ${A}; margin-bottom: 8px; }
  .sc-metric-label { font-family: ${F.mono}; font-size: 0.7rem; color: var(--text-secondary, #7C8DB0); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
  .sc-metric-note { font-size: 0.82rem; color: var(--text-muted, #4A5578); line-height: 1.5; }

  /* ── CTA ── */
  .sc-cta { padding: 100px 32px; background: linear-gradient(135deg, ${A}10, var(--bg-2, #111128), ${A}06); text-align: center; }
  .sc-cta-h2 { font-family: ${F.display}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; letter-spacing: -0.025em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .sc-cta-sub { font-size: 1.05rem; color: var(--text-secondary, #7C8DB0); max-width: 460px; margin: 0 auto 36px; line-height: 1.7; }
  .sc-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 24px rgba(91,181,224,0.25); }
  .sc-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(91,181,224,0.4); }

  /* ── Vertical scaling animation ── */
  @keyframes sc-grow-up {
    0% { height: 32px; }
    50% { height: 72px; }
    100% { height: 32px; }
  }
  .sc-server-animated { animation: sc-grow-up 3s ease-in-out infinite; }

  /* ── Horizontal scaling animation ── */
  @keyframes sc-appear {
    0% { opacity: 0; transform: scale(0.7); }
    100% { opacity: 1; transform: scale(1); }
  }
  .sc-instance-2 { animation: sc-appear 0.6s 0.4s ease-out backwards; }
  .sc-instance-3 { animation: sc-appear 0.6s 0.8s ease-out backwards; }

  /* ── Chart bar animation ── */
  @keyframes sc-bar-rise {
    from { height: 0; }
    to { height: var(--bar-h); }
  }
`;

// ── Reveal utility ──
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

// ── SVG Icons ──
const IconCPU = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
);

const IconActivity = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const IconCalendar = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// ── Server struggle visual ──
function ServerStruggleVisual() {
  return (
    <div className="sc-server-box">
      <div className="sc-server-header">
        <span className="sc-server-title">app-server-01</span>
        <div className="sc-error-badge">
          <span className="sc-error-dot" />
          503 Error
        </div>
      </div>
      <div className="sc-bar-row">
        <div className="sc-bar-label">
          <span>CPU</span>
          <span>98%</span>
        </div>
        <div className="sc-bar-track">
          <div className="sc-bar-fill sc-bar-fill-crit" style={{ width: '98%' }} />
        </div>
      </div>
      <div className="sc-bar-row">
        <div className="sc-bar-label">
          <span>Memory</span>
          <span>94%</span>
        </div>
        <div className="sc-bar-track">
          <div className="sc-bar-fill sc-bar-fill-crit" style={{ width: '94%' }} />
        </div>
      </div>
      <div className="sc-bar-row">
        <div className="sc-bar-label">
          <span>Requests / sec</span>
          <span>1,840 (limit: 200)</span>
        </div>
        <div className="sc-bar-track">
          <div className="sc-bar-fill sc-bar-fill-warn" style={{ width: '100%' }} />
        </div>
      </div>
      <div className="sc-bar-row">
        <div className="sc-bar-label">
          <span>Avg response time</span>
          <span>12.4s</span>
        </div>
        <div className="sc-bar-track">
          <div className="sc-bar-fill sc-bar-fill-crit" style={{ width: '100%' }} />
        </div>
      </div>
      <div className="sc-response-code">
        <div className="sc-response-line red">HTTP/1.1 503 Service Unavailable</div>
        <div className="sc-response-line dim">Retry-After: 120</div>
        <div className="sc-response-line red">Connection reset by peer</div>
        <div className="sc-response-line dim">upstream connect error — no healthy endpoints</div>
      </div>
    </div>
  );
}

// ── Vertical scaling SVG diagram ──
function VerticalDiagram() {
  return (
    <svg width={120} height={140} viewBox="0 0 120 140" fill="none" aria-hidden="true" className="sc-scaling-diagram">
      {/* Base server (static) */}
      <rect x="35" y="72" width="50" height="50" rx="6" fill={`${A}18`} stroke={A} strokeWidth="1.5" strokeOpacity="0.5"/>
      {[0,1,2].map(i => (
        <rect key={i} x="43" y={80 + i * 10} width="34" height="6" rx="2" fill={A} fillOpacity={0.25 + i * 0.05}/>
      ))}
      {/* Growing overlay */}
      <rect x="35" y="18" width="50" height="50" rx="6" fill={`${A}22`} stroke={A} strokeWidth="1.8" className="sc-server-animated" style={{ transformOrigin: 'bottom' }}/>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x="43" y={26 + i * 8} width="34" height="4" rx="2" fill={A} fillOpacity={0.4 - i * 0.06}/>
      ))}
      {/* Arrow up */}
      <line x1="60" y1="10" x2="60" y2="16" stroke={A} strokeWidth="1.8" strokeDasharray="2 2"/>
      <polyline points="55,14 60,6 65,14" stroke={A} strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Label */}
      <text x="60" y="135" textAnchor="middle" fill={A} fontSize="8" fontFamily="Fira Code, monospace" fillOpacity="0.8">GROW UP</text>
    </svg>
  );
}

// ── Horizontal scaling SVG diagram ──
function HorizontalDiagram() {
  const servers = [
    { x: 4, opacity: 1, strokeW: 1.8 },
    { x: 58, opacity: 1, strokeW: 1.8 },
    { x: 112, opacity: 0.85, strokeW: 1.4 },
  ];
  return (
    <svg width={200} height={140} viewBox="0 0 200 140" fill="none" aria-hidden="true" className="sc-scaling-diagram">
      {/* Load balancer */}
      <rect x="78" y="100" width="44" height="22" rx="5" fill={`${A}18`} stroke={A} strokeWidth="1.3" strokeOpacity="0.6"/>
      <text x="100" y="115" textAnchor="middle" fill={A} fontSize="7.5" fontFamily="Fira Code, monospace" fillOpacity="0.8">LOAD BALANCER</text>
      {/* Lines from LB to servers */}
      {[26, 100, 134].map((tx, i) => (
        <line key={i} x1="100" y1="100" x2={tx} y2="68" stroke={A} strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3 2"/>
      ))}
      {/* Servers */}
      {servers.map((s, i) => (
        <g key={i} className={i === 1 ? 'sc-instance-2' : i === 2 ? 'sc-instance-3' : undefined}>
          <rect x={s.x} y="12" width="44" height="56" rx="6" fill={`${A}${i === 0 ? '20' : '14'}`} stroke={A} strokeWidth={s.strokeW} strokeOpacity={s.opacity}/>
          {[0,1,2,3].map(j => (
            <rect key={j} x={s.x + 8} y={22 + j * 10} width="28" height="5" rx="2" fill={A} fillOpacity={0.38 - j * 0.07}/>
          ))}
        </g>
      ))}
      {/* +1 new label */}
      <text x="134" y="8" textAnchor="middle" fill={A} fontSize="8" fontFamily="Fira Code, monospace" fillOpacity="0.9">+1 NEW</text>
      <text x="100" y="135" textAnchor="middle" fill={A} fontSize="8" fontFamily="Fira Code, monospace" fillOpacity="0.8">ADD INSTANCES</text>
    </svg>
  );
}

// ── Scenario line chart ──
function ScenarioChart({ points, color = A }: { points: number[]; color?: string }) {
  const W = 260;
  const H = 72;
  const pad = 12;
  const maxP = Math.max(...points);
  const minP = Math.min(...points);
  const range = maxP - minP || 1;
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (W - pad * 2));
  const ys = points.map((p) => H - pad - ((p - minP) / range) * (H - pad * 2));

  const pathD = points.map((_, i) => `${i === 0 ? 'M' : 'L'}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const fillD = pathD + ` L${xs[xs.length - 1].toFixed(1)},${H} L${xs[0].toFixed(1)},${H} Z`;

  return (
    <svg className="sc-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`sc-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#sc-grad-${color.replace('#', '')})`}/>
      <path d={pathD} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Scale-out marker line */}
      {points.findIndex(p => p === maxP) > 0 && (
        <line
          x1={xs[points.findIndex(p => p === maxP)].toFixed(1)}
          y1={pad}
          x2={xs[points.findIndex(p => p === maxP)].toFixed(1)}
          y2={H - pad}
          stroke={color}
          strokeWidth="1"
          strokeDasharray="3 2"
          strokeOpacity="0.5"
        />
      )}
    </svg>
  );
}

export default function ScalingPage() {
  return (
    <div className="sc-wrap">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="sc-hero">
        <div className="sc-hero-orb" />
        <div className="sc-hero-inner">
          <Reveal>
            <div className="sc-badge">Auto-Scaling</div>
            <h1 className="sc-h1">
              Your App Should{' '}
              <span className="sc-grad">Never Go Down</span>
            </h1>
            <p className="sc-sub">
              Traffic spikes, product launches, viral moments — SocioFi Cloud scales your infrastructure automatically, before your users notice anything.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 1: The problem ── */}
      <section className="sc-section sc-section-alt">
        <div className="sc-container">
          <Reveal>
            <div className="sc-label">The Problem</div>
            <h2 className="sc-h2">Traffic spikes kill apps.</h2>
          </Reveal>

          <div className="sc-problem-grid">
            <Reveal delay={0.05}>
              <div className="sc-problem-text">
                <h3>Most apps are built for average traffic. Not peak traffic.</h3>
                <p>
                  You test your app at normal load, it performs fine. Then something happens — a Product Hunt listing, a newsletter mention, a tweet that lands — and traffic spikes 10x in an hour.
                </p>
                <p>
                  Your single server, sized for normal load, starts queuing requests. Response times climb from 200ms to 3 seconds. Then 10 seconds. Then users start seeing error pages.
                </p>
                <div className="sc-problem-bullet">
                  <span className="sc-problem-bullet-dot" />
                  <span>Every second of slowdown costs you conversions and credibility</span>
                </div>
                <div className="sc-problem-bullet">
                  <span className="sc-problem-bullet-dot" />
                  <span>The spike usually happens when you&rsquo;re asleep or in a meeting</span>
                </div>
                <div className="sc-problem-bullet">
                  <span className="sc-problem-bullet-dot" />
                  <span>By the time you notice, damage is already done</span>
                </div>
                <div className="sc-problem-bullet">
                  <span className="sc-problem-bullet-dot" />
                  <span>Manual scaling takes minutes to hours — far too slow</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="sc-server-visual">
                <ServerStruggleVisual />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: How scaling works ── */}
      <section className="sc-section">
        <div className="sc-container sc-centered">
          <Reveal>
            <div className="sc-label">Auto-Scaling</div>
            <h2 className="sc-h2">How SocioFi Cloud Scales</h2>
            <p className="sc-desc">Two complementary strategies. We use both, triggered automatically based on what your app actually needs in the moment.</p>
          </Reveal>

          <div className="sc-scaling-grid">
            <Reveal delay={0.1}>
              <div className="sc-scaling-card">
                <VerticalDiagram />
                <div className="sc-scaling-title">Vertical Scaling</div>
                <p className="sc-scaling-desc">
                  Upgrade the existing server — more CPU, more RAM, faster storage. No load balancer needed, no code changes. Fast to apply. Best for CPU-bound or memory-bound spikes.
                </p>
                <span className="sc-scaling-badge">Instant — ~2 min upgrade window</span>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="sc-scaling-card">
                <HorizontalDiagram />
                <div className="sc-scaling-title">Horizontal Scaling</div>
                <p className="sc-scaling-desc">
                  Add more server instances and distribute load between them via a load balancer. No ceiling on capacity. We handle session management, connection pooling, and sticky routing automatically.
                </p>
                <span className="sc-scaling-badge">Zero-downtime — add instances live</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Auto-scaling rules ── */}
      <section className="sc-section sc-section-alt">
        <div className="sc-container sc-centered">
          <Reveal>
            <div className="sc-label">Scaling Logic</div>
            <h2 className="sc-h2">Auto-scaling rules</h2>
            <p className="sc-desc">Three trigger types. All configured for you. All adjustable. You never touch a config file.</p>
          </Reveal>

          <div className="sc-rules-grid">
            <Reveal delay={0.08}>
              <div className="sc-rule-card">
                <div className="sc-rule-icon"><IconCPU /></div>
                <div className="sc-rule-title">CPU threshold triggers</div>
                <div className="sc-rule-triggers">
                  <div className="sc-rule-trigger">
                    <span className="sc-rule-metric">CPU &gt; 70%</span>
                    <span className="sc-rule-action">Sustained 5+ minutes → add one instance (horizontal scale-out)</span>
                  </div>
                  <div className="sc-rule-trigger">
                    <span className="sc-rule-metric">CPU &lt; 30%</span>
                    <span className="sc-rule-action">Sustained 10+ minutes → remove one instance (scale-in to cut cost)</span>
                  </div>
                  <div className="sc-rule-trigger">
                    <span className="sc-rule-metric">CPU &gt; 90%</span>
                    <span className="sc-rule-action">Immediate → add two instances in parallel, alert sent</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="sc-rule-card">
                <div className="sc-rule-icon"><IconActivity /></div>
                <div className="sc-rule-title">Response time triggers</div>
                <div className="sc-rule-triggers">
                  <div className="sc-rule-trigger">
                    <span className="sc-rule-metric">P95 &gt; 500ms</span>
                    <span className="sc-rule-action">Scale up one instance — latency threshold exceeded</span>
                  </div>
                  <div className="sc-rule-trigger">
                    <span className="sc-rule-metric">P95 &gt; 2s</span>
                    <span className="sc-rule-action">Aggressive scale-out + alert — user experience critical</span>
                  </div>
                  <div className="sc-rule-trigger">
                    <span className="sc-rule-metric">Queue depth &gt; 50</span>
                    <span className="sc-rule-action">Request backlog forming → immediate horizontal expansion</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="sc-rule-card">
                <div className="sc-rule-icon"><IconCalendar /></div>
                <div className="sc-rule-title">Schedule-based scaling</div>
                <div className="sc-rule-triggers">
                  <div className="sc-rule-trigger">
                    <span className="sc-rule-metric">Pre-event</span>
                    <span className="sc-rule-action">Scale up 30 minutes before a known traffic event (Product Hunt, launch, email blast)</span>
                  </div>
                  <div className="sc-rule-trigger">
                    <span className="sc-rule-metric">Time-of-day</span>
                    <span className="sc-rule-action">Scale up at your peak hours (e.g. 9am–6pm), scale down overnight to save cost</span>
                  </div>
                  <div className="sc-rule-trigger">
                    <span className="sc-rule-metric">Post-event</span>
                    <span className="sc-rule-action">Scale back down 2 hours after the event — no idle instances billing you</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Scenarios ── */}
      <section className="sc-section">
        <div className="sc-container sc-centered">
          <Reveal>
            <div className="sc-label">Real Scenarios</div>
            <h2 className="sc-h2">Scale-out in action</h2>
            <p className="sc-desc">Three situations that would break a static server. All handled transparently by SocioFi Cloud.</p>
          </Reveal>

          <div className="sc-scenarios">
            {/* Scenario 1: Product Hunt */}
            <Reveal delay={0.08}>
              <div className="sc-scenario">
                <div className="sc-scenario-tag">Scenario 01</div>
                <div className="sc-scenario-title">Product Hunt launch</div>
                <p className="sc-scenario-desc">Traffic goes 10x in under an hour. The CPU spike triggers horizontal scale-out at minute 8. Three instances handle the surge. By hour 4, traffic normalises and instances scale back down.</p>
                <ScenarioChart points={[2, 3, 4, 18, 42, 80, 95, 82, 60, 38, 24, 14, 8, 5, 3]} />
                <div className="sc-scenario-outcome">
                  <span className="sc-scenario-outcome-dot" />
                  1 → 4 instances in 90 seconds
                </div>
              </div>
            </Reveal>

            {/* Scenario 2: Email blast */}
            <Reveal delay={0.16}>
              <div className="sc-scenario">
                <div className="sc-scenario-tag">Scenario 02</div>
                <div className="sc-scenario-title">Email blast to 50K users</div>
                <p className="sc-scenario-desc">You know it&rsquo;s coming. We pre-scale 30 minutes before send time. Traffic ramps gradually. Your app is already at capacity before the first click. Scale back down 2 hours later.</p>
                <ScenarioChart points={[2, 2, 8, 8, 12, 28, 42, 50, 46, 38, 28, 18, 10, 6, 3]} />
                <div className="sc-scenario-outcome">
                  <span className="sc-scenario-outcome-dot" />
                  Pre-scaled — zero reactive scramble
                </div>
              </div>
            </Reveal>

            {/* Scenario 3: Viral post */}
            <Reveal delay={0.24}>
              <div className="sc-scenario">
                <div className="sc-scenario-tag">Scenario 03</div>
                <div className="sc-scenario-title">Viral social post</div>
                <p className="sc-scenario-desc">A tweet hits 100K impressions at 2am. Traffic spikes without warning. Our monitoring detects the P95 latency threshold crossing within 90 seconds and triggers emergency scale-out — while you&rsquo;re asleep.</p>
                <ScenarioChart points={[1, 1, 1, 2, 65, 88, 92, 75, 50, 32, 18, 9, 4, 2, 1]} />
                <div className="sc-scenario-outcome">
                  <span className="sc-scenario-outcome-dot" />
                  Auto-detected at 2:14am — you found out at 9am
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Metrics ── */}
      <section className="sc-section sc-section-alt">
        <div className="sc-container sc-centered">
          <Reveal>
            <div className="sc-label">The Numbers</div>
            <h2 className="sc-h2">Built for the moment it matters</h2>
          </Reveal>

          <div className="sc-metrics">
            <Reveal delay={0.06}>
              <div className="sc-metric">
                <div className="sc-metric-num">&lt; 90s</div>
                <div className="sc-metric-label">Scale 1 → 50 instances</div>
                <div className="sc-metric-note">From trigger to all new instances serving traffic. No manual intervention.</div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="sc-metric">
                <div className="sc-metric-num">Zero</div>
                <div className="sc-metric-label">Config required from you</div>
                <div className="sc-metric-note">Scaling rules are set up and tuned for your app when you onboard. You never touch a YAML file.</div>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="sc-metric">
                <div className="sc-metric-num">Auto</div>
                <div className="sc-metric-label">Scales back down</div>
                <div className="sc-metric-note">Idle instances are removed automatically. You only pay for compute when your app actually needs it.</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sc-cta">
        <div className="sc-container">
          <Reveal>
            <div className="sc-label sc-centered" style={{ justifyContent: 'center', display: 'flex' }}>Get Started</div>
            <h2 className="sc-cta-h2">Get auto-scaling hosting</h2>
            <p className="sc-cta-sub">
              Tell us what you&rsquo;re running. We&rsquo;ll configure scaling rules for your app and have you live in 48 hours.
            </p>
            <Link href="/cloud/get-hosted" className="sc-btn-primary">
              Request Hosting Setup <IconArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
