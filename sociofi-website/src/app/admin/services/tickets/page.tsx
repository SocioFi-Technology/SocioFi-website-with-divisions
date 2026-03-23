'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { MOCK_SERVICE_TICKETS } from '@/lib/admin/mock-data'
import type { ServiceTicket, TicketPriority, TicketStatus, TicketType } from '@/lib/admin/types'
import { TICKET_PRIORITY_COLORS, TICKET_TYPE_COLORS, TICKET_STATUS_COLORS, PLAN_COLORS } from '@/lib/admin/types'

// ─── SLA Countdown ────────────────────────────────────────────────────────────

function slaRemaining(deadline: string, now: number) {
  const ms = new Date(deadline).getTime() - now
  if (ms <= 0) {
    const elapsed = Math.abs(ms)
    const h = Math.floor(elapsed / 3_600_000)
    const m = Math.floor((elapsed % 3_600_000) / 60_000)
    return { ms, label: `+${h}h ${m}m`, color: '#EF4444', status: 'breached' as const }
  }
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  const s = Math.floor((ms % 60_000) / 1_000)
  const color = ms < 2 * 3_600_000 ? '#E8B84D' : '#4ade80'
  const status = ms < 2 * 3_600_000 ? 'warning' as const : 'ok' as const
  const label = h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`
  return { ms, label, color, status }
}

// ─── New Ticket Modal ─────────────────────────────────────────────────────────

function NewTicketModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'classifying' | 'done'>('form')
  const [form, setForm] = useState({ client: 'anna@ecomstore.de', type: 'bug', title: '', description: '' })
  const [classified, setClassified] = useState({ priority: 'P2', assigned_to: 'Kamrul Hasan', reason: '' })

  async function classify() {
    setStep('classifying')
    await new Promise(r => setTimeout(r, 1800))
    const priority = form.type === 'security' || form.type === 'incident' ? 'P1' : form.type === 'bug' ? 'P2' : 'P3'
    setClassified({
      priority,
      assigned_to: form.type === 'security' ? 'Arifur Rahman' : 'Kamrul Hasan',
      reason: `WARDEN classified as ${form.type.toUpperCase()} based on title/description analysis. ${priority} priority assigned. Routed to best-available engineer.`,
    })
    setStep('done')
  }

  const CLIENTS = [
    { email: 'anna@ecomstore.de', label: 'Anna Müller (EcomStore · Scale)' },
    { email: 'sarah@techcorp.io', label: 'Sarah Chen (TechCorp · Growth)' },
    { email: 'priya@datasync.in', label: 'Priya Mehta (DataSync · Enterprise)' },
    { email: 'james@founderhq.co', label: 'James Okafor (FounderHQ · Starter)' },
  ]

  const inp = { width: '100%', boxSizing: 'border-box' as const, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(89,163,146,0.2)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: '0.88rem' }
  const lbl = { color: '#7C8DB0', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.07em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 5 }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.15)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 540 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>New Ticket</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        {step === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={lbl}>Client</label>
              <select value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                {CLIENTS.map(c => <option key={c.email} value={c.email}>{c.label}</option>)}
              </select></div>
            <div><label style={lbl}>Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                {['bug','feature','security','performance','incident'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select></div>
            <div><label style={lbl}>Title</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Brief description of the issue..." style={inp} /></div>
            <div><label style={lbl}>Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Detailed description, steps to reproduce, impact..." rows={4} style={{ ...inp, resize: 'vertical' }} /></div>
            <p style={{ color: '#4A5578', fontSize: '0.78rem', margin: 0 }}>WARDEN will auto-classify priority and suggest an assignee after submission.</p>
            <button onClick={classify} disabled={!form.title.trim()} style={{ padding: '10px 0', borderRadius: 8, border: 'none', cursor: form.title.trim() ? 'pointer' : 'not-allowed', background: form.title.trim() ? 'linear-gradient(135deg, #3A589E, #59A392)' : 'rgba(255,255,255,0.06)', color: form.title.trim() ? '#fff' : '#4A5578', fontWeight: 600, fontSize: '0.9rem' }}>
              Submit to WARDEN
            </button>
          </div>
        )}

        {step === 'classifying' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(239,68,68,0.3)', borderTopColor: '#EF4444', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
            <p style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', margin: '0 0 6px' }}>WARDEN is classifying...</p>
            <p style={{ color: '#4A5578', fontSize: '0.85rem', margin: 0 }}>Analysing type, priority, and best assignee</p>
          </div>
        )}

        {step === 'done' && (
          <div>
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ color: '#4A5578', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>WARDEN Classification</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ color: '#4A5578', fontSize: '0.72rem', marginBottom: 3 }}>Priority</div>
                  <div style={{ color: TICKET_PRIORITY_COLORS[classified.priority as TicketPriority], fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem' }}>{classified.priority}</div>
                </div>
                <div>
                  <div style={{ color: '#4A5578', fontSize: '0.72rem', marginBottom: 3 }}>Assigned to</div>
                  <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 500 }}>{classified.assigned_to}</div>
                </div>
              </div>
              <div style={{ color: '#7C8DB0', fontSize: '0.8rem', lineHeight: 1.5 }}>{classified.reason}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid rgba(89,163,146,0.2)', background: 'transparent', color: '#7C8DB0', cursor: 'pointer', fontSize: '0.85rem' }}>Dismiss</button>
              <button onClick={onClose} style={{ flex: 2, padding: '10px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #3A589E, #59A392)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Create Ticket</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const color = TICKET_PRIORITY_COLORS[priority]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0, animation: priority === 'P1' ? 'pulse-dot 1.5s ease-out infinite' : undefined }} />
      <span style={{ color, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem' }}>{priority}</span>
    </span>
  )
}

function TypeBadge({ type }: { type: TicketType }) {
  const color = TICKET_TYPE_COLORS[type]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${color}18`, color, border: `1px solid ${color}30`, fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.06em', padding: '2px 8px', borderRadius: 100, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {type === 'incident' && <span style={{ width: 4, height: 4, borderRadius: '50%', background: color, animation: 'pulse-dot 1.2s ease-out infinite', flexShrink: 0 }} />}
      {type}
    </span>
  )
}

function StatusBadge({ status }: { status: TicketStatus }) {
  const color = TICKET_STATUS_COLORS[status]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${color}15`, color, fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.05em', padding: '2px 8px', borderRadius: 100, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      <span style={{ width: 4, height: 4, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {status.replace('_', ' ')}
    </span>
  )
}

function SlaCell({ ticket, now }: { ticket: ServiceTicket; now: number }) {
  if (ticket.status === 'resolved' || ticket.status === 'closed') {
    const met = ticket.sla_resolution_met
    return <span style={{ color: met ? '#4ade80' : '#EF4444', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>{met ? '✓ Met' : '✗ Breached'}</span>
  }
  const sla = slaRemaining(ticket.sla_resolution_deadline, now)
  return (
    <span style={{ color: sla.color, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 600, background: `${sla.color}12`, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>
      {sla.ms <= 0 ? '⚠ ' : ''}{sla.label}
    </span>
  )
}

function ageLabel(createdAt: string) {
  const ms = Date.now() - new Date(createdAt).getTime()
  const h = Math.floor(ms / 3_600_000)
  if (h < 1) return `${Math.floor(ms / 60_000)}m`
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TicketsPage() {
  const [tickets] = useState<ServiceTicket[]>(MOCK_SERVICE_TICKETS)
  const [showNew, setShowNew] = useState(false)
  const [now, setNow] = useState(Date.now())

  const [filterPriority, setFilterPriority] = useState<TicketPriority | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all')
  const [filterSla, setFilterSla] = useState<'all' | 'ok' | 'warning' | 'breached'>('all')
  const [filterAssigned, setFilterAssigned] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const getSlaStatus = useCallback((t: ServiceTicket) => {
    if (t.status === 'resolved' || t.status === 'closed') return t.sla_resolution_met ? 'ok' : 'breached'
    return slaRemaining(t.sla_resolution_deadline, now).status
  }, [now])

  const filtered = tickets.filter(t => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (filterAssigned !== 'all') {
      if (filterAssigned === 'unassigned' && !!t.assigned_to) return false
      if (filterAssigned !== 'unassigned' && t.assigned_to !== filterAssigned) return false
    }
    if (filterSla !== 'all' && getSlaStatus(t) !== filterSla) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase()) && !t.client_name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => ({ P1: 0, P2: 1, P3: 2, P4: 3 }[a.priority] - { P1: 0, P2: 1, P3: 2, P4: 3 }[b.priority]))

  const open = tickets.filter(t => !['resolved','closed'].includes(t.status)).length
  const p1Active = tickets.filter(t => t.priority === 'P1' && !['resolved','closed'].includes(t.status)).length
  const breachedCount = tickets.filter(t => getSlaStatus(t) === 'breached').length
  const resolvedToday = tickets.filter(t => t.resolved_at && Date.now() - new Date(t.resolved_at).getTime() < 86400000).length

  const assignees = Array.from(new Set(tickets.map(t => t.assigned_to).filter(Boolean))) as string[]

  const fb = (active: boolean, color = '#59A392') => ({
    padding: '5px 12px', borderRadius: 7, cursor: 'pointer', border: 'none', fontSize: '0.78rem',
    background: active ? `${color}20` : 'rgba(255,255,255,0.04)',
    color: active ? color : '#64748B', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' as const,
  })

  return (
    <div data-admin="true" style={{ padding: '32px 32px 64px', maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {showNew && <NewTicketModal onClose={() => setShowNew(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>Tickets</h1>
          <p style={{ color: '#7C8DB0', fontSize: '0.88rem', margin: '6px 0 0' }}>WARDEN-managed support queue · {open} open</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/services/sla" style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid rgba(89,163,146,0.2)', background: 'transparent', color: '#7C8DB0', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            SLA Dashboard
          </Link>
          <button onClick={() => setShowNew(true)} style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #3A589E, #59A392)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Ticket
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Open Tickets', value: open, color: '#7C8DB0' },
          { label: 'P1 Active', value: p1Active, color: p1Active > 0 ? '#EF4444' : '#4ade80' },
          { label: 'SLA Breached', value: breachedCount, color: breachedCount > 0 ? '#EF4444' : '#4ade80' },
          { label: 'Resolved Today', value: resolvedToday, color: '#4ade80' },
        ].map(k => (
          <div key={k.label} style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.08)', borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ color: '#4A5578', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{k.label}</div>
            <div style={{ color: k.color, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.02em', lineHeight: 1 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.08)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4A5578" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(89,163,146,0.15)', borderRadius: 7, padding: '6px 10px 6px 28px', color: '#fff', fontSize: '0.82rem', width: 190 }} />
        </div>

        <span style={{ width: 1, height: 20, background: 'rgba(89,163,146,0.1)', flexShrink: 0, display: 'inline-block' }} />

        <div style={{ display: 'flex', gap: 4 }}>
          <button style={fb(filterPriority === 'all')} onClick={() => setFilterPriority('all')}>All</button>
          {(['P1','P2','P3','P4'] as TicketPriority[]).map(p => (
            <button key={p} style={fb(filterPriority === p, TICKET_PRIORITY_COLORS[p])} onClick={() => setFilterPriority(filterPriority === p ? 'all' : p)}>{p}</button>
          ))}
        </div>

        <span style={{ width: 1, height: 20, background: 'rgba(89,163,146,0.1)', flexShrink: 0, display: 'inline-block' }} />

        <div style={{ display: 'flex', gap: 4 }}>
          {(['open','in_progress','testing','resolved'] as TicketStatus[]).map(s => (
            <button key={s} style={fb(filterStatus === s, TICKET_STATUS_COLORS[s])} onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}>
              {s.replace('_',' ')}
            </button>
          ))}
        </div>

        <span style={{ width: 1, height: 20, background: 'rgba(89,163,146,0.1)', flexShrink: 0, display: 'inline-block' }} />

        <div style={{ display: 'flex', gap: 4 }}>
          <button style={fb(filterSla === 'ok', '#4ade80')} onClick={() => setFilterSla(filterSla === 'ok' ? 'all' : 'ok')}>On Track</button>
          <button style={fb(filterSla === 'warning', '#E8B84D')} onClick={() => setFilterSla(filterSla === 'warning' ? 'all' : 'warning')}>At Risk</button>
          <button style={fb(filterSla === 'breached', '#EF4444')} onClick={() => setFilterSla(filterSla === 'breached' ? 'all' : 'breached')}>Breached</button>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <select value={filterAssigned} onChange={e => setFilterAssigned(e.target.value)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(89,163,146,0.15)', borderRadius: 7, padding: '6px 10px', color: '#7C8DB0', fontSize: '0.82rem', cursor: 'pointer' }}>
            <option value="all">All assignees</option>
            <option value="unassigned">Unassigned</option>
            {assignees.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.08)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.025)' }}>
              {['Priority','Status','Client','Plan','Type','Title','Assigned','SLA (Resolution)','Age'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#4A5578', fontSize: '0.67rem', fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: '48px 16px', textAlign: 'center', color: '#4A5578', fontSize: '0.9rem' }}>No tickets match your filters.</td></tr>
            ) : filtered.map(ticket => (
              <tr key={ticket.id}
                style={{ borderTop: '1px solid rgba(89,163,146,0.07)', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                onClick={() => window.location.href = `/admin/services/tickets/${ticket.id}`}>
                <td style={{ padding: '11px 14px' }}><PriorityBadge priority={ticket.priority} /></td>
                <td style={{ padding: '11px 14px' }}><StatusBadge status={ticket.status} /></td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500 }}>{ticket.client_name}</div>
                  <div style={{ color: '#4A5578', fontSize: '0.74rem' }}>{ticket.client_company}</div>
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <span style={{ background: `${PLAN_COLORS[ticket.plan]}18`, color: PLAN_COLORS[ticket.plan], fontSize: '0.67rem', fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 100, textTransform: 'uppercase' }}>{ticket.plan}</span>
                </td>
                <td style={{ padding: '11px 14px' }}><TypeBadge type={ticket.type} /></td>
                <td style={{ padding: '11px 14px', maxWidth: 300 }}>
                  <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</div>
                  <div style={{ color: '#4A5578', fontSize: '0.72rem', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{ticket.id}</div>
                </td>
                <td style={{ padding: '11px 14px', color: ticket.assigned_to ? '#7C8DB0' : '#EF4444', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                  {ticket.assigned_to ?? 'Unassigned'}
                </td>
                <td style={{ padding: '11px 14px' }}><SlaCell ticket={ticket} now={now} /></td>
                <td style={{ padding: '11px 14px', color: '#4A5578', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                  {ageLabel(ticket.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(89,163,146,0.07)' }}>
          <span style={{ color: '#4A5578', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>{filtered.length} of {tickets.length} tickets</span>
        </div>
      </div>
    </div>
  )
}
