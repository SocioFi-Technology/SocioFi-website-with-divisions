'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Container from '@/components/shared/Container';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import Button from '@/components/shared/Button';
import AnimatedGrid from '@/components/visual/AnimatedGrid';

// ── Content Interfaces ────────────────────────────────────────────────────────

export interface BlogAuthor {
  name: string;
  role?: string;
}

export interface RelatedPost {
  title: string;
  category: string;
  date: string;
  readTime: string;
  href: string;
}

export interface BlogPostContent {
  title: string;
  date: string;
  author: BlogAuthor;
  category: string;
  readTime: string;
  /** Lead paragraph — shown larger before the article body */
  lead?: string;
  /** MDX/rich text body — passed as children to this template */
  children?: ReactNode;
  related?: RelatedPost[];
  newsletter?: {
    headline: string;
    description: string;
  };
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function BlogPost({ content }: { content: BlogPostContent }) {
  const {
    title, date, author, category, readTime, lead, children, related, newsletter,
  } = content;

  return (
    <>
      {/* ── Article header ───────────────────────────────────────────────── */}
      <header style={{
        position: 'relative',
        paddingTop: 'calc(var(--space-section) + 60px)',
        paddingBottom: 'var(--space-3xl)',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}>
        <AnimatedGrid />

        <Container narrow>
          <ScrollReveal>
            {/* Category + read time */}
            <div style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Link
                href="/labs/blog"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: 'var(--division-accent)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.7'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                {category}
              </Link>
              <span style={{ color: 'var(--border-hover)', fontSize: '0.8rem' }}>·</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
              }}>
                {readTime}
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: 24,
            }}>
              {title}
            </h1>

            {/* Author + date */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              paddingTop: 20,
              borderTop: '1px solid var(--border)',
            }}>
              <AuthorAvatar name={author.name} />
              <div>
                <div style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                }}>
                  {author.name}
                </div>
                {author.role && (
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    marginTop: 1,
                  }}>
                    {author.role}
                  </div>
                )}
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                marginLeft: 'auto',
              }}>
                {date}
              </span>
            </div>
          </ScrollReveal>
        </Container>
      </header>

      {/* ── Article body ─────────────────────────────────────────────────── */}
      <article style={{ paddingBlock: 'var(--space-3xl)', background: 'var(--bg)' }}>
        <Container narrow>
          <ScrollReveal>
            {lead && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.2rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                fontWeight: 400,
                marginBottom: 40,
                paddingBottom: 32,
                borderBottom: '1px solid var(--border)',
              }}>
                {lead}
              </p>
            )}

            <div className="prose">
              {children}
            </div>
          </ScrollReveal>
        </Container>
      </article>

      {/* ── Newsletter CTA ───────────────────────────────────────────────── */}
      {newsletter && (
        <section style={{
          paddingBlock: 'var(--space-2xl)',
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}>
          <Container narrow>
            <ScrollReveal>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 12,
              }}
                className="md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.1rem',
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    marginBottom: 6,
                  }}>
                    {newsletter.headline}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}>
                    {newsletter.description}
                  </p>
                </div>
                <Button href="/contact" variant="primary" size="sm">
                  Subscribe
                </Button>
              </div>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* ── Related posts ────────────────────────────────────────────────── */}
      {related && related.length > 0 && (
        <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
          <Container narrow>
            <ScrollReveal>
              <h2 style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                marginBottom: 24,
              }}>
                Keep reading
              </h2>
            </ScrollReveal>

            <StaggerChildren className="flex flex-col">
              {related.map((post, i) => (
                <StaggerItem key={i}>
                  <Link
                    href={post.href}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 16,
                      padding: '18px 0',
                      borderBottom: '1px solid var(--border)',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.75'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  >
                    <div>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: 'var(--division-accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        display: 'block',
                        marginBottom: 4,
                      }}>
                        {post.category}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                      }}>
                        {post.title}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                    }}>
                      {post.readTime}
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </Container>
        </section>
      )}
    </>
  );
}

function AuthorAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div style={{
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'color-mix(in srgb, var(--division-accent) 15%, transparent)',
      border: '1.5px solid color-mix(in srgb, var(--division-accent) 25%, transparent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-headline)',
      fontSize: '0.78rem',
      fontWeight: 400,
      color: 'var(--division-accent)',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}
