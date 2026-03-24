'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface ParticleFieldProps {
  /** Hex color for particles and connections */
  color?: string;
  count?: number;
  /** Velocity multiplier */
  speed?: number;
  /** Max distance to draw a connection line */
  connectDist?: number;
  className?: string;
}

export default function ParticleField({
  color = '#7B6FE8',
  count = 55,
  speed = 0.4,
  connectDist = 110,
  className = '',
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect prefers-reduced-motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // On mobile: halve particle count and reduce connect distance to ease GPU load
    const isMobile = window.innerWidth < 768;
    const effectiveCount  = isMobile ? Math.ceil(count / 2) : count;
    const effectiveDist   = isMobile ? Math.ceil(connectDist * 0.75) : connectDist;

    // Resize handling
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Parse hex color → rgb components for alpha compositing
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Create particles
    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;
    const particles: Particle[] = Array.from({ length: effectiveCount }, () => ({
      x:  Math.random() * w(),
      y:  Math.random() * h(),
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r:  Math.random() * 1.5 + 0.8,
    }));

    let rafId: number;
    // Pause the loop when the canvas is scrolled off-screen
    let isVisible = true;

    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 },
    );
    io.observe(canvas);

    const draw = () => {
      rafId = requestAnimationFrame(draw);

      // Skip expensive draw when canvas is not visible
      if (!isVisible) return;

      const W = w();
      const H = h();
      ctx.clearRect(0, 0, W, H);

      // Move + bounce
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < effectiveDist) {
            const alpha = (1 - dist / effectiveDist) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
        ctx.fill();
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [color, count, speed, connectDist]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity: 0.65 }}
      aria-hidden="true"
    />
  );
}
