'use client';

import { useState } from 'react';
import Link from 'next/link';
import { divisionList, type Division } from '@/lib/divisions';
import { ArrowRight } from '@/lib/icons';
import { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import { LogoMark } from '@/components/shared/Logo';

// ── Division Card ─────────────────────────────────────────────────────────────

function DivisionCard({
  division,
  variant = 'default',
}: {
  division: Division;
  variant?: 'hero' | 'featured' | 'default';
}) {
  const [hovered, setHovered] = useState(false);
  const accent = division.accent;
  const isHero = variant === 'hero';
  const isFeatured = variant === 'featured';

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
          background: isHero
            ? `linear-gradient(135deg, var(--bg-card) 0%, ${accent}0A 100%)`
            : 'var(--bg-card)',
          border: `1px solid ${hovered ? accent + '45' : isHero ? accent + '20' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: isHero ? '40px 48px' : isFeatured ? '36px 40px' : '28px 32px',
          height: '100%',
          display: 'flex',
          flexDirection: isHero ? 'row' : 'column',
          alignItems: isHero ? 'center' : 'flex-start',
          gap: isHero ? 48 : isFeatured ? 20 : 16,
          overflow: 'hidden',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered
            ? `0 20px 48px rgba(0,0,0,0.18), 0 0 0 1px ${accent}22`
            : isHero
            ? `var(--card-shadow), 0 0 0 1px ${accent}10`
            : 'var(--card-shadow)',
          transition: 'transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.25s',
        }}
      >
        {/* Gradient top stripe */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            background: `linear-gradient(90deg, var(--navy), ${accent})`,
            opacity: isHero || hovered ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Background glow orb */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-20%', right: '-15%',
            width: isHero ? 320 : isFeatured ? 260 : 200,
            height: isHero ? 320 : isFeatured ? 260 : 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
            opacity: hovered ? (isHero ? 0.1 : 0.08) : isHero ? 0.06 : 0.04,
            filter: 'blur(40px)',
            transition: 'opacity 0.4s',
            pointerEvents: 'none',
          }}
        />

        {/* Division logo mark — uses the same SVG as the division's nav logo */}
        <div style={{ flexShrink: 0 }}>
          <LogoMark
            division={division.slug}
            size={isHero ? 'lg' : isFeatured ? 'md' : 'sm'}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Subtitle / tagline */}
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

          {/* Division name */}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isHero ? '1.6rem' : isFeatured ? '1.3rem' : '1.1rem',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            margin: '0 0 10px',
          }}>
            {division.name}
          </h3>

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: isHero ? '1rem' : isFeatured ? '0.95rem' : '0.88rem',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            margin: 0,
            maxWidth: isHero ? 480 : undefined,
          }}>
            {division.description}
          </p>

          {/* CTA */}
          {division.cta && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: hovered ? 10 : 6,
              marginTop: isHero ? 24 : 16,
              fontFamily: 'var(--font-display)',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: accent,
              transition: 'gap 0.2s var(--ease)',
            }}>
              {division.cta.label}
              <ArrowRight size={14} color={accent} />
            </div>
          )}

          {/* Hero: "Explore all divisions" link instead of CTA */}
          {!division.cta && isHero && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: hovered ? 10 : 6,
              marginTop: 24,
              fontFamily: 'var(--font-display)',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: accent,
              transition: 'gap 0.2s var(--ease)',
            }}>
              Explore all divisions
              <ArrowRight size={14} color={accent} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Grid Layout ───────────────────────────────────────────────────────────────

export default function DivisionGrid({ className = '' }: { className?: string }) {
  // divisionList is already in the correct order: technology, studio, agents, services, cloud, academy, ventures, labs
  const [parent, studio, agents, services, cloud, academy, ventures, labs] = divisionList;

  return (
    <div className={className}>
      <StaggerChildren>

        {/* Row 1: Parent — full-width hero card */}
        <StaggerItem className="mb-5">
          <DivisionCard division={parent} variant="hero" />
        </StaggerItem>

        {/* Row 2: Studio (featured 2-col) + Agents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <StaggerItem className="md:col-span-2">
            <DivisionCard division={studio} variant="featured" />
          </StaggerItem>
          <StaggerItem>
            <DivisionCard division={agents} variant="featured" />
          </StaggerItem>
        </div>

        {/* Row 3: Services, Cloud (3-col, cloud spans 2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <StaggerItem>
            <DivisionCard division={services} />
          </StaggerItem>
          <StaggerItem className="md:col-span-2">
            <DivisionCard division={cloud} variant="featured" />
          </StaggerItem>
        </div>

        {/* Row 4: Academy, Ventures, Labs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StaggerItem>
            <DivisionCard division={academy} />
          </StaggerItem>
          <StaggerItem>
            <DivisionCard division={ventures} />
          </StaggerItem>
          <StaggerItem>
            <DivisionCard division={labs} />
          </StaggerItem>
        </div>

      </StaggerChildren>
    </div>
  );
}
