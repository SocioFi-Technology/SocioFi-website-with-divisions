'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from '@/lib/icons';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  href?: string;
  linkText?: string;
  accentColor?: string;
  className?: string;
}

export default function ServiceCard({
  title,
  description,
  icon,
  href,
  linkText = 'Learn more',
  accentColor,
  className = '',
}: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);
  const accent = accentColor ?? 'var(--division-accent)';

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '32px 36px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: hovered ? 'var(--card-hover-shadow)' : 'var(--card-shadow)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform 0.4s var(--ease), box-shadow 0.4s var(--ease), border-color 0.3s',
        overflow: 'hidden',
      }}
    >
      {/* Gradient top-border on hover */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, var(--navy), ${accent})`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s var(--ease)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
        }}
      />

      {/* Icon */}
      {icon && (
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 'var(--radius-md)',
            background: `color-mix(in srgb, ${accent} 12%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
            flexShrink: 0,
            transform: hovered ? 'translateY(-3px) scale(1.06)' : 'translateY(0) scale(1)',
            transition: 'transform 0.35s var(--ease-spring)',
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '1.15rem',
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
            fontSize: '0.95rem',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>

      {/* Link */}
      {href && (
        <Link
          href={href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: hovered ? 10 : 6,
            fontFamily: 'var(--font-headline)',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: accent,
            textDecoration: 'none',
            transition: 'gap 0.2s var(--ease)',
            marginTop: 4,
          }}
        >
          {linkText}
          <ArrowRight size={14} color={accent} />
        </Link>
      )}
    </div>
  );
}
