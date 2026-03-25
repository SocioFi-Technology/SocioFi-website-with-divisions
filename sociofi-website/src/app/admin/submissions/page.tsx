'use client'

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { fetchSubmissions } from '@/lib/admin/queries'
import {
  DIVISION_COLORS, STATUS_COLORS, PRIORITY_COLORS,
  type Submission, type SubmissionStatus, type SubmissionPriority, type Division,
} from '@/lib/admin/types'

const DIVISIONS: Division[] = ['studio', 'services', 'labs', 'products', 'academy', 'ventures', 'cloud']
const STATUSES: SubmissionStatus[] = ['new', 'reviewed', 'in_progress', 'converted', 'closed']
const PRIORITIES: SubmissionPriority[] = ['urgent', 'high', 'normal', 'low']
const TEAM_MEMBERS = ['Arifur Rahman', 'Kamrul Hasan']

const SUBMISSION_TYPES = [
  'Product Build', 'Rescue Ship', 'Consulting', 'Internal Tool',
  'Monitoring Plan', 'Bug Fix', 'Feature Add', 'Performance',
  'Agent Deploy', 'Custom Integration',
  'Course Enrollment', 'Workshop', 'Corporate Training',
  'Startup Application', 'Equity Partnership',
  'Hosting Assessment', 'Migration',
  'Product Demo', 'Research Inquiry', 'General Inquiry',
  'Partnership', 'Other',
]

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? '#4ade80' : score >= 40 ? '#E8B84D' : '#EF4444'
  return (
    <span style={{
      background: `${color}18`, color, border: `1px solid ${color}40`,
      fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px',
      borderRadius: '100px', fontFamily: "'Fira Code', monospace",
    }}>{score}</span>
  )
}

function StatusDot({ status }: { status: SubmissionStatus }) {
  const color = STATUS_COLORS[status]
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}80`, flexShrink: 0 }} />
      <span style={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'capitalize' }}>{status.replace('_', ' ')}</span>
    </span>
  )
}

function PriorityBadge({ priority }: { priority: SubmissionPriority }) {
  const color = PRIORITY_COLORS[priority]
  return (
    <span style={{
      background: `${color}18`, color, border: `1px solid ${color}40`,
      fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px',
      borderRadius: '4px', fontFamily: "'Fira Code', monospace",
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {priority === 'urgent' ? 'URG' : priority === 'high' ? 'HIGH' : priority === 'normal' ? 'NRM' : 'LOW'}
    </span>
  )
}

function DivisionPill({ division }: { division: Division }) {
  const color = DIVISION_COLORS[division] ?? '#59A392'
  return (
    <span style={{
      background: `${color}18`, color, border: `1px solid ${color}30`,
      fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px',
      borderRadius: '100px', textTransform: 'capitalize',
    }}>{division}</span>
  )
}

// ── Detail Panel ──────────────────────────────────────────────
function SubmissionDetailPanel({ submission, onClose, onUpdate }: {
  submission: Submission
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Submission>) => void
}) {
  const [note, setNote] = useState('')
  const [localStatus, setLocalStatus] = useState(submission.status)
  const [localPriority, setLocalPriority] = useState(submission.priority)
  const [localAssigned, setLocalAssigned] = useState(submission.assigned_to ?? '')

  const handleStatusChange = (s: SubmissionStatus) => {
    setLocalStatus(s)
    onUpdate(submission.id, { status: s })
  }
  const handlePriorityChange = (p: SubmissionPriority) => {
    setLocalPriority(p)
    onUpdate(submission.id, { priority: p })
  }
  const handleAssign = (a: string) => {
    setLocalAssigned(a)
    onUpdate(submission.id, { assigned_to: a || undefined })
  }

  const accentColor = DIVISION_COLORS[submission.division] ?? '#59A392'

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0,
      width: '520px',
      background: '#0F1320',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      zIndex: 500,
      display: 'flex', flexDirection: 'column',
      boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
            <DivisionPill division={submission.division} />
            <span style={{ color: '#94A3B8', fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px' }}>{submission.type}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Status select */}
            <select value={localStatus} onChange={e => handleStatusChange(e.target.value as SubmissionStatus)}
              style={{ background: `${STATUS_COLORS[localStatus]}18`, color: STATUS_COLORS[localStatus], border: `1px solid ${STATUS_COLORS[localStatus]}40`, borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit', sans-serif" }}>
              {STATUSES.map(s => <option key={s} value={s} style={{ background: '#12162A', color: '#E2E8F0' }}>{s.replace('_', ' ')}</option>)}
            </select>
            {/* Priority select */}
            <select value={localPriority} onChange={e => handlePriorityChange(e.target.value as SubmissionPriority)}
              style={{ background: `${PRIORITY_COLORS[localPriority]}18`, color: PRIORITY_COLORS[localPriority], border: `1px solid ${PRIORITY_COLORS[localPriority]}40`, borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit', sans-serif" }}>
              {PRIORITIES.map(p => <option key={p} value={p} style={{ background: '#12162A', color: '#E2E8F0' }}>{p}</option>)}
            </select>
            {/* Assign select */}
            <select value={localAssigned} onChange={e => handleAssign(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.04)', color: localAssigned ? '#E2E8F0' : '#EF4444', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit', sans-serif" }}>
              <option value="" style={{ background: '#12162A' }}>Unassigned</option>
              {TEAM_MEMBERS.map(m => <option key={m} value={m} style={{ background: '#12162A' }}>{m}</option>)}
            </select>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Contact card */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ color: '#64748B', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Contact</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${accentColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>
            {submission.contact_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <Link href={submission.contact_id ? `/admin/contacts/${submission.contact_id}` : '#'}
              style={{ color: '#E2E8F0', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', display: 'block', transition: 'color 0.15s' }}>
              {submission.contact_name}
            </Link>
            <div style={{ color: '#64748B', fontSize: '0.78rem' }}>{submission.contact_email}</div>
          </div>
          {submission.ai_score !== undefined && (
            <div style={{ marginLeft: 'auto' }}><ScoreBadge score={submission.ai_score} /></div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ color: '#64748B', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Summary</div>
        <div style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.6 }}>{submission.summary}</div>
      </div>

      {/* Fields */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ color: '#64748B', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Form Fields</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {Object.entries(submission.fields).map(([key, val]) => (
            <div key={key} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', padding: '8px 12px' }}>
              <div style={{ color: '#475569', fontSize: '0.65rem', textTransform: 'capitalize', marginBottom: '3px' }}>{key.replace(/_/g, ' ')}</div>
              <div style={{ color: '#E2E8F0', fontSize: '0.8rem' }}>{String(val)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      {submission.tags.length > 0 && (
        <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: '#475569', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace" }}>Tags:</span>
          {submission.tags.map(tag => (
            <span key={tag} style={{ background: 'rgba(89,163,146,0.1)', color: '#59A392', border: '1px solid rgba(89,163,146,0.2)', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px' }}>{tag}</span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { label: 'Move to Pipeline', color: accentColor },
          { label: 'Draft Email (HERALD)', color: '#5BB5E0' },
          { label: 'Add to CRM', color: '#6BA3E8' },
          { label: 'Archive', color: '#64748B' },
        ].map(btn => (
          <button key={btn.label} style={{
            background: `${btn.color}15`, color: btn.color,
            border: `1px solid ${btn.color}35`, borderRadius: '6px',
            fontSize: '0.75rem', padding: '6px 12px', cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s',
          }}>
            {btn.label}
          </button>
        ))}
      </div>

      {/* Notes */}
      <div style={{ padding: '16px 24px', flex: 1 }}>
        <div style={{ color: '#64748B', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Notes &amp; Activity</div>
        {submission.notes.map(n => (
          <div key={n.id} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: n.author_type === 'agent' ? 'rgba(89,163,146,0.2)' : 'linear-gradient(135deg,#3A589E,#59A392)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: n.author_type === 'agent' ? '#59A392' : 'white', fontWeight: 700, fontFamily: "'Fira Code', monospace", flexShrink: 0 }}>
              {n.author.slice(0, 2)}
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: n.author_type === 'agent' ? '#59A392' : '#E2E8F0', fontSize: '0.78rem', fontWeight: 600 }}>{n.author}</span>
                <span style={{ color: '#475569', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace" }}>{relativeTime(n.created_at)}</span>
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.5 }}>{n.content}</div>
            </div>
          </div>
        ))}
        {/* Add note */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <textarea
            value={note} onChange={e => setNote(e.target.value)}
            placeholder="Add a note..."
            rows={2}
            style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#E2E8F0', fontSize: '0.82rem', padding: '8px 12px', outline: 'none', resize: 'none', fontFamily: "'Outfit', sans-serif" }}
          />
          <button onClick={() => setNote('')} style={{ background: 'rgba(89,163,146,0.15)', border: '1px solid rgba(89,163,146,0.3)', borderRadius: '8px', color: '#59A392', fontSize: '0.78rem', padding: '0 14px', cursor: 'pointer', flexShrink: 0, fontFamily: "'Outfit', sans-serif" }}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
function SubmissionsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loadingSubs, setLoadingSubs] = useState(true)
  const [subsError, setSubsError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [detailId, setDetailId] = useState<string | null>(null)
  const [sortCol, setSortCol] = useState<keyof Submission>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [search, setSearch] = useState(searchParams.get('q') ?? '')

  const filterDivision = searchParams.get('division') ?? 'all'
  const filterStatus = searchParams.get('status') ?? 'all'
  const filterPriority = searchParams.get('priority') ?? 'all'
  const filterType = searchParams.get('type') ?? 'all'

  const loadSubmissions = useCallback(async () => {
    setLoadingSubs(true)
    setSubsError(null)
    try {
      const data = await fetchSubmissions({
        division: filterDivision !== 'all' ? filterDivision : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        priority: filterPriority !== 'all' ? filterPriority : undefined,
        type: filterType !== 'all' ? filterType : undefined,
        search: search || undefined,
        limit: 100,
      })
      setSubmissions(data)
    } catch (e) {
      setSubsError(e instanceof Error ? e.message : 'Failed to load submissions')
    } finally {
      setLoadingSubs(false)
    }
  }, [filterDivision, filterStatus, filterPriority, filterType, search])

  useEffect(() => { loadSubmissions() }, [loadSubmissions])

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') params.delete(key)
    else params.set(key, value)
    if (key !== 'q') params.delete('q')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const setSearchParam = (v: string) => {
    setSearch(v)
    const params = new URLSearchParams(searchParams.toString())
    if (v) params.set('q', v)
    else params.delete('q')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const filtered = useMemo(() => {
    return submissions.filter(s => {
      if (filterDivision !== 'all' && s.division !== filterDivision) return false
      if (filterStatus !== 'all' && s.status !== filterStatus) return false
      if (filterPriority !== 'all' && s.priority !== filterPriority) return false
      if (filterType !== 'all' && s.type !== filterType) return false
      if (search) {
        const q = search.toLowerCase()
        return s.contact_name.toLowerCase().includes(q) || s.contact_email.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q)
      }
      return true
    }).sort((a, b) => {
      const av = String(a[sortCol] ?? '')
      const bv = String(b[sortCol] ?? '')
      return sortDir === 'asc' ? av > bv ? 1 : -1 : av < bv ? 1 : -1
    })
  }, [submissions, filterDivision, filterStatus, filterPriority, filterType, search, sortCol, sortDir])

  const toggleSort = (col: keyof Submission) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map(s => s.id)))
  }

  const handleUpdate = (id: string, updates: Partial<Submission>) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const hasFilters = filterDivision !== 'all' || filterStatus !== 'all' || filterPriority !== 'all' || filterType !== 'all' || !!search

  const thStyle = (col: keyof Submission): React.CSSProperties => ({
    padding: '10px 12px',
    fontSize: '0.7rem',
    fontFamily: "'Fira Code', monospace",
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    textAlign: 'left' as const,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    userSelect: 'none' as const,
    color: sortCol === col ? '#59A392' : '#64748B',
  })

  const detailSubmission = submissions.find(s => s.id === detailId)

  if (subsError) {
    return <div style={{ padding: '40px', color: '#EF4444', fontFamily: "'Fira Code', monospace", fontSize: '0.84rem' }}>Error: {subsError}</div>
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Page header */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>— INBOX</div>
          <h1 style={{ color: '#E2E8F0', fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0, letterSpacing: '-0.02em' }}>Submissions</h1>
        </div>
        <div style={{ color: '#64748B', fontSize: '0.82rem' }}>{loadingSubs ? 'Loading…' : `${filtered.length} of ${submissions.length} total`}</div>
      </div>

      {/* Filter bar */}
      <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', marginBottom: '16px', position: 'sticky', top: '64px', zIndex: 50 }}>
        {/* Row 1: Division + Status */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px', alignItems: 'center' }}>
          <span style={{ color: '#475569', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace", marginRight: '4px' }}>DIV:</span>
          {(['all', ...DIVISIONS] as string[]).map(d => (
            <button key={d} onClick={() => setFilter('division', d)} style={{
              background: filterDivision === d ? `${DIVISION_COLORS[d] ?? '#59A392'}25` : 'rgba(255,255,255,0.03)',
              color: filterDivision === d ? (DIVISION_COLORS[d] ?? '#59A392') : '#64748B',
              border: `1px solid ${filterDivision === d ? `${DIVISION_COLORS[d] ?? '#59A392'}50` : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '100px', padding: '4px 12px', fontSize: '0.72rem',
              cursor: 'pointer', textTransform: 'capitalize', fontFamily: "'Outfit', sans-serif",
              transition: 'all 0.15s',
            }}>{d}</button>
          ))}
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.06)', margin: '0 6px' }} />
          <span style={{ color: '#475569', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace", marginRight: '4px' }}>STATUS:</span>
          {(['all', ...STATUSES] as string[]).map(s => (
            <button key={s} onClick={() => setFilter('status', s)} style={{
              background: filterStatus === s ? `${STATUS_COLORS[s as SubmissionStatus] ?? '#59A392'}25` : 'rgba(255,255,255,0.03)',
              color: filterStatus === s ? (STATUS_COLORS[s as SubmissionStatus] ?? '#59A392') : '#64748B',
              border: `1px solid ${filterStatus === s ? `${STATUS_COLORS[s as SubmissionStatus] ?? '#59A392'}50` : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '100px', padding: '4px 12px', fontSize: '0.72rem',
              cursor: 'pointer', textTransform: 'capitalize', fontFamily: "'Outfit', sans-serif",
              transition: 'all 0.15s',
            }}>{s === 'all' ? 'all' : s.replace('_', ' ')}</button>
          ))}
        </div>

        {/* Row 2: Priority + Type */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px', alignItems: 'center' }}>
          <span style={{ color: '#475569', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace", marginRight: '4px' }}>PRI:</span>
          {(['all', ...PRIORITIES] as string[]).map(p => (
            <button key={p} onClick={() => setFilter('priority', p)} style={{
              background: filterPriority === p ? `${PRIORITY_COLORS[p as SubmissionPriority] ?? '#59A392'}25` : 'rgba(255,255,255,0.03)',
              color: filterPriority === p ? (PRIORITY_COLORS[p as SubmissionPriority] ?? '#59A392') : '#64748B',
              border: `1px solid ${filterPriority === p ? `${PRIORITY_COLORS[p as SubmissionPriority] ?? '#59A392'}50` : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '100px', padding: '4px 12px', fontSize: '0.72rem',
              cursor: 'pointer', textTransform: 'capitalize', fontFamily: "'Outfit', sans-serif",
              transition: 'all 0.15s',
            }}>{p}</button>
          ))}
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.06)', margin: '0 6px' }} />
          <select value={filterType} onChange={e => setFilter('type', e.target.value)}
            style={{ background: filterType !== 'all' ? 'rgba(89,163,146,0.1)' : 'rgba(255,255,255,0.03)', color: filterType !== 'all' ? '#59A392' : '#64748B', border: `1px solid ${filterType !== 'all' ? 'rgba(89,163,146,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit', sans-serif" }}>
            <option value="all">All Types</option>
            {SUBMISSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Row 3: Search + clear */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '8px 14px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={search} onChange={e => setSearchParam(e.target.value)}
              placeholder="Search by name, email, or description..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#E2E8F0', fontSize: '0.85rem', fontFamily: "'Outfit', sans-serif" }}
            />
            {search && <button onClick={() => setSearchParam('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '0' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>}
          </div>
          {hasFilters && (
            <button onClick={() => { router.push(pathname, { scroll: false }); setSearch('') }}
              style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '8px 14px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap' }}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div style={{ background: '#1a2040', border: '1px solid rgba(89,163,146,0.3)', borderRadius: '10px', padding: '10px 16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#59A392', fontSize: '0.82rem', fontWeight: 600 }}>{selectedIds.size} selected</span>
          <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
            {[
              { label: 'Bulk Assign', color: '#6BA3E8' },
              { label: 'Set Status', color: '#E8B84D' },
              { label: 'Archive', color: '#64748B' },
              { label: 'Export CSV', color: '#59A392' },
            ].map(btn => (
              <button key={btn.label} style={{ background: `${btn.color}15`, color: btn.color, border: `1px solid ${btn.color}35`, borderRadius: '6px', padding: '5px 12px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                {btn.label}
              </button>
            ))}
          </div>
          <button onClick={() => setSelectedIds(new Set())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th style={{ padding: '10px 12px', width: '40px' }}>
                <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll}
                  style={{ accentColor: '#59A392', cursor: 'pointer' }} />
              </th>
              {([
                ['status', 'Status'], ['priority', 'Priority'], ['division', 'Division'],
                ['type', 'Type'], ['contact_name', 'Contact'], ['summary', 'Summary'],
                ['assigned_to', 'Assigned'], ['ai_score', 'Score'], ['created_at', 'Date']
              ] as [keyof Submission, string][]).map(([col, label]) => (
                <th key={col} onClick={() => toggleSort(col)} style={thStyle(col)}>
                  {label} {sortCol === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}
                onClick={() => setDetailId(s.id)}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  background: detailId === s.id ? 'rgba(89,163,146,0.06)' : selectedIds.has(s.id) ? 'rgba(89,163,146,0.04)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (detailId !== s.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
                onMouseLeave={e => { if (detailId !== s.id) (e.currentTarget as HTMLElement).style.background = selectedIds.has(s.id) ? 'rgba(89,163,146,0.04)' : 'transparent' }}
              >
                <td style={{ padding: '12px 12px' }} onClick={e => { e.stopPropagation(); toggleSelect(s.id) }}>
                  <input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => toggleSelect(s.id)}
                    style={{ accentColor: '#59A392', cursor: 'pointer' }} />
                </td>
                <td style={{ padding: '12px 12px' }}><StatusDot status={s.status} /></td>
                <td style={{ padding: '12px 12px' }}><PriorityBadge priority={s.priority} /></td>
                <td style={{ padding: '12px 12px' }}><DivisionPill division={s.division} /></td>
                <td style={{ padding: '12px 12px', color: '#94A3B8', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{s.type}</td>
                <td style={{ padding: '12px 12px' }}>
                  <div style={{ color: '#E2E8F0', fontSize: '0.82rem', fontWeight: 500 }}>{s.contact_name}</div>
                  <div style={{ color: '#475569', fontSize: '0.7rem' }}>{s.contact_email}</div>
                </td>
                <td style={{ padding: '12px 12px', maxWidth: '260px' }}>
                  <div style={{ color: '#94A3B8', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.summary.slice(0, 80)}{s.summary.length > 80 ? '...' : ''}</div>
                </td>
                <td style={{ padding: '12px 12px', color: s.assigned_to ? '#E2E8F0' : '#EF4444', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                  {s.assigned_to ?? 'Unassigned'}
                </td>
                <td style={{ padding: '12px 12px' }}>
                  {s.ai_score !== undefined ? <ScoreBadge score={s.ai_score} /> : <span style={{ color: '#475569', fontSize: '0.72rem' }}>—</span>}
                </td>
                <td style={{ padding: '12px 12px', color: '#64748B', fontSize: '0.75rem', whiteSpace: 'nowrap', fontFamily: "'Fira Code', monospace" }}>
                  {relativeTime(s.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loadingSubs && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>Loading submissions…</div>
        )}
        {!loadingSubs && filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
            <div style={{ fontSize: '1rem', marginBottom: '8px' }}>No submissions match these filters</div>
            <div style={{ fontSize: '0.82rem' }}>Try clearing some filters or adjusting your search</div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {detailId && detailSubmission && (
        <>
          <div onClick={() => setDetailId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400 }} />
          <SubmissionDetailPanel submission={detailSubmission} onClose={() => setDetailId(null)} onUpdate={handleUpdate} />
        </>
      )}
    </div>
  )
}

export default function SubmissionsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>Loading...</div>}>
      <SubmissionsPageInner />
    </Suspense>
  )
}
