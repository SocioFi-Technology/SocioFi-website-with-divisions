'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from '@/lib/icons';

interface CardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Background color/gradient for the icon container */
  iconBg?: string;
  link?: string;
  linkText?: string;
  accentColor?: string;
  children?: ReactNode;
  className?: string;
  /** Render as a plain div (default) or an <article> */
  as?: 'div' | 'article';
}

export default function Card({
  title,
  description,
  icon,
  iconBg,
  link,
  linkText = 'Learn more',
  accentColor,
  children,
  className = '',
  as: Tag = 'div',
}: CardProps) {
  const [hovered, setHovered] = useState(false);
  const accent = accentColor ?? 'var(--division-accent)';

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    background: 'var(--bg-card)',
    border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-lg)',
    padding: '28px 32px 32px',
    boxShadow: hovered ? 'var(--card-hover-shadow)' : 'var(--card-shadow)',
    transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
    transition: 'transform 0.4s var(--ease), box-shadow 0.4s var(--ease), border-color 0.3s',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    overflow: 'hidden',
  };

  // Gradient top-border — 2px strip, revealed on hover
  const topBorderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: `linear-gradient(90deg, var(--navy), ${accent})`,
    opacity: hovered ? 1 : 0,
    transition: 'opacity 0.4s var(--ease)',
    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
  };

  const defaultIconBg = iconBg ?? `color-mix(in srgb, ${accent} 12%, transparent)`;

  const inner = (
    <>
      {/* Gradient top reveal */}
      <div aria-hidden="true" style={topBorderStyle} />

      {/* Icon */}
      {icon && (
        <div
          className="card-icon"
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-sm)',
            background: defaultIconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: accent,
            transition: 'background 0.3s',
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '1.1rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {title}
        </h3>

        {description && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              margin: 0,
              flex: 1,
            }}
          >
            {description}
          </p>
        )}

        {children}
      </div>

      {/* Link row */}
      {link && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-headline)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: accent,
            marginTop: 4,
            transition: 'gap 0.2s var(--ease)',
          }}
        >
          <span>{linkText}</span>
          <ArrowRight size={14} color={accent} />
        </div>
      )}
    </>
  );

  const sharedProps = {
    style: cardStyle,
    className,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  // If the whole card is a link, wrap in <a>/<Link>
  if (link && !linkText) {
    return (
      <Link href={link} style={{ textDecoration: 'none', display: 'block' }}>
        <Tag {...sharedProps}>{inner}</Tag>
      </Link>
    );
  }

  return <Tag {...sharedProps}>{inner}</Tag>;
}
