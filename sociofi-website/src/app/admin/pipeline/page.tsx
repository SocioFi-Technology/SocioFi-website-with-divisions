'use client';

import React, { useState } from 'react';
import type { Division } from '@/lib/supabase/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type PipelineStage = 'Lead' | 'Qualified' | 'Proposal Sent' | 'Negotiating' | 'Won' | 'Lost';

interface MockPipelineEntry {
  id: string;
  contact: string;
  company: string;
  division: Division;
  stage: PipelineStage;
  value: number;
  probability: number;
  assigned: string | null;
  daysInStage: number;
}

type DivisionTab = 'all' | Division;

// ─── Constants ────────────────────────────────────────────────────────────────

const PIPELINE_STAGES: PipelineStage[] = [
  'Lead',
  'Qualified',
  'Proposal Sent',
  'Negotiating',
  'Won',
  'Lost',
];

const STAGE_COLORS: Record<PipelineStage, string> = {
  'Lead':          '#3A589E',
  'Qualified':     '#E8B84D',
  'Proposal Sent': '#E8916F',
  'Negotiating':   '#59A392',
  'Won':           '#4ADE80',
  'Lost':          '#F87171',
};

const DIVISION_ACCENTS: Record<Division, string> = {
  studio:   '#72C4B2',
  agents:   '#8B5CF6',
  services: '#4DBFA8',
  cloud:    '#5BB5E0',
  academy:  '#E8B84D',
  ventures: '#6BA3E8',
  labs:     '#7B6FE8',
  parent:   '#4A6CB8',
};

const DIVISION_TABS: { key: DivisionTab; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'studio',   label: 'Studio' },
  { key: 'agents',   label: 'Agents' },
  { key: 'services', label: 'Services' },
  { key: 'cloud',    label: 'Cloud' },
  { key: 'academy',  label: 'Academy' },
  { key: 'ventures', label: 'Ventures' },
  { key: 'labs',     label: 'Labs' },
  { key: 'parent',   label: 'Parent' },
];

const ASSIGNEE_COLORS: Record<string, string> = {
  AR: '#3A589E',
  KH: '#59A392',
};

const MOCK_PIPELINE: MockPipelineEntry[] = [
  { id: 'p1', contact: 'Sarah Chen',   company: 'TechCorp',   division: 'studio',   stage: 'Qualified',     value: 12000, probability: 60,  assigned: 'AR', daysInStage: 3  },
  { id: 'p2', contact: 'James Okafor', company: 'FounderHQ',  division: 'studio',   stage: 'Proposal Sent', value: 18000, probability: 45,  assigned: 'KH', daysInStage: 7  },
  { id: 'p3', contact: 'Priya Mehta',  company: 'DataSync',   division: 'cloud',    stage: 'Negotiating',   value: 4800,  probability: 70,  assigned: 'KH', daysInStage: 2  },
  { id: 'p4', contact: 'Luca Bianchi', company: 'VentureLab', division: 'ventures', stage: 'Lead',          value: 0,     probability: 20,  assigned: 'AR', daysInStage: 1  },
  { id: 'p5', contact: 'Anna Müller',  company: 'EcomStore',  division: 'services', stage: 'Won',           value: 3600,  probability: 100, assigned: 'AR', daysInStage: 0  },
  { id: 'p6', contact: 'Raj Patel',    company: 'StartFlow',  division: 'studio',   stage: 'Lead',          value: 8000,  probability: 30,  assigned: null, daysInStage: 5  },
  { id: 'p7', contact: 'Mei Lin',      company: 'CloudBase',  division: 'cloud',    stage: 'Qualified',     value: 6000,  probability: 55,  assigned: 'KH', daysInStage: 4  },
  { id: 'p8', contact: 'Omar Hassan',  company: 'EdTechCo',   division: 'academy',  stage: 'Proposal Sent', value: 9600,  probability: 40,  assigned: 'AR', daysInStage: 8  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
  /* ── Page shell ── */
  .kanban-page {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-height: 0;
  }

  /* ── Summary bar ── */
  .kanban-summary {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .kanban-summary-card {
    flex: 1;
    min-width: 140px;
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 12px;
    padding: 14px 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .kanban-summary-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    color: var(--adm-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .kanban-summary-value {
    font-family: 'Manrope', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: var(--adm-text);
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .kanban-summary-sub {
    font-size: 11px;
    color: var(--adm-muted);
    font-family: 'DM Sans', sans-serif;
    margin-top: 2px;
  }

  /* ── Division tabs ── */
  .kanban-tabs {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    margin-bottom: 20px;
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 12px;
    padding: 6px;
  }
  .kanban-tab {
    padding: 6px 14px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--adm-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.18s, color 0.18s;
    white-space: nowrap;
  }
  .kanban-tab:hover {
    background: rgba(89,163,146,0.06);
    color: var(--adm-text);
  }
  .kanban-tab.active {
    background: rgba(58,88,158,0.18);
    color: var(--adm-text);
    font-weight: 600;
  }

  /* ── Board: horizontal scroll container ── */
  .kanban-board-wrap {
    overflow-x: auto;
    padding-bottom: 8px;
  }
  .kanban-board-wrap::-webkit-scrollbar {
    height: 5px;
  }
  .kanban-board-wrap::-webkit-scrollbar-track {
    background: var(--adm-bg2);
    border-radius: 3px;
  }
  .kanban-board-wrap::-webkit-scrollbar-thumb {
    background: var(--adm-border);
    border-radius: 3px;
  }
  .kanban-board {
    display: flex;
    gap: 12px;
    min-width: max-content;
    align-items: flex-start;
  }

  /* ── Column ── */
  .kanban-col {
    width: 280px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .kanban-col-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 10px;
    border-left-width: 3px;
    position: sticky;
    top: 0;
  }
  .kanban-col-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .kanban-col-name {
    font-family: 'Manrope', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: var(--adm-text);
    letter-spacing: -0.01em;
  }
  .kanban-col-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    color: var(--adm-muted);
    background: rgba(255,255,255,0.05);
    border-radius: 100px;
    padding: 2px 7px;
  }
  .kanban-col-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    color: var(--adm-muted);
  }

  /* ── Card ── */
  .kanban-card {
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.18s;
    cursor: default;
  }
  .kanban-card:hover {
    border-color: var(--adm-border-hover);
    box-shadow: 0 4px 24px rgba(0,0,0,0.25);
    transform: translateY(-1px);
  }

  /* Card: top row */
  .kanban-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }
  .kanban-card-identity { flex: 1; min-width: 0; }
  .kanban-card-contact {
    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--adm-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }
  .kanban-card-company {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    color: var(--adm-muted);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Division badge */
  .kanban-div-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 3px 7px;
    border-radius: 100px;
    white-space: nowrap;
    flex-shrink: 0;
    opacity: 0.9;
  }

  /* Card: meta row */
  .kanban-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }
  .kanban-card-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 500;
    color: var(--adm-text);
    letter-spacing: -0.01em;
  }
  .kanban-card-value.zero {
    color: var(--adm-muted);
  }

  /* Days in stage badge */
  .kanban-days-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 100px;
    white-space: nowrap;
  }
  .kanban-days-badge.normal {
    background: rgba(107,123,158,0.12);
    color: var(--adm-muted);
  }
  .kanban-days-badge.warn {
    background: rgba(232,184,77,0.15);
    color: #E8B84D;
  }
  .kanban-days-badge.danger {
    background: rgba(248,113,113,0.15);
    color: #F87171;
  }

  /* Probability bar */
  .kanban-prob-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .kanban-prob-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .kanban-prob-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--adm-muted);
  }
  .kanban-prob-pct {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--adm-muted);
  }
  .kanban-prob-track {
    height: 3px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    overflow: hidden;
  }
  .kanban-prob-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Card: footer row */
  .kanban-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
  }

  /* Assignee avatar */
  .kanban-assignee {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .kanban-avatar {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Manrope', sans-serif;
    font-size: 9px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }
  .kanban-assignee-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    color: var(--adm-muted);
  }

  /* Move arrow buttons */
  .kanban-move-btns {
    display: flex;
    gap: 4px;
  }
  .kanban-move-btn {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 1px solid var(--adm-border);
    background: transparent;
    color: var(--adm-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
    flex-shrink: 0;
  }
  .kanban-move-btn:hover:not(:disabled) {
    border-color: var(--adm-border-hover);
    background: rgba(89,163,146,0.08);
    color: var(--adm-text);
  }
  .kanban-move-btn:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  /* Empty column state */
  .kanban-col-empty {
    padding: 20px 14px;
    text-align: center;
    background: rgba(255,255,255,0.015);
    border: 1px dashed var(--adm-border);
    border-radius: 10px;
  }
  .kanban-col-empty-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: var(--adm-muted);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .kanban-summary-card {
      min-width: 120px;
    }
    .kanban-tabs {
      gap: 2px;
      padding: 4px;
    }
    .kanban-tab {
      padding: 5px 10px;
      font-size: 12px;
    }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatValue(value: number): string {
  if (value === 0) return '$0';
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function formatColValue(total: number): string {
  if (total === 0) return '$0';
  if (total >= 1000) return `$${(total / 1000).toFixed(0)}K`;
  return `$${total}`;
}

function getDaysBadgeClass(days: number): string {
  if (days > 14) return 'kanban-days-badge danger';
  if (days > 7)  return 'kanban-days-badge warn';
  return 'kanban-days-badge normal';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

interface KanbanCardProps {
  entry: MockPipelineEntry;
  stageIndex: number;
  onMove: (id: string, direction: 'left' | 'right') => void;
}

function KanbanCard({ entry, stageIndex, onMove }: KanbanCardProps) {
  const divAccent = DIVISION_ACCENTS[entry.division];
  const probColor = entry.probability >= 70
    ? '#4ADE80'
    : entry.probability >= 40
    ? '#E8B84D'
    : '#F87171';

  return (
    <div className="kanban-card" role="article" aria-label={`${entry.contact} at ${entry.company}`}>
      {/* Top: identity + division badge */}
      <div className="kanban-card-top">
        <div className="kanban-card-identity">
          <div className="kanban-card-contact">{entry.contact}</div>
          <div className="kanban-card-company">{entry.company}</div>
        </div>
        <span
          className="kanban-div-badge"
          style={{
            background: `${divAccent}22`,
            color: divAccent,
            border: `1px solid ${divAccent}33`,
          }}
        >
          {entry.division}
        </span>
      </div>

      {/* Value + days in stage */}
      <div className="kanban-card-meta">
        <span className={`kanban-card-value${entry.value === 0 ? ' zero' : ''}`}>
          {formatValue(entry.value)}
        </span>
        {entry.daysInStage > 0 && (
          <span className={getDaysBadgeClass(entry.daysInStage)}>
            {entry.daysInStage}d
          </span>
        )}
        {entry.daysInStage === 0 && (
          <span className="kanban-days-badge normal">new</span>
        )}
      </div>

      {/* Probability bar */}
      <div className="kanban-prob-wrap">
        <div className="kanban-prob-row">
          <span className="kanban-prob-label">Probability</span>
          <span className="kanban-prob-pct">{entry.probability}%</span>
        </div>
        <div className="kanban-prob-track">
          <div
            className="kanban-prob-fill"
            style={{ width: `${entry.probability}%`, background: probColor }}
            role="progressbar"
            aria-valuenow={entry.probability}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${entry.probability}% probability`}
          />
        </div>
      </div>

      {/* Footer: assignee + move buttons */}
      <div className="kanban-card-footer">
        <div className="kanban-assignee">
          {entry.assigned ? (
            <>
              <div
                className="kanban-avatar"
                style={{ background: ASSIGNEE_COLORS[entry.assigned] ?? '#3A589E' }}
                aria-label={entry.assigned}
              >
                {entry.assigned}
              </div>
              <span className="kanban-assignee-label">{entry.assigned}</span>
            </>
          ) : (
            <span className="kanban-assignee-label">Unassigned</span>
          )}
        </div>
        <div className="kanban-move-btns">
          <button
            className="kanban-move-btn"
            onClick={() => onMove(entry.id, 'left')}
            disabled={stageIndex === 0}
            aria-label={`Move ${entry.contact} to previous stage`}
            title="Move left"
          >
            <ArrowLeftIcon />
          </button>
          <button
            className="kanban-move-btn"
            onClick={() => onMove(entry.id, 'right')}
            disabled={stageIndex === PIPELINE_STAGES.length - 1}
            aria-label={`Move ${entry.contact} to next stage`}
            title="Move right"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Summary metrics ──────────────────────────────────────────────────────────

interface SummaryProps {
  entries: MockPipelineEntry[];
  allEntries: MockPipelineEntry[];
}

function SummaryBar({ entries, allEntries }: SummaryProps) {
  const totalValue = entries.reduce((s, e) => s + e.value, 0);
  const weightedValue = entries.reduce((s, e) => s + (e.value * e.probability) / 100, 0);
  const wonThisMonth = allEntries.filter((e) => e.stage === 'Won').reduce((s, e) => s + e.value, 0);

  return (
    <div className="kanban-summary" role="region" aria-label="Pipeline summary">
      <div className="kanban-summary-card">
        <div className="kanban-summary-label">Total Pipeline</div>
        <div className="kanban-summary-value">{formatColValue(totalValue)}</div>
        <div className="kanban-summary-sub">{entries.length} active deal{entries.length !== 1 ? 's' : ''}</div>
      </div>
      <div className="kanban-summary-card">
        <div className="kanban-summary-label">Weighted Value</div>
        <div className="kanban-summary-value">{formatColValue(Math.round(weightedValue))}</div>
        <div className="kanban-summary-sub">Probability adjusted</div>
      </div>
      <div className="kanban-summary-card">
        <div className="kanban-summary-label">Cards in Pipeline</div>
        <div className="kanban-summary-value">{entries.filter((e) => e.stage !== 'Won' && e.stage !== 'Lost').length}</div>
        <div className="kanban-summary-sub">Excluding won & lost</div>
      </div>
      <div className="kanban-summary-card">
        <div className="kanban-summary-label">Won This Month</div>
        <div className="kanban-summary-value" style={{ color: '#4ADE80' }}>{formatColValue(wonThisMonth)}</div>
        <div className="kanban-summary-sub">Closed deals</div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const [entries, setEntries] = useState<MockPipelineEntry[]>(MOCK_PIPELINE);
  const [activeTab, setActiveTab] = useState<DivisionTab>('all');

  const filteredEntries = activeTab === 'all'
    ? entries
    : entries.filter((e) => e.division === activeTab);

  const handleMove = (id: string, direction: 'left' | 'right') => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== id) return entry;
        const currentIndex = PIPELINE_STAGES.indexOf(entry.stage);
        const nextIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
        if (nextIndex < 0 || nextIndex >= PIPELINE_STAGES.length) return entry;
        return { ...entry, stage: PIPELINE_STAGES[nextIndex], daysInStage: 0 };
      })
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="kanban-page">
        {/* Summary bar */}
        <SummaryBar entries={filteredEntries} allEntries={entries} />

        {/* Division tabs */}
        <div className="kanban-tabs" role="tablist" aria-label="Filter by division">
          {DIVISION_TABS.map((tab) => {
            const count = tab.key === 'all'
              ? entries.length
              : entries.filter((e) => e.division === tab.key).length;

            return (
              <button
                key={tab.key}
                className={`kanban-tab${activeTab === tab.key ? ' active' : ''}`}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    style={{
                      marginLeft: 5,
                      fontSize: 10,
                      fontFamily: "'JetBrains Mono', monospace",
                      opacity: 0.6,
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Kanban board */}
        <div className="kanban-board-wrap">
          <div className="kanban-board" role="region" aria-label="Pipeline kanban board">
            {PIPELINE_STAGES.map((stage) => {
              const stageIndex = PIPELINE_STAGES.indexOf(stage);
              const stageColor = STAGE_COLORS[stage];
              const stageEntries = filteredEntries.filter((e) => e.stage === stage);
              const stageTotal = stageEntries.reduce((s, e) => s + e.value, 0);

              return (
                <div
                  key={stage}
                  className="kanban-col"
                  role="group"
                  aria-label={`${stage} stage`}
                >
                  {/* Column header */}
                  <div
                    className="kanban-col-header"
                    style={{ borderLeftColor: stageColor }}
                  >
                    <div className="kanban-col-left">
                      <span className="kanban-col-name">{stage}</span>
                      <span className="kanban-col-count">{stageEntries.length}</span>
                    </div>
                    <span className="kanban-col-value">{formatColValue(stageTotal)}</span>
                  </div>

                  {/* Cards */}
                  {stageEntries.length === 0 ? (
                    <div className="kanban-col-empty">
                      <p className="kanban-col-empty-text">No deals here</p>
                    </div>
                  ) : (
                    stageEntries.map((entry) => (
                      <KanbanCard
                        key={entry.id}
                        entry={entry}
                        stageIndex={stageIndex}
                        onMove={handleMove}
                      />
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
