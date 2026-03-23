'use client'

import { useState, useCallback, useMemo, use } from 'react'
import Link from 'next/link'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { NewsletterIssue, CuratedPost, DivisionHighlight } from '@/lib/admin/types'
import { MOCK_NEWSLETTER_ISSUES, MOCK_SUBSCRIBER_LISTS } from '@/lib/admin/mock-data'

// ─── Constants ────────────────────────────────────────────────────────────────

const DIVISION_COLORS: Record<string, string> = {
  studio: '#72C4B2', services: '#4DBFA8', labs: '#A78BFA',
  products: '#E8916F', academy: '#E8B84D', ventures: '#6BA3E8', cloud: '#5BB5E0',
}

const AVAILABLE_POSTS = [
  { id: 'blog-001', title: 'Why AI-Generated Code Needs Human Review', division: 'labs', excerpt: 'AI tools generate great code — but production-ready is a different standard.' },
  { id: 'blog-002', title: 'The Founder\'s Guide to Shipping Fast', division: 'studio', excerpt: 'Speed matters. Here\'s how to move fast without breaking what matters.' },
  { id: 'blog-003', title: 'Managed Cloud vs DIY AWS: The Real Numbers', division: 'cloud', excerpt: 'We ran the numbers on 12 client projects. The results surprised us.' },
  { id: 'blog-004', title: 'Building Autonomous AI Agents in 2026', division: 'labs', excerpt: 'The landscape of AI agent architectures has shifted dramatically.' },
  { id: 'blog-005', title: 'Understanding Managed Hosting SLAs', division: 'cloud', excerpt: 'What "99.9% uptime" actually means.' },
  { id: 'blog-006', title: 'React Native vs Flutter in 2026', division: 'studio', excerpt: 'Both are solid. Here\'s how to choose.' },
]

// ─── CURATOR API stub ─────────────────────────────────────────────────────────

async function callCurator(month: number, year: number) {
  await new Promise(r => setTimeout(r, 2200 + Math.random() * 600))
  const mName = ['January','February','March','April','May','June','July','August','September','October','November','December'][month]
  return {
    subject_a: `SocioFi ${mName}: 3 launches, a free AI workshop, and what we're building next`,
    subject_b: `What we shipped in ${mName} (and what's coming)`,
    editorial: `${mName} was our busiest month yet. Three new client products shipped to production, our Labs team published research on autonomous agent memory that got 1,200 reads in 48 hours, and we opened enrolments for the AI Engineering Bootcamp.\n\nThe pattern we keep seeing: founders who've built something solid with AI tools — but hit a wall when it's time to go live. That's exactly the gap we exist to fill.\n\nHere's what happened this month, and what we're building toward in ${['January','February','March','April','May','June','July','August','September','October','November','December'][(month+1)%12]}.`,
    curated_posts: AVAILABLE_POSTS.slice(0, 3).map((p, i) => ({
      id: `cp-new-${i}`, post_id: p.id, title: p.title, excerpt: p.excerpt,
      url: `/${p.division}/blog/${p.id}`, division: p.division, order: i,
    })) as CuratedPost[],
    division_highlights: [
      { division: 'studio', headline: 'Studio shipped 3 products', body: 'New projects are live in production. Take a look at the portfolio.', cta_label: 'See portfolio', cta_url: '/studio/portfolio' },
      { division: 'academy', headline: 'AI Bootcamp Q2 open', body: 'Limited seats available. Apply before April 15.', cta_label: 'Apply now', cta_url: '/academy/courses/ai-bootcamp' },
    ] as DivisionHighlight[],
  }
}

// ─── HTML Email Template (live preview) ──────────────────────────────────────

function buildEmailHTML(issue: NewsletterIssue, mobile = false): string {
  const width = mobile ? 375 : 600
  const posts = issue.curated_posts.slice().sort((a,b) => a.order - b.order)

  const postCards = posts.map(p => `
    <tr><td style="padding:0 0 20px">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:10px;overflow:hidden">
        <tr><td style="padding:18px 20px">
          <div style="display:inline-block;background:${DIVISION_COLORS[p.division]??'#59A392'}20;color:${DIVISION_COLORS[p.division]??'#59A392'};font-size:11px;font-weight:600;border-radius:100px;padding:3px 10px;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em">${p.division}</div>
          <div style="font-family:sans-serif;font-size:16px;font-weight:700;color:#0F172A;margin-bottom:8px;line-height:1.3">${p.title}</div>
          <div style="font-family:sans-serif;font-size:14px;color:#475569;line-height:1.6;margin-bottom:12px">${p.excerpt}</div>
          <a href="${p.url}" style="font-family:sans-serif;font-size:13px;font-weight:600;color:#3A589E;text-decoration:none">Read more →</a>
        </td></tr>
      </table>
    </td></tr>`).join('')

  const highlights = issue.division_highlights.map(h => `
    <tr><td style="padding:0 0 14px">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${DIVISION_COLORS[h.division]??'#59A392'}30;border-radius:10px;overflow:hidden">
        <tr><td style="padding:4px 0 0;background:${DIVISION_COLORS[h.division]??'#59A392'};height:3px;line-height:3px">&nbsp;</td></tr>
        <tr><td style="padding:14px 18px">
          <div style="font-family:sans-serif;font-size:14px;font-weight:700;color:#0F172A;margin-bottom:6px">${h.headline}</div>
          <div style="font-family:sans-serif;font-size:13px;color:#475569;margin-bottom:10px;line-height:1.5">${h.body}</div>
          <a href="${h.cta_url}" style="display:inline-block;font-family:sans-serif;font-size:12px;font-weight:600;color:white;background:${DIVISION_COLORS[h.division]??'#59A392'};border-radius:6px;padding:6px 14px;text-decoration:none">${h.cta_label} →</a>
        </td></tr>
      </table>
    </td></tr>`).join('')

  const editorialLines = (issue.editorial || '').split('\n\n').map(p =>
    `<p style="margin:0 0 14px;font-family:sans-serif;font-size:15px;color:#334155;line-height:1.7">${p.replace(/\n/g,'<br>')}</p>`
  ).join('')

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1F4F9;font-family:sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F4F9;padding:24px 16px">
<tr><td align="center">
<table width="${width}" cellpadding="0" cellspacing="0" style="max-width:${width}px">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#2C4478,#59A392);border-radius:12px 12px 0 0;padding:28px 32px">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td><span style="font-size:22px;font-weight:900;color:white;letter-spacing:-0.03em">SocioFi</span><br>
            <span style="font-size:11px;color:rgba(255,255,255,0.6);letter-spacing:0.1em;text-transform:uppercase">Technology</span></td>
        <td align="right"><span style="font-size:13px;color:rgba(255,255,255,0.7)">${issue.label}</span></td>
      </tr>
    </table>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:white;padding:32px">

    <!-- Subject as headline -->
    <h1 style="margin:0 0 20px;font-size:22px;font-weight:800;color:#0F172A;line-height:1.2;letter-spacing:-0.02em">${issue.subject_a}</h1>

    <!-- Editorial -->
    ${editorialLines}

    ${posts.length > 0 ? `
    <!-- Posts divider -->
    <div style="border-top:1px solid #E2E8F0;margin:24px 0 22px"></div>
    <div style="font-size:11px;font-weight:700;color:#94A3B8;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:16px">This Month's Reading</div>
    <table width="100%" cellpadding="0" cellspacing="0">${postCards}</table>` : ''}

    ${issue.division_highlights.length > 0 ? `
    <!-- Division highlights -->
    <div style="border-top:1px solid #E2E8F0;margin:20px 0 18px"></div>
    <div style="font-size:11px;font-weight:700;color:#94A3B8;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:14px">Division Updates</div>
    <table width="100%" cellpadding="0" cellspacing="0">${highlights}</table>` : ''}

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#F8FAFC;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center">
    <p style="margin:0 0 8px;font-size:12px;color:#94A3B8">SocioFi Technology · Dhaka, Bangladesh</p>
    <p style="margin:0;font-size:11px;color:#CBD5E1">
      <a href="#" style="color:#94A3B8;text-decoration:underline">Unsubscribe</a> &nbsp;·&nbsp;
      <a href="https://sociofi.co" style="color:#94A3B8;text-decoration:none">Visit website</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`
}

// ─── Sortable post item ────────────────────────────────────────────────────────

function SortablePost({
  post, onRemove, onEdit,
}: {
  post: CuratedPost
  onRemove: (id: string) => void
  onEdit: (id: string, field: keyof CuratedPost, value: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: post.id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  const [editingExcerpt, setEditingExcerpt] = useState(false)
  const divColor = DIVISION_COLORS[post.division] ?? '#59A392'

  return (
    <div ref={setNodeRef} style={{ ...style, background: '#0A0E1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', marginBottom: 8, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      {/* Drag handle */}
      <div {...attributes} {...listeners} style={{ cursor: 'grab', color: '#64748B', padding: '2px 0', flexShrink: 0, lineHeight: 1, marginTop: 2 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/></svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <span style={{ background: `${divColor}18`, color: divColor, border: `1px solid ${divColor}30`, borderRadius: 100, padding: '1px 7px', fontSize: '0.68rem', flexShrink: 0 }}>{post.division}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
        </div>
        {editingExcerpt ? (
          <textarea
            autoFocus
            value={post.excerpt}
            onChange={e => onEdit(post.id, 'excerpt', e.target.value)}
            onBlur={() => setEditingExcerpt(false)}
            rows={2}
            style={{ width: '100%', background: '#151928', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '6px 8px', color: '#94A3B8', fontSize: '0.78rem', fontFamily: "'Outfit', sans-serif", resize: 'none', boxSizing: 'border-box' }}
          />
        ) : (
          <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.5, cursor: 'text' }} onClick={() => setEditingExcerpt(true)}>
            {post.excerpt || <span style={{ color: '#4A5578', fontStyle: 'italic' }}>Click to add excerpt…</span>}
          </div>
        )}
        <div style={{ fontSize: '0.7rem', color: '#4A5578', marginTop: 5 }}>{post.url}</div>
      </div>

      <button onClick={() => onRemove(post.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px', flexShrink: 0, opacity: 0.6, lineHeight: 1 }}
        onMouseEnter={e => (e.currentTarget.style.opacity='1')} onMouseLeave={e => (e.currentTarget.style.opacity='0.6')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  )
}

// ─── Add Post Modal ───────────────────────────────────────────────────────────

function AddPostModal({ existing, onAdd, onClose }: {
  existing: string[]
  onAdd: (posts: typeof AVAILABLE_POSTS) => void
  onClose: () => void
}) {
  const [selected, setSelected] = useState<string[]>([])
  const available = AVAILABLE_POSTS.filter(p => !existing.includes(p.id))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, width: '100%', maxWidth: 520, padding: 26 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#E2E8F0' }}>Add Posts to Newsletter</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {available.map(p => {
            const isSel = selected.includes(p.id)
            const c = DIVISION_COLORS[p.division] ?? '#59A392'
            return (
              <div key={p.id} onClick={() => setSelected(s => isSel ? s.filter(id => id !== p.id) : [...s, p.id])}
                style={{ background: isSel ? 'rgba(89,163,146,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isSel ? 'rgba(89,163,146,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 8, padding: '10px 14px', cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${isSel ? '#59A392' : 'rgba(255,255,255,0.2)'}`, background: isSel ? 'rgba(89,163,146,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  {isSel && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#59A392" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ background: `${c}18`, color: c, borderRadius: 100, padding: '1px 7px', fontSize: '0.68rem' }}>{p.division}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0' }}>{p.title}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.excerpt}</div>
                </div>
              </div>
            )
          })}
          {available.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: '#64748B', fontSize: '0.85rem' }}>All published posts are already included.</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
          <button onClick={() => { onAdd(AVAILABLE_POSTS.filter(p => selected.includes(p.id))); onClose() }} disabled={selected.length === 0} style={{ background: selected.length > 0 ? 'linear-gradient(135deg,#3A589E,#59A392)' : 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: 8, padding: '8px 18px', cursor: selected.length > 0 ? 'pointer' : 'not-allowed', fontSize: '0.85rem', fontWeight: 600 }}>
            Add {selected.length > 0 ? `(${selected.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Send Confirmation Modal ──────────────────────────────────────────────────

function SendModal({ issue, mode, onConfirm, onClose }: {
  issue: NewsletterIssue
  mode: 'test' | 'schedule' | 'send'
  onConfirm: (meta?: string) => void
  onClose: () => void
}) {
  const [scheduledAt, setScheduledAt] = useState('')
  const [sending, setSending] = useState(false)

  const handle = async () => {
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    onConfirm(mode === 'schedule' ? scheduledAt : undefined)
    setSending(false)
  }

  const titles = { test: 'Send Test Email', schedule: 'Schedule Issue', send: 'Send Now' }
  const ctaLabels = { test: 'Send to My Inbox', schedule: 'Schedule', send: 'Send to All Subscribers' }
  const ctaColors = { test: '#6BA3E8', schedule: '#E8B84D', send: '#4ade80' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, width: '100%', maxWidth: 440, padding: 28 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", color: '#E2E8F0' }}>{titles[mode]}</h3>
        <p style={{ margin: '0 0 18px', fontSize: '0.82rem', color: '#64748B' }}>{issue.label} — {issue.recipient_count.toLocaleString()} recipients</p>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: 3 }}>Subject A</div>
          <div style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>{issue.subject_a}</div>
          {issue.subject_b && <>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 8, marginBottom: 3 }}>Subject B (A/B test — 50/50 split)</div>
            <div style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>{issue.subject_b}</div>
          </>}
        </div>
        {mode === 'test' && (
          <div style={{ background: 'rgba(107,163,232,0.08)', border: '1px solid rgba(107,163,232,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: '0.8rem', color: '#6BA3E8' }}>
            Test will be sent to <strong>arifur@sociofi.co</strong>
          </div>
        )}
        {mode === 'schedule' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 6, fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>Send Date & Time</label>
            <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
              style={{ width: '100%', background: '#0A0E1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px', color: '#E2E8F0', fontSize: '0.88rem', colorScheme: 'dark', boxSizing: 'border-box' }} />
          </div>
        )}
        {mode === 'send' && (
          <div style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: '0.8rem', color: '#4ade80' }}>
            This will send to all <strong>{issue.recipient_count.toLocaleString()}</strong> subscribers immediately via Resend. This cannot be undone.
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
          <button onClick={handle} disabled={sending || (mode === 'schedule' && !scheduledAt)} style={{ background: `${ctaColors[mode]}18`, border: `1px solid ${ctaColors[mode]}40`, color: ctaColors[mode], borderRadius: 8, padding: '8px 20px', cursor: sending ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            {sending ? <><span style={{ width: 10, height: 10, borderRadius: '50%', border: `1.5px solid ${ctaColors[mode]}40`, borderTop: `1.5px solid ${ctaColors[mode]}`, animation: 'nlSpin 0.8s linear infinite' }} />Sending…</> : ctaLabels[mode]}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewsletterEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const baseIssue = MOCK_NEWSLETTER_ISSUES.find(i => i.id === id) ?? MOCK_NEWSLETTER_ISSUES[0]

  const [issue, setIssue] = useState<NewsletterIssue>({ ...baseIssue, curated_posts: [...baseIssue.curated_posts] })
  const [mobilePreview, setMobilePreview] = useState(false)
  const [showAddPost, setShowAddPost] = useState(false)
  const [sendModal, setSendModal] = useState<'test' | 'schedule' | 'send' | null>(null)
  const [curatorLoading, setCuratorLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [saved, setSaved] = useState(true)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const setField = useCallback(<K extends keyof NewsletterIssue>(key: K, val: NewsletterIssue[K]) => {
    setIssue(p => ({ ...p, [key]: val }))
    setSaved(false)
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000) }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const posts = [...issue.curated_posts]
    const oldIdx = posts.findIndex(p => p.id === active.id)
    const newIdx = posts.findIndex(p => p.id === over.id)
    const reordered = arrayMove(posts, oldIdx, newIdx).map((p, i) => ({ ...p, order: i }))
    setField('curated_posts', reordered)
  }

  const removePost = (id: string) => setField('curated_posts', issue.curated_posts.filter(p => p.id !== id))
  const editPost = (id: string, field: keyof CuratedPost, val: string) =>
    setField('curated_posts', issue.curated_posts.map(p => p.id === id ? { ...p, [field]: val } : p))

  const addPosts = (newPosts: typeof AVAILABLE_POSTS) => {
    const uid = () => `cp-${Date.now()}-${Math.random().toString(36).slice(2,6)}`
    const additions: CuratedPost[] = newPosts.map((p, i) => ({
      id: uid(), post_id: p.id, title: p.title, excerpt: p.excerpt,
      url: `/${p.division}/blog/${p.id}`, division: p.division,
      order: issue.curated_posts.length + i,
    }))
    setField('curated_posts', [...issue.curated_posts, ...additions])
  }

  const updateHighlight = (division: string, field: keyof DivisionHighlight, val: string) => {
    setField('division_highlights', issue.division_highlights.map(h => h.division === division ? { ...h, [field]: val } : h))
  }

  const handleCurator = async () => {
    setCuratorLoading(true)
    try {
      const result = await callCurator(issue.month, issue.year)
      setIssue(p => ({
        ...p,
        subject_a: result.subject_a,
        subject_b: result.subject_b,
        editorial: result.editorial,
        curated_posts: result.curated_posts,
        division_highlights: result.division_highlights,
        prepared_by: 'curator',
        updated_at: new Date().toISOString(),
      }))
      showToast('CURATOR prepared the issue — review and refine before sending')
      setSaved(false)
    } catch { /* ignore */ }
    setCuratorLoading(false)
  }

  const handleSend = (mode: 'test' | 'schedule' | 'send', meta?: string) => {
    setSendModal(null)
    if (mode === 'test') { showToast('Test email sent to arifur@sociofi.co') }
    else if (mode === 'schedule') { showToast(`Issue scheduled for ${meta ?? 'selected time'}`); setField('status', 'scheduled') }
    else { showToast(`Issue sent to ${issue.recipient_count.toLocaleString()} subscribers!`); setField('status', 'sent'); setField('sent_at', new Date().toISOString()) }
    setSaved(true)
  }

  const handleSave = () => { setSaved(true); showToast('Issue saved') }

  const previewHTML = useMemo(() => buildEmailHTML(issue, mobilePreview), [issue, mobilePreview])

  const sortedPosts = [...issue.curated_posts].sort((a, b) => a.order - b.order)

  const IS: React.CSSProperties = { width: '100%', background: '#0A0E1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 12px', color: '#E2E8F0', fontSize: '0.88rem', fontFamily: "'Outfit', sans-serif", outline: 'none', boxSizing: 'border-box' }
  const Label = ({ t }: { t: string }) => <label style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8', marginBottom: 5, fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t}</label>

  return (
    <div style={{ color: '#E2E8F0' }}>
      <style>{`@keyframes nlSpin{to{transform:rotate(360deg)}}`}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 2000, background: 'rgba(89,163,146,0.12)', border: '1px solid rgba(89,163,146,0.3)', borderRadius: 10, padding: '11px 18px', fontSize: '0.85rem', color: '#59A392', maxWidth: 380 }}>
          {toast}
        </div>
      )}

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/newsletter" style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.85rem' }}>← Newsletter</Link>
          <span style={{ color: '#4A5578' }}>/</span>
          <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{issue.label}</h1>
          {issue.status === 'draft' && (
            <span style={{ background: 'rgba(100,116,139,0.15)', color: '#64748B', border: '1px solid rgba(100,116,139,0.25)', borderRadius: 100, padding: '2px 9px', fontSize: '0.72rem' }}>Draft</span>
          )}
          {issue.status === 'scheduled' && (
            <span style={{ background: 'rgba(232,184,77,0.15)', color: '#E8B84D', border: '1px solid rgba(232,184,77,0.3)', borderRadius: 100, padding: '2px 9px', fontSize: '0.72rem' }}>Scheduled</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Save indicator */}
          <span style={{ fontSize: '0.75rem', color: saved ? '#4ade80' : '#E8B84D', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: saved ? '#4ade80' : '#E8B84D' }} />
            {saved ? 'Saved' : 'Unsaved'}
          </span>
          {!saved && <button onClick={handleSave} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8', borderRadius: 7, padding: '6px 14px', cursor: 'pointer', fontSize: '0.82rem' }}>Save</button>}
          <button onClick={() => setSendModal('test')} style={{ background: 'rgba(107,163,232,0.1)', border: '1px solid rgba(107,163,232,0.25)', color: '#6BA3E8', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Send Test
          </button>
          <button onClick={() => setSendModal('schedule')} style={{ background: 'rgba(232,184,77,0.1)', border: '1px solid rgba(232,184,77,0.25)', color: '#E8B84D', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Schedule
          </button>
          <button onClick={() => setSendModal('send')} style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Send Now
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '55% 1fr', gap: 20, alignItems: 'start' }}>

        {/* ─── LEFT: Editor ─────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* CURATOR button */}
          {issue.status === 'draft' && (
            <button onClick={handleCurator} disabled={curatorLoading} style={{ background: curatorLoading ? 'rgba(123,111,232,0.1)' : 'rgba(123,111,232,0.12)', border: '1px solid rgba(123,111,232,0.3)', color: '#7B6FE8', borderRadius: 10, padding: '12px 20px', cursor: curatorLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', fontWeight: 600 }}>
              {curatorLoading ? (
                <>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(123,111,232,0.2)', borderTop: '2px solid #7B6FE8', animation: 'nlSpin 0.9s linear infinite', flexShrink: 0 }} />
                  CURATOR is preparing your issue…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  Ask CURATOR to Prepare This Issue
                  <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#7B6FE8', fontFamily: "'Fira Code', monospace", fontWeight: 400 }}>Selects posts · writes editorial · generates subjects</span>
                </>
              )}
            </button>
          )}

          {/* Subject lines */}
          <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: '0.7rem', color: '#59A392', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 16, height: 1.5, background: '#59A392', display: 'inline-block' }} />Subject Lines
            </div>
            <div style={{ marginBottom: 12 }}>
              <Label t="Subject A" />
              <input value={issue.subject_a} onChange={e => setField('subject_a', e.target.value)} placeholder="Subject line…" style={IS} />
            </div>
            <div>
              <Label t="Subject B (A/B test — optional)" />
              <input value={issue.subject_b ?? ''} onChange={e => setField('subject_b', e.target.value || undefined)} placeholder="Variant subject line…" style={IS} />
              {issue.subject_b && <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 5 }}>50/50 split · winner determined by open rate after 4 hours</div>}
            </div>
          </div>

          {/* Editorial */}
          <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: '0.7rem', color: '#59A392', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 16, height: 1.5, background: '#59A392', display: 'inline-block' }} />Editorial Paragraph
            </div>
            <textarea
              value={issue.editorial}
              onChange={e => setField('editorial', e.target.value)}
              placeholder="Opening note from the team…"
              rows={6}
              style={{ ...IS, resize: 'vertical', lineHeight: 1.7 }}
            />
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 5 }}>Appears at the top of the email. Use double line breaks for paragraphs.</div>
          </div>

          {/* Curated posts */}
          <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: '0.7rem', color: '#59A392', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 16, height: 1.5, background: '#59A392', display: 'inline-block' }} />Curated Posts ({sortedPosts.length})
              </div>
              <button onClick={() => setShowAddPost(true)} style={{ background: 'rgba(89,163,146,0.1)', border: '1px solid rgba(89,163,146,0.25)', color: '#59A392', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Post
              </button>
            </div>
            {sortedPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#64748B', fontSize: '0.82rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 8 }}>No posts added yet. Click "Add Post" or ask CURATOR.</div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortedPosts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  {sortedPosts.map(post => (
                    <SortablePost key={post.id} post={post} onRemove={removePost} onEdit={editPost} />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* Division highlights */}
          <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: '0.7rem', color: '#59A392', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 16, height: 1.5, background: '#59A392', display: 'inline-block' }} />Division Highlights
            </div>
            {issue.division_highlights.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', color: '#64748B', fontSize: '0.82rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 8 }}>No highlights. Ask CURATOR or add manually.</div>
            ) : (
              issue.division_highlights.map(h => {
                const c = DIVISION_COLORS[h.division] ?? '#59A392'
                return (
                  <div key={h.division} style={{ background: '#0A0E1A', border: `1px solid ${c}20`, borderRadius: 10, padding: '12px 14px', marginBottom: 10, borderLeft: `3px solid ${c}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                      <span style={{ background: `${c}18`, color: c, borderRadius: 100, padding: '2px 9px', fontSize: '0.72rem' }}>{h.division}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                      <div><Label t="Headline" /><input value={h.headline} onChange={e => updateHighlight(h.division, 'headline', e.target.value)} style={{ ...IS, fontSize: '0.82rem' }} /></div>
                      <div><Label t="CTA Label" /><input value={h.cta_label} onChange={e => updateHighlight(h.division, 'cta_label', e.target.value)} style={{ ...IS, fontSize: '0.82rem' }} /></div>
                    </div>
                    <div><Label t="Body" /><textarea value={h.body} onChange={e => updateHighlight(h.division, 'body', e.target.value)} rows={2} style={{ ...IS, fontSize: '0.82rem', resize: 'none' }} /></div>
                  </div>
                )
              })
            )}
          </div>

          {/* Lists */}
          <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: '0.7rem', color: '#59A392', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 16, height: 1.5, background: '#59A392', display: 'inline-block' }} />Send To Lists
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MOCK_SUBSCRIBER_LISTS.map(list => {
                const checked = issue.list_ids.includes(list.id)
                return (
                  <div key={list.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 0' }}
                    onClick={() => setField('list_ids', checked ? issue.list_ids.filter(id => id !== list.id) : [...issue.list_ids, list.id])}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${checked ? '#59A392' : 'rgba(255,255,255,0.2)'}`, background: checked ? 'rgba(89,163,146,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {checked && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#59A392" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>{list.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{list.subscriber_count.toLocaleString()} subscribers · {list.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: 10, fontSize: '0.78rem', color: '#64748B', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
              Total recipients: <strong style={{ color: '#E2E8F0' }}>{MOCK_SUBSCRIBER_LISTS.filter(l => issue.list_ids.includes(l.id)).reduce((s,l) => s+l.subscriber_count, 0).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Live Preview ──────────────────────── */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ background: '#0F1320', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' }}>
            {/* Preview toolbar */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live Preview</span>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' }}>
                {[{label:'Desktop', val:false},{label:'Mobile', val:true}].map(({label,val}) => (
                  <button key={label} onClick={() => setMobilePreview(val)} style={{ padding: '5px 12px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', background: mobilePreview===val?'rgba(89,163,146,0.15)':'transparent', color: mobilePreview===val?'#59A392':'#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {val
                      ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                      : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* Preview iframe container */}
            <div style={{ height: 'calc(100vh - 260px)', overflow: 'auto', background: '#E8ECF4' }}>
              <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
                <iframe
                  srcDoc={previewHTML}
                  style={{ width: mobilePreview ? 375 : '100%', maxWidth: 600, border: 'none', borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', background: 'white', minHeight: 600 }}
                  sandbox="allow-same-origin"
                  title="Newsletter preview"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddPost && <AddPostModal existing={issue.curated_posts.map(p => p.post_id)} onAdd={addPosts} onClose={() => setShowAddPost(false)} />}
      {sendModal && <SendModal issue={issue} mode={sendModal} onConfirm={(meta) => handleSend(sendModal, meta)} onClose={() => setSendModal(null)} />}
    </div>
  )
}
