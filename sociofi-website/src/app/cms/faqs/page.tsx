'use client';
import React, { useState, useEffect, useCallback } from 'react';

const STYLES = `
  .cms-faqs { max-width: 900px; }

  .cms-tabs {
    display: flex; gap: 2px; flex-wrap: wrap;
    background: #111128; border: 1px solid rgba(89,163,146,0.08);
    border-radius: 12px; padding: 4px; margin-bottom: 20px; width: fit-content;
  }
  .cms-tab {
    padding: 6px 14px; border-radius: 8px;
    font-size: 12.5px; font-weight: 500; color: #6B7B9E; cursor: pointer;
    border: none; background: none; transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-tab.active { background: rgba(89,163,146,0.12); color: #E2E8F0; }

  .cms-toolbar {
    display: flex; align-items: center; justify-content: flex-end;
    margin-bottom: 16px;
  }
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

  .cms-create-form {
    background: #111128; border: 1px solid rgba(89,163,146,0.12);
    border-radius: 14px; padding: 20px; margin-bottom: 20px;
  }
  .cms-create-title {
    font-family: 'Manrope', sans-serif; font-weight: 700;
    font-size: 14px; color: #E2E8F0; margin-bottom: 14px;
  }

  .cms-faq-list { display: flex; flex-direction: column; gap: 8px; }

  .cms-faq-row {
    background: #111128; border: 1px solid rgba(89,163,146,0.08);
    border-radius: 12px; overflow: hidden;
    transition: border-color 0.2s;
  }
  .cms-faq-row:hover { border-color: rgba(89,163,146,0.14); }

  .cms-faq-header {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px; cursor: pointer;
  }
  .cms-faq-drag {
    color: #4A5578; cursor: grab; flex-shrink: 0;
  }
  .cms-faq-question {
    flex: 1; font-size: 13.5px; font-weight: 500; color: #E2E8F0;
  }
  .cms-faq-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .cms-action-btn {
    background: none; border: 1px solid rgba(89,163,146,0.1);
    border-radius: 7px; padding: 4px 9px;
    color: #6B7B9E; font-size: 11px; cursor: pointer;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .cms-action-btn:hover { border-color: rgba(89,163,146,0.25); color: #E2E8F0; }
  .cms-action-btn.danger:hover { border-color: rgba(248,113,113,0.3); color: #F87171; }

  .cms-div-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 2px 7px; border-radius: 100px;
    font-size: 10.5px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    background: rgba(89,163,146,0.06); color: #6B7B9E;
  }
  .cms-div-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }

  .cms-faq-edit {
    border-top: 1px solid rgba(89,163,146,0.08);
    padding: 16px;
  }

  .cms-field { margin-bottom: 14px; }
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
    background: rgba(12,12,29,0.8); border: 1px solid rgba(89,163,146,0.1);
    border-radius: 10px; padding: 9px 12px; color: #E2E8F0; font-size: 13px; outline: none;
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

  .cms-edit-actions { display: flex; gap: 8px; }
  .cms-btn-save {
    padding: 7px 14px; background: rgba(89,163,146,0.1);
    border: 1px solid rgba(89,163,146,0.2); border-radius: 9px;
    color: #59A392; font-size: 12.5px; font-weight: 600; cursor: pointer;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .cms-btn-save:hover { background: rgba(89,163,146,0.15); }
  .cms-btn-cancel {
    padding: 7px 14px; background: none;
    border: 1px solid rgba(89,163,146,0.08); border-radius: 9px;
    color: #6B7B9E; font-size: 12.5px; cursor: pointer;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .cms-btn-cancel:hover { color: #E2E8F0; }

  .cms-empty {
    padding: 40px; text-align: center; color: #6B7B9E; font-size: 13px;
    background: #111128; border: 1px solid rgba(89,163,146,0.08); border-radius: 14px;
  }
  .cms-error { color: #F87171; font-size: 12px; margin-top: 6px; }
`;

const DIVISION_COLORS: Record<string, string> = {
  studio: '#72C4B2', services: '#4DBFA8', labs: '#7B6FE8',
  products: '#E8916F', academy: '#E8B84D', ventures: '#6BA3E8',
  cloud: '#5BB5E0', parent: '#4A6CB8',
};

const DIVISION_TABS = [
  { value: 'all', label: 'All' },
  { value: 'studio', label: 'Studio' },
  { value: 'services', label: 'Services' },
  { value: 'labs', label: 'Labs' },
  { value: 'academy', label: 'Academy' },
  { value: 'ventures', label: 'Ventures' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'products', label: 'Products' },
  { value: 'parent', label: 'Parent' },
];

type FAQ = {
  id: string;
  division: string;
  question: string;
  answer: string;
  order_index: number;
};

function CreateFAQForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ division: 'parent', question: '', answer: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!form.question.trim() || !form.answer.trim()) { setError('Question and answer required.'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/cms/faqs', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? 'Failed'); }
      setForm({ division: 'parent', question: '', answer: '' });
      onCreated();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="cms-create-form">
      <div className="cms-create-title">New FAQ</div>
      <div className="cms-field">
        <label className="cms-label">Division</label>
        <select className="cms-select" value={form.division} onChange={(e) => setForm((f) => ({ ...f, division: e.target.value }))}>
          {DIVISION_TABS.filter((d) => d.value !== 'all').map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </div>
      <div className="cms-field">
        <label className="cms-label">Question</label>
        <input className="cms-input" value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} placeholder="What is the question?" />
      </div>
      <div className="cms-field">
        <label className="cms-label">Answer</label>
        <textarea className="cms-textarea" rows={3} value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} placeholder="The answer..." />
      </div>
      {error && <div className="cms-error">{error}</div>}
      <button className="cms-btn-primary" onClick={handleCreate} disabled={saving}>
        {saving ? 'Creating...' : 'Create FAQ'}
      </button>
    </div>
  );
}

function FAQRow({ faq, onDelete, onSaved }: { faq: FAQ; onDelete: (id: string) => void; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ question: faq.question, answer: faq.answer, division: faq.division });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/cms/faqs', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: faq.id, ...form }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? 'Failed'); }
      setEditing(false); onSaved();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this FAQ?')) return;
    setSaving(true);
    try {
      await fetch(`/api/cms/faqs?id=${faq.id}`, { method: 'DELETE' });
      onDelete(faq.id);
    } catch { setError('Failed to delete'); }
    finally { setSaving(false); }
  };

  const color = DIVISION_COLORS[faq.division] ?? '#6B7B9E';

  return (
    <div className="cms-faq-row">
      <div className="cms-faq-header">
        <span className="cms-faq-drag" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="7" r="1"/><circle cx="15" cy="7" r="1"/>
            <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>
            <circle cx="9" cy="17" r="1"/><circle cx="15" cy="17" r="1"/>
          </svg>
        </span>
        <div className="cms-faq-question">{faq.question}</div>
        <span className="cms-div-badge">
          <span className="cms-div-dot" style={{ background: color }} />
          {faq.division}
        </span>
        <div className="cms-faq-actions">
          <button className="cms-action-btn" onClick={() => setEditing((v) => !v)}>
            {editing ? 'Collapse' : 'Edit'}
          </button>
          <button className="cms-action-btn danger" onClick={handleDelete} disabled={saving}>
            Delete
          </button>
        </div>
      </div>

      {editing && (
        <div className="cms-faq-edit">
          <div className="cms-field">
            <label className="cms-label">Division</label>
            <select className="cms-select" value={form.division} onChange={(e) => setForm((f) => ({ ...f, division: e.target.value }))}>
              {DIVISION_TABS.filter((d) => d.value !== 'all').map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
          <div className="cms-field">
            <label className="cms-label">Question</label>
            <input className="cms-input" value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} />
          </div>
          <div className="cms-field">
            <label className="cms-label">Answer</label>
            <textarea className="cms-textarea" rows={4} value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} />
          </div>
          {error && <div className="cms-error">{error}</div>}
          <div className="cms-edit-actions">
            <button className="cms-btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button className="cms-btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CMSFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [division, setDivision] = useState('all');
  const [showCreate, setShowCreate] = useState(false);

  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    try {
      const params = division !== 'all' ? `?division=${division}` : '';
      const res = await fetch(`/api/cms/faqs${params}`);
      const json = await res.json();
      setFaqs(json.faqs ?? []);
    } finally {
      setLoading(false);
    }
  }, [division]);

  useEffect(() => { fetchFAQs(); }, [fetchFAQs]);

  const handleDelete = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="cms-faqs">
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
        <button className="cms-btn-primary" onClick={() => setShowCreate((v) => !v)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New FAQ
        </button>
      </div>

      {showCreate && (
        <CreateFAQForm onCreated={() => { setShowCreate(false); fetchFAQs(); }} />
      )}

      {loading ? (
        <div className="cms-empty">Loading FAQs...</div>
      ) : faqs.length === 0 ? (
        <div className="cms-empty">No FAQs found. Create your first FAQ.</div>
      ) : (
        <div className="cms-faq-list">
          {faqs.map((faq) => (
            <FAQRow
              key={faq.id}
              faq={faq}
              onDelete={handleDelete}
              onSaved={fetchFAQs}
            />
          ))}
        </div>
      )}
    </div>
  );
}
