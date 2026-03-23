'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { NewsletterIssue } from '@/lib/admin/types'
import { NEWSLETTER_STATUS_COLORS } from '@/lib/admin/types'
import { MOCK_NEWSLETTER_ISSUES, MOCK_SUBSCRIBER_LISTS } from '@/lib/admin/mock-data'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function relTime(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  return `${d} days ago`
}

// Mini sparkline using SVG
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values), min = Math.min(...values)
  const range = max - min || 1
  const w = 80, h = 28
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(values.length - 1) / (values.length - 1) * w} cy={h - ((values[values.length-1] - min) / range) * h} r="3" fill={color} />
    </svg>
  )
}

export default function NewsletterPage() {
  const [issues] = useState<NewsletterIssue[]>(MOCK_NEWSLETTER_ISSUES)

  const draft = issues.find(i => i.status === 'draft')
  const lastSent = issues.find(i => i.status === 'sent')
  const totalSubs = MOCK_SUBSCRIBER_LISTS.reduce((s, l) => s + l.subscriber_count, 0)

  // Growth trend mock data (last 6 months)
  const growthData = [672, 701, 724, 753, 790, 821, 847]
  const sentIssues = issues.filter(i => i.status === 'sent')

  const StatusBadge = ({ status }: { status: NewsletterIssue['status'] }) => {
    const c = NEWSLETTER_STATUS_COLORS[status]
    return <span style={{ background: `${c}18`, border: `1px solid ${c}35`, color: c, borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{status}</span>
  }

  return (
    <div style={{ color: '#E2E8F0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>Newsletter</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748B' }}>{totalSubs.toLocaleString()} subscribers across {MOCK_SUBSCRIBER_LISTS.length} lists</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/newsletter/subscribers" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8', borderRadius: 8, padding: '8px 14px', fontSize: '0.85rem', textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Subscribers
          </Link>
          <Link href="/admin/newsletter/new" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#3A589E,#59A392)', border: 'none', color: 'white', borderRadius: 8, padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Issue
          </Link>
        </div>
      </div>

      {/* Next issue spotlight */}
      {draft && (
        <div style={{ background: 'linear-gradient(135deg,rgba(58,88,158,0.12),rgba(89,163,146,0.08))', border: '1px solid rgba(89,163,146,0.15)', borderRadius: 14, padding: '20px 24px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#59A392', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 18, height: 1.5, background: '#59A392', display: 'inline-block' }} />Next Issue
            </div>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{draft.label}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <StatusBadge status={draft.status} />
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                {draft.prepared_by === 'curator' ? '● Prepared by CURATOR' : '● Human draft'} · Updated {relTime(draft.updated_at)}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>· {draft.recipient_count.toLocaleString()} recipients</span>
            </div>
            <p style={{ margin: '10px 0 0', fontSize: '0.83rem', color: '#94A3B8', maxWidth: 480 }}>
              <strong style={{ color: '#E2E8F0' }}>Subject A:</strong> {draft.subject_a}
            </p>
            {draft.subject_b && (
              <p style={{ margin: '4px 0 0', fontSize: '0.83rem', color: '#94A3B8', maxWidth: 480 }}>
                <strong style={{ color: '#E2E8F0' }}>Subject B:</strong> {draft.subject_b}
              </p>
            )}
          </div>
          <Link href={`/admin/newsletter/${draft.id}`} style={{ background: 'rgba(89,163,146,0.15)', border: '1px solid rgba(89,163,146,0.3)', color: '#59A392', borderRadius: 10, padding: '12px 24px', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Issue
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {/* Subscriber count */}
        <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Total Subscribers</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#4ade80' }}>{totalSubs.toLocaleString()}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 2 }}>+26 this month</div>
            </div>
            <Sparkline values={growthData} color="#4ade80" />
          </div>
        </div>

        {/* Last issue open rate */}
        <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Last Open Rate</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#E8B84D' }}>{lastSent?.open_rate ?? 0}%</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 2 }}>Avg: {(sentIssues.reduce((s,i) => s+(i.open_rate??0),0)/sentIssues.length).toFixed(1)}% all-time</div>
            </div>
            <Sparkline values={sentIssues.map(i => i.open_rate ?? 0).reverse()} color="#E8B84D" />
          </div>
        </div>

        {/* Click rate */}
        <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Last Click Rate</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#6BA3E8' }}>{lastSent?.click_rate ?? 0}%</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 2 }}>Avg: {(sentIssues.reduce((s,i) => s+(i.click_rate??0),0)/sentIssues.length).toFixed(1)}% all-time</div>
            </div>
            <Sparkline values={sentIssues.map(i => i.click_rate ?? 0).reverse()} color="#6BA3E8" />
          </div>
        </div>

        {/* Lists breakdown */}
        <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Lists</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {MOCK_SUBSCRIBER_LISTS.map(list => (
              <div key={list.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{list.name}</span>
                <span style={{ fontSize: '0.78rem', color: '#E2E8F0', fontWeight: 600 }}>{list.subscriber_count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Last issue metrics highlight */}
      {lastSent && (
        <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontFamily: "'Fira Code', monospace" }}>LAST ISSUE — {lastSent.label.toUpperCase()}</div>
          {[
            { label: 'Sent to', value: lastSent.recipient_count.toLocaleString(), color: '#E2E8F0' },
            { label: 'Open rate', value: `${lastSent.open_rate}%`, color: '#E8B84D' },
            { label: 'Click rate', value: `${lastSent.click_rate}%`, color: '#6BA3E8' },
            { label: 'Unsubscribes', value: String(lastSent.unsubscribes ?? 0), color: lastSent.unsubscribes ? '#EF4444' : '#64748B' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color, fontFamily: "'Syne', sans-serif" }}>{value}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{label}</span>
            </div>
          ))}
          <Link href={`/admin/newsletter/${lastSent.id}`} style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#64748B', textDecoration: 'none' }}>View issue →</Link>
        </div>
      )}

      {/* Issues table */}
      <div>
        <div style={{ fontSize: '0.7rem', color: '#59A392', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 18, height: 1.5, background: '#59A392', display: 'inline-block' }} />All Issues
        </div>
        <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Month','Status','Subject','Recipients','Open Rate','Click Rate','Sent Date'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => window.location.href = `/admin/newsletter/${issue.id}`}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#E2E8F0', fontFamily: "'Syne', sans-serif" }}>{issue.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 1 }}>{issue.prepared_by === 'curator' ? 'CURATOR' : 'Human'}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={issue.status} /></td>
                  <td style={{ padding: '12px 16px', maxWidth: 280 }}>
                    <div style={{ fontSize: '0.82rem', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.subject_a}</div>
                    {issue.subject_b && <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 2 }}>B: {issue.subject_b.slice(0,40)}…</div>}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#E2E8F0' }}>{issue.recipient_count.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {issue.open_rate ? (
                      <span style={{ fontSize: '0.85rem', color: issue.open_rate > 35 ? '#4ade80' : '#E8B84D', fontWeight: 600 }}>{issue.open_rate}%</span>
                    ) : <span style={{ fontSize: '0.82rem', color: '#64748B' }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {issue.click_rate ? (
                      <span style={{ fontSize: '0.85rem', color: '#6BA3E8', fontWeight: 600 }}>{issue.click_rate}%</span>
                    ) : <span style={{ fontSize: '0.82rem', color: '#64748B' }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {issue.sent_at ? new Date(issue.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
