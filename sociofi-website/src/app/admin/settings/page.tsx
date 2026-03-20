'use client';

import React, { useState } from 'react';

/* ─────────────────────────────────────────────────────────── */

const STYLES = `
  .sett-root {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* ── Page header ── */
  .sett-page-title {
    font-family: 'Manrope', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: var(--adm-text);
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .sett-page-sub {
    font-size: 13px;
    color: var(--adm-muted);
  }

  /* ── Tabs ── */
  .sett-tabs {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid var(--adm-border);
    padding-bottom: 0;
  }
  .sett-tab {
    padding: 9px 16px;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--adm-muted);
    background: none;
    border: none;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 0.2s, border-color 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .sett-tab:hover { color: var(--adm-text); }
  .sett-tab.active {
    color: var(--adm-text);
    border-bottom-color: var(--adm-accent);
  }

  /* ── Card ── */
  .sett-card {
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 14px;
    overflow: hidden;
  }
  .sett-card-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--adm-border);
  }
  .sett-card-title {
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--adm-text);
    margin-bottom: 3px;
  }
  .sett-card-desc {
    font-size: 12.5px;
    color: var(--adm-muted);
  }
  .sett-card-body {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  /* ── Form fields ── */
  .sett-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .sett-label {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--adm-muted);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    font-family: 'JetBrains Mono', monospace;
  }
  .sett-input {
    width: 100%;
    max-width: 460px;
    padding: 9px 14px;
    background: var(--adm-bg);
    border: 1px solid var(--adm-border);
    border-radius: 9px;
    color: var(--adm-text);
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }
  .sett-input:focus { border-color: var(--adm-teal); }
  .sett-input:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .sett-select {
    width: 100%;
    max-width: 260px;
    padding: 9px 14px;
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
  .sett-select:focus { border-color: var(--adm-teal); }

  /* ── Toggle switch ── */
  .sett-toggle-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid var(--adm-border);
  }
  .sett-toggle-row:last-of-type { border-bottom: none; }
  .sett-toggle-info { flex: 1; }
  .sett-toggle-title {
    font-size: 13.5px;
    font-weight: 500;
    color: var(--adm-text);
    margin-bottom: 2px;
  }
  .sett-toggle-desc {
    font-size: 12px;
    color: var(--adm-muted);
  }
  .sett-toggle {
    position: relative;
    width: 40px;
    height: 22px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .sett-toggle input { opacity: 0; width: 0; height: 0; }
  .sett-toggle-track {
    position: absolute;
    inset: 0;
    border-radius: 100px;
    background: rgba(255,255,255,0.1);
    cursor: pointer;
    transition: background 0.25s;
  }
  .sett-toggle input:checked + .sett-toggle-track {
    background: var(--adm-teal);
  }
  .sett-toggle-track::after {
    content: '';
    position: absolute;
    top: 3px; left: 3px;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: white;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .sett-toggle input:checked + .sett-toggle-track::after {
    transform: translateX(18px);
  }

  /* ── Email tag input ── */
  .sett-tag-input-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 8px 12px;
    background: var(--adm-bg);
    border: 1px solid var(--adm-border);
    border-radius: 9px;
    max-width: 460px;
    min-height: 44px;
    align-items: center;
    transition: border-color 0.2s;
  }
  .sett-tag-input-wrap:focus-within { border-color: var(--adm-teal); }
  .sett-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 8px 2px 10px;
    background: rgba(89,163,146,0.12);
    border: 1px solid rgba(89,163,146,0.2);
    border-radius: 100px;
    font-size: 12px;
    color: var(--adm-teal);
    font-family: 'JetBrains Mono', monospace;
  }
  .sett-tag-remove {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--adm-teal);
    opacity: 0.6;
    padding: 0;
    line-height: 1;
    transition: opacity 0.15s;
    display: flex; align-items: center;
  }
  .sett-tag-remove:hover { opacity: 1; }
  .sett-tag-bare-input {
    flex: 1;
    min-width: 160px;
    background: none;
    border: none;
    outline: none;
    color: var(--adm-text);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Integration cards ── */
  .sett-integrations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 14px;
  }
  .sett-int-card {
    background: var(--adm-bg);
    border: 1px solid var(--adm-border);
    border-radius: 12px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: border-color 0.2s;
  }
  .sett-int-card:hover { border-color: var(--adm-border-hover); }
  .sett-int-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .sett-int-logo {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 14px;
    color: white;
    flex-shrink: 0;
  }
  .sett-int-name {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: var(--adm-text);
    margin-bottom: 2px;
  }
  .sett-int-sub {
    font-size: 11.5px;
    color: var(--adm-muted);
  }
  .sett-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }
  .sett-status-badge.connected {
    background: rgba(74,222,128,0.1);
    color: #4ADE80;
    border: 1px solid rgba(74,222,128,0.2);
  }
  .sett-status-badge.configure {
    background: rgba(232,184,77,0.1);
    color: #E8B84D;
    border: 1px solid rgba(232,184,77,0.2);
  }
  .sett-status-badge.disconnected {
    background: rgba(107,123,158,0.1);
    color: var(--adm-muted);
    border: 1px solid rgba(107,123,158,0.15);
  }
  .sett-status-badge.soon {
    background: rgba(139,92,246,0.1);
    color: #A78BFA;
    border: 1px solid rgba(139,92,246,0.2);
  }
  .sett-int-detail {
    font-size: 11.5px;
    color: var(--adm-muted);
    font-family: 'JetBrains Mono', monospace;
    line-height: 1.6;
  }
  .sett-int-btn {
    padding: 7px 14px;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    border: 1px solid var(--adm-border);
    background: none;
    color: var(--adm-muted);
    align-self: flex-start;
  }
  .sett-int-btn:hover { border-color: var(--adm-border-hover); color: var(--adm-text); }
  .sett-int-btn.primary {
    background: linear-gradient(135deg, var(--adm-accent), var(--adm-teal));
    border-color: transparent;
    color: white;
  }
  .sett-int-btn.primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .sett-int-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ── Security ── */
  .sett-security-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .sett-2fa-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .sett-2fa-info { flex: 1; }
  .sett-2fa-title {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--adm-text);
    margin-bottom: 3px;
  }
  .sett-2fa-desc { font-size: 12.5px; color: var(--adm-muted); }

  .sett-sessions-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    border: 1px solid var(--adm-border);
    border-radius: 10px;
    overflow: hidden;
  }
  .sett-session-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 16px;
    background: var(--adm-bg);
    transition: background 0.15s;
  }
  .sett-session-item:not(:last-child) {
    border-bottom: 1px solid var(--adm-border);
  }
  .sett-session-icon {
    width: 34px; height: 34px;
    border-radius: 8px;
    background: rgba(89,163,146,0.08);
    display: flex; align-items: center; justify-content: center;
    color: var(--adm-teal);
    flex-shrink: 0;
  }
  .sett-session-info { flex: 1; }
  .sett-session-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--adm-text);
    margin-bottom: 2px;
  }
  .sett-session-meta { font-size: 11.5px; color: var(--adm-muted); }
  .sett-session-current {
    font-size: 10.5px;
    font-weight: 600;
    color: #4ADE80;
    background: rgba(74,222,128,0.1);
    padding: 2px 7px;
    border-radius: 100px;
    font-family: 'JetBrains Mono', monospace;
  }
  .sett-revoke-btn {
    background: none;
    border: 1px solid rgba(248,113,113,0.2);
    color: #F87171;
    padding: 5px 12px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .sett-revoke-btn:hover { background: rgba(248,113,113,0.08); }

  .sett-api-table {
    width: 100%;
    border-collapse: collapse;
  }
  .sett-api-table th {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--adm-muted);
    text-align: left;
    padding: 0 12px 10px;
    font-family: 'JetBrains Mono', monospace;
    border-bottom: 1px solid var(--adm-border);
  }
  .sett-api-table td {
    padding: 12px;
    font-size: 13px;
    color: var(--adm-text);
    border-bottom: 1px solid var(--adm-border);
  }
  .sett-api-table tr:last-child td { border-bottom: none; }
  .sett-api-key-mask {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--adm-muted);
    background: var(--adm-bg);
    padding: 3px 8px;
    border-radius: 5px;
    border: 1px solid var(--adm-border);
  }

  /* ── Buttons ── */
  .sett-btn-primary {
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
    align-self: flex-start;
  }
  .sett-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

  .sett-btn-ghost {
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
  .sett-btn-ghost:hover { border-color: var(--adm-border-hover); color: var(--adm-text); }

  /* ── Toast ── */
  .sett-toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    padding: 12px 20px;
    background: var(--adm-bg2);
    border: 1px solid rgba(74,222,128,0.25);
    border-radius: 12px;
    color: #4ADE80;
    font-size: 13.5px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    z-index: 2000;
    animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(16px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Sub-section label ── */
  .sett-section-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--adm-muted);
    font-family: 'JetBrains Mono', monospace;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--adm-border);
    margin-bottom: 2px;
  }

  .sett-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
`;

/* ── Types ── */
interface ToastMsg {
  id: number;
  text: string;
}

type Tab = 'general' | 'notifications' | 'integrations' | 'security';

/* ─────────────────────────────────────────────────────────── */

function Toast({ msg, onDone }: { msg: ToastMsg; onDone: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="sett-toast">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {msg.text}
    </div>
  );
}

/* ── General Tab ── */
function GeneralTab({ onSave }: { onSave: () => void }) {
  const [form, setForm] = useState({
    company: 'SocioFi Technology',
    url: 'https://sociofitechnology.com',
    tz: 'Asia/Dhaka',
    dateFormat: 'YYYY-MM-DD',
    lang: 'en',
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="sett-card">
        <div className="sett-card-header">
          <div className="sett-card-title">General Settings</div>
          <div className="sett-card-desc">Manage your workspace identity and regional preferences.</div>
        </div>
        <div className="sett-card-body">
          <div className="sett-field">
            <label className="sett-label">Company Name</label>
            <input
              className="sett-input"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            />
          </div>
          <div className="sett-field">
            <label className="sett-label">Admin Site URL</label>
            <input
              className="sett-input"
              type="url"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            />
          </div>
          <div className="sett-row">
            <div className="sett-field">
              <label className="sett-label">Timezone</label>
              <select
                className="sett-select"
                value={form.tz}
                onChange={(e) => setForm((f) => ({ ...f, tz: e.target.value }))}
              >
                <option value="UTC">UTC</option>
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
            <div className="sett-field">
              <label className="sett-label">Date Format</label>
              <select
                className="sett-select"
                value={form.dateFormat}
                onChange={(e) => setForm((f) => ({ ...f, dateFormat: e.target.value }))}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
          <div className="sett-field">
            <label className="sett-label">Language</label>
            <input className="sett-input" value="English" disabled style={{ maxWidth: 200 }} />
          </div>
          <button className="sett-btn-primary" onClick={onSave}>Save General Settings</button>
        </div>
      </div>
    </div>
  );
}

/* ── Notifications Tab ── */
function NotificationsTab({ onSave }: { onSave: () => void }) {
  const [toggles, setToggles] = useState({
    newSubmission: true,
    p1Ticket: true,
    venturesApp: true,
    dailyDigest: false,
    weeklyReport: true,
  });
  const [emails, setEmails] = useState<string[]>(['arifur@sociofitechnology.com', 'kamrul@sociofitechnology.com']);
  const [emailInput, setEmailInput] = useState('');

  const addEmail = () => {
    const trimmed = emailInput.trim();
    if (trimmed && !emails.includes(trimmed)) {
      setEmails((e) => [...e, trimmed]);
      setEmailInput('');
    }
  };
  const removeEmail = (em: string) => setEmails((e) => e.filter((x) => x !== em));

  const Toggle = ({ id, label, desc }: { id: keyof typeof toggles; label: string; desc: string }) => (
    <div className="sett-toggle-row">
      <div className="sett-toggle-info">
        <div className="sett-toggle-title">{label}</div>
        <div className="sett-toggle-desc">{desc}</div>
      </div>
      <label className="sett-toggle">
        <input
          type="checkbox"
          checked={toggles[id]}
          onChange={(e) => setToggles((t) => ({ ...t, [id]: e.target.checked }))}
        />
        <span className="sett-toggle-track" />
      </label>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="sett-card">
        <div className="sett-card-header">
          <div className="sett-card-title">Email Notifications</div>
          <div className="sett-card-desc">Choose which events trigger email alerts to the team.</div>
        </div>
        <div className="sett-card-body">
          <Toggle id="newSubmission" label="New submission received" desc="Email alert when any form submission comes in." />
          <Toggle id="p1Ticket" label="P1 ticket created" desc="Email + SMS placeholder when a critical incident ticket is opened." />
          <Toggle id="venturesApp" label="Ventures application received" desc="Email alert when a startup applies via the Ventures division." />
          <Toggle id="dailyDigest" label="Daily digest email" desc="Summary of the day's activity, sent at 8:00 AM." />
          <Toggle id="weeklyReport" label="Weekly report" desc="Full weekly rollup every Monday at 9:00 AM." />
        </div>
      </div>
      <div className="sett-card">
        <div className="sett-card-header">
          <div className="sett-card-title">Email Recipients</div>
          <div className="sett-card-desc">All notification emails are sent to these addresses.</div>
        </div>
        <div className="sett-card-body">
          <div className="sett-field">
            <label className="sett-label">Recipients</label>
            <div className="sett-tag-input-wrap">
              {emails.map((em) => (
                <span className="sett-tag" key={em}>
                  {em}
                  <button
                    className="sett-tag-remove"
                    onClick={() => removeEmail(em)}
                    aria-label={`Remove ${em}`}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </span>
              ))}
              <input
                className="sett-tag-bare-input"
                type="email"
                placeholder="Add email address…"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addEmail();
                  }
                }}
              />
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--adm-muted)', marginTop: 4 }}>Press Enter or comma to add an address.</div>
          </div>
          <button className="sett-btn-primary" onClick={onSave}>Save Notification Settings</button>
        </div>
      </div>
    </div>
  );
}

/* ── Integrations Tab ── */
function IntegrationsTab() {
  const integrations = [
    {
      key: 'supabase',
      name: 'Supabase',
      sub: 'Database & auth provider',
      logo: '#1C7737',
      initial: 'SB',
      status: 'connected' as const,
      detail: 'Project: sociofi-admin-prod\nRegion: ap-southeast-1',
      btnLabel: 'View Dashboard',
    },
    {
      key: 'resend',
      name: 'Resend',
      sub: 'Transactional email',
      logo: '#1A1A2E',
      initial: 'RE',
      status: 'configure' as const,
      btnLabel: 'Configure',
    },
    {
      key: 'stripe',
      name: 'Stripe',
      sub: 'Payments & billing',
      logo: '#6772E5',
      initial: 'ST',
      status: 'disconnected' as const,
      btnLabel: 'Connect',
    },
    {
      key: 'plausible',
      name: 'Plausible',
      sub: 'Privacy-friendly analytics',
      logo: '#5850EC',
      initial: 'PL',
      status: 'disconnected' as const,
      btnLabel: 'Connect',
    },
    {
      key: 'slack',
      name: 'Slack',
      sub: 'Team notifications',
      logo: '#4A154B',
      initial: 'SL',
      status: 'soon' as const,
      btnLabel: 'Coming soon',
      disabled: true,
    },
  ];

  const statusLabels: Record<string, string> = {
    connected: 'Connected',
    configure: 'Needs setup',
    disconnected: 'Not connected',
    soon: 'Coming soon',
  };

  return (
    <div className="sett-card" style={{ padding: 24 }}>
      <div className="sett-card-title" style={{ marginBottom: 6 }}>Integrations</div>
      <div style={{ fontSize: 12.5, color: 'var(--adm-muted)', marginBottom: 20 }}>
        Connect external services to power notifications, billing, and analytics.
      </div>
      <div className="sett-integrations-grid">
        {integrations.map((int) => (
          <div className="sett-int-card" key={int.key}>
            <div className="sett-int-header">
              <div className="sett-int-logo" style={{ background: int.logo }}>{int.initial}</div>
              <div>
                <div className="sett-int-name">{int.name}</div>
                <div className="sett-int-sub">{int.sub}</div>
              </div>
            </div>
            <div>
              <span className={`sett-status-badge ${int.status}`}>
                {int.status === 'connected' && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                )}
                {statusLabels[int.status]}
              </span>
            </div>
            {int.detail && (
              <div className="sett-int-detail" style={{ whiteSpace: 'pre-line' }}>{int.detail}</div>
            )}
            <button
              className={`sett-int-btn${int.status === 'connected' ? '' : ' primary'}`}
              disabled={int.disabled}
            >
              {int.btnLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Security Tab ── */
function SecurityTab({ onSave }: { onSave: () => void }) {
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Change password */}
      <div className="sett-card">
        <div className="sett-card-header">
          <div className="sett-card-title">Change Password</div>
          <div className="sett-card-desc">Update your admin account password.</div>
        </div>
        <div className="sett-card-body">
          <div className="sett-field">
            <label className="sett-label">Current Password</label>
            <input
              className="sett-input"
              type="password"
              placeholder="••••••••"
              value={pwd.current}
              onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
            />
          </div>
          <div className="sett-field">
            <label className="sett-label">New Password</label>
            <input
              className="sett-input"
              type="password"
              placeholder="••••••••"
              value={pwd.next}
              onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
            />
          </div>
          <div className="sett-field">
            <label className="sett-label">Confirm New Password</label>
            <input
              className="sett-input"
              type="password"
              placeholder="••••••••"
              value={pwd.confirm}
              onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
            />
          </div>
          <button className="sett-btn-primary" onClick={onSave}>Update Password</button>
        </div>
      </div>

      {/* 2FA */}
      <div className="sett-card">
        <div className="sett-card-header">
          <div className="sett-card-title">Two-Factor Authentication</div>
          <div className="sett-card-desc">Add an extra layer of security to your account.</div>
        </div>
        <div className="sett-card-body">
          <div className="sett-2fa-row">
            <div className="sett-2fa-info">
              <div className="sett-2fa-title">Authenticator App</div>
              <div className="sett-2fa-desc">Use an app like Google Authenticator or Authy to generate one-time codes.</div>
            </div>
            <label className="sett-toggle">
              <input type="checkbox" checked={twoFA} onChange={(e) => setTwoFA(e.target.checked)} />
              <span className="sett-toggle-track" />
            </label>
          </div>
          {twoFA && (
            <button className="sett-btn-ghost">Set up 2FA →</button>
          )}
        </div>
      </div>

      {/* Active sessions */}
      <div className="sett-card">
        <div className="sett-card-header">
          <div className="sett-card-title">Active Sessions</div>
          <div className="sett-card-desc">Devices currently signed into the admin panel.</div>
        </div>
        <div className="sett-card-body">
          <div className="sett-sessions-list">
            <div className="sett-session-item">
              <div className="sett-session-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div className="sett-session-info">
                <div className="sett-session-name">Chrome on Windows 11</div>
                <div className="sett-session-meta">Dhaka, Bangladesh · Started just now</div>
              </div>
              <span className="sett-session-current">Current</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="sett-card">
        <div className="sett-card-header">
          <div className="sett-card-title">API Keys</div>
          <div className="sett-card-desc">Keys for programmatic access to the admin API.</div>
        </div>
        <div className="sett-card-body" style={{ padding: '0 0' }}>
          <table className="sett-api-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 24, paddingTop: 16 }}>Key Name</th>
                <th>Created</th>
                <th>Last Used</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ paddingLeft: 24 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Admin CLI Key</div>
                  <span className="sett-api-key-mask">sk-adm-****-****-xxxx</span>
                </td>
                <td style={{ color: 'var(--adm-muted)' }}>Jan 15, 2024</td>
                <td style={{ color: 'var(--adm-muted)' }}>2 days ago</td>
                <td>
                  <button className="sett-revoke-btn">Revoke</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ padding: '14px 24px 20px' }}>
            <button className="sett-btn-ghost" style={{ fontSize: 12.5 }}>
              + Generate New Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  let nextId = 0;

  const addToast = (text: string) => {
    const id = ++nextId;
    setToasts((t) => [...t, { id, text }]);
  };
  const removeToast = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  const TABS: { id: Tab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="sett-root">

        {/* ── Header ── */}
        <div>
          <h1 className="sett-page-title">Settings</h1>
          <p className="sett-page-sub">Manage workspace configuration, notifications, integrations, and security.</p>
        </div>

        {/* ── Tabs ── */}
        <div className="sett-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`sett-tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        {activeTab === 'general' && <GeneralTab onSave={() => addToast('General settings saved.')} />}
        {activeTab === 'notifications' && <NotificationsTab onSave={() => addToast('Notification settings saved.')} />}
        {activeTab === 'integrations' && <IntegrationsTab />}
        {activeTab === 'security' && <SecurityTab onSave={() => addToast('Security settings updated.')} />}

      </div>

      {/* ── Toast stack ── */}
      {toasts.map((t) => (
        <Toast key={t.id} msg={t} onDone={() => removeToast(t.id)} />
      ))}
    </>
  );
}
