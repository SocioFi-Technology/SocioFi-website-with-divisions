'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const STYLES = `
  .cms-posts { max-width: 1100px; }

  .cms-toolbar {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 20px; flex-wrap: wrap;
  }
  .cms-search {
    flex: 1; min-width: 200px;
    background: #111128; border: 1px solid rgba(89,163,146,0.1);
    border-radius: 10px; padding: 8px 14px;
    color: #E2E8F0; font-size: 13px;
    outline: none; font-family: 'DM Sans', sans-serif;
  }
  .cms-search:focus { border-color: rgba(89,163,146,0.25); }
  .cms-search::placeholder { color: #6B7B9E; }

  .cms-select {
    background: #111128; border: 1px solid rgba(89,163,146,0.1);
    border-radius: 10px; padding: 8px 12px;
    color: #E2E8F0; font-size: 13px;
    outline: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-select:focus { border-color: rgba(89,163,146,0.25); }

  .cms-btn-primary {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #3A589E, #59A392);
    border: none; border-radius: 10px;
    color: white; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: opacity 0.2s;
    white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-btn-primary:hover { opacity: 0.9; }

  .cms-tabs {
    display: flex; gap: 2px;
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 12px; padding: 4px;
    margin-bottom: 20px; width: fit-content;
  }
  .cms-tab {
    padding: 6px 14px; border-radius: 8px;
    font-size: 12.5px; font-weight: 500;
    color: #6B7B9E; cursor: pointer;
    border: none; background: none;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-tab.active {
    background: rgba(89,163,146,0.12);
    color: #E2E8F0;
  }

  .cms-panel {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 14px; overflow: hidden;
  }

  .cms-table { width: 100%; border-collapse: collapse; }
  .cms-table th {
    padding: 10px 16px;
    font-size: 11px; font-weight: 600;
    color: #6B7B9E; text-align: left;
    text-transform: uppercase; letter-spacing: 0.06em;
    font-family: 'JetBrains Mono', monospace;
    border-bottom: 1px solid rgba(89,163,146,0.08);
  }
  .cms-table td {
    padding: 12px 16px;
    font-size: 13px; color: #CBD5E1;
    border-bottom: 1px solid rgba(89,163,146,0.04);
    vertical-align: middle;
  }
  .cms-table tr:last-child td { border-bottom: none; }
  .cms-table-row { cursor: pointer; transition: background 0.15s; }
  .cms-table-row:hover td { background: rgba(89,163,146,0.03); }
  .cms-table-empty {
    padding: 60px; text-align: center; color: #6B7B9E; font-size: 13px;
  }

  .cms-badge {
    display: inline-flex; align-items: center;
    padding: 3px 8px; border-radius: 100px;
    font-size: 11px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.04em;
  }
  .cms-badge.published { background: rgba(89,163,146,0.12); color: #59A392; }
  .cms-badge.draft { background: rgba(107,123,158,0.12); color: #6B7B9E; }
  .cms-badge.review { background: rgba(232,184,77,0.12); color: #E8B84D; }
  .cms-badge.archived { background: rgba(248,113,113,0.08); color: #F87171; }

  .cms-div-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 2px 7px; border-radius: 100px;
    font-size: 10.5px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    background: rgba(89,163,146,0.06); color: #6B7B9E;
  }

  .cms-action-btn {
    background: none; border: 1px solid rgba(89,163,146,0.1);
    border-radius: 7px; padding: 4px 9px;
    color: #6B7B9E; font-size: 11px; cursor: pointer;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .cms-action-btn:hover { border-color: rgba(89,163,146,0.25); color: #E2E8F0; }
  .cms-action-btn.danger:hover { border-color: rgba(248,113,113,0.3); color: #F87171; }

  /* ── Side Panel ── */
  .cms-panel-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  }
  .cms-side-panel {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 301;
    width: 480px; max-width: 95vw;
    background: #111128;
    border-left: 1px solid rgba(89,163,146,0.1);
    display: flex; flex-direction: column;
    box-shadow: -20px 0 60px rgba(0,0,0,0.4);
    animation: cms-slide-in 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes cms-slide-in {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  .cms-sp-head {
    padding: 20px 24px;
    border-bottom: 1px solid rgba(89,163,146,0.08);
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
  }
  .cms-sp-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 15px; color: #E2E8F0;
  }
  .cms-sp-close {
    width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    background: none; border: none; color: #6B7B9E; cursor: pointer; border-radius: 8px;
    transition: background 0.15s, color 0.15s;
  }
  .cms-sp-close:hover { background: rgba(255,255,255,0.05); color: #E2E8F0; }
  .cms-sp-body {
    flex: 1; overflow-y: auto; padding: 20px 24px;
  }
  .cms-sp-body::-webkit-scrollbar { width: 4px; }
  .cms-sp-body::-webkit-scrollbar-thumb { background: rgba(89,163,146,0.15); border-radius: 2px; }
  .cms-sp-footer {
    padding: 16px 24px;
    border-top: 1px solid rgba(89,163,146,0.08);
    display: flex; gap: 10px; flex-shrink: 0;
  }

  .cms-field { margin-bottom: 16px; }
  .cms-label {
    display: block; font-size: 11.5px; font-weight: 600;
    color: #6B7B9E; margin-bottom: 6px;
    text-transform: uppercase; letter-spacing: 0.06em;
    font-family: 'JetBrains Mono', monospace;
  }
  .cms-input {
    width: 100%; background: rgba(12,12,29,0.8);
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 10px; padding: 9px 12px;
    color: #E2E8F0; font-size: 13px; outline: none;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s;
  }
  .cms-input:focus { border-color: rgba(89,163,146,0.3); }
  .cms-textarea {
    width: 100%; background: rgba(12,12,29,0.8);
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 10px; padding: 9px 12px;
    color: #E2E8F0; font-size: 13px; outline: none;
    font-family: 'DM Sans', sans-serif;
    resize: vertical; min-height: 80px;
    transition: border-color 0.2s;
  }
  .cms-textarea:focus { border-color: rgba(89,163,146,0.3); }
  .cms-textarea.mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; min-height: 240px;
  }

  .cms-md-toolbar {
    display: flex; gap: 4px; margin-bottom: 6px; flex-wrap: wrap;
  }
  .cms-md-btn {
    padding: 4px 8px; border-radius: 6px;
    background: rgba(89,163,146,0.06);
    border: 1px solid rgba(89,163,146,0.08);
    color: #A8B8D8; font-size: 11px; font-weight: 500;
    cursor: pointer; transition: all 0.15s;
    font-family: 'JetBrains Mono', monospace;
  }
  .cms-md-btn:hover { background: rgba(89,163,146,0.12); color: #E2E8F0; }

  .cms-preview-toggle {
    display: flex; gap: 2px;
    background: rgba(12,12,29,0.6);
    border-radius: 8px; padding: 3px; margin-bottom: 6px;
    width: fit-content;
  }
  .cms-pt-btn {
    padding: 4px 10px; border-radius: 6px; border: none;
    font-size: 11px; font-weight: 500; cursor: pointer;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
    color: #6B7B9E; background: none;
  }
  .cms-pt-btn.active { background: rgba(89,163,146,0.12); color: #E2E8F0; }

  .cms-preview-content {
    background: rgba(12,12,29,0.6);
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 10px; padding: 14px;
    min-height: 200px; color: #CBD5E1;
    font-size: 13.5px; line-height: 1.7;
  }
  .cms-preview-content h1, .cms-preview-content h2 { color: #E2E8F0; margin: 14px 0 8px; font-family: 'Manrope', sans-serif; }
  .cms-preview-content h1 { font-size: 20px; }
  .cms-preview-content h2 { font-size: 16px; }
  .cms-preview-content strong { color: #E2E8F0; font-weight: 600; }
  .cms-preview-content em { font-style: italic; }
  .cms-preview-content code { font-family: 'JetBrains Mono', monospace; font-size: 12px; background: rgba(89,163,146,0.08); padding: 1px 5px; border-radius: 4px; }
  .cms-preview-content ul { padding-left: 18px; margin: 8px 0; }
  .cms-preview-content li { margin-bottom: 4px; }

  .cms-btn-ghost {
    flex: 1; padding: 9px;
    background: none; border: 1px solid rgba(89,163,146,0.12);
    border-radius: 10px; color: #6B7B9E; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; text-align: center;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-btn-ghost:hover { border-color: rgba(89,163,146,0.25); color: #E2E8F0; }
  .cms-btn-danger {
    padding: 9px 14px;
    background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.15);
    border-radius: 10px; color: #F87171; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-btn-danger:hover { background: rgba(248,113,113,0.15); }

  .cms-error { color: #F87171; font-size: 12px; margin-top: 8px; }
  .cms-saving {
    opacity: 0.7; pointer-events: none;
  }
`;

const DIVISION_COLORS: Record<string, string> = {
  studio: '#72C4B2', services: '#4DBFA8', labs: '#7B6FE8',
  products: '#E8916F', academy: '#E8B84D', ventures: '#6BA3E8',
  cloud: '#5BB5E0', parent: '#4A6CB8',
};

const DIVISIONS = ['parent', 'studio', 'services', 'labs', 'products', 'academy', 'ventures', 'cloud'];
const STATUSES = ['draft', 'review', 'published', 'archived'];

type Post = {
  id: string;
  title: string;
  slug: string;
  division: string;
  status: string;
  author: string;
  excerpt: string;
  body: string;
  tags: string[];
  created_at: string;
  published_at: string | null;
};

function simpleMarkdown(md: string): string {
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*<\/li>)/, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[huplo])/gm, '')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#59A392">$1</a>');
}

const emptyForm = (): Partial<Post> => ({
  title: '', division: 'parent', status: 'draft',
  tags: [], excerpt: '', body: '',
});

function PostPanel({
  post,
  onClose,
  onSaved,
}: {
  post: Partial<Post> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !post?.id;
  const [form, setForm] = useState<Partial<Post>>(post ?? emptyForm());
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  const set = (k: keyof Post, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const insertMd = (wrap: string, multiline = false) => {
    const ta = bodyRef.current;
    if (!ta) return;
    const { selectionStart: ss, selectionEnd: se } = ta;
    const selected = (form.body ?? '').slice(ss, se);
    const replacement = multiline
      ? `${wrap}${selected || 'text'}${wrap}`
      : `${wrap}${selected || 'text'}${wrap}`;
    const newBody =
      (form.body ?? '').slice(0, ss) + replacement + (form.body ?? '').slice(se);
    set('body', newBody);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(ss + wrap.length, ss + wrap.length + (selected || 'text').length);
    }, 0);
  };

  const handleSave = async (asPublish = false) => {
    if (!form.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        status: asPublish ? 'published' : form.status,
        tags: typeof form.tags === 'string'
          ? (form.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
          : form.tags ?? [],
      };
      const url = isNew ? '/api/cms/posts' : `/api/cms/posts/${form.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? 'Failed to save');
      }
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error saving post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form.id || !confirm('Delete this post? This cannot be undone.')) return;
    setSaving(true);
    try {
      await fetch(`/api/cms/posts/${form.id}`, { method: 'DELETE' });
      onSaved();
    } catch {
      setError('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="cms-panel-overlay" onClick={onClose} />
      <div className={`cms-side-panel${saving ? ' cms-saving' : ''}`} role="dialog" aria-modal="true">
        <div className="cms-sp-head">
          <div className="cms-sp-title">{isNew ? 'New Post' : 'Edit Post'}</div>
          <button className="cms-sp-close" onClick={onClose} aria-label="Close panel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="cms-sp-body">
          <div className="cms-field">
            <label className="cms-label">Title</label>
            <input className="cms-input" value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="Post title..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="cms-field">
              <label className="cms-label">Division</label>
              <select className="cms-select" style={{ width: '100%' }} value={form.division ?? 'parent'} onChange={(e) => set('division', e.target.value)}>
                {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="cms-field">
              <label className="cms-label">Status</label>
              <select className="cms-select" style={{ width: '100%' }} value={form.status ?? 'draft'} onChange={(e) => set('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="cms-field">
            <label className="cms-label">Tags (comma-separated)</label>
            <input
              className="cms-input"
              value={Array.isArray(form.tags) ? form.tags.join(', ') : (form.tags ?? '')}
              onChange={(e) => set('tags', e.target.value)}
              placeholder="ai, development, tutorial"
            />
          </div>

          <div className="cms-field">
            <label className="cms-label">Excerpt</label>
            <textarea className="cms-textarea" rows={2} value={form.excerpt ?? ''} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short description..." />
          </div>

          <div className="cms-field">
            <label className="cms-label">Body (Markdown)</label>
            <div className="cms-md-toolbar">
              {[
                { label: 'B', action: () => insertMd('**') },
                { label: 'I', action: () => insertMd('*') },
                { label: '`', action: () => insertMd('`') },
                { label: 'H1', action: () => { set('body', (form.body ?? '') + '\n# '); } },
                { label: 'H2', action: () => { set('body', (form.body ?? '') + '\n## '); } },
                { label: 'Link', action: () => { set('body', (form.body ?? '') + '[text](url)'); } },
                { label: '•', action: () => { set('body', (form.body ?? '') + '\n- '); } },
              ].map((btn) => (
                <button key={btn.label} className="cms-md-btn" type="button" onClick={btn.action}>{btn.label}</button>
              ))}
            </div>
            <div className="cms-preview-toggle">
              <button className={`cms-pt-btn${!preview ? ' active' : ''}`} onClick={() => setPreview(false)}>Write</button>
              <button className={`cms-pt-btn${preview ? ' active' : ''}`} onClick={() => setPreview(true)}>Preview</button>
            </div>
            {preview ? (
              <div className="cms-preview-content" dangerouslySetInnerHTML={{ __html: simpleMarkdown(form.body ?? '') }} />
            ) : (
              <textarea
                ref={bodyRef}
                className="cms-textarea mono"
                value={form.body ?? ''}
                onChange={(e) => set('body', e.target.value)}
                placeholder="Write in Markdown..."
              />
            )}
          </div>

          {error && <div className="cms-error">{error}</div>}
        </div>

        <div className="cms-sp-footer">
          <button className="cms-btn-ghost" onClick={() => handleSave(false)} disabled={saving}>
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button className="cms-btn-primary" onClick={() => handleSave(true)} disabled={saving}>
            Publish
          </button>
          {!isNew && (
            <button className="cms-btn-danger" onClick={handleDelete} disabled={saving}>
              Delete
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function CMSPostsInner() {
  const searchParams = useSearchParams();
  const defaultDivision = searchParams.get('division') ?? 'all';

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState(defaultDivision);
  const [statusFilter, setStatusFilter] = useState('all');
  const [panelPost, setPanelPost] = useState<Partial<Post> | null | undefined>(undefined);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (division !== 'all') params.set('division', division);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);
      const res = await fetch(`/api/cms/posts?${params}`);
      const json = await res.json();
      setPosts(json.posts ?? []);
    } finally {
      setLoading(false);
    }
  }, [division, statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(fetchPosts, 300);
    return () => clearTimeout(t);
  }, [fetchPosts]);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const DIVISION_TABS = [
    { value: 'all', label: 'All' },
    { value: 'parent', label: 'Blog' },
    { value: 'labs', label: 'Labs' },
    { value: 'studio', label: 'Announcements' },
  ];

  return (
    <div className="cms-posts">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="cms-tabs">
        {DIVISION_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`cms-tab${division === tab.value ? ' active' : ''}`}
            onClick={() => setDivision(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="cms-toolbar">
        <input
          className="cms-search"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="cms-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button className="cms-btn-primary" onClick={() => setPanelPost(emptyForm())}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Post
        </button>
      </div>

      <div className="cms-panel">
        {loading ? (
          <div className="cms-table-empty">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="cms-table-empty">No posts found. Create your first post.</div>
        ) : (
          <table className="cms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Division</th>
                <th>Status</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="cms-table-row" onClick={() => setPanelPost(post)}>
                  <td style={{ fontWeight: 500, color: '#E2E8F0', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </td>
                  <td>
                    <span className="cms-div-badge">
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: DIVISION_COLORS[post.division] ?? '#6B7B9E', display: 'inline-block' }} />
                      {post.division}
                    </span>
                  </td>
                  <td><span className={`cms-badge ${post.status}`}>{post.status}</span></td>
                  <td style={{ color: '#6B7B9E' }}>{post.author ?? '—'}</td>
                  <td style={{ color: '#6B7B9E' }}>{formatDate(post.published_at ?? post.created_at)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button className="cms-action-btn" onClick={() => setPanelPost(post)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {panelPost !== undefined && (
        <PostPanel
          post={panelPost}
          onClose={() => setPanelPost(undefined)}
          onSaved={() => { setPanelPost(undefined); fetchPosts(); }}
        />
      )}
    </div>
  );
}

export default function CMSPosts() {
  return (
    <React.Suspense fallback={<div style={{ padding: 40, color: '#6B7B9E' }}>Loading...</div>}>
      <CMSPostsInner />
    </React.Suspense>
  );
}
