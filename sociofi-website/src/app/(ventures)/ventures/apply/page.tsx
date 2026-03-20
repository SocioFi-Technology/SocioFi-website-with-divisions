'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════════════════════
   VENTURES — APPLY
   4-step wizard with sticky sidebar.
   ═══════════════════════════════════════════════════════════════════════ */

const A = '#6BA3E8';

const F = {
  h: "var(--font-display, 'Syne'), sans-serif",
  b: "var(--font-body, 'Outfit'), sans-serif",
  m: "var(--font-mono, 'Fira Code'), monospace",
};

/* ── Scoped CSS ─────────────────────────────────────────────────────── */
const STYLES = `
  .apply-page { min-height: 100vh; background: var(--bg); }

  /* Hero */
  .apply-hero {
    padding: 130px 0 80px;
    background: var(--bg);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .apply-hero-glow {
    position: absolute;
    width: 600px; height: 300px;
    border-radius: 50%;
    filter: blur(100px);
    background: ${A}14;
    top: 60%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .apply-hero-inner {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 32px;
    position: relative;
    z-index: 1;
  }
  .apply-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 500;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 20px;
  }
  .apply-label::before {
    content: '';
    width: 20px; height: 1.5px;
    background: ${A};
    display: inline-block;
  }
  .apply-h1 {
    font-family: ${F.h};
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.025em;
    color: var(--text-primary);
    margin: 0 0 20px;
  }
  .apply-subtitle {
    font-family: ${F.b};
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 580px;
    margin: 0 auto;
  }

  /* Main content area */
  .apply-main {
    padding: 60px 0 100px;
  }
  .apply-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 32px;
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 60px;
    align-items: start;
  }
  @media (max-width: 960px) {
    .apply-container {
      grid-template-columns: 1fr;
      gap: 48px;
    }
    .apply-sidebar { order: -1; }
  }

  /* Progress indicator */
  .apply-progress {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 40px;
  }
  .apply-progress-dot {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: var(--bg-card);
    display: flex; align-items: center; justify-content: center;
    font-family: ${F.m};
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-muted);
    flex-shrink: 0;
    transition: all 0.3s;
    position: relative;
    z-index: 1;
  }
  .apply-progress-dot.active {
    border-color: ${A};
    background: ${A};
    color: #fff;
    box-shadow: 0 0 0 4px ${A}20;
  }
  .apply-progress-dot.done {
    border-color: ${A}60;
    background: ${A}15;
    color: ${A};
  }
  .apply-progress-line {
    flex: 1;
    height: 2px;
    background: var(--border);
    transition: background 0.4s;
  }
  .apply-progress-line.done {
    background: ${A}50;
  }

  /* Form card */
  .apply-form-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 40px;
  }
  .apply-step-wrapper {
    position: relative;
    overflow: hidden;
  }

  .apply-step-title {
    font-family: ${F.h};
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--text-primary);
    margin: 0 0 8px;
  }
  .apply-step-subtitle {
    font-family: ${F.b};
    font-size: 0.88rem;
    color: var(--text-muted);
    margin: 0 0 32px;
  }
  .apply-step-counter {
    font-family: ${F.m};
    font-size: 0.68rem;
    color: ${A};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 6px;
  }

  /* Form fields */
  .apply-field { margin-bottom: 22px; }
  .apply-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 22px;
  }
  @media (max-width: 600px) {
    .apply-field-row { grid-template-columns: 1fr; }
    .apply-form-card { padding: 28px 20px; }
  }
  .apply-label-text {
    display: block;
    font-family: ${F.b};
    font-size: 0.84rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 7px;
  }
  .apply-label-optional {
    font-family: ${F.m};
    font-size: 0.66rem;
    color: var(--text-muted);
    margin-left: 6px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .apply-input,
  .apply-textarea,
  .apply-select {
    width: 100%;
    background: var(--bg-2);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 11px 14px;
    font-family: ${F.b};
    font-size: 0.9rem;
    color: var(--text-primary);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    -webkit-appearance: none;
  }
  .apply-input::placeholder,
  .apply-textarea::placeholder {
    color: var(--text-muted);
    font-size: 0.86rem;
  }
  .apply-input:focus,
  .apply-textarea:focus,
  .apply-select:focus {
    border-color: ${A};
    box-shadow: 0 0 0 3px ${A}18;
  }
  .apply-textarea {
    resize: vertical;
    min-height: 96px;
    line-height: 1.65;
  }
  .apply-select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237C8DB0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
  }

  /* Radio groups */
  .apply-radio-group { display: flex; flex-direction: column; gap: 10px; }
  .apply-radio-opt {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 13px 16px;
    background: var(--bg-2);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s;
  }
  .apply-radio-opt:hover { border-color: ${A}50; }
  .apply-radio-opt.selected {
    border-color: ${A};
    background: ${A}0D;
  }
  .apply-radio-dot {
    flex-shrink: 0;
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 2px solid var(--border);
    margin-top: 1px;
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .apply-radio-opt.selected .apply-radio-dot {
    border-color: ${A};
    background: ${A};
  }
  .apply-radio-dot-inner {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #fff;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .apply-radio-opt.selected .apply-radio-dot-inner { opacity: 1; }
  .apply-radio-text {
    font-family: ${F.b};
    font-size: 0.88rem;
    line-height: 1.5;
    color: var(--text-primary);
  }
  .apply-radio-sub {
    font-family: ${F.b};
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 2px;
  }

  /* Note below field */
  .apply-field-note {
    margin-top: 8px;
    padding: 10px 14px;
    background: var(--bg-2);
    border-left: 2px solid ${A}40;
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    font-family: ${F.b};
    font-size: 0.82rem;
    color: var(--text-muted);
    line-height: 1.55;
  }

  /* Nav buttons */
  .apply-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 36px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    gap: 12px;
  }
  .apply-btn-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 11px 22px;
    background: transparent;
    color: var(--text-secondary);
    font-family: ${F.h};
    font-size: 0.88rem;
    font-weight: 600;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all 0.2s;
  }
  .apply-btn-back:hover {
    border-color: var(--text-muted);
    color: var(--text-primary);
  }
  .apply-btn-next {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 12px 26px;
    background: ${A};
    color: #fff;
    font-family: ${F.h};
    font-size: 0.88rem;
    font-weight: 600;
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all 0.2s;
  }
  .apply-btn-next:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 28px ${A}45;
  }
  .apply-btn-submit {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 13px 28px;
    background: linear-gradient(135deg, var(--navy) 0%, ${A} 100%);
    color: #fff;
    font-family: ${F.h};
    font-size: 0.9rem;
    font-weight: 600;
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 20px ${A}35;
  }
  .apply-btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 36px ${A}50;
  }

  /* File upload */
  .apply-upload {
    border: 1.5px dashed var(--border);
    border-radius: var(--radius-sm);
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;
    position: relative;
    overflow: hidden;
  }
  .apply-upload:hover { border-color: ${A}60; }
  .apply-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .apply-upload-icon {
    width: 36px; height: 36px;
    margin: 0 auto 10px;
    color: var(--text-muted);
  }
  .apply-upload p {
    font-family: ${F.b};
    font-size: 0.84rem;
    color: var(--text-secondary);
    margin: 0 0 4px;
  }
  .apply-upload span {
    font-family: ${F.b};
    font-size: 0.78rem;
    color: var(--text-muted);
  }

  /* Success state */
  .apply-success {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 48px 40px;
    text-align: center;
  }
  .apply-success-icon {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: ${A}18;
    border: 2px solid ${A}40;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    color: ${A};
  }
  .apply-success h2 {
    font-family: ${F.h};
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 0 0 12px;
  }
  .apply-success p {
    font-family: ${F.b};
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 460px;
    margin: 0 auto 32px;
  }
  .apply-success-steps { text-align: left; margin-bottom: 32px; }
  .apply-success-step {
    display: flex; gap: 14px; align-items: flex-start;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }
  .apply-success-step:last-child { border-bottom: none; }
  .apply-success-step-num {
    flex-shrink: 0;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: ${A}15;
    border: 1.5px solid ${A}35;
    display: flex; align-items: center; justify-content: center;
    font-family: ${F.m};
    font-size: 0.68rem;
    font-weight: 600;
    color: ${A};
    margin-top: 1px;
  }
  .apply-success-step-text {
    font-family: ${F.b};
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--text-secondary);
  }
  .apply-success-links {
    display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }
  .apply-success-link {
    font-family: ${F.b};
    font-size: 0.88rem;
    color: ${A};
    text-decoration: none;
    border-bottom: 1px solid ${A}30;
    padding-bottom: 1px;
    transition: border-color 0.2s;
  }
  .apply-success-link:hover { border-color: ${A}; }

  /* Sidebar */
  .apply-sidebar {
    position: sticky;
    top: 100px;
  }
  .apply-sidebar-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 32px;
    margin-bottom: 20px;
  }
  .apply-sidebar-title {
    font-family: ${F.h};
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text-primary);
    margin: 0 0 24px;
  }
  .apply-sidebar-steps { display: flex; flex-direction: column; gap: 18px; }
  .apply-sidebar-step {
    display: flex; gap: 12px; align-items: flex-start;
  }
  .apply-sidebar-step-num {
    flex-shrink: 0;
    width: 24px; height: 24px;
    border-radius: 50%;
    background: ${A}15;
    border: 1.5px solid ${A}35;
    display: flex; align-items: center; justify-content: center;
    font-family: ${F.m};
    font-size: 0.64rem;
    font-weight: 600;
    color: ${A};
    margin-top: 1px;
  }
  .apply-sidebar-step-text {
    flex: 1;
  }
  .apply-sidebar-step-label {
    font-family: ${F.b};
    font-size: 0.86rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 2px;
  }
  .apply-sidebar-step-detail {
    font-family: ${F.b};
    font-size: 0.8rem;
    line-height: 1.55;
    color: var(--text-muted);
  }

  /* Stats card */
  .apply-stats { display: flex; flex-direction: column; gap: 0; }
  .apply-stat {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 13px 0;
    border-bottom: 1px solid var(--border);
  }
  .apply-stat:last-child { border-bottom: none; }
  .apply-stat-label {
    font-family: ${F.b};
    font-size: 0.82rem;
    color: var(--text-muted);
  }
  .apply-stat-val {
    font-family: ${F.m};
    font-size: 0.84rem;
    font-weight: 600;
    color: ${A};
  }

  /* NDA note */
  .apply-nda {
    padding: 14px 18px;
    background: ${A}0A;
    border: 1px solid ${A}20;
    border-radius: var(--radius-sm);
    margin-top: 20px;
    display: flex; gap: 10px; align-items: flex-start;
  }
  .apply-nda-icon { flex-shrink: 0; margin-top: 1px; color: ${A}; }
  .apply-nda p {
    font-family: ${F.b};
    font-size: 0.8rem;
    line-height: 1.55;
    color: var(--text-secondary);
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .apply-hero { padding: 110px 0 60px; }
    .apply-main { padding: 40px 0 80px; }
    .apply-container { padding: 0 20px; }
  }
`;

/* ── Inline SVG icons ─────────────────────────────────────────────── */
function IconCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
function IconUpload() {
  return (
    <svg className="apply-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

/* ── Form state types ─────────────────────────────────────────────── */
interface FormData {
  // Step 1
  name: string;
  email: string;
  location: string;
  linkedin: string;
  bio: string;
  fullTime: string;
  // Step 2
  whatBuilding: string;
  problemSolves: string;
  customer: string;
  monetization: string;
  demandValidation: string;
  // Step 3
  triedBefore: string;
  whyCantPay: string;
  dealModel: string;
  expectedRevenue: string;
  whileWesBuild: string;
  // Step 4
  anythingElse: string;
  howHeard: string;
}

const INITIAL: FormData = {
  name: '', email: '', location: '', linkedin: '', bio: '', fullTime: '',
  whatBuilding: '', problemSolves: '', customer: '', monetization: '', demandValidation: '',
  triedBefore: '', whyCantPay: '', dealModel: '', expectedRevenue: '', whileWesBuild: '',
  anythingElse: '', howHeard: '',
};

/* ── Radio option component ──────────────────────────────────────── */
function RadioOpt({
  value, selected, onChange, label, sub,
}: { value: string; selected: boolean; onChange: (v: string) => void; label: string; sub?: string }) {
  return (
    <div
      className={`apply-radio-opt${selected ? ' selected' : ''}`}
      onClick={() => onChange(value)}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && onChange(value)}
    >
      <div className="apply-radio-dot">
        <div className="apply-radio-dot-inner" />
      </div>
      <div>
        <div className="apply-radio-text">{label}</div>
        {sub && <div className="apply-radio-sub">{sub}</div>}
      </div>
    </div>
  );
}

/* ── Step components ─────────────────────────────────────────────── */
function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div>
      <div className="apply-step-counter">Step 1 of 4</div>
      <h2 className="apply-step-title">About You</h2>
      <p className="apply-step-subtitle">Basic details and a bit of context about your background.</p>

      <div className="apply-field-row">
        <div>
          <label className="apply-label-text" htmlFor="name">Full name <span style={{ color: A }}>*</span></label>
          <input id="name" className="apply-input" type="text" value={data.name}
            onChange={e => set('name', e.target.value)} placeholder="Your name" required />
        </div>
        <div>
          <label className="apply-label-text" htmlFor="email">Email <span style={{ color: A }}>*</span></label>
          <input id="email" className="apply-input" type="email" value={data.email}
            onChange={e => set('email', e.target.value)} placeholder="you@example.com" required />
        </div>
      </div>

      <div className="apply-field-row">
        <div>
          <label className="apply-label-text" htmlFor="location">
            Location / timezone <span className="apply-label-optional">optional</span>
          </label>
          <input id="location" className="apply-input" type="text" value={data.location}
            onChange={e => set('location', e.target.value)} placeholder="e.g. Dhaka, GMT+6" />
        </div>
        <div>
          <label className="apply-label-text" htmlFor="linkedin">
            LinkedIn URL <span className="apply-label-optional">optional</span>
          </label>
          <input id="linkedin" className="apply-input" type="url" value={data.linkedin}
            onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/yourprofile" />
        </div>
      </div>

      <div className="apply-field">
        <label className="apply-label-text" htmlFor="bio">Brief background</label>
        <textarea id="bio" className="apply-textarea" value={data.bio}
          onChange={e => set('bio', e.target.value)}
          placeholder="What industry have you worked in? How long? What's your relevant expertise?" />
      </div>

      <div className="apply-field">
        <label className="apply-label-text">Are you working on this full-time? <span style={{ color: A }}>*</span></label>
        <div className="apply-radio-group">
          <RadioOpt value="full" selected={data.fullTime === 'full'} onChange={v => set('fullTime', v)}
            label="Yes — full-time, this is my main focus" />
          <RadioOpt value="transitioning" selected={data.fullTime === 'transitioning'} onChange={v => set('fullTime', v)}
            label="Part-time but transitioning to full-time" />
          <RadioOpt value="parttime" selected={data.fullTime === 'parttime'} onChange={v => set('fullTime', v)}
            label="Part-time and plan to stay that way" />
        </div>
      </div>
    </div>
  );
}

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div>
      <div className="apply-step-counter">Step 2 of 4</div>
      <h2 className="apply-step-title">Your Product</h2>
      <p className="apply-step-subtitle">Tell us about what you&apos;re building. Be specific — not polished.</p>

      <div className="apply-field">
        <label className="apply-label-text" htmlFor="whatBuilding">What are you building? <span style={{ color: A }}>*</span></label>
        <textarea id="whatBuilding" className="apply-textarea" value={data.whatBuilding}
          onChange={e => set('whatBuilding', e.target.value)}
          placeholder="Don't pitch. Just explain what it does and who it's for." style={{ minHeight: 108 }} />
      </div>

      <div className="apply-field">
        <label className="apply-label-text" htmlFor="problemSolves">What problem does it solve? <span style={{ color: A }}>*</span></label>
        <textarea id="problemSolves" className="apply-textarea" value={data.problemSolves}
          onChange={e => set('problemSolves', e.target.value)}
          placeholder="What pain point does your target customer have right now?" />
      </div>

      <div className="apply-field">
        <label className="apply-label-text" htmlFor="customer">Who is the customer? <span style={{ color: A }}>*</span></label>
        <textarea id="customer" className="apply-textarea" value={data.customer}
          onChange={e => set('customer', e.target.value)}
          placeholder="Be specific. Not 'small businesses' but 'restaurants with 1–3 locations that manage reservations manually.'" />
      </div>

      <div className="apply-field">
        <label className="apply-label-text" htmlFor="monetization">How will it make money? <span style={{ color: A }}>*</span></label>
        <textarea id="monetization" className="apply-textarea" value={data.monetization}
          onChange={e => set('monetization', e.target.value)}
          placeholder="Subscription? Per-transaction? One-time purchase? What price?" style={{ minHeight: 72 }} />
      </div>

      <div className="apply-field">
        <label className="apply-label-text">Have you validated demand? <span style={{ color: A }}>*</span></label>
        <div className="apply-radio-group">
          <RadioOpt value="paying" selected={data.demandValidation === 'paying'} onChange={v => set('demandValidation', v)}
            label="Yes — I have paying customers or pre-orders" />
          <RadioOpt value="waitlist" selected={data.demandValidation === 'waitlist'} onChange={v => set('demandValidation', v)}
            label="Yes — I have a waitlist or letters of intent" />
          <RadioOpt value="conversations" selected={data.demandValidation === 'conversations'} onChange={v => set('demandValidation', v)}
            label="Somewhat — I've had conversations that confirm interest" />
          <RadioOpt value="no" selected={data.demandValidation === 'no'} onChange={v => set('demandValidation', v)}
            label="No — I believe the demand exists but haven't tested it" />
        </div>
        {data.demandValidation === 'no' && (
          <div className="apply-field-note">
            We strongly prefer validated ideas. If you selected &ldquo;No&rdquo;, consider having even a few
            customer conversations before applying — it strengthens your application significantly.
          </div>
        )}
      </div>
    </div>
  );
}

function Step3({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div>
      <div className="apply-step-counter">Step 3 of 4</div>
      <h2 className="apply-step-title">The Partnership</h2>
      <p className="apply-step-subtitle">Help us understand your situation and what kind of deal makes sense.</p>

      <div className="apply-field">
        <label className="apply-label-text">Have you tried building this before? <span style={{ color: A }}>*</span></label>
        <div className="apply-radio-group">
          <RadioOpt value="ai-tools" selected={data.triedBefore === 'ai-tools'} onChange={v => set('triedBefore', v)}
            label="Yes — with AI coding tools" />
          <RadioOpt value="freelancer" selected={data.triedBefore === 'freelancer'} onChange={v => set('triedBefore', v)}
            label="Yes — with a freelancer" />
          <RadioOpt value="agency" selected={data.triedBefore === 'agency'} onChange={v => set('triedBefore', v)}
            label="Yes — with an agency" />
          <RadioOpt value="no" selected={data.triedBefore === 'no'} onChange={v => set('triedBefore', v)}
            label="No — this would be the first build attempt" />
        </div>
      </div>

      <div className="apply-field">
        <label className="apply-label-text" htmlFor="whyCantPay">
          Why can&apos;t you pay for Studio? <span className="apply-label-optional">optional</span>
        </label>
        <textarea id="whyCantPay" className="apply-textarea" value={data.whyCantPay}
          onChange={e => set('whyCantPay', e.target.value)}
          placeholder="No judgment. We genuinely want to understand your situation." style={{ minHeight: 80 }} />
      </div>

      <div className="apply-field">
        <label className="apply-label-text">Preferred deal model <span style={{ color: A }}>*</span></label>
        <div className="apply-radio-group">
          <RadioOpt value="equity" selected={data.dealModel === 'equity'} onChange={v => set('dealModel', v)}
            label="Equity" sub="We build in exchange for 5–20% equity stake" />
          <RadioOpt value="revenue-share" selected={data.dealModel === 'revenue-share'} onChange={v => set('dealModel', v)}
            label="Revenue Share" sub="We build, you pay a % of revenue until a cap is reached" />
          <RadioOpt value="hybrid" selected={data.dealModel === 'hybrid'} onChange={v => set('dealModel', v)}
            label="Hybrid" sub="Some upfront cash + smaller equity or revenue share" />
          <RadioOpt value="not-sure" selected={data.dealModel === 'not-sure'} onChange={v => set('dealModel', v)}
            label="Not sure" sub="We'll figure it out together on the call" />
        </div>
      </div>

      <div className="apply-field-row">
        <div>
          <label className="apply-label-text" htmlFor="expectedRevenue">
            Expected monthly revenue at 12 months <span className="apply-label-optional">optional</span>
          </label>
          <input id="expectedRevenue" className="apply-input" type="text" value={data.expectedRevenue}
            onChange={e => set('expectedRevenue', e.target.value)} placeholder="Best honest estimate" />
        </div>
      </div>

      <div className="apply-field">
        <label className="apply-label-text" htmlFor="whileWesBuild">What will YOU do while we build? <span style={{ color: A }}>*</span></label>
        <textarea id="whileWesBuild" className="apply-textarea" value={data.whileWesBuild}
          onChange={e => set('whileWesBuild', e.target.value)}
          placeholder="Marketing plan? Sales outreach? Fundraising? Partnership development?" />
      </div>
    </div>
  );
}

function Step4({ data, set, onFileChange }: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
  onFileChange: (f: File | null) => void;
}) {
  const [fileName, setFileName] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileName(file?.name ?? '');
    onFileChange(file);
  };

  return (
    <div>
      <div className="apply-step-counter">Step 4 of 4</div>
      <h2 className="apply-step-title">Additional Context</h2>
      <p className="apply-step-subtitle">Last few things — almost done.</p>

      <div className="apply-field">
        <label className="apply-label-text" htmlFor="anythingElse">
          Anything else we should know? <span className="apply-label-optional">optional</span>
        </label>
        <textarea id="anythingElse" className="apply-textarea" value={data.anythingElse}
          onChange={e => set('anythingElse', e.target.value)}
          placeholder="Anything that doesn't fit neatly into the questions above." />
      </div>

      <div className="apply-field">
        <label className="apply-label-text">
          Pitch deck or mockups <span className="apply-label-optional">optional</span>
        </label>
        <div className="apply-upload">
          <input type="file" accept=".pdf,.ppt,.pptx,.png,.jpg,.key" onChange={handleFile} aria-label="Upload pitch deck or mockups" />
          <IconUpload />
          <p>{fileName || 'Click to upload or drag a file here'}</p>
          <span>PDF, PPT, PNG, JPG — max 20MB. These are NOT required. Most accepted applications don&apos;t include them.</span>
        </div>
      </div>

      <div className="apply-field">
        <label className="apply-label-text" htmlFor="howHeard">How did you hear about us? <span style={{ color: A }}>*</span></label>
        <select id="howHeard" className="apply-select" value={data.howHeard}
          onChange={e => set('howHeard', e.target.value)}>
          <option value="">Select an option</option>
          <option value="google">Google</option>
          <option value="social">Social media</option>
          <option value="referral">Referral</option>
          <option value="website">SocioFi website</option>
          <option value="academy">Academy course</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );
}

/* ── Success state ───────────────────────────────────────────────── */
function SuccessState() {
  return (
    <motion.div
      className="apply-success"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="apply-success-icon">
        <IconCheck />
      </div>
      <h2>Application received. Thank you for your honesty.</h2>
      <p>
        We read every application ourselves. You&apos;ll hear back within 7 days — either way.
      </p>

      <div className="apply-success-steps">
        {[
          { label: 'Initial review (days 1–3)', detail: 'Your application is read carefully by our team.' },
          { label: 'Deep review (days 5–7)', detail: 'We look at the problem, market, and your background together.' },
          { label: 'Decision within 7 days', detail: "You'll receive a clear yes, no, or 'let's talk more'." },
          { label: 'If accepted: discovery call within 10 days', detail: '60 minutes with our CEO or CTO to explore the partnership.' },
        ].map((s, i) => (
          <div key={i} className="apply-success-step">
            <div className="apply-success-step-num">{i + 1}</div>
            <div className="apply-success-step-text">
              <strong style={{ color: 'var(--text-primary)' }}>{s.label}</strong>
              <br />
              {s.detail}
            </div>
          </div>
        ))}
      </div>

      <div className="apply-success-links">
        <span style={{ fontFamily: F.b, fontSize: '0.84rem', color: 'var(--text-muted)' }}>While you wait:</span>
        <Link href="/ventures/how-it-works" className="apply-success-link">How the deal models work</Link>
        <Link href="/ventures/what-we-look-for" className="apply-success-link">What we look for</Link>
      </div>
    </motion.div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────────── */
function Sidebar() {
  const steps = [
    { label: 'Initial review — 3 days', detail: 'Your application is read by a person, not filtered by an algorithm.' },
    { label: 'Deep review — days 5–7', detail: 'We assess the idea, market size, and founder-problem fit together.' },
    { label: 'Decision within 7 days', detail: 'Every application gets a real response. No ghosting.' },
    { label: 'If accepted: discovery call', detail: '60-minute founder call within 10 days of your application.' },
    { label: 'If rejected: here\'s why', detail: 'We explain what wasn\'t a fit — and suggest alternatives if any.' },
  ];

  const stats = [
    { label: 'Average response time', val: '5 business days' },
    { label: 'Acceptance rate', val: '~15–20%' },
    { label: 'Projects per quarter', val: '2–4' },
  ];

  return (
    <div className="apply-sidebar">
      <div className="apply-sidebar-card">
        <p className="apply-sidebar-title">What happens after you submit</p>
        <div className="apply-sidebar-steps">
          {steps.map((s, i) => (
            <div key={i} className="apply-sidebar-step">
              <div className="apply-sidebar-step-num">{i + 1}</div>
              <div className="apply-sidebar-step-text">
                <div className="apply-sidebar-step-label">{s.label}</div>
                <div className="apply-sidebar-step-detail">{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="apply-sidebar-card">
        <p className="apply-sidebar-title">By the numbers</p>
        <div className="apply-stats">
          {stats.map((s) => (
            <div key={s.label} className="apply-stat">
              <span className="apply-stat-label">{s.label}</span>
              <span className="apply-stat-val">{s.val}</span>
            </div>
          ))}
        </div>

        <div className="apply-nda">
          <div className="apply-nda-icon"><IconLock /></div>
          <p>Your information is confidential. We sign NDAs on request — just mention it in your application.</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────── */
export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const set = (k: keyof FormData, v: string) => setData(prev => ({ ...prev, [k]: v }));

  const goNext = () => {
    setDirection(1);
    setStep(s => Math.min(s + 1, 4));
  };
  const goBack = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 1));
  };
  const handleSubmit = () => {
    setSubmitted(true);
  };

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="apply-page">

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="apply-hero">
          <div className="apply-hero-glow" />
          <div className="apply-hero-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="apply-label">Apply to Ventures</div>
              <h1 className="apply-h1">Tell Us About Your Idea. We&apos;ll Tell You if We Can Help.</h1>
              <p className="apply-subtitle">
                This application takes about 10 minutes. Be honest — the best applications are clear and specific, not polished.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Main ────────────────────────────────────────────────── */}
        <section className="apply-main">
          <div className="apply-container">
            {/* Left: form */}
            <div>
              {submitted ? (
                <SuccessState />
              ) : (
                <div className="apply-form-card">
                  {/* Progress */}
                  <div className="apply-progress" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4}>
                    {[1, 2, 3, 4].map((n, i) => (
                      <React.Fragment key={n}>
                        <div className={`apply-progress-dot${step === n ? ' active' : step > n ? ' done' : ''}`}>
                          {step > n ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          ) : n}
                        </div>
                        {i < 3 && (
                          <div className={`apply-progress-line${step > n ? ' done' : ''}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Step content with slide animation */}
                  <div className="apply-step-wrapper">
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={step}
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {step === 1 && <Step1 data={data} set={set} />}
                        {step === 2 && <Step2 data={data} set={set} />}
                        {step === 3 && <Step3 data={data} set={set} />}
                        {step === 4 && <Step4 data={data} set={set} onFileChange={setFile} />}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation */}
                  <div className="apply-nav">
                    {step > 1 ? (
                      <button className="apply-btn-back" onClick={goBack} type="button">
                        <IconArrowLeft />
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 4 ? (
                      <button className="apply-btn-next" onClick={goNext} type="button">
                        Next
                        <IconArrowRight />
                      </button>
                    ) : (
                      <button className="apply-btn-submit" onClick={handleSubmit} type="button">
                        Submit Application
                        <IconArrowRight />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: sidebar */}
            <Sidebar />
          </div>
        </section>
      </div>
    </>
  );
}
