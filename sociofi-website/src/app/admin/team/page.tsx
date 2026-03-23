'use client'

import React, { useState } from 'react'

/* ─────────────────────────────────────────────────────────── */
/* Types (inline — do NOT import from types.ts)               */
/* ─────────────────────────────────────────────────────────── */

type TeamRole = 'super_admin' | 'division_lead' | 'editor' | 'viewer'

interface TeamMember {
  id: string
  name: string
  email: string
  role: TeamRole
  divisions: string[]
  last_active_at: string
  status: 'active' | 'inactive'
  initials: string
  avatar_color: string
  joined_at: string
}

const ROLE_LABELS: Record<TeamRole, string> = {
  super_admin:   'Super Admin',
  division_lead: 'Division Lead',
  editor:        'Editor',
  viewer:        'Viewer',
}

const ROLE_COLORS: Record<TeamRole, string> = {
  super_admin:   '#EF4444',
  division_lead: '#E8B84D',
  editor:        '#6BA3E8',
  viewer:        '#64748B',
}

const DIVISION_LIST = ['studio', 'services', 'labs', 'products', 'academy', 'ventures', 'cloud']

const DIVISION_COLORS: Record<string, string> = {
  studio: '#72C4B2', services: '#4DBFA8', labs: '#7B6FE8',
  products: '#E8916F', academy: '#E8B84D', ventures: '#6BA3E8', cloud: '#5BB5E0',
}

/* ─────────────────────────────────────────────────────────── */
/* Mock Data                                                   */
/* ─────────────────────────────────────────────────────────── */

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm1', name: 'Arifur Rahman', email: 'arifur@sociofi.io', role: 'super_admin',
    divisions: ['studio', 'services', 'labs', 'products', 'academy', 'ventures', 'cloud'],
    last_active_at: new Date(Date.now() - 5 * 60000).toISOString(),
    status: 'active', initials: 'AR', avatar_color: '#3A589E',
    joined_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'tm2', name: 'Kamrul Hasan', email: 'kamrul@sociofi.io', role: 'super_admin',
    divisions: ['studio', 'services', 'labs', 'products', 'academy', 'ventures', 'cloud'],
    last_active_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    status: 'active', initials: 'KH', avatar_color: '#59A392',
    joined_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'tm3', name: 'Nadia Islam', email: 'nadia@sociofi.io', role: 'division_lead',
    divisions: ['studio', 'academy'],
    last_active_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'active', initials: 'NI', avatar_color: '#72C4B2',
    joined_at: '2024-03-01T00:00:00Z',
  },
  {
    id: 'tm4', name: 'Rafi Hossain', email: 'rafi@sociofi.io', role: 'division_lead',
    divisions: ['services', 'cloud'],
    last_active_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    status: 'active', initials: 'RH', avatar_color: '#5BB5E0',
    joined_at: '2024-03-15T00:00:00Z',
  },
  {
    id: 'tm5', name: 'Tania Begum', email: 'tania@sociofi.io', role: 'editor',
    divisions: ['studio'],
    last_active_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    status: 'active', initials: 'TB', avatar_color: '#E8916F',
    joined_at: '2024-05-10T00:00:00Z',
  },
  {
    id: 'tm6', name: 'Jahir Ahmed', email: 'jahir@sociofi.io', role: 'editor',
    divisions: ['academy', 'ventures'],
    last_active_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'active', initials: 'JA', avatar_color: '#6BA3E8',
    joined_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'tm7', name: 'Sara Mila', email: 'sara@sociofi.io', role: 'viewer',
    divisions: ['labs'],
    last_active_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: 'active', initials: 'SM', avatar_color: '#7B6FE8',
    joined_at: '2024-07-20T00:00:00Z',
  },
  {
    id: 'tm8', name: 'Omar Farouk', email: 'omar@sociofi.io', role: 'editor',
    divisions: ['services'],
    last_active_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    status: 'inactive', initials: 'OF', avatar_color: '#64748B',
    joined_at: '2024-04-05T00:00:00Z',
  },
]

/* ─────────────────────────────────────────────────────────── */
/* Permissions Matrix Data                                     */
/* ─────────────────────────────────────────────────────────── */

const PERMISSIONS_MATRIX: { action: string; super_admin: boolean; division_lead: boolean; editor: boolean; viewer: boolean }[] = [
  { action: 'View submissions',         super_admin: true,  division_lead: true,  editor: true,  viewer: true  },
  { action: 'Edit submissions',         super_admin: true,  division_lead: true,  editor: true,  viewer: false },
  { action: 'Delete submissions',       super_admin: true,  division_lead: false, editor: false, viewer: false },
  { action: 'Assign submissions',       super_admin: true,  division_lead: true,  editor: false, viewer: false },
  { action: 'View contacts',            super_admin: true,  division_lead: true,  editor: true,  viewer: true  },
  { action: 'Edit contacts',            super_admin: true,  division_lead: true,  editor: true,  viewer: false },
  { action: 'Manage pipeline',          super_admin: true,  division_lead: true,  editor: false, viewer: false },
  { action: 'Create content',           super_admin: true,  division_lead: true,  editor: true,  viewer: false },
  { action: 'Publish content',          super_admin: true,  division_lead: true,  editor: false, viewer: false },
  { action: 'Delete content',           super_admin: true,  division_lead: false, editor: false, viewer: false },
  { action: 'View analytics',           super_admin: true,  division_lead: true,  editor: true,  viewer: true  },
  { action: 'Export data',              super_admin: true,  division_lead: true,  editor: false, viewer: false },
  { action: 'Manage team',              super_admin: true,  division_lead: false, editor: false, viewer: false },
  { action: 'System settings',          super_admin: true,  division_lead: false, editor: false, viewer: false },
  { action: 'Manage agents',            super_admin: true,  division_lead: true,  editor: false, viewer: false },
  { action: 'Approve agent actions',    super_admin: true,  division_lead: true,  editor: true,  viewer: false },
  { action: 'Trigger manual runs',      super_admin: true,  division_lead: true,  editor: false, viewer: false },
  { action: 'Manage deployments',       super_admin: true,  division_lead: true,  editor: false, viewer: false },
  { action: 'View tickets',             super_admin: true,  division_lead: true,  editor: true,  viewer: true  },
  { action: 'Close tickets',            super_admin: true,  division_lead: true,  editor: false, viewer: false },
]

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

/* ─────────────────────────────────────────────────────────── */
/* Styles                                                      */
/* ─────────────────────────────────────────────────────────── */

const STYLES = `
  .tm-root { display: flex; flex-direction: column; gap: 24px; }

  /* Header */
  .tm-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .tm-title  { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #E2E8F0; letter-spacing: -0.02em; margin-bottom: 4px; }
  .tm-sub    { font-size: 13px; color: #64748B; }

  /* Tabs */
  .tm-tabs { display: flex; gap: 4px; background: #12162A; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 4px; width: fit-content; }
  .tm-tab  { padding: 7px 18px; border-radius: 7px; font-size: 0.82rem; font-weight: 600; font-family: 'Syne', sans-serif; cursor: pointer; border: none; background: transparent; color: #64748B; transition: all 0.18s; }
  .tm-tab.active { background: rgba(255,255,255,0.07); color: #E2E8F0; }
  .tm-tab:hover:not(.active) { color: #94A3B8; }

  /* Table */
  .tm-table-wrap { background: #12162A; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; }
  .tm-table      { width: 100%; border-collapse: collapse; }
  .tm-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.06); }
  .tm-table thead th { padding: 12px 16px; text-align: left; font-size: 0.7rem; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap; }
  .tm-table tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
  .tm-table tbody tr:last-child { border-bottom: none; }
  .tm-table tbody tr:hover { background: rgba(255,255,255,0.02); }
  .tm-table tbody td { padding: 13px 16px; font-size: 0.83rem; color: #94A3B8; vertical-align: middle; }

  /* Avatar */
  .tm-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; font-family: 'Syne', sans-serif; color: #fff; flex-shrink: 0; }
  .tm-member-name { font-size: 0.85rem; font-weight: 600; color: #E2E8F0; font-family: 'Syne', sans-serif; }
  .tm-member-email { font-size: 0.75rem; color: #64748B; margin-top: 2px; }

  /* Role badge */
  .tm-role-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 600; }

  /* Status badge */
  .tm-status-active   { display: inline-flex; align-items: center; gap: 5px; background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25); color: #4ade80; padding: 3px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 600; }
  .tm-status-inactive { display: inline-flex; align-items: center; gap: 5px; background: rgba(100,116,139,0.1); border: 1px solid rgba(100,116,139,0.25); color: #64748B; padding: 3px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 600; }

  /* Buttons */
  .tm-btn-edit       { padding: 5px 12px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #94A3B8; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .tm-btn-edit:hover { border-color: rgba(255,255,255,0.2); color: #E2E8F0; }
  .tm-btn-deact       { padding: 5px 12px; border-radius: 7px; border: 1px solid rgba(232,184,77,0.25); background: rgba(232,184,77,0.08); color: #E8B84D; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .tm-btn-deact:hover { background: rgba(232,184,77,0.15); }
  .tm-btn-react       { padding: 5px 12px; border-radius: 7px; border: 1px solid rgba(74,222,128,0.25); background: rgba(74,222,128,0.08); color: #4ade80; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .tm-btn-react:hover { background: rgba(74,222,128,0.15); }
  .tm-btn-invite      { display: flex; align-items: center; gap: 8px; padding: 9px 18px; border-radius: 9px; border: none; background: linear-gradient(135deg, #3A589E, #59A392); color: #fff; font-size: 0.83rem; font-weight: 700; font-family: 'Syne', sans-serif; cursor: pointer; transition: opacity 0.15s; white-space: nowrap; }
  .tm-btn-invite:hover { opacity: 0.88; }

  /* Permissions table */
  .tm-perm-wrap { background: #12162A; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; }
  .tm-perm-header { padding: 20px 24px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .tm-perm-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #E2E8F0; margin-bottom: 4px; }
  .tm-perm-sub   { font-size: 12px; color: #64748B; }
  .tm-perm-table { width: 100%; border-collapse: collapse; }
  .tm-perm-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.06); }
  .tm-perm-table thead th { padding: 11px 16px; text-align: center; font-size: 0.78rem; font-weight: 600; color: #E2E8F0; white-space: nowrap; }
  .tm-perm-table thead th:first-child { text-align: left; position: sticky; left: 0; background: #12162A; z-index: 2; }
  .tm-perm-table tbody td { padding: 11px 16px; text-align: center; font-size: 0.82rem; color: #94A3B8; vertical-align: middle; }
  .tm-perm-table tbody td:first-child { text-align: left; position: sticky; left: 0; background: inherit; z-index: 1; color: #94A3B8; font-size: 0.82rem; white-space: nowrap; }
  .tm-perm-even td:first-child { background: #12162A; }
  .tm-perm-odd  td:first-child { background: #0f1322; }
  .tm-perm-even { background: #12162A; }
  .tm-perm-odd  { background: #0f1322; }

  /* Modal overlay */
  .tm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
  .tm-modal   { background: #12162A; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; }
  .tm-modal-header { padding: 22px 24px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; }
  .tm-modal-title  { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #E2E8F0; }
  .tm-modal-close  { width: 28px; height: 28px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #64748B; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .tm-modal-close:hover { color: #E2E8F0; border-color: rgba(255,255,255,0.2); }
  .tm-modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 18px; }
  .tm-modal-footer { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; gap: 10px; justify-content: flex-end; }

  /* Form */
  .tm-field-label { font-size: 0.78rem; font-weight: 600; color: #94A3B8; margin-bottom: 6px; display: block; }
  .tm-input { width: 100%; padding: 9px 12px; background: #0a0e1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #E2E8F0; font-size: 0.85rem; font-family: 'Outfit', sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.15s; }
  .tm-input:focus { border-color: rgba(89,163,146,0.4); }
  .tm-select { width: 100%; padding: 9px 12px; background: #0a0e1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #E2E8F0; font-size: 0.85rem; font-family: 'Outfit', sans-serif; outline: none; cursor: pointer; appearance: none; box-sizing: border-box; }
  .tm-divisions-box { background: #0a0e1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; max-height: 170px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
  .tm-div-row { display: flex; align-items: center; gap: 9px; cursor: pointer; padding: 4px 2px; border-radius: 5px; }
  .tm-div-row:hover { background: rgba(255,255,255,0.03); }
  .tm-div-row input { accent-color: #59A392; cursor: pointer; width: 14px; height: 14px; }
  .tm-div-label { font-size: 0.82rem; color: #94A3B8; text-transform: capitalize; }
  .tm-div-actions { display: flex; gap: 8px; margin-bottom: 6px; }
  .tm-div-btn { padding: 3px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #64748B; font-size: 0.72rem; cursor: pointer; transition: all 0.15s; }
  .tm-div-btn:hover { color: #94A3B8; border-color: rgba(255,255,255,0.2); }

  /* Toggle */
  .tm-toggle-row { display: flex; align-items: center; gap: 12px; }
  .tm-toggle-label { font-size: 0.82rem; color: #94A3B8; }
  .tm-toggle-helper { font-size: 0.75rem; color: #64748B; margin-top: 4px; }
  .toggle-track { width: 40px; height: 22px; border-radius: 11px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
  .toggle-track.on { background: #4ade80; }
  .toggle-thumb { width: 16px; height: 16px; border-radius: 50%; background: white; position: absolute; top: 2px; left: 3px; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
  .toggle-track.on .toggle-thumb { transform: translateX(18px); }

  /* Modal action buttons */
  .tm-btn-cancel  { padding: 9px 18px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #94A3B8; font-size: 0.83rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .tm-btn-cancel:hover { color: #E2E8F0; border-color: rgba(255,255,255,0.2); }
  .tm-btn-primary { padding: 9px 18px; border-radius: 8px; border: none; background: linear-gradient(135deg, #3A589E, #59A392); color: #fff; font-size: 0.83rem; font-weight: 700; font-family: 'Syne', sans-serif; cursor: pointer; transition: opacity 0.15s; }
  .tm-btn-primary:hover { opacity: 0.88; }
  .tm-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .tm-btn-danger  { padding: 9px 18px; border-radius: 8px; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.08); color: #EF4444; font-size: 0.83rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .tm-btn-danger:hover { background: rgba(239,68,68,0.15); }

  /* Danger zone */
  .tm-danger-zone { border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 16px; background: rgba(239,68,68,0.04); }
  .tm-danger-title { font-size: 0.78rem; font-weight: 700; color: #EF4444; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
  .tm-danger-text  { font-size: 0.8rem; color: #94A3B8; margin-bottom: 12px; }

  /* Success state */
  .tm-success { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px 0; text-align: center; }
  .tm-success-icon { width: 52px; height: 52px; border-radius: 50%; background: rgba(74,222,128,0.12); border: 1px solid rgba(74,222,128,0.3); display: flex; align-items: center; justify-content: center; }
  .tm-success-msg  { font-size: 0.9rem; color: #94A3B8; }
  .tm-success-sub  { font-size: 0.8rem; color: #64748B; }

  @keyframes tmFadeIn { from { opacity: 0; transform: scale(0.97) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .tm-modal { animation: tmFadeIn 0.2s ease; }
`

/* ─────────────────────────────────────────────────────────── */
/* SVG Icons                                                   */
/* ─────────────────────────────────────────────────────────── */

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* Toggle Component                                            */
/* ─────────────────────────────────────────────────────────── */

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={`toggle-track${on ? ' on' : ''}`} onClick={() => onChange(!on)} role="switch" aria-checked={on} tabIndex={0}
      onKeyDown={e => e.key === ' ' && onChange(!on)}>
      <div className="toggle-thumb" />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* Division Dots                                               */
/* ─────────────────────────────────────────────────────────── */

function DivisionDots({ divisions }: { divisions: string[] }) {
  const max = 5
  const shown = divisions.slice(0, max)
  const rest = divisions.length - max
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {shown.map(d => (
        <span key={d} title={d.charAt(0).toUpperCase() + d.slice(1)}
          style={{ width: 8, height: 8, borderRadius: '50%', background: DIVISION_COLORS[d] || '#64748B', display: 'inline-block', flexShrink: 0 }} />
      ))}
      {rest > 0 && <span style={{ fontSize: '0.7rem', color: '#64748B', marginLeft: 2 }}>+{rest}</span>}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* Invite / Edit Member Modal                                  */
/* ─────────────────────────────────────────────────────────── */

interface MemberFormState {
  name: string
  email: string
  role: TeamRole
  divisions: string[]
  sendEmail: boolean
}

function MemberModal({
  mode,
  member,
  onClose,
  onSave,
}: {
  mode: 'invite' | 'edit'
  member?: TeamMember
  onClose: () => void
  onSave: (data: MemberFormState & { id?: string }) => void
}) {
  const [form, setForm] = useState<MemberFormState>({
    name:      member?.name  ?? '',
    email:     member?.email ?? '',
    role:      member?.role  ?? 'viewer',
    divisions: member?.divisions ?? [],
    sendEmail: true,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showDeactConfirm, setShowDeactConfirm] = useState(false)

  const toggleDiv = (d: string) =>
    setForm(f => ({ ...f, divisions: f.divisions.includes(d) ? f.divisions.filter(x => x !== d) : [...f.divisions, d] }))

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    if (mode === 'invite') {
      setSuccess(true)
      setTimeout(() => { onSave({ ...form, id: member?.id }); onClose() }, 2000)
    } else {
      onSave({ ...form, id: member?.id })
      onClose()
    }
  }

  const handleDeactivate = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    onSave({ ...form, id: member?.id })
    onClose()
  }

  return (
    <div className="tm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tm-modal">
        <div className="tm-modal-header">
          <span className="tm-modal-title">{mode === 'invite' ? 'Invite Team Member' : `Edit — ${member?.name}`}</span>
          <button className="tm-modal-close" onClick={onClose} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {success ? (
          <div className="tm-modal-body">
            <div className="tm-success">
              <div className="tm-success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="tm-success-msg">Invite sent to <strong style={{ color: '#E2E8F0' }}>{form.email}</strong>!</div>
              <div className="tm-success-sub">They'll get setup instructions shortly.</div>
            </div>
          </div>
        ) : (
          <>
            <div className="tm-modal-body">
              {/* Name */}
              <div>
                <label className="tm-field-label">Full Name</label>
                <input className="tm-input" type="text" placeholder="Full name" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>

              {/* Email */}
              <div>
                <label className="tm-field-label">Email Address</label>
                <input className="tm-input" type="email" placeholder="name@example.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>

              {/* Role */}
              <div>
                <label className="tm-field-label">Role</label>
                <div style={{ position: 'relative' }}>
                  <select className="tm-select" value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value as TeamRole }))}>
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="division_lead">Division Lead</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              {/* Divisions */}
              <div>
                <label className="tm-field-label">Divisions</label>
                <div className="tm-div-actions">
                  <button className="tm-div-btn" onClick={() => setForm(f => ({ ...f, divisions: [...DIVISION_LIST] }))}>Select All</button>
                  <button className="tm-div-btn" onClick={() => setForm(f => ({ ...f, divisions: [] }))}>Clear All</button>
                </div>
                <div className="tm-divisions-box">
                  {DIVISION_LIST.map(d => (
                    <label key={d} className="tm-div-row">
                      <input type="checkbox" checked={form.divisions.includes(d)} onChange={() => toggleDiv(d)} />
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: DIVISION_COLORS[d], display: 'inline-block', flexShrink: 0 }} />
                      <span className="tm-div-label">{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Send email toggle (invite only) */}
              {mode === 'invite' && (
                <div>
                  <div className="tm-toggle-row">
                    <Toggle on={form.sendEmail} onChange={v => setForm(f => ({ ...f, sendEmail: v }))} />
                    <span className="tm-toggle-label">Send invite email</span>
                  </div>
                  <div className="tm-toggle-helper">They'll receive an email with a temporary password and setup link</div>
                </div>
              )}

              {/* Danger zone (edit only) */}
              {mode === 'edit' && member && (
                <div className="tm-danger-zone">
                  <div className="tm-danger-title">Danger Zone</div>
                  {showDeactConfirm ? (
                    <>
                      <div className="tm-danger-text">This will prevent <strong style={{ color: '#E2E8F0' }}>{member.name}</strong> from logging in. Continue?</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="tm-btn-cancel" onClick={() => setShowDeactConfirm(false)}>Cancel</button>
                        <button className="tm-btn-danger" onClick={handleDeactivate} disabled={loading}>
                          {loading ? 'Deactivating...' : 'Confirm Deactivate'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <button className="tm-btn-danger" onClick={() => setShowDeactConfirm(true)}>
                      Deactivate Account
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="tm-modal-footer">
              <button className="tm-btn-cancel" onClick={onClose}>Cancel</button>
              <button className="tm-btn-primary" onClick={handleSubmit} disabled={loading || !form.name || !form.email}>
                {loading ? (mode === 'invite' ? 'Sending...' : 'Saving...') : (mode === 'invite' ? 'Send Invite' : 'Save Changes')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* Permissions Matrix Tab                                      */
/* ─────────────────────────────────────────────────────────── */

function PermissionsMatrix() {
  const roles: TeamRole[] = ['super_admin', 'division_lead', 'editor', 'viewer']
  return (
    <div className="tm-perm-wrap">
      <div className="tm-perm-header">
        <div className="tm-perm-title">Role Permissions</div>
        <div className="tm-perm-sub">What each role can do across the admin panel</div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="tm-perm-table">
          <thead>
            <tr>
              <th>Action</th>
              {roles.map(r => (
                <th key={r}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, background: `${ROLE_COLORS[r]}18`, border: `1px solid ${ROLE_COLORS[r]}35`, color: ROLE_COLORS[r] }}>
                    {ROLE_LABELS[r]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS_MATRIX.map((row, i) => (
              <tr key={row.action} className={i % 2 === 0 ? 'tm-perm-even' : 'tm-perm-odd'}>
                <td>{row.action}</td>
                {roles.map(r => (
                  <td key={r} style={{ textAlign: 'center' }}>
                    {row[r] ? <CheckIcon /> : <XIcon />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */
/* Main Page                                                   */
/* ─────────────────────────────────────────────────────────── */

type TeamTab = 'members' | 'permissions'

export default function TeamPage() {
  const [tab, setTab] = useState<TeamTab>('members')
  const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS)
  const [showInvite, setShowInvite] = useState(false)
  const [editMember, setEditMember] = useState<TeamMember | null>(null)

  const activeCount = members.filter(m => m.status === 'active').length

  const handleSave = (data: { id?: string; name: string; email: string; role: TeamRole; divisions: string[]; sendEmail: boolean }) => {
    if (data.id) {
      setMembers(prev => prev.map(m => m.id === data.id ? { ...m, name: data.name, email: data.email, role: data.role, divisions: data.divisions } : m))
    } else {
      const newMember: TeamMember = {
        id: `tm${Date.now()}`,
        name: data.name, email: data.email, role: data.role, divisions: data.divisions,
        last_active_at: new Date().toISOString(), status: 'active',
        initials: data.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        avatar_color: '#3A589E', joined_at: new Date().toISOString(),
      }
      setMembers(prev => [...prev, newMember])
    }
  }

  const toggleStatus = (id: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m))
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="tm-root">
        {/* Header */}
        <div className="tm-header">
          <div>
            <div className="tm-title">Team Management</div>
            <div className="tm-sub">{members.length} members · {activeCount} active</div>
          </div>
          <button className="tm-btn-invite" onClick={() => setShowInvite(true)}>
            <PlusIcon />
            Invite Member
          </button>
        </div>

        {/* Tabs */}
        <div className="tm-tabs">
          <button className={`tm-tab${tab === 'members' ? ' active' : ''}`} onClick={() => setTab('members')}>
            Team Members
          </button>
          <button className={`tm-tab${tab === 'permissions' ? ' active' : ''}`} onClick={() => setTab('permissions')}>
            Permissions Matrix
          </button>
        </div>

        {/* Tab: Members */}
        {tab === 'members' && (
          <div className="tm-table-wrap">
            <div style={{ overflowX: 'auto' }}>
              <table className="tm-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Divisions</th>
                    <th>Last Active</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.id}>
                      {/* Avatar + Name */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="tm-avatar" style={{ background: m.avatar_color }}>
                            {m.initials}
                          </div>
                          <div>
                            <div className="tm-member-name">{m.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{m.email}</td>

                      {/* Role */}
                      <td>
                        <span className="tm-role-badge" style={{ background: `${ROLE_COLORS[m.role]}18`, border: `1px solid ${ROLE_COLORS[m.role]}30`, color: ROLE_COLORS[m.role] }}>
                          {ROLE_LABELS[m.role]}
                        </span>
                      </td>

                      {/* Divisions */}
                      <td><DivisionDots divisions={m.divisions} /></td>

                      {/* Last active */}
                      <td style={{ whiteSpace: 'nowrap' }}>{rel(m.last_active_at)}</td>

                      {/* Status */}
                      <td>
                        {m.status === 'active'
                          ? <span className="tm-status-active"><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />Active</span>
                          : <span className="tm-status-inactive"><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748B', display: 'inline-block' }} />Inactive</span>
                        }
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="tm-btn-edit" onClick={() => setEditMember(m)}>Edit</button>
                          {m.status === 'active'
                            ? <button className="tm-btn-deact" onClick={() => toggleStatus(m.id)}>Deactivate</button>
                            : <button className="tm-btn-react" onClick={() => toggleStatus(m.id)}>Reactivate</button>
                          }
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Permissions */}
        {tab === 'permissions' && <PermissionsMatrix />}

        {/* Invite Modal */}
        {showInvite && (
          <MemberModal mode="invite" onClose={() => setShowInvite(false)} onSave={handleSave} />
        )}

        {/* Edit Modal */}
        {editMember && (
          <MemberModal mode="edit" member={editMember} onClose={() => setEditMember(null)} onSave={handleSave} />
        )}
      </div>
    </>
  )
}
