'use client';

/**
 * Division-specific ambient background components.
 * Each is absolutely positioned, pointer-events:none, and sits behind section content.
 * All animations respect prefers-reduced-motion.
 */

import { useEffect, useRef } from 'react';

// ── Shared wrapper ─────────────────────────────────────────────────────────────

function BgWrap({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Studio — Engineering dot grid ─────────────────────────────────────────────
// Mimics engineering paper: a precise grid of tiny dots

export function DotGridBackground() {
  return (
    <BgWrap>
      <div
        style={{
          position: 'absolute',
          inset: '-10%',
          backgroundImage:
            'radial-gradient(circle, rgba(114,196,178,0.18) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)',
        }}
      />
    </BgWrap>
  );
}

// ── Services — Scan line background ───────────────────────────────────────────
// Horizontal lines referencing monitoring dashboards / terminal feel

export function ScanLineBackground() {
  return (
    <BgWrap>
      {/* Horizontal scan lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(77,191,168,0.05) 23px, rgba(77,191,168,0.05) 24px)',
        }}
      />
      {/* Accent glow from left edge — like a monitor bezel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '3px',
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(77,191,168,0.4) 30%, rgba(77,191,168,0.6) 50%, rgba(77,191,168,0.4) 70%, transparent 100%)',
        }}
      />
      {/* Subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.15) 100%)',
        }}
      />
    </BgWrap>
  );
}

// ── Labs — Constellation background ───────────────────────────────────────────
// Static random dots with connecting lines — research/academic feel

const CONSTELLATION_NODES = [
  { x: 12, y: 18 }, { x: 28, y: 8 }, { x: 45, y: 22 }, { x: 62, y: 12 },
  { x: 78, y: 25 }, { x: 88, y: 15 }, { x: 15, y: 55 }, { x: 35, y: 68 },
  { x: 52, y: 48 }, { x: 70, y: 62 }, { x: 85, y: 52 }, { x: 22, y: 82 },
  { x: 48, y: 88 }, { x: 65, y: 78 }, { x: 92, y: 72 },
];

const CONSTELLATION_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [0, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  [7, 11], [11, 12], [12, 13], [13, 14],
  [2, 8], [4, 9], [8, 12],
];

export function ConstellationBackground() {
  return (
    <BgWrap>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Connection lines */}
        {CONSTELLATION_EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={CONSTELLATION_NODES[a].x}
            y1={CONSTELLATION_NODES[a].y}
            x2={CONSTELLATION_NODES[b].x}
            y2={CONSTELLATION_NODES[b].y}
            stroke="rgba(123,111,232,0.12)"
            strokeWidth="0.3"
          />
        ))}
        {/* Nodes */}
        {CONSTELLATION_NODES.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={i % 4 === 0 ? 0.7 : 0.4}
            fill={`rgba(123,111,232,${i % 3 === 0 ? 0.35 : 0.18})`}
          />
        ))}
      </svg>
      {/* Radial fade to blend with section bg */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 50%, var(--bg-2, #111128) 100%)',
        }}
      />
    </BgWrap>
  );
}

// ── Products — Gradient mesh ───────────────────────────────────────────────────
// Subtle orange radial glows referencing product card aesthetics

export function GradientMeshBackground() {
  return (
    <BgWrap>
      {/* Primary glow — top-right */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '60%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(232,145,111,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Secondary glow — bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '5%',
          width: '45%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(232,145,111,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </BgWrap>
  );
}

// ── Academy — Warm gradient ────────────────────────────────────────────────────
// Amber/warm bottom glow — inviting, hopeful

export function WarmGradientBackground() {
  return (
    <BgWrap>
      {/* Warm amber glow from bottom-center */}
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '70%',
          background: 'radial-gradient(ellipse, rgba(232,184,77,0.09) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      {/* Warm top-right accent */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '10%',
          width: '40%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(240,208,128,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Subtle warm tint overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 60%, rgba(232,184,77,0.03) 100%)',
        }}
      />
    </BgWrap>
  );
}

// ── Ventures — Rising particle background ─────────────────────────────────────
// Canvas-based subtle particles rising from bottom — startup energy

export function RisingParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Sparse, slow particles — ambient, not distracting
    const particles = Array.from({ length: 22 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 120,
      size: 0.8 + Math.random() * 1.2,
      speed: 0.25 + Math.random() * 0.4,
      opacity: 0.06 + Math.random() * 0.1,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(107,163,232,${p.opacity})`;
        ctx.fill();
        p.y -= p.speed;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <BgWrap>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </BgWrap>
  );
}

// ── Cloud — Layered band background ───────────────────────────────────────────
// Diagonal parallel bands referencing infrastructure layers / networking

export function LayeredBandBackground() {
  return (
    <BgWrap>
      {/* Diagonal bands */}
      <div
        style={{
          position: 'absolute',
          inset: '-50%',
          backgroundImage: `
            repeating-linear-gradient(
              -35deg,
              transparent,
              transparent 48px,
              rgba(91,181,224,0.03) 48px,
              rgba(91,181,224,0.03) 50px
            )
          `,
        }}
      />
      {/* Top-left cloud glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '50%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(91,181,224,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Bottom-right accent */}
      <div
        style={{
          position: 'absolute',
          bottom: '-5%',
          right: '10%',
          width: '35%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(91,181,224,0.05) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
    </BgWrap>
  );
}
