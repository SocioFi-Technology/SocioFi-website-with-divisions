'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';

const A = '#5BB5E0';
const F = {
  display: 'var(--font-display, Syne)',
  body: 'var(--font-body, Outfit)',
  mono: 'var(--font-mono, "Fira Code")',
};

const STYLES = `
  .gh-page { background: var(--bg, #0C0C1D); color: var(--text-primary, #fff); min-height: 100vh; font-family: ${F.body}; }

  /* ── Hero ── */
  .gh-hero { position: relative; padding: 148px 32px 72px; overflow: hidden; text-align: center; }
  .gh-hero-orb { position: absolute; top: -120px; left: 50%; transform: translateX(-50%); width: 800px; height: 600px; background: radial-gradient(ellipse, ${A}14 0%, transparent 68%); filter: blur(60px); pointer-events: none; }
  .gh-hero-inner { position: relative; z-index: 2; max-width: 700px; margin: 0 auto; }
  .gh-label { display: flex; align-items: center; justify-content: center; gap: 10px; font-family: ${F.mono}; font-size: 0.72rem; font-weight: 500; color: ${A}; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 24px; }
  .gh-label::before { content: ''; width: 20px; height: 1.5px; background: ${A}; display: inline-block; }
  .gh-h1 { font-family: ${F.display}; font-size: clamp(2.4rem, 4.5vw, 3.4rem); font-weight: 800; line-height: 1.06; letter-spacing: -0.033em; color: var(--text-primary, #fff); margin-bottom: 20px; }
  .gh-sub { font-size: 1.05rem; line-height: 1.75; color: var(--text-secondary, #7C8DB0); max-width: 540px; margin: 0 auto; }

  /* ── Path Cards ── */
  .gh-paths { padding: 56px 32px 0; }
  .gh-container { max-width: 1100px; margin: 0 auto; }
  .gh-paths-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 760px; margin: 0 auto; }
  @media(max-width: 640px) { .gh-paths-grid { grid-template-columns: 1fr; } }
  .gh-path-card { padding: 32px; border-radius: 20px; background: var(--bg-card, #13132B); border: 2px solid var(--border, rgba(91,181,224,0.08)); cursor: pointer; transition: all 0.3s; text-align: left; }
  .gh-path-card:hover { border-color: ${A}40; transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.2); }
  .gh-path-card.selected { border-color: ${A}; background: linear-gradient(135deg, ${A}10, var(--bg-card, #13132B)); box-shadow: 0 0 0 1px ${A}30, 0 12px 40px rgba(91,181,224,0.12); }
  .gh-path-icon { width: 48px; height: 48px; border-radius: 12px; background: ${A}15; border: 1px solid ${A}25; display: flex; align-items: center; justify-content: center; color: ${A}; margin-bottom: 16px; transition: all 0.3s; }
  .gh-path-card.selected .gh-path-icon { background: ${A}22; box-shadow: 0 0 16px ${A}28; }
  .gh-path-title { font-family: ${F.display}; font-size: 1.05rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 8px; }
  .gh-path-desc { font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); line-height: 1.6; }
  .gh-path-selected-badge { display: inline-flex; align-items: center; gap: 6px; font-family: ${F.mono}; font-size: 0.62rem; color: ${A}; margin-top: 14px; opacity: 0; transition: opacity 0.2s; }
  .gh-path-card.selected .gh-path-selected-badge { opacity: 1; }

  /* ── Main layout ── */
  .gh-main { padding: 48px 32px 100px; }
  .gh-layout { display: grid; grid-template-columns: 1fr 380px; gap: 48px; align-items: start; }
  @media(max-width: 1020px) { .gh-layout { grid-template-columns: 1fr; } }

  /* ── Form wrap ── */
  .gh-form-wrap { background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); border-radius: 24px; padding: 36px; overflow: hidden; }

  /* ── Step progress ── */
  .gh-steps-bar { display: flex; align-items: center; margin-bottom: 36px; }
  .gh-step-item { display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .gh-step-circle { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: ${F.mono}; font-size: 0.62rem; font-weight: 700; transition: all 0.3s; }
  .gh-step-circle.active { background: ${A}; color: #0C0C1D; box-shadow: 0 0 12px ${A}40; }
  .gh-step-circle.done { background: ${A}20; color: ${A}; border: 1.5px solid ${A}50; }
  .gh-step-circle.pending { background: var(--bg-2, #111128); color: var(--text-muted, #4A5578); border: 1.5px solid var(--border, rgba(91,181,224,0.08)); }
  .gh-step-lbl { font-family: ${F.mono}; font-size: 0.56rem; color: var(--text-muted, #4A5578); white-space: nowrap; text-align: center; text-transform: uppercase; letter-spacing: 0.06em; }
  .gh-step-lbl.active { color: ${A}; }
  .gh-step-connector { flex: 1; height: 1.5px; background: var(--border, rgba(91,181,224,0.08)); margin: 0 6px; margin-bottom: 16px; transition: background 0.4s; }
  .gh-step-connector.done { background: ${A}40; }

  /* ── Field styles ── */
  .gh-step-title { font-family: ${F.display}; font-size: 1.15rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 8px; }
  .gh-step-sub { font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); margin-bottom: 28px; line-height: 1.55; }
  .gh-field { margin-bottom: 22px; }
  .gh-field-label { display: block; font-family: ${F.mono}; font-size: 0.65rem; font-weight: 600; color: var(--text-secondary, #7C8DB0); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
  .gh-input { width: 100%; padding: 12px 16px; background: var(--bg-2, #111128); border: 1px solid var(--border, rgba(91,181,224,0.12)); border-radius: 10px; color: var(--text-primary, #fff); font-family: ${F.body}; font-size: 0.9rem; transition: border-color 0.2s; outline: none; box-sizing: border-box; }
  .gh-input:focus { border-color: ${A}; }
  .gh-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235BB5E0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; cursor: pointer; }
  .gh-textarea { resize: vertical; min-height: 90px; }

  /* ── Checkbox grid ── */
  .gh-check-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .gh-check-pill { display: flex; align-items: center; gap: 7px; padding: 8px 14px; background: var(--bg-2, #111128); border: 1px solid var(--border, rgba(91,181,224,0.1)); border-radius: 8px; cursor: pointer; font-size: 0.84rem; color: var(--text-secondary, #7C8DB0); transition: all 0.15s; user-select: none; }
  .gh-check-pill.checked { background: ${A}15; border-color: ${A}; color: var(--text-primary, #fff); }
  .gh-check-pill:hover { border-color: ${A}35; }
  .gh-check-pill input { display: none; }
  .gh-check-box { width: 14px; height: 14px; border-radius: 3px; border: 1.5px solid var(--text-muted, #4A5578); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .gh-check-pill.checked .gh-check-box { background: ${A}; border-color: ${A}; }

  /* ── Toggle ── */
  .gh-toggle-row { display: flex; gap: 10px; }
  .gh-toggle-btn { padding: 10px 22px; border-radius: 8px; font-family: ${F.display}; font-size: 0.85rem; font-weight: 600; border: 1.5px solid var(--border, rgba(91,181,224,0.1)); background: var(--bg-2, #111128); color: var(--text-secondary, #7C8DB0); cursor: pointer; transition: all 0.15s; }
  .gh-toggle-btn.active { background: ${A}18; border-color: ${A}; color: var(--text-primary, #fff); }

  /* ── Plan radio ── */
  .gh-plan-grid { display: flex; flex-direction: column; gap: 10px; }
  .gh-plan-radio { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 10px; background: var(--bg-2, #111128); border: 1.5px solid var(--border, rgba(91,181,224,0.08)); cursor: pointer; transition: all 0.2s; }
  .gh-plan-radio:hover { border-color: ${A}35; }
  .gh-plan-radio.selected { background: ${A}10; border-color: ${A}; }
  .gh-plan-radio input { display: none; }
  .gh-radio-dot { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--text-muted, #4A5578); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .gh-plan-radio.selected .gh-radio-dot { border-color: ${A}; background: ${A}; }
  .gh-plan-name { font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; color: var(--text-primary, #fff); }
  .gh-plan-price { font-family: ${F.mono}; font-size: 0.72rem; color: ${A}; margin-left: auto; }
  .gh-plan-desc { font-size: 0.78rem; color: var(--text-secondary, #7C8DB0); }

  /* ── Form navigation ── */
  .gh-form-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; gap: 12px; }
  .gh-btn-next { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; background: linear-gradient(135deg, var(--navy, #3A589E), ${A}); color: #fff; border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 24px rgba(91,181,224,0.25); }
  .gh-btn-next:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(91,181,224,0.4); }
  .gh-btn-back { display: inline-flex; align-items: center; gap: 6px; padding: 13px 22px; background: transparent; border: 1.5px solid var(--border, rgba(91,181,224,0.12)); color: var(--text-secondary, #7C8DB0); border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .gh-btn-back:hover { border-color: ${A}40; color: var(--text-primary, #fff); }
  .gh-btn-submit { display: inline-flex; align-items: center; gap: 8px; padding: 13px 30px; background: ${A}; color: #0C0C1D; border-radius: 100px; font-family: ${F.display}; font-size: 0.9rem; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; }
  .gh-btn-submit:hover { opacity: 0.9; transform: translateY(-2px); }

  /* ── Success state ── */
  .gh-success { padding: 48px 24px; text-align: center; }
  .gh-success-icon { width: 72px; height: 72px; border-radius: 50%; background: ${A}16; border: 1.5px solid ${A}40; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
  .gh-success-h { font-family: ${F.display}; font-size: 1.4rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 10px; }
  .gh-success-p { font-size: 0.95rem; color: var(--text-secondary, #7C8DB0); max-width: 400px; margin: 0 auto 36px; line-height: 1.7; }
  .gh-timeline { display: flex; flex-direction: column; gap: 0; text-align: left; max-width: 400px; margin: 0 auto; border: 1px solid ${A}20; border-radius: 16px; overflow: hidden; }
  .gh-timeline-step { display: flex; align-items: flex-start; gap: 16px; padding: 20px 24px; background: var(--bg-2, #111128); position: relative; }
  .gh-timeline-step:not(:last-child) { border-bottom: 1px solid ${A}15; }
  .gh-tl-num { width: 28px; height: 28px; border-radius: 50%; background: ${A}20; border: 1px solid ${A}40; display: flex; align-items: center; justify-content: center; font-family: ${F.mono}; font-size: 0.65rem; font-weight: 700; color: ${A}; flex-shrink: 0; }
  .gh-tl-body { flex: 1; }
  .gh-tl-label { font-family: ${F.mono}; font-size: 0.62rem; color: ${A}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
  .gh-tl-text { font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); line-height: 1.5; }

  /* ── Sidebar ── */
  .gh-sidebar { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 20px; }
  @media(max-width: 1020px) { .gh-sidebar { position: static; } }
  .gh-sidebar-card { background: var(--bg-card, #13132B); border: 1px solid var(--border, rgba(91,181,224,0.08)); border-radius: 20px; padding: 28px; }
  .gh-sidebar-title { font-family: ${F.display}; font-size: 0.95rem; font-weight: 700; color: var(--text-primary, #fff); margin-bottom: 18px; }
  .gh-do-list { display: flex; flex-direction: column; gap: 12px; }
  .gh-do-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); line-height: 1.5; }
  .gh-do-check { width: 18px; height: 18px; border-radius: 50%; background: ${A}16; border: 1px solid ${A}30; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .gh-metric-box { background: ${A}08; border: 1px solid ${A}20; border-radius: 12px; padding: 20px; }
  .gh-metric-label { font-family: ${F.mono}; font-size: 0.62rem; color: ${A}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
  .gh-metric-value { font-family: ${F.display}; font-size: 2rem; font-weight: 800; color: var(--text-primary, #fff); letter-spacing: -0.03em; margin-bottom: 4px; }
  .gh-metric-note { font-size: 0.78rem; color: var(--text-muted, #4A5578); line-height: 1.5; }
  .gh-security-row { display: flex; align-items: flex-start; gap: 10px; padding: 14px 16px; background: var(--bg-2, #111128); border-radius: 10px; border: 1px solid var(--border, rgba(91,181,224,0.06)); }
  .gh-security-icon { color: ${A}; flex-shrink: 0; margin-top: 2px; }
  .gh-security-text { font-size: 0.82rem; color: var(--text-secondary, #7C8DB0); line-height: 1.5; }
  .gh-security-text strong { display: block; color: var(--text-primary, #fff); font-weight: 600; margin-bottom: 2px; font-size: 0.85rem; }
  .gh-testimonial { background: var(--bg-2, #111128); border-radius: 12px; padding: 20px; border-left: 3px solid ${A}; }
  .gh-testimonial-text { font-size: 0.87rem; color: var(--text-secondary, #7C8DB0); line-height: 1.65; font-style: italic; margin-bottom: 14px; }
  .gh-testimonial-attr { display: flex; align-items: center; gap: 8px; }
  .gh-testimonial-line { width: 16px; height: 1.5px; background: ${A}; }
  .gh-testimonial-name { font-family: ${F.mono}; font-size: 0.62rem; color: ${A}; letter-spacing: 0.06em; text-transform: uppercase; }
`;

// ── Icons ──
const IconServer = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/>
    <line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);

const IconRocket = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const IconArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconCheck = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={A} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 6l3 3 5-5"/>
  </svg>
);

const IconCheckCircle = () => (
  <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconShield = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// ── Reveal utility ──
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// ── Form data types ──
interface HostedFormData {
  // Step 1
  appName: string;
  appType: string;
  currentHosting: string;
  monthlyTraffic: string;
  // Step 2
  frontend: string[];
  backend: string[];
  database: string[];
  customDomain: string;
  // Step 3
  name: string;
  email: string;
  company: string;
  plan: string;
  message: string;
}

const INITIAL: HostedFormData = {
  appName: '', appType: '', currentHosting: '', monthlyTraffic: '',
  frontend: [], backend: [], database: [], customDomain: '',
  name: '', email: '', company: '', plan: '', message: '',
};

// ── Checkbox pill ──
function CheckPill({ value, checked, label, onChange }: { value: string; checked: boolean; label: string; onChange: (v: string) => void }) {
  return (
    <label className={`gh-check-pill${checked ? ' checked' : ''}`} onClick={() => onChange(value)}>
      <input type="checkbox" readOnly checked={checked} />
      <div className="gh-check-box">
        {checked && <IconCheck size={9} />}
      </div>
      {label}
    </label>
  );
}

// ── Plan radio ──
function PlanRadio({ value, selected, label, price, desc, onChange }: {
  value: string; selected: string; label: string; price: string; desc: string; onChange: (v: string) => void;
}) {
  const isSelected = selected === value;
  return (
    <label className={`gh-plan-radio${isSelected ? ' selected' : ''}`} onClick={() => onChange(value)}>
      <input type="radio" readOnly checked={isSelected} />
      <div className="gh-radio-dot">
        {isSelected && (
          <svg width={7} height={7} viewBox="0 0 7 7" fill="#0C0C1D" aria-hidden="true"><circle cx="3.5" cy="3.5" r="3.5"/></svg>
        )}
      </div>
      <div>
        <div className="gh-plan-name">{label}</div>
        <div className="gh-plan-desc">{desc}</div>
      </div>
      <div className="gh-plan-price">{price}</div>
    </label>
  );
}

// ── Step 1: Your App ──
function Step1({ data, set }: { data: HostedFormData; set: (k: keyof HostedFormData, v: string) => void }) {
  return (
    <div>
      <h3 className="gh-step-title">Your App</h3>
      <p className="gh-step-sub">Tell us what you&rsquo;re running. Skip anything you&rsquo;re not sure about.</p>

      <div className="gh-field">
        <label className="gh-field-label" htmlFor="app-name">App name</label>
        <input
          id="app-name"
          className="gh-input"
          type="text"
          placeholder="e.g. Trakify, MyStore, InvoicePro"
          value={data.appName}
          onChange={(e) => set('appName', e.target.value)}
        />
      </div>

      <div className="gh-field">
        <label className="gh-field-label" htmlFor="app-type">App type</label>
        <select id="app-type" className="gh-input gh-select" value={data.appType} onChange={(e) => set('appType', e.target.value)}>
          <option value="">Select type...</option>
          <option value="web-app">Web App</option>
          <option value="api">API</option>
          <option value="full-stack">Full-Stack</option>
          <option value="static-site">Static Site</option>
          <option value="mobile-backend">Mobile Backend</option>
        </select>
      </div>

      <div className="gh-field">
        <label className="gh-field-label" htmlFor="current-hosting">Current hosting</label>
        <select id="current-hosting" className="gh-input gh-select" value={data.currentHosting} onChange={(e) => set('currentHosting', e.target.value)}>
          <option value="">Select current provider...</option>
          <option value="none">None / local only</option>
          <option value="aws">AWS</option>
          <option value="digitalocean">DigitalOcean</option>
          <option value="heroku">Heroku</option>
          <option value="vercel-netlify">Vercel / Netlify</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="gh-field">
        <label className="gh-field-label" htmlFor="traffic">Estimated monthly traffic</label>
        <select id="traffic" className="gh-input gh-select" value={data.monthlyTraffic} onChange={(e) => set('monthlyTraffic', e.target.value)}>
          <option value="">Select traffic range...</option>
          <option value="under-1k">Under 1,000 visits</option>
          <option value="1k-10k">1,000 – 10,000 visits</option>
          <option value="10k-100k">10,000 – 100,000 visits</option>
          <option value="100k-plus">100,000+ visits</option>
        </select>
      </div>
    </div>
  );
}

// ── Step 2: Your Stack ──
function Step2({ data, toggleArr }: { data: HostedFormData; toggleArr: (key: 'frontend' | 'backend' | 'database', v: string) => void; set: (k: keyof HostedFormData, v: string) => void }) {
  return (
    <div>
      <h3 className="gh-step-title">Your Stack</h3>
      <p className="gh-step-sub">Select everything that applies. Don&rsquo;t know? Skip it.</p>

      <div className="gh-field">
        <label className="gh-field-label">Frontend</label>
        <div className="gh-check-grid">
          {['Next.js', 'React', 'Vue', 'Angular', 'Static HTML', 'Other'].map((opt) => (
            <CheckPill key={opt} value={opt} checked={data.frontend.includes(opt)} label={opt} onChange={(v) => toggleArr('frontend', v)} />
          ))}
        </div>
      </div>

      <div className="gh-field">
        <label className="gh-field-label">Backend</label>
        <div className="gh-check-grid">
          {['Node.js', 'Python / FastAPI', 'Python / Django', 'Laravel', 'Rails', 'None'].map((opt) => (
            <CheckPill key={opt} value={opt} checked={data.backend.includes(opt)} label={opt} onChange={(v) => toggleArr('backend', v)} />
          ))}
        </div>
      </div>

      <div className="gh-field">
        <label className="gh-field-label">Database</label>
        <div className="gh-check-grid">
          {['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'None'].map((opt) => (
            <CheckPill key={opt} value={opt} checked={data.database.includes(opt)} label={opt} onChange={(v) => toggleArr('database', v)} />
          ))}
        </div>
      </div>

      <div className="gh-field">
        <label className="gh-field-label">Custom domain needed?</label>
        <div className="gh-toggle-row">
          {['Yes', 'No', 'Already configured'].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`gh-toggle-btn${data.customDomain === opt ? ' active' : ''}`}
              onClick={() => {
                // call parent set via a workaround — we receive set as prop
                const event = new CustomEvent('gh-set-domain', { detail: opt });
                document.dispatchEvent(event);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 2 wrapper with domain handler ──
function Step2Wrapper({ data, toggleArr, set }: { data: HostedFormData; toggleArr: (key: 'frontend' | 'backend' | 'database', v: string) => void; set: (k: keyof HostedFormData, v: string) => void }) {
  // Use a ref-based approach for the toggle
  const handleToggle = (opt: string) => set('customDomain', opt);

  return (
    <div>
      <h3 className="gh-step-title">Your Stack</h3>
      <p className="gh-step-sub">Select everything that applies. Don&rsquo;t know? Skip it.</p>

      <div className="gh-field">
        <label className="gh-field-label">Frontend</label>
        <div className="gh-check-grid">
          {['Next.js', 'React', 'Vue', 'Angular', 'Static HTML', 'Other'].map((opt) => (
            <CheckPill key={opt} value={opt} checked={data.frontend.includes(opt)} label={opt} onChange={(v) => toggleArr('frontend', v)} />
          ))}
        </div>
      </div>

      <div className="gh-field">
        <label className="gh-field-label">Backend</label>
        <div className="gh-check-grid">
          {['Node.js', 'Python / FastAPI', 'Python / Django', 'Laravel', 'Rails', 'None'].map((opt) => (
            <CheckPill key={opt} value={opt} checked={data.backend.includes(opt)} label={opt} onChange={(v) => toggleArr('backend', v)} />
          ))}
        </div>
      </div>

      <div className="gh-field">
        <label className="gh-field-label">Database</label>
        <div className="gh-check-grid">
          {['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'None'].map((opt) => (
            <CheckPill key={opt} value={opt} checked={data.database.includes(opt)} label={opt} onChange={(v) => toggleArr('database', v)} />
          ))}
        </div>
      </div>

      <div className="gh-field">
        <label className="gh-field-label">Custom domain needed?</label>
        <div className="gh-toggle-row">
          {['Yes', 'No', 'Already configured'].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`gh-toggle-btn${data.customDomain === opt ? ' active' : ''}`}
              onClick={() => handleToggle(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Contact ──
function Step3({ data, set }: { data: HostedFormData; set: (k: keyof HostedFormData, v: string) => void }) {
  return (
    <div>
      <h3 className="gh-step-title">Contact</h3>
      <p className="gh-step-sub">Almost there. We&rsquo;ll respond within 24 hours with a recommendation.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="gh-field">
          <label className="gh-field-label" htmlFor="name">Name *</label>
          <input id="name" className="gh-input" type="text" placeholder="Your name" value={data.name} onChange={(e) => set('name', e.target.value)} required />
        </div>
        <div className="gh-field">
          <label className="gh-field-label" htmlFor="email">Email *</label>
          <input id="email" className="gh-input" type="email" placeholder="you@example.com" value={data.email} onChange={(e) => set('email', e.target.value)} required />
        </div>
      </div>

      <div className="gh-field">
        <label className="gh-field-label" htmlFor="company">Company (optional)</label>
        <input id="company" className="gh-input" type="text" placeholder="Your company or product name" value={data.company} onChange={(e) => set('company', e.target.value)} />
      </div>

      <div className="gh-field">
        <label className="gh-field-label">Preferred plan</label>
        <div className="gh-plan-grid">
          <PlanRadio value="launch" selected={data.plan} label="Launch" price="$149/mo" desc="MVPs and first products" onChange={(v) => set('plan', v)} />
          <PlanRadio value="professional" selected={data.plan} label="Professional" price="$349/mo" desc="Growing products with real traffic" onChange={(v) => set('plan', v)} />
          <PlanRadio value="enterprise" selected={data.plan} label="Enterprise" price="$799/mo" desc="Mission-critical production systems" onChange={(v) => set('plan', v)} />
          <PlanRadio value="unsure" selected={data.plan} label="Not sure yet" price="Help me choose" desc="We&rsquo;ll recommend based on your app" onChange={(v) => set('plan', v)} />
        </div>
      </div>

      <div className="gh-field">
        <label className="gh-field-label" htmlFor="message">Anything else? (optional)</label>
        <textarea
          id="message"
          className="gh-input gh-textarea"
          placeholder="Special requirements, timeline, questions..."
          value={data.message}
          onChange={(e) => set('message', e.target.value)}
        />
      </div>
    </div>
  );
}

// ── Success State ──
function SuccessState() {
  return (
    <div className="gh-success">
      <motion.div
        className="gh-success-icon"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <IconCheckCircle />
      </motion.div>
      <motion.h3 className="gh-success-h" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
        Request received.
      </motion.h3>
      <motion.p className="gh-success-p" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
        We&rsquo;ll reach out within 24 hours with a provider recommendation and cost estimate.
      </motion.p>
      <motion.div className="gh-timeline" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.55 }}>
        {[
          { label: 'Review', text: 'A Cloud engineer reviews your app details and picks the right provider + plan' },
          { label: 'Setup', text: 'We provision servers, configure deployments, DNS, SSL, and monitoring — in 48 hours' },
          { label: 'Go Live', text: 'Your app is live on SocioFi Cloud. We monitor it 24/7 from day one.' },
        ].map((step, i) => (
          <div key={i} className="gh-timeline-step">
            <div className="gh-tl-num">{i + 1}</div>
            <div className="gh-tl-body">
              <div className="gh-tl-label">{step.label}</div>
              <div className="gh-tl-text">{step.text}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ── Main page ──
export default function GetHostedPage() {
  const [selectedPath, setSelectedPath] = useState<'existing' | 'new' | null>(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [data, setData] = useState<HostedFormData>(INITIAL);

  function set(key: keyof HostedFormData, val: string) {
    setData((prev) => ({ ...prev, [key]: val }));
  }

  function toggleArr(key: 'frontend' | 'backend' | 'database', val: string) {
    setData((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(val)
        ? (prev[key] as string[]).filter((v) => v !== val)
        : [...(prev[key] as string[]), val],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.name.trim() || !data.email.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/cloud/get-hosted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company || undefined,
          app_type: selectedPath || data.appType,
          app_name: data.appName,
          current_hosting: data.currentHosting,
          monthly_traffic: data.monthlyTraffic,
          frontend: data.frontend,
          backend: data.backend,
          database: data.database,
          custom_domain: data.customDomain,
          plan: data.plan,
          message: data.message || undefined,
          source_url: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  const STEP_LABELS = ['Your App', 'Your Stack', 'Contact'];

  return (
    <main className="gh-page">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <section className="gh-hero">
        <div className="gh-hero-orb" />
        <motion.div
          className="gh-hero-inner"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="gh-label">Get Hosted</div>
          <h1 className="gh-h1">Get Your App on SocioFi Cloud</h1>
          <p className="gh-sub">Tell us what you&rsquo;re running — we&rsquo;ll set it up in 48 hours.</p>
        </motion.div>
      </section>

      {/* ── PATH SELECTION ── */}
      <section className="gh-paths">
        <div className="gh-container">
          <Reveal>
            <div className="gh-paths-grid">
              {/* Card A: Existing app */}
              <div
                className={`gh-path-card${selectedPath === 'existing' ? ' selected' : ''}`}
                onClick={() => setSelectedPath('existing')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedPath('existing')}
                aria-pressed={selectedPath === 'existing'}
              >
                <div className="gh-path-icon"><IconServer /></div>
                <div className="gh-path-title">I have an existing app</div>
                <p className="gh-path-desc">Your product is already running or ready to deploy. We migrate or set up managed hosting for what you&rsquo;ve built.</p>
                <div className="gh-path-selected-badge">
                  <IconCheck size={11} />
                  <span style={{ fontFamily: F.mono, fontSize: '0.62rem', color: A, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Selected</span>
                </div>
              </div>

              {/* Card B: Starting from scratch */}
              <div
                className={`gh-path-card${selectedPath === 'new' ? ' selected' : ''}`}
                onClick={() => setSelectedPath('new')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedPath('new')}
                aria-pressed={selectedPath === 'new'}
              >
                <div className="gh-path-icon"><IconRocket /></div>
                <div className="gh-path-title">I&rsquo;m starting from scratch</div>
                <p className="gh-path-desc">You&rsquo;re building something new. We&rsquo;ll configure infrastructure from day one — cloud provider, deployment pipeline, the works.</p>
                <div className="gh-path-selected-badge">
                  <IconCheck size={11} />
                  <span style={{ fontFamily: F.mono, fontSize: '0.62rem', color: A, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Selected</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MAIN FORM + SIDEBAR ── */}
      <section className="gh-main">
        <div className="gh-container">
          <div className="gh-layout">
            {/* Form column */}
            <Reveal delay={0.05}>
              <div className="gh-form-wrap">
                {/* Step progress bar */}
                <div className="gh-steps-bar">
                  {STEP_LABELS.map((label, i) => {
                    const n = i + 1;
                    const status = submitted ? 'done' : n < step ? 'done' : n === step ? 'active' : 'pending';
                    return (
                      <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < STEP_LABELS.length ? 1 : 0 }}>
                        <div className="gh-step-item">
                          <div className={`gh-step-circle ${status}`}>
                            {status === 'done' ? (
                              <svg width={11} height={9} viewBox="0 0 11 9" fill="none" aria-hidden="true">
                                <path d="M1 4.5l3 3 6-7" stroke={A} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            ) : n}
                          </div>
                          <span className={`gh-step-lbl${status === 'active' ? ' active' : ''}`}>{label}</span>
                        </div>
                        {n < STEP_LABELS.length && (
                          <div className={`gh-step-connector${n < step || submitted ? ' done' : ''}`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Form content */}
                {submitted ? (
                  <SuccessState />
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <AnimatePresence mode="wait">
                        {step === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <Step1 data={data} set={set} />
                            <div className="gh-form-nav" style={{ justifyContent: 'flex-end' }}>
                              <button type="button" className="gh-btn-next" onClick={() => setStep(2)}>
                                Next — Your Stack <IconArrowRight />
                              </button>
                            </div>
                          </motion.div>
                        )}
                        {step === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <Step2Wrapper data={data} toggleArr={toggleArr} set={set} />
                            <div className="gh-form-nav">
                              <button type="button" className="gh-btn-back" onClick={() => setStep(1)}>
                                <IconArrowLeft /> Back
                              </button>
                              <button type="button" className="gh-btn-next" onClick={() => setStep(3)}>
                                Next — Contact <IconArrowRight />
                              </button>
                            </div>
                          </motion.div>
                        )}
                        {step === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <Step3 data={data} set={set} />
                            {submitError && (
                              <p style={{ color: '#F87171', fontSize: '0.85rem', marginBottom: 12, lineHeight: 1.5 }}>
                                {submitError}
                              </p>
                            )}
                            <div className="gh-form-nav">
                              <button type="button" className="gh-btn-back" onClick={() => setStep(2)} disabled={submitting}>
                                <IconArrowLeft /> Back
                              </button>
                              <button type="submit" className="gh-btn-submit" disabled={submitting}>
                                {submitting ? 'Sending...' : 'Request Hosting Setup'}
                                {!submitting && (
                                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
                                  </svg>
                                )}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Sidebar */}
            <motion.aside
              className="gh-sidebar"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* What we do for you */}
              <div className="gh-sidebar-card">
                <div className="gh-sidebar-title">What we do for you</div>
                <div className="gh-do-list">
                  {[
                    'Pick the right cloud provider based on your app and budget',
                    'Configure servers, databases, SSL, DNS, and CDN end-to-end',
                    'Set up your deployment pipeline — push code, it ships automatically',
                    'Monitor infrastructure 24/7 and respond to incidents as they happen',
                  ].map((item, i) => (
                    <div key={i} className="gh-do-item">
                      <div className="gh-do-check"><IconCheck /></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Average setup time metric */}
              <div className="gh-sidebar-card">
                <div className="gh-metric-box">
                  <div className="gh-metric-label">Average setup time</div>
                  <div className="gh-metric-value">48 hrs</div>
                  <div className="gh-metric-note">From approved estimate to live on SocioFi Cloud. Most setups are complete sooner.</div>
                </div>
              </div>

              {/* Security badge */}
              <div className="gh-sidebar-card">
                <div className="gh-security-row">
                  <div className="gh-security-icon"><IconShield /></div>
                  <div className="gh-security-text">
                    <strong>Secured from day one</strong>
                    Firewall rules, DDoS protection, SSH hardening, and automatic SSL provisioning are included on every plan.
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="gh-sidebar-card" style={{ padding: 0 }}>
                <div className="gh-testimonial">
                  <p className="gh-testimonial-text">
                    &ldquo;I was spending $400 a month on AWS for something that needed $50 worth of server. Cloud moved me to DigitalOcean, set everything up in two days, and my total bill — including their management fee — is now $197/month. It actually runs better too.&rdquo;
                  </p>
                  <div className="gh-testimonial-attr">
                    <div className="gh-testimonial-line" />
                    <span className="gh-testimonial-name">Founder, Logistics SaaS</span>
                  </div>
                </div>
              </div>

              {/* Compare plans link */}
              <div style={{ textAlign: 'center', paddingBottom: 8 }}>
                <Link
                  href="/cloud/plans"
                  style={{ fontFamily: F.mono, fontSize: '0.72rem', color: A, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: 0.85 }}
                >
                  Compare plans in detail <IconArrowRight size={13} />
                </Link>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </main>
  );
}
