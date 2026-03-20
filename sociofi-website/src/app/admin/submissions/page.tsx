'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MOCK_SUBMISSIONS, MOCK_TEAM } from '@/lib/admin/mock-data';
import type { Submission, SubmissionStatus, Priority, Division } from '@/lib/supabase/types';

// ── Types ──────────────────────────────────────────────────────────────────

type LocalSubmission = Submission & {
  _localStatus?: SubmissionStatus;
  _localPriority?: Priority;
  _localNotes?: string;
};

// ── Styles ─────────────────────────────────────────────────────────────────

const STYLES = `
  /* ── Filter Bar ── */
  .sub-filter-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .sub-tabs {
    display: flex;
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 10px;
    padding: 3px;
    gap: 2px;
    flex-shrink: 0;
  }
  .sub-tab {
    padding: 5px 12px;
    border-radius: 8px;
    border: none;
    background: none;
    font-size: 12.5px; font-weight: 500;
    color: #6B7B9E;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .sub-tab:hover { color: #E2E8F0; background: rgba(255,255,255,0.04); }
  .sub-tab.active {
    background: rgba(58,88,158,0.25);
    color: #A8BFFF;
  }
  .sub-tab-count {
    display: inline-flex; align-items: center; justify-content: center;
    margin-left: 5px;
    background: rgba(89,163,146,0.12);
    color: #72C4B2;
    font-size: 10px; font-weight: 600;
    min-width: 16px; height: 16px;
    border-radius: 100px;
    padding: 0 4px;
    font-family: 'JetBrains Mono', monospace;
  }

  .sub-select {
    height: 34px;
    padding: 0 10px;
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 9px;
    color: #94A3B8;
    font-size: 12.5px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236B7B9E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 28px;
  }
  .sub-select:hover, .sub-select:focus { border-color: rgba(89,163,146,0.2); color: #E2E8F0; }

  .sub-search {
    flex: 1;
    min-width: 180px;
    max-width: 300px;
    height: 34px;
    padding: 0 12px 0 34px;
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 9px;
    color: #E2E8F0;
    font-size: 12.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s;
    position: relative;
  }
  .sub-search::placeholder { color: #4A5578; }
  .sub-search:focus { border-color: rgba(89,163,146,0.2); }
  .sub-search-wrap {
    position: relative;
    flex: 1;
    min-width: 180px;
    max-width: 300px;
  }
  .sub-search-icon {
    position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
    pointer-events: none;
    color: #4A5578;
  }

  /* ── Bulk Actions Bar ── */
  .sub-bulk-bar {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 16px;
    background: rgba(58,88,158,0.12);
    border: 1px solid rgba(58,88,158,0.2);
    border-radius: 10px;
    margin-bottom: 12px;
    animation: subSlideDown 0.2s ease;
  }
  @keyframes subSlideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sub-bulk-count {
    font-size: 12.5px; font-weight: 600;
    color: #7B9FE8;
    font-family: 'JetBrains Mono', monospace;
    flex: 1;
  }
  .sub-bulk-btn {
    padding: 5px 12px;
    border-radius: 7px;
    border: 1px solid rgba(89,163,146,0.12);
    background: none;
    color: #94A3B8;
    font-size: 12px; font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .sub-bulk-btn:hover { border-color: rgba(89,163,146,0.25); color: #E2E8F0; background: rgba(255,255,255,0.03); }
  .sub-bulk-btn.danger:hover { border-color: rgba(248,113,113,0.25); color: #F87171; }

  /* ── Table ── */
  .sub-table {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    overflow: hidden;
  }
  .sub-table-head {
    display: grid;
    grid-template-columns: 36px 2fr 1fr 1fr 1fr 1fr 1fr 80px;
    padding: 10px 16px;
    border-bottom: 1px solid rgba(89,163,146,0.06);
    font-size: 10.5px; font-weight: 600;
    color: #4A5578; text-transform: uppercase; letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
    align-items: center;
    gap: 8px;
  }
  @media (max-width: 1024px) {
    .sub-table-head { grid-template-columns: 36px 2fr 1fr 1fr 1fr 80px; }
    .sub-col-type, .sub-col-assigned { display: none; }
  }
  @media (max-width: 768px) {
    .sub-table-head { display: none; }
  }

  .sub-table-row {
    display: grid;
    grid-template-columns: 36px 2fr 1fr 1fr 1fr 1fr 1fr 80px;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(89,163,146,0.04);
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .sub-table-row:hover { background: rgba(255,255,255,0.02); }
  .sub-table-row:last-child { border-bottom: none; }
  .sub-table-row.selected { background: rgba(58,88,158,0.07); }
  @media (max-width: 1024px) {
    .sub-table-row { grid-template-columns: 36px 2fr 1fr 1fr 1fr 80px; }
  }
  @media (max-width: 768px) {
    .sub-table-row {
      grid-template-columns: 36px 1fr auto;
      grid-template-rows: auto auto;
    }
  }

  .sub-checkbox {
    width: 15px; height: 15px;
    border-radius: 4px;
    border: 1.5px solid rgba(89,163,146,0.2);
    background: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    transition: all 0.15s;
    position: relative;
    flex-shrink: 0;
  }
  .sub-checkbox:checked {
    background: #3A589E;
    border-color: #3A589E;
  }
  .sub-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 3px; top: 1px;
    width: 6px; height: 9px;
    border: 2px solid white;
    border-top: none; border-left: none;
    transform: rotate(45deg);
  }

  .sub-contact-name {
    color: #E2E8F0; font-weight: 500; font-size: 13.5px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sub-contact-company {
    color: #6B7B9E; font-size: 11.5px; margin-top: 1px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .sub-division-pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11.5px; font-weight: 500;
    color: #94A3B8;
    white-space: nowrap;
  }
  .sub-div-dot {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  }

  .sub-type-text {
    font-size: 11.5px; color: #6B7B9E;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .sub-badge {
    display: inline-flex; align-items: center;
    padding: 3px 9px; border-radius: 100px;
    font-size: 10.5px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase; letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .badge-new        { background: rgba(58,88,158,0.2);    color: #7B9FE8; }
  .badge-reviewed   { background: rgba(89,163,146,0.15);  color: #72C4B2; }
  .badge-in_progress{ background: rgba(232,184,77,0.15);  color: #E8B84D; }
  .badge-converted  { background: rgba(74,222,128,0.12);  color: #4ADE80; }
  .badge-closed     { background: rgba(107,123,158,0.15); color: #6B7B9E; }
  .badge-archived   { background: rgba(107,123,158,0.1);  color: #4A5578; }
  .badge-urgent     { background: rgba(239,68,68,0.15);   color: #F87171; }
  .badge-high       { background: rgba(232,145,111,0.15); color: #E8916F; }
  .badge-normal     { background: rgba(58,88,158,0.15);   color: #7B9FE8; }
  .badge-low        { background: rgba(107,123,158,0.1);  color: #6B7B9E; }

  .sub-assigned-circle {
    width: 24px; height: 24px; border-radius: 50%;
    background: linear-gradient(135deg, #3A589E, #59A392);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 9px; color: white;
  }
  .sub-unassigned {
    font-size: 11px; color: #4A5578;
    font-family: 'JetBrains Mono', monospace;
  }

  .sub-time {
    font-size: 11px; color: #4A5578;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
  }

  /* ── Empty State ── */
  .sub-empty {
    padding: 64px 24px;
    text-align: center;
  }
  .sub-empty-icon {
    width: 48px; height: 48px;
    background: rgba(89,163,146,0.06);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    color: #4A5578;
  }
  .sub-empty-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 15px;
    color: #E2E8F0; margin-bottom: 6px;
  }
  .sub-empty-sub {
    font-size: 13px; color: #4A5578;
  }

  /* ── Slide Panel ── */
  .sub-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(3px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }
  .sub-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  .sub-panel {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 400;
    width: 420px;
    background: #111128;
    border-left: 1px solid rgba(89,163,146,0.1);
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }
  .sub-panel.open { transform: translateX(0); }
  @media (max-width: 500px) {
    .sub-panel { width: 100%; }
  }

  .sub-panel-header {
    padding: 18px 20px;
    border-bottom: 1px solid rgba(89,163,146,0.08);
    display: flex; align-items: center; gap: 12px;
    background: #0F0F24;
    flex-shrink: 0;
  }
  .sub-panel-close {
    width: 32px; height: 32px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #6B7B9E;
    margin-left: auto;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .sub-panel-close:hover { border-color: rgba(89,163,146,0.2); color: #E2E8F0; background: rgba(255,255,255,0.08); }

  .sub-panel-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 15px;
    color: #E2E8F0; letter-spacing: -0.015em;
  }
  .sub-panel-sub {
    font-size: 12px; color: #6B7B9E;
    font-family: 'JetBrains Mono', monospace;
    margin-top: 2px;
  }

  .sub-panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    scrollbar-width: thin;
    scrollbar-color: rgba(89,163,146,0.1) transparent;
  }
  .sub-panel-body::-webkit-scrollbar { width: 3px; }
  .sub-panel-body::-webkit-scrollbar-thumb { background: rgba(89,163,146,0.1); border-radius: 2px; }

  .sub-panel-section {
    margin-bottom: 24px;
  }
  .sub-panel-section-title {
    font-size: 10.5px; font-weight: 600;
    color: #4A5578; text-transform: uppercase; letter-spacing: 0.1em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 10px;
  }

  .sub-contact-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(89,163,146,0.07);
    border-radius: 10px;
    padding: 14px;
  }
  .sub-contact-name-lg {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 15px;
    color: #E2E8F0; margin-bottom: 6px;
  }
  .sub-contact-row {
    display: flex; align-items: center; gap: 7px;
    font-size: 12px; color: #6B7B9E;
    margin-bottom: 3px;
    font-family: 'DM Sans', sans-serif;
  }
  .sub-contact-row svg { color: #4A5578; flex-shrink: 0; }

  .sub-kv-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .sub-kv-item {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(89,163,146,0.06);
    border-radius: 8px;
    padding: 8px 10px;
  }
  .sub-kv-key {
    font-size: 10px; font-weight: 600;
    color: #4A5578; text-transform: uppercase; letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 3px;
  }
  .sub-kv-value {
    font-size: 12.5px; color: #C8D4E8;
    word-break: break-word;
  }
  .sub-kv-item.wide { grid-column: 1 / -1; }

  .sub-source-row {
    font-size: 11.5px; color: #6B7B9E;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 4px;
    word-break: break-all;
  }
  .sub-source-label { color: #4A5578; margin-right: 6px; }

  .sub-field-label {
    font-size: 11px; font-weight: 600;
    color: #4A5578; text-transform: uppercase; letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 6px;
    display: block;
  }
  .sub-field-select {
    width: 100%;
    height: 34px;
    padding: 0 10px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 8px;
    color: #E2E8F0;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236B7B9E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 28px;
    margin-bottom: 14px;
  }
  .sub-field-select:focus { border-color: rgba(89,163,146,0.25); }

  .sub-notes-area {
    width: 100%;
    min-height: 80px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 8px;
    color: #E2E8F0;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    resize: vertical;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  .sub-notes-area::placeholder { color: #4A5578; }
  .sub-notes-area:focus { border-color: rgba(89,163,146,0.25); }

  .sub-panel-footer {
    padding: 16px 20px;
    border-top: 1px solid rgba(89,163,146,0.08);
    display: flex; flex-direction: column; gap: 10px;
    flex-shrink: 0;
    background: #0F0F24;
  }
  .sub-convert-btn {
    width: 100%;
    padding: 11px 0;
    background: linear-gradient(135deg, #3A589E, #59A392);
    border: none;
    border-radius: 10px;
    color: white;
    font-family: 'Manrope', sans-serif;
    font-size: 13.5px; font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    letter-spacing: -0.01em;
  }
  .sub-convert-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .sub-view-contact-link {
    display: block; text-align: center;
    font-size: 12px; color: #6B7B9E;
    text-decoration: none;
    font-family: 'JetBrains Mono', monospace;
    transition: color 0.15s;
  }
  .sub-view-contact-link:hover { color: #72C4B2; }

  /* ── Lifecycle badge ── */
  .sub-lifecycle {
    display: inline-flex; align-items: center;
    padding: 3px 9px; border-radius: 100px;
    font-size: 10.5px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase; letter-spacing: 0.04em;
    background: rgba(58,88,158,0.15); color: #7B9FE8;
  }
  .lc-qualified  { background: rgba(89,163,146,0.15); color: #72C4B2; }
  .lc-opportunity{ background: rgba(232,184,77,0.15); color: #E8B84D; }
  .lc-client     { background: rgba(74,222,128,0.12); color: #4ADE80; }
  .lc-churned    { background: rgba(248,113,113,0.12); color: #F87171; }
`;

// ── Helper Functions ────────────────────────────────────────────────────────

function timeSince(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

const DIVISION_COLORS: Record<string, string> = {
  studio:   '#72C4B2',
  agents:   '#8B5CF6',
  services: '#4DBFA8',
  cloud:    '#5BB5E0',
  academy:  '#E8B84D',
  ventures: '#6BA3E8',
  labs:     '#7B6FE8',
  parent:   '#4A6CB8',
};

function assigneeInitials(assignedTo?: string): string | null {
  if (!assignedTo) return null;
  const tm = MOCK_TEAM.find((t) => t.id === assignedTo);
  return tm?.initials ?? assignedTo.slice(0, 2).toUpperCase();
}

const STATUS_OPTIONS: SubmissionStatus[] = ['new', 'reviewed', 'in_progress', 'converted', 'closed', 'archived'];
const PRIORITY_OPTIONS: Priority[] = ['low', 'normal', 'high', 'urgent'];

// ── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`sub-badge badge-${status}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`sub-badge badge-${priority}`}>{priority}</span>
  );
}

function LifecycleBadge({ stage }: { stage: string }) {
  return (
    <span className={`sub-lifecycle lc-${stage}`}>{stage}</span>
  );
}

// ── Detail Panel ───────────────────────────────────────────────────────────

function DetailPanel({
  sub,
  onClose,
  onStatusChange,
  onPriorityChange,
  onNotesChange,
}: {
  sub: LocalSubmission | null;
  onClose: () => void;
  onStatusChange: (id: string, status: SubmissionStatus) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  onNotesChange: (id: string, notes: string) => void;
}) {
  const isOpen = sub !== null;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const currentStatus = sub?._localStatus ?? sub?.status ?? 'new';
  const currentPriority = sub?._localPriority ?? sub?.priority ?? 'normal';
  const currentNotes = sub?._localNotes ?? sub?.notes ?? '';

  const dataEntries = sub
    ? Object.entries(sub.data).filter(([, v]) => v !== null && v !== undefined && v !== '')
    : [];

  return (
    <>
      <div
        className={`sub-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`sub-panel${isOpen ? ' open' : ''}`}
        aria-label="Submission details"
        role="complementary"
      >
        {sub && (
          <>
            <div className="sub-panel-header">
              <div>
                <div className="sub-panel-title">
                  {sub.contact?.name ?? (sub.data.name as string) ?? 'Submission'}
                </div>
                <div className="sub-panel-sub">{sub.type} · {sub.division}</div>
              </div>
              <button
                className="sub-panel-close"
                onClick={onClose}
                aria-label="Close panel"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="sub-panel-body">
              {/* Contact info */}
              <div className="sub-panel-section">
                <div className="sub-panel-section-title">Contact</div>
                <div className="sub-contact-card">
                  <div className="sub-contact-name-lg">
                    {sub.contact?.name ?? (sub.data.name as string) ?? '—'}
                    {sub.contact?.lifecycle_stage && (
                      <span style={{ marginLeft: 8 }}>
                        <LifecycleBadge stage={sub.contact.lifecycle_stage} />
                      </span>
                    )}
                  </div>
                  {(sub.contact?.email ?? (sub.data.email as string | undefined)) && (
                    <div className="sub-contact-row">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                      {sub.contact?.email ?? (sub.data.email as string)}
                    </div>
                  )}
                  {sub.contact?.company && (
                    <div className="sub-contact-row">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                      </svg>
                      {sub.contact.company}
                    </div>
                  )}
                  {sub.contact?.phone && (
                    <div className="sub-contact-row">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.72 16z"/>
                      </svg>
                      {sub.contact.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Form data */}
              {dataEntries.length > 0 && (
                <div className="sub-panel-section">
                  <div className="sub-panel-section-title">Submission Data</div>
                  <div className="sub-kv-grid">
                    {dataEntries.map(([key, val]) => {
                      const strVal = String(val);
                      const isLong = strVal.length > 40;
                      return (
                        <div key={key} className={`sub-kv-item${isLong ? ' wide' : ''}`}>
                          <div className="sub-kv-key">{key.replace(/_/g, ' ')}</div>
                          <div className="sub-kv-value">{strVal}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Source / UTM */}
              <div className="sub-panel-section">
                <div className="sub-panel-section-title">Source</div>
                {sub.source_url && (
                  <div className="sub-source-row">
                    <span className="sub-source-label">URL</span>{sub.source_url}
                  </div>
                )}
                {sub.utm_source && (
                  <div className="sub-source-row">
                    <span className="sub-source-label">Source</span>{sub.utm_source}
                    {sub.utm_medium && <> · <span className="sub-source-label">Medium</span>{sub.utm_medium}</>}
                    {sub.utm_campaign && <> · <span className="sub-source-label">Campaign</span>{sub.utm_campaign}</>}
                  </div>
                )}
              </div>

              {/* Status + Priority */}
              <div className="sub-panel-section">
                <div className="sub-panel-section-title">Status &amp; Priority</div>
                <label className="sub-field-label" htmlFor="panel-status">Status</label>
                <select
                  id="panel-status"
                  className="sub-field-select"
                  value={currentStatus}
                  onChange={(e) => onStatusChange(sub.id, e.target.value as SubmissionStatus)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>

                <label className="sub-field-label" htmlFor="panel-priority">Priority</label>
                <select
                  id="panel-priority"
                  className="sub-field-select"
                  value={currentPriority}
                  onChange={(e) => onPriorityChange(sub.id, e.target.value as Priority)}
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="sub-panel-section">
                <div className="sub-panel-section-title">Notes</div>
                <textarea
                  className="sub-notes-area"
                  placeholder="Add internal notes..."
                  value={currentNotes}
                  onChange={(e) => onNotesChange(sub.id, e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="sub-panel-footer">
              {currentStatus !== 'converted' && (
                <button
                  className="sub-convert-btn"
                  onClick={() => onStatusChange(sub.id, 'converted')}
                >
                  Mark Converted
                </button>
              )}
              <Link
                href={`/admin/contacts/${sub.contact_id}`}
                className="sub-view-contact-link"
              >
                View Contact Profile →
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

type StatusFilter = SubmissionStatus | 'all';
type DivisionFilter = Division | 'all';
type PriorityFilter = Priority | 'all';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<LocalSubmission[]>(
    MOCK_SUBMISSIONS as LocalSubmission[],
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [divisionFilter, setDivisionFilter] = useState<DivisionFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeSub, setActiveSub] = useState<LocalSubmission | null>(null);

  // Filtering
  const filtered = submissions.filter((sub) => {
    const effectiveStatus = sub._localStatus ?? sub.status;
    if (statusFilter !== 'all' && effectiveStatus !== statusFilter) return false;
    if (divisionFilter !== 'all' && sub.division !== divisionFilter) return false;
    if (priorityFilter !== 'all') {
      const effectivePriority = sub._localPriority ?? sub.priority;
      if (effectivePriority !== priorityFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const name = (sub.contact?.name ?? (sub.data.name as string) ?? '').toLowerCase();
      const email = (sub.contact?.email ?? (sub.data.email as string) ?? '').toLowerCase();
      const company = (sub.contact?.company ?? (sub.data.company as string) ?? '').toLowerCase();
      if (!name.includes(q) && !email.includes(q) && !company.includes(q)) return false;
    }
    return true;
  });

  // Count per status for tabs
  const countForStatus = (s: StatusFilter): number => {
    if (s === 'all') return submissions.length;
    return submissions.filter((sub) => (sub._localStatus ?? sub.status) === s).length;
  };

  // Selection
  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((s) => s.id)));
    }
  };

  // Bulk actions
  const bulkMarkReviewed = () => {
    setSubmissions((prev) =>
      prev.map((s) =>
        selected.has(s.id) ? { ...s, _localStatus: 'reviewed' as SubmissionStatus } : s,
      ),
    );
    setSelected(new Set());
  };

  const bulkArchive = () => {
    setSubmissions((prev) =>
      prev.map((s) =>
        selected.has(s.id) ? { ...s, _localStatus: 'archived' as SubmissionStatus } : s,
      ),
    );
    setSelected(new Set());
  };

  // Panel mutation handlers
  const handleStatusChange = useCallback((id: string, status: SubmissionStatus) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, _localStatus: status } : s)),
    );
    setActiveSub((prev) => (prev?.id === id ? { ...prev, _localStatus: status } : prev));
  }, []);

  const handlePriorityChange = useCallback((id: string, priority: Priority) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, _localPriority: priority } : s)),
    );
    setActiveSub((prev) => (prev?.id === id ? { ...prev, _localPriority: priority } : prev));
  }, []);

  const handleNotesChange = useCallback((id: string, notes: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, _localNotes: notes } : s)),
    );
    setActiveSub((prev) => (prev?.id === id ? { ...prev, _localNotes: notes } : prev));
  }, []);

  const handleClose = useCallback(() => setActiveSub(null), []);

  const STATUS_TABS: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'reviewed', label: 'Reviewed' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'converted', label: 'Converted' },
    { key: 'closed', label: 'Closed' },
  ];

  const DIVISION_OPTIONS: { value: DivisionFilter; label: string }[] = [
    { value: 'all', label: 'All Divisions' },
    { value: 'studio', label: 'Studio' },
    { value: 'agents', label: 'Agents' },
    { value: 'services', label: 'Services' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'academy', label: 'Academy' },
    { value: 'ventures', label: 'Ventures' },
    { value: 'labs', label: 'Labs' },
    { value: 'parent', label: 'Parent' },
  ];

  const PRIORITY_OPTS: { value: PriorityFilter; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'normal', label: 'Normal' },
    { value: 'low', label: 'Low' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── Filter Bar ── */}
      <div className="sub-filter-bar">
        <div className="sub-tabs" role="tablist" aria-label="Filter by status">
          {STATUS_TABS.map(({ key, label }) => {
            const count = countForStatus(key);
            return (
              <button
                key={key}
                role="tab"
                aria-selected={statusFilter === key}
                className={`sub-tab${statusFilter === key ? ' active' : ''}`}
                onClick={() => { setStatusFilter(key); setSelected(new Set()); }}
              >
                {label}
                {count > 0 && <span className="sub-tab-count">{count}</span>}
              </button>
            );
          })}
        </div>

        <select
          className="sub-select"
          value={divisionFilter}
          onChange={(e) => { setDivisionFilter(e.target.value as DivisionFilter); setSelected(new Set()); }}
          aria-label="Filter by division"
        >
          {DIVISION_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          className="sub-select"
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value as PriorityFilter); setSelected(new Set()); }}
          aria-label="Filter by priority"
        >
          {PRIORITY_OPTS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <div className="sub-search-wrap">
          <svg
            className="sub-search-icon"
            width="13" height="13"
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            className="sub-search"
            placeholder="Search name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search submissions"
          />
        </div>
      </div>

      {/* ── Bulk Actions Bar ── */}
      {selected.size > 0 && (
        <div className="sub-bulk-bar" role="toolbar" aria-label="Bulk actions">
          <span className="sub-bulk-count">{selected.size} selected</span>
          <button className="sub-bulk-btn" onClick={bulkMarkReviewed}>Mark Reviewed</button>
          <button className="sub-bulk-btn" onClick={() => setSelected(new Set())}>Assign to...</button>
          <button className="sub-bulk-btn danger" onClick={bulkArchive}>Archive</button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="sub-table" role="grid" aria-label="Submissions">
        <div className="sub-table-head" role="row">
          <div role="columnheader">
            <input
              type="checkbox"
              className="sub-checkbox"
              checked={selected.size === filtered.length && filtered.length > 0}
              onChange={toggleSelectAll}
              aria-label="Select all"
            />
          </div>
          <div role="columnheader">Contact</div>
          <div role="columnheader">Division</div>
          <div role="columnheader" className="sub-col-type">Type</div>
          <div role="columnheader">Status</div>
          <div role="columnheader">Priority</div>
          <div role="columnheader" className="sub-col-assigned">Assigned</div>
          <div role="columnheader">Time</div>
        </div>

        {filtered.length === 0 ? (
          <div className="sub-empty" role="row">
            <div className="sub-empty-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
              </svg>
            </div>
            <div className="sub-empty-title">No submissions found</div>
            <div className="sub-empty-sub">Try adjusting your filters or search query.</div>
          </div>
        ) : (
          filtered.map((sub) => {
            const effectiveStatus = sub._localStatus ?? sub.status;
            const effectivePriority = sub._localPriority ?? sub.priority;
            const initials = assigneeInitials(sub.assigned_to);
            const isSelected = selected.has(sub.id);
            const divColor = DIVISION_COLORS[sub.division] ?? '#4A6CB8';

            return (
              <div
                key={sub.id}
                role="row"
                className={`sub-table-row${isSelected ? ' selected' : ''}`}
                onClick={() => setActiveSub(sub)}
                aria-selected={isSelected}
              >
                <div role="gridcell" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="sub-checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    onClick={(e) => toggleSelect(sub.id, e)}
                    aria-label={`Select ${sub.contact?.name ?? sub.id}`}
                  />
                </div>

                <div role="gridcell">
                  <div className="sub-contact-name">
                    {sub.contact?.name ?? (sub.data.name as string) ?? '—'}
                  </div>
                  <div className="sub-contact-company">
                    {sub.contact?.email ?? (sub.data.email as string) ?? ''}
                  </div>
                </div>

                <div role="gridcell">
                  <div className="sub-division-pill">
                    <span
                      className="sub-div-dot"
                      style={{ background: divColor }}
                      aria-hidden="true"
                    />
                    {sub.division}
                  </div>
                </div>

                <div role="gridcell" className="sub-col-type">
                  <span className="sub-type-text">{sub.type}</span>
                </div>

                <div role="gridcell">
                  <StatusBadge status={effectiveStatus} />
                </div>

                <div role="gridcell">
                  <PriorityBadge priority={effectivePriority} />
                </div>

                <div role="gridcell" className="sub-col-assigned">
                  {initials ? (
                    <div className="sub-assigned-circle" title={sub.assigned_to ?? ''} aria-label={`Assigned to ${sub.assigned_to}`}>
                      {initials}
                    </div>
                  ) : (
                    <span className="sub-unassigned">—</span>
                  )}
                </div>

                <div role="gridcell">
                  <span className="sub-time">{timeSince(sub.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Slide-in Detail Panel ── */}
      <DetailPanel
        sub={activeSub}
        onClose={handleClose}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onNotesChange={handleNotesChange}
      />
    </>
  );
}
