'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#5BB5E0';
const F = {
  display: 'var(--font-display, Syne, sans-serif)',
  body: 'var(--font-body, Outfit, sans-serif)',
  mono: 'var(--font-mono, "Fira Code", monospace)',
};

const STYLES = `
  .clf-page { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); min-height: 100vh; font-family: ${F.body}; }

  /* ── Hero ── */
  .clf-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
  .clf-hero-orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(100px); width: 800px; height: 800px; background: radial-gradient(circle, ${A}12 0%, transparent 70%); top: -250px; left: 50%; transform: translateX(-50%); }
  .clf-hero-inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 2; }

  .clf-label { display: flex; align-items: center; justify-content: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px; }
  .clf-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }

  .clf-h1 { font-family: ${F.display}; font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary, #fff); margin-bottom: 24px; }
  .clf-grad { background: linear-gradient(135deg, ${A} 0%, #A3DFD2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .clf-sub { font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary, #7C8DB0); max-width: 580px; margin: 0 auto; }

  /* ── Shared sections ── */
  .clf-section { padding: 100px 32px; }
  .clf-section-alt { background: var(--bg-2, #111128); }
  .clf-container { max-width: 1200px; margin: 0 auto; }

  /* ── Split layout ── */
  .clf-split { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .clf-split-rev { direction: rtl; }
  .clf-split-rev > * { direction: ltr; }
  @media(max-width: 900px) { .clf-split { grid-template-columns: 1fr; gap: 48px; } .clf-split-rev { direction: ltr; } }

  /* ── Feature text ── */
  .clf-feat-num { display: flex; align-items: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px; }
  .clf-feat-num::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .clf-icon-wrap { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 10px; background: ${A}15; color: ${A}; margin-bottom: 16px; }
  .clf-feat-name { font-family: ${F.display}; font-size: 1.6rem; font-weight: 800; color: var(--text-primary, #fff); margin-bottom: 20px; letter-spacing: -0.02em; line-height: 1.2; }
  .clf-feat-desc { font-size: 1rem; line-height: 1.75; color: var(--text-secondary, #7C8DB0); }

  /* ── Visual box ── */
  .clf-visual { display: flex; align-items: center; justify-content: center; }
  .clf-vis-box { background: var(--bg-card, #13132B); border: 1px solid ${A}20; border-radius: 20px; padding: 36px; width: 100%; min-height: 260px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .clf-vis-box::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); }

  /* ── CTA ── */
  .clf-cta-section { padding: 100px 32px; text-align: center; background: linear-gradient(135deg, ${A}10, var(--bg, #0C0C1D) 50%, ${A}06); }
  .clf-cta-h2 { font-family: ${F.display}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; letter-spacing: -0.025em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .clf-cta-sub { font-size: 1.05rem; color: var(--text-secondary, #7C8DB0); max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }
  .clf-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .clf-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 24px ${A}25; }
  .clf-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px ${A}40; }
  .clf-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border: 1.5px solid var(--border, rgba(91,181,224,0.15)); color: var(--text-primary, #fff); border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .clf-btn-ghost:hover { border-color: ${A}; color: ${A}; }
`;

// ── Reveal ──
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

// ── Icons ──
function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Visual components ──

function TerminalVis() {
  const lines = [
    { text: '$ git push origin main', color: A },
    { text: 'Enumerating objects: 5, done.', color: '#7C8DB0' },
    { text: 'Trigger: deployment pipeline', color: '#7C8DB0' },
    { text: '✓ Build   12.4s', color: '#4DBFA8' },
    { text: '✓ Test    8.1s', color: '#4DBFA8' },
    { text: '✓ Deploy  3.2s', color: '#4DBFA8' },
    { text: '✓ Live at your-app.com', color: A },
  ];
  return (
    <div className="clf-vis-box" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ fontFamily: F.mono, fontSize: '0.62rem', color: `${A}60`, marginBottom: 12, width: '100%', borderBottom: `1px solid ${A}15`, paddingBottom: 8 }}>
        deployment log
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 + 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: F.mono, fontSize: '0.68rem', color: line.color, lineHeight: 1.4 }}
          >
            {line.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ScaleBarVis() {
  const bars = [
    { h: 30, label: '10:00' },
    { h: 38, label: '10:30' },
    { h: 44, label: '11:00' },
    { h: 110, label: '11:30', spike: true },
    { h: 110, label: '12:00', spike: true },
    { h: 82, label: '12:30', scaled: true },
    { h: 52, label: '13:00', scaled: true },
    { h: 40, label: '13:30' },
  ];
  return (
    <div className="clf-vis-box" style={{ flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, width: '100%', paddingBottom: 4 }}>
        {bars.map((b, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4 }}>
            <div style={{
              width: '100%',
              height: b.h,
              borderRadius: '4px 4px 0 0',
              background: b.spike ? `${A}` : b.scaled ? `${A}60` : `${A}35`,
              transition: 'height 0.5s',
              position: 'relative',
            }}>
              {b.spike && i === 3 && (
                <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontFamily: F.mono, fontSize: '0.55rem', color: A, whiteSpace: 'nowrap' }}>spike</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 2v10M3 6l4-4 4 4" stroke="#4DBFA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: F.mono, fontSize: '0.62rem', color: '#4DBFA8' }}>Auto-scaled at 11:28am — no action required</span>
      </div>
    </div>
  );
}

function BlueGreenVis() {
  return (
    <div className="clf-vis-box" style={{ gap: 24, flexWrap: 'wrap' }}>
      {/* v1 server */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 80, height: 80, borderRadius: 14, background: `${A}15`, border: `1.5px solid ${A}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="2" width="20" height="8" rx="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
          <span style={{ fontFamily: F.mono, fontSize: '0.6rem', color: `${A}80` }}>v1</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: F.mono, fontSize: '0.58rem', color: 'var(--text-muted, #4A5578)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted, #4A5578)' }} />
          draining
        </div>
      </div>

      {/* Switch */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M6 16h20M20 10l6 6-6 6" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: `${A}60`, textAlign: 'center' }}>traffic<br />switching</span>
      </div>

      {/* v2 server */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 80, height: 80, borderRadius: 14, background: `${A}25`, border: `1.5px solid ${A}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="2" width="20" height="8" rx="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
          <span style={{ fontFamily: F.mono, fontSize: '0.6rem', color: A }}>v2</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: F.mono, fontSize: '0.58rem', color: '#4DBFA8' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4DBFA8' }} />
          live
        </div>
      </div>
    </div>
  );
}

function DatabaseVis() {
  return (
    <div className="clf-vis-box" style={{ gap: 28 }}>
      {/* DB cylinder */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div style={{ width: 64, height: 16, borderRadius: '50%', background: `${A}30`, border: `1px solid ${A}50` }} />
        <div style={{ width: 64, height: 100, background: `${A}15`, borderLeft: `1px solid ${A}30`, borderRight: `1px solid ${A}30`, position: 'relative' }}>
          {[30, 55, 80].map(pct => (
            <div key={pct} style={{ position: 'absolute', width: '100%', height: 1, background: `${A}18`, top: `${pct}%` }} />
          ))}
        </div>
        <div style={{ width: 64, height: 16, borderRadius: '50%', background: `${A}30`, border: `1px solid ${A}50` }} />
        <span style={{ fontFamily: F.mono, fontSize: '0.6rem', color: A, marginTop: 8 }}>Primary DB</span>
      </div>

      {/* Lines to services */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {['PostgreSQL', 'MySQL', 'Redis'].map((db, i) => (
          <div key={db} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 1, background: `${A}35` }} />
            <div style={{ padding: '6px 12px', background: `${A}12`, border: `1px solid ${A}20`, borderRadius: 8, fontFamily: F.mono, fontSize: '0.62rem', color: A }}>
              {db}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SSLVis() {
  return (
    <div className="clf-vis-box" style={{ flexDirection: 'column', gap: 16 }}>
      {/* Address bar */}
      <div style={{ background: 'var(--bg, #0C0C1D)', border: `1px solid ${A}20`, borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span style={{ fontFamily: F.mono, fontSize: '0.68rem', color: A }}>https://</span>
        <span style={{ fontFamily: F.mono, fontSize: '0.68rem', color: 'var(--text-primary, #fff)' }}>your-domain.com</span>
      </div>

      {/* Domain arrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontFamily: F.mono, fontSize: '0.65rem', color: `${A}60` }}>your-domain.com</div>
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
          <path d="M2 8h12M10 4l6 4-6 4" stroke={A} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
        </svg>
        <div style={{ padding: '4px 10px', background: `${A}15`, border: `1px solid ${A}25`, borderRadius: 6, fontFamily: F.mono, fontSize: '0.62rem', color: A }}>verified</div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Let\'s Encrypt', 'Auto-renew', 'HTTPS enforced'].map(t => (
          <span key={t} style={{ fontFamily: F.mono, fontSize: '0.58rem', padding: '3px 8px', borderRadius: 4, background: `${A}10`, color: A, border: `1px solid ${A}18` }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function MonitoringMetricsVis() {
  return (
    <div className="clf-vis-box" style={{ flexDirection: 'column', gap: 12 }}>
      {[
        { label: 'Uptime', value: '99.97%', ok: true },
        { label: 'Response time', value: '42ms', ok: true },
        { label: 'Error rate', value: '0.00%', ok: true },
        { label: 'CPU usage', value: '18%', ok: true },
        { label: 'Memory', value: '3.2 / 16 GB', ok: true },
      ].map((metric, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', background: 'var(--bg, #0C0C1D)', borderRadius: 8, border: `1px solid ${A}12` }}>
          <span style={{ fontFamily: F.mono, fontSize: '0.66rem', color: 'var(--text-secondary, #7C8DB0)' }}>{metric.label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4DBFA8' }} />
            <span style={{ fontFamily: F.mono, fontSize: '0.7rem', color: A, fontWeight: 600 }}>{metric.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function BackupCalendarVis() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div className="clf-vis-box" style={{ flexDirection: 'column', gap: 12 }}>
      <div style={{ fontFamily: F.mono, fontSize: '0.6rem', color: `${A}60`, textAlign: 'center' }}>30-day backup retention</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, width: '100%' }}>
        {days.map(d => (
          <div key={d} style={{
            width: '100%',
            aspectRatio: '1',
            borderRadius: 4,
            background: d <= 30 ? `${A}20` : 'transparent',
            border: `1px solid ${A}${d <= 7 ? '60' : d <= 14 ? '40' : d <= 21 ? '25' : '15'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {d <= 30 && d % 7 === 1 && (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                <path d="M1.5 4l1.5 1.5 3.5-3.5" stroke={A} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: F.mono, fontSize: '0.58rem', color: `${A}55`, textAlign: 'center' }}>point-in-time restore available</div>
    </div>
  );
}

function CDNMapVis() {
  const nodes = [
    { top: '8%', left: '48%', label: 'Tokyo' },
    { top: '35%', left: '6%', label: 'N. Virginia' },
    { top: '35%', left: '88%', label: 'London' },
    { top: '75%', left: '28%', label: 'São Paulo' },
    { top: '65%', left: '72%', label: 'Singapore' },
  ];
  return (
    <div className="clf-vis-box">
      <div style={{ position: 'relative', width: 220, height: 180 }}>
        {/* Rings */}
        {[160, 110, 60].map(sz => (
          <div key={sz} style={{ position: 'absolute', width: sz, height: sz, borderRadius: '50%', border: `1px solid ${A}18`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        ))}
        {/* Center hub */}
        <div style={{ position: 'absolute', width: 38, height: 38, borderRadius: '50%', background: `${A}25`, border: `1.5px solid ${A}60`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        {/* Edge nodes */}
        {nodes.map((n, i) => (
          <div key={i} style={{ position: 'absolute', top: n.top, left: n.left, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: A, boxShadow: `0 0 8px ${A}80` }} />
            <span style={{ fontFamily: F.mono, fontSize: '0.5rem', color: A, marginTop: 3, whiteSpace: 'nowrap' }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnvVarsVis() {
  return (
    <div className="clf-vis-box" style={{ flexDirection: 'column', gap: 12 }}>
      {[
        { key: 'DATABASE_URL', val: '••••••••••••••', masked: true },
        { key: 'STRIPE_SECRET_KEY', val: '••••••••••', masked: true },
        { key: 'REDIS_URL', val: '••••••••', masked: true },
        { key: 'NODE_ENV', val: 'production', masked: false },
        { key: 'APP_VERSION', val: '2.4.1', masked: false },
      ].map((row, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: A }} aria-hidden="true">
            <circle cx="5.5" cy="7" r="3" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8.5 7h6M12 5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.mono, fontSize: '0.56rem', color: `${A}60`, marginBottom: 2 }}>{row.key}</div>
            <div style={{ fontFamily: F.mono, fontSize: '0.7rem', padding: '5px 10px', borderRadius: 6, background: 'var(--bg, #0C0C1D)', border: `1px solid ${A}18`, color: row.masked ? 'var(--text-muted, #4A5578)' : A, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {row.val}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StagingVis() {
  return (
    <div className="clf-vis-box" style={{ gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
      {[
        { label: 'staging', color: '#E8B84D', status: 'preview', url: 'staging.your-app.com' },
        { label: 'production', color: '#4DBFA8', status: 'live', url: 'your-app.com' },
      ].map((env, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 130 }}>
          <div style={{ padding: '12px 16px', background: 'var(--bg, #0C0C1D)', border: `1.5px solid ${env.color}40`, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: F.mono, fontSize: '0.62rem', fontWeight: 600, color: env.color }}>{env.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: env.color }} />
                <span style={{ fontFamily: F.mono, fontSize: '0.55rem', color: env.color }}>{env.status}</span>
              </div>
            </div>
            <div style={{ fontFamily: F.mono, fontSize: '0.58rem', color: `${env.color}70` }}>{env.url}</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['build', 'test', 'deploy'].map(s => (
                <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: `${env.color}40` }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: 2, background: env.color }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Feature data ──
const FEATURES = [
  {
    id: 1,
    name: 'Automatic Deployments',
    desc: 'Push to GitHub and your app is live in 60 seconds. We configure the entire pipeline — build, test, and deploy — so every code change reaches production without you touching a terminal.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
      </svg>
    ),
    Visual: TerminalVis,
  },
  {
    id: 2,
    name: 'Auto-Scaling',
    desc: 'Traffic spikes are handled automatically. When your load doubles, the infrastructure expands to match — before your visitors notice a slowdown. When traffic drops, it scales back down.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    ),
    Visual: ScaleBarVis,
  },
  {
    id: 3,
    name: 'Zero-Downtime Deploys',
    desc: "Your app never goes offline during updates. We use blue-green deployment — the new version runs in parallel with the old one, traffic switches over, then the old version is retired. Your visitors never see a maintenance page.",
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    Visual: BlueGreenVis,
  },
  {
    id: 4,
    name: 'Managed Databases',
    desc: 'PostgreSQL, MySQL, or Redis — we provision, configure, optimize, and monitor your database. Connection pooling, query performance, backups, and read replicas are all handled. You write queries. We keep the database healthy.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    Visual: DatabaseVis,
  },
  {
    id: 5,
    name: 'SSL & Custom Domains',
    desc: 'Free SSL certificates issued and renewed automatically. Point any domain at your app — we configure DNS, provision the certificate, enforce HTTPS, and make sure the padlock is always green. You never think about it again.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    Visual: SSLVis,
  },
  {
    id: 6,
    name: '24/7 Monitoring',
    desc: 'We know something is wrong before your users do. Uptime checks every 30 seconds from 5 global locations, CPU and memory alerts, database performance tracking, and instant notifications when anything looks off.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    Visual: MonitoringMetricsVis,
  },
  {
    id: 7,
    name: 'Automated Backups',
    desc: 'Daily snapshots of your database and application data, stored for 30 days. If anything goes wrong, we restore from any point in time. Enterprise plans include hourly backups stored across multiple regions.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    Visual: BackupCalendarVis,
  },
  {
    id: 8,
    name: 'Global CDN',
    desc: "Static assets are served from the nearest edge location to your visitor — images, scripts, stylesheets load instantly whether they're in Tokyo, London, or São Paulo. We configure cache rules, handle invalidation, and optimize delivery.",
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    Visual: CDNMapVis,
  },
  {
    id: 9,
    name: 'Environment Variables',
    desc: "API keys, database credentials, and secrets never live in your code. We manage environment variables across staging and production, encrypted at rest, audited for access. Your app knows its own secrets securely.",
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </svg>
    ),
    Visual: EnvVarsVis,
  },
  {
    id: 10,
    name: 'Staging Environments',
    desc: 'Test before you ship. Every Professional and Enterprise plan includes a full staging environment that mirrors production. Deploy to staging first, verify it works, then promote to production with a single step.',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    Visual: StagingVis,
  },
];

export default function CloudFeaturesPage() {
  return (
    <main className="clf-page">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="clf-hero">
        <div className="clf-hero-orb" />
        <motion.div
          className="clf-hero-inner"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
            className="clf-label"
          >
            Platform Features
          </motion.div>
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
            className="clf-h1"
          >
            Everything You Need<br />
            <span className="clf-grad">to Stay Live</span>
          </motion.h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
            className="clf-sub"
          >
            Ten infrastructure layers, all managed. Here&rsquo;s exactly what we handle so you can focus on building your product — not keeping it alive.
          </motion.p>
        </motion.div>
      </section>

      {/* ── FEATURE SECTIONS ── */}
      {FEATURES.map((feat) => {
        const isOdd = feat.id % 2 !== 0;
        const isAlt = !isOdd;
        const { Visual } = feat;
        return (
          <section key={feat.id} className={`clf-section${isAlt ? ' clf-section-alt' : ''}`}>
            <div className="clf-container">
              <div className={`clf-split${!isOdd ? ' clf-split-rev' : ''}`}>
                {/* Text */}
                <Reveal>
                  <div className="clf-feat-num">{String(feat.id).padStart(2, '0')}</div>
                  <div className="clf-icon-wrap">{feat.icon}</div>
                  <h2 className="clf-feat-name">{feat.name}</h2>
                  <p className="clf-feat-desc">{feat.desc}</p>
                </Reveal>

                {/* Visual */}
                <Reveal delay={0.1}>
                  <div className="clf-visual">
                    <Visual />
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── CTA ── */}
      <section className="clf-cta-section">
        <Reveal>
          <div className="clf-label">Get Started</div>
          <h2 className="clf-cta-h2">Ready to deploy?</h2>
          <p className="clf-cta-sub">
            Tell us what you&rsquo;re running and we&rsquo;ll set up the right infrastructure for your product — usually within 24 hours.
          </p>
          <div className="clf-btns">
            <Link href="/cloud/get-hosted" className="clf-btn-primary">
              Get Hosted <ArrowRight />
            </Link>
            <Link href="/cloud/plans" className="clf-btn-ghost">
              View Plans <ArrowRight />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
