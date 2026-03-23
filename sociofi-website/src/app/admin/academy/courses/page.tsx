'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Course, CourseAudience, CourseFormat } from '@/lib/admin/types'
import { AUDIENCE_COLORS, AUDIENCE_LABELS } from '@/lib/admin/types'
import { MOCK_COURSES } from '@/lib/admin/mock-data'

const ACCENT = '#E8B84D'

const STYLES = `
  @keyframes cSpin { to { transform: rotate(360deg); } }
  @keyframes cFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`

const FORMAT_LABELS: Record<CourseFormat, string> = {
  self_paced: 'Self-Paced',
  cohort: 'Cohort',
  workshop: 'Workshop',
  live: 'Live',
}

const FORMAT_COLORS: Record<CourseFormat, string> = {
  self_paced: '#4DBFA8',
  cohort: '#6BA3E8',
  workshop: '#E8916F',
  live: '#E8B84D',
}

const STATUS_COLORS: Record<string, string> = {
  published: '#4ade80',
  draft: '#64748B',
  archived: '#EF4444',
}

// ─── MENTOR Draft Modal ───────────────────────────────────────────────────────

const GENERATED_OUTLINES: Record<string, { title: string; audience: string; modules: { title: string; lessons: string[] }[] }> = {
  default: {
    title: 'AI-Native Product Thinking',
    audience: 'Founders',
    modules: [
      { title: 'The AI-First Mindset', lessons: ['What changes when AI writes your code', 'Designing for iteration speed', 'Human oversight in AI development'] },
      { title: 'From Idea to Deployable Product', lessons: ['Defining your MVP scope with AI', 'Architecture that AI can maintain', 'Testing AI-generated code'] },
      { title: 'Shipping and Scaling', lessons: ['Production deployment patterns', 'Monitoring AI-assisted products', 'When to refactor vs rebuild'] },
    ],
  },
}

function MentorModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState({ topic: '', audience: 'founders', format: 'self_paced', price: '', requirements: '' })

  const startDraft = () => {
    setStep(2)
    setTimeout(() => setStep(3), 2500)
  }

  const outline = GENERATED_OUTLINES.default

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 560, padding: '28px 30px', animation: 'cFadeIn 0.2s ease', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ACCENT},#F0D080)` }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${ACCENT}18`, border: `1px solid ${ACCENT}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif" }}>MENTOR — Draft Course</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: step >= s ? ACCENT : 'rgba(255,255,255,0.07)' }} />
          ))}
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: 18 }}>Tell MENTOR what you want to create. It will generate a complete syllabus.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Topic / Course Title', key: 'topic', type: 'text', placeholder: 'e.g. AI-powered product thinking for founders' },
                { label: 'Price Range ($)', key: 'price', type: 'text', placeholder: 'e.g. 297–497 or Free' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6 }}>Audience</label>
                  <select
                    value={form.audience}
                    onChange={e => setForm(p => ({ ...p, audience: e.target.value }))}
                    style={{ width: '100%', background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none' }}>
                    <option value="founders">Founders</option>
                    <option value="leaders">Leaders</option>
                    <option value="teams">Teams</option>
                    <option value="developers">Developers</option>
                    <option value="all">All Audiences</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6 }}>Format</label>
                  <select
                    value={form.format}
                    onChange={e => setForm(p => ({ ...p, format: e.target.value }))}
                    style={{ width: '100%', background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none' }}>
                    <option value="self_paced">Self-Paced</option>
                    <option value="cohort">Cohort</option>
                    <option value="live">Live</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6 }}>Special Requirements</label>
                <textarea
                  placeholder="Any specific topics, case studies, or constraints..."
                  value={form.requirements}
                  onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))}
                  rows={3}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <button
              onClick={startDraft}
              disabled={!form.topic.trim()}
              style={{ marginTop: 18, width: '100%', background: form.topic.trim() ? `${ACCENT}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${form.topic.trim() ? ACCENT + '50' : 'rgba(255,255,255,0.06)'}`, color: form.topic.trim() ? ACCENT : '#475569', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: '0.85rem', cursor: form.topic.trim() ? 'pointer' : 'not-allowed' }}>
              Draft Course →
            </button>
          </div>
        )}

        {/* Step 2: Loading */}
        {step === 2 && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid ${ACCENT}25`, borderTop: `3px solid ${ACCENT}`, animation: 'cSpin 1s linear infinite', margin: '0 auto 20px' }} />
            <div style={{ fontSize: '0.95rem', color: '#E2E8F0', fontWeight: 600, fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>MENTOR is analyzing...</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Generating syllabus, lesson outlines, and module structure</div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && (
          <div>
            <div style={{ background: `${ACCENT}0a`, border: `1px solid ${ACCENT}20`, borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
              <div style={{ fontSize: '0.7rem', color: ACCENT, fontFamily: "'Fira Code', monospace", marginBottom: 6 }}>GENERATED OUTLINE</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>{outline.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Audience: {outline.audience} &nbsp;·&nbsp; {outline.modules.length} modules</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto', marginBottom: 16 }}>
              {outline.modules.map((mod, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: 6 }}>Module {i + 1}: {mod.title}</div>
                  {mod.lessons.map((l, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#64748B', marginBottom: 3 }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#475569', flexShrink: 0 }} />
                      {l}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, background: `${ACCENT}18`, border: `1px solid ${ACCENT}40`, color: ACCENT, borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                Save as Draft
              </button>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Course Card ──────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: Course }) {
  const audienceColor = AUDIENCE_COLORS[course.audience]
  const formatColor = FORMAT_COLORS[course.format]
  const statusColor = STATUS_COLORS[course.status] || '#64748B'
  const letter = course.title[0]

  return (
    <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = `${audienceColor}40`)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>

      {/* Thumbnail */}
      <div style={{ height: 90, background: `linear-gradient(135deg, ${audienceColor}25, ${audienceColor}08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <span style={{ fontSize: '2.2rem', fontWeight: 800, color: `${audienceColor}60`, fontFamily: "'Syne', sans-serif" }}>{letter}</span>
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 5 }}>
          <span style={{ background: `${audienceColor}20`, border: `1px solid ${audienceColor}40`, color: audienceColor, borderRadius: 100, padding: '2px 8px', fontSize: '0.65rem', fontWeight: 500 }}>
            {AUDIENCE_LABELS[course.audience]}
          </span>
          <span style={{ background: `${formatColor}18`, border: `1px solid ${formatColor}35`, color: formatColor, borderRadius: 100, padding: '2px 8px', fontSize: '0.65rem', fontWeight: 500 }}>
            {FORMAT_LABELS[course.format]}
          </span>
        </div>
        {course.mentor_drafted && (
          <span style={{ position: 'absolute', top: 8, right: 8, background: `${ACCENT}18`, border: `1px solid ${ACCENT}35`, color: ACCENT, borderRadius: 4, padding: '1px 7px', fontSize: '0.6rem', fontFamily: "'Fira Code', monospace" }}>
            MENTOR
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", lineHeight: 1.3, marginBottom: 4 }}>{course.title}</div>
        <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: 10 }}>{course.instructor_name}</div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: course.is_free ? '#4ade80' : '#E2E8F0', marginBottom: 10 }}>
          {course.is_free ? 'Free' : `$${course.price_usd.toLocaleString()}`}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          {[
            { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, val: course.enrollment_count },
            { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, val: course.avg_rating?.toFixed(1) ?? '—' },
            { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>, val: `${course.completion_rate}%` },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748B', fontSize: '0.75rem' }}>
              <span style={{ color: '#475569' }}>{s.icon}</span>
              {s.val}
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}30`, color: statusColor, borderRadius: 100, padding: '2px 8px', fontSize: '0.65rem' }}>
            {course.status}
          </span>
          <Link href={`/admin/content/course/${course.id}`} style={{ background: `${audienceColor}12`, border: `1px solid ${audienceColor}28`, color: audienceColor, borderRadius: 7, padding: '5px 12px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
            Edit Course
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const [audienceFilter, setAudienceFilter] = useState<'all' | CourseAudience>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all')
  const [showMentor, setShowMentor] = useState(false)

  const filtered = useMemo(() => {
    return MOCK_COURSES.filter(c => {
      const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor_name.toLowerCase().includes(search.toLowerCase())
      const matchAudience = audienceFilter === 'all' || c.audience === audienceFilter
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      return matchSearch && matchAudience && matchStatus
    })
  }, [search, audienceFilter, statusFilter])

  const audiences: Array<{ key: 'all' | CourseAudience; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'founders', label: 'Founders' },
    { key: 'leaders', label: 'Leaders' },
    { key: 'teams', label: 'Teams' },
    { key: 'developers', label: 'Developers' },
  ]

  const statuses = [
    { key: 'all', label: 'All' },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Draft' },
    { key: 'archived', label: 'Archived' },
  ]

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1280, margin: '0 auto' }}>
      <style>{STYLES}</style>
      {showMentor && <MentorModal onClose={() => setShowMentor(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'Fira Code', monospace", marginBottom: 6 }}>Academy</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", margin: 0 }}>Courses</h1>
        </div>
      </div>

      {/* MENTOR Banner */}
      <div style={{ background: `${ACCENT}0a`, border: `1px solid ${ACCENT}25`, borderRadius: 12, padding: '16px 20px', marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `${ACCENT}18`, border: `1px solid ${ACCENT}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0' }}>Ask MENTOR to draft a new course</div>
            <div style={{ fontSize: '0.73rem', color: '#64748B', marginTop: 2 }}>MENTOR analyzes your audience data and generates a complete syllabus with lesson outlines</div>
          </div>
        </div>
        <button
          onClick={() => setShowMentor(true)}
          style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}40`, color: ACCENT, borderRadius: 8, padding: '8px 16px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
          Draft Course →
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: '1', minWidth: 200, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 14px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 5 }}>
          {audiences.map(a => (
            <button
              key={a.key}
              onClick={() => setAudienceFilter(a.key)}
              style={{ background: audienceFilter === a.key ? `${ACCENT}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${audienceFilter === a.key ? ACCENT + '50' : 'rgba(255,255,255,0.07)'}`, color: audienceFilter === a.key ? ACCENT : '#64748B', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer' }}>
              {a.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {statuses.map(s => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              style={{ background: statusFilter === s.key ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${statusFilter === s.key ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`, color: statusFilter === s.key ? '#E2E8F0' : '#64748B', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer' }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {filtered.map(c => <CourseCard key={c.id} course={c} />)}
      </div>

      {/* Stats bar */}
      <div style={{ fontSize: '0.75rem', color: '#475569', fontFamily: "'Fira Code', monospace" }}>
        Showing {filtered.length} of {MOCK_COURSES.length} courses
      </div>
    </div>
  )
}
