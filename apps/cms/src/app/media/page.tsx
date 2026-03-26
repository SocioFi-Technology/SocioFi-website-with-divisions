'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import CMSShell from '@/components/CMSShell'
import { getSupabaseClient } from '@/lib/supabase'
import type { CMSMedia } from '@/lib/types'

export default function MediaCMSPage() {
  const [media, setMedia] = useState<CMSMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selected, setSelected] = useState<CMSMedia | null>(null)
  const [editAlt, setEditAlt] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ACCENT = '#59A392'

  const fetchData = useCallback(async () => {
    const client = getSupabaseClient()
    if (!client) { setLoading(false); return }
    setLoading(true)
    const { data } = await client.from('cms_media').select('*').order('created_at', { ascending: false })
    setMedia((data as CMSMedia[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    const client = getSupabaseClient()
    if (!client) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `media/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data: uploadData, error } = await client.storage.from('cms').upload(path, file)
      if (!error && uploadData) {
        const { data: urlData } = client.storage.from('cms').getPublicUrl(uploadData.path)
        await client.from('cms_media').insert({
          filename: file.name,
          url: urlData.publicUrl,
          size: file.size,
          type: file.type,
          created_at: new Date().toISOString(),
        })
      }
    }
    setUploading(false)
    fetchData()
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this file?')) return
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_media').delete().eq('id', id)
    if (selected?.id === id) setSelected(null)
    fetchData()
  }

  async function updateAlt(id: string) {
    const client = getSupabaseClient()
    if (!client) return
    await client.from('cms_media').update({ alt: editAlt }).eq('id', id)
    setMedia(prev => prev.map(m => m.id === id ? { ...m, alt: editAlt } : m))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, alt: editAlt } : null)
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).catch(() => {})
  }

  function formatSize(bytes?: number) {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function isImage(type?: string) {
    return type?.startsWith('image/')
  }

  const filtered = media.filter(m => {
    const matchSearch = !search || m.filename.toLowerCase().includes(search.toLowerCase()) || (m.alt ?? '').toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || (typeFilter === 'image' ? isImage(m.type) : !isImage(m.type))
    return matchSearch && matchType
  })

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 14px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }

  return (
    <CMSShell>
      <div style={{ paddingBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Content</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Media Library</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: 6 }}>Images, documents, and assets ({media.length} files)</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." style={{ ...inputStyle, width: 200, padding: '8px 14px' }} />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ ...inputStyle, width: 'auto', padding: '8px 14px' }}>
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="other">Documents</option>
            </select>
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ background: `linear-gradient(135deg, #3A589E, ${ACCENT})`, color: 'white', border: 'none', borderRadius: 'var(--radius-full)', padding: '10px 22px', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', opacity: uploading ? 0.7 : 1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
              {uploading ? 'Uploading...' : 'Upload Files'}
            </button>
            <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={e => handleUpload(e.target.files)} />
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files) }}
          style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', textAlign: 'center', marginBottom: 24, cursor: 'pointer', transition: 'border-color 0.2s' }}
          onClick={() => fileInputRef.current?.click()}
          onMouseEnter={e => (e.currentTarget.style.borderColor = ACCENT + '60')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px' }} aria-hidden="true"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>Drop files here or <span style={{ color: ACCENT, fontWeight: 600 }}>click to upload</span></p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>Images, PDFs, Documents</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 300px' : '1fr', gap: 20, alignItems: 'start' }}>
          {/* Grid */}
          <div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {[1,2,3,4,5,6].map(i => <div key={i} style={{ aspectRatio: '1', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>No files found. Upload your first file.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {filtered.map(item => (
                  <div
                    key={item.id}
                    onClick={() => { setSelected(item); setEditAlt(item.alt ?? '') }}
                    style={{ background: 'var(--bg-card)', border: `1px solid ${selected?.id === item.id ? ACCENT + '60' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  >
                    <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-2)', overflow: 'hidden' }}>
                      {isImage(item.type) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.url} alt={item.alt ?? item.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      )}
                    </div>
                    <div style={{ padding: '8px 10px' }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.filename}</p>
                      {item.size && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{formatSize(item.size)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', position: 'sticky', top: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>File Details</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {isImage(selected.type) && (
                <div style={{ aspectRatio: '16/9', background: 'var(--bg-2)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: 16 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.url} alt={selected.alt ?? selected.filename} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>Filename</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, wordBreak: 'break-all' }}>{selected.filename}</p>
                </div>
                {selected.size && (
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>Size</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0 }}>{formatSize(selected.size)}</p>
                  </div>
                )}
                {selected.type && (
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>Type</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0 }}>{selected.type}</p>
                  </div>
                )}
                {isImage(selected.type) && (
                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>Alt Text</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input value={editAlt} onChange={e => setEditAlt(e.target.value)} placeholder="Describe the image..." style={{ flex: 1, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.8rem', outline: 'none' }} />
                      <button onClick={() => updateAlt(selected.id)} style={{ background: ACCENT, border: 'none', color: 'white', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontFamily: 'var(--font-display)', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Save</button>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button onClick={() => copyUrl(selected.url)} style={{ flex: 1, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '7px 12px', fontFamily: 'var(--font-body)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy URL
                  </button>
                  <button onClick={() => deleteItem(selected.id)} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: 'rgb(239,68,68)', borderRadius: 'var(--radius-sm)', padding: '7px 12px', fontFamily: 'var(--font-body)', fontSize: '0.8rem', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CMSShell>
  )
}
