'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { MOCK_VENTURES_APPLICATIONS } from '@/lib/admin/mock-data';
import {
  APPLICATION_STATUS_COLORS,
  VALIDATION_COLORS,
  COMMITMENT_LABELS,
  PARTNERSHIP_LABELS,
  type ApplicationStatus,
  type ValidationStatus,
  type CommitmentLevel,
  type PartnershipModel,
  type ReviewDecision,
  type ApplicationScores,
  type ApplicationScoreNotes,
} from '@/lib/admin/types';

/* ─────────────────────────────────────────
   Styles
───────────────────────────────────────── */
const STYLES = `
  /* ── Layout ── */
  .vd-layout {
    display: grid;
    grid-template-columns: 60fr 40fr;
    gap: 28px;
    align-items: start;
  }
  @media (max-width: 960px) {
    .vd-layout { grid-template-columns: 1fr; }
  }

  /* ── Back link ── */
  .vd-back {
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
  .vd-back:hover { color: #E2E8F0; }

  /* ── App header ── */
  .vd-app-id-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .vd-id-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 6px;
    background: rgba(58,88,158,0.15);
    color: #6BA3E8;
    letter-spacing: 0.04em;
  }
  .vd-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 11.5px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }
  .vd-founder-name {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 28px;
    color: #E2E8F0;
    letter-spacing: -0.03em;
    margin-bottom: 6px;
    line-height: 1.1;
  }
  .vd-founder-email {
    font-size: 13.5px;
    color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 14px;
  }
  .vd-meta-row {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }
  .vd-meta-item {
    font-size: 12px;
    color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .vd-meta-item strong {
    color: #94A3B8;
    font-weight: 600;
  }
  .vd-meta-due-urgent { color: #EF4444; }
  .vd-meta-due-urgent strong { color: #EF4444; }

  /* ── Step cards ── */
  .vd-step-card {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .vd-step-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 22px 14px;
    border-bottom: 1px solid rgba(89,163,146,0.07);
  }
  .vd-step-number {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }
  .vd-step-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 14.5px;
    color: #E2E8F0;
  }
  .vd-step-body { padding: 20px 22px 22px; }

  /* ── Field layout within steps ── */
  .vd-field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 18px;
  }
  @media (max-width: 600px) {
    .vd-field-grid { grid-template-columns: 1fr; }
  }
  .vd-field-label {
    font-size: 10.5px;
    font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 5px;
    display: block;
  }
  .vd-field-value {
    font-size: 13.5px;
    color: #CBD5E1;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.55;
  }
  .vd-field-link {
    color: #6BA3E8;
    text-decoration: none;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .vd-field-link:hover { text-decoration: underline; }
  .vd-subsection-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 13px;
    color: #94A3B8;
    margin-bottom: 8px;
    margin-top: 16px;
  }
  .vd-subsection-title:first-child { margin-top: 0; }
  .vd-paragraph {
    font-size: 13.5px;
    color: #CBD5E1;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.7;
    margin-bottom: 14px;
  }
  .vd-paragraph:last-child { margin-bottom: 0; }

  /* ── Commitment / partnership pill ── */
  .vd-pill {
    display: inline-flex;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }

  /* ── Validation block ── */
  .vd-validation-block {
    margin-bottom: 16px;
  }
  .vd-validation-badge-large {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 16px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'Manrope', sans-serif;
    margin-bottom: 10px;
  }
  .vd-validation-badge-large::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
    filter: brightness(1.3);
  }

  /* ── Attachments ── */
  .vd-attachment-list { display: flex; flex-direction: column; gap: 10px; }
  .vd-attachment-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: rgba(12,12,29,0.5);
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 10px;
    padding: 10px 14px;
  }
  .vd-attachment-info { display: flex; align-items: center; gap: 10px; }
  .vd-attachment-type-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 5px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
  .vd-attachment-name {
    font-size: 13px;
    color: #CBD5E1;
    font-family: 'DM Sans', sans-serif;
  }
  .vd-attachment-size {
    font-size: 11px;
    color: #4A5578;
    font-family: 'JetBrains Mono', monospace;
  }
  .vd-download-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 8px;
    border: 1px solid rgba(89,163,146,0.15);
    background: transparent;
    color: #72C4B2;
    font-size: 11.5px;
    font-weight: 600;
    font-family: 'Manrope', sans-serif;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .vd-download-btn:hover {
    background: rgba(89,163,146,0.08);
    border-color: rgba(89,163,146,0.3);
  }

  /* ── Right panel ── */
  .vd-right-sticky {
    position: sticky;
    top: 20px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
    scrollbar-width: thin;
    scrollbar-color: rgba(89,163,146,0.15) transparent;
  }
  .vd-right-sticky::-webkit-scrollbar { width: 5px; }
  .vd-right-sticky::-webkit-scrollbar-thumb { background: rgba(89,163,146,0.15); border-radius: 3px; }

  /* ── Scoring panel ── */
  .vd-scoring-panel {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    padding: 22px;
  }
  .vd-panel-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #E2E8F0;
    margin-bottom: 6px;
  }
  .vd-panel-note {
    font-size: 11.5px;
    color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 20px;
  }

  /* ── Criterion block ── */
  .vd-criterion-block { margin-bottom: 20px; }
  .vd-criterion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
  }
  .vd-criterion-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .vd-criterion-name {
    font-size: 12.5px;
    font-weight: 600;
    color: #CBD5E1;
    font-family: 'DM Sans', sans-serif;
  }
  .vd-weight-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 5px;
    background: rgba(58,88,158,0.15);
    color: #6BA3E8;
    letter-spacing: 0.03em;
  }
  .vd-score-display {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 15px;
  }
  .vd-range {
    width: 100%;
    height: 6px;
    background: rgba(89,163,146,0.1);
    border-radius: 3px;
    appearance: none;
    cursor: pointer;
    outline: none;
    margin-bottom: 8px;
    display: block;
  }
  .vd-range::-webkit-slider-thumb {
    appearance: none;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #6BA3E8;
    border: 2px solid #111128;
    cursor: pointer;
    transition: transform 0.15s;
  }
  .vd-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
  .vd-range::-moz-range-thumb {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #6BA3E8;
    border: 2px solid #111128;
    cursor: pointer;
  }
  .vd-notes-input {
    width: 100%;
    box-sizing: border-box;
    background: rgba(12,12,29,0.6);
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 8px;
    padding: 8px 11px;
    color: #94A3B8;
    font-size: 11.5px;
    font-family: 'DM Sans', sans-serif;
    resize: vertical;
    min-height: 52px;
    transition: border-color 0.2s;
  }
  .vd-notes-input::placeholder { color: #4A5578; }
  .vd-notes-input:focus {
    outline: none;
    border-color: rgba(107,163,232,0.3);
    color: #CBD5E1;
  }

  /* ── Weighted score display ── */
  .vd-weighted-card {
    background: rgba(12,12,29,0.7);
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 12px;
    padding: 18px;
    text-align: center;
    margin-top: 4px;
    margin-bottom: 18px;
  }
  .vd-weighted-label {
    font-size: 10px;
    font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 8px;
  }
  .vd-weighted-value {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 44px;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 6px;
  }
  .vd-weighted-rec {
    font-size: 12.5px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.4;
  }

  /* ── Decision panel ── */
  .vd-decision-panel {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 16px;
    padding: 22px;
  }
  .vd-field-label-full {
    font-size: 10.5px;
    font-weight: 600;
    color: #6B7B9E;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 8px;
    display: block;
  }
  .vd-select {
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
  .vd-select:focus {
    outline: none;
    border-color: rgba(107,163,232,0.4);
  }
  .vd-textarea {
    width: 100%;
    box-sizing: border-box;
    background: rgba(12,12,29,0.8);
    border: 1px solid rgba(89,163,146,0.12);
    border-radius: 10px;
    padding: 10px 13px;
    color: #E2E8F0;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    resize: vertical;
    min-height: 90px;
    margin-bottom: 16px;
    transition: border-color 0.2s;
  }
  .vd-textarea:focus {
    outline: none;
    border-color: rgba(107,163,232,0.4);
  }
  .vd-input {
    width: 100%;
    box-sizing: border-box;
    background: rgba(12,12,29,0.8);
    border: 1px solid rgba(89,163,146,0.12);
    border-radius: 10px;
    padding: 10px 13px;
    color: #E2E8F0;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 14px;
    transition: border-color 0.2s;
  }
  .vd-input:focus {
    outline: none;
    border-color: rgba(107,163,232,0.4);
  }
  .vd-input-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .vd-input-group { margin-bottom: 0; }
  .vd-deal-section {
    background: rgba(74,222,128,0.04);
    border: 1px solid rgba(74,222,128,0.12);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
  }
  .vd-deal-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 13px;
    color: #4ade80;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .vd-save-btn {
    width: 100%;
    padding: 13px 18px;
    background: linear-gradient(135deg, #3A589E, #59A392);
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Manrope', sans-serif;
    transition: opacity 0.15s, transform 0.15s;
    margin-top: 4px;
  }
  .vd-save-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .vd-save-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .vd-save-msg {
    font-size: 12.5px;
    color: #59A392;
    font-family: 'DM Sans', sans-serif;
    text-align: center;
    margin-top: 10px;
    min-height: 18px;
  }

  /* ── Decision recorded banner ── */
  .vd-decision-recorded {
    background: rgba(74,222,128,0.05);
    border: 1px solid rgba(74,222,128,0.15);
    border-radius: 14px;
    padding: 18px 20px;
    margin-bottom: 18px;
  }
  .vd-decision-recorded.rejected-bg {
    background: rgba(239,68,68,0.05);
    border-color: rgba(239,68,68,0.15);
  }
  .vd-decision-recorded.waitlist-bg {
    background: rgba(232,184,77,0.05);
    border-color: rgba(232,184,77,0.15);
  }
  .vd-decision-recorded.interview-bg {
    background: rgba(107,163,232,0.05);
    border-color: rgba(107,163,232,0.15);
  }
  .vd-decision-recorded-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 13.5px;
    color: #E2E8F0;
    margin-bottom: 8px;
  }
  .vd-decision-meta {
    font-size: 12px;
    color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.6;
  }

  /* ── HERALD email draft ── */
  .vd-herald-panel {
    background: #111128;
    border: 1px solid rgba(107,163,232,0.12);
    border-radius: 16px;
    overflow: hidden;
  }
  .vd-herald-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(107,163,232,0.1);
    background: rgba(107,163,232,0.05);
  }
  .vd-herald-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    color: #6BA3E8;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .vd-herald-subtitle {
    font-size: 11.5px;
    color: #4A5578;
    font-family: 'DM Sans', sans-serif;
    margin-top: 2px;
  }
  .vd-email-draft {
    margin: 0;
    padding: 16px 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #94A3B8;
    line-height: 1.75;
    white-space: pre-wrap;
    background: transparent;
    border: none;
    overflow: auto;
    max-height: 280px;
  }
  .vd-herald-actions {
    display: flex;
    gap: 10px;
    padding: 14px 20px;
    border-top: 1px solid rgba(107,163,232,0.08);
  }
  .vd-herald-approve-btn {
    flex: 1;
    padding: 9px 14px;
    background: rgba(107,163,232,0.12);
    border: 1px solid rgba(107,163,232,0.3);
    border-radius: 8px;
    color: #6BA3E8;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Manrope', sans-serif;
    transition: all 0.15s;
  }
  .vd-herald-approve-btn:hover {
    background: rgba(107,163,232,0.2);
    border-color: rgba(107,163,232,0.5);
  }
  .vd-herald-edit-btn {
    flex: 1;
    padding: 9px 14px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 8px;
    color: #6B7B9E;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Manrope', sans-serif;
    transition: all 0.15s;
  }
  .vd-herald-edit-btn:hover { color: #E2E8F0; border-color: rgba(255,255,255,0.15); }

  /* ── Not found ── */
  .vd-not-found {
    padding: 60px;
    text-align: center;
    color: #4A5578;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
  }

  /* ── Divider ── */
  .vd-divider {
    height: 1px;
    background: rgba(89,163,146,0.07);
    margin: 16px 0;
  }
`;

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function fmtRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) {
    const hrs = Math.floor(diff / 3_600_000);
    return hrs < 1 ? 'just now' : `${hrs}h ago`;
  }
  return `${days}d ago`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtCountdown(iso: string): { text: string; urgent: boolean } {
  const diff = new Date(iso).getTime() - Date.now();
  const urgent = diff < 86_400_000;
  if (diff <= 0) return { text: 'Overdue', urgent: true };
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return { text: `${hours}h remaining`, urgent: true };
  const days = Math.floor(hours / 24);
  const remH = hours % 24;
  return { text: `${days}d ${remH}h remaining`, urgent };
}

function fmtBytes(b: number): string {
  if (b < 1024) return `${b}B`;
  if (b < 1_048_576) return `${(b / 1024).toFixed(0)}KB`;
  return `${(b / 1_048_576).toFixed(1)}MB`;
}

function statusLabel(s: ApplicationStatus): string {
  const m: Record<ApplicationStatus, string> = {
    pending: 'Pending', interview: 'Interview', accepted: 'Accepted',
    rejected: 'Rejected', waitlisted: 'Waitlisted',
  };
  return m[s];
}

function validationLabel(v: ValidationStatus): string {
  const m: Record<ValidationStatus, string> = {
    paying: 'Paying Customers', waitlist: 'Waitlist', conversations: 'Conversations Only', none: 'No Validation',
  };
  return m[v];
}

type CriterionKey = keyof ApplicationScores;

const CRITERIA: { key: CriterionKey; label: string; weight: number }[] = [
  { key: 'founder_market_fit',    label: 'Founder-Market Fit',     weight: 25 },
  { key: 'demand_validation',     label: 'Demand Validation',       weight: 25 },
  { key: 'revenue_model_clarity', label: 'Revenue Model Clarity',   weight: 20 },
  { key: 'technical_feasibility', label: 'Technical Feasibility',   weight: 15 },
  { key: 'founder_commitment',    label: 'Founder Commitment',      weight: 15 },
];

function calcWeightedScore(scores: Partial<ApplicationScores>): number | null {
  let total = 0;
  let weightSum = 0;
  for (const c of CRITERIA) {
    const v = scores[c.key];
    if (v !== undefined && v !== null) {
      total += v * c.weight;
      weightSum += c.weight;
    }
  }
  if (weightSum === 0) return null;
  return +(total / weightSum).toFixed(2);
}

function scoreColor(s: number | null): string {
  if (s === null) return '#4A5578';
  if (s >= 4.0) return '#4ade80';
  if (s >= 3.5) return '#72C4B2';
  if (s >= 3.0) return '#E8B84D';
  return '#EF4444';
}

function scoreRec(s: number | null): string {
  if (s === null) return 'Score all criteria to see recommendation.';
  if (s >= 4.0) return 'Strong candidate — recommend interview.';
  if (s >= 3.5) return 'Borderline — interview if capacity allows.';
  if (s >= 3.0) return 'Below threshold — recommend rejection with feedback.';
  return 'Clear reject — provide constructive feedback.';
}

function attachmentTypeStyle(t: string): { bg: string; color: string } {
  switch (t) {
    case 'pitch_deck':     return { bg: 'rgba(107,163,232,0.12)', color: '#6BA3E8' };
    case 'financial_model': return { bg: 'rgba(74,222,128,0.1)', color: '#4ade80' };
    case 'prototype':      return { bg: 'rgba(123,111,232,0.12)', color: '#A78BFA' };
    default:               return { bg: 'rgba(89,163,146,0.1)', color: '#72C4B2' };
  }
}

function generateRejectionEmail(
  founderName: string,
  productName: string,
  reason: string,
  scoreNotes: ApplicationScoreNotes | undefined,
): string {
  const firstName = founderName.split(' ')[0];
  const notes = scoreNotes ?? {};
  const feedbackLines = CRITERIA
    .map(c => notes[c.key] ? `- ${c.label}: ${notes[c.key]}` : null)
    .filter(Boolean)
    .join('\n');

  return `Subject: Your SocioFi Ventures Application — ${productName}

Dear ${firstName},

Thank you for applying to the SocioFi Ventures program. We reviewed your application for ${productName} carefully and appreciate the time and thought you put into it.

After deliberation, we've decided not to move forward with this application at this time.

Our feedback:

${reason}

${feedbackLines ? `Reviewer notes:\n${feedbackLines}\n` : ''}
This decision reflects the current stage of your venture and our specific portfolio focus — not a judgment on the merit of your idea or your ability as a founder.

We encourage you to continue building. The most common reason we pass at this stage is insufficient market validation. If you reach 20+ paying customers and are ready to go full-time, we'd welcome a reapplication.

Wishing you every success with ${productName}.

Warm regards,
The SocioFi Ventures Team
ventures@sociofi.co`;
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function VenturesApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const app = MOCK_VENTURES_APPLICATIONS.find(a => a.id === id);

  // ── Scoring state ──
  const defaultScores: Partial<ApplicationScores> = app?.scores
    ? { ...app.scores }
    : { founder_market_fit: 3.0, demand_validation: 3.0, revenue_model_clarity: 3.0, technical_feasibility: 3.0, founder_commitment: 3.0 };

  const defaultNotes: Partial<ApplicationScoreNotes> = app?.score_notes ? { ...app.score_notes } : {};

  const [scores, setScores] = useState<Partial<ApplicationScores>>(defaultScores);
  const [scoreNotes, setScoreNotes] = useState<Partial<ApplicationScoreNotes>>(defaultNotes);

  // ── Decision state ──
  const [decision, setDecision] = useState<ReviewDecision | ''>((app?.decision as ReviewDecision) ?? '');
  const [decisionReason, setDecisionReason] = useState(app?.decision_reason ?? '');

  // ── Deal terms state ──
  const [dealModel, setDealModel] = useState<PartnershipModel>(app?.deal_model ?? 'equity');
  const [equityPercent, setEquityPercent] = useState(app?.equity_percent?.toString() ?? '');
  const [vestingSchedule, setVestingSchedule] = useState(app?.vesting_schedule ?? '');
  const [revSharePercent, setRevSharePercent] = useState(app?.revenue_share_percent?.toString() ?? '');
  const [revShareCap, setRevShareCap] = useState(app?.revenue_share_cap ?? '');
  const [revShareDuration, setRevShareDuration] = useState(app?.revenue_share_duration ?? '');
  const [upfrontAmount, setUpfrontAmount] = useState(app?.upfront_amount?.toString() ?? '');

  // ── Save / UI state ──
  const [savedDecision, setSavedDecision] = useState<ReviewDecision | undefined>(app?.decision as ReviewDecision | undefined);
  const [saveMsg, setSaveMsg] = useState('');
  const [heraldVisible, setHeraldVisible] = useState(!!app?.rejection_email_id);

  if (!app) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="vd-not-found">
          Application not found.{' '}
          <Link href="/admin/ventures/applications" style={{ color: '#6BA3E8' }}>
            Back to applications
          </Link>
        </div>
      </>
    );
  }

  const weightedScore = calcWeightedScore(scores);
  const { text: dueText, urgent: dueUrgent } = fmtCountdown(app.decision_due);
  const statusColor = APPLICATION_STATUS_COLORS[app.status];
  const valColor = VALIDATION_COLORS[app.validation_status];

  const setScore = (key: CriterionKey, val: number) => {
    setScores(prev => ({ ...prev, [key]: val }));
  };
  const setNote = (key: keyof ApplicationScoreNotes, val: string) => {
    setScoreNotes(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    if (!decision) return;
    setSavedDecision(decision as ReviewDecision);
    if (decision === 'reject' || decision === 'waitlist') {
      setHeraldVisible(decision === 'reject');
    }
    setSaveMsg('Decision saved successfully.');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const requiresReason = decision === 'reject' || decision === 'waitlist';
  const showDealTerms = decision === 'accept';
  const decisionAlreadyRecorded = !!savedDecision;

  const rejectionEmailBody = generateRejectionEmail(
    app.founder_name,
    app.product_name,
    decisionReason || 'Application did not meet current program criteria.',
    scoreNotes,
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="vd-layout">
        {/* ══════════════════════════════════════
            LEFT COLUMN — Application Content
        ══════════════════════════════════════ */}
        <div>
          {/* Back link */}
          <Link href="/admin/ventures/applications" className="vd-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            All Applications
          </Link>

          {/* App ID + Status */}
          <div className="vd-app-id-row">
            <span className="vd-id-badge">{app.id}</span>
            <span
              className="vd-status-badge"
              style={{
                background: `${statusColor}18`,
                color: statusColor,
                border: `1px solid ${statusColor}30`,
              }}
            >
              {statusLabel(app.status)}
            </span>
          </div>

          {/* Founder header */}
          <h1 className="vd-founder-name">{app.founder_name}</h1>
          <div className="vd-founder-email">
            <a href={`mailto:${app.founder_email}`} style={{ color: '#6B7B9E', textDecoration: 'none' }}>
              {app.founder_email}
            </a>
          </div>

          {/* Meta row */}
          <div className="vd-meta-row">
            <span className="vd-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Applied <strong>{fmtRelative(app.submitted_at)}</strong>
            </span>
            <span className={`vd-meta-item${dueUrgent ? ' vd-meta-due-urgent' : ''}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Decision due <strong>{fmtDate(app.decision_due)}</strong> &bull; {dueText}
            </span>
          </div>

          {/* ─── STEP 1: Founder Profile ─── */}
          <div className="vd-step-card" style={{ borderTopColor: '#6BA3E8' }}>
            <div className="vd-step-card-header" style={{ borderTopWidth: 3, borderTopStyle: 'solid', borderTopColor: '#6BA3E8' }}>
              <div className="vd-step-number" style={{ background: '#6BA3E8' }}>1</div>
              <div className="vd-step-title">Founder Profile</div>
            </div>
            <div className="vd-step-body">
              <div className="vd-field-grid">
                <div>
                  <span className="vd-field-label">Full Name</span>
                  <div className="vd-field-value">{app.founder_name}</div>
                </div>
                <div>
                  <span className="vd-field-label">Email</span>
                  <a href={`mailto:${app.founder_email}`} className="vd-field-link">
                    {app.founder_email}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
                <div>
                  <span className="vd-field-label">LinkedIn</span>
                  <a href={app.founder_linkedin} target="_blank" rel="noopener noreferrer" className="vd-field-link">
                    View Profile
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
                <div>
                  <span className="vd-field-label">Commitment</span>
                  <div>
                    <span
                      className="vd-pill"
                      style={{
                        background: app.founder_commitment === 'full_time' ? 'rgba(74,222,128,0.1)' : 'rgba(232,184,77,0.1)',
                        color: app.founder_commitment === 'full_time' ? '#4ade80' : '#E8B84D',
                      }}
                    >
                      {COMMITMENT_LABELS[app.founder_commitment as CommitmentLevel]}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <span className="vd-field-label">Bio</span>
                <p className="vd-paragraph">{app.founder_bio}</p>
              </div>
            </div>
          </div>

          {/* ─── STEP 2: Product ─── */}
          <div className="vd-step-card" style={{ borderTopColor: '#72C4B2' }}>
            <div className="vd-step-card-header" style={{ borderTopWidth: 3, borderTopStyle: 'solid', borderTopColor: '#72C4B2' }}>
              <div className="vd-step-number" style={{ background: '#72C4B2' }}>2</div>
              <div className="vd-step-title">Product</div>
            </div>
            <div className="vd-step-body">
              <div style={{ marginBottom: 18 }}>
                <span className="vd-field-label">Product Name</span>
                <div className="vd-field-value" style={{ fontWeight: 700, fontSize: 16, color: '#E2E8F0', fontFamily: "'Manrope', sans-serif" }}>
                  {app.product_name}
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <span className="vd-field-label">Description</span>
                <p className="vd-paragraph">{app.product_description}</p>
              </div>

              <div className="vd-divider" />

              <div className="vd-subsection-title">The Problem</div>
              <p className="vd-paragraph">{app.problem_statement}</p>

              <div className="vd-subsection-title">Target Customer</div>
              <p className="vd-paragraph">{app.target_customer}</p>

              <div className="vd-subsection-title">Revenue Model</div>
              <p className="vd-paragraph">{app.revenue_model}</p>

              <div className="vd-divider" />

              <div className="vd-subsection-title">Validation Status</div>
              <div className="vd-validation-block">
                <div>
                  <span
                    className="vd-validation-badge-large"
                    style={{ background: `${valColor}18`, color: valColor }}
                  >
                    {validationLabel(app.validation_status)}
                  </span>
                </div>
                <p className="vd-paragraph">{app.validation_details}</p>
              </div>
            </div>
          </div>

          {/* ─── STEP 3: Partnership ─── */}
          <div className="vd-step-card" style={{ borderTopColor: '#A78BFA' }}>
            <div className="vd-step-card-header" style={{ borderTopWidth: 3, borderTopStyle: 'solid', borderTopColor: '#A78BFA' }}>
              <div className="vd-step-number" style={{ background: '#A78BFA' }}>3</div>
              <div className="vd-step-title">Partnership</div>
            </div>
            <div className="vd-step-body">
              <div className="vd-subsection-title">Prior Funding Attempts</div>
              <p className="vd-paragraph">{app.prior_attempts}</p>

              <div className="vd-subsection-title">Preferred Partnership Model</div>
              <div style={{ marginBottom: 16 }}>
                <span
                  className="vd-pill"
                  style={{ background: 'rgba(107,163,232,0.1)', color: '#6BA3E8' }}
                >
                  {PARTNERSHIP_LABELS[app.preferred_model as PartnershipModel]}
                </span>
              </div>

              <div className="vd-subsection-title">Growth Plan</div>
              <p className="vd-paragraph">{app.growth_plan}</p>
            </div>
          </div>

          {/* ─── STEP 4: Additional Context ─── */}
          <div className="vd-step-card" style={{ borderTopColor: '#E8B84D' }}>
            <div className="vd-step-card-header" style={{ borderTopWidth: 3, borderTopStyle: 'solid', borderTopColor: '#E8B84D' }}>
              <div className="vd-step-number" style={{ background: '#E8B84D' }}>4</div>
              <div className="vd-step-title">Additional Context</div>
            </div>
            <div className="vd-step-body">
              {app.additional_context ? (
                <p className="vd-paragraph">{app.additional_context}</p>
              ) : (
                <p className="vd-paragraph" style={{ color: '#4A5578', fontStyle: 'italic' }}>No additional context provided.</p>
              )}

              {app.attachments.length > 0 && (
                <>
                  <div className="vd-divider" />
                  <div className="vd-subsection-title" style={{ marginBottom: 12 }}>Attachments</div>
                  <div className="vd-attachment-list">
                    {app.attachments.map(att => {
                      const ts = attachmentTypeStyle(att.type);
                      return (
                        <div key={att.id} className="vd-attachment-row">
                          <div className="vd-attachment-info">
                            <span
                              className="vd-attachment-type-badge"
                              style={{ background: ts.bg, color: ts.color }}
                            >
                              {att.type.replace('_', ' ')}
                            </span>
                            <div>
                              <div className="vd-attachment-name">{att.filename}</div>
                              <div className="vd-attachment-size">{fmtBytes(att.size_bytes)}</div>
                            </div>
                          </div>
                          <a href={att.url} download className="vd-download-btn">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT COLUMN — Scoring & Decision
        ══════════════════════════════════════ */}
        <div className="vd-right-sticky">
          {/* ─── Scoring Panel ─── */}
          <div className="vd-scoring-panel">
            <div className="vd-panel-title">Application Scoring</div>
            <div className="vd-panel-note">Weights applied to calculate final score</div>

            {CRITERIA.map(criterion => {
              const val = scores[criterion.key] ?? 3.0;
              const color = scoreColor(val);
              return (
                <div key={criterion.key} className="vd-criterion-block">
                  <div className="vd-criterion-header">
                    <div className="vd-criterion-name-row">
                      <span className="vd-criterion-name">{criterion.label}</span>
                      <span className="vd-weight-badge">{criterion.weight}%</span>
                    </div>
                    <span className="vd-score-display" style={{ color }}>
                      {val.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="vd-range"
                    min={1}
                    max={5}
                    step={0.5}
                    value={val}
                    onChange={e => setScore(criterion.key, parseFloat(e.target.value))}
                    aria-label={`${criterion.label} score`}
                    aria-valuemin={1}
                    aria-valuemax={5}
                    aria-valuenow={val}
                  />
                  <textarea
                    className="vd-notes-input"
                    placeholder="Add notes for this criterion..."
                    value={scoreNotes[criterion.key] ?? ''}
                    onChange={e => setNote(criterion.key, e.target.value)}
                    rows={2}
                    aria-label={`Notes for ${criterion.label}`}
                  />
                </div>
              );
            })}

            {/* Weighted Average */}
            <div className="vd-weighted-card">
              <div className="vd-weighted-label">Weighted Score</div>
              <div className="vd-weighted-value" style={{ color: scoreColor(weightedScore) }}>
                {weightedScore !== null ? weightedScore.toFixed(1) : '—'}
              </div>
              <div className="vd-weighted-rec" style={{ color: scoreColor(weightedScore) }}>
                {scoreRec(weightedScore)}
              </div>
            </div>
          </div>

          {/* ─── Decision Panel ─── */}
          <div className="vd-decision-panel">
            <div className="vd-panel-title" style={{ marginBottom: 16 }}>Record Decision</div>

            {/* Decision already recorded banner */}
            {decisionAlreadyRecorded && (
              <div className={`vd-decision-recorded${savedDecision === 'reject' ? ' rejected-bg' : savedDecision === 'waitlist' ? ' waitlist-bg' : savedDecision === 'interview' ? ' interview-bg' : ''}`}>
                <div className="vd-decision-recorded-title">
                  Decision Recorded: {savedDecision === 'accept' ? 'Accepted' : savedDecision === 'reject' ? 'Rejected' : savedDecision === 'waitlist' ? 'Waitlisted' : 'Interview Scheduled'}
                </div>
                {app.decision_at && (
                  <div className="vd-decision-meta">
                    Decided {fmtDate(app.decision_at)}{app.decision_by ? ` by ${app.decision_by}` : ''}
                  </div>
                )}
                {(app.decision_reason || decisionReason) && (
                  <div className="vd-decision-meta" style={{ marginTop: 6 }}>
                    {app.decision_reason || decisionReason}
                  </div>
                )}
              </div>
            )}

            {/* Decision dropdown */}
            <label htmlFor="vd-decision-select" className="vd-field-label-full">Decision</label>
            <select
              id="vd-decision-select"
              className="vd-select"
              value={decision}
              onChange={e => setDecision(e.target.value as ReviewDecision | '')}
              aria-label="Application decision"
            >
              <option value="">-- Select Decision --</option>
              <option value="accept">Accept</option>
              <option value="interview">Schedule Interview</option>
              <option value="waitlist">Waitlist</option>
              <option value="reject">Reject</option>
            </select>

            {/* Reason field — required for reject/waitlist */}
            {requiresReason && (
              <>
                <label htmlFor="vd-decision-reason" className="vd-field-label-full">
                  Reason <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <textarea
                  id="vd-decision-reason"
                  className="vd-textarea"
                  placeholder="Required: explain the decision clearly. This informs the rejection/waitlist email."
                  value={decisionReason}
                  onChange={e => setDecisionReason(e.target.value)}
                  aria-label="Decision reason"
                  aria-required="true"
                />
              </>
            )}

            {/* Deal Terms — shown when decision = accept */}
            {showDealTerms && (
              <div className="vd-deal-section">
                <div className="vd-deal-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Deal Terms
                </div>

                <label htmlFor="vd-deal-model" className="vd-field-label-full">Deal Model</label>
                <select
                  id="vd-deal-model"
                  className="vd-select"
                  value={dealModel}
                  onChange={e => setDealModel(e.target.value as PartnershipModel)}
                  aria-label="Deal model"
                >
                  <option value="equity">Equity stake</option>
                  <option value="revenue_share">Revenue share</option>
                  <option value="hybrid">Hybrid (equity + revenue share)</option>
                </select>

                {/* Equity fields */}
                {(dealModel === 'equity' || dealModel === 'hybrid') && (
                  <>
                    <div className="vd-input-grid" style={{ marginBottom: 14 }}>
                      <div>
                        <label className="vd-field-label-full">Equity %</label>
                        <input
                          type="number"
                          className="vd-input"
                          style={{ marginBottom: 0 }}
                          placeholder="e.g. 5"
                          value={equityPercent}
                          onChange={e => setEquityPercent(e.target.value)}
                          aria-label="Equity percentage"
                          min={0}
                          max={100}
                          step={0.5}
                        />
                      </div>
                      <div>
                        <label className="vd-field-label-full">Vesting Schedule</label>
                        <input
                          type="text"
                          className="vd-input"
                          style={{ marginBottom: 0 }}
                          placeholder="e.g. 4yr vest, 1yr cliff"
                          value={vestingSchedule}
                          onChange={e => setVestingSchedule(e.target.value)}
                          aria-label="Vesting schedule"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Upfront — hybrid only */}
                {dealModel === 'hybrid' && (
                  <>
                    <label className="vd-field-label-full">Upfront Amount ($)</label>
                    <input
                      type="number"
                      className="vd-input"
                      placeholder="e.g. 25000"
                      value={upfrontAmount}
                      onChange={e => setUpfrontAmount(e.target.value)}
                      aria-label="Upfront amount"
                      min={0}
                    />
                  </>
                )}

                {/* Revenue share fields */}
                {(dealModel === 'revenue_share' || dealModel === 'hybrid') && (
                  <>
                    <div className="vd-input-grid" style={{ marginBottom: 14 }}>
                      <div>
                        <label className="vd-field-label-full">Rev. Share %</label>
                        <input
                          type="number"
                          className="vd-input"
                          style={{ marginBottom: 0 }}
                          placeholder="e.g. 10"
                          value={revSharePercent}
                          onChange={e => setRevSharePercent(e.target.value)}
                          aria-label="Revenue share percentage"
                          min={0}
                          max={100}
                          step={0.5}
                        />
                      </div>
                      <div>
                        <label className="vd-field-label-full">Cap Amount</label>
                        <input
                          type="text"
                          className="vd-input"
                          style={{ marginBottom: 0 }}
                          placeholder="e.g. $100,000 total"
                          value={revShareCap}
                          onChange={e => setRevShareCap(e.target.value)}
                          aria-label="Revenue share cap"
                        />
                      </div>
                    </div>
                    <label className="vd-field-label-full">Duration</label>
                    <input
                      type="text"
                      className="vd-input"
                      placeholder="e.g. 24 months"
                      value={revShareDuration}
                      onChange={e => setRevShareDuration(e.target.value)}
                      aria-label="Revenue share duration"
                    />
                  </>
                )}
              </div>
            )}

            {/* Save button */}
            <button
              className="vd-save-btn"
              onClick={handleSave}
              disabled={!decision || (requiresReason && !decisionReason.trim())}
              aria-label="Save decision"
            >
              Save Decision
            </button>

            {saveMsg && <div className="vd-save-msg" role="status">{saveMsg}</div>}
          </div>

          {/* ─── HERALD Rejection Email Draft ─── */}
          {heraldVisible && (savedDecision === 'reject') && (
            <div className="vd-herald-panel">
              <div className="vd-herald-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6BA3E8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <div>
                  <div className="vd-herald-title">HERALD — Rejection Email Draft</div>
                  <div className="vd-herald-subtitle">Awaiting human approval before sending</div>
                </div>
              </div>
              <pre className="vd-email-draft" aria-label="Rejection email draft">
                {rejectionEmailBody}
              </pre>
              <div className="vd-herald-actions">
                <button className="vd-herald-approve-btn" aria-label="Approve and send rejection email">
                  Approve &amp; Send
                </button>
                <button className="vd-herald-edit-btn" aria-label="Edit rejection email draft">
                  Edit Draft
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
