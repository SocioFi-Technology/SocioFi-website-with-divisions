'use client'

import { useEffect, useState, useCallback } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import { STATUS_COLORS, DIVISIONS } from '@/lib/divisions'
import type { CMSTestimonial, ContentStatus, Division } from '@/lib/types'

export default function TestimonialsCMSPage() {
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Partial<CMSTestimonial> | null>(null)
  const [search, setSearch] = useState('')
  const [divisionFilter, setDivisionFilter] = useState<Division | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')

  const ACCENT = '#59A392'

  const fetchData = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setLoading(false); return }
    setLoading(true)
    const { data } = await client.from('cms_testimonials').select('*').order('created_at', { ascending: false })
    setTestimonials((data as CMSTestimonial[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function updateStatus(id: string, status: ContentStatus) {
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_testimonials').update({ status }).eq('id', id)
    fetchData()
  }

  async function saveItem(item: Partial<CMSTestimonial>) {
    const client = getSupabaseClient()
    if (!client) { setShowForm(false); return }
    if (item.id) {
      await client.from('cms_testimonials').update(item).eq('id', item.id)
    } else {
      await client.from('cms_testimonials').insert({ ...item, created_at: new Date().toISOString() })
    }
    setShowForm(false); setEditItem(null); fetchData()
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this testimonial?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_testimonials').delete().eq('id', id)
    fetchData()
  }

  const filtered = testimonials.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || (t.company ?? '').toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase())
    const matchDiv = divisionFilter === 'all' || t.division === divisionFilter
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchSearch && matchDiv && matchStatus
  })

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }

  function getDivisionAccent(div?: Division | null) {
    if (!div) return ACCENT
    return DIVISIONS.find(d => d.id === div)?.accent ?? ACCENT
  }

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Content</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Testimonials</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>Client reviews across all divisions ({testimonials.length} total)</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search testimonials..." style={{ ...inputStyle, width: 200, padding: '8px 14px' }} />
            <select value={divisionFilter} onChange={e => setDivisionFilter(e.target.value as Division | 'all')} style={{ ...inputStyle, width: 'auto', padding: '8px 14px' }}>
              <option value="all">All Divisions</option>
              {DIVISIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as ContentStatus | 'all')} style={{ ...inputStyle, width: 'auto', padding: '8px 14px' }}>
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <button onClick={() => { setEditItem({ status: 'draft', rating: 5 }); setShowForm(true) }} style={{ background: `linear-gradient(135deg, #3A589E, ${ACCENT})`, color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 22px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Testimonial
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {loading ? [1,2,3].map(i => <div key={i} style={{ height: 200, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />) :
            filtered.length === 0 ? <div style={{ gridColumn: '1/-1', padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No testimonials found.</div> :
            filtered.map(item => {
              const accent = getDivisionAccent(item.division)
              const divLabel = DIVISIONS.find(d => d.id === item.division)?.name
              return (
                <div key={item.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '22px 24px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, #3A589E, ${accent})`, borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: accent, flexShrink: 0 }}>
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                          {(item.title || item.company) && (
                            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {[item.title, item.company].filter(Boolean).join(' · ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <select value={item.status} onChange={e => updateStatus(item.id, e.target.value as ContentStatus)} style={{ background: `${STATUS_COLORS[item.status]}15`, border: `1px solid ${STATUS_COLORS[item.status]}40`, color: STATUS_COLORS[item.status], borderRadius: 100, padding: '3px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'pointer', outline: 'none' }}>
                      <option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option><option value="archived">Archived</option>
                    </select>
                  </div>

                  {item.rating && (
                    <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={s <= item.rating! ? accent : 'none'} stroke={s <= item.rating! ? accent : 'var(--text-muted)'} strokeWidth="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      ))}
                    </div>
                  )}

                  <blockquote style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontStyle: 'italic' }}>
                    "{item.content}"
                  </blockquote>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {divLabel && <span style={{ background: `${accent}15`, color: accent, borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>{divLabel}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setEditItem(item); setShowForm(true) }} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontFamily: 'var(--font-body)', fontSize: '0.78rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 5 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>

        {showForm && editItem !== null && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{editItem.id ? 'Edit' : 'New'} Testimonial</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <TestimonialForm item={editItem} onSave={saveItem} onCancel={() => setShowForm(false)} inputStyle={inputStyle} labelStyle={labelStyle} accent={ACCENT} />
            </div>
          </div>
        )}
      </div>
    </CMSShell>
  )
}

function TestimonialForm({ item, onSave, onCancel, inputStyle, labelStyle, accent }: { item: Partial<CMSTestimonial>; onSave: (i: Partial<CMSTestimonial>) => void; onCancel: () => void; inputStyle: React.CSSProperties; labelStyle: React.CSSProperties; accent: string }) {
  const [form, setForm] = useState<Partial<CMSTestimonial>>({ name: '', title: '', company: '', content: '', rating: 5, division: undefined, status: 'draft', ...item })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label style={labelStyle}>Name *</label><input style={inputStyle} value={form.name ?? ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={labelStyle}>Job Title</label><input style={inputStyle} value={form.title ?? ''} placeholder="e.g. Founder & CEO" onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
        <div><label style={labelStyle}>Company</label><input style={inputStyle} value={form.company ?? ''} placeholder="e.g. Acme Corp" onChange={e => setForm(p => ({ ...p, company: e.target.value }))} /></div>
      </div>
      <div><label style={labelStyle}>Testimonial Content *</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={5} value={form.content ?? ''} placeholder="What the client said..." onChange={e => setForm(p => ({ ...p, content: e.target.value }))} /></div>
      <div>
        <label style={labelStyle}>Rating</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1,2,3,4,5].map(s => (
            <button key={s} type="button" onClick={() => setForm(p => ({ ...p, rating: s }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={(form.rating ?? 0) >= s ? accent : 'none'} stroke={(form.rating ?? 0) >= s ? accent : 'var(--text-muted)'} strokeWidth="2" aria-label={`${s} star`}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
          ))}
        </div>
      </div>
      <div><label style={labelStyle}>Division</label>
        <select style={inputStyle} value={form.division ?? ''} onChange={e => setForm(p => ({ ...p, division: (e.target.value || undefined) as Division | undefined }))}>
          <option value="">No specific division</option>
          {DIVISIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
      <div><label style={labelStyle}>Avatar URL (optional)</label><input style={inputStyle} value={form.avatar_url ?? ''} placeholder="https://..." onChange={e => setForm(p => ({ ...p, avatar_url: e.target.value }))} /></div>
      <div><label style={labelStyle}>Status</label>
        <select style={inputStyle} value={form.status ?? 'draft'} onChange={e => setForm(p => ({ ...p, status: e.target.value as CMSTestimonial['status'] }))}>
          <option value="draft">Draft</option><option value="review">In Review</option><option value="published">Published</option><option value="archived">Archived</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onCancel} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
        <button onClick={() => onSave(form)} disabled={!form.name || !form.content} style={{ background: `linear-gradient(135deg, #3A589E, ${accent})`, color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', opacity: (!form.name || !form.content) ? 0.5 : 1 }}>Save</button>
      </div>
    </div>
  )
}
