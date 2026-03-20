'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_CONTACTS, MOCK_SUBMISSIONS, MOCK_TICKETS } from '@/lib/admin/mock-data';
import { LifecycleStage, Division } from '@/lib/supabase/types';

/* ─── constants ─── */
const ALL_DIVISIONS: Division[] = ['studio', 'agents', 'services', 'cloud', 'academy', 'ventures', 'labs'];

const LIFECYCLE_STAGES: LifecycleStage[] = ['lead', 'qualified', 'opportunity', 'client'];

const LIFECYCLE_COLORS: Record<LifecycleStage, string> = {
  lead:        '#3A589E',
  qualified:   '#E8B84D',
  opportunity: '#E8916F',
  client:      '#59A392',
  churned:     '#4A5578',
};

const DIVISION_COLORS: Record<string, string> = {
  studio:   '#72C4B2',
  agents:   '#8B5CF6',
  services: '#4DBFA8',
  cloud:    '#5BB5E0',
  academy:  '#E8B84D',
  ventures: '#6BA3E8',
  labs:     '#7B6FE8',
  parent:   '#3A589E',
};

const STATUS_COLORS: Record<string, string> = {
  new:         '#3A589E',
  reviewed:    '#E8B84D',
  in_progress: '#E8916F',
  converted:   '#59A392',
  closed:      '#4A5578',
  archived:    '#4A5578',
  open:        '#3A589E',
  acknowledged:'#E8B84D',
  resolved:    '#59A392',
};

const PRIORITY_COLORS: Record<string, string> = {
  p1: '#F87171',
  p2: '#E8916F',
  p3: '#E8B84D',
  p4: '#6B7B9E',
  low:    '#6B7B9E',
  normal: '#3A589E',
  high:   '#E8916F',
  urgent: '#F87171',
};

/* ─── helpers ─── */
function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  return (email ?? '??').slice(0, 2).toUpperCase();
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatType(type: string): string {
  return type.replace(/-/g, ' ').replace(/_/g, ' ');
}

/* ─── styles ─── */
const STYLES = `
  .crmdet-page {
    max-width: 1100px;
  }

  /* Back link */
  .crmdet-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--adm-muted);
    font-size: 13px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    margin-bottom: 20px;
    transition: color 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .crmdet-back:hover { color: var(--adm-text); }

  /* Layout */
  .crmdet-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .crmdet-layout { grid-template-columns: 1fr; }
    .crmdet-right { position: static !important; }
  }

  /* Panels */
  .crmdet-panel {
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 12px;
    overflow: hidden;
  }
  .crmdet-panel-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--adm-border);
    font-family: 'Manrope', sans-serif;
    font-weight: 600;
    font-size: 13px;
    color: var(--adm-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: 'JetBrains Mono', monospace;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .crmdet-panel-body { padding: 20px; }

  /* Contact header inside panel */
  .crmdet-contact-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 24px;
  }
  .crmdet-avatar-lg {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: white;
    flex-shrink: 0;
    letter-spacing: 0.02em;
  }
  .crmdet-hdr-name {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 20px;
    color: var(--adm-text);
    letter-spacing: -0.02em;
    margin-bottom: 3px;
  }
  .crmdet-hdr-email {
    font-size: 13px;
    color: var(--adm-muted);
    margin-bottom: 2px;
  }
  .crmdet-hdr-meta {
    font-size: 13px;
    color: var(--adm-muted);
    margin-bottom: 10px;
  }

  /* Lifecycle badge */
  .crmdet-lc-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 100px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .crmdet-lc-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  /* Editable field rows */
  .crmdet-fields { display: flex; flex-direction: column; gap: 0; }
  .crmdet-field-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--adm-border);
  }
  .crmdet-field-row:last-of-type { border-bottom: none; }
  .crmdet-field-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--adm-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    min-width: 72px;
    flex-shrink: 0;
  }
  .crmdet-field-val {
    flex: 1;
    font-size: 13px;
    color: var(--adm-text);
    min-height: 28px;
    display: flex;
    align-items: center;
  }
  .crmdet-field-val.empty { color: var(--adm-muted); font-style: italic; }
  .crmdet-field-input {
    flex: 1;
    padding: 6px 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--adm-border-hover);
    border-radius: 6px;
    color: var(--adm-text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }
  .crmdet-field-input:focus { border-color: var(--adm-teal); }
  .crmdet-edit-btn {
    background: none;
    border: none;
    color: var(--adm-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s, background 0.2s;
    flex-shrink: 0;
  }
  .crmdet-edit-btn:hover { color: var(--adm-teal); background: rgba(89,163,146,0.08); }

  /* Notes */
  .crmdet-notes-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--adm-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }
  .crmdet-notes-area {
    width: 100%;
    min-height: 90px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--adm-border);
    border-radius: 8px;
    color: var(--adm-text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    line-height: 1.6;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
  }
  .crmdet-notes-area::placeholder { color: var(--adm-muted); }
  .crmdet-notes-area:focus { border-color: var(--adm-teal); }

  /* Save button */
  .crmdet-save-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 20px;
    background: linear-gradient(135deg, #3A589E, #59A392);
    border: none;
    border-radius: 8px;
    color: white;
    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
  }
  .crmdet-save-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .crmdet-save-btn:active { transform: translateY(0); }

  /* Toast */
  .crmdet-toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    background: #1a2a1a;
    border: 1px solid rgba(89,163,146,0.3);
    border-radius: 10px;
    color: #59A392;
    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: crmToastIn 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes crmToastIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Division checkboxes */
  .crmdet-div-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .crmdet-div-check {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 13px;
    color: var(--adm-text);
  }
  .crmdet-div-check input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: var(--adm-teal);
    cursor: pointer;
    flex-shrink: 0;
  }
  .crmdet-div-check-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Tags input */
  .crmdet-tags-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
  }
  .crmdet-tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    background: rgba(89,163,146,0.08);
    border: 1px solid rgba(89,163,146,0.12);
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--adm-teal);
  }
  .crmdet-tag-remove {
    background: none;
    border: none;
    color: var(--adm-muted);
    cursor: pointer;
    padding: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }
  .crmdet-tag-remove:hover { color: #F87171; }
  .crmdet-tag-input {
    flex: 1;
    min-width: 140px;
    padding: 6px 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--adm-border);
    border-radius: 6px;
    color: var(--adm-text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }
  .crmdet-tag-input::placeholder { color: var(--adm-muted); }
  .crmdet-tag-input:focus { border-color: var(--adm-teal); }

  /* Danger zone */
  .crmdet-danger-btn {
    padding: 8px 16px;
    background: transparent;
    border: 1px solid rgba(248,113,113,0.3);
    border-radius: 8px;
    color: #F87171;
    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .crmdet-danger-btn:hover {
    background: rgba(248,113,113,0.08);
    border-color: rgba(248,113,113,0.6);
  }

  /* Right column */
  .crmdet-right {
    position: sticky;
    top: 76px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Lifecycle stepper */
  .crmdet-stepper {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px 0;
  }
  .crmdet-step {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
  }
  .crmdet-step:hover { background: rgba(255,255,255,0.04); }
  .crmdet-step.active { background: rgba(255,255,255,0.06); }
  .crmdet-step-circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid var(--adm-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.2s, background 0.2s;
  }
  .crmdet-step.active .crmdet-step-circle,
  .crmdet-step.past .crmdet-step-circle {
    border-color: currentColor;
  }
  .crmdet-step.active .crmdet-step-circle {
    background: currentColor;
  }
  .crmdet-step-check {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: currentColor;
    display: none;
  }
  .crmdet-step.past .crmdet-step-check { display: block; }
  .crmdet-step-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    text-transform: capitalize;
  }
  .crmdet-step-sep {
    margin-left: 25px;
    width: 2px;
    height: 8px;
    background: var(--adm-border);
    border-radius: 1px;
  }
  .crmdet-churned-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid var(--adm-border);
    border-radius: 8px;
    background: none;
    cursor: pointer;
    width: 100%;
    margin-top: 6px;
    transition: border-color 0.2s, background 0.2s;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
  }
  .crmdet-churned-btn:hover {
    border-color: rgba(74,85,120,0.5);
    background: rgba(74,85,120,0.1);
  }

  /* Submission list */
  .crmdet-list { display: flex; flex-direction: column; gap: 8px; }
  .crmdet-list-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--adm-border);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    text-decoration: none;
    color: inherit;
  }
  .crmdet-list-item:hover {
    border-color: var(--adm-border-hover);
    background: rgba(255,255,255,0.04);
  }
  .crmdet-list-body { flex: 1; min-width: 0; }
  .crmdet-list-title {
    font-size: 12px;
    font-weight: 500;
    color: var(--adm-text);
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: capitalize;
    font-family: 'DM Sans', sans-serif;
  }
  .crmdet-list-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .crmdet-div-badge {
    padding: 2px 7px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: rgba(255,255,255,0.04);
  }
  .crmdet-status-badge {
    padding: 2px 7px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: rgba(255,255,255,0.04);
  }
  .crmdet-list-time {
    font-size: 11px;
    color: var(--adm-muted);
    font-family: 'JetBrains Mono', monospace;
    flex-shrink: 0;
    margin-top: 2px;
  }

  /* Empty state */
  .crmdet-empty {
    padding: 24px;
    text-align: center;
    color: var(--adm-muted);
    font-size: 13px;
    font-style: italic;
  }

  /* Not found */
  .crmdet-not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
    text-align: center;
    color: var(--adm-muted);
  }
  .crmdet-not-found-title {
    font-family: 'Manrope', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--adm-text);
  }

  /* Section gap */
  .crmdet-section-gap { margin-top: 16px; }
  .crmdet-action-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--adm-border);
  }
`;

/* ─── EditableField ─── */
function EditableField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = useCallback(() => {
    onChange(draft);
    setEditing(false);
  }, [draft, onChange]);

  return (
    <div className="crmdet-field-row">
      <span className="crmdet-field-label">{label}</span>
      {editing ? (
        <input
          className="crmdet-field-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
          autoFocus
          aria-label={`Edit ${label}`}
        />
      ) : (
        <>
          <span className={`crmdet-field-val${!value ? ' empty' : ''}`}>
            {value || `No ${label.toLowerCase()}`}
          </span>
          <button
            className="crmdet-edit-btn"
            onClick={() => { setDraft(value); setEditing(true); }}
            aria-label={`Edit ${label}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const contact = MOCK_CONTACTS.find((c) => c.id === params.id);

  /* Local state */
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [company, setCompany] = useState(contact?.company ?? '');
  const [role, setRole] = useState(contact?.role ?? '');
  const [source, setSource] = useState(contact?.source ?? '');
  const [notes, setNotes] = useState(contact?.notes ?? '');
  const [divisions, setDivisions] = useState<Division[]>(contact?.division_interest ?? []);
  const [tags, setTags] = useState<string[]>(contact?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [lifecycle, setLifecycle] = useState<LifecycleStage>(contact?.lifecycle_stage ?? 'lead');
  const [showToast, setShowToast] = useState(false);

  /* Submissions & tickets for this contact */
  const submissions = MOCK_SUBMISSIONS.filter((s) => s.contact_id === params.id);
  const tickets = MOCK_TICKETS.filter((t) => t.contact_id === params.id);

  /* Toast auto-hide */
  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 2800);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  const handleSave = () => setShowToast(true);

  const toggleDivision = (div: Division) => {
    setDivisions((prev) =>
      prev.includes(div) ? prev.filter((d) => d !== div) : [...prev, div]
    );
  };

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const stageIndex = (s: LifecycleStage) => LIFECYCLE_STAGES.indexOf(s);

  /* Not found */
  if (!contact) {
    return (
      <div className="crmdet-not-found">
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }} aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
        <div className="crmdet-not-found-title">Contact not found</div>
        <p>The contact with ID &ldquo;{params.id}&rdquo; does not exist.</p>
        <button
          className="crmdet-back"
          onClick={() => router.push('/admin/contacts')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Contacts
        </button>
      </div>
    );
  }

  const initials = getInitials(contact.name, contact.email);
  const stageColor = LIFECYCLE_COLORS[lifecycle];

  return (
    <div className="crmdet-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Toast */}
      {showToast && (
        <div className="crmdet-toast" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Changes saved
        </div>
      )}

      {/* Back */}
      <button className="crmdet-back" onClick={() => router.push('/admin/contacts')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Contacts
      </button>

      <div className="crmdet-layout">
        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Contact header */}
          <div className="crmdet-panel">
            <div className="crmdet-contact-header">
              <div
                className="crmdet-avatar-lg"
                style={{ background: `linear-gradient(135deg, ${stageColor}cc, ${stageColor}55)` }}
                aria-hidden="true"
              >
                {initials}
              </div>
              <div>
                <div className="crmdet-hdr-name">{contact.name ?? '—'}</div>
                <div className="crmdet-hdr-email">{contact.email}</div>
                {(contact.company || contact.role) && (
                  <div className="crmdet-hdr-meta">
                    {[contact.role, contact.company].filter(Boolean).join(' @ ')}
                  </div>
                )}
                <span
                  className="crmdet-lc-badge"
                  style={{ color: stageColor, border: `1px solid ${stageColor}33`, background: `${stageColor}0f` }}
                >
                  <span className="crmdet-lc-dot" style={{ background: stageColor }} aria-hidden="true" />
                  {lifecycle}
                </span>
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div className="crmdet-panel">
            <div className="crmdet-panel-header">Details</div>
            <div className="crmdet-panel-body">
              <div className="crmdet-fields">
                <EditableField label="Phone"   value={phone}   onChange={setPhone} />
                <EditableField label="Company" value={company} onChange={setCompany} />
                <EditableField label="Role"    value={role}    onChange={setRole} />
                <EditableField label="Source"  value={source}  onChange={setSource} />
              </div>

              <div className="crmdet-section-gap">
                <div className="crmdet-notes-label">Notes</div>
                <textarea
                  className="crmdet-notes-area"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this contact..."
                  aria-label="Contact notes"
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <button className="crmdet-save-btn" onClick={handleSave}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Division interest */}
          <div className="crmdet-panel">
            <div className="crmdet-panel-header">Division Interest</div>
            <div className="crmdet-panel-body">
              <div className="crmdet-div-grid">
                {ALL_DIVISIONS.map((div) => (
                  <label key={div} className="crmdet-div-check">
                    <input
                      type="checkbox"
                      checked={divisions.includes(div)}
                      onChange={() => toggleDivision(div)}
                      aria-label={`${div} division interest`}
                    />
                    <span
                      className="crmdet-div-check-dot"
                      style={{ background: DIVISION_COLORS[div] ?? '#6B7B9E' }}
                      aria-hidden="true"
                    />
                    <span style={{ textTransform: 'capitalize' }}>{div}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="crmdet-panel">
            <div className="crmdet-panel-header">Tags</div>
            <div className="crmdet-panel-body">
              {tags.length > 0 && (
                <div className="crmdet-tags-wrap">
                  {tags.map((tag) => (
                    <span key={tag} className="crmdet-tag-pill">
                      {tag}
                      <button
                        className="crmdet-tag-remove"
                        onClick={() => removeTag(tag)}
                        aria-label={`Remove tag ${tag}`}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="crmdet-tag-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
                  placeholder="Add tag, press Enter..."
                  aria-label="New tag"
                />
                <button
                  className="crmdet-save-btn"
                  style={{ padding: '8px 14px', fontSize: 12 }}
                  onClick={addTag}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="crmdet-panel">
            <div className="crmdet-panel-header" style={{ color: '#F87171' }}>Danger Zone</div>
            <div className="crmdet-panel-body">
              <p style={{ fontSize: 13, color: 'var(--adm-muted)', marginBottom: 14 }}>
                Archiving this contact will hide them from the CRM. This action can be undone.
              </p>
              <button className="crmdet-danger-btn">Archive Contact</button>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="crmdet-right">

          {/* Lifecycle stepper */}
          <div className="crmdet-panel">
            <div className="crmdet-panel-header">Lifecycle Stage</div>
            <div className="crmdet-panel-body" style={{ paddingTop: 12, paddingBottom: 12 }}>
              <div className="crmdet-stepper" role="group" aria-label="Lifecycle stage">
                {LIFECYCLE_STAGES.map((stage, i) => {
                  const currentIdx = lifecycle === 'churned' ? -1 : stageIndex(lifecycle);
                  const isActive = lifecycle !== 'churned' && lifecycle === stage;
                  const isPast   = lifecycle !== 'churned' && stageIndex(stage) < currentIdx;
                  const color    = LIFECYCLE_COLORS[stage];
                  return (
                    <div key={stage}>
                      {i > 0 && <div className="crmdet-step-sep" />}
                      <button
                        className={`crmdet-step${isActive ? ' active' : ''}${isPast ? ' past' : ''}`}
                        style={{ color: isActive || isPast ? color : 'var(--adm-muted)' }}
                        onClick={() => setLifecycle(stage)}
                        aria-pressed={isActive}
                      >
                        <div className="crmdet-step-circle">
                          {isPast && <span className="crmdet-step-check" aria-hidden="true" />}
                          {isActive && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </div>
                        <span className="crmdet-step-label">{stage}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                className="crmdet-churned-btn"
                style={{
                  color: lifecycle === 'churned' ? LIFECYCLE_COLORS.churned : 'var(--adm-muted)',
                  borderColor: lifecycle === 'churned' ? 'rgba(74,85,120,0.5)' : 'var(--adm-border)',
                }}
                onClick={() => setLifecycle(lifecycle === 'churned' ? 'lead' : 'churned')}
                aria-pressed={lifecycle === 'churned'}
              >
                <span
                  style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: LIFECYCLE_COLORS.churned,
                    display: 'inline-block', flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <span style={{ fontSize: 12, fontWeight: 500 }}>Mark as Churned</span>
              </button>
            </div>
          </div>

          {/* Submissions */}
          <div className="crmdet-panel">
            <div className="crmdet-panel-header">
              Submissions
              <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--adm-muted)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>
                {submissions.length}
              </span>
            </div>
            <div className="crmdet-panel-body" style={{ paddingTop: 12, paddingBottom: 12 }}>
              {submissions.length === 0 ? (
                <div className="crmdet-empty">No submissions yet</div>
              ) : (
                <div className="crmdet-list">
                  {submissions.map((sub) => {
                    const divColor = DIVISION_COLORS[sub.division] ?? '#6B7B9E';
                    const statusColor = STATUS_COLORS[sub.status] ?? '#6B7B9E';
                    return (
                      <div
                        key={sub.id}
                        className="crmdet-list-item"
                        role="button"
                        tabIndex={0}
                        onClick={() => router.push(`/admin/submissions?id=${sub.id}`)}
                        onKeyDown={(e) => e.key === 'Enter' && router.push(`/admin/submissions?id=${sub.id}`)}
                        aria-label={`View submission ${sub.type}`}
                      >
                        <div className="crmdet-list-body">
                          <div className="crmdet-list-title">{formatType(sub.type)}</div>
                          <div className="crmdet-list-meta">
                            <span
                              className="crmdet-div-badge"
                              style={{ color: divColor, border: `1px solid ${divColor}33` }}
                            >
                              {sub.division}
                            </span>
                            <span
                              className="crmdet-status-badge"
                              style={{ color: statusColor, border: `1px solid ${statusColor}33` }}
                            >
                              {sub.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="crmdet-list-time">{timeAgo(sub.created_at)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Tickets */}
          <div className="crmdet-panel">
            <div className="crmdet-panel-header">
              Tickets
              <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--adm-muted)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>
                {tickets.length}
              </span>
            </div>
            <div className="crmdet-panel-body" style={{ paddingTop: 12, paddingBottom: 12 }}>
              {tickets.length === 0 ? (
                <div className="crmdet-empty">No tickets</div>
              ) : (
                <div className="crmdet-list">
                  {tickets.map((ticket) => {
                    const priColor = PRIORITY_COLORS[ticket.priority] ?? '#6B7B9E';
                    const statusColor = STATUS_COLORS[ticket.status] ?? '#6B7B9E';
                    return (
                      <div key={ticket.id} className="crmdet-list-item" style={{ cursor: 'default' }}>
                        <div className="crmdet-list-body">
                          <div className="crmdet-list-title">{ticket.title}</div>
                          <div className="crmdet-list-meta">
                            <span
                              className="crmdet-div-badge"
                              style={{ color: priColor, border: `1px solid ${priColor}33` }}
                            >
                              {ticket.priority}
                            </span>
                            <span
                              className="crmdet-status-badge"
                              style={{ color: statusColor, border: `1px solid ${statusColor}33` }}
                            >
                              {ticket.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="crmdet-list-time">{timeAgo(ticket.created_at)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Activity */}
          <div className="crmdet-panel">
            <div className="crmdet-panel-header">Activity</div>
            <div className="crmdet-empty">No recent activity</div>
          </div>

        </div>
      </div>
    </div>
  );
}
