'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_CONTACTS } from '@/lib/admin/mock-data';
import { Contact, LifecycleStage, Division } from '@/lib/supabase/types';

/* ─── helpers ─── */
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
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ─── styles ─── */
const STYLES = `
  .crm-page { max-width: 1200px; }

  /* Header */
  .crm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 16px;
  }
  .crm-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 22px;
    color: var(--adm-text);
    letter-spacing: -0.02em;
  }
  .crm-btn-ghost {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    background: transparent;
    border: 1px solid var(--adm-border-hover);
    border-radius: 8px;
    color: var(--adm-text);
    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
    white-space: nowrap;
  }
  .crm-btn-ghost:hover {
    border-color: var(--adm-teal);
    color: var(--adm-teal);
    background: rgba(89,163,146,0.06);
  }

  /* Stats row */
  .crm-stats {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .crm-stat-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px;
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 100px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--adm-muted);
    transition: border-color 0.2s;
  }
  .crm-stat-chip:hover { border-color: var(--adm-border-hover); }
  .crm-stat-num {
    font-weight: 600;
    font-size: 14px;
    color: var(--adm-text);
  }

  /* Filter bar */
  .crm-filters {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .crm-search-wrap {
    position: relative;
    flex: 1;
    min-width: 200px;
  }
  .crm-search-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--adm-muted);
    pointer-events: none;
  }
  .crm-search {
    width: 100%;
    padding: 8px 12px 8px 34px;
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 8px;
    color: var(--adm-text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    transition: border-color 0.2s;
    outline: none;
  }
  .crm-search::placeholder { color: var(--adm-muted); }
  .crm-search:focus { border-color: var(--adm-teal); }
  .crm-select {
    padding: 8px 12px;
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 8px;
    color: var(--adm-text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: border-color 0.2s;
    outline: none;
    min-width: 130px;
  }
  .crm-select:focus { border-color: var(--adm-teal); }
  .crm-select option { background: #111128; }

  /* Grid */
  .crm-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 1024px) {
    .crm-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .crm-grid { grid-template-columns: 1fr; }
  }

  /* Contact card */
  .crm-card {
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .crm-card:hover {
    border-color: var(--adm-border-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  }

  .crm-card-top {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .crm-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: white;
    flex-shrink: 0;
    letter-spacing: 0.02em;
  }
  .crm-card-info { flex: 1; min-width: 0; }
  .crm-card-name {
    font-family: 'Manrope', sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: var(--adm-text);
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .crm-card-email {
    font-size: 12px;
    color: var(--adm-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }
  .crm-card-meta {
    font-size: 12px;
    color: var(--adm-muted);
  }

  .crm-lifecycle-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 100px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: rgba(255,255,255,0.04);
  }
  .crm-lifecycle-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .crm-divisions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .crm-div-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 6px;
    font-size: 11px;
    color: var(--adm-muted);
    text-transform: capitalize;
  }
  .crm-div-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .crm-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .crm-tag {
    padding: 2px 7px;
    background: rgba(89,163,146,0.08);
    border: 1px solid rgba(89,163,146,0.12);
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--adm-teal);
    letter-spacing: 0.04em;
  }

  .crm-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid var(--adm-border);
  }
  .crm-card-time {
    font-size: 11px;
    color: var(--adm-muted);
    font-family: 'JetBrains Mono', monospace;
  }
  .crm-view-btn {
    padding: 5px 12px;
    background: transparent;
    border: 1px solid var(--adm-border-hover);
    border-radius: 6px;
    color: var(--adm-text);
    font-family: 'Manrope', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .crm-view-btn:hover {
    background: rgba(89,163,146,0.08);
    border-color: var(--adm-teal);
    color: var(--adm-teal);
  }

  /* Empty state */
  .crm-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    color: var(--adm-muted);
    font-size: 14px;
  }
  .crm-empty-icon {
    margin: 0 auto 16px;
    opacity: 0.3;
  }
`;

export default function ContactsPage() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [divFilter, setDivFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  /* Compute unique tags */
  const allTags = useMemo(() => {
    const set = new Set<string>();
    MOCK_CONTACTS.forEach((c) => c.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  /* Compute all unique divisions */
  const allDivisions = useMemo(() => {
    const set = new Set<string>();
    MOCK_CONTACTS.forEach((c) => c.division_interest?.forEach((d) => set.add(d)));
    return Array.from(set).sort();
  }, []);

  /* Stats */
  const stats = useMemo(() => ({
    total:       MOCK_CONTACTS.length,
    qualified:   MOCK_CONTACTS.filter((c) => c.lifecycle_stage === 'qualified').length,
    client:      MOCK_CONTACTS.filter((c) => c.lifecycle_stage === 'client').length,
    churned:     MOCK_CONTACTS.filter((c) => c.lifecycle_stage === 'churned').length,
  }), []);

  /* Filter */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_CONTACTS.filter((c) => {
      if (q && ![c.name, c.email, c.company].some((v) => v?.toLowerCase().includes(q))) return false;
      if (stageFilter !== 'all' && c.lifecycle_stage !== stageFilter) return false;
      if (divFilter !== 'all' && !c.division_interest?.includes(divFilter as Division)) return false;
      if (tagFilter !== 'all' && !c.tags?.includes(tagFilter)) return false;
      return true;
    });
  }, [search, stageFilter, divFilter, tagFilter]);

  const goTo = (id: string) => router.push(`/admin/contacts/${id}`);

  return (
    <div className="crm-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Header */}
      <div className="crm-header">
        <h1 className="crm-title">Contacts</h1>
        <button className="crm-btn-ghost" onClick={() => {}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Contact
        </button>
      </div>

      {/* Stats */}
      <div className="crm-stats">
        <div className="crm-stat-chip">
          <span className="crm-stat-num">{stats.total}</span>
          Total contacts
        </div>
        <div className="crm-stat-chip">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: LIFECYCLE_COLORS.qualified, display: 'inline-block' }} aria-hidden="true" />
          <span className="crm-stat-num">{stats.qualified}</span>
          Qualified leads
        </div>
        <div className="crm-stat-chip">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: LIFECYCLE_COLORS.client, display: 'inline-block' }} aria-hidden="true" />
          <span className="crm-stat-num">{stats.client}</span>
          Active clients
        </div>
        <div className="crm-stat-chip">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: LIFECYCLE_COLORS.churned, display: 'inline-block' }} aria-hidden="true" />
          <span className="crm-stat-num">{stats.churned}</span>
          Churned
        </div>
      </div>

      {/* Filters */}
      <div className="crm-filters">
        <div className="crm-search-wrap">
          <span className="crm-search-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            className="crm-search"
            type="text"
            placeholder="Search name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search contacts"
          />
        </div>

        <select
          className="crm-select"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          aria-label="Filter by lifecycle stage"
        >
          <option value="all">All Stages</option>
          <option value="lead">Lead</option>
          <option value="qualified">Qualified</option>
          <option value="opportunity">Opportunity</option>
          <option value="client">Client</option>
          <option value="churned">Churned</option>
        </select>

        <select
          className="crm-select"
          value={divFilter}
          onChange={(e) => setDivFilter(e.target.value)}
          aria-label="Filter by division interest"
        >
          <option value="all">All Divisions</option>
          {allDivisions.map((d) => (
            <option key={d} value={d} style={{ textTransform: 'capitalize' }}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="crm-select"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          aria-label="Filter by tag"
        >
          <option value="all">All Tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="crm-grid">
        {filtered.length === 0 ? (
          <div className="crm-empty">
            <div className="crm-empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            No contacts match your filters.
          </div>
        ) : (
          filtered.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onClick={() => goTo(contact.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ContactCard({
  contact,
  onClick,
}: {
  contact: Contact;
  onClick: () => void;
}) {
  const initials = getInitials(contact.name, contact.email);
  const stageColor = LIFECYCLE_COLORS[contact.lifecycle_stage];

  return (
    <div
      className="crm-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View contact ${contact.name ?? contact.email}`}
    >
      {/* Top section */}
      <div className="crm-card-top">
        <div
          className="crm-avatar"
          style={{ background: `linear-gradient(135deg, ${stageColor}cc, ${stageColor}66)` }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="crm-card-info">
          <div className="crm-card-name">{contact.name ?? '—'}</div>
          <div className="crm-card-email">{contact.email}</div>
          {(contact.company || contact.role) && (
            <div className="crm-card-meta">
              {[contact.role, contact.company].filter(Boolean).join(' @ ')}
            </div>
          )}
        </div>
      </div>

      {/* Lifecycle badge */}
      <div>
        <span
          className="crm-lifecycle-badge"
          style={{ color: stageColor, border: `1px solid ${stageColor}33` }}
        >
          <span
            className="crm-lifecycle-dot"
            style={{ background: stageColor }}
            aria-hidden="true"
          />
          {contact.lifecycle_stage}
        </span>
      </div>

      {/* Division interest */}
      {contact.division_interest && contact.division_interest.length > 0 && (
        <div className="crm-divisions">
          {contact.division_interest.map((div) => (
            <span key={div} className="crm-div-chip">
              <span
                className="crm-div-dot"
                style={{ background: DIVISION_COLORS[div] ?? '#6B7B9E' }}
                aria-hidden="true"
              />
              {div}
            </span>
          ))}
        </div>
      )}

      {/* Tags */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="crm-tags">
          {contact.tags.map((tag) => (
            <span key={tag} className="crm-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="crm-card-footer">
        <span className="crm-card-time">{timeAgo(contact.updated_at)}</span>
        <button
          className="crm-view-btn"
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          aria-label={`View ${contact.name ?? contact.email}`}
        >
          View
        </button>
      </div>
    </div>
  );
}
