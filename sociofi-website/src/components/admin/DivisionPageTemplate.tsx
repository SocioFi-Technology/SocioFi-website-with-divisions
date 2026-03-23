'use client'

import { useState } from 'react'
import PipelineKanban from './PipelineKanban'
import { DIVISION_COLORS, DIVISION_STAGES, STAGE_THRESHOLDS } from '@/lib/admin/types'
import { MOCK_PIPELINE } from '@/lib/admin/mock-data'

interface KPIValue {
  label: string
  value: string | number
  delta?: number
}

interface Tab {
  id: string
  label: string
  content?: React.ReactNode
}

interface DivisionPageTemplateProps {
  division: string
  kpis?: KPIValue[]
  extraTabs?: Tab[]
}

const DIVISION_LOGOS: Record<string, React.ReactNode> = {
  studio: (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 20h16M20 12v16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  services: (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="20" cy="20" r="7" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="20" cy="20" r="2" fill="currentColor"/>
    </svg>
  ),
  ventures: (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <path d="M8 32L20 8l12 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 24h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  academy: (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <path d="M20 8L36 16L20 24L4 16L20 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 21v7c0 2.8 4.5 5 10 5s10-2.2 10-5v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  cloud: (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <path d="M30 28H14a8 8 0 110-16 8 8 0 0114.4 4 6 6 0 011.6 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  agents: (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="12" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="16" cy="22" r="2" fill="currentColor"/>
      <circle cx="24" cy="22" r="2" fill="currentColor"/>
      <path d="M15 8h10M20 8v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  labs: (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <path d="M16 8v14l-8 12h24L24 22V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  products: (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <path d="M20 4L36 12v16L20 36 4 28V12L20 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 4v32M4 12l16 8 16-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
}

const DEFAULT_KPIS: Record<string, KPIValue[]> = {
  studio: [{ label: 'New Leads', value: 3 }, { label: 'In Progress', value: 2 }, { label: 'Launched', value: 1 }, { label: 'Revenue (MTD)', value: '$0' }],
  services: [{ label: 'New Leads', value: 1 }, { label: 'Active Clients', value: 1 }, { label: 'Tickets Open', value: 7 }, { label: 'MRR', value: '$0' }],
  ventures: [{ label: 'Applications', value: 2 }, { label: 'In Review', value: 1 }, { label: 'Portfolio', value: 1 }, { label: 'Fund Deployed', value: '$0' }],
  academy: [{ label: 'Enrolled', value: 1 }, { label: 'Active Learners', value: 1 }, { label: 'Certified', value: 1 }, { label: 'Revenue (MTD)', value: '$0' }],
  cloud: [{ label: 'New Leads', value: 1 }, { label: 'Active', value: 1 }, { label: 'Incidents', value: 0 }, { label: 'MRR', value: '$0' }],
  agents: [{ label: 'New Leads', value: 1 }, { label: 'Active Deployments', value: 1 }, { label: 'Monitoring', value: 3 }, { label: 'Revenue (MTD)', value: '$0' }],
  labs: [{ label: 'Projects', value: 2 }, { label: 'In Research', value: 1 }, { label: 'Published', value: 0 }, { label: '—', value: '—' }],
  products: [{ label: 'Products', value: 2 }, { label: 'Beta Users', value: 0 }, { label: 'Live Users', value: 0 }, { label: 'MRR', value: '$0' }],
}

// agents division color not in DIVISION_COLORS map (uses parent navy-bright)
const EXTENDED_DIVISION_COLORS: Record<string, string> = {
  ...DIVISION_COLORS,
  agents: '#4A6CB8',
}

export default function DivisionPageTemplate({ division, kpis, extraTabs = [] }: DivisionPageTemplateProps) {
  const [activeTab, setActiveTab] = useState('pipeline')
  const color = EXTENDED_DIVISION_COLORS[division] ?? '#59A392'
  const stages = DIVISION_STAGES[division] ?? []
  const thresholds = STAGE_THRESHOLDS[division] ?? {}
  const entries = MOCK_PIPELINE[division] ?? []
  const displayKPIs = kpis ?? DEFAULT_KPIS[division] ?? []
  const logo = DIVISION_LOGOS[division]

  const divisionName = division.charAt(0).toUpperCase() + division.slice(1)

  const allTabs: Tab[] = [
    { id: 'pipeline', label: 'Pipeline' },
    ...extraTabs,
  ]

  return (
    <div>
      {/* Division header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <div style={{ color, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', background: `${color}15`, border: `1px solid ${color}30`, borderRadius: '10px' }}>
          {logo}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#64748B', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '2px' }}>— Division</div>
          <h1 style={{ color: '#E2E8F0', fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0, letterSpacing: '-0.02em' }}>
            {divisionName}
          </h1>
        </div>
        <div style={{ height: '4px', width: '80px', background: `linear-gradient(90deg, ${color}, transparent)`, borderRadius: '2px' }} />
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {displayKPIs.map((kpi, i) => (
          <div key={i} style={{
            background: '#12162A',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px', padding: '16px',
          }}>
            <div style={{ color: '#64748B', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{kpi.label}</div>
            <div style={{ color: '#E2E8F0', fontSize: '1.6rem', fontWeight: 800, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em', lineHeight: 1 }}>
              {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
            </div>
            {kpi.delta !== undefined && (
              <div style={{ color: kpi.delta > 0 ? '#4ade80' : kpi.delta < 0 ? '#f87171' : '#64748B', fontSize: '0.72rem', marginTop: '6px' }}>
                {kpi.delta > 0 ? '↑' : kpi.delta < 0 ? '↓' : '→'} {Math.abs(kpi.delta)} vs last week
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      {allTabs.length > 1 && (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#12162A', borderRadius: '10px', padding: '6px', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
          {allTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? `${color}20` : 'transparent',
                color: activeTab === tab.id ? color : '#64748B',
                border: activeTab === tab.id ? `1px solid ${color}40` : '1px solid transparent',
                borderRadius: '7px', padding: '6px 16px',
                fontSize: '0.78rem', cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s',
                fontWeight: activeTab === tab.id ? 600 : 400,
              }}
            >{tab.label}</button>
          ))}
        </div>
      )}

      {/* Pipeline tab */}
      {activeTab === 'pipeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ color: color, fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              — {stages.length} stages · {entries.length} entries
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ background: `${color}15`, color, border: `1px solid ${color}35`, borderRadius: '7px', padding: '6px 14px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                + Add Entry
              </button>
            </div>
          </div>
          <PipelineKanban
            pipeline={division}
            stages={stages}
            divisionColor={color}
            thresholds={thresholds}
            initialEntries={entries}
          />
        </div>
      )}

      {/* Extra tabs */}
      {allTabs.filter(t => t.id !== 'pipeline').map(tab => (
        activeTab === tab.id && (
          <div key={tab.id}>
            {tab.content ?? (
              <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '48px', textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>
                {tab.label} — coming in a future prompt
              </div>
            )}
          </div>
        )
      ))}
    </div>
  )
}
