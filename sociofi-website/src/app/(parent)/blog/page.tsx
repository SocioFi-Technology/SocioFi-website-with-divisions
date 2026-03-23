'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  getAllPosts,
  getFeaturedPost,
  getAllAuthors,
  BlogCategory,
  CATEGORY_CONFIG,
} from '@/lib/blog';
import BlogFeatured from '@/components/blog/BlogFeatured';
import { ScribeIcon } from '@/components/blog/ScribeIcon';
import BlogCard from '@/components/blog/BlogCard';
import BlogCategoryBar from '@/components/blog/BlogCategoryBar';
import BlogNewsletter from '@/components/blog/BlogNewsletter';

const DIVISIONS = [
  { slug: 'studio', label: 'Studio', accent: '#72C4B2', href: '/studio/blog' },
  { slug: 'services', label: 'Services', accent: '#4DBFA8', href: '/services/blog' },
  { slug: 'labs', label: 'Labs', accent: '#7B6FE8', href: '/labs/blog' },
  { slug: 'products', label: 'Products', accent: '#E8916F', href: '/products' },
  { slug: 'academy', label: 'Academy', accent: '#E8B84D', href: '/academy/blog' },
  { slug: 'ventures', label: 'Ventures', accent: '#6BA3E8', href: '/ventures/blog' },
  { slug: 'cloud', label: 'Cloud', accent: '#5BB5E0', href: '/cloud/blog' },
  { slug: 'agents', label: 'Agents', accent: '#8B5CF6', href: '/agents/blog' },
];

const PAGE_SIZE = 9;

export default function BlogHubPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | undefined>(undefined);
  const [activeDivision, setActiveDivision] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const featuredPost = getFeaturedPost();
  const allAuthors = getAllAuthors();

  const filteredPosts = useMemo(() => {
    return getAllPosts({
      category: activeCategory,
      division: activeDivision,
    }).filter((p) => p.slug !== featuredPost.slug);
  }, [activeCategory, activeDivision, featuredPost.slug]);

  const mostRead = useMemo(() => getAllPosts().slice(0, 5), []);
  const displayedPosts = filteredPosts.slice(0, page * PAGE_SIZE);
  const hasMore = filteredPosts.length > page * PAGE_SIZE;

  function handleCategoryChange(cat?: BlogCategory) {
    setActiveCategory(cat);
    setPage(1);
  }

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 'calc(var(--space-section, 120px) + 60px)',
          paddingBottom: 80,
          background: 'var(--bg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background orb */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(89,163,146,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'var(--teal)',
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
                style={{ width: 20, height: 1.5, background: 'var(--teal)', display: 'inline-block' }}
              />
              Ideas, Research &amp; Hard-Won Lessons
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                color: 'var(--text-primary)',
                margin: '0 0 16px',
                maxWidth: '14ch',
              }}
            >
              Writing from SocioFi Technology.
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                margin: 0,
                maxWidth: '52ch',
              }}
            >
              Honest thinking on AI-native development, production engineering, and what it
              actually takes to turn an AI prototype into a real product.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Article ─────────────────────────────────────────────────── */}
      <section style={{ padding: '0 0 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <BlogFeatured post={featuredPost} />
          </motion.div>
        </div>
      </section>

      {/* ── Most Read ────────────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 0', background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="most-read-outer" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div className="most-read-header" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span aria-hidden="true" style={{ width: 20, height: 1.5, background: 'var(--teal)', display: 'inline-block' }} />
            <h2
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'var(--teal)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                margin: 0,
              }}
            >
              Most Read
            </h2>
          </div>

          <style>{`
            .most-read-grid {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 16px;
            }
            @media (max-width: 1100px) { .most-read-grid { grid-template-columns: repeat(3,1fr); } }
            @media (max-width: 700px) {
              .most-read-outer { padding-left: 0 !important; padding-right: 0 !important; }
              .most-read-header { padding: 0 20px; }
              .most-read-grid {
                display: flex;
                overflow-x: auto;
                gap: 12px;
                padding: 0 20px 8px;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
              }
              .most-read-grid::-webkit-scrollbar { display: none; }
              .most-read-grid > * { flex: 0 0 220px; min-width: 220px; }
            }
          `}</style>
          <div className="most-read-grid">
            {mostRead.map((post) => (
              <BlogCard key={post.slug} post={post} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ── Article Grid with filters ─────────────────────────────────────────── */}
      <section style={{ padding: '80px 0 100px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          {/* Filters */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span aria-hidden="true" style={{ width: 20, height: 1.5, background: 'var(--teal)', display: 'inline-block' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: 'var(--teal)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  margin: 0,
                }}
              >
                All Articles
              </h2>
            </div>
            <BlogCategoryBar activeCategory={activeCategory} onChange={handleCategoryChange} />
          </div>

          {/* Grid */}
          {displayedPosts.length > 0 ? (
            <>
              <style>{`
                .blog-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin-bottom: 48px; }
                @media (max-width: 900px) { .blog-grid-3 { grid-template-columns: 1fr 1fr; } }
                @media (max-width: 600px) { .blog-grid-3 { grid-template-columns: 1fr; } }
              `}</style>
              <div className="blog-grid-3">
                {displayedPosts.map((post, i) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: (i % PAGE_SIZE) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      padding: '13px 32px',
                      borderRadius: 'var(--radius-full)',
                      border: '1.5px solid var(--border)',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      letterSpacing: '-0.01em',
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--teal)';
                      e.currentTarget.style.color = 'var(--teal)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                  >
                    Load more articles
                  </button>
                </div>
              )}
            </>
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

      {/* ── Authors ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '60px 0',
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span aria-hidden="true" style={{ width: 20, height: 1.5, background: 'var(--teal)', display: 'inline-block' }} />
            <h2
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'var(--teal)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                margin: 0,
              }}
            >
              Who Writes Here
            </h2>
          </div>

          <div className="authors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <style>{`
              @media (max-width: 900px) { .authors-grid { grid-template-columns: 1fr 1fr !important; } }
              @media (max-width: 500px) { .authors-grid { grid-template-columns: 1fr !important; } }
            `}</style>
            {allAuthors.map((author) => {
              const postCount = getAllPosts({ author: author.slug }).length;
              return (
                <Link
                  key={author.slug}
                  href={`/blog/author/${author.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 18px',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = author.accentColor + '40';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: author.accentColor + '22',
                      border: `1.5px solid ${author.accentColor}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: author.accentColor,
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {author.type === 'ai_agent' ? <ScribeIcon size={18} /> : author.avatarInitials}
                  </span>
                  <span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {author.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.62rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {postCount} {postCount === 1 ? 'article' : 'articles'}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Division Links ────────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span aria-hidden="true" style={{ width: 20, height: 1.5, background: 'var(--teal)', display: 'inline-block' }} />
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'var(--teal)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                margin: 0,
              }}
            >
              Browse by Division
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {DIVISIONS.map((div) => (
              <Link
                key={div.slug}
                href={div.href}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${div.accent}30`,
                  background: div.accent + '10',
                  color: div.accent,
                  textDecoration: 'none',
                  transition: 'background 0.2s, border-color 0.2s',
                  display: 'inline-block',
                }}
              >
                {div.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '80px 0',
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <BlogNewsletter />
        </div>
      </section>
    </>
  );
}
