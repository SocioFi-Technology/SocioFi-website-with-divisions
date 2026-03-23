'use client'

import { useState, useMemo } from 'react'
import type { Workshop, WorkshopFormat } from '@/lib/admin/types'
import { MOCK_WORKSHOPS } from '@/lib/admin/mock-data'

const ACCENT = '#E8B84D'

const STYLES = `
  @keyframes wFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes wSpin { to { transform: rotate(360deg); } }
`

const FORMAT_COLORS: Record<WorkshopFormat, string> = {
  virtual:   '#6BA3E8',
  in_person: '#E8916F',
  hybrid:    '#4DBFA8',
}

const STATUS_COLORS: Record<string, string> = {
  published: '#4ade80',
  draft:     '#64748B',
  cancelled: '#EF4444',
  completed: '#6BA3E8',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function SeatBar({ registered, max, waitlist }: { registered: number; max: number; waitlist: number }) {
  const pct = (registered / max) * 100
  const color = pct < 70 ? '#4ade80' : pct < 90 ? '#E8B84D' : '#EF4444'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
          {registered}/{max}
          {waitlist > 0 && <span style={{ color: '#64748B' }}> (+{waitlist} waitlist)</span>}
        </span>
        <span style={{ fontSize: '0.72rem', color }}>
          {Math.round(pct)}%
        </span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  )
}

// ─── Create Workshop Modal ────────────────────────────────────────────────────

function CreateWorkshopModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ title: '', date: '', time: '', format: 'virtual', maxSeats: '', price: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleCreate = () => {
    if (!form.title || !form.date) return
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true) }, 1000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 520, padding: '28px 30px', animation: 'wFadeIn 0.2s ease', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ACCENT},transparent)` }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif" }}>Create Workshop</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {saved ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#4ade8018', border: '1px solid #4ade8040', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#4ade80' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", marginBottom: 6 }}>Workshop Created</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: 20 }}>"{form.title}" has been created as a draft.</div>
            <button onClick={onClose} style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}40`, color: ACCENT, borderRadius: 8, padding: '9px 22px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6 }}>Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Workshop title" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6 }}>Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ width: '100%', background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6 }}>Time</label>
                  <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} style={{ width: '100%', background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6 }}>Format</label>
                  <select value={form.format} onChange={e => setForm(p => ({ ...p, format: e.target.value }))} style={{ width: '100%', background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none' }}>
                    <option value="virtual">Virtual</option>
                    <option value="in_person">In-Person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6 }}>Max Seats</label>
                  <input type="number" value={form.maxSeats} onChange={e => setForm(p => ({ ...p, maxSeats: e.target.value }))} placeholder="50" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6 }}>Price ($) — Enter 0 for free</label>
                <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="What attendees will learn and do..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>
            <button
              onClick={handleCreate}
              disabled={saving || !form.title || !form.date}
              style={{ marginTop: 18, width: '100%', background: form.title && form.date ? `${ACCENT}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${form.title && form.date ? ACCENT + '50' : 'rgba(255,255,255,0.06)'}`, color: form.title && form.date ? ACCENT : '#475569', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: '0.85rem', cursor: form.title && form.date ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {saving ? <><span style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${ACCENT}40`, borderTop: `2px solid ${ACCENT}`, animation: 'wSpin 0.8s linear infinite', display: 'inline-block' }} />Creating...</> : 'Create Workshop'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkshopsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all')
  const [formatFilter, setFormatFilter] = useState<'all' | WorkshopFormat>('all')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = useMemo(() => {
    return MOCK_WORKSHOPS.filter(w => {
      const matchStatus = statusFilter === 'all' || w.status === statusFilter
      const matchFormat = formatFilter === 'all' || w.format === formatFilter
      return matchStatus && matchFormat
    })
  }, [statusFilter, formatFilter])

  const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'published', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

  const formatFilters: Array<{ key: 'all' | WorkshopFormat; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'virtual', label: 'Virtual' },
    { key: 'in_person', label: 'In-Person' },
    { key: 'hybrid', label: 'Hybrid' },
  ]

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1280, margin: '0 auto' }}>
      <style>{STYLES}</style>
      {showCreate && <CreateWorkshopModal onClose={() => setShowCreate(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'Fira Code', monospace", marginBottom: 6 }}>Academy</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", margin: 0 }}>Workshops</h1>
        </div>
        <button onClick={() => setShowCreate(true)} style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}40`, color: ACCENT, borderRadius: 8, padding: '9px 18px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
          + Create Workshop
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {statusFilters.map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{ background: statusFilter === f.key ? `${ACCENT}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${statusFilter === f.key ? ACCENT + '50' : 'rgba(255,255,255,0.07)'}`, color: statusFilter === f.key ? ACCENT : '#64748B', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer' }}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {formatFilters.map(f => (
            <button key={f.key} onClick={() => setFormatFilter(f.key)} style={{ background: formatFilter === f.key ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${formatFilter === f.key ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`, color: formatFilter === f.key ? '#E2E8F0' : '#64748B', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        {/* Header Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.2fr 0.9fr 1.6fr 0.7fr 0.9fr 0.9fr', gap: 0, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
          {['Title', 'Date & Time', 'Format', 'Seats', 'Price', 'Status', 'Actions'].map(h => (
            <div key={h} style={{ fontSize: '0.68rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Fira Code', monospace" }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((w, i) => {
          const formatColor = FORMAT_COLORS[w.format]
          const statusColor = STATUS_COLORS[w.status] || '#64748B'
          const formatLabel = { virtual: 'Virtual', in_person: 'In-Person', hybrid: 'Hybrid' }[w.format]
          return (
            <div key={w.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.2fr 0.9fr 1.6fr 0.7fr 0.9fr 0.9fr', gap: 0, padding: '14px 20px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
              {/* Title */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: 2 }}>{w.title}</div>
                <div style={{ fontSize: '0.72rem', color: '#475569' }}>{w.instructor_name} · {w.duration_min} min</div>
              </div>

              {/* Date & Time */}
              <div>
                <div style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>{formatDate(w.date)}</div>
                <div style={{ fontSize: '0.72rem', color: '#475569' }}>{w.time}</div>
              </div>

              {/* Format */}
              <div>
                <span style={{ background: `${formatColor}18`, border: `1px solid ${formatColor}35`, color: formatColor, borderRadius: 100, padding: '2px 9px', fontSize: '0.68rem' }}>
                  {formatLabel}
                </span>
              </div>

              {/* Seats */}
              <div style={{ paddingRight: 12 }}>
                <SeatBar registered={w.registered_count} max={w.max_seats} waitlist={w.waitlist_count} />
              </div>

              {/* Price */}
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: w.price_usd === 0 ? '#4ade80' : '#E2E8F0' }}>
                {w.price_usd === 0 ? 'Free' : `$${w.price_usd}`}
              </div>

              {/* Status */}
              <div>
                <span style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}30`, color: statusColor, borderRadius: 100, padding: '2px 9px', fontSize: '0.68rem' }}>
                  {w.status}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#94A3B8', borderRadius: 6, padding: '4px 10px', fontSize: '0.72rem', cursor: 'pointer' }}>
                  View →
                </button>
                <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#64748B', borderRadius: 6, padding: '4px 10px', fontSize: '0.72rem', cursor: 'pointer' }}>
                  Edit
                </button>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#475569', fontSize: '0.82rem' }}>No workshops match the current filters.</div>
        )}
      </div>
    </div>
  )
}
