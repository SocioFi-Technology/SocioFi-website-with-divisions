'use client'

import { useEffect, useState, useCallback } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import { STATUS_COLORS } from '@/lib/divisions'
import type { ContentStatus } from '@/lib/types'

type StudioContentType = 'service' | 'highlight' | 'process_step' | 'differentiator'

interface CMSStudioContent {
  id: string
  type: StudioContentType
  title: string
  description: string
  body?: string
  order_index: number
  status: ContentStatus
  tags?: string[]
  created_at: string
  updated_at?: string
}

const TYPE_LABELS: Record<StudioContentType, string> = {
  service: 'Service',
  highlight: 'Highlight',
  process_step: 'Process Step',
  differentiator: 'Differentiator',
}

const TYPE_COLORS: Record<StudioContentType, string> = {
  service: '#72C4B2',
  highlight: '#4A6CB8',
  process_step: '#E8B84D',
  differentiator: '#7B6FE8',
}

export default function StudioContentPage() {
  const [items, setItems] = useState<CMSStudioContent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Partial<CMSStudioContent> | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<StudioContentType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')

  const ACCENT = '#72C4B2'

  const fetchData = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setLoading(false); return }
    setLoading(true)
    const { data } = await client
      .from('cms_studio_content')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false })
    setItems((data as CMSStudioContent[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function updateStatus(id: string, status: ContentStatus) {
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_studio_content').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  async function saveItem(item: Partial<CMSStudioContent>) {
    const client = getSupabaseClient()
    if (!client) { setShowForm(false); return }
    const payload = { ...item, updated_at: new Date().toISOString() }
    if (item.id) {
      await client.from('cms_studio_content').update(payload).eq('id', item.id)
    } else {
      await client.from('cms_studio_content').insert({ ...payload, created_at: new Date().toISOString() })
    }
    setShowForm(false); setEditItem(null); fetchData()
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this content item?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_studio_content').delete().eq('id', id)
    fetchData()
  }

  async function moveOrder(id: string, direction: 'up' | 'down') {
    const client = getSupabaseClient()
    if (!client) return
    const current = items.find(i => i.id === id)
    if (!current) return
    const typeItems = items.filter(i => i.type === current.type)
    const idx = typeItems.findIndex(i => i.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= typeItems.length) return
    const swap = typeItems[swapIdx]
    await Promise.all([
      client.from('cms_studio_content').update({ order_index: swap.order_index }).eq('id', id),
      client.from('cms_studio_content').update({ order_index: current.order_index }).eq('id', swap.id),
    ])
    fetchData()
  }

  const filtered = items.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || i.type === typeFilter
    const matchStatus = statusFilter === 'all' || i.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '9px 14px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 5,
  }

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Studio</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Studio Content</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>
              {items.length} item{items.length !== 1 ? 's' : ''} — services, highlights, process steps, differentiators
            </p>
          </div>
          <button
            onClick={() => { setEditItem({ type: 'service', status: 'draft', order_index: 0 }); setShowForm(true) }}
            style={{ background: `linear-gradient(135deg, #3A589E, ${ACCENT})`, color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 22px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Content
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search content..."
            style={{ ...inputStyle, maxWidth: 240, padding: '8px 14px' }}
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as StudioContentType | 'all')}
            style={{ ...inputStyle, maxWidth: 180, padding: '8px 14px' }}
          >
            <option value="all">All Types</option>
            <option value="service">Service</option>
            <option value="highlight">Highlight</option>
            <option value="process_step">Process Step</option>
            <option value="differentiator">Differentiator</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ContentStatus | 'all')}
            style={{ ...inputStyle, maxWidth: 160, padding: '8px 14px' }}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Content list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height: 100, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '64px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              {search || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'No content matches your filters.'
                : 'No studio content yet. Add your first service description or process step.'}
            </p>
            {!search && typeFilter === 'all' && statusFilter === 'all' && (
              <button
                onClick={() => { setEditItem({ type: 'service', status: 'draft', order_index: 0 }); setShowForm(true) }}
                style={{ background: 'none', border: 'none', color: ACCENT, fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Add your first item
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((item, idx) => {
              const typeItems = filtered.filter(i => i.type === item.type)
              const typeIdx = typeItems.findIndex(i => i.id === item.id)
              return (
                <div key={item.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  {/* Reorder arrows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0, marginTop: 2 }}>
                    <button
                      onClick={() => moveOrder(item.id, 'up')}
                      disabled={typeIdx === 0}
                      style={{ background: 'none', border: 'none', color: typeIdx === 0 ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: typeIdx === 0 ? 'default' : 'pointer', padding: 2, lineHeight: 1, opacity: typeIdx === 0 ? 0.3 : 1 }}
                      aria-label="Move up"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                    </button>
                    <button
                      onClick={() => moveOrder(item.id, 'down')}
                      disabled={typeIdx === typeItems.length - 1}
                      style={{ background: 'none', border: 'none', color: typeIdx === typeItems.length - 1 ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: typeIdx === typeItems.length - 1 ? 'default' : 'pointer', padding: 2, lineHeight: 1, opacity: typeIdx === typeItems.length - 1 ? 0.3 : 1 }}
                      aria-label="Move down"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                  </div>

                  {/* Main content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{item.title}</h3>
                      <span style={{ background: `${TYPE_COLORS[item.type]}20`, color: TYPE_COLORS[item.type], borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                        {TYPE_LABELS[item.type]}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 8 }}>
                      {item.description}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        order: {item.order_index}
                      </span>
                      {item.tags && item.tags.length > 0 && item.tags.map(tag => (
                        <span key={tag} style={{ background: `${ACCENT}12`, color: ACCENT, borderRadius: 100, padding: '1px 7px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
                    <select
                      value={item.status}
                      onChange={e => updateStatus(item.id, e.target.value as ContentStatus)}
                      onClick={e => e.stopPropagation()}
                      style={{ background: `${STATUS_COLORS[item.status]}15`, border: `1px solid ${STATUS_COLORS[item.status]}40`, color: STATUS_COLORS[item.status], borderRadius: 100, padding: '3px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="draft">Draft</option>
                      <option value="review">Review</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => { setEditItem(item); setShowForm(true) }}
                        style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontFamily: 'var(--font-body)', fontSize: '0.78rem', cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 5 }}
                        aria-label="Delete"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal */}
        {showForm && editItem !== null && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {editItem.id ? 'Edit' : 'New'} Studio Content
                </h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <StudioContentForm
                item={editItem}
                onSave={saveItem}
                onCancel={() => { setShowForm(false); setEditItem(null) }}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
                accent={ACCENT}
              />
            </div>
          </div>
        )}
      </div>
    </CMSShell>
  )
}

function StudioContentForm({
  item,
  onSave,
  onCancel,
  inputStyle,
  labelStyle,
  accent,
}: {
  item: Partial<CMSStudioContent>
  onSave: (item: Partial<CMSStudioContent>) => void
  onCancel: () => void
  inputStyle: React.CSSProperties
  labelStyle: React.CSSProperties
  accent: string
}) {
  const [form, setForm] = useState<Partial<CMSStudioContent>>({
    title: '',
    type: 'service',
    description: '',
    body: '',
    order_index: 0,
    status: 'draft',
    tags: [],
    ...item,
  })
  const [tagsText, setTagsText] = useState((item.tags ?? []).join(', '))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={labelStyle}>Title *</label>
        <input
          style={inputStyle}
          value={form.title ?? ''}
          onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          placeholder="e.g. Product Development"
        />
      </div>
      <div>
        <label style={labelStyle}>Type</label>
        <select
          style={inputStyle}
          value={form.type ?? 'service'}
          onChange={e => setForm(p => ({ ...p, type: e.target.value as StudioContentType }))}
        >
          <option value="service">Service</option>
          <option value="highlight">Highlight</option>
          <option value="process_step">Process Step</option>
          <option value="differentiator">Differentiator</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Description *</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties}
          rows={3}
          value={form.description ?? ''}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          placeholder="Brief description shown on cards and listings"
        />
      </div>
      <div>
        <label style={labelStyle}>Extended content (optional)</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties}
          rows={5}
          value={form.body ?? ''}
          onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
          placeholder="Full details, used on dedicated pages or expanded panels"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Order Index</label>
          <input
            type="number"
            min="0"
            style={inputStyle}
            value={form.order_index ?? 0}
            onChange={e => setForm(p => ({ ...p, order_index: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select
            style={inputStyle}
            value={form.status ?? 'draft'}
            onChange={e => setForm(p => ({ ...p, status: e.target.value as ContentStatus }))}
          >
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Tags (comma-separated)</label>
        <input
          style={inputStyle}
          value={tagsText}
          onChange={e => { setTagsText(e.target.value); setForm(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })) }}
          placeholder="e.g. AI, React, Mobile"
        />
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          onClick={onCancel}
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={!form.title || !form.description}
          style={{ background: `linear-gradient(135deg, #3A589E, ${accent})`, color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', opacity: (!form.title || !form.description) ? 0.5 : 1 }}
        >
          Save Content
        </button>
      </div>
    </div>
  )
}
