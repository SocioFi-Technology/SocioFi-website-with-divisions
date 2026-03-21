'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getPostsByDivision, BlogCategory } from '@/lib/blog';
import BlogCard from '@/components/blog/BlogCard';
import BlogFeatured from '@/components/blog/BlogFeatured';
import BlogCategoryBar from '@/components/blog/BlogCategoryBar';
import BlogNewsletter from '@/components/blog/BlogNewsletter';

const ACCENT = '#7B6FE8';
const DIVISION = 'labs';

export default function LabsBlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | undefined>(undefined);

  const allDivisionPosts = getPostsByDivision(DIVISION);
  const featuredPost = allDivisionPosts.find((p) => p.featured) ?? allDivisionPosts[0];
  const filteredPosts = (activeCategory
    ? allDivisionPosts.filter((p) => p.category === activeCategory)
    : allDivisionPosts
  ).filter((p) => p.slug !== featuredPost?.slug);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 'calc(var(--space-section, 120px) + 60px)',
          paddingBottom: 80,
          background: 'var(--bg)',
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
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${ACCENT}08 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
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
                color: ACCENT,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span aria-hidden="true" style={{ width: 20, height: 1.5, background: ACCENT, display: 'inline-block' }} />
              The Labs Blog
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                margin: '0 0 14px',
              }}
            >
              Technical writing from the research team.
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                margin: 0,
                maxWidth: '52ch',
              }}
            >
              We write about what we build, what fails, and what we learn. No marketing.
              Just engineering.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────────────────── */}
      {featuredPost && (
        <section style={{ padding: '0 0 60px', background: 'var(--bg)' }}>
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
      )}

      {/* ── All Articles ─────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '60px 0 100px',
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ marginBottom: 40 }}>
            <BlogCategoryBar
              activeCategory={activeCategory}
              onChange={(cat) => setActiveCategory(cat)}
            />
          </div>

          {filteredPosts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 24,
              }}
            >
              {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <BlogCard post={post} accentColor={ACCENT} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', textAlign: 'center', padding: '60px 0' }}>
              No articles in this category for Labs yet.
            </p>
          )}

          <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
            <Link href="/blog" style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              See all articles
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 0 80px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <BlogNewsletter accentColor={ACCENT} title="Get the research, not the noise." subtitle="New articles from the Labs team. We publish when we have something worth saying — usually every 2–3 weeks." />
        </div>
      </section>
    </>
  );
}
