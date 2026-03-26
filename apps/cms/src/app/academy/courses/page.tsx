'use client'

import { useEffect, useState, useCallback } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/divisions'
import type { CMSCourse, ContentStatus, CourseModule } from '@/lib/types'

export default function CoursesCMSPage() {
  const [courses, setCourses] = useState<CMSCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Partial<CMSCourse> | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const ACCENT = '#E8B84D'

  const fetchData = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setLoading(false); return }
    setLoading(true)
    const { data } = await client.from('cms_courses').select('*').order('created_at', { ascending: false })
    setCourses((data as CMSCourse[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function updateStatus(id: string, status: ContentStatus) {
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_courses').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  async function saveItem(item: Partial<CMSCourse>) {
    const client = getSupabaseClient()
    if (!client) { setShowForm(false); return }
    const payload = { ...item, updated_at: new Date().toISOString() }
    if (item.id) await client.from('cms_courses').update(payload).eq('id', item.id)
    else await client.from('cms_courses').insert({ ...payload, created_at: new Date().toISOString() })
    setShowForm(false); setEditItem(null); fetchData()
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this course?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_courses').delete().eq('id', id)
    fetchData()
  }

  const filtered = courses.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Academy / Courses</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Course Catalog</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>{courses.length} courses total</p>
          </div>
          <button onClick={() => { setEditItem({}); setShowForm(true) }} style={{ background: `linear-gradient(135deg, #3A589E, ${ACCENT})`, color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 22px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Course
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." style={{ ...inputStyle, maxWidth: 260, padding: '8px 14px' }} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, maxWidth: 160, padding: '8px 14px' }}>
            <option value="all">All statuses</option><option value="draft">Draft</option><option value="review">In Review</option><option value="published">Published</option><option value="archived">Archived</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? [1,2,3].map(i => <div key={i} style={{ height: 110, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />) :
            filtered.length === 0 ? <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No courses found.</div> :
            filtered.map(course => (
              <div key={course.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{course.title}</h3>
                      {course.level && <span style={{ background: `${ACCENT}20`, color: ACCENT, borderRadius: 100, padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'capitalize' }}>{course.level}</span>}
                    </div>
                    {course.description && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</div>}
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      {course.category && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{course.category}</span>}
                      {course.duration && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{course.duration}</span>}
                      {course.price !== undefined && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT }}>{course.price === 0 ? 'Free' : `$${course.price}`}</span>}
                      {course.modules && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{course.modules.length} modules</span>}
                      {course.enrollment_count !== undefined && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{course.enrollment_count} enrolled</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <select value={course.status} onChange={e => updateStatus(course.id, e.target.value as ContentStatus)} style={{ background: `${STATUS_COLORS[course.status]}15`, border: `1px solid ${STATUS_COLORS[course.status]}40`, color: STATUS_COLORS[course.status], borderRadius: 100, padding: '3px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', cursor: 'pointer', outline: 'none' }}>
                      <option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option><option value="archived">Archived</option>
                    </select>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setEditItem(course); setShowForm(true) }} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontFamily: 'var(--font-body)', fontSize: '0.78rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteItem(course.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 5 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        {showForm && editItem !== null && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{editItem.id ? 'Edit Course' : 'New Course'}</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <CourseForm item={editItem} onSave={saveItem} onCancel={() => setShowForm(false)} inputStyle={inputStyle} labelStyle={labelStyle} accent={ACCENT} />
            </div>
          </div>
        )}
      </div>
    </CMSShell>
  )
}

function CourseForm({ item, onSave, onCancel, inputStyle, labelStyle, accent }: { item: Partial<CMSCourse>; onSave: (i: Partial<CMSCourse>) => void; onCancel: () => void; inputStyle: React.CSSProperties; labelStyle: React.CSSProperties; accent: string }) {
  const [form, setForm] = useState<Partial<CMSCourse>>({
    title: '', slug: '', description: '', status: 'draft', level: 'beginner',
    price: 0, currency: 'USD', duration: '', category: '', audience: '',
    instructor_name: '', outcomes: [], modules: [],
    ...item,
  })
  const [outcomesText, setOutcomesText] = useState((item.outcomes ?? []).join('\n'))
  const [modulesText, setModulesText] = useState(
    (item.modules ?? []).map((m: CourseModule) => `${m.title}: ${m.lessons.join(', ')}`).join('\n')
  )

  function parseModules(text: string): CourseModule[] {
    return text.split('\n').filter(Boolean).map(line => {
      const [title, ...rest] = line.split(':')
      const lessons = rest.join(':').split(',').map(l => l.trim()).filter(Boolean)
      return { title: title.trim(), lessons }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>Course Title *</label><input style={inputStyle} value={form.title ?? ''} onChange={e => { const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); setForm(p => ({ ...p, title: e.target.value, slug: p.id ? p.slug : slug })) }} /></div>
        <div><label style={labelStyle}>Slug *</label><input style={inputStyle} value={form.slug ?? ''} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} /></div>
        <div><label style={labelStyle}>Category</label><input style={inputStyle} placeholder="e.g. AI Development" value={form.category ?? ''} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} /></div>
      </div>
      <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={3} value={form.description ?? ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
      <div><label style={labelStyle}>Target Audience</label><input style={inputStyle} placeholder="e.g. Founders and product managers" value={form.audience ?? ''} onChange={e => setForm(p => ({ ...p, audience: e.target.value }))} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div><label style={labelStyle}>Price (USD)</label><input type="number" style={inputStyle} value={form.price ?? 0} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} /></div>
        <div><label style={labelStyle}>Duration</label><input style={inputStyle} placeholder="e.g. 6 weeks" value={form.duration ?? ''} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} /></div>
        <div><label style={labelStyle}>Level</label>
          <select style={inputStyle} value={form.level ?? 'beginner'} onChange={e => setForm(p => ({ ...p, level: e.target.value as CMSCourse['level'] }))}>
            <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={labelStyle}>Instructor Name</label><input style={inputStyle} value={form.instructor_name ?? ''} onChange={e => setForm(p => ({ ...p, instructor_name: e.target.value }))} /></div>
        <div><label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status ?? 'draft'} onChange={e => setForm(p => ({ ...p, status: e.target.value as ContentStatus }))}>
            <option value="draft">Draft</option><option value="review">In Review</option><option value="published">Published</option><option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <div><label style={labelStyle}>Learning Outcomes (one per line)</label><textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={4} placeholder="Deploy a production AI agent&#10;Build RAG pipelines&#10;Evaluate model performance" value={outcomesText} onChange={e => { setOutcomesText(e.target.value); setForm(p => ({ ...p, outcomes: e.target.value.split('\n').filter(Boolean) })) }} /></div>
      <div>
        <label style={labelStyle}>Course Modules (one per line, format "Module Title: Lesson 1, Lesson 2")</label>
        <textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={5} placeholder="Introduction to AI Agents: What are agents, Tool use basics&#10;Building Your First Agent: Setup, API calls, Testing" value={modulesText} onChange={e => { setModulesText(e.target.value); setForm(p => ({ ...p, modules: parseModules(e.target.value) })) }} />
        {form.modules && form.modules.length > 0 && (
          <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{form.modules.length} modules parsed</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onCancel} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
        <button onClick={() => onSave(form)} disabled={!form.title || !form.slug} style={{ background: `linear-gradient(135deg, #3A589E, ${accent})`, color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Save Course</button>
      </div>
    </div>
  )
}
