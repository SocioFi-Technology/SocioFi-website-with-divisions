'use client';
import { useEffect, useRef } from 'react';

const DEALS = [
  {
    title: 'Equity Deal',
    subtitle: 'We build. You share upside.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6BA3E8" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-4 0v2" />
      </svg>
    ),
  },
  {
    title: 'Revenue Share',
    subtitle: 'Pay from what you earn.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6BA3E8" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    title: 'Hybrid Model',
    subtitle: 'Best of both, reduced upfront.',
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#6BA3E8" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
];

export default function VenturesHeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const count = 28;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vy: 0.3 + Math.random() * 0.5,
      r: 1.2 + Math.random() * 1.4,
      opacity: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    function draw() {
      ctx!.clearRect(0, 0, W, H);
      frame++;
      particles.forEach(p => {
        p.y -= p.vy;
        if (p.y + p.r < 0) { p.y = H + p.r; p.x = Math.random() * W; }
        const flicker = p.opacity + Math.sin(frame * 0.04 + p.phase) * 0.06;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(107,163,232,${flicker.toFixed(2)})`;
        ctx!.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      role="img"
      aria-label="Deal model selection with rising particle background"
      style={{
        position: 'relative',
        borderRadius: 16,
        background: 'rgba(10,12,28,0.96)',
        border: '1px solid rgba(107,163,232,0.18)',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(107,163,232,0.06)',
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Rising particle canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          width: '100%', height: '100%',
        }}
      />

      {/* Header */}
      <div style={{
        position: 'relative', zIndex: 1,
        fontFamily: '"Fira Code", monospace',
        fontSize: '0.62rem', color: 'rgba(107,163,232,0.6)',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        marginBottom: 2,
      }}>
        Choose your model
      </div>

      {/* Deal cards */}
      {DEALS.map((deal, i) => (
        <div
          key={deal.title}
          style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(17,17,40,0.8)',
            border: '1px solid rgba(107,163,232,0.2)',
            borderRadius: 12,
            padding: '12px 16px',
            backdropFilter: 'blur(8px)',
            transition: 'border-color 0.2s, background 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107,163,232,0.5)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(107,163,232,0.08)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107,163,232,0.2)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(17,17,40,0.8)';
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(107,163,232,0.12)',
            border: '1px solid rgba(107,163,232,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {deal.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Syne", sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#fff', letterSpacing: '-0.01em' }}>
              {deal.title}
            </div>
            <div style={{ fontFamily: '"Outfit", sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
              {deal.subtitle}
            </div>
          </div>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(107,163,232,0.5)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      ))}

      {/* Footer note */}
      <div style={{
        position: 'relative', zIndex: 1,
        fontFamily: '"Fira Code", monospace',
        fontSize: '0.62rem', color: 'rgba(107,163,232,0.4)',
        textAlign: 'center', marginTop: 4,
      }}>
        Terms negotiated case-by-case
      </div>
    </div>
  );
}
