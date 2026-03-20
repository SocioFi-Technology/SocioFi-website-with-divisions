'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MOCK_CONTACTS } from '@/lib/admin/mock-data';
import {
  MOCK_VENTURES_APPS,
  type VenturesApp,
  type VenturesAppStatus,
  type VenturesScore,
} from '../page';

/* ─────────────────────────────────────────
   Styles
───────────────────────────────────────── */
const STYLES = `
  /* ── Layout ── */
  .vdet-layout {
    display: grid;
    grid-template-columns: 55fr 45fr;
    gap: 28px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .vdet-layout { grid-template-columns: 1fr; }
  }

  /* ── Left col ── */
  .vdet-back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    color: #6B7B9E;
    text-decoration: none;
    margin-bottom: 22px;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.15s;
  }
  .vdet-back-link:hover { color: #E2E8F0; }

  .vdet-startup-name {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 30px;
    color: #E2E8F0;
    letter-spacing: -0.03em;
    margin-bottom: 10px;
    line-height: 1.1;
  }

  .vdet-badges-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .vdet-stage-badge {
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 11.5px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    background: rgba(107,163,232,0.12);
    color: #6BA3E8;
    text-transform: capitalize;
  }
  .vdet-sector-badge {
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 11.5px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    background: rgba(89,163,146,0.1);
    color: #59A392;
  }

  .vdet-ask {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 22px;
    color: #6BA3E8;
    letter-spacing: -0.02em;
    margin-bottom: 24px;
  }
  .vdet-ask-label {
    font-size: 11px;
    color: #6B7B9E;
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 5px;
  }

  /* ── Pitch summary ── */
  .vdet-pitch-box {
    background: rgba(107,163,232,0.05);
    border: 1px solid rgba(107,163,232,0.15);
    border-left: 3px solid #6BA3E8;
    border-radius: 12px;
    padding: 18px 20px;
    margin-bottom: 24px;
  }
  .vdet-pitch-label {
    font-size: 10.5px;
    font-weight: 600;
    color: #6BA3E8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 10px;
  }
  .vdet-pitch-text {
    font-size: 14px;
    color: #CBD5E1;
    line-height: 1.7;
    font-family: 'DM Sans', sans-serif;
    font-style: italic;
  }

  /* ── Metrics grid ── */
  .vdet-metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 28px;
  }
  .vdet-metric-card {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 12px;
    padding: 14px 16px;
  }
  .vdet-metric-label {
    font-size: 10.5px;
    font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 6px;
  }
  .vdet-metric-value {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: #E2E8F0;
  }
  .vdet-metric-link {
    font-family: 'Manrope', sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: #6BA3E8;
    text-decoration: none;
  }
  .vdet-metric-link:hover { text-decoration: underline; }
  .vdet-metric-none { color: #4A5578; font-style: italic; font-size: 13px; }

  /* ── Decision section ── */
  .vdet-decision-section {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    padding: 22px;
  }
  .vdet-section-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #E2E8F0;
    margin-bottom: 16px;
  }
  .vdet-field-label {
    font-size: 10.5px;
    font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 8px;
    display: block;
  }
  .vdet-select {
    width: 100%;
    background: rgba(12,12,29,0.8);
    border: 1px solid rgba(89,163,146,0.12);
    border-radius: 10px;
    padding: 10px 13px;
    color: #E2E8F0;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 16px;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .vdet-select:focus {
    outline: none;
    border-color: rgba(107,163,232,0.4);
  }
  .vdet-textarea {
    width: 100%;
    background: rgba(12,12,29,0.8);
    border: 1px solid rgba(89,163,146,0.12);
    border-radius: 10px;
    padding: 10px 13px;
    color: #E2E8F0;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    resize: vertical;
    min-height: 90px;
    margin-bottom: 18px;
    transition: border-color 0.2s;
  }
  .vdet-textarea:focus {
    outline: none;
    border-color: rgba(107,163,232,0.4);
  }
  .vdet-cta-row {
    display: flex;
    gap: 10px;
  }
  .vdet-cta-approve {
    flex: 1;
    padding: 11px 18px;
    background: linear-gradient(135deg, #3A589E, #59A392);
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Manrope', sans-serif;
    transition: opacity 0.15s;
  }
  .vdet-cta-approve:hover { opacity: 0.85; }
  .vdet-cta-decline {
    flex: 1;
    padding: 11px 18px;
    background: transparent;
    border: 1.5px solid rgba(248,113,113,0.3);
    border-radius: 10px;
    color: #F87171;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Manrope', sans-serif;
    transition: all 0.15s;
  }
  .vdet-cta-decline:hover {
    background: rgba(248,113,113,0.08);
    border-color: rgba(248,113,113,0.5);
  }
  .vdet-save-msg {
    font-size: 12px;
    color: #59A392;
    font-family: 'DM Sans', sans-serif;
    text-align: center;
    margin-top: 10px;
    min-height: 18px;
  }

  /* ── Right col ── */
  .vdet-right-sticky {
    position: sticky;
    top: 80px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  /* ── Scorecard ── */
  .vdet-scorecard {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    padding: 22px;
  }

  .vdet-score-row {
    margin-bottom: 20px;
  }
  .vdet-score-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .vdet-score-dim-label {
    font-size: 12.5px;
    font-weight: 600;
    color: #CBD5E1;
    font-family: 'DM Sans', sans-serif;
  }
  .vdet-score-num {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 14px;
  }
  .vdet-score-num.unset { color: #4A5578; }

  /* Range slider */
  .vdet-range {
    width: 100%;
    height: 6px;
    background: rgba(89,163,146,0.1);
    border-radius: 3px;
    appearance: none;
    cursor: pointer;
    outline: none;
  }
  .vdet-range::-webkit-slider-thumb {
    appearance: none;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #6BA3E8;
    border: 2px solid #111128;
    cursor: pointer;
    transition: transform 0.15s;
  }
  .vdet-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
  .vdet-range::-moz-range-thumb {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #6BA3E8;
    border: 2px solid #111128;
    cursor: pointer;
  }

  /* ── Overall Score ── */
  .vdet-overall-card {
    background: rgba(12,12,29,0.7);
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 12px;
    padding: 18px;
    text-align: center;
    margin-top: 4px;
  }
  .vdet-overall-label {
    font-size: 10.5px;
    font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 8px;
  }
  .vdet-overall-value {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 48px;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 6px;
  }
  .vdet-overall-sublabel {
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
  }
  .vdet-overall-value.poor { color: #F87171; }
  .vdet-overall-sublabel.poor { color: #F87171; }
  .vdet-overall-value.average { color: #FBBF24; }
  .vdet-overall-sublabel.average { color: #FBBF24; }
  .vdet-overall-value.good { color: #59A392; }
  .vdet-overall-sublabel.good { color: #59A392; }
  .vdet-overall-value.excellent { color: #4ADE80; }
  .vdet-overall-sublabel.excellent { color: #4ADE80; }
  .vdet-overall-value.none { color: #4A5578; }
  .vdet-overall-sublabel.none { color: #4A5578; }

  /* ── Rubric ── */
  .vdet-rubric {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    overflow: hidden;
  }
  .vdet-rubric-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    color: #E2E8F0;
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 14px;
    transition: background 0.15s;
  }
  .vdet-rubric-toggle:hover { background: rgba(255,255,255,0.02); }
  .vdet-rubric-chevron {
    color: #6B7B9E;
    transition: transform 0.18s;
  }
  .vdet-rubric-chevron.open { transform: rotate(180deg); }
  .vdet-rubric-body {
    border-top: 1px solid rgba(89,163,146,0.08);
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .vdet-rubric-dim {
    font-size: 12px;
    color: #94A3B8;
    font-family: 'DM Sans', sans-serif;
  }
  .vdet-rubric-dim-name {
    font-weight: 700;
    color: #CBD5E1;
    margin-bottom: 4px;
    font-size: 12.5px;
  }
  .vdet-rubric-range {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 4px;
    margin-right: 4px;
  }
  .vdet-rubric-range.low { background: rgba(248,113,113,0.1); color: #F87171; }
  .vdet-rubric-range.mid { background: rgba(251,191,36,0.1); color: #FBBF24; }
  .vdet-rubric-range.high { background: rgba(89,163,146,0.1); color: #59A392; }
  .vdet-rubric-range.top { background: rgba(74,222,128,0.1); color: #4ADE80; }

  /* ── Contact panel ── */
  .vdet-contact-card {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    padding: 18px 20px;
  }
  .vdet-contact-name {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #E2E8F0;
    margin-bottom: 4px;
  }
  .vdet-contact-company {
    font-size: 12.5px;
    color: #6B7B9E;
    margin-bottom: 12px;
    font-family: 'DM Sans', sans-serif;
  }
  .vdet-contact-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: #94A3B8;
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 7px;
  }
  .vdet-contact-row:last-child { margin-bottom: 0; }
  .vdet-contact-link {
    color: #6BA3E8;
    text-decoration: none;
  }
  .vdet-contact-link:hover { text-decoration: underline; }

  /* ── Not found ── */
  .vdet-not-found {
    padding: 60px;
    text-align: center;
    color: #4A5578;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
  }
`;

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function avgScore(scores: VenturesScore): number | null {
  const vals = [scores.team, scores.market, scores.product, scores.traction].filter(
    (v): v is number => v !== null,
  );
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function scoreQuality(avg: number | null): { label: string; cls: string } {
  if (avg === null) return { label: 'Not scored', cls: 'none' };
  if (avg < 5) return { label: 'Poor', cls: 'poor' };
  if (avg < 7) return { label: 'Average', cls: 'average' };
  if (avg < 9) return { label: 'Good', cls: 'good' };
  return { label: 'Excellent', cls: 'excellent' };
}

const STATUS_LABELS: Record<VenturesAppStatus, string> = {
  new: 'New',
  under_review: 'Under Review',
  due_diligence: 'Due Diligence',
  approved: 'Approved',
  declined: 'Declined',
  waitlist: 'Waitlist',
};

const RUBRIC = [
  {
    dim: 'Team Quality',
    key: 'team' as keyof VenturesScore,
    ranges: [
      { range: '0–4', cls: 'low', desc: 'Inexperienced team, missing key roles, no domain expertise.' },
      { range: '5–6', cls: 'mid', desc: 'Some relevant experience. Gaps in leadership or technical skill.' },
      { range: '7–8', cls: 'high', desc: 'Strong domain expertise, complementary skills, track record.' },
      { range: '9–10', cls: 'top', desc: 'Serial founders, deep domain experts, exceptional execution history.' },
    ],
  },
  {
    dim: 'Market Size',
    key: 'market' as keyof VenturesScore,
    ranges: [
      { range: '0–4', cls: 'low', desc: 'Niche or unclear market. TAM <$50M.' },
      { range: '5–6', cls: 'mid', desc: 'Defined market. TAM $50M–$500M, growing moderately.' },
      { range: '7–8', cls: 'high', desc: 'Large, growing market. TAM $500M–$5B.' },
      { range: '9–10', cls: 'top', desc: 'Massive, urgent market. TAM >$5B. Tailwind visible.' },
    ],
  },
  {
    dim: 'Product Differentiation',
    key: 'product' as keyof VenturesScore,
    ranges: [
      { range: '0–4', cls: 'low', desc: 'No clear differentiation. Easily replicated.' },
      { range: '5–6', cls: 'mid', desc: 'Some differentiation. Moat unclear or early-stage.' },
      { range: '7–8', cls: 'high', desc: 'Clear UVP. Defensible through tech, network, or data.' },
      { range: '9–10', cls: 'top', desc: 'Proprietary tech or data advantage. Strong IP or switching costs.' },
    ],
  },
  {
    dim: 'Traction & Validation',
    key: 'traction' as keyof VenturesScore,
    ranges: [
      { range: '0–4', cls: 'low', desc: 'No revenue, no users, no validated demand.' },
      { range: '5–6', cls: 'mid', desc: 'Early pilots or pre-revenue with letters of intent.' },
      { range: '7–8', cls: 'high', desc: 'Paying customers, consistent MRR growth, strong retention.' },
      { range: '9–10', cls: 'top', desc: 'Strong revenue, clear PMF, viral growth or enterprise contracts.' },
    ],
  },
];

/* ─────────────────────────────────────────
   Score slider component
───────────────────────────────────────── */
function ScoreSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  const current = value ?? 5;
  const isUnset = value === null;

  return (
    <div className="vdet-score-row">
      <div className="vdet-score-label-row">
        <span className="vdet-score-dim-label">{label}</span>
        <span className={`vdet-score-num${isUnset ? ' unset' : ''}`}>
          {isUnset ? '—' : `${value}/10`}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={current}
        className="vdet-range"
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} score`}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={current}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function VenturesApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const originalApp = MOCK_VENTURES_APPS.find((a) => a.id === id);

  const [status, setStatus] = useState<VenturesAppStatus>(
    (originalApp?.status as VenturesAppStatus) ?? 'new',
  );
  const [decisionNotes, setDecisionNotes] = useState('');
  const [scores, setScores] = useState<VenturesScore>(
    originalApp?.scores ?? { team: null, market: null, product: null, traction: null },
  );
  const [saveMsg, setSaveMsg] = useState('');
  const [rubricOpen, setRubricOpen] = useState(false);

  if (!originalApp) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="vdet-not-found">
          Application not found.{' '}
          <Link href="/admin/ventures/applications" style={{ color: '#6BA3E8' }}>
            Back to applications
          </Link>
        </div>
      </>
    );
  }

  const contact = MOCK_CONTACTS.find((c) => c.id === originalApp.contact_id);
  const avg = avgScore(scores);
  const { label: qualLabel, cls: qualCls } = scoreQuality(avg);

  const setScore = (key: keyof VenturesScore, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = (newStatus?: VenturesAppStatus) => {
    const s = newStatus ?? status;
    setStatus(s);
    setSaveMsg(`Saved — ${STATUS_LABELS[s]}`);
    setTimeout(() => setSaveMsg(''), 2500);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="vdet-layout">
        {/* ── LEFT COLUMN ── */}
        <div>
          <Link href="/admin/ventures/applications" className="vdet-back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Applications
          </Link>

          <h1 className="vdet-startup-name">{originalApp.startup_name}</h1>

          <div className="vdet-badges-row">
            <span className="vdet-stage-badge">{originalApp.stage}</span>
            <span className="vdet-sector-badge">{originalApp.sector}</span>
          </div>

          <div>
            <div className="vdet-ask-label">Investment Ask</div>
            <div className="vdet-ask">{originalApp.data.ask}</div>
          </div>

          {/* Pitch Summary */}
          <div className="vdet-pitch-box">
            <div className="vdet-pitch-label">Pitch Summary</div>
            <p className="vdet-pitch-text">{originalApp.data.description}</p>
          </div>

          {/* Key Metrics */}
          <div className="vdet-metrics-grid">
            <div className="vdet-metric-card">
              <div className="vdet-metric-label">Monthly Revenue</div>
              <div className="vdet-metric-value">{originalApp.data.monthly_revenue}</div>
            </div>
            <div className="vdet-metric-card">
              <div className="vdet-metric-label">Team Size</div>
              <div className="vdet-metric-value">{originalApp.data.team_size} people</div>
            </div>
            <div className="vdet-metric-card">
              <div className="vdet-metric-label">Funding</div>
              <div className="vdet-metric-value">{originalApp.data.funding}</div>
            </div>
            <div className="vdet-metric-card">
              <div className="vdet-metric-label">Website</div>
              {originalApp.data.website ? (
                <a
                  href={`https://${originalApp.data.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vdet-metric-link"
                >
                  {originalApp.data.website}
                </a>
              ) : (
                <span className="vdet-metric-none">Not provided</span>
              )}
            </div>
          </div>

          {/* Decision Section */}
          <div className="vdet-decision-section">
            <div className="vdet-section-title">Decision</div>

            <label htmlFor="vdet-status-select" className="vdet-field-label">
              Status
            </label>
            <select
              id="vdet-status-select"
              className="vdet-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as VenturesAppStatus)}
              aria-label="Application status"
            >
              {(Object.entries(STATUS_LABELS) as [VenturesAppStatus, string][]).map(
                ([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ),
              )}
            </select>

            <label htmlFor="vdet-notes-textarea" className="vdet-field-label">
              Decision Notes
            </label>
            <textarea
              id="vdet-notes-textarea"
              className="vdet-textarea"
              placeholder="Add internal decision notes, next steps, or feedback..."
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              aria-label="Decision notes"
            />

            <div className="vdet-cta-row">
              <button
                className="vdet-cta-approve"
                onClick={() => handleSave('due_diligence')}
              >
                Approve for Due Diligence
              </button>
              <button
                className="vdet-cta-decline"
                onClick={() => handleSave('declined')}
              >
                Decline
              </button>
            </div>

            {saveMsg && <div className="vdet-save-msg" role="status">{saveMsg}</div>}
          </div>
        </div>

        {/* ── RIGHT COLUMN (sticky) ── */}
        <div className="vdet-right-sticky">
          {/* Scorecard */}
          <div className="vdet-scorecard">
            <div className="vdet-section-title">Scorecard</div>

            {RUBRIC.map(({ dim, key }) => (
              <ScoreSlider
                key={key}
                label={dim}
                value={scores[key]}
                onChange={(v) => setScore(key, v)}
              />
            ))}

            {/* Overall Score */}
            <div className="vdet-overall-card">
              <div className="vdet-overall-label">Overall Score</div>
              <div className={`vdet-overall-value ${qualCls}`}>
                {avg !== null ? avg.toFixed(1) : '—'}
              </div>
              <div className={`vdet-overall-sublabel ${qualCls}`}>{qualLabel}</div>
            </div>
          </div>

          {/* Scoring Rubric (collapsible) */}
          <div className="vdet-rubric">
            <button
              className="vdet-rubric-toggle"
              onClick={() => setRubricOpen((v) => !v)}
              aria-expanded={rubricOpen}
              aria-controls="vdet-rubric-body"
            >
              Scoring Rubric
              <svg
                className={`vdet-rubric-chevron${rubricOpen ? ' open' : ''}`}
                width="14" height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {rubricOpen && (
              <div className="vdet-rubric-body" id="vdet-rubric-body">
                {RUBRIC.map(({ dim, ranges }) => (
                  <div key={dim} className="vdet-rubric-dim">
                    <div className="vdet-rubric-dim-name">{dim}</div>
                    {ranges.map(({ range, cls, desc }) => (
                      <div key={range} style={{ marginBottom: 4, lineHeight: 1.55 }}>
                        <span className={`vdet-rubric-range ${cls}`}>{range}</span>
                        {desc}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="vdet-contact-card">
            <div className="vdet-section-title" style={{ marginBottom: 12 }}>Contact</div>
            {contact ? (
              <>
                <div className="vdet-contact-name">{contact.name ?? 'Unknown'}</div>
                {contact.company && (
                  <div className="vdet-contact-company">{contact.company}</div>
                )}
                <div className="vdet-contact-row">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <a href={`mailto:${contact.email}`} className="vdet-contact-link">
                    {contact.email}
                  </a>
                </div>
                {contact.phone && (
                  <div className="vdet-contact-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.59 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.92-.83a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
                    </svg>
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.role && (
                  <div className="vdet-contact-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                    <span>{contact.role}</span>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: '#4A5578', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                Contact not found.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
