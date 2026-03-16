'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';
import { Check } from '@/lib/icons';

interface PricingFeature {
  text: string;
  included?: boolean;
}

interface PricingCardProps {
  name: string;
  /** Badge like "Most Popular" or "Best Value" */
  badge?: string;
  description?: string;
  price: string;
  period?: string;
  /** Sub-note below price, e.g. "+ hosting" */
  priceNote?: string;
  features: (string | PricingFeature)[];
  cta: string;
  ctaHref: string;
  /** Highlighted variant — accent border always visible, elevated */
  featured?: boolean;
  accentColor?: string;
  className?: string;
}

export default function PricingCard({
  name,
  badge,
  description,
  price,
  period = '/month',
  priceNote,
  features,
  cta,
  ctaHref,
  featured = false,
  accentColor,
  className = '',
}: PricingCardProps) {
  const [hovered, setHovered] = useState(false);
  const accent = accentColor ?? 'var(--division-accent)';

  const normalised: PricingFeature[] = features.map((f) =>
    typeof f === 'string' ? { text: f, included: true } : f
  );

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: 'var(--bg-card)',
        border: `1px solid ${featured ? accent : hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: featured ? '36px 32px' : '28px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        boxShadow: featured
          ? `0 0 0 1px ${accent}22, 0 24px 64px rgba(0,0,0,0.18)`
          : hovered
          ? 'var(--card-hover-shadow)'
          : 'var(--card-shadow)',
        transform: (featured || hovered) ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.35s var(--ease), box-shadow 0.35s var(--ease), border-color 0.25s',
        // Scale up featured card visually
        zIndex: featured ? 1 : undefined,
      }}
    >
      {/* Accent top stripe on featured */}
      {featured && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, var(--navy), ${accent})`,
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          }}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 8,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {name}
          </h3>
          {badge && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                fontWeight: 500,
                color: accent,
                border: `1px solid ${accent}`,
                background: `color-mix(in srgb, ${accent} 10%, transparent)`,
                borderRadius: 'var(--radius-full)',
                padding: '3px 10px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Price */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3vw, 2.4rem)',
              fontWeight: 800,
              color: featured ? accent : 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            {price}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
            }}
          >
            {period}
          </span>
        </div>
        {priceNote && (
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginTop: 4,
              letterSpacing: '0.04em',
            }}
          >
            {priceNote}
          </p>
        )}
      </div>

      {/* Feature list */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1,
        }}
      >
        {normalised.map((f, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              color: f.included === false ? 'var(--text-muted)' : 'var(--text-secondary)',
              opacity: f.included === false ? 0.5 : 1,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                marginTop: 1,
                color: f.included === false ? 'var(--text-muted)' : accent,
              }}
            >
              <Check size={14} />
            </span>
            {f.text}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        variant={featured ? 'accent' : 'ghost'}
        href={ctaHref}
        accentColor={accent}
        size="md"
        className="w-full justify-center"
      >
        {cta}
      </Button>
    </div>
  );
}
