'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import type { CourseEnrollment } from '@/lib/admin/types'
import { MOCK_COURSES, MOCK_WORKSHOPS, MOCK_ENROLLMENTS, MOCK_SCARL_COHORTS } from '@/lib/admin/mock-data'

const ACCENT = '#E8B84D'

const STYLES = `
  @keyframes aPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
  @keyframes aSpin { to{transform:rotate(360deg)} }
`

function relTime(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${accent || ACCENT},transparent)` }} />
      <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontFamily: "'Fira Code', monospace" }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: '#4ade80', completed: '#6BA3E8', paused: '#E8B84D',
    cancelled: '#64748B', refunded: '#EF4444', pending: '#E8B84D',
  }
  const c = map[status] || '#64748B'
  return (
    <span style={{ background: `${c}18`, border: `1px solid ${c}35`, color: c, borderRadius: 100, padding: '2px 9px', fontSize: '0.68rem', fontWeight: 500 }}>
      {status}
    </span>
  )
}

function EnrollmentTrendChart() {
  const weekCounts = [25, 31, 28, 42, 38, 51, 47, 63]
  const max = Math.max(...weekCounts)
  const weeks = ['Wk1','Wk2','Wk3','Wk4','Wk5','Wk6','Wk7','Wk8']
  const chartH = 100
  const barW = 24
  const gap = 14
  const totalW = weekCounts.length * (barW + gap) - gap

  return (
    <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 22px' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", marginBottom: 16 }}>Enrollment Trend (Last 8 Weeks)</div>
      <svg width="100%" viewBox={`0 0 ${totalW + 20} ${chartH + 30}`} preserveAspectRatio="xMidYMid meet">
        {weekCounts.map((v, i) => {
          const h = (v / max) * chartH
          const x = i * (barW + gap)
          const y = chartH - h
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} rx={4} fill={`${ACCENT}25`} />
              <rect x={x} y={y} width={barW} height={3} rx={2} fill={ACCENT} />
              <text x={x + barW / 2} y={chartH + 14} textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">{weeks[i]}</text>
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">{v}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function TopCoursesChart() {
  const top5 = [...MOCK_COURSES]
    .filter(c => c.status === 'published')
    .sort((a, b) => b.enrollment_count - a.enrollment_count)
    .slice(0, 5)
  const max = top5[0]?.enrollment_count || 1

  return (
    <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 22px' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", marginBottom: 16 }}>Top Courses by Enrollment</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {top5.map(c => (
          <div key={c.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '0.78rem', color: '#CBD5E1', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</span>
              <span style={{ fontSize: '0.75rem', color: ACCENT, fontFamily: "'Fira Code', monospace" }}>{c.enrollment_count}</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
              <div style={{ height: '100%', width: `${(c.enrollment_count / max) * 100}%`, background: ACCENT, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentEnrollments() {
  const recent = [...MOCK_ENROLLMENTS]
    .sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime())
    .slice(0, 8)

  return (
    <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 22px' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", marginBottom: 16 }}>Recent Enrollments</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {recent.map((e, i) => (
          <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < recent.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', color: '#CBD5E1', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.student_name}</div>
              <div style={{ fontSize: '0.72rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.course_title || e.workshop_title}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 12 }}>
              <StatusBadge status={e.status} />
              <span style={{ fontSize: '0.68rem', color: '#475569', whiteSpace: 'nowrap' }}>{relTime(e.enrolled_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickLinks() {
  const links = [
    { label: 'Courses', count: MOCK_COURSES.length, href: '/admin/academy/courses', color: ACCENT },
    { label: 'Workshops', count: MOCK_WORKSHOPS.length, href: '/admin/academy/workshops', color: '#6BA3E8' },
    { label: 'Enrollments', count: MOCK_ENROLLMENTS.length, href: '/admin/academy/enrollments', color: '#4DBFA8' },
    { label: 'SCARL Program', count: MOCK_SCARL_COHORTS.length + ' cohorts', href: '/admin/academy/scarl', color: '#E8916F' },
  ]

  return (
    <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 22px' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", marginBottom: 16 }}>Quick Links</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{ textDecoration: 'none', background: `${l.color}0e`, border: `1px solid ${l.color}25`, borderRadius: 10, padding: '14px 16px', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = `${l.color}50`)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = `${l.color}25`)}>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: 4 }}>{l.label}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: l.color, fontFamily: "'Syne', sans-serif" }}>{l.count}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function MentorPanel() {
  const drafted = MOCK_COURSES.filter(c => c.mentor_drafted)

  return (
    <div style={{ background: '#111128', border: `1px solid ${ACCENT}25`, borderRadius: 12, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ACCENT},#F0D08080)` }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `${ACCENT}18`, border: `1px solid ${ACCENT}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif" }}>MENTOR Agent</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8', display: 'inline-block' }} />
              <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Idle</span>
            </div>
          </div>
        </div>
        <Link href="/admin/academy/courses" style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}35`, color: ACCENT, borderRadius: 8, padding: '7px 14px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Draft Course
        </Link>
      </div>
      <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: 14, lineHeight: 1.5 }}>
        MENTOR drafts complete course syllabi with lesson outlines from a topic brief. Analyzes enrollment data to recommend format and pricing.
      </p>
      {drafted.length > 0 && (
        <div>
          <div style={{ fontSize: '0.7rem', color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Fira Code', monospace" }}>Recently Drafted</div>
          {drafted.map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}30`, color: ACCENT, borderRadius: 4, padding: '1px 7px', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace" }}>MENTOR</span>
              <span style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>{c.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AcademyAdminPage() {
  const revenueMTD = useMemo(() => {
    const now = new Date()
    return MOCK_ENROLLMENTS
      .filter(e => {
        const d = new Date(e.enrolled_at)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && e.payment_status === 'paid'
      })
      .reduce((sum, e) => sum + e.payment_amount_usd, 0)
  }, [])

  const activeCohort = MOCK_SCARL_COHORTS.find(c => c.status === 'active')
  const upcomingWorkshops = MOCK_WORKSHOPS.filter(w => w.status === 'published').length
  const totalEnrollments = MOCK_ENROLLMENTS.length

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1280, margin: '0 auto' }}>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'Fira Code', monospace", marginBottom: 6 }}>Admin / Academy</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", margin: 0 }}>Academy Management</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/academy/courses" style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}35`, color: ACCENT, borderRadius: 8, padding: '8px 16px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
            + New Course
          </Link>
          <Link href="/admin/academy/workshops" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#CBD5E1', borderRadius: 8, padding: '8px 16px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
            + New Workshop
          </Link>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
        <KpiCard label="Total Courses" value={MOCK_COURSES.length} sub={`${MOCK_COURSES.filter(c => c.status === 'published').length} published`} />
        <KpiCard label="Total Enrollments" value={totalEnrollments} sub={`${MOCK_ENROLLMENTS.filter(e => e.status === 'active').length} active`} />
        <KpiCard label="Active Workshops" value={upcomingWorkshops} sub="upcoming / open" accent="#6BA3E8" />
        <KpiCard label="SCARL Cohort" value={activeCohort ? activeCohort.participants.length : 0} sub={activeCohort ? `Week ${activeCohort.current_week} of 6` : 'No active cohort'} accent="#E8916F" />
        <KpiCard label="Revenue MTD" value={`$${revenueMTD.toLocaleString()}`} sub="paid enrollments" accent="#4ade80" />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <EnrollmentTrendChart />
          <TopCoursesChart />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <RecentEnrollments />
          <QuickLinks />
        </div>
      </div>

      {/* MENTOR Panel */}
      <MentorPanel />
    </div>
  )
}
