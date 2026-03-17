'use client';
import { useEffect, useRef } from 'react';

const PACKETS_CSS = `
@keyframes cloud-packet-1 { 0%{top:85%;opacity:0} 15%{opacity:0.9} 85%{opacity:0.9} 100%{top:8%;opacity:0} }
@keyframes cloud-packet-2 { 0%{top:85%;opacity:0} 15%{opacity:0.7} 85%{opacity:0.7} 100%{top:8%;opacity:0} }
@keyframes cloud-packet-3 { 0%{top:85%;opacity:0} 15%{opacity:0.5} 85%{opacity:0.5} 100%{top:8%;opacity:0} }
`;

export default function CloudHeroVisual() {
  return (
    <div
      role="img"
      aria-label="3-layer infrastructure diagram showing app, SocioFi Cloud, and provider layers"
      style={{
        background: 'rgba(10,12,28,0.97)',
        border: '1px solid rgba(91,181,224,0.18)',
        borderRadius: 16,
        overflow: 'hidden',
        fontFamily: '"Outfit", sans-serif',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(91,181,224,0.06)',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <style>{PACKETS_CSS}</style>

      {/* Animated data packets */}
      {[
        { left: '30%', delay: '0s',   anim: 'cloud-packet-1', dur: '2.4s' },
        { left: '52%', delay: '0.8s', anim: 'cloud-packet-2', dur: '2.4s' },
        { left: '68%', delay: '1.6s', anim: 'cloud-packet-3', dur: '2.4s' },
      ].map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: p.left,
            width: 5, height: 5,
            borderRadius: '50%',
            background: '#5BB5E0',
            animation: `${p.anim} ${p.dur} ${p.delay} ease-in-out infinite`,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(91,181,224,0.08)',
      }}>
        {['#FF5F57','#FEBC2E','#28C840'].map(c => (
          <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, display: 'inline-block' }} />
        ))}
        <span style={{ marginLeft: 10, color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.04em', fontFamily: '"Fira Code", monospace' }}>
          infrastructure.yml
        </span>
      </div>

      {/* Layers */}
      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Layer 1 — Your App (top) */}
        <div style={{
          background: 'rgba(91,181,224,0.06)',
          border: '1px solid rgba(91,181,224,0.2)',
          borderRadius: 12,
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(91,181,224,0.12)',
              border: '1px solid rgba(91,181,224,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#5BB5E0" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" /><polyline points="8 21 12 17 16 21" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: '"Syne", sans-serif', fontWeight: 600, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>Your App</div>
              <div style={{ fontFamily: '"Fira Code", monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>Next.js · v14.2</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4DBFA8', display: 'inline-block' }} aria-hidden="true" />
            <span style={{ fontSize: '0.65rem', color: '#4DBFA8', fontFamily: '"Fira Code", monospace' }}>Running</span>
          </div>
        </div>

        {/* Connector dots */}
        <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          {[1,0.5,0.25].map((o,i) => <span key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: `rgba(91,181,224,${o})` }} />)}
        </div>

        {/* Layer 2 — SocioFi Cloud (highlighted) */}
        <div style={{
          background: 'rgba(91,181,224,0.1)',
          border: '1.5px solid rgba(91,181,224,0.5)',
          borderRadius: 12,
          padding: '16px 16px',
          boxShadow: '0 0 20px rgba(91,181,224,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(91,181,224,0.18)',
              border: '1px solid rgba(91,181,224,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#5BB5E0" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#5BB5E0' }}>SocioFi Cloud</div>
              <div style={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.7rem', color: 'rgba(91,181,224,0.6)', marginTop: 1 }}>Managed Infrastructure</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
            {['SSL ✓','Backups ✓','Scaling ✓'].map(badge => (
              <span key={badge} style={{
                fontSize: '0.6rem', color: '#5BB5E0',
                background: 'rgba(91,181,224,0.1)', borderRadius: 4,
                padding: '1px 6px', fontFamily: '"Fira Code", monospace',
              }}>
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Connector dots */}
        <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          {[0.25,0.5,1].map((o,i) => <span key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: `rgba(91,181,224,${o})` }} />)}
        </div>

        {/* Layer 3 — Cloud Provider (dimmed) */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12,
          padding: '12px 16px',
          opacity: 0.6,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Cloud Provider</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {['AWS','DO','Hetzner'].map(p => (
              <span key={p} style={{
                fontFamily: '"Fira Code", monospace', fontSize: '0.62rem',
                color: 'rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 4, padding: '2px 7px',
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
