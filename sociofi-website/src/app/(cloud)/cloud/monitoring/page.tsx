'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import Link from 'next/link';

const A = '#5BB5E0';
const F = {
  display: 'var(--font-display, Syne)',
  body: 'var(--font-body, Outfit)',
  mono: 'var(--font-mono, "Fira Code")',
};

const STYLES = `
  .mon-wrap { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); font-family: ${F.body}; }

  /* ── Hero ── */
  .mon-hero { position: relative; padding: 160px 32px 120px; overflow: hidden; text-align: center; }
  .mon-hero-inner { position: relative; z-index: 2; max-width: 720px; margin: 0 auto; }
  .mon-orb { position: absolute; border-radius: 50%; filter: blur(110px); pointer-events: none; }
  .mon-orb-1 { width: 700px; height: 700px; background: ${A}; opacity: 0.045; top: -120px; left: 50%; transform: translateX(-50%); }
  .mon-orb-2 { width: 300px; height: 300px; background: #3A589E; opacity: 0.07; bottom: -50px; left: 15%; }

  .mon-badge { display: inline-flex; align-items: center; gap: 8px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 28px; }
  .mon-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #22C55E; flex-shrink: 0; animation: mon-pulse 2s ease-in-out infinite; }
  @keyframes mon-pulse { 0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.5); } 50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(34,197,94,0); } }

  .mon-h1 { font-family: ${F.display}; font-size: clamp(2.6rem, 5vw, 4rem); font-weight: 800; line-height: 1.06; letter-spacing: -0.035em; color: var(--text-primary, #fff); margin-bottom: 24px; }
  .mon-grad { background: linear-gradient(135deg, ${A}, #A3DFD2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .mon-sub { font-size: 1.1rem; line-height: 1.75; color: var(--text-secondary, #7C8DB0); max-width: 580px; margin: 0 auto 40px; }

  .mon-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .mon-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 24px rgba(91,181,224,0.25); }
  .mon-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(91,181,224,0.4); }
  .mon-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border: 1.5px solid var(--border, rgba(91,181,224,0.15)); color: var(--text-primary, #fff); border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .mon-btn-ghost:hover { border-color: ${A}; color: ${A}; }

  /* ── Shared sections ── */
  .mon-section { padding: 100px 32px; }
  .mon-section-alt { background: var(--bg-2, #111128); }
  .mon-container { max-width: 1200px; margin: 0 auto; }
  .mon-label { display: flex; align-items: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
  .mon-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .mon-h2 { font-family: ${F.display}; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .mon-desc { font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary, #7C8DB0); max-width: 580px; }
  .mon-centered { text-align: center; }
  .mon-centered .mon-label { justify-content: center; }
  .mon-centered .mon-desc { margin: 0 auto; }

  /* ── Metric counter cards ── */
  .mon-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 56px; }
  @media(max-width: 900px) { .mon-metrics { grid-template-columns: repeat(2, 1fr); } }
  @media(max-width: 480px) { .mon-metrics { grid-template-columns: 1fr; } }
  .mon-metric { padding: 32px 28px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); text-align: center; position: relative; overflow: hidden; transition: all 0.3s; }
  .mon-metric::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); }
  .mon-metric:hover { transform: translateY(-4px); border-color: ${A}25; box-shadow: 0 12px 40px rgba(0,0,0,0.2); }
  .mon-metric-num { font-family: ${F.display}; font-size: 2.4rem; font-weight: 800; color: ${A}; letter-spacing: -0.04em; line-height: 1; margin-bottom: 8px; }
  .mon-metric-label { font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; color: var(--text-primary, #fff); margin-bottom: 6px; }
  .mon-metric-sub { font-family: ${F.mono}; font-size: 0.68rem; color: var(--text-muted, #4A5578); line-height: 1.4; }

  /* ── Monitoring categories ── */
  .mon-cats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
  @media(max-width: 900px) { .mon-cats { grid-template-columns: repeat(2, 1fr); } }
  @media(max-width: 540px) { .mon-cats { grid-template-columns: 1fr; } }
  .mon-cat { padding: 28px 32px; border-radius: 16px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); position: relative; overflow: hidden; transition: all 0.35s; }
  .mon-cat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--navy, #3A589E), ${A}); opacity: 0; transition: opacity 0.35s; }
  .mon-cat:hover { transform: translateY(-4px); border-color: ${A}25; box-shadow: 0 12px 40px rgba(0,0,0,0.2); }
  .mon-cat:hover::before { opacity: 1; }
  .mon-cat-icon { width: 44px; height: 44px; border-radius: 10px; background: ${A}15; display: flex; align-items: center; justify-content: center; color: ${A}; margin-bottom: 16px; transition: all 0.3s; }
  .mon-cat:hover .mon-cat-icon { background: ${A}22; box-shadow: 0 0 16px ${A}30; }
  .mon-cat-name { font-family: ${F.display}; font-size: 0.95rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 8px; }
  .mon-cat-desc { font-size: 0.84rem; color: var(--text-secondary, #7C8DB0); line-height: 1.6; margin-bottom: 14px; }
  .mon-cat-pills { display: flex; flex-wrap: wrap; gap: 6px; }
  .mon-cat-pill { font-family: ${F.mono}; font-size: 0.62rem; padding: 3px 8px; border-radius: 4px; background: ${A}10; color: ${A}; border: 1px solid ${A}18; }

  /* ── Alert flow ── */
  .mon-alert-flow { display: flex; align-items: stretch; gap: 0; margin-top: 56px; overflow-x: auto; padding: 4px 0 12px; }
  .mon-alert-step { flex: 1; min-width: 160px; display: flex; flex-direction: column; position: relative; }
  .mon-alert-card { padding: 24px 20px; border-radius: 14px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); flex: 1; transition: all 0.3s; }
  .mon-alert-card:hover { border-color: ${A}25; transform: translateY(-3px); }
  .mon-alert-step-num { font-family: ${F.mono}; font-size: 0.64rem; color: ${A}; letter-spacing: 0.08em; margin-bottom: 10px; }
  .mon-alert-step-name { font-family: ${F.display}; font-size: 0.9rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 8px; }
  .mon-alert-step-desc { font-size: 0.82rem; color: var(--text-secondary, #7C8DB0); line-height: 1.5; }
  .mon-alert-arrow { display: flex; align-items: center; padding: 0 8px; color: ${A}; opacity: 0.5; flex-shrink: 0; }

  /* Alert channels */
  .mon-channels { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 32px; }
  .mon-channel { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 8px; background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); font-family: ${F.mono}; font-size: 0.72rem; color: var(--text-secondary, #7C8DB0); transition: all 0.2s; }
  .mon-channel:hover { border-color: ${A}30; color: ${A}; }
  .mon-channel-icon { color: ${A}; }

  /* ── Status page mockup ── */
  .mon-status-page { background: var(--bg-card, #13132B); border: 1px solid ${A}20; border-radius: 16px; overflow: hidden; margin-top: 56px; max-width: 720px; margin-left: auto; margin-right: auto; }
  .mon-status-header { padding: 20px 28px; background: rgba(34,197,94,0.08); border-bottom: 1px solid rgba(34,197,94,0.15); display: flex; align-items: center; gap: 12px; }
  .mon-status-header-dot { width: 10px; height: 10px; border-radius: 50%; background: #22C55E; box-shadow: 0 0 10px rgba(34,197,94,0.5); }
  .mon-status-header-text { font-family: ${F.display}; font-size: 0.95rem; font-weight: 700; color: #22C55E; }
  .mon-status-body { padding: 8px 0; }
  .mon-status-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 28px; border-bottom: 1px solid var(--border, rgba(91,181,224,0.06)); }
  .mon-status-row:last-of-type { border-bottom: none; }
  .mon-status-service { display: flex; align-items: center; gap: 10px; font-size: 0.87rem; color: var(--text-primary, #fff); }
  .mon-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .mon-status-dot-green { background: #22C55E; }
  .mon-status-dot-yellow { background: #EAB308; }
  .mon-status-label { font-family: ${F.mono}; font-size: 0.7rem; }
  .mon-status-label-ok { color: #22C55E; }
  .mon-status-label-warn { color: #EAB308; }

  /* Uptime bar */
  .mon-uptime-section { padding: 16px 28px 20px; border-top: 1px solid var(--border, rgba(91,181,224,0.06)); }
  .mon-uptime-header { display: flex; justify-content: space-between; font-family: ${F.mono}; font-size: 0.68rem; color: var(--text-muted, #4A5578); margin-bottom: 8px; }
  .mon-uptime-bar { display: flex; gap: 2px; }
  .mon-uptime-block { flex: 1; height: 28px; border-radius: 2px; }
  .mon-uptime-green { background: rgba(34,197,94,0.55); }
  .mon-uptime-yellow { background: rgba(234,179,8,0.5); }
  .mon-incident-note { font-family: ${F.mono}; font-size: 0.7rem; color: var(--text-muted, #4A5578); margin-top: 12px; }

  /* ── Incident timeline ── */
  .mon-timeline { margin-top: 56px; position: relative; padding-left: 24px; }
  .mon-timeline::before { content: ''; position: absolute; left: 6px; top: 0; bottom: 0; width: 1.5px; background: linear-gradient(to bottom, ${A}40, ${A}10); }
  .mon-timeline-item { position: relative; padding-bottom: 28px; padding-left: 24px; }
  .mon-timeline-item:last-child { padding-bottom: 0; }
  .mon-timeline-dot { position: absolute; left: -18px; top: 4px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid ${A}; background: var(--bg, #0C0C1D); }
  .mon-timeline-dot-resolved { background: #22C55E; border-color: #22C55E; }
  .mon-timeline-time { font-family: ${F.mono}; font-size: 0.72rem; color: ${A}; margin-bottom: 4px; font-weight: 600; }
  .mon-timeline-text { font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); line-height: 1.5; }
  .mon-timeline-tag { display: inline-block; font-family: ${F.mono}; font-size: 0.62rem; padding: 2px 8px; border-radius: 4px; margin-left: 8px; vertical-align: middle; }
  .mon-timeline-tag-alert { background: rgba(239,68,68,0.12); color: #EF4444; }
  .mon-timeline-tag-auto { background: ${A}12; color: ${A}; }
  .mon-timeline-tag-resolved { background: rgba(34,197,94,0.12); color: #22C55E; }

  /* ── CTA ── */
  .mon-cta-section { padding: 100px 32px; background: linear-gradient(135deg, ${A}10, var(--bg-2, #111128), ${A}06); text-align: center; }
  .mon-cta-h2 { font-family: ${F.display}; font-size: clamp(2rem, 3.5vw, 2.8rem); font-weight: 700; letter-spacing: -0.025em; color: var(--text-primary, #fff); margin-bottom: 16px; }
  .mon-cta-sub { font-size: 1.05rem; color: var(--text-secondary, #7C8DB0); max-width: 480px; margin: 0 auto 36px; line-height: 1.7; }
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

const ArrowRight = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Animated counter ──
function AnimatedCounter({ to, suffix = '', decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;
    const el = ref.current;
    if (!el) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value: number) {
        el.textContent = value.toFixed(decimals) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, decimals]);

  return <span ref={ref}>0{suffix}</span>;
}

// ── Monitoring categories ──
const CATS = [
  {
    name: 'HTTP/HTTPS Endpoints',
    desc: 'Every URL checked from multiple regions. Response codes, redirect chains, and SSL certificate expiry tracked.',
    pills: ['Status codes', 'SSL expiry', 'Response body', 'Redirect chains'],
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    name: 'Server Resources',
    desc: 'CPU, RAM, and disk usage tracked in real-time. Alerts before you run out — not after things crash.',
    pills: ['CPU %', 'RAM usage', 'Disk space', 'Load average'],
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    name: 'Database Health',
    desc: 'Query performance, connection pool usage, slow queries, index health. You see it before your users feel it.',
    pills: ['Query time', 'Connections', 'Slow queries', 'Replication lag'],
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    name: 'Application Errors',
    desc: 'Error rates, stack traces, and exception frequency monitored per endpoint. Spike detection within seconds.',
    pills: ['Error rate', '5xx spike', 'Stack traces', 'Exception freq'],
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    name: 'Queue Health',
    desc: 'Background job queues — backlog depth, processing rate, failed jobs, and stuck workers. Nothing silently stalls.',
    pills: ['Queue depth', 'Processing rate', 'Failed jobs', 'Worker status'],
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    name: 'External Dependencies',
    desc: 'Payment gateways, email providers, third-party APIs your app relies on. We track their uptime too.',
    pills: ['Stripe', 'SendGrid', 'Auth APIs', 'Webhooks'],
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
    ),
  },
];

// ── Alert steps ──
const ALERT_STEPS = [
  {
    num: '01',
    name: 'Detection',
    desc: 'Automated check fires. Anomaly or failure is confirmed across 2 checkpoints before triggering.',
  },
  {
    num: '02',
    name: 'Classification',
    desc: 'Severity assessed automatically: is it a blip, a degradation, or an outage? Different paths for each.',
  },
  {
    num: '03',
    name: 'Notification',
    desc: 'On-call engineer alerted in under 2 minutes via Slack, email, SMS, or PagerDuty — your choice.',
  },
  {
    num: '04',
    name: 'Auto-Remediation',
    desc: 'For known failure patterns: auto-restart, traffic reroute, cache flush — before humans even wake up.',
  },
];

// ── Status page services ──
const STATUS_SERVICES = [
  { name: 'Web App', status: 'ok' as const },
  { name: 'API', status: 'ok' as const },
  { name: 'Database', status: 'ok' as const },
  { name: 'CDN', status: 'ok' as const },
  { name: 'Email Delivery', status: 'ok' as const },
];

// ── Incident timeline ──
const INCIDENT = [
  { time: '2:14am', text: 'Spike in 5xx errors detected — error rate crossed 3% threshold', tag: 'alert' as const },
  { time: '2:15am', text: 'Alert sent to on-call engineer + posted to #incidents in Slack', tag: 'alert' as const },
  { time: '2:16am', text: 'Auto-restart triggered on app server — known crash recovery pattern', tag: 'auto' as const },
  { time: '2:17am', text: 'App server recovered — error rate dropped to 0.0%', tag: 'resolved' as const },
  { time: '2:22am', text: 'Root cause identified: memory leak in v2.3.1 file upload handler', tag: 'auto' as const },
  { time: '2:45am', text: 'Patch deployed to production (v2.3.2) — memory leak resolved', tag: 'resolved' as const },
];

// ── Build uptime bar blocks ──
function buildUptimeBlocks() {
  const blocks: ('green' | 'yellow')[] = [];
  for (let i = 0; i < 90; i++) {
    if (i === 22 || i === 45 || i === 67) {
      blocks.push('yellow');
    } else {
      blocks.push('green');
    }
  }
  return blocks;
}
const UPTIME_BLOCKS = buildUptimeBlocks();

export default function MonitoringPage() {
  return (
    <main className="mon-wrap">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="mon-hero">
        <div className="mon-orb mon-orb-1" aria-hidden="true" />
        <div className="mon-orb mon-orb-2" aria-hidden="true" />
        <div className="mon-hero-inner">
          <Reveal>
            <div className="mon-badge">
              <span className="mon-badge-dot" />
              24/7 Monitoring
            </div>
            <h1 className="mon-h1">
              <span className="mon-grad">We Watch</span> So You<br />
              Don&rsquo;t Have To.
            </h1>
            <p className="mon-sub">
              Every endpoint. Every server. Every database. Checked every minute — and when something&rsquo;s wrong, we know about it before your customers do.
            </p>
            <div className="mon-btns">
              <Link href="/cloud/get-hosted" className="mon-btn-primary">
                Start Monitoring <ArrowRight />
              </Link>
              <Link href="/cloud/plans" className="mon-btn-ghost">
                See Plans
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="mon-section mon-section-alt">
        <div className="mon-container">
          <Reveal>
            <div className="mon-centered">
              <div className="mon-label">By The Numbers</div>
              <h2 className="mon-h2">What &ldquo;24/7 monitoring&rdquo; actually means.</h2>
            </div>
          </Reveal>

          <div className="mon-metrics">
            <Reveal delay={0.06}>
              <div className="mon-metric">
                <div className="mon-metric-num">
                  <AnimatedCounter to={99.9} suffix="%" decimals={1} />
                </div>
                <div className="mon-metric-label">Guaranteed Uptime</div>
                <div className="mon-metric-sub">Contractual SLA on managed plans</div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mon-metric">
                <div className="mon-metric-num">
                  <AnimatedCounter to={42} suffix="ms" />
                </div>
                <div className="mon-metric-label">Avg Response Time</div>
                <div className="mon-metric-sub">Median across all managed apps</div>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mon-metric">
                <div className="mon-metric-num">
                  <AnimatedCounter to={1440} />
                </div>
                <div className="mon-metric-label">Checks Per Day</div>
                <div className="mon-metric-sub">Every 60 seconds, around the clock</div>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mon-metric">
                <div className="mon-metric-num">
                  &lt;<AnimatedCounter to={2} suffix="min" />
                </div>
                <div className="mon-metric-label">Alert Response Time</div>
                <div className="mon-metric-sub">Detection to engineer notification</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── WHAT WE MONITOR ── */}
      <section className="mon-section">
        <div className="mon-container">
          <Reveal>
            <div className="mon-label">What We Monitor</div>
            <h2 className="mon-h2">Six layers. Every layer matters.</h2>
            <p className="mon-desc">
              Most monitoring tools watch one thing. We watch the whole stack — because the thing that causes your app to fail is rarely the obvious one.
            </p>
          </Reveal>

          <div className="mon-cats">
            {CATS.map((cat, i) => (
              <Reveal key={cat.name} delay={i * 0.06}>
                <div className="mon-cat">
                  <div className="mon-cat-icon">{cat.icon}</div>
                  <div className="mon-cat-name">{cat.name}</div>
                  <div className="mon-cat-desc">{cat.desc}</div>
                  <div className="mon-cat-pills">
                    {cat.pills.map(p => (
                      <span key={p} className="mon-cat-pill">{p}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALERT SYSTEM ── */}
      <section className="mon-section mon-section-alt">
        <div className="mon-container">
          <Reveal>
            <div className="mon-centered">
              <div className="mon-label">Alert System</div>
              <h2 className="mon-h2">You hear about it before your users do.</h2>
              <p className="mon-desc">
                Our alert pipeline goes from detection to engineer notification in under 2 minutes. And for common failure patterns, the system starts fixing things before anyone wakes up.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mon-alert-flow">
              {ALERT_STEPS.map((step, i) => (
                <div key={step.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div className="mon-alert-step" style={{ flex: 1 }}>
                    <div className="mon-alert-card">
                      <div className="mon-alert-step-num">step {step.num}</div>
                      <div className="mon-alert-step-name">{step.name}</div>
                      <div className="mon-alert-step-desc">{step.desc}</div>
                    </div>
                  </div>
                  {i < ALERT_STEPS.length - 1 && (
                    <div className="mon-alert-arrow">
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ marginTop: 40 }}>
              <div style={{ fontFamily: F.mono, fontSize: '0.72rem', color: A, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                Alert channels
              </div>
              <div className="mon-channels">
                {[
                  {
                    label: 'Slack',
                    icon: (
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
                        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
                        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
                        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
                        <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                        <path d="M10 9.5C10 8.67 9.33 8 8.5 8H3.5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" />
                        <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Email',
                    icon: (
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                  },
                  {
                    label: 'SMS',
                    icon: (
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'PagerDuty',
                    icon: (
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                        <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                      </svg>
                    ),
                  },
                ].map((ch) => (
                  <div key={ch.label} className="mon-channel">
                    <span className="mon-channel-icon">{ch.icon}</span>
                    {ch.label}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STATUS PAGE ── */}
      <section className="mon-section">
        <div className="mon-container">
          <Reveal>
            <div className="mon-centered">
              <div className="mon-label">Public Status Page</div>
              <h2 className="mon-h2">Your customers can see you&rsquo;re up too.</h2>
              <p className="mon-desc">
                Every managed app gets a public status page. Your customers know the system is healthy. When something happens, they see it in real time — with context, not silence.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mon-status-page">
              <div className="mon-status-header">
                <div className="mon-status-header-dot" />
                <div className="mon-status-header-text">All Systems Operational</div>
              </div>
              <div className="mon-status-body">
                {STATUS_SERVICES.map((svc) => (
                  <div key={svc.name} className="mon-status-row">
                    <div className="mon-status-service">
                      <div className={`mon-status-dot mon-status-dot-${svc.status === 'ok' ? 'green' : 'yellow'}`} />
                      {svc.name}
                    </div>
                    <div className={`mon-status-label mon-status-label-${svc.status === 'ok' ? 'ok' : 'warn'}`}
                      style={{ fontFamily: F.mono, fontSize: '0.72rem' }}>
                      Operational
                    </div>
                  </div>
                ))}
              </div>
              <div className="mon-uptime-section">
                <div className="mon-uptime-header">
                  <span>90-day uptime</span>
                  <span style={{ color: A }}>99.97%</span>
                </div>
                <div className="mon-uptime-bar">
                  {UPTIME_BLOCKS.map((b, i) => (
                    <div
                      key={i}
                      className={`mon-uptime-block mon-uptime-${b}`}
                    />
                  ))}
                </div>
                <div className="mon-incident-note">No incidents in the last 30 days</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── INCIDENT TIMELINE ── */}
      <section className="mon-section mon-section-alt">
        <div className="mon-container">
          <Reveal>
            <div className="mon-centered">
              <div className="mon-label">Real Incident, Real Response</div>
              <h2 className="mon-h2">Here&rsquo;s what a resolved incident looks like.</h2>
              <p className="mon-desc">
                A memory leak caused a production crash at 2am. Here&rsquo;s the actual response timeline from detection to patch — 31 minutes, start to finish, and the founder slept through all of it.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ maxWidth: 640, margin: '56px auto 0' }}>
              <div className="mon-timeline">
                {INCIDENT.map((item, i) => (
                  <div key={i} className="mon-timeline-item">
                    <div className={`mon-timeline-dot${item.tag === 'resolved' ? ' mon-timeline-dot-resolved' : ''}`} />
                    <div className="mon-timeline-time">{item.time}</div>
                    <div className="mon-timeline-text">
                      {item.text}
                      <span className={`mon-timeline-tag mon-timeline-tag-${item.tag}`}>
                        {item.tag === 'alert' ? 'alert' : item.tag === 'auto' ? 'auto' : 'resolved'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 32, padding: '20px 24px', borderRadius: 12, background: `${A}08`, border: `1px solid ${A}20`, fontFamily: F.mono, fontSize: '0.78rem' }}>
                <div style={{ color: A, fontWeight: 600, marginBottom: 8 }}>Total incident duration: 31 minutes</div>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Auto-remediation resolved the immediate outage in 3 minutes. Root cause investigation and patch deployment completed without waking the founder.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mon-cta-section">
        <Reveal>
          <div className="mon-label" style={{ justifyContent: 'center', display: 'flex' }}>Get Started</div>
          <h2 className="mon-cta-h2">Stop finding out about problems from your customers.</h2>
          <p className="mon-cta-sub">
            We set up monitoring across your full stack in the first week. You get alerts, dashboards, a public status page, and an on-call engineer — without hiring anyone.
          </p>
          <div className="mon-btns">
            <Link href="/cloud/get-hosted" className="mon-btn-primary">
              Start Monitoring <ArrowRight />
            </Link>
            <Link href="/cloud/plans" className="mon-btn-ghost">
              View Plans
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
