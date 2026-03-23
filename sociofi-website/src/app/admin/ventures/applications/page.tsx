'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_VENTURES_APPLICATIONS } from '@/lib/admin/mock-data';
import {
  APPLICATION_STATUS_COLORS,
  VALIDATION_COLORS,
  PARTNERSHIP_LABELS,
  type ApplicationStatus,
  type ValidationStatus,
} from '@/lib/admin/types';

/* ─────────────────────────────────────────
   Styles
───────────────────────────────────────── */
const STYLES = `
  .va-list-page { }

  /* ── Header ── */
  .va-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 16px;
    flex-wrap: wrap;
  }
  .va-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 22px;
    color: #E2E8F0;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .va-subtitle {
    font-size: 13px;
    color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
  }
  .va-btn-ghost {
    padding: 8px 18px;
    border-radius: 10px;
    border: 1.5px solid rgba(255,255,255,0.08);
    background: transparent;
    color: #94A3B8;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Manrope', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .va-btn-ghost:hover {
    border-color: rgba(107,163,232,0.35);
    color: #6BA3E8;
  }

  /* ── KPI strip ── */
  .va-kpi-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }
  @media (max-width: 900px) {
    .va-kpi-strip { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .va-kpi-strip { grid-template-columns: 1fr; }
  }
  .va-kpi-card {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 14px;
    padding: 18px 20px;
  }
  .va-kpi-label {
    font-size: 10.5px;
    font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 8px;
  }
  .va-kpi-value {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 26px;
    color: #E2E8F0;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  /* ── Filter row ── */
  .va-filter-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }
  .va-filter-pills {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .va-filter-tab {
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
    white-space: nowrap;
  }
  .va-filter-tab:hover {
    color: #E2E8F0;
    border-color: rgba(89,163,146,0.18);
  }
  .va-filter-tab.active {
    background: rgba(58,88,158,0.15);
    border-color: rgba(58,88,158,0.4);
    color: #E2E8F0;
  }
  .va-search-input {
    flex: 1;
    min-width: 200px;
    max-width: 320px;
    padding: 7px 13px;
    background: rgba(12,12,29,0.8);
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 10px;
    color: #E2E8F0;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s;
  }
  .va-search-input::placeholder { color: #4A5578; }
  .va-search-input:focus {
    outline: none;
    border-color: rgba(107,163,232,0.35);
  }
  .va-compare-btn {
    padding: 7px 16px;
    border-radius: 10px;
    border: 1.5px solid rgba(89,163,146,0.15);
    background: transparent;
    color: #72C4B2;
    font-size: 12.5px;
    font-weight: 600;
    font-family: 'Manrope', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .va-compare-btn:hover, .va-compare-btn.active {
    background: rgba(89,163,146,0.08);
    border-color: rgba(89,163,146,0.3);
  }

  /* ── Main table ── */
  .va-table-wrap {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 28px;
  }
  .va-table-header {
    display: grid;
    grid-template-columns: 30px 120px 1fr 140px 110px 110px 70px 110px 100px 80px;
    align-items: center;
    border-bottom: 1px solid rgba(89,163,146,0.1);
    background: rgba(15,15,36,0.6);
  }
  .va-table-row {
    display: grid;
    grid-template-columns: 30px 120px 1fr 140px 110px 110px 70px 110px 100px 80px;
    align-items: center;
    border-bottom: 1px solid rgba(89,163,146,0.06);
    text-decoration: none;
    transition: background 0.15s;
    cursor: pointer;
    min-height: 62px;
  }
  .va-table-row:last-child { border-bottom: none; }
  .va-table-row:hover { background: rgba(255,255,255,0.025); }

  .va-th {
    padding: 11px 12px;
    font-size: 10px;
    font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
  }
  .va-td {
    padding: 12px 12px;
    font-size: 13px;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
  }

  .va-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
  }
  .va-validation-badge {
    display: inline-flex;
    padding: 3px 9px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }
  .va-founder-name {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 13.5px;
    color: #E2E8F0;
    margin-bottom: 2px;
  }
  .va-founder-email {
    font-size: 11.5px;
    color: #6B7B9E;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .va-product-name {
    font-weight: 600;
    font-size: 13px;
    color: #CBD5E1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .va-model-text {
    font-size: 11.5px;
    color: #4A5578;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .va-score-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 700;
  }
  .va-date-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #6B7B9E;
  }
  .va-due-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    white-space: nowrap;
  }
  .va-review-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 8px;
    border: 1px solid rgba(107,163,232,0.2);
    color: #6BA3E8;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Manrope', sans-serif;
    text-decoration: none;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .va-review-link:hover {
    background: rgba(107,163,232,0.08);
    border-color: rgba(107,163,232,0.4);
  }
  .va-idx-cell {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    color: #4A5578;
    padding-left: 12px;
  }
  .va-empty-row {
    padding: 48px;
    text-align: center;
    color: #4A5578;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
  }

  /* ── Comparison table ── */
  .va-compare-wrap {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 28px;
  }
  .va-compare-header-row {
    padding: 18px 22px 14px;
    border-bottom: 1px solid rgba(89,163,146,0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .va-compare-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: #E2E8F0;
  }
  .va-compare-subtitle {
    font-size: 12px;
    color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
    margin-top: 2px;
  }
  .va-compare-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'DM Sans', sans-serif;
  }
  .va-compare-th {
    padding: 10px 14px;
    font-size: 10px;
    font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
    text-align: left;
    border-bottom: 1px solid rgba(89,163,146,0.08);
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }
  .va-compare-th:hover { color: #94A3B8; }
  .va-compare-td {
    padding: 12px 14px;
    font-size: 13px;
    color: #CBD5E1;
    border-bottom: 1px solid rgba(89,163,146,0.05);
    vertical-align: middle;
  }
  .va-compare-td:last-child { border-bottom: none; }
  .va-compare-tr:last-child .va-compare-td { border-bottom: none; }
  .va-compare-score {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }
  .va-compare-score-none { color: #4A5578; }
  .va-compare-name-cell {
    font-weight: 600;
    font-size: 13px;
    color: #E2E8F0;
    white-space: nowrap;
  }
  .va-compare-sort-arrow { margin-left: 4px; opacity: 0.6; }

  @media (max-width: 1100px) {
    .va-table-header,
    .va-table-row {
      grid-template-columns: 120px 1fr 120px 90px 70px 100px 80px;
    }
    .va-th-idx, .va-td-idx,
    .va-th-model, .va-td-model { display: none; }
  }
  @media (max-width: 760px) {
    .va-table-header,
    .va-table-row {
      grid-template-columns: 1fr 100px 70px 80px;
    }
    .va-th-idx, .va-td-idx,
    .va-th-validation, .va-td-validation,
    .va-th-model, .va-td-model,
    .va-th-submitted, .va-td-submitted { display: none; }
  }
`;

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function fmtCountdown(iso: string): { text: string; urgent: boolean } {
  const diff = new Date(iso).getTime() - Date.now();
  const urgent = diff < 86_400_000; // < 24 hours
  if (diff <= 0) return { text: 'Overdue', urgent: true };
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return { text: `${hours}h`, urgent: true };
  const days = Math.floor(hours / 24);
  const remH = hours % 24;
  return { text: `${days}d ${remH}h`, urgent };
}

function scoreColor(s: number | undefined): string {
  if (s === undefined) return '#4A5578';
  if (s >= 4.0) return '#4ade80';
  if (s >= 3.0) return '#E8B84D';
  return '#EF4444';
}

function validationLabel(v: ValidationStatus): string {
  return v === 'paying' ? 'Paying' : v === 'waitlist' ? 'Waitlist' : v === 'conversations' ? 'Convos' : 'None';
}

function statusLabel(s: ApplicationStatus): string {
  return s === 'pending' ? 'Pending' : s === 'interview' ? 'Interview' : s === 'accepted' ? 'Accepted' : s === 'rejected' ? 'Rejected' : 'Waitlisted';
}

type SortKey = 'name' | 'founder_market_fit' | 'demand_validation' | 'revenue_model_clarity' | 'technical_feasibility' | 'founder_commitment' | 'weighted';

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export default function VenturesApplicationsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [search, setSearch] = useState('');
  const [compareOpen, setCompareOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('weighted');
  const [sortAsc, setSortAsc] = useState(false);

  const apps = MOCK_VENTURES_APPLICATIONS;

  // KPI calculations
  const totalCount = apps.length;
  const pendingCount = apps.filter(a => a.status === 'pending').length;
  const now = new Date();
  const thisMonthAccepted = apps.filter(a => {
    if (a.status !== 'accepted' || !a.decision_at) return false;
    const d = new Date(a.decision_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const scoredApps = apps.filter(a => a.weighted_score !== undefined);
  const avgScore = scoredApps.length
    ? (scoredApps.reduce((s, a) => s + (a.weighted_score ?? 0), 0) / scoredApps.length).toFixed(1)
    : '—';

  // Filter
  const filtered = useMemo(() => {
    return apps.filter(a => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!a.founder_name.toLowerCase().includes(q) && !a.product_name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [apps, statusFilter, search]);

  // Comparison data: pending + interview only
  const compareApps = useMemo(() => {
    const base = apps.filter(a => a.status === 'pending' || a.status === 'interview');
    return [...base].sort((a, b) => {
      const aVal = sortKey === 'weighted'
        ? (a.weighted_score ?? -1)
        : sortKey === 'name'
        ? (a.founder_name > b.founder_name ? 1 : -1)
        : ((a.scores as Record<string, number> | undefined)?.[sortKey] ?? -1);
      const bVal = sortKey === 'weighted'
        ? (b.weighted_score ?? -1)
        : sortKey === 'name'
        ? 0
        : ((b.scores as Record<string, number> | undefined)?.[sortKey] ?? -1);
      if (sortKey === 'name') {
        const diff = a.founder_name.localeCompare(b.founder_name);
        return sortAsc ? diff : -diff;
      }
      return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [apps, sortKey, sortAsc]);

  const STATUS_FILTERS: { key: 'all' | ApplicationStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'interview', label: 'Interview' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'waitlisted', label: 'Waitlisted' },
  ];

  const COMPARE_COLS: { key: SortKey; label: string }[] = [
    { key: 'founder_market_fit', label: 'Founder Fit' },
    { key: 'demand_validation', label: 'Demand Valid.' },
    { key: 'revenue_model_clarity', label: 'Revenue Clarity' },
    { key: 'technical_feasibility', label: 'Technical' },
    { key: 'founder_commitment', label: 'Commitment' },
    { key: 'weighted', label: 'Wtd. Avg' },
  ];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(false); }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="va-list-page">
        {/* Header */}
        <div className="va-header">
          <div>
            <h1 className="va-title">Ventures Applications</h1>
            <p className="va-subtitle">{totalCount} applications — review, score, and decide</p>
          </div>
          <button className="va-btn-ghost">New Application</button>
        </div>

        {/* KPI Strip */}
        <div className="va-kpi-strip">
          <div className="va-kpi-card">
            <div className="va-kpi-label">Total Applications</div>
            <div className="va-kpi-value">{totalCount}</div>
          </div>
          <div className="va-kpi-card">
            <div className="va-kpi-label">Pending Review</div>
            <div className="va-kpi-value" style={{ color: pendingCount > 0 ? '#E8B84D' : '#E2E8F0' }}>{pendingCount}</div>
          </div>
          <div className="va-kpi-card">
            <div className="va-kpi-label">Accepted This Month</div>
            <div className="va-kpi-value" style={{ color: thisMonthAccepted > 0 ? '#4ade80' : '#E2E8F0' }}>{thisMonthAccepted}</div>
          </div>
          <div className="va-kpi-card">
            <div className="va-kpi-label">Avg Score</div>
            <div className="va-kpi-value" style={{ color: typeof avgScore === 'string' && avgScore !== '—' && parseFloat(avgScore) >= 4.0 ? '#4ade80' : '#E2E8F0' }}>{avgScore}</div>
          </div>
        </div>

        {/* Filter row */}
        <div className="va-filter-row">
          <div className="va-filter-pills" role="tablist">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.key}
                className={`va-filter-tab${statusFilter === f.key ? ' active' : ''}`}
                onClick={() => setStatusFilter(f.key)}
                role="tab"
                aria-selected={statusFilter === f.key}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            type="search"
            className="va-search-input"
            placeholder="Search by name or product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search applications"
          />
          <button
            className={`va-compare-btn${compareOpen ? ' active' : ''}`}
            onClick={() => setCompareOpen(v => !v)}
            aria-pressed={compareOpen}
          >
            Compare Pending
          </button>
        </div>

        {/* Main Table */}
        <div className="va-table-wrap" role="table" aria-label="Ventures applications">
          {/* Header */}
          <div className="va-table-header va-th-idx" role="row">
            <div className="va-th va-th-idx" role="columnheader">#</div>
            <div className="va-th" role="columnheader">Status</div>
            <div className="va-th" role="columnheader">Founder / Product</div>
            <div className="va-th va-th-validation" role="columnheader">Validation</div>
            <div className="va-th va-th-model" role="columnheader">Model</div>
            <div className="va-th" role="columnheader">Score</div>
            <div className="va-th va-th-submitted" role="columnheader">Submitted</div>
            <div className="va-th" role="columnheader">Decision Due</div>
            <div className="va-th" role="columnheader"></div>
          </div>

          {filtered.length === 0 && (
            <div className="va-empty-row">No applications match this filter.</div>
          )}

          {filtered.map((app, idx) => {
            const { text: dueText, urgent } = fmtCountdown(app.decision_due);
            const statusColor = APPLICATION_STATUS_COLORS[app.status];
            const valColor = VALIDATION_COLORS[app.validation_status];
            return (
              <div
                key={app.id}
                className="va-table-row"
                role="row"
                onClick={() => router.push(`/admin/ventures/applications/${app.id}`)}
                aria-label={`Review ${app.founder_name} — ${app.product_name}`}
              >
                <div className="va-td va-td-idx va-idx-cell" role="cell">{idx + 1}</div>
                <div className="va-td" role="cell">
                  <span
                    className="va-status-badge"
                    style={{
                      background: `${statusColor}18`,
                      color: statusColor,
                      border: `1px solid ${statusColor}30`,
                    }}
                  >
                    {statusLabel(app.status)}
                  </span>
                </div>
                <div className="va-td" role="cell">
                  <div className="va-founder-name">{app.founder_name}</div>
                  <div className="va-founder-email">{app.founder_email}</div>
                  <div className="va-product-name" style={{ marginTop: 3 }}>{app.product_name}</div>
                </div>
                <div className="va-td va-td-validation" role="cell">
                  <span
                    className="va-validation-badge"
                    style={{
                      background: `${valColor}18`,
                      color: valColor,
                    }}
                  >
                    {validationLabel(app.validation_status)}
                  </span>
                </div>
                <div className="va-td va-td-model" role="cell">
                  <span className="va-model-text">
                    {PARTNERSHIP_LABELS[app.preferred_model]}
                  </span>
                </div>
                <div className="va-td" role="cell">
                  <span
                    className="va-score-val"
                    style={{ color: scoreColor(app.weighted_score) }}
                  >
                    {app.weighted_score !== undefined ? app.weighted_score.toFixed(1) : '—'}
                  </span>
                </div>
                <div className="va-td va-td-submitted" role="cell">
                  <span className="va-date-text">{fmtDate(app.submitted_at)}</span>
                </div>
                <div className="va-td" role="cell">
                  <span
                    className="va-due-text"
                    style={{ color: urgent ? '#EF4444' : '#6B7B9E' }}
                  >
                    {dueText}
                  </span>
                </div>
                <div className="va-td" role="cell">
                  <Link
                    href={`/admin/ventures/applications/${app.id}`}
                    className="va-review-link"
                    onClick={e => e.stopPropagation()}
                  >
                    Review
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        {compareOpen && (
          <div className="va-compare-wrap">
            <div className="va-compare-header-row">
              <div>
                <div className="va-compare-title">Pending Applicants — Side-by-Side Comparison</div>
                <div className="va-compare-subtitle">Pending + Interview applications. Click column headers to sort.</div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="va-compare-table">
                <thead>
                  <tr>
                    <th
                      className="va-compare-th"
                      onClick={() => handleSort('name')}
                      aria-sort={sortKey === 'name' ? (sortAsc ? 'ascending' : 'descending') : 'none'}
                    >
                      Name
                      {sortKey === 'name' && <span className="va-compare-sort-arrow">{sortAsc ? '↑' : '↓'}</span>}
                    </th>
                    {COMPARE_COLS.map(col => (
                      <th
                        key={col.key}
                        className="va-compare-th"
                        style={{ textAlign: 'center' }}
                        onClick={() => handleSort(col.key)}
                        aria-sort={sortKey === col.key ? (sortAsc ? 'ascending' : 'descending') : 'none'}
                      >
                        {col.label}
                        {sortKey === col.key && <span className="va-compare-sort-arrow">{sortAsc ? '↑' : '↓'}</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareApps.map(app => {
                    const s = app.scores;
                    const getScore = (key: string): number | undefined => s ? (s as unknown as Record<string, number>)[key] : undefined;
                    return (
                      <tr
                        key={app.id}
                        className="va-compare-tr"
                        style={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/admin/ventures/applications/${app.id}`)}
                      >
                        <td className="va-compare-td">
                          <div className="va-compare-name-cell">{app.founder_name}</div>
                          <div style={{ fontSize: 11.5, color: '#6B7B9E', fontFamily: "'DM Sans', sans-serif" }}>{app.product_name}</div>
                        </td>
                        {COMPARE_COLS.map(col => {
                          const val = col.key === 'weighted'
                            ? app.weighted_score
                            : getScore(col.key);
                          const color = scoreColor(val);
                          return (
                            <td key={col.key} className="va-compare-td">
                              <div
                                className={`va-compare-score${val === undefined ? ' va-compare-score-none' : ''}`}
                                style={{ color: val !== undefined ? color : '#4A5578' }}
                              >
                                {val !== undefined ? val.toFixed(1) : '—'}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {compareApps.length === 0 && (
                    <tr>
                      <td colSpan={7} className="va-compare-td" style={{ textAlign: 'center', color: '#4A5578', padding: 32 }}>
                        No pending or interview applications.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
