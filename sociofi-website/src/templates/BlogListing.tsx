'use client';

import { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/shared/Container';
import SectionHeader from '@/components/shared/SectionHeader';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import Button from '@/components/shared/Button';

// ── Content Interfaces ────────────────────────────────────────────────────────

export interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  href: string;
  /** Featured image placeholder color */
  accentColor?: string;
  author?: string;
}

export interface BlogListingContent {
  label?: string;
  title?: string;
  featured?: BlogPost;
  posts: BlogPost[];
  categories?: string[];
  newsletter?: {
    headline: string;
    description: string;
  };
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function BlogListing({ content }: { content: BlogListingContent }) {
  const {
    label = 'From the team',
    title = 'Writing',
    featured,
    posts,
    categories = [],
    newsletter,
  } = content;

  const [activeCategory, setActiveCategory] = useState('All');

  const allCategories = ['All', ...categories];
  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* ── Section header ───────────────────────────────────────────────── */}
      <section style={{
        paddingTop: 'calc(var(--space-section) + 60px)',
        paddingBottom: 'var(--space-2xl)',
        background: 'var(--bg)',
      }}>
        <Container>
          <ScrollReveal>
            <SectionHeader
              label={label}
              title={title}
              as="h1"
            />
          </ScrollReveal>
        </Container>
      </section>

      {/* ── Featured post ────────────────────────────────────────────────── */}
      {featured && (
        <section style={{ paddingBottom: 'var(--space-section)', background: 'var(--bg)' }}>
          <Container>
            <ScrollReveal>
              <Link
                href={featured.href}
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 0,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s, transform 0.3s var(--ease)',
                }}
                  className="card"
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--division-accent)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  }}
                >
                  {/* Image placeholder */}
                  <div style={{
                    height: 240,
                    background: `linear-gradient(135deg, ${featured.accentColor ?? 'var(--navy)'} 0%, var(--navy-deep) 100%)`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                      opacity: 0.4,
                    }} aria-hidden="true" />
                    <span className="badge badge-accent" style={{
                      position: 'absolute',
                      top: 20,
                      left: 20,
                    }}>
                      Featured
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '32px 36px' }}>
                    <div style={{
                      display: 'flex',
                      gap: 12,
                      marginBottom: 14,
                      alignItems: 'center',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--division-accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}>
                        {featured.category}
                      </span>
                      <span style={{ color: 'var(--border)', fontSize: '0.8rem' }}>·</span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                      }}>
                        {featured.readTime}
                      </span>
                    </div>
                    <h2 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.025em',
                      lineHeight: 1.2,
                      color: 'var(--text-primary)',
                      marginBottom: 14,
                    }}>
                      {featured.title}
                    </h2>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      lineHeight: 1.7,
                      color: 'var(--text-secondary)',
                      marginBottom: 20,
                      maxWidth: '72ch',
                    }}>
                      {featured.excerpt}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                    }}>
                      {featured.author && (
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.84rem',
                          color: 'var(--text-muted)',
                        }}>
                          {featured.author}
                        </span>
                      )}
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                      }}>
                        {featured.date}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* ── Filter + Grid ────────────────────────────────────────────────── */}
      <section style={{ paddingBottom: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>
          {/* Filter bar */}
          {allCategories.length > 1 && (
            <ScrollReveal>
              <div
                role="tablist"
                aria-label="Filter posts by category"
                style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}
              >
                {allCategories.map((cat) => {
                  const isActive = cat === activeCategory;
                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        padding: '7px 16px',
                        borderRadius: 'var(--radius-full)',
                        border: `1.5px solid ${isActive ? 'var(--division-accent)' : 'var(--border)'}`,
                        background: isActive
                          ? 'color-mix(in srgb, var(--division-accent) 10%, transparent)'
                          : 'transparent',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        color: isActive ? 'var(--division-accent)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s var(--ease)',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>
          )}

          {/* Posts grid */}
          {filtered.length === 0 ? (
            <ScrollReveal>
              <p style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text-muted)',
                textAlign: 'center',
                padding: '48px 0',
              }}>
                No posts in this category yet.
              </p>
            </ScrollReveal>
          ) : (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <StaggerItem key={i}>
                  <PostCard post={post} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}
        </Container>
      </section>

      {/* ── Newsletter CTA ───────────────────────────────────────────────── */}
      {newsletter && (
        <section style={{
          paddingBlock: 'var(--space-2xl)',
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
        }}>
          <Container narrow>
            <ScrollReveal>
              <div style={{
                textAlign: 'center',
                maxWidth: 520,
                marginInline: 'auto',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: 12,
                }}>
                  {newsletter.headline}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                  marginBottom: 24,
                }}>
                  {newsletter.description}
                </p>
                <Button href="/contact" variant="primary">
                  Subscribe for free
                </Button>
              </div>
            </ScrollReveal>
          </Container>
        </section>
      )}
    </>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={post.href} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
      <article
        className="card"
        style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Category + read time */}
        <div style={{
          display: 'flex',
          gap: 10,
          marginBottom: 14,
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--division-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            {post.category}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>·</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
          }}>
            {post.readTime}
          </span>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.05rem',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
          color: 'var(--text-primary)',
          marginBottom: 10,
          flex: 1,
        }}>
          {post.title}
        </h3>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.88rem',
          lineHeight: 1.65,
          color: 'var(--text-secondary)',
          marginBottom: 20,
        }}
          className="truncate-3"
        >
          {post.excerpt}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
        }}>
          {post.author && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}>
              {post.author}
            </span>
          )}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            marginLeft: 'auto',
          }}>
            {post.date}
          </span>
        </div>
      </article>
    </Link>
  );
}
