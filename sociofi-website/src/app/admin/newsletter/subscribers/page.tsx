'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  MOCK_SUBSCRIBERS,
  MOCK_SUBSCRIBER_LISTS,
} from '@/lib/admin/mock-data'
import type { NewsletterSubscriber, SubscriberList, SubscriberStatus } from '@/lib/admin/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<SubscriberStatus, { bg: string; text: string; dot: string }> = {
  active:       { bg: 'rgba(74,222,128,0.1)',  text: '#4ade80', dot: '#4ade80' },
  unsubscribed: { bg: 'rgba(100,116,139,0.1)', text: '#94A3B8', dot: '#64748B' },
  bounced:      { bg: 'rgba(239,68,68,0.1)',   text: '#EF4444', dot: '#EF4444' },
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function downloadCSV(subscribers: NewsletterSubscriber[]) {
  const headers = ['Email', 'Name', 'Lists', 'Source', 'Status', 'Subscribed', 'Last Opened', 'Opens', 'Clicks']
  const rows = subscribers.map(s => [
    s.email,
    s.name ?? '',
    s.lists.join('; '),
    s.source,
    s.status,
    fmt(s.subscribed_at),
    s.last_opened ? fmt(s.last_opened) : '',
    String(s.open_count),
    String(s.click_count),
  ])
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SubscriberStatus }) {
  const c = STATUS_COLORS[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: c.bg, color: c.text,
      fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.06em',
      padding: '2px 8px', borderRadius: 100, textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {status}
    </span>
  )
}

function ListBadge({ name }: { name: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'rgba(123,111,232,0.12)', color: '#A78BFA',
      fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 500,
      padding: '2px 7px', borderRadius: 100, whiteSpace: 'nowrap',
    }}>
      {name}
    </span>
  )
}

// ─── Import Modal ─────────────────────────────────────────────────────────────

function ImportModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'upload' | 'preview' | 'done'>('upload')
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name)
      setStep('preview')
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: '#13132B', border: '1px solid rgba(89,163,146,0.15)',
        borderRadius: 16, padding: 32, width: '100%', maxWidth: 480,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
            Import Subscribers
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        {step === 'upload' && (
          <>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); setFileName(e.dataTransfer.files[0]?.name ?? ''); setStep('preview') }}
              style={{
                border: `2px dashed ${dragOver ? '#7B6FE8' : 'rgba(89,163,146,0.2)'}`,
                borderRadius: 12, padding: '40px 24px', textAlign: 'center',
                background: dragOver ? 'rgba(123,111,232,0.05)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7B6FE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p style={{ color: '#7C8DB0', fontSize: '0.9rem', margin: '0 0 8px' }}>Drag & drop a CSV file, or</p>
              <label style={{
                display: 'inline-block', background: 'rgba(123,111,232,0.15)', color: '#A78BFA',
                padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              }}>
                Browse Files
                <input type="file" accept=".csv" onChange={handleFile} style={{ display: 'none' }} />
              </label>
            </div>
            <p style={{ color: '#4A5578', fontSize: '0.78rem', marginTop: 12, textAlign: 'center' }}>
              CSV format: email, name (optional), lists (optional)
            </p>
          </>
        )}

        {step === 'preview' && (
          <>
            <div style={{
              background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)',
              borderRadius: 10, padding: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ color: '#4ade80', fontSize: '0.85rem' }}>{fileName} — 3 subscribers ready to import</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['Email', 'Name', 'List'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#4A5578', fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['newuser@example.com', 'New User', 'General'],
                    ['founder@startup.io', 'Alex Kim', 'Founders'],
                    ['learn@example.com', '', 'Academy'],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: '8px 12px', color: j === 0 ? '#fff' : '#7C8DB0' }}>{cell || '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('upload')} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid rgba(89,163,146,0.2)',
                background: 'transparent', color: '#7C8DB0', cursor: 'pointer', fontSize: '0.85rem',
              }}>
                Re-upload
              </button>
              <button onClick={() => setStep('done')} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                background: 'linear-gradient(135deg, #3A589E, #59A392)', color: '#fff',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              }}>
                Import 3 Subscribers
              </button>
            </div>
          </>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'rgba(74,222,128,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.05rem', marginBottom: 8 }}>
              3 subscribers imported
            </p>
            <p style={{ color: '#7C8DB0', fontSize: '0.88rem', marginBottom: 24 }}>
              They've been added to the selected list.
            </p>
            <button onClick={onClose} style={{
              padding: '10px 28px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg, #3A589E, #59A392)', color: '#fff',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
            }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── List Manager Modal ───────────────────────────────────────────────────────

function ListManagerModal({ lists, onClose }: { lists: SubscriberList[]; onClose: () => void }) {
  const [localLists, setLocalLists] = useState(lists)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)

  function addList() {
    if (!newName.trim()) return
    const nl: SubscriberList = {
      id: `list-${Date.now()}`, name: newName.trim(), description: newDesc.trim(),
      subscriber_count: 0, created_at: new Date().toISOString(),
    }
    setLocalLists(p => [...p, nl])
    setNewName(''); setNewDesc(''); setCreating(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: '#13132B', border: '1px solid rgba(89,163,146,0.15)',
        borderRadius: 16, padding: 32, width: '100%', maxWidth: 520,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
            Manage Lists
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {localLists.map(list => (
            <div key={list.id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(89,163,146,0.1)',
              borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem', marginBottom: 2 }}>{list.name}</div>
                <div style={{ color: '#4A5578', fontSize: '0.78rem' }}>{list.description} · {list.subscriber_count.toLocaleString()} subscribers</div>
              </div>
              <button style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 14, padding: '4px 8px', borderRadius: 6 }}
                onClick={() => setLocalLists(p => p.filter(l => l.id !== list.id))}>
                Remove
              </button>
            </div>
          ))}
        </div>

        {creating ? (
          <div style={{ background: 'rgba(123,111,232,0.06)', border: '1px solid rgba(123,111,232,0.2)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <input
              placeholder="List name"
              value={newName} onChange={e => setNewName(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(89,163,146,0.2)',
                borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: '0.88rem', marginBottom: 8, boxSizing: 'border-box',
              }}
            />
            <input
              placeholder="Description (optional)"
              value={newDesc} onChange={e => setNewDesc(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(89,163,146,0.2)',
                borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: '0.88rem', marginBottom: 12, boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setCreating(false)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(89,163,146,0.2)', background: 'transparent', color: '#7C8DB0', cursor: 'pointer', fontSize: '0.82rem' }}>Cancel</button>
              <button onClick={addList} style={{ flex: 2, padding: '8px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #3A589E, #59A392)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>Create List</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setCreating(true)} style={{
            width: '100%', padding: '10px', borderRadius: 8,
            border: '1px dashed rgba(123,111,232,0.3)', background: 'rgba(123,111,232,0.05)',
            color: '#A78BFA', cursor: 'pointer', fontSize: '0.85rem', marginBottom: 16,
          }}>
            + New List
          </button>
        )}

        <button onClick={onClose} style={{
          width: '100%', padding: '10px', borderRadius: 8, border: 'none',
          background: 'linear-gradient(135deg, #3A589E, #59A392)', color: '#fff',
          cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
        }}>
          Done
        </button>
      </div>
    </div>
  )
}

// ─── Add Tags Modal ───────────────────────────────────────────────────────────

function AddTagsModal({ count, onClose }: { count: number; onClose: () => void }) {
  const SUGGESTED = ['vip', 'cold', 'hot-lead', 're-engage', 'beta-tester', 'partner']
  const [tags, setTags] = useState<string[]>([])
  const [input, setInput] = useState('')

  function addTag(t: string) {
    const clean = t.trim().toLowerCase()
    if (clean && !tags.includes(clean)) setTags(p => [...p, clean])
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: '#13132B', border: '1px solid rgba(89,163,146,0.15)',
        borderRadius: 16, padding: 32, width: '100%', maxWidth: 420,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
            Add Tags to {count} subscriber{count !== 1 ? 's' : ''}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#7C8DB0', fontSize: '0.78rem', marginBottom: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Suggested</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SUGGESTED.map(t => (
              <button key={t} onClick={() => addTag(t)} style={{
                padding: '4px 10px', borderRadius: 100,
                border: `1px solid ${tags.includes(t) ? 'rgba(123,111,232,0.5)' : 'rgba(89,163,146,0.2)'}`,
                background: tags.includes(t) ? 'rgba(123,111,232,0.15)' : 'transparent',
                color: tags.includes(t) ? '#A78BFA' : '#7C8DB0', cursor: 'pointer', fontSize: '0.78rem',
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            placeholder="Custom tag..."
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { addTag(input); setInput('') } }}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(89,163,146,0.2)',
              borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: '0.88rem',
            }}
          />
          <button onClick={() => { addTag(input); setInput('') }} style={{
            padding: '8px 14px', borderRadius: 8, border: 'none',
            background: 'rgba(89,163,146,0.15)', color: '#59A392', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
          }}>Add</button>
        </div>

        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {tags.map(t => (
              <span key={t} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(123,111,232,0.15)', color: '#A78BFA',
                padding: '3px 10px', borderRadius: 100, fontSize: '0.78rem',
              }}>
                {t}
                <button onClick={() => setTags(p => p.filter(x => x !== t))} style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid rgba(89,163,146,0.2)', background: 'transparent', color: '#7C8DB0', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
          <button onClick={onClose} disabled={tags.length === 0} style={{
            flex: 2, padding: '10px', borderRadius: 8, border: 'none',
            background: tags.length > 0 ? 'linear-gradient(135deg, #3A589E, #59A392)' : 'rgba(255,255,255,0.06)',
            color: tags.length > 0 ? '#fff' : '#4A5578',
            cursor: tags.length > 0 ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '0.85rem',
          }}>
            Apply {tags.length > 0 ? `${tags.length} Tag${tags.length > 1 ? 's' : ''}` : 'Tags'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Subscriber Row ───────────────────────────────────────────────────────────

function SubscriberRow({
  sub, selected, onToggle, lists,
}: {
  sub: NewsletterSubscriber
  selected: boolean
  onToggle: () => void
  lists: SubscriberList[]
}) {
  const [expanded, setExpanded] = useState(false)

  const listNames = sub.lists.map(lid => lists.find(l => l.id === lid)?.name ?? lid)

  return (
    <>
      <tr
        style={{
          borderTop: '1px solid rgba(89,163,146,0.07)',
          background: selected ? 'rgba(89,163,146,0.04)' : expanded ? 'rgba(255,255,255,0.015)' : 'transparent',
          transition: 'background 0.15s',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(p => !p)}
      >
        <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={selected} onChange={onToggle}
            style={{ width: 14, height: 14, accentColor: '#59A392', cursor: 'pointer' }} />
        </td>
        <td style={{ padding: '12px 16px' }}>
          <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 500 }}>{sub.email}</div>
          {sub.name && <div style={{ color: '#4A5578', fontSize: '0.78rem', marginTop: 2 }}>{sub.name}</div>}
        </td>
        <td style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {listNames.map(n => <ListBadge key={n} name={n} />)}
          </div>
        </td>
        <td style={{ padding: '12px 16px', color: '#7C8DB0', fontSize: '0.82rem' }}>{sub.source}</td>
        <td style={{ padding: '12px 16px', color: '#7C8DB0', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
          {fmt(sub.subscribed_at)}
        </td>
        <td style={{ padding: '12px 16px' }}><StatusBadge status={sub.status} /></td>
        <td style={{ padding: '12px 16px', textAlign: 'right', paddingRight: 20 }}>
          <span style={{ color: '#4A5578', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', transition: 'transform 0.2s', display: 'inline-block', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
        </td>
      </tr>
      {expanded && (
        <tr style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(89,163,146,0.06)' }}>
          <td colSpan={7} style={{ padding: '0 16px 16px 52px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: '16px 0' }}>
              {[
                { label: 'Total Opens', value: sub.open_count },
                { label: 'Total Clicks', value: sub.click_count },
                { label: 'Last Opened', value: sub.last_opened ? fmt(sub.last_opened) : '—' },
                { label: 'Tags', value: sub.tags.length ? sub.tags.join(', ') : 'None' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ color: '#4A5578', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                  <div style={{ color: '#7C8DB0', fontSize: '0.88rem' }}>{String(value)}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid rgba(89,163,146,0.07)' }}>
              <button style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(89,163,146,0.2)', background: 'transparent', color: '#59A392', cursor: 'pointer', fontSize: '0.78rem' }}>
                Edit subscriber
              </button>
              <button style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#EF4444', cursor: 'pointer', fontSize: '0.78rem' }}>
                Unsubscribe
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SubscribersPage() {
  const [subscribers] = useState<NewsletterSubscriber[]>(MOCK_SUBSCRIBERS)
  const [lists] = useState<SubscriberList[]>(MOCK_SUBSCRIBER_LISTS)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SubscriberStatus | 'all'>('all')
  const [listFilter, setListFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const [showImport, setShowImport] = useState(false)
  const [showListManager, setShowListManager] = useState(false)
  const [showAddTags, setShowAddTags] = useState(false)

  const filtered = useMemo(() => {
    return subscribers.filter(s => {
      const matchSearch = !search || s.email.toLowerCase().includes(search.toLowerCase()) || (s.name ?? '').toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || s.status === statusFilter
      const matchList = listFilter === 'all' || s.lists.includes(listFilter)
      return matchSearch && matchStatus && matchList
    })
  }, [subscribers, search, statusFilter, listFilter])

  const allSelected = filtered.length > 0 && filtered.every(s => selected.has(s.id))

  function toggleAll() {
    if (allSelected) {
      setSelected(p => { const n = new Set(p); filtered.forEach(s => n.delete(s.id)); return n })
    } else {
      setSelected(p => { const n = new Set(p); filtered.forEach(s => n.add(s.id)); return n })
    }
  }

  function toggleOne(id: string) {
    setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const activeCount = subscribers.filter(s => s.status === 'active').length
  const unsubCount = subscribers.filter(s => s.status === 'unsubscribed').length
  const bouncedCount = subscribers.filter(s => s.status === 'bounced').length
  const totalCount = subscribers.length

  // ── KPI cards
  const kpis = [
    { label: 'Total Subscribers', value: totalCount.toLocaleString(), sub: `${activeCount} active`, color: '#59A392' },
    { label: 'Active Rate', value: `${Math.round((activeCount / totalCount) * 100)}%`, sub: `${activeCount} active`, color: '#4ade80' },
    { label: 'Unsubscribed', value: unsubCount.toString(), sub: 'lifetime', color: '#64748B' },
    { label: 'Bounced', value: bouncedCount.toString(), sub: 'hard + soft', color: '#EF4444' },
  ]

  const selCount = selected.size

  return (
    <div data-admin="true" style={{ padding: '32px 32px 64px', maxWidth: 1200, margin: '0 auto' }}>

      {/* Modals */}
      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
      {showListManager && <ListManagerModal lists={lists} onClose={() => setShowListManager(false)} />}
      {showAddTags && <AddTagsModal count={selCount} onClose={() => setShowAddTags(false)} />}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Link href="/admin/newsletter" style={{ color: '#4A5578', fontSize: '0.82rem', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>
            Newsletter
          </Link>
          <span style={{ color: '#4A5578' }}>›</span>
          <span style={{ color: '#7C8DB0', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>Subscribers</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>
              Subscribers
            </h1>
            <p style={{ color: '#7C8DB0', fontSize: '0.88rem', margin: '6px 0 0' }}>
              {totalCount.toLocaleString()} total across {lists.length} lists
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowListManager(true)} style={{
              padding: '9px 16px', borderRadius: 8, border: '1px solid rgba(89,163,146,0.2)',
              background: 'transparent', color: '#7C8DB0', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Manage Lists
            </button>
            <button onClick={() => setShowImport(true)} style={{
              padding: '9px 16px', borderRadius: 8, border: '1px solid rgba(89,163,146,0.2)',
              background: 'transparent', color: '#59A392', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Import CSV
            </button>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {kpis.map(k => (
          <div key={k.label} style={{
            background: '#13132B', border: '1px solid rgba(89,163,146,0.08)',
            borderRadius: 12, padding: '16px 20px',
          }}>
            <div style={{ color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{k.label}</div>
            <div style={{ color: k.color, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4 }}>{k.value}</div>
            <div style={{ color: '#4A5578', fontSize: '0.75rem' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Lists breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
        {lists.map(list => (
          <button
            key={list.id}
            onClick={() => setListFilter(listFilter === list.id ? 'all' : list.id)}
            style={{
              padding: '10px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
              border: `1px solid ${listFilter === list.id ? 'rgba(123,111,232,0.4)' : 'rgba(89,163,146,0.1)'}`,
              background: listFilter === list.id ? 'rgba(123,111,232,0.08)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ color: listFilter === list.id ? '#A78BFA' : '#7C8DB0', fontWeight: 600, fontSize: '0.85rem', marginBottom: 2 }}>{list.name}</div>
            <div style={{ color: '#4A5578', fontSize: '0.75rem' }}>{list.subscriber_count.toLocaleString()} subscribers</div>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A5578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Search by email or name..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(89,163,146,0.15)',
              borderRadius: 8, padding: '8px 12px 8px 30px', color: '#fff', fontSize: '0.85rem',
            }}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['all', 'active', 'unsubscribed', 'bounced'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '7px 14px', borderRadius: 8, cursor: 'pointer', border: 'none', fontSize: '0.8rem',
              background: statusFilter === s ? 'rgba(89,163,146,0.15)' : 'rgba(255,255,255,0.04)',
              color: statusFilter === s ? '#59A392' : '#64748B', fontWeight: statusFilter === s ? 600 : 400,
            }}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        {selCount > 0 && (
          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
            <span style={{ color: '#7C8DB0', fontSize: '0.82rem' }}>{selCount} selected</span>
            <button onClick={() => downloadCSV(filtered.filter(s => selected.has(s.id)))} style={{
              padding: '6px 12px', borderRadius: 7, border: '1px solid rgba(89,163,146,0.2)', background: 'transparent',
              color: '#59A392', cursor: 'pointer', fontSize: '0.78rem',
            }}>Export CSV</button>
            <button onClick={() => setShowAddTags(true)} style={{
              padding: '6px 12px', borderRadius: 7, border: '1px solid rgba(123,111,232,0.25)', background: 'rgba(123,111,232,0.08)',
              color: '#A78BFA', cursor: 'pointer', fontSize: '0.78rem',
            }}>Add Tags</button>
            <button style={{
              padding: '6px 12px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent',
              color: '#EF4444', cursor: 'pointer', fontSize: '0.78rem',
            }}>Remove Inactive</button>
          </div>
        )}

        {selCount === 0 && (
          <button onClick={() => downloadCSV(filtered)} style={{
            marginLeft: 'auto', padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(89,163,146,0.2)',
            background: 'transparent', color: '#59A392', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export All
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{
        background: '#13132B', border: '1px solid rgba(89,163,146,0.08)',
        borderRadius: 14, overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.025)' }}>
              <th style={{ padding: '11px 16px', width: 44 }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll}
                  style={{ width: 14, height: 14, accentColor: '#59A392', cursor: 'pointer' }} />
              </th>
              {['Email', 'Lists', 'Source', 'Subscribed', 'Status', ''].map(h => (
                <th key={h} style={{
                  padding: '11px 16px', textAlign: 'left',
                  color: '#4A5578', fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                  fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center', color: '#4A5578', fontSize: '0.9rem' }}>
                  No subscribers match your filters.
                </td>
              </tr>
            ) : (
              filtered.map(sub => (
                <SubscriberRow
                  key={sub.id}
                  sub={sub}
                  selected={selected.has(sub.id)}
                  onToggle={() => toggleOne(sub.id)}
                  lists={lists}
                />
              ))
            )}
          </tbody>
        </table>

        {/* Footer count */}
        <div style={{
          padding: '10px 20px', borderTop: '1px solid rgba(89,163,146,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ color: '#4A5578', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
            Showing {filtered.length} of {totalCount} subscribers
          </span>
          {selCount > 0 && (
            <button onClick={() => setSelected(new Set())} style={{ background: 'none', border: 'none', color: '#4A5578', cursor: 'pointer', fontSize: '0.78rem' }}>
              Clear selection
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
