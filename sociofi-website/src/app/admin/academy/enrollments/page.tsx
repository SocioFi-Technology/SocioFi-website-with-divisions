'use client'

import { useState, useMemo } from 'react'
import type { CourseEnrollment, EnrollmentStatus } from '@/lib/admin/types'
import { ENROLLMENT_STATUS_COLORS } from '@/lib/admin/types'
import { MOCK_ENROLLMENTS, MOCK_COURSES, MOCK_WORKSHOPS } from '@/lib/admin/mock-data'

const ACCENT = '#E8B84D'

const STYLES = `
  @keyframes eFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`

function relTime(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return `${Math.floor(d / 30)}mo ago`
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'Fira Code', monospace", minWidth: 28 }}>{pct}%</span>
    </div>
  )
}

function StatusBadge({ status }: { status: EnrollmentStatus }) {
  const c = ENROLLMENT_STATUS_COLORS[status]
  return <span style={{ background: `${c}15`, border: `1px solid ${c}30`, color: c, borderRadius: 100, padding: '2px 9px', fontSize: '0.68rem' }}>{status}</span>
}

function PaymentBadge({ status, amount }: { status: string; amount: number }) {
  const map: Record<string, { color: string; label: string }> = {
    paid:     { color: '#4ade80', label: `Paid $${amount}` },
    free:     { color: '#64748B', label: 'Free' },
    refunded: { color: '#EF4444', label: `Refunded $${amount}` },
    pending:  { color: '#E8B84D', label: `Pending $${amount}` },
  }
  const m = map[status] || { color: '#64748B', label: status }
  return <span style={{ background: `${m.color}12`, border: `1px solid ${m.color}28`, color: m.color, borderRadius: 100, padding: '2px 9px', fontSize: '0.68rem' }}>{m.label}</span>
}

// ─── Student Detail Modal ─────────────────────────────────────────────────────

function StudentModal({ email, name, onClose }: { email: string; name: string; onClose: () => void }) {
  const [tab, setTab] = useState<'courses' | 'payments'>('courses')

  const studentEnrollments = MOCK_ENROLLMENTS.filter(e => e.student_email === email)
  const totalPaid = studentEnrollments.filter(e => e.payment_status === 'paid').reduce((s, e) => s + e.payment_amount_usd, 0)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: '80vh', display: 'flex', flexDirection: 'column', animation: 'eFadeIn 0.2s ease', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ACCENT},transparent)` }} />

        {/* Header */}
        <div style={{ padding: '22px 26px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif" }}>{name}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 3 }}>{email}</div>
              <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: 3 }}>
                Joined {relTime(studentEnrollments[studentEnrollments.length - 1]?.enrolled_at || new Date().toISOString())} &nbsp;·&nbsp;
                {studentEnrollments.length} enrollment{studentEnrollments.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
                ${totalPaid.toLocaleString()} total paid
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2 }}>
            {(['courses', 'payments'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? `${ACCENT}18` : 'transparent', border: `1px solid ${tab === t ? ACCENT + '40' : 'transparent'}`, color: tab === t ? ACCENT : '#64748B', borderRadius: 7, padding: '6px 14px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
                {t === 'courses' ? 'Courses & Workshops' : 'Payment History'}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ overflow: 'auto', padding: '16px 26px', flex: 1 }}>
          {tab === 'courses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {studentEnrollments.map((e, i) => (
                <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, padding: '12px 0', borderBottom: i < studentEnrollments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#CBD5E1', marginBottom: 2 }}>{e.course_title || e.workshop_title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#475569' }}>
                      <span style={{ background: e.type === 'course' ? '#6BA3E820' : '#4DBFA820', color: e.type === 'course' ? '#6BA3E8' : '#4DBFA8', borderRadius: 4, padding: '1px 6px', marginRight: 6 }}>{e.type}</span>
                      {relTime(e.enrolled_at)}
                    </div>
                  </div>
                  <ProgressBar pct={e.progress_percent} color={ENROLLMENT_STATUS_COLORS[e.status]} />
                  <StatusBadge status={e.status} />
                </div>
              ))}
              {studentEnrollments.length === 0 && <div style={{ color: '#475569', fontSize: '0.82rem', padding: '20px 0' }}>No enrollments found.</div>}
            </div>
          )}

          {tab === 'payments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {studentEnrollments.map((e, i) => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < studentEnrollments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#CBD5E1', marginBottom: 2 }}>{e.course_title || e.workshop_title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#475569' }}>{relTime(e.enrolled_at)}</div>
                  </div>
                  <PaymentBadge status={e.payment_status} amount={e.payment_amount_usd} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EnrollmentsPage() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'course' | 'workshop'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | EnrollmentStatus>('all')
  const [courseFilter, setCourseFilter] = useState<'all' | string>('all')
  const [dateFilter, setDateFilter] = useState<'7d' | '30d' | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<{ email: string; name: string } | null>(null)

  const filtered = useMemo(() => {
    const now = Date.now()
    const cutoffs = { '7d': 7 * 86400000, '30d': 30 * 86400000, 'all': Infinity }
    return MOCK_ENROLLMENTS.filter(e => {
      const matchType = typeFilter === 'all' || e.type === typeFilter
      const matchStatus = statusFilter === 'all' || e.status === statusFilter
      const matchCourse = courseFilter === 'all' || e.course_id === courseFilter || e.workshop_id === courseFilter
      const matchDate = dateFilter === 'all' || (now - new Date(e.enrolled_at).getTime()) < cutoffs[dateFilter]
      const matchSearch = !search || e.student_name.toLowerCase().includes(search.toLowerCase()) || e.student_email.toLowerCase().includes(search.toLowerCase())
      return matchType && matchStatus && matchCourse && matchDate && matchSearch
    })
  }, [typeFilter, statusFilter, courseFilter, dateFilter, search])

  const kpis = useMemo(() => {
    const students = new Set(MOCK_ENROLLMENTS.map(e => e.student_email)).size
    const active = MOCK_ENROLLMENTS.filter(e => e.status === 'active').length
    const completed = MOCK_ENROLLMENTS.filter(e => e.status === 'completed').length
    const revenue = MOCK_ENROLLMENTS.filter(e => e.payment_status === 'paid').reduce((s, e) => s + e.payment_amount_usd, 0)
    return { students, active, completed, revenue }
  }, [])

  const courseOptions = [
    ...MOCK_COURSES.map(c => ({ id: c.id, label: c.title, type: 'course' })),
    ...MOCK_WORKSHOPS.map(w => ({ id: w.id, label: w.title, type: 'workshop' })),
  ]

  const statusFilters: Array<{ key: 'all' | EnrollmentStatus; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'paused', label: 'Paused' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'refunded', label: 'Refunded' },
  ]

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1280, margin: '0 auto' }}>
      <style>{STYLES}</style>
      {selectedStudent && <StudentModal email={selectedStudent.email} name={selectedStudent.name} onClose={() => setSelectedStudent(null)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'Fira Code', monospace", marginBottom: 6 }}>Academy</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", margin: 0 }}>Enrollments</h1>
        </div>
        <button style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8', borderRadius: 8, padding: '9px 18px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        {[
          { label: 'Total Students', value: kpis.students, color: ACCENT },
          { label: 'Active', value: kpis.active, color: '#4ade80' },
          { label: 'Completed', value: kpis.completed, color: '#6BA3E8' },
          { label: 'Revenue Collected', value: `$${kpis.revenue.toLocaleString()}`, color: '#4DBFA8' },
        ].map(k => (
          <div key={k.label} style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${k.color},transparent)` }} />
            <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Fira Code', monospace", marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif" }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Type */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['all', 'course', 'workshop'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{ background: typeFilter === t ? `${ACCENT}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${typeFilter === t ? ACCENT + '40' : 'rgba(255,255,255,0.07)'}`, color: typeFilter === t ? ACCENT : '#64748B', borderRadius: 7, padding: '5px 11px', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'capitalize' }}>
              {t === 'all' ? 'All' : t === 'course' ? 'Courses' : 'Workshops'}
            </button>
          ))}
        </div>

        {/* Status */}
        <div style={{ display: 'flex', gap: 4 }}>
          {statusFilters.map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{ background: statusFilter === f.key ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${statusFilter === f.key ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`, color: statusFilter === f.key ? '#E2E8F0' : '#64748B', borderRadius: 7, padding: '5px 10px', fontSize: '0.74rem', cursor: 'pointer' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Course dropdown */}
        <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} style={{ background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '6px 12px', color: courseFilter === 'all' ? '#64748B' : '#E2E8F0', fontSize: '0.75rem', outline: 'none' }}>
          <option value="all">All Courses & Workshops</option>
          {courseOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>

        {/* Date range */}
        <div style={{ display: 'flex', gap: 4 }}>
          {([['7d', 'Last 7 days'], ['30d', 'Last 30 days'], ['all', 'All time']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setDateFilter(k)} style={{ background: dateFilter === k ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)', border: `1px solid ${dateFilter === k ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`, color: dateFilter === k ? '#CBD5E1' : '#475569', borderRadius: 7, padding: '5px 10px', fontSize: '0.74rem', cursor: 'pointer' }}>
              {l}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '6px 12px', color: '#E2E8F0', fontSize: '0.78rem', outline: 'none' }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.8fr 1.8fr 0.9fr 1.2fr 0.9fr 1.1fr 0.7fr', gap: 0, padding: '11px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
          {['Student', 'Type', 'Course / Workshop', 'Enrolled', 'Progress', 'Status', 'Payment', 'Actions'].map(h => (
            <div key={h} style={{ fontSize: '0.67rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Fira Code', monospace" }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((e, i) => {
          const progressColor = ENROLLMENT_STATUS_COLORS[e.status]
          return (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.8fr 1.8fr 0.9fr 1.2fr 0.9fr 1.1fr 0.7fr', gap: 0, padding: '12px 20px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
              {/* Student */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#E2E8F0' }}>{e.student_name}</div>
                <div style={{ fontSize: '0.7rem', color: '#475569' }}>{e.student_email}</div>
              </div>

              {/* Type */}
              <div>
                <span style={{ background: e.type === 'course' ? '#6BA3E818' : '#4DBFA818', border: `1px solid ${e.type === 'course' ? '#6BA3E835' : '#4DBFA835'}`, color: e.type === 'course' ? '#6BA3E8' : '#4DBFA8', borderRadius: 100, padding: '2px 8px', fontSize: '0.65rem' }}>
                  {e.type}
                </span>
              </div>

              {/* Course */}
              <div style={{ fontSize: '0.78rem', color: '#CBD5E1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                {e.course_title || e.workshop_title}
              </div>

              {/* Enrolled */}
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{relTime(e.enrolled_at)}</div>

              {/* Progress */}
              <div style={{ paddingRight: 8 }}>
                <ProgressBar pct={e.progress_percent} color={progressColor} />
              </div>

              {/* Status */}
              <StatusBadge status={e.status} />

              {/* Payment */}
              <PaymentBadge status={e.payment_status} amount={e.payment_amount_usd} />

              {/* Actions */}
              <button
                onClick={() => setSelectedStudent({ email: e.student_email, name: e.student_name })}
                style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}28`, color: ACCENT, borderRadius: 6, padding: '4px 10px', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                View →
              </button>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#475569', fontSize: '0.82rem' }}>No enrollments match the current filters.</div>
        )}
      </div>

      <div style={{ fontSize: '0.72rem', color: '#475569', fontFamily: "'Fira Code', monospace", marginTop: 14 }}>
        Showing {filtered.length} of {MOCK_ENROLLMENTS.length} enrollments
      </div>
    </div>
  )
}
