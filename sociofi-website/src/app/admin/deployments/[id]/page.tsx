'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import { MOCK_DEPLOYMENTS } from '@/lib/admin/mock-data'
import {
  DEPLOYMENT_STATUS_COLORS,
  RUN_STATUS_COLORS,
  AGENT_COLORS,
  PLAN_COLORS,
  CONNECTOR_ICONS,
  OVERSIGHT_LABELS,
  type AgentName,
  type OversightLevel,
  type RunStatus,
  type ConnectorType,
} from '@/lib/admin/types'

const STYLES = `
  .dep-tab { padding: 8px 18px; border-radius: 8px; border: none; background: transparent; color: #64748B; font-size: 0.85rem; cursor: pointer; transition: all 0.15s; font-family: 'Outfit', sans-serif; font-weight: 500; }
  .dep-tab.active { background: rgba(89,163,146,0.12); color: #59A392; }
  .dep-tab:hover:not(.active) { color: #94A3B8; }
  .dep-field-label { font-size: 0.72rem; font-family: 'Fira Code', monospace; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; margin-bottom: 6px; }
  .dep-card { background: #111128; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; }
  .dep-select { background: #0a0a1a; border: 1px solid rgba(255,255,255,0.08); color: #E2E8F0; padding: 7px 10px; border-radius: 8px; font-size: 0.83rem; font-family: 'Outfit', sans-serif; outline: none; width: 100%; }
  .dep-input { background: #0a0a1a; border: 1px solid rgba(255,255,255,0.08); color: #E2E8F0; padding: 7px 10px; border-radius: 8px; font-size: 0.83rem; font-family: 'Outfit', sans-serif; outline: none; width: 100%; box-sizing: border-box; }
  .dep-input:focus, .dep-select:focus { border-color: rgba(89,163,146,0.35); }
  .dep-btn-teal { background: linear-gradient(135deg,#3A589E,#59A392); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; font-family: 'Syne',sans-serif; cursor: pointer; transition: opacity 0.15s; }
  .dep-btn-teal:hover { opacity: 0.85; }
  .dep-btn-ghost { background: transparent; color: #94A3B8; border: 1px solid rgba(255,255,255,0.08); padding: 8px 14px; border-radius: 8px; font-size: 0.82rem; cursor: pointer; transition: all 0.15s; font-family: 'Outfit', sans-serif; }
  .dep-btn-ghost:hover { border-color: rgba(89,163,146,0.3); color: #E2E8F0; }
  .dep-run-row { padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; cursor: pointer; }
  .dep-run-row:hover { background: rgba(255,255,255,0.02); }
  .dep-oversight-card { padding: 14px; border-radius: 10px; border: 1.5px solid transparent; cursor: pointer; transition: all 0.15s; background: rgba(255,255,255,0.02); }
  .dep-oversight-card:hover { background: rgba(255,255,255,0.04); }
  .toggle-switch { position: relative; display: inline-block; width: 36px; height: 20px; }
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.1); border-radius: 10px; transition: 0.2s; }
  .toggle-slider:before { position: absolute; content: ''; height: 14px; width: 14px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.2s; }
  input:checked + .toggle-slider { background: #59A392; }
  input:checked + .toggle-slider:before { transform: translateX(16px); }
  .email-pill { display: inline-flex; align-items: center; gap: 5px; background: rgba(89,163,146,0.12); border: 1px solid rgba(89,163,146,0.2); color: #59A392; padding: 3px 10px; border-radius: 100px; font-size: 0.75rem; }
  .email-pill-remove { background: none; border: none; color: #475569; cursor: pointer; padding: 0; font-size: 0.85rem; line-height: 1; }
  .email-pill-remove:hover { color: #EF4444; }
  .expand-btn { background: none; border: none; color: #475569; cursor: pointer; padding: 2px 4px; transition: color 0.15s; font-size: 0.7rem; }
  .expand-btn:hover { color: #94A3B8; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { animation: spin 0.8s linear infinite; display: inline-block; }
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

function fmtDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function healthLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 50) return 'Degraded'
  return 'Critical'
}

function healthColor(score: number): string {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#E8B84D'
  return '#EF4444'
}

function cronToHuman(cron: string): string {
  const presets: Record<string, string> = {
    '0 * * * *':    'Every hour',
    '0 6 * * *':    'Every day at 6:00 AM UTC',
    '0 6 * * 1':    'Every Monday at 6:00 AM UTC',
    '0 8 * * 1-5':  'Every weekday at 8:00 AM UTC',
    '0 0 * * 0':    'Every Sunday at midnight UTC',
    '*/30 * * * *': 'Every 30 minutes',
  }
  return presets[cron] || cron
}

// SVG Health Ring
function HealthRing({ score }: { score: number }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = healthColor(score)
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <text x="40" y="44" textAnchor="middle" fill={color} fontSize="14" fontWeight="700" fontFamily="Syne, sans-serif">
          {score}
        </text>
      </svg>
      <div style={{ color: '#94A3B8', fontSize: '0.72rem', marginTop: '2px', fontFamily: "'Fira Code', monospace" }}>
        {healthLabel(score)}
      </div>
    </div>
  )
}

// 30-day SVG line chart
function LineChart({ label, data, color, unit = '' }: { label: string, data: number[], color: string, unit?: string }) {
  const W = 560, H = 130, PAD = { t: 10, r: 10, b: 30, l: 40 }
  const chartW = W - PAD.l - PAD.r
  const chartH = H - PAD.t - PAD.b
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const pts = data.map((v, i) => {
    const x = PAD.l + (i / (data.length - 1)) * chartW
    const y = PAD.t + chartH - ((v - min) / range) * chartH
    return [x, y] as [number, number]
  })

  const polyline = pts.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `M ${pts[0][0]},${PAD.t + chartH} L ${polyline} L ${pts[pts.length-1][0]},${PAD.t + chartH} Z`

  return (
    <div style={{ background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px 20px' }}>
      <div style={{ color: '#94A3B8', fontSize: '0.78rem', marginBottom: '12px', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </div>
      <svg width={W} height={H} style={{ display: 'block', maxWidth: '100%' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
          const y = PAD.t + chartH * (1 - frac)
          const val = min + frac * range
          return (
            <g key={i}>
              <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <text x={PAD.l - 4} y={y + 4} textAnchor="end" fill="#475569" fontSize="9" fontFamily="monospace">
                {val.toFixed(0)}{unit}
              </text>
            </g>
          )
        })}
        {/* X-axis labels */}
        {[0, 7, 14, 21, 29].map(i => (
          <text key={i} x={PAD.l + (i / (data.length - 1)) * chartW} y={H - 5} textAnchor="middle" fill="#475569" fontSize="9" fontFamily="monospace">
            -{29 - i}d
          </text>
        ))}
        {/* Area fill */}
        <path d={area} fill={color} opacity="0.06" />
        {/* Line */}
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.5" />
        {/* Dots */}
        {pts.filter((_, i) => i % 5 === 0).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill={color} />
        ))}
      </svg>
    </div>
  )
}

export default function DeploymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const deployment = MOCK_DEPLOYMENTS.find(d => d.id === id)

  const [activeTab, setActiveTab] = useState<'config' | 'runs' | 'metrics' | 'client'>('config')
  const [expandedRun, setExpandedRun] = useState<string | null>(null)
  const [connectorStates, setConnectorStates] = useState<Record<string, 'idle' | 'testing' | 'ok' | 'fail'>>({})
  const [schedulePreset, setSchedulePreset] = useState(deployment?.schedule_cron || '0 6 * * *')
  const [customCron, setCustomCron] = useState('')
  const [oversightLevel, setOversightLevel] = useState<OversightLevel>(deployment?.oversight || 'moderate')
  const [outputFormat, setOutputFormat] = useState(deployment?.output_format || 'email')
  const [outputEmails, setOutputEmails] = useState<string[]>(deployment?.output_emails || [])
  const [emailInput, setEmailInput] = useState('')
  const [slackWebhook, setSlackWebhook] = useState(deployment?.output_slack_webhook || '')
  const [customRules, setCustomRules] = useState<Record<string, string | number | boolean>>(deployment?.custom_rules || {})
  const [runHistory, setRunHistory] = useState(deployment?.run_history || [])
  const [isRunning, setIsRunning] = useState(false)

  if (!deployment) {
    return (
      <div style={{ color: '#E2E8F0', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Deployment not found</div>
        <Link href="/admin/deployments" style={{ color: '#59A392', textDecoration: 'none' }}>← Back to Deployments</Link>
      </div>
    )
  }

  const agentColor = AGENT_COLORS[deployment.agent_name as AgentName]
  const statusColor = DEPLOYMENT_STATUS_COLORS[deployment.status]
  const planColor = PLAN_COLORS[deployment.client_plan]

  function testConnector(connId: string) {
    setConnectorStates(s => ({ ...s, [connId]: 'testing' }))
    setTimeout(() => {
      setConnectorStates(s => ({ ...s, [connId]: Math.random() > 0.1 ? 'ok' : 'fail' }))
    }, 1500)
  }

  function triggerManualRun() {
    if (isRunning || !deployment) return
    setIsRunning(true)
    const runId = `run-${deployment.id}-manual-${Date.now()}`
    const newRun = {
      id: runId,
      deployment_id: deployment.id,
      status: 'running' as RunStatus,
      trigger: 'manual' as const,
      started_at: new Date().toISOString(),
      input_summary: 'Manual trigger by admin',
      tokens_used: undefined,
    }
    setRunHistory(prev => [newRun, ...prev])
    setTimeout(() => {
      setRunHistory(prev => prev.map(r =>
        r.id === runId ? {
          ...r,
          status: 'success' as RunStatus,
          completed_at: new Date().toISOString(),
          duration_ms: 2340,
          tokens_used: 1820,
          output_summary: 'Manual run completed successfully. 8 items processed.',
          output_full: 'Full output: Manual run triggered by admin. Processed batch of 8 items. All checks passed. Delivered to configured output channel.',
        } : r
      ))
      setIsRunning(false)
    }, 2500)
  }

  // Generate 30-day chart data
  const successRateData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const base = deployment.success_rate
      return Math.min(100, Math.max(0, base + (Math.random() - 0.5) * 10))
    })
  }, [deployment.success_rate])

  const durationData = useMemo(() => {
    return Array.from({ length: 30 }, () => {
      const base = deployment.avg_duration_ms / 1000
      return Math.max(0.1, base + (Math.random() - 0.5) * base * 0.3)
    })
  }, [deployment.avg_duration_ms])

  const presets = [
    { label: 'Every hour', cron: '0 * * * *' },
    { label: 'Every day at 6am', cron: '0 6 * * *' },
    { label: 'Every Monday at 6am', cron: '0 6 * * 1' },
    { label: 'Every weekday at 8am', cron: '0 8 * * 1-5' },
    { label: 'Every Sunday at midnight', cron: '0 0 * * 0' },
    { label: 'Every 30 minutes', cron: '*/30 * * * *' },
    { label: 'Custom', cron: 'custom' },
  ]

  return (
    <div style={{ color: '#E2E8F0', fontFamily: "'Outfit', sans-serif" }}>
      <style>{STYLES}</style>

      {/* Back link */}
      <Link href="/admin/deployments" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: '#64748B', fontSize: '0.82rem', textDecoration: 'none',
        marginBottom: '20px', transition: 'color 0.15s',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        All Deployments
      </Link>

      {/* Header Card */}
      <div className="dep-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
          {/* Left: identity */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.025em', color: '#F8FAFC', margin: 0 }}>
                {deployment.client_company || deployment.client_name}
              </h1>
              <span style={{
                padding: '2px 8px', borderRadius: '6px',
                background: `${planColor}18`, color: planColor,
                fontSize: '0.7rem', fontWeight: 600, fontFamily: "'Fira Code', monospace",
                border: `1px solid ${planColor}30`, textTransform: 'capitalize',
              }}>
                {deployment.client_plan}
              </span>
            </div>
            <div style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: '12px' }}>{deployment.client_email}</div>

            {/* Agent */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: agentColor }} />
              <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.82rem', color: agentColor, fontWeight: 600 }}>
                {deployment.agent_name}
              </span>
              <span style={{ color: '#64748B', fontSize: '0.82rem' }}>— {deployment.agent_label}</span>
            </div>

            {/* Status + action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '4px 12px', borderRadius: '100px',
                background: `${statusColor}15`, color: statusColor,
                border: `1px solid ${statusColor}30`,
                fontSize: '0.72rem', fontWeight: 600, fontFamily: "'Fira Code', monospace",
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusColor }} />
                {deployment.status === 'pending_setup' ? 'Pending Setup' : deployment.status}
              </span>

              {deployment.status === 'active' && (
                <button className="dep-btn-ghost" style={{ borderColor: 'rgba(232,184,77,0.3)', color: '#E8B84D', fontSize: '0.78rem', padding: '5px 12px' }}>
                  Pause Deployment
                </button>
              )}
              {deployment.status === 'paused' && (
                <button className="dep-btn-ghost" style={{ borderColor: 'rgba(74,222,128,0.3)', color: '#4ade80', fontSize: '0.78rem', padding: '5px 12px' }}>
                  Resume Deployment
                </button>
              )}
              {deployment.status === 'error' && (
                <button className="dep-btn-ghost" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444', fontSize: '0.78rem', padding: '5px 12px' }}>
                  Restart Agent
                </button>
              )}
            </div>
          </div>

          {/* Center: health ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <HealthRing score={deployment.health_score} />
          </div>

          {/* Right: action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <button className="dep-btn-teal" onClick={triggerManualRun} disabled={isRunning} style={{ opacity: isRunning ? 0.7 : 1, cursor: isRunning ? 'not-allowed' : 'pointer' }}>
              {isRunning ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="spinner">⟳</span> Running...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                  Trigger Run
                </span>
              )}
            </button>
            <Link href={`/admin/contacts`} style={{ textDecoration: 'none' }}>
              <button className="dep-btn-ghost" style={{ fontSize: '0.78rem' }}>View Client →</button>
            </Link>
            <div style={{ color: '#475569', fontSize: '0.72rem', textAlign: 'right', lineHeight: 1.4 }}>
              <div>ID: {deployment.id}</div>
              {deployment.activated_at && <div>Active since {rel(deployment.activated_at)}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#111128', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
        {(['config', 'runs', 'metrics', 'client'] as const).map(tab => (
          <button key={tab} className={`dep-tab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'config' ? 'Config' : tab === 'runs' ? 'Run History' : tab === 'metrics' ? 'Metrics' : 'Client View'}
          </button>
        ))}
      </div>

      {/* ── TAB: CONFIG ── */}
      {activeTab === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Schedule */}
          <div className="dep-card">
            <div style={{ fontWeight: 600, fontSize: '0.95rem', fontFamily: "'Syne', sans-serif", marginBottom: '16px', color: '#F1F5F9' }}>Schedule</div>
            <div className="dep-field-label">Current Schedule</div>
            <div style={{ color: '#F1F5F9', fontSize: '0.9rem', marginBottom: '4px', fontWeight: 500 }}>{cronToHuman(deployment.schedule_cron)}</div>
            <div style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.75rem', color: '#59A392', marginBottom: '16px', background: 'rgba(89,163,146,0.08)', padding: '4px 8px', borderRadius: '6px', display: 'inline-block' }}>
              {deployment.schedule_cron}
            </div>

            <div className="dep-field-label" style={{ marginTop: '8px' }}>Change Schedule</div>
            <select className="dep-select" style={{ marginBottom: '8px' }} value={schedulePreset} onChange={e => setSchedulePreset(e.target.value)}>
              {presets.map(p => (
                <option key={p.cron} value={p.cron}>{p.label}</option>
              ))}
            </select>
            {schedulePreset === 'custom' && (
              <input className="dep-input" placeholder="e.g. 0 9 * * 1-5" value={customCron} onChange={e => setCustomCron(e.target.value)} style={{ marginBottom: '8px' }} />
            )}
            {schedulePreset !== 'custom' && schedulePreset !== deployment.schedule_cron && (
              <div style={{ color: '#59A392', fontSize: '0.78rem', marginBottom: '8px' }}>
                Preview: {cronToHuman(schedulePreset)}
              </div>
            )}
            <button className="dep-btn-teal" style={{ marginTop: '4px' }}>Save Schedule</button>
          </div>

          {/* Integrations */}
          <div className="dep-card">
            <div style={{ fontWeight: 600, fontSize: '0.95rem', fontFamily: "'Syne', sans-serif", marginBottom: '16px', color: '#F1F5F9' }}>Connected Integrations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {deployment.connectors.map(conn => {
                const cState = connectorStates[conn.id] || 'idle'
                const connectorStatusColor = conn.status === 'connected' ? '#4ade80' : conn.status === 'failed' ? '#EF4444' : '#E8B84D'
                return (
                  <div key={conn.id} style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px', padding: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '6px',
                        background: 'rgba(89,163,146,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.6rem', fontWeight: 700, color: '#59A392', fontFamily: "'Fira Code', monospace",
                        flexShrink: 0,
                      }}>
                        {CONNECTOR_ICONS[conn.type as ConnectorType]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#F1F5F9' }}>{conn.label}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{conn.config_summary}</div>
                      </div>
                      <div style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: cState === 'ok' ? '#4ade80' : cState === 'fail' ? '#EF4444' : cState === 'testing' ? '#E8B84D' : connectorStatusColor,
                      }} />
                    </div>
                    {conn.error_message && (
                      <div style={{ color: '#EF4444', fontSize: '0.72rem', marginBottom: '6px', padding: '4px 8px', background: 'rgba(239,68,68,0.08)', borderRadius: '4px' }}>
                        {conn.error_message}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="dep-btn-ghost"
                        style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                        onClick={() => testConnector(conn.id)}
                        disabled={cState === 'testing'}
                      >
                        {cState === 'testing' ? '⟳ Testing...' : cState === 'ok' ? '✓ Connected' : cState === 'fail' ? '✗ Failed' : 'Test Connection'}
                      </button>
                      <button className="dep-btn-ghost" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>Reconfigure</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Output Preferences */}
          <div className="dep-card">
            <div style={{ fontWeight: 600, fontSize: '0.95rem', fontFamily: "'Syne', sans-serif", marginBottom: '16px', color: '#F1F5F9' }}>Output Preferences</div>

            <div className="dep-field-label">Output Format</div>
            <select className="dep-select" value={outputFormat} onChange={e => setOutputFormat(e.target.value as typeof outputFormat)} style={{ marginBottom: '14px' }}>
              <option value="email">Email</option>
              <option value="slack">Slack</option>
              <option value="notion">Notion</option>
              <option value="airtable">Airtable</option>
              <option value="webhook">Webhook</option>
            </select>

            <div className="dep-field-label">Email Recipients</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {outputEmails.map(em => (
                <span key={em} className="email-pill">
                  {em}
                  <button className="email-pill-remove" onClick={() => setOutputEmails(prev => prev.filter(e => e !== em))}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              <input className="dep-input" placeholder="Add email..." value={emailInput} onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && emailInput.includes('@')) { setOutputEmails(prev => [...prev, emailInput]); setEmailInput('') } }}
                style={{ flex: 1 }}
              />
              <button className="dep-btn-ghost" style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                onClick={() => { if (emailInput.includes('@')) { setOutputEmails(prev => [...prev, emailInput]); setEmailInput('') } }}>
                Add
              </button>
            </div>

            <div className="dep-field-label">Slack Webhook (optional)</div>
            <input className="dep-input" placeholder="https://hooks.slack.com/..." value={slackWebhook} onChange={e => setSlackWebhook(e.target.value)} style={{ marginBottom: '14px' }} />

            <div className="dep-field-label">Oversight Level</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              {(['strict', 'moderate', 'autonomous'] as OversightLevel[]).map(level => (
                <div key={level} className="dep-oversight-card"
                  style={{ borderColor: oversightLevel === level ? 'rgba(89,163,146,0.4)' : 'rgba(255,255,255,0.06)', background: oversightLevel === level ? 'rgba(89,163,146,0.06)' : 'rgba(255,255,255,0.02)' }}
                  onClick={() => setOversightLevel(level)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '14px', height: '14px', borderRadius: '50%',
                      border: `2px solid ${oversightLevel === level ? '#59A392' : 'rgba(255,255,255,0.2)'}`,
                      background: oversightLevel === level ? '#59A392' : 'transparent',
                      flexShrink: 0,
                    }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#F1F5F9', textTransform: 'capitalize' }}>{level}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{OVERSIGHT_LABELS[level]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="dep-btn-teal">Save Preferences</button>
          </div>

          {/* Custom Rules — full width */}
          <div className="dep-card">
            <div style={{ fontWeight: 600, fontSize: '0.95rem', fontFamily: "'Syne', sans-serif", marginBottom: '16px', color: '#F1F5F9' }}>Custom Rules</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {Object.entries(customRules).map(([key, val]) => (
                <div key={key}>
                  <div className="dep-field-label">{key.replace(/_/g, ' ')}</div>
                  {typeof val === 'boolean' ? (
                    <label className="toggle-switch">
                      <input type="checkbox" checked={val}
                        onChange={e => setCustomRules(prev => ({ ...prev, [key]: e.target.checked }))}
                      />
                      <span className="toggle-slider" />
                    </label>
                  ) : typeof val === 'number' ? (
                    <input type="number" className="dep-input" value={val}
                      onChange={e => setCustomRules(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                    />
                  ) : (
                    <input type="text" className="dep-input" value={String(val)}
                      onChange={e => setCustomRules(prev => ({ ...prev, [key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
            <button className="dep-btn-teal" style={{ marginTop: '16px' }}>Save Rules</button>
          </div>
        </div>
      )}

      {/* ── TAB: RUN HISTORY ── */}
      {activeTab === 'runs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button className="dep-btn-teal" onClick={triggerManualRun} disabled={isRunning} style={{ opacity: isRunning ? 0.7 : 1 }}>
              {isRunning ? '⟳ Running...' : '▶ Trigger Manual Run'}
            </button>
          </div>
          <div className="dep-card" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '100px 90px 130px 90px 80px 1fr 28px',
              padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
            }}>
              {['Status', 'Trigger', 'Started', 'Duration', 'Tokens', 'Summary', ''].map((h, i) => (
                <div key={i} style={{ color: '#475569', fontSize: '0.7rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
              ))}
            </div>

            {runHistory.length === 0 && (
              <div style={{ padding: '32px', textAlign: 'center', color: '#475569', fontSize: '0.88rem' }}>
                No runs yet for this deployment.
              </div>
            )}

            {runHistory.map((run) => {
              const sc = RUN_STATUS_COLORS[run.status]
              const rowBg = run.status === 'success' ? 'rgba(74,222,128,0.02)' :
                            run.status === 'failed' ? 'rgba(239,68,68,0.03)' :
                            run.status === 'pending_review' ? 'rgba(232,184,77,0.03)' : 'transparent'
              const isExpanded = expandedRun === run.id

              return (
                <div key={run.id} style={{ background: rowBg }}>
                  <div className="dep-run-row" style={{ display: 'grid', gridTemplateColumns: '100px 90px 130px 90px 80px 1fr 28px', alignItems: 'center' }}
                    onClick={() => setExpandedRun(isExpanded ? null : run.id)}
                  >
                    {/* Status */}
                    <div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '2px 8px', borderRadius: '6px',
                        background: `${sc}15`, color: sc,
                        fontSize: '0.68rem', fontWeight: 600,
                        fontFamily: "'Fira Code', monospace", textTransform: 'uppercase',
                      }}>
                        {run.status === 'running' && <span className="spinner">⟳</span>}
                        {run.status}
                      </span>
                    </div>
                    {/* Trigger */}
                    <div style={{ color: '#64748B', fontSize: '0.75rem', fontFamily: "'Fira Code', monospace" }}>{run.trigger}</div>
                    {/* Started */}
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{rel(run.started_at)}</div>
                    {/* Duration */}
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                      {run.duration_ms ? fmtDuration(run.duration_ms) : '—'}
                    </div>
                    {/* Tokens */}
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                      {run.tokens_used ? run.tokens_used.toLocaleString() : '—'}
                    </div>
                    {/* Summary */}
                    <div style={{ color: '#94A3B8', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px' }}>
                      {run.output_summary || run.error_message || run.input_summary}
                    </div>
                    {/* Expand */}
                    <button className="expand-btn" style={{ color: isExpanded ? '#59A392' : '#475569', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                      ▼
                    </button>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '12px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: run.output_full ? '1fr 1fr' : '1fr', gap: '12px' }}>
                        <div>
                          <div style={{ color: '#475569', fontSize: '0.7rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Input</div>
                          <pre style={{
                            background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '8px', padding: '10px 12px',
                            fontSize: '0.75rem', color: '#94A3B8',
                            fontFamily: "'Fira Code', monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
                          }}>
                            {run.input_summary}
                          </pre>
                        </div>
                        {(run.output_full || run.error_message) && (
                          <div>
                            <div style={{ color: '#475569', fontSize: '0.7rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                              {run.error_message ? 'Error' : 'Output'}
                            </div>
                            <pre style={{
                              background: '#0a0a1a', border: `1px solid ${run.error_message ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                              borderRadius: '8px', padding: '10px 12px',
                              fontSize: '0.75rem', color: run.error_message ? '#EF4444' : '#94A3B8',
                              fontFamily: "'Fira Code', monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
                            }}>
                              {run.output_full || run.error_message}
                            </pre>
                          </div>
                        )}
                      </div>
                      {run.was_overridden && (
                        <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(232,184,77,0.08)', borderRadius: '6px', fontSize: '0.75rem', color: '#E8B84D' }}>
                          Overridden by reviewer{run.override_reason ? `: "${run.override_reason}"` : ''}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── TAB: METRICS ── */}
      {activeTab === 'metrics' && (
        <div>
          {/* 4 metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}>
            {[
              { label: 'Success Rate', value: `${deployment.success_rate}%`, color: deployment.success_rate >= 90 ? '#4ade80' : '#E8B84D', sub: '30-day average' },
              { label: 'Avg Duration', value: fmtDuration(deployment.avg_duration_ms), color: '#59A392', sub: 'Per run' },
              { label: 'Output Drift', value: `${deployment.drift_score} / 100`, color: deployment.drift_score < 15 ? '#4ade80' : deployment.drift_score < 30 ? '#E8B84D' : '#EF4444', sub: 'Lower is better' },
              { label: 'Override Rate', value: `${deployment.override_rate}%`, color: deployment.override_rate < 10 ? '#4ade80' : '#E8B84D', sub: 'Human edits' },
            ].map(m => (
              <div key={m.label} className="dep-card">
                <div style={{ color: '#64748B', fontSize: '0.72rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: m.color, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em', marginBottom: '4px' }}>
                  {m.value}
                </div>
                <div style={{ color: '#475569', fontSize: '0.75rem' }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            <LineChart label="Success Rate (30 days)" data={successRateData} color="#4ade80" unit="%" />
            <LineChart label="Avg Duration (30 days)" data={durationData} color="#59A392" unit="s" />
          </div>

          {/* Insight box */}
          <div className="dep-card" style={{ border: '1px solid rgba(89,163,146,0.15)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ color: '#59A392', marginTop: '2px', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#F1F5F9', fontSize: '0.88rem', marginBottom: '6px', fontFamily: "'Syne', sans-serif" }}>30-Day Insight</div>
                <div style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.65 }}>
                  This deployment has been {deployment.success_rate >= 95 ? 'highly consistent' : deployment.success_rate >= 80 ? 'generally reliable' : 'somewhat inconsistent'} over the past 30 days with a{' '}
                  <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{deployment.success_rate}% success rate</span>.{' '}
                  {deployment.total_runs_30d > 0 && `It has completed ${deployment.total_runs_30d} runs this month. `}
                  {deployment.override_rate < 5
                    ? `Human override rate is ${deployment.override_rate}% — well within normal range.`
                    : `Human override rate is ${deployment.override_rate}% — consider reviewing output configuration.`}{' '}
                  {deployment.drift_score < 15
                    ? 'Output consistency is excellent with minimal drift detected.'
                    : `Drift score of ${deployment.drift_score} suggests some variability in outputs — review custom rules.`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: CLIENT VIEW ── */}
      {activeTab === 'client' && (
        <div>
          {/* Notice */}
          <div style={{
            background: 'rgba(107,163,232,0.08)', border: '1px solid rgba(107,163,232,0.2)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#6BA3E8',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            This is a preview of what the client sees at <code style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.78rem', background: 'rgba(107,163,232,0.1)', padding: '1px 6px', borderRadius: '4px' }}>/client/{deployment.id.toLowerCase()}</code>
          </div>

          {/* Client view card */}
          <div style={{ maxWidth: '640px' }}>
            <div className="dep-card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.72rem', color: agentColor, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    {deployment.agent_name} — {deployment.agent_label}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: "'Syne', sans-serif", color: '#F1F5F9' }}>Your Agent Dashboard</div>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: '100px',
                  background: `${statusColor}15`, color: statusColor,
                  fontSize: '0.72rem', fontWeight: 600, fontFamily: "'Fira Code', monospace",
                  textTransform: 'uppercase',
                }}>
                  {deployment.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Last Run', value: deployment.last_run_at ? rel(deployment.last_run_at) : 'Never' },
                  { label: 'Next Run', value: deployment.next_run_at ? relFuture(deployment.next_run_at) : 'Paused' },
                  { label: 'Runs This Month', value: deployment.total_runs_30d.toString() },
                ].map(stat => (
                  <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ color: '#475569', fontSize: '0.72rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{stat.label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F1F5F9', fontFamily: "'Syne', sans-serif" }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ color: '#64748B', fontSize: '0.78rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Recent Outputs
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {runHistory.filter(r => r.status === 'success' && r.output_summary).slice(0, 5).map(run => (
                  <div key={run.id} style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px', padding: '10px 14px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ color: '#475569', fontSize: '0.72rem' }}>{rel(run.started_at)}</span>
                      <span style={{ color: '#4ade80', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace" }}>Completed</span>
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>{run.output_summary}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage stats */}
            <div className="dep-card">
              <div style={{ color: '#64748B', fontSize: '0.78rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                This Month&apos;s Usage
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Total Runs', value: deployment.total_runs_30d },
                  { label: 'Successful', value: Math.round(deployment.total_runs_30d * deployment.success_rate / 100) },
                  { label: 'Tokens Used', value: runHistory.reduce((a, r) => a + (r.tokens_used || 0), 0).toLocaleString() },
                  { label: 'Avg Duration', value: fmtDuration(deployment.avg_duration_ms) },
                ].map(stat => (
                  <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '10px 14px' }}>
                    <div style={{ color: '#475569', fontSize: '0.72rem', marginBottom: '4px' }}>{stat.label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F1F5F9', fontFamily: "'Syne', sans-serif" }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
