'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_CONTACTS } from '@/lib/admin/mock-data';

/* ─────────────────────────────────────────
   Shared Mock Data (matches [id] page)
───────────────────────────────────────── */
export type VenturesScore = {
  team: number | null;
  market: number | null;
  product: number | null;
  traction: number | null;
};

export type VenturesAppStatus =
  | 'new'
  | 'under_review'
  | 'due_diligence'
  | 'approved'
  | 'declined'
  | 'waitlist';

export type VenturesApp = {
  id: string;
  startup_name: string;
  contact_id: string;
  stage: string;
  sector: string;
  status: VenturesAppStatus;
  data: {
    description: string;
    monthly_revenue: string;
    team_size: string;
    funding: string;
    website: string | null;
    ask: string;
  };
  scores: VenturesScore;
  created_at: string;
};

export const MOCK_VENTURES_APPS: VenturesApp[] = [
  {
    id: 'va1',
    startup_name: 'GreenLoop',
    contact_id: 'c4',
    stage: 'mvp',
    sector: 'Climate Tech',
    status: 'under_review',
    data: {
      description:
        'Carbon credit marketplace for SMEs connecting verified offset providers with business buyers.',
      monthly_revenue: '$0',
      team_size: '2',
      funding: 'Bootstrapped',
      website: 'greenloop.io',
      ask: '$150K for 8%',
    },
    scores: { team: null, market: null, product: null, traction: null },
    created_at: new Date(Date.now() - 3_600_000).toISOString(),
  },
  {
    id: 'va2',
    startup_name: 'FlowAI',
    contact_id: 'c3',
    stage: 'seed',
    sector: 'B2B SaaS',
    status: 'new',
    data: {
      description:
        'AI-powered workflow automation for mid-market ops teams. Integrates with 50+ tools.',
      monthly_revenue: '$12K MRR',
      team_size: '5',
      funding: '$200K angel',
      website: 'flowai.co',
      ask: '$500K for 12%',
    },
    scores: { team: 8, market: 9, product: 7, traction: 8 },
    created_at: new Date(Date.now() - 86_400_000 * 5).toISOString(),
  },
  {
    id: 'va3',
    startup_name: 'MedTrace',
    contact_id: 'c2',
    stage: 'pre-seed',
    sector: 'HealthTech',
    status: 'declined',
    data: {
      description:
        'Supply chain tracking for pharmaceutical distributors using blockchain.',
      monthly_revenue: '$0',
      team_size: '3',
      funding: 'None',
      website: null,
      ask: '$250K for 15%',
    },
    scores: { team: 6, market: 7, product: 5, traction: 3 },
    created_at: new Date(Date.now() - 86_400_000 * 12).toISOString(),
  },
];

/* ─────────────────────────────────────────
   Styles
───────────────────────────────────────── */
const STYLES = `
  .vapp-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 16px;
  }
  .vapp-page-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 22px;
    color: #E2E8F0;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .vapp-page-sub {
    font-size: 13px;
    color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
  }

  .vapp-filter-bar {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }
  .vapp-filter-tab {
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
  .vapp-filter-tab:hover {
    color: #E2E8F0;
    border-color: rgba(89,163,146,0.18);
  }
  .vapp-filter-tab.active {
    background: rgba(58,88,158,0.15);
    border-color: rgba(58,88,158,0.4);
    color: #E2E8F0;
  }

  .vapp-table-wrap {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    overflow: hidden;
  }

  .vapp-table-header {
    display: grid;
    grid-template-columns: 1fr 90px 110px 110px 80px 90px;
    align-items: center;
    border-bottom: 1px solid rgba(89,163,146,0.1);
    background: rgba(15,15,36,0.6);
    border-left: 3px solid transparent;
  }
  .vapp-table-row {
    display: grid;
    grid-template-columns: 1fr 90px 110px 110px 80px 90px;
    align-items: center;
    border-bottom: 1px solid rgba(89,163,146,0.06);
    border-left: 3px solid rgba(107,163,232,0.4);
    text-decoration: none;
    transition: background 0.15s;
    min-height: 58px;
  }
  .vapp-table-row:last-child { border-bottom: none; }
  .vapp-table-row:hover { background: rgba(255,255,255,0.025); }

  .vapp-header-cell {
    padding: 11px 14px;
    font-size: 10.5px;
    font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
  }
  .vapp-cell {
    padding: 14px 14px;
    font-size: 13px;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
  }

  .vapp-startup-name {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: #E2E8F0;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .vapp-startup-desc {
    font-size: 12px;
    color: #6B7B9E;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 320px;
  }

  .vapp-stage-badge {
    display: inline-flex;
    padding: 3px 9px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 500;
    font-family: 'JetBrains Mono', monospace;
    background: rgba(107,163,232,0.1);
    color: #6BA3E8;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .vapp-sector-badge {
    display: inline-flex;
    padding: 3px 9px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    background: rgba(89,163,146,0.08);
    color: #59A392;
    white-space: nowrap;
  }

  .vapp-status-badge {
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
  .vapp-status-badge::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .vapp-status-badge.new { background: rgba(89,163,146,0.1); color: #59A392; }
  .vapp-status-badge.new::before { background: #59A392; }
  .vapp-status-badge.under_review { background: rgba(251,191,36,0.1); color: #FBBF24; }
  .vapp-status-badge.under_review::before { background: #FBBF24; }
  .vapp-status-badge.due_diligence { background: rgba(58,88,158,0.15); color: #6BA3E8; }
  .vapp-status-badge.due_diligence::before { background: #6BA3E8; }
  .vapp-status-badge.approved { background: rgba(89,163,146,0.12); color: #4DBFA8; }
  .vapp-status-badge.approved::before { background: #4DBFA8; }
  .vapp-status-badge.declined { background: rgba(248,113,113,0.1); color: #F87171; }
  .vapp-status-badge.declined::before { background: #F87171; }
  .vapp-status-badge.waitlist { background: rgba(232,145,111,0.1); color: #E8916F; }
  .vapp-status-badge.waitlist::before { background: #E8916F; }

  .vapp-score-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 600;
  }
  .vapp-score-none { color: #4A5578; }
  .vapp-score-red { color: #F87171; }
  .vapp-score-yellow { color: #FBBF24; }
  .vapp-score-teal { color: #59A392; }
  .vapp-score-green { color: #4ADE80; }

  .vapp-time {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #4A5578;
  }

  .vapp-arrow {
    color: #4A5578;
    margin-left: 4px;
    transition: transform 0.15s;
  }
  .vapp-table-row:hover .vapp-arrow { transform: translateX(3px); color: #6BA3E8; }

  .vapp-empty {
    padding: 48px;
    text-align: center;
    color: #4A5578;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
  }

  @media (max-width: 800px) {
    .vapp-table-header,
    .vapp-table-row {
      grid-template-columns: 1fr 90px 100px 80px;
    }
    .vapp-header-cell-sector,
    .vapp-cell-sector,
    .vapp-header-cell-stage,
    .vapp-cell-stage { display: none; }
  }
  @media (max-width: 560px) {
    .vapp-table-header,
    .vapp-table-row { grid-template-columns: 1fr 100px; }
    .vapp-header-cell-score,
    .vapp-cell-score,
    .vapp-header-cell-time,
    .vapp-cell-time { display: none; }
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

function avgScore(scores: VenturesScore): number | null {
  const vals = [scores.team, scores.market, scores.product, scores.traction].filter(
    (v): v is number => v !== null,
  );
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function scoreClass(score: number | null): string {
  if (score === null) return 'vapp-score-none';
  if (score < 5) return 'vapp-score-red';
  if (score < 7) return 'vapp-score-yellow';
  if (score < 9) return 'vapp-score-teal';
  return 'vapp-score-green';
}

const STATUS_LABELS: Record<VenturesAppStatus, string> = {
  new: 'New',
  under_review: 'Under Review',
  due_diligence: 'Due Diligence',
  approved: 'Approved',
  declined: 'Declined',
  waitlist: 'Waitlist',
};

type FilterKey = 'all' | VenturesAppStatus;

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export default function VenturesApplicationsPage() {
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = MOCK_VENTURES_APPS.filter(
    (a) => filter === 'all' || a.status === filter,
  );

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'due_diligence', label: 'Due Diligence' },
    { key: 'approved', label: 'Approved' },
    { key: 'declined', label: 'Declined' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="vapp-page-header">
        <div>
          <h1 className="vapp-page-title">Ventures Applications</h1>
          <p className="vapp-page-sub">
            {MOCK_VENTURES_APPS.length} applications — click a row to score and review
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="vapp-filter-bar" role="tablist" aria-label="Filter applications">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`vapp-filter-tab${filter === f.key ? ' active' : ''}`}
            onClick={() => setFilter(f.key)}
            role="tab"
            aria-selected={filter === f.key}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="vapp-table-wrap" role="table" aria-label="Ventures applications">
        {/* Header */}
        <div className="vapp-table-header" role="row">
          <div className="vapp-header-cell" role="columnheader">Startup</div>
          <div className="vapp-header-cell vapp-header-cell-stage" role="columnheader">Stage</div>
          <div className="vapp-header-cell vapp-header-cell-sector" role="columnheader">Sector</div>
          <div className="vapp-header-cell" role="columnheader">Status</div>
          <div className="vapp-header-cell vapp-header-cell-score" role="columnheader">Score</div>
          <div className="vapp-header-cell vapp-header-cell-time" role="columnheader">Received</div>
        </div>

        {filtered.length === 0 && (
          <div className="vapp-empty">No applications match this filter.</div>
        )}

        {filtered.map((app) => {
          const contact = MOCK_CONTACTS.find((c) => c.id === app.contact_id);
          const avg = avgScore(app.scores);
          const cls = scoreClass(avg);

          return (
            <Link
              key={app.id}
              href={`/admin/ventures/applications/${app.id}`}
              className="vapp-table-row"
              role="row"
              aria-label={`Review ${app.startup_name}`}
            >
              {/* Startup */}
              <div className="vapp-cell" role="cell">
                <div className="vapp-startup-name">
                  {app.startup_name}
                  <svg className="vapp-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
                <div className="vapp-startup-desc">
                  {contact?.name ? `${contact.name} — ` : ''}
                  {app.data.description.slice(0, 72)}{app.data.description.length > 72 ? '…' : ''}
                </div>
              </div>

              {/* Stage */}
              <div className="vapp-cell vapp-cell-stage" role="cell">
                <span className="vapp-stage-badge">{app.stage}</span>
              </div>

              {/* Sector */}
              <div className="vapp-cell vapp-cell-sector" role="cell">
                <span className="vapp-sector-badge">{app.sector}</span>
              </div>

              {/* Status */}
              <div className="vapp-cell" role="cell">
                <span className={`vapp-status-badge ${app.status}`}>
                  {STATUS_LABELS[app.status]}
                </span>
              </div>

              {/* Score */}
              <div className="vapp-cell vapp-cell-score" role="cell">
                <span className={`vapp-score-value ${cls}`}>
                  {avg !== null ? avg.toFixed(1) : '—'}
                </span>
              </div>

              {/* Time */}
              <div className="vapp-cell vapp-cell-time" role="cell">
                <span className="vapp-time">{fmtRelative(app.created_at)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
