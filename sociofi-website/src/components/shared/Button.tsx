'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { ArrowRight } from '@/lib/icons';

type Variant = 'primary' | 'ghost' | 'accent' | 'text';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  accentColor?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  external?: boolean;
  'aria-label'?: string;
}

const SIZE: Record<Size, { padding: string; fontSize: string; gap: string; iconSize: number }> = {
  sm: { padding: '8px 18px',  fontSize: '0.82rem', gap: '6px',  iconSize: 14 },
  md: { padding: '12px 26px', fontSize: '0.9rem',  gap: '8px',  iconSize: 16 },
  lg: { padding: '15px 34px', fontSize: '1rem',    gap: '10px', iconSize: 18 },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'right',
  accentColor,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  external = false,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const { padding, fontSize, gap, iconSize } = SIZE[size];
  const accent = accentColor ?? 'var(--division-accent)';

  // ── Base style ────────────────────────────────────────────────────────────
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap,
    padding: variant === 'text' ? `${SIZE[size].padding.split(' ')[0]} 0` : padding,
    fontSize,
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1,
    borderRadius: variant === 'text' ? 0 : 'var(--radius-full)',
    border: variant === 'ghost' ? '1.5px solid var(--border)' : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    textDecoration: 'none',
    position: 'relative',
    overflow: variant === 'text' ? 'visible' : 'hidden',
    whiteSpace: 'nowrap',
    transition: 'transform 0.2s var(--ease), box-shadow 0.2s var(--ease), border-color 0.2s, color 0.2s',
    WebkitTapHighlightColor: 'transparent',
  };

  const variantStyle: React.CSSProperties =
    variant === 'primary' ? {
      background: 'var(--gradient-brand)',
      color: '#fff',
      boxShadow: '0 4px 24px rgba(58,88,158,0.35)',
    } :
    variant === 'ghost' ? {
      background: 'transparent',
      color: 'var(--text-primary)',
    } :
    variant === 'accent' ? {
      background: accent,
      color: '#fff',
      boxShadow: `0 4px 20px color-mix(in srgb, ${accent} 40%, transparent)`,
    } : {
      // text
      background: 'transparent',
      color: accent,
    };

  const style: React.CSSProperties = { ...base, ...variantStyle };

  // ── Hover handlers ────────────────────────────────────────────────────────
  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const el = e.currentTarget as HTMLElement;
    if (variant === 'primary') {
      el.style.transform = 'translateY(-3px) scale(1.03)';
      el.style.boxShadow = '0 10px 40px rgba(58,88,158,0.5)';
    } else if (variant === 'ghost') {
      el.style.borderColor = accent;
      el.style.color = accent;
    } else if (variant === 'accent') {
      el.style.transform = 'translateY(-3px) scale(1.02)';
      el.style.filter = 'brightness(1.1)';
    } else {
      el.style.transform = 'translateX(4px)';
    }
  };

  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = '';
    el.style.filter = '';
    if (variant === 'ghost') {
      el.style.borderColor = 'var(--border)';
      el.style.color = 'var(--text-primary)';
    }
  };

  // ── Icon rendering ────────────────────────────────────────────────────────
  const defaultTrailing = variant === 'text'
    ? <ArrowRight size={iconSize} />
    : null;

  const leftIcon = iconPosition === 'left' && icon
    ? <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
    : null;

  const rightIcon = iconPosition === 'right'
    ? icon
      ? <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
      : defaultTrailing
    : null;

  const inner = (
    <>
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </>
  );

  const shared = {
    style,
    className,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    'aria-label': ariaLabel,
    'aria-disabled': disabled || undefined,
  };

  if (href) {
    const isExternal = external || href.startsWith('http') || href.startsWith('//');
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...shared}>
          {inner}
        </a>
      );
    }
    return <Link href={href} {...shared}>{inner}</Link>;
  }

  return (
    <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled} {...shared}>
      {inner}
    </button>
  );
}
