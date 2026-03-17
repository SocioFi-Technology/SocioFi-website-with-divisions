'use client';
import { useEffect, useState } from 'react';

const SERVICES = [
  { name: 'API Gateway',    uptime: '99.9%', ms: '42ms',  status: 'Operational' },
  { name: 'Database',       uptime: '100%',  ms: '8ms',   status: 'Operational' },
  { name: 'Auth Service',   uptime: '99.8%', ms: '31ms',  status: 'Operational' },
  { name: 'CDN',            uptime: '100%',  ms: '12ms',  status: 'Operational' },
  { name: 'Worker Queue',   uptime: '99.7%', ms: '156ms', status: 'Operational' },
];

// SVG sparkline path (a gentle uptime wave)
function Sparkline({ color = '#4DBFA8' }: { color?: string }) {
  return (
    <svg width={60} height={20} viewBox="0 0 60 20" aria-hidden="true">
      <polyline
        points="0,15 10,12 20,8 30,11 40,7 50,9 60,6"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
      />
    </svg>
  );
}

// Minimal SVG chart for the "live chart" area
function LiveChart() {
  return (
    <svg width="100%" height={52} viewBox="0 0 280 52" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4DBFA8" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#4DBFA8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d="M0,40 C20,38 40,20 60,22 S100,8 120,10 S160,4 180,6 S220,2 240,4 L280,2 L280,52 L0,52 Z"
        fill="url(#chartFill)"
      />
      <path
        d="M0,40 C20,38 40,20 60,22 S100,8 120,10 S160,4 180,6 S220,2 240,4 L280,2"
        fill="none"
        stroke="#4DBFA8"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ServicesHeroVisual() {
  const [pulse, setPulse] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) { setReduced(true); return; }
    const t = setInterval(() => setPulse(p => (p + 1) % 5), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      role="img"
      aria-label="Live monitoring dashboard showing service health"
      style={{
        background: 'rgba(10,10,24,0.97)',
        border: '1px solid rgba(77,191,168,0.18)',
        borderRadius: 16,
        overflow: 'hidden',
        fontFamily: '"Outfit", sans-serif',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(77,191,168,0.06)',
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 18px',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(77,191,168,0.08)',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
          System Monitor
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            aria-hidden="true"
            style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#4DBFA8',
              display: 'inline-block',
              boxShadow: reduced ? 'none' : '0 0 0 3px rgba(77,191,168,0.2)',
              animation: reduced ? 'none' : 'svc-pulse 2s ease-in-out infinite',
            }}
          />
          <style>{`@keyframes svc-pulse { 0%,100%{box-shadow:0 0 0 3px rgba(77,191,168,0.25)} 50%{box-shadow:0 0 0 5px rgba(77,191,168,0.1)} }`}</style>
          <span style={{ color: '#4DBFA8', fontSize: '0.7rem', fontWeight: 500 }}>Live</span>
        </div>
      </div>

      {/* Service rows */}
      <div style={{ padding: '8px 0' }}>
        {SERVICES.map((svc, i) => (
          <div
            key={svc.name}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 18px',
              background: i === pulse && !reduced ? 'rgba(77,191,168,0.04)' : 'transparent',
              transition: 'background 0.4s',
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#4DBFA8', flexShrink: 0,
              animation: reduced ? 'none' : `svc-dot-${i} ${2 + i * 0.3}s ease-in-out infinite`,
              opacity: 0.9,
            }} aria-hidden="true" />
            <style>{`@keyframes svc-dot-${i} { 0%,100%{opacity:0.9} 50%{opacity:0.5} }`}</style>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {svc.name}
            </span>
            <Sparkline />
            <span style={{ fontSize: '0.68rem', color: '#4DBFA8', fontFamily: '"Fira Code", monospace', width: 40, textAlign: 'right' }}>
              {svc.ms}
            </span>
            <span style={{
              fontSize: '0.65rem', color: 'rgba(77,191,168,0.7)',
              background: 'rgba(77,191,168,0.1)', border: '1px solid rgba(77,191,168,0.2)',
              borderRadius: 4, padding: '1px 6px', flexShrink: 0,
            }}>
              {svc.status}
            </span>
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div style={{ padding: '6px 18px 4px', borderTop: '1px solid rgba(77,191,168,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: '"Fira Code", monospace' }}>
            Response time — 24h
          </span>
          <span style={{ fontSize: '0.68rem', color: '#4DBFA8', fontFamily: '"Fira Code", monospace' }}>99.9% uptime</span>
        </div>
        <LiveChart />
      </div>

      {/* Footer status */}
      <div style={{
        display: 'flex', gap: 8, padding: '10px 18px',
        borderTop: '1px solid rgba(77,191,168,0.06)',
        flexWrap: 'wrap',
      }}>
        {['Monitoring active', 'Security scan: clean', 'Last incident: 47d ago'].map(t => (
          <span key={t} style={{
            fontSize: '0.62rem', color: 'rgba(77,191,168,0.6)',
            background: 'rgba(77,191,168,0.06)', borderRadius: 4, padding: '2px 8px',
            fontFamily: '"Fira Code", monospace',
          }}>
            ✓ {t}
          </span>
        ))}
      </div>
    </div>
  );
}
