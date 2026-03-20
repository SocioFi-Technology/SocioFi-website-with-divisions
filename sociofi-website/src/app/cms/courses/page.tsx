'use client';
import React, { useState, useEffect, useCallback } from 'react';

const STYLES = `
  .cms-courses { max-width: 1100px; }

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
    border: none; border-radius: 10px;
    color: white; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: opacity 0.2s; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-btn-primary:hover { opacity: 0.9; }

  .cms-course-grid {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
  }
  @media (max-width: 900px) { .cms-course-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px) { .cms-course-grid { grid-template-columns: 1fr; } }

  .cms-course-card {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 14px; padding: 20px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .cms-course-card:hover {
    border-color: rgba(89,163,146,0.18);
    background: #161636;
  }
  .cms-course-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700; font-size: 14px; color: #E2E8F0;
    margin-bottom: 8px; line-height: 1.3;
  }
  .cms-course-meta {
    display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;
    align-items: center;
  }
  .cms-course-price {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; font-weight: 600; color: #59A392;
  }
  .cms-course-dur {
    font-size: 12px; color: #6B7B9E;
  }
  .cms-course-audience {
    font-size: 11px; padding: 2px 7px; border-radius: 100px;
    background: rgba(107,163,232,0.1); color: #6BA3E8;
    font-family: 'JetBrains Mono', monospace; font-weight: 600;
  }
  .cms-badge {
    display: inline-flex; padding: 3px 8px; border-radius: 100px;
    font-size: 11px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace; letter-spacing: 0.04em;
  }
  .cms-badge.published { background: rgba(89,163,146,0.12); color: #59A392; }
  .cms-badge.draft { background: rgba(107,123,158,0.12); color: #6B7B9E; }
  .cms-cat-badge {
    font-size: 10.5px; padding: 2px 7px; border-radius: 100px;
    background: rgba(123,111,232,0.1); color: #7B6FE8;
    font-family: 'JetBrains Mono', monospace; font-weight: 600;
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
    width: 500px; max-width: 95vw;
    background: #111128; border-left: 1px solid rgba(89,163,146,0.1);
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
    font-family: 'DM Sans', sans-serif; cursor: pointer;
  }
  .cms-select:focus { border-color: rgba(89,163,146,0.3); }
  .cms-textarea {
    width: 100%; background: rgba(12,12,29,0.8);
    border: 1px solid rgba(89,163,146,0.1); border-radius: 10px;
    padding: 9px 12px; color: #E2E8F0; font-size: 13px; outline: none;
    font-family: 'DM Sans', sans-serif; resize: vertical; min-height: 80px;
    transition: border-color 0.2s;
  }
  .cms-textarea:focus { border-color: rgba(89,163,146,0.3); }
  .cms-textarea.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; min-height: 120px; }

  .cms-btn-ghost {
    flex: 1; padding: 9px; background: none;
    border: 1px solid rgba(89,163,146,0.12); border-radius: 10px;
    color: #6B7B9E; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-btn-ghost:hover { border-color: rgba(89,163,146,0.25); color: #E2E8F0; }
  .cms-btn-danger {
    padding: 9px 14px; background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.15); border-radius: 10px;
    color: #F87171; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-btn-danger:hover { background: rgba(248,113,113,0.15); }
  .cms-error { color: #F87171; font-size: 12px; margin-top: 8px; }
  .cms-saving { opacity: 0.7; pointer-events: none; }
  .cms-hint { font-size: 11px; color: #6B7B9E; margin-top: 4px; }
`;

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  audience: string;
  status: string;
  outcomes: string[];
  modules: unknown[];
};

const CATEGORIES = ['ai-development', 'ai-agents', 'product-management', 'business-strategy'];
const AUDIENCES = ['founder', 'leader', 'team'];

const emptyForm = (): Partial<Course> => ({
  title: '', slug: '', description: '', price: 0,
  duration: '', category: 'ai-development', audience: 'founder',
  status: 'draft', outcomes: [], modules: [],
});

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function CoursePanel({
  course,
  onClose,
  onSaved,
}: {
  course: Partial<Course> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !course?.id;
  const [form, setForm] = useState<Partial<Course>>(course ?? emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modulesRaw, setModulesRaw] = useState(
    JSON.stringify(course?.modules ?? [], null, 2)
  );

  const set = (k: keyof Course, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (v: string) => {
    set('title', v);
    if (isNew) set('slug', slugify(v));
  };

  const handleSave = async () => {
    if (!form.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError('');
    try {
      let parsedModules: unknown[] = [];
      try { parsedModules = JSON.parse(modulesRaw); } catch { /* ignore */ }
      const payload = {
        ...form,
        outcomes: typeof form.outcomes === 'string'
          ? (form.outcomes as string).split('\n').map((s: string) => s.trim()).filter(Boolean)
          : form.outcomes ?? [],
        modules: parsedModules,
      };
      const url = isNew ? '/api/cms/courses' : `/api/cms/courses/${form.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? 'Failed to save'); }
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form.id || !confirm('Delete this course?')) return;
    setSaving(true);
    try {
      await fetch(`/api/cms/courses/${form.id}`, { method: 'DELETE' });
      onSaved();
    } catch { setError('Failed to delete'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div className="cms-panel-overlay" onClick={onClose} />
      <div className={`cms-side-panel${saving ? ' cms-saving' : ''}`}>
        <div className="cms-sp-head">
          <div className="cms-sp-title">{isNew ? 'New Course' : 'Edit Course'}</div>
          <button className="cms-sp-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="cms-sp-body">
          <div className="cms-field">
            <label className="cms-label">Title</label>
            <input className="cms-input" value={form.title ?? ''} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Course title..." />
          </div>
          <div className="cms-field">
            <label className="cms-label">Slug</label>
            <input className="cms-input" value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)} placeholder="auto-generated" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="cms-field">
              <label className="cms-label">Category</label>
              <select className="cms-select" value={form.category ?? 'ai-development'} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="cms-field">
              <label className="cms-label">Audience</label>
              <select className="cms-select" value={form.audience ?? 'founder'} onChange={(e) => set('audience', e.target.value)}>
                {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="cms-field">
              <label className="cms-label">Duration</label>
              <input className="cms-input" value={form.duration ?? ''} onChange={(e) => set('duration', e.target.value)} placeholder="e.g. 6 weeks" />
            </div>
            <div className="cms-field">
              <label className="cms-label">Price (USD)</label>
              <input className="cms-input" type="number" min={0} value={form.price ?? 0} onChange={(e) => set('price', parseFloat(e.target.value))} />
            </div>
          </div>
          <div className="cms-field">
            <label className="cms-label">Status</label>
            <select className="cms-select" value={form.status ?? 'draft'} onChange={(e) => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="cms-field">
            <label className="cms-label">Description</label>
            <textarea className="cms-textarea" rows={3} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="Course description..." />
          </div>
          <div className="cms-field">
            <label className="cms-label">Outcomes (one per line)</label>
            <textarea
              className="cms-textarea"
              rows={4}
              value={Array.isArray(form.outcomes) ? form.outcomes.join('\n') : (form.outcomes ?? '')}
              onChange={(e) => set('outcomes', e.target.value)}
              placeholder="Build production-ready AI agents&#10;Deploy to cloud infrastructure&#10;Manage costs and monitoring"
            />
          </div>
          <div className="cms-field">
            <label className="cms-label">Modules (JSON)</label>
            <textarea
              className="cms-textarea mono"
              rows={5}
              value={modulesRaw}
              onChange={(e) => setModulesRaw(e.target.value)}
              placeholder='[{"title": "Module 1", "lessons": [...]}]'
            />
            <div className="cms-hint">Raw JSON array for course modules</div>
          </div>
          {error && <div className="cms-error">{error}</div>}
        </div>
        <div className="cms-sp-footer">
          <button className="cms-btn-ghost" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button className="cms-btn-primary" onClick={handleSave} disabled={saving}>
            {form.status === 'published' ? 'Update' : 'Publish'}
          </button>
          {!isNew && (
            <button className="cms-btn-danger" onClick={handleDelete} disabled={saving}>Delete</button>
          )}
        </div>
      </div>
    </>
  );
}

export default function CMSCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [panelCourse, setPanelCourse] = useState<Partial<Course> | undefined>(undefined);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/courses');
      const json = await res.json();
      setCourses(json.courses ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const filtered = courses.filter((c) =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cms-courses">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="cms-toolbar">
        <input
          className="cms-search"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="cms-btn-primary" onClick={() => setPanelCourse(emptyForm())}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Course
        </button>
      </div>

      <div className="cms-course-grid">
        {loading ? (
          <div className="cms-empty">Loading courses...</div>
        ) : filtered.length === 0 ? (
          <div className="cms-empty">No courses found.</div>
        ) : filtered.map((course) => (
          <div
            key={course.id}
            className="cms-course-card"
            onClick={() => setPanelCourse(course)}
          >
            <div className="cms-course-title">{course.title}</div>
            <div className="cms-course-meta">
              {course.category && <span className="cms-cat-badge">{course.category}</span>}
              {course.audience && <span className="cms-course-audience">{course.audience}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {course.price != null && (
                  <span className="cms-course-price">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>
                )}
                {course.duration && <span className="cms-course-dur">{course.duration}</span>}
              </div>
              <span className={`cms-badge ${course.status}`}>{course.status}</span>
            </div>
          </div>
        ))}
      </div>

      {panelCourse !== undefined && (
        <CoursePanel
          course={panelCourse}
          onClose={() => setPanelCourse(undefined)}
          onSaved={() => { setPanelCourse(undefined); fetchCourses(); }}
        />
      )}
    </div>
  );
}
