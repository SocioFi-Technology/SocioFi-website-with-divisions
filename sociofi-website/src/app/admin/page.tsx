'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDashboardData } from '@/lib/admin/use-dashboard-data'
import { useRealtime } from '@/lib/admin/use-realtime'
import type { ActivityItem } from '@/lib/admin/use-dashboard-data'

// ── Helpers ──────────────────────────────────────────────────
function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function Trend({ delta }: { delta: number }) {
  if (delta > 0) return <span style={{ color: '#4ade80', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px' }}>↑ {delta}</span>
  if (delta < 0) return <span style={{ color: '#f87171', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px' }}>↓ {Math.abs(delta)}</span>
  return <span style={{ color: '#64748B', fontSize: '0.75rem' }}>→</span>
}

// ── KPI Card ──────────────────────────────────────────────────
function KPICard({ label, value, delta, href, amber, pulse }: {
  label: string; value: number; delta?: number; href: string;
  amber?: boolean; pulse?: boolean;
}) {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(href)}
      style={{
        background: '#12162A',
        border: `1px solid ${amber ? 'rgba(232,184,77,0.4)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '14px',
        padding: '20px',
        cursor: 'pointer',
        minWidth: '160px',
        flexShrink: 0,
        transition: 'all 0.2s',
        boxShadow: amber ? '0 0 0 1px rgba(232,184,77,0.15)' : 'none',
        animation: pulse ? 'kpi-pulse 0.5s ease' : 'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = amber ? 'rgba(232,184,77,0.6)' : 'rgba(89,163,146,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = amber ? 'rgba(232,184,77,0.4)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#E2E8F0', lineHeight: 1, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em' }}>
        {value.toLocaleString()}
      </div>
      <div style={{ color: '#64748B', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px', marginBottom: '8px' }}>
        {label}
      </div>
      {delta !== undefined && <Trend delta={delta} />}
    </div>
  )
}

// ── Agent Card ──────────────────────────────────────────────────
function AgentCard({ agent, pulse }: {
  agent: { id: string; name: string; role: string; status: string; lastRunMinutes: number | null; tasksToday: number; color: string };
  pulse?: boolean
}) {
  const router = useRouter()
  const statusColor = agent.status === 'active' ? '#4ade80' : agent.status === 'delayed' ? '#E8B84D' : agent.status === 'error' ? '#EF4444' : '#64748B'
  const lastRun = agent.lastRunMinutes === null ? 'No runs today' : agent.lastRunMinutes < 60 ? `${agent.lastRunMinutes}m ago` : `${Math.floor(agent.lastRunMinutes / 60)}h ago`

  return (
    <div
      onClick={() => router.push('/admin/agents')}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '10px',
        padding: '12px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        animation: pulse ? 'kpi-pulse 0.5s ease' : 'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ color: agent.color, fontSize: '0.78rem', fontWeight: 700, fontFamily: "'Fira Code', monospace" }}>{agent.name}</span>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}`, display: 'inline-block' }} />
      </div>
      <div style={{ color: '#64748B', fontSize: '0.68rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.role}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#475569', fontSize: '0.64rem', fontFamily: "'Fira Code', monospace" }}>{lastRun}</span>
        {agent.tasksToday > 0 && <span style={{ color: '#59A392', fontSize: '0.64rem', fontFamily: "'Fira Code', monospace" }}>{agent.tasksToday} tasks</span>}
      </div>
    </div>
  )
}

// ── Approval Row ──────────────────────────────────────────────
function ApprovalRow({ item, onApprove }: {
  item: { id: string; agent_name: string; action_type: string; subject: string; urgency: string; confidence: number; created_at: string };
  onApprove: (id: string) => void
}) {
  const agentColors: Record<string, string> = {
    HERALD: '#5BB5E0', SCRIBE: '#7B6FE8', BROKER: '#E8B84D', COMPASS: '#4DBFA8', INTAKE: '#72C4B2',
  }
  const urgencyColor = item.urgency === 'high' ? '#EF4444' : item.urgency === 'medium' ? '#E8B84D' : '#64748B'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <span style={{
        background: `${agentColors[item.agent_name] ?? '#59A392'}20`,
        color: agentColors[item.agent_name] ?? '#59A392',
        fontSize: '0.62rem', fontWeight: 700, padding: '3px 7px',
        borderRadius: '4px', fontFamily: "'Fira Code', monospace",
        flexShrink: 0, letterSpacing: '0.06em',
      }}>{item.agent_name}</span>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ color: '#E2E8F0', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.subject}</div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '3px', alignItems: 'center' }}>
          <span style={{ color: urgencyColor, fontSize: '0.65rem', textTransform: 'uppercase', fontFamily: "'Fira Code', monospace" }}>{item.urgency}</span>
          <span style={{ color: '#64748B', fontSize: '0.65rem' }}>{item.confidence}% confidence</span>
          <span style={{ color: '#475569', fontSize: '0.65rem' }}>{relativeTime(item.created_at)}</span>
        </div>
      </div>
      <button
        onClick={() => onApprove(item.id)}
        style={{
          background: 'rgba(89,163,146,0.15)',
          border: '1px solid rgba(89,163,146,0.3)',
          borderRadius: '6px', color: '#59A392',
          fontSize: '0.72rem', fontWeight: 600,
          padding: '6px 12px', cursor: 'pointer',
          transition: 'all 0.15s', flexShrink: 0,
          fontFamily: "'Outfit', sans-serif",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(89,163,146,0.25)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(89,163,146,0.15)' }}
      >
        Approve
      </button>
    </div>
  )
}

// ── Attention Row ──────────────────────────────────────────────
function AttentionRow({ item }: { item: { id: string; type: string; priority: string; description: string; time: string; href: string } }) {
  const router = useRouter()
  const isRed = item.priority === 'red'
  const typeLabels: Record<string, string> = { ticket: '[TKT]', submission: '[SUB]', followup: '[FUP]', ventures: '[VEN]', sla: '[SLA]' }

  return (
    <div
      onClick={() => router.push(item.href)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        padding: '12px', borderRadius: '8px',
        background: isRed ? 'rgba(239,68,68,0.06)' : 'rgba(232,184,77,0.06)',
        border: `1px solid ${isRed ? 'rgba(239,68,68,0.2)' : 'rgba(232,184,77,0.2)'}`,
        marginBottom: '8px', cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = isRed ? 'rgba(239,68,68,0.1)' : 'rgba(232,184,77,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.background = isRed ? 'rgba(239,68,68,0.06)' : 'rgba(232,184,77,0.06)' }}
    >
      <span style={{ fontSize: '0.62rem', fontFamily: "'Fira Code', monospace", color: isRed ? '#f87171' : '#E8B84D', flexShrink: 0, marginTop: '2px', fontWeight: 700 }}>{typeLabels[item.type] ?? '[•]'}</span>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ color: '#E2E8F0', fontSize: '0.78rem', lineHeight: 1.4 }}>{item.description}</div>
        <div style={{ color: isRed ? '#f87171' : '#E8B84D', fontSize: '0.68rem', marginTop: '4px', fontFamily: "'Fira Code', monospace" }}>{item.time}</div>
      </div>
    </div>
  )
}

// ── Activity Row ──────────────────────────────────────────────
function ActivityRow({ item, isNew }: { item: ActivityItem; isNew: boolean }) {
  const agentColors: Record<string, string> = {
    INTAKE: '#72C4B2', SCRIBE: '#7B6FE8', HERALD: '#5BB5E0', WARDEN: '#E8916F',
    COMPASS: '#4DBFA8', CHRONICLE: '#6BA3E8', SENTINEL: '#E8B84D', BROKER: '#A78BFA',
    NEXUS: '#59A392', BEACON: '#EF4444', FORGE: '#7B6FE8', ATLAS: '#72C4B2', MIRROR: '#E8916F',
  }

  const actorColor = item.actor_type === 'agent' ? (agentColors[item.actor] ?? '#59A392') : '#E2E8F0'
  const avatarBg = item.actor_type === 'agent'
    ? `${agentColors[item.actor] ?? '#59A392'}25`
    : 'linear-gradient(135deg, #3A589E, #59A392)'
  const initials = item.actor_type === 'agent'
    ? item.actor.slice(0, 2)
    : item.actor.split(' ').map((n: string) => n[0]).join('').slice(0, 2)

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.03)',
      animation: isNew ? 'kpi-pulse 0.5s ease' : 'none',
    }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
        background: avatarBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: item.actor_type === 'agent' ? '0.6rem' : '0.7rem',
        color: item.actor_type === 'agent' ? (agentColors[item.actor] ?? '#59A392') : 'white',
        fontWeight: 700, fontFamily: "'Fira Code', monospace",
        border: `1px solid ${item.actor_type === 'agent' ? `${agentColors[item.actor] ?? '#59A392'}40` : 'transparent'}`,
      }}>
        {initials}
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ color: '#94A3B8', fontSize: '0.78rem', lineHeight: 1.4 }}>
          <span style={{ color: actorColor, fontWeight: 600 }}>
            {item.actor}
          </span>
          {' '}{item.action}
        </div>
        <div style={{ color: '#475569', fontSize: '0.65rem', marginTop: '3px', fontFamily: "'Fira Code', monospace" }}>{relativeTime(item.created_at)}</div>
      </div>
    </div>
  )
}

// ── Pipeline Snapshot ──────────────────────────────────────────
function PipelineSnapshot({ pipeline }: {
  pipeline: { division: string; color: string; total: number; stages: { label: string; count: number; color: string }[] }[]
}) {
  const router = useRouter()

  return (
    <div style={{
      background: '#12162A',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '14px',
      padding: '24px',
    }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>— PIPELINE</div>
          <div style={{ color: '#E2E8F0', fontSize: '1.1rem', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>Division Pipeline Snapshot</div>
        </div>
        <div style={{ color: '#64748B', fontSize: '0.75rem' }}>Click any row to view division</div>
      </div>

      {pipeline.map(row => (
        <div
          key={row.division}
          onClick={() => router.push(`/admin/divisions/${row.division.toLowerCase()}`)}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', cursor: 'pointer' }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0.8' }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
        >
          <div style={{ width: '80px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: row.color, fontSize: '0.75rem', fontWeight: 600 }}>{row.division}</span>
            <span style={{ color: '#64748B', fontSize: '0.7rem', marginLeft: '6px' }}>{row.total}</span>
          </div>
          <div style={{ flex: 1, height: '28px', display: 'flex', borderRadius: '4px', overflow: 'hidden', gap: '1px' }}>
            {row.stages.map(stage => (
              <div
                key={stage.label}
                title={`${stage.label}: ${stage.count}`}
                style={{
                  flex: stage.count,
                  background: stage.color,
                  minWidth: stage.count > 0 ? '4px' : '0',
                  transition: 'flex 0.3s',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap' }}>
            {row.stages.map(stage => (
              <div key={stage.label} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '1px', background: stage.color, display: 'inline-block' }} />
                <span style={{ color: '#475569', fontSize: '0.62rem' }}>{stage.label} {stage.count}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main Dashboard ──────────────────────────────────────────────
export default function AdminDashboard() {
  const { data, addActivity, updateKPI } = useDashboardData()
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set())
  const [approvals, setApprovals] = useState(data.approvals)
  const [approvalCount, setApprovalCount] = useState(data.approvals.length)

  // Sync approvals when data loads
  useEffect(() => {
    setApprovals(data.approvals)
    setApprovalCount(data.approvals.length)
  }, [data.approvals])

  const markNew = (id: string) => {
    setNewItemIds(s => new Set([...s, id]))
    setTimeout(() => setNewItemIds(s => { const n = new Set(s); n.delete(id); return n }), 2000)
  }

  // Realtime subscriptions
  useRealtime([
    {
      table: 'submissions', event: 'INSERT',
      callback: () => {
        updateKPI({ newLeads: (data.kpi.newLeads ?? 0) + 1 })
        markNew('kpi-leads')
      },
    },
    {
      table: 'approval_queue', event: 'INSERT',
      callback: (payload) => {
        const item = payload.new as typeof data.approvals[0]
        setApprovals(prev => [item, ...prev.slice(0, 4)])
        setApprovalCount(c => c + 1)
        markNew('kpi-approval')
      },
    },
    {
      table: 'activity_log', event: 'INSERT',
      callback: (payload) => {
        const item = payload.new as ActivityItem
        addActivity(item)
        markNew(item.id)
      },
    },
  ])

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id))
    setApprovalCount(c => Math.max(0, c - 1))
  }

  const hasAgentError = data.agents.some(a => a.status === 'error')

  if (data.loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#64748B' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(89,163,146,0.2)', borderTopColor: '#59A392', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: '0.85rem' }}>Loading dashboard data…</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes kpi-pulse {
          0% { box-shadow: 0 0 0 0 rgba(89,163,146,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(89,163,146,0); }
          100% { box-shadow: 0 0 0 0 rgba(89,163,146,0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {data.usingMock && (
        <div
          role="alert"
          style={{
            background: 'rgba(232,184,77,0.08)',
            border: '1px solid rgba(232,184,77,0.25)',
            borderRadius: '10px',
            padding: '12px 20px',
            margin: '0 0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8B84D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#E8B84D',
              display: 'block',
              marginBottom: 2,
            }}>
              Live data unavailable — showing cached snapshot
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}>
              Supabase connection issue. Numbers shown are for reference only. Check database connection.
            </span>
          </div>
        </div>
      )}

      {/* Section label + title */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>— OVERVIEW</div>
        <h1 style={{ color: '#E2E8F0', fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
        <p style={{ color: '#64748B', fontSize: '0.82rem', marginTop: '4px', margin: '4px 0 0 0' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* KPI Cards — scrollable row */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '28px', scrollbarWidth: 'none' }}>
        <KPICard label="New Leads (7d)" value={data.kpi.newLeads} delta={data.kpi.newLeadsDelta} href="/admin/submissions" pulse={newItemIds.has('kpi-leads')} />
        <KPICard label="Pending Review" value={data.kpi.pendingReview} href="/admin/agents/queue" amber={data.kpi.pendingReview > 5} pulse={newItemIds.has('kpi-approval')} />
        <KPICard label="Active Projects" value={data.kpi.activeProjects} delta={data.kpi.activeProjectsDelta} href="/admin/divisions/studio" />
        <KPICard label="Active Agents" value={data.kpi.activeAgents} href="/admin/agents" />
        <KPICard label="Open Tickets" value={data.kpi.openTickets} delta={data.kpi.openTicketsDelta} href="/admin/tickets" amber={data.kpi.openTickets > 10} />
        <KPICard label="Services Clients" value={data.kpi.servicesClients} href="/admin/divisions/services" />
        <KPICard label="Revenue (MTD)" value={0} href="/admin/analytics" />
        <KPICard label="Ventures Apps" value={data.kpi.venturesApps} href="/admin/submissions" />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', alignItems: 'start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* NEXUS Agent Status */}
          <div style={{
            background: '#12162A',
            border: `1px solid ${hasAgentError ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: '14px', padding: '20px',
            boxShadow: hasAgentError ? '0 0 20px rgba(251,191,36,0.08)' : 'none',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>— AGENTS</div>
                <div style={{ color: '#E2E8F0', fontSize: '0.95rem', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>NEXUS Agent Status</div>
              </div>
              {hasAgentError && (
                <span style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#E8B84D', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace", padding: '4px 10px', borderRadius: '6px' }}>
                  Attention needed
                </span>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {data.agents.map(agent => (
                <AgentCard key={agent.id} agent={agent} pulse={newItemIds.has(agent.id)} />
              ))}
            </div>
          </div>

          {/* Approval Queue Preview */}
          <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div>
                <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>— APPROVALS</div>
                <div style={{ color: '#E2E8F0', fontSize: '0.95rem', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>Approval Queue</div>
              </div>
              <a href="/admin/agents/queue" style={{ color: '#59A392', fontSize: '0.78rem', textDecoration: 'none' }}>
                View all ({approvalCount} pending) →
              </a>
            </div>
            {approvals.slice(0, 5).map(item => (
              <ApprovalRow key={item.id} item={item} onApprove={handleApprove} />
            ))}
            {approvals.length === 0 && (
              <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>All caught up — no pending approvals</div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Needs Attention */}
          <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>— PRIORITY</div>
              <div style={{ color: '#E2E8F0', fontSize: '0.95rem', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>Needs Attention</div>
            </div>
            {data.attention.map(item => (
              <AttentionRow key={item.id} item={item} />
            ))}
          </div>

          {/* Activity Feed */}
          <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div>
                <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>— LIVE</div>
                <div style={{ color: '#E2E8F0', fontSize: '0.95rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Recent Activity
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }} />
                </div>
              </div>
              <a href="/admin/activity" style={{ color: '#59A392', fontSize: '0.78rem', textDecoration: 'none' }}>View all →</a>
            </div>
            <div style={{ maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              {data.activity.map(item => (
                <ActivityRow key={item.id} item={item} isNew={newItemIds.has(item.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Snapshot */}
      <PipelineSnapshot pipeline={data.pipeline} />
    </>
  )
}
