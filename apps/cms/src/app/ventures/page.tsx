'use client'

import { useEffect, useState, useCallback } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/divisions'
import type { CMSPortfolio, ContentStatus } from '@/lib/types'

export default function VenturesCMSPage() {
  const [portfolio, setPortfolio] = useState<CMSPortfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Partial<CMSPortfolio> | null>(null)
  const [search, setSearch] = useState('')

  const ACCENT = '#6BA3E8'

  const fetchData = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setLoading(false); return }
    setLoading(true)
    const { data } = await client.from('cms_portfolio').select('*').eq('division', 'ventures').order('created_at', { ascending: false })
    setPortfolio((data as CMSPortfolio[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function updateStatus(id: string, status: ContentStatus) {
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_portfolio').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  async function saveItem(item: Partial<CMSPortfolio>) {
    const client = getSupabaseClient()
    if (!client) { setShowForm(false); return }
    const payload = { ...item, division: 'ventures', type: 'investment', updated_at: new Date().toISOString() }
    if (item.id) await client.from('cms_portfolio').update(payload).eq('id', item.id)
    else await client.from('cms_portfolio').insert({ ...payload, created_at: new Date().toISOString() })
    setShowForm(false); setEditItem(null); fetchData()
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this investment?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_portfolio').delete().eq('id', id)
    fetchData()
  }

  const filtered = portfolio.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.client_name ?? '').toLowerCase().includes(search.toLowerCase()))

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Ventures</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Portfolio</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>Equity investments in AI-first startups ({portfolio.length} total)</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..." style={{ ...inputStyle, width: 220, padding: '8px 14px' }} />
            <button onClick={() => { setEditItem({}); setShowForm(true) }} style={{ background: `linear-gradient(135deg, #3A589E, ${ACCENT})`, color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 22px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Investment
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {loading ? [1,2,3].map(i => <div key={i} style={{ height: 200, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />) :
            filtered.length === 0 ? <div style={{ gridColumn: '1/-1', padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No investments in portfolio yet.</div> :
            filtered.map(item => (
              <div key={item.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '22px 24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ flex: 1, paddingRight: 8 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>{item.title}</h3>
                    {item.client_name && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: ACCENT }}>by {item.client_name}</div>}
                  </div>
                  <select value={item.status} onChange={e => updateStatus(item.id, e.target.value as ContentStatus)} style={{ background: `${STATUS_COLORS[item.status]}15`, border: `1px solid ${STATUS_COLORS[item.status]}40`, color: STATUS_COLORS[item.status], borderRadius: 100, padding: '3px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'pointer', outline: 'none' }}>
                    <option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option><option value="archived">Archived</option>
                  </select>
                </div>
                {item.description && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</div>}
                {item.tags && item.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    {item.tags.map(tag => <span key={tag} style={{ background: `${ACCENT}15`, color: ACCENT, borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>{tag}</span>)}
                  </div>
                )}
                {item.metrics && item.metrics.length > 0 && (
                  <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                    {item.metrics.slice(0, 2).map((m, i) => (
                      <div key={i}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: ACCENT }}>{m.value}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setEditItem(item); setShowForm(true) }} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontFamily: 'var(--font-body)', fontSize: '0.8rem', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                  </button>
                </div>
              </div>
            ))
          }
        </div>

        {showForm && editItem !== null && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{editItem.id ? 'Edit' : 'New'} Investment</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <InvestmentForm item={editItem} onSave={saveItem} onCancel={() => setShowForm(false)} inputStyle={inputStyle} labelStyle={labelStyle} accent={ACCENT} />
            </div>
          </div>
        )}
      </div>
    </CMSShell>
  )
}

function InvestmentForm({ item, onSave, onCancel, inputStyle, labelStyle, accent }: { item: Partial<CMSPortfolio>; onSave: (i: Partial<CMSPortfolio>) => void; onCancel: () => void; inputStyle: React.CSSProperties; labelStyle: React.CSSProperties; accent: string }) {
  const [form, setForm] = useState<Partial<CMSPortfolio>>({ title: '', slug: '', client_name: '', description: '', status: 'draft', tags: [], outcomes: [], ...item })
  const [metricsText, setMetricsText] = useState(
    (item.metrics ?? []).map(m => `${m.label}: ${m.value}`).join('\n')
  )

  function parseMetrics(text: string) {
    return text.split('\n').filter(Boolean).map(line => {
      const [label, ...rest] = line.split(':')
      return { label: label.trim(), value: rest.join(':').trim() }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label style={labelStyle}>Company / Product Name *</label><input style={inputStyle} value={form.title ?? ''} onChange={e => { const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); setForm(p => ({ ...p, title: e.target.value, slug: p.id ? p.slug : slug })) }} /></div>
      <div><label style={labelStyle}>Slug *</label><input style={inputStyle} value={form.slug ?? ''} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
      <div><label style={labelStyle}>Founder / Team</label><input style={inputStyle} value={form.client_name ?? ''} onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))} /></div>
      <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={4} value={form.description ?? ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
      <div><label style={labelStyle}>Tags (comma-separated, e.g. AI, SaaS, B2B)</label><input style={inputStyle} value={(form.tags ?? []).join(', ')} onChange={e => setForm(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} /></div>
      <div><label style={labelStyle}>Key Metrics (one per line, format "Label: Value")</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={3} placeholder="ARR: $120K&#10;Customers: 40&#10;Growth: 28% MoM" value={metricsText} onChange={e => { setMetricsText(e.target.value); setForm(p => ({ ...p, metrics: parseMetrics(e.target.value) })) }} /></div>
      <div><label style={labelStyle}>Website URL</label><input style={inputStyle} value={form.url ?? ''} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} /></div>
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
