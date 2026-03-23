import Link from 'next/link';
import { BlogAuthor } from '@/lib/blog';
import { ScribeIcon } from '@/components/blog/ScribeIcon';

interface BlogAuthorCardProps {
  author: BlogAuthor;
  compact?: boolean;
  postCount?: number;
}

export default function BlogAuthorCard({ author, compact = false, postCount }: BlogAuthorCardProps) {
  const isAI = author.type === 'ai_agent';
  const badgeColor = isAI ? '#8B5CF6' : '#3A589E';
  const badgeLabel = isAI ? 'AI Agent' : 'Human';

  return (
    <div
      style={{
        display: 'flex',
        gap: compact ? 12 : 20,
        alignItems: compact ? 'center' : 'flex-start',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: compact ? '14px 18px' : '28px 32px',
        flexWrap: compact ? 'nowrap' : 'wrap',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: compact ? 40 : 64,
          height: compact ? 40 : 64,
          borderRadius: '50%',
          background: author.accentColor + '22',
          border: `2px solid ${author.accentColor}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: compact ? '0.78rem' : '1.1rem',
          fontWeight: 700,
          color: author.accentColor,
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {isAI ? <ScribeIcon size={compact ? 20 : 33} /> : author.avatarInitials}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: compact ? '0.9rem' : '1rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            {author.name}
          </span>

          {/* HUMAN / AI AGENT badge */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: badgeColor,
              background: badgeColor + '15',
              border: `1px solid ${badgeColor}30`,
              borderRadius: 'var(--radius-full)',
              padding: '2px 7px',
            }}
          >
            {badgeLabel}
          </span>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginBottom: compact ? 0 : 10,
          }}
        >
          {author.role}
          {postCount !== undefined && (
            <span style={{ marginLeft: 8, color: 'var(--text-muted)' }}>
              · {postCount} {postCount === 1 ? 'article' : 'articles'}
            </span>
          )}
        </div>

        {/* Bio */}
        {!compact && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.84rem',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              margin: '0 0 14px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}
          >
            {author.bio}
          </p>
        )}

        {/* More articles link */}
        {!compact && (
          <Link
            href={`/blog/author/${author.slug}`}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: author.accentColor,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            More articles
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
