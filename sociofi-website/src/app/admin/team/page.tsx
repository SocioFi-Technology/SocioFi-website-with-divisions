'use client';

import React, { useState } from 'react';
import type { Role, Division } from '@/lib/supabase/types';

/* ─────────────────────────────────────────────────────────── */

const STYLES = `
  .team-root {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* ── Page header ── */
  .team-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .team-page-title {
    font-family: 'Manrope', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: var(--adm-text);
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .team-page-sub {
    font-size: 13px;
    color: var(--adm-muted);
  }
  .team-invite-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    background: linear-gradient(135deg, var(--adm-accent), var(--adm-teal));
    color: white;
    border: none;
    border-radius: 9px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s, transform 0.2s;
    flex-shrink: 0;
  }
  .team-invite-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  /* ── Member grid ── */
  .team-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  @media (max-width: 800px) { .team-grid { grid-template-columns: 1fr; } }

  .team-card {
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 14px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: border-color 0.2s;
  }
  .team-card:hover { border-color: var(--adm-border-hover); }

  .team-card-header {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .team-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Manrope', sans-serif;
    font-weight: 800; font-size: 14px;
    color: white;
    flex-shrink: 0;
  }
  .team-member-info { flex: 1; min-width: 0; }
  .team-member-name {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 14px;
    color: var(--adm-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 2px;
  }
  .team-member-email {
    font-size: 12px;
    color: var(--adm-muted);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    font-family: 'JetBrains Mono', monospace;
  }

  .team-role-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    align-self: flex-start;
  }

  .team-divs {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .team-div-chip {
    padding: 2px 9px;
    border-radius: 100px;
    font-size: 10.5px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    color: white;
    opacity: 0.85;
  }

  .team-card-actions {
    display: flex;
    gap: 8px;
    margin-top: auto;
  }
  .team-btn-edit {
    flex: 1;
    padding: 7px 0;
    background: rgba(58,88,158,0.12);
    border: 1px solid rgba(58,88,158,0.2);
    color: #6B8CD4;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .team-btn-edit:hover { background: rgba(58,88,158,0.2); color: #A3BFEF; }
  .team-btn-remove {
    padding: 7px 14px;
    background: none;
    border: 1px solid rgba(248,113,113,0.18);
    color: #F87171;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .team-btn-remove:hover { background: rgba(248,113,113,0.08); }
  .team-btn-remove-confirm {
    padding: 7px 14px;
    background: rgba(248,113,113,0.15);
    border: 1px solid rgba(248,113,113,0.3);
    color: #FCA5A5;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }

  /* ── Invite form ── */
  .team-invite-panel {
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 14px;
    overflow: hidden;
  }
  .team-invite-panel-header {
    padding: 16px 22px;
    border-bottom: 1px solid var(--adm-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .team-invite-panel-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: var(--adm-text);
  }
  .team-invite-panel-body {
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .team-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 640px) { .team-form-row { grid-template-columns: 1fr; } }

  .team-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .team-label {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--adm-muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    font-family: 'JetBrains Mono', monospace;
  }
  .team-input {
    padding: 9px 13px;
    background: var(--adm-bg);
    border: 1px solid var(--adm-border);
    border-radius: 9px;
    color: var(--adm-text);
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }
  .team-input:focus { border-color: var(--adm-teal); }
  .team-select {
    padding: 9px 13px;
    background: var(--adm-bg);
    border: 1px solid var(--adm-border);
    border-radius: 9px;
    color: var(--adm-text);
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7B9E' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
  }
  .team-select:focus { border-color: var(--adm-teal); }

  .team-div-checks {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .team-div-check-label {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 11px;
    border-radius: 100px;
    border: 1px solid var(--adm-border);
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    font-family: 'JetBrains Mono', monospace;
    color: var(--adm-muted);
    transition: all 0.15s;
    user-select: none;
  }
  .team-div-check-label:hover { border-color: var(--adm-border-hover); color: var(--adm-text); }
  .team-div-check-label input { display: none; }
  .team-div-check-label.checked {
    border-color: var(--adm-teal);
    background: rgba(89,163,146,0.08);
    color: var(--adm-teal);
  }

  .team-form-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .team-btn-send {
    padding: 9px 20px;
    background: linear-gradient(135deg, var(--adm-accent), var(--adm-teal));
    color: white;
    border: none;
    border-radius: 9px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s, transform 0.2s;
  }
  .team-btn-send:hover { opacity: 0.9; transform: translateY(-1px); }
  .team-btn-cancel {
    padding: 9px 18px;
    background: none;
    color: var(--adm-muted);
    border: 1px solid var(--adm-border);
    border-radius: 9px;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .team-btn-cancel:hover { border-color: var(--adm-border-hover); color: var(--adm-text); }

  .team-invite-success {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: rgba(74,222,128,0.08);
    border: 1px solid rgba(74,222,128,0.2);
    border-radius: 10px;
    color: #4ADE80;
    font-size: 13.5px;
    font-weight: 500;
  }

  /* ── Modal ── */
  .team-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.65);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .team-modal {
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 16px;
    width: 100%;
    max-width: 520px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.5);
    animation: modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.94) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .team-modal-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--adm-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .team-modal-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: var(--adm-text);
  }
  .team-modal-close {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: none;
    border: none;
    color: var(--adm-muted);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, color 0.15s;
  }
  .team-modal-close:hover { background: rgba(255,255,255,0.06); color: var(--adm-text); }
  .team-modal-body {
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .team-modal-actions {
    display: flex;
    gap: 10px;
    padding: 0 24px 22px;
  }
  .team-modal-save {
    flex: 1;
    padding: 9px 0;
    background: linear-gradient(135deg, var(--adm-accent), var(--adm-teal));
    color: white;
    border: none;
    border-radius: 9px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s;
  }
  .team-modal-save:hover { opacity: 0.9; }
  .team-modal-cancel {
    padding: 9px 18px;
    background: none;
    color: var(--adm-muted);
    border: 1px solid var(--adm-border);
    border-radius: 9px;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .team-modal-cancel:hover { border-color: var(--adm-border-hover); color: var(--adm-text); }

  /* ── Role definitions ── */
  .team-roles-panel {
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 14px;
    overflow: hidden;
  }
  .team-roles-toggle {
    width: 100%;
    padding: 16px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s;
  }
  .team-roles-toggle:hover { background: rgba(255,255,255,0.02); }
  .team-roles-toggle-label {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: var(--adm-text);
  }
  .team-roles-toggle-icon {
    color: var(--adm-muted);
    transition: transform 0.25s;
  }
  .team-roles-toggle-icon.open { transform: rotate(180deg); }
  .team-roles-body {
    padding: 0 22px 22px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
    border-top: 1px solid var(--adm-border);
  }
  .team-role-def {
    padding: 14px;
    background: var(--adm-bg);
    border-radius: 10px;
    border: 1px solid var(--adm-border);
    margin-top: 12px;
  }
  .team-role-def-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    font-weight: 600;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }
  .team-role-def-desc {
    font-size: 12px;
    color: var(--adm-muted);
    line-height: 1.55;
  }

  /* ── Misc ── */
  .team-close-x {
    display: flex; align-items: center; justify-content: center;
  }
`;

/* ── Data ── */
interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  divisions: Division[];
  initials: string;
  joined: string;
}

const INITIAL_TEAM: Member[] = [
  { id: 'tm1', name: 'Arifur Rahman', email: 'arifur@sociofitechnology.com', role: 'super_admin', divisions: ['studio', 'agents', 'services', 'cloud', 'academy', 'ventures', 'labs', 'parent'], initials: 'AR', joined: '2024-01-15' },
  { id: 'tm2', name: 'Kamrul Hasan', email: 'kamrul@sociofitechnology.com', role: 'super_admin', divisions: ['studio', 'agents', 'services', 'cloud', 'academy', 'ventures', 'labs', 'parent'], initials: 'KH', joined: '2024-01-15' },
  { id: 'tm3', name: 'Fatima Al-Rashid', email: 'fatima@sociofitechnology.com', role: 'editor', divisions: ['studio', 'academy'], initials: 'FA', joined: '2024-06-01' },
  { id: 'tm4', name: 'Minhaz Ahmed', email: 'minhaz@sociofitechnology.com', role: 'viewer', divisions: ['services', 'cloud'], initials: 'MA', joined: '2025-01-10' },
];

const ALL_DIVISIONS: Division[] = ['studio', 'agents', 'services', 'cloud', 'academy', 'ventures', 'labs', 'parent'];

const ROLE_COLORS: Record<Role, { bg: string; border: string; text: string }> = {
  super_admin:   { bg: 'rgba(58,88,158,0.15)',  border: 'rgba(58,88,158,0.3)',  text: '#7B9EE8' },
  division_lead: { bg: 'rgba(89,163,146,0.12)', border: 'rgba(89,163,146,0.25)', text: '#59A392' },
  editor:        { bg: 'rgba(232,145,111,0.12)', border: 'rgba(232,145,111,0.25)', text: '#E8916F' },
  viewer:        { bg: 'rgba(107,123,158,0.12)', border: 'rgba(107,123,158,0.2)', text: '#8B9EC0' },
};
const ROLE_AVATAR_COLORS: Record<Role, string> = {
  super_admin:   'linear-gradient(135deg, #3A589E, #59A392)',
  division_lead: 'linear-gradient(135deg, #59A392, #72C4B2)',
  editor:        'linear-gradient(135deg, #E8916F, #E8B84D)',
  viewer:        'linear-gradient(135deg, #6B7B9E, #8B9EC0)',
};

const DIV_COLORS: Record<Division, string> = {
  studio:   '#72C4B2',
  agents:   '#8B5CF6',
  services: '#4DBFA8',
  cloud:    '#5BB5E0',
  academy:  '#E8B84D',
  ventures: '#6BA3E8',
  labs:     '#7B6FE8',
  parent:   '#4A6CB8',
};

const ROLE_LABELS: Record<Role, string> = {
  super_admin:   'Super Admin',
  division_lead: 'Division Lead',
  editor:        'Editor',
  viewer:        'Viewer',
};

/* ── Edit modal ── */
function EditModal({
  member,
  onSave,
  onClose,
}: {
  member: Member;
  onSave: (updated: Member) => void;
  onClose: () => void;
}) {
  const [role, setRole] = useState<Role>(member.role);
  const [divs, setDivs] = useState<Division[]>([...member.divisions]);

  const toggleDiv = (d: Division) => {
    setDivs((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };

  return (
    <div
      className="team-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="team-modal" role="dialog" aria-modal="true" aria-label={`Edit ${member.name}`}>
        <div className="team-modal-header">
          <div className="team-modal-title">Edit Member — {member.name}</div>
          <button className="team-modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="team-modal-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--adm-border)' }}>
            <div className="team-avatar" style={{ background: ROLE_AVATAR_COLORS[member.role], width: 40, height: 40, fontSize: 13 }}>{member.initials}</div>
            <div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--adm-text)' }}>{member.name}</div>
              <div style={{ fontSize: 12, color: 'var(--adm-muted)', fontFamily: "'JetBrains Mono',monospace" }}>{member.email}</div>
            </div>
          </div>
          <div className="team-field">
            <label className="team-label">Role</label>
            <select
              className="team-select"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              style={{ width: '100%', maxWidth: '100%' }}
            >
              <option value="super_admin">Super Admin</option>
              <option value="division_lead">Division Lead</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="team-field">
            <label className="team-label">Division Access</label>
            <div className="team-div-checks">
              {ALL_DIVISIONS.map((d) => (
                <label
                  key={d}
                  className={`team-div-check-label${divs.includes(d) ? ' checked' : ''}`}
                  style={divs.includes(d) ? { borderColor: DIV_COLORS[d], background: `${DIV_COLORS[d]}18`, color: DIV_COLORS[d] } : {}}
                >
                  <input
                    type="checkbox"
                    checked={divs.includes(d)}
                    onChange={() => toggleDiv(d)}
                  />
                  {d}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="team-modal-actions">
          <button className="team-modal-save" onClick={() => onSave({ ...member, role, divisions: divs })}>
            Save Changes
          </button>
          <button className="team-modal-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── Member card ── */
function MemberCard({
  member,
  onEdit,
  onRemove,
}: {
  member: Member;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const roleStyle = ROLE_COLORS[member.role];

  return (
    <div className="team-card">
      <div className="team-card-header">
        <div
          className="team-avatar"
          style={{ background: ROLE_AVATAR_COLORS[member.role] }}
          aria-hidden="true"
        >
          {member.initials}
        </div>
        <div className="team-member-info">
          <div className="team-member-name">{member.name}</div>
          <div className="team-member-email">{member.email}</div>
        </div>
      </div>

      <span
        className="team-role-badge"
        style={{ background: roleStyle.bg, border: `1px solid ${roleStyle.border}`, color: roleStyle.text }}
      >
        {ROLE_LABELS[member.role]}
      </span>

      <div className="team-divs" aria-label="Division access">
        {member.divisions.slice(0, 8).map((d) => (
          <span
            key={d}
            className="team-div-chip"
            style={{ background: DIV_COLORS[d] }}
            title={d}
          >
            {d}
          </span>
        ))}
      </div>

      <div className="team-card-actions">
        <button className="team-btn-edit" onClick={onEdit}>Edit</button>
        {confirming ? (
          <button
            className="team-btn-remove-confirm"
            onClick={() => { setConfirming(false); onRemove(); }}
          >
            Confirm remove?
          </button>
        ) : (
          <button className="team-btn-remove" onClick={() => setConfirming(true)}>Remove</button>
        )}
      </div>
    </div>
  );
}

/* ── Invite panel ── */
function InvitePanel({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ email: '', name: '', role: 'viewer' as Role });
  const [selectedDivs, setSelectedDivs] = useState<Division[]>([]);
  const [sent, setSent] = useState(false);

  const toggleDiv = (d: Division) => {
    setSelectedDivs((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { setSent(false); onClose(); }, 2500);
  };

  return (
    <div className="team-invite-panel">
      <div className="team-invite-panel-header">
        <div className="team-invite-panel-title">Invite Team Member</div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--adm-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          aria-label="Close invite form"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div className="team-invite-panel-body">
        {sent ? (
          <div className="team-invite-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Invite sent to {form.email || 'team member'}!
          </div>
        ) : (
          <>
            <div className="team-form-row">
              <div className="team-field">
                <label className="team-label">Email Address</label>
                <input
                  className="team-input"
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="team-field">
                <label className="team-label">Full Name</label>
                <input
                  className="team-input"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
            </div>
            <div className="team-field">
              <label className="team-label">Role</label>
              <select
                className="team-select"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                style={{ maxWidth: 260 }}
              >
                <option value="super_admin">Super Admin</option>
                <option value="division_lead">Division Lead</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="team-field">
              <label className="team-label">Division Access</label>
              <div className="team-div-checks">
                {ALL_DIVISIONS.map((d) => (
                  <label
                    key={d}
                    className={`team-div-check-label${selectedDivs.includes(d) ? ' checked' : ''}`}
                    style={selectedDivs.includes(d) ? { borderColor: DIV_COLORS[d], background: `${DIV_COLORS[d]}18`, color: DIV_COLORS[d] } : {}}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDivs.includes(d)}
                      onChange={() => toggleDiv(d)}
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
            <div className="team-form-actions">
              <button className="team-btn-send" onClick={handleSend}>Send Invite</button>
              <button className="team-btn-cancel" onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Role definitions panel ── */
function RolesPanel() {
  const [open, setOpen] = useState(false);

  const roles: { role: Role; desc: string }[] = [
    { role: 'super_admin', desc: 'Full access to all divisions, settings, team management, billing, and system configuration. Can promote/demote other admins.' },
    { role: 'division_lead', desc: 'Full read/write access to assigned divisions. Can assign tickets, approve and publish content, and manage division-specific settings.' },
    { role: 'editor', desc: 'Read and write access to assigned divisions. Can create and edit submissions, contacts, content, and tickets — but cannot publish or assign to others.' },
    { role: 'viewer', desc: 'Read-only access across assigned divisions. Cannot create, edit, or delete any records.' },
  ];

  return (
    <div className="team-roles-panel">
      <button className="team-roles-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="team-roles-toggle-label">Role Definitions</span>
        <svg className={`team-roles-toggle-icon${open ? ' open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div className="team-roles-body">
          {roles.map(({ role, desc }) => {
            const c = ROLE_COLORS[role];
            return (
              <div className="team-role-def" key={role}>
                <div className="team-role-def-name" style={{ color: c.text }}>{ROLE_LABELS[role]}</div>
                <div className="team-role-def-desc">{desc}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Main page ── */
export default function TeamPage() {
  const [team, setTeam] = useState<Member[]>(INITIAL_TEAM);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const handleSave = (updated: Member) => {
    setTeam((t) => t.map((m) => (m.id === updated.id ? updated : m)));
    setEditingMember(null);
  };

  const handleRemove = (id: string) => {
    setTeam((t) => t.filter((m) => m.id !== id));
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="team-root">

        {/* ── Header ── */}
        <div className="team-page-header">
          <div>
            <h1 className="team-page-title">Team</h1>
            <p className="team-page-sub">Manage admin access, roles, and division permissions.</p>
          </div>
          <button
            className="team-invite-btn"
            onClick={() => setShowInvite((v) => !v)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Invite Member
          </button>
        </div>

        {/* ── Invite panel ── */}
        {showInvite && (
          <InvitePanel onClose={() => setShowInvite(false)} />
        )}

        {/* ── Team grid ── */}
        <div className="team-grid">
          {team.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={() => setEditingMember(member)}
              onRemove={() => handleRemove(member.id)}
            />
          ))}
        </div>

        {/* ── Role definitions ── */}
        <RolesPanel />

      </div>

      {/* ── Edit modal ── */}
      {editingMember && (
        <EditModal
          member={editingMember}
          onSave={handleSave}
          onClose={() => setEditingMember(null)}
        />
      )}
    </>
  );
}
