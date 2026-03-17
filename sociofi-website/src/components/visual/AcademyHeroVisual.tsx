'use client';
import { useState } from 'react';

const COURSES = [
  {
    title: 'AI-Native Development',
    audience: 'For Developers',
    duration: '8 hrs',
    gradient: 'linear-gradient(135deg, rgba(232,184,77,0.7) 0%, rgba(232,145,111,0.5) 100%)',
  },
  {
    title: 'Deployment & DevOps',
    audience: 'For Founders',
    duration: '4 hrs',
    gradient: 'linear-gradient(135deg, rgba(232,184,77,0.6) 0%, rgba(89,163,146,0.5) 100%)',
  },
  {
    title: 'Product Fundamentals',
    audience: 'For Leaders',
    duration: '6 hrs',
    gradient: 'linear-gradient(135deg, rgba(232,184,77,0.5) 0%, rgba(123,111,232,0.4) 100%)',
  },
];

const STACKS = [
  { rotate: '-7deg', translateY: 24, translateX: -14, scale: 0.93, opacity: 0.65 },
  { rotate: '-2deg', translateY: 12, translateX: -6,  scale: 0.97, opacity: 0.82 },
  { rotate: '2deg',  translateY: 0,  translateX: 0,   scale: 1,    opacity: 1    },
];

const STACKS_HOVER = [
  { rotate: '-12deg', translateY: 32, translateX: -28, scale: 0.91, opacity: 0.55 },
  { rotate: '-4deg',  translateY: 14, translateX: -12, scale: 0.96, opacity: 0.78 },
  { rotate: '3deg',   translateY: 0,  translateX: 0,   scale: 1,    opacity: 1    },
];

export default function AcademyHeroVisual() {
  const [hovered, setHovered] = useState(false);
  const stacks = hovered ? STACKS_HOVER : STACKS;

  return (
    <div
      style={{ position: 'relative', width: 340, height: 260, margin: '0 auto' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Stacked course card preview"
      role="img"
    >
      {COURSES.map((course, i) => {
        const s = stacks[i];
        return (
          <div
            key={course.title}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: 300, height: 190,
              borderRadius: 16,
              background: 'rgba(20,18,40,0.95)',
              border: '1px solid rgba(232,184,77,0.22)',
              boxShadow: i === 2
                ? '0 20px 60px rgba(0,0,0,0.45), 0 0 30px rgba(232,184,77,0.1)'
                : '0 8px 30px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              transform: `rotate(${s.rotate}) translateY(${s.translateY}px) translateX(${s.translateX}px) scale(${s.scale})`,
              opacity: s.opacity,
              transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
              zIndex: i + 1,
            }}
          >
            {/* Thumbnail gradient strip */}
            <div style={{ height: 52, background: course.gradient, position: 'relative' }}>
              {/* Abstract pattern dots */}
              {[...Array(6)].map((_, d) => (
                <span key={d} aria-hidden="true" style={{
                  position: 'absolute',
                  width: 4 + d * 2, height: 4 + d * 2,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  top: 10 + (d % 3) * 12, left: 12 + d * 38,
                }} />
              ))}
            </div>
            {/* Card content */}
            <div style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{
                  fontFamily: '"Syne", sans-serif', fontWeight: 600,
                  fontSize: '0.9rem', color: '#fff', lineHeight: 1.25, letterSpacing: '-0.01em',
                }}>
                  {course.title}
                </span>
                <span style={{
                  fontFamily: '"Fira Code", monospace', fontSize: '0.65rem',
                  color: '#E8B84D', border: '1px solid rgba(232,184,77,0.35)',
                  borderRadius: 20, padding: '2px 8px', flexShrink: 0, marginLeft: 8,
                }}>
                  {course.duration}
                </span>
              </div>
              <span style={{
                fontFamily: '"Fira Code", monospace', fontSize: '0.62rem',
                color: 'rgba(232,184,77,0.7)', letterSpacing: '0.06em',
              }}>
                {course.audience}
              </span>
              {/* Progress bar */}
              <div style={{
                marginTop: 12, height: 3, borderRadius: 2,
                background: 'rgba(232,184,77,0.12)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: i === 2 ? '0%' : '0%',
                  background: 'rgba(232,184,77,0.5)', borderRadius: 2,
                }} />
              </div>
            </div>
          </div>
        );
      })}
      {/* Enroll badge */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        background: 'linear-gradient(135deg, #E8B84D 0%, #E8916F 100%)',
        color: '#fff', borderRadius: 20, padding: '6px 14px',
        fontFamily: '"Syne", sans-serif', fontWeight: 600,
        fontSize: '0.75rem', letterSpacing: '-0.01em',
        boxShadow: '0 8px 24px rgba(232,184,77,0.35)',
        zIndex: 10,
      }}>
        Enroll free →
      </div>
    </div>
  );
}
