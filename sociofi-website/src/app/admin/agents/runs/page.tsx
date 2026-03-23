'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { AgentName } from '@/lib/admin/types'
import { AGENT_COLORS } from '@/lib/admin/types'
import { MOCK_AGENT_RUNS } from '@/lib/admin/mock-data'

export default function AgentRunsPage() {
  const [filterAgent, setFilterAgent] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTrigger, setFilterTrigger] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const agents: AgentName[] = ['NEXUS','INTAKE','HERALD','SCRIBE','OVERSEER','PATCHER','ARCHITECT','FORGE','SENTINEL','ATLAS','CHRONICLE','MENTOR','SCOUT']

  const runs = useMemo(() => {
    let arr = [...MOCK_AGENT_RUNS]
    if (filterAgent !== 'all') arr = arr.filter(r => r.agent === filterAgent)
    if (filterStatus !== 'all') arr = arr.filter(r => r.status === filterStatus)
    if (filterTrigger !== 'all') arr = arr.filter(r => r.trigger === filterTrigger)
    return arr
  }, [filterAgent, filterStatus, filterTrigger])

  const relTime = (iso: string) => {
    const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  const pillStyle = (active: boolean, color = '#59A392'): React.CSSProperties => ({
    background: active ? `${color}18` : 'rgba(255,255,255,0.03)',
    border: `1px solid ${active ? color+'40' : 'rgba(255,255,255,0.06)'}`,
    color: active ? color : '#64748B',
    borderRadius: 100, padding: '4px 12px', fontSize: '0.75rem', cursor: 'pointer',
  })

  // Stats
  const total = MOCK_AGENT_RUNS.length
  const completed = MOCK_AGENT_RUNS.filter(r => r.status === 'completed').length
  const failed = MOCK_AGENT_RUNS.filter(r => r.status === 'failed').length
  const running = MOCK_AGENT_RUNS.filter(r => r.status === 'running').length

  return (
    <div style={{ color: '#E2E8F0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>Agent Run History</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748B' }}>{completed} completed · {failed} failed · {running} running</p>
        </div>
        <Link href="/admin/agents" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8', borderRadius: 8, padding: '8px 14px', fontSize: '0.85rem', textDecoration: 'none' }}>
          ← Back to agents
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          {label:'Total Runs',value:total,color:'#E2E8F0'},
          {label:'Completed',value:completed,color:'#4ade80'},
          {label:'Failed',value:failed,color:failed>0?'#EF4444':'#64748B'},
          {label:'Running',value:running,color:running>0?'#E8B84D':'#64748B'},
        ].map(({label,value,color}) => (
          <div key={label} style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'Fira Code', monospace" }}>Agent:</span>
        <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)} style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '5px 10px', color: '#E2E8F0', fontSize: '0.8rem', cursor: 'pointer' }}>
          <option value="all">All Agents</option>
          {agents.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'Fira Code', monospace" }}>Status:</span>
        {['all','completed','running','failed','cancelled'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={pillStyle(filterStatus===s, s==='completed'?'#4ade80':s==='running'?'#E8B84D':s==='failed'?'#EF4444':'#59A392')}>
            {s==='all'?'All':s.charAt(0).toUpperCase()+s.slice(1)}
          </button>
        ))}
        <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'Fira Code', monospace" }}>Trigger:</span>
        {['all','auto','manual','webhook','schedule'].map(t => (
          <button key={t} onClick={() => setFilterTrigger(t)} style={pillStyle(filterTrigger===t)}>{t==='all'?'All':t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      {/* Runs table */}
      <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Agent','Trigger','Input','Status','Duration','Approvals','Time'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {runs.map(run => {
              const c = AGENT_COLORS[run.agent]
              const sc = run.status==='completed'?'#4ade80':run.status==='running'?'#E8B84D':run.status==='failed'?'#EF4444':'#64748B'
              const isOpen = expanded === run.id
              return (
                <>
                  <tr key={run.id} onClick={() => setExpanded(isOpen ? null : run.id)} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: isOpen ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background='rgba(255,255,255,0.015)' }}
                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background='transparent' }}>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.8rem', color: c, fontWeight: 600, fontFamily: "'Fira Code', monospace" }}>{run.agent}</span>
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', background: 'rgba(255,255,255,0.04)', borderRadius: 100, padding: '2px 8px' }}>{run.trigger}</span>
                    </td>
                    <td style={{ padding: '11px 16px', maxWidth: 260 }}>
                      <div style={{ fontSize: '0.82rem', color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{run.input_summary}</div>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{ background: `${sc}15`, color: sc, border: `1px solid ${sc}30`, borderRadius: 100, padding: '2px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
                        {run.status === 'running' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc, animation: 'sPulse2 1.5s ease-out infinite' }} />}
                        {run.status}
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {run.duration_ms ? `${(run.duration_ms/1000).toFixed(1)}s` : '—'}
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'center' }}>
                      {run.approvals_created > 0 ? (
                        <Link href="/admin/agents/queue" style={{ fontSize: '0.78rem', color: '#EF4444', textDecoration: 'none' }}>{run.approvals_created}</Link>
                      ) : <span style={{ fontSize: '0.78rem', color: '#64748B' }}>—</span>}
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap' }}>{relTime(run.started_at)}</td>
                  </tr>
                  {isOpen && (
                    <tr key={`${run.id}-detail`} style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td colSpan={7} style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Input</div>
                            <div style={{ fontSize: '0.82rem', color: '#E2E8F0', lineHeight: 1.6 }}>{run.input_summary}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Output</div>
                            {run.error ? (
                              <div style={{ fontSize: '0.82rem', color: '#EF4444', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '8px 12px', fontFamily: "'Fira Code', monospace" }}>{run.error}</div>
                            ) : (
                              <div style={{ fontSize: '0.82rem', color: run.output_summary ? '#E2E8F0' : '#64748B', lineHeight: 1.6 }}>{run.output_summary ?? 'In progress…'}</div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
        {runs.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>No runs match the current filters</div>}
      </div>
      <style>{`@keyframes sPulse2{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(2);opacity:0}}`}</style>
      <div style={{ marginTop: 10, fontSize: '0.75rem', color: '#64748B', textAlign: 'right' }}>{runs.length} runs · Click a row to expand details</div>
    </div>
  )
}
