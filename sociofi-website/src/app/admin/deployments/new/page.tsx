'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MOCK_AGENT_CATALOG } from '@/lib/admin/mock-data'
import {
  AGENT_COLORS,
  CONNECTOR_ICONS,
  OVERSIGHT_LABELS,
  PLAN_COLORS,
  type AgentName,
  type OversightLevel,
  type ConnectorType,
} from '@/lib/admin/types'

const STYLES = `
  .wiz-step-label { font-size: 0.7rem; font-family: 'Fira Code', monospace; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }
  .wiz-card { background: #111128; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; }
  .wiz-select { background: #0a0a1a; border: 1px solid rgba(255,255,255,0.08); color: #E2E8F0; padding: 8px 12px; border-radius: 8px; font-size: 0.83rem; font-family: 'Outfit', sans-serif; outline: none; width: 100%; box-sizing: border-box; }
  .wiz-select:focus { border-color: rgba(89,163,146,0.35); }
  .wiz-input { background: #0a0a1a; border: 1px solid rgba(255,255,255,0.08); color: #E2E8F0; padding: 8px 12px; border-radius: 8px; font-size: 0.83rem; font-family: 'Outfit', sans-serif; outline: none; width: 100%; box-sizing: border-box; }
  .wiz-input:focus { border-color: rgba(89,163,146,0.35); }
  .wiz-input::placeholder { color: #475569; }
  .wiz-btn-primary { background: linear-gradient(135deg,#3A589E,#59A392); color: #fff; border: none; padding: 10px 20px; border-radius: 10px; font-size: 0.88rem; font-weight: 600; font-family: 'Syne',sans-serif; cursor: pointer; transition: opacity 0.15s; }
  .wiz-btn-primary:hover { opacity: 0.88; }
  .wiz-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
  .wiz-btn-ghost { background: transparent; color: #94A3B8; border: 1px solid rgba(255,255,255,0.08); padding: 10px 18px; border-radius: 10px; font-size: 0.85rem; cursor: pointer; transition: all 0.15s; font-family: 'Outfit', sans-serif; }
  .wiz-btn-ghost:hover { border-color: rgba(89,163,146,0.3); color: #E2E8F0; }
  .field-label { font-size: 0.72rem; font-family: 'Fira Code', monospace; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; margin-bottom: 6px; display: block; }
  .client-card { padding: 14px; border-radius: 10px; border: 1.5px solid transparent; cursor: pointer; transition: all 0.15s; background: rgba(255,255,255,0.02); }
  .client-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(89,163,146,0.2); }
  .client-card.selected { border-color: rgba(89,163,146,0.5); background: rgba(89,163,146,0.06); }
  .agent-catalog-card { padding: 14px; border-radius: 10px; border: 1.5px solid transparent; cursor: pointer; transition: all 0.15s; background: rgba(255,255,255,0.02); position: relative; }
  .agent-catalog-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(89,163,146,0.2); }
  .agent-catalog-card.selected { border-color: rgba(89,163,146,0.5); background: rgba(89,163,146,0.06); }
  .oversight-card { padding: 14px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,0.06); cursor: pointer; transition: all 0.15s; background: rgba(255,255,255,0.02); }
  .oversight-card:hover { background: rgba(255,255,255,0.04); }
  .oversight-card.selected { border-color: rgba(89,163,146,0.4); background: rgba(89,163,146,0.06); }
  .connector-row { padding: 12px 14px; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); }
  .email-pill { display: inline-flex; align-items: center; gap: 5px; background: rgba(89,163,146,0.12); border: 1px solid rgba(89,163,146,0.2); color: #59A392; padding: 3px 10px; border-radius: 100px; font-size: 0.75rem; }
  .email-pill-x { background: none; border: none; color: #475569; cursor: pointer; padding: 0; font-size: 0.9rem; line-height: 1; }
  .email-pill-x:hover { color: #EF4444; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { animation: spin 0.8s linear infinite; display: inline-block; }
  @keyframes confetti-out { 0% { transform: translate(0,0) scale(1); opacity: 1; } 100% { transform: translate(var(--tx),var(--ty)) scale(0); opacity: 0; } }
  .confetti-dot { position: absolute; width: 8px; height: 8px; border-radius: 50%; animation: confetti-out 0.8s ease-out forwards; }
  @keyframes progress-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  .progress-bar-animated { background: linear-gradient(90deg, #3A589E 0%, #59A392 50%, #3A589E 100%); background-size: 200% 100%; animation: progress-shimmer 1.5s infinite; }
`

const MOCK_CONTACTS = [
  { id: 'c1', name: 'Sarah Chen', email: 'sarah@techcorp.io', company: 'TechCorp', plan: 'enterprise' },
  { id: 'c2', name: 'James Okafor', email: 'james@founderhq.co', company: 'FounderHQ', plan: 'starter' },
  { id: 'c3', name: 'Priya Mehta', email: 'priya@datasync.in', company: 'DataSync', plan: 'scale' },
  { id: 'c4', name: 'Luca Bianchi', email: 'luca@venturelab.it', company: 'VentureLab', plan: 'growth' },
  { id: 'c5', name: 'Anna Müller', email: 'anna@ecomstore.de', company: 'EcomStore', plan: 'growth' },
  { id: 'c6', name: 'Min-jun Lee', email: 'min@startuplab.kr', company: 'StartupLab', plan: 'starter' },
]

const CRON_PRESETS = [
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Every day at 6am', cron: '0 6 * * *' },
  { label: 'Every Monday at 6am', cron: '0 6 * * 1' },
  { label: 'Every weekday at 8am', cron: '0 8 * * 1-5' },
  { label: 'Every Sunday at midnight', cron: '0 0 * * 0' },
  { label: 'Every 30 minutes', cron: '*/30 * * * *' },
  { label: 'Custom', cron: 'custom' },
]

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

const STEP_LABELS = ['Select Client', 'Select Agent', 'Integrations', 'Schedule & Rules', 'Output Delivery', 'Test Run', 'Activate']

const TEST_PROGRESS_STEPS = [
  'Initializing agent...',
  'Fetching data...',
  'Processing...',
  'Generating output...',
]

export default function NewDeploymentPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  // Step 1
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientCompany, setNewClientCompany] = useState('')
  const [newClientPlan, setNewClientPlan] = useState<'starter' | 'growth' | 'scale' | 'enterprise'>('starter')
  const [clientSearch, setClientSearch] = useState('')

  // Step 2
  const [selectedAgent, setSelectedAgent] = useState<AgentName | null>(null)

  // Step 3 — connector OAuth states
  const [connectorStates, setConnectorStates] = useState<Record<ConnectorType, 'idle' | 'connecting' | 'connected'>>({} as Record<ConnectorType, 'idle' | 'connecting' | 'connected'>)

  // Step 4
  const [schedulePreset, setSchedulePreset] = useState('0 6 * * *')
  const [customCron, setCustomCron] = useState('')
  const [oversightLevel, setOversightLevel] = useState<OversightLevel>('moderate')
  const [customRules, setCustomRules] = useState<Record<string, string | number | boolean>>({})

  // Step 5
  const [outputFormat, setOutputFormat] = useState<'email' | 'slack' | 'notion' | 'airtable' | 'webhook'>('email')
  const [outputEmails, setOutputEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [slackWebhook, setSlackWebhook] = useState('')
  const [testSending, setTestSending] = useState(false)
  const [testSent, setTestSent] = useState(false)

  // Step 6
  const [testProgress, setTestProgress] = useState(-1) // -1 = not started, 0-3 = progress steps
  const [testOutput, setTestOutput] = useState('')
  const [testDone, setTestDone] = useState(false)

  // Step 7
  const [activating, setActivating] = useState(false)
  const [activated, setActivated] = useState(false)
  const [newDepId] = useState(`DEP-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`)

  const agentCatalog = selectedAgent ? MOCK_AGENT_CATALOG.find(a => a.name === selectedAgent) : null
  const selectedClientData = selectedClient
    ? MOCK_CONTACTS.find(c => c.id === selectedClient)
    : showNewClientForm ? { id: 'new', name: newClientName, email: newClientEmail, company: newClientCompany, plan: newClientPlan } : null

  const filteredContacts = MOCK_CONTACTS.filter(c =>
    !clientSearch ||
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.company.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase())
  )

  function connectOAuth(type: ConnectorType) {
    setConnectorStates(prev => ({ ...prev, [type]: 'connecting' }))
    setTimeout(() => {
      setConnectorStates(prev => ({ ...prev, [type]: 'connected' }))
    }, 2000)
  }

  function requiredConnectorsDone(): boolean {
    if (!agentCatalog) return false
    return agentCatalog.required_connectors.every(ct => connectorStates[ct] === 'connected')
  }

  function initCustomRules() {
    if (!agentCatalog) return
    const defaults: Record<string, string | number | boolean> = {}
    Object.entries(agentCatalog.custom_rule_schema).forEach(([key, schema]) => {
      if (schema.default !== undefined) {
        defaults[key] = schema.default as string | number | boolean
      }
    })
    setCustomRules(defaults)
  }

  function runTest() {
    setTestProgress(0)
    setTestOutput('')
    setTestDone(false)
    const interval = setInterval(() => {
      setTestProgress(prev => {
        if (prev >= TEST_PROGRESS_STEPS.length - 1) {
          clearInterval(interval)
          setTimeout(() => {
            setTestOutput(agentCatalog?.example_output || 'Run completed successfully. All checks passed.')
            setTestDone(true)
          }, 400)
          return prev
        }
        return prev + 1
      })
    }, 700)
  }

  function handleSendTest() {
    setTestSending(true)
    setTimeout(() => { setTestSending(false); setTestSent(true) }, 1500)
  }

  function handleActivate() {
    setActivating(true)
    setTimeout(() => {
      setActivating(false)
      setActivated(true)
    }, 1200)
  }

  function canProceed(): boolean {
    switch (step) {
      case 0: return !!(selectedClient || (showNewClientForm && newClientName && newClientEmail))
      case 1: return !!selectedAgent
      case 2: return requiredConnectorsDone()
      case 3: return true
      case 4: return true
      case 5: return testDone
      case 6: return true
      default: return true
    }
  }

  function handleNext() {
    if (step === 1 && selectedAgent) initCustomRules()
    if (step < 6) setStep(s => s + 1)
  }

  return (
    <div style={{ color: '#E2E8F0', fontFamily: "'Outfit', sans-serif", maxWidth: '760px' }}>
      <style>{STYLES}</style>

      {/* Back */}
      <Link href="/admin/deployments" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '20px', transition: 'color 0.15s' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Deployments
      </Link>

      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.025em', color: '#F8FAFC', marginBottom: '4px' }}>
          New Deployment
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Step {step + 1} of 7 — {STEP_LABELS[step]}</p>
      </div>

      {/* Step progress bar */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          {STEP_LABELS.map((label, i) => (
            <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= step ? 'linear-gradient(90deg,#3A589E,#59A392)' : 'rgba(255,255,255,0.08)' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {STEP_LABELS.map((label, i) => (
            <span key={i} className="wiz-step-label" style={{ color: i === step ? '#59A392' : i < step ? '#475569' : '#334155', flex: 1, textAlign: i === 0 ? 'left' : i === STEP_LABELS.length - 1 ? 'right' : 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '2px' }}>
              {i < step ? '✓' : i + 1}
            </span>
          ))}
        </div>
      </div>

      {/* ── STEP 1: Select Client ── */}
      {step === 0 && (
        <div className="wiz-card">
          <div style={{ fontWeight: 600, fontSize: '1rem', fontFamily: "'Syne', sans-serif", color: '#F1F5F9', marginBottom: '16px' }}>Select Client</div>
          <input className="wiz-input" placeholder="Search by name, company, or email..." value={clientSearch} onChange={e => setClientSearch(e.target.value)} style={{ marginBottom: '14px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px', marginBottom: '12px' }}>
            {filteredContacts.map(c => {
              const pc = PLAN_COLORS[c.plan as keyof typeof PLAN_COLORS]
              return (
                <div key={c.id} className={`client-card${selectedClient === c.id ? ' selected' : ''}`} onClick={() => { setSelectedClient(c.id); setShowNewClientForm(false) }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F1F5F9', marginBottom: '2px' }}>{c.name}</div>
                      <div style={{ color: '#64748B', fontSize: '0.78rem' }}>{c.email} · {c.company}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '6px', background: `${pc}18`, color: pc, fontSize: '0.68rem', fontWeight: 600, fontFamily: "'Fira Code', monospace", border: `1px solid ${pc}30`, textTransform: 'capitalize' }}>
                        {c.plan}
                      </span>
                      {selectedClient === c.id && (
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#59A392', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
            <button className="wiz-btn-ghost" style={{ fontSize: '0.82rem', width: '100%' }} onClick={() => { setShowNewClientForm(!showNewClientForm); setSelectedClient(null) }}>
              {showNewClientForm ? '− Cancel New Client' : '+ Create New Client'}
            </button>
            {showNewClientForm && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
                <div>
                  <label className="field-label">Name *</label>
                  <input className="wiz-input" placeholder="Jane Smith" value={newClientName} onChange={e => setNewClientName(e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Email *</label>
                  <input className="wiz-input" placeholder="jane@company.com" value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Company</label>
                  <input className="wiz-input" placeholder="Company Inc." value={newClientCompany} onChange={e => setNewClientCompany(e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Plan</label>
                  <select className="wiz-select" value={newClientPlan} onChange={e => setNewClientPlan(e.target.value as typeof newClientPlan)}>
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="scale">Scale</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 2: Select Agent ── */}
      {step === 1 && (
        <div className="wiz-card">
          <div style={{ fontWeight: 600, fontSize: '1rem', fontFamily: "'Syne', sans-serif", color: '#F1F5F9', marginBottom: '16px' }}>Select Agent</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
            {MOCK_AGENT_CATALOG.map(agent => {
              const color = AGENT_COLORS[agent.name as AgentName]
              const isSelected = selectedAgent === agent.name
              const catColors: Record<string, string> = { content: '#7B6FE8', pipeline: '#59A392', monitoring: '#EF4444', communication: '#6BA3E8', analytics: '#5BB5E0', development: '#E8916F' }
              return (
                <div key={agent.name} className={`agent-catalog-card${isSelected ? ' selected' : ''}`} onClick={() => setSelectedAgent(agent.name as AgentName)}>
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', borderRadius: '50%', background: '#59A392', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.8rem', color, fontWeight: 700 }}>{agent.name}</span>
                    <span style={{ marginLeft: 'auto', padding: '1px 7px', borderRadius: '6px', background: `${catColors[agent.category] || '#64748B'}18`, color: catColors[agent.category] || '#64748B', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", fontWeight: 600 }}>
                      {agent.category}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#F1F5F9', marginBottom: '4px' }}>{agent.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.5, marginBottom: '8px' }}>{agent.description}</div>
                  {agent.required_connectors.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {agent.required_connectors.map(ct => (
                        <span key={ct} style={{ padding: '1px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.65rem', color: '#64748B', fontFamily: "'Fira Code', monospace" }}>
                          {CONNECTOR_ICONS[ct as ConnectorType] || ct}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {selectedAgent && agentCatalog && (
            <div style={{ background: 'rgba(89,163,146,0.06)', border: '1px solid rgba(89,163,146,0.15)', borderRadius: '10px', padding: '12px 16px' }}>
              <div style={{ color: '#59A392', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px', fontFamily: "'Fira Code', monospace" }}>
                Selected: {selectedAgent}
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '6px' }}>{agentCatalog.description}</div>
              <div style={{ color: '#64748B', fontSize: '0.75rem' }}>Typical schedule: {agentCatalog.typical_schedule}</div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Configure Integrations ── */}
      {step === 2 && agentCatalog && (
        <div className="wiz-card">
          <div style={{ fontWeight: 600, fontSize: '1rem', fontFamily: "'Syne', sans-serif", color: '#F1F5F9', marginBottom: '4px' }}>Configure Integrations</div>
          <div style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: '20px' }}>Connect the services this agent needs to operate.</div>

          {agentCatalog.required_connectors.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} />
                <span style={{ fontSize: '0.75rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8' }}>Required</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {agentCatalog.required_connectors.map(ct => renderConnectorRow(ct, true))}
              </div>
            </div>
          )}

          {agentCatalog.optional_connectors.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#64748B' }} />
                <span style={{ fontSize: '0.75rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B' }}>Optional</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {agentCatalog.optional_connectors.map(ct => renderConnectorRow(ct, false))}
              </div>
            </div>
          )}

          {!requiredConnectorsDone() && agentCatalog.required_connectors.length > 0 && (
            <div style={{ marginTop: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', fontSize: '0.78rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Connect all required integrations to proceed.
            </div>
          )}
        </div>
      )}

      {/* ── STEP 4: Schedule & Rules ── */}
      {step === 3 && agentCatalog && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="wiz-card">
            <div style={{ fontWeight: 600, fontSize: '1rem', fontFamily: "'Syne', sans-serif", color: '#F1F5F9', marginBottom: '16px' }}>Schedule</div>
            <label className="field-label">Run Schedule</label>
            <select className="wiz-select" value={schedulePreset} onChange={e => setSchedulePreset(e.target.value)} style={{ marginBottom: '10px' }}>
              {CRON_PRESETS.map(p => <option key={p.cron} value={p.cron}>{p.label}</option>)}
            </select>
            {schedulePreset === 'custom' ? (
              <input className="wiz-input" placeholder="e.g. 0 9 * * 1-5" value={customCron} onChange={e => setCustomCron(e.target.value)} />
            ) : (
              <div style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.75rem', color: '#59A392', background: 'rgba(89,163,146,0.08)', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}>
                {schedulePreset} — {cronToHuman(schedulePreset)}
              </div>
            )}
          </div>

          <div className="wiz-card">
            <div style={{ fontWeight: 600, fontSize: '1rem', fontFamily: "'Syne', sans-serif", color: '#F1F5F9', marginBottom: '16px' }}>Agent Rules</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {Object.entries(agentCatalog.custom_rule_schema).map(([key, schema]) => (
                <div key={key}>
                  <label className="field-label">{schema.label}</label>
                  {schema.type === 'boolean' ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                        <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} checked={!!customRules[key]}
                          onChange={e => setCustomRules(prev => ({ ...prev, [key]: e.target.checked }))}
                        />
                        <span style={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          background: customRules[key] ? '#59A392' : 'rgba(255,255,255,0.1)',
                          borderRadius: '10px', cursor: 'pointer', transition: '0.2s',
                        }}>
                          <span style={{
                            position: 'absolute', height: '14px', width: '14px', left: customRules[key] ? '19px' : '3px', bottom: '3px',
                            background: 'white', borderRadius: '50%', transition: '0.2s',
                          }} />
                        </span>
                      </label>
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{customRules[key] ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  ) : schema.type === 'select' ? (
                    <select className="wiz-select" value={String(customRules[key] ?? schema.default ?? '')} onChange={e => setCustomRules(prev => ({ ...prev, [key]: e.target.value }))}>
                      {(schema.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : schema.type === 'number' ? (
                    <input type="number" className="wiz-input" value={Number(customRules[key] ?? schema.default ?? 0)} onChange={e => setCustomRules(prev => ({ ...prev, [key]: Number(e.target.value) }))} />
                  ) : (
                    <input type="text" className="wiz-input" value={String(customRules[key] ?? schema.default ?? '')} onChange={e => setCustomRules(prev => ({ ...prev, [key]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="wiz-card">
            <div style={{ fontWeight: 600, fontSize: '1rem', fontFamily: "'Syne', sans-serif", color: '#F1F5F9', marginBottom: '16px' }}>Oversight Level</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(['strict', 'moderate', 'autonomous'] as OversightLevel[]).map(level => (
                <div key={level} className={`oversight-card${oversightLevel === level ? ' selected' : ''}`} onClick={() => setOversightLevel(level)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '14px', height: '14px', borderRadius: '50%',
                      border: `2px solid ${oversightLevel === level ? '#59A392' : 'rgba(255,255,255,0.2)'}`,
                      background: oversightLevel === level ? '#59A392' : 'transparent',
                      flexShrink: 0,
                    }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#F1F5F9', textTransform: 'capitalize' }}>{level}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{OVERSIGHT_LABELS[level]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 5: Output Delivery ── */}
      {step === 4 && (
        <div className="wiz-card">
          <div style={{ fontWeight: 600, fontSize: '1rem', fontFamily: "'Syne', sans-serif", color: '#F1F5F9', marginBottom: '20px' }}>Output Delivery</div>

          <label className="field-label">Output Format</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '8px', marginBottom: '20px' }}>
            {(['email', 'slack', 'notion', 'airtable', 'webhook'] as const).map(fmt => (
              <div key={fmt} onClick={() => setOutputFormat(fmt)} style={{
                padding: '10px 6px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer',
                border: `1.5px solid ${outputFormat === fmt ? 'rgba(89,163,146,0.5)' : 'rgba(255,255,255,0.06)'}`,
                background: outputFormat === fmt ? 'rgba(89,163,146,0.08)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.15s',
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: outputFormat === fmt ? '#59A392' : '#94A3B8', textTransform: 'capitalize' }}>{fmt}</div>
              </div>
            ))}
          </div>

          <label className="field-label" style={{ marginBottom: '6px', display: 'block' }}>Email Recipients</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px', minHeight: '30px' }}>
            {outputEmails.map(em => (
              <span key={em} className="email-pill">
                {em}
                <button className="email-pill-x" onClick={() => setOutputEmails(prev => prev.filter(e => e !== em))}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input className="wiz-input" placeholder="Add email address..." value={emailInput} onChange={e => setEmailInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && emailInput.includes('@')) { setOutputEmails(prev => [...prev, emailInput]); setEmailInput('') } }}
              style={{ flex: 1 }}
            />
            <button className="wiz-btn-ghost" style={{ whiteSpace: 'nowrap', padding: '8px 14px' }}
              onClick={() => { if (emailInput.includes('@')) { setOutputEmails(prev => [...prev, emailInput]); setEmailInput('') } }}>
              Add
            </button>
          </div>

          <label className="field-label">Slack Webhook (optional)</label>
          <input className="wiz-input" placeholder="https://hooks.slack.com/..." value={slackWebhook} onChange={e => setSlackWebhook(e.target.value)} style={{ marginBottom: '20px' }} />

          <button className="wiz-btn-ghost" onClick={handleSendTest} disabled={testSending || testSent} style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: testSent ? 0.7 : 1 }}>
            {testSending ? (
              <><span className="spinner">⟳</span> Sending test...</>
            ) : testSent ? (
              <><span style={{ color: '#4ade80' }}>✓</span> Test sent!</>
            ) : (
              <>Send test notification</>
            )}
          </button>
        </div>
      )}

      {/* ── STEP 6: Test Run ── */}
      {step === 5 && agentCatalog && (
        <div className="wiz-card">
          <div style={{ fontWeight: 600, fontSize: '1rem', fontFamily: "'Syne', sans-serif", color: '#F1F5F9', marginBottom: '6px' }}>Test Run</div>
          <div style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: '20px' }}>Run a test to verify your configuration before activating.</div>

          {/* Config summary */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
              {[
                { label: 'Client', value: selectedClientData?.company || selectedClientData?.name || '—' },
                { label: 'Agent', value: selectedAgent || '—' },
                { label: 'Schedule', value: cronToHuman(schedulePreset) },
                { label: 'Oversight', value: oversightLevel },
                { label: 'Output', value: outputFormat },
                { label: 'Recipients', value: outputEmails.length > 0 ? outputEmails.join(', ') : 'None configured' },
              ].map(item => (
                <div key={item.label}>
                  <span style={{ color: '#475569', fontSize: '0.72rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}:</span>{' '}
                  <span style={{ color: '#94A3B8' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {testProgress === -1 && !testDone && (
            <button className="wiz-btn-primary" onClick={runTest} style={{ width: '100%', padding: '14px' }}>
              Run Test
            </button>
          )}

          {testProgress >= 0 && !testDone && (
            <div>
              {/* Progress steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {TEST_PROGRESS_STEPS.map((label, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {i < testProgress ? (
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                    ) : i === testProgress ? (
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #59A392', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="spinner" style={{ fontSize: '10px', color: '#59A392' }}>⟳</span>
                      </div>
                    ) : (
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)', flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: '0.85rem', color: i <= testProgress ? '#F1F5F9' : '#475569' }}>{label}</span>
                  </div>
                ))}
              </div>
              {/* Animated progress bar */}
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <div className="progress-bar-animated" style={{ height: '100%', width: `${((testProgress + 1) / TEST_PROGRESS_STEPS.length) * 100}%`, transition: 'width 0.5s ease', borderRadius: '2px' }} />
              </div>
            </div>
          )}

          {testDone && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <span style={{ fontWeight: 600, color: '#4ade80', fontSize: '0.9rem' }}>Test run completed successfully</span>
              </div>
              <pre style={{
                background: '#0a0a1a', border: '1px solid rgba(89,163,146,0.15)', borderRadius: '8px',
                padding: '14px 16px', fontSize: '0.8rem', color: '#94A3B8',
                fontFamily: "'Fira Code', monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                marginBottom: '14px', lineHeight: 1.6,
              }}>
                {testOutput}
              </pre>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="wiz-btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => { setTestDone(false); setTestProgress(-1); setTestOutput('') }}>
                  Re-run test
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 7: Activate ── */}
      {step === 6 && (
        <div className="wiz-card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {!activated ? (
            <>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#59A392" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '8px' }}>Ready to Activate</h2>
                <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Review your configuration and activate the deployment.</p>
              </div>

              {/* Summary card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'Client', value: selectedClientData?.company || selectedClientData?.name || '—' },
                    { label: 'Agent', value: `${selectedAgent} — ${agentCatalog?.label || ''}` },
                    { label: 'Schedule', value: cronToHuman(schedulePreset) },
                    { label: 'Oversight', value: oversightLevel.charAt(0).toUpperCase() + oversightLevel.slice(1) },
                    { label: 'Integrations', value: agentCatalog ? `${agentCatalog.required_connectors.length + agentCatalog.optional_connectors.filter(ct => connectorStates[ct] === 'connected').length} connected` : '—' },
                    { label: 'Output', value: outputFormat.charAt(0).toUpperCase() + outputFormat.slice(1) },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ color: '#475569', fontSize: '0.7rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</span>
                      <span style={{ color: '#F1F5F9', fontSize: '0.85rem', fontWeight: 500 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="wiz-btn-primary"
                onClick={handleActivate}
                disabled={activating}
                style={{ width: '100%', padding: '14px', fontSize: '1rem', background: 'linear-gradient(135deg,#4ade80,#22c55e)', boxShadow: '0 4px 24px rgba(74,222,128,0.3)', position: 'relative' }}
              >
                {activating ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="spinner">⟳</span> Activating...
                  </span>
                ) : 'Activate Deployment'}
              </button>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              {/* Confetti dots */}
              {[
                { color: '#4ade80', tx: '-60px', ty: '-40px', delay: '0s' },
                { color: '#59A392', tx: '60px', ty: '-50px', delay: '0.05s' },
                { color: '#6BA3E8', tx: '-30px', ty: '-70px', delay: '0.1s' },
                { color: '#E8B84D', tx: '40px', ty: '-60px', delay: '0.08s' },
                { color: '#7B6FE8', tx: '0px', ty: '-80px', delay: '0.12s' },
              ].map((dot, i) => (
                <div key={i} className="confetti-dot" style={{
                  background: dot.color,
                  top: '50%', left: '50%',
                  ['--tx' as string]: dot.tx,
                  ['--ty' as string]: dot.ty,
                  animationDelay: dot.delay,
                }} />
              ))}

              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(74,222,128,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid #4ade80' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#4ade80', marginBottom: '8px' }}>
                Deployment Activated!
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '8px' }}>
                First scheduled run: {cronToHuman(schedulePreset)}
              </p>
              <p style={{ color: '#475569', fontSize: '0.78rem', marginBottom: '24px', fontFamily: "'Fira Code', monospace" }}>
                ID: {newDepId}
              </p>
              <Link href={`/admin/deployments`} style={{ textDecoration: 'none' }}>
                <button className="wiz-btn-primary" style={{ padding: '11px 28px' }}>
                  View Deployment →
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      {!activated && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button
            className="wiz-btn-ghost"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.4 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer' }}
          >
            ← Back
          </button>
          {step < 6 && (
            <button
              className="wiz-btn-primary"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  )

  function renderConnectorRow(ct: ConnectorType, required: boolean) {
    const cState = connectorStates[ct] || 'idle'
    const icon = CONNECTOR_ICONS[ct] || ct.toUpperCase()
    return (
      <div key={ct} className="connector-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: cState === 'connected' ? 'rgba(89,163,146,0.12)' : 'rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 700, color: cState === 'connected' ? '#59A392' : '#64748B',
            fontFamily: "'Fira Code', monospace", flexShrink: 0,
          }}>
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {ct.charAt(0).toUpperCase() + ct.slice(1).replace(/_/g, ' ')}
              {required && <span style={{ fontSize: '0.65rem', color: '#EF4444', fontFamily: "'Fira Code', monospace", fontWeight: 700 }}>REQUIRED</span>}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#475569' }}>
              {cState === 'connected' ? 'Connected as test@example.com' : cState === 'connecting' ? 'Connecting...' : 'Not connected'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cState === 'connected' && (
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80' }} />
            )}
            <button
              onClick={() => connectOAuth(ct)}
              disabled={cState === 'connected' || cState === 'connecting'}
              style={{
                background: cState === 'connected' ? 'rgba(74,222,128,0.12)' : 'linear-gradient(135deg,#3A589E,#59A392)',
                color: cState === 'connected' ? '#4ade80' : '#fff',
                border: 'none', padding: '6px 14px', borderRadius: '7px',
                fontSize: '0.75rem', fontWeight: 600, cursor: cState === 'connected' ? 'default' : 'pointer',
                fontFamily: "'Syne', sans-serif", transition: 'opacity 0.15s',
                opacity: cState === 'connecting' ? 0.7 : 1,
              }}
            >
              {cState === 'connected' ? '✓ Connected' : cState === 'connecting' ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="spinner">⟳</span> Connecting...</span> : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    )
  }
}
