'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from '@/lib/icons';

interface PortfolioCardProps {
  title: string;
  description: string;
  /** Tech stack / service tags */
  tags: string[];
  slug: string;
  client?: string;
  /** Accent color for the image gradient placeholder */
  accentColor?: string;
  /** Hex color 2 for the placeholder gradient */
  accentColor2?: string;
  /** Optional image path (SVG/PNG) for the card */
  image?: string;
  className?: string;
}

export default function PortfolioCard({
  title,
  description,
  tags,
  slug,
  client,
  accentColor,
  accentColor2,
  image,
  className = '',
}: PortfolioCardProps) {
  const [hovered, setHovered] = useState(false);
  const accent = accentColor ?? 'var(--division-accent)';
  const accent2 = accentColor2 ?? 'var(--navy)';

  return (
    <Link
      href={`/studio/portfolio/${slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <article
        className={className}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          background: 'var(--bg-card)',
          border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: hovered ? 'var(--card-hover-shadow)' : 'var(--card-shadow)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          transition:
            'transform 0.4s var(--ease), box-shadow 0.4s var(--ease), border-color 0.3s',
        }}
      >
        {/* ── Image / placeholder area ──────────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            height: 200,
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${accent2} 0%, ${accent} 100%)`,
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.6s var(--ease)',
          }}
        >
          {/* Image or grid overlay */}
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                `,
                backgroundSize: '32px 32px',
              }}
            />
          )}

          {/* Subtle chevron watermark */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: -20,
              right: -20,
              opacity: 0.1,
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" width={120} height={120}>
              <path
                d="M25 15L55 50L25 85"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M45 15L75 50L45 85"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Zoom-on-hover scale overlay */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.4s var(--ease)',
            }}
          />

          {/* External link icon on hover */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.8)',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1)' : 'scale(0.8)',
              transition: 'opacity 0.3s, transform 0.3s var(--ease)',
            }}
          >
            <ExternalLink size={14} color="currentColor" />
          </div>
        </div>

        {/* ── Card body ───────────────────────────────────────────────────── */}
        <div style={{ padding: '24px 28px 28px' }}>
          {client && (
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: 500,
                color: accent,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 8px',
              }}
            >
              {client}
            </p>
          )}

          <h3
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.1rem',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
              color: 'var(--text-primary)',
              margin: '0 0 10px',
            }}
          >
            {title}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: '0 0 16px',
            }}
          >
            {description}
          </p>

          {/* Tech stack pills */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-3)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
