interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  accentColor?: string;
  /** Show glassmorphic background instead of standard card */
  glass?: boolean;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  company,
  accentColor,
  glass = false,
}: TestimonialCardProps) {
  const accent = accentColor ?? 'var(--division-accent)';

  // Derive initials from author name
  const initials = author
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      style={{
        position: 'relative',
        background: glass ? 'var(--glass-bg)' : 'var(--bg-card)',
        backdropFilter: glass ? 'blur(12px)' : undefined,
        WebkitBackdropFilter: glass ? 'blur(12px)' : undefined,
        border: `1px solid ${glass ? 'var(--glass-border)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        boxShadow: 'var(--card-shadow)',
      }}
    >
      {/* Decorative quote mark */}
      <svg
        aria-hidden="true"
        viewBox="0 0 40 30"
        fill="none"
        width={40}
        height={30}
        style={{
          color: accent,
          opacity: 0.18,
          position: 'absolute',
          top: 24,
          right: 28,
          flexShrink: 0,
        }}
      >
        <path
          d="M0 30V18C0 12 2.5 7.33 7.5 3.99 12.5 0.66 18.17 0 24.5 0v6c-3.33 0-6.17.83-8.5 2.5C13.67 10.17 12.5 12.67 12.5 16H20V30H0ZM20 30V18c0-6 2.5-10.67 7.5-14.01C32.5.66 38.17 0 44.5 0v6c-3.33 0-6.17.83-8.5 2.5C33.67 10.17 32.5 12.67 32.5 16H40V30H20Z"
          fill="currentColor"
        />
      </svg>

      {/* Quote text */}
      <blockquote
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.05rem',
          fontStyle: 'italic',
          lineHeight: 1.75,
          color: 'var(--text-secondary)',
          margin: 0,
          paddingRight: 32,
        }}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <footer style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Initials avatar */}
        <div
          aria-hidden="true"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: `color-mix(in srgb, ${accent} 20%, transparent)`,
            border: `1.5px solid ${accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-headline)',
            fontSize: '0.82rem',
            fontWeight: 400,
            color: accent,
            flexShrink: 0,
            letterSpacing: '0.02em',
          }}
        >
          {initials}
        </div>

        <div>
          <div
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
            }}
          >
            {author}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginTop: 2,
            }}
          >
            {role}
            {company && (
              <>
                <span style={{ margin: '0 4px' }}>&middot;</span>
                <span style={{ color: accent }}>{company}</span>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
