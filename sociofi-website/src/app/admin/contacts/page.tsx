'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_CONTACTS } from '@/lib/admin/mock-data'
import { DIVISION_COLORS, STAGE_COLORS, type Contact, type LifecycleStage } from '@/lib/admin/types'

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function StageBadge({ stage }: { stage: LifecycleStage }) {
  const color = STAGE_COLORS[stage]
  return (
    <span style={{ background: `${color}18`, color, border: `1px solid ${color}40`, fontSize: '0.68rem', fontWeight: 600, padding: '3px 9px', borderRadius: '100px', textTransform: 'capitalize' }}>
      {stage}
    </span>
  )
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? '#4ade80' : score >= 40 ? '#E8B84D' : '#EF4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '2px', transition: 'width 0.3s' }} />
      </div>
      <span style={{ color, fontSize: '0.72rem', fontFamily: "'Fira Code', monospace", fontWeight: 700 }}>{score}</span>
    </div>
  )
}

const STAGES: LifecycleStage[] = ['lead', 'qualified', 'opportunity', 'client', 'churned']

export default function ContactsPage() {
  const router = useRouter()
  const [contacts] = useState<Contact[]>(MOCK_CONTACTS)
  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState<string>('all')
  const [sortCol, setSortCol] = useState<keyof Contact>('last_activity_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      if (filterStage !== 'all' && c.stage !== filterStage) return false
      if (search) {
        const q = search.toLowerCase()
        return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.company ?? '').toLowerCase().includes(q)
      }
      return true
    }).sort((a, b) => {
      const av = String(a[sortCol] ?? '')
      const bv = String(b[sortCol] ?? '')
      return sortDir === 'asc' ? av > bv ? 1 : -1 : av < bv ? 1 : -1
    })
  }, [contacts, filterStage, search, sortCol, sortDir])

  const toggleSort = (col: keyof Contact) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  const thStyle = (col: keyof Contact): React.CSSProperties => ({
    padding: '10px 14px',
    color: sortCol === col ? '#59A392' : '#64748B',
    fontSize: '0.7rem',
    fontFamily: "'Fira Code', monospace",
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    textAlign: 'left' as const,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    userSelect: 'none' as const,
  })

  const stageCounts = STAGES.map(s => ({ stage: s, count: contacts.filter(c => c.stage === s).length }))

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>— CRM</div>
          <h1 style={{ color: '#E2E8F0', fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0, letterSpacing: '-0.02em' }}>Contacts</h1>
        </div>
        <div style={{ color: '#64748B', fontSize: '0.82rem' }}>{filtered.length} of {contacts.length} contacts</div>
      </div>

      {/* Stage summary pills */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[{ stage: 'all', count: contacts.length, color: '#59A392' }, ...stageCounts.map(s => ({ ...s, color: STAGE_COLORS[s.stage] }))].map(s => (
          <button key={s.stage} onClick={() => setFilterStage(s.stage)}
            style={{ background: filterStage === s.stage ? `${s.color}20` : 'rgba(255,255,255,0.03)', color: filterStage === s.stage ? s.color : '#64748B', border: `1px solid ${filterStage === s.stage ? `${s.color}40` : 'rgba(255,255,255,0.06)'}`, borderRadius: '100px', padding: '6px 14px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s' }}>
            <span style={{ textTransform: 'capitalize' }}>{s.stage}</span>
            <span style={{ background: `${s.color}25`, color: s.color, fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: '100px', fontFamily: "'Fira Code', monospace" }}>{s.count}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts by name, email or company..."
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#E2E8F0', fontSize: '0.85rem', fontFamily: "'Outfit', sans-serif" }} />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>}
      </div>

      {/* Table */}
      <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {([
                ['name', 'Name'], ['email', 'Email'], ['company', 'Company'],
                ['source', 'Source'], ['stage', 'Stage'], ['tags', 'Tags'],
                ['score', 'Score'], ['last_activity_at', 'Last Active']
              ] as [keyof Contact, string][]).map(([col, label]) => (
                <th key={col} onClick={() => toggleSort(col)} style={thStyle(col)}>
                  {label} {sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}
                onClick={() => router.push(`/admin/contacts/${c.id}`)}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#3A589E,#59A392)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: 'white', fontWeight: 700, flexShrink: 0 }}>
                      {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ color: '#E2E8F0', fontSize: '0.85rem', fontWeight: 500 }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 14px', color: '#64748B', fontSize: '0.78rem' }}>{c.email}</td>
                <td style={{ padding: '12px 14px', color: '#94A3B8', fontSize: '0.78rem' }}>{c.company ?? '—'}</td>
                <td style={{ padding: '12px 14px', color: '#64748B', fontSize: '0.75rem' }}>{c.source}</td>
                <td style={{ padding: '12px 14px' }}><StageBadge stage={c.stage} /></td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {c.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{ background: 'rgba(89,163,146,0.1)', color: '#59A392', border: '1px solid rgba(89,163,146,0.2)', fontSize: '0.65rem', padding: '1px 7px', borderRadius: '100px' }}>{tag}</span>
                    ))}
                    {c.tags.length > 3 && <span style={{ color: '#64748B', fontSize: '0.68rem' }}>+{c.tags.length - 3}</span>}
                  </div>
                </td>
                <td style={{ padding: '12px 14px' }}><ScoreBar score={c.score} /></td>
                <td style={{ padding: '12px 14px', color: '#64748B', fontSize: '0.75rem', fontFamily: "'Fira Code', monospace" }}>{relativeTime(c.last_activity_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
            No contacts match your search
          </div>
        )}
      </div>
    </div>
  )
}
