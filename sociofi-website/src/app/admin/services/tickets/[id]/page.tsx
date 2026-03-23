'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { MOCK_SERVICE_TICKETS } from '@/lib/admin/mock-data'
import type { ServiceTicket, TicketPriority, TicketStatus, TicketType } from '@/lib/admin/types'
import { TICKET_PRIORITY_COLORS, TICKET_TYPE_COLORS, TICKET_STATUS_COLORS, PLAN_COLORS, SLA_HOURS } from '@/lib/admin/types'

// ─── SLA helpers ─────────────────────────────────────────────────────────────

function slaMs(deadline: string) {
  return new Date(deadline).getTime() - Date.now()
}

function slaLabel(ms: number) {
  if (ms <= 0) {
    const e = Math.abs(ms)
    return `Breached by ${Math.floor(e / 3_600_000)}h ${Math.floor((e % 3_600_000) / 60_000)}m`
  }
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  return h > 0 ? `${h}h ${m}m remaining` : `${m}m remaining`
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// ─── SLA Tracker ─────────────────────────────────────────────────────────────

function SlaTracker({ ticket }: { ticket: ServiceTicket }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const createdMs = new Date(ticket.created_at).getTime()
  const resMs = new Date(ticket.sla_response_deadline).getTime()
  const resolMs = new Date(ticket.sla_resolution_deadline).getTime()

  // Timeline: created → response deadline → resolution deadline
  // current progress bar
  const total = resolMs - createdMs
  const progress = Math.min(Math.max((now - createdMs) / total, 0), 1)
  const resPoint = (resMs - createdMs) / total
  const isResBreached = now > resMs
  const isResolBreached = now > resolMs

  const responseColor = ticket.sla_response_met === true ? '#4ade80' : ticket.sla_response_met === false ? '#EF4444' : isResBreached ? '#EF4444' : now > resMs - 2 * 3_600_000 ? '#E8B84D' : '#4ade80'
  const resolColor = ticket.sla_resolution_met === true ? '#4ade80' : ticket.sla_resolution_met === false ? '#EF4444' : isResolBreached ? '#EF4444' : now > resolMs - 2 * 3_600_000 ? '#E8B84D' : '#4ade80'

  const [slaHours] = SLA_HOURS[ticket.priority]
  const responseRemainingMs = resMs - now
  const resolRemainingMs = resolMs - now

  return (
    <div style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.1)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
      <div style={{ color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>SLA Tracker</div>

      {/* Progress bar */}
      <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, marginBottom: 24 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress * 100}%`, background: progress > 0.9 ? '#EF4444' : progress > 0.7 ? '#E8B84D' : '#59A392', borderRadius: 100, transition: 'width 1s linear' }} />
        {/* Response deadline marker */}
        <div style={{ position: 'absolute', top: -3, left: `${resPoint * 100}%`, width: 2, height: 12, background: responseColor, transform: 'translateX(-50%)' }} />
      </div>

      {/* Two deadlines */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          {
            label: 'Response Deadline',
            deadline: ticket.sla_response_deadline,
            met: ticket.sla_response_met,
            remaining: responseRemainingMs,
            color: responseColor,
            hours: SLA_HOURS[ticket.priority][0],
          },
          {
            label: 'Resolution Deadline',
            deadline: ticket.sla_resolution_deadline,
            met: ticket.sla_resolution_met,
            remaining: resolRemainingMs,
            color: resolColor,
            hours: SLA_HOURS[ticket.priority][1],
          },
        ].map(item => (
          <div key={item.label} style={{ background: `${item.color}08`, border: `1px solid ${item.color}20`, borderRadius: 10, padding: 14 }}>
            <div style={{ color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>{item.label}</div>
            <div style={{ color: item.color, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
              {item.met === true ? '✓ Met' : item.met === false ? '✗ Breached' : slaLabel(item.remaining)}
            </div>
            <div style={{ color: '#4A5578', fontSize: '0.75rem' }}>
              {fmtTime(item.deadline)} · {item.hours}h SLA for {ticket.priority}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Timeline ────────────────────────────────────────────────────────────────

function Timeline({ ticket, onAddNote }: { ticket: ServiceTicket; onAddNote: (note: string) => void }) {
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    if (!note.trim()) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 400))
    onAddNote(note.trim())
    setNote('')
    setSubmitting(false)
  }

  return (
    <div style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.1)', borderRadius: 14, padding: 20 }}>
      <div style={{ color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>Internal Timeline</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {ticket.timeline.map((entry, i) => {
          const isAgent = entry.actor_type === 'agent'
          const isLast = i === ticket.timeline.length - 1
          return (
            <div key={entry.id} style={{ display: 'flex', gap: 12 }}>
              {/* Connector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 2 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: isAgent ? 'rgba(239,68,68,0.15)' : 'rgba(89,163,146,0.15)', border: `1.5px solid ${isAgent ? '#EF444430' : '#59A39230'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isAgent ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#59A392" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  )}
                </div>
                {!isLast && <div style={{ width: 1, flex: 1, background: 'rgba(89,163,146,0.08)', margin: '4px 0' }} />}
              </div>
              {/* Content */}
              <div style={{ paddingBottom: isLast ? 0 : 20, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ color: isAgent ? '#EF4444' : '#59A392', fontSize: '0.82rem', fontWeight: 600 }}>[{entry.actor}]</span>
                  <span style={{ color: '#4A5578', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>{fmtTime(entry.created_at)}</span>
                </div>
                <p style={{ color: '#7C8DB0', fontSize: '0.85rem', lineHeight: 1.55, margin: 0 }}>{entry.content}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add note */}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(89,163,146,0.07)' }}>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add an internal note..." rows={3}
          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(89,163,146,0.2)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: '0.85rem', resize: 'vertical', fontFamily: 'var(--font-body)' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button onClick={submit} disabled={!note.trim() || submitting} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: note.trim() ? 'pointer' : 'not-allowed', background: note.trim() ? 'linear-gradient(135deg, #3A589E, #59A392)' : 'rgba(255,255,255,0.06)', color: note.trim() ? '#fff' : '#4A5578', fontWeight: 600, fontSize: '0.85rem' }}>
            {submitting ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── WARDEN Panel ─────────────────────────────────────────────────────────────

function WardenPanel({ ticket, onApplySuggestion }: { ticket: ServiceTicket; onApplySuggestion: (text: string) => void }) {
  const [appliedSuggestion, setAppliedSuggestion] = useState(false)

  return (
    <div style={{ background: '#13132B', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 14, padding: 20 }}>
      {/* WARDEN header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <div style={{ color: '#EF4444', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.08em' }}>WARDEN</div>
          <div style={{ color: '#4A5578', fontSize: '0.7rem' }}>AI Classification</div>
        </div>
      </div>

      {/* Classification */}
      <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <div style={{ color: '#4A5578', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 3 }}>Type</div>
            <div style={{ color: TICKET_TYPE_COLORS[ticket.warden.type], fontSize: '0.85rem', fontWeight: 600 }}>{ticket.warden.type}</div>
          </div>
          <div>
            <div style={{ color: '#4A5578', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 3 }}>Priority</div>
            <div style={{ color: TICKET_PRIORITY_COLORS[ticket.warden.priority], fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{ticket.warden.priority}</div>
          </div>
        </div>
        <div style={{ color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Routing reason</div>
        <p style={{ color: '#7C8DB0', fontSize: '0.8rem', lineHeight: 1.55, margin: 0 }}>{ticket.warden.routing_reason}</p>
      </div>

      {/* Suggested resolution */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: '#4A5578', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>Suggested Resolution</div>
        <p style={{ color: '#7C8DB0', fontSize: '0.82rem', lineHeight: 1.65, margin: '0 0 10px', whiteSpace: 'pre-line' }}>{ticket.warden.suggested_resolution}</p>
        <button
          onClick={() => { onApplySuggestion(ticket.warden.suggested_resolution); setAppliedSuggestion(true) }}
          disabled={appliedSuggestion}
          style={{ width: '100%', padding: '8px', borderRadius: 8, border: 'none', cursor: appliedSuggestion ? 'not-allowed' : 'pointer', background: appliedSuggestion ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.12)', color: appliedSuggestion ? '#4ade80' : '#EF4444', fontWeight: 600, fontSize: '0.82rem' }}>
          {appliedSuggestion ? '✓ Applied to Notes' : 'Apply Suggestion →'}
        </button>
      </div>

      {/* Similar tickets */}
      {ticket.warden.similar_tickets.length > 0 && (
        <div>
          <div style={{ color: '#4A5578', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>Similar Past Tickets</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ticket.warden.similar_tickets.map(sim => (
              <Link key={sim.id} href={`/admin/services/tickets/${sim.id}`} style={{ textDecoration: 'none', display: 'block', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(89,163,146,0.1)', borderRadius: 8, padding: '10px 12px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(89,163,146,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(89,163,146,0.1)')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>{sim.id}</span>
                  <span style={{ color: '#4A5578', fontSize: '0.7rem' }}>Resolved {new Date(sim.resolved_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                </div>
                <div style={{ color: '#7C8DB0', fontSize: '0.8rem', fontWeight: 500, marginBottom: 4 }}>{sim.title}</div>
                <div style={{ color: '#4A5578', fontSize: '0.76rem', lineHeight: 1.45 }}>{sim.resolution_notes}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Status Workflow ──────────────────────────────────────────────────────────

const STATUS_FLOW: TicketStatus[] = ['open','acknowledged','in_progress','testing','resolved','closed']
const STATUS_ACTIONS: Partial<Record<TicketStatus, string>> = {
  open: 'Acknowledge',
  acknowledged: 'Start Work',
  in_progress: 'Move to Testing',
  testing: 'Resolve',
  resolved: 'Close',
}

function StatusWorkflow({ current, onTransition }: { current: TicketStatus; onTransition: (next: TicketStatus) => void }) {
  const currentIdx = STATUS_FLOW.indexOf(current)
  const nextStatus = STATUS_FLOW[currentIdx + 1] as TicketStatus | undefined
  const nextAction = STATUS_ACTIONS[current]

  return (
    <div style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.1)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
      <div style={{ color: '#4A5578', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Status Workflow</div>

      {/* Step indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16, overflowX: 'auto' }}>
        {STATUS_FLOW.map((s, i) => {
          const isDone = i < currentIdx
          const isCurrent = i === currentIdx
          const color = TICKET_STATUS_COLORS[s]
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <div style={{
                width: isCurrent ? 8 : 6, height: isCurrent ? 8 : 6, borderRadius: '50%',
                background: isDone ? '#4ade80' : isCurrent ? color : 'rgba(255,255,255,0.1)',
                border: isCurrent ? `2px solid ${color}` : 'none',
                transition: 'all 0.3s',
              }} />
              <span style={{ color: isCurrent ? color : isDone ? '#4ade80' : '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                {s.replace('_',' ')}
              </span>
              {i < STATUS_FLOW.length - 1 && <span style={{ color: '#4A5578', fontSize: '0.6rem', marginLeft: 2 }}>›</span>}
            </div>
          )
        })}
      </div>

      {nextStatus && nextAction && (
        <button onClick={() => onTransition(nextStatus)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #3A589E, #59A392)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}>
          {nextAction} →
        </button>
      )}
      {!nextAction && (
        <div style={{ textAlign: 'center', color: '#4ade80', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>✓ Closed</div>
      )}
    </div>
  )
}

// ─── Resolution Section ───────────────────────────────────────────────────────

function ResolutionSection({ ticket, onResolve }: { ticket: ServiceTicket; onResolve: (notes: string, prevention: string) => void }) {
  const [resNotes, setResNotes] = useState(ticket.resolution_notes ?? '')
  const [prevNotes, setPrevNotes] = useState(ticket.prevention_notes ?? '')
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!resNotes.trim()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    onResolve(resNotes.trim(), prevNotes.trim())
    setSaving(false)
  }

  return (
    <div style={{ background: '#13132B', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 14, padding: 20 }}>
      <div style={{ color: '#4ade80', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Resolution</div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: '#7C8DB0', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
          Resolution Notes <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <textarea value={resNotes} onChange={e => setResNotes(e.target.value)} rows={3} placeholder="What was the root cause and what was done to fix it?"
          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(89,163,146,0.2)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: '0.85rem', resize: 'vertical', fontFamily: 'var(--font-body)' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: '#7C8DB0', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>
          Prevention Notes <span style={{ color: '#4A5578' }}>(optional)</span>
        </label>
        <textarea value={prevNotes} onChange={e => setPrevNotes(e.target.value)} rows={2} placeholder="How can we prevent this from happening again?"
          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(89,163,146,0.2)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: '0.85rem', resize: 'vertical', fontFamily: 'var(--font-body)' }} />
      </div>
      <button onClick={save} disabled={!resNotes.trim() || saving} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid rgba(74,222,128,0.2)', cursor: resNotes.trim() ? 'pointer' : 'not-allowed', background: resNotes.trim() ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)', color: resNotes.trim() ? '#4ade80' : '#4A5578', fontWeight: 600, fontSize: '0.88rem' }}>
        {saving ? 'Saving...' : 'Save Resolution Notes'}
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const base = MOCK_SERVICE_TICKETS.find(t => t.id === id) ?? MOCK_SERVICE_TICKETS[0]
  const [ticket, setTicket] = useState<ServiceTicket>({ ...base, timeline: [...base.timeline] })
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleVal, setTitleVal] = useState(ticket.title)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleTransition(next: TicketStatus) {
    const actionLabels: Partial<Record<TicketStatus, string>> = {
      acknowledged: 'Acknowledged',
      in_progress: 'Work started',
      testing: 'Moved to testing',
      resolved: 'Marked as resolved',
      closed: 'Ticket closed',
    }
    setTicket(t => ({
      ...t, status: next,
      acknowledged_at: next === 'acknowledged' ? new Date().toISOString() : t.acknowledged_at,
      started_at: next === 'in_progress' ? new Date().toISOString() : t.started_at,
      resolved_at: next === 'resolved' ? new Date().toISOString() : t.resolved_at,
      closed_at: next === 'closed' ? new Date().toISOString() : t.closed_at,
      sla_response_met: next === 'acknowledged' ? new Date().getTime() < new Date(t.sla_response_deadline).getTime() : t.sla_response_met,
      sla_resolution_met: next === 'resolved' ? new Date().getTime() < new Date(t.sla_resolution_deadline).getTime() : t.sla_resolution_met,
      timeline: [...t.timeline, { id: `tl-${Date.now()}`, actor: 'Arifur Rahman', actor_type: 'human', content: `Status changed to ${next.replace('_', ' ')}.`, created_at: new Date().toISOString() }],
    }))
    showToast(`${actionLabels[next] ?? 'Status updated'} · SLA tracking updated`)
  }

  function handleAddNote(note: string) {
    setTicket(t => ({
      ...t,
      timeline: [...t.timeline, { id: `tl-${Date.now()}`, actor: 'Arifur Rahman', actor_type: 'human', content: note, created_at: new Date().toISOString() }],
    }))
    showToast('Note added to timeline')
  }

  function handleApplySuggestion(text: string) {
    setTicket(t => ({
      ...t,
      timeline: [...t.timeline, { id: `tl-${Date.now()}`, actor: 'WARDEN', actor_type: 'agent', content: `WARDEN suggestion applied to notes: "${text.substring(0, 80)}..."`, created_at: new Date().toISOString() }],
    }))
    showToast('WARDEN suggestion applied to resolution notes')
  }

  function handleResolve(notes: string, prevention: string) {
    setTicket(t => ({ ...t, resolution_notes: notes, prevention_notes: prevention || undefined }))
    showToast('Resolution notes saved')
  }

  return (
    <div data-admin="true" style={{ padding: '32px 32px 64px', maxWidth: 1300, margin: '0 auto' }}>
      <style>{`@keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000, background: '#13132B', border: '1px solid rgba(89,163,146,0.2)', borderRadius: 10, padding: '12px 20px', color: '#4ade80', fontSize: '0.88rem', fontFamily: 'var(--font-mono)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Link href="/admin/services/tickets" style={{ color: '#4A5578', fontSize: '0.82rem', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>Tickets</Link>
        <span style={{ color: '#4A5578' }}>›</span>
        <span style={{ color: '#7C8DB0', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>{ticket.id}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        {editingTitle ? (
          <input value={titleVal} onChange={e => setTitleVal(e.target.value)}
            onBlur={() => { setTicket(t => ({ ...t, title: titleVal })); setEditingTitle(false) }}
            onKeyDown={e => { if (e.key === 'Enter') { setTicket(t => ({ ...t, title: titleVal })); setEditingTitle(false) } }}
            autoFocus
            style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.5rem', fontWeight: 700, background: 'transparent', border: 'none', borderBottom: '2px solid #59A392', outline: 'none', width: '100%', letterSpacing: '-0.02em' }} />
        ) : (
          <h1
            onClick={() => setEditingTitle(true)}
            style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', margin: 0, cursor: 'text' }}
            title="Click to edit">
            {ticket.title}
          </h1>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          {/* Priority dropdown */}
          <select value={ticket.priority} onChange={e => setTicket(t => ({ ...t, priority: e.target.value as TicketPriority }))}
            style={{ background: `${TICKET_PRIORITY_COLORS[ticket.priority]}15`, border: `1px solid ${TICKET_PRIORITY_COLORS[ticket.priority]}30`, borderRadius: 8, padding: '5px 10px', color: TICKET_PRIORITY_COLORS[ticket.priority], fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, cursor: 'pointer' }}>
            {(['P1','P2','P3','P4'] as TicketPriority[]).map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Status dropdown */}
          <select value={ticket.status} onChange={e => setTicket(t => ({ ...t, status: e.target.value as TicketStatus }))}
            style={{ background: `${TICKET_STATUS_COLORS[ticket.status]}15`, border: `1px solid ${TICKET_STATUS_COLORS[ticket.status]}30`, borderRadius: 8, padding: '5px 10px', color: TICKET_STATUS_COLORS[ticket.status], fontSize: '0.78rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', textTransform: 'uppercase' }}>
            {(['open','acknowledged','in_progress','testing','resolved','closed'] as TicketStatus[]).map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
          </select>

          {/* Type dropdown */}
          <select value={ticket.type} onChange={e => setTicket(t => ({ ...t, type: e.target.value as TicketType }))}
            style={{ background: `${TICKET_TYPE_COLORS[ticket.type]}15`, border: `1px solid ${TICKET_TYPE_COLORS[ticket.type]}30`, borderRadius: 8, padding: '5px 10px', color: TICKET_TYPE_COLORS[ticket.type], fontSize: '0.78rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', textTransform: 'uppercase' }}>
            {(['bug','feature','security','performance','incident'] as TicketType[]).map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <span style={{ color: '#4A5578', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginLeft: 4 }}>{ticket.id}</span>

          {/* Tags */}
          {ticket.tags.map(tag => (
            <span key={tag} style={{ background: 'rgba(89,163,146,0.08)', color: '#59A392', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 100 }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Client info */}
          <div style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.1)', borderRadius: 14, padding: 20 }}>
            <div style={{ color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Client</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{ticket.client_name}</div>
                <div style={{ color: '#7C8DB0', fontSize: '0.82rem', marginTop: 2 }}>{ticket.client_email} {ticket.client_company && `· ${ticket.client_company}`}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ background: `${PLAN_COLORS[ticket.plan]}18`, color: PLAN_COLORS[ticket.plan], fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 100, textTransform: 'uppercase', border: `1px solid ${PLAN_COLORS[ticket.plan]}30` }}>
                  {ticket.plan} plan
                </span>
                <Link href={`/admin/contacts`} style={{ color: '#59A392', fontSize: '0.78rem', textDecoration: 'none' }}>View contact →</Link>
              </div>
            </div>
          </div>

          {/* SLA Tracker */}
          <SlaTracker ticket={ticket} />

          {/* Description */}
          <div style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.1)', borderRadius: 14, padding: 20 }}>
            <div style={{ color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Description</div>
            <p style={{ color: '#7C8DB0', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{ticket.description}</p>

            {/* Attachments */}
            {ticket.attachments.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(89,163,146,0.07)' }}>
                <div style={{ color: '#4A5578', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Attachments</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {ticket.attachments.map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 12px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C8DB0" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span style={{ color: '#7C8DB0', fontSize: '0.82rem', flex: 1 }}>{a.filename}</span>
                      <span style={{ color: '#4A5578', fontSize: '0.74rem' }}>{Math.round(a.size_bytes / 1024)} KB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload area */}
            <div style={{ marginTop: 14, border: '1.5px dashed rgba(89,163,146,0.2)', borderRadius: 8, padding: '12px', textAlign: 'center', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(89,163,146,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(89,163,146,0.2)')}>
              <p style={{ color: '#4A5578', fontSize: '0.8rem', margin: 0 }}>Drag files or screenshots here, or click to upload</p>
            </div>
          </div>

          {/* Timeline */}
          <Timeline ticket={ticket} onAddNote={handleAddNote} />

          {/* Resolution (only if in testing or later) */}
          {['testing','resolved','closed'].includes(ticket.status) && (
            <ResolutionSection ticket={ticket} onResolve={handleResolve} />
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <StatusWorkflow current={ticket.status} onTransition={handleTransition} />
          <WardenPanel ticket={ticket} onApplySuggestion={handleApplySuggestion} />
        </div>
      </div>
    </div>
  )
}
