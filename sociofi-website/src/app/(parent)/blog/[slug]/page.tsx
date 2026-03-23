import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  CATEGORY_CONFIG,
  formatPostDate,
} from '@/lib/blog';
import BlogProgress from '@/components/blog/BlogProgress';
import { ScribeIcon } from '@/components/blog/ScribeIcon';
import BlogAuthorCard from '@/components/blog/BlogAuthorCard';
import BlogShare from '@/components/blog/BlogShare';
import BlogRelated from '@/components/blog/BlogRelated';
import BlogNewsletter from '@/components/blog/BlogNewsletter';

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Not Found — SocioFi Technology' };

  return {
    title: `${post.title} — SocioFi Technology`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — SocioFi Technology`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      url: `https://sociofitechnology.com${post.canonicalUrl}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — SocioFi Technology`,
      description: post.excerpt,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const catCfg = CATEGORY_CONFIG[post.category];
  const accent = catCfg.color;
  const related = getRelatedPosts(post, 3);
  const canonicalUrl = `https://sociofitechnology.com${post.canonicalUrl}`;

  return (
    <>
      <BlogProgress />

      {/* ── Article Header ──────────────────────────────────────────────── */}
      <header
        style={{
          paddingTop: 'calc(var(--space-section, 120px) + 60px)',
          paddingBottom: 60,
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* BG gradient */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 600,
            height: 400,
            background: `radial-gradient(ellipse at top right, ${accent}08 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            padding: '0 32px',
            position: 'relative',
          }}
        >
          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
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
                padding: '3px 10px',
              }}
            >
              {catCfg.label}
            </span>

            {post.divisions.map((div) => (
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
                }}
              >
                {div}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: '0 0 16px',
            }}
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              margin: '0 0 28px',
            }}
          >
            {post.excerpt}
          </p>

          {/* Author row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: post.author.accentColor + '22',
                border: `1.5px solid ${post.author.accentColor}44`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: post.author.accentColor,
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {post.authorType === 'ai_agent' ? <ScribeIcon size={18} /> : post.author.avatarInitials}
            </span>
            <span>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {post.author.name}
                {post.editedBy && (
                  <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {' '}· edited by {post.editedBy}
                  </span>
                )}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                }}
              >
                {formatPostDate(post.publishedAt)} · {post.readingTime}
              </span>
            </span>

            <span style={{ flex: 1 }} />
            <BlogShare title={post.title} url={canonicalUrl} />
          </div>

          {/* SCRIBE disclaimer */}
          {post.authorType === 'ai_agent' && (
            <div
              style={{
                marginTop: 20,
                padding: '12px 16px',
                background: '#8B5CF608',
                border: '1px solid #8B5CF620',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              <strong style={{ color: '#8B5CF6' }}>AI-Authored:</strong> This article was drafted
              by SCRIBE, SocioFi&apos;s AI content agent
              {post.editedBy && `, and reviewed and edited by ${post.editedBy}`}.
            </div>
          )}
        </div>
      </header>

      {/* ── Article Body ─────────────────────────────────────────────────── */}
      <article style={{ background: 'var(--bg)', padding: '64px 0 80px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px' }}>
          <div
            className="blog-post-body"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          <style>{`
            .blog-post-body {
              font-family: var(--font-body);
              font-size: 1.05rem;
              line-height: 1.75;
              color: var(--text-secondary);
            }
            .blog-post-body p {
              margin: 0 0 1.5em;
            }
            .blog-post-body h2 {
              font-family: var(--font-display);
              font-size: clamp(1.3rem, 2.5vw, 1.7rem);
              font-weight: 700;
              letter-spacing: -0.02em;
              line-height: 1.2;
              color: var(--text-primary);
              margin: 2em 0 0.75em;
            }
            .blog-post-body h3 {
              font-family: var(--font-display);
              font-size: 1.15rem;
              font-weight: 600;
              letter-spacing: -0.015em;
              color: var(--text-primary);
              margin: 1.75em 0 0.6em;
            }
            .blog-post-body ul, .blog-post-body ol {
              margin: 0 0 1.5em 0;
              padding-left: 1.6em;
            }
            .blog-post-body li {
              margin-bottom: 0.5em;
            }
            .blog-post-body strong {
              color: var(--text-primary);
              font-weight: 600;
            }
            .blog-post-body code {
              font-family: var(--font-mono);
              font-size: 0.88em;
              background: var(--code-bg);
              border: 1px solid var(--code-border);
              border-radius: 6px;
              padding: 2px 6px;
              color: var(--text-primary);
            }
            .blog-post-body pre {
              background: var(--code-bg);
              border: 1px solid var(--code-border);
              border-radius: var(--radius-md);
              padding: 20px 24px;
              overflow-x: auto;
              margin: 0 0 1.5em;
            }
            .blog-post-body pre code {
              background: none;
              border: none;
              padding: 0;
              font-size: 0.84rem;
              line-height: 1.8;
            }
            .blog-post-body blockquote {
              border-left: 3px solid var(--teal);
              margin: 2em 0;
              padding: 0 0 0 1.5em;
              color: var(--text-secondary);
              font-style: italic;
            }
          `}</style>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 10px',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author card */}
          <div style={{ marginTop: 48 }}>
            <BlogAuthorCard
              author={post.author}
              postCount={undefined}
            />
          </div>

          {/* Share */}
          <div
            style={{
              marginTop: 32,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '20px 0',
              borderTop: '1px solid var(--border)',
            }}
          >
            <BlogShare title={post.title} url={canonicalUrl} />
          </div>

          {/* Related articles */}
          {related.length > 0 && <BlogRelated posts={related} currentSlug={post.slug} />}

          {/* Newsletter */}
          <div style={{ marginTop: 80 }}>
            <BlogNewsletter />
          </div>
        </div>
      </article>
    </>
  );
}
