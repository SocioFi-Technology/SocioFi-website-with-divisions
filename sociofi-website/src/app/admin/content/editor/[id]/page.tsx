'use client'

import { useState, useEffect, useCallback, use, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MOCK_CONTENT, MOCK_VERSIONS } from '@/lib/admin/mock-data'
import { CONTENT_STATUS_COLORS, CONTENT_TYPE_LABELS, DIVISION_COLORS, type ContentStatus, type ContentType } from '@/lib/admin/types'

const TiptapEditor = dynamic(() => import('@/components/admin/TiptapEditor'), { ssr: false, loading: () => (
  <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '0.85rem' }}>
    Loading editor…
  </div>
) })

const ALL_DIVISIONS = ['studio','services','labs','products','academy','ventures','cloud','parent']
const TEAM_MEMBERS = ['Arifur Rahman','Kamrul Hasan']
const CONTENT_TYPES: ContentType[] = ['blog_post','case_study','testimonial','faq','course','workshop','agent_catalog','experiment','open_source']
const STATUSES: ContentStatus[] = ['draft','review','published','archived']

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function SEOPreview({ title, slug, description }: { title: string; slug: string; description: string }) {
  const displayUrl = `sociofitechnology.com/blog/${slug || 'untitled'}`
  const displayTitle = title || 'Untitled Post'
  return (
    <div style={{ background: '#0A0E1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '14px', marginTop: '10px' }}>
      <div style={{ color: '#64748B', fontSize: '0.62rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Google Preview</div>
      <div style={{ color: '#6BA3E8', fontSize: '0.9rem', fontWeight: 500, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {displayTitle.slice(0, 60)}{displayTitle.length > 60 ? '…' : ''}
      </div>
      <div style={{ color: '#4ade80', fontSize: '0.72rem', marginBottom: '4px' }}>{displayUrl}</div>
      <div style={{ color: '#94A3B8', fontSize: '0.78rem', lineHeight: 1.4 }}>
        {description ? description.slice(0, 160) : 'No description set…'}
      </div>
    </div>
  )
}

const slugPrefix: Record<ContentType, string> = {
  blog_post: '/blog/', case_study: '/studio/portfolio/', testimonial: '/testimonials/',
  faq: '/faq/', course: '/academy/courses/', workshop: '/academy/workshops/',
  agent_catalog: '/products/', experiment: '/labs/experiments/', open_source: '/labs/open-source/',
}

function EditorInner({ id }: { id: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNew = id === 'new'
  const typeParam = (searchParams.get('type') ?? 'blog_post') as ContentType

  const existing = isNew ? null : MOCK_CONTENT.find(c => c.id === id) ?? null
  const versions = isNew ? [] : MOCK_VERSIONS.filter(v => v.content_id === id)

  const [title, setTitle] = useState(existing?.title ?? '')
  const [slug, setSlug] = useState(existing?.slug ?? '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [contentType, setContentType] = useState<ContentType>(existing?.type ?? typeParam)
  const [status, setStatus] = useState<ContentStatus>(existing?.status ?? 'draft')
  const [division, setDivision] = useState(existing?.division ?? '')
  const [author, setAuthor] = useState(existing?.author ?? 'Arifur Rahman')
  const [authorType, setAuthorType] = useState<'human' | 'agent'>(existing?.author_type ?? 'human')
  const [editedBy, setEditedBy] = useState(existing?.edited_by ?? '')
  const [tags, setTags] = useState<string[]>(existing?.tags ?? [])
  const [newTag, setNewTag] = useState('')
  const [seoTitle, setSeoTitle] = useState(existing?.seo_title ?? '')
  const [seoDescription, setSeoDescription] = useState(existing?.seo_description ?? '')
  const [wordCount, setWordCount] = useState(existing?.word_count ?? 0)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [seoOpen, setSeoOpen] = useState(true)
  const [versionsOpen, setVersionsOpen] = useState(false)

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited) setSlug(slugify(title))
  }, [title, slugManuallyEdited])

  // Auto-save debounce
  const triggerSave = useCallback(() => {
    setSaveStatus('saving')
    setTimeout(() => setSaveStatus('saved'), 800)
  }, [])

  useEffect(() => {
    if (saveStatus === 'unsaved') {
      const timer = setTimeout(triggerSave, 2000)
      return () => clearTimeout(timer)
    }
  }, [saveStatus, triggerSave])

  const markDirty = () => setSaveStatus('unsaved')

  const handleTitleChange = (v: string) => { setTitle(v); markDirty() }
  const handleContentChange = () => { markDirty() }

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => router.push('/admin/content')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '0.82rem', padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Content Hub
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: saveStatus === 'saved' ? '#4ade80' : saveStatus === 'saving' ? '#E8B84D' : '#EF4444' }} />
            <span style={{ color: '#64748B', fontSize: '0.72rem', fontFamily: "'Fira Code', monospace" }}>
              {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving…' : 'Unsaved changes'}
            </span>
          </div>
          <button onClick={() => router.push(`/blog/${slug}`)} style={{ background: 'rgba(107,163,232,0.12)', color: '#6BA3E8', border: '1px solid rgba(107,163,232,0.3)', borderRadius: '7px', padding: '7px 14px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
            Preview
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
        {/* Left: Editor */}
        <div>
          {/* Title */}
          <input
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Untitled"
            style={{
              width: '100%', background: 'none', border: 'none', outline: 'none',
              color: '#E2E8F0', fontSize: '1.8rem', fontWeight: 800,
              fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em',
              marginBottom: '8px', lineHeight: 1.2, boxSizing: 'border-box',
            }}
          />

          {/* Slug */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '7px', overflow: 'hidden', width: 'fit-content' }}>
            <span style={{ color: '#475569', fontSize: '0.72rem', fontFamily: "'Fira Code', monospace", padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>
              {slugPrefix[contentType]}
            </span>
            <input
              value={slug}
              onChange={e => { setSlug(e.target.value); setSlugManuallyEdited(true); markDirty() }}
              style={{ background: 'none', border: 'none', outline: 'none', color: '#94A3B8', fontSize: '0.72rem', fontFamily: "'Fira Code', monospace", padding: '6px 10px', minWidth: '200px' }}
            />
          </div>

          {/* Tiptap Editor */}
          <TiptapEditor
            content={existing?.content_json ? JSON.stringify(existing.content_json) : ''}
            onChange={handleContentChange}
            onWordCountChange={setWordCount}
            placeholder="Start writing. Use the toolbar above for formatting…"
          />
        </div>

        {/* Right: Metadata sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'sticky', top: '80px' }}>

          {/* Status + Publishing */}
          <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ color: '#64748B', fontSize: '0.62rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Status &amp; Publishing</div>

            <select value={status} onChange={e => { setStatus(e.target.value as ContentStatus); markDirty() }}
              style={{ width: '100%', background: `${CONTENT_STATUS_COLORS[status]}15`, color: CONTENT_STATUS_COLORS[status], border: `1px solid ${CONTENT_STATUS_COLORS[status]}40`, borderRadius: '7px', padding: '8px 10px', fontSize: '0.82rem', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit', sans-serif", marginBottom: '10px', textTransform: 'capitalize' }}>
              {STATUSES.map(s => <option key={s} value={s} style={{ background: '#12162A', color: '#E2E8F0' }}>{s}</option>)}
            </select>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <button onClick={triggerSave} style={{ background: 'rgba(255,255,255,0.04)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', padding: '8px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                Save Draft
              </button>
              {status !== 'review' && (
                <button onClick={() => { setStatus('review'); markDirty() }} style={{ background: 'rgba(232,184,77,0.12)', color: '#E8B84D', border: '1px solid rgba(232,184,77,0.3)', borderRadius: '7px', padding: '8px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                  Submit for Review
                </button>
              )}
              {status !== 'published' ? (
                <button onClick={() => { setStatus('published'); triggerSave() }} style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '7px', padding: '8px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                  Publish
                </button>
              ) : (
                <button onClick={() => { setStatus('draft'); markDirty() }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '7px', padding: '8px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                  Unpublish
                </button>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ color: '#64748B', fontSize: '0.62rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Content Metadata</div>

            {/* Type */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: '#475569', fontSize: '0.65rem', marginBottom: '5px' }}>Type</div>
              <select value={contentType} onChange={e => { setContentType(e.target.value as ContentType); markDirty() }}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', padding: '7px 10px', fontSize: '0.8rem', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit', sans-serif" }}>
                {CONTENT_TYPES.map(t => <option key={t} value={t} style={{ background: '#12162A' }}>{CONTENT_TYPE_LABELS[t]}</option>)}
              </select>
            </div>

            {/* Division */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: '#475569', fontSize: '0.65rem', marginBottom: '5px' }}>Division</div>
              <select value={division} onChange={e => { setDivision(e.target.value); markDirty() }}
                style={{ width: '100%', background: division ? `${DIVISION_COLORS[division] ?? '#59A392'}12` : 'rgba(255,255,255,0.03)', color: division ? (DIVISION_COLORS[division] ?? '#59A392') : '#64748B', border: `1px solid ${division ? `${DIVISION_COLORS[division] ?? '#59A392'}30` : 'rgba(255,255,255,0.08)'}`, borderRadius: '7px', padding: '7px 10px', fontSize: '0.8rem', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit', sans-serif", textTransform: 'capitalize' }}>
                <option value="" style={{ background: '#12162A', color: '#E2E8F0' }}>No division</option>
                {ALL_DIVISIONS.map(d => <option key={d} value={d} style={{ background: '#12162A', color: '#E2E8F0', textTransform: 'capitalize' }}>{d}</option>)}
              </select>
            </div>

            {/* Author */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: '#475569', fontSize: '0.65rem', marginBottom: '5px' }}>Author</div>
              <select value={authorType} onChange={e => { setAuthorType(e.target.value as 'human' | 'agent'); markDirty() }}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', padding: '7px 10px', fontSize: '0.8rem', cursor: 'pointer', outline: 'none', marginBottom: '5px', fontFamily: "'Outfit', sans-serif" }}>
                <option value="human" style={{ background: '#12162A' }}>Human</option>
                <option value="agent" style={{ background: '#12162A' }}>AI Agent (SCRIBE)</option>
              </select>
              {authorType === 'human' ? (
                <select value={author} onChange={e => { setAuthor(e.target.value); markDirty() }}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', padding: '7px 10px', fontSize: '0.8rem', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit', sans-serif" }}>
                  {TEAM_MEMBERS.map(m => <option key={m} value={m} style={{ background: '#12162A' }}>{m}</option>)}
                </select>
              ) : (
                <div>
                  <div style={{ color: '#59A392', fontSize: '0.75rem', padding: '6px 0' }}>SCRIBE (AI Agent)</div>
                  <input value={editedBy} onChange={e => { setEditedBy(e.target.value); markDirty() }} placeholder="Reviewed by (human name)"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', color: '#E2E8F0', fontSize: '0.78rem', padding: '7px 10px', outline: 'none', fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box' }} />
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <div style={{ color: '#475569', fontSize: '0.65rem', marginBottom: '7px' }}>Tags</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '7px' }}>
                {tags.map(tag => (
                  <span key={tag} style={{ background: 'rgba(89,163,146,0.1)', color: '#59A392', border: '1px solid rgba(89,163,146,0.2)', fontSize: '0.65rem', padding: '2px 7px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {tag}
                    <button onClick={() => { setTags(t => t.filter(x => x !== tag)); markDirty() }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 0, lineHeight: 1 }}>x</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <input value={newTag} onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newTag.trim()) { setTags(t => [...t, newTag.trim()]); setNewTag(''); markDirty() }}}
                  placeholder="Add tag…"
                  style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#E2E8F0', fontSize: '0.75rem', padding: '5px 9px', outline: 'none', fontFamily: "'Outfit', sans-serif" }} />
                <button onClick={() => { if (newTag.trim()) { setTags(t => [...t, newTag.trim()]); setNewTag(''); markDirty() }}} style={{ background: 'rgba(89,163,146,0.15)', border: '1px solid rgba(89,163,146,0.3)', borderRadius: '6px', color: '#59A392', cursor: 'pointer', padding: '0 8px', fontSize: '0.8rem' }}>+</button>
              </div>
            </div>
          </div>

          {/* SEO (collapsible) */}
          <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
            <button onClick={() => setSeoOpen(p => !p)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: '0.62rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              SEO Settings
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: seoOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {seoOpen && (
              <div style={{ padding: '0 16px 16px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.62rem', marginBottom: '5px' }}>
                    <span>SEO Title</span>
                    <span style={{ color: seoTitle.length > 60 ? '#EF4444' : '#64748B' }}>{seoTitle.length}/60</span>
                  </div>
                  <input value={seoTitle} onChange={e => { setSeoTitle(e.target.value); markDirty() }} placeholder={title || 'SEO title…'}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${seoTitle.length > 60 ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '7px', color: '#E2E8F0', fontSize: '0.78rem', padding: '7px 10px', outline: 'none', fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.62rem', marginBottom: '5px' }}>
                    <span>SEO Description</span>
                    <span style={{ color: seoDescription.length > 160 ? '#EF4444' : '#64748B' }}>{seoDescription.length}/160</span>
                  </div>
                  <textarea value={seoDescription} onChange={e => { setSeoDescription(e.target.value); markDirty() }} placeholder="Description for search engines…" rows={3}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${seoDescription.length > 160 ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '7px', color: '#E2E8F0', fontSize: '0.78rem', padding: '7px 10px', outline: 'none', resize: 'none', fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box' }} />
                </div>
                <SEOPreview title={seoTitle || title} slug={slug} description={seoDescription} />
              </div>
            )}
          </div>

          {/* Version History (collapsible) */}
          {versions.length > 0 && (
            <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
              <button onClick={() => setVersionsOpen(p => !p)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: '0.62rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Version History ({versions.length})
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: versionsOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {versionsOpen && (
                <div style={{ padding: '0 14px 14px' }}>
                  {versions.map(v => {
                    const diff = (Date.now() - new Date(v.created_at).getTime()) / 1000
                    const timeStr = diff < 86400 ? `${Math.floor(diff / 3600)}h ago` : `${Math.floor(diff / 86400)}d ago`
                    return (
                      <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div>
                          <div style={{ color: '#E2E8F0', fontSize: '0.75rem' }}>v{v.version} — {v.author}</div>
                          <div style={{ color: '#64748B', fontSize: '0.68rem', marginTop: '2px' }}>{v.note} · {timeStr}</div>
                        </div>
                        <button style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '5px', color: '#64748B', fontSize: '0.68rem', padding: '3px 8px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                          Restore
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Word count info */}
          <div style={{ padding: '10px 14px', background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748B', fontSize: '0.72rem' }}>{wordCount} words</span>
            <span style={{ color: '#64748B', fontSize: '0.72rem', fontFamily: "'Fira Code', monospace" }}>~{Math.ceil(wordCount / 200)} min read</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContentEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <Suspense fallback={<div style={{ color: '#64748B' }}>Loading…</div>}>
      <EditorInner id={id} />
    </Suspense>
  )
}
