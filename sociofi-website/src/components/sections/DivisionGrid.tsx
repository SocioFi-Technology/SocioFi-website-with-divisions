'use client';

import { useState } from 'react';
import Link from 'next/link';
import { divisionList, type Division } from '@/lib/divisions';
import { ArrowRight } from '@/lib/icons';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import Container from '@/components/shared/Container';

interface DivisionCardProps {
  division: Division;
  featured?: boolean;
}

function DivisionCard({ division, featured = false }: DivisionCardProps) {
  const [hovered, setHovered] = useState(false);
  const accent = division.accent;

  return (
    <Link
      href={division.url}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          background: 'var(--bg-card)',
          border: `1px solid ${hovered ? accent + '40' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: featured ? '36px 40px' : '28px 32px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: featured ? 20 : 16,
          overflow: 'hidden',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered
            ? `0 20px 48px rgba(0,0,0,0.18), 0 0 0 1px ${accent}22`
            : 'var(--card-shadow)',
          transition: 'transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.25s',
        }}
      >
        {/* Gradient top stripe — always on featured, on hover otherwise */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            background: `linear-gradient(90deg, var(--navy), ${accent})`,
            opacity: featured || hovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Accent glow orb */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-30%', right: '-20%',
            width: featured ? 260 : 200,
            height: featured ? 260 : 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
            opacity: hovered ? 0.08 : 0.04,
            filter: 'blur(40px)',
            transition: 'opacity 0.4s',
            pointerEvents: 'none',
          }}
        />

        {/* Division double-chevron mark */}
        <div
          aria-hidden="true"
          style={{
            width: featured ? 48 : 40,
            height: featured ? 48 : 40,
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 100 100" fill="none" width="100%" height="100%">
            <path
              d="M25 15L55 50L25 85"
              stroke="var(--navy-bright, #4A6CB8)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M45 15L75 50L45 85"
              stroke={accent}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {/* Subtitle label */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            fontWeight: 500,
            color: accent,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: '0 0 6px',
          }}>
            {division.subtitle}
          </p>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: featured ? '1.3rem' : '1.1rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            margin: '0 0 10px',
          }}>
            {division.name.replace('SocioFi ', '')}
          </h3>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: featured ? '0.95rem' : '0.88rem',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            margin: 0,
          }}>
            {division.description}
          </p>
        </div>

        {/* CTA row */}
        {division.cta && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: hovered ? 10 : 6,
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: accent,
            transition: 'gap 0.2s var(--ease)',
          }}>
            {division.cta.label}
            <ArrowRight size={14} color={accent} />
          </div>
        )}
      </div>
    </Link>
  );
}

interface DivisionGridProps {
  className?: string;
}

export default function DivisionGrid({ className = '' }: DivisionGridProps) {
  const studio = divisionList.find(d => d.slug === 'studio')!;
  const rest = divisionList.filter(d => d.slug !== 'studio');

  return (
    <div className={className}>
      <StaggerChildren>
        {/* Top row: Studio (featured, 2-col wide) + Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <StaggerItem className="md:col-span-2">
            <DivisionCard division={studio} featured />
          </StaggerItem>
          <StaggerItem>
            <DivisionCard division={rest[0]} />
          </StaggerItem>
        </div>

        {/* Remaining 5 divisions in a 3-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.slice(1).map((d) => (
            <StaggerItem key={d.slug}>
              <DivisionCard division={d} />
            </StaggerItem>
          ))}
        </div>
      </StaggerChildren>
    </div>
  );
}
