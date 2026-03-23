'use client'

import { useState, useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import {
  MOCK_SUBMISSIONS, MOCK_CONTACTS, MOCK_METRICS, MOCK_DEPLOYMENTS,
  MOCK_SERVICE_TICKETS, MOCK_ENROLLMENTS, MOCK_COURSES, MOCK_VENTURES_APPLICATIONS,
} from '@/lib/admin/mock-data'
import type { Division } from '@/lib/admin/types'

// ─── suppress unused-var warnings on intentionally imported data ─────────────
void MOCK_CONTACTS; void MOCK_METRICS; void MOCK_VENTURES_APPLICATIONS

// ─── Static time-series data ──────────────────────────────────────────────────

const MONTHLY_REVENUE = [
  { month: 'Jan', studio: 12400, services: 8200,  cloud: 3100, academy: 1800, agents: 4200,  ventures: 0     },
  { month: 'Feb', studio: 14200, services: 8600,  cloud: 3400, academy: 2100, agents: 5100,  ventures: 0     },
  { month: 'Mar', studio: 18600, services: 9200,  cloud: 3800, academy: 3200, agents: 6800,  ventures: 2000  },
  { month: 'Apr', studio: 15800, services: 9800,  cloud: 4200, academy: 2800, agents: 7200,  ventures: 0     },
  { month: 'May', studio: 22400, services: 10400, cloud: 4600, academy: 4100, agents: 8900,  ventures: 5000  },
  { month: 'Jun', studio: 19800, services: 11200, cloud: 5100, academy: 3600, agents: 9800,  ventures: 0     },
  { month: 'Jul', studio: 24600, services: 11800, cloud: 5400, academy: 5200, agents: 11200, ventures: 3000  },
  { month: 'Aug', studio: 21200, services: 12400, cloud: 5800, academy: 4800, agents: 12100, ventures: 0     },
  { month: 'Sep', studio: 28400, services: 13100, cloud: 6200, academy: 6100, agents: 13400, ventures: 8000  },
  { month: 'Oct', studio: 26800, services: 13800, cloud: 6800, academy: 5400, agents: 14200, ventures: 0     },
  { month: 'Nov', studio: 31200, services: 14600, cloud: 7400, academy: 7200, agents: 15800, ventures: 5000  },
  { month: 'Dec', studio: 34800, services: 15200, cloud: 8100, academy: 8900, agents: 17400, ventures: 12000 },
]

const MONTHLY_LEADS = [
  { month: 'Jan', studio: 18, services: 12, cloud: 4,  academy: 8,  agents: 6,  ventures: 3,  labs: 2 },
  { month: 'Feb', studio: 22, services: 14, cloud: 5,  academy: 11, agents: 8,  ventures: 4,  labs: 3 },
  { month: 'Mar', studio: 26, services: 16, cloud: 6,  academy: 13, agents: 9,  ventures: 5,  labs: 4 },
  { month: 'Apr', studio: 21, services: 15, cloud: 5,  academy: 10, agents: 10, ventures: 4,  labs: 3 },
  { month: 'May', studio: 30, services: 18, cloud: 8,  academy: 15, agents: 12, ventures: 6,  labs: 5 },
  { month: 'Jun', studio: 27, services: 17, cloud: 7,  academy: 12, agents: 13, ventures: 5,  labs: 4 },
  { month: 'Jul', studio: 34, services: 19, cloud: 9,  academy: 17, agents: 14, ventures: 7,  labs: 6 },
  { month: 'Aug', studio: 29, services: 20, cloud: 8,  academy: 15, agents: 15, ventures: 6,  labs: 5 },
  { month: 'Sep', studio: 38, services: 22, cloud: 10, academy: 20, agents: 17, ventures: 9,  labs: 7 },
  { month: 'Oct', studio: 35, services: 21, cloud: 11, academy: 18, agents: 18, ventures: 8,  labs: 6 },
  { month: 'Nov', studio: 42, services: 24, cloud: 12, academy: 22, agents: 20, ventures: 10, labs: 8 },
  { month: 'Dec', studio: 46, services: 26, cloud: 14, academy: 25, agents: 22, ventures: 12, labs: 9 },
]

const FUNNEL_DATA = [
  { stage: 'Submissions', count: 284, fill: '#3A589E' },
  { stage: 'Reviewed',    count: 241, fill: '#4A6CB8' },
  { stage: 'Called',      count: 156, fill: '#59A392' },
  { stage: 'Proposed',    count: 98,  fill: '#72C4B2' },
  { stage: 'Converted',   count: 67,  fill: '#4ade80' },
]

const LEAD_SCORE_DIST = [
  { range: '0-20',   count: 8,  fill: '#EF4444' },
  { range: '21-40',  count: 18, fill: '#E8916F' },
  { range: '41-60',  count: 47, fill: '#E8B84D' },
  { range: '61-80',  count: 89, fill: '#59A392' },
  { range: '81-100', count: 52, fill: '#4ade80' },
]

const DAILY_LEADS_30D = [
  { day: '1',  leads: 4 }, { day: '2',  leads: 7 }, { day: '3',  leads: 3 }, { day: '4',  leads: 9 },
  { day: '5',  leads: 5 }, { day: '6',  leads: 6 }, { day: '7',  leads: 2 }, { day: '8',  leads: 8 },
  { day: '9',  leads: 4 }, { day: '10', leads: 7 }, { day: '11', leads: 5 }, { day: '12', leads: 9 },
  { day: '13', leads: 6 }, { day: '14', leads: 3 }, { day: '15', leads: 7 }, { day: '16', leads: 8 },
  { day: '17', leads: 5 }, { day: '18', leads: 4 }, { day: '19', leads: 9 }, { day: '20', leads: 6 },
  { day: '21', leads: 7 }, { day: '22', leads: 3 }, { day: '23', leads: 8 }, { day: '24', leads: 5 },
  { day: '25', leads: 7 }, { day: '26', leads: 6 }, { day: '27', leads: 4 }, { day: '28', leads: 9 },
  { day: '29', leads: 7 }, { day: '30', leads: 8 },
]

const SLA_WEEKLY = [
  { week: 'W1',  P1: 100, P2: 92,  P3: 88, P4: 95 },
  { week: 'W2',  P1: 100, P2: 88,  P3: 91, P4: 97 },
  { week: 'W3',  P1: 75,  P2: 96,  P3: 94, P4: 98 },
  { week: 'W4',  P1: 100, P2: 100, P3: 89, P4: 94 },
  { week: 'W5',  P1: 100, P2: 94,  P3: 92, P4: 96 },
  { week: 'W6',  P1: 100, P2: 91,  P3: 87, P4: 99 },
  { week: 'W7',  P1: 100, P2: 97,  P3: 95, P4: 97 },
  { week: 'W8',  P1: 100, P2: 100, P3: 91, P4: 95 },
  { week: 'W9',  P1: 50,  P2: 89,  P3: 88, P4: 96 },
  { week: 'W10', P1: 100, P2: 95,  P3: 93, P4: 98 },
  { week: 'W11', P1: 100, P2: 98,  P3: 96, P4: 97 },
  { week: 'W12', P1: 100, P2: 100, P3: 94, P4: 99 },
]

const CONTENT_BY_MONTH = [
  { month: 'Jan', blog: 4,  case_study: 1, newsletter: 1 },
  { month: 'Feb', blog: 6,  case_study: 2, newsletter: 1 },
  { month: 'Mar', blog: 5,  case_study: 1, newsletter: 1 },
  { month: 'Apr', blog: 8,  case_study: 3, newsletter: 2 },
  { month: 'May', blog: 7,  case_study: 2, newsletter: 1 },
  { month: 'Jun', blog: 9,  case_study: 3, newsletter: 2 },
  { month: 'Jul', blog: 6,  case_study: 1, newsletter: 1 },
  { month: 'Aug', blog: 10, case_study: 4, newsletter: 2 },
  { month: 'Sep', blog: 8,  case_study: 2, newsletter: 2 },
  { month: 'Oct', blog: 11, case_study: 3, newsletter: 2 },
  { month: 'Nov', blog: 9,  case_study: 4, newsletter: 2 },
  { month: 'Dec', blog: 12, case_study: 5, newsletter: 2 },
]

const SOURCE_DATA = [
  { source: 'Organic Search', leads: 98, clients: 31, rate: 31.6, color: '#4ade80' },
  { source: 'Direct',         leads: 54, clients: 19, rate: 35.2, color: '#6BA3E8' },
  { source: 'Referral',       leads: 67, clients: 24, rate: 35.8, color: '#59A392' },
  { source: 'Social Media',   leads: 41, clients: 8,  rate: 19.5, color: '#E8B84D' },
  { source: 'Paid Search',    leads: 24, clients: 6,  rate: 25.0, color: '#E8916F' },
  { source: 'Product Hunt',   leads: 18, clients: 9,  rate: 50.0, color: '#7B6FE8' },
  { source: 'Newsletter',     leads: 12, clients: 5,  rate: 41.7, color: '#72C4B2' },
]

const UTM_DATA = [
  { campaign: 'founders-mar-2025',  medium: 'email',    leads: 34, converted: 12 },
  { campaign: 'ai-tools-launch',    medium: 'social',   leads: 28, converted: 7  },
  { campaign: 'product-hunt-drop',  medium: 'ph',       leads: 18, converted: 9  },
  { campaign: 'rescue-ship-blog',   medium: 'organic',  leads: 22, converted: 8  },
  { campaign: 'academy-launch',     medium: 'email',    leads: 15, converted: 4  },
  { campaign: 'studio-case-study',  medium: 'linkedin', leads: 19, converted: 6  },
  { campaign: 'q4-outbound',        medium: 'email',    leads: 41, converted: 14 },
]

const AGENT_STATS = [
  { agent: 'INTAKE',    runs_week: 147, success_rate: 96.2, approval_rate: 12,  edit_rate: 4.1  },
  { agent: 'HERALD',    runs_week: 89,  success_rate: 98.9, approval_rate: 35,  edit_rate: 8.2  },
  { agent: 'SCRIBE',    runs_week: 34,  success_rate: 91.2, approval_rate: 78,  edit_rate: 22.1 },
  { agent: 'OVERSEER',  runs_week: 168, success_rate: 99.4, approval_rate: 5,   edit_rate: 1.2  },
  { agent: 'PATCHER',   runs_week: 28,  success_rate: 89.3, approval_rate: 62,  edit_rate: 18.4 },
  { agent: 'ARCHITECT', runs_week: 12,  success_rate: 83.3, approval_rate: 89,  edit_rate: 41.2 },
  { agent: 'FORGE',     runs_week: 19,  success_rate: 84.2, approval_rate: 71,  edit_rate: 28.9 },
  { agent: 'SENTINEL',  runs_week: 241, success_rate: 99.6, approval_rate: 2,   edit_rate: 0.4  },
  { agent: 'ATLAS',     runs_week: 56,  success_rate: 96.4, approval_rate: 18,  edit_rate: 5.6  },
  { agent: 'CHRONICLE', runs_week: 72,  success_rate: 97.2, approval_rate: 8,   edit_rate: 2.1  },
  { agent: 'MENTOR',    runs_week: 14,  success_rate: 85.7, approval_rate: 92,  edit_rate: 35.2 },
  { agent: 'SCOUT',     runs_week: 22,  success_rate: 90.9, approval_rate: 45,  edit_rate: 14.8 },
  { agent: 'NEXUS',     runs_week: 198, success_rate: 98.5, approval_rate: 6,   edit_rate: 1.8  },
  { agent: 'SURVEYOR',  runs_week: 288, success_rate: 99.7, approval_rate: 1,   edit_rate: 0.3  },
  { agent: 'RELAY',     runs_week: 94,  success_rate: 97.8, approval_rate: 9,   edit_rate: 2.4  },
  { agent: 'AUDITOR',   runs_week: 16,  success_rate: 87.5, approval_rate: 68,  edit_rate: 24.1 },
]

const PIPELINE_VELOCITY = [
  { stage: 'New → Review',      studio: 0.5, services: 0.3, ventures: 1.2  },
  { stage: 'Review → Call',     studio: 2.1, services: 1.4, ventures: 3.8  },
  { stage: 'Call → Proposal',   studio: 4.2, services: 2.8, ventures: 8.4  },
  { stage: 'Proposal → Signed', studio: 6.8, services: 4.1, ventures: 14.2 },
  { stage: 'Signed → Building', studio: 2.0, services: 1.0, ventures: 5.0  },
]

const TOP_POSTS = [
  { title: 'Why Your AI-Generated App Crashes in Production',   division: 'studio',   views: 8420, leads: 34 },
  { title: 'The Real Cost of Not Having Monitoring',            division: 'services',  views: 5180, leads: 28 },
  { title: '5 AI Agents We Built for Our Clients This Quarter', division: 'labs',      views: 4920, leads: 19 },
  { title: 'How We Launched a SaaS in 3 Weeks',                division: 'studio',   views: 4210, leads: 22 },
  { title: 'SCARL Cohort 1: Results After 6 Weeks',            division: 'ventures',  views: 3840, leads: 8  },
  { title: 'AI Development: Hype vs Reality for Founders',     division: 'labs',      views: 3620, leads: 31 },
  { title: "Managed Cloud vs DIY AWS: A Founder's Guide",      division: 'cloud',     views: 3180, leads: 14 },
  { title: "Our New AI Academy: What We're Teaching",          division: 'academy',   views: 2940, leads: 17 },
  { title: 'From Prototype to Production: The Missing Step',   division: 'studio',   views: 2860, leads: 26 },
  { title: 'Revenue Share vs Equity: Which is Right?',         division: 'ventures',  views: 2410, leads: 6  },
]

const DIV_COLORS: Record<string, string> = {
  studio: '#72C4B2', services: '#4DBFA8', labs: '#A78BFA', products: '#E8916F',
  academy: '#E8B84D', ventures: '#6BA3E8', cloud: '#5BB5E0', agents: '#7B6FE8',
}

const AGENT_COLOR_MAP: Record<string, string> = {
  INTAKE: '#59A392', HERALD: '#6BA3E8', SCRIBE: '#7B6FE8', OVERSEER: '#E8B84D',
  PATCHER: '#E8916F', ARCHITECT: '#4DBFA8', FORGE: '#72C4B2', SENTINEL: '#EF4444',
  ATLAS: '#5BB5E0', CHRONICLE: '#A78BFA', MENTOR: '#F0D080', SCOUT: '#94A3B8',
  NEXUS: '#3A589E', SURVEYOR: '#59A392', RELAY: '#E8B84D', AUDITOR: '#EF4444',
}

// ─── Recharts dark-theme config ───────────────────────────────────────────────

const TOOLTIP_PROPS = {
  contentStyle: {
    background: '#1a1a3e',
    border: '1px solid rgba(89,163,146,0.2)',
    borderRadius: '8px',
    fontSize: '12px',
  },
  labelStyle: { color: '#E2E8F0' },
  itemStyle:  { color: '#94A3B8' },
}

const TICK  = { fill: '#4A5578', fontSize: 11 }
const ALINE = { stroke: 'rgba(255,255,255,0.06)' }
const GRID  = 'rgba(255,255,255,0.04)'

// ─── CSV download ─────────────────────────────────────────────────────────────

function downloadCSV(tab: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(',')),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `sociofi-${tab}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`
  return `$${n}`
}

function totalRevRow(row: { studio: number; services: number; cloud: number; academy: number; agents: number; ventures: number }) {
  return row.studio + row.services + row.cloud + row.academy + row.agents + row.ventures
}

function pct(a: number, b: number) {
  return b === 0 ? '—' : `${((a / b) * 100).toFixed(1)}%`
}

function complianceColor(v: number) {
  if (v >= 95) return '#4ade80'
  if (v >= 85) return '#E8B84D'
  return '#EF4444'
}

function successColor(v: number) {
  if (v >= 95) return '#4ade80'
  if (v >= 85) return '#E8B84D'
  return '#EF4444'
}

function editColor(v: number) {
  if (v <= 5)  return '#4ade80'
  if (v <= 20) return '#E8B84D'
  return '#EF4444'
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
  .an-page { background:#0a0a1a; min-height:100vh; padding:24px; font-family:'Outfit','Inter',sans-serif; color:#E2E8F0; }
  .an-hdr  { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  .an-title{ font-size:1.5rem; font-weight:700; color:#fff; margin:0; }
  .an-ctrl { display:flex; align-items:center; gap:10px; }
  .an-sel  { background:#111128; border:1px solid rgba(255,255,255,0.06); color:#94A3B8; font-size:0.82rem; padding:7px 12px; border-radius:8px; cursor:pointer; outline:none; }
  .an-sel:hover{ border-color:rgba(89,163,146,0.3); }
  .an-dl   { background:linear-gradient(135deg,#3A589E,#59A392); color:#fff; border:none; border-radius:8px; padding:7px 16px; font-size:0.82rem; font-weight:600; cursor:pointer; white-space:nowrap; }
  .an-dl:hover { opacity:0.88; }
  .an-tabs { display:flex; gap:4px; background:#111128; border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:4px; margin-bottom:24px; flex-wrap:wrap; }
  .an-tab  { padding:8px 18px; border-radius:9px; border:none; background:transparent; color:#4A5578; font-size:0.85rem; font-weight:500; cursor:pointer; transition:all 0.2s; white-space:nowrap; }
  .an-tab:hover{ color:#94A3B8; }
  .an-tab.act { background:#1e1e48; color:#fff; border-bottom:2px solid #59A392; }
  .an-card  { background:#111128; border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:20px; }
  .an-card.mb{ margin-bottom:20px; }
  .kpi-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; margin-bottom:20px; }
  .kpi-4    { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
  .kpi-box  { background:#111128; border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:16px; }
  .kpi-lbl  { font-size:0.75rem; color:#4A5578; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:6px; }
  .kpi-val  { font-size:1.6rem; font-weight:700; color:#fff; line-height:1; margin-bottom:6px; }
  .kpi-delta{ font-size:0.78rem; }
  .kpi-delta.up   { color:#4ade80; }
  .kpi-delta.dn   { color:#EF4444; }
  .kpi-delta.neut { color:#94A3B8; }
  .r2   { display:grid; grid-template-columns:3fr 2fr; gap:16px; margin-bottom:20px; }
  .r2c  { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px; }
  .r3c  { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:20px; }
  .r4c  { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
  .an-sec { font-size:0.9rem; font-weight:600; color:#CBD5E1; margin:0 0 14px 0; }
  .tbl-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; font-size:0.82rem; }
  th { color:#4A5578; font-weight:500; text-align:left; padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.06); white-space:nowrap; cursor:pointer; }
  th:hover { color:#94A3B8; }
  td { color:#94A3B8; padding:9px 10px; border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:rgba(255,255,255,0.02); }
  .badge { display:inline-block; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; }
  .bar-pill { height:6px; border-radius:3px; background:rgba(255,255,255,0.06); overflow:hidden; }
  .bar-fill { height:100%; border-radius:3px; }
  .fn-stage { margin-bottom:10px; }
  .fn-lrow  { display:flex; justify-content:space-between; margin-bottom:4px; font-size:0.8rem; }
  .fn-bg    { height:28px; background:rgba(255,255,255,0.04); border-radius:6px; overflow:hidden; }
  .fn-fill  { height:100%; border-radius:6px; display:flex; align-items:center; padding-left:10px; font-size:0.75rem; color:rgba(255,255,255,0.8); font-weight:600; }
  .srow { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
  .srow:last-child { border-bottom:none; }
  .s-lbl { font-size:0.8rem; color:#64748B; }
  .s-val { font-size:0.9rem; font-weight:600; color:#CBD5E1; }
  .fm4   { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(255,255,255,0.06); border-radius:10px; overflow:hidden; margin-bottom:20px; }
  .fm4-item { background:#111128; padding:20px; text-align:center; }
  .fm4-v { font-size:1.8rem; font-weight:700; color:#fff; }
  .fm4-l { font-size:0.72rem; color:#4A5578; text-transform:uppercase; letter-spacing:0.08em; margin-top:4px; }
  .fc-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:16px; }
  .fc-card { background:#0f0f2e; border:1px solid rgba(89,163,146,0.1); border-radius:10px; padding:16px; }
  .fc-amt  { font-size:1.4rem; font-weight:700; color:#4ade80; margin-bottom:4px; }
  .fc-conf { font-size:0.75rem; color:#64748B; }
  .geo-bar { margin-bottom:12px; }
  .geo-lr  { display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px; color:#94A3B8; }
  .sla-val { font-size:2rem; font-weight:800; }
  .sla-card{ background:#0f0f2e; border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:16px; }
  .p-badge { display:inline-block; padding:3px 10px; border-radius:5px; font-size:0.72rem; font-weight:700; margin-bottom:10px; }
  .a-dot  { width:10px; height:10px; border-radius:50%; display:inline-block; margin-right:6px; flex-shrink:0; }
  .rt-bar { display:flex; align-items:center; gap:8px; }
  .rt-bg  { flex:1; height:6px; border-radius:3px; background:rgba(255,255,255,0.06); overflow:hidden; }
  .sort-ic{ margin-left:4px; opacity:0.5; }
  .sub-card{ background:#0f0f2e; border-radius:8px; padding:14px 16px; margin-bottom:10px; }
  @media(max-width:900px){
    .kpi-grid{grid-template-columns:repeat(3,1fr);}
    .kpi-4{grid-template-columns:1fr 1fr;}
    .r2{grid-template-columns:1fr;}
    .r2c{grid-template-columns:1fr;}
    .r3c{grid-template-columns:1fr;}
    .r4c{grid-template-columns:1fr 1fr;}
    .fm4{grid-template-columns:1fr 1fr;}
    .fc-grid{grid-template-columns:1fr;}
  }
`

// ─── Shared small components ──────────────────────────────────────────────────

function KpiCard({ label, value, delta, up }: { label: string; value: string; delta: string; up: boolean | null }) {
  const cls = up === null ? 'neut' : up ? 'up' : 'dn'
  const arrow = up === null ? '' : up ? '▲ ' : '▼ '
  return (
    <div className="kpi-box">
      <div className="kpi-lbl">{label}</div>
      <div className="kpi-val">{value}</div>
      <div className={`kpi-delta ${cls}`}>{arrow}{delta}</div>
    </div>
  )
}

function SecHdr({ title }: { title: string }) {
  return <div className="an-sec">{title}</div>
}

function DivBadge({ division }: { division: string }) {
  const color = DIV_COLORS[division] ?? '#64748B'
  return <span className="badge" style={{ background: `${color}22`, color }}>{division}</span>
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const dec = MONTHLY_REVENUE[11]
  const nov = MONTHLY_REVENUE[10]
  const decTotal = totalRevRow(dec)
  const novTotal = totalRevRow(nov)
  const mrrDelta = ((decTotal - novTotal) / novTotal * 100).toFixed(1)
  const activeClients = MOCK_DEPLOYMENTS.filter(d => d.status === 'active').length
  const activeEnrollments = MOCK_ENROLLMENTS.filter(e => e.status === 'active').length
  const revenueWithTotal = MONTHLY_REVENUE.map(r => ({ ...r, total: totalRevRow(r) }))

  return (
    <>
      <div className="kpi-grid">
        <KpiCard label="MRR (Dec)"          value={fmt(decTotal)} delta={`+${mrrDelta}% vs Nov`}     up={true} />
        <KpiCard label="New Leads / Month"  value="47"            delta="+12% vs last month"          up={true} />
        <KpiCard label="Conversion Rate"    value="23.6%"         delta="67 of 284 submissions"       up={null} />
        <KpiCard label="Active Clients"     value={String(activeClients + activeEnrollments)} delta={`${activeClients} deployments`} up={null} />
        <KpiCard label="Churn Rate"         value="2.8%"          delta="▼ 0.4% vs last month"        up={true} />
      </div>

      <div className="r2">
        <div className="an-card">
          <SecHdr title="Revenue Trend — 12 Months" />
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueWithTotal} margin={{ top: 4, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="month"    tick={TICK} axisLine={ALINE} tickLine={false} />
              <YAxis tick={TICK} axisLine={ALINE} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...TOOLTIP_PROPS} formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, '']} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#4A5578' }} />
              <Line type="monotone" dataKey="total"    stroke="#ffffff" strokeWidth={2.5} dot={false} name="Total" />
              <Line type="monotone" dataKey="studio"   stroke="#72C4B2" strokeWidth={1.5} dot={false} name="Studio" />
              <Line type="monotone" dataKey="services" stroke="#4DBFA8" strokeWidth={1.5} dot={false} name="Services" />
              <Line type="monotone" dataKey="cloud"    stroke="#5BB5E0" strokeWidth={1.5} dot={false} name="Cloud" />
              <Line type="monotone" dataKey="academy"  stroke="#E8B84D" strokeWidth={1.5} dot={false} name="Academy" />
              <Line type="monotone" dataKey="agents"   stroke="#7B6FE8" strokeWidth={1.5} dot={false} name="Agents" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="an-card">
          <SecHdr title="Lead Volume — 12 Months" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_LEADS} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={TICK} axisLine={ALINE} tickLine={false} />
              <YAxis tick={TICK} axisLine={ALINE} tickLine={false} />
              <Tooltip {...TOOLTIP_PROPS} />
              <Bar dataKey="studio"   stackId="a" fill="#72C4B2" />
              <Bar dataKey="services" stackId="a" fill="#4DBFA8" />
              <Bar dataKey="cloud"    stackId="a" fill="#5BB5E0" />
              <Bar dataKey="academy"  stackId="a" fill="#E8B84D" />
              <Bar dataKey="agents"   stackId="a" fill="#7B6FE8" />
              <Bar dataKey="ventures" stackId="a" fill="#6BA3E8" />
              <Bar dataKey="labs"     stackId="a" fill="#A78BFA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="an-card mb">
        <SecHdr title="Division Comparison — Dec Leads vs Revenue" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={[
              { division: 'Studio',   leads: 46, revenue: 34800 },
              { division: 'Services', leads: 26, revenue: 15200 },
              { division: 'Cloud',    leads: 14, revenue: 8100  },
              { division: 'Academy',  leads: 25, revenue: 8900  },
              { division: 'Agents',   leads: 22, revenue: 17400 },
              { division: 'Ventures', leads: 12, revenue: 12000 },
              { division: 'Labs',     leads: 9,  revenue: 0     },
            ]}
            margin={{ top: 4, right: 30, bottom: 0, left: 0 }}
          >
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="division" tick={TICK} axisLine={ALINE} tickLine={false} />
            <YAxis yAxisId="left"  tick={TICK} axisLine={ALINE} tickLine={false} label={{ value: 'Leads', angle: -90, position: 'insideLeft', fill: '#4A5578', fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" tick={TICK} axisLine={ALINE} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} label={{ value: 'Revenue', angle: 90, position: 'insideRight', fill: '#4A5578', fontSize: 10 }} />
            <Tooltip {...TOOLTIP_PROPS} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#4A5578' }} />
            <Bar yAxisId="left"  dataKey="leads"   fill="#59A392" name="Leads" />
            <Bar yAxisId="right" dataKey="revenue" fill="#3A589E" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="an-card mb">
        <SecHdr title="Pipeline Velocity — Avg Days per Stage" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={PIPELINE_VELOCITY} layout="vertical" margin={{ top: 4, right: 20, bottom: 0, left: 120 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={TICK} axisLine={ALINE} tickLine={false} unit=" days" />
            <YAxis type="category" dataKey="stage" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={ALINE} tickLine={false} width={120} />
            <Tooltip {...TOOLTIP_PROPS} formatter={(v: unknown) => [`${Number(v)} days`, '']} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#4A5578' }} />
            <Bar dataKey="studio"   fill="#72C4B2" name="Studio" />
            <Bar dataKey="services" fill="#4DBFA8" name="Services" />
            <Bar dataKey="ventures" fill="#6BA3E8" name="Ventures" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

// ─── Revenue Tab ──────────────────────────────────────────────────────────────

function RevenueTab() {
  const PIE_DATA = [
    { name: 'Studio',   value: 34800, color: '#72C4B2' },
    { name: 'Services', value: 15200, color: '#4DBFA8' },
    { name: 'Agents',   value: 17400, color: '#7B6FE8' },
    { name: 'Academy',  value: 8900,  color: '#E8B84D' },
    { name: 'Cloud',    value: 8100,  color: '#5BB5E0' },
    { name: 'Ventures', value: 12000, color: '#6BA3E8' },
  ]
  const totalMrr = PIE_DATA.reduce((s, d) => s + d.value, 0)

  const novRevMap: Record<string, number> = {
    studio: MONTHLY_REVENUE[10].studio, services: MONTHLY_REVENUE[10].services,
    agents: MONTHLY_REVENUE[10].agents, academy: MONTHLY_REVENUE[10].academy,
    cloud: MONTHLY_REVENUE[10].cloud,   ventures: MONTHLY_REVENUE[10].ventures,
  }

  const spkPts = () =>
    [0.85, 0.88, 0.91, 0.94, 0.96, 0.98, 1.0, 1.03, 1.06, 1.09]
      .map((m, i) => `${i * 22},${40 - m * 36}`).join(' ')

  const revenueWithTotal = MONTHLY_REVENUE.map(r => ({ ...r, total: totalRevRow(r) }))

  return (
    <>
      <div className="r2c">
        <div className="an-card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0 }}>
            <SecHdr title="MRR Breakdown" />
            <PieChart width={200} height={200}>
              <Pie data={PIE_DATA} cx={100} cy={100} innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={2}>
                {PIE_DATA.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip {...TOOLTIP_PROPS} formatter={(v: unknown) => [fmt(Number(v)), '']} />
            </PieChart>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '0.75rem', color: '#4A5578' }}>Total MRR</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{fmt(totalMrr)}</div>
            </div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr><th>Division</th><th>MRR</th><th>%</th><th>MoM</th></tr>
                </thead>
                <tbody>
                  {PIE_DATA.map(d => {
                    const novVal = novRevMap[d.name.toLowerCase()] ?? 0
                    const delta  = ((d.value - novVal) / (novVal || 1) * 100).toFixed(1)
                    const up     = d.value >= novVal
                    return (
                      <tr key={d.name}>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                            {d.name}
                          </span>
                        </td>
                        <td style={{ color: '#CBD5E1' }}>{fmt(d.value)}</td>
                        <td>{pct(d.value, totalMrr)}</td>
                        <td style={{ color: up ? '#4ade80' : '#EF4444' }}>{up ? '+' : ''}{delta}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="an-card">
          <SecHdr title="Active Subscriptions" />
          {[
            { label: 'Services Retainers', count: 19, mrr: 15200 },
            { label: 'Agent Deployments',  count: 12, mrr: 17400 },
            { label: 'Cloud Hosting',      count: 8,  mrr: 8100  },
          ].map(s => (
            <div key={s.label} className="sub-card">
              <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: 4 }}>{s.label}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#E2E8F0' }}>{s.count} clients</span>
                <span style={{ fontWeight: 700, color: '#4ade80' }}>{fmt(s.mrr)} MRR</span>
              </div>
            </div>
          ))}

          <SecHdr title="ORACLE Revenue Forecast" />
          <div className="fc-grid">
            {[
              { label: '30-day', amount: '$102,400', conf: '87%' },
              { label: '60-day', amount: '$198,800', conf: '74%' },
              { label: '90-day', amount: '$289,200', conf: '61%' },
            ].map(f => (
              <div key={f.label} className="fc-card">
                <div style={{ fontSize: '0.7rem', color: '#4A5578', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{f.label}</div>
                <div className="fc-amt">{f.amount}</div>
                <div className="fc-conf">Confidence: <strong style={{ color: '#CBD5E1' }}>{f.conf}</strong></div>
                <svg style={{ display: 'block', marginTop: 10 }} width="100%" height="32" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <polyline points={spkPts()} fill="none" stroke="#59A392" strokeWidth="2" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="an-card mb">
        <SecHdr title="Revenue Trend by Division — Full Year" />
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={revenueWithTotal} margin={{ top: 4, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="month"    tick={TICK} axisLine={ALINE} tickLine={false} />
            <YAxis tick={TICK} axisLine={ALINE} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...TOOLTIP_PROPS} formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, '']} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#4A5578' }} />
            <Line type="monotone" dataKey="total"    stroke="#ffffff" strokeWidth={2.5} dot={false} name="Total" />
            <Line type="monotone" dataKey="studio"   stroke="#72C4B2" strokeWidth={1.5} dot={false} name="Studio" />
            <Line type="monotone" dataKey="services" stroke="#4DBFA8" strokeWidth={1.5} dot={false} name="Services" />
            <Line type="monotone" dataKey="agents"   stroke="#7B6FE8" strokeWidth={1.5} dot={false} name="Agents" />
            <Line type="monotone" dataKey="academy"  stroke="#E8B84D" strokeWidth={1.5} dot={false} name="Academy" />
            <Line type="monotone" dataKey="cloud"    stroke="#5BB5E0" strokeWidth={1.5} dot={false} name="Cloud" />
            <Line type="monotone" dataKey="ventures" stroke="#6BA3E8" strokeWidth={1.5} dot={false} name="Ventures" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="an-card mb">
        <SecHdr title="Academy Revenue by Course" />
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>Course</th><th>Enrollments</th><th>Revenue</th><th>Avg Price</th></tr>
            </thead>
            <tbody>
              {MOCK_COURSES.slice(0, 6).map(c => {
                const enrolled = MOCK_ENROLLMENTS.filter(e => e.course_id === c.id).length
                const revenue  = enrolled * (c.price_usd ?? 0)
                return (
                  <tr key={c.id}>
                    <td style={{ color: '#CBD5E1' }}>{c.title}</td>
                    <td>{enrolled}</td>
                    <td style={{ color: '#4ade80' }}>{fmt(revenue)}</td>
                    <td>{fmt(c.price_usd ?? 0)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ─── Leads Tab ────────────────────────────────────────────────────────────────

function LeadsTab() {
  return (
    <>
      <div className="an-card mb">
        <SecHdr title="Daily Submissions — Last 30 Days" />
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={DAILY_LEADS_30D} margin={{ top: 4, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={TICK} axisLine={ALINE} tickLine={false} interval={4} />
            <YAxis tick={TICK} axisLine={ALINE} tickLine={false} />
            <Tooltip {...TOOLTIP_PROPS} />
            <Line type="monotone" dataKey="leads" stroke="#59A392" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="r3c">
        {/* Funnel */}
        <div className="an-card">
          <SecHdr title="Conversion Funnel" />
          {FUNNEL_DATA.map((f, i) => {
            const w = (f.count / FUNNEL_DATA[0].count) * 100
            const convPct = i === 0 ? '100%' : pct(f.count, FUNNEL_DATA[0].count)
            return (
              <div key={f.stage} className="fn-stage">
                <div className="fn-lrow">
                  <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{f.stage}</span>
                  <span style={{ color: '#64748B', fontSize: '0.75rem' }}>{f.count} · {convPct}</span>
                </div>
                <div className="fn-bg">
                  <div className="fn-fill" style={{ width: `${w}%`, background: f.fill }}>
                    {w > 25 ? f.count : ''}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Lead score distribution */}
        <div className="an-card">
          <SecHdr title="Lead Score Distribution" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={LEAD_SCORE_DIST} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="range" tick={TICK} axisLine={ALINE} tickLine={false} />
              <YAxis tick={TICK} axisLine={ALINE} tickLine={false} />
              <Tooltip {...TOOLTIP_PROPS} />
              <Bar dataKey="count" name="Leads">
                {LEAD_SCORE_DIST.map(e => <Cell key={e.range} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Response time */}
        <div className="an-card">
          <SecHdr title="Response Time Metrics" />
          {[
            { label: 'Avg first response', value: '1.4 hours' },
            { label: 'Avg to proposal',    value: '4.2 days'  },
            { label: 'Avg to close',       value: '18.6 days' },
          ].map(m => (
            <div key={m.label} style={{ background: '#0f0f2e', borderRadius: 8, padding: '12px 14px', marginBottom: 10 }}>
              <div style={{ fontSize: '0.75rem', color: '#4A5578', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#CBD5E1' }}>{m.value}</div>
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: '0.8rem', color: '#4A5578', marginBottom: 10 }}>Response SLA Compliance</div>
            {[
              { label: 'Within 1hr',  p: 68,  color: '#E8916F' },
              { label: 'Within 4hr',  p: 91,  color: '#E8B84D' },
              { label: 'Within 24hr', p: 100, color: '#4ade80' },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                  <span style={{ color: '#94A3B8' }}>{s.label}</span>
                  <span style={{ color: s.color }}>{s.p}%</span>
                </div>
                <div className="bar-pill">
                  <div className="bar-fill" style={{ width: `${s.p}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Content Tab ──────────────────────────────────────────────────────────────

function ContentTab() {
  const CAT_PIE = [
    { name: 'Blog',       value: 68, color: '#59A392' },
    { name: 'Case Study', value: 22, color: '#E8916F' },
    { name: 'Newsletter', value: 10, color: '#7B6FE8' },
  ]

  return (
    <>
      <div className="an-card mb">
        <SecHdr title="Published Content by Month" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={CONTENT_BY_MONTH} margin={{ top: 4, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={TICK} axisLine={ALINE} tickLine={false} />
            <YAxis tick={TICK} axisLine={ALINE} tickLine={false} />
            <Tooltip {...TOOLTIP_PROPS} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#4A5578' }} />
            <Bar dataKey="blog"       fill="#59A392" name="Blog" />
            <Bar dataKey="case_study" fill="#E8916F" name="Case Study" />
            <Bar dataKey="newsletter" fill="#7B6FE8" name="Newsletter" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="r2c">
        <div className="an-card">
          <SecHdr title="Top Content by Leads Generated" />
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th>Title</th><th>Division</th><th>Views</th><th>Leads</th></tr>
              </thead>
              <tbody>
                {TOP_POSTS.map((p, i) => (
                  <tr key={i}>
                    <td style={{ color: '#CBD5E1', maxWidth: 260 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</span>
                    </td>
                    <td><DivBadge division={p.division} /></td>
                    <td>{p.views.toLocaleString()}</td>
                    <td style={{ color: '#4ade80' }}>{p.leads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="an-card">
          <SecHdr title="Content Metrics" />
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: '0.75rem', color: '#4A5578', marginBottom: 8 }}>Calendar Adherence</div>
            <svg width="100" height="100" viewBox="0 0 100 100" style={{ display: 'block', margin: '0 auto' }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#59A392" strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 42 * 0.78} ${2 * Math.PI * 42 * 0.22}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="54" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800">78%</text>
            </svg>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.75rem', color: '#4A5578', marginBottom: 8 }}>Category Distribution</div>
            <PieChart width={220} height={160}>
              <Pie data={CAT_PIE} cx={110} cy={80} innerRadius={50} outerRadius={72} dataKey="value" paddingAngle={2}>
                {CAT_PIE.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 10, color: '#4A5578' }} />
              <Tooltip {...TOOLTIP_PROPS} formatter={(v: unknown) => [`${Number(v)}%`, '']} />
            </PieChart>
          </div>

          <div style={{ background: '#0f0f2e', borderRadius: 8, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#4A5578', marginBottom: 4 }}>Total Published This Year</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>67</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>pieces of content</div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Agents Tab ───────────────────────────────────────────────────────────────

type AgentSortKey = 'agent' | 'runs_week' | 'success_rate' | 'approval_rate' | 'edit_rate'

function AgentsTab() {
  const [sortKey, setSortKey] = useState<AgentSortKey>('runs_week')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const sorted = useMemo(() => {
    return [...AGENT_STATS].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      if (typeof av === 'string' && typeof bv === 'string')
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
  }, [sortKey, sortDir])

  function handleSort(key: AgentSortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  function sortIc(key: AgentSortKey) {
    return <span className="sort-ic">{sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
  }

  const totalRuns  = AGENT_STATS.reduce((s, a) => s + a.runs_week, 0)
  const avgSuccess = (AGENT_STATS.reduce((s, a) => s + a.success_rate, 0) / AGENT_STATS.length).toFixed(1)

  const deploymentsByAgent = useMemo(() => {
    const counts: Record<string, number> = {}
    MOCK_DEPLOYMENTS.forEach(d => {
      const name = d.agent_name as string | undefined
      if (name) counts[name] = (counts[name] ?? 0) + 1
    })
    return Object.entries(counts).slice(0, 8).map(([agent, count]) => ({ agent, count }))
  }, [])

  return (
    <>
      <div className="fm4">
        {[
          { val: '847',           lbl: 'Runs Today'        },
          { val: `${avgSuccess}%`, lbl: 'Avg Success Rate' },
          { val: '3.2s',          lbl: 'Avg Duration'      },
          { val: '12',            lbl: 'Pending Approvals' },
        ].map(m => (
          <div key={m.lbl} className="fm4-item">
            <div className="fm4-v">{m.val}</div>
            <div className="fm4-l">{m.lbl}</div>
          </div>
        ))}
      </div>

      <div className="an-card mb">
        <SecHdr title={`Agent Performance — ${totalRuns.toLocaleString()} runs this week`} />
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('agent')}>Agent {sortIc('agent')}</th>
                <th onClick={() => handleSort('runs_week')}>Runs/Week {sortIc('runs_week')}</th>
                <th onClick={() => handleSort('success_rate')}>Success Rate {sortIc('success_rate')}</th>
                <th onClick={() => handleSort('approval_rate')}>Approval Rate {sortIc('approval_rate')}</th>
                <th onClick={() => handleSort('edit_rate')}>Edit Rate {sortIc('edit_rate')}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(a => {
                const color = AGENT_COLOR_MAP[a.agent] ?? '#64748B'
                return (
                  <tr key={a.agent}>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="a-dot" style={{ background: color }} />
                        <span style={{ color: '#E2E8F0', fontFamily: 'monospace', fontWeight: 600 }}>{a.agent}</span>
                      </span>
                    </td>
                    <td style={{ color: '#CBD5E1' }}>{a.runs_week.toLocaleString()}</td>
                    <td>
                      <div className="rt-bar">
                        <span style={{ color: successColor(a.success_rate), minWidth: 48 }}>{a.success_rate}%</span>
                        <div className="rt-bg">
                          <div className="bar-fill" style={{ width: `${a.success_rate}%`, background: successColor(a.success_rate) }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#94A3B8' }}>{a.approval_rate}%</td>
                    <td><span style={{ color: editColor(a.edit_rate) }}>{a.edit_rate}%</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {deploymentsByAgent.length > 0 && (
        <div className="an-card mb">
          <SecHdr title="Product Agent Deployments by Type" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={deploymentsByAgent} margin={{ top: 4, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="agent" tick={TICK} axisLine={ALINE} tickLine={false} />
              <YAxis tick={TICK} axisLine={ALINE} tickLine={false} />
              <Tooltip {...TOOLTIP_PROPS} />
              <Bar dataKey="count" fill="#59A392" name="Deployments" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  )
}

// ─── SLA Tab ──────────────────────────────────────────────────────────────────

function SlaTab() {
  const tickets = MOCK_SERVICE_TICKETS

  const p1Tickets = tickets.filter(t => t.priority === 'P1')
  const p1Met     = p1Tickets.filter(t => t.sla_response_met !== false && t.sla_resolution_met !== false).length
  const p1Rate    = p1Tickets.length > 0 ? Math.round(p1Met / p1Tickets.length * 100) : 100

  const allMet     = tickets.filter(t => t.sla_response_met !== false && t.sla_resolution_met !== false).length
  const overallPct = tickets.length > 0 ? Math.round(allMet / tickets.length * 100) : 100

  const breaches = tickets.filter(t => t.sla_response_met === false || t.sla_resolution_met === false)

  const PINFO = [
    { p: 'P1', label: 'Critical', color: '#EF4444', target: 'Response ≤1h · Resolution ≤4h',   rate: p1Rate, actual: 1.2,  targetH: 1  },
    { p: 'P2', label: 'High',     color: '#E8B84D', target: 'Response ≤4h · Resolution ≤24h',  rate: 92,     actual: 3.1,  targetH: 4  },
    { p: 'P3', label: 'Medium',   color: '#59A392', target: 'Response ≤8h · Resolution ≤72h',  rate: 91,     actual: 5.8,  targetH: 8  },
    { p: 'P4', label: 'Low',      color: '#64748B', target: 'Response ≤24h · Resolution ≤7d',  rate: 96,     actual: 18.0, targetH: 24 },
  ]

  const rtData = PINFO.map(p => ({
    priority: p.p,
    actual_response: p.actual,
    target_response: p.targetH,
  }))

  return (
    <>
      <div className="kpi-4">
        <KpiCard label="Overall Compliance" value={`${overallPct}%`}        delta={`${allMet}/${tickets.length} tickets`} up={overallPct >= 90} />
        <KpiCard label="P1 Compliance"      value={`${p1Rate}%`}            delta={`${p1Met}/${p1Tickets.length} critical`} up={p1Rate >= 95} />
        <KpiCard label="Avg Response Time"  value="2.4h"                    delta="across all priorities"                  up={null} />
        <KpiCard label="Breaches (30d)"     value={String(breaches.length)} delta="requiring review"                       up={breaches.length === 0} />
      </div>

      <div className="an-card mb">
        <SecHdr title="Weekly SLA Compliance — Last 12 Weeks" />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={SLA_WEEKLY} margin={{ top: 4, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={TICK} axisLine={ALINE} tickLine={false} />
            <YAxis tick={TICK} axisLine={ALINE} tickLine={false} domain={[40, 105]} unit="%" />
            <Tooltip {...TOOLTIP_PROPS} formatter={(v: unknown) => [`${Number(v)}%`, '']} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#4A5578' }} />
            <ReferenceLine y={90} stroke="#475569" strokeDasharray="4 4" label={{ value: 'Target 90%', fill: '#64748B', fontSize: 11 }} />
            <Line type="monotone" dataKey="P1" stroke="#EF4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="P2" stroke="#E8B84D" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="P3" stroke="#59A392" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="P4" stroke="#64748B" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="r4c">
        {PINFO.map(p => (
          <div key={p.p} className="sla-card">
            <span className="p-badge" style={{ background: `${p.color}22`, color: p.color }}>{p.p} — {p.label}</span>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: 10 }}>{p.target}</div>
            <div className="sla-val" style={{ color: complianceColor(p.rate) }}>{p.rate}%</div>
            <div style={{ fontSize: '0.7rem', color: '#4A5578', marginBottom: 8 }}>compliance</div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 4 }}>
                <span style={{ color: '#64748B' }}>Avg: {p.actual}h</span>
                <span style={{ color: '#4A5578' }}>Target: {p.targetH}h</span>
              </div>
              <div className="bar-pill">
                <div className="bar-fill" style={{ width: `${Math.min(100, (p.targetH / (p.actual + 0.01)) * 100)}%`, background: complianceColor(p.rate) }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="an-card mb">
        <SecHdr title="Response vs Target — By Priority" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={rtData} margin={{ top: 4, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="priority" tick={TICK} axisLine={ALINE} tickLine={false} />
            <YAxis tick={TICK} axisLine={ALINE} tickLine={false} unit="h" />
            <Tooltip {...TOOLTIP_PROPS} formatter={(v: unknown) => [`${Number(v)}h`, '']} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#4A5578' }} />
            <Bar dataKey="actual_response"  fill="#6BA3E8" name="Actual Avg Response" />
            <Bar dataKey="target_response"  fill="#475569" name="Target Response" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {breaches.length > 0 && (
        <div className="an-card mb">
          <SecHdr title="SLA Breach Log" />
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th>Ticket</th><th>Client</th><th>Priority</th><th>Type</th><th>Breach Type</th><th>Date</th></tr>
              </thead>
              <tbody>
                {breaches.map(t => (
                  <tr key={t.id}>
                    <td style={{ color: '#CBD5E1', fontFamily: 'monospace' }}>{t.id}</td>
                    <td>{t.client_name}</td>
                    <td>
                      <span className="badge" style={{ background: `${t.priority === 'P1' ? '#EF444422' : '#E8B84D22'}`, color: t.priority === 'P1' ? '#EF4444' : '#E8B84D' }}>
                        {t.priority}
                      </span>
                    </td>
                    <td>{t.type}</td>
                    <td style={{ color: '#EF4444' }}>
                      {t.sla_response_met === false && t.sla_resolution_met === false
                        ? 'Response + Resolution'
                        : t.sla_response_met === false ? 'Response' : 'Resolution'}
                    </td>
                    <td style={{ color: '#64748B' }}>{new Date(t.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Sources Tab ──────────────────────────────────────────────────────────────

function SourcesTab() {
  const sortedSources = [...SOURCE_DATA].sort((a, b) => b.rate - a.rate)
  const utmWithRate = UTM_DATA
    .map(u => ({ ...u, rate: Number(((u.converted / u.leads) * 100).toFixed(1)) }))
    .sort((a, b) => b.rate - a.rate)

  const GEO = [
    { country: 'United States',  pct: 34, color: '#6BA3E8' },
    { country: 'United Kingdom', pct: 18, color: '#72C4B2' },
    { country: 'Rest of World',  pct: 22, color: '#64748B' },
    { country: 'India',          pct: 14, color: '#E8B84D' },
    { country: 'Bangladesh',     pct: 12, color: '#4DBFA8' },
  ]

  return (
    <>
      <div className="r2c">
        <div className="an-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SecHdr title="Leads by Source" />
          <PieChart width={260} height={260}>
            <Pie data={SOURCE_DATA} cx={130} cy={130} innerRadius={70} outerRadius={110} dataKey="leads" paddingAngle={2}>
              {SOURCE_DATA.map(s => <Cell key={s.source} fill={s.color} />)}
            </Pie>
            <Tooltip {...TOOLTIP_PROPS} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#4A5578' }} />
          </PieChart>
        </div>

        <div className="an-card">
          <SecHdr title="Source to Client Conversion" />
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th>Source</th><th>Leads</th><th>Clients</th><th>Conv. Rate</th></tr>
              </thead>
              <tbody>
                {sortedSources.map(s => (
                  <tr key={s.source}>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ color: '#CBD5E1' }}>{s.source}</span>
                      </span>
                    </td>
                    <td>{s.leads}</td>
                    <td>{s.clients}</td>
                    <td>
                      <span style={{ color: s.rate >= 40 ? '#4ade80' : s.rate >= 25 ? '#E8B84D' : '#94A3B8', fontWeight: 600 }}>
                        {s.rate}%
                        {s.source === 'Product Hunt' && (
                          <span style={{ marginLeft: 6, fontSize: '0.68rem', background: '#4ade8022', color: '#4ade80', padding: '1px 6px', borderRadius: 4 }}>Best</span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="an-card mb">
        <SecHdr title="UTM Campaign Attribution" />
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>Campaign</th><th>Medium</th><th>Leads</th><th>Converted</th><th>Conv. Rate</th></tr>
            </thead>
            <tbody>
              {utmWithRate.map(u => (
                <tr key={u.campaign}>
                  <td style={{ color: '#CBD5E1', fontFamily: 'monospace', fontSize: '0.8rem' }}>{u.campaign}</td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(89,163,146,0.1)', color: '#59A392' }}>{u.medium}</span>
                  </td>
                  <td>{u.leads}</td>
                  <td>{u.converted}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: u.rate >= 40 ? '#4ade80' : '#E8B84D', minWidth: 40 }}>{u.rate}%</span>
                      <div className="bar-pill" style={{ flex: 1 }}>
                        <div className="bar-fill" style={{ width: `${u.rate}%`, background: u.rate >= 40 ? '#4ade80' : '#E8B84D' }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="an-card mb">
        <SecHdr title="Geographic Distribution" />
        <div style={{ maxWidth: 480 }}>
          {GEO.map(g => (
            <div key={g.country} className="geo-bar">
              <div className="geo-lr">
                <span>{g.country}</span>
                <span style={{ color: g.color, fontWeight: 600 }}>{g.pct}%</span>
              </div>
              <div className="bar-pill" style={{ height: 10 }}>
                <div className="bar-fill" style={{ width: `${g.pct}%`, background: g.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Main page component ──────────────────────────────────────────────────────

const TABS = ['Overview', 'Revenue', 'Leads', 'Content', 'Agents', 'SLA', 'Sources'] as const
type Tab = typeof TABS[number]

const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 12 months', 'All time'] as const

// Satisfy linter — Division is imported for type-checking context
type _D = Division

export default function AnalyticsPage() {
  const [activeTab, setActiveTab]   = useState<Tab>('Overview')
  const [dateRange, setDateRange]   = useState<string>('Last 30 days')

  function getDownloadData(): Record<string, unknown>[] {
    switch (activeTab) {
      case 'Overview': return MONTHLY_REVENUE.map(r => ({ ...r, total: totalRevRow(r) } as Record<string, unknown>))
      case 'Revenue':  return MONTHLY_REVENUE.map(r => ({ ...r, total: totalRevRow(r) } as Record<string, unknown>))
      case 'Leads':    return DAILY_LEADS_30D as Record<string, unknown>[]
      case 'Content':  return CONTENT_BY_MONTH as Record<string, unknown>[]
      case 'Agents':   return AGENT_STATS as Record<string, unknown>[]
      case 'SLA':      return SLA_WEEKLY as Record<string, unknown>[]
      case 'Sources':  return SOURCE_DATA as Record<string, unknown>[]
    }
  }

  return (
    <div className="an-page">
      <style>{STYLES}</style>

      <div className="an-hdr">
        <h1 className="an-title">Analytics</h1>
        <div className="an-ctrl">
          <select
            className="an-sel"
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
          >
            {DATE_RANGES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button className="an-dl" onClick={() => downloadCSV(activeTab.toLowerCase(), getDownloadData())}>
            Download Report
          </button>
        </div>
      </div>

      <div className="an-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`an-tab${activeTab === tab ? ' act' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && <OverviewTab />}
      {activeTab === 'Revenue'  && <RevenueTab />}
      {activeTab === 'Leads'    && <LeadsTab />}
      {activeTab === 'Content'  && <ContentTab />}
      {activeTab === 'Agents'   && <AgentsTab />}
      {activeTab === 'SLA'      && <SlaTab />}
      {activeTab === 'Sources'  && <SourcesTab />}
    </div>
  )
}
