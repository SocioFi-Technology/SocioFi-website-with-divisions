'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import Link from 'next/link';

const A = '#5BB5E0';
const F = {
  display: 'var(--font-display, Syne)',
  body: 'var(--font-body, Outfit)',
  mono: 'var(--font-mono, "Fira Code")',
};

const STYLES = `
  .dep-wrap { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); font-family: ${F.body}; }

  /* ── Hero ── */
  .dep-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
  .dep-hero-inner { position: relative; z-index: 2; max-width: 720px; margin: 0 auto; }
  .dep-orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; }
  .dep-orb-1 { width: 600px; height: 600px; background: ${A}; opacity: 0.05; top: -100px; left: 50%; transform: translateX(-50%); }
  .dep-orb-2 { width: 400px; height: 400px; background: #3A589E; opacity: 0.06; bottom: -80px; right: 10%; }

  .dep-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 28px; }
  .dep-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: ${A}; flex-shrink: 0; animation: dep-pulse 2s ease-in-out infinite; }
  @keyframes dep-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

  .dep-h1 { font-family: ${F.display}; font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary, #fff); margin-bottom: 24px; }
  .dep-grad { background: linear-gradient(135deg, ${A}, #A3DFD2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .dep-sub { font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary, #7C8DB0); max-width: 580px; margin: 0 auto 40px; }

  .dep-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .dep-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 24px rgba(91,181,224,0.25); }
  .dep-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(91,181,224,0.4); }
  .dep-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border: 1.5px solid var(--border, rgba(91,181,224,0.15)); color: var(--text-primary, #fff); border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .dep-btn-ghost:hover { border-color: ${A}; color: ${A}; }

  /* ── Shared section styles ── */
  .dep-section { padding: 100px 32px; }
  .dep-section-alt { background: var(--bg-2, #111128); }
  .dep-container { max-width: 1200px; margin: 0 auto; }
  .dep-label { display: flex; align-items: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
  .dep-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .dep-h2 { font-family: ${F.display}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .dep-desc { font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary, #7C8DB0); max-width: 580px; }
  .dep-centered { text-align: center; }
  .dep-centered .dep-label { justify-content: center; }
  .dep-centered .dep-desc { margin: 0 auto; }

  /* ── Before/After ── */
  .dep-ba-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 56px; }
  @media(max-width: 700px) { .dep-ba-grid { grid-template-columns: 1fr; } }
  .dep-ba-card { padding: 32px; border-radius: 16px; border: 1px solid var(--border, rgba(91,181,224,0.08)); background: var(--bg-card, #13132B); }
  .dep-ba-before { border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.03); }
  .dep-ba-after { border-color: rgba(34,197,94,0.2); background: rgba(34,197,94,0.03); }
  .dep-ba-label { font-family: ${F.mono}; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .dep-ba-label-before { color: #EF4444; }
  .dep-ba-label-after { color: #22C55E; }
  .dep-ba-dot-red { width: 8px; height: 8px; border-radius: 50%; background: #EF4444; }
  .dep-ba-dot-green { width: 8px; height: 8px; border-radius: 50%; background: #22C55E; }
  .dep-ba-row { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border, rgba(91,181,224,0.06)); font-size: 0.87rem; line-height: 1.5; color: var(--text-secondary, #7C8DB0); }
  .dep-ba-row:last-child { border-bottom: none; }
  .dep-ba-row svg { flex-shrink: 0; margin-top: 2px; }

  /* ── Blue/Green animation diagram ── */
  .dep-strategies { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-top: 56px; }
  @media(max-width: 900px) { .dep-strategies { grid-template-columns: 1fr; } }
  .dep-strat-card { padding: 32px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); position: relative; overflow: hidden; transition: all 0.3s; }
  .dep-strat-card:hover { border-color: ${A}25; transform: translateY(-4px); }
  .dep-strat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); opacity: 0; transition: opacity 0.3s; }
  .dep-strat-card:hover::before { opacity: 1; }
  .dep-strat-name { font-family: ${F.display}; font-size: 1rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 8px; }
  .dep-strat-desc { font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); line-height: 1.6; margin-bottom: 24px; }
  .dep-strat-tag { font-family: ${F.mono}; font-size: 0.64rem; padding: 3px 9px; border-radius: 4px; background: ${A}12; color: ${A}; border: 1px solid ${A}22; display: inline-block; margin-bottom: 20px; }

  /* Blue/Green SVG diagram */
  .dep-bg-diagram { width: 100%; }
  .dep-bg-server { rx: 6; ry: 6; }
  .dep-bg-traffic-label { font-family: "Fira Code", monospace; font-size: 9px; fill: ${A}; }

  /* Canary bar */
  .dep-canary-bar { display: flex; border-radius: 6px; overflow: hidden; height: 20px; margin: 16px 0 8px; }
  .dep-canary-main { background: rgba(91,181,224,0.25); flex: 9; }
  .dep-canary-new { background: ${A}; flex: 1; }
  .dep-canary-labels { display: flex; justify-content: space-between; font-family: ${F.mono}; font-size: 0.64rem; color: var(--text-secondary, #7C8DB0); }
  .dep-canary-label-a { color: var(--text-secondary, #7C8DB0); }
  .dep-canary-label-b { color: ${A}; }

  /* Rolling instances */
  .dep-rolling-row { display: flex; gap: 6px; margin: 16px 0 8px; }
  .dep-rolling-inst { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-family: ${F.mono}; font-size: 0.6rem; font-weight: 600; }
  .dep-rolling-done { background: ${A}; color: #000; }
  .dep-rolling-active { background: ${A}40; color: ${A}; border: 1px solid ${A}; }
  .dep-rolling-pending { background: rgba(255,255,255,0.05); color: var(--text-muted, #4A5578); border: 1px solid var(--border, rgba(91,181,224,0.08)); }

  /* ── CI/CD Pipeline ── */
  .dep-pipeline { margin-top: 56px; }
  .dep-pipeline-track { display: flex; align-items: center; gap: 0; overflow-x: auto; padding: 0 0 8px; }
  .dep-pipeline-stage { flex: 1; min-width: 140px; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; }
  .dep-pipeline-icon { width: 52px; height: 52px; border-radius: 14px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); display: flex; align-items: center; justify-content: center; color: ${A}; position: relative; z-index: 2; transition: all 0.3s; }
  .dep-pipeline-connector { flex: 1; height: 2px; background: var(--border, rgba(91,181,224,0.08)); position: relative; min-width: 20px; margin-top: -26px; }
  .dep-pipeline-fill { position: absolute; top: 0; left: 0; height: 100%; background: ${A}; transform-origin: left; }
  .dep-pipeline-label { font-family: ${F.display}; font-size: 0.82rem; font-weight: 600; color: var(--text-primary, #fff); margin-top: 12px; }
  .dep-pipeline-sub { font-family: ${F.mono}; font-size: 0.64rem; color: var(--text-muted, #4A5578); margin-top: 4px; letter-spacing: 0.04em; }
  .dep-pipeline-time { font-family: ${F.mono}; font-size: 0.62rem; color: ${A}; margin-top: 6px; }

  /* ── Rollback timeline ── */
  .dep-rollback-wrap { margin-top: 56px; }
  .dep-version-row { display: flex; align-items: center; gap: 16px; padding: 16px 24px; border-radius: 12px; border: 1px solid var(--border, rgba(91,181,224,0.08)); background: var(--bg-card, #13132B); margin-bottom: 10px; cursor: pointer; transition: all 0.25s; }
  .dep-version-row:hover { border-color: ${A}25; }
  .dep-version-row.active { border-color: ${A}60; background: ${A}08; }
  .dep-version-row.live { border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.04); }
  .dep-version-tag { font-family: ${F.mono}; font-size: 0.78rem; font-weight: 600; color: ${A}; min-width: 44px; }
  .dep-version-ts { font-family: ${F.mono}; font-size: 0.7rem; color: var(--text-muted, #4A5578); min-width: 130px; }
  .dep-version-msg { font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); flex: 1; line-height: 1.4; }
  .dep-version-status { font-family: ${F.mono}; font-size: 0.68rem; padding: 3px 10px; border-radius: 4px; white-space: nowrap; }
  .dep-version-status-live { background: rgba(34,197,94,0.15); color: #22C55E; }
  .dep-version-status-ok { background: rgba(91,181,224,0.1); color: ${A}; }
  .dep-version-status-rolling { background: rgba(234,179,8,0.12); color: #EAB308; }
  .dep-rollback-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 6px; font-family: ${F.mono}; font-size: 0.68rem; background: ${A}; color: #000; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .dep-rollback-btn:hover { opacity: 0.85; }
  .dep-rollback-notice { padding: 16px 20px; border-radius: 10px; background: ${A}10; border: 1px solid ${A}30; font-family: ${F.mono}; font-size: 0.78rem; color: ${A}; margin-top: 16px; display: flex; align-items: center; gap: 10px; }
  .dep-rollback-notice-dot { width: 8px; height: 8px; border-radius: 50%; background: ${A}; animation: dep-pulse 1.5s infinite; flex-shrink: 0; }

  /* ── Deploy log ── */
  .dep-log { background: var(--bg-card, #13132B); border: 1px solid ${A}20; border-radius: 16px; overflow: hidden; margin-top: 56px; backdrop-filter: blur(12px); }
  .dep-log-header { padding: 14px 20px; background: ${A}08; border-bottom: 1px solid ${A}15; display: flex; align-items: center; gap: 10px; }
  .dep-log-title { font-family: ${F.mono}; font-size: 0.78rem; color: ${A}; font-weight: 600; }
  .dep-log-dot { width: 8px; height: 8px; border-radius: 50%; }
  .dep-log-dot-red { background: #EF4444; }
  .dep-log-dot-yellow { background: #EAB308; }
  .dep-log-dot-green { background: #22C55E; }
  .dep-log-body { padding: 0; }
  .dep-log-entry { display: flex; align-items: flex-start; gap: 16px; padding: 14px 20px; border-bottom: 1px solid var(--border, rgba(91,181,224,0.06)); font-family: ${F.mono}; font-size: 0.78rem; transition: background 0.2s; }
  .dep-log-entry:last-child { border-bottom: none; }
  .dep-log-entry:hover { background: ${A}04; }
  .dep-log-version { color: ${A}; min-width: 44px; font-weight: 600; }
  .dep-log-time { color: var(--text-muted, #4A5578); min-width: 130px; white-space: nowrap; }
  .dep-log-commit { color: var(--text-secondary, #7C8DB0); flex: 1; }
  .dep-log-status { padding: 2px 8px; border-radius: 4px; font-size: 0.68rem; white-space: nowrap; }
  .dep-log-status-success { background: rgba(34,197,94,0.12); color: #22C55E; }
  .dep-log-status-failed { background: rgba(239,68,68,0.12); color: #EF4444; }
  .dep-log-status-rollback { background: rgba(234,179,8,0.12); color: #EAB308; }
  .dep-log-duration { color: var(--text-muted, #4A5578); min-width: 52px; text-align: right; }

  /* ── Metrics ── */
  .dep-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 56px; }
  @media(max-width: 700px) { .dep-metrics { grid-template-columns: 1fr; } }
  .dep-metric { padding: 32px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); text-align: center; position: relative; overflow: hidden; }
  .dep-metric::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); }
  .dep-metric-num { font-family: ${F.display}; font-size: 2.8rem; font-weight: 800; color: ${A}; letter-spacing: -0.04em; line-height: 1; margin-bottom: 8px; }
  .dep-metric-label { font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); margin-bottom: 4px; }
  .dep-metric-sub { font-family: ${F.mono}; font-size: 0.7rem; color: var(--text-muted, #4A5578); }

  /* ── CTA ── */
  .dep-cta-section { padding: 100px 32px; background: linear-gradient(135deg, ${A}10, var(--bg-2, #111128), ${A}06); text-align: center; }
  .dep-cta-h2 { font-family: ${F.display}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; letter-spacing: -0.025em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .dep-cta-sub { font-size: 1.05rem; color: var(--text-secondary, #7C8DB0); max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }
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

// ── Arrow icon ──
const ArrowRight = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Check icon ──
const Check = ({ color }: { color: string }) => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── X icon ──
const XIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Blue/Green Deployment animated diagram ──
function BlueGreenDiagram() {
  const [phase, setPhase] = useState(0);
  // phase 0: v1 live, v2 booting
  // phase 1: traffic swings to v2
  // phase 2: v1 shutting down
  useEffect(() => {
    const id = setInterval(() => {
      setPhase(p => (p + 1) % 3);
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const v1Live = phase === 0;
  const v2Live = phase >= 1;
  const v1Dim = phase === 2;

  const arrowX = phase === 0 ? 68 : 182; // x-position of arrowhead target
  const arrowColor = phase === 0 ? '#22C55E' : A;

  return (
    <svg viewBox="0 0 260 110" className="dep-bg-diagram" role="img" aria-label="Blue/Green deployment diagram">
      {/* V1 server */}
      <rect x="10" y="30" width="80" height="50" rx="6" ry="6"
        fill={v1Dim ? 'rgba(255,255,255,0.03)' : 'rgba(34,197,94,0.12)'}
        stroke={v1Live ? '#22C55E' : 'rgba(255,255,255,0.08)'}
        strokeWidth="1.5"
        style={{ transition: 'all 0.6s' }}
      />
      <text x="50" y="49" textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize="8" fill={v1Dim ? '#4A5578' : '#22C55E'} style={{ transition: 'fill 0.6s' }}>v1.3</text>
      <text x="50" y="64" textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize="7" fill={v1Dim ? '#4A5578' : 'rgba(34,197,94,0.7)'} style={{ transition: 'fill 0.6s' }}>{v1Dim ? 'shutting down' : 'live'}</text>
      <rect x="20" y="72" width="60" height="3" rx="1.5" fill={v1Dim ? '#4A5578' : '#22C55E'} opacity="0.4" style={{ transition: 'fill 0.6s' }} />

      {/* V2 server */}
      <rect x="170" y="30" width="80" height="50" rx="6" ry="6"
        fill={v2Live ? `${A}18` : 'rgba(255,255,255,0.03)'}
        stroke={v2Live ? A : 'rgba(255,255,255,0.08)'}
        strokeWidth="1.5"
        style={{ transition: 'all 0.6s' }}
      />
      <text x="210" y="49" textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize="8" fill={v2Live ? A : '#4A5578'} style={{ transition: 'fill 0.6s' }}>v1.4</text>
      <text x="210" y="64" textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize="7" fill={v2Live ? `${A}BB` : '#4A5578'} style={{ transition: 'fill 0.6s' }}>{phase === 0 ? 'booting...' : 'live'}</text>
      <rect x="180" y="72" width="60" height="3" rx="1.5" fill={v2Live ? A : '#4A5578'} opacity="0.4" style={{ transition: 'fill 0.6s' }} />

      {/* Traffic label */}
      <text x="130" y="18" textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize="8" fill="#7C8DB0">TRAFFIC</text>

      {/* Animated traffic arrow */}
      <motion.g
        animate={{ x: phase === 0 ? 0 : 114 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <line x1="90" y1="22" x2="128" y2="22" stroke={arrowColor} strokeWidth="1.5" style={{ transition: 'stroke 0.4s' }} />
        <polyline points="123,18 128,22 123,26" fill="none" stroke={arrowColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.4s' }} />
      </motion.g>

      {/* Phase label */}
      <text x="130" y="100" textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize="7" fill="#4A5578">
        {phase === 0 ? 'step 1: v2 boots up' : phase === 1 ? 'step 2: traffic swings to v2' : 'step 3: v1 shuts down'}
      </text>
    </svg>
  );
}

// ── Pipeline connector animated ──
function PipelineConnector({ delay }: { delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div className="dep-pipeline-connector" ref={ref}>
      <motion.div
        className="dep-pipeline-fill"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

// ── Pipeline stages ──
const PIPELINE_STAGES = [
  {
    label: 'Code Push',
    sub: 'git push origin',
    time: '0s',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
    ),
  },
  {
    label: 'Auto Tests',
    sub: 'unit + integration',
    time: '~18s',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    label: 'Build',
    sub: 'docker image',
    time: '~12s',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
  },
  {
    label: 'Staging',
    sub: 'preview deploy',
    time: '~9s',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    label: 'Production',
    sub: 'zero-downtime',
    time: '~8s',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
];

// ── Deploy log data ──
const DEPLOY_LOG = [
  { version: 'v1.3.4', time: 'Mar 20  09:14am', commit: 'fix: handle null user in auth middleware', status: 'success', duration: '47s' },
  { version: 'v1.3.3', time: 'Mar 19  04:22pm', commit: 'feat: add export to CSV on dashboard', status: 'success', duration: '51s' },
  { version: 'v1.3.2', time: 'Mar 18  11:08am', commit: 'fix: memory leak in file upload handler', status: 'success', duration: '43s' },
  { version: 'v1.3.1', time: 'Mar 17  06:44pm', commit: 'chore: bump dependency versions', status: 'rollback', duration: '38s' },
  { version: 'v1.3.0', time: 'Mar 17  06:03pm', commit: 'feat: notifications redesign', status: 'failed', duration: '22s' },
  { version: 'v1.2.9', time: 'Mar 15  02:15pm', commit: 'perf: optimize image resizing pipeline', status: 'success', duration: '49s' },
  { version: 'v1.2.8', time: 'Mar 14  10:30am', commit: 'fix: stripe webhook signature validation', status: 'success', duration: '44s' },
  { version: 'v1.2.7', time: 'Mar 13  08:50am', commit: 'feat: add team invites via email', status: 'success', duration: '52s' },
];

// ── Rollback versions ──
const ROLLBACK_VERSIONS = [
  { version: 'v1.3.4', time: 'Mar 20  09:14am', msg: 'fix: handle null user in auth middleware', status: 'live' as const },
  { version: 'v1.3.3', time: 'Mar 19  04:22pm', msg: 'feat: add export to CSV on dashboard', status: 'ok' as const },
  { version: 'v1.3.2', time: 'Mar 18  11:08am', msg: 'fix: memory leak in file upload handler', status: 'ok' as const },
  { version: 'v1.3.0', time: 'Mar 17  06:03pm', msg: 'feat: notifications redesign', status: 'rolling' as const },
];

export default function DeploymentsPage() {
  const [selectedRollback, setSelectedRollback] = useState<string | null>(null);

  return (
    <main className="dep-wrap">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="dep-hero">
        <div className="dep-orb dep-orb-1" aria-hidden="true" />
        <div className="dep-orb dep-orb-2" aria-hidden="true" />
        <div className="dep-hero-inner">
          <Reveal>
            <div className="dep-badge">
              <span className="dep-badge-dot" />
              Deployment Strategies
            </div>
            <h1 className="dep-h1">
              Ship <span className="dep-grad">Without Fear.</span>
            </h1>
            <p className="dep-sub">
              Zero-downtime deployments, automated rollbacks, and a full CI/CD pipeline — so every release is as safe as the last. We handle the mechanics. You handle the product.
            </p>
            <div className="dep-btns">
              <Link href="/cloud/get-hosted" className="dep-btn-primary">
                Start Deploying <ArrowRight />
              </Link>
              <Link href="/cloud/plans" className="dep-btn-ghost">
                See Plans
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THE DEPLOYMENT PROBLEM ── */}
      <section className="dep-section dep-section-alt">
        <div className="dep-container">
          <Reveal>
            <div className="dep-label">The Deployment Problem</div>
            <h2 className="dep-h2">Most apps go down when you update them.</h2>
            <p className="dep-desc">
              That moment when you push a new version and hold your breath — hoping nothing breaks, nobody complains, and the site comes back up. That&rsquo;s not normal. It&rsquo;s fixable.
            </p>
          </Reveal>

          <div className="dep-ba-grid">
            <Reveal delay={0.08}>
              <div className="dep-ba-card dep-ba-before">
                <div className="dep-ba-label dep-ba-label-before">
                  <span className="dep-ba-dot-red" />
                  Before SocioFi Cloud
                </div>
                {[
                  'Deployment takes the site offline for 2–5 minutes',
                  'Customers see 502 errors during updates',
                  'Push to production manually from a terminal',
                  'Rollback means reverting git and re-deploying',
                  'No staging environment — testing happens in prod',
                  'Failed deploy at 11pm means a very bad night',
                ].map((text, i) => (
                  <div key={i} className="dep-ba-row">
                    <XIcon />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="dep-ba-card dep-ba-after">
                <div className="dep-ba-label dep-ba-label-after">
                  <span className="dep-ba-dot-green" />
                  After SocioFi Cloud
                </div>
                {[
                  'Zero-downtime — traffic routes around the update',
                  'No user ever sees a 502 error during deploy',
                  'Git push triggers automatic pipeline',
                  'Rollback to any previous version in 30 seconds',
                  'Full staging environment, identical to production',
                  'Failed deploy? Auto-rollback. Back to sleep.',
                ].map((text, i) => (
                  <div key={i} className="dep-ba-row">
                    <Check color="#22C55E" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── DEPLOYMENT STRATEGIES ── */}
      <section className="dep-section">
        <div className="dep-container">
          <Reveal>
            <div className="dep-centered">
              <div className="dep-label">Zero-Downtime Deployment</div>
              <h2 className="dep-h2">Three strategies. We pick the right one for your app.</h2>
              <p className="dep-desc">
                Not every app deploys the same way. We configure the strategy that fits your architecture — and switch between them as your product grows.
              </p>
            </div>
          </Reveal>

          <div className="dep-strategies">
            {/* Blue/Green */}
            <Reveal delay={0.06}>
              <div className="dep-strat-card">
                <div className="dep-strat-tag">Blue / Green</div>
                <div className="dep-strat-name">Two environments, instant switch</div>
                <div className="dep-strat-desc">
                  New version boots up in a parallel environment. Traffic flips in one atomic step. Old version stays warm for instant rollback.
                </div>
                <BlueGreenDiagram />
              </div>
            </Reveal>

            {/* Canary */}
            <Reveal delay={0.12}>
              <div className="dep-strat-card">
                <div className="dep-strat-tag">Canary</div>
                <div className="dep-strat-name">Test with 10% before committing</div>
                <div className="dep-strat-desc">
                  Route a small slice of real traffic to the new version first. Watch for errors. If it&rsquo;s clean, shift 100%. If not, revert instantly.
                </div>
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: F.mono, marginBottom: 8 }}>Traffic split</div>
                  <div className="dep-canary-bar">
                    <div className="dep-canary-main" />
                    <div className="dep-canary-new" />
                  </div>
                  <div className="dep-canary-labels">
                    <span className="dep-canary-label-a">v1.3 (90%)</span>
                    <span className="dep-canary-label-b">v1.4 (10%)</span>
                  </div>
                  <div style={{ marginTop: 20, padding: '10px 14px', borderRadius: 8, background: `${A}08`, border: `1px solid ${A}18`, fontFamily: F.mono, fontSize: '0.7rem', color: A }}>
                    0 errors on v1.4 &rarr; promoting to 100%
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Rolling */}
            <Reveal delay={0.18}>
              <div className="dep-strat-card">
                <div className="dep-strat-tag">Rolling Update</div>
                <div className="dep-strat-name">Update one instance at a time</div>
                <div className="dep-strat-desc">
                  For containerized or multi-instance apps. Each server gets updated in sequence — the rest stay live. No single point of failure.
                </div>
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: F.mono, marginBottom: 8 }}>6 instances</div>
                  <div className="dep-rolling-row">
                    {[
                      { label: 'i-1', state: 'done' },
                      { label: 'i-2', state: 'done' },
                      { label: 'i-3', state: 'active' },
                      { label: 'i-4', state: 'pending' },
                      { label: 'i-5', state: 'pending' },
                      { label: 'i-6', state: 'pending' },
                    ].map((inst) => (
                      <div
                        key={inst.label}
                        className={`dep-rolling-inst dep-rolling-${inst.state}`}
                      >
                        {inst.label.replace('i-', '')}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontFamily: F.mono, fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 6 }}>
                    3 updated &bull; 1 in progress &bull; 2 pending
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CI/CD PIPELINE ── */}
      <section className="dep-section dep-section-alt">
        <div className="dep-container">
          <Reveal>
            <div className="dep-centered">
              <div className="dep-label">CI/CD Pipeline</div>
              <h2 className="dep-h2">From git push to live in under a minute.</h2>
              <p className="dep-desc">
                We configure a full automated pipeline for your project. Tests run automatically. Builds are reproducible. Deploys happen without touching a terminal.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="dep-pipeline">
              <div className="dep-pipeline-track">
                {PIPELINE_STAGES.map((stage, i) => (
                  <div key={stage.label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div className="dep-pipeline-stage">
                      <div className="dep-pipeline-icon">{stage.icon}</div>
                      <div className="dep-pipeline-label">{stage.label}</div>
                      <div className="dep-pipeline-sub">{stage.sub}</div>
                      <div className="dep-pipeline-time">{stage.time}</div>
                    </div>
                    {i < PIPELINE_STAGES.length - 1 && (
                      <PipelineConnector delay={0.2 + i * 0.12} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div style={{ marginTop: 40, padding: '20px 28px', borderRadius: 12, background: `${A}08`, border: `1px solid ${A}20`, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: F.mono, fontSize: '0.78rem', color: A, fontWeight: 600 }}>Total pipeline time</div>
              <div style={{ fontFamily: F.display, fontSize: '1.6rem', fontWeight: 800, color: A, letterSpacing: '-0.04em' }}>47s</div>
              <div style={{ flex: 1, minWidth: 200, fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Average from git push to live traffic. Tested across 200+ deployments on our managed infrastructure.
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ROLLBACK ── */}
      <section className="dep-section">
        <div className="dep-container">
          <Reveal>
            <div className="dep-label">Rollback in 30 Seconds</div>
            <h2 className="dep-h2">Something broke. Go back. Instantly.</h2>
            <p className="dep-desc">
              Every deployment is stored. One click (or one command) reverts your app to any previous version — live in 30 seconds or less. No git reverting. No manual rebuilds.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="dep-rollback-wrap">
              {ROLLBACK_VERSIONS.map((v) => (
                <div
                  key={v.version}
                  className={`dep-version-row${v.status === 'live' ? ' live' : ''}${selectedRollback === v.version ? ' active' : ''}`}
                  onClick={() => v.status !== 'live' && setSelectedRollback(v.version === selectedRollback ? null : v.version)}
                >
                  <div className="dep-version-tag">{v.version}</div>
                  <div className="dep-version-ts">{v.time}</div>
                  <div className="dep-version-msg">{v.msg}</div>
                  <div
                    className={`dep-version-status dep-version-status-${v.status === 'live' ? 'live' : v.status === 'rolling' ? 'rolling' : 'ok'}`}
                  >
                    {v.status === 'live' ? 'live now' : v.status === 'rolling' ? 'roll back?' : 'stable'}
                  </div>
                  {v.status !== 'live' && (
                    <button
                      className="dep-rollback-btn"
                      onClick={(e) => { e.stopPropagation(); setSelectedRollback(v.version); }}
                      aria-label={`Roll back to ${v.version}`}
                    >
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                      </svg>
                      Rollback
                    </button>
                  )}
                </div>
              ))}

              {selectedRollback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="dep-rollback-notice"
                >
                  <div className="dep-rollback-notice-dot" />
                  Rollback to {selectedRollback} initiated &rarr; Live in 30 seconds
                </motion.div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── DEPLOY HISTORY LOG ── */}
      <section className="dep-section dep-section-alt">
        <div className="dep-container">
          <Reveal>
            <div className="dep-centered">
              <div className="dep-label">Deploy History</div>
              <h2 className="dep-h2">Every deploy. Every outcome. Full audit trail.</h2>
              <p className="dep-desc">
                We log every deployment with timestamps, commit context, duration, and outcome. You always know what&rsquo;s running and why.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="dep-log">
              <div className="dep-log-header">
                <div className="dep-log-dot dep-log-dot-red" />
                <div className="dep-log-dot dep-log-dot-yellow" />
                <div className="dep-log-dot dep-log-dot-green" />
                <div className="dep-log-title">deployment-log — production</div>
              </div>
              <div className="dep-log-body">
                {DEPLOY_LOG.map((entry, i) => (
                  <div key={i} className="dep-log-entry">
                    <div className="dep-log-version">{entry.version}</div>
                    <div className="dep-log-time">{entry.time}</div>
                    <div className="dep-log-commit">{entry.commit}</div>
                    <div className={`dep-log-status dep-log-status-${entry.status}`}>
                      {entry.status === 'success' ? 'success' : entry.status === 'failed' ? 'failed' : 'rolled back'}
                    </div>
                    <div className="dep-log-duration">{entry.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="dep-section">
        <div className="dep-container">
          <Reveal>
            <div className="dep-centered">
              <div className="dep-label">By The Numbers</div>
              <h2 className="dep-h2">What our deployment numbers look like.</h2>
            </div>
          </Reveal>

          <div className="dep-metrics">
            {[
              { num: '47s', label: 'Average deploy time', sub: 'From push to live traffic' },
              { num: '30s', label: 'Rollback time', sub: 'To any previous version' },
              { num: '100%', label: 'Uptime during deploys', sub: 'Zero-downtime guaranteed' },
            ].map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <div className="dep-metric">
                  <div className="dep-metric-num">{m.num}</div>
                  <div className="dep-metric-label">{m.label}</div>
                  <div className="dep-metric-sub">{m.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="dep-cta-section">
        <Reveal>
          <div className="dep-label" style={{ justifyContent: 'center', display: 'flex' }}>Get Started</div>
          <h2 className="dep-cta-h2">Ready to ship without the anxiety?</h2>
          <p className="dep-cta-sub">
            We set up the entire pipeline, configure zero-downtime deploys for your stack, and hand you a system where pushing code is the only thing you think about.
          </p>
          <div className="dep-btns">
            <Link href="/cloud/get-hosted" className="dep-btn-primary">
              Start Deploying <ArrowRight />
            </Link>
            <Link href="/cloud/plans" className="dep-btn-ghost">
              View Plans
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
