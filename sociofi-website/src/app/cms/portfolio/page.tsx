'use client';
import React, { useState, useEffect, useCallback } from 'react';

const STYLES = `
  .cms-portfolio { max-width: 1100px; }

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

  .cms-port-grid {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
  }
  @media (max-width: 900px) { .cms-port-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px) { .cms-port-grid { grid-column: 1fr; } }

  .cms-port-card {
    background: #111128; border: 1px solid rgba(89,163,146,0.08);
    border-radius: 14px; overflow: hidden; cursor: pointer;
    transition: border-color 0.2s, transform 0.2s;
  }
  .cms-port-card:hover { border-color: rgba(89,163,146,0.18); transform: translateY(-2px); }

  .cms-port-thumb {
    height: 100px;
    background: linear-gradient(135deg, rgba(58,88,158,0.3), rgba(89,163,146,0.2));
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .cms-port-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .cms-port-thumb-icon { color: rgba(89,163,146,0.3); }

  .cms-port-body { padding: 16px; }
  .cms-port-title {
    font-family: 'Manrope', sans-serif; font-weight: 700;
    font-size: 14px; color: #E2E8F0; margin-bottom: 6px;
    line-height: 1.3;
  }
  .cms-port-client { font-size: 12px; color: #6B7B9E; margin-bottom: 10px; }
  .cms-port-footer {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }

  .cms-badge {
    display: inline-flex; padding: 3px 8px; border-radius: 100px;
    font-size: 11px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em;
  }
  .cms-badge.published { background: rgba(89,163,146,0.12); color: #59A392; }
  .cms-badge.draft { background: rgba(107,123,158,0.12); color: #6B7B9E; }
  .cms-div-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 2px 7px; border-radius: 100px;
    font-size: 10.5px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    background: rgba(89,163,146,0.06); color: #6B7B9E;
  }
  .cms-cat-tag {
    font-size: 10.5px; color: #4A5578;
    font-family: 'JetBrains Mono', monospace;
  }

  .cms-empty {
    grid-column: 1/-1; padding: 60px; text-align: center;
    background: #111128; border: 1px solid rgba(89,163,146,0.08);
    border-radius: 14px; color: #6B7B9E; font-size: 13px;
  }

  /* Side Panel */
  .cms-panel-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
  .cms-side-panel {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 301;
    width: 500px; max-width: 95vw; background: #111128;
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
  .cms-sp-body::-webkit-scrollbar { width: 4px; }
  .cms-sp-body::-webkit-scrollbar-thumb { background: rgba(89,163,146,0.15); border-radius: 2px; }
  .cms-sp-footer {
    padding: 16px 24px; border-top: 1px solid rgba(89,163,146,0.08);
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
    border: 1px solid rgba(89,163,146,0.1); border-radius: 10px;
    padding: 9px 12px; color: #E2E8F0; font-size: 13px; outline: none;
    font-family: 'DM Sans', sans-serif; transition: border-color 0.2s;
  }
  .cms-input:focus { border-color: rgba(89,163,146,0.3); }
  .cms-select {
    width: 100%; background: rgba(12,12,29,0.8);
    border: 1px solid rgba(89,163,146,0.1); border-radius: 10px;
    padding: 9px 12px; color: #E2E8F0; font-size: 13px; outline: none;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
  }
  .cms-textarea {
    width: 100%; background: rgba(12,12,29,0.8);
    border: 1px solid rgba(89,163,146,0.1); border-radius: 10px;
    padding: 9px 12px; color: #E2E8F0; font-size: 13px; outline: none;
    font-family: 'DM Sans', sans-serif; resize: vertical; min-height: 80px;
    transition: border-color 0.2s;
  }
  .cms-textarea:focus { border-color: rgba(89,163,146,0.3); }

  .cms-btn-ghost {
    flex: 1; padding: 9px; background: none;
    border: 1px solid rgba(89,163,146,0.12); border-radius: 10px;
    color: #6B7B9E; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .cms-btn-ghost:hover { border-color: rgba(89,163,146,0.25); color: #E2E8F0; }
  .cms-btn-danger {
    padding: 9px 14px; background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.15); border-radius: 10px;
    color: #F87171; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .cms-btn-danger:hover { background: rgba(248,113,113,0.15); }
  .cms-error { color: #F87171; font-size: 12px; margin-top: 8px; }
  .cms-saving { opacity: 0.7; pointer-events: none; }
`;

const DIVISION_COLORS: Record<string, string> = {
  studio: '#72C4B2', services: '#4DBFA8', labs: '#7B6FE8',
  products: '#E8916F', academy: '#E8B84D', ventures: '#6BA3E8',
  cloud: '#5BB5E0', parent: '#4A6CB8',
};

const DIVISIONS = ['parent', 'studio', 'services', 'labs', 'products', 'academy', 'ventures', 'cloud'];

type PortfolioItem = {
  id: string;
  title: string;
  slug: string;
  client: string;
  division: string;
  category: string;
  description: string;
  outcomes: string[];
  cover_image: string | null;
  status: string;
};

const emptyForm = (): Partial<PortfolioItem> => ({
  title: '', slug: '', client: '', division: 'studio',
  category: '', description: '', outcomes: [], cover_image: '', status: 'draft',
});

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function PortfolioPanel({
  item,
  onClose,
  onSaved,
}: {
  item: Partial<PortfolioItem> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !item?.id;
  const [form, setForm] = useState<Partial<PortfolioItem>>(item ?? emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof PortfolioItem, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (v: string) => {
    set('title', v);
    if (isNew) set('slug', slugify(v));
  };

  const handleSave = async () => {
    if (!form.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        outcomes: typeof form.outcomes === 'string'
          ? (form.outcomes as string).split('\n').map((s: string) => s.trim()).filter(Boolean)
          : form.outcomes ?? [],
      };
      const url = '/api/cms/portfolio';
      const method = isNew ? 'POST' : 'PUT';
      const body = isNew ? payload : { id: item?.id, ...payload };
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? 'Failed'); }
      onSaved();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!item?.id || !confirm('Delete this portfolio item?')) return;
    setSaving(true);
    try {
      await fetch(`/api/cms/portfolio?id=${item.id}`, { method: 'DELETE' });
      onSaved();
    } catch { setError('Failed to delete'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div className="cms-panel-overlay" onClick={onClose} />
      <div className={`cms-side-panel${saving ? ' cms-saving' : ''}`}>
        <div className="cms-sp-head">
          <div className="cms-sp-title">{isNew ? 'New Project' : 'Edit Project'}</div>
          <button className="cms-sp-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="cms-sp-body">
          <div className="cms-field">
            <label className="cms-label">Project Title</label>
            <input className="cms-input" value={form.title ?? ''} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Project name..." />
          </div>
          <div className="cms-field">
            <label className="cms-label">Slug</label>
            <input className="cms-input" value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)} placeholder="auto-generated" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="cms-field">
              <label className="cms-label">Client</label>
              <input className="cms-input" value={form.client ?? ''} onChange={(e) => set('client', e.target.value)} placeholder="Client name" />
            </div>
            <div className="cms-field">
              <label className="cms-label">Category</label>
              <input className="cms-input" value={form.category ?? ''} onChange={(e) => set('category', e.target.value)} placeholder="e.g. AI Platform" />
            </div>
            <div className="cms-field">
              <label className="cms-label">Division</label>
              <select className="cms-select" value={form.division ?? 'studio'} onChange={(e) => set('division', e.target.value)}>
                {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="cms-field">
              <label className="cms-label">Status</label>
              <select className="cms-select" value={form.status ?? 'draft'} onChange={(e) => set('status', e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="cms-field">
            <label className="cms-label">Description</label>
            <textarea className="cms-textarea" rows={4} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="Project description..." />
          </div>
          <div className="cms-field">
            <label className="cms-label">Outcomes (one per line)</label>
            <textarea
              className="cms-textarea"
              rows={4}
              value={Array.isArray(form.outcomes) ? form.outcomes.join('\n') : (form.outcomes ?? '')}
              onChange={(e) => set('outcomes', e.target.value)}
              placeholder="Increased revenue by 40%&#10;Reduced load time by 60%"
            />
          </div>
          <div className="cms-field">
            <label className="cms-label">Cover Image URL</label>
            <input className="cms-input" value={form.cover_image ?? ''} onChange={(e) => set('cover_image', e.target.value)} placeholder="https://..." />
          </div>
          {error && <div className="cms-error">{error}</div>}
        </div>
        <div className="cms-sp-footer">
          <button className="cms-btn-ghost" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button className="cms-btn-primary" onClick={handleSave} disabled={saving}>
            {isNew ? 'Create' : 'Update'}
          </button>
          {!isNew && (
            <button className="cms-btn-danger" onClick={handleDelete} disabled={saving}>Delete</button>
          )}
        </div>
      </div>
    </>
  );
}

export default function CMSPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [panelItem, setPanelItem] = useState<Partial<PortfolioItem> | undefined>(undefined);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/portfolio');
      const json = await res.json();
      setItems(json.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = items.filter((i) =>
    !search ||
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.client?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cms-portfolio">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="cms-toolbar">
        <input
          className="cms-search"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="cms-btn-primary" onClick={() => setPanelItem(emptyForm())}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Project
        </button>
      </div>

      <div className="cms-port-grid">
        {loading ? (
          <div className="cms-empty">Loading portfolio...</div>
        ) : filtered.length === 0 ? (
          <div className="cms-empty">No portfolio items found.</div>
        ) : filtered.map((item) => {
          const color = DIVISION_COLORS[item.division] ?? '#6B7B9E';
          return (
            <div key={item.id} className="cms-port-card" onClick={() => setPanelItem(item)}>
              <div className="cms-port-thumb">
                {item.cover_image ? (
                  <img src={item.cover_image} alt={item.title} />
                ) : (
                  <svg className="cms-port-thumb-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                )}
              </div>
              <div className="cms-port-body">
                <div className="cms-port-title">{item.title}</div>
                {item.client && <div className="cms-port-client">{item.client}</div>}
                <div className="cms-port-footer">
                  <span className="cms-div-badge">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
                    {item.division}
                  </span>
                  {item.category && <span className="cms-cat-tag">{item.category}</span>}
                  <span className={`cms-badge ${item.status}`}>{item.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {panelItem !== undefined && (
        <PortfolioPanel
          item={panelItem}
          onClose={() => setPanelItem(undefined)}
          onSaved={() => { setPanelItem(undefined); fetchItems(); }}
        />
      )}
    </div>
  );
}
