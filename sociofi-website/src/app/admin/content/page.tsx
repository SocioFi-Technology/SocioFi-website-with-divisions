'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_CONTENT } from '@/lib/admin/mock-data'
import { CONTENT_STATUS_COLORS, CONTENT_TYPE_LABELS, DIVISION_COLORS, type ContentItem, type ContentStatus, type ContentType } from '@/lib/admin/types'

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const ALL_TYPES: ContentType[] = ['blog_post','case_study','testimonial','faq','course','workshop','agent_catalog','experiment','open_source']
const STATUSES: ContentStatus[] = ['draft','review','published','archived']

const TYPE_ICONS: Record<ContentType, string> = {
  blog_post: 'POST', case_study: 'CASE', testimonial: 'TSTM', faq: 'FAQ',
  course: 'CRS', workshop: 'WRK', agent_catalog: 'AGNT', experiment: 'EXP', open_source: 'OSS',
}
const TYPE_COLORS: Record<ContentType, string> = {
  blog_post: '#59A392', case_study: '#6BA3E8', testimonial: '#E8B84D', faq: '#72C4B2',
  course: '#E8B84D', workshop: '#A78BFA', agent_catalog: '#7B6FE8', experiment: '#E8916F', open_source: '#4DBFA8',
}

export default function ContentHubPage() {
  const router = useRouter()
  const [items] = useState<ContentItem[]>(MOCK_CONTENT)
  const [activeType, setActiveType] = useState<ContentType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<ContentStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [showNewMenu, setShowNewMenu] = useState(false)

  const countFor = (type: ContentType | 'all') => {
    if (type === 'all') return items.length
    return items.filter(i => i.type === type).length
  }

  const filtered = useMemo(() => items.filter(item => {
    if (activeType !== 'all' && item.type !== activeType) return false
    if (filterStatus !== 'all' && item.status !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      return item.title.toLowerCase().includes(q) || item.author.toLowerCase().includes(q) || item.tags.some(t => t.includes(q))
    }
    return true
  }), [items, activeType, filterStatus, search])

  return (
    <div style={{ display: 'flex', gap: '0', minHeight: 'calc(100vh - 64px - 64px)' }}>
      {/* Sidebar */}
      <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '16px', marginRight: '24px' }}>
        <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>— Content Types</div>
        {(['all', ...ALL_TYPES] as (ContentType | 'all')[]).map(type => {
          const isActive = activeType === type
          const color = type === 'all' ? '#59A392' : TYPE_COLORS[type]
          return (
            <button key={type} onClick={() => setActiveType(type)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', background: isActive ? `${color}15` : 'transparent',
                border: 'none', borderLeft: `3px solid ${isActive ? color : 'transparent'}`,
                borderRadius: '0 6px 6px 0', cursor: 'pointer',
                color: isActive ? color : '#64748B', fontSize: '0.8rem',
                fontFamily: "'Outfit', sans-serif", marginBottom: '2px',
                transition: 'all 0.15s', textAlign: 'left',
              }}
            >
              <span style={{ textTransform: type === 'all' ? 'none' : 'capitalize' }}>
                {type === 'all' ? 'All Content' : CONTENT_TYPE_LABELS[type]}
              </span>
              <span style={{ background: isActive ? `${color}25` : 'rgba(255,255,255,0.06)', color: isActive ? color : '#475569', fontSize: '0.62rem', fontWeight: 700, padding: '1px 6px', borderRadius: '100px', fontFamily: "'Fira Code', monospace" }}>
                {countFor(type)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main area */}
      <div style={{ flex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>— CMS</div>
            <h1 style={{ color: '#E2E8F0', fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0, letterSpacing: '-0.02em' }}>
              {activeType === 'all' ? 'All Content' : CONTENT_TYPE_LABELS[activeType]}
            </h1>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowNewMenu(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#3A589E,#59A392)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Content
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {showNewMenu && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#12162A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '6px', zIndex: 100, minWidth: '200px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
                {ALL_TYPES.map(type => (
                  <button key={type} onClick={() => { setShowNewMenu(false); router.push(`/admin/content/editor/new?type=${type}`) }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'none', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#94A3B8', fontSize: '0.8rem', textAlign: 'left', fontFamily: "'Outfit', sans-serif", transition: 'background 0.1s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                    <span style={{ background: `${TYPE_COLORS[type]}20`, color: TYPE_COLORS[type], fontSize: '0.58rem', fontWeight: 700, padding: '2px 5px', borderRadius: '4px', fontFamily: "'Fira Code', monospace", minWidth: '32px', textAlign: 'center' }}>{TYPE_ICONS[type]}</span>
                    New {CONTENT_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {(['all', ...STATUSES] as (ContentStatus | 'all')[]).map(s => {
            const color = s === 'all' ? '#59A392' : CONTENT_STATUS_COLORS[s]
            return (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ background: filterStatus === s ? `${color}20` : 'rgba(255,255,255,0.03)', color: filterStatus === s ? color : '#64748B', border: `1px solid ${filterStatus === s ? `${color}40` : 'rgba(255,255,255,0.06)'}`, borderRadius: '100px', padding: '4px 12px', fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", textTransform: 'capitalize', transition: 'all 0.15s' }}>
                {s}
              </button>
            )
          })}
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '7px 12px', minWidth: '240px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search content…"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#E2E8F0', fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }} />
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {[['status','Status'], ['type','Type'], ['title','Title'], ['division','Division'], ['author','Author'], ['updated_at','Updated'], ['','Actions']].map(([col, label]) => (
                  <th key={col} style={{ padding: '10px 14px', color: '#64748B', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', whiteSpace: 'nowrap' }}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const statusColor = CONTENT_STATUS_COLORS[item.status]
                const typeColor = TYPE_COLORS[item.type]
                const divColor = item.division ? (DIVISION_COLORS[item.division] ?? '#59A392') : '#64748B'
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.1s', cursor: 'pointer' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 5px ${statusColor}80`, flexShrink: 0 }} />
                        <span style={{ color: '#64748B', fontSize: '0.72rem', textTransform: 'capitalize' }}>{item.status}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30`, fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', fontFamily: "'Fira Code', monospace" }}>
                        {TYPE_ICONS[item.type]}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ color: '#E2E8F0', fontSize: '0.85rem', fontWeight: 500 }}>{item.title}</div>
                      <div style={{ color: '#475569', fontSize: '0.7rem', fontFamily: "'Fira Code', monospace", marginTop: '2px' }}>{item.slug}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {item.division ? (
                        <span style={{ background: `${divColor}15`, color: divColor, border: `1px solid ${divColor}30`, fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', textTransform: 'capitalize' }}>{item.division}</span>
                      ) : <span style={{ color: '#475569' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ color: item.author_type === 'agent' ? '#59A392' : '#E2E8F0', fontSize: '0.78rem' }}>{item.author}</div>
                      {item.edited_by && <div style={{ color: '#475569', fontSize: '0.68rem' }}>edited by {item.edited_by}</div>}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748B', fontSize: '0.75rem', fontFamily: "'Fira Code', monospace", whiteSpace: 'nowrap' }}>
                      {relativeTime(item.updated_at)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[
                          { label: 'Edit', color: '#59A392', href: `/admin/content/editor/${item.id}` },
                          { label: 'Preview', color: '#6BA3E8', href: '#' },
                        ].map(btn => (
                          <button key={btn.label}
                            onClick={e => { e.stopPropagation(); if (btn.href !== '#') router.push(btn.href) }}
                            style={{ background: `${btn.color}12`, color: btn.color, border: `1px solid ${btn.color}30`, borderRadius: '5px', padding: '4px 10px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>No content found</div>
          )}
        </div>
      </div>
    </div>
  )
}
