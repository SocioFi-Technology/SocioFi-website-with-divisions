'use client'

import React, { useState } from 'react'

/* ─────────────────────────────────────────────────────────── */
/* Types                                                       */
/* ─────────────────────────────────────────────────────────── */

type SettingsTab = 'notifications' | 'integrations' | 'nexus' | 'data' | 'billing'
type ApprovalMode = 'manual' | 'semi-auto' | 'auto'

interface AgentOverride {
  name: string
  color: string
  enabled: boolean
  schedule: string
  approval: 'inherit' | 'manual' | 'semi-auto' | 'auto'
  lastModified: string
}

interface DeletionRequest {
  email: string
  received: string
  status: 'pending' | 'processed'
}

interface Invoice {
  id: string
  client: string
  amount: number
  date: string
  status: 'paid' | 'pending' | 'overdue'
}

/* ─────────────────────────────────────────────────────────── */
/* Constants & Mock Data                                       */
/* ─────────────────────────────────────────────────────────── */

const DIVISION_LIST = ['studio', 'services', 'labs', 'products', 'academy', 'ventures', 'cloud']

const DIVISION_COLORS: Record<string, string> = {
  studio: '#72C4B2', services: '#4DBFA8', labs: '#7B6FE8',
  products: '#E8916F', academy: '#E8B84D', ventures: '#6BA3E8', cloud: '#5BB5E0',
}

const AGENT_NAMES_16 = [
  'NEXUS', 'INTAKE', 'HERALD', 'SCRIBE', 'OVERSEER', 'PATCHER',
  'ARCHITECT', 'FORGE', 'SENTINEL', 'ATLAS', 'CHRONICLE', 'MENTOR',
  'SCOUT', 'SURVEYOR', 'RELAY', 'AUDITOR',
]

const AGENT_COLORS: Record<string, string> = {
  NEXUS: '#E8B84D', INTAKE: '#72C4B2', HERALD: '#6BA3E8', SCRIBE: '#A78BFA',
  OVERSEER: '#4DBFA8', PATCHER: '#E8916F', ARCHITECT: '#5BB5E0', FORGE: '#EF4444',
  SENTINEL: '#59A392', ATLAS: '#7B6FE8', CHRONICLE: '#4ade80', MENTOR: '#E8B84D',
  SCOUT: '#72C4B2', SURVEYOR: '#6BA3E8', RELAY: '#E8916F', AUDITOR: '#4ade80',
}

const AGENT_SCHEDULES: Record<string, string> = {
  NEXUS: 'Continuous', INTAKE: 'Every 5 min', HERALD: 'Every 15 min', SCRIBE: 'Every 30 min',
  OVERSEER: 'Every 10 min', PATCHER: 'Daily 03:00', ARCHITECT: 'On demand', FORGE: 'Every hour',
  SENTINEL: 'Continuous', ATLAS: 'Every 6h', CHRONICLE: 'Daily 00:00', MENTOR: 'Weekly',
  SCOUT: 'Every 2h', SURVEYOR: 'Daily 08:00', RELAY: 'Every 5 min', AUDITOR: 'Daily 06:00',
}

const INIT_AGENT_OVERRIDES: AgentOverride[] = AGENT_NAMES_16.map((name, i) => ({
  name,
  color: AGENT_COLORS[name] || '#64748B',
  enabled: i !== 7, // FORGE disabled by default for demo
  schedule: AGENT_SCHEDULES[name] || 'Every hour',
  approval: 'inherit',
  lastModified: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
}))

const INIT_DIV_EMAILS: Record<string, string[]> = {
  studio:   ['studio@sociofitechnology.com', 'nadia@sociofitechnology.com'],
  services: ['services@sociofitechnology.com', 'rafi@sociofitechnology.com'],
  labs:     ['labs@sociofitechnology.com'],
  products: ['products@sociofitechnology.com'],
  academy:  ['academy@sociofitechnology.com', 'nadia@sociofitechnology.com'],
  ventures: ['ventures@sociofitechnology.com', 'arifur@sociofitechnology.com'],
  cloud:    ['cloud@sociofitechnology.com', 'rafi@sociofitechnology.com'],
}

const INIT_DIV_CHANNELS: Record<string, string> = {
  studio: '#studio-notifs', services: '#services-alerts', labs: '#labs-feed',
  products: '#products-notifs', academy: '#academy-updates', ventures: '#ventures-leads', cloud: '#cloud-alerts',
}

const MOCK_DELETION_REQUESTS: DeletionRequest[] = [
  { email: 'user1@example.com', received: new Date(Date.now() - 3 * 86400000).toISOString(), status: 'pending' },
  { email: 'user2@client.com',  received: new Date(Date.now() - 8 * 86400000).toISOString(), status: 'processed' },
  { email: 'user3@test.io',     received: new Date(Date.now() - 1 * 86400000).toISOString(), status: 'pending' },
]

const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2401', client: 'TechVentures Ltd',   amount: 8400,  date: '2026-03-10', status: 'paid'    },
  { id: 'INV-2402', client: 'GrowthLabs Inc',     amount: 3200,  date: '2026-03-12', status: 'paid'    },
  { id: 'INV-2403', client: 'StartupForge',        amount: 1600,  date: '2026-03-14', status: 'pending' },
  { id: 'INV-2404', client: 'NovaCloud Systems',  amount: 5800,  date: '2026-03-15', status: 'paid'    },
  { id: 'INV-2405', client: 'Meridian Digital',   amount: 2400,  date: '2026-03-17', status: 'overdue' },
  { id: 'INV-2406', client: 'Apex Analytics',     amount: 4100,  date: '2026-03-18', status: 'paid'    },
  { id: 'INV-2407', client: 'BlueSky Ventures',   amount: 9600,  date: '2026-03-20', status: 'pending' },
  { id: 'INV-2408', client: 'FounderHQ',          amount: 2200,  date: '2026-03-22', status: 'paid'    },
]

const MOCK_SUBS = [
  { client: 'TechVentures Ltd',  plan: 'Scale',      service: 'NEXUS Agent Suite',  mrr: 4200, status: 'active', next: '2026-04-10' },
  { client: 'GrowthLabs Inc',    plan: 'Growth',     service: 'Studio Services',    mrr: 1600, status: 'active', next: '2026-04-12' },
  { client: 'NovaCloud Systems', plan: 'Enterprise', service: 'Cloud Managed',      mrr: 5800, status: 'active', next: '2026-04-15' },
  { client: 'Apex Analytics',    plan: 'Starter',    service: 'Monitoring Suite',   mrr: 800,  status: 'active', next: '2026-04-18' },
  { client: 'BlueSky Ventures',  plan: 'Scale',      service: 'NEXUS + Studio',     mrr: 6200, status: 'active', next: '2026-04-20' },
]

const PLAN_COLORS: Record<string, string> = {
  starter: '#64748B', growth: '#6BA3E8', scale: '#7B6FE8', enterprise: '#E8B84D',
}

/* ─────────────────────────────────────────────────────────── */
/* Helpers                                                     */
/* ─────────────────────────────────────────────────────────── */

function rel(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(',')),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function fmt(n: number) { return '$' + n.toLocaleString() }

/* ─────────────────────────────────────────────────────────── */
/* Styles                                                      */
/* ─────────────────────────────────────────────────────────── */

const STYLES = `
  .ss-root { display: flex; flex-direction: column; gap: 24px; }
  .ss-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #E2E8F0; letter-spacing: -0.02em; margin-bottom: 4px; }
  .ss-sub   { font-size: 13px; color: #64748B; }

  /* Tabs */
  .ss-tabs { display: flex; gap: 4px; background: #12162A; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 4px; width: fit-content; flex-wrap: wrap; }
  .ss-tab  { padding: 7px 16px; border-radius: 7px; font-size: 0.82rem; font-weight: 600; font-family: 'Syne', sans-serif; cursor: pointer; border: none; background: transparent; color: #64748B; transition: all 0.18s; white-space: nowrap; }
  .ss-tab.active { background: rgba(255,255,255,0.07); color: #E2E8F0; }
  .ss-tab:hover:not(.active) { color: #94A3B8; }

  /* Cards / sections */
  .ss-card { background: #12162A; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; }
  .ss-card-header { padding: 18px 22px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .ss-card-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #E2E8F0; }
  .ss-card-sub   { font-size: 12px; color: #64748B; margin-top: 2px; }
  .ss-card-body  { padding: 18px 22px; }

  /* Table */
  .ss-table { width: 100%; border-collapse: collapse; }
  .ss-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.06); }
  .ss-table thead th { padding: 10px 14px; text-align: left; font-size: 0.7rem; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap; }
  .ss-table tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); }
  .ss-table tbody tr:last-child { border-bottom: none; }
  .ss-table tbody tr:hover { background: rgba(255,255,255,0.015); }
  .ss-table tbody td { padding: 12px 14px; font-size: 0.82rem; color: #94A3B8; vertical-align: middle; }

  /* Inputs */
  .ss-input { padding: 8px 12px; background: #0a0e1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #E2E8F0; font-size: 0.83rem; font-family: 'Outfit', sans-serif; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
  .ss-input:focus { border-color: rgba(89,163,146,0.4); }
  .ss-input-full { width: 100%; }
  .ss-select { padding: 8px 12px; background: #0a0e1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #E2E8F0; font-size: 0.83rem; font-family: 'Outfit', sans-serif; outline: none; cursor: pointer; appearance: none; box-sizing: border-box; }

  /* Buttons */
  .ss-btn       { padding: 7px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #94A3B8; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .ss-btn:hover { border-color: rgba(255,255,255,0.2); color: #E2E8F0; }
  .ss-btn-primary       { padding: 8px 16px; border-radius: 8px; border: none; background: linear-gradient(135deg, #3A589E, #59A392); color: #fff; font-size: 0.82rem; font-weight: 700; font-family: 'Syne', sans-serif; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
  .ss-btn-primary:hover { opacity: 0.88; }
  .ss-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .ss-btn-danger        { padding: 7px 14px; border-radius: 8px; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.08); color: #EF4444; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .ss-btn-danger:hover  { background: rgba(239,68,68,0.15); }
  .ss-btn-success       { padding: 7px 14px; border-radius: 8px; border: 1px solid rgba(74,222,128,0.3); background: rgba(74,222,128,0.08); color: #4ade80; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }

  /* Toggle */
  .toggle-track { width: 40px; height: 22px; border-radius: 11px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
  .toggle-track.on { background: #4ade80; }
  .toggle-thumb { width: 16px; height: 16px; border-radius: 50%; background: white; position: absolute; top: 2px; left: 3px; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
  .toggle-track.on .toggle-thumb { transform: translateX(18px); }

  /* Section label */
  .ss-section-label { font-size: 0.7rem; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; margin-top: 4px; }

  /* Grid layouts */
  .ss-grid-2  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ss-grid-3  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  @media (max-width: 900px) { .ss-grid-2 { grid-template-columns: 1fr; } .ss-grid-3 { grid-template-columns: 1fr; } }

  /* Email tag input */
  .ss-tag-input-wrap { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px; background: #0a0e1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; min-height: 42px; align-items: flex-start; cursor: text; }
  .ss-tag-input-wrap:focus-within { border-color: rgba(89,163,146,0.4); }
  .ss-tag   { display: inline-flex; align-items: center; gap: 5px; background: rgba(89,163,146,0.12); border: 1px solid rgba(89,163,146,0.25); color: #72C4B2; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; }
  .ss-tag-x { background: none; border: none; color: #59A392; cursor: pointer; padding: 0; font-size: 14px; line-height: 1; display: flex; align-items: center; }
  .ss-tag-text-input { background: transparent; border: none; outline: none; color: #E2E8F0; font-size: 0.82rem; font-family: 'Outfit', sans-serif; flex: 1; min-width: 120px; }

  /* Integration card */
  .ss-int-card  { background: #0d1121; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 14px; transition: border-color 0.2s; }
  .ss-int-card:hover { border-color: rgba(255,255,255,0.1); }
  .ss-int-icon  { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; font-family: 'Syne', sans-serif; flex-shrink: 0; }
  .ss-int-name  { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #E2E8F0; }
  .ss-int-detail { font-size: 0.78rem; color: #64748B; font-family: monospace; word-break: break-all; }
  .ss-status-connected    { display: inline-flex; align-items: center; gap: 5px; background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25); color: #4ade80; padding: 2px 9px; border-radius: 100px; font-size: 0.7rem; font-weight: 600; }
  .ss-status-error        { display: inline-flex; align-items: center; gap: 5px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #EF4444; padding: 2px 9px; border-radius: 100px; font-size: 0.7rem; font-weight: 600; }
  .ss-status-disconnected { display: inline-flex; align-items: center; gap: 5px; background: rgba(100,116,139,0.1); border: 1px solid rgba(100,116,139,0.25); color: #64748B; padding: 2px 9px; border-radius: 100px; font-size: 0.7rem; font-weight: 600; }

  /* NEXUS master card */
  .ss-nexus-master { background: #12162A; border: 1px solid rgba(89,163,146,0.2); border-radius: 14px; padding: 22px 26px; display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: all 0.3s; flex-wrap: wrap; }
  .ss-nexus-master.off { background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.25); }
  .ss-nexus-status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 100px; font-size: 0.72rem; font-weight: 600; }
  .ss-nexus-warning { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 12px 16px; color: #EF4444; font-size: 0.83rem; margin-top: 8px; }

  /* Radio cards */
  .ss-radio-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  @media (max-width: 800px) { .ss-radio-cards { grid-template-columns: 1fr; } }
  .ss-radio-card { border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: all 0.15s; }
  .ss-radio-card.selected { border-color: rgba(89,163,146,0.5); background: rgba(89,163,146,0.06); }
  .ss-radio-card:hover:not(.selected) { border-color: rgba(255,255,255,0.14); }
  .ss-radio-label  { font-size: 0.85rem; font-weight: 700; color: #E2E8F0; margin-bottom: 4px; font-family: 'Syne', sans-serif; }
  .ss-radio-detail { font-size: 0.75rem; color: #64748B; }

  /* Slider */
  .ss-slider { width: 100%; accent-color: #59A392; cursor: pointer; }
  .ss-slider-value { font-family: 'Fira Code', monospace; font-size: 0.9rem; color: #72C4B2; font-weight: 600; }

  /* Export cards */
  .ss-export-card { background: #0d1121; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
  .ss-export-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #E2E8F0; }
  .ss-export-desc  { font-size: 0.78rem; color: #64748B; line-height: 1.5; }

  /* Revenue cards */
  .ss-rev-card  { background: #0d1121; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; }
  .ss-rev-label { font-size: 0.72rem; color: #64748B; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
  .ss-rev-value { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #E2E8F0; letter-spacing: -0.02em; }

  /* Info box */
  .ss-info-box { background: rgba(107,163,232,0.06); border: 1px solid rgba(107,163,232,0.2); border-radius: 10px; padding: 13px 16px; font-size: 0.8rem; color: #94A3B8; line-height: 1.55; }

  /* Confirmation dialog */
  .ss-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 1100; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
  .ss-confirm-box  { background: #12162A; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; width: 100%; max-width: 400px; padding: 24px; }
  .ss-confirm-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #E2E8F0; margin-bottom: 10px; }
  .ss-confirm-text  { font-size: 0.83rem; color: #94A3B8; line-height: 1.55; margin-bottom: 18px; }
  .ss-confirm-actions { display: flex; gap: 10px; justify-content: flex-end; }

  /* Invoice modal */
  .ss-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
  .ss-modal { background: #12162A; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; width: 100%; max-width: 460px; overflow: hidden; }
  .ss-modal-header { padding: 20px 22px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; }
  .ss-modal-title  { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #E2E8F0; }
  .ss-modal-close  { width: 28px; height: 28px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #64748B; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .ss-modal-close:hover { color: #E2E8F0; }
  .ss-modal-body   { padding: 18px 22px; display: flex; flex-direction: column; gap: 16px; }
  .ss-modal-footer { padding: 14px 22px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; gap: 10px; justify-content: flex-end; }
  .ss-field-label  { font-size: 0.77rem; font-weight: 600; color: #94A3B8; margin-bottom: 6px; display: block; }

  @keyframes ssFadeIn { from { opacity: 0; transform: scale(0.97) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .ss-modal { animation: ssFadeIn 0.2s ease; }
  .ss-confirm-box { animation: ssFadeIn 0.18s ease; }
`

/* ─────────────────────────────────────────────────────────── */
/* Toggle Component                                            */
/* ─────────────────────────────────────────────────────────── */

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={`toggle-track${on ? ' on' : ''}`} onClick={() => onChange(!on)}
      role="switch" aria-checked={on} tabIndex={0}
      onKeyDown={e => e.key === ' ' && onChange(!on)}>
      <div className="toggle-thumb" />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* Email Tag Input                                             */
/* ─────────────────────────────────────────────────────────── */

function EmailTagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [val, setVal] = useState('')
  const addTag = () => {
    const t = val.trim()
    if (t && !tags.includes(t)) onChange([...tags, t])
    setVal('')
  }
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
    if (e.key === 'Backspace' && !val && tags.length) onChange(tags.slice(0, -1))
  }
  return (
    <div className="ss-tag-input-wrap" onClick={() => document.getElementById('tag-input')?.focus()}>
      {tags.map(t => (
        <span key={t} className="ss-tag">
          {t}
          <button className="ss-tag-x" onClick={e => { e.stopPropagation(); onChange(tags.filter(x => x !== t)) }} aria-label={`Remove ${t}`}>×</button>
        </span>
      ))}
      <input id="tag-input" className="ss-tag-text-input" placeholder="Add email, press Enter" value={val}
        onChange={e => setVal(e.target.value)} onKeyDown={handleKey} onBlur={addTag} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* Notifications Tab                                           */
/* ─────────────────────────────────────────────────────────── */

function NotificationsTab() {
  const [divEmails, setDivEmails] = useState<Record<string, string[]>>(INIT_DIV_EMAILS)
  const [divChannels, setDivChannels] = useState<Record<string, string>>(INIT_DIV_CHANNELS)
  const [globalWebhook] = useState('https://hooks.slack.com/services/T0ABC/B0DEF/••••••••xyz')
  const [digestOn, setDigestOn] = useState(true)
  const [digestTime, setDigestTime] = useState('08:00')
  const [digestRecipients, setDigestRecipients] = useState(['arifur@sociofitechnology.com', 'kamrul@sociofitechnology.com'])
  const [editingDivEmail, setEditingDivEmail] = useState<string | null>(null)
  const [testStates, setTestStates] = useState<Record<string, string>>({})

  const [events, setEvents] = useState({
    new_lead:     { on: true,  via: 'Both'  },
    lead_changed: { on: true,  via: 'Email' },
    ticket_new:   { on: true,  via: 'Slack' },
    sla_warn:     { on: true,  via: 'Both'  },
    sla_breach:   { on: true,  via: 'Both'  },
    agent_failed: { on: true,  via: 'Both'  },
    agent_pending:{ on: true,  via: 'Both'  },
    venture_app:  { on: true,  via: 'Email' },
  })

  const EVENT_LABELS: Record<string, string> = {
    new_lead: 'New lead received', lead_changed: 'Lead status changed',
    ticket_new: 'Ticket created', sla_warn: 'SLA warning (2h to breach)',
    sla_breach: 'SLA breach', agent_failed: 'Agent run failed',
    agent_pending: 'Agent output pending approval', venture_app: 'New venture application',
  }

  const testSlack = async (div: string) => {
    setTestStates(s => ({ ...s, [div]: 'sending' }))
    await new Promise(r => setTimeout(r, 1500))
    setTestStates(s => ({ ...s, [div]: 'sent' }))
    setTimeout(() => setTestStates(s => { const n = { ...s }; delete n[div]; return n }), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Division Email Recipients */}
      <div className="ss-card">
        <div className="ss-card-header">
          <div>
            <div className="ss-card-title">Division Email Recipients</div>
            <div className="ss-card-sub">Per-division notification recipients</div>
          </div>
        </div>
        <table className="ss-table">
          <thead><tr><th>Division</th><th>Recipients</th><th style={{ width: 80 }}>Edit</th></tr></thead>
          <tbody>
            {DIVISION_LIST.map(d => (
              <tr key={d}>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '3px 10px', borderRadius: 100, background: `${DIVISION_COLORS[d]}15`, border: `1px solid ${DIVISION_COLORS[d]}30`, color: DIVISION_COLORS[d], fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: DIVISION_COLORS[d], display: 'inline-block' }} />
                    {d}
                  </span>
                </td>
                <td>
                  {editingDivEmail === d ? (
                    <EmailTagInput tags={divEmails[d]} onChange={t => setDivEmails(s => ({ ...s, [d]: t }))} />
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {divEmails[d].map(e => (
                        <span key={e} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '2px 8px', fontSize: '0.75rem', color: '#94A3B8' }}>{e}</span>
                      ))}
                    </div>
                  )}
                </td>
                <td>
                  <button className="ss-btn" onClick={() => setEditingDivEmail(editingDivEmail === d ? null : d)}>
                    {editingDivEmail === d ? 'Done' : 'Edit'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slack Channels */}
      <div className="ss-card">
        <div className="ss-card-header">
          <div><div className="ss-card-title">Slack Channels</div></div>
        </div>
        <div className="ss-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div className="ss-section-label">Global Webhook</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input className="ss-input" style={{ flex: 1 }} type="text" value={globalWebhook} readOnly />
            </div>
          </div>
          <div>
            <div className="ss-section-label">Per-Division Channels</div>
            <table className="ss-table">
              <thead><tr><th>Division</th><th>Channel</th><th style={{ width: 120 }}>Test</th></tr></thead>
              <tbody>
                {DIVISION_LIST.map(d => (
                  <tr key={d}>
                    <td style={{ textTransform: 'capitalize', color: DIVISION_COLORS[d] }}>{d}</td>
                    <td>
                      <input className="ss-input" value={divChannels[d]} style={{ width: 180 }}
                        onChange={e => setDivChannels(s => ({ ...s, [d]: e.target.value }))} />
                    </td>
                    <td>
                      <button className={testStates[d] === 'sent' ? 'ss-btn-success' : 'ss-btn'}
                        onClick={() => testSlack(d)} disabled={testStates[d] === 'sending'}>
                        {testStates[d] === 'sending' ? 'Sending...' : testStates[d] === 'sent' ? '✓ Delivered' : 'Test'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Daily Digest */}
      <div className="ss-card">
        <div className="ss-card-header">
          <div><div className="ss-card-title">Daily Digest</div></div>
          <Toggle on={digestOn} onChange={setDigestOn} />
        </div>
        {digestOn && (
          <div className="ss-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 auto' }}>
                <div className="ss-section-label">Send Time</div>
                <input className="ss-input" type="time" value={digestTime} onChange={e => setDigestTime(e.target.value)} />
                <span style={{ fontSize: '0.73rem', color: '#64748B', marginLeft: 6 }}>UTC</span>
              </div>
            </div>
            <div>
              <div className="ss-section-label">Recipients</div>
              <EmailTagInput tags={digestRecipients} onChange={setDigestRecipients} />
            </div>
          </div>
        )}
      </div>

      {/* Event Toggles */}
      <div className="ss-card">
        <div className="ss-card-header">
          <div><div className="ss-card-title">Event Notifications</div></div>
        </div>
        <div className="ss-card-body">
          <div className="ss-grid-2" style={{ gap: 12 }}>
            {(Object.keys(events) as (keyof typeof events)[]).map(key => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#0d1121', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Toggle on={events[key].on} onChange={v => setEvents(s => ({ ...s, [key]: { ...s[key], on: v } }))} />
                  <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{EVENT_LABELS[key]}</span>
                </div>
                <select className="ss-select" style={{ width: 80, fontSize: '0.75rem', padding: '4px 8px' }}
                  value={events[key].via}
                  onChange={e => setEvents(s => ({ ...s, [key]: { ...s[key], via: e.target.value } }))}>
                  <option>Email</option>
                  <option>Slack</option>
                  <option>Both</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* Integrations Tab                                            */
/* ─────────────────────────────────────────────────────────── */

function IntegrationsTab() {
  const [nexusHealth, setNexusHealth] = useState<{ checked: string; ms: number; version: string } | null>(null)
  const [nexusChecking, setNexusChecking] = useState(false)
  const [nexusUrl, setNexusUrl] = useState('https://nexus.sociofitechnology.com')
  const [stripeTest, setStripeTest] = useState(true)

  const checkNexusHealth = async () => {
    setNexusChecking(true)
    await new Promise(r => setTimeout(r, 1500))
    setNexusChecking(false)
    setNexusHealth({ checked: new Date().toISOString(), ms: 12, version: 'v2.1.4' })
  }

  const integrations = [
    {
      key: 'supabase', name: 'Supabase', letter: 'SB', letterBg: '#3ECF8E', letterColor: '#fff',
      status: 'connected' as const, detail: 'https://fvqnbkupkzxxxxxxxxxxx.supabase.co',
      actions: (
        <button className="ss-btn">Test Connection</button>
      ),
    },
    {
      key: 'stripe', name: 'Stripe', letter: 'St', letterBg: '#635BFF', letterColor: '#fff',
      status: 'connected' as const, detail: 'Webhook: https://sociofitechnology.com/api/stripe/webhook',
      actions: (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Test Mode</span>
            <Toggle on={stripeTest} onChange={setStripeTest} />
          </div>
          <button className="ss-btn">Test Webhook</button>
        </div>
      ),
    },
    {
      key: 'resend', name: 'Resend', letter: 'Re', letterBg: '#000', letterColor: '#fff',
      status: 'connected' as const, detail: 'API Key: ••••••••••••••••••••••••1a2b',
      actions: <button className="ss-btn">Rotate Key</button>,
    },
    {
      key: 'slack', name: 'Slack', letter: 'Sl', letterBg: '#4A154B', letterColor: '#fff',
      status: 'connected' as const, detail: 'Workspace: SocioFi Technology',
      actions: <button className="ss-btn">Reconnect</button>,
    },
    {
      key: 'nexus', name: 'NEXUS Agent Server', letter: 'NX', letterBg: '#E8B84D22', letterColor: '#E8B84D',
      status: nexusHealth ? 'connected' as const : 'connected' as const,
      detail: nexusHealth ? `${nexusHealth.version} — ${nexusHealth.ms}ms · checked ${rel(nexusHealth.checked)}` : 'Last checked: never',
      actions: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input className="ss-input ss-input-full" value={nexusUrl} onChange={e => setNexusUrl(e.target.value)} />
          <button className="ss-btn" onClick={checkNexusHealth} disabled={nexusChecking}>
            {nexusChecking ? 'Checking...' : 'Check Health'}
          </button>
        </div>
      ),
    },
    {
      key: 'github', name: 'GitHub', letter: 'GH', letterBg: '#161B22', letterColor: '#E2E8F0',
      status: 'disconnected' as 'disconnected', detail: 'Not configured',
      actions: (
        <button className="ss-btn-primary" style={{ fontSize: '0.78rem', padding: '7px 14px' }}>
          Connect GitHub
        </button>
      ),
    },
  ]

  return (
    <div className="ss-grid-2" style={{ gap: 16 }}>
      {integrations.map(int => (
        <div key={int.key} className="ss-int-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="ss-int-icon" style={{ background: int.letterBg, color: int.letterColor, border: `1px solid ${int.letterBg}80` }}>
              {int.letter}
            </div>
            <div style={{ flex: 1 }}>
              <div className="ss-int-name">{int.name}</div>
              <div style={{ marginTop: 5 }}>
                {int.status === 'connected'
                  ? <span className="ss-status-connected"><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />Connected</span>
                  : <span className="ss-status-disconnected">Not connected</span>
                }
              </div>
            </div>
          </div>
          <div className="ss-int-detail">{int.detail}</div>
          {int.actions}
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* NEXUS Config Tab                                            */
/* ─────────────────────────────────────────────────────────── */

function NEXUSTab() {
  const [masterOn, setMasterOn] = useState(true)
  const [approvalMode, setApprovalMode] = useState<ApprovalMode>('semi-auto')
  const [threshold, setThreshold] = useState(92)
  const [apiKeyMasked] = useState('••••••••••••••••••••sk-ant-1234')
  const [modelDefault, setModelDefault] = useState('claude-sonnet-4-5')
  const [modelComplex, setModelComplex] = useState('claude-opus-4-20250514')
  const [maxCalls, setMaxCalls] = useState(500)
  const [agents, setAgents] = useState<AgentOverride[]>(INIT_AGENT_OVERRIDES)

  const updateAgent = (idx: number, patch: Partial<AgentOverride>) =>
    setAgents(prev => prev.map((a, i) => i === idx ? { ...a, ...patch } : a))

  const approvalOptions: { value: ApprovalMode; label: string; desc: string }[] = [
    { value: 'manual',    label: 'Manual',    desc: 'All outputs require human approval (strict, slowest)' },
    { value: 'semi-auto', label: 'Semi-Auto', desc: 'Approve only flagged/low-confidence outputs (recommended)' },
    { value: 'auto',      label: 'Auto',      desc: 'Run without approval (use with caution)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Master control */}
      <div className={`ss-nexus-master${masterOn ? '' : ' off'}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: '#E2E8F0' }}>NEXUS Agent System</span>
            <span className="ss-nexus-status-badge" style={{ background: masterOn ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${masterOn ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'}`, color: masterOn ? '#4ade80' : '#EF4444' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: masterOn ? '#4ade80' : '#EF4444', display: 'inline-block' }} />
              {masterOn ? 'ACTIVE' : 'PAUSED'}
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', color: masterOn ? '#64748B' : '#EF4444' }}>
            {masterOn ? 'All 16 agents are operational' : 'All agent runs are paused'}
          </div>
        </div>
        <Toggle on={masterOn} onChange={setMasterOn} />
      </div>
      {!masterOn && (
        <div className="ss-nexus-warning">
          All scheduled agent runs are PAUSED. Manual triggers are disabled.
        </div>
      )}

      {/* Default Settings */}
      <div className="ss-card">
        <div className="ss-card-header"><div className="ss-card-title">Default Settings</div></div>
        <div className="ss-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Approval mode */}
          <div>
            <div className="ss-section-label">Approval Mode</div>
            <div className="ss-radio-cards">
              {approvalOptions.map(opt => (
                <div key={opt.value} className={`ss-radio-card${approvalMode === opt.value ? ' selected' : ''}`}
                  onClick={() => setApprovalMode(opt.value)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${approvalMode === opt.value ? '#59A392' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {approvalMode === opt.value && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#59A392' }} />}
                    </div>
                    <div className="ss-radio-label">{opt.label}</div>
                  </div>
                  <div className="ss-radio-detail">{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Threshold slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="ss-section-label" style={{ marginBottom: 0 }}>Auto-Approve Threshold</div>
              <span className="ss-slider-value">≥{threshold}% confidence</span>
            </div>
            <input type="range" min={70} max={100} value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="ss-slider" />
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 6 }}>Outputs scoring below this are sent to the approval queue</div>
          </div>

          {/* Claude API Settings */}
          <div>
            <div className="ss-section-label">Claude API Settings</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="ss-field-label" style={{ fontSize: '0.77rem', fontWeight: 600, color: '#94A3B8', marginBottom: 6, display: 'block' }}>API Key</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="ss-input" style={{ flex: 1 }} value={apiKeyMasked} readOnly type="password" />
                  <button className="ss-btn">Update Key</button>
                </div>
              </div>
              <div>
                <label className="ss-field-label" style={{ fontSize: '0.77rem', fontWeight: 600, color: '#94A3B8', marginBottom: 6, display: 'block' }}>Max API Calls / Hour</label>
                <input className="ss-input ss-input-full" type="number" value={maxCalls} onChange={e => setMaxCalls(Number(e.target.value))} />
              </div>
              <div>
                <label className="ss-field-label" style={{ fontSize: '0.77rem', fontWeight: 600, color: '#94A3B8', marginBottom: 6, display: 'block' }}>Default Tasks Model</label>
                <select className="ss-select" style={{ width: '100%' }} value={modelDefault} onChange={e => setModelDefault(e.target.value)}>
                  <option value="claude-sonnet-4-5">claude-sonnet-4-5</option>
                  <option value="claude-sonnet-4-20250514">claude-sonnet-4-20250514</option>
                </select>
              </div>
              <div>
                <label className="ss-field-label" style={{ fontSize: '0.77rem', fontWeight: 600, color: '#94A3B8', marginBottom: 6, display: 'block' }}>Complex Tasks Model</label>
                <select className="ss-select" style={{ width: '100%' }} value={modelComplex} onChange={e => setModelComplex(e.target.value)}>
                  <option value="claude-opus-4-20250514">claude-opus-4-20250514</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Agent Overrides */}
      <div className="ss-card">
        <div className="ss-card-header">
          <div>
            <div className="ss-card-title">Per-Agent Overrides</div>
            <div className="ss-card-sub">Customize behavior for individual agents</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="ss-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Enabled</th>
                <th>Schedule</th>
                <th>Approval Mode</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, idx) => (
                <tr key={agent.name}>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 100, background: `${agent.color}18`, border: `1px solid ${agent.color}30`, color: agent.color, fontSize: '0.75rem', fontWeight: 700, fontFamily: "'Fira Code', monospace" }}>
                      {agent.name}
                    </span>
                  </td>
                  <td>
                    <Toggle on={agent.enabled} onChange={v => updateAgent(idx, { enabled: v })} />
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap' }}>{agent.schedule}</td>
                  <td>
                    <select className="ss-select" style={{ fontSize: '0.78rem', padding: '5px 9px', width: 'auto' }}
                      value={agent.approval}
                      onChange={e => updateAgent(idx, { approval: e.target.value as AgentOverride['approval'], lastModified: new Date().toISOString() })}>
                      <option value="inherit">Inherit</option>
                      <option value="manual">Manual</option>
                      <option value="semi-auto">Semi-Auto</option>
                      <option value="auto">Auto</option>
                    </select>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap' }}>{rel(agent.lastModified)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* Data Tab                                                    */
/* ─────────────────────────────────────────────────────────── */

function DataTab() {
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>(MOCK_DELETION_REQUESTS)
  const [confirmDelete, setConfirmDelete] = useState<{ email: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleted, setDeleted] = useState<Set<string>>(new Set())
  const [manualEmail, setManualEmail] = useState('')
  const [manualConfirm, setManualConfirm] = useState<string | null>(null)
  const [exportDiv, setExportDiv] = useState('all')
  const [exportStatus, setExportStatus] = useState('all')
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json')
  const [backupState, setBackupState] = useState<'idle' | 'queued'>('idle')

  const handleDelete = async (email: string) => {
    setDeleting(true)
    await new Promise(r => setTimeout(r, 1500))
    setDeleting(false)
    setDeleted(prev => new Set([...prev, email]))
    setDeletionRequests(prev => prev.map(r => r.email === email ? { ...r, status: 'processed' as const } : r))
    setConfirmDelete(null)
    setManualConfirm(null)
  }

  const triggerBackup = async () => {
    setBackupState('queued')
  }

  const mockContacts = [
    { name: 'Alice Smith', email: 'alice@example.com', division: 'studio', stage: 'lead' },
    { name: 'Bob Jones',   email: 'bob@example.com',   division: 'services', stage: 'client' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Export Tools */}
      <div className="ss-card">
        <div className="ss-card-header">
          <div><div className="ss-card-title">Export Tools</div></div>
        </div>
        <div className="ss-card-body">
          <div className="ss-grid-2" style={{ gap: 14 }}>
            {/* Export Contacts */}
            <div className="ss-export-card">
              <div>
                <div className="ss-export-title">Export Contacts</div>
                <div className="ss-export-desc">All contacts with full field data exported as CSV</div>
              </div>
              <button className="ss-btn-primary" onClick={() => downloadCSV('contacts.csv', mockContacts)}>
                Export Contacts
              </button>
            </div>

            {/* Export Submissions */}
            <div className="ss-export-card">
              <div>
                <div className="ss-export-title">Export Submissions</div>
                <div className="ss-export-desc">Filter by division, date range, and status</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <select className="ss-select ss-input-full" value={exportDiv} onChange={e => setExportDiv(e.target.value)}>
                  <option value="all">All Divisions</option>
                  {DIVISION_LIST.map(d => <option key={d} value={d} style={{ textTransform: 'capitalize' }}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
                <select className="ss-select ss-input-full" value={exportStatus} onChange={e => setExportStatus(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
                <button className="ss-btn-primary" onClick={() => downloadCSV('submissions.csv', [{ division: exportDiv, status: exportStatus }])}>
                  Export Submissions
                </button>
              </div>
            </div>

            {/* Export Content */}
            <div className="ss-export-card">
              <div>
                <div className="ss-export-title">Export Content</div>
                <div className="ss-export-desc">Full CMS backup as JSON or titles/slugs as CSV</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select className="ss-select" style={{ flex: 1 }} value={exportFormat} onChange={e => setExportFormat(e.target.value as 'json' | 'csv')}>
                  <option value="json">JSON (full backup)</option>
                  <option value="csv">CSV (titles/slugs only)</option>
                </select>
                <button className="ss-btn-primary" onClick={() => downloadCSV('content.csv', [{ format: exportFormat }])}>
                  Export
                </button>
              </div>
            </div>

            {/* Database Backup */}
            <div className="ss-export-card">
              <div>
                <div className="ss-export-title">Database Backup</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.78rem', color: '#94A3B8' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                    Last backup: 2 hours ago
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Schedule: Daily at 02:00 UTC · Retention: 30 days</div>
                </div>
              </div>
              <button className={backupState === 'queued' ? 'ss-btn-success' : 'ss-btn-primary'}
                onClick={triggerBackup} disabled={backupState === 'queued'}>
                {backupState === 'queued' ? '✓ Backup queued' : 'Trigger Backup Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GDPR */}
      <div className="ss-card">
        <div className="ss-card-header">
          <div><div className="ss-card-title">Data Privacy & GDPR</div></div>
        </div>
        <div className="ss-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Deletion queue */}
          <div>
            <div className="ss-section-label">Deletion Request Queue</div>
            <table className="ss-table">
              <thead><tr><th>Requester Email</th><th>Received</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {deletionRequests.map(req => (
                  <tr key={req.email}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{req.email}</td>
                    <td>{rel(req.received)}</td>
                    <td>
                      {req.status === 'pending'
                        ? <span style={{ background: 'rgba(232,184,77,0.1)', border: '1px solid rgba(232,184,77,0.25)', color: '#E8B84D', padding: '2px 9px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600 }}>Pending</span>
                        : <span style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80', padding: '2px 9px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600 }}>Processed</span>
                      }
                    </td>
                    <td>
                      {req.status === 'pending'
                        ? <button className="ss-btn-danger" onClick={() => setConfirmDelete({ email: req.email })}>Process Deletion</button>
                        : <button className="ss-btn">View Record</button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Manual deletion */}
          <div>
            <div className="ss-section-label">Manual Deletion</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input className="ss-input" style={{ flex: 1 }} type="email" placeholder="Enter email address to delete"
                value={manualEmail} onChange={e => setManualEmail(e.target.value)} />
              <button className="ss-btn-danger" onClick={() => manualEmail && setManualConfirm(manualEmail)} disabled={!manualEmail}>
                Find & Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deletion Confirm Dialog */}
      {(confirmDelete || manualConfirm) && (
        <div className="ss-confirm-overlay" onClick={e => { if (e.target === e.currentTarget) { setConfirmDelete(null); setManualConfirm(null) } }}>
          <div className="ss-confirm-box">
            <div className="ss-confirm-title">Confirm Deletion</div>
            <div className="ss-confirm-text">
              This will permanently delete all data associated with{' '}
              <strong style={{ color: '#E2E8F0' }}>{confirmDelete?.email ?? manualConfirm}</strong>.
              This cannot be undone.
            </div>
            <div className="ss-confirm-actions">
              <button className="ss-btn" onClick={() => { setConfirmDelete(null); setManualConfirm(null) }}>Cancel</button>
              <button className="ss-btn-danger" disabled={deleting}
                onClick={() => handleDelete((confirmDelete?.email ?? manualConfirm) as string)}>
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* Billing Tab                                                 */
/* ─────────────────────────────────────────────────────────── */

function BillingTab() {
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)
  const [invClient, setInvClient] = useState('')
  const [invDesc, setInvDesc] = useState('')
  const [invAmount, setInvAmount] = useState('')
  const [invDue, setInvDue] = useState('')
  const [creating, setCreating] = useState(false)
  const [createSuccess, setCreateSuccess] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES)

  const handleCreate = async () => {
    setCreating(true)
    await new Promise(r => setTimeout(r, 1500))
    const newInv: Invoice = {
      id: `INV-24${String(invoices.length + 1).padStart(2, '0')}`,
      client: invClient, amount: Number(invAmount),
      date: new Date().toISOString().slice(0, 10), status: 'pending',
    }
    setInvoices(prev => [newInv, ...prev])
    setCreating(false)
    setCreateSuccess(true)
    setTimeout(() => { setShowCreateInvoice(false); setCreateSuccess(false); setInvClient(''); setInvDesc(''); setInvAmount(''); setInvDue('') }, 1800)
  }

  const INV_STATUS_COLORS = { paid: '#4ade80', pending: '#E8B84D', overdue: '#EF4444' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Revenue Summary */}
      <div className="ss-grid-3">
        <div className="ss-rev-card">
          <div className="ss-rev-label">Monthly Recurring Revenue</div>
          <div className="ss-rev-value">{fmt(96400)}</div>
          <div style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: 4 }}>+8.4% vs last month</div>
        </div>
        <div className="ss-rev-card">
          <div className="ss-rev-label">YTD Revenue</div>
          <div className="ss-rev-value">{fmt(276800)}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 4 }}>Q1 2026</div>
        </div>
        <div className="ss-rev-card">
          <div className="ss-rev-label">Annual Run Rate</div>
          <div className="ss-rev-value">{fmt(1156800)}</div>
          <div style={{ fontSize: '0.75rem', color: '#6BA3E8', marginTop: 4 }}>Based on current MRR</div>
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="ss-card">
        <div className="ss-card-header">
          <div><div className="ss-card-title">Active Subscriptions</div><div className="ss-card-sub">Services + Agents + Cloud</div></div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="ss-table">
            <thead><tr><th>Client</th><th>Plan</th><th>Service</th><th>MRR</th><th>Status</th><th>Next Invoice</th><th>Actions</th></tr></thead>
            <tbody>
              {MOCK_SUBS.map((s, i) => (
                <tr key={i}>
                  <td style={{ color: '#E2E8F0', fontWeight: 600 }}>{s.client}</td>
                  <td>
                    <span style={{ background: `${PLAN_COLORS[s.plan.toLowerCase()] ?? '#64748B'}18`, border: `1px solid ${PLAN_COLORS[s.plan.toLowerCase()] ?? '#64748B'}30`, color: PLAN_COLORS[s.plan.toLowerCase()] ?? '#64748B', padding: '2px 9px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600 }}>
                      {s.plan}
                    </span>
                  </td>
                  <td>{s.service}</td>
                  <td style={{ color: '#4ade80', fontWeight: 600 }}>{fmt(s.mrr)}</td>
                  <td><span className="ss-status-connected"><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />Active</span></td>
                  <td style={{ fontSize: '0.78rem', color: '#64748B' }}>{s.next}</td>
                  <td><button className="ss-btn">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice History */}
      <div className="ss-card">
        <div className="ss-card-header">
          <div><div className="ss-card-title">Invoice History</div></div>
          <button className="ss-btn-primary" onClick={() => setShowCreateInvoice(true)}>Create Invoice</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="ss-table">
            <thead><tr><th>Invoice #</th><th>Client</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontFamily: 'monospace', color: '#94A3B8' }}>{inv.id}</td>
                  <td style={{ color: '#E2E8F0' }}>{inv.client}</td>
                  <td style={{ color: '#E2E8F0', fontWeight: 600 }}>{fmt(inv.amount)}</td>
                  <td style={{ fontSize: '0.78rem', color: '#64748B' }}>{inv.date}</td>
                  <td>
                    <span style={{ background: `${INV_STATUS_COLORS[inv.status]}18`, border: `1px solid ${INV_STATUS_COLORS[inv.status]}30`, color: INV_STATUS_COLORS[inv.status], padding: '2px 9px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize' }}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="ss-btn">View</button>
                      {inv.status === 'pending' && <button className="ss-btn-primary" style={{ fontSize: '0.75rem', padding: '5px 10px' }}>Send</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stripe info */}
      <div className="ss-info-box">
        Actual invoice generation and payment collection handled via Stripe. This tool creates draft invoices for internal tracking.
      </div>

      {/* Create Invoice Modal */}
      {showCreateInvoice && (
        <div className="ss-modal-overlay" onClick={e => e.target === e.currentTarget && !creating && setShowCreateInvoice(false)}>
          <div className="ss-modal">
            <div className="ss-modal-header">
              <span className="ss-modal-title">Create Invoice</span>
              <button className="ss-modal-close" onClick={() => setShowCreateInvoice(false)} aria-label="Close">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            {createSuccess ? (
              <div style={{ padding: '36px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ color: '#E2E8F0', fontWeight: 600 }}>Invoice created successfully</div>
              </div>
            ) : (
              <>
                <div className="ss-modal-body">
                  <div>
                    <label className="ss-field-label">Client</label>
                    <select className="ss-select ss-input-full" value={invClient} onChange={e => setInvClient(e.target.value)}>
                      <option value="">Select client...</option>
                      {MOCK_SUBS.map(s => <option key={s.client} value={s.client}>{s.client}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="ss-field-label">Description</label>
                    <textarea className="ss-input ss-input-full" rows={3} placeholder="Invoice description" value={invDesc}
                      onChange={e => setInvDesc(e.target.value)}
                      style={{ resize: 'vertical', fontFamily: "'Outfit', sans-serif", padding: '8px 12px', background: '#0a0e1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#E2E8F0', fontSize: '0.83rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label className="ss-field-label">Amount ($)</label>
                      <input className="ss-input ss-input-full" type="number" placeholder="0.00" value={invAmount} onChange={e => setInvAmount(e.target.value)} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="ss-field-label">Due Date</label>
                      <input className="ss-input ss-input-full" type="date" value={invDue} onChange={e => setInvDue(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="ss-modal-footer">
                  <button className="ss-btn" onClick={() => setShowCreateInvoice(false)}>Cancel</button>
                  <button className="ss-btn-primary" onClick={handleCreate} disabled={creating || !invClient || !invAmount}>
                    {creating ? 'Creating...' : 'Create Invoice'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* Main Page                                                   */
/* ─────────────────────────────────────────────────────────── */

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('notifications')

  const tabs: { key: SettingsTab; label: string }[] = [
    { key: 'notifications', label: 'Notifications' },
    { key: 'integrations',  label: 'Integrations'  },
    { key: 'nexus',         label: 'NEXUS Config'  },
    { key: 'data',          label: 'Data'          },
    { key: 'billing',       label: 'Billing'       },
  ]

  return (
    <>
      <style>{STYLES}</style>
      <div className="ss-root">
        {/* Header */}
        <div>
          <div className="ss-title">System Settings</div>
          <div className="ss-sub">Notifications, integrations, agent config, data, and billing</div>
        </div>

        {/* Tabs */}
        <div className="ss-tabs">
          {tabs.map(t => (
            <button key={t.key} className={`ss-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'notifications' && <NotificationsTab />}
        {tab === 'integrations'  && <IntegrationsTab />}
        {tab === 'nexus'         && <NEXUSTab />}
        {tab === 'data'          && <DataTab />}
        {tab === 'billing'       && <BillingTab />}
      </div>
    </>
  )
}
