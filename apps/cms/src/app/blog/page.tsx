'use client'

import { useEffect, useState, useCallback } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import { STATUS_COLORS, STATUS_LABELS, DIVISIONS } from '@/lib/divisions'
import type { CMSPost, ContentStatus, Division } from '@/lib/types'
import { triggerRevalidation } from '@/lib/revalidate'

export default function BlogPage() {
  const [posts, setPosts] = useState<CMSPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<ContentStatus | ''>('')
  const [filterDivision, setFilterDivision] = useState<Division | ''>('')
  const [showNewModal, setShowNewModal] = useState(false)

  const fetchPosts = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setLoading(false); return }
    setLoading(true)
    try {
      let q = client.from('cms_posts').select('*').order('updated_at', { ascending: false })
      if (filterStatus) q = q.eq('status', filterStatus)
      if (filterDivision) q = q.eq('division', filterDivision)
      const { data } = await q
      let results = (data as CMSPost[]) ?? []
      if (search) {
        const s = search.toLowerCase()
        results = results.filter(p => p.title.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s))
      }
      setPosts(results)
    } catch { setPosts([]) }
    finally { setLoading(false) }
  }, [filterStatus, filterDivision, search])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_posts').delete().eq('id', id)
    fetchPosts()
  }

  async function updateStatus(id: string, status: ContentStatus) {
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_posts').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    if (status === 'published') {
      const post = posts.find(p => p.id === id)
      await triggerRevalidation({ type: 'blog_post', division: post?.division ?? undefined })
    }
    fetchPosts()
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--teal)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Content</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Blog Posts</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>
              {posts.length} post{posts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <a href="/blog/new">
            <button style={{
              background: 'var(--gradient-brand)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '10px 22px',
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Post
            </button>
          </a>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: 200,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '9px 14px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as ContentStatus | '')}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '9px 14px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={filterDivision}
            onChange={e => setFilterDivision(e.target.value as Division | '')}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '9px 14px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All Divisions</option>
            {DIVISIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 32 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ height: 52, background: 'var(--bg-3)', borderRadius: 6, marginBottom: 12 }} />)}
            </div>
          ) : posts.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                {search || filterStatus || filterDivision ? 'No posts match your filters.' : 'No posts yet.'}
              </p>
              <a href="/blog/new" style={{ color: 'var(--teal)', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>Create your first post</a>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 110px 90px 80px', gap: 0, padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
                {['Title', 'Division', 'Status', 'Updated', ''].map(h => (
                  <div key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</div>
                ))}
              </div>
              {posts.map((post, i) => (
                <div key={post.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 110px 90px 80px',
                  gap: 0,
                  padding: '14px 20px',
                  borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <a href={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {post.title}
                      </div>
                    </a>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      /{post.slug} · {post.author_name ?? 'SocioFi Team'}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                    {post.division ?? '—'}
                  </div>
                  <div>
                    <select
                      value={post.status}
                      onChange={e => updateStatus(post.id, e.target.value as ContentStatus)}
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: `${STATUS_COLORS[post.status]}15`,
                        border: `1px solid ${STATUS_COLORS[post.status]}40`,
                        color: STATUS_COLORS[post.status],
                        borderRadius: 100,
                        padding: '3px 10px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="draft">Draft</option>
                      <option value="review">In Review</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {timeAgo(post.updated_at ?? post.created_at)}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`/blog/${post.id}`} title="Edit">
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    </a>
                    <button onClick={() => deletePost(post.id)} title="Delete" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </CMSShell>
  )
}
