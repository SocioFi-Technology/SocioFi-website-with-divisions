'use client'

import { useEffect, useState, useCallback } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import { STATUS_COLORS } from '@/lib/divisions'
import type { CMSWorkshop, ContentStatus } from '@/lib/types'

export default function WorkshopsCMSPage() {
  const [workshops, setWorkshops] = useState<CMSWorkshop[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Partial<CMSWorkshop> | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')

  const ACCENT = '#E8B84D'

  const fetchData = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setLoading(false); return }
    setLoading(true)
    const { data } = await client.from('cms_workshops').select('*').order('date', { ascending: true })
    setWorkshops((data as CMSWorkshop[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function updateStatus(id: string, status: ContentStatus) {
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_workshops').update({ status }).eq('id', id)
    fetchData()
  }

  async function saveItem(item: Partial<CMSWorkshop>) {
    const client = getSupabaseClient()
    if (!client) { setShowForm(false); return }
    if (item.id) {
      await client.from('cms_workshops').update(item).eq('id', item.id)
    } else {
      await client.from('cms_workshops').insert({ ...item, created_at: new Date().toISOString() })
    }
    setShowForm(false); setEditItem(null); fetchData()
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this workshop?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_workshops').delete().eq('id', id)
    fetchData()
  }

  const filtered = workshops.filter(w => {
    const matchSearch = !search || w.title.toLowerCase().includes(search.toLowerCase()) || (w.instructor_name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || w.status === statusFilter
    return matchSearch && matchStatus
  })

  const upcoming = filtered.filter(w => new Date(w.date) >= new Date())
  const past = filtered.filter(w => new Date(w.date) < new Date())

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Academy</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Workshops</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>Live sessions, scheduled events, and instructor-led workshops ({workshops.length} total)</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workshops..." style={{ ...inputStyle, width: 200, padding: '8px 14px' }} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as ContentStatus | 'all')} style={{ ...inputStyle, width: 'auto', padding: '8px 14px' }}>
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <button onClick={() => { setEditItem({ is_online: true, status: 'draft', currency: 'USD' }); setShowForm(true) }} style={{ background: `linear-gradient(135deg, #3A589E, ${ACCENT})`, color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 22px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Schedule Workshop
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 220, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No workshops found. Schedule your first workshop.</div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Upcoming ({upcoming.length})</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                  {upcoming.map(item => <WorkshopCard key={item.id} item={item} accent={ACCENT} onEdit={() => { setEditItem(item); setShowForm(true) }} onDelete={() => deleteItem(item.id)} onStatusChange={(s) => updateStatus(item.id, s)} />)}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Past ({past.length})</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, opacity: 0.7 }}>
                  {past.map(item => <WorkshopCard key={item.id} item={item} accent={ACCENT} onEdit={() => { setEditItem(item); setShowForm(true) }} onDelete={() => deleteItem(item.id)} onStatusChange={(s) => updateStatus(item.id, s)} />)}
                </div>
              </div>
            )}
          </>
        )}

        {showForm && editItem !== null && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{editItem.id ? 'Edit' : 'Schedule'} Workshop</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <WorkshopForm item={editItem} onSave={saveItem} onCancel={() => setShowForm(false)} inputStyle={inputStyle} labelStyle={labelStyle} accent={ACCENT} />
            </div>
          </div>
        )}
      </div>
    </CMSShell>
  )
}

function WorkshopCard({ item, accent, onEdit, onDelete, onStatusChange }: { item: CMSWorkshop; accent: string; onEdit: () => void; onDelete: () => void; onStatusChange: (s: ContentStatus) => void }) {
  const date = new Date(item.date)
  const isUpcoming = date >= new Date()
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '22px 24px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, #3A589E, ${accent})`, borderRadius: 'var(--radius-md) var(--radius-md) 0 0', opacity: isUpcoming ? 0.8 : 0.3 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1, paddingRight: 8 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>{item.title}</h3>
          {item.instructor_name && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: accent }}>with {item.instructor_name}</div>}
        </div>
        <select value={item.status} onChange={e => onStatusChange(e.target.value as ContentStatus)} style={{ background: `${STATUS_COLORS[item.status]}15`, border: `1px solid ${STATUS_COLORS[item.status]}40`, color: STATUS_COLORS[item.status], borderRadius: 100, padding: '3px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'pointer', outline: 'none' }}>
          <option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option><option value="archived">Archived</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {dateStr}
        </div>
        {item.time && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {item.time} {item.duration && `· ${item.duration}`}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{ background: item.is_online ? `${accent}15` : 'var(--bg-2)', color: item.is_online ? accent : 'var(--text-muted)', borderRadius: 100, padding: '2px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
          {item.is_online ? 'Online' : 'In-Person'}
        </span>
        {item.location && <span style={{ background: 'var(--bg-2)', color: 'var(--text-muted)', borderRadius: 100, padding: '2px 10px', fontFamily: 'var(--font-body)', fontSize: '0.72rem' }}>{item.location}</span>}
        {item.price !== undefined && item.price !== null && (
          <span style={{ background: 'var(--bg-2)', color: 'var(--text-secondary)', borderRadius: 100, padding: '2px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            {item.price === 0 ? 'Free' : `${item.currency ?? 'USD'} ${item.price}`}
          </span>
        )}
      </div>

      {(item.seats !== undefined && item.seats !== null) && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: 4 }}>
            <span>Seats</span>
            <span>{item.seats_remaining ?? item.seats} / {item.seats} remaining</span>
          </div>
          <div style={{ height: 4, background: 'var(--bg-2)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: accent, width: `${((item.seats - (item.seats_remaining ?? item.seats)) / item.seats) * 100}%`, borderRadius: 2 }} />
          </div>
        </div>
      )}

      {item.description && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onEdit} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontFamily: 'var(--font-body)', fontSize: '0.8rem', cursor: 'pointer' }}>Edit</button>
        <button onClick={onDelete} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>
    </div>
  )
}

function WorkshopForm({ item, onSave, onCancel, inputStyle, labelStyle, accent }: { item: Partial<CMSWorkshop>; onSave: (i: Partial<CMSWorkshop>) => void; onCancel: () => void; inputStyle: React.CSSProperties; labelStyle: React.CSSProperties; accent: string }) {
  const [form, setForm] = useState<Partial<CMSWorkshop>>({
    title: '', slug: '', description: '', date: '', time: '', duration: '', price: 0, currency: 'USD',
    seats: undefined, seats_remaining: undefined, location: '', is_online: true, meeting_url: '',
    instructor_name: '', status: 'draft', ...item
  })

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const checkboxStyle: React.CSSProperties = { width: 16, height: 16, accentColor: accent, cursor: 'pointer' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label style={labelStyle}>Workshop Title *</label><input style={inputStyle} value={form.title ?? ''} onChange={e => { const slug = autoSlug(e.target.value); setForm(p => ({ ...p, title: e.target.value, slug: p.id ? p.slug : slug })) }} /></div>
      <div><label style={labelStyle}>Slug *</label><input style={inputStyle} value={form.slug ?? ''} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
      <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={3} value={form.description ?? ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={labelStyle}>Date *</label><input type="date" style={inputStyle} value={form.date ?? ''} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
        <div><label style={labelStyle}>Time</label><input type="time" style={inputStyle} value={form.time ?? ''} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={labelStyle}>Duration (e.g. 2 hours)</label><input style={inputStyle} value={form.duration ?? ''} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} /></div>
        <div><label style={labelStyle}>Instructor Name</label><input style={inputStyle} value={form.instructor_name ?? ''} onChange={e => setForm(p => ({ ...p, instructor_name: e.target.value }))} /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={labelStyle}>Price</label><input type="number" min="0" style={inputStyle} value={form.price ?? 0} onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} /></div>
        <div><label style={labelStyle}>Total Seats</label><input type="number" min="1" style={inputStyle} value={form.seats ?? ''} placeholder="Unlimited" onChange={e => { const v = parseInt(e.target.value); setForm(p => ({ ...p, seats: isNaN(v) ? undefined : v, seats_remaining: isNaN(v) ? undefined : (p.seats_remaining ?? v) })) }} /></div>
      </div>

      {(form.seats !== undefined && form.seats !== null) && (
        <div><label style={labelStyle}>Seats Remaining</label><input type="number" min="0" max={form.seats} style={inputStyle} value={form.seats_remaining ?? form.seats} onChange={e => setForm(p => ({ ...p, seats_remaining: parseInt(e.target.value) || 0 }))} /></div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
        <input type="checkbox" id="is_online" checked={form.is_online ?? true} onChange={e => setForm(p => ({ ...p, is_online: e.target.checked }))} style={checkboxStyle} />
        <label htmlFor="is_online" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer' }}>Online event</label>
      </div>

      {form.is_online ? (
        <div><label style={labelStyle}>Meeting URL</label><input style={inputStyle} value={form.meeting_url ?? ''} placeholder="https://zoom.us/j/..." onChange={e => setForm(p => ({ ...p, meeting_url: e.target.value }))} /></div>
      ) : (
        <div><label style={labelStyle}>Location / Venue</label><input style={inputStyle} value={form.location ?? ''} placeholder="e.g. Dhaka Tech Hub, Banani" onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></div>
      )}

      <div><label style={labelStyle}>Status</label>
        <select style={inputStyle} value={form.status ?? 'draft'} onChange={e => setForm(p => ({ ...p, status: e.target.value as CMSWorkshop['status'] }))}>
          <option value="draft">Draft</option><option value="review">In Review</option><option value="published">Published</option><option value="archived">Archived</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onCancel} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
        <button onClick={() => onSave(form)} disabled={!form.title || !form.slug || !form.date} style={{ background: `linear-gradient(135deg, #3A589E, ${accent})`, color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', opacity: (!form.title || !form.slug || !form.date) ? 0.5 : 1 }}>Save Workshop</button>
      </div>
    </div>
  )
}
