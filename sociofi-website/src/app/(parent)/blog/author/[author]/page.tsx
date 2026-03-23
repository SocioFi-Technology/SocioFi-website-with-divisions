import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getAllAuthors,
  getAuthorBySlug,
  getPostsByAuthor,
} from '@/lib/blog';
import BlogCard from '@/components/blog/BlogCard';
import { ScribeIcon } from '@/components/blog/ScribeIcon';

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllAuthors().map((a) => ({ author: a.slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ author: string }>;
}): Promise<Metadata> {
  const { author: slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return { title: 'Not Found — SocioFi Technology' };

  return {
    title: `${author.name} — Blog — SocioFi Technology`,
    description: author.bio,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ author: string }>;
}) {
  const { author: slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const posts = getPostsByAuthor(slug);
  const isAI = author.type === 'ai_agent';
  const badgeColor = isAI ? '#8B5CF6' : '#3A589E';
  const badgeLabel = isAI ? 'AI Agent' : 'Human';

  return (
    <>
      {/* ── Hero with large author card ──────────────────────────────────── */}
      <section
        style={{
          paddingTop: 'calc(var(--space-section, 120px) + 60px)',
          paddingBottom: 64,
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${author.accentColor}08 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 32px',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span aria-hidden="true" style={{ width: 20, height: 1.5, background: 'var(--text-muted)', display: 'inline-block' }} />
            Author
          </div>

          {/* Large author hero */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar 96px */}
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: author.accentColor + '22',
                border: `3px solid ${author.accentColor}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: author.accentColor,
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {isAI ? <ScribeIcon size={48} /> : author.avatarInitials}
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  {author.name}
                </h1>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: badgeColor,
                    background: badgeColor + '15',
                    border: `1px solid ${badgeColor}30`,
                    borderRadius: 'var(--radius-full)',
                    padding: '3px 9px',
                  }}
                >
                  {badgeLabel}
                </span>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  margin: '0 0 12px',
                }}
              >
                {author.role}
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  margin: '0 0 8px',
                  maxWidth: '56ch',
                }}
              >
                {author.bio}
              </p>

              {/* SCRIBE disclaimer */}
              {isAI && (
                <div
                  style={{
                    marginTop: 12,
                    padding: '10px 14px',
                    background: '#8B5CF608',
                    border: '1px solid #8B5CF620',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    maxWidth: '52ch',
                  }}
                >
                  <strong style={{ color: '#8B5CF6' }}>AI Agent:</strong> SCRIBE&apos;s articles are
                  reviewed and approved by a human engineer or founder before publication.
                </div>
              )}

              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  marginTop: 14,
                }}
              >
                {posts.length} {posts.length === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Article Grid ──────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0 100px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          {posts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 24,
              }}
            >
              <style>{`
                @media (max-width: 900px) { .author-grid { grid-template-columns: 1fr 1fr !important; } }
                @media (max-width: 600px) { .author-grid { grid-template-columns: 1fr !important; } }
              `}</style>
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text-muted)',
                textAlign: 'center',
                padding: '60px 0',
              }}
            >
              No articles from this author yet.
            </p>
          )}

          <div style={{ marginTop: 48 }}>
            <Link
              href="/blog"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.84rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              See all articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
