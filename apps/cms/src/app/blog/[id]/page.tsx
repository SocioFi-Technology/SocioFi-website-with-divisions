'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import { DIVISIONS, STATUS_COLORS, STATUS_LABELS } from '@/lib/divisions'
import type { CMSPost, ContentStatus, Division } from '@/lib/types'

const PostEditor = dynamic(() => import('@/components/PostEditor'), { ssr: false })

export default function BlogPostEditor() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [post, setPost] = useState<Partial<CMSPost>>({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    status: 'draft',
    division: undefined,
    author_name: 'SocioFi Team',
    tags: [],
    seo_title: '',
    seo_description: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content')

  useEffect(() => {
    const client = getSupabaseClient()
    if (!client || id === 'new-draft') { setLoading(false); return }
    client.from('cms_posts').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setPost(data as CMSPost)
      setLoading(false)
    })
  }, [id])

  const save = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setSaved(true); setTimeout(() => setSaved(false), 2000); return }
    setSaving(true)
    const payload = { ...post, updated_at: new Date().toISOString() }
    if (id === 'new-draft') {
      const { data } = await client.from('cms_posts').insert({ ...payload, created_at: new Date().toISOString() }).select().single()
      if (data) router.replace(`/blog/${data.id}`)
    } else {
      await client.from('cms_posts').update(payload).eq('id', id)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [id, post, router])

  // Ctrl+S to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [save])

  function slugify(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function handleTitleChange(title: string) {
    setPost(p => ({
      ...p,
      title,
      slug: p.slug === '' || p.slug === slugify(p.title ?? '') ? slugify(title) : p.slug,
    }))
  }

  if (loading) {
    return (
      <CMSShell>
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Loading...</div>
      </CMSShell>
    )
  }

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'seo', label: 'SEO' },
    { id: 'settings', label: 'Settings' },
  ] as const

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button onClick={() => router.push('/blog')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px 0', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: '0.84rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
          <div style={{ flex: 1 }} />
          <select
            value={post.status}
            onChange={e => setPost(p => ({ ...p, status: e.target.value as ContentStatus }))}
            style={{
              background: `${STATUS_COLORS[post.status ?? 'draft']}15`,
              border: `1px solid ${STATUS_COLORS[post.status ?? 'draft']}40`,
              color: STATUS_COLORS[post.status ?? 'draft'],
              borderRadius: 100,
              padding: '6px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={save}
            disabled={saving}
            style={{
              background: saved ? '#59A392' : 'var(--gradient-brand)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '8px 20px',
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              minWidth: 80,
            }}
          >
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Title */}
        <input
          type="text"
          value={post.title}
          onChange={e => handleTitleChange(e.target.value)}
          placeholder="Post title..."
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            outline: 'none',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.025em',
            marginBottom: 8,
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>/blog/</span>
          <input
            type="text"
            value={post.slug}
            onChange={e => setPost(p => ({ ...p, slug: e.target.value }))}
            style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--teal)', flex: 1 }}
            placeholder="post-slug"
          />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--teal)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab.id ? 600 : 400,
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'content' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Excerpt</label>
              <textarea
                value={post.excerpt ?? ''}
                onChange={e => setPost(p => ({ ...p, excerpt: e.target.value }))}
                placeholder="Short description shown in listings..."
                rows={2}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Body</label>
              <PostEditor
                content={post.body ?? ''}
                onChange={body => setPost(p => ({ ...p, body }))}
                placeholder="Start writing your post..."
              />
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 700 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>SEO Title</label>
              <input type="text" value={post.seo_title ?? ''} onChange={e => setPost(p => ({ ...p, seo_title: e.target.value }))} placeholder="SEO title (60 chars max)..." style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: (post.seo_title?.length ?? 0) > 60 ? '#E87B6F' : 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>{post.seo_title?.length ?? 0}/60</div>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Meta Description</label>
              <textarea value={post.seo_description ?? ''} onChange={e => setPost(p => ({ ...p, seo_description: e.target.value }))} placeholder="Meta description (158 chars max)..." rows={3} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: (post.seo_description?.length ?? 0) > 158 ? '#E87B6F' : 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>{post.seo_description?.length ?? 0}/158</div>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Tags (comma-separated)</label>
              <input type="text" value={(post.tags ?? []).join(', ')} onChange={e => setPost(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} placeholder="ai, development, studio..." style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 700 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Division</label>
              <select value={post.division ?? ''} onChange={e => setPost(p => ({ ...p, division: e.target.value as Division || undefined }))} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}>
                <option value="">No division (parent blog)</option>
                {DIVISIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Author</label>
              <input type="text" value={post.author_name ?? ''} onChange={e => setPost(p => ({ ...p, author_name: e.target.value }))} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Post Type</label>
              <select value={post.type ?? ''} onChange={e => setPost(p => ({ ...p, type: e.target.value as CMSPost['type'] || undefined }))} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}>
                <option value="">Blog Post</option>
                <option value="case_study">Case Study</option>
                <option value="announcement">Announcement</option>
                <option value="tutorial">Tutorial</option>
                <option value="research">Research</option>
                <option value="project_update">Project Update</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Featured Image URL</label>
              <input type="text" value={post.featured_image ?? ''} onChange={e => setPost(p => ({ ...p, featured_image: e.target.value }))} placeholder="https://..." style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }} />
            </div>
          </div>
        )}
      </div>
    </CMSShell>
  )
}
