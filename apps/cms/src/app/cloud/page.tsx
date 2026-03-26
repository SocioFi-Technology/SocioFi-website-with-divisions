'use client'

import { useEffect, useState, useCallback } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/divisions'
import type { CMSPricing, CMSFAQ, ContentStatus } from '@/lib/types'

type Tab = 'pricing' | 'faqs'

export default function CloudCMSPage() {
  const [tab, setTab] = useState<Tab>('pricing')
  const [pricing, setPricing] = useState<CMSPricing[]>([])
  const [faqs, setFaqs] = useState<CMSFAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Partial<CMSPricing & CMSFAQ> | null>(null)

  const ACCENT = '#5BB5E0'

  const fetchData = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setLoading(false); return }
    setLoading(true)
    const [{ data: pric }, { data: faq }] = await Promise.all([
      client.from('cms_pricing').select('*').eq('division', 'cloud').order('price'),
      client.from('cms_faqs').select('*').eq('division', 'cloud').order('order_index'),
    ])
    setPricing((pric as CMSPricing[]) ?? [])
    setFaqs((faq as CMSFAQ[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function savePricing(item: Partial<CMSPricing>) {
    const client = getSupabaseClient()
    if (!client) { setShowForm(false); return }
    const payload = { ...item, division: 'cloud', updated_at: new Date().toISOString() }
    if (item.id) await client.from('cms_pricing').update(payload).eq('id', item.id)
    else await client.from('cms_pricing').insert({ ...payload, created_at: new Date().toISOString() })
    setShowForm(false); setEditItem(null); fetchData()
  }

  async function saveFaq(item: Partial<CMSFAQ>) {
    const client = getSupabaseClient()
    if (!client) { setShowForm(false); return }
    const payload = { ...item, division: 'cloud', updated_at: new Date().toISOString() }
    if (item.id) await client.from('cms_faqs').update(payload).eq('id', item.id)
    else await client.from('cms_faqs').insert({ ...payload, created_at: new Date().toISOString() })
    setShowForm(false); setEditItem(null); fetchData()
  }

  async function deletePricing(id: string) {
    if (!confirm('Delete this plan?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_pricing').delete().eq('id', id)
    fetchData()
  }

  async function deleteFaq(id: string) {
    if (!confirm('Delete this FAQ?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_faqs').delete().eq('id', id)
    fetchData()
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Cloud</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Cloud Content</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>Hosting plans and frequently asked questions</p>
          </div>
          <button onClick={() => { setEditItem({}); setShowForm(true) }} style={{ background: `linear-gradient(135deg, #3A589E, ${ACCENT})`, color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 22px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add {tab === 'pricing' ? 'Plan' : 'FAQ'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          {(['pricing', 'faqs'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', borderBottom: tab === t ? `2px solid ${ACCENT}` : '2px solid transparent', color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: tab === t ? 600 : 400, padding: '10px 20px', cursor: 'pointer', marginBottom: -1, textTransform: 'capitalize' }}>
              {t === 'pricing' ? `Hosting Plans (${pricing.length})` : `FAQs (${faqs.length})`}
            </button>
          ))}
        </div>

        {tab === 'pricing' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {loading ? [1,2,3].map(i => <div key={i} style={{ height: 200, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />) :
              pricing.length === 0 ? <div style={{ gridColumn: '1/-1', padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No hosting plans yet.</div> :
              pricing.map(p => (
                <div key={p.id} style={{ background: 'var(--bg-card)', border: p.is_featured ? `2px solid ${ACCENT}` : '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '22px 24px', position: 'relative' }}>
                  {p.is_featured && <div style={{ position: 'absolute', top: -10, left: 16, background: ACCENT, color: 'white', borderRadius: 100, padding: '2px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600 }}>POPULAR</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: ACCENT, marginTop: 4 }}>
                        ${p.price}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/{p.billing_period ?? 'mo'}</span>
                      </div>
                    </div>
                    <span style={{ background: `${STATUS_COLORS[p.status]}15`, color: STATUS_COLORS[p.status], borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>{STATUS_LABELS[p.status]}</span>
                  </div>
                  {p.description && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 10 }}>{p.description}</div>}
                  {p.features && <ul style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: 16, margin: '0 0 14px' }}>
                    {p.features.slice(0, 3).map((f, i) => <li key={i}>{f}</li>)}
                    {p.features.length > 3 && <li>+{p.features.length - 3} more</li>}
                  </ul>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setEditItem(p as Partial<CMSPricing & CMSFAQ>); setShowForm(true) }} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontFamily: 'var(--font-body)', fontSize: '0.8rem', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deletePricing(p.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {tab === 'faqs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading ? [1,2,3].map(i => <div key={i} style={{ height: 80, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />) :
              faqs.length === 0 ? <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No FAQs yet.</div> :
              faqs.map((faq, i) => (
                <div key={faq.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: 24, paddingTop: 2 }}>#{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{faq.question}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{faq.answer}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ background: `${STATUS_COLORS[faq.status]}15`, color: STATUS_COLORS[faq.status], borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>{STATUS_LABELS[faq.status]}</span>
                    <button onClick={() => { setEditItem(faq as Partial<CMSPricing & CMSFAQ>); setShowForm(true) }} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', fontFamily: 'var(--font-body)', fontSize: '0.78rem', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteFaq(faq.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
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
                  {editItem.id ? 'Edit' : 'New'} {tab === 'pricing' ? 'Hosting Plan' : 'FAQ'}
                </h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              {tab === 'pricing' ? (
                <PricingForm item={editItem as Partial<CMSPricing>} onSave={savePricing} onCancel={() => setShowForm(false)} inputStyle={inputStyle} labelStyle={labelStyle} accent={ACCENT} />
              ) : (
                <FAQForm item={editItem as Partial<CMSFAQ>} onSave={saveFaq} onCancel={() => setShowForm(false)} inputStyle={inputStyle} labelStyle={labelStyle} accent={ACCENT} />
              )}
            </div>
          </div>
        )}
      </div>
    </CMSShell>
  )
}

function PricingForm({ item, onSave, onCancel, inputStyle, labelStyle, accent }: { item: Partial<CMSPricing>; onSave: (i: Partial<CMSPricing>) => void; onCancel: () => void; inputStyle: React.CSSProperties; labelStyle: React.CSSProperties; accent: string }) {
  const [form, setForm] = useState<Partial<CMSPricing>>({ name: '', slug: '', price: 0, billing_period: 'month', status: 'draft', features: [], is_featured: false, cta_text: 'Get Started', ...item })
  const [featuresText, setFeaturesText] = useState((item.features ?? []).join('\n'))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label style={labelStyle}>Plan Name *</label><input style={inputStyle} value={form.name ?? ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
      <div><label style={labelStyle}>Slug *</label><input style={inputStyle} value={form.slug ?? ''} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={labelStyle}>Price (USD/mo) *</label><input type="number" style={inputStyle} value={form.price ?? 0} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} /></div>
        <div><label style={labelStyle}>Billing Period</label>
          <select style={inputStyle} value={form.billing_period ?? 'month'} onChange={e => setForm(p => ({ ...p, billing_period: e.target.value }))}>
            <option value="month">Monthly</option><option value="year">Yearly</option><option value="one-time">One-time</option>
          </select>
        </div>
      </div>
      <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={2} value={form.description ?? ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
      <div><label style={labelStyle}>Features / Specs (one per line)</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={6} placeholder="2 vCPUs&#10;4 GB RAM&#10;50 GB SSD&#10;99.9% uptime SLA" value={featuresText} onChange={e => { setFeaturesText(e.target.value); setForm(p => ({ ...p, features: e.target.value.split('\n').filter(Boolean) })) }} /></div>
      <div><label style={labelStyle}>CTA Button Text</label><input style={inputStyle} value={form.cta_text ?? ''} onChange={e => setForm(p => ({ ...p, cta_text: e.target.value }))} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status ?? 'draft'} onChange={e => setForm(p => ({ ...p, status: e.target.value as ContentStatus }))}>
            <option value="draft">Draft</option><option value="published">Published</option>
          </select>
        </div>
        <div style={{ paddingTop: 22 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            <input type="checkbox" checked={form.is_featured ?? false} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} />
            Popular plan
          </label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onCancel} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
        <button onClick={() => onSave(form)} style={{ background: `linear-gradient(135deg, #3A589E, ${accent})`, color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Save</button>
      </div>
    </div>
  )
}

function FAQForm({ item, onSave, onCancel, inputStyle, labelStyle, accent }: { item: Partial<CMSFAQ>; onSave: (i: Partial<CMSFAQ>) => void; onCancel: () => void; inputStyle: React.CSSProperties; labelStyle: React.CSSProperties; accent: string }) {
  const [form, setForm] = useState<Partial<CMSFAQ>>({ question: '', answer: '', status: 'published', order_index: 0, ...item })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label style={labelStyle}>Question *</label><input style={inputStyle} value={form.question ?? ''} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} /></div>
      <div><label style={labelStyle}>Answer *</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={5} value={form.answer ?? ''} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={labelStyle}>Order</label><input type="number" style={inputStyle} value={form.order_index ?? 0} onChange={e => setForm(p => ({ ...p, order_index: Number(e.target.value) }))} /></div>
        <div><label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status ?? 'published'} onChange={e => setForm(p => ({ ...p, status: e.target.value as ContentStatus }))}>
            <option value="draft">Draft</option><option value="published">Published</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onCancel} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
        <button onClick={() => onSave(form)} disabled={!form.question || !form.answer} style={{ background: `linear-gradient(135deg, #3A589E, ${accent})`, color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Save</button>
      </div>
    </div>
  )
}
