'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { ApprovalItem, ApprovalStatus, AgentName, ApprovalPriority } from '@/lib/admin/types'
import { AGENT_COLORS, APPROVAL_PRIORITY_COLORS } from '@/lib/admin/types'
import { MOCK_APPROVAL_ITEMS } from '@/lib/admin/mock-data'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const relTime = (iso: string) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// Confidence color
const confColor = (n: number) => n >= 90 ? '#4ade80' : n >= 75 ? '#E8B84D' : '#E8916F'

// ─── Discard Modal ────────────────────────────────────────────────────────────

function DiscardModal({ title, onConfirm, onClose }: {
  title: string; onConfirm: (reason: string) => void; onClose: () => void
}) {
  const [reason, setReason] = useState('')
  const presets = ['Off-brand tone', 'Factually incorrect', 'Wrong audience', 'Timing not right', 'Needs more research', 'Other']
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, width: '100%', maxWidth: 440, padding: 26 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#E2E8F0' }}>Discard — add reason</h3>
        <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748B' }}>{title}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {presets.map(p => (
            <button key={p} onClick={() => setReason(p)} style={{ background: reason === p ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${reason===p?'rgba(239,68,68,0.4)':'rgba(255,255,255,0.08)'}`, color: reason===p?'#EF4444':'#64748B', borderRadius: 100, padding: '4px 12px', fontSize: '0.78rem', cursor: 'pointer' }}>{p}</button>
          ))}
        </div>
        <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Or write a custom reason…" rows={2} style={{ width: '100%', background: '#0A0E1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', color: '#E2E8F0', fontSize: '0.85rem', fontFamily: "'Outfit', sans-serif", resize: 'none', boxSizing: 'border-box', marginBottom: 16 }} />
        <p style={{ margin: '0 0 16px', fontSize: '0.75rem', color: '#64748B' }}>This feedback is sent to the agent for learning — it will avoid similar outputs.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
          <button onClick={() => onConfirm(reason || 'No reason given')} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Discard</button>
        </div>
      </div>
    </div>
  )
}

// ─── Snooze Modal ─────────────────────────────────────────────────────────────

function SnoozeModal({ title, onConfirm, onClose }: {
  title: string; onConfirm: (until: string) => void; onClose: () => void
}) {
  const [choice, setChoice] = useState('2h')
  const options = [
    { label: '2 hours', value: '2h' }, { label: '4 hours', value: '4h' },
    { label: 'Tomorrow 9am', value: 'tomorrow' }, { label: 'End of week', value: 'eow' },
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, width: '100%', maxWidth: 380, padding: 26 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#E2E8F0' }}>Snooze</h3>
        <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#64748B' }}>{title}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
          {options.map(o => (
            <button key={o.value} onClick={() => setChoice(o.value)} style={{ background: choice===o.value?'rgba(89,163,146,0.12)':'rgba(255,255,255,0.03)', border:`1px solid ${choice===o.value?'rgba(89,163,146,0.3)':'rgba(255,255,255,0.06)'}`, color:choice===o.value?'#59A392':'#94A3B8', borderRadius:8, padding:'10px 16px', cursor:'pointer', textAlign:'left', fontSize:'0.85rem' }}>{o.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
          <button onClick={() => onConfirm(choice)} style={{ background: 'rgba(89,163,146,0.15)', border: '1px solid rgba(89,163,146,0.3)', color: '#59A392', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Snooze</button>
        </div>
      </div>
    </div>
  )
}

// ─── Approval Card ────────────────────────────────────────────────────────────

function ApprovalCard({
  item, selected, onSelect, onApprove, onEdit, onDiscard, onSnooze,
}: {
  item: ApprovalItem
  selected: boolean
  onSelect: () => void
  onApprove: (id: string) => void
  onEdit: (id: string) => void
  onDiscard: (id: string) => void
  onSnooze: (id: string) => void
}) {
  const [showFull, setShowFull] = useState(false)
  const [approving, setApproving] = useState(false)
  const agentColor = AGENT_COLORS[item.agent] ?? '#64748B'
  const priColor = APPROVAL_PRIORITY_COLORS[item.priority]
  const isEmail = item.action === 'send_email' || item.action === 'send_newsletter'
  const isContent = item.action === 'publish_content' || item.action === 'create_content'
  const payload = item.payload

  const handleApprove = async () => {
    setApproving(true)
    await new Promise(r => setTimeout(r, 800))
    onApprove(item.id)
    setApproving(false)
  }

  const ApproveBtn = ({ label = 'Approve & Send' }: { label?: string }) => (
    <button onClick={handleApprove} disabled={approving} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', borderRadius: 8, padding: '8px 14px', cursor: approving ? 'not-allowed' : 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
      {approving ? <><span style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid rgba(74,222,128,0.3)', borderTop: '1.5px solid #4ade80', animation: 'qSpin 0.8s linear infinite' }} />Sending…</> : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{label}</>}
    </button>
  )

  return (
    <div style={{ background: '#12162A', border: `1px solid ${selected ? 'rgba(89,163,146,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
      {/* Card header bar */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Checkbox */}
        <button onClick={onSelect} style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${selected ? '#59A392' : 'rgba(255,255,255,0.2)'}`, background: selected ? 'rgba(89,163,146,0.2)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {selected && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#59A392" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </button>

        {/* Agent badge */}
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${agentColor}15`, border: `1px solid ${agentColor}30`, borderRadius: 100, padding: '3px 10px', fontSize: '0.75rem', color: agentColor, fontWeight: 600, fontFamily: "'Fira Code', monospace" }}>
          {item.agent}
        </span>
        <span style={{ fontSize: '0.78rem', color: '#64748B' }}>·</span>
        <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{item.action.replace(/_/g,' ')}</span>
        <span style={{ fontSize: '0.78rem', color: '#64748B' }}>·</span>
        <span style={{ fontSize: '0.78rem', color: confColor(item.confidence), fontFamily: "'Fira Code', monospace" }}>Confidence: {item.confidence}%</span>
        <span style={{ fontSize: '0.78rem', color: '#64748B' }}>·</span>
        <span style={{ background: `${priColor}15`, color: priColor, border: `1px solid ${priColor}30`, borderRadius: 100, padding: '2px 8px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.priority}</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#64748B' }}>{relTime(item.created_at)}</span>
      </div>

      <div style={{ padding: '16px 18px' }}>

        {/* ── Email card ─────────────────────────────────────── */}
        {isEmail && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 10px', marginBottom: 14, fontSize: '0.85rem' }}>
              <span style={{ color: '#64748B' }}>To:</span>
              <span style={{ color: '#E2E8F0' }}>{payload.to_name ? `${payload.to_name} <${payload.to}>` : String(payload.to)}</span>
              <span style={{ color: '#64748B' }}>Subject:</span>
              <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{String(payload.subject)}</span>
              {!!payload.list && <><span style={{ color: '#64748B' }}>List:</span><span style={{ color: '#E2E8F0' }}>{String(payload.list)} ({String(payload.count)} subscribers)</span></>}
            </div>

            {/* Email body preview */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 18px', marginBottom: 12, fontSize: '0.83rem', color: '#E2E8F0', lineHeight: 1.7, position: 'relative', overflow: showFull ? 'visible' : 'hidden', maxHeight: showFull ? 'none' : 140 }}>
              <div dangerouslySetInnerHTML={{ __html: String(payload.html ?? '') }} />
              {!showFull && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, background: 'linear-gradient(transparent,#12162A)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8 }}>
                  <button onClick={() => setShowFull(true)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', borderRadius: 6, padding: '3px 12px', fontSize: '0.75rem', cursor: 'pointer' }}>Show full email</button>
                </div>
              )}
            </div>

            {/* Context */}
            <div style={{ fontSize: '0.78rem', color: '#64748B', background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '8px 12px', marginBottom: 14, borderLeft: `2px solid ${agentColor}40` }}>
              {item.context}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <ApproveBtn label={payload.list ? 'Approve & Send to List' : 'Approve & Send'} />
              <button onClick={() => onEdit(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(107,163,232,0.1)', border: '1px solid rgba(107,163,232,0.25)', color: '#6BA3E8', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: '0.82rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button onClick={() => onDiscard(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: '0.82rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Discard
              </button>
              <button onClick={() => onSnooze(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: '0.82rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Snooze
              </button>
            </div>
          </div>
        )}

        {/* ── Content card ────────────────────────────────────── */}
        {isContent && (
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'Blog Post', check: payload.content_type === 'blog_post' },
                { label: String(payload.division), check: true },
                { label: String(payload.category), check: true },
              ].map(({ label }) => (
                <span key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8', borderRadius: 100, padding: '3px 10px', fontSize: '0.78rem' }}>{label}</span>
              ))}
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{String(payload.word_count ?? '')} words · {String(payload.reading_time ?? '')} min read</span>
              {!!payload.slug && <a href={String(payload.slug)} style={{ fontSize: '0.75rem', color: '#64748B', textDecoration: 'none' }}>{String(payload.slug)}</a>}
            </div>

            {/* Excerpt */}
            {!!payload.excerpt && (
              <div style={{ fontSize: '0.88rem', color: '#94A3B8', fontStyle: 'italic', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: 12, marginBottom: 12, lineHeight: 1.6 }}>
                {String(payload.excerpt)}
              </div>
            )}

            {/* Content preview */}
            {!!payload.preview && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px', marginBottom: 8, fontSize: '0.83rem', color: '#E2E8F0', lineHeight: 1.8, position: 'relative', overflow: showFull ? 'visible' : 'hidden', maxHeight: showFull ? 'none' : 160, whiteSpace: 'pre-wrap' }}>
                {String(payload.preview)}
                {!showFull && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, background: 'linear-gradient(transparent,#12162A)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 10 }}>
                    <button onClick={() => setShowFull(true)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', borderRadius: 6, padding: '3px 12px', fontSize: '0.75rem', cursor: 'pointer' }}>Show full preview…</button>
                  </div>
                )}
              </div>
            )}

            {/* Context */}
            <div style={{ fontSize: '0.78rem', color: '#64748B', background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '8px 12px', marginBottom: 14, borderLeft: `2px solid ${agentColor}40` }}>
              {item.context}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <ApproveBtn label="Publish" />
              <Link href={`/admin/content/editor/${item.id}`} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(107,163,232,0.1)', border: '1px solid rgba(107,163,232,0.25)', color: '#6BA3E8', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: '0.82rem', textDecoration: 'none' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit in CMS
              </Link>
              <button onClick={() => onDiscard(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: '0.82rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Discard
              </button>
              <button onClick={() => onSnooze(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: '0.82rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Snooze
              </button>
            </div>
          </div>
        )}

        {/* ── Generic card (patch/escalate/report/deploy) ───────── */}
        {!isEmail && !isContent && (
          <div>
            <p style={{ margin: '0 0 10px', fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 600 }}>{item.title}</p>
            {/* Payload preview */}
            <div style={{ background: '#0A0E1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '12px 14px', marginBottom: 12, fontSize: '0.78rem', fontFamily: "'Fira Code', monospace", color: '#94A3B8', lineHeight: 1.7, maxHeight: 140, overflow: 'auto' }}>
              {Object.entries(payload).filter(([k]) => k !== 'html').map(([k, v]) => (
                <div key={k}><span style={{ color: '#64748B' }}>{k}:</span> <span style={{ color: '#E2E8F0' }}>{Array.isArray(v) ? v.join(', ') : String(v)}</span></div>
              ))}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '8px 12px', marginBottom: 14, borderLeft: `2px solid ${agentColor}40` }}>
              {item.context}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <ApproveBtn label={item.action === 'apply_patch' ? 'Apply Patch' : item.action === 'deploy_feature' ? 'Deploy to Staging' : item.action === 'escalate_ticket' ? 'Escalate' : 'Approve & Send'} />
              <button onClick={() => onDiscard(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: '0.82rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Discard
              </button>
              <button onClick={() => onSnooze(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: '0.82rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Snooze
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Feedback Analytics ───────────────────────────────────────────────────────

function FeedbackAnalytics({ allItems }: { allItems: ApprovalItem[] }) {
  const decided = allItems.filter(i => i.status !== 'pending')
  const approved = decided.filter(i => i.status === 'approved').length
  const edited = decided.filter(i => i.status === 'edited').length
  const discarded = decided.filter(i => i.status === 'discarded').length

  // Edit rate by agent
  const agents = [...new Set(allItems.map(i => i.agent))]
  const agentStats = agents.map(agent => {
    const items = allItems.filter(i => i.agent === agent)
    const editCount = items.filter(i => i.status === 'edited').length
    return { agent, total: items.length, editRate: items.length > 0 ? Math.round(editCount / items.length * 100) : 0 }
  }).filter(a => a.total > 0).sort((a,b) => b.editRate - a.editRate)

  const statCard = (label: string, value: number, color: string) => (
    <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px', flex: 1 }}>
      <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color }}>{value}</div>
    </div>
  )

  return (
    <div style={{ marginTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
      <div style={{ fontSize: '0.7rem', color: '#59A392', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 18, height: 1.5, background: '#59A392', display: 'inline-block' }} />
        Feedback Analytics — This Week
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        {statCard('Approved', approved, '#4ade80')}
        {statCard('Edited before approve', edited, '#E8B84D')}
        {statCard('Discarded', discarded, discarded > 0 ? '#EF4444' : '#64748B')}
        {statCard('Pending', allItems.filter(i => i.status === 'pending').length, '#94A3B8')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Edit rate by agent */}
        <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Edit Rate by Agent</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {agentStats.map(({ agent, editRate, total }) => {
              const c = AGENT_COLORS[agent as AgentName] ?? '#64748B'
              return (
                <div key={agent}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.8rem', color: c, fontFamily: "'Fira Code', monospace", fontWeight: 600 }}>{agent}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{editRate}% <span style={{ color: '#64748B', fontSize: '0.72rem' }}>({total} tasks)</span></span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${editRate}%`, background: editRate > 30 ? '#E8916F' : editRate > 15 ? '#E8B84D' : '#4ade80', borderRadius: 2 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Most common edit types */}
        <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Most Common Edit Types</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { type: 'Introduction rewrite', count: 3, note: 'Too generic' },
              { type: 'CTA added or changed', count: 2, note: 'Missing clear next step' },
              { type: 'Tone adjustment', count: 2, note: 'Too formal' },
              { type: 'Factual correction', count: 1, note: 'Outdated stat' },
              { type: 'Length trimmed', count: 1, note: 'Too long for context' },
            ].map(({ type, count, note }) => (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 7, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#E2E8F0' }}>{type}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 1 }}>{note}</div>
                </div>
                <span style={{ background: 'rgba(232,184,77,0.12)', border: '1px solid rgba(232,184,77,0.25)', color: '#E8B84D', borderRadius: 100, padding: '2px 9px', fontSize: '0.72rem', flexShrink: 0, marginLeft: 10 }}>{count}×</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AgentQueuePage() {
  const [items, setItems] = useState<ApprovalItem[]>(MOCK_APPROVAL_ITEMS)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filterAgent, setFilterAgent] = useState('all')
  const [filterType, setFilterType] = useState<'pending' | 'history'>('pending')
  const [discardModal, setDiscardModal] = useState<string | null>(null)
  const [snoozeModal, setSnoozeModal] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000) }

  const pending = useMemo(() => items.filter(i => i.status === 'pending' && (filterAgent === 'all' || i.agent === filterAgent)), [items, filterAgent])
  const history = useMemo(() => items.filter(i => i.status !== 'pending' && (filterAgent === 'all' || i.agent === filterAgent)), [items, filterAgent])
  const shown = filterType === 'pending' ? pending : history

  const decide = (id: string, status: ApprovalStatus, extra: Partial<ApprovalItem> = {}) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status, decided_at: new Date().toISOString(), decided_by: 'Arifur Rahman', ...extra } : i))
    setSelected(s => { const n = new Set(s); n.delete(id); return n })
  }

  const handleApprove = (id: string) => { decide(id, 'approved'); showToast('Approved — action executed') }
  const handleEdit = (id: string) => { decide(id, 'edited', { edit_details: { edited: true } }); showToast('Marked as edited') }
  const handleDiscard = (id: string) => setDiscardModal(id)
  const handleSnooze = (id: string) => setSnoozeModal(id)

  const confirmDiscard = (reason: string) => {
    if (discardModal) { decide(discardModal, 'discarded', { discard_reason: reason }); showToast(`Discarded — reason "${reason}" sent to agent`) }
    setDiscardModal(null)
  }
  const confirmSnooze = (until: string) => {
    if (snoozeModal) { decide(snoozeModal, 'snoozed', { snooze_until: until }); showToast(`Snoozed for ${until}`) }
    setSnoozeModal(null)
  }

  const toggleSelect = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAll = () => setSelected(s => s.size === pending.length ? new Set() : new Set(pending.map(i => i.id)))

  const batchApprove = async () => {
    const ids = [...selected]
    for (const id of ids) {
      await new Promise(r => setTimeout(r, 200))
      decide(id, 'approved')
    }
    setSelected(new Set())
    showToast(`${ids.length} items approved`)
  }

  const agentList = [...new Set(items.map(i => i.agent))]

  return (
    <div style={{ color: '#E2E8F0' }}>
      <style>{`@keyframes qSpin{to{transform:rotate(360deg)}}`}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 2000, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 10, padding: '11px 18px', fontSize: '0.85rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>Approval Queue</h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
            {pending.length} pending · {items.filter(i => i.priority === 'urgent' || i.priority === 'high').length} high priority
          </p>
        </div>
        <Link href="/admin/agents" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8', borderRadius: 8, padding: '8px 14px', fontSize: '0.85rem', textDecoration: 'none' }}>
          ← All Agents
        </Link>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Pending / History toggle */}
        <div style={{ display: 'flex', background: '#0F1320', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden', marginRight: 8 }}>
          {(['pending','history'] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)} style={{ padding: '7px 16px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', background: filterType===t?'rgba(89,163,146,0.15)':'transparent', color: filterType===t?'#59A392':'#64748B' }}>
              {t === 'pending' ? `Pending (${pending.length})` : `History (${history.length})`}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'Fira Code', monospace" }}>Agent:</span>
        <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)} style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '5px 10px', color: '#E2E8F0', fontSize: '0.8rem', cursor: 'pointer' }}>
          <option value="all">All Agents</option>
          {agentList.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Batch action bar */}
      {filterType === 'pending' && pending.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 14px', background: '#0F1320', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
          <button onClick={toggleAll} style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${selected.size === pending.length ? '#59A392' : 'rgba(255,255,255,0.2)'}`, background: selected.size === pending.length ? 'rgba(89,163,146,0.2)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {selected.size === pending.length && selected.size > 0 && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#59A392" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </button>
          <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            {selected.size > 0 ? `${selected.size} selected` : 'Select all'}
          </span>
          {selected.size > 0 && (
            <>
              <button onClick={batchApprove} style={{ marginLeft: 8, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', borderRadius: 7, padding: '6px 14px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Approve All Selected ({selected.size})
              </button>
              <button onClick={() => setSelected(new Set())} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '0.8rem' }}>Clear</button>
            </>
          )}
        </div>
      )}

      {/* Cards */}
      {shown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B', fontSize: '0.9rem' }}>
          {filterType === 'pending' ? 'No pending items — you\'re all caught up.' : 'No history yet.'}
        </div>
      ) : (
        shown.map(item => {
          if (item.status !== 'pending') {
            // History view — compact row
            const sc = item.status === 'approved' ? '#4ade80' : item.status === 'edited' ? '#E8B84D' : item.status === 'discarded' ? '#EF4444' : '#64748B'
            const ac = AGENT_COLORS[item.agent] ?? '#64748B'
            return (
              <div key={item.id} style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px 18px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, opacity: 0.75 }}>
                <span style={{ fontSize: '0.78rem', color: ac, fontFamily: "'Fira Code', monospace", fontWeight: 600, minWidth: 80 }}>{item.agent}</span>
                <span style={{ flex: 1, fontSize: '0.83rem', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                <span style={{ background: `${sc}15`, color: sc, border: `1px solid ${sc}30`, borderRadius: 100, padding: '2px 9px', fontSize: '0.72rem', flexShrink: 0 }}>{item.status}</span>
                {item.decided_by && <span style={{ fontSize: '0.72rem', color: '#64748B', flexShrink: 0 }}>by {item.decided_by}</span>}
                {item.discard_reason && <span style={{ fontSize: '0.72rem', color: '#64748B', fontStyle: 'italic', flexShrink: 0 }}>{item.discard_reason}</span>}
              </div>
            )
          }
          return (
            <ApprovalCard
              key={item.id} item={item}
              selected={selected.has(item.id)}
              onSelect={() => toggleSelect(item.id)}
              onApprove={handleApprove}
              onEdit={handleEdit}
              onDiscard={handleDiscard}
              onSnooze={handleSnooze}
            />
          )
        })
      )}

      {/* Feedback Analytics */}
      <FeedbackAnalytics allItems={items} />

      {/* Modals */}
      {discardModal && (
        <DiscardModal
          title={items.find(i => i.id === discardModal)?.title ?? ''}
          onConfirm={confirmDiscard}
          onClose={() => setDiscardModal(null)}
        />
      )}
      {snoozeModal && (
        <SnoozeModal
          title={items.find(i => i.id === snoozeModal)?.title ?? ''}
          onConfirm={confirmSnooze}
          onClose={() => setSnoozeModal(null)}
        />
      )}
    </div>
  )
}
