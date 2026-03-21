import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  BlogCategory,
  CATEGORY_CONFIG,
  getPostsByCategory,
} from '@/lib/blog';
import BlogCard from '@/components/blog/BlogCard';

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return (Object.keys(CATEGORY_CONFIG) as BlogCategory[]).map((category) => ({ category }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cfg = CATEGORY_CONFIG[category as BlogCategory];
  if (!cfg) return { title: 'Not Found — SocioFi Technology' };

  return {
    title: `${cfg.label} — Blog — SocioFi Technology`,
    description: cfg.description,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cfg = CATEGORY_CONFIG[category as BlogCategory];
  if (!cfg) notFound();

  const posts = getPostsByCategory(category as BlogCategory);
  const otherCategories = (Object.keys(CATEGORY_CONFIG) as BlogCategory[]).filter(
    (c) => c !== category
  );

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
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
            background: `radial-gradient(circle, ${cfg.color}10 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 500,
              color: cfg.color,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 20,
                height: 1.5,
                background: cfg.color,
                display: 'inline-block',
              }}
            />
            Category
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: '0 0 12px',
            }}
          >
            {cfg.label}
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              margin: '0 0 20px',
              maxWidth: '48ch',
            }}
          >
            {cfg.description}
          </p>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}
          >
            {posts.length} {posts.length === 1 ? 'article' : 'articles'}
          </span>
        </div>
      </section>

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
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
                @media (max-width: 900px) { .cat-grid { grid-template-columns: 1fr 1fr !important; } }
                @media (max-width: 600px) { .cat-grid { grid-template-columns: 1fr !important; } }
              `}</style>
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} accentColor={cfg.color} />
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
              No articles in this category yet.
            </p>
          )}
        </div>
      </section>

      {/* ── Other Categories ──────────────────────────────────────────────── */}
      <section
        style={{
          padding: '48px 0 60px',
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 14,
            }}
          >
            Other categories
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {otherCategories.map((cat) => {
              const c = CATEGORY_CONFIG[cat];
              return (
                <Link
                  key={cat}
                  href={`/blog/category/${cat}`}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    padding: '7px 16px',
                    borderRadius: 'var(--radius-full)',
                    border: `1.5px solid ${c.color}30`,
                    background: c.color + '10',
                    color: c.color,
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                    display: 'inline-block',
                  }}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
          <div style={{ marginTop: 24 }}>
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
