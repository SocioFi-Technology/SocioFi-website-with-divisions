'use client'

import { useEffect, useState, useCallback } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import { STATUS_COLORS, DIVISIONS } from '@/lib/divisions'
import type { CMSFAQ, ContentStatus, Division } from '@/lib/types'

export default function FAQsCMSPage() {
  const [faqs, setFaqs] = useState<CMSFAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Partial<CMSFAQ> | null>(null)
  const [search, setSearch] = useState('')
  const [divisionFilter, setDivisionFilter] = useState<Division | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')

  const ACCENT = '#59A392'

  const fetchData = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setLoading(false); return }
    setLoading(true)
    const { data } = await client.from('cms_faqs').select('*').order('order_index', { ascending: true }).order('created_at', { ascending: false })
    setFaqs((data as CMSFAQ[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function updateStatus(id: string, status: ContentStatus) {
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_faqs').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  async function saveItem(item: Partial<CMSFAQ>) {
    const client = getSupabaseClient()
    if (!client) { setShowForm(false); return }
    const payload = { ...item, updated_at: new Date().toISOString() }
    if (item.id) {
      await client.from('cms_faqs').update(payload).eq('id', item.id)
    } else {
      await client.from('cms_faqs').insert({ ...payload, created_at: new Date().toISOString() })
    }
    setShowForm(false); setEditItem(null); fetchData()
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this FAQ?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_faqs').delete().eq('id', id)
    fetchData()
  }

  async function moveOrder(id: string, direction: 'up' | 'down') {
    const client = getSupabaseClient()
    if (!client) return
    const current = faqs.find(f => f.id === id)
    if (!current) return
    const divFaqs = faqs.filter(f => f.division === current.division)
    const idx = divFaqs.findIndex(f => f.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= divFaqs.length) return
    const swap = divFaqs[swapIdx]
    await Promise.all([
      client.from('cms_faqs').update({ order_index: swap.order_index }).eq('id', id),
      client.from('cms_faqs').update({ order_index: current.order_index }).eq('id', swap.id),
    ])
    fetchData()
  }

  const filtered = faqs.filter(f => {
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
    const matchDiv = divisionFilter === 'all' || f.division === divisionFilter
    const matchStatus = statusFilter === 'all' || f.status === statusFilter
    return matchSearch && matchDiv && matchStatus
  })

  // Group by division when showing all
  const grouped = divisionFilter === 'all'
    ? DIVISIONS.reduce((acc, div) => {
        const items = filtered.filter(f => f.division === div.id)
        if (items.length > 0) acc[div.id] = { label: div.name, accent: div.accent, items }
        return acc
      }, {} as Record<string, { label: string; accent: string; items: CMSFAQ[] }>)
    : null

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }

  const currentDivAccent = divisionFilter !== 'all' ? (DIVISIONS.find(d => d.id === divisionFilter)?.accent ?? ACCENT) : ACCENT

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Content</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>FAQs</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>Frequently asked questions across all divisions ({faqs.length} total)</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs..." style={{ ...inputStyle, width: 200, padding: '8px 14px' }} />
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
            <button onClick={() => { setEditItem({ status: 'draft', division: divisionFilter !== 'all' ? divisionFilter : 'parent' as Division }); setShowForm(true) }} style={{ background: `linear-gradient(135deg, #3A589E, ${currentDivAccent})`, color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 22px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add FAQ
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3,4].map(i => <div key={i} style={{ height: 80, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No FAQs found.</div>
        ) : grouped ? (
          // All divisions grouped
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {Object.entries(grouped).map(([divId, group]) => (
              <div key={divId}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: group.accent }} />
                  <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>{group.label} ({group.items.length})</h2>
                </div>
                <FAQList items={group.items} accent={group.accent} onEdit={(item) => { setEditItem(item); setShowForm(true) }} onDelete={deleteItem} onStatusChange={updateStatus} onMove={moveOrder} />
              </div>
            ))}
          </div>
        ) : (
          // Single division
          <FAQList items={filtered} accent={currentDivAccent} onEdit={(item) => { setEditItem(item); setShowForm(true) }} onDelete={deleteItem} onStatusChange={updateStatus} onMove={moveOrder} />
        )}

        {showForm && editItem !== null && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{editItem.id ? 'Edit' : 'New'} FAQ</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <FAQForm item={editItem} onSave={saveItem} onCancel={() => setShowForm(false)} inputStyle={inputStyle} labelStyle={labelStyle} accent={currentDivAccent} />
            </div>
          </div>
        )}
      </div>
    </CMSShell>
  )
}

function FAQList({ items, accent, onEdit, onDelete, onStatusChange, onMove }: { items: CMSFAQ[]; accent: string; onEdit: (item: CMSFAQ) => void; onDelete: (id: string) => void; onStatusChange: (id: string, status: ContentStatus) => void; onMove: (id: string, dir: 'up' | 'down') => void }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, idx) => (
        <div key={item.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px' }}>
            {/* Reorder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
              <button onClick={() => onMove(item.id, 'up')} disabled={idx === 0} style={{ background: 'none', border: 'none', color: idx === 0 ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: idx === 0 ? 'default' : 'pointer', padding: 2, lineHeight: 1 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Move up"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
              <button onClick={() => onMove(item.id, 'down')} disabled={idx === items.length - 1} style={{ background: 'none', border: 'none', color: idx === items.length - 1 ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: idx === items.length - 1 ? 'default' : 'pointer', padding: 2, lineHeight: 1 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Move down"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>

            <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} style={{ flex: 1, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.question}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <select value={item.status} onChange={e => onStatusChange(item.id, e.target.value as ContentStatus)} style={{ background: `${STATUS_COLORS[item.status]}15`, border: `1px solid ${STATUS_COLORS[item.status]}40`, color: STATUS_COLORS[item.status], borderRadius: 100, padding: '3px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', cursor: 'pointer', outline: 'none' }}>
                <option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option><option value="archived">Archived</option>
              </select>
              <button onClick={() => onEdit(item)} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', fontFamily: 'var(--font-body)', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => onDelete(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
              </button>
            </div>
          </div>

          {expanded === item.id && (
            <div style={{ padding: '0 18px 16px 54px', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '14px 0 0', lineHeight: 1.7 }}>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function FAQForm({ item, onSave, onCancel, inputStyle, labelStyle, accent }: { item: Partial<CMSFAQ>; onSave: (i: Partial<CMSFAQ>) => void; onCancel: () => void; inputStyle: React.CSSProperties; labelStyle: React.CSSProperties; accent: string }) {
  const [form, setForm] = useState<Partial<CMSFAQ>>({ question: '', answer: '', division: 'parent' as Division, status: 'draft', order_index: 0, ...item })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label style={labelStyle}>Question *</label><input style={inputStyle} value={form.question ?? ''} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} /></div>
      <div><label style={labelStyle}>Answer *</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={5} value={form.answer ?? ''} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={labelStyle}>Division *</label>
          <select style={inputStyle} value={form.division ?? 'parent'} onChange={e => setForm(p => ({ ...p, division: e.target.value as Division }))}>
            {DIVISIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div><label style={labelStyle}>Order Index</label><input type="number" min="0" style={inputStyle} value={form.order_index ?? 0} onChange={e => setForm(p => ({ ...p, order_index: parseInt(e.target.value) || 0 }))} /></div>
      </div>
      <div><label style={labelStyle}>Status</label>
        <select style={inputStyle} value={form.status ?? 'draft'} onChange={e => setForm(p => ({ ...p, status: e.target.value as CMSFAQ['status'] }))}>
          <option value="draft">Draft</option><option value="review">In Review</option><option value="published">Published</option><option value="archived">Archived</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onCancel} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
        <button onClick={() => onSave(form)} disabled={!form.question || !form.answer || !form.division} style={{ background: `linear-gradient(135deg, #3A589E, ${accent})`, color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', opacity: (!form.question || !form.answer || !form.division) ? 0.5 : 1 }}>Save</button>
      </div>
    </div>
  )
}
