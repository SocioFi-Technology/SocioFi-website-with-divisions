'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { fetchMediaItems } from '@/lib/admin/queries'
import { formatSize, uploadMedia } from '@/lib/admin/media-upload'
import type { MediaItem, MediaFolder } from '@/lib/admin/types'

const FOLDERS: { id: MediaFolder; label: string }[] = [
  { id: 'all', label: 'All Files' },
  { id: 'blog', label: 'Blog' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'agents', label: 'Agents' },
  { id: 'courses', label: 'Courses' },
  { id: 'logos', label: 'Logos' },
  { id: 'general', label: 'General' },
]

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ── File type icon ──────────────────────────────────────────
function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType === 'application/pdf') return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.1)', flexDirection: 'column', gap: '8px' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
      <span style={{ color: '#EF4444', fontSize: '0.6rem', fontFamily: "'Fira Code', monospace", fontWeight: 700 }}>PDF</span>
    </div>
  )
  if (mimeType.includes('word') || mimeType.includes('document')) return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(107,163,232,0.1)', flexDirection: 'column', gap: '8px' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6BA3E8" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      <span style={{ color: '#6BA3E8', fontSize: '0.6rem', fontFamily: "'Fira Code', monospace", fontWeight: 700 }}>DOC</span>
    </div>
  )
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(100,116,139,0.1)' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    </div>
  )
}

// ── Upload Progress Bar ──────────────────────────────────────
function UploadProgressItem({ name, progress, done, error }: { name: string; progress: number; done: boolean; error?: string }) {
  const color = error ? '#EF4444' : done ? '#4ade80' : '#59A392'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ color: '#E2E8F0', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
          <span style={{ color, fontSize: '0.68rem', fontFamily: "'Fira Code', monospace", flexShrink: 0, marginLeft: '8px' }}>
            {error ? 'Failed' : done ? 'Done' : `${progress}%`}
          </span>
        </div>
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${error ? 100 : progress}%`, background: color, borderRadius: '2px', transition: 'width 0.2s' }} />
        </div>
        {error && <div style={{ color: '#EF4444', fontSize: '0.65rem', marginTop: '2px' }}>{error}</div>}
      </div>
    </div>
  )
}

// ── Media Detail Panel ──────────────────────────────────────
function MediaDetailPanel({ item, onClose, onUpdate, onDelete }: {
  item: MediaItem
  onClose: () => void
  onUpdate: (id: string, updates: Partial<MediaItem>) => void
  onDelete: (id: string) => void
}) {
  const [filename, setFilename] = useState(item.filename)
  const [altText, setAltText] = useState(item.alt_text ?? '')
  const [folder, setFolder] = useState(item.folder)
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const copyUrl = () => {
    navigator.clipboard.writeText(item.public_url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const isImage = item.media_type === 'image'

  const infoRows: [string, string][] = [
    ['Type', item.mime_type],
    ['Size', formatSize(item.size_bytes)],
    ...(item.width ? [['Dimensions', `${item.width}×${item.height}px`] as [string, string]] : []),
    ['Uploaded by', item.uploaded_by],
    ['Date', relativeTime(item.created_at)],
  ]

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px',
      background: '#0F1320',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      zIndex: 500,
      display: 'flex', flexDirection: 'column',
      boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em' }}>File Details</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Preview */}
      <div style={{ height: '220px', flexShrink: 0, background: 'rgba(0,0,0,0.3)', overflow: 'hidden' }}>
        {isImage ? (
          <img src={item.public_url} alt={item.alt_text ?? item.filename}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px', boxSizing: 'border-box' }} />
        ) : (
          <div style={{ width: '100%', height: '100%' }}><FileIcon mimeType={item.mime_type} /></div>
        )}
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {/* Filename */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#475569', fontSize: '0.62rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>Filename</div>
          <input value={filename} onChange={e => setFilename(e.target.value)}
            onBlur={() => onUpdate(item.id, { filename })}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', color: '#E2E8F0', fontSize: '0.8rem', padding: '7px 10px', outline: 'none', fontFamily: "'Fira Code', monospace", boxSizing: 'border-box' }} />
        </div>

        {/* Alt text (images only) */}
        {isImage && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#475569', fontSize: '0.62rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>Alt Text</div>
            <input value={altText} onChange={e => setAltText(e.target.value)}
              onBlur={() => onUpdate(item.id, { alt_text: altText })}
              placeholder="Describe this image for accessibility…"
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', color: '#E2E8F0', fontSize: '0.8rem', padding: '7px 10px', outline: 'none', fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box' }} />
          </div>
        )}

        {/* Folder */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#475569', fontSize: '0.62rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>Folder</div>
          <select value={folder} onChange={e => { const v = e.target.value as Exclude<MediaFolder, 'all'>; setFolder(v); onUpdate(item.id, { folder: v }) }}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', padding: '7px 10px', fontSize: '0.8rem', cursor: 'pointer', outline: 'none', fontFamily: "'Outfit', sans-serif" }}>
            {FOLDERS.filter(f => f.id !== 'all').map(f => (
              <option key={f.id} value={f.id} style={{ background: '#12162A' }}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Info */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
          {infoRows.map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ color: '#475569', fontSize: '0.72rem' }}>{label}</span>
              <span style={{ color: '#94A3B8', fontSize: '0.72rem', fontFamily: label === 'Type' || label === 'Dimensions' ? "'Fira Code', monospace" : 'inherit' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Public URL */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ color: '#475569', fontSize: '0.62rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>Public URL</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '6px 10px', overflow: 'hidden' }}>
              <span style={{ color: '#475569', fontSize: '0.7rem', fontFamily: "'Fira Code', monospace", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{item.public_url}</span>
            </div>
            <button onClick={copyUrl} style={{ background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(89,163,146,0.12)', color: copied ? '#4ade80' : '#59A392', border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'rgba(89,163,146,0.3)'}`, borderRadius: '6px', padding: '0 12px', cursor: 'pointer', fontSize: '0.72rem', whiteSpace: 'nowrap', fontFamily: "'Outfit', sans-serif", transition: 'all 0.2s' }}>
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '8px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
              Delete File
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => { onDelete(item.id); onClose() }}
                style={{ flex: 1, background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '7px', padding: '8px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                Confirm Delete
              </button>
              <button onClick={() => setConfirmDelete(false)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.04)', color: '#64748B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', padding: '8px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Media Library Page ──────────────────────────────────
interface UploadingFile {
  id: string
  name: string
  progress: number
  done: boolean
  error?: string
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loadingMedia, setLoadingMedia] = useState(true)
  const [activeFolder, setActiveFolder] = useState<MediaFolder>('all')

  const reloadMedia = useCallback(async () => {
    try {
      const data = await fetchMediaItems({ folder: activeFolder !== 'all' ? activeFolder : undefined })
      setItems(data)
    } catch {
      // keep existing items on refresh error
    } finally {
      setLoadingMedia(false)
    }
  }, [activeFolder])

  useEffect(() => { setLoadingMedia(true); reloadMedia() }, [reloadMedia])
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document'>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [customFolders, setCustomFolders] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => items.filter(item => {
    if (activeFolder !== 'all' && item.folder !== activeFolder) return false
    if (filterType !== 'all' && item.media_type !== filterType) return false
    if (search) {
      const q = search.toLowerCase()
      return item.filename.toLowerCase().includes(q) ||
        item.original_name.toLowerCase().includes(q) ||
        (item.alt_text ?? '').toLowerCase().includes(q)
    }
    return true
  }), [items, activeFolder, filterType, search])

  const countFor = (folder: MediaFolder) => {
    if (folder === 'all') return items.length
    return items.filter(i => i.folder === folder).length
  }

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const uploadEntries: UploadingFile[] = fileArray.map(f => ({
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      name: f.name, progress: 0, done: false,
    }))
    setUploading(prev => [...prev, ...uploadEntries])

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      const entry = uploadEntries[i]

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploading(prev => prev.map(u => u.id === entry.id && !u.done ? { ...u, progress: Math.min(u.progress + 20, 85) } : u))
      }, 200)

      const result = await uploadMedia(
        file,
        activeFolder === 'all' ? 'general' : activeFolder as Exclude<MediaFolder, 'all'>,
        'Arifur Rahman'
      )
      clearInterval(progressInterval)

      if (result.error) {
        setUploading(prev => prev.map(u => u.id === entry.id ? { ...u, progress: 100, done: true, error: result.error } : u))
      } else {
        setUploading(prev => prev.map(u => u.id === entry.id ? { ...u, progress: 100, done: true } : u))
        setItems(prev => [result.item, ...prev])
      }
    }

    // Clear done uploads after 3s
    setTimeout(() => setUploading(prev => prev.filter(u => !u.done || !!u.error)), 3000)
  }, [activeFolder])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files)
  }, [processFiles])

  const selectedItem = items.find(i => i.id === selectedId)

  const allFolders = [
    ...FOLDERS,
    ...customFolders.map(f => ({ id: f as MediaFolder, label: f.charAt(0).toUpperCase() + f.slice(1) })),
  ]

  return (
    <div style={{ display: 'flex', gap: '0', minHeight: 'calc(100vh - 128px)' }}>
      {/* Folder sidebar */}
      <div style={{ width: '180px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '16px', marginRight: '24px' }}>
        <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>— Folders</div>

        {allFolders.map(folder => {
          const isActive = activeFolder === folder.id
          return (
            <button key={folder.id} onClick={() => setActiveFolder(folder.id)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 10px',
                background: isActive ? 'rgba(89,163,146,0.12)' : 'transparent',
                border: 'none', borderLeft: `3px solid ${isActive ? '#59A392' : 'transparent'}`,
                borderRadius: '0 6px 6px 0', cursor: 'pointer',
                color: isActive ? '#59A392' : '#64748B', fontSize: '0.8rem',
                fontFamily: "'Outfit', sans-serif", marginBottom: '2px',
                transition: 'all 0.15s', textAlign: 'left',
              }}>
              <span>{folder.label}</span>
              <span style={{ background: isActive ? 'rgba(89,163,146,0.2)' : 'rgba(255,255,255,0.05)', color: isActive ? '#59A392' : '#475569', fontSize: '0.6rem', fontWeight: 700, padding: '1px 5px', borderRadius: '100px', fontFamily: "'Fira Code', monospace" }}>
                {countFor(folder.id)}
              </span>
            </button>
          )
        })}

        {showNewFolder ? (
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Folder name"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter' && newFolderName.trim()) {
                  setCustomFolders(prev => [...prev, newFolderName.trim().toLowerCase()])
                  setNewFolderName('')
                  setShowNewFolder(false)
                }
                if (e.key === 'Escape') setShowNewFolder(false)
              }}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(89,163,146,0.3)', borderRadius: '6px', color: '#E2E8F0', fontSize: '0.75rem', padding: '5px 8px', outline: 'none', fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => { if (newFolderName.trim()) { setCustomFolders(prev => [...prev, newFolderName.trim().toLowerCase()]); setNewFolderName(''); setShowNewFolder(false) }}} style={{ flex: 1, background: 'rgba(89,163,146,0.15)', color: '#59A392', border: 'none', borderRadius: '5px', padding: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>Create</button>
              <button onClick={() => setShowNewFolder(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', color: '#64748B', border: 'none', borderRadius: '5px', padding: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowNewFolder(true)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 10px', background: 'none', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '6px', cursor: 'pointer', color: '#475569', fontSize: '0.75rem', fontFamily: "'Outfit', sans-serif", marginTop: '8px', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(89,163,146,0.3)'; (e.currentTarget as HTMLElement).style.color = '#59A392' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = '#475569' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Folder
          </button>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>— Media Library</div>
            <h1 style={{ color: '#E2E8F0', fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0, letterSpacing: '-0.02em' }}>
              {allFolders.find(f => f.id === activeFolder)?.label ?? 'All Files'}
            </h1>
          </div>
          <button onClick={() => fileInputRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#3A589E,#59A392)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Files
          </button>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', alignItems: 'center' }}>
          {(['all', 'image', 'document'] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              style={{ background: filterType === t ? 'rgba(89,163,146,0.15)' : 'rgba(255,255,255,0.03)', color: filterType === t ? '#59A392' : '#64748B', border: `1px solid ${filterType === t ? 'rgba(89,163,146,0.35)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '100px', padding: '5px 14px', fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", textTransform: 'capitalize', transition: 'all 0.15s' }}>
              {t === 'all' ? `All (${filtered.length})` : t === 'image' ? `Images (${items.filter(i => i.media_type === 'image').length})` : `Documents (${items.filter(i => i.media_type === 'document').length})`}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '7px 12px', minWidth: '220px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files…"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#E2E8F0', fontSize: '0.82rem', fontFamily: "'Outfit', sans-serif" }} />
          </div>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            height: '120px',
            border: `2px dashed ${isDragOver ? '#59A392' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px',
            cursor: 'pointer', marginBottom: '16px',
            background: isDragOver ? 'rgba(89,163,146,0.05)' : 'rgba(255,255,255,0.01)',
            transition: 'all 0.2s',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDragOver ? '#59A392' : '#475569'} strokeWidth="1.5" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <div style={{ color: isDragOver ? '#59A392' : '#64748B', fontSize: '0.85rem' }}>
            {isDragOver ? 'Drop to upload' : 'Drop files here or click to browse'}
          </div>
          <div style={{ color: '#475569', fontSize: '0.7rem', fontFamily: "'Fira Code', monospace" }}>
            PNG, JPG, WebP, SVG, PDF, CSV, DOCX · Max 10MB
          </div>
        </div>

        <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.csv,.docx" style={{ display: 'none' }}
          onChange={e => { if (e.target.files) processFiles(e.target.files); e.target.value = '' }} />

        {/* Upload progress */}
        {uploading.length > 0 && (
          <div style={{ background: '#12162A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
            <div style={{ color: '#64748B', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Uploading</div>
            {uploading.map(u => <UploadProgressItem key={u.id} name={u.name} progress={u.progress} done={u.done} error={u.error} />)}
          </div>
        )}

        {/* Media grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              style={{
                background: '#12162A',
                border: `1px solid ${selectedId === item.id ? 'rgba(89,163,146,0.4)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '10px', overflow: 'hidden',
                cursor: 'pointer', transition: 'all 0.15s',
                position: 'relative',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(89,163,146,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = selectedId === item.id ? 'rgba(89,163,146,0.4)' : 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              {/* Thumbnail */}
              <div style={{ height: '120px', background: 'rgba(0,0,0,0.3)', overflow: 'hidden' }}>
                {item.media_type === 'image' ? (
                  <img src={item.public_url} alt={item.alt_text ?? item.filename}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy" />
                ) : (
                  <FileIcon mimeType={item.mime_type} />
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '8px 10px' }}>
                <div style={{ color: '#E2E8F0', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '2px' }}>{item.original_name}</div>
                <div style={{ color: '#475569', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace" }}>{formatSize(item.size_bytes)}</div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
            No files in this folder yet. Upload some files above.
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedId && selectedItem && (
        <>
          <div onClick={() => setSelectedId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 400 }} />
          <MediaDetailPanel
            item={selectedItem}
            onClose={() => setSelectedId(null)}
            onUpdate={(id, updates) => setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))}
            onDelete={id => { setItems(prev => prev.filter(i => i.id !== id)); setSelectedId(null) }}
          />
        </>
      )}
    </div>
  )
}
