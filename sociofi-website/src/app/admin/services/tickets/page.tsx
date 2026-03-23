'use client';

import React, { useState } from 'react';
import { LEGACY_MOCK_TICKETS as MOCK_TICKETS, LEGACY_MOCK_CONTACTS as MOCK_CONTACTS } from '@/lib/admin/mock-data';
import type { Ticket, TicketStatus, TicketPriority } from '@/lib/supabase/types';

/* ─────────────────────────────────────────
   Styles
───────────────────────────────────────── */
const STYLES = `
  /* ── SLA Banner ── */
  .tick-sla-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.25);
    border-radius: 12px;
    margin-bottom: 20px;
    font-size: 13.5px;
    color: #FCA5A5;
    font-family: 'DM Sans', sans-serif;
  }
  .tick-sla-banner svg { flex-shrink: 0; }
  .tick-sla-banner a {
    margin-left: auto;
    color: #F87171;
    font-weight: 600;
    text-decoration: underline;
    font-size: 12px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }
  .tick-sla-banner a:hover { color: #FCA5A5; }

  /* ── Stats Row ── */
  .tick-stats-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 22px;
  }
  .tick-stat-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 10px;
    font-size: 12.5px;
  }
  .tick-stat-chip-label {
    color: #6B7B9E;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .tick-stat-chip-value {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #E2E8F0;
  }
  .tick-stat-chip-value.red { color: #F87171; }
  .tick-stat-chip-value.teal { color: #59A392; }

  /* ── Filter Tabs ── */
  .tick-filter-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }
  .tick-filter-tab {
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 12.5px;
    font-weight: 500;
    border: 1px solid rgba(89,163,146,0.08);
    background: transparent;
    color: #6B7B9E;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .tick-filter-tab:hover {
    color: #E2E8F0;
    border-color: rgba(89,163,146,0.18);
  }
  .tick-filter-tab.active {
    background: rgba(58,88,158,0.15);
    border-color: rgba(58,88,158,0.4);
    color: #E2E8F0;
  }
  .tick-filter-sep {
    width: 1px;
    height: 20px;
    background: rgba(89,163,146,0.1);
    margin: 0 2px;
  }

  /* ── Table Shell ── */
  .tick-table-wrap {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    overflow: hidden;
  }

  /* ── Table Row ── */
  .tick-row {
    display: grid;
    grid-template-columns: 72px 1fr 90px 110px 120px 110px 80px;
    gap: 0;
    align-items: center;
    border-bottom: 1px solid rgba(89,163,146,0.06);
    border-left: 3px solid transparent;
    cursor: pointer;
    transition: background 0.15s;
    min-height: 58px;
  }
  .tick-row:last-child { border-bottom: none; }
  .tick-row:hover { background: rgba(255,255,255,0.02); }
  .tick-row.p1 { border-left-color: #F87171; }
  .tick-row.p2 { border-left-color: #FB923C; }
  .tick-row.p3 { border-left-color: #FBBF24; }
  .tick-row.p4 { border-left-color: #6B7B9E; }
  .tick-row.expanded { background: rgba(58,88,158,0.06); }

  .tick-header-row {
    display: grid;
    grid-template-columns: 72px 1fr 90px 110px 120px 110px 80px;
    gap: 0;
    align-items: center;
    border-bottom: 1px solid rgba(89,163,146,0.1);
    border-left: 3px solid transparent;
    background: rgba(15,15,36,0.6);
  }

  .tick-cell {
    padding: 14px 14px;
    font-size: 13px;
    color: #E2E8F0;
  }
  .tick-header-cell {
    padding: 11px 14px;
    font-size: 10.5px;
    font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── Priority Badge ── */
  .tick-priority-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 9px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .tick-priority-badge.p1 { background: rgba(248,113,113,0.12); color: #F87171; }
  .tick-priority-badge.p2 { background: rgba(251,146,60,0.12); color: #FB923C; }
  .tick-priority-badge.p3 { background: rgba(251,191,36,0.12); color: #FBBF24; }
  .tick-priority-badge.p4 { background: rgba(107,123,158,0.12); color: #94A3B8; }

  /* ── Status Badge ── */
  .tick-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 100px;
    font-size: 11.5px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }
  .tick-status-badge::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .tick-status-badge.open { background: rgba(89,163,146,0.1); color: #59A392; }
  .tick-status-badge.open::before { background: #59A392; }
  .tick-status-badge.acknowledged { background: rgba(251,191,36,0.1); color: #FBBF24; }
  .tick-status-badge.acknowledged::before { background: #FBBF24; }
  .tick-status-badge.in_progress { background: rgba(58,88,158,0.15); color: #6BA3E8; }
  .tick-status-badge.in_progress::before { background: #6BA3E8; }
  .tick-status-badge.resolved { background: rgba(107,123,158,0.1); color: #94A3B8; }
  .tick-status-badge.resolved::before { background: #94A3B8; }
  .tick-status-badge.closed { background: rgba(107,123,158,0.08); color: #6B7B9E; }
  .tick-status-badge.closed::before { background: #6B7B9E; }

  /* ── SLA Countdown ── */
  .tick-sla-countdown {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #6B7B9E;
  }
  .tick-sla-countdown.overdue { color: #F87171; font-weight: 600; }
  .tick-sla-countdown.warning { color: #FBBF24; }
  .tick-sla-countdown.ok { color: #59A392; }

  /* ── Inline Expand ── */
  .tick-expand {
    background: rgba(12,12,29,0.7);
    border-bottom: 1px solid rgba(89,163,146,0.08);
    padding: 20px 20px 20px 23px;
    animation: tick-expand-in 0.18s ease;
  }
  @keyframes tick-expand-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .tick-expand-description {
    font-size: 13.5px;
    color: #CBD5E1;
    line-height: 1.65;
    margin-bottom: 18px;
    max-width: 680px;
  }

  .tick-expand-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }

  .tick-action-btn {
    padding: 7px 16px;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s;
    font-family: 'Manrope', sans-serif;
  }
  .tick-action-btn.acknowledge {
    background: rgba(251,191,36,0.1);
    border-color: rgba(251,191,36,0.25);
    color: #FBBF24;
  }
  .tick-action-btn.acknowledge:hover {
    background: rgba(251,191,36,0.18);
    border-color: rgba(251,191,36,0.4);
  }
  .tick-action-btn.in-progress {
    background: rgba(58,88,158,0.12);
    border-color: rgba(58,88,158,0.3);
    color: #6BA3E8;
  }
  .tick-action-btn.in-progress:hover {
    background: rgba(58,88,158,0.2);
    border-color: rgba(58,88,158,0.5);
  }
  .tick-action-btn.resolve {
    background: rgba(89,163,146,0.1);
    border-color: rgba(89,163,146,0.25);
    color: #59A392;
  }
  .tick-action-btn.resolve:hover {
    background: rgba(89,163,146,0.18);
    border-color: rgba(89,163,146,0.4);
  }
  .tick-action-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .tick-notes-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 520px;
  }
  .tick-notes-label {
    font-size: 11px;
    font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
  }
  .tick-notes-textarea {
    background: rgba(15,15,36,0.8);
    border: 1px solid rgba(89,163,146,0.12);
    border-radius: 10px;
    padding: 10px 13px;
    color: #E2E8F0;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    resize: vertical;
    min-height: 72px;
    transition: border-color 0.2s;
    width: 100%;
  }
  .tick-notes-textarea:focus {
    outline: none;
    border-color: rgba(89,163,146,0.3);
  }
  .tick-save-btn {
    align-self: flex-start;
    padding: 7px 16px;
    background: linear-gradient(135deg, #3A589E, #59A392);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Manrope', sans-serif;
    transition: opacity 0.15s;
  }
  .tick-save-btn:hover { opacity: 0.85; }

  .tick-resolved-notes {
    background: rgba(89,163,146,0.06);
    border: 1px solid rgba(89,163,146,0.12);
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 13px;
    color: #94A3B8;
    max-width: 520px;
  }
  .tick-resolved-notes-label {
    font-size: 10.5px;
    font-weight: 600;
    color: #59A392;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 6px;
  }

  /* ── Title column ── */
  .tick-title-col { min-width: 0; }
  .tick-title-text {
    font-weight: 600;
    font-size: 13.5px;
    color: #E2E8F0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
    font-family: 'Manrope', sans-serif;
  }
  .tick-desc-text {
    font-size: 12px;
    color: #6B7B9E;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Plan badge ── */
  .tick-plan-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #6B7B9E;
    text-transform: capitalize;
  }

  /* ── Assigned & Time ── */
  .tick-assigned {
    font-size: 12px;
    color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
  }
  .tick-time {
    font-size: 11.5px;
    color: #4A5578;
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── Legend ── */
  .tick-legend {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 18px;
    padding: 14px 18px;
    background: rgba(15,15,36,0.5);
    border: 1px solid rgba(89,163,146,0.06);
    border-radius: 12px;
  }
  .tick-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
  }
  .tick-legend-dot {
    width: 8px; height: 8px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .tick-legend-label {
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
  }

  /* ── Page header ── */
  .tick-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 16px;
  }
  .tick-page-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 22px;
    color: #E2E8F0;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .tick-page-sub {
    font-size: 13px;
    color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Empty state ── */
  .tick-empty {
    padding: 48px;
    text-align: center;
    color: #4A5578;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Chevron ── */
  .tick-chevron {
    color: #4A5578;
    transition: transform 0.18s;
    flex-shrink: 0;
  }
  .tick-chevron.open { transform: rotate(180deg); }

  @media (max-width: 900px) {
    .tick-row,
    .tick-header-row {
      grid-template-columns: 68px 1fr 90px 100px 90px;
    }
    .tick-cell-assigned,
    .tick-header-cell-assigned,
    .tick-cell-plan,
    .tick-header-cell-plan { display: none; }
  }
  @media (max-width: 600px) {
    .tick-row,
    .tick-header-row {
      grid-template-columns: 68px 1fr 90px;
    }
    .tick-cell-sla,
    .tick-header-cell-sla,
    .tick-cell-status,
    .tick-header-cell-status { display: none; }
  }
`;

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function fmtRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function slaCountdown(deadline: string): { label: string; cls: string } {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { label: 'OVERDUE', cls: 'overdue' };
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return { label: `${mins}m left`, cls: mins < 30 ? 'warning' : 'ok' };
  const hrs = Math.floor(mins / 60);
  return { label: `${hrs}h left`, cls: hrs < 2 ? 'warning' : 'ok' };
}

const PRIORITY_ORDER: Record<TicketPriority, number> = { p1: 0, p2: 1, p3: 2, p4: 3 };

const SLA_LABELS: Record<TicketPriority, string> = {
  p1: 'Critical — <1h SLA',
  p2: 'High — <4h SLA',
  p3: 'Normal — <24h SLA',
  p4: 'Low — <72h SLA',
};

const PRIORITY_COLORS: Record<TicketPriority, string> = {
  p1: '#F87171',
  p2: '#FB923C',
  p3: '#FBBF24',
  p4: '#6B7B9E',
};

type FilterMode =
  | 'all' | 'p1' | 'p2' | 'p3' | 'p4'
  | 'open' | 'in_progress' | 'resolved';

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */
function PriorityBadge({ p }: { p: TicketPriority }) {
  return (
    <span className={`tick-priority-badge ${p}`}>
      {p.toUpperCase()}
    </span>
  );
}

function StatusBadge({ s }: { s: TicketStatus }) {
  const labels: Record<TicketStatus, string> = {
    open: 'Open',
    acknowledged: 'Acknowledged',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  return (
    <span className={`tick-status-badge ${s}`}>
      {labels[s]}
    </span>
  );
}

function SlaCell({ deadline }: { deadline?: string }) {
  if (!deadline) return <span className="tick-sla-countdown">—</span>;
  const { label, cls } = slaCountdown(deadline);
  return <span className={`tick-sla-countdown ${cls}`}>{label}</span>;
}

/* ─────────────────────────────────────────
   Expanded Row
───────────────────────────────────────── */
function ExpandedRow({
  ticket,
  onStatusChange,
  onSaveNote,
}: {
  ticket: Ticket;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onSaveNote: (id: string, note: string) => void;
}) {
  const [note, setNote] = useState(ticket.resolution_notes ?? '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveNote(ticket.id, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isResolved = ticket.status === 'resolved' || ticket.status === 'closed';

  return (
    <div className="tick-expand">
      {ticket.description && (
        <p className="tick-expand-description">{ticket.description}</p>
      )}

      {!isResolved && (
        <div className="tick-expand-actions">
          <button
            className="tick-action-btn acknowledge"
            disabled={ticket.status === 'acknowledged'}
            onClick={() => onStatusChange(ticket.id, 'acknowledged')}
          >
            Acknowledge
          </button>
          <button
            className="tick-action-btn in-progress"
            disabled={ticket.status === 'in_progress'}
            onClick={() => onStatusChange(ticket.id, 'in_progress')}
          >
            Mark In Progress
          </button>
          <button
            className="tick-action-btn resolve"
            onClick={() => onStatusChange(ticket.id, 'resolved')}
          >
            Mark Resolved
          </button>
        </div>
      )}

      {isResolved ? (
        <div className="tick-resolved-notes">
          <div className="tick-resolved-notes-label">Resolution Notes</div>
          <p>{ticket.resolution_notes ?? 'No notes recorded.'}</p>
          {ticket.resolved_at && (
            <p style={{ marginTop: 6, fontSize: 11, color: '#4A5578', fontFamily: "'JetBrains Mono', monospace" }}>
              Resolved {fmtRelative(ticket.resolved_at)}
            </p>
          )}
        </div>
      ) : (
        <div className="tick-notes-area">
          <div className="tick-notes-label">Resolution Notes</div>
          <textarea
            className="tick-notes-textarea"
            placeholder="Add resolution notes..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button className="tick-save-btn" onClick={handleSave}>
            {saved ? 'Saved!' : 'Save Note'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterMode>('all');

  /* SLA breached P1s that aren't acknowledged */
  const p1Breaching = tickets.filter(
    (t) => t.priority === 'p1' && !t.acknowledged_at,
  );

  /* Stats */
  const stats = {
    open: tickets.filter((t) => t.status === 'open').length,
    acknowledged: tickets.filter((t) => t.status === 'acknowledged').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    sla_breached: tickets.filter(
      (t) => t.sla_response_deadline && new Date(t.sla_response_deadline).getTime() < Date.now() && t.status !== 'resolved' && t.status !== 'closed',
    ).length,
  };

  /* Filtered + sorted tickets */
  const filtered = tickets
    .filter((t) => {
      if (filter === 'all') return true;
      if (filter === 'p1' || filter === 'p2' || filter === 'p3' || filter === 'p4') return t.priority === filter;
      return t.status === filter;
    })
    .sort((a, b) => {
      const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (pDiff !== 0) return pDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleStatusChange = (id: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              acknowledged_at: status === 'acknowledged' ? new Date().toISOString() : t.acknowledged_at,
              resolved_at: status === 'resolved' ? new Date().toISOString() : t.resolved_at,
              updated_at: new Date().toISOString(),
            }
          : t,
      ),
    );
  };

  const handleSaveNote = (id: string, note: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, resolution_notes: note, updated_at: new Date().toISOString() } : t)),
    );
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const FILTERS: { key: FilterMode; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'p1', label: 'P1' },
    { key: 'p2', label: 'P2' },
    { key: 'p3', label: 'P3' },
    { key: 'p4', label: 'P4' },
  ];
  const STATUS_FILTERS: { key: FilterMode; label: string }[] = [
    { key: 'open', label: 'Open' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Page Header */}
      <div className="tick-page-header">
        <div>
          <h1 className="tick-page-title">Services Tickets</h1>
          <p className="tick-page-sub">{tickets.length} tickets total — sorted by priority</p>
        </div>
      </div>

      {/* SLA Banner */}
      {p1Breaching.length > 0 && (
        <div className="tick-sla-banner" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>
            <strong>{p1Breaching.length} P1 ticket{p1Breaching.length > 1 ? 's' : ''} breaching SLA</strong>
            {' '}— Acknowledge immediately
          </span>
          <button
            onClick={() => {
              setFilter('p1');
              setExpanded(p1Breaching[0]?.id ?? null);
            }}
          >
            View →
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="tick-stats-row">
        <div className="tick-stat-chip">
          <span className="tick-stat-chip-label">Open</span>
          <span className="tick-stat-chip-value teal">{stats.open}</span>
        </div>
        <div className="tick-stat-chip">
          <span className="tick-stat-chip-label">Acknowledged</span>
          <span className="tick-stat-chip-value">{stats.acknowledged}</span>
        </div>
        <div className="tick-stat-chip">
          <span className="tick-stat-chip-label">In Progress</span>
          <span className="tick-stat-chip-value">{stats.in_progress}</span>
        </div>
        <div className="tick-stat-chip">
          <span className="tick-stat-chip-label">SLA Breached</span>
          <span className={`tick-stat-chip-value${stats.sla_breached > 0 ? ' red' : ''}`}>
            {stats.sla_breached}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tick-filter-bar" role="tablist" aria-label="Filter tickets">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`tick-filter-tab${filter === f.key ? ' active' : ''}`}
            onClick={() => setFilter(f.key)}
            role="tab"
            aria-selected={filter === f.key}
          >
            {f.label}
          </button>
        ))}
        <div className="tick-filter-sep" aria-hidden="true" />
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            className={`tick-filter-tab${filter === f.key ? ' active' : ''}`}
            onClick={() => setFilter(f.key)}
            role="tab"
            aria-selected={filter === f.key}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="tick-table-wrap" role="table" aria-label="Tickets">
        {/* Header */}
        <div className="tick-header-row" role="row">
          <div className="tick-header-cell" role="columnheader">Priority</div>
          <div className="tick-header-cell" role="columnheader">Ticket</div>
          <div className="tick-header-cell tick-header-cell-plan" role="columnheader">Plan</div>
          <div className="tick-header-cell tick-header-cell-status" role="columnheader">Status</div>
          <div className="tick-header-cell tick-header-cell-sla" role="columnheader">SLA</div>
          <div className="tick-header-cell tick-header-cell-assigned" role="columnheader">Assigned</div>
          <div className="tick-header-cell" role="columnheader">Age</div>
        </div>

        {filtered.length === 0 && (
          <div className="tick-empty">No tickets match this filter.</div>
        )}

        {filtered.map((ticket) => {
          const contact = MOCK_CONTACTS.find((c) => c.id === ticket.contact_id);
          const isExpanded = expanded === ticket.id;

          return (
            <React.Fragment key={ticket.id}>
              <div
                className={`tick-row ${ticket.priority}${isExpanded ? ' expanded' : ''}`}
                role="row"
                onClick={() => toggleExpand(ticket.id)}
                aria-expanded={isExpanded}
                style={{ cursor: 'pointer' }}
              >
                {/* Priority */}
                <div className="tick-cell" role="cell">
                  <PriorityBadge p={ticket.priority} />
                </div>

                {/* Title + description */}
                <div className="tick-cell tick-title-col" role="cell">
                  <div className="tick-title-text" title={ticket.title}>{ticket.title}</div>
                  {ticket.description && (
                    <div className="tick-desc-text">
                      {contact?.company ? `${contact.company} — ` : ''}
                      {ticket.description.slice(0, 80)}{ticket.description.length > 80 ? '…' : ''}
                    </div>
                  )}
                </div>

                {/* Plan */}
                <div className="tick-cell tick-cell-plan" role="cell">
                  <span className="tick-plan-badge">{ticket.plan ?? '—'}</span>
                </div>

                {/* Status */}
                <div className="tick-cell tick-cell-status" role="cell">
                  <StatusBadge s={ticket.status} />
                </div>

                {/* SLA */}
                <div className="tick-cell tick-cell-sla" role="cell">
                  <SlaCell deadline={ticket.sla_response_deadline} />
                </div>

                {/* Assigned */}
                <div className="tick-cell tick-cell-assigned" role="cell">
                  <span className="tick-assigned">{contact?.name ?? '—'}</span>
                </div>

                {/* Age + chevron */}
                <div className="tick-cell" role="cell" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="tick-time">{fmtRelative(ticket.created_at)}</span>
                  <svg
                    className={`tick-chevron${isExpanded ? ' open' : ''}`}
                    width="14" height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Inline Expansion */}
              {isExpanded && (
                <div role="region" aria-label={`Details for ${ticket.title}`}>
                  <ExpandedRow
                    ticket={ticket}
                    onStatusChange={handleStatusChange}
                    onSaveNote={handleSaveNote}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Priority Legend */}
      <div className="tick-legend" aria-label="Priority legend">
        {(Object.entries(SLA_LABELS) as [TicketPriority, string][]).map(([p, label]) => (
          <div key={p} className="tick-legend-item">
            <div
              className="tick-legend-dot"
              style={{ background: PRIORITY_COLORS[p] }}
              aria-hidden="true"
            />
            <span className="tick-legend-label">{p.toUpperCase()}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
