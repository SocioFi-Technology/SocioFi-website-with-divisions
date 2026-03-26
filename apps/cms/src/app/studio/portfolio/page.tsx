'use client'

import { useEffect, useState, useCallback } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import { STATUS_COLORS } from '@/lib/divisions'
import type { ContentStatus } from '@/lib/types'

type PortfolioDivision = 'studio' | 'services' | 'labs' | 'products' | 'academy' | 'ventures' | 'cloud'
type PortfolioStatus = 'draft' | 'review' | 'published' | 'archived'

interface CMSPortfolioItem {
  id: string
  title: string
  slug: string
  client_name?: string
  client_industry?: string
  excerpt: string
  challenge?: string
  solution?: string
  results?: string[]
  tech_stack?: string[]
  division: PortfolioDivision
  featured: boolean
  status: PortfolioStatus
  published_at?: string
  created_at: string
  updated_at?: string
}

const DIVISION_ACCENTS: Record<PortfolioDivision, string> = {
  studio: '#72C4B2',
  services: '#4DBFA8',
  labs: '#7B6FE8',
  products: '#E8916F',
  academy: '#E8B84D',
  ventures: '#6BA3E8',
  cloud: '#5BB5E0',
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function PortfolioCMSPage() {
  const [items, setItems] = useState<CMSPortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Partial<CMSPortfolioItem> | null>(null)
  const [search, setSearch] = useState('')
  const [divisionFilter, setDivisionFilter] = useState<PortfolioDivision | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<PortfolioStatus | 'all'>('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  const ACCENT = '#72C4B2'

  const fetchData = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setLoading(false); return }
    setLoading(true)
    const { data } = await client
      .from('cms_portfolio')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
    setItems((data as CMSPortfolioItem[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function updateStatus(id: string, status: ContentStatus) {
    const client = getSupabaseClient()
    if (!client) return
    const payload: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
    if (status === 'published') payload.published_at = new Date().toISOString()
    await client.from('cms_portfolio').update(payload).eq('id', id)
    fetchData()
  }

  async function toggleFeatured(id: string, current: boolean) {
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_portfolio').update({ featured: !current, updated_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  async function saveItem(item: Partial<CMSPortfolioItem>) {
    const client = getSupabaseClient()
    if (!client) { setShowForm(false); return }
    const payload = { ...item, updated_at: new Date().toISOString() }
    if (item.id) {
      await client.from('cms_portfolio').update(payload).eq('id', item.id)
    } else {
      await client.from('cms_portfolio').insert({ ...payload, created_at: new Date().toISOString() })
    }
    setShowForm(false); setEditItem(null); fetchData()
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this portfolio project?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_portfolio').delete().eq('id', id)
    fetchData()
  }

  const filtered = items.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || (i.client_name ?? '').toLowerCase().includes(search.toLowerCase()) || i.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchDiv = divisionFilter === 'all' || i.division === divisionFilter
    const matchStatus = statusFilter === 'all' || i.status === statusFilter
    const matchFeatured = !featuredOnly || i.featured
    return matchSearch && matchDiv && matchStatus && matchFeatured
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
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Portfolio</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Portfolio & Case Studies</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>
              {items.length} project{items.length !== 1 ? 's' : ''} · {items.filter(i => i.featured).length} featured · {items.filter(i => i.status === 'published').length} published
            </p>
          </div>
          <button
            onClick={() => { setEditItem({ division: 'studio', status: 'draft', featured: false }); setShowForm(true) }}
            style={{ background: `linear-gradient(135deg, #3A589E, ${ACCENT})`, color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 22px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Project
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            style={{ ...inputStyle, maxWidth: 240, padding: '8px 14px' }}
          />
          <select
            value={divisionFilter}
            onChange={e => setDivisionFilter(e.target.value as PortfolioDivision | 'all')}
            style={{ ...inputStyle, maxWidth: 160, padding: '8px 14px' }}
          >
            <option value="all">All Divisions</option>
            <option value="studio">Studio</option>
            <option value="services">Services</option>
            <option value="labs">Labs</option>
            <option value="products">Products</option>
            <option value="academy">Academy</option>
            <option value="ventures">Ventures</option>
            <option value="cloud">Cloud</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as PortfolioStatus | 'all')}
            style={{ ...inputStyle, maxWidth: 160, padding: '8px 14px' }}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={() => setFeaturedOnly(f => !f)}
            style={{ background: featuredOnly ? `${ACCENT}20` : 'var(--bg-card)', border: `1px solid ${featuredOnly ? ACCENT : 'var(--border)'}`, color: featuredOnly ? ACCENT : 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', transition: 'all 0.2s' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={featuredOnly ? ACCENT : 'none'} stroke={featuredOnly ? ACCENT : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Featured only
          </button>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: 200, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '64px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 12 }}>
              {search || divisionFilter !== 'all' || statusFilter !== 'all' || featuredOnly
                ? 'No projects match your filters.'
                : 'No portfolio projects yet. Add your first case study.'}
            </p>
            {!search && divisionFilter === 'all' && statusFilter === 'all' && !featuredOnly && (
              <button
                onClick={() => { setEditItem({ division: 'studio', status: 'draft', featured: false }); setShowForm(true) }}
                style={{ background: 'none', border: 'none', color: ACCENT, fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Add your first project
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map(item => {
              const divAccent = DIVISION_ACCENTS[item.division] ?? ACCENT
              return (
                <div key={item.id} style={{ background: 'var(--bg-card)', border: `1px solid ${item.featured ? `${ACCENT}40` : 'var(--border)'}`, borderRadius: 'var(--radius-md)', padding: '20px 22px', position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Featured star */}
                  {item.featured && (
                    <div style={{ position: 'absolute', top: 14, right: 14 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Featured">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </div>
                  )}

                  {/* Title row */}
                  <div style={{ paddingRight: item.featured ? 24 : 0 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>{item.title}</h3>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {item.client_name ?? 'Anonymous client'}
                      {item.client_industry && ` · ${item.client_industry}`}
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.55 }}>
                    {item.excerpt}
                  </div>

                  {/* Tech stack pills */}
                  {item.tech_stack && item.tech_stack.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {item.tech_stack.slice(0, 3).map(tech => (
                        <span key={tech} style={{ background: `${divAccent}15`, color: divAccent, borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>{tech}</span>
                      ))}
                      {item.tech_stack.length > 3 && (
                        <span style={{ background: 'var(--bg-3)', color: 'var(--text-muted)', borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>+{item.tech_stack.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Bottom row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: `${divAccent}18`, color: divAccent, borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'capitalize' }}>{item.division}</span>
                      <select
                        value={item.status}
                        onChange={e => updateStatus(item.id, e.target.value as ContentStatus)}
                        onClick={e => e.stopPropagation()}
                        style={{ background: `${STATUS_COLORS[item.status]}15`, border: `1px solid ${STATUS_COLORS[item.status]}40`, color: STATUS_COLORS[item.status], borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="draft">Draft</option>
                        <option value="review">Review</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <button
                        onClick={() => toggleFeatured(item.id, item.featured)}
                        title={item.featured ? 'Unfeature' : 'Mark Featured'}
                        style={{ background: item.featured ? `${ACCENT}20` : 'var(--bg-2)', border: `1px solid ${item.featured ? ACCENT : 'var(--border)'}`, color: item.featured ? ACCENT : 'var(--text-muted)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', fontSize: '0.72rem', transition: 'all 0.2s' }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill={item.featured ? ACCENT : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        {item.featured ? 'Featured' : 'Feature'}
                      </button>
                      <button
                        onClick={() => { setEditItem(item); setShowForm(true) }}
                        style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', fontFamily: 'var(--font-body)', fontSize: '0.78rem', cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
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
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', width: '100%', maxWidth: 720, maxHeight: '92vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {editItem.id ? 'Edit Project' : 'New Portfolio Project'}
                </h2>
                <button onClick={() => { setShowForm(false); setEditItem(null) }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <PortfolioForm
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

function PortfolioForm({
  item,
  onSave,
  onCancel,
  inputStyle,
  labelStyle,
  accent,
}: {
  item: Partial<CMSPortfolioItem>
  onSave: (item: Partial<CMSPortfolioItem>) => void
  onCancel: () => void
  inputStyle: React.CSSProperties
  labelStyle: React.CSSProperties
  accent: string
}) {
  const [form, setForm] = useState<Partial<CMSPortfolioItem>>({
    title: '',
    slug: '',
    client_name: '',
    client_industry: '',
    excerpt: '',
    challenge: '',
    solution: '',
    results: [],
    tech_stack: [],
    division: 'studio',
    featured: false,
    status: 'draft',
    ...item,
  })
  const [resultsText, setResultsText] = useState((item.results ?? []).join('\n'))
  const [techText, setTechText] = useState((item.tech_stack ?? []).join(', '))
  const [autoSlug, setAutoSlug] = useState(!item.id)

  function handleTitleChange(value: string) {
    const next: Partial<CMSPortfolioItem> = { ...form, title: value }
    if (autoSlug) next.slug = slugify(value)
    setForm(next)
  }

  function handleSlugChange(value: string) {
    setAutoSlug(false)
    setForm(p => ({ ...p, slug: value }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Title + Slug */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Title *</label>
          <input
            style={inputStyle}
            value={form.title ?? ''}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="e.g. AI-powered inventory system for mid-size retailer"
          />
        </div>
        <div>
          <label style={labelStyle}>Slug *</label>
          <input
            style={inputStyle}
            value={form.slug ?? ''}
            onChange={e => handleSlugChange(e.target.value)}
            placeholder="auto-generated-from-title"
          />
        </div>
        <div>
          <label style={labelStyle}>Division</label>
          <select
            style={inputStyle}
            value={form.division ?? 'studio'}
            onChange={e => setForm(p => ({ ...p, division: e.target.value as PortfolioDivision }))}
          >
            <option value="studio">Studio</option>
            <option value="services">Services</option>
            <option value="labs">Labs</option>
            <option value="products">Products</option>
            <option value="academy">Academy</option>
            <option value="ventures">Ventures</option>
            <option value="cloud">Cloud</option>
          </select>
        </div>
      </div>

      {/* Client info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Client name (optional)</label>
          <input
            style={inputStyle}
            value={form.client_name ?? ''}
            onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))}
            placeholder="Leave blank for anonymous"
          />
        </div>
        <div>
          <label style={labelStyle}>Client industry (optional)</label>
          <input
            style={inputStyle}
            value={form.client_industry ?? ''}
            onChange={e => setForm(p => ({ ...p, client_industry: e.target.value }))}
            placeholder="e.g. Retail, HealthTech, Fintech"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label style={labelStyle}>Excerpt *</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties}
          rows={2}
          value={form.excerpt ?? ''}
          onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
          placeholder="One-paragraph summary shown on cards and listings"
        />
      </div>

      {/* Challenge + Solution */}
      <div>
        <label style={labelStyle}>Challenge (optional)</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties}
          rows={3}
          value={form.challenge ?? ''}
          onChange={e => setForm(p => ({ ...p, challenge: e.target.value }))}
          placeholder="What problem did the client have?"
        />
      </div>
      <div>
        <label style={labelStyle}>Solution (optional)</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties}
          rows={3}
          value={form.solution ?? ''}
          onChange={e => setForm(p => ({ ...p, solution: e.target.value }))}
          placeholder="What did SocioFi build or implement?"
        />
      </div>

      {/* Results */}
      <div>
        <label style={labelStyle}>Results (one per line)</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties}
          rows={3}
          value={resultsText}
          onChange={e => { setResultsText(e.target.value); setForm(p => ({ ...p, results: e.target.value.split('\n').filter(Boolean) })) }}
          placeholder="3x faster deployment&#10;Reduced support tickets by 40%&#10;Shipped in 6 weeks"
        />
        {form.results && form.results.length > 0 && (
          <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>{form.results.length} result{form.results.length !== 1 ? 's' : ''}</div>
        )}
      </div>

      {/* Tech stack */}
      <div>
        <label style={labelStyle}>Tech stack (comma-separated)</label>
        <input
          style={inputStyle}
          value={techText}
          onChange={e => { setTechText(e.target.value); setForm(p => ({ ...p, tech_stack: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })) }}
          placeholder="Next.js, Python, Supabase, OpenAI"
        />
      </div>

      {/* Status + Featured */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Status</label>
          <select
            style={inputStyle}
            value={form.status ?? 'draft'}
            onChange={e => setForm(p => ({ ...p, status: e.target.value as PortfolioStatus }))}
          >
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
            <div
              onClick={() => setForm(p => ({ ...p, featured: !p.featured }))}
              style={{ width: 36, height: 20, borderRadius: 10, background: form.featured ? accent : 'var(--bg-3)', border: `1px solid ${form.featured ? accent : 'var(--border)'}`, position: 'relative', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
            >
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: form.featured ? 18 : 2, transition: 'left 0.2s' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: form.featured ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              Featured project
            </span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          onClick={onCancel}
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={!form.title || !form.slug || !form.excerpt}
          style={{ background: `linear-gradient(135deg, #3A589E, ${accent})`, color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', opacity: (!form.title || !form.slug || !form.excerpt) ? 0.5 : 1 }}
        >
          Save Project
        </button>
      </div>
    </div>
  )
}
