import Link from 'next/link';
import { BlogPost, CATEGORY_CONFIG, formatPostDate } from '@/lib/blog';

interface BlogFeaturedProps {
  post: BlogPost;
}

export default function BlogFeatured({ post }: BlogFeaturedProps) {
  const catCfg = CATEGORY_CONFIG[post.category];
  const accent = catCfg.color;

  return (
    <Link
      href={post.canonicalUrl}
      style={{
        display: 'grid',
        gridTemplateColumns: '55% 45%',
        minHeight: 400,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s, box-shadow 0.4s',
      }}
      className="blog-featured-link"
    >
      {/* Left: thumbnail image */}
      <span
        aria-hidden="true"
        className="blog-featured-thumb"
        style={{
          display: 'block',
          background: `linear-gradient(135deg, ${accent}33 0%, #3A589E44 50%, ${accent}11 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Featured label bottom-left */}
        <span
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: accent,
            border: `1px solid ${accent}40`,
            background: `${accent}15`,
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 10px',
            zIndex: 1,
          }}
        >
          Featured
        </span>
      </span>

      {/* Right: content */}
      <span
        className="blog-featured-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 40px',
          gap: 0,
        }}
      >
        {/* Badges */}
        <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {/* Category */}
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
              padding: '3px 9px',
              lineHeight: 1.4,
            }}
          >
            {catCfg.label}
          </span>

          {/* Division badges */}
          {post.divisions.slice(0, 2).map((div) => (
            <span
              key={div}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 8px',
                lineHeight: 1.4,
              }}
            >
              {div}
            </span>
          ))}

          {/* HUMAN / AI AGENT badge */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: post.authorType === 'ai_agent' ? '#8B5CF6' : '#3A589E',
              background: post.authorType === 'ai_agent' ? '#8B5CF610' : '#3A589E10',
              border: `1px solid ${post.authorType === 'ai_agent' ? '#8B5CF630' : '#3A589E30'}`,
              borderRadius: 'var(--radius-full)',
              padding: '3px 8px',
              lineHeight: 1.4,
            }}
          >
            {post.authorType === 'ai_agent' ? 'AI Agent' : 'Human'}
          </span>
        </span>

        {/* Title */}
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: 'var(--text-primary)',
            marginBottom: 12,
            display: 'block',
          }}
        >
          {post.title}
        </span>

        {/* Excerpt */}
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          {post.excerpt}
        </span>

        {/* Author row */}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: post.author.accentColor + '22',
              border: `1.5px solid ${post.author.accentColor}44`,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              fontWeight: 700,
              color: post.author.accentColor,
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {post.author.avatarInitials}
          </span>
          <span style={{ flex: 1 }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              {post.author.name}
              {post.editedBy && (
                <span
                  style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.74rem' }}
                >
                  {' '}· edited by {post.editedBy}
                </span>
              )}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                color: 'var(--text-muted)',
              }}
            >
              {formatPostDate(post.publishedAt)} · {post.readingTime}
            </span>
          </span>
        </span>

        {/* Read link */}
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: accent,
            letterSpacing: '-0.01em',
            marginTop: 4,
          }}
        >
          Read article{' '}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 2 }}
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </span>

      <style>{`
        .blog-featured-link:hover {
          transform: translateY(-4px);
          border-color: ${accent}40;
          box-shadow: var(--card-hover-shadow, 0 20px 60px rgba(0,0,0,0.15));
        }
        @media (max-width: 768px) {
          .blog-featured-link { grid-template-columns: 1fr !important; }
          .blog-featured-thumb { min-height: 180px !important; }
          .blog-featured-content { padding: 24px 20px !important; }
        }
      `}</style>
    </Link>
  );
}
