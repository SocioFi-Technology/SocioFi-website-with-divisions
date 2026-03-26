'use client'

import { useEffect, useState } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import type { DashboardStats, CMSPost } from '@/lib/types'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/divisions'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_posts: 0,
    total_courses: 0,
    total_faqs: 0,
    total_testimonials: 0,
    total_portfolio: 0,
    total_media: 0,
    published_posts: 0,
    draft_posts: 0,
  })
  const [recentPosts, setRecentPosts] = useState<CMSPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = getSupabaseClient()
    async function load() {
      if (!client) { setLoading(false); return }
      try {
        const [
          { count: totalPosts },
          { count: totalCourses },
          { count: totalFaqs },
          { count: totalTestimonials },
          { count: totalPortfolio },
          { count: totalMedia },
          { count: publishedPosts },
          { count: draftPosts },
          { data: recent },
        ] = await Promise.all([
          client.from('cms_posts').select('*', { count: 'exact', head: true }),
          client.from('cms_courses').select('*', { count: 'exact', head: true }),
          client.from('cms_faqs').select('*', { count: 'exact', head: true }),
          client.from('cms_testimonials').select('*', { count: 'exact', head: true }),
          client.from('cms_portfolio').select('*', { count: 'exact', head: true }),
          client.from('cms_media').select('*', { count: 'exact', head: true }),
          client.from('cms_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
          client.from('cms_posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
          client.from('cms_posts').select('id,title,slug,status,division,author_name,created_at,updated_at').order('updated_at', { ascending: false }).limit(5),
        ])
        setStats({
          total_posts: totalPosts ?? 0,
          total_courses: totalCourses ?? 0,
          total_faqs: totalFaqs ?? 0,
          total_testimonials: totalTestimonials ?? 0,
          total_portfolio: totalPortfolio ?? 0,
          total_media: totalMedia ?? 0,
          published_posts: publishedPosts ?? 0,
          draft_posts: draftPosts ?? 0,
        })
        setRecentPosts((recent as CMSPost[]) ?? [])
      } catch {
        // dev mode — no Supabase
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = [
    { label: 'Total Posts', value: stats.total_posts, sub: `${stats.published_posts} published · ${stats.draft_posts} draft`, color: '#59A392', href: '/blog' },
    { label: 'Courses', value: stats.total_courses, sub: 'Academy content', color: '#E8B84D', href: '/academy/courses' },
    { label: 'FAQs', value: stats.total_faqs, sub: 'Across all divisions', color: '#7B6FE8', href: '/faqs' },
    { label: 'Testimonials', value: stats.total_testimonials, sub: 'Client reviews', color: '#6BA3E8', href: '/testimonials' },
    { label: 'Portfolio', value: stats.total_portfolio, sub: 'Case studies & projects', color: '#E8916F', href: '/studio/portfolio' },
    { label: 'Media Files', value: stats.total_media, sub: 'Images & assets', color: '#5BB5E0', href: '/media' },
  ]

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <CMSShell>
      <div style={{ padding: '0 0 48px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--teal)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            Overview
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>
            Manage all content across SocioFi divisions
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {statCards.map((card) => (
            <a key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                borderTop: `3px solid ${card.color}`,
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {loading ? (
                  <div style={{ height: 36, background: 'var(--bg-3)', borderRadius: 6, marginBottom: 8 }} />
                ) : (
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: card.color, lineHeight: 1 }}>
                    {card.value.toLocaleString()}
                  </div>
                )}
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 8 }}>
                  {card.label}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {card.sub}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Recent Posts */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Recent Posts
            </h2>
            <a href="/blog" style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--teal)', textDecoration: 'none' }}>
              View all
            </a>
          </div>
          {loading ? (
            <div style={{ padding: 24 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: 48, background: 'var(--bg-3)', borderRadius: 6, marginBottom: 12 }} />
              ))}
            </div>
          ) : recentPosts.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>
              No posts yet. <a href="/blog/new" style={{ color: 'var(--teal)' }}>Create your first post</a>
            </div>
          ) : (
            <div>
              {recentPosts.map((post, i) => (
                <a key={post.id} href={`/blog/${post.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{
                    padding: '14px 24px',
                    borderBottom: i < recentPosts.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {post.title}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {post.author_name ?? 'SocioFi Team'} · {timeAgo(post.updated_at ?? post.created_at)}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      padding: '3px 10px',
                      borderRadius: 100,
                      background: `${STATUS_COLORS[post.status]}20`,
                      color: STATUS_COLORS[post.status],
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                    }}>
                      {STATUS_LABELS[post.status]}
                    </span>
                    {post.division && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                        {post.division}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </CMSShell>
  )
}
