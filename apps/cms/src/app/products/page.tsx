'use client'

import { useEffect, useState, useCallback } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/divisions'
import type { CMSPost, CMSTestimonial, ContentStatus } from '@/lib/types'

type Tab = 'posts' | 'testimonials'

export default function ProductsCMSPage() {
  const [tab, setTab] = useState<Tab>('posts')
  const [posts, setPosts] = useState<CMSPost[]>([])
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Partial<CMSPost & CMSTestimonial> | null>(null)

  const ACCENT = '#E8916F'

  const fetchData = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setLoading(false); return }
    setLoading(true)
    const [{ data: p }, { data: t }] = await Promise.all([
      client.from('cms_posts').select('*').eq('division', 'products').order('created_at', { ascending: false }),
      client.from('cms_testimonials').select('*').eq('division', 'products').order('created_at', { ascending: false }),
    ])
    setPosts((p as CMSPost[]) ?? [])
    setTestimonials((t as CMSTestimonial[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function updatePostStatus(id: string, status: ContentStatus) {
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_posts').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  async function saveTestimonial(item: Partial<CMSTestimonial>) {
    const client = getSupabaseClient()
    if (!client) { setShowForm(false); return }
    const payload = { ...item, division: 'products' }
    if (item.id) await client.from('cms_testimonials').update(payload).eq('id', item.id)
    else await client.from('cms_testimonials').insert({ ...payload, created_at: new Date().toISOString() })
    setShowForm(false); setEditItem(null); fetchData()
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_posts').delete().eq('id', id)
    fetchData()
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Delete this testimonial?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_testimonials').delete().eq('id', id)
    fetchData()
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Products</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Products Content</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>FabricxAI, NEXUS ARIA, DevBridge — announcements and testimonials</p>
          </div>
          <button onClick={() => { setEditItem({}); setShowForm(true) }} style={{ background: `linear-gradient(135deg, #3A589E, ${ACCENT})`, color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 22px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add {tab === 'posts' ? 'Post' : 'Testimonial'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          {(['posts', 'testimonials'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${ACCENT}` : '2px solid transparent', color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: tab === t ? 600 : 400, padding: '10px 20px', cursor: 'pointer', marginBottom: -1, textTransform: 'capitalize' }}>
              {t === 'posts' ? `Announcements (${posts.length})` : `Testimonials (${testimonials.length})`}
            </button>
          ))}
        </div>

        {tab === 'posts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading ? [1,2,3].map(i => <div key={i} style={{ height: 72, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />) :
              posts.length === 0 ? <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No product posts yet. Add announcements or update posts.</div> :
              posts.map(p => (
                <div key={p.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{p.type ?? 'post'} · {p.slug}</div>
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
                    <a href={`/blog/${p.id}`} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontFamily: 'var(--font-body)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex' }}>Edit</a>
                    <button onClick={() => deletePost(p.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {tab === 'testimonials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loading ? [1,2,3].map(i => <div key={i} style={{ height: 100, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />) :
              testimonials.length === 0 ? <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No testimonials yet.</div> :
              testimonials.map(t => (
                <div key={t.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 10 }}>"{t.content}"</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</div>
                    {(t.title || t.company) && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{[t.title, t.company].filter(Boolean).join(' · ')}</div>}
                    {t.rating && <div style={{ color: '#E8B84D', fontSize: '0.8rem', marginTop: 4 }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                    <span style={{ background: `${STATUS_COLORS[t.status]}15`, color: STATUS_COLORS[t.status], borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>{STATUS_LABELS[t.status]}</span>
                    <button onClick={() => { setEditItem(t as Partial<CMSPost & CMSTestimonial>); setShowForm(true) }} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', fontFamily: 'var(--font-body)', fontSize: '0.78rem', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteTestimonial(t.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {showForm && editItem !== null && tab === 'testimonials' && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', width: '100%', maxWidth: 540, maxHeight: '85vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{editItem.id ? 'Edit' : 'New'} Testimonial</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <TestimonialForm item={editItem as Partial<CMSTestimonial>} onSave={saveTestimonial} onCancel={() => setShowForm(false)} inputStyle={inputStyle} labelStyle={labelStyle} accent={ACCENT} />
            </div>
          </div>
        )}

        {showForm && editItem !== null && tab === 'posts' && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', width: '100%', maxWidth: 540 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>New Product Post</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20 }}>Product posts use the full blog editor. Go to the Blog section and create a post, then set its division to "Products".</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowForm(false)} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>Close</button>
                <a href="/blog/new" style={{ background: `linear-gradient(135deg, #3A589E, ${ACCENT})`, color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex' }}>Open Blog Editor</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </CMSShell>
  )
}

function TestimonialForm({ item, onSave, onCancel, inputStyle, labelStyle, accent }: { item: Partial<CMSTestimonial>; onSave: (i: Partial<CMSTestimonial>) => void; onCancel: () => void; inputStyle: React.CSSProperties; labelStyle: React.CSSProperties; accent: string }) {
  const [form, setForm] = useState<Partial<CMSTestimonial>>({ name: '', title: '', company: '', content: '', status: 'draft', rating: 5, ...item })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label style={labelStyle}>Name *</label><input style={inputStyle} value={form.name ?? ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={labelStyle}>Title</label><input style={inputStyle} value={form.title ?? ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
        <div><label style={labelStyle}>Company / Product</label><input style={inputStyle} value={form.company ?? ''} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} /></div>
      </div>
      <div><label style={labelStyle}>Testimonial *</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={4} value={form.content ?? ''} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={labelStyle}>Rating</label>
          <select style={inputStyle} value={form.rating ?? 5} onChange={e => setForm(p => ({ ...p, rating: Number(e.target.value) }))}>
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} stars</option>)}
          </select>
        </div>
        <div><label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status ?? 'draft'} onChange={e => setForm(p => ({ ...p, status: e.target.value as ContentStatus }))}>
            <option value="draft">Draft</option><option value="review">In Review</option><option value="published">Published</option><option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onCancel} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
        <button onClick={() => onSave(form)} disabled={!form.name || !form.content} style={{ background: `linear-gradient(135deg, #3A589E, ${accent})`, color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Save</button>
      </div>
    </div>
  )
}
