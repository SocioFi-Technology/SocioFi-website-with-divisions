import Link from 'next/link';
import { MOCK_METRICS, MOCK_SUBMISSIONS, MOCK_TICKETS, MOCK_ACTIVITY, MOCK_TEAM } from '@/lib/admin/mock-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — SocioFi Admin',
};

const STYLES = `
  /* ── KPI Grid ── */
  .dash-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  @media (max-width: 1100px) { .dash-kpi-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px)  { .dash-kpi-grid { grid-template-columns: 1fr; } }

  .dash-kpi-card {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    padding: 22px 24px 18px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .dash-kpi-card:hover { border-color: rgba(89,163,146,0.16); }
  .dash-kpi-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3A589E, #59A392);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .dash-kpi-card:hover::after { opacity: 1; }

  .dash-kpi-label {
    font-size: 10.5px; font-weight: 600;
    color: #6B7B9E; text-transform: uppercase; letter-spacing: 0.1em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 10px;
  }
  .dash-kpi-value {
    font-family: 'Manrope', sans-serif;
    font-size: 28px; font-weight: 800;
    color: #E2E8F0; letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 10px;
  }
  .dash-kpi-value.urgent { color: #F87171; }

  .dash-trend-chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px 2px 6px;
    border-radius: 100px;
    font-size: 11px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }
  .dash-trend-chip.up   { background: rgba(74,222,128,0.12); color: #4ADE80; }
  .dash-trend-chip.down { background: rgba(248,113,113,0.12); color: #F87171; }
  .dash-trend-chip.warn { background: rgba(232,145,111,0.15); color: #E8916F; }
  .dash-trend-chip.neu  { background: rgba(107,123,158,0.12); color: #6B7B9E; }

  /* ── Alert Banner ── */
  .dash-alert-banner {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 18px;
    background: linear-gradient(90deg, rgba(239,68,68,0.12), rgba(232,145,111,0.08));
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 12px;
    margin-bottom: 20px;
    font-size: 13px;
    color: #FCA5A5;
    font-family: 'DM Sans', sans-serif;
  }
  .dash-alert-link {
    margin-left: auto;
    font-size: 12px; font-weight: 600;
    color: #F87171;
    text-decoration: none;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
    opacity: 0.8;
    transition: opacity 0.15s;
  }
  .dash-alert-link:hover { opacity: 1; }

  /* ── Mid Section 60/40 ── */
  .dash-mid-grid {
    display: grid;
    grid-template-columns: 60fr 40fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  @media (max-width: 900px) { .dash-mid-grid { grid-template-columns: 1fr; } }

  .dash-panel {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    padding: 22px 24px;
    overflow: hidden;
  }
  .dash-panel-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 14px;
    color: #E2E8F0; margin-bottom: 20px;
    letter-spacing: -0.015em;
    display: flex; align-items: center; justify-content: space-between;
  }
  .dash-panel-sub {
    font-size: 11px; font-weight: 500;
    color: #4A5578;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 400;
  }

  /* ── Lead Pipeline Chart ── */
  .dash-chart-wrap {
    position: relative;
  }
  .dash-chart-svg {
    width: 100%;
    display: block;
  }
  .dash-chart-days {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    padding: 0 4px;
  }
  .dash-chart-day {
    font-size: 10px;
    color: #4A5578;
    font-family: 'JetBrains Mono', monospace;
    text-align: center;
    flex: 1;
  }

  /* ── Activity Feed ── */
  .dash-activity-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-height: 270px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(89,163,146,0.1) transparent;
  }
  .dash-activity-list::-webkit-scrollbar { width: 3px; }
  .dash-activity-list::-webkit-scrollbar-thumb { background: rgba(89,163,146,0.1); border-radius: 2px; }

  .dash-activity-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(89,163,146,0.05);
  }
  .dash-activity-item:last-child { border-bottom: none; }

  .dash-activity-dot {
    width: 8px; height: 8px; border-radius: 50%;
    flex-shrink: 0; margin-top: 5px;
  }
  .dot-status  { background: #59A392; }
  .dot-assign  { background: #7B9FE8; }
  .dot-ticket  { background: #F87171; }
  .dot-contact { background: #E8B84D; }
  .dot-convert { background: #4ADE80; }

  .dash-actor-circle {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, #3A589E, #59A392);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 9px;
    color: white; flex-shrink: 0;
  }

  .dash-activity-text {
    flex: 1; min-width: 0;
  }
  .dash-activity-action {
    font-size: 12.5px; color: #94A3B8;
    line-height: 1.5;
  }
  .dash-activity-action strong { color: #C8D4E8; font-weight: 600; }
  .dash-activity-time {
    font-size: 10.5px; color: #4A5578;
    font-family: 'JetBrains Mono', monospace;
    margin-top: 2px;
  }

  /* ── Bottom Tables ── */
  .dash-bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 900px) { .dash-bottom-grid { grid-template-columns: 1fr; } }

  .dash-table {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    overflow: hidden;
  }
  .dash-table-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 14px;
    color: #E2E8F0;
    letter-spacing: -0.015em;
    padding: 18px 20px 14px;
    border-bottom: 1px solid rgba(89,163,146,0.06);
    display: flex; align-items: center; justify-content: space-between;
  }
  .dash-table-link {
    font-size: 11px; font-weight: 500;
    color: #6B7B9E;
    text-decoration: none;
    font-family: 'JetBrains Mono', monospace;
    transition: color 0.15s;
  }
  .dash-table-link:hover { color: #59A392; }

  .dash-table-row {
    display: flex; align-items: center;
    padding: 12px 20px 12px 0;
    border-bottom: 1px solid rgba(89,163,146,0.04);
    gap: 12px;
    text-decoration: none;
    transition: background 0.15s;
    position: relative;
    overflow: hidden;
  }
  a.dash-table-row { cursor: pointer; }
  a.dash-table-row:hover { background: rgba(255,255,255,0.02); }
  .dash-table-row:last-child { border-bottom: none; }

  .dash-priority-bar {
    width: 3px;
    align-self: stretch;
    border-radius: 0 2px 2px 0;
    flex-shrink: 0;
  }
  .bar-urgent { background: #F87171; }
  .bar-high   { background: #E8916F; }
  .bar-normal { background: #3A589E; }
  .bar-low    { background: #4A5578; }

  .dash-row-main { flex: 1; min-width: 0; }
  .dash-row-name {
    color: #E2E8F0; font-weight: 500; font-size: 13px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .dash-row-sub {
    color: #6B7B9E; font-size: 11.5px; margin-top: 1px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .dash-badge {
    display: inline-flex; align-items: center;
    padding: 3px 9px; border-radius: 100px;
    font-size: 10.5px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase; letter-spacing: 0.04em;
    white-space: nowrap; flex-shrink: 0;
  }
  .badge-new        { background: rgba(58,88,158,0.2);    color: #7B9FE8; }
  .badge-reviewed   { background: rgba(89,163,146,0.15);  color: #72C4B2; }
  .badge-in_progress{ background: rgba(232,184,77,0.15);  color: #E8B84D; }
  .badge-converted  { background: rgba(74,222,128,0.12);  color: #4ADE80; }
  .badge-closed     { background: rgba(107,123,158,0.15); color: #6B7B9E; }
  .badge-archived   { background: rgba(107,123,158,0.1);  color: #4A5578; }
  .badge-open       { background: rgba(58,88,158,0.2);    color: #7B9FE8; }
  .badge-acknowledged { background: rgba(232,184,77,0.15); color: #E8B84D; }
  .badge-resolved   { background: rgba(74,222,128,0.12);  color: #4ADE80; }

  .badge-urgent { background: rgba(239,68,68,0.15);  color: #F87171; }
  .badge-high   { background: rgba(232,145,111,0.15); color: #E8916F; }
  .badge-normal { background: rgba(58,88,158,0.15);  color: #7B9FE8; }
  .badge-low    { background: rgba(107,123,158,0.1); color: #6B7B9E; }
  .badge-p1     { background: rgba(239,68,68,0.15);  color: #F87171; }
  .badge-p2     { background: rgba(232,145,111,0.15); color: #E8916F; }
  .badge-p3     { background: rgba(58,88,158,0.15);  color: #7B9FE8; }
  .badge-p4     { background: rgba(107,123,158,0.1); color: #6B7B9E; }

  .dash-sla-pill {
    display: inline-flex; align-items: center;
    padding: 3px 9px; border-radius: 100px;
    font-size: 10.5px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap; flex-shrink: 0;
  }
  .sla-overdue { background: rgba(239,68,68,0.15); color: #F87171; }
  .sla-soon    { background: rgba(232,184,77,0.15); color: #E8B84D; }
  .sla-ok      { background: rgba(74,222,128,0.12); color: #4ADE80; }
  .sla-none    { background: rgba(107,123,158,0.1); color: #6B7B9E; }

  .dash-time {
    color: #4A5578; font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    flex-shrink: 0;
  }
`;

function timeSince(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function slaStatus(deadline?: string): { label: string; cls: string } {
  if (!deadline) return { label: 'No SLA', cls: 'sla-none' };
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff < 0) return { label: 'Overdue', cls: 'sla-overdue' };
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return { label: `${mins}m left`, cls: 'sla-soon' };
  const hrs = Math.floor(mins / 60);
  return { label: `${hrs}h left`, cls: 'sla-ok' };
}

function actorInitials(actorId: string): string {
  const member = MOCK_TEAM.find((t) => t.id === actorId);
  return member?.initials ?? actorId.slice(0, 2).toUpperCase();
}

function actionDotCls(action: string): string {
  if (action.includes('status') || action.includes('assign')) return 'dot-status';
  if (action.includes('ticket')) return 'dot-ticket';
  if (action.includes('lifecycle')) return 'dot-contact';
  if (action.includes('convert')) return 'dot-convert';
  return 'dot-assign';
}

function formatAction(action: string, details?: Record<string, unknown>): string {
  if (action === 'submission.status_changed') {
    return `Submission moved from <strong>${details?.from}</strong> → <strong>${details?.to}</strong>`;
  }
  if (action === 'submission.assigned') {
    const tm = MOCK_TEAM.find((t) => t.id === (details?.assigned_to as string));
    return `Submission assigned to <strong>${tm?.name ?? details?.assigned_to}</strong>`;
  }
  if (action === 'ticket.acknowledged') {
    return `Ticket <strong>${details?.priority?.toString().toUpperCase()}</strong> acknowledged`;
  }
  if (action === 'contact.lifecycle_changed') {
    return `Contact stage: <strong>${details?.from}</strong> → <strong>${details?.to}</strong>`;
  }
  return action.replace('.', ' ');
}

// 7-day bar chart data (Mon–Sun, representing mock lead pipeline)
const CHART_DATA = [3, 7, 5, 9, 6, 12, 8];
const CHART_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CHART_MAX = Math.max(...CHART_DATA);
const CHART_H = 90;
const CHART_W = 100; // viewBox units, per bar slot

function LeadPipelineChart() {
  const totalW = CHART_DATA.length * CHART_W;
  const BAR_W = 40;
  const GAP = CHART_W;

  return (
    <div className="dash-chart-wrap">
      <svg
        className="dash-chart-svg"
        viewBox={`0 0 ${totalW} ${CHART_H + 10}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Lead pipeline — past 7 days"
        role="img"
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A6CB8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#59A392" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="barGradHigh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A589E" />
            <stop offset="100%" stopColor="#59A392" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.33, 0.66, 1].map((frac, i) => (
          <line
            key={i}
            x1={0}
            y1={CHART_H - CHART_H * frac}
            x2={totalW}
            y2={CHART_H - CHART_H * frac}
            stroke="rgba(89,163,146,0.06)"
            strokeWidth="1"
          />
        ))}

        {CHART_DATA.map((val, i) => {
          const barH = (val / CHART_MAX) * CHART_H;
          const x = i * GAP + (GAP - BAR_W) / 2;
          const y = CHART_H - barH;
          const isMax = val === CHART_MAX;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={BAR_W}
                height={barH}
                rx={5}
                fill={isMax ? 'url(#barGradHigh)' : 'url(#barGrad)'}
                opacity={isMax ? 1 : 0.75}
              />
              <text
                x={x + BAR_W / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="11"
                fill={isMax ? '#72C4B2' : '#4A5578'}
                fontFamily="JetBrains Mono, monospace"
                fontWeight={isMax ? '600' : '400'}
              >
                {val}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="dash-chart-days">
        {CHART_DAYS.map((d) => (
          <div key={d} className="dash-chart-day">{d}</div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const m = MOCK_METRICS;

  const urgentCount = MOCK_SUBMISSIONS.filter(
    (s) => s.priority === 'urgent' || (s.priority === 'high' && s.status === 'new'),
  ).length;

  const p1Tickets = MOCK_TICKETS.filter((t) => t.priority === 'p1' && t.status !== 'resolved' && t.status !== 'closed');
  const hasAlerts = urgentCount > 0 || p1Tickets.length > 0;

  const needsAttention = MOCK_SUBMISSIONS.filter(
    (s) => s.status === 'new' || s.priority === 'urgent' || s.priority === 'high',
  ).slice(0, 6);

  const openTickets = MOCK_TICKETS.filter(
    (t) => t.status !== 'resolved' && t.status !== 'closed',
  );

  const recentActivity = MOCK_ACTIVITY.slice(0, 8);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── Alert Banner ── */}
      {hasAlerts && (
        <div className="dash-alert-banner" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>
            {urgentCount > 0 && <><strong style={{ color: '#FCA5A5' }}>{urgentCount} urgent submission{urgentCount !== 1 ? 's' : ''}</strong> need immediate review. </>}
            {p1Tickets.length > 0 && <><strong style={{ color: '#FCA5A5' }}>{p1Tickets.length} P1 ticket{p1Tickets.length !== 1 ? 's' : ''}</strong> active.</>}
          </span>
          <Link href="/admin/services/tickets" className="dash-alert-link">
            View Tickets →
          </Link>
        </div>
      )}

      {/* ── KPI Row ── */}
      <div className="dash-kpi-grid">
        <div className="dash-kpi-card">
          <div className="dash-kpi-label">New Leads (7d)</div>
          <div className="dash-kpi-value">{m.new_leads_7d}</div>
          <span className="dash-trend-chip up">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            +{m.new_leads_trend}% vs prior week
          </span>
        </div>

        <div className="dash-kpi-card">
          <div className="dash-kpi-label">Pending Review</div>
          <div className={`dash-kpi-value${m.pending_review > 5 ? ' urgent' : ''}`}>
            {m.pending_review}
          </div>
          {m.pending_review > 5 ? (
            <span className="dash-trend-chip warn">Needs attention</span>
          ) : (
            <span className="dash-trend-chip neu">In queue</span>
          )}
        </div>

        <div className="dash-kpi-card">
          <div className="dash-kpi-label">Active Projects</div>
          <div className="dash-kpi-value">{m.active_projects}</div>
          <span className="dash-trend-chip neu">Studio + Agents</span>
        </div>

        <div className="dash-kpi-card">
          <div className="dash-kpi-label">Pipeline Value</div>
          <div className="dash-kpi-value">${Math.round(m.pipeline_value / 1000)}K</div>
          <span className="dash-trend-chip up">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            +{m.revenue_trend}% MTD
          </span>
        </div>
      </div>

      {/* ── Mid Section: Chart + Activity ── */}
      <div className="dash-mid-grid">
        <div className="dash-panel">
          <div className="dash-panel-title">
            Lead Pipeline
            <span className="dash-panel-sub">past 7 days</span>
          </div>
          <LeadPipelineChart />
        </div>

        <div className="dash-panel">
          <div className="dash-panel-title">
            Activity Feed
            <span className="dash-panel-sub">{recentActivity.length} events</span>
          </div>
          <div className="dash-activity-list">
            {recentActivity.map((log) => (
              <div key={log.id} className="dash-activity-item">
                <span
                  className={`dash-activity-dot ${actionDotCls(log.action)}`}
                  aria-hidden="true"
                />
                <div className="dash-actor-circle" aria-hidden="true">
                  {actorInitials(log.actor_id)}
                </div>
                <div className="dash-activity-text">
                  <div
                    className="dash-activity-action"
                    dangerouslySetInnerHTML={{ __html: formatAction(log.action, log.details) }}
                  />
                  <div className="dash-activity-time">{timeSince(log.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Tables ── */}
      <div className="dash-bottom-grid">
        {/* Needs Attention */}
        <div className="dash-table">
          <div className="dash-table-title">
            Needs Attention
            <Link href="/admin/submissions" className="dash-table-link">View all →</Link>
          </div>
          {needsAttention.map((sub) => (
            <Link
              key={sub.id}
              href={`/admin/submissions?id=${sub.id}`}
              className="dash-table-row"
            >
              <span className={`dash-priority-bar bar-${sub.priority}`} aria-hidden="true" />
              <div className="dash-row-main">
                <div className="dash-row-name">
                  {sub.contact?.name ?? (sub.data.name as string) ?? '—'}
                </div>
                <div className="dash-row-sub">
                  {sub.division} · {sub.type}
                </div>
              </div>
              <span className={`dash-badge badge-${sub.status}`}>
                {sub.status.replace('_', ' ')}
              </span>
              <span className={`dash-badge badge-${sub.priority}`}>{sub.priority}</span>
              <span className="dash-time">{timeSince(sub.created_at)}</span>
            </Link>
          ))}
        </div>

        {/* Open Tickets */}
        <div className="dash-table">
          <div className="dash-table-title">
            Open Tickets
            <Link href="/admin/services/tickets" className="dash-table-link">View all →</Link>
          </div>
          {openTickets.map((ticket) => {
            const sla = slaStatus(ticket.sla_response_deadline);
            return (
              <div key={ticket.id} className="dash-table-row" style={{ paddingLeft: 20 }}>
                <div className="dash-row-main">
                  <div className="dash-row-name">{ticket.title}</div>
                  {ticket.plan && (
                    <div className="dash-row-sub">Plan: {ticket.plan} · {ticket.type}</div>
                  )}
                </div>
                <span className={`dash-sla-pill ${sla.cls}`}>{sla.label}</span>
                <span className={`dash-badge badge-${ticket.status}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
                <span className={`dash-badge badge-${ticket.priority}`}>
                  {ticket.priority.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
