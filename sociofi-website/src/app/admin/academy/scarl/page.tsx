'use client'

import { useState, useMemo } from 'react'
import type { SCARLCohort, SCARLParticipant, SCARLWeekStatus } from '@/lib/admin/types'
import { MOCK_SCARL_COHORTS } from '@/lib/admin/mock-data'

const ACCENT = '#E8B84D'

const STYLES = `
  @keyframes sFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes sPulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
`

const WEEK_LABELS = ['Kickoff', 'Models', 'Tech', 'Launch', 'Scale', 'Demo Day']

const WEEK_STATUS_COLORS: Record<SCARLWeekStatus, string> = {
  completed:   '#4ade80',
  in_progress: '#6BA3E8',
  missed:      '#EF4444',
  not_started: '#334155',
}

// ─── Week Dot ─────────────────────────────────────────────────────────────────

function WeekDot({ status, size = 12 }: { status: SCARLWeekStatus; size?: number }) {
  const c = WEEK_STATUS_COLORS[status]
  const pulse = status === 'in_progress'
  if (status === 'missed') {
    return (
      <span style={{ width: size, height: size, borderRadius: '50%', border: `1.5px solid ${c}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 10 10"><line x1="2" y1="2" x2="8" y2="8" stroke={c} strokeWidth="1.5"/><line x1="8" y1="2" x2="2" y2="8" stroke={c} strokeWidth="1.5"/></svg>
      </span>
    )
  }
  return (
    <span style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {pulse && <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c, opacity: 0.35, animation: 'sPulse 1.6s ease-out infinite' }} />}
      <span style={{ width: status === 'not_started' ? size - 4 : size, height: status === 'not_started' ? size - 4 : size, borderRadius: '50%', background: status === 'not_started' ? 'transparent' : c, border: `1.5px solid ${status === 'not_started' ? '#334155' : c}`, display: 'block' }} />
      {status === 'completed' && (
        <svg style={{ position: 'absolute' }} width={size * 0.55} height={size * 0.55} viewBox="0 0 10 10">
          <polyline points="2,5 4,7.5 8,3" stroke="#0a0a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </span>
  )
}

// ─── Cohort Overview Card ─────────────────────────────────────────────────────

function CohortOverviewCard({ cohort }: { cohort: SCARLCohort }) {
  const graduated = cohort.participants.filter(p => p.status === 'graduated').length
  const active = cohort.participants.filter(p => p.status === 'active').length
  const total = cohort.participants.length
  const allScores = cohort.participants.flatMap(p => p.assessment_scores.filter((s): s is number => s !== null))
  const avgScore = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null

  const STATUS_MAP: Record<string, { color: string; label: string }> = {
    upcoming: { color: '#E8B84D', label: 'Upcoming' },
    active:   { color: '#4ade80', label: 'Active' },
    completed: { color: '#6BA3E8', label: 'Completed' },
  }
  const sm = STATUS_MAP[cohort.status]

  return (
    <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ACCENT},transparent)` }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>{cohort.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            {new Date(cohort.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(cohort.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ background: `${sm.color}15`, border: `1px solid ${sm.color}30`, color: sm.color, borderRadius: 100, padding: '3px 10px', fontSize: '0.7rem' }}>{sm.label}</span>
          {cohort.status !== 'completed' && (
            <span style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`, color: ACCENT, borderRadius: 100, padding: '3px 10px', fontSize: '0.7rem' }}>Week {cohort.current_week}/6</span>
          )}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Participants', value: `${total}/${cohort.max_participants}` },
          { label: cohort.status === 'completed' ? 'Graduated' : 'Active', value: cohort.status === 'completed' ? graduated : active },
          { label: 'Avg Score', value: avgScore !== null ? `${avgScore}%` : '—' },
          { label: 'Completion', value: cohort.status === 'completed' ? `${Math.round((graduated / total) * 100)}%` : `Wk ${cohort.current_week}` },
        ].map(k => (
          <div key={k.label} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: '0.65rem', color: '#475569', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif" }}>{k.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Timeline Bar ─────────────────────────────────────────────────────────────

function WeekTimeline({ cohort }: { cohort: SCARLCohort }) {
  return (
    <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 24px' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>6-Week Timeline</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {[1, 2, 3, 4, 5, 6].map(week => {
          const isDone = week < cohort.current_week || cohort.status === 'completed'
          const isCurrent = week === cohort.current_week && cohort.status === 'active'
          const isUpcoming = week > cohort.current_week || cohort.status === 'upcoming'
          const circleColor = isDone ? '#4ade80' : isCurrent ? '#6BA3E8' : '#334155'
          return (
            <div key={week} style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                {/* Connector line */}
                {week < 6 && (
                  <div style={{ position: 'absolute', left: '50%', right: '-50%', height: 2, top: '50%', transform: 'translateY(-50%)', background: isDone ? '#4ade8040' : '#1e293b', zIndex: 0 }} />
                )}
                {isCurrent && (
                  <span style={{ position: 'absolute', width: 32, height: 32, borderRadius: '50%', background: '#6BA3E815', animation: 'sPulse 2s ease-out infinite', zIndex: 0 }} />
                )}
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: isDone ? '#4ade8020' : isCurrent ? '#6BA3E815' : '#0C1424', border: `2px solid ${circleColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                  {isDone ? (
                    <svg width="12" height="12" viewBox="0 0 10 10">
                      <polyline points="2,5 4,7.5 8,3" stroke="#4ade80" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : isCurrent ? (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6BA3E8' }} />
                  ) : (
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#334155' }} />
                  )}
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: isDone ? '#4ade80' : isCurrent ? '#6BA3E8' : '#334155', fontFamily: "'Fira Code', monospace" }}>
                Week {week}
              </div>
              <div style={{ fontSize: '0.65rem', color: isDone ? '#4ade8080' : isCurrent ? '#6BA3E880' : '#1e293b', marginTop: 2 }}>
                {WEEK_LABELS[week - 1]}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Participant Detail Modal ─────────────────────────────────────────────────

function ParticipantModal({ participant, onClose }: { participant: SCARLParticipant; onClose: () => void }) {
  const scores = participant.assessment_scores
  const validScores = scores.filter((s): s is number => s !== null)
  const overall = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : null

  const scoreColor = (s: number | null) => {
    if (s === null) return '#475569'
    if (s >= 80) return '#4ade80'
    if (s >= 60) return '#E8B84D'
    return '#EF4444'
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 580, animation: 'sFadeIn 0.2s ease', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ACCENT},transparent)` }} />

        {/* Header */}
        <div style={{ padding: '22px 26px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif" }}>{participant.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 3 }}>{participant.email}</div>
              <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: 2 }}>
                {participant.company && <>{participant.company} · </>}{participant.role}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 26px' }}>
          {/* 6-week breakdown */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.72rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Fira Code', monospace", marginBottom: 10 }}>6-Week Breakdown</div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, overflow: 'hidden' }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr', padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
                {['Week', 'Topic', 'Status', 'Assessment'].map(h => (
                  <div key={h} style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
                ))}
              </div>
              {[1, 2, 3, 4, 5, 6].map(week => {
                const wStatus = participant.week_progress[week - 1]
                const score = participant.assessment_scores[week - 1]
                const sc = scoreColor(score)
                return (
                  <div key={week} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr', padding: '10px 14px', borderBottom: week < 6 ? '1px solid rgba(255,255,255,0.03)' : 'none', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8' }}>Week {week}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{WEEK_LABELS[week - 1]}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <WeekDot status={wStatus} size={10} />
                      <span style={{ fontSize: '0.72rem', color: WEEK_STATUS_COLORS[wStatus] }}>
                        {wStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: sc }}>
                      {score !== null ? `${score}%` : '—'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Overall score */}
          {overall !== null && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${ACCENT}0a`, border: `1px solid ${ACCENT}20`, borderRadius: 8, padding: '12px 16px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>Overall Score</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: scoreColor(overall), fontFamily: "'Syne', sans-serif" }}>{overall}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Add Participant Modal ─────────────────────────────────────────────────────

function AddParticipantModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '' })
  const [saved, setSaved] = useState(false)

  const handleAdd = () => {
    if (!form.name || !form.email) return
    setSaved(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 440, padding: '26px 28px', animation: 'sFadeIn 0.2s ease', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ACCENT},transparent)` }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif" }}>Add Participant</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {saved ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#4ade8018', border: '1px solid #4ade8040', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: '#4ade80' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>Participant Added</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Full Name *', key: 'name', placeholder: 'Jane Smith' },
              { label: 'Email *', key: 'email', placeholder: 'jane@startup.com' },
              { label: 'Company', key: 'company', placeholder: 'Startup Inc.' },
              { label: 'Role', key: 'role', placeholder: 'Founder, CTO, etc.' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94A3B8', marginBottom: 5 }}>{f.label}</label>
                <input
                  value={form[f.key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '8px 11px', color: '#E2E8F0', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <button
              onClick={handleAdd}
              disabled={!form.name || !form.email}
              style={{ marginTop: 6, background: form.name && form.email ? `${ACCENT}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${form.name && form.email ? ACCENT + '50' : 'rgba(255,255,255,0.06)'}`, color: form.name && form.email ? ACCENT : '#475569', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: '0.82rem', cursor: form.name && form.email ? 'pointer' : 'not-allowed' }}>
              Add Participant
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Participants Table ───────────────────────────────────────────────────────

function ParticipantsTable({ cohort }: { cohort: SCARLCohort }) {
  const [selectedP, setSelectedP] = useState<SCARLParticipant | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const scoreColor = (s: number | null) => {
    if (s === null) return '#475569'
    if (s >= 80) return '#4ade80'
    if (s >= 60) return '#E8B84D'
    return '#EF4444'
  }

  const STATUS_COLORS_MAP: Record<string, string> = {
    active: '#4ade80',
    graduated: '#6BA3E8',
    dropped: '#EF4444',
  }

  return (
    <>
      {selectedP && <ParticipantModal participant={selectedP} onClose={() => setSelectedP(null)} />}
      {showAdd && <AddParticipantModal onClose={() => setShowAdd(false)} />}

      <div style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#E2E8F0', fontFamily: "'Syne', sans-serif" }}>
            Participants ({cohort.participants.length})
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}28`, color: ACCENT, borderRadius: 7, padding: '6px 14px', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}>
            + Add Participant
          </button>
        </div>

        {/* Col headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 0.9fr 1.6fr 1fr 0.9fr 0.7fr', gap: 0, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
          {['Name', 'Company', 'Role', 'Progress', 'Avg Score', 'Status', ''].map(h => (
            <div key={h + Math.random()} style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Fira Code', monospace" }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {cohort.participants.map((p, i) => {
          const validScores = p.assessment_scores.filter((s): s is number => s !== null)
          const avgScore = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : null
          const statusColor = STATUS_COLORS_MAP[p.status] || '#64748B'

          return (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 0.9fr 1.6fr 1fr 0.9fr 0.7fr', gap: 0, padding: '13px 20px', borderBottom: i < cohort.participants.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
              {/* Name */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#E2E8F0' }}>{p.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#475569' }}>{p.email}</div>
              </div>

              {/* Company */}
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{p.company || '—'}</div>

              {/* Role */}
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.role}</div>

              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {p.week_progress.map((ws, wi) => (
                  <WeekDot key={wi} status={ws} size={13} />
                ))}
              </div>

              {/* Avg Score */}
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: scoreColor(avgScore) }}>
                {avgScore !== null ? `${avgScore}%` : '—'}
              </div>

              {/* Status */}
              <div>
                <span style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}30`, color: statusColor, borderRadius: 100, padding: '2px 9px', fontSize: '0.68rem', textTransform: 'capitalize' }}>
                  {p.status}
                </span>
              </div>

              {/* Actions */}
              <button
                onClick={() => setSelectedP(p)}
                style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}25`, color: ACCENT, borderRadius: 6, padding: '4px 10px', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                View
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SCARLPage() {
  const [selectedCohortId, setSelectedCohortId] = useState(MOCK_SCARL_COHORTS[0]?.id ?? '')

  const selectedCohort = useMemo(() =>
    MOCK_SCARL_COHORTS.find(c => c.id === selectedCohortId) ?? MOCK_SCARL_COHORTS[0],
    [selectedCohortId]
  )

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1280, margin: '0 auto' }}>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: '0.72rem', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'Fira Code', monospace", marginBottom: 6 }}>Academy</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F0', fontFamily: "'Syne', sans-serif", margin: 0, marginBottom: 4 }}>SCARL Program</h1>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>SocioFi Cohort Accelerator Residency &amp; Launch — 6-week intensive accelerator for venture-backed founders</p>
      </div>

      {/* Cohort selector tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
        {MOCK_SCARL_COHORTS.map(c => {
          const isActive = c.id === selectedCohortId
          const statusColor = { upcoming: ACCENT, active: '#4ade80', completed: '#6BA3E8' }[c.status]
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCohortId(c.id)}
              style={{ background: isActive ? `${statusColor}15` : 'rgba(255,255,255,0.03)', border: `1px solid ${isActive ? statusColor + '40' : 'rgba(255,255,255,0.07)'}`, color: isActive ? statusColor : '#64748B', borderRadius: 8, padding: '8px 18px', fontSize: '0.82rem', fontWeight: isActive ? 600 : 400, cursor: 'pointer' }}>
              {c.name}
            </button>
          )
        })}
      </div>

      {selectedCohort && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <CohortOverviewCard cohort={selectedCohort} />
          <WeekTimeline cohort={selectedCohort} />
          <ParticipantsTable cohort={selectedCohort} />
        </div>
      )}
    </div>
  )
}
