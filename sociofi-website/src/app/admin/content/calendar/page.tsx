'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import type { CalendarEntry, CalendarEntryStatus, CalendarContentType } from '@/lib/admin/types'
import {
  CALENDAR_TYPE_COLORS,
  CALENDAR_TYPE_LABELS,
  CALENDAR_STATUS_COLORS,
} from '@/lib/admin/types'
import { MOCK_CALENDAR_ENTRIES } from '@/lib/admin/mock-data'

// ─── Constants ────────────────────────────────────────────────────────────────

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DIVISIONS = ['studio','services','labs','products','academy','ventures','cloud']
const CATEGORIES = ['Engineering','Founders','AI','Cloud','Academy','Ventures','Portfolio','Open Source','Company']
const TEAM_MEMBERS = ['Arifur Rahman','Kamrul Hasan','scribe']
const CONTENT_TYPES: CalendarContentType[] = ['blog_post','case_study','newsletter','workshop','video','social','email']

const DIVISION_COLORS: Record<string, string> = {
  studio: '#72C4B2', services: '#4DBFA8', labs: '#A78BFA',
  products: '#E8916F', academy: '#E8B84D', ventures: '#6BA3E8', cloud: '#5BB5E0',
}

const uid = () => `cal-${Date.now()}-${Math.random().toString(36).slice(2,7)}`

// ─── SCRIBE / NEXUS API Stub ──────────────────────────────────────────────────

type ScribeAction = 'generate_outline' | 'generate_draft' | 'generate_monthly_plan'

interface ScribePlanItem {
  title: string
  content_type: CalendarContentType
  category: string
  division: string
  target_date: string
  keywords: string[]
  outline: string
}

async function callNexusScribe(action: ScribeAction, payload: Record<string, unknown>): Promise<unknown> {
  await new Promise(r => setTimeout(r, 1800 + Math.random() * 800))

  if (action === 'generate_monthly_plan') {
    const { month, year } = payload as { month: number; year: number }
    const pad = (d: number) =>
      `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const plan: ScribePlanItem[] = [
      { title: 'How to go from AI prototype to production app',    content_type: 'blog_post',  category: 'Engineering', division: 'studio',   target_date: pad(2),  keywords: ['AI','production','deployment'], outline: '1. The prototype gap\n2. What breaks first\n3. The SocioFi process' },
      { title: 'The solo founder\'s survival guide to DevOps',     content_type: 'blog_post',  category: 'Founders',    division: 'studio',   target_date: pad(5),  keywords: ['DevOps','founders','CI/CD'], outline: '1. Why DevOps matters\n2. Essential tools\n3. When to delegate' },
      { title: 'Managed cloud vs DIY AWS — real numbers',          content_type: 'blog_post',  category: 'Cloud',       division: 'cloud',    target_date: pad(8),  keywords: ['cloud','AWS','cost'], outline: '1. Hidden AWS costs\n2. Time cost\n3. Total cost of ownership' },
      { title: 'Client spotlight: how DataSync cut infra costs 40%', content_type: 'case_study', category: 'Portfolio', division: 'cloud',  target_date: pad(10), keywords: ['case study','cloud'], outline: '' },
      { title: 'Monthly newsletter: new projects & lab updates',   content_type: 'newsletter', category: 'Company',     division: 'studio',   target_date: pad(12), keywords: ['newsletter','updates'], outline: '' },
      { title: 'Understanding AI agent architectures in 2026',     content_type: 'blog_post',  category: 'AI',          division: 'labs',     target_date: pad(14), keywords: ['AI agents','architecture','2026'], outline: '1. Tool-use\n2. Memory\n3. Multi-agent\n4. NEXUS approach' },
      { title: 'Announcing the Q3 AI Engineering Bootcamp',        content_type: 'newsletter', category: 'Academy',     division: 'academy',  target_date: pad(16), keywords: ['bootcamp','academy'], outline: '' },
      { title: 'Ventures portfolio deep-dive: Q1 performance',     content_type: 'case_study', category: 'Ventures',   division: 'ventures', target_date: pad(18), keywords: ['ventures','portfolio','Q1'], outline: '' },
      { title: 'Free live workshop: build your first AI agent',    content_type: 'workshop',   category: 'Academy',     division: 'academy',  target_date: pad(21), keywords: ['workshop','AI agent','free'], outline: '' },
      { title: 'Next.js 15 vs Remix — which should you pick?',    content_type: 'blog_post',  category: 'Engineering', division: 'studio',   target_date: pad(24), keywords: ['Next.js','Remix','framework'], outline: '1. Feature comparison\n2. DX\n3. Our recommendation' },
      { title: 'Open sourcing our internal AI utilities',          content_type: 'blog_post',  category: 'Open Source', division: 'labs',     target_date: pad(27), keywords: ['open source','GitHub','AI'], outline: '' },
      { title: 'End-of-month update email to subscribers',         content_type: 'email',      category: 'Company',     division: 'studio',   target_date: pad(30), keywords: ['email','monthly'], outline: '' },
    ]
    return plan
  }

  if (action === 'generate_outline') {
    const entry = payload.entry as CalendarEntry
    return {
      outline: `1. Introduction — why ${entry.keywords[0] ?? entry.title} matters today\n2. The core problem this addresses\n3. Key insights and data\n4. Practical takeaways\n5. SocioFi perspective and CTA`,
    }
  }

  if (action === 'generate_draft') {
    return { content_id: uid(), status: 'review', word_count: 820 }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7 // Mon = 0
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7
  const days: (Date | null)[] = []
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1
    days.push(dayNum < 1 || dayNum > lastDay.getDate() ? null : new Date(year, month, dayNum))
  }
  return days
}

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function todayISO() { return isoDate(new Date()) }

// ─── Content Pill ─────────────────────────────────────────────────────────────

function ContentPill({ entry, onClick }: { entry: CalendarEntry; onClick: (e: CalendarEntry) => void }) {
  const color = CALENDAR_TYPE_COLORS[entry.content_type] ?? '#64748B'
  const dot = CALENDAR_STATUS_COLORS[entry.status] ?? '#64748B'
  const label = entry.title.length > 20 ? entry.title.slice(0, 19) + '…' : entry.title
  return (
    <button
      onClick={(ev) => { ev.stopPropagation(); onClick(entry) }}
      title={entry.title}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: `${color}18`, border: `1px solid ${color}40`,
        borderRadius: 4, padding: '2px 6px', fontSize: '0.7rem', color,
        fontFamily: "'Outfit', sans-serif", cursor: 'pointer',
        width: '100%', textAlign: 'left', whiteSpace: 'nowrap',
        overflow: 'hidden', marginBottom: 2,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{label}</span>
    </button>
  )
}

// ─── Day Cell ─────────────────────────────────────────────────────────────────

function DayCell({ date, entries, today, onDayClick, onEntryClick }: {
  date: Date | null
  entries: CalendarEntry[]
  today: string
  onDayClick: (d: Date) => void
  onEntryClick: (e: CalendarEntry) => void
}) {
  if (!date) return <div style={{ background: 'rgba(255,255,255,0.015)', minHeight: 100, borderRadius: 6 }} />
  const iso = isoDate(date)
  const isToday = iso === today
  return (
    <div
      style={{
        background: isToday ? 'rgba(89,163,146,0.06)' : 'rgba(255,255,255,0.02)',
        border: isToday ? '1px solid rgba(89,163,146,0.35)' : '1px solid rgba(255,255,255,0.04)',
        borderRadius: 6, minHeight: 100, padding: '6px 7px', cursor: 'pointer', transition: 'background 0.15s',
      }}
      onClick={() => onDayClick(date)}
    >
      <div style={{ fontSize: '0.78rem', fontWeight: isToday ? 700 : 500, color: isToday ? '#59A392' : '#94A3B8', marginBottom: 5, fontFamily: "'Syne', sans-serif" }}>
        {date.getDate()}
      </div>
      {entries.slice(0, 3).map(e => <ContentPill key={e.id} entry={e} onClick={onEntryClick} />)}
      {entries.length > 3 && <div style={{ fontSize: '0.65rem', color: '#64748B', marginTop: 2 }}>+{entries.length - 3} more</div>}
    </div>
  )
}

// ─── Entry Modal ──────────────────────────────────────────────────────────────

function EntryModal({ entry, defaultDate, onClose, onSave, onAssignScribe }: {
  entry?: CalendarEntry | null
  defaultDate?: string
  onClose: () => void
  onSave: (e: CalendarEntry) => void
  onAssignScribe: (e: CalendarEntry) => void
}) {
  const [form, setForm] = useState<Partial<CalendarEntry>>(entry ?? {
    title: '', content_type: 'blog_post', category: 'Engineering', division: 'studio',
    target_date: defaultDate ?? todayISO(), status: 'planned',
    assignee: 'scribe', priority: 'normal', keywords: [], outline: '', notes: '',
  })
  const [kwInput, setKwInput] = useState('')
  const [saving, setSaving] = useState(false)
  const set = (k: keyof CalendarEntry, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const addKw = () => {
    if (!kwInput.trim()) return
    set('keywords', [...(form.keywords ?? []), kwInput.trim()])
    setKwInput('')
  }

  const handleSave = async () => {
    if (!form.title?.trim()) return
    setSaving(true)
    const now = new Date().toISOString()
    const saved: CalendarEntry = {
      id: entry?.id ?? uid(),
      title: form.title!, content_type: form.content_type ?? 'blog_post',
      category: form.category ?? 'Engineering', division: form.division ?? 'studio',
      target_date: form.target_date ?? todayISO(), status: form.status ?? 'planned',
      assignee: form.assignee ?? 'scribe', priority: form.priority ?? 'normal',
      keywords: form.keywords ?? [], outline: form.outline, notes: form.notes,
      created_at: entry?.created_at ?? now, updated_at: now,
    }
    onSave(saved)
    if (saved.assignee === 'scribe' && !entry) onAssignScribe(saved)
    setSaving(false)
  }

  const inp = (label: string, node: React.ReactNode) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: 5, fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
      {node}
    </div>
  )
  const IS: React.CSSProperties = { width: '100%', background: '#0A0E1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', color: '#E2E8F0', fontSize: '0.88rem', fontFamily: "'Outfit', sans-serif", outline: 'none', boxSizing: 'border-box' }
  const SS: React.CSSProperties = { ...IS, cursor: 'pointer' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#E2E8F0' }}>{entry ? 'Edit Calendar Entry' : 'New Calendar Entry'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>
        {inp('Title *', <input value={form.title ?? ''} onChange={e => set('title', e.target.value)} placeholder="What to write about…" style={IS} />)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>{inp('Content Type', <select value={form.content_type} onChange={e => set('content_type', e.target.value as CalendarContentType)} style={SS}>{CONTENT_TYPES.map(t => <option key={t} value={t}>{CALENDAR_TYPE_LABELS[t]}</option>)}</select>)}</div>
          <div>{inp('Division', <select value={form.division} onChange={e => set('division', e.target.value)} style={SS}>{DIVISIONS.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}</select>)}</div>
          <div>{inp('Category', <select value={form.category} onChange={e => set('category', e.target.value)} style={SS}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>)}</div>
          <div>{inp('Target Date', <input type="date" value={form.target_date} onChange={e => set('target_date', e.target.value)} style={{ ...IS, colorScheme: 'dark' }} />)}</div>
          <div>{inp('Assign To', <select value={form.assignee} onChange={e => set('assignee', e.target.value)} style={SS}>{TEAM_MEMBERS.map(m => <option key={m} value={m}>{m === 'scribe' ? 'SCRIBE (AI)' : m}</option>)}</select>)}</div>
          <div>{inp('Priority', <select value={form.priority} onChange={e => set('priority', e.target.value as 'normal'|'important')} style={SS}><option value="normal">Normal</option><option value="important">Important</option></select>)}</div>
        </div>
        {form.assignee === 'scribe' && (
          <div style={{ background: 'rgba(89,163,146,0.08)', border: '1px solid rgba(89,163,146,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: '0.8rem', color: '#72C4B2' }}>
            <strong>SCRIBE automation:</strong> 5 days before target — outline generated. 3 days before — full draft written and queued for review.
          </div>
        )}
        {inp('Keywords',
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <input value={kwInput} onChange={e => setKwInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKw() } }} placeholder="Add keyword, Enter to add…" style={{ ...IS, flex: 1 }} />
              <button onClick={addKw} style={{ background: 'rgba(89,163,146,0.15)', border: '1px solid rgba(89,163,146,0.3)', color: '#59A392', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: '0.85rem' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {(form.keywords ?? []).map((kw, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '3px 10px', fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 5 }}>
                  {kw}
                  <button onClick={() => set('keywords', (form.keywords ?? []).filter((_,j) => j !== i))} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
          </div>
        )}
        {inp('Outline (optional)', <textarea value={form.outline ?? ''} onChange={e => set('outline', e.target.value)} placeholder="Add notes or outline…" rows={3} style={{ ...IS, resize: 'vertical' }} />)}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', borderRadius: 8, padding: '9px 20px', cursor: 'pointer', fontSize: '0.88rem' }}>Cancel</button>
          <button onClick={handleSave} disabled={!form.title?.trim() || saving} style={{ background: saving ? 'rgba(89,163,146,0.3)' : 'linear-gradient(135deg,#3A589E,#59A392)', border: 'none', color: 'white', borderRadius: 8, padding: '9px 24px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
            {saving ? 'Saving…' : entry ? 'Update Entry' : 'Create Entry'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Generate Plan Modal ──────────────────────────────────────────────────────

function GeneratePlanModal({ month, year, onClose, onAccept }: {
  month: number; year: number
  onClose: () => void
  onAccept: (entries: CalendarEntry[]) => void
}) {
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<ScribePlanItem[]>([])
  const [removed, setRemoved] = useState<Set<number>>(new Set())
  const [editing, setEditing] = useState<number | null>(null)
  const calledRef = useRef(false)

  // Trigger SCRIBE on first render
  if (!calledRef.current) {
    calledRef.current = true
    callNexusScribe('generate_monthly_plan', { month, year }).then(res => {
      setPlan(res as ScribePlanItem[])
      setLoading(false)
    })
  }

  const toggle = (i: number) => setRemoved(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })
  const update = (i: number, key: keyof ScribePlanItem, val: string) =>
    setPlan(p => p.map((item, idx) => idx === i ? { ...item, [key]: val } : item))

  const handleAccept = () => {
    const now = new Date().toISOString()
    const entries: CalendarEntry[] = plan
      .filter((_, i) => !removed.has(i))
      .map(item => ({
        id: uid(), title: item.title, content_type: item.content_type,
        category: item.category, division: item.division, target_date: item.target_date,
        status: 'planned' as CalendarEntryStatus, assignee: 'scribe',
        priority: 'normal' as const, keywords: item.keywords, outline: item.outline,
        scribe_stage: 'pending' as const, created_at: now, updated_at: now,
      }))
    onAccept(entries)
  }

  const active = plan.filter((_, i) => !removed.has(i)).length

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, width: '100%', maxWidth: 720, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 32, height: 32, background: 'rgba(123,111,232,0.15)', border: '1px solid rgba(123,111,232,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7B6FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#E2E8F0' }}>SCRIBE Content Plan — {MONTHS[month]} {year}</h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
              {loading ? 'SCRIBE is generating your content plan…' : `${plan.length} topics generated · ${active} selected · Click title to edit`}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '1.3rem' }}>×</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 16 }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(123,111,232,0.15)', borderTop: '3px solid #7B6FE8', animation: 'spin 0.9s linear infinite' }} />
              <div style={{ color: '#7B6FE8', fontSize: '0.88rem', fontFamily: "'Fira Code', monospace" }}>SCRIBE → analyzing divisions → generating {MONTHS[month]} plan…</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {plan.map((item, i) => {
                const isRemoved = removed.has(i)
                const color = CALENDAR_TYPE_COLORS[item.content_type] ?? '#64748B'
                const divColor = DIVISION_COLORS[item.division] ?? '#64748B'
                return (
                  <div key={i} style={{ background: isRemoved ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isRemoved ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '12px 16px', opacity: isRemoved ? 0.35 : 1, transition: 'all 0.2s', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <button onClick={() => toggle(i)} style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2, border: `1.5px solid ${isRemoved ? '#64748B' : color}`, background: isRemoved ? 'transparent' : `${color}25`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {!isRemoved && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                    <div style={{ flex: 1 }}>
                      {editing === i ? (
                        <input autoFocus value={item.title} onChange={e => update(i, 'title', e.target.value)} onBlur={() => setEditing(null)} onKeyDown={e => { if (e.key === 'Enter') setEditing(null) }}
                          style={{ background: '#0A0E1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 8px', color: '#E2E8F0', fontSize: '0.88rem', width: '100%', fontFamily: "'Outfit', sans-serif", marginBottom: 6 }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#E2E8F0', fontFamily: "'Outfit', sans-serif" }}>{item.title}</span>
                          <button onClick={() => setEditing(i)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '2px 4px' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {[
                          [CALENDAR_TYPE_LABELS[item.content_type], color],
                          [item.division, divColor],
                          [`Mar ${item.target_date.slice(8)}`, '#94A3B8'],
                          ...item.keywords.slice(0,2).map(k => [k, '#64748B']),
                        ].map(([label, c], idx) => (
                          <span key={idx} style={{ background: `${c}18`, color: c as string, border: `1px solid ${c}30`, borderRadius: 100, padding: '2px 8px', fontSize: '0.7rem' }}>{label as string}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {!loading && (
          <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B' }}>{active} of {plan.length} entries will be added</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontSize: '0.85rem' }}>Discard</button>
              <button onClick={handleAccept} disabled={active === 0} style={{ background: active === 0 ? 'rgba(89,163,146,0.2)' : 'linear-gradient(135deg,#59A392,#3A589E)', border: 'none', color: 'white', borderRadius: 8, padding: '8px 22px', cursor: active === 0 ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                Accept Plan ({active})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Analytics Bar ────────────────────────────────────────────────────────────

function AnalyticsBar({ entries, month, year }: { entries: CalendarEntry[]; month: number; year: number }) {
  const prefix = `${year}-${String(month + 1).padStart(2,'0')}`
  const me = entries.filter(e => e.target_date.startsWith(prefix))
  const published = me.filter(e => e.status === 'published').length
  const missed = me.filter(e => e.status === 'missed').length
  const scribeCount = me.filter(e => e.assignee === 'scribe').length
  const onTrack = me.filter(e => e.status !== 'missed').length

  const typeCounts: Record<string, number> = {}
  me.forEach(e => { typeCounts[e.content_type] = (typeCounts[e.content_type] ?? 0) + 1 })
  const divCounts: Record<string, number> = {}
  me.forEach(e => { divCounts[e.division] = (divCounts[e.division] ?? 0) + 1 })

  const StatCard = ({ label, value, sub, color }: { label: string; value: string|number; sub?: string; color?: string }) => (
    <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px', flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: color ?? '#E2E8F0' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 2 }}>{sub}</div>}
    </div>
  )

  const Bar = ({ items, colorFn }: { items: [string, number][]; colorFn: (k: string) => string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {items.sort((a,b) => b[1]-a[1]).map(([k, count]) => {
        const c = colorFn(k)
        const pct = me.length > 0 ? Math.round(count / me.length * 100) : 0
        return (
          <div key={k}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{k}</span>
              <span style={{ fontSize: '0.78rem', color: c }}>{count}</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: c, borderRadius: 2 }} />
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <StatCard label="Published" value={`${published}/${me.length}`} sub="planned" color="#4ade80" />
        <StatCard label="On Track" value={onTrack} sub="entries" color="#E8B84D" />
        <StatCard label="SCRIBE" value={scribeCount} sub="AI-assigned" color="#7B6FE8" />
        <StatCard label="Missed" value={missed} color={missed > 0 ? '#EF4444' : '#64748B'} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { title: 'Content Type', items: Object.entries(typeCounts) as [string,number][], colorFn: (k: string) => CALENDAR_TYPE_COLORS[k as CalendarContentType] ?? '#64748B', labelFn: (k: string) => CALENDAR_TYPE_LABELS[k as CalendarContentType] ?? k },
          { title: 'Division', items: Object.entries(divCounts) as [string,number][], colorFn: (k: string) => DIVISION_COLORS[k] ?? '#64748B', labelFn: (k: string) => k.charAt(0).toUpperCase()+k.slice(1) },
        ].map(({ title, items, colorFn, labelFn }) => (
          <div key={title} style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{title} Distribution</div>
            <Bar items={items.map(([k,v]) => [labelFn(k), v])} colorFn={(label) => {
              const orig = items.find(([k]) => labelFn(k) === label)?.[0] ?? ''
              return colorFn(orig)
            }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── List View ────────────────────────────────────────────────────────────────

function ListView({ entries, onEntryClick }: { entries: CalendarEntry[]; onEntryClick: (e: CalendarEntry) => void }) {
  const [sortKey, setSortKey] = useState<'target_date'|'title'|'status'>('target_date')
  const [sortDir, setSortDir] = useState<1|-1>(1)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const sorted = useMemo(() => {
    let arr = [...entries]
    if (filterStatus !== 'all') arr = arr.filter(e => e.status === filterStatus)
    if (filterType !== 'all') arr = arr.filter(e => e.content_type === filterType)
    arr.sort((a, b) => {
      const av = a[sortKey] ?? '', bv = b[sortKey] ?? ''
      return av < bv ? -sortDir : av > bv ? sortDir : 0
    })
    return arr
  }, [entries, sortKey, sortDir, filterStatus, filterType])

  const toggleSort = (k: typeof sortKey) => {
    if (sortKey === k) setSortDir(d => d === 1 ? -1 : 1)
    else { setSortKey(k); setSortDir(1) }
  }

  const pill = (active: boolean, color = '#59A392'): React.CSSProperties => ({
    background: active ? `${color}20` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? color+'40' : 'rgba(255,255,255,0.06)'}`,
    color: active ? color : '#64748B',
    borderRadius: 100, padding: '4px 12px', fontSize: '0.75rem', cursor: 'pointer',
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'Fira Code', monospace" }}>Status:</span>
        {['all','planned','in_progress','review','published','missed'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={pill(filterStatus === s)}>{s === 'all' ? 'All' : s.replace('_',' ')}</button>
        ))}
        <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 6px' }} />
        <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'Fira Code', monospace" }}>Type:</span>
        {(['all', ...CONTENT_TYPES] as string[]).map(t => (
          <button key={t} onClick={() => setFilterType(t)} style={pill(filterType === t, t === 'all' ? '#59A392' : CALENDAR_TYPE_COLORS[t as CalendarContentType] ?? '#59A392')}>
            {t === 'all' ? 'All' : CALENDAR_TYPE_LABELS[t as CalendarContentType]}
          </button>
        ))}
      </div>

      <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {(['target_date','Type','title','Category','Division','status','Assigned'] as const).map((col) => {
                const isSortable = col === 'target_date' || col === 'title' || col === 'status'
                const label = col === 'target_date' ? 'Date' : col.charAt(0).toUpperCase()+col.slice(1)
                return (
                  <th key={col} style={{ padding: '10px 14px', textAlign: 'left' }}>
                    {isSortable ? (
                      <button onClick={() => toggleSort(col as 'target_date'|'title'|'status')} style={{ background: 'none', border: 'none', color: sortKey === col ? '#59A392' : '#64748B', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 3, padding: 0 }}>
                        {label} {sortKey === col && (sortDir === 1 ? '↑' : '↓')}
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>No entries match the current filters</td></tr>
            ) : sorted.map(e => {
              const tc = CALENDAR_TYPE_COLORS[e.content_type] ?? '#64748B'
              const sc = CALENDAR_STATUS_COLORS[e.status] ?? '#64748B'
              const dc = DIVISION_COLORS[e.division] ?? '#64748B'
              return (
                <tr key={e.id} onClick={() => onEntryClick(e)} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                  onMouseEnter={ev => (ev.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '10px 14px', fontSize: '0.82rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                    {new Date(e.target_date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ background: `${tc}18`, color: tc, border: `1px solid ${tc}30`, borderRadius: 100, padding: '2px 8px', fontSize: '0.72rem' }}>{CALENDAR_TYPE_LABELS[e.content_type]}</span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#E2E8F0', maxWidth: 240 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                    {e.priority === 'important' && <span style={{ fontSize: '0.68rem', color: '#E8916F', fontFamily: "'Fira Code', monospace" }}>important</span>}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '0.82rem', color: '#64748B' }}>{e.category}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ color: dc, fontSize: '0.82rem' }}>{e.division}</span></td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', color: sc }}>{e.status.replace('_',' ')}</span>
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {e.assignee === 'scribe' ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(123,111,232,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7B6FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#7B6FE8' }}>SCRIBE</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{e.assignee}</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 8, fontSize: '0.75rem', color: '#64748B', textAlign: 'right' }}>{sorted.length} entries</div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContentCalendarPage() {
  const [viewDate, setViewDate] = useState(new Date(2026, 2, 1)) // March 2026
  const [view, setView] = useState<'grid'|'list'>('grid')
  const [entries, setEntries] = useState<CalendarEntry[]>(MOCK_CALENDAR_ENTRIES)
  const [showEntryModal, setShowEntryModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<CalendarEntry | null>(null)
  const [defaultDate, setDefaultDate] = useState<string | undefined>()
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'info' } | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(true)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const today = todayISO()

  const calDays = useMemo(() => getCalendarDays(year, month), [year, month])
  const byDate = useMemo(() => {
    const m: Record<string, CalendarEntry[]> = {}
    entries.forEach(e => { if (!m[e.target_date]) m[e.target_date] = []; m[e.target_date].push(e) })
    return m
  }, [entries])

  const prefix = `${year}-${String(month+1).padStart(2,'0')}`
  const monthEntries = useMemo(() => entries.filter(e => e.target_date.startsWith(prefix)), [entries, prefix])

  const showToast = (msg: string, type: 'success'|'info' = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 5000)
  }

  const handleSave = useCallback((entry: CalendarEntry) => {
    setEntries(prev => {
      const idx = prev.findIndex(e => e.id === entry.id)
      if (idx >= 0) { const n = [...prev]; n[idx] = entry; return n }
      return [entry, ...prev]
    })
    setShowEntryModal(false)
    setEditingEntry(null)
  }, [])

  const handleAssignScribe = useCallback(async (entry: CalendarEntry) => {
    showToast(`SCRIBE queued for "${entry.title.slice(0,30)}…" — outline in 5 days`, 'info')
    try {
      const res = await callNexusScribe('generate_outline', { entry }) as { outline: string }
      setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, outline: res.outline, scribe_stage: 'outline_ready', updated_at: new Date().toISOString() } : e))
      showToast(`SCRIBE generated outline for "${entry.title.slice(0,30)}…"`, 'success')
    } catch { /* ignore */ }
  }, [])

  const handleAcceptPlan = useCallback((newEntries: CalendarEntry[]) => {
    setEntries(prev => [...prev, ...newEntries])
    setShowPlanModal(false)
    showToast(`${newEntries.length} entries added to calendar from SCRIBE plan`, 'success')
  }, [])

  const handleDayClick = useCallback((date: Date) => {
    setDefaultDate(isoDate(date)); setEditingEntry(null); setShowEntryModal(true)
  }, [])

  const handleEntryClick = useCallback((entry: CalendarEntry) => {
    setEditingEntry(entry); setShowEntryModal(true)
  }, [])

  const published = monthEntries.filter(e => e.status === 'published').length
  const scribeCount = monthEntries.filter(e => e.assignee === 'scribe').length

  const NavBtn = ({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#94A3B8', borderRadius: 7, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</button>
  )

  return (
    <div style={{ color: '#E2E8F0' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 2000, background: toast.type === 'success' ? 'rgba(74,222,128,0.12)' : 'rgba(123,111,232,0.12)', border: `1px solid ${toast.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(123,111,232,0.3)'}`, borderRadius: 10, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 380, fontSize: '0.85rem', color: toast.type === 'success' ? '#4ade80' : '#7B6FE8', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {toast.type === 'success' ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> : <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></>}
          </svg>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>Content Calendar</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
            {published}/{monthEntries.length} published · SCRIBE handles {scribeCount} automatically
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: '#0F1320', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
            {(['grid','list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '7px 14px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', background: view === v ? 'rgba(89,163,146,0.15)' : 'transparent', color: view === v ? '#59A392' : '#64748B', display: 'flex', alignItems: 'center', gap: 5 }}>
                {v === 'grid'
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
                {v.charAt(0).toUpperCase()+v.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={() => setShowPlanModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(123,111,232,0.12)', border: '1px solid rgba(123,111,232,0.3)', color: '#7B6FE8', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            Generate Plan
          </button>
          <button onClick={() => { setEditingEntry(null); setDefaultDate(undefined); setShowEntryModal(true) }} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg,#3A589E,#59A392)', border: 'none', color: 'white', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Entry
          </button>
        </div>
      </div>

      {/* Month nav + legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <NavBtn onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth()-1, 1))}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>} />
        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", minWidth: 180, textAlign: 'center' }}>{MONTHS[month]} {year}</h2>
        <NavBtn onClick={() => setViewDate(d => new Date(d.getFullYear(), d.getMonth()+1, 1))}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>} />
        <button onClick={() => setViewDate(new Date(2026, 2, 1))} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem' }}>Today</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {(['blog_post','case_study','newsletter','workshop'] as CalendarContentType[]).map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: '#64748B' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: CALENDAR_TYPE_COLORS[t], flexShrink: 0 }} />
              {CALENDAR_TYPE_LABELS[t]}
            </span>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      {view === 'grid' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 4 }}>
            {WEEK_DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 0' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {calDays.map((date, i) => (
              <DayCell key={i} date={date} entries={date ? (byDate[isoDate(date)] ?? []) : []} today={today} onDayClick={handleDayClick} onEntryClick={handleEntryClick} />
            ))}
          </div>
        </div>
      )}

      {/* List view */}
      {view === 'list' && <ListView entries={monthEntries} onEntryClick={handleEntryClick} />}

      {/* Analytics */}
      <div style={{ marginTop: 28, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
        <button onClick={() => setShowAnalytics(s => !s)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#64748B', fontSize: '0.8rem', fontFamily: "'Fira Code', monospace", padding: 0, marginBottom: 4 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showAnalytics ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
          Calendar Analytics — {MONTHS[month]} {year}
        </button>
        {showAnalytics && <AnalyticsBar entries={entries} month={month} year={year} />}
      </div>

      {/* Modals */}
      {showEntryModal && (
        <EntryModal entry={editingEntry} defaultDate={defaultDate}
          onClose={() => { setShowEntryModal(false); setEditingEntry(null) }}
          onSave={handleSave} onAssignScribe={handleAssignScribe} />
      )}
      {showPlanModal && (
        <GeneratePlanModal month={month} year={year} onClose={() => setShowPlanModal(false)} onAccept={handleAcceptPlan} />
      )}
    </div>
  )
}
