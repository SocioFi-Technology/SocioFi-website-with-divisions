'use client';
import React, { useState, useEffect, useCallback } from 'react';

const STYLES = `
  .cms-pricing { max-width: 1100px; }

  .cms-tabs {
    display: flex; gap: 2px;
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
    margin-bottom: 20px;
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

  .cms-plan-grid {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
  }
  @media (max-width: 900px) { .cms-plan-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 600px) { .cms-plan-grid { grid-template-columns: 1fr; } }

  .cms-plan-card {
    background: #111128; border: 1px solid rgba(89,163,146,0.08);
    border-radius: 14px; padding: 20px; cursor: pointer;
    transition: border-color 0.2s, background 0.2s; position: relative;
  }
  .cms-plan-card:hover { border-color: rgba(89,163,146,0.18); background: #161636; }
  .cms-plan-card.featured { border-color: rgba(89,163,146,0.2); }

  .cms-featured-badge {
    position: absolute; top: 12px; right: 12px;
    padding: 2px 8px; border-radius: 100px;
    background: rgba(89,163,146,0.12); color: #59A392;
    font-size: 10px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace; letter-spacing: 0.06em;
  }

  .cms-plan-name {
    font-family: 'Manrope', sans-serif; font-weight: 700;
    font-size: 15px; color: #E2E8F0; margin-bottom: 4px;
  }
  .cms-plan-tier { font-size: 11px; color: #6B7B9E; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; font-family: 'JetBrains Mono', monospace; }
  .cms-plan-price {
    display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px;
  }
  .cms-plan-amount {
    font-family: 'Manrope', sans-serif; font-weight: 800;
    font-size: 28px; color: #59A392; letter-spacing: -0.03em;
  }
  .cms-plan-period { font-size: 12px; color: #6B7B9E; }
  .cms-plan-tagline { font-size: 12px; color: #6B7B9E; margin-bottom: 12px; }
  .cms-plan-features { font-size: 12px; color: #4A5578; }
  .cms-plan-feature-count {
    display: inline-block;
    padding: 2px 7px; border-radius: 100px;
    background: rgba(89,163,146,0.06); color: #6B7B9E;
    font-size: 11px; font-family: 'JetBrains Mono', monospace;
  }

  .cms-div-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 2px 7px; border-radius: 100px;
    font-size: 10.5px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    background: rgba(89,163,146,0.06); color: #6B7B9E;
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
    width: 480px; max-width: 95vw; background: #111128;
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

  .cms-toggle-row {
    display: flex; align-items: center; gap: 10px;
  }
  .cms-toggle {
    width: 40px; height: 22px; background: rgba(89,163,146,0.1);
    border-radius: 100px; position: relative; cursor: pointer;
    border: none; transition: background 0.2s;
    flex-shrink: 0;
  }
  .cms-toggle.on { background: #59A392; }
  .cms-toggle::after {
    content: ''; position: absolute;
    top: 3px; left: 3px;
    width: 16px; height: 16px; border-radius: 50%;
    background: white; transition: transform 0.2s;
  }
  .cms-toggle.on::after { transform: translateX(18px); }
  .cms-toggle-label { font-size: 13px; color: #CBD5E1; }

  .cms-hint { font-size: 11px; color: #6B7B9E; margin-top: 4px; }

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
  services: '#4DBFA8', studio: '#72C4B2', academy: '#E8B84D', cloud: '#5BB5E0',
};

const DIVISION_TABS = [
  { value: 'all', label: 'All' },
  { value: 'services', label: 'Services' },
  { value: 'studio', label: 'Studio' },
  { value: 'academy', label: 'Academy' },
  { value: 'cloud', label: 'Cloud' },
];

const BILLING_PERIODS = ['monthly', 'one-time', 'per-test', 'quarterly', 'annually'];
const TIERS = ['starter', 'basic', 'pro', 'enterprise', 'custom'];

type PricingPlan = {
  id: string;
  name: string;
  division: string;
  tier: string;
  price: number;
  billing_period: string;
  tagline: string;
  features: string[];
  is_featured: boolean;
};

const emptyForm = (): Partial<PricingPlan> => ({
  name: '', division: 'services', tier: 'basic',
  price: 0, billing_period: 'monthly', tagline: '',
  features: [], is_featured: false,
});

function PricingPanel({
  plan,
  onClose,
  onSaved,
}: {
  plan: Partial<PricingPlan> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !plan?.id;
  const [form, setForm] = useState<Partial<PricingPlan>>(plan ?? emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof PricingPlan, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name?.trim()) { setError('Name is required.'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        features: typeof form.features === 'string'
          ? (form.features as string).split('\n').map((s: string) => s.trim()).filter(Boolean)
          : form.features ?? [],
      };
      const url = '/api/cms/pricing';
      const method = isNew ? 'POST' : 'PUT';
      const body = isNew ? payload : { id: plan?.id, ...payload };
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
    if (!plan?.id || !confirm('Delete this pricing plan?')) return;
    setSaving(true);
    try {
      await fetch(`/api/cms/pricing?id=${plan.id}`, { method: 'DELETE' });
      onSaved();
    } catch { setError('Failed to delete'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div className="cms-panel-overlay" onClick={onClose} />
      <div className={`cms-side-panel${saving ? ' cms-saving' : ''}`}>
        <div className="cms-sp-head">
          <div className="cms-sp-title">{isNew ? 'New Pricing Plan' : 'Edit Pricing Plan'}</div>
          <button className="cms-sp-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="cms-sp-body">
          <div className="cms-field">
            <label className="cms-label">Plan Name</label>
            <input className="cms-input" value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Professional" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="cms-field">
              <label className="cms-label">Division</label>
              <select className="cms-select" value={form.division ?? 'services'} onChange={(e) => set('division', e.target.value)}>
                {DIVISION_TABS.filter((d) => d.value !== 'all').map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div className="cms-field">
              <label className="cms-label">Tier</label>
              <select className="cms-select" value={form.tier ?? 'basic'} onChange={(e) => set('tier', e.target.value)}>
                {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="cms-field">
              <label className="cms-label">Price (USD)</label>
              <input className="cms-input" type="number" min={0} value={form.price ?? 0} onChange={(e) => set('price', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="cms-field">
              <label className="cms-label">Billing Period</label>
              <select className="cms-select" value={form.billing_period ?? 'monthly'} onChange={(e) => set('billing_period', e.target.value)}>
                {BILLING_PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="cms-field">
            <label className="cms-label">Tagline</label>
            <input className="cms-input" value={form.tagline ?? ''} onChange={(e) => set('tagline', e.target.value)} placeholder="Short description..." />
          </div>
          <div className="cms-field">
            <label className="cms-label">Features (one per line)</label>
            <textarea
              className="cms-textarea"
              rows={6}
              value={Array.isArray(form.features) ? form.features.join('\n') : (form.features ?? '')}
              onChange={(e) => set('features', e.target.value)}
              placeholder="Up to 5 team members&#10;Priority support&#10;Custom domain"
            />
          </div>
          <div className="cms-field">
            <label className="cms-label">Featured Plan</label>
            <div className="cms-toggle-row">
              <button
                className={`cms-toggle${form.is_featured ? ' on' : ''}`}
                onClick={() => set('is_featured', !form.is_featured)}
                type="button"
                aria-pressed={!!form.is_featured}
                aria-label="Toggle featured"
              />
              <span className="cms-toggle-label">{form.is_featured ? 'Featured (highlighted)' : 'Not featured'}</span>
            </div>
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

export default function CMSPricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [division, setDivision] = useState('all');
  const [panelPlan, setPanelPlan] = useState<Partial<PricingPlan> | undefined>(undefined);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const params = division !== 'all' ? `?division=${division}` : '';
      const res = await fetch(`/api/cms/pricing${params}`);
      const json = await res.json();
      setPlans(json.plans ?? []);
    } finally {
      setLoading(false);
    }
  }, [division]);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  return (
    <div className="cms-pricing">
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
        <button className="cms-btn-primary" onClick={() => setPanelPlan(emptyForm())}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Plan
        </button>
      </div>

      <div className="cms-plan-grid">
        {loading ? (
          <div className="cms-empty">Loading pricing plans...</div>
        ) : plans.length === 0 ? (
          <div className="cms-empty">No pricing plans found.</div>
        ) : plans.map((plan) => {
          const color = DIVISION_COLORS[plan.division] ?? '#6B7B9E';
          return (
            <div
              key={plan.id}
              className={`cms-plan-card${plan.is_featured ? ' featured' : ''}`}
              onClick={() => setPanelPlan(plan)}
            >
              {plan.is_featured && <span className="cms-featured-badge">Featured</span>}
              <div className="cms-plan-name">{plan.name}</div>
              <div className="cms-plan-tier">{plan.tier}</div>
              <div className="cms-plan-price">
                <span className="cms-plan-amount">
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                </span>
                {plan.price > 0 && <span className="cms-plan-period">/{plan.billing_period}</span>}
              </div>
              {plan.tagline && <div className="cms-plan-tagline">{plan.tagline}</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <span className="cms-div-badge">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {plan.division}
                </span>
                {Array.isArray(plan.features) && plan.features.length > 0 && (
                  <span className="cms-plan-feature-count">{plan.features.length} features</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {panelPlan !== undefined && (
        <PricingPanel
          plan={panelPlan}
          onClose={() => setPanelPlan(undefined)}
          onSaved={() => { setPanelPlan(undefined); fetchPlans(); }}
        />
      )}
    </div>
  );
}
