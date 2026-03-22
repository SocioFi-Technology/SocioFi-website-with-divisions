import Link from 'next/link';
import { BlogPost, CATEGORY_CONFIG, CATEGORY_IMAGES, formatPostDate } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
  accentColor?: string;
  compact?: boolean;
}

function AuthorAvatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: color + '22',
        border: `1.5px solid ${color}44`,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.58rem',
        fontWeight: 700,
        color: color,
        flexShrink: 0,
        letterSpacing: '0.02em',
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export default function BlogCard({ post, accentColor, compact = false }: BlogCardProps) {
  const catCfg = CATEGORY_CONFIG[post.category];
  const accent = accentColor ?? catCfg.color;

  return (
    <Link
      href={post.canonicalUrl}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        textDecoration: 'none',
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s',
      }}
      className="blog-card-link"
    >
      {/* Top color bar */}
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          height: 3,
          background: `linear-gradient(90deg, ${accent}, var(--teal-light, #72C4B2))`,
          opacity: 0.7,
          transition: 'opacity 0.3s',
          flexShrink: 0,
        }}
        className="blog-card-bar"
      />

      {/* Thumbnail */}
      {!compact && (
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            height: 180,
            background: `linear-gradient(135deg, ${accent}22 0%, #3A589E33 50%, ${accent}11 100%)`,
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
            src={CATEGORY_IMAGES[post.category]}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </span>
      )}

      {/* Body */}
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: compact ? '16px 18px' : '22px 24px 20px',
          flex: 1,
          gap: 0,
        }}
      >
        {/* Badges row */}
        <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {/* Category badge */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: accent,
              background: accent + '18',
              border: `1px solid ${accent}30`,
              borderRadius: 'var(--radius-full)',
              padding: '2px 8px',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
            }}
          >
            {catCfg.label}
          </span>

          {/* Division badges */}
          {!compact &&
            post.divisions.slice(0, 2).map((div) => (
              <span
                key={div}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-3, var(--bg-2))',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px 7px',
                  lineHeight: 1.4,
                  whiteSpace: 'nowrap',
                }}
              >
                {div}
              </span>
            ))}
        </span>

        {/* Title */}
        <span
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical' as const,
            WebkitLineClamp: 2,
            overflow: 'hidden',
            fontFamily: 'var(--font-display)',
            fontSize: compact ? '0.88rem' : '0.95rem',
            fontWeight: 800,
            lineHeight: 1.3,
            letterSpacing: '-0.015em',
            color: 'var(--text-primary)',
            marginBottom: 6,
          }}
        >
          {post.title}
        </span>

        {/* Excerpt */}
        {!compact && (
          <span
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical' as const,
              WebkitLineClamp: 2,
              overflow: 'hidden',
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              marginBottom: 14,
            }}
          >
            {post.excerpt}
          </span>
        )}

        {/* Spacer */}
        <span style={{ flex: 1 }} />

        {/* Author row */}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            marginTop: compact ? 10 : 0,
          }}
        >
          <AuthorAvatar initials={post.author.avatarInitials} color={post.author.accentColor} />
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.73rem',
              color: 'var(--text-secondary)',
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {post.author.name}
          </span>

          {/* HUMAN / AI dot indicator */}
          <span
            title={post.authorType === 'ai_agent' ? 'AI Agent authored' : 'Human authored'}
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: post.authorType === 'ai_agent' ? '#8B5CF6' : '#3A589E',
              flexShrink: 0,
            }}
            aria-label={post.authorType === 'ai_agent' ? 'AI Agent' : 'Human'}
          />

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {compact
              ? post.readingTime
              : `${formatPostDate(post.publishedAt).split(',')[0].split(' ').slice(0, 2).join(' ')} · ${post.readingTime}`}
          </span>
        </span>
      </span>

      {/* Hover styles via injected CSS */}
      <style>{`
        .blog-card-link:hover {
          transform: translateY(-4px);
          border-color: var(--border-hover);
          box-shadow: var(--card-hover-shadow, 0 20px 60px rgba(0,0,0,0.15));
        }
        .blog-card-link:hover .blog-card-bar {
          opacity: 1 !important;
        }
      `}</style>
    </Link>
  );
}
