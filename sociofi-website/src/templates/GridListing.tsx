'use client';

import { useState } from 'react';
import Hero, { type HeroButton } from '@/components/sections/Hero';
import Container from '@/components/shared/Container';
import Button from '@/components/shared/Button';
import ScrollReveal, { StaggerChildren, StaggerItem } from '@/components/shared/ScrollReveal';
import PortfolioCard from '@/components/cards/PortfolioCard';
import CourseCard from '@/components/cards/CourseCard';
import Card from '@/components/cards/Card';

// ── Content Interfaces ────────────────────────────────────────────────────────

export type GridItemType = 'portfolio' | 'course' | 'blog' | 'open-source';

export interface PortfolioItem {
  type: 'portfolio';
  title: string;
  description: string;
  tags: string[];
  slug: string;
  client?: string;
  accentColor?: string;
  category?: string;
}

export interface CourseItem {
  type: 'course';
  title: string;
  description: string;
  duration: string;
  level: string;
  price?: string;
  category?: string;
}

export interface BlogItem {
  type: 'blog';
  title: string;
  description: string;
  date: string;
  category?: string;
  href: string;
  readTime?: string;
}

export interface OpenSourceItem {
  type: 'open-source';
  title: string;
  description: string;
  stars?: string;
  language?: string;
  category?: string;
  href?: string;
}

export type GridItem = PortfolioItem | CourseItem | BlogItem | OpenSourceItem;

export interface GridListingContent {
  hero: {
    badge?: string;
    headline: string;
    description?: string;
    buttons?: HeroButton[];
  };
  categories?: string[];
  items: GridItem[];
  emptyMessage?: string;
  /** Show Load More button instead of showing all at once */
  pageSize?: number;
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function GridListing({ content }: { content: GridListingContent }) {
  const { hero, categories = [], items, emptyMessage = 'Nothing here yet.', pageSize } = content;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(pageSize ?? items.length);

  const allCategories = ['All', ...categories];

  const filtered = activeCategory === 'All'
    ? items
    : items.filter((item) => item.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Hero
        badge={hero.badge}
        headline={hero.headline}
        description={hero.description}
        buttons={hero.buttons}
        layout="minimal"
        showGrid
        showOrbs={false}
        minHeight="40vh"
      />

      {/* ── Filter bar + Grid ────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--space-section)', background: 'var(--bg)' }}>
        <Container>

          {/* Filter bar */}
          {allCategories.length > 1 && (
            <ScrollReveal>
              <div
                role="tablist"
                aria-label="Filter by category"
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  marginBottom: 48,
                }}
              >
                {allCategories.map((cat) => {
                  const isActive = cat === activeCategory;
                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        setActiveCategory(cat);
                        setVisibleCount(pageSize ?? items.length);
                      }}
                      style={{
                        padding: '8px 18px',
                        borderRadius: 'var(--radius-full)',
                        border: `1.5px solid ${isActive ? 'var(--division-accent)' : 'var(--border)'}`,
                        background: isActive
                          ? 'color-mix(in srgb, var(--division-accent) 10%, transparent)'
                          : 'transparent',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.84rem',
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

          {/* Grid */}
          {visible.length === 0 ? (
            <ScrollReveal>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                padding: '64px 0',
              }}>
                {emptyMessage}
              </p>
            </ScrollReveal>
          ) : (
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((item, i) => (
                <StaggerItem key={i}>
                  <GridItemCard item={item} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}

          {/* Load more */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Button
                variant="ghost"
                onClick={() => setVisibleCount((n) => n + (pageSize ?? 9))}
              >
                Load more
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

// ── Item card dispatcher ──────────────────────────────────────────────────────

function GridItemCard({ item }: { item: GridItem }) {
  if (item.type === 'portfolio') {
    return (
      <PortfolioCard
        title={item.title}
        description={item.description}
        tags={item.tags}
        slug={item.slug}
        client={item.client}
        accentColor={item.accentColor}
      />
    );
  }

  if (item.type === 'course') {
    return (
      <CourseCard
        title={item.title}
        description={item.description}
        duration={item.duration}
        level={item.level}
        price={item.price}
      />
    );
  }

  if (item.type === 'blog') {
    return (
      <a href={item.href} style={{ display: 'block', textDecoration: 'none' }}>
        <div className="card" style={{ padding: 28 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--division-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 10,
          }}>
            {item.category ?? 'Article'}
            {item.readTime && <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>· {item.readTime}</span>}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            marginBottom: 10,
            lineHeight: 1.35,
          }}>
            {item.title}
          </h3>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            marginBottom: 16,
          }}>
            {item.description}
          </p>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
          }}>
            {item.date}
          </span>
        </div>
      </a>
    );
  }

  // open-source
  return (
    <Card
      title={item.title}
      description={item.description}
      link={item.href}
      linkText={item.stars ? `${item.stars} stars` : 'View on GitHub'}
    />
  );
}
