'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { AgentConfig, AgentName, AgentStatus } from '@/lib/admin/types'
import { AGENT_COLORS, AGENT_STATUS_COLORS } from '@/lib/admin/types'
import { MOCK_AGENT_CONFIGS, MOCK_AGENT_RUNS } from '@/lib/admin/mock-data'

function AgentSVG({ name }: { name: AgentName }) {
  const paths: Record<AgentName, React.ReactNode> = {
    NEXUS:     <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></>,
    INTAKE:    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    HERALD:    <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    SCRIBE:    <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></>,
    OVERSEER:  <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    PATCHER:   <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>,
    ARCHITECT: <><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="4" y1="4" x2="9" y2="9"/></>,
    FORGE:     <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    SENTINEL:  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    ATLAS:     <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
    CHRONICLE: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    MENTOR:    <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
    SCOUT:     <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  }
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function StatusDot({ status }: { status: AgentStatus }) {
  const c = AGENT_STATUS_COLORS[status]
  const pulse = status === 'active' || status === 'running'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${c}15`, border: `1px solid ${c}30`, borderRadius: 100, padding: '2px 9px', fontSize: '0.7rem', color: c }}>
      <span style={{ position: 'relative', width: 7, height: 7, flexShrink: 0 }}>
        {pulse && <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c, animation: 'sPulse 1.6s ease-out infinite' }} />}
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c }} />
      </span>
      {status}
    </span>
  )
}

function AgentCard({ agent, onTrigger }: { agent: AgentConfig; onTrigger: (n: AgentName) => void }) {
  const color = AGENT_COLORS[agent.name]
  const [busy, setBusy] = useState(false)

  const fire = async (e: React.MouseEvent) => {
    e.stopPropagation(); setBusy(true)
    await new Promise(r => setTimeout(r, 1200))
    onTrigger(agent.name); setBusy(false)
  }

  const rel = (iso?: string) => {
    if (!iso) return 'never'
    const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px 20px', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}40`)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${color},transparent)` }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
            <AgentSVG name={agent.name} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#E2E8F0', marginBottom: 4 }}>{agent.label}</div>
            <StatusDot status={agent.status} />
          </div>
        </div>
        {agent.approvals_pending > 0 && (
          <Link href="/admin/agents/queue" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', borderRadius: 100, padding: '2px 9px', fontSize: '0.7rem', textDecoration: 'none', flexShrink: 0 }}>
            {agent.approvals_pending} pending
          </Link>
        )}
      </div>
      <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: '#64748B', lineHeight: 1.5 }}>{agent.tagline}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
        {[{l:'Tasks/wk',v:agent.tasks_week},{l:'Success',v:`${agent.success_rate}%`},{l:'Last run',v:rel(agent.last_run)}].map(({l,v}) => (
          <div key={l} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#E2E8F0', fontFamily: "'Syne', sans-serif" }}>{v}</div>
            <div style={{ fontSize: '0.65rem', color: '#64748B', marginTop: 1 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginBottom: 12 }}>
        <div style={{ height: '100%', width: `${agent.success_rate}%`, background: color, borderRadius: 2 }} />
      </div>
      <div style={{ display: 'flex', gap: 7 }}>
        <button onClick={fire} disabled={busy || agent.status === 'paused'} style={{ flex: 1, background: `${color}15`, border: `1px solid ${color}30`, color, borderRadius: 7, padding: '7px 0', cursor: busy || agent.status === 'paused' ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          {busy ? <><span style={{ width: 10, height: 10, borderRadius: '50%', border: `1.5px solid ${color}50`, borderTop: `1.5px solid ${color}`, animation: 'sSpin 0.8s linear infinite' }} />Running…</> : <><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>Trigger</>}
        </button>
        <Link href="/admin/agents/runs" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#64748B', borderRadius: 7, padding: '7px 12px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </Link>
      </div>
    </div>
  )
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentConfig[]>(MOCK_AGENT_CONFIGS)
  const [toast, setToast] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  const handleTrigger = (name: AgentName) => {
    setToast(`${name} triggered — run started`); setTimeout(() => setToast(null), 3000)
    setAgents(p => p.map(a => a.name === name ? { ...a, status: 'running' as AgentStatus, last_run: new Date().toISOString() } : a))
    setTimeout(() => setAgents(p => p.map(a => a.name === name ? { ...a, status: 'idle' as AgentStatus } : a)), 4000)
  }

  const active = agents.filter(a => a.status === 'active' || a.status === 'running').length
  const pending = agents.reduce((s,a) => s + a.approvals_pending, 0)
  const avgSucc = Math.round(agents.reduce((s,a) => s + a.success_rate, 0) / agents.length)
  const totalTasks = agents.reduce((s,a) => s + a.tasks_week, 0)
  const shown = filter === 'all' ? agents : agents.filter(a => a.status === filter)

  return (
    <div style={{ color: '#E2E8F0' }}>
      <style>{`@keyframes sPulse{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(2.5);opacity:0}} @keyframes sSpin{to{transform:rotate(360deg)}}`}</style>
      {toast && <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 2000, background: 'rgba(89,163,146,0.12)', border: '1px solid rgba(89,163,146,0.3)', borderRadius: 10, padding: '11px 18px', fontSize: '0.85rem', color: '#59A392', display: 'flex', alignItems: 'center', gap: 8 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>{toast}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>NEXUS Agent Control</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748B' }}>{active}/13 active · {pending} awaiting approval</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/agents/queue" style={{ display: 'flex', alignItems: 'center', gap: 7, background: pending > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${pending > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`, color: pending > 0 ? '#EF4444' : '#94A3B8', borderRadius: 8, padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none', fontWeight: pending > 0 ? 600 : 400 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Approval Queue{pending > 0 ? ` (${pending})` : ''}
          </Link>
          <Link href="/admin/agents/runs" style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8', borderRadius: 8, padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Run History
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          {label:'Active Agents',value:active,sub:'of 13 total',color:'#4ade80'},
          {label:'Pending Approvals',value:pending,sub:'need review',color:pending>0?'#EF4444':'#64748B'},
          {label:'Avg Success Rate',value:`${avgSucc}%`,sub:'all agents',color:'#59A392'},
          {label:'Tasks This Week',value:totalTasks,sub:'automated',color:'#7B6FE8'},
        ].map(({label,value,sub,color}) => (
          <div key={label} style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color }}>{value}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {['all','active','running','idle','error','paused'].map(s => {
          const c = s === 'all' ? '#59A392' : (AGENT_STATUS_COLORS[s as AgentStatus] ?? '#59A392')
          return <button key={s} onClick={() => setFilter(s)} style={{ background: filter===s?`${c}18`:'rgba(255,255,255,0.03)', border:`1px solid ${filter===s?c+'40':'rgba(255,255,255,0.06)'}`, color:filter===s?c:'#64748B', borderRadius:100, padding:'5px 14px', fontSize:'0.78rem', cursor:'pointer' }}>{s==='all'?'All Agents':s.charAt(0).toUpperCase()+s.slice(1)}</button>
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14, marginBottom: 32 }}>
        {shown.map(agent => <AgentCard key={agent.name} agent={agent} onTrigger={handleTrigger} />)}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: '0.7rem', color: '#59A392', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 18, height: 1.5, background: '#59A392', display: 'inline-block' }} />Recent Runs
          </div>
          <Link href="/admin/agents/runs" style={{ fontSize: '0.8rem', color: '#64748B', textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {MOCK_AGENT_RUNS.slice(0,6).map(run => {
                const c = AGENT_COLORS[run.agent]
                const sc = run.status==='completed'?'#4ade80':run.status==='running'?'#E8B84D':run.status==='failed'?'#EF4444':'#64748B'
                return (
                  <tr key={run.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '10px 16px', width: 110 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.78rem', color: c, fontWeight: 600, fontFamily: "'Fira Code', monospace" }}>{run.agent}</span>
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', maxWidth: 340 }}>
                      <div style={{ fontSize: '0.82rem', color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{run.input_summary}</div>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ background: `${sc}15`, color: sc, border: `1px solid ${sc}30`, borderRadius: 100, padding: '2px 8px', fontSize: '0.72rem' }}>{run.status}</span>
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {run.trigger} · {run.duration_ms ? `${(run.duration_ms/1000).toFixed(1)}s` : 'running'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
