'use client'

import { useEffect, useState, useCallback } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/divisions'
import type { CMSPost, CMSPortfolio, ContentStatus } from '@/lib/types'

type Tab = 'posts' | 'projects'

export default function LabsCMSPage() {
  const [tab, setTab] = useState<Tab>('posts')
  const [posts, setPosts] = useState<CMSPost[]>([])
  const [projects, setProjects] = useState<CMSPortfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Partial<CMSPost & CMSPortfolio> | null>(null)
  const [search, setSearch] = useState('')

  const ACCENT = '#7B6FE8'

  const fetchData = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setLoading(false); return }
    setLoading(true)
    const [{ data: p }, { data: proj }] = await Promise.all([
      client.from('cms_posts').select('*').eq('division', 'labs').order('created_at', { ascending: false }),
      client.from('cms_portfolio').select('*').eq('division', 'labs').order('created_at', { ascending: false }),
    ])
    setPosts((p as CMSPost[]) ?? [])
    setProjects((proj as CMSPortfolio[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function updatePostStatus(id: string, status: ContentStatus) {
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_posts').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  async function updateProjectStatus(id: string, status: ContentStatus) {
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_portfolio').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  async function savePost(item: Partial<CMSPost>) {
    const client = getSupabaseClient()
    if (!client) { setShowForm(false); return }
    const payload = { ...item, division: 'labs', updated_at: new Date().toISOString() }
    if (item.id) await client.from('cms_posts').update(payload).eq('id', item.id)
    else await client.from('cms_posts').insert({ ...payload, created_at: new Date().toISOString() })
    setShowForm(false); setEditItem(null); fetchData()
  }

  async function saveProject(item: Partial<CMSPortfolio>) {
    const client = getSupabaseClient()
    if (!client) { setShowForm(false); return }
    const payload = { ...item, division: 'labs', updated_at: new Date().toISOString() }
    if (item.id) await client.from('cms_portfolio').update(payload).eq('id', item.id)
    else await client.from('cms_portfolio').insert({ ...payload, created_at: new Date().toISOString() })
    setShowForm(false); setEditItem(null); fetchData()
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_posts').delete().eq('id', id)
    fetchData()
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_portfolio').delete().eq('id', id)
    fetchData()
  }

  const filteredPosts = posts.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
  const filteredProjects = projects.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Labs</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Labs Content</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>Research posts and open-source projects</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ ...inputStyle, width: 200, padding: '8px 14px' }} />
            <button
              onClick={() => { setEditItem({}); setShowForm(true) }}
              style={{ background: `linear-gradient(135deg, #3A589E, ${ACCENT})`, color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 22px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New {tab === 'posts' ? 'Post' : 'Project'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          {(['posts', 'projects'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${ACCENT}` : '2px solid transparent', color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: tab === t ? 600 : 400, padding: '10px 20px', cursor: 'pointer', marginBottom: -1, textTransform: 'capitalize' }}>
              {t === 'posts' ? `Research Posts (${posts.length})` : `Projects (${projects.length})`}
            </button>
          ))}
        </div>

        {tab === 'posts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading ? [1,2,3].map(i => <div key={i} style={{ height: 72, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />) :
              filteredPosts.length === 0 ? <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No posts yet.</div> :
              filteredPosts.map(p => (
                <div key={p.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.slug}</div>
                  </div>
                  {p.tags && p.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      {p.tags.slice(0, 2).map(tag => <span key={tag} style={{ background: `${ACCENT}15`, color: ACCENT, borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>{tag}</span>)}
                    </div>
                  )}
                  <select value={p.status} onChange={e => updatePostStatus(p.id, e.target.value as ContentStatus)} style={{ background: `${STATUS_COLORS[p.status]}15`, border: `1px solid ${STATUS_COLORS[p.status]}40`, color: STATUS_COLORS[p.status], borderRadius: 100, padding: '3px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'pointer', outline: 'none' }}>
                    <option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option><option value="archived">Archived</option>
                  </select>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`/blog/${p.id}`} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontFamily: 'var(--font-body)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Edit</a>
                    <button onClick={() => deletePost(p.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {tab === 'projects' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {loading ? [1,2,3].map(i => <div key={i} style={{ height: 160, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />) :
              filteredProjects.length === 0 ? <div style={{ gridColumn: '1/-1', padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No projects yet.</div> :
              filteredProjects.map(proj => (
                <div key={proj.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, flex: 1, paddingRight: 8 }}>{proj.title}</h3>
                    <select value={proj.status} onChange={e => updateProjectStatus(proj.id, e.target.value as ContentStatus)} style={{ background: `${STATUS_COLORS[proj.status]}15`, border: `1px solid ${STATUS_COLORS[proj.status]}40`, color: STATUS_COLORS[proj.status], borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'pointer', outline: 'none' }}>
                      <option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option><option value="archived">Archived</option>
                    </select>
                  </div>
                  {proj.description && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{proj.description}</div>}
                  {proj.tags && proj.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                      {proj.tags.map(tag => <span key={tag} style={{ background: `${ACCENT}15`, color: ACCENT, borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>{tag}</span>)}
                    </div>
                  )}
                  {proj.url && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 12 }}>{proj.url}</div>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setEditItem(proj as Partial<CMSPost & CMSPortfolio>); setShowForm(true) }} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontFamily: 'var(--font-body)', fontSize: '0.8rem', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteProject(proj.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {showForm && editItem !== null && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', width: '100%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {editItem.id ? 'Edit' : 'New'} {tab === 'posts' ? 'Research Post' : 'Project'}
                </h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              {tab === 'posts' ? (
                <PostQuickForm item={editItem as Partial<CMSPost>} onSave={savePost} onCancel={() => setShowForm(false)} inputStyle={inputStyle} labelStyle={labelStyle} accent={ACCENT} />
              ) : (
                <ProjectForm item={editItem as Partial<CMSPortfolio>} onSave={saveProject} onCancel={() => setShowForm(false)} inputStyle={inputStyle} labelStyle={labelStyle} accent={ACCENT} />
              )}
            </div>
          </div>
        )}
      </div>
    </CMSShell>
  )
}

function PostQuickForm({ item, onSave, onCancel, inputStyle, labelStyle, accent }: { item: Partial<CMSPost>; onSave: (i: Partial<CMSPost>) => void; onCancel: () => void; inputStyle: React.CSSProperties; labelStyle: React.CSSProperties; accent: string }) {
  const [form, setForm] = useState<Partial<CMSPost>>({ title: '', slug: '', excerpt: '', status: 'draft', type: 'research', tags: [], ...item })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title ?? ''} onChange={e => { const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); setForm(p => ({ ...p, title: e.target.value, slug: p.id ? p.slug : slug })) }} /></div>
      <div><label style={labelStyle}>Slug *</label><input style={inputStyle} value={form.slug ?? ''} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
      <div><label style={labelStyle}>Excerpt</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={2} value={form.excerpt ?? ''} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} /></div>
      <div><label style={labelStyle}>Tags (comma-separated)</label><input style={inputStyle} value={(form.tags ?? []).join(', ')} onChange={e => setForm(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} /></div>
      <div><label style={labelStyle}>Status</label>
        <select style={inputStyle} value={form.status ?? 'draft'} onChange={e => setForm(p => ({ ...p, status: e.target.value as CMSPost['status'] }))}>
          <option value="draft">Draft</option><option value="review">In Review</option><option value="published">Published</option><option value="archived">Archived</option>
        </select>
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Full content editing available in the Blog editor after saving.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onCancel} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
        <button onClick={() => onSave(form)} disabled={!form.title || !form.slug} style={{ background: `linear-gradient(135deg, #3A589E, ${accent})`, color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Save</button>
      </div>
    </div>
  )
}

function ProjectForm({ item, onSave, onCancel, inputStyle, labelStyle, accent }: { item: Partial<CMSPortfolio>; onSave: (i: Partial<CMSPortfolio>) => void; onCancel: () => void; inputStyle: React.CSSProperties; labelStyle: React.CSSProperties; accent: string }) {
  const [form, setForm] = useState<Partial<CMSPortfolio>>({ title: '', slug: '', description: '', status: 'draft', tags: [], type: 'project', ...item })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title ?? ''} onChange={e => { const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); setForm(p => ({ ...p, title: e.target.value, slug: p.id ? p.slug : slug })) }} /></div>
      <div><label style={labelStyle}>Slug *</label><input style={inputStyle} value={form.slug ?? ''} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
      <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={3} value={form.description ?? ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
      <div><label style={labelStyle}>Tags (comma-separated)</label><input style={inputStyle} value={(form.tags ?? []).join(', ')} onChange={e => setForm(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} /></div>
      <div><label style={labelStyle}>GitHub / Live URL</label><input style={inputStyle} value={form.url ?? ''} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} /></div>
      <div><label style={labelStyle}>Status</label>
        <select style={inputStyle} value={form.status ?? 'draft'} onChange={e => setForm(p => ({ ...p, status: e.target.value as CMSPortfolio['status'] }))}>
          <option value="draft">Draft</option><option value="review">In Review</option><option value="published">Published</option><option value="archived">Archived</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onCancel} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
        <button onClick={() => onSave(form)} disabled={!form.title || !form.slug} style={{ background: `linear-gradient(135deg, #3A589E, ${accent})`, color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Save</button>
      </div>
    </div>
  )
}
