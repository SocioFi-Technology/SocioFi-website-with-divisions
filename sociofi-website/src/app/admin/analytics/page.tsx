import { MOCK_SUBMISSIONS, MOCK_CONTACTS, MOCK_METRICS, MOCK_TICKETS } from '@/lib/admin/mock-data';
import { Division, SubmissionStatus } from '@/lib/supabase/types';

/* ── helpers ──────────────────────────────────────────────── */
function groupBy<T, K extends string>(arr: T[], key: (item: T) => K): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

function fmtCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

/* ── division accent map ──────────────────────────────────── */
const DIV_COLORS: Record<string, string> = {
  studio:   '#72C4B2',
  agents:   '#8B5CF6',
  services: '#4DBFA8',
  cloud:    '#5BB5E0',
  labs:     '#7B6FE8',
  products: '#E8916F',
  academy:  '#E8B84D',
  ventures: '#6BA3E8',
  parent:   '#4A6CB8',
};

/* ── status color map ─────────────────────────────────────── */
const STATUS_COLORS: Record<SubmissionStatus, string> = {
  new:         '#3A589E',
  reviewed:    '#E8B84D',
  in_progress: '#E8916F',
  converted:   '#4ADE80',
  closed:      '#6B7B9E',
  archived:    '#4A5578',
};

/* ── UTM source mock conversion rates ────────────────────── */
const SOURCE_CONV: Record<string, number> = {
  organic:  35,
  paid:     28,
  referral: 42,
  direct:   20,
  linkedin: 30,
  google:   25,
};

/* ─────────────────────────────────────────────────────────── */

const STYLES = `
  @keyframes barGrow {
    from { width: 0; }
    to   { width: var(--bar-w); }
  }

  .anlt-root {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* ── Page header ── */
  .anlt-page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .anlt-page-title {
    font-family: 'Manrope', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: var(--adm-text);
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .anlt-page-sub {
    font-size: 13px;
    color: var(--adm-muted);
  }
  .anlt-env-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: rgba(232,145,111,0.1);
    border: 1px solid rgba(232,145,111,0.2);
    border-radius: 100px;
    font-size: 11px;
    font-weight: 500;
    color: #E8916F;
    font-family: 'JetBrains Mono', monospace;
  }
  .anlt-env-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #E8916F;
    flex-shrink: 0;
  }

  /* ── KPI grid ── */
  .anlt-kpi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 900px) { .anlt-kpi-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 540px) { .anlt-kpi-grid { grid-template-columns: 1fr; } }

  .anlt-kpi-card {
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 14px;
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: border-color 0.2s;
  }
  .anlt-kpi-card:hover { border-color: var(--adm-border-hover); }

  .anlt-kpi-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--adm-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
  }
  .anlt-kpi-value {
    font-family: 'Manrope', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: var(--adm-text);
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .anlt-kpi-trend {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }
  .anlt-kpi-trend.up   { color: #4ADE80; }
  .anlt-kpi-trend.down { color: #F87171; }
  .anlt-kpi-trend.neutral { color: var(--adm-muted); }

  /* ── Section card wrapper ── */
  .anlt-card {
    background: var(--adm-bg2);
    border: 1px solid var(--adm-border);
    border-radius: 14px;
    padding: 24px;
  }
  .anlt-card-title {
    font-family: 'Manrope', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--adm-text);
    margin-bottom: 20px;
    letter-spacing: -0.01em;
  }

  /* ── Two-column chart row ── */
  .anlt-charts-row {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 16px;
    align-items: start;
  }
  @media (max-width: 1100px) { .anlt-charts-row { grid-template-columns: 1fr; } }

  /* ── Bar chart ── */
  .anlt-bar-chart {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .anlt-bar-row {
    display: grid;
    grid-template-columns: 80px 1fr 40px;
    align-items: center;
    gap: 10px;
  }
  .anlt-bar-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--adm-muted);
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .anlt-bar-track {
    height: 24px;
    background: rgba(255,255,255,0.04);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }
  .anlt-bar-fill {
    height: 100%;
    border-radius: 6px;
    animation: barGrow 0.8s var(--ease, cubic-bezier(0.16,1,0.3,1)) forwards;
    animation-fill-mode: forwards;
    width: 0;
  }
  .anlt-bar-count {
    font-size: 12px;
    font-weight: 600;
    color: var(--adm-text);
    font-family: 'JetBrains Mono', monospace;
    text-align: left;
  }

  /* ── Donut chart ── */
  .anlt-donut-wrap {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }
  .anlt-donut-svg { flex-shrink: 0; }
  .anlt-donut-legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    min-width: 140px;
  }
  .anlt-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
  }
  .anlt-legend-dot {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
  }
  .anlt-legend-label { color: var(--adm-muted); flex: 1; }
  .anlt-legend-val {
    font-weight: 600;
    color: var(--adm-text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
  }
  .anlt-legend-pct {
    color: var(--adm-muted);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    min-width: 36px;
    text-align: right;
  }

  /* ── Table ── */
  .anlt-table {
    width: 100%;
    border-collapse: collapse;
  }
  .anlt-table th {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--adm-muted);
    text-align: left;
    padding: 0 12px 12px;
    font-family: 'JetBrains Mono', monospace;
    border-bottom: 1px solid var(--adm-border);
  }
  .anlt-table td {
    padding: 12px;
    font-size: 13px;
    color: var(--adm-text);
    border-bottom: 1px solid var(--adm-border);
  }
  .anlt-table tr:last-child td { border-bottom: none; }
  .anlt-table tr:hover td { background: rgba(255,255,255,0.02); }

  .anlt-source-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 9px;
    border-radius: 100px;
    background: rgba(89,163,146,0.08);
    border: 1px solid rgba(89,163,146,0.12);
    font-size: 11.5px;
    font-weight: 500;
    color: var(--adm-teal);
    font-family: 'JetBrains Mono', monospace;
  }
  .anlt-conv-bar-track {
    width: 100%;
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 4px;
  }
  .anlt-conv-bar-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, #3A589E, #59A392);
  }

  /* ── SLA row ── */
  .anlt-sla-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  @media (max-width: 700px) { .anlt-sla-row { grid-template-columns: repeat(2, 1fr); } }

  .anlt-sla-metric {
    background: var(--adm-bg);
    border: 1px solid var(--adm-border);
    border-radius: 10px;
    padding: 16px;
    text-align: center;
  }
  .anlt-sla-val {
    font-family: 'Manrope', sans-serif;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }
  .anlt-sla-lbl {
    font-size: 11px;
    color: var(--adm-muted);
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* ── Note banner ── */
  .anlt-note {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: rgba(58,88,158,0.08);
    border: 1px solid rgba(58,88,158,0.14);
    border-radius: 10px;
    font-size: 12.5px;
    color: var(--adm-muted);
  }
  .anlt-note svg { flex-shrink: 0; color: #4A6CB8; }
`;

/* ── Donut chart builder ──────────────────────────────────── */
function buildDonutSegments(
  data: { label: string; value: number; color: string }[],
  r: number,
  cx: number,
  cy: number,
  gap: number
) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return [];
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return data.map((d) => {
    const pct = d.value / total;
    const dashLen = pct * circumference - gap;
    const seg = { ...d, dashLen: Math.max(dashLen, 0), dashOffset: -offset, pct };
    offset += pct * circumference;
    return seg;
  });
}

/* ── Server component ────────────────────────────────────── */
export default function AnalyticsPage() {
  /* ── Derived stats ── */
  const totalSubmissions = MOCK_SUBMISSIONS.length;
  const converted = MOCK_SUBMISSIONS.filter((s) => s.status === 'converted').length;
  const convRate = totalSubmissions > 0 ? Math.round((converted / totalSubmissions) * 100) : 0;
  const totalContacts = MOCK_CONTACTS.length;
  const activeClients = MOCK_CONTACTS.filter((c) => c.lifecycle_stage === 'client').length;
  const revenueMTD = MOCK_METRICS.revenue_mtd;
  const pipelineValue = MOCK_METRICS.pipeline_value;

  /* ── Grouped by division ── */
  const byDiv = groupBy(MOCK_SUBMISSIONS, (s) => s.division);
  const divEntries = Object.entries(byDiv)
    .map(([div, items]) => ({ div, count: items.length }))
    .sort((a, b) => b.count - a.count);
  const maxDivCount = Math.max(...divEntries.map((e) => e.count), 1);

  /* ── Grouped by status ── */
  const byStatus = groupBy(MOCK_SUBMISSIONS, (s) => s.status);
  const statusData = (Object.entries(STATUS_COLORS) as [SubmissionStatus, string][]).map(
    ([status, color]) => ({
      label: status.replace('_', ' '),
      value: byStatus[status]?.length ?? 0,
      color,
    })
  ).filter((d) => d.value > 0);

  /* ── Donut segments ── */
  const R = 80;
  const CX = 100;
  const CY = 100;
  const donutSegments = buildDonutSegments(statusData, R, CX, CY, 3);
  const donutTotal = statusData.reduce((s, d) => s + d.value, 0);

  /* ── Source groups ── */
  const bySource = groupBy(MOCK_SUBMISSIONS, (s) => s.utm_source ?? 'direct');
  const sourceEntries = Object.entries(bySource)
    .map(([src, items]) => ({
      source: src,
      count: items.length,
      pct: Math.round((items.length / totalSubmissions) * 100),
      conv: SOURCE_CONV[src] ?? 22,
    }))
    .sort((a, b) => b.count - a.count);

  /* ── SLA ── */
  const totalTickets = MOCK_TICKETS.length;
  const slaMet = MOCK_TICKETS.filter((t) => t.sla_met === true).length;
  const slaBreached = MOCK_TICKETS.filter((t) => t.sla_met === false).length;
  const slaCompliance =
    totalTickets > 0 ? Math.round(((slaMet) / (slaMet + slaBreached || 1)) * 100) : 100;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="anlt-root">

        {/* ── Page header ── */}
        <div className="anlt-page-header">
          <div>
            <h1 className="anlt-page-title">Analytics</h1>
            <p className="anlt-page-sub">Performance overview across all divisions and channels.</p>
          </div>
          <div className="anlt-env-badge">
            <span className="anlt-env-dot" />
            Mock data — development
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="anlt-kpi-grid">
          <div className="anlt-kpi-card">
            <div className="anlt-kpi-label">Total Submissions</div>
            <div className="anlt-kpi-value">{totalSubmissions}</div>
            <div className="anlt-kpi-trend neutral">All time</div>
          </div>
          <div className="anlt-kpi-card">
            <div className="anlt-kpi-label">Conversion Rate</div>
            <div className="anlt-kpi-value">{convRate}%</div>
            <div className="anlt-kpi-trend up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
              {converted} converted
            </div>
          </div>
          <div className="anlt-kpi-card">
            <div className="anlt-kpi-label">Total Contacts</div>
            <div className="anlt-kpi-value">{totalContacts}</div>
            <div className="anlt-kpi-trend up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
              +{MOCK_METRICS.new_leads_trend}% this week
            </div>
          </div>
          <div className="anlt-kpi-card">
            <div className="anlt-kpi-label">Active Clients</div>
            <div className="anlt-kpi-value">{MOCK_METRICS.services_clients}</div>
            <div className="anlt-kpi-trend neutral">{activeClients} in CRM</div>
          </div>
          <div className="anlt-kpi-card">
            <div className="anlt-kpi-label">Revenue MTD</div>
            <div className="anlt-kpi-value">{fmtCurrency(revenueMTD)}</div>
            <div className="anlt-kpi-trend up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
              +{MOCK_METRICS.revenue_trend}% vs last month
            </div>
          </div>
          <div className="anlt-kpi-card">
            <div className="anlt-kpi-label">Pipeline Value</div>
            <div className="anlt-kpi-value">{fmtCurrency(pipelineValue)}</div>
            <div className="anlt-kpi-trend up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
              {MOCK_METRICS.active_projects} active projects
            </div>
          </div>
        </div>

        {/* ── Charts row ── */}
        <div className="anlt-charts-row">

          {/* ── Bar chart — by division ── */}
          <div className="anlt-card">
            <div className="anlt-card-title">Submissions by Division</div>
            <div className="anlt-bar-chart">
              {divEntries.map((entry, i) => {
                const barPct = (entry.count / maxDivCount) * 100;
                const color = DIV_COLORS[entry.div] ?? '#4A6CB8';
                return (
                  <div className="anlt-bar-row" key={entry.div}>
                    <div className="anlt-bar-label" title={entry.div}>{entry.div}</div>
                    <div className="anlt-bar-track">
                      <div
                        className="anlt-bar-fill"
                        style={{
                          '--bar-w': `${barPct}%`,
                          background: color,
                          animationDelay: `${i * 80}ms`,
                        } as React.CSSProperties}
                      />
                    </div>
                    <div className="anlt-bar-count">{entry.count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Donut chart — by status ── */}
          <div className="anlt-card">
            <div className="anlt-card-title">Submissions by Status</div>
            <div className="anlt-donut-wrap">
              <svg
                className="anlt-donut-svg"
                width="200"
                height="200"
                viewBox="0 0 200 200"
                aria-label="Submissions by status donut chart"
                role="img"
              >
                {/* track */}
                <circle
                  cx={CX} cy={CY} r={R}
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="22"
                />
                {donutSegments.map((seg, i) => (
                  <circle
                    key={seg.label}
                    cx={CX}
                    cy={CY}
                    r={R}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="22"
                    strokeDasharray={`${seg.dashLen} ${2 * Math.PI * R - seg.dashLen}`}
                    strokeDashoffset={seg.dashOffset}
                    strokeLinecap="butt"
                    transform={`rotate(-90 ${CX} ${CY})`}
                    style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)' }}
                  />
                ))}
                {/* center label */}
                <text x={CX} y={CY - 6} textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--adm-text)" fontFamily="Manrope,sans-serif">{donutTotal}</text>
                <text x={CX} y={CY + 14} textAnchor="middle" fontSize="10" fill="var(--adm-muted)" fontFamily="JetBrains Mono,monospace">TOTAL</text>
              </svg>
              <div className="anlt-donut-legend">
                {statusData.map((d) => (
                  <div className="anlt-legend-item" key={d.label}>
                    <span className="anlt-legend-dot" style={{ background: d.color }} />
                    <span className="anlt-legend-label" style={{ textTransform: 'capitalize' }}>{d.label}</span>
                    <span className="anlt-legend-val">{d.value}</span>
                    <span className="anlt-legend-pct">{Math.round((d.value / donutTotal) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Lead Sources table ── */}
        <div className="anlt-card">
          <div className="anlt-card-title">Lead Sources</div>
          <table className="anlt-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Submissions</th>
                <th>% of Total</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {sourceEntries.map((row) => (
                <tr key={row.source}>
                  <td><span className="anlt-source-chip">{row.source}</span></td>
                  <td style={{ color: 'var(--adm-text)', fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>{row.count}</td>
                  <td style={{ color: 'var(--adm-muted)' }}>{row.pct}%</td>
                  <td style={{ minWidth: 140 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, fontSize: 12, color: row.conv >= 35 ? '#4ADE80' : row.conv >= 25 ? '#E8B84D' : '#F87171' }}>
                        {row.conv}%
                      </span>
                      <div className="anlt-conv-bar-track" style={{ flex: 1 }}>
                        <div className="anlt-conv-bar-fill" style={{ width: `${row.conv}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Ticket SLA compliance ── */}
        <div className="anlt-card">
          <div className="anlt-card-title">Ticket SLA Compliance</div>
          <div className="anlt-sla-row">
            <div className="anlt-sla-metric">
              <div className="anlt-sla-val" style={{ color: 'var(--adm-text)' }}>{totalTickets}</div>
              <div className="anlt-sla-lbl">Total Tickets</div>
            </div>
            <div className="anlt-sla-metric">
              <div className="anlt-sla-val" style={{ color: '#4ADE80' }}>{slaMet}</div>
              <div className="anlt-sla-lbl">SLA Met</div>
            </div>
            <div className="anlt-sla-metric">
              <div className="anlt-sla-val" style={{ color: '#F87171' }}>{slaBreached}</div>
              <div className="anlt-sla-lbl">SLA Breached</div>
            </div>
            <div className="anlt-sla-metric">
              <div className="anlt-sla-val" style={{ color: slaCompliance >= 90 ? '#4ADE80' : slaCompliance >= 70 ? '#E8B84D' : '#F87171' }}>
                {slaCompliance}%
              </div>
              <div className="anlt-sla-lbl">Compliance</div>
            </div>
          </div>
        </div>

        {/* ── Timeline note ── */}
        <div className="anlt-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Analytics powered by live Supabase data in production. Showing mock data in development.
        </div>

      </div>
    </>
  );
}
