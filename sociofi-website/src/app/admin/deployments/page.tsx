'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MOCK_DEPLOYMENTS, MOCK_AGENT_CATALOG } from '@/lib/admin/mock-data'
import {
  DEPLOYMENT_STATUS_COLORS,
  AGENT_COLORS,
  PLAN_COLORS,
  type DeploymentStatus,
  type AgentName,
} from '@/lib/admin/types'

const STYLES = `
  .dep-table-row {
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .dep-table-row:hover {
    background: rgba(89,163,146,0.06) !important;
  }
  .dep-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 0.72rem;
    font-weight: 600;
    font-family: 'Fira Code', monospace;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .dep-filter-pill {
    padding: 5px 14px;
    border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: #94A3B8;
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: 'Outfit', sans-serif;
  }
  .dep-filter-pill:hover {
    border-color: rgba(89,163,146,0.3);
    color: #E2E8F0;
  }
  .dep-filter-pill.active {
    background: rgba(89,163,146,0.15);
    border-color: rgba(89,163,146,0.4);
    color: #59A392;
  }
  .dep-health-bar {
    height: 4px;
    border-radius: 2px;
    background: rgba(255,255,255,0.06);
    overflow: hidden;
    width: 80px;
  }
  .dep-select {
    background: #0f0f2a;
    border: 1px solid rgba(255,255,255,0.08);
    color: #94A3B8;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-family: 'Outfit', sans-serif;
    outline: none;
    cursor: pointer;
  }
  .dep-input {
    background: #0f0f2a;
    border: 1px solid rgba(255,255,255,0.08);
    color: #E2E8F0;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-family: 'Outfit', sans-serif;
    outline: none;
  }
  .dep-input::placeholder { color: #475569; }
  .dep-input:focus { border-color: rgba(89,163,146,0.3); }
`

function rel(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function relFuture(iso: string): string {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000
  if (diff < 0) return 'overdue'
  if (diff < 60) return 'in <1m'
  if (diff < 3600) return `in ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `in ${Math.floor(diff / 3600)}h`
  return `in ${Math.floor(diff / 86400)}d`
}

function healthColor(score: number): string {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#E8B84D'
  return '#EF4444'
}

export default function DeploymentsPage() {
  const [statusFilter, setStatusFilter] = useState<DeploymentStatus | 'all'>('all')
  const [agentFilter, setAgentFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const today = new Date().toDateString()
  const runsToday = useMemo(() =>
    MOCK_DEPLOYMENTS.reduce((acc, dep) =>
      acc + dep.run_history.filter(r => new Date(r.started_at).toDateString() === today).length
    , 0)
  , [today])

  const avgHealth = useMemo(() => {
    const active = MOCK_DEPLOYMENTS.filter(d => d.status !== 'pending_setup' && d.status !== 'archived')
    if (!active.length) return 0
    return Math.round(active.reduce((a, d) => a + d.health_score, 0) / active.length)
  }, [])

  const errorCount = MOCK_DEPLOYMENTS.filter(d => d.status === 'error').length

  const filtered = useMemo(() => {
    return MOCK_DEPLOYMENTS.filter(dep => {
      if (statusFilter !== 'all' && dep.status !== statusFilter) return false
      if (agentFilter !== 'all' && dep.agent_name !== agentFilter) return false
      if (planFilter !== 'all' && dep.client_plan !== planFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!dep.client_name.toLowerCase().includes(q) &&
            !(dep.client_company || '').toLowerCase().includes(q) &&
            !dep.client_email.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [statusFilter, agentFilter, planFilter, search])

  const statusCounts: Record<string, number> = {
    all: MOCK_DEPLOYMENTS.length,
    active: MOCK_DEPLOYMENTS.filter(d => d.status === 'active').length,
    paused: MOCK_DEPLOYMENTS.filter(d => d.status === 'paused').length,
    error: MOCK_DEPLOYMENTS.filter(d => d.status === 'error').length,
    pending_setup: MOCK_DEPLOYMENTS.filter(d => d.status === 'pending_setup').length,
  }

  const kpiCards = [
    { label: 'Active Deployments', value: statusCounts.active, color: '#4ade80', sub: `${MOCK_DEPLOYMENTS.length} total` },
    { label: 'Avg Health Score', value: `${avgHealth}%`, color: healthColor(avgHealth), sub: 'Active deployments' },
    { label: 'Runs Today', value: runsToday, color: '#59A392', sub: 'Across all deployments' },
    { label: 'Error States', value: errorCount, color: errorCount > 0 ? '#EF4444' : '#4ade80', sub: errorCount > 0 ? 'Requires attention' : 'All clear' },
  ]

  return (
    <div style={{ color: '#E2E8F0', fontFamily: "'Outfit', sans-serif" }}>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.025em', color: '#F8FAFC', marginBottom: '4px' }}>
            Agent Deployments
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
            {MOCK_AGENT_CATALOG.length} agents · {statusCounts.active} active deployments
          </p>
        </div>
        <Link href="/admin/deployments/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'linear-gradient(135deg, #3A589E, #59A392)',
          color: '#fff', padding: '9px 18px', borderRadius: '10px',
          fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
          fontFamily: "'Syne', sans-serif",
          boxShadow: '0 4px 16px rgba(58,88,158,0.35)',
          transition: 'opacity 0.15s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Deployment
        </Link>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {kpiCards.map(k => (
          <div key={k.label} style={{
            background: '#111128', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px', padding: '18px 20px',
          }}>
            <div style={{ color: '#64748B', fontSize: '0.75rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              {k.label}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: k.color, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em', marginBottom: '4px' }}>
              {k.value}
            </div>
            <div style={{ color: '#475569', fontSize: '0.75rem' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{
        background: '#111128', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px', padding: '16px 20px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
      }}>
        {/* Status pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(['all', 'active', 'paused', 'error', 'pending_setup'] as const).map(s => (
            <button key={s} className={`dep-filter-pill${statusFilter === s ? ' active' : ''}`}
              onClick={() => setStatusFilter(s)}>
              {s === 'all' ? `All (${statusCounts.all})` :
               s === 'pending_setup' ? `Setup (${statusCounts.pending_setup})` :
               `${s.charAt(0).toUpperCase() + s.slice(1)} (${statusCounts[s]})`}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.06)' }} />

        {/* Agent filter */}
        <select className="dep-select" value={agentFilter} onChange={e => setAgentFilter(e.target.value)}>
          <option value="all">All Agents</option>
          {MOCK_AGENT_CATALOG.map(a => (
            <option key={a.name} value={a.name}>{a.label}</option>
          ))}
        </select>

        {/* Client search */}
        <input
          className="dep-input"
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '180px' }}
        />

        {/* Plan filter */}
        <select className="dep-select" value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
          <option value="all">All Plans</option>
          <option value="starter">Starter</option>
          <option value="growth">Growth</option>
          <option value="scale">Scale</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      {/* Table */}
      <div style={{
        background: '#111128', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px', overflow: 'hidden',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.8fr 1.4fr 110px 140px 110px 110px 100px 80px',
          padding: '10px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          {['Client', 'Agent', 'Status', 'Health', 'Last Run', 'Next Run', 'Plan', ''].map((h, i) => (
            <div key={i} style={{ color: '#475569', fontSize: '0.72rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>
            No deployments match your filters.
          </div>
        )}

        {filtered.map((dep, idx) => {
          const accentColor = AGENT_COLORS[dep.agent_name as AgentName]
          const statusColor = DEPLOYMENT_STATUS_COLORS[dep.status]
          const planColor = PLAN_COLORS[dep.client_plan]
          const hc = healthColor(dep.health_score)

          return (
            <Link key={dep.id} href={`/admin/deployments/${dep.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                className="dep-table-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 1.4fr 110px 140px 110px 110px 100px 80px',
                  padding: '14px 20px',
                  alignItems: 'center',
                  borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                {/* Client */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#F1F5F9', marginBottom: '2px' }}>
                    {dep.client_company || dep.client_name}
                  </div>
                  <div style={{ color: '#475569', fontSize: '0.75rem' }}>{dep.client_email}</div>
                </div>

                {/* Agent */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: accentColor, flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontFamily: "'Fira Code', monospace", color: accentColor, fontWeight: 600 }}>
                      {dep.agent_name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{dep.agent_label}</div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <span className="dep-status-badge" style={{
                    background: `${statusColor}15`,
                    color: statusColor,
                    border: `1px solid ${statusColor}30`,
                  }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                    {dep.status === 'pending_setup' ? 'Setup' : dep.status}
                  </span>
                </div>

                {/* Health */}
                <div>
                  {dep.status === 'pending_setup' ? (
                    <span style={{ color: '#475569', fontSize: '0.78rem' }}>—</span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: hc, fontFamily: "'Syne', sans-serif" }}>
                        {dep.health_score}
                      </span>
                      <div className="dep-health-bar">
                        <div style={{ height: '100%', width: `${dep.health_score}%`, background: hc, borderRadius: '2px' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Last Run */}
                <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                  {dep.last_run_at ? rel(dep.last_run_at) : <span style={{ color: '#475569' }}>Never</span>}
                </div>

                {/* Next Run */}
                <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                  {dep.next_run_at ? relFuture(dep.next_run_at) : <span style={{ color: '#475569' }}>Paused</span>}
                </div>

                {/* Plan */}
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px', borderRadius: '6px',
                    background: `${planColor}18`, color: planColor,
                    fontSize: '0.72rem', fontWeight: 600,
                    fontFamily: "'Fira Code', monospace", textTransform: 'capitalize',
                    border: `1px solid ${planColor}30`,
                  }}>
                    {dep.client_plan}
                  </span>
                </div>

                {/* Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{
                    color: '#59A392', fontSize: '0.8rem', fontWeight: 600,
                    fontFamily: "'Outfit', sans-serif",
                  }}>
                    View →
                  </span>
                </div>
              </div>
            </Link>
          )
        })}

        {/* Footer new deployment link */}
        {filtered.length > 0 && filtered.length < 5 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '14px 20px' }}>
            <Link href="/admin/deployments/new" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              color: '#59A392', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Deployment →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
