'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MOCK_SERVICE_TICKETS } from '@/lib/admin/mock-data'
import type { ServiceTicket, TicketPriority } from '@/lib/admin/types'
import { TICKET_PRIORITY_COLORS, SLA_HOURS } from '@/lib/admin/types'

// ─── Chart helpers ────────────────────────────────────────────────────────────

function sparkPath(values: number[], w: number, h: number): string {
  if (values.length < 2) return ''
  const max = Math.max(...values, 1)
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * w,
    h - (v / max) * h * 0.85,
  ])
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
}

function BarChart({ data, color, unit = '' }: { data: { label: string; value: number }[]; color: string; unit?: string }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map(d => (
        <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 20, textAlign: 'right', color: '#4A5578', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{d.label}</div>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(d.value / max) * 100}%`, background: color, borderRadius: 100, transition: 'width 0.8s ease' }} />
          </div>
          <div style={{ width: 52, textAlign: 'right', color: '#7C8DB0', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{d.value.toFixed(1)}{unit}</div>
        </div>
      ))}
    </div>
  )
}

function TrendLine({ values, color }: { values: number[]; color: string }) {
  const w = 160; const h = 40
  const path = sparkPath(values, w, h)
  const max = Math.max(...values, 1)
  const lastY = h - (values[values.length - 1] / max) * h * 0.85
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {path && <>
        <path d={`${path} L${w},${h} L0,${h} Z`} fill={`url(#grad-${color.replace('#', '')})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={(w).toFixed(1)} cy={lastY.toFixed(1)} r="3" fill={color} />
      </>}
    </svg>
  )
}

// ─── Derived analytics ────────────────────────────────────────────────────────

function useTicketAnalytics(tickets: ServiceTicket[]) {
  return useMemo(() => {
    const resolved = tickets.filter(t => t.resolved_at)
    const closed = tickets.filter(t => t.closed_at)
    const allFinished = [...resolved, ...closed]

    // Avg response time by priority (hours, mock calculation)
    const avgResponseByPriority: { label: string; value: number }[] = ['P1','P2','P3','P4'].map(p => {
      const pts = tickets.filter(t => t.priority === p as TicketPriority && t.acknowledged_at)
      const avg = pts.length
        ? pts.reduce((s, t) => s + (new Date(t.acknowledged_at!).getTime() - new Date(t.created_at).getTime()) / 3_600_000, 0) / pts.length
        : SLA_HOURS[p as TicketPriority][0] * 0.7
      return { label: p, value: +avg.toFixed(2) }
    })

    // Avg resolution time by priority
    const avgResolutionByPriority: { label: string; value: number }[] = ['P1','P2','P3','P4'].map(p => {
      const pts = tickets.filter(t => t.priority === p as TicketPriority && t.resolved_at)
      const avg = pts.length
        ? pts.reduce((s, t) => s + (new Date(t.resolved_at!).getTime() - new Date(t.created_at).getTime()) / 3_600_000, 0) / pts.length
        : SLA_HOURS[p as TicketPriority][1] * 0.75
      return { label: p, value: +avg.toFixed(2) }
    })

    // SLA compliance (met vs total, per week — mock 8 weeks)
    const complianceWeekly = [88, 91, 85, 94, 89, 96, 93, 97]

    // Breach log
    const breached = tickets.filter(t => t.sla_resolution_met === false || (t.resolved_at && new Date(t.resolved_at).getTime() > new Date(t.sla_resolution_deadline).getTime()))
    const atRisk = tickets.filter(t => !['resolved','closed'].includes(t.status) && new Date(t.sla_resolution_deadline).getTime() - Date.now() < 2 * 3_600_000 && new Date(t.sla_resolution_deadline).getTime() > Date.now())

    // Overall compliance %
    const finishedCount = allFinished.length
    const metCount = tickets.filter(t => t.sla_resolution_met === true).length
    const compliancePct = finishedCount > 0 ? Math.round((metCount / finishedCount) * 100) : 0

    return { avgResponseByPriority, avgResolutionByPriority, complianceWeekly, breached, atRisk, compliancePct, metCount, finishedCount }
  }, [tickets])
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SLADashboardPage() {
  const tickets = MOCK_SERVICE_TICKETS
  const analytics = useTicketAnalytics(tickets)
  const [exportLoading, setExportLoading] = useState(false)

  async function handleExport() {
    setExportLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setExportLoading(false)
    // In production: generate PDF via API route
    alert('SLA Report exported (PDF generation would call /api/admin/sla/report in production)')
  }

  const open = tickets.filter(t => !['resolved','closed'].includes(t.status))
  const totalOpen = open.length
  const p1Open = open.filter(t => t.priority === 'P1').length

  const wkLabels = ['W1','W2','W3','W4','W5','W6','W7','W8']

  return (
    <div data-admin="true" style={{ padding: '32px 32px 64px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Link href="/admin/services/tickets" style={{ color: '#4A5578', fontSize: '0.82rem', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>Tickets</Link>
            <span style={{ color: '#4A5578' }}>›</span>
            <span style={{ color: '#7C8DB0', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>SLA Dashboard</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>SLA Dashboard</h1>
          <p style={{ color: '#7C8DB0', fontSize: '0.88rem', margin: '6px 0 0' }}>Service-level agreement tracking · {totalOpen} open tickets</p>
        </div>
        <button onClick={handleExport} disabled={exportLoading} style={{
          padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(89,163,146,0.25)',
          background: 'transparent', color: '#59A392', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
          display: 'flex', alignItems: 'center', gap: 8, opacity: exportLoading ? 0.6 : 1,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
          {exportLoading ? 'Generating PDF...' : 'Export SLA Report'}
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'SLA Compliance', value: `${analytics.compliancePct}%`, sub: `${analytics.metCount}/${analytics.finishedCount} resolved within SLA`, color: analytics.compliancePct >= 90 ? '#4ade80' : '#E8B84D' },
          { label: 'Open Tickets', value: totalOpen, sub: `${p1Open} P1 active`, color: p1Open > 0 ? '#EF4444' : '#7C8DB0' },
          { label: 'At Risk', value: analytics.atRisk.length, sub: '<2hrs to SLA breach', color: analytics.atRisk.length > 0 ? '#E8B84D' : '#4ade80' },
          { label: 'Breaches (All Time)', value: analytics.breached.length, sub: 'resolution SLA missed', color: analytics.breached.length > 0 ? '#EF4444' : '#4ade80' },
        ].map(k => (
          <div key={k.label} style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.08)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ color: '#4A5578', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{k.label}</div>
            <div style={{ color: k.color, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4 }}>{k.value}</div>
            <div style={{ color: '#4A5578', fontSize: '0.75rem' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Avg response time */}
        <div style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.08)', borderRadius: 14, padding: 20 }}>
          <div style={{ color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Avg Response Time (hrs)</div>
          <BarChart data={analytics.avgResponseByPriority} color="#6BA3E8" unit="h" />
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(['P1','P2','P3','P4'] as TicketPriority[]).map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#4A5578', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>{p} SLA: {SLA_HOURS[p][0]}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avg resolution time */}
        <div style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.08)', borderRadius: 14, padding: 20 }}>
          <div style={{ color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Avg Resolution Time (hrs)</div>
          <BarChart data={analytics.avgResolutionByPriority} color="#59A392" unit="h" />
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(['P1','P2','P3','P4'] as TicketPriority[]).map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#4A5578', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>{p} SLA: {SLA_HOURS[p][1]}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance trend */}
        <div style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.08)', borderRadius: 14, padding: 20 }}>
          <div style={{ color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>SLA Compliance % (8-week)</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ color: '#4ade80', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem', letterSpacing: '-0.02em' }}>
              {analytics.complianceWeekly[analytics.complianceWeekly.length - 1]}%
            </div>
            <TrendLine values={analytics.complianceWeekly} color="#4ade80" />
          </div>
          <div style={{ display: 'flex', gap: 0, marginTop: 8, borderTop: '1px solid rgba(89,163,146,0.07)', paddingTop: 8 }}>
            {analytics.complianceWeekly.map((v, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ height: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <div style={{ width: '60%', height: `${(v / 100) * 24}px`, background: v >= 90 ? 'rgba(74,222,128,0.4)' : 'rgba(232,184,77,0.4)', borderRadius: '2px 2px 0 0', transition: 'height 0.5s' }} />
                </div>
                <div style={{ color: '#4A5578', fontSize: '0.6rem', fontFamily: 'var(--font-mono)', marginTop: 3 }}>{wkLabels[i]}</div>
                <div style={{ color: v >= 90 ? '#4ade80' : '#E8B84D', fontSize: '0.62rem', fontFamily: 'var(--font-mono)' }}>{v}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* At-risk tickets */}
      {analytics.atRisk.length > 0 && (
        <div style={{ background: 'rgba(232,184,77,0.04)', border: '1px solid rgba(232,184,77,0.2)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8B84D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{ color: '#E8B84D', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>At-Risk Tickets — SLA breach within 2hrs</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {analytics.atRisk.map(t => {
              const ms = new Date(t.sla_resolution_deadline).getTime() - Date.now()
              const h = Math.floor(ms / 3_600_000)
              const m = Math.floor((ms % 3_600_000) / 60_000)
              return (
                <Link key={t.id} href={`/admin/services/tickets/${t.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(232,184,77,0.05)', border: '1px solid rgba(232,184,77,0.15)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: TICKET_PRIORITY_COLORS[t.priority], fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem' }}>{t.priority}</span>
                    <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500 }}>{t.title}</span>
                    <span style={{ color: '#4A5578', fontSize: '0.74rem' }}>{t.client_name}</span>
                  </div>
                  <span style={{ color: '#E8B84D', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, flexShrink: 0 }}>
                    {h}h {m}m
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Breach Log */}
      <div style={{ background: '#13132B', border: '1px solid rgba(89,163,146,0.08)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(89,163,146,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem' }}>Breach Log</div>
            <div style={{ color: '#4A5578', fontSize: '0.78rem', marginTop: 2 }}>All SLA resolution misses — for client reporting</div>
          </div>
          <span style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '3px 10px', borderRadius: 100 }}>
            {analytics.breached.length} breaches
          </span>
        </div>

        {analytics.breached.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#4ade80', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
            ✓ No SLA breaches on record
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Ticket','Priority','Type','Client','Plan','Opened','SLA Deadline','Resolved','Overage','Context'].map(h => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', color: '#4A5578', fontSize: '0.67rem', fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analytics.breached.map(t => {
                const resolMs = t.resolved_at ? new Date(t.resolved_at).getTime() : Date.now()
                const slaMs = new Date(t.sla_resolution_deadline).getTime()
                const overageMs = resolMs - slaMs
                const overH = Math.floor(overageMs / 3_600_000)
                const overM = Math.floor((overageMs % 3_600_000) / 60_000)
                return (
                  <tr key={t.id} style={{ borderTop: '1px solid rgba(89,163,146,0.07)', cursor: 'pointer' }}
                    onClick={() => window.location.href = `/admin/services/tickets/${t.id}`}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '10px 14px', color: '#7C8DB0', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{t.id}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ color: TICKET_PRIORITY_COLORS[t.priority], fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem' }}>{t.priority}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#7C8DB0', fontSize: '0.8rem' }}>{t.type}</td>
                    <td style={{ padding: '10px 14px', color: '#fff', fontSize: '0.82rem' }}>{t.client_name}</td>
                    <td style={{ padding: '10px 14px', color: '#7C8DB0', fontSize: '0.78rem', textTransform: 'capitalize' }}>{t.plan}</td>
                    <td style={{ padding: '10px 14px', color: '#7C8DB0', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#EF4444', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                      {new Date(t.sla_resolution_deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#7C8DB0', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                      {t.resolved_at ? new Date(t.resolved_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Open'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ color: '#EF4444', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.78rem' }}>+{overH}h {overM}m</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#4A5578', fontSize: '0.78rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.resolution_notes ?? `Open ${t.priority} ${t.type}`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(89,163,146,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#4A5578', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
            {analytics.breached.length} breach{analytics.breached.length !== 1 ? 'es' : ''} logged
          </span>
          <button onClick={handleExport} style={{ background: 'none', border: '1px solid rgba(89,163,146,0.2)', borderRadius: 7, padding: '6px 14px', color: '#59A392', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            Export as PDF
          </button>
        </div>
      </div>

      {/* SLA Tiers reference */}
      <div style={{ marginTop: 24, background: '#13132B', border: '1px solid rgba(89,163,146,0.08)', borderRadius: 14, padding: 20 }}>
        <div style={{ color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>SLA Tiers Reference</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {(['P1','P2','P3','P4'] as TicketPriority[]).map(p => {
            const [response, resolution] = SLA_HOURS[p]
            const descriptions: Record<TicketPriority, string> = { P1: 'Critical / Incident', P2: 'High / Significant', P3: 'Medium / Normal', P4: 'Low / Minor' }
            return (
              <div key={p} style={{ background: `${TICKET_PRIORITY_COLORS[p]}08`, border: `1px solid ${TICKET_PRIORITY_COLORS[p]}20`, borderRadius: 10, padding: 14 }}>
                <div style={{ color: TICKET_PRIORITY_COLORS[p], fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{p}</div>
                <div style={{ color: '#7C8DB0', fontSize: '0.78rem', marginBottom: 8 }}>{descriptions[p]}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                  <div>
                    <div style={{ color: '#4A5578', fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>Response</div>
                    <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{response}h</div>
                  </div>
                  <div>
                    <div style={{ color: '#4A5578', fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>Resolution</div>
                    <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{resolution < 24 ? `${resolution}h` : `${resolution/24}d`}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
