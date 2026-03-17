'use client';
import { useState, useEffect } from 'react';

const PRODUCTS = [
  {
    name: 'FabricxAI',
    accent: '#E8916F',
    description: '22-agent garment ops platform',
    pills: ['AI Agents', 'Real-time', 'Multi-factory'],
    href: '/products/fabricxai',
    gradient: 'linear-gradient(135deg, rgba(232,145,111,0.2) 0%, rgba(232,184,77,0.12) 100%)',
  },
  {
    name: 'NEXUS ARIA',
    accent: '#6BA3E8',
    description: 'Conversational AI infrastructure',
    pills: ['RAG', 'Multi-modal', 'Enterprise'],
    href: '/products/nexus-aria',
    gradient: 'linear-gradient(135deg, rgba(107,163,232,0.2) 0%, rgba(58,88,158,0.12) 100%)',
  },
  {
    name: 'DevBridge',
    accent: '#72C4B2',
    description: 'No-code to production bridge',
    pills: ['Visual Builder', 'One-click Deploy', 'AI-assisted'],
    href: '/products/devbridge',
    gradient: 'linear-gradient(135deg, rgba(114,196,178,0.2) 0%, rgba(89,163,146,0.12) 100%)',
  },
];

export default function ProductsHeroVisual() {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    if (mq.matches) return;
    const t = setInterval(() => setActive(a => (a + 1) % PRODUCTS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const product = PRODUCTS[active];

  return (
    <div
      role="img"
      aria-label="Product showcase cycling through FabricxAI, NEXUS ARIA, and DevBridge"
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      {/* Main product card */}
      <div style={{
        background: 'rgba(13,13,30,0.97)',
        border: `1.5px solid ${product.accent}44`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${product.accent}18`,
        transition: reduced ? 'none' : 'border-color 0.4s, box-shadow 0.4s',
      }}>
        {/* Top gradient header */}
        <div style={{
          height: 72,
          background: product.gradient,
          position: 'relative',
          display: 'flex', alignItems: 'center', padding: '0 24px',
          transition: reduced ? 'none' : 'background 0.4s',
        }}>
          {/* Abstract geometry */}
          {[...Array(4)].map((_, i) => (
            <span key={i} aria-hidden="true" style={{
              position: 'absolute',
              width: 16 + i * 8, height: 16 + i * 8,
              borderRadius: 2 + i * 2,
              border: `1.5px solid ${product.accent}40`,
              top: 12 + (i % 2) * 10, right: 20 + i * 14,
              transform: `rotate(${15 + i * 20}deg)`,
            }} />
          ))}
          <span style={{
            fontFamily: '"Syne", sans-serif', fontWeight: 800,
            fontSize: '1.5rem', letterSpacing: '-0.03em',
            color: product.accent,
            textShadow: `0 0 30px ${product.accent}60`,
            transition: reduced ? 'none' : 'color 0.4s',
          }}>
            {product.name}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>
          <p style={{
            fontFamily: '"Outfit", sans-serif', fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: 16,
          }}>
            {product.description}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {product.pills.map(pill => (
              <span key={pill} style={{
                fontFamily: '"Fira Code", monospace', fontSize: '0.65rem',
                color: product.accent,
                background: `${product.accent}14`,
                border: `1px solid ${product.accent}30`,
                borderRadius: 20, padding: '3px 10px',
                transition: reduced ? 'none' : 'all 0.3s',
              }}>
                {pill}
              </span>
            ))}
          </div>
          <a href={product.href} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: '"Fira Code", monospace', fontSize: '0.7rem',
            color: `${product.accent}cc`,
            textDecoration: 'none',
          }}>
            View product
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Product selector tabs */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {PRODUCTS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setActive(i)}
            style={{
              fontFamily: '"Fira Code", monospace', fontSize: '0.65rem',
              color: i === active ? p.accent : 'rgba(255,255,255,0.35)',
              background: i === active ? `${p.accent}14` : 'transparent',
              border: `1px solid ${i === active ? p.accent + '44' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 20, padding: '4px 12px',
              cursor: 'pointer', transition: 'all 0.25s',
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
