'use client';
import React, { useState, useEffect, useCallback } from 'react';

const STYLES = `
  .cms-testimonials { max-width: 1100px; }

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

  .cms-testi-grid {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
  }
  @media (max-width: 900px) { .cms-testi-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px) { .cms-testi-grid { grid-template-columns: 1fr; } }

  .cms-testi-card {
    background: #111128; border: 1px solid rgba(89,163,146,0.08);
    border-radius: 14px; padding: 20px;
    transition: border-color 0.2s;
  }
  .cms-testi-card:hover { border-color: rgba(89,163,146,0.16); }

  .cms-testi-top {
    display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
  }
  .cms-avatar-circle {
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, #3A589E, #59A392);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Manrope', sans-serif; font-weight: 700;
    font-size: 14px; color: white; flex-shrink: 0;
  }
  .cms-testi-info { flex: 1; min-width: 0; }
  .cms-testi-name {
    font-family: 'Manrope', sans-serif; font-weight: 700;
    font-size: 14px; color: #E2E8F0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .cms-testi-role { font-size: 12px; color: #6B7B9E; }
  .cms-testi-company { font-size: 11.5px; color: #4A5578; }

  .cms-stars { color: #E8B84D; font-size: 13px; margin-bottom: 10px; }
  .cms-testi-content {
    font-size: 13px; color: #94A3B8; line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; overflow: hidden;
    margin-bottom: 12px;
  }
  .cms-testi-footer {
    display: flex; align-items: center; justify-content: space-between;
  }
  .cms-div-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 2px 7px; border-radius: 100px;
    font-size: 10.5px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    background: rgba(89,163,146,0.06); color: #6B7B9E;
  }
  .cms-testi-actions { display: flex; gap: 6px; }
  .cms-action-btn {
    background: none; border: 1px solid rgba(89,163,146,0.1);
    border-radius: 7px; padding: 4px 9px;
    color: #6B7B9E; font-size: 11px; cursor: pointer;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .cms-action-btn:hover { border-color: rgba(89,163,146,0.25); color: #E2E8F0; }
  .cms-action-btn.danger:hover { border-color: rgba(248,113,113,0.3); color: #F87171; }

  .cms-empty {
    grid-column: 1/-1; padding: 60px; text-align: center;
    background: #111128; border: 1px solid rgba(89,163,146,0.08);
    border-radius: 14px; color: #6B7B9E; font-size: 13px;
  }

  /* Side Panel */
  .cms-panel-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
  .cms-side-panel {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 301;
    width: 460px; max-width: 95vw; background: #111128;
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
    font-family: 'DM Sans', sans-serif; resize: vertical; min-height: 100px;
    transition: border-color 0.2s;
  }
  .cms-textarea:focus { border-color: rgba(89,163,146,0.3); }

  .cms-star-selector { display: flex; gap: 4px; }
  .cms-star-btn {
    background: none; border: none; cursor: pointer;
    font-size: 20px; padding: 2px; transition: transform 0.1s;
    color: #4A5578;
  }
  .cms-star-btn.active { color: #E8B84D; }
  .cms-star-btn:hover { transform: scale(1.2); }

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

type Testimonial = {
  id: string;
  name: string;
  title: string;
  company: string;
  content: string;
  rating: number;
  division: string;
  avatar_url: string | null;
};

const emptyForm = (): Partial<Testimonial> => ({
  name: '', title: '', company: '', content: '',
  rating: 5, division: 'parent', avatar_url: '',
});

function TestiPanel({
  testi,
  onClose,
  onSaved,
}: {
  testi: Partial<Testimonial> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !testi?.id;
  const [form, setForm] = useState<Partial<Testimonial>>(testi ?? emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof Testimonial, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name?.trim() || !form.content?.trim()) { setError('Name and content are required.'); return; }
    setSaving(true); setError('');
    try {
      const url = isNew ? '/api/cms/testimonials' : '/api/cms/testimonials';
      const method = isNew ? 'POST' : 'PUT';
      const payload = isNew ? form : { id: testi?.id, ...form };
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? 'Failed'); }
      onSaved();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!testi?.id || !confirm('Delete this testimonial?')) return;
    setSaving(true);
    try {
      await fetch(`/api/cms/testimonials?id=${testi.id}`, { method: 'DELETE' });
      onSaved();
    } catch { setError('Failed to delete'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div className="cms-panel-overlay" onClick={onClose} />
      <div className={`cms-side-panel${saving ? ' cms-saving' : ''}`}>
        <div className="cms-sp-head">
          <div className="cms-sp-title">{isNew ? 'New Testimonial' : 'Edit Testimonial'}</div>
          <button className="cms-sp-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="cms-sp-body">
          <div className="cms-field">
            <label className="cms-label">Name</label>
            <input className="cms-input" value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} placeholder="John Smith" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="cms-field">
              <label className="cms-label">Role / Title</label>
              <input className="cms-input" value={form.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="CEO" />
            </div>
            <div className="cms-field">
              <label className="cms-label">Company</label>
              <input className="cms-input" value={form.company ?? ''} onChange={(e) => set('company', e.target.value)} placeholder="Acme Inc." />
            </div>
          </div>
          <div className="cms-field">
            <label className="cms-label">Division</label>
            <select className="cms-select" value={form.division ?? 'parent'} onChange={(e) => set('division', e.target.value)}>
              {DIVISIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="cms-field">
            <label className="cms-label">Rating</label>
            <div className="cms-star-selector">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`cms-star-btn${(form.rating ?? 5) >= n ? ' active' : ''}`}
                  onClick={() => set('rating', n)}
                  type="button"
                  aria-label={`${n} star${n !== 1 ? 's' : ''}`}
                >
                  &#9733;
                </button>
              ))}
            </div>
          </div>
          <div className="cms-field">
            <label className="cms-label">Content</label>
            <textarea className="cms-textarea" rows={5} value={form.content ?? ''} onChange={(e) => set('content', e.target.value)} placeholder="What they said about SocioFi..." />
          </div>
          <div className="cms-field">
            <label className="cms-label">Avatar URL (optional)</label>
            <input className="cms-input" value={form.avatar_url ?? ''} onChange={(e) => set('avatar_url', e.target.value)} placeholder="https://..." />
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

export default function CMSTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [panelTesti, setPanelTesti] = useState<Partial<Testimonial> | undefined>(undefined);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/testimonials');
      const json = await res.json();
      setTestimonials(json.testimonials ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const filtered = testimonials.filter((t) =>
    !search ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.company?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="cms-testimonials">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="cms-toolbar">
        <input
          className="cms-search"
          placeholder="Search testimonials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="cms-btn-primary" onClick={() => setPanelTesti(emptyForm())}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Testimonial
        </button>
      </div>

      <div className="cms-testi-grid">
        {loading ? (
          <div className="cms-empty">Loading testimonials...</div>
        ) : filtered.length === 0 ? (
          <div className="cms-empty">No testimonials found.</div>
        ) : filtered.map((t) => {
          const color = DIVISION_COLORS[t.division] ?? '#6B7B9E';
          return (
            <div key={t.id} className="cms-testi-card">
              <div className="cms-testi-top">
                <div className="cms-avatar-circle">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : getInitials(t.name)}
                </div>
                <div className="cms-testi-info">
                  <div className="cms-testi-name">{t.name}</div>
                  {t.title && <div className="cms-testi-role">{t.title}</div>}
                  {t.company && <div className="cms-testi-company">{t.company}</div>}
                </div>
              </div>
              <div className="cms-stars">{'★'.repeat(t.rating ?? 5)}{'☆'.repeat(5 - (t.rating ?? 5))}</div>
              <div className="cms-testi-content">{t.content}</div>
              <div className="cms-testi-footer">
                <span className="cms-div-badge">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {t.division}
                </span>
                <div className="cms-testi-actions">
                  <button className="cms-action-btn" onClick={() => setPanelTesti(t)}>Edit</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {panelTesti !== undefined && (
        <TestiPanel
          testi={panelTesti}
          onClose={() => setPanelTesti(undefined)}
          onSaved={() => { setPanelTesti(undefined); fetchTestimonials(); }}
        />
      )}
    </div>
  );
}
