'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

const STYLES = `
  .cms-media { max-width: 1100px; }

  .cms-toolbar {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 24px; flex-wrap: wrap;
  }
  .cms-search {
    flex: 1; min-width: 200px;
    background: #111128; border: 1px solid rgba(89,163,146,0.1);
    border-radius: 10px; padding: 8px 14px;
    color: #E2E8F0; font-size: 13px; outline: none;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-search:focus { border-color: rgba(89,163,146,0.25); }
  .cms-search::placeholder { color: #6B7B9E; }
  .cms-btn-primary {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #3A589E, #59A392);
    border: none; border-radius: 10px; color: white;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: opacity 0.2s; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-btn-primary:hover { opacity: 0.9; }

  .cms-drop-zone {
    border: 2px dashed rgba(89,163,146,0.2);
    border-radius: 14px; padding: 40px;
    text-align: center; margin-bottom: 24px;
    transition: all 0.2s; cursor: pointer;
    background: rgba(89,163,146,0.02);
  }
  .cms-drop-zone.over {
    border-color: rgba(89,163,146,0.5);
    background: rgba(89,163,146,0.05);
  }
  .cms-drop-zone-text { color: #6B7B9E; font-size: 13px; margin-top: 10px; }
  .cms-drop-zone-icon { color: rgba(89,163,146,0.4); }

  .cms-upload-bar {
    background: #111128; border: 1px solid rgba(89,163,146,0.08);
    border-radius: 10px; padding: 12px 16px;
    margin-bottom: 16px; display: flex; align-items: center; gap: 12px;
  }
  .cms-upload-progress {
    flex: 1; height: 4px; background: rgba(89,163,146,0.1); border-radius: 2px; overflow: hidden;
  }
  .cms-upload-fill {
    height: 100%; background: linear-gradient(90deg, #3A589E, #59A392);
    border-radius: 2px; transition: width 0.3s;
  }
  .cms-upload-name { font-size: 12px; color: #6B7B9E; }
  .cms-upload-pct { font-size: 12px; color: #59A392; font-family: 'JetBrains Mono', monospace; white-space: nowrap; }

  .cms-media-grid {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 14px;
  }
  @media (max-width: 900px) { .cms-media-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 600px) { .cms-media-grid { grid-template-columns: repeat(2,1fr); } }

  .cms-media-card {
    background: #111128; border: 1px solid rgba(89,163,146,0.08);
    border-radius: 12px; overflow: hidden; cursor: pointer;
    transition: border-color 0.2s, transform 0.2s;
  }
  .cms-media-card:hover { border-color: rgba(89,163,146,0.2); transform: translateY(-2px); }
  .cms-media-card.selected { border-color: rgba(89,163,146,0.4); }

  .cms-media-thumb {
    height: 120px; overflow: hidden;
    background: rgba(89,163,146,0.04);
    display: flex; align-items: center; justify-content: center;
  }
  .cms-media-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .cms-media-thumb-icon { color: rgba(89,163,146,0.2); }

  .cms-media-info { padding: 10px 12px; }
  .cms-media-name {
    font-size: 11.5px; color: #CBD5E1; font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 3px;
  }
  .cms-media-size { font-size: 10.5px; color: #6B7B9E; font-family: 'JetBrains Mono', monospace; }

  .cms-empty {
    grid-column: 1/-1; padding: 60px; text-align: center;
    background: #111128; border: 1px solid rgba(89,163,146,0.08);
    border-radius: 14px; color: #6B7B9E; font-size: 13px;
  }

  /* Detail panel */
  .cms-panel-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
  .cms-side-panel {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 301;
    width: 380px; max-width: 95vw; background: #111128;
    border-left: 1px solid rgba(89,163,146,0.1);
    display: flex; flex-direction: column;
    box-shadow: -20px 0 60px rgba(0,0,0,0.4);
    animation: slide-in 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .cms-sp-head {
    padding: 20px 24px; border-bottom: 1px solid rgba(89,163,146,0.08);
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .cms-sp-title { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 15px; color: #E2E8F0; }
  .cms-sp-close {
    width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    background: none; border: none; color: #6B7B9E; cursor: pointer; border-radius: 8px;
    transition: background 0.15s, color 0.15s;
  }
  .cms-sp-close:hover { background: rgba(255,255,255,0.05); color: #E2E8F0; }
  .cms-sp-body { flex: 1; overflow-y: auto; padding: 20px 24px; }
  .cms-sp-footer {
    padding: 16px 24px; border-top: 1px solid rgba(89,163,146,0.08);
    display: flex; gap: 10px; flex-shrink: 0;
  }

  .cms-media-preview {
    width: 100%; border-radius: 10px; overflow: hidden;
    background: rgba(89,163,146,0.04); margin-bottom: 16px;
    display: flex; align-items: center; justify-content: center;
    min-height: 160px;
  }
  .cms-media-preview img { width: 100%; display: block; }

  .cms-meta-row {
    display: flex; gap: 8px; margin-bottom: 10px;
  }
  .cms-meta-label { font-size: 11px; color: #6B7B9E; font-family: 'JetBrains Mono', monospace; min-width: 60px; }
  .cms-meta-value { font-size: 12px; color: #CBD5E1; }

  .cms-url-box {
    background: rgba(12,12,29,0.8); border: 1px solid rgba(89,163,146,0.1);
    border-radius: 10px; padding: 10px 12px;
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    color: #6B7B9E; word-break: break-all; margin-bottom: 12px;
  }

  .cms-btn-copy {
    width: 100%; padding: 9px;
    background: rgba(89,163,146,0.08); border: 1px solid rgba(89,163,146,0.15);
    border-radius: 10px; color: #59A392; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    margin-bottom: 8px;
  }
  .cms-btn-copy:hover { background: rgba(89,163,146,0.12); }
  .cms-btn-delete {
    width: 100%; padding: 9px;
    background: rgba(248,113,113,0.06); border: 1px solid rgba(248,113,113,0.12);
    border-radius: 10px; color: #F87171; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .cms-btn-delete:hover { background: rgba(248,113,113,0.12); }

  .cms-copied-toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: #59A392; color: white; padding: 8px 18px;
    border-radius: 100px; font-size: 13px; font-weight: 600;
    z-index: 999; animation: cms-toast-in 0.2s ease;
  }
  @keyframes cms-toast-in { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
`;

type MediaFile = {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  size: number;
  mime_type: string;
  created_at: string;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(mime: string): boolean {
  return mime?.startsWith('image/') ?? false;
}

function MediaDetailPanel({
  file,
  onClose,
  onDeleted,
}: {
  file: MediaFile;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDelete = async () => {
    if (!confirm('Delete this file? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await fetch(`/api/cms/media?id=${file.id}`, { method: 'DELETE' });
      onDeleted();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="cms-panel-overlay" onClick={onClose} />
      <div className="cms-side-panel">
        <div className="cms-sp-head">
          <div className="cms-sp-title">Media Details</div>
          <button className="cms-sp-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="cms-sp-body">
          <div className="cms-media-preview">
            {isImage(file.mime_type) ? (
              <img src={file.url} alt={file.original_name} />
            ) : (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(89,163,146,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
            )}
          </div>

          <div className="cms-meta-row">
            <span className="cms-meta-label">File</span>
            <span className="cms-meta-value" style={{ wordBreak: 'break-all' }}>{file.original_name}</span>
          </div>
          <div className="cms-meta-row">
            <span className="cms-meta-label">Size</span>
            <span className="cms-meta-value">{formatBytes(file.size)}</span>
          </div>
          <div className="cms-meta-row">
            <span className="cms-meta-label">Type</span>
            <span className="cms-meta-value">{file.mime_type}</span>
          </div>
          <div className="cms-meta-row">
            <span className="cms-meta-label">Uploaded</span>
            <span className="cms-meta-value">{new Date(file.created_at).toLocaleDateString()}</span>
          </div>

          <div style={{ marginTop: 16, marginBottom: 8, fontSize: 11, color: '#6B7B9E', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            URL
          </div>
          <div className="cms-url-box">{file.url}</div>

          <button className="cms-btn-copy" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
          <button className="cms-btn-delete" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete File'}
          </button>
        </div>
      </div>
      {copied && <div className="cms-copied-toast">URL copied to clipboard</div>}
    </>
  );
}

export default function CMSMedia() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadName, setUploadName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/media');
      const json = await res.json();
      setFiles(json.files ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadName(file.name);
    setUploadProgress(10);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((p) => Math.min(p + 15, 85));
      }, 200);
      const res = await fetch('/api/cms/media', { method: 'POST', body: formData });
      clearInterval(progressInterval);
      setUploadProgress(100);
      if (res.ok) {
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
          fetchFiles();
        }, 500);
      } else {
        setUploading(false);
      }
    } catch {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const filtered = files.filter((f) =>
    !search || f.original_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cms-media">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="cms-toolbar">
        <input
          className="cms-search"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="cms-btn-primary" onClick={() => fileInputRef.current?.click()}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
      </div>

      {uploading && (
        <div className="cms-upload-bar">
          <span className="cms-upload-name">{uploadName}</span>
          <div className="cms-upload-progress">
            <div className="cms-upload-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
          <span className="cms-upload-pct">{uploadProgress}%</span>
        </div>
      )}

      <div
        className={`cms-drop-zone${dragOver ? ' over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="cms-drop-zone-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <div className="cms-drop-zone-text">Drop files here or click to upload</div>
      </div>

      <div className="cms-media-grid">
        {loading ? (
          <div className="cms-empty">Loading media...</div>
        ) : filtered.length === 0 ? (
          <div className="cms-empty">No media files found. Upload your first file.</div>
        ) : filtered.map((file) => (
          <div
            key={file.id}
            className={`cms-media-card${selected?.id === file.id ? ' selected' : ''}`}
            onClick={() => setSelected(file)}
          >
            <div className="cms-media-thumb">
              {isImage(file.mime_type) ? (
                <img src={file.url} alt={file.original_name} loading="lazy" />
              ) : (
                <svg className="cms-media-thumb-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                  <polyline points="13 2 13 9 20 9"/>
                </svg>
              )}
            </div>
            <div className="cms-media-info">
              <div className="cms-media-name" title={file.original_name}>
                {file.original_name}
              </div>
              <div className="cms-media-size">{formatBytes(file.size)}</div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <MediaDetailPanel
          file={selected}
          onClose={() => setSelected(null)}
          onDeleted={() => { setSelected(null); fetchFiles(); }}
        />
      )}
    </div>
  );
}
